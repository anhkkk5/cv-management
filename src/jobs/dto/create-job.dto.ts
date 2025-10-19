import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ example: 'Kỹ sư Backend Cấp cao' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Chúng tôi đang tìm kiếm một kỹ sư tài năng...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Công ty Cổ phần Sáng tạo Công nghệ' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({ example: 'Node.js, TypeScript, PostgreSQL' })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiProperty({ example: 'Thành phố Hồ Chí Minh, Việt Nam' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: '15-25 triệu VND', required: false })
  @IsOptional()
  @IsString()
  salary?: string;

  @ApiProperty({
    example: ['Kinh nghiệm với Docker', 'Kiến thức về AWS'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Đảm bảo mọi phần tử trong mảng là string
  desirable?: string[];

  @ApiProperty({
    example: ['Lương cạnh tranh', 'Bảo hiểm sức khỏe'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Đảm bảo mọi phần tử trong mảng là string
  benefits?: string[];

  @ApiProperty({ example: 'LOC001', required: false })
  @IsOptional()
  @IsString()
  location_id?: string;

  @ApiProperty({ example: 'FULL-TIME', required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ example: 'Junior', required: false })
  @IsOptional()
  @IsString()
  jobLevel?: string;

  @ApiProperty({ example: '2-3 năm', required: false })
  @IsOptional()
  @IsString()
  experience?: string;

  @ApiProperty({ example: 'Đại học', required: false })
  @IsOptional()
  @IsString()
  education?: string;

  @ApiProperty({ example: '2025-11-30', required: false })
  @IsOptional()
  @IsDateString()
  expire_at?: Date;
}