// src/education/dto/create-education.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({ example: 'Đại học CMC' })
  @IsString()
  @IsNotEmpty()
  schoolName: string;

  @ApiProperty({ example: 'Công nghệ Thông tin' })
  @IsString()
  @IsNotEmpty()
  major: string;

  @ApiProperty({ example: '2018-09-01' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ example: '2022-06-30' })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({ example: 'GPA: 3.5/4.0' })
  @IsOptional()
  @IsString()
  info?: string;
}