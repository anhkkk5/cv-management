import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional } from 'class-validator';

export class CalculateCompoundInterestDto {
  @ApiProperty({ example: 100000000, description: 'Số tiền gốc ban đầu (VND)' })
  @IsNumber()
  @Min(0)
  principal: number;

  @ApiProperty({ example: 7, description: 'Lãi suất hàng năm (%/năm)' })
  @IsNumber()
  @Min(0)
  rate: number;

  @ApiProperty({ example: 10, description: 'Số năm gửi' })
  @IsNumber()
  @Min(1)
  years: number;

  @ApiProperty({ example: 5000000, description: 'Số tiền gửi thêm hàng tháng (VND)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyContribution?: number;

  @ApiProperty({ example: 12, description: 'Số lần ghép lãi mỗi năm (mặc định 12 - hàng tháng)', required: false })
  @IsOptional()
  @IsNumber()
  frequency?: number; // 12 => Ghép lãi Hàng tháng (Monthly).
}