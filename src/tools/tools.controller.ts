import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { CalculateCompoundInterestDto } from './dto/calculate-compound-interest.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { CalculateSalaryDto } from './dto/calculate-salary.dto';

@ApiTags('Tools (Calculators)')
@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Public()
  @Post('compound-interest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tính lãi suất kép' })
  calculate(@Body() dto: CalculateCompoundInterestDto) {
    return this.toolsService.calculateCompoundInterest(dto);
  }

  @Public()
  @Post('salary-gross-net')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tính lương Gross - Net (Chuẩn 2025)' })
  calculateSalary(@Body() dto: CalculateSalaryDto) {
    return this.toolsService.calculateSalary(dto);
  }
}