// src/jobs/dto/create-job.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsDateString, 
  IsArray, 
  IsNumber, 
  IsEnum 
} from 'class-validator';
import { JobCategory } from '../../common/enums/job-category.enum'; // Đảm bảo đường dẫn import đúng

export class CreateJobDto {
  @ApiProperty({ example: 'Kỹ sư Backend Cấp cao' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Chúng tôi đang tìm kiếm một kỹ sư tài năng...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  // --- THAY ĐỔI: Dùng ID số thay vì chuỗi ---
  @ApiProperty({ example: 1, description: 'ID của Công ty', required: false })
  @IsOptional()
  @IsNumber()
  companyId?: number;

  @ApiProperty({ example: 1, description: 'ID của Địa điểm (Location)', required: false })
  @IsOptional()
  @IsNumber()
  locationId?: number;
  // -----------------------------------------

  @ApiProperty({ example: ['Node.js', 'TypeScript', 'PostgreSQL'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

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
  @IsString({ each: true })
  desirable?: string[];

  @ApiProperty({
    example: ['Lương cạnh tranh', 'Bảo hiểm sức khỏe'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

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

  @ApiProperty({ 
    enum: JobCategory, 
    example: JobCategory.IT, 
    description: 'Ngành nghề/Vị trí',
    required: false 
  })
  @IsOptional()
  @IsEnum(JobCategory)
  jobCategory?: JobCategory;

  @ApiProperty({ example: '2025-11-30', required: false })
  @IsOptional()
  @IsDateString()
  expire_at?: Date;

  @ApiProperty({ example: 'OPEN', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}