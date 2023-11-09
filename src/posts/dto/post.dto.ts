import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDTO {
  @IsString()
  @IsNotEmpty()
  body: string;
}
