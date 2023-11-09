import { IsString, IsNotEmpty } from 'class-validator';

export class CommentDTO {
  @IsString()
  @IsNotEmpty()
  body: string;
}
