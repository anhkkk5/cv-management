import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Project', description: 'The name of the project' })
  @IsString()
  @IsNotEmpty()
  project_name: string;

  @ApiProperty({ example: 'A brief description of my project', description: 'The project description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'https://my-project.com', description: 'The project URL', required: false })
  @IsOptional()
  @IsUrl()
  demo_link?: string;

  @ApiProperty({ example: '2022-01-01', description: 'The project start date', required: false })
  @IsOptional()
  @IsDateString()
  started_at?: Date;

  @ApiProperty({ example: '2022-12-31', description: 'The project end date', required: false })
  @IsOptional()
  @IsDateString()
  ended_at?: Date;
}