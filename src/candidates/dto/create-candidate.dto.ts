import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString, IsPhoneNumber, IsIn } from 'class-validator';

export class CreateCandidateDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;

  @ApiProperty({ example: '1995-05-15' })
  @IsOptional()
  @IsDateString()
  dob?: Date;

  @ApiProperty({ example: 'Hà Nội, Việt Nam' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '0123456789' })
  @IsOptional()
  // @IsPhoneNumber('VN') // Bỏ comment nếu bạn đã cài đặt libphonenumber-js
  @IsString()
  phone?: string;

  @ApiProperty({ example: 1, description: '1: Nam, 0: Nữ, 2: Khác' })
  @IsOptional()
  @IsIn([0, 1, 2])
  gender?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  link_fb?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  link_linkedin?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  link_git?: string;
}