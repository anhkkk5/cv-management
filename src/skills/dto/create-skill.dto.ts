import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'JavaScript' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Intermediate', required: false })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty({ example: 'Làm việc với React, Node.js', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2022-01-01', required: false })
  @IsOptional()
  @IsDateString()
  started_at?: string;

  @ApiProperty({ example: '2024-01-01', required: false })
  @IsOptional()
  @IsDateString()
  end_at?: string;
}