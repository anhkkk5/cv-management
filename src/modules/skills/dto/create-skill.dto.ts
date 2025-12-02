import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'JavaScript' })
  @IsString() @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Advanced', required: false })
  @IsOptional() @IsString()
  level?: string;
}