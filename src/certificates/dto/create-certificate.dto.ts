import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsUrl } from 'class-validator';

export class CreateCertificateDto {
  @ApiProperty({ example: 'AWS Certified Solutions Architect - Associate' })
  @IsString() @IsNotEmpty()
  certificate_name: string;

  @ApiProperty({ example: 'Amazon Web Services' })
  @IsString() @IsNotEmpty()
  organization: string;

  @ApiProperty({ example: '2024-10-20' })
  @IsOptional() @IsDateString()
  started_at?: Date;

  @ApiProperty({ example: '2024-12-31' })
  @IsOptional() @IsDateString()
  end_at?: Date;

  @ApiProperty({ example: 'This certification validates expertise in designing distributed systems on AWS.' })
  @IsString() @IsNotEmpty()
  description: string;

}