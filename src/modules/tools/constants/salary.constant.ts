// src/tools/constants/salary.constant.ts

export const SALARY_CONSTANTS = {
  BASE_SALARY: 2340000, // Lương cơ sở (từ 01/07/2024)
  
  // Lương tối thiểu vùng (dùng để tính trần BHTN - 20 lần)
  REGION_MIN_WAGE: {
    1: 4960000, // Vùng I
    2: 4410000, // Vùng II
    3: 3860000, // Vùng III
    4: 3450000, // Vùng IV
  },

  // Tỷ lệ bảo hiểm (Người lao động đóng)
  INSURANCE_RATES: {
    SOCIAL: 0.08,        // BHXH 8%
    HEALTH: 0.015,       // BHYT 1.5%
    UNEMPLOYMENT: 0.01,  // BHTN 1%
  },

  // Giảm trừ gia cảnh
  DEDUCTION: {
    SELF: 11000000,      // Bản thân
    DEPENDENT: 4400000,  // Người phụ thuộc
  },
};