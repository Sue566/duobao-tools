/**
 * 贷款计算器 - 主入口文件（第三部分）
 * 整合所有功能模块
 */

// 继续 main.js 的内容
(function() {
  // 这个函数将在主文件中被调用
  function initLoanCalculatorPart3(container) {
    // 获取元素引用（从主文件传入）
    const {
      originalAmount, originalTerm, originalTermUnit, originalRate,
      loanStartDate, alreadyPaid, prepaymentAmount,
      methodReduceTerm, originalEqualInstallment,
      prepaymentSummary, prepaymentComparison, prepaymentSchedule,
      prepaymentChartInstance, exportPrepaymentBtn
    } = container;
    
    // 计算提前还款
    function calculatePrepayment() {
      // 获取输入值
      const amount = parseFloat(originalAmount.value);
      let term = parseInt(originalTerm.value);
      const rate = parseFloat(originalRate.value) / 100;
      const startDate = new Date(loanStartDate.value);
      const paid = parseInt(alreadyPaid.value);
      const prepayment = parseFloat(prepaymentAmount.value);
      const isReduceTerm = methodReduceTerm.checked;
      const isEqualInstallment = originalEqualInstallment.checked;
      
      // 验证输入
      if (isNaN(amount) || amount <= 0) {
        LoanUtils.showToast('请输入有效的原贷款金额', 'warning');
        return;
      }
      
      if (isNaN(term) || term <= 0) {
        LoanUtils.showToast('请输入有效的原贷款期限', 'warning');
        return;
      }
      
      if (isNaN(rate) || rate <= 0) {
        LoanUtils.showToast('请输入有效的原贷款年利率', 'warning');
        return;
      }
      
      if (isNaN(startDate.getTime())) {
        LoanUtils.showToast('请选择有效的贷款开始日期', 'warning');
        return;
      }
      
      if (isNaN(paid) || paid < 0) {
        LoanUtils.showToast('请输入有效的已还期数', 'warning');
        return;
      }
      
      if (isNaN(prepayment) || prepayment <= 0) {
        LoanUtils.showToast('请输入有效的提前还款金额', 'warning');
        return;
      }
      
      // 如果期限单位是年，转换为月
      if (originalTermUnit.value === 'year') {
        term *= 12;
      }
      
      // 计算提前还款
      const result = LoanPrepayment.calculatePrepayment(
        amount, term, rate, startDate,
        paid, prepayment, isReduceTerm, isEqualInstallment
      );
      
      // 显示结果摘要
      LoanUI.displayPrepaymentSummary(prepaymentSummary, result);
      
      // 显示对比结果
      LoanUI.displayPrepaymentComparison(prepaymentComparison, result, isReduceTerm);
      
      // 显示还款计划
      LoanUI.displaySchedule(prepaymentSchedule, result.newSchedule, 'all');
      
      // 显示图表
      if (prepaymentChartInstance) {
        prepaymentChartInstance.destroy();
      }
      
      prepaymentChartInstance = LoanCharts.displayPrepaymentChart(result, prepaymentChart);
      
      // 启用导出按钮
      exportPrepaymentBtn.disabled = false;
      
      return result;
    }
    
    // 返回公共方法
    return {
      calculatePrepayment
    };
  }
  
  // 导出模块
  window.initLoanCalculatorPart3 = initLoanCalculatorPart3;
})();