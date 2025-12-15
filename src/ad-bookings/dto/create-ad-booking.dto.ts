import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateAdBookingDto {
  @ApiProperty({ example: 1, description: 'ID của slot quảng cáo' })
  @IsInt()
  @Min(1)
  slotId: number;

  @ApiProperty({ example: 'Quảng cáo khóa học lập trình' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Mô tả ngắn về nội dung quảng cáo', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: 'https://example.com/landing-page', required: false })
  @IsOptional()
  @IsUrl()
  targetUrl?: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/.../banner.png', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 1, description: 'Số tháng thuê' })
  @IsInt()
  @Min(1)
  months: number;
}
