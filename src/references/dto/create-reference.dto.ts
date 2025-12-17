import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateReferenceDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: 'Senior Developer', required: false })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({ example: 'FPT Software', required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ example: 'nguyenvana@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '0123456789', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Mô tả về người giới thiệu', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}


