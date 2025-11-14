import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Google LLC' })
  @IsString() @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'Google Inc.' })
  @IsString() @IsNotEmpty()
  companyName: string;

  @ApiProperty({ example: 'company@example.com' })
  @IsString() @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Một công ty công nghệ đa quốc gia.' })
  @IsOptional() @IsString()
  description?: string;

  @ApiProperty({ example: '1600 Amphitheatre Parkway, Mountain View, CA' })
  @IsOptional() @IsString()
  address?: string;

  @ApiProperty({ example: 'https://google.com' })
  @IsOptional() @IsUrl()
  website?: string;

  @ApiProperty({ example: 'https://logo.url/google.png' })
  @IsOptional() @IsUrl()
  logo?: string;

  @ApiProperty({ example: 'active', required: false })
  @IsOptional() @IsString()
  status?: string;
}