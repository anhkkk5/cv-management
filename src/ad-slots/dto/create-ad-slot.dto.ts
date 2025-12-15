import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateAdSlotDto {
  @ApiProperty({ example: 'Banner trang công ty' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1000000, description: 'Giá cơ bản / tháng (VND)' })
  @IsInt()
  @Min(0)
  basePricePerMonth: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
