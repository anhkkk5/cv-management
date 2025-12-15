import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAwardDto {
  @ApiProperty({ example: 'Giải nhất cuộc thi lập trình' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Đại học XYZ', required: false })
  @IsOptional()
  @IsString()
  organization?: string;

  @ApiProperty({ example: '2024-01-01', required: false })
  @IsOptional()
  @IsDateString()
  started_at?: string;

  @ApiProperty({ example: '2024-06-01', required: false })
  @IsOptional()
  @IsDateString()
  end_at?: string;

  @ApiProperty({ example: 'Mô tả chi tiết về thành tích', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
