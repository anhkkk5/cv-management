import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Min, IsIn } from 'class-validator';

export enum SalaryType {
  GROSS = 'GROSS',
  NET = 'NET',
}

export class CalculateSalaryDto {
  @ApiProperty({ example: 20000000, description: 'Mức lương nhập vào (VND)' })
  @IsNumber()
  @Min(0)
  income: number;

  @ApiProperty({ enum: SalaryType, example: SalaryType.GROSS })
  @IsEnum(SalaryType)
  type: SalaryType;

  @ApiProperty({ example: 0, description: 'Số người phụ thuộc' })
  @IsNumber()
  @Min(0)
  dependents: number;

  @ApiProperty({ example: 1, description: 'Vùng làm việc (1, 2, 3, 4)' })
  @IsIn([1, 2, 3, 4])
  region: number;

  @ApiProperty({ 
    example: 20000000, 
    required: false, 
    description: 'Mức lương đóng bảo hiểm (Nếu khác lương chính thức). Để trống sẽ lấy lương chính thức.',
  })
  @IsOptional()
  @IsNumber()
  insuranceSalary?: number;
}