import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { Match } from '../decorators/match.decorator';

export class RegisterAuthDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'The password of the user (minimum 6 characters)' })
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ example: 'strongPassword123', description: 'The confirmation password of the user' })
  @IsNotEmpty()
  @Match('password', { message: 'Mật khẩu không khớp' })
  confirmPassword: string;

  @ApiProperty({ example: Role.Candidate, description: 'The role of the user', enum: Role, default: Role.Candidate })
  @IsEnum(Role)
  role: Role = Role.Candidate;
}