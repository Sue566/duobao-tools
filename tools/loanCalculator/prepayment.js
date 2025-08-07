/**
 * 贷款计算器 - 提前还款模块
 */

// 提前还款计算功能
const LoanPrepayment = {
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
    // 计算原始还款计划
    let originalSchedule;
    if (isEqualInstallment) {
      originalSchedule = LoanCore.calculateEqualInstallment(originalAmount, originalTerm, originalRate, startDate).schedule;
    } else {
      originalSchedule = LoanCore.calculateEqualPrincipal(originalAmount, originalTerm, originalRate, startDate).schedule;
    }
    
    // 已还部分
    const paidSchedule = originalSchedule.slice(0, alreadyPaid);
    
    // 计算已还本金和利息
    const paidPrincipal = paidSchedule.reduce((sum, item) => sum + item.principal, 0);
    const paidInterest = paidSchedule.reduce((sum, item) => sum + item.interest, 0);
    
    // 剩余本金
    const remainingPrincipal = originalSchedule[alreadyPaid - 1]?.remainingPrincipal || originalAmount;
    
    // 提前还款后的剩余本金
    const newRemainingPrincipal = remainingPrincipal - prepaymentAmount;
    
    if (newRemainingPrincipal <= 0) {
      // 如果提前还款金额大于等于剩余本金，则全部结清
      return {
        originalSchedule,
        paidSchedule,
        paidPrincipal,
        paidInterest,
        remainingPrincipal,
        prepaymentAmount,
        newRemainingPrincipal: 0,
        newSchedule: [],
        interestSaved: originalSchedule.slice(alreadyPaid).reduce((sum, item) => sum + item.interest, 0),
        termReduced: originalSchedule.length - alreadyPaid
      };
    }
    
    // 提前还款后的还款计划
    let newSchedule;
    let newStartDate = new Date(originalSchedule[alreadyPaid - 1].date);
    newStartDate.setMonth(newStartDate.getMonth() + 1);
    
    if (isReduceTerm) {
      // 缩短贷款期限，月供不变
      // 计算新的贷款期限
      let newTerm;
      
      if (isEqualInstallment) {
        // 等额本息
        // 月利率
        const monthlyRate = originalRate / 12;
        // 原月供
        const monthlyPayment = originalSchedule[alreadyPaid].payment;
        
        // 计算新的期限
        // 公式：期限 = log(月供 / (月供 - 本金 * 月利率)) / log(1 + 月利率)
        newTerm = Math.ceil(
          Math.log(monthlyPayment / (monthlyPayment - newRemainingPrincipal * monthlyRate)) / 
          Math.log(1 + monthlyRate)
        );
        
        // 计算新的还款计划
        newSchedule = LoanCore.calculateEqualInstallment(
          newRemainingPrincipal, 
          newTerm, 
          originalRate, 
          newStartDate
        ).schedule;
      } else {
        // 等额本金
        // 原月还本金
        const monthlyPrincipal = originalSchedule[alreadyPaid].principal;
        
        // 计算新的期限
        newTerm = Math.ceil(newRemainingPrincipal / monthlyPrincipal);
        
        // 计算新的还款计划
        newSchedule = LoanCore.calculateEqualPrincipal(
          newRemainingPrincipal, 
          newTerm, 
          originalRate, 
          newStartDate
        ).schedule;
      }
      
      // 计算节省的利息
      const originalRemainingInterest = originalSchedule.slice(alreadyPaid).reduce((sum, item) => sum + item.interest, 0);
      const newTotalInterest = newSchedule.reduce((sum, item) => sum + item.interest, 0);
      const interestSaved = originalRemainingInterest - newTotalInterest;
      
      // 计算缩短的期限
      const termReduced = originalSchedule.length - alreadyPaid - newSchedule.length;
      
      return {
        originalSchedule,
        paidSchedule,
        paidPrincipal,
        paidInterest,
        remainingPrincipal,
        prepaymentAmount,
        newRemainingPrincipal,
        newSchedule,
        interestSaved,
        termReduced
      };
    } else {
      // 减少月供，期限不变
      // 计算新的期限
      const newTerm = originalSchedule.length - alreadyPaid;
      
      // 计算新的还款计划
      if (isEqualInstallment) {
        newSchedule = LoanCore.calculateEqualInstallment(
          newRemainingPrincipal, 
          newTerm, 
          originalRate, 
          newStartDate
        ).schedule;
      } else {
        newSchedule = LoanCore.calculateEqualPrincipal(
          newRemainingPrincipal, 
          newTerm, 
          originalRate, 
          newStartDate
        ).schedule;
      }
      
      // 计算节省的利息
      const originalRemainingInterest = originalSchedule.slice(alreadyPaid).reduce((sum, item) => sum + item.interest, 0);
      const newTotalInterest = newSchedule.reduce((sum, item) => sum + item.interest, 0);
      const interestSaved = originalRemainingInterest - newTotalInterest;
      
      return {
        originalSchedule,
        paidSchedule,
        paidPrincipal,
        paidInterest,
        remainingPrincipal,
        prepaymentAmount,
        newRemainingPrincipal,
        newSchedule,
        interestSaved,
        termReduced: 0
      };
    }
  }
};

// 导出模块
window.LoanPrepayment = LoanPrepayment;