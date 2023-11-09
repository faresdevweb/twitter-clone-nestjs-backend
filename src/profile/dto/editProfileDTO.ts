import { IsString } from 'class-validator';

export class editeProfileDTO {
    @IsString()
    username?: string;
    @IsString()
    bio?: string;
    profileImage?: Express.Multer.File;
    coverImage?: Express.Multer.File;
}