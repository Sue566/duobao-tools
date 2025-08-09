/**
 * 贷款计算器 - 核心计算模块
 */
(function() {
  // 定义核心计算模块
  const LoanCore = {
    // 计算等额本息还款计划
    calculateEqualInstallment: function(principal, term, rate, startDate) {
      // 月利率
      const monthlyRate = rate / 12;
      
      // 月供
      const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
      
      // 总还款额
      const totalPayment = monthlyPayment * term;
      
      // 总利息
      const totalInterest = totalPayment - principal;
      
      // 生成还款计划
      const schedule = [];
      let balance = principal;
      let currentDate = new Date(startDate);
      
      for (let month = 1; month <= term; month++) {
        // 计算当月利息
        const interest = balance * monthlyRate;
        
        // 计算当月本金
        const principalPaid = monthlyPayment - interest;
        
        // 更新剩余本金
        balance -= principalPaid;
        
        // 处理最后一期可能的舍入误差
        if (month === term) {
          balance = 0;
        }
        
        // 添加到还款计划
        schedule.push({
          month: month,
          date: new Date(currentDate),
          payment: monthlyPayment,
          principal: principalPaid,
          interest: interest,
          balance: balance
        });
        
        // 更新下一个还款日期
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      
      return {
        schedule: schedule,
        totalPayment: totalPayment,
        totalInterest: totalInterest
      };
    },
    
    // 计算等额本金还款计划
    calculateEqualPrincipal: function(principal, term, rate, startDate) {
      // 月利率
      const monthlyRate = rate / 12;
      
      // 每月本金
      const monthlyPrincipal = principal / term;
      
      // 生成还款计划
      const schedule = [];
      let balance = principal;
      let totalPayment = 0;
      let totalInterest = 0;
      let currentDate = new Date(startDate);
      
      for (let month = 1; month <= term; month++) {
        // 计算当月利息
        const interest = balance * monthlyRate;
        
        // 计算当月月供
        const payment = monthlyPrincipal + interest;
        
        // 更新剩余本金
        balance -= monthlyPrincipal;
        
        // 处理最后一期可能的舍入误差
        if (month === term) {
          balance = 0;
        }
        
        // 累计总还款额和总利息
        totalPayment += payment;
        totalInterest += interest;
        
        // 添加到还款计划
        schedule.push({
          month: month,
          date: new Date(currentDate),
          payment: payment,
          principal: monthlyPrincipal,
          interest: interest,
          balance: balance
        });
        
        // 更新下一个还款日期
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      
      return {
        schedule: schedule,
        totalPayment: totalPayment,
        totalInterest: totalInterest
      };
    },
    
    // 计算只还利息还款计划
    calculateInterestOnly: function(principal, term, rate, startDate) {
      // 月利率
      const monthlyRate = rate / 12;
      
      // 月利息
      const monthlyInterest = principal * monthlyRate;
      
      // 生成还款计划
      const schedule = [];
      let currentDate = new Date(startDate);
      
      for (let month = 1; month <= term; month++) {
        // 计算当月月供（只有利息）
        const payment = monthlyInterest;
        
        // 添加到还款计划
        schedule.push({
          month: month,
          date: new Date(currentDate),
          payment: payment,
          principal: month === term ? principal : 0,
          interest: monthlyInterest,
          balance: month === term ? 0 : principal
        });
        
        // 更新下一个还款日期
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      
      // 总还款额 = 总利息 + 本金
      const totalInterest = monthlyInterest * term;
      const totalPayment = totalInterest + principal;
      
      return {
        schedule: schedule,
        totalPayment: totalPayment,
        totalInterest: totalInterest
      };
    },
    
    // 计算组合贷款还款计划
    calculateCombinedLoan: function(commercialAmount, commercialTerm, commercialRate, housingAmount, housingTerm, housingRate, isEqualInstallment, startDate) {
      // 计算商业贷款还款计划
      const commercialResult = isEqualInstallment ? 
        this.calculateEqualInstallment(commercialAmount, commercialTerm, commercialRate, startDate) : 
        this.calculateEqualPrincipal(commercialAmount, commercialTerm, commercialRate, startDate);
      
      // 计算公积金贷款还款计划
      const housingResult = isEqualInstallment ? 
        this.calculateEqualInstallment(housingAmount, housingTerm, housingRate, startDate) : 
        this.calculateEqualPrincipal(housingAmount, housingTerm, housingRate, startDate);
      
      // 合并还款计划
      const maxTerm = Math.max(commercialTerm, housingTerm);
      const schedule = [];
      let totalPayment = 0;
      let totalInterest = 0;
      let currentDate = new Date(startDate);
      
      for (let month = 1; month <= maxTerm; month++) {
        // 获取商业贷款当月数据
        const commercialPayment = month <= commercialTerm ? commercialResult.schedule[month - 1].payment : 0;
        const commercialPrincipal = month <= commercialTerm ? commercialResult.schedule[month - 1].principal : 0;
        const commercialInterest = month <= commercialTerm ? commercialResult.schedule[month - 1].interest : 0;
        const commercialBalance = month <= commercialTerm ? commercialResult.schedule[month - 1].balance : 0;
        
        // 获取公积金贷款当月数据
        const housingPayment = month <= housingTerm ? housingResult.schedule[month - 1].payment : 0;
        const housingPrincipal = month <= housingTerm ? housingResult.schedule[month - 1].principal : 0;
        const housingInterest = month <= housingTerm ? housingResult.schedule[month - 1].interest : 0;
        const housingBalance = month <= housingTerm ? housingResult.schedule[month - 1].balance : 0;
        
        // 计算合并数据
        const payment = commercialPayment + housingPayment;
        const principal = commercialPrincipal + housingPrincipal;
        const interest = commercialInterest + housingInterest;
        const balance = commercialBalance + housingBalance;
        
        // 累计总还款额和总利息
        totalPayment += payment;
        totalInterest += interest;
        
        // 添加到还款计划
        schedule.push({
          month: month,
          date: new Date(currentDate),
          payment: payment,
          principal: principal,
          interest: interest,
          balance: balance,
          commercialPayment: commercialPayment,
          housingPayment: housingPayment
        });
        
        // 更新下一个还款日期
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      
      return {
        schedule: schedule,
        totalPayment: totalPayment,
        totalInterest: totalInterest,
        commercialResult: commercialResult,
        housingResult: housingResult
      };
    },
    
    // 计算提前还款
    calculatePrepayment: function(originalAmount, originalTerm, originalRate, loanStartDate, alreadyPaid, prepaymentAmount, isReduceTerm, isEqualInstallment) {
      // 计算原始还款计划
      const startDate = new Date(loanStartDate);
      const originalResult = isEqualInstallment ? 
        this.calculateEqualInstallment(originalAmount, originalTerm, originalRate, startDate) : 
        this.calculateEqualPrincipal(originalAmount, originalTerm, originalRate, startDate);
      
      // 计算已还总额和已还利息
      let paidAmount = 0;
      let paidInterest = 0;
      for (let i = 0; i < alreadyPaid; i++) {
        paidAmount += originalResult.schedule[i].payment;
        paidInterest += originalResult.schedule[i].interest;
      }
      
      // 计算提前还款后的剩余本金
      const remainingPrincipal = originalResult.schedule[alreadyPaid - 1].balance - prepaymentAmount;
      
      // 如果剩余本金小于等于0，表示已还清
      if (remainingPrincipal <= 0) {
        return {
          originalSchedule: originalResult.schedule,
          newSchedule: [],
          totalPayment: paidAmount + prepaymentAmount,
          totalInterest: paidInterest,
          paidAmount: paidAmount,
          paidInterest: paidInterest
        };
      }
      
      // 计算新的还款计划
      let newResult;
      
      // 提前还款后的首次还款日期
      const newStartDate = new Date(originalResult.schedule[alreadyPaid].date);
      
      if (isReduceTerm) {
        // 缩短期限（保持月供不变）
        if (isEqualInstallment) {
          // 等额本息
          const monthlyPayment = originalResult.schedule[0].payment;
          const monthlyRate = originalRate / 12;
          
          // 计算新的期限
          const newTerm = Math.ceil(Math.log(monthlyPayment / (monthlyPayment - remainingPrincipal * monthlyRate)) / Math.log(1 + monthlyRate));
          
          newResult = this.calculateEqualInstallment(remainingPrincipal, newTerm, originalRate, newStartDate);
        } else {
          // 等额本金
          const monthlyPrincipal = originalResult.schedule[0].principal;
          const newTerm = Math.ceil(remainingPrincipal / monthlyPrincipal);
          
          newResult = this.calculateEqualPrincipal(remainingPrincipal, newTerm, originalRate, newStartDate);
        }
      } else {
        // 减少月供（保持期限不变）
        const remainingTerm = originalTerm - alreadyPaid;
        
        if (isEqualInstallment) {
          newResult = this.calculateEqualInstallment(remainingPrincipal, remainingTerm, originalRate, newStartDate);
        } else {
          newResult = this.calculateEqualPrincipal(remainingPrincipal, remainingTerm, originalRate, newStartDate);
        }
      }
      
      // 添加已还款信息
      originalResult.paidAmount = paidAmount;
      originalResult.paidInterest = paidInterest;
      
      return {
        originalSchedule: originalResult.schedule,
        newSchedule: newResult.schedule,
        totalPayment: newResult.totalPayment,
        totalInterest: newResult.totalInterest,
        paidAmount: paidAmount,
        paidInterest: paidInterest
      };
    }
  };
  
  // 导出模块
  window.LoanCore = LoanCore;
})();