import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ example: 'Hà Nội' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Hà Nội', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Việt Nam', required: false })
  @IsOptional()
  @IsString()
  country?: string;
}