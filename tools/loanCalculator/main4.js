/**
 * 贷款计算器 - 主入口文件（第四部分）
 * 整合所有功能模块
 */

// 继续 main.js 的内容
(function() {
  // 这个函数将在主文件中被调用
  function initLoanCalculatorPart4(container) {
    // 获取元素引用（从主文件传入）
    const {
      compareAmount, compareTerm, compareCommercial, compareHousing, compareCombined,
      combinedRatio, compareEqualInstallment, compareEqualPrincipal,
      compareTable, compareChart, compareChartInstance, exportCompareBtn
    } = container;
    
    // 比较贷款方案
    function compareLoans() {
      // 获取输入值
      const amount = parseFloat(compareAmount.value);
      const term = parseInt(compareTerm.value) * 12; // 转换为月
      const includeCommercial = compareCommercial.checked;
      const includeHousing = compareHousing.checked;
      const includeCombined = compareCombined.checked;
      const ratio = parseInt(combinedRatio.value);
      const includeEqualInstallment = compareEqualInstallment.checked;
      const includeEqualPrincipal = compareEqualPrincipal.checked;
      
      // 验证输入
      if (isNaN(amount) || amount <= 0) {
        LoanUtils.showToast('请输入有效的贷款金额', 'warning');
        return;
      }
      
      if (isNaN(term) || term <= 0) {
        LoanUtils.showToast('请输入有效的贷款期限', 'warning');
        return;
      }
      
      if (!includeCommercial && !includeHousing && !includeCombined) {
        LoanUtils.showToast('请至少选择一种贷款方案', 'warning');
        return;
      }
      
      if (!includeEqualInstallment && !includeEqualPrincipal) {
        LoanUtils.showToast('请至少选择一种还款方式', 'warning');
        return;
      }
      
      // 比较贷款方案
      const results = LoanCompare.compareLoans(
        amount, term,
        includeCommercial, includeHousing, includeCombined,
        ratio, includeEqualInstallment, includeEqualPrincipal
      );
      
      // 显示比较表格
      LoanUI.displayCompareTable(compareTable, results);
      
      // 显示图表
      if (compareChartInstance) {
        compareChartInstance.destroy();
      }
      
      compareChartInstance = LoanCharts.displayCompareChart(results, compareChart);
      
      // 启用导出按钮
      exportCompareBtn.disabled = false;
      
      return results;
    }
    
    // 返回公共方法
    return {
      compareLoans
    };
  }
  
  // 导出模块
  window.initLoanCalculatorPart4 = initLoanCalculatorPart4;
})();