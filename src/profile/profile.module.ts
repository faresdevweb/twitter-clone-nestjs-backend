import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  providers: [ProfileService, CloudinaryService],
  controllers: [ProfileController],
})
export class ProfileModule {}
