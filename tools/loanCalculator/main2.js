/**
 * 贷款计算器 - 主入口文件（第二部分）
 * 整合所有功能模块
 */

// 继续 main.js 的内容
(function() {
  // 这个函数将在主文件中被调用
  function initLoanCalculatorPart2(container) {
    // 获取元素引用（从主文件传入）
    const {
      combinedFirstDate, combinedSummary, combinedSchedule, combinedFilter,
      combinedChartInstance, exportCombinedBtn, calculateCombinedBtn, clearCombinedBtn,
      commercialAmount, commercialTerm, commercialRate,
      housingAmount, housingTerm, housingRate,
      combinedEqualInstallment
    } = container;
    
    // 计算组合贷款
    function calculateCombinedLoan() {
      // 获取输入值
      const cAmount = parseFloat(commercialAmount.value);
      const cTerm = parseInt(commercialTerm.value) * 12; // 转换为月
      const cRate = parseFloat(commercialRate.value) / 100;
      
      const hAmount = parseFloat(housingAmount.value);
      const hTerm = parseInt(housingTerm.value) * 12; // 转换为月
      const hRate = parseFloat(housingRate.value) / 100;
      
      const isEqualInstallment = combinedEqualInstallment.checked;
      const startDate = new Date(combinedFirstDate.value);
      
      // 验证输入
      if (isNaN(cAmount) || cAmount <= 0) {
        LoanUtils.showToast('请输入有效的商业贷款金额', 'warning');
        return;
      }
      
      if (isNaN(cTerm) || cTerm <= 0) {
        LoanUtils.showToast('请输入有效的商业贷款期限', 'warning');
        return;
      }
      
      if (isNaN(cRate) || cRate <= 0) {
        LoanUtils.showToast('请输入有效的商业贷款年利率', 'warning');
        return;
      }
      
      if (isNaN(hAmount) || hAmount <= 0) {
        LoanUtils.showToast('请输入有效的公积金贷款金额', 'warning');
        return;
      }
      
      if (isNaN(hTerm) || hTerm <= 0) {
        LoanUtils.showToast('请输入有效的公积金贷款期限', 'warning');
        return;
      }
      
      if (isNaN(hRate) || hRate <= 0) {
        LoanUtils.showToast('请输入有效的公积金贷款年利率', 'warning');
        return;
      }
      
      if (isNaN(startDate.getTime())) {
        LoanUtils.showToast('请选择有效的首次还款日期', 'warning');
        return;
      }
      
      // 计算组合贷款
      const result = LoanCore.calculateCombinedLoan(
        cAmount, cTerm, cRate,
        hAmount, hTerm, hRate,
        isEqualInstallment, startDate
      );
      
      // 显示结果摘要
      LoanUI.displayCombinedSummary(
        combinedSummary,
        cAmount, cTerm, cRate,
        hAmount, hTerm, hRate,
        result.totalPayment,
        result.totalInterest,
        result.totalMonthlyPayment,
        isEqualInstallment
      );
      
      // 显示还款计划
      LoanUI.displayCombinedSchedule(combinedSchedule, result.schedule, combinedFilter.value);
      
      // 显示图表
      if (combinedChartInstance) {
        combinedChartInstance.destroy();
      }
      
      combinedChartInstance = LoanCharts.displayCombinedChart(result.schedule, combinedChart);
      
      // 启用导出按钮
      exportCombinedBtn.disabled = false;
      
      return result;
    }
    
    // 返回公共方法
    return {
      calculateCombinedLoan
    };
  }
  
  // 导出模块
  window.initLoanCalculatorPart2 = initLoanCalculatorPart2;
})();