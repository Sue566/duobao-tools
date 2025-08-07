/**
 * 贷款计算器 - 主入口文件（第五部分）
 * 整合所有功能模块
 */

// 继续 main.js 的内容
(function() {
  // 这个函数将在主文件中被调用
  function initLoanCalculatorPart5(container) {
    // 获取元素引用（从主文件传入）
    const {
      loanSchedule, scheduleFilter, exportBtn, savePlanBtn,
      loanAmount, loanTerm, termUnit, interestRate, rateAdjustment,
      methodEqualInstallment, methodEqualPrincipal, methodInterestOnly,
      includeTax, includeInsurance, taxRate, insuranceRate
    } = container;
    
    // 导出还款计划
    function exportScheduleToCSV() {
      const schedule = loanSchedule.querySelectorAll('tbody tr');
      if (schedule.length === 0) {
        LoanUtils.showToast('没有可导出的还款计划', 'warning');
        return;
      }
      
      // 获取当前日期作为文件名的一部分
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10);
      
      LoanUI.exportScheduleToCSV(
        Array.from(schedule).map(row => {
          const cells = row.querySelectorAll('td');
          return {
            period: parseInt(cells[0].textContent),
            date: new Date(cells[1].textContent),
            payment: parseFloat(cells[2].textContent.replace(/[^\d.-]/g, '')),
            principal: parseFloat(cells[3].textContent.replace(/[^\d.-]/g, '')),
            interest: parseFloat(cells[4].textContent.replace(/[^\d.-]/g, '')),
            remainingPrincipal: parseFloat(cells[5].textContent.replace(/[^\d.-]/g, ''))
          };
        }),
        `贷款还款计划_${dateStr}.csv`
      );
      
      LoanUtils.showToast('还款计划已导出', 'success');
    }
    
    // 保存贷款方案
    function savePlan() {
      const planName = prompt('请输入方案名称：', `贷款方案 ${new Date().toLocaleDateString()}`);
      if (!planName) return;
      
      // 获取当前方案数据
      const amount = parseFloat(loanAmount.value);
      const term = parseInt(loanTerm.value);
      const isYearTerm = termUnit.value === 'year';
      const rate = parseFloat(interestRate.value);
      const adjustment = parseFloat(rateAdjustment.value);
      const repaymentMethod = methodEqualInstallment.checked ? 'equal-installment' : 
                             methodEqualPrincipal.checked ? 'equal-principal' : 'interest-only';
      
      // 创建方案对象
      const plan = {
        name: planName,
        date: new Date().toISOString(),
        type: 'basic',
        data: {
          amount,
          term,
          isYearTerm,
          rate,
          adjustment,
          repaymentMethod,
          includeTax: includeTax.checked,
          includeInsurance: includeInsurance.checked,
          taxRate: parseFloat(taxRate.value),
          insuranceRate: parseFloat(insuranceRate.value)
        }
      };
      
      // 保存到本地存储
      const savedPlans = JSON.parse(localStorage.getItem('savedLoanPlans') || '[]');
      savedPlans.push(plan);
      localStorage.setItem('savedLoanPlans', JSON.stringify(savedPlans));
      
      LoanUtils.showToast('方案已保存', 'success');
    }
    
    // 返回公共方法
    return {
      exportScheduleToCSV,
      savePlan
    };
  }
  
  // 导出模块
  window.initLoanCalculatorPart5 = initLoanCalculatorPart5;
})();