import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsUrl,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Bí kíp tìm việc làm hiệu quả' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'bi-kip-tim-viec-lam-hieu-qua' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    example: 'Tóm tắt những bí quyết giúp bạn tìm được công việc mơ ước...',
    required: false,
  })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({
    example: '<h1>Nội dung bài viết...</h1><p>Chi tiết...</p>',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/.../image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({ example: 'Bí kíp tìm việc' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'Admin', required: false })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({ example: '2025-01-15', required: false })
  @IsOptional()
  @IsDateString()
  published_at?: Date;

  @ApiProperty({ example: 'draft', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}

