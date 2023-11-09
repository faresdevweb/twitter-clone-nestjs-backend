import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthDTO } from './dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {

  private defaultCoverImage = "https://res.cloudinary.com/dxd7imgvp/image/upload/v1699277094/nzyjcjid0adygiwtiywo.png";
  private defaultProfileImage = "https://res.cloudinary.com/dxd7imgvp/image/upload/v1699277053/pxtsnvhflvgltehh9ryp.png"

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // register method
  async signup(dto: AuthDTO) {
    // generate password hashed
    const hash = await argon.hash(dto.password);
    try {
      // save user in database
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hashedPassword: hash,
          username: dto.username,
          profileImage: this.defaultProfileImage,
          coverImage: this.defaultCoverImage,
        },
      });
      // return token JWT
      return this.signToken(user.id, user.email, user.username);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException('Email or Username already exists', HttpStatus.CONFLICT);
        }
      }
      throw new Error(error);
    }
  }

  // login method
  async signin(dto: AuthDTO) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user does not exist throw exception error
    if (!user) throw new ForbiddenException('Invalid Credentials');

    // compare the password
    const passwordMatches = await argon.verify(
      user.hashedPassword,
      dto.password,
    );

    // if password incorrect throw exception error
    if (!passwordMatches) throw new ForbiddenException('Invalid Credentials');

    // then return token JWT
    return this.signToken(user.id, user.email, user.username);
  }

  async signToken(
    userId: string,
    email: string,
    username: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email: email,
      username: username,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      secret: secret,
      expiresIn: '1d',
    });

    return { access_token: token };
  }
}
