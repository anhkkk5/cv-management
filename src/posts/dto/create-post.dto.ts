import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { PostStatus } from 'src/shared/schemas/post.entity';

export class CreatePostDto {
  @ApiProperty({ example: 'Bí kíp tìm việc' })
  @IsString()
  @IsNotEmpty()
  title: string;

  // Slug thường sẽ được tạo tự động từ title ở Backend, nhưng cho phép nhập nếu muốn custom
  @ApiProperty({ example: 'bi-kip-tim-viec', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: 'https://cloudinary.../image.jpg', required: false })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({ example: 'Tóm tắt nội dung bài viết...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '<h1>Nội dung bài viết...</h1>' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 1, description: 'ID danh mục' })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({ enum: PostStatus, default: PostStatus.DRAFT })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;
}