import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ example: 1, description: 'ID của công việc' })
  @IsNumber()
  @IsNotEmpty()
  jobId: number;
}

