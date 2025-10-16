import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'My Project', description: 'The name of the project' })
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @ApiProperty({ example: 'A brief description of my project', description: 'The project description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'https://my-project.com', description: 'The project URL', required: false })
  @IsOptional()
  @IsUrl()
  projectUrl?: string;
}