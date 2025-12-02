import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostCategoryDto {
  @ApiProperty({ 
    example: 'Bí kíp tìm việc', 
    description: 'Tên hiển thị của đề mục' 
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}