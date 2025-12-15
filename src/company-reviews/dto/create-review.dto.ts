import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 1, description: 'ID của công ty' })
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  @ApiProperty({ example: 4.5, description: 'Đánh giá tổng thể (1-5)' })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  overallRating: number;

  @ApiProperty({ example: 4.0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  workLifeBalance?: number;

  @ApiProperty({ example: 4.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  salaryBenefits?: number;

  @ApiProperty({ example: 4.0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  jobStability?: number;

  @ApiProperty({ example: 4.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  management?: number;

  @ApiProperty({ example: 4.0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  culture?: number;

  @ApiProperty({ example: 'PHP Developer', required: false })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiProperty({ example: 'Hồ Chí Minh', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'current', enum: ['current', 'former'] })
  @IsString()
  @IsNotEmpty()
  employmentStatus: string;

  @ApiProperty({ example: 'Full-time', required: false })
  @IsOptional()
  @IsString()
  contractType?: string;

  @ApiProperty({ example: 'Công việc khá là nhàn...', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Ưu điểm của công ty...', required: false })
  @IsOptional()
  @IsString()
  pros?: string;

  @ApiProperty({ example: 'Nhược điểm...', required: false })
  @IsOptional()
  @IsString()
  cons?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  recommendToFriends?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  ceoRating?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  businessOutlook?: boolean;
}



