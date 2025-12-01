import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsArray, IsObject } from 'class-validator';

export class CreateCvTemplateDto {
  @ApiProperty({ example: 'Mẫu CV Chuyên nghiệp 01' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://cloudinary.../template1.jpg' })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({
    example: { primary: '#005f69', text: '#333333' },
    description: 'Cấu hình màu sắc mặc định',
  })
  @IsOptional()
  @IsObject()
  colorConfig?: any;

  @ApiProperty({
    description: 'Cấu trúc các khối (Block) của CV',
    example: [
      {
        blockId: 'personal_info',
        title: 'Thông tin cá nhân',
        type: 'profile',
        column: 1,
        order: 1,
        fields: [
          { name: 'fullName', label: 'Họ và tên', type: 'text' },
          { name: 'jobTitle', label: 'Vị trí ứng tuyển', type: 'text' }
        ]
      }
    ]
  })
  @IsArray()
  @IsNotEmpty()
  layoutConfig: any[]; // Chứa mảng các Block

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}