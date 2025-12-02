import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCompanyAddressDto {
  @ApiProperty({ example: 'Tòa nhà Keangnam, Tầng 71, Phạm Hùng' })
  @IsString()
  @IsNotEmpty()
  addressLine: string;

  @ApiProperty({ example: 1, description: 'ID của Location (thành phố)' })
  @IsNumber()
  @IsNotEmpty()
  locationId: number;

  @ApiProperty({ example: 1, description: 'ID của Công ty (chỉ Admin mới cần)' })
  @IsNumber()
  @IsOptional()
  companyId?: number;
}