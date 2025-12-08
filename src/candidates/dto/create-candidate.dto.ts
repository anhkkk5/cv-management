import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString, IsPhoneNumber, IsIn } from 'class-validator';

export class CreateCandidateDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  isOpen?: number;

  @ApiProperty({ example: '1995-05-15' })
  @IsOptional()
  @IsDateString()
  dob?: Date;

  @ApiProperty({ example: 'Hà Nội, Việt Nam' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'nguyenvana@gmail.com' })
  @IsOptional()
  @IsString()
  email?: string;

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

  @ApiProperty({ example: 'Tôi là một lập trình viên với 5 năm kinh nghiệm...' })
  @IsOptional()
  @IsString()
  introduction?: string;

  @ApiProperty({ example: 'active', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}