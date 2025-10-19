import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional, IsUrl } from 'class-validator';

export class CreateCertificateDto {
  @ApiProperty({ example: 'AWS Certified Solutions Architect - Associate' })
  @IsString() @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Amazon Web Services' })
  @IsString() @IsNotEmpty()
  issuer: string;

  @ApiProperty({ example: '2024-10-20' })
  @IsOptional() @IsDateString()
  issueDate?: Date;

  @ApiProperty({ example: 'ABC-123-XYZ', required: false })
  @IsOptional() @IsString()
  credentialID?: string;

  @ApiProperty({ example: 'https://aws.amazon.com/verification', required: false })
  @IsOptional() @IsUrl()
  credentialURL?: string;
}