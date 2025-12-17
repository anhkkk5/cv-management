import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHobbyDto {
  @ApiProperty({ example: 'Đọc sách' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Thích đọc sách về công nghệ và lịch sử',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}


