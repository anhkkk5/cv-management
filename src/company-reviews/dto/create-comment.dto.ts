import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Bình luận của tôi về review này...' })
  @IsString()
  @IsNotEmpty()
  content: string;
}



