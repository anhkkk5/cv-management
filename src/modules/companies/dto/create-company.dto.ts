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

  @ApiProperty({ example: 'https://facebook.com/your-company', required: false })
  @IsOptional() @IsUrl()
  facebook?: string;

  @ApiProperty({ example: 'https://linkedin.com/company/your-company', required: false })
  @IsOptional() @IsUrl()
  linkedin?: string;

  @ApiProperty({ example: 'https://github.com/your-company', required: false })
  @IsOptional() @IsUrl()
  github?: string;

  @ApiProperty({ example: 'active', required: false })
  @IsOptional() @IsString()
  status?: string;

  @ApiProperty({ example: 'Great culture, flexible working hours, ...', required: false })
  @IsOptional() @IsString()
  policies?: string;
}