import { Body, Controller, Put, Req, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { editeProfileDTO } from './dto';
import { JwtGuard } from 'src/auth/guard';

type ProfileFiles = { profileImage?: Express.Multer.File[], coverImage?: Express.Multer.File[] };

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtGuard)
  @Put('/editProfile')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]))
  async editProfile(
    @Body() editeProfileDTO: editeProfileDTO, 
    @Req() req: any,
    @UploadedFiles() files: ProfileFiles,
  ) {
    // Pass `files` to the service
    return this.profileService.editProfile(editeProfileDTO, files, req.user.id);
  }
}
