/**
 * 贷款计算器 - 核心计算模块
 */

// 核心计算功能
const LoanCore = {
  /**
   * 计算等额本息还款计划
   * @param {number} amount - 贷款金额
   * @param {number} term - 贷款期限(月)
   * @param {number} rate - 年利率(小数)
   * @param {Date} startDate - 首次还款日期
   * @returns {object} 还款计划和统计信息
   */
  calculateEqualInstallment: function(amount, term, rate, startDate) {
    // 月利率
    const monthlyRate = rate / 12;
    
    // 每月还款额 = 贷款本金 × 月利率 × (1 + 月利率)^还款月数 ÷ [(1 + 月利率)^还款月数 - 1]
    const monthlyPayment = amount * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
    
    // 计算还款计划
    const schedule = [];
    let totalPayment = 0;
    let totalInterest = 0;
    let remainingPrincipal = amount;
    
    for (let i = 1; i <= term; i++) {
      const interest = remainingPrincipal * monthlyRate;
      const principal = monthlyPayment - interest;
      remainingPrincipal -= principal;
      
      // 处理最后一期可能的舍入误差
      if (i === term) {
        remainingPrincipal = 0;
      }
      
      // 计算还款日期
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + i - 1);
      
      schedule.push({
        period: i,
        date: paymentDate,
        payment: monthlyPayment,
        principal: principal,
        interest: interest,
        remainingPrincipal: remainingPrincipal
      });
      
      totalPayment += monthlyPayment;
      totalInterest += interest;
    }
    
    return {
      schedule,
      totalPayment,
      totalInterest,
      monthlyPayment
    };
  },
  
  /**
   * 计算等额本金还款计划
   * @param {number} amount - 贷款金额
   * @param {number} term - 贷款期限(月)
   * @param {number} rate - 年利率(小数)
   * @param {Date} startDate - 首次还款日期
   * @returns {object} 还款计划和统计信息
   */
  calculateEqualPrincipal: function(amount, term, rate, startDate) {
    // 月利率
    const monthlyRate = rate / 12;
    
    // 每月归还本金 = 贷款本金 ÷ 还款月数
    const monthlyPrincipal = amount / term;
    
    // 计算还款计划
    const schedule = [];
    let totalPayment = 0;
    let totalInterest = 0;
    let remainingPrincipal = amount;
    
    for (let i = 1; i <= term; i++) {
      const interest = remainingPrincipal * monthlyRate;
      const payment = monthlyPrincipal + interest;
      remainingPrincipal -= monthlyPrincipal;
      
      // 处理最后一期可能的舍入误差
      if (i === term) {
        remainingPrincipal = 0;
      }
      
      // 计算还款日期
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + i - 1);
      
      schedule.push({
        period: i,
        date: paymentDate,
        payment: payment,
        principal: monthlyPrincipal,
        interest: interest,
        remainingPrincipal: remainingPrincipal
      });
      
      totalPayment += payment;
      totalInterest += interest;
    }
    
    // 首月还款额
    const firstMonthPayment = schedule[0].payment;
    
    return {
      schedule,
      totalPayment,
      totalInterest,
      firstMonthPayment
    };
  },
  
  /**
   * 计算先息后本还款计划
   * @param {number} amount - 贷款金额
   * @param {number} term - 贷款期限(月)
   * @param {number} rate - 年利率(小数)
   * @param {Date} startDate - 首次还款日期
   * @returns {object} 还款计划和统计信息
   */
  calculateInterestOnly: function(amount, term, rate, startDate) {
    // 月利率
    const monthlyRate = rate / 12;
    
    // 每月利息
    const monthlyInterest = amount * monthlyRate;
    
    // 计算还款计划
    const schedule = [];
    let totalPayment = 0;
    let totalInterest = 0;
    let remainingPrincipal = amount;
    
    for (let i = 1; i <= term; i++) {
      let principal = 0;
      const interest = monthlyInterest;
      let payment = interest;
      
      // 最后一期还本金
      if (i === term) {
        principal = amount;
        payment += principal;
        remainingPrincipal = 0;
      }
      
      // 计算还款日期
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + i - 1);
      
      schedule.push({
        period: i,
        date: paymentDate,
        payment: payment,
        principal: principal,
        interest: interest,
        remainingPrincipal: remainingPrincipal
      });
      
      totalPayment += payment;
      totalInterest += interest;
    }
    
    return {
      schedule,
      totalPayment,
      totalInterest,
      monthlyInterest
    };
  },
  
  /**
   * 计算组合贷款还款计划
   * @param {number} commercialAmount - 商业贷款金额
   * @param {number} commercialTerm - 商业贷款期限(月)
   * @param {number} commercialRate - 商业贷款年利率(小数)
   * @param {number} housingAmount - 公积金贷款金额
   * @param {number} housingTerm - 公积金贷款期限(月)
   * @param {number} housingRate - 公积金贷款年利率(小数)
   * @param {boolean} isEqualInstallment - 是否等额本息
   * @param {Date} startDate - 首次还款日期
   * @returns {object} 还款计划和统计信息
   */
  calculateCombinedLoan: function(commercialAmount, commercialTerm, commercialRate, housingAmount, housingTerm, housingRate, isEqualInstallment, startDate) {
    // 月利率
    const cMonthlyRate = commercialRate / 12;
    const hMonthlyRate = housingRate / 12;
    
    // 计算最长期限
    const maxTerm = Math.max(commercialTerm, housingTerm);
    
    // 计算还款计划
    const schedule = [];
    let totalPayment = 0;
    let totalInterest = 0;
    let cRemainingPrincipal = commercialAmount;
    let hRemainingPrincipal = housingAmount;
    
    if (isEqualInstallment) {
      // 等额本息
      // 商业贷款月供
      const cMonthlyPayment = commercialAmount * cMonthlyRate * Math.pow(1 + cMonthlyRate, commercialTerm) / (Math.pow(1 + cMonthlyRate, commercialTerm) - 1);
      
      // 公积金贷款月供
      const hMonthlyPayment = housingAmount * hMonthlyRate * Math.pow(1 + hMonthlyRate, housingTerm) / (Math.pow(1 + hMonthlyRate, housingTerm) - 1);
      
      for (let i = 1; i <= maxTerm; i++) {
        // 商业贷款部分
        let cPayment = 0;
        let cPrincipal = 0;
        let cInterest = 0;
        
        if (i <= commercialTerm) {
          cInterest = cRemainingPrincipal * cMonthlyRate;
          cPrincipal = cMonthlyPayment - cInterest;
          cPayment = cMonthlyPayment;
          cRemainingPrincipal -= cPrincipal;
          
          // 处理最后一期可能的舍入误差
          if (i === commercialTerm) {
            cRemainingPrincipal = 0;
          }
        }
        
        // 公积金贷款部分
        let hPayment = 0;
        let hPrincipal = 0;
        let hInterest = 0;
        
        if (i <= housingTerm) {
          hInterest = hRemainingPrincipal * hMonthlyRate;
          hPrincipal = hMonthlyPayment - hInterest;
          hPayment = hMonthlyPayment;
          hRemainingPrincipal -= hPrincipal;
          
          // 处理最后一期可能的舍入误差
          if (i === housingTerm) {
            hRemainingPrincipal = 0;
          }
        }
        
        // 计算还款日期
        const paymentDate = new Date(startDate);
        paymentDate.setMonth(startDate.getMonth() + i - 1);
        
        // 合计
        const totalPrincipal = cPrincipal + hPrincipal;
        const totalInterestPayment = cInterest + hInterest;
        const totalMonthlyPayment = cPayment + hPayment;
        const totalRemainingPrincipal = cRemainingPrincipal + hRemainingPrincipal;
        
        schedule.push({
          period: i,
          date: paymentDate,
          cPayment,
          hPayment,
          payment: totalMonthlyPayment,
          principal: totalPrincipal,
          interest: totalInterestPayment,
          remainingPrincipal: totalRemainingPrincipal
        });
        
        totalPayment += totalMonthlyPayment;
        totalInterest += totalInterestPayment;
      }
      
      return {
        schedule,
        totalPayment,
        totalInterest,
        commercialMonthlyPayment: cMonthlyPayment,
        housingMonthlyPayment: hMonthlyPayment,
        totalMonthlyPayment: cMonthlyPayment + hMonthlyPayment
      };
    } else {
      // 等额本金
      // 商业贷款月还本金
      const cMonthlyPrincipal = commercialAmount / commercialTerm;
      
      // 公积金贷款月还本金
      const hMonthlyPrincipal = housingAmount / housingTerm;
      
      for (let i = 1; i <= maxTerm; i++) {
        // 商业贷款部分
        let cPayment = 0;
        let cPrincipal = 0;
        let cInterest = 0;
        
        if (i <= commercialTerm) {
          cInterest = cRemainingPrincipal * cMonthlyRate;
          cPrincipal = cMonthlyPrincipal;
          cPayment = cPrincipal + cInterest;
          cRemainingPrincipal -= cPrincipal;
          
          // 处理最后一期可能的舍入误差
          if (i === commercialTerm) {
            cRemainingPrincipal = 0;
          }
        }
        
        // 公积金贷款部分
        let hPayment = 0;
        let hPrincipal = 0;
        let hInterest = 0;
        
        if (i <= housingTerm) {
          hInterest = hRemainingPrincipal * hMonthlyRate;
          hPrincipal = hMonthlyPrincipal;
          hPayment = hPrincipal + hInterest;
          hRemainingPrincipal -= hPrincipal;
          
          // 处理最后一期可能的舍入误差
          if (i === housingTerm) {
            hRemainingPrincipal = 0;
          }
        }
        
        // 计算还款日期
        const paymentDate = new Date(startDate);
        paymentDate.setMonth(startDate.getMonth() + i - 1);
        
        // 合计
        const totalPrincipal = cPrincipal + hPrincipal;
        const totalInterestPayment = cInterest + hInterest;
        const totalMonthlyPayment = cPayment + hPayment;
        const totalRemainingPrincipal = cRemainingPrincipal + hRemainingPrincipal;
        
        schedule.push({
          period: i,
          date: paymentDate,
          cPayment,
          hPayment,
          payment: totalMonthlyPayment,
          principal: totalPrincipal,
          interest: totalInterestPayment,
          remainingPrincipal: totalRemainingPrincipal
        });
        
        totalPayment += totalMonthlyPayment;
        totalInterest += totalInterestPayment;
      }
      
      return {
        schedule,
        totalPayment,
        totalInterest,
        firstMonthPayment: schedule[0].payment,
        commercialFirstMonthPayment: schedule[0].cPayment,
        housingFirstMonthPayment: schedule[0].hPayment
      };
    }
  },
  
  /**
   * 计算提前还款
   * @param {number} originalAmount - 原贷款金额
   * @param {number} originalTerm - 原贷款期限(月)
   * @param {number} originalRate - 原贷款年利率(小数)
   * @param {Date} startDate - 贷款开始日期
   * @param {number} alreadyPaid - 已还期数
   * @param {number} prepaymentAmount - 提前还款金额
   * @param {boolean} isReduceTerm - 是否缩短贷款期限
   * @param {boolean} isEqualInstallment - 是否等额本息
   * @returns {object} 提前还款计算结果
   */
  calculatePrepayment: function(originalAmount, originalTerm, originalRate, startDate, alreadyPaid, prepaymentAmount, isReduceTerm, isEqualInstallment) {
    // 月利率
    const monthlyRate = originalRate / 12;
    
    // 计算原还款计划
    let originalSchedule;
    if (isEqualInstallment) {
      originalSchedule = this.calculateEqualInstallment(originalAmount, originalTerm, originalRate, startDate).schedule;
    } else {
      originalSchedule = this.calculateEqualPrincipal(originalAmount, originalTerm, originalRate, startDate).schedule;
    }
    
    // 获取已还款部分
    const paidSchedule = originalSchedule.slice(0, alreadyPaid);
    
    // 计算已还本金和利息
    const paidPrincipal = paidSchedule.reduce((sum, item) => sum + item.principal, 0);
    const paidInterest = paidSchedule.reduce((sum, item) => sum + item.interest, 0);
    
    // 剩余本金
    const remainingPrincipal = originalAmount - paidPrincipal;
    
    // 提前还款后的剩余本金
    const newRemainingPrincipal = remainingPrincipal - prepaymentAmount;
    
    if (newRemainingPrincipal <= 0) {
      // 如果提前还款金额大于等于剩余本金，则一次性还清
      return {
        originalSchedule,
        paidSchedule,
        newSchedule: [],
        paidPrincipal,
        paidInterest,
        remainingPrincipal,
        prepaymentAmount,
        newRemainingPrincipal: 0,
        interestSaved: originalSchedule.slice(alreadyPaid).reduce((sum, item) => sum + item.interest, 0),
        termReduced: originalTerm - alreadyPaid,
        totalPayment: paidPrincipal + paidInterest + prepaymentAmount,
        totalInterest: paidInterest
      };
    }
    
    // 计算新的还款计划
    let newSchedule;
    let newTerm;
    
    if (isReduceTerm) {
      // 缩短贷款期限
      if (isEqualInstallment) {
        // 等额本息，保持月供不变，计算新的期限
        const monthlyPayment = originalSchedule[0].payment;
        newTerm = Math.ceil(Math.log(monthlyPayment / (monthlyPayment - newRemainingPrincipal * monthlyRate)) / Math.log(1 + monthlyRate));
        
        // 计算新的还款计划
        const newStartDate = new Date(startDate);
        newStartDate.setMonth(startDate.getMonth() + alreadyPaid);
        newSchedule = this.calculateEqualInstallment(newRemainingPrincipal, newTerm, originalRate, newStartDate).schedule;
      } else {
        // 等额本金，保持每月还款本金不变，计算新的期限
        const monthlyPrincipal = originalSchedule[0].principal;
        newTerm = Math.ceil(newRemainingPrincipal / monthlyPrincipal);
        
        // 计算新的还款计划
        const newStartDate = new Date(startDate);
        newStartDate.setMonth(startDate.getMonth() + alreadyPaid);
        newSchedule = this.calculateEqualPrincipal(newRemainingPrincipal, newTerm, originalRate, newStartDate).schedule;
      }
    } else {
      // 减少月供金额
      newTerm = originalTerm - alreadyPaid;
      
      // 计算新的还款计划
      const newStartDate = new Date(startDate);
      newStartDate.setMonth(startDate.getMonth() + alreadyPaid);
      
      if (isEqualInstallment) {
        newSchedule = this.calculateEqualInstallment(newRemainingPrincipal, newTerm, originalRate, newStartDate).schedule;
      } else {
        newSchedule = this.calculateEqualPrincipal(newRemainingPrincipal, newTerm, originalRate, newStartDate).schedule;
      }
    }
    
    // 计算节省的利息
    const originalRemainingInterest = originalSchedule.slice(alreadyPaid).reduce((sum, item) => sum + item.interest, 0);
    const newTotalInterest = newSchedule.reduce((sum, item) => sum + item.interest, 0);
    const interestSaved = originalRemainingInterest - newTotalInterest;
    
    // 计算缩短的期限
    const termReduced = isReduceTerm ? (originalTerm - alreadyPaid - newTerm) : 0;
    
    // 计算总还款额
    const totalPayment = paidPrincipal + paidInterest + prepaymentAmount + newSchedule.reduce((sum, item) => sum + item.payment, 0);
    
    // 计算总利息
    const totalInterest = paidInterest + newSchedule.reduce((sum, item) => sum + item.interest, 0);
    
    return {
      originalSchedule,
      paidSchedule,
      newSchedule,
      paidPrincipal,
      paidInterest,
      remainingPrincipal,
      prepaymentAmount,
      newRemainingPrincipal,
      interestSaved,
      termReduced,
      totalPayment,
      totalInterest
    };
  },
  
  /**
   * 比较不同贷款方案
   * @param {number} amount - 贷款金额
   * @param {number} term - 贷款期限(月)
   * @param {number} commercialRatio - 商业贷款比例(0-1)
   * @returns {Array} 比较结果数组
   */
  compareLoanPlans: function(amount, term, commercialRatio) {
    // 商业贷款利率
    const commercialRate = 0.0490; // 4.90%
    
    // 公积金贷款利率
    const housingRate = 0.0325; // 3.25%
    
    // 计算商业贷款和公积金贷款金额
    const commercialAmount = amount * commercialRatio;
    const housingAmount = amount * (1 - commercialRatio);
    
    // 首次还款日期（默认为下个月1日）
    const startDate = this.getNextMonthFirstDay();
    
    // 比较结果数组
    const results = [];
    
    // 商业贷款-等额本息
    if (commercialAmount > 0) {
      const commercialEqualInstallment = this.calculateEqualInstallment(amount, term, commercialRate, startDate);
      results.push({
        name: '商业贷款-等额本息',
        amount: amount,
        term: term,
        repaymentMethod: '等额本息',
        monthlyPayment: commercialEqualInstallment.monthlyPayment,
        totalPayment: commercialEqualInstallment.totalPayment,
        totalInterest: commercialEqualInstallment.totalInterest,
        interestRatio: commercialEqualInstallment.totalInterest / commercialEqualInstallment.totalPayment
      });
    }
    
    // 商业贷款-等额本金
    if (commercialAmount > 0) {
      const commercialEqualPrincipal = this.calculateEqualPrincipal(amount, term, commercialRate, startDate);
      results.push({
        name: '商业贷款-等额本金',
        amount: amount,
        term: term,
        repaymentMethod: '等额本金',
        monthlyPayment: commercialEqualPrincipal.firstMonthPayment,
        totalPayment: commercialEqualPrincipal.totalPayment,
        totalInterest: commercialEqualPrincipal.totalInterest,
        interestRatio: commercialEqualPrincipal.totalInterest / commercialEqualPrincipal.totalPayment
      });
    }
    
    // 公积金贷款-等额本息
    if (housingAmount > 0) {
      const housingEqualInstallment = this.calculateEqualInstallment(amount, term, housingRate, startDate);
      results.push({
        name: '公积金贷款-等额本息',
        amount: amount,
        term: term,
        repaymentMethod: '等额本息',
        monthlyPayment: housingEqualInstallment.monthlyPayment,
        totalPayment: housingEqualInstallment.totalPayment,
        totalInterest: housingEqualInstallment.totalInterest,
        interestRatio: housingEqualInstallment.totalInterest / housingEqualInstallment.totalPayment
      });
    }
    
    // 公积金贷款-等额本金
    if (housingAmount > 0) {
      const housingEqualPrincipal = this.calculateEqualPrincipal(amount, term, housingRate, startDate);
      results.push({
        name: '公积金贷款-等额本金',
        amount: amount,
        term: term,
        repaymentMethod: '等额本金',
        monthlyPayment: housingEqualPrincipal.firstMonthPayment,
        totalPayment: housingEqualPrincipal.totalPayment,
        totalInterest: housingEqualPrincipal.totalInterest,
        interestRatio: housingEqualPrincipal.totalInterest / housingEqualPrincipal.totalPayment
      });
    }
    
    // 组合贷款-等额本息
    if (commercialAmount > 0 && housingAmount > 0) {
      const combinedEqualInstallment = this.calculateCombinedLoan(
        commercialAmount, term, commercialRate,
        housingAmount, term, housingRate,
        true, startDate
      );
      results.push({
        name: '组合贷款-等额本息',
        amount: amount,
        term: term,
        repaymentMethod: '等额本息',
        monthlyPayment: combinedEqualInstallment.totalMonthlyPayment,
        totalPayment: combinedEqualInstallment.totalPayment,
        totalInterest: combinedEqualInstallment.totalInterest,
        interestRatio: combinedEqualInstallment.totalInterest / combinedEqualInstallment.totalPayment
      });
    }
    
    // 组合贷款-等额本金
    if (commercialAmount > 0 && housingAmount > 0) {
      const combinedEqualPrincipal = this.calculateCombinedLoan(
        commercialAmount, term, commercialRate,
        housingAmount, term, housingRate,
        false, startDate
      );
      results.push({
        name: '组合贷款-等额本金',
        amount: amount,
        term: term,
        repaymentMethod: '等额本金',
        monthlyPayment: combinedEqualPrincipal.firstMonthPayment,
        totalPayment: combinedEqualPrincipal.totalPayment,
        totalInterest: combinedEqualPrincipal.totalInterest,
        interestRatio: combinedEqualPrincipal.totalInterest / combinedEqualPrincipal.totalPayment
      });
    }
    
    return results;
  },
  
  /**
   * 获取下个月的第一天
   * @returns {Date} 下个月第一天的日期对象
   */
  getNextMonthFirstDay: function() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 1);
  }
};

// 导出模块
window.LoanCore = LoanCore;
