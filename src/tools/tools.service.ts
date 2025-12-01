// src/tools/tools.service.ts

import { Injectable } from '@nestjs/common';
import { CalculateCompoundInterestDto } from './dto/calculate-compound-interest.dto';
import { CalculateSalaryDto, SalaryType } from './dto/calculate-salary.dto';
import { SALARY_CONSTANTS } from './constants/salary.constant';

@Injectable()
export class ToolsService {
  
  calculateCompoundInterest(dto: CalculateCompoundInterestDto) {
    const { principal, rate, years, monthlyContribution = 0, frequency = 12 } = dto;
    const annualRate = rate / 100;
    const totalPeriods = years * frequency;
    const periodRate = annualRate / frequency;
    
    let currentBalance = principal;
    let totalContributed = principal;
        const yearlyBreakdown: { year: number; balance: number; principal: number; interest: number }[] = []; 

    for (let i = 1; i <= totalPeriods; i++) {
      const interest = currentBalance * periodRate;
      currentBalance += interest;
      currentBalance += monthlyContribution;
      totalContributed += monthlyContribution;

      if (i % frequency === 0) {
        const year = i / frequency;
        yearlyBreakdown.push({
          year: year,
          balance: Math.round(currentBalance),
          principal: totalContributed,
          interest: Math.round(currentBalance - totalContributed),
        });
      }
    }

    return {
      input: dto,
      result: {
        totalPrincipal: totalContributed,
        totalInterest: Math.round(currentBalance - totalContributed),
        totalAmount: Math.round(currentBalance),
      },
      chartData: yearlyBreakdown,
    };
  }

  calculateSalary(dto: CalculateSalaryDto) {
    const { income, type, dependents, region, insuranceSalary } = dto;
    
    // Nếu lương đóng BH không nhập, mặc định lấy lương chính thức
    // (Logic Gross/Net sẽ xử lý việc có dùng nó hay không)
    
    if (type === SalaryType.GROSS) {
      return this.calcGrossToNet(income, dependents, region, insuranceSalary);
    } else {
      return this.calcNetToGross(income, dependents, region, insuranceSalary);
    }
  }

  // === 1. TÍNH GROSS -> NET ===
  private calcGrossToNet(gross: number, dependents: number, region: number, customInsSalary?: number) {
    // 1. Tính Lương đóng Bảo hiểm
    const insSalaryBase = customInsSalary || gross;
    
    // Trần BHXH, BHYT (20 lần lương cơ sở)
    const maxSocialHealth = SALARY_CONSTANTS.BASE_SALARY * 20;
    // Trần BHTN (20 lần lương tối thiểu vùng)
    const maxUnemployment = SALARY_CONSTANTS.REGION_MIN_WAGE[region] * 20;

    const socialBase = Math.min(insSalaryBase, maxSocialHealth);
    const unemploymentBase = Math.min(insSalaryBase, maxUnemployment);

    const bhxh = socialBase * SALARY_CONSTANTS.INSURANCE_RATES.SOCIAL;
    const bhyt = socialBase * SALARY_CONSTANTS.INSURANCE_RATES.HEALTH;
    const bhtn = unemploymentBase * SALARY_CONSTANTS.INSURANCE_RATES.UNEMPLOYMENT;
    const totalInsurance = bhxh + bhyt + bhtn;

    // 2. Tính Thu nhập chịu thuế (TNTT)
    const incomeBeforeTax = gross - totalInsurance;

    // 3. Tính Thu nhập tính thuế (Taxable Income)
    const totalDeduction = SALARY_CONSTANTS.DEDUCTION.SELF + (dependents * SALARY_CONSTANTS.DEDUCTION.DEPENDENT);
    const taxableIncome = incomeBeforeTax - totalDeduction;

    // 4. Tính thuế TNCN
    const tax = this.calculatePersonalIncomeTax(taxableIncome);

    // 5. Tính Net
    const net = gross - totalInsurance - tax;

    return {
      gross,
      net,
      insurance: { bhxh, bhyt, bhtn, total: totalInsurance },
      tax: { taxableIncome: taxableIncome > 0 ? taxableIncome : 0, tax },
      deduction: { total: totalDeduction, dependents },
    };
  }

  // === 2. TÍNH NET -> GROSS ===
  private calcNetToGross(net: number, dependents: number, region: number, customInsSalary?: number) {
    // SỬA LỖI 1: Truyền undefined thay vì null
    if (customInsSalary) {
       return this.findGrossFromNetIterative(net, dependents, region, customInsSalary);
    } else {
       return this.findGrossFromNetIterative(net, dependents, region, undefined);
    }
  }

  // Hàm tìm Gross từ Net bằng Binary Search
  private findGrossFromNetIterative(targetNet: number, dependents: number, region: number, customInsSalary?: number) {
    let low = targetNet;
    let high = targetNet * 2; // Giả định Gross không quá 2 lần Net (an toàn)
    
    // SỬA LỖI 2 & 3: Khởi tạo result bằng giá trị ban đầu thay vì null
    // Điều này giúp TypeScript hiểu result luôn có kiểu dữ liệu khớp với hàm calcGrossToNet
    let result = this.calcGrossToNet(low, dependents, region, customInsSalary);

    // Lặp tối đa 50 lần (Độ chính xác cực cao)
    for (let i = 0; i < 50; i++) {
        const gross = (low + high) / 2;
        result = this.calcGrossToNet(gross, dependents, region, customInsSalary);
        
        const diff = result.net - targetNet;
        
        // Nếu sai số nhỏ hơn 1 đồng thì dừng
        if (Math.abs(diff) < 1) {
            break;
        }
        
        if (diff > 0) {
            high = gross;
        } else {
            low = gross;
        }
    }
    return result;
  }

  // Bảng thuế lũy tiến từng phần
  private calculatePersonalIncomeTax(taxableIncome: number): number {
    if (taxableIncome <= 0) return 0;
    
    if (taxableIncome <= 5000000) return taxableIncome * 0.05;
    if (taxableIncome <= 10000000) return (taxableIncome * 0.1) - 250000;
    if (taxableIncome <= 18000000) return (taxableIncome * 0.15) - 750000;
    if (taxableIncome <= 32000000) return (taxableIncome * 0.2) - 1650000;
    if (taxableIncome <= 52000000) return (taxableIncome * 0.25) - 3250000;
    if (taxableIncome <= 80000000) return (taxableIncome * 0.3) - 5850000;
    return (taxableIncome * 0.35) - 9850000;
  }
}