/**
 * 贷款计算器 - 贷款方案比较模块
 */

// 贷款方案比较功能
const LoanCompare = {
  /**
   * 比较不同贷款方案
   * @param {number} amount - 贷款总金额
   * @param {number} term - 贷款期限(月)
   * @param {boolean} includeCommercial - 是否包含商业贷款
   * @param {boolean} includeHousing - 是否包含公积金贷款
   * @param {boolean} includeCombined - 是否包含组合贷款
   * @param {number} combinedRatio - 组合贷款中商业贷款比例(%)
   * @param {boolean} includeEqualInstallment - 是否包含等额本息
   * @param {boolean} includeEqualPrincipal - 是否包含等额本金
   * @returns {Array} 比较结果数组
   */
  compareLoans: function(amount, term, includeCommercial, includeHousing, includeCombined, combinedRatio, includeEqualInstallment, includeEqualPrincipal) {
    const results = [];
    const startDate = new Date();
    
    // 商业贷款利率
    const commercialRate = 0.0490; // 4.90%
    
    // 公积金贷款利率
    const housingRate = 0.0325; // 3.25%
    
    // 商业贷款
    if (includeCommercial) {
      if (includeEqualInstallment) {
        const result = LoanCore.calculateEqualInstallment(amount, term, commercialRate, startDate);
        results.push({
          name: '商业贷款(等额本息)',
          amount: amount,
          term: term,
          rate: commercialRate,
          repaymentMethod: '等额本息',
          monthlyPayment: result.monthlyPayment,
          totalPayment: result.totalPayment,
          totalInterest: result.totalInterest,
          interestRatio: result.totalInterest / result.totalPayment
        });
      }
      
      if (includeEqualPrincipal) {
        const result = LoanCore.calculateEqualPrincipal(amount, term, commercialRate, startDate);
        results.push({
          name: '商业贷款(等额本金)',
          amount: amount,
          term: term,
          rate: commercialRate,
          repaymentMethod: '等额本金',
          monthlyPayment: result.firstMonthPayment,
          totalPayment: result.totalPayment,
          totalInterest: result.totalInterest,
          interestRatio: result.totalInterest / result.totalPayment
        });
      }
    }
    
    // 公积金贷款
    if (includeHousing) {
      if (includeEqualInstallment) {
        const result = LoanCore.calculateEqualInstallment(amount, term, housingRate, startDate);
        results.push({
          name: '公积金贷款(等额本息)',
          amount: amount,
          term: term,
          rate: housingRate,
          repaymentMethod: '等额本息',
          monthlyPayment: result.monthlyPayment,
          totalPayment: result.totalPayment,
          totalInterest: result.totalInterest,
          interestRatio: result.totalInterest / result.totalPayment
        });
      }
      
      if (includeEqualPrincipal) {
        const result = LoanCore.calculateEqualPrincipal(amount, term, housingRate, startDate);
        results.push({
          name: '公积金贷款(等额本金)',
          amount: amount,
          term: term,
          rate: housingRate,
          repaymentMethod: '等额本金',
          monthlyPayment: result.firstMonthPayment,
          totalPayment: result.totalPayment,
          totalInterest: result.totalInterest,
          interestRatio: result.totalInterest / result.totalPayment
        });
      }
    }
    
    // 组合贷款
    if (includeCombined) {
      // 计算商业贷款和公积金贷款金额
      const commercialAmount = amount * (combinedRatio / 100);
      const housingAmount = amount * (1 - combinedRatio / 100);
      
      if (includeEqualInstallment) {
        const result = LoanCore.calculateCombinedLoan(
          commercialAmount, term, commercialRate,
          housingAmount, term, housingRate,
          true, startDate
        );
        
        results.push({
          name: '组合贷款(等额本息)',
          amount: amount,
          term: term,
          rate: '商业:' + (commercialRate * 100).toFixed(2) + '%, 公积金:' + (housingRate * 100).toFixed(2) + '%',
          repaymentMethod: '等额本息',
          monthlyPayment: result.totalMonthlyPayment,
          totalPayment: result.totalPayment,
          totalInterest: result.totalInterest,
          interestRatio: result.totalInterest / result.totalPayment,
          commercialAmount: commercialAmount,
          housingAmount: housingAmount,
          commercialRate: commercialRate,
          housingRate: housingRate
        });
      }
      
      if (includeEqualPrincipal) {
        // 等额本金组合贷款计算
        const cResult = LoanCore.calculateEqualPrincipal(commercialAmount, term, commercialRate, startDate);
        const hResult = LoanCore.calculateEqualPrincipal(housingAmount, term, housingRate, startDate);
        
        results.push({
          name: '组合贷款(等额本金)',
          amount: amount,
          term: term,
          rate: '商业:' + (commercialRate * 100).toFixed(2) + '%, 公积金:' + (housingRate * 100).toFixed(2) + '%',
          repaymentMethod: '等额本金',
          monthlyPayment: cResult.firstMonthPayment + hResult.firstMonthPayment,
          totalPayment: cResult.totalPayment + hResult.totalPayment,
          totalInterest: cResult.totalInterest + hResult.totalInterest,
          interestRatio: (cResult.totalInterest + hResult.totalInterest) / (cResult.totalPayment + hResult.totalPayment),
          commercialAmount: commercialAmount,
          housingAmount: housingAmount,
          commercialRate: commercialRate,
          housingRate: housingRate
        });
      }
    }
    
    return results;
  }
};

// 导出模块
window.LoanCompare = LoanCompare;