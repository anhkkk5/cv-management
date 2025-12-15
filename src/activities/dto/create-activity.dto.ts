import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateActivityDto {
  @ApiProperty({ example: 'Câu lạc bộ tình nguyện' })
  @IsString()
  @IsNotEmpty()
  organization: string;

  @ApiProperty({ example: 'Thành viên' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  started_at: string;

  @ApiProperty({ example: '2024-06-01', required: false })
  @IsOptional()
  @IsDateString()
  end_at?: string;

  @ApiProperty({ example: 'Tham gia tổ chức các hoạt động thiện nguyện', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
