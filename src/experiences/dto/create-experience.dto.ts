import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExperienceDto {

  @ApiProperty({ example: 'Software Engineer', description: 'The title of the job' })
  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @ApiProperty({ example: 'Google Inc.', description: 'The company name' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({ example: '2020-01-01', description: 'The start date of the job' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ example: '2022-01-01', description: 'The end date of the job', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({ example: 'Worked on various projects...', description: 'The job description' })
  @IsString()
  @IsNotEmpty()
  description: string;
}