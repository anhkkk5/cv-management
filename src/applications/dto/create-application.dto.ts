import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ example: 1, description: 'ID của công việc' })
  @IsNumberString()
  @IsNotEmpty()
  jobId: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/.../cv-preview.png',
    description: 'URL ảnh preview CV (tùy chọn, để hiển thị trong modal)',
    required: false,
  })
  @IsOptional()
  @IsString()
  cvPreviewImageUrl?: string;
}

