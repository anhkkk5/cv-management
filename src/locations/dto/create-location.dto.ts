import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ example: 'Hà Nội' })
  @IsString()
  @IsNotEmpty()
  name: string;
}