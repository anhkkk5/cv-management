// src/jobs/dto/filter-job.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JobCategory } from 'src/common/enums/job-category.enum';

export class FilterJobDto {
  @ApiProperty({
    required: false,
    description: 'Tìm kiếm theo tên công việc (VD: Backend)',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo địa điểm (VD: Hà Nội)',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    required: false,
    enum: JobCategory,
    description: 'Lọc theo ngành nghề',
  })
  @IsOptional()
  @IsEnum(JobCategory)
  category?: JobCategory;
}