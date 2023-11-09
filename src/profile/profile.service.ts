
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { editeProfileDTO } from './dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // Assurez-vous que le chemin est correct

type ProfileFiles = {
    profileImage?: Express.Multer.File[];
    coverImage?: Express.Multer.File[];
  };

@Injectable()
export class ProfileService {
    constructor(
        private prisma: PrismaService,
        private cloudinaryService: CloudinaryService // Injectez le service Cloudinary
    ){}

    async editProfile(editProfileDTO: editeProfileDTO, files: ProfileFiles, userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        })
        if(!user) throw new NotFoundException('User not found');
        let profileImageUrl: string;
        let coverImageUrl: string;
      
        if (files.profileImage && files.profileImage[0]) {
          profileImageUrl = await this.cloudinaryService.uploadImage(files.profileImage[0].buffer);
        }
      
        if (files.coverImage && files.coverImage[0]) {
          coverImageUrl = await this.cloudinaryService.uploadImage(files.coverImage[0].buffer);
        }
      
        // Ici vous feriez la logique pour mettre à jour l'utilisateur avec les nouvelles URLs et autres champs
        // Par exemple :
        const updatedProfile = {
            username: editProfileDTO.username || user.username,
            bio: editProfileDTO.bio || user.bio,
            profileImage: profileImageUrl || user.profileImage, // Utilisez l'ancienne image si aucune nouvelle n'est fournie
            coverImage: coverImageUrl || user.coverImage, // De même pour l'image de couverture
        };
      
        // Mettre à jour l'utilisateur dans la base de données avec updatedProfile
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: updatedProfile,
        })
      
        return updatedUser;
      }
}
