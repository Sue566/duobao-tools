/**
 * 贷款计算器 - 主入口文件
 * 整合所有模块
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 加载HTML内容
      fetch('tools/loanCalculator/index.html')
        .then(response => response.text())
        .then(html => {
          // 创建工具界面
          container.innerHTML = html;
          
          // 添加收藏按钮
          window.addFavoriteButton('loanCalculator', container.querySelector('.tool-header'));
          
          // 加载样式
          const style = document.createElement('style');
          fetch('tools/loanCalculator/styles.css')
            .then(response => response.text())
            .then(css => {
              style.textContent = css;
              container.appendChild(style);
            });
          
          // 初始化贷款计算器
          initJsonFormatter();
        })
        .catch(error => {
          console.error('加载贷款计算器失败:', error);
          container.innerHTML = `
            <div class="tool-header">
              <h2><i class="fa fa-money"></i> 贷款计算器</h2>
              <p class="tool-description">加载失败，请刷新页面重试。</p>
            </div>
          `;
        });
    }
  };
  
  // 初始化贷款计算器
  function initJsonFormatter() {
    // 确保所有模块都已加载
    if (!window.LoanCore || !window.LoanUtils || !window.LoanUI || 
        !window.LoanCharts || !window.LoanPrepayment || !window.LoanCompare) {
      console.error('贷款计算器模块未完全加载');
      return;
    }
    
    // 获取DOM元素
    const loanType = document.getElementById('loan-type');
    const loanAmount = document.getElementById('loan-amount');
    const loanTerm = document.getElementById('loan-term');
    const termUnit = document.getElementById('term-unit');
    const interestRate = document.getElementById('interest-rate');
    const rateAdjustment = document.getElementById('rate-adjustment');
    const rateReference = document.getElementById('rate-reference');
    const methodEqualInstallment = document.getElementById('method-equal-installment');
    const methodEqualPrincipal = document.getElementById('method-equal-principal');
    const methodInterestOnly = document.getElementById('method-interest-only');
    const firstPaymentDate = document.getElementById('first-payment-date');
    const includeTax = document.getElementById('include-tax');
    const includeInsurance = document.getElementById('include-insurance');
    const taxInsuranceDetails = document.getElementById('tax-insurance-details');
    const taxRate = document.getElementById('tax-rate');
    const insuranceRate = document.getElementById('insurance-rate');
    const calculateBtn = document.getElementById('calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const savePlanBtn = document.getElementById('save-plan-btn');
    const exportBtn = document.getElementById('export-btn');
    const loanSummary = document.getElementById('loan-summary');
    const loanChart = document.getElementById('loan-chart');
    const chartTypeButtons = document.querySelectorAll('.chart-type-btn');
    const scheduleFilter = document.getElementById('schedule-filter');
    const loanSchedule = document.getElementById('loan-schedule');
    
    // 组合贷款元素
    const commercialAmount = document.getElementById('commercial-amount');
    const commercialTerm = document.getElementById('commercial-term');
    const commercialRate = document.getElementById('commercial-rate');
    const housingAmount = document.getElementById('housing-amount');
    const housingTerm = document.getElementById('housing-term');
    const housingRate = document.getElementById('housing-rate');
    const combinedEqualInstallment = document.getElementById('combined-equal-installment');
    const combinedEqualPrincipal = document.getElementById('combined-equal-principal');
    const combinedFirstDate = document.getElementById('combined-first-date');
    const calculateCombinedBtn = document.getElementById('calculate-combined-btn');
    const clearCombinedBtn = document.getElementById('clear-combined-btn');
    const exportCombinedBtn = document.getElementById('export-combined-btn');
    const combinedSummary = document.getElementById('combined-summary');
    const combinedChart = document.getElementById('combined-chart');
    const combinedFilter = document.getElementById('combined-filter');
    const combinedSchedule = document.getElementById('combined-schedule');
    
    // 提前还款元素
    const originalAmount = document.getElementById('original-amount');
    const originalTerm = document.getElementById('original-term');
    const originalTermUnit = document.getElementById('original-term-unit');
    const originalRate = document.getElementById('original-rate');
    const loanStartDate = document.getElementById('loan-start-date');
    const alreadyPaid = document.getElementById('already-paid');
    const prepaymentAmount = document.getElementById('prepayment-amount');
    const methodReduceTerm = document.getElementById('method-reduce-term');
    const methodReduceAmount = document.getElementById('method-reduce-amount');
    const originalEqualInstallment = document.getElementById('original-equal-installment');
    const originalEqualPrincipal = document.getElementById('original-equal-principal');
    const calculatePrepaymentBtn = document.getElementById('calculate-prepayment-btn');
    const clearPrepaymentBtn = document.getElementById('clear-prepayment-btn');
    const exportPrepaymentBtn = document.getElementById('export-prepayment-btn');
    const prepaymentSummary = document.getElementById('prepayment-summary');
    const prepaymentComparison = document.getElementById('prepayment-comparison');
    const prepaymentChart = document.getElementById('prepayment-chart');
    const prepaymentSchedule = document.getElementById('prepayment-schedule');
    
    // 方案比较元素
    const compareAmount = document.getElementById('compare-amount');
    const compareTerm = document.getElementById('compare-term');
    const compareCommercial = document.getElementById('compare-commercial');
    const compareHousing = document.getElementById('compare-housing');
    const compareCombined = document.getElementById('compare-combined');
    const combinedRatio = document.getElementById('combined-ratio');
    const commercialRatio = document.getElementById('commercial-ratio');
    const housingRatio = document.getElementById('housing-ratio');
    const compareEqualInstallment = document.getElementById('compare-equal-installment');
    const compareEqualPrincipal = document.getElementById('compare-equal-principal');
    const calculateCompareBtn = document.getElementById('calculate-compare-btn');
    const clearCompareBtn = document.getElementById('clear-compare-btn');
    const exportCompareBtn = document.getElementById('export-compare-btn');
    const compareChart = document.getElementById('compare-chart');
    const compareTable = document.getElementById('compare-table');
    
    // 设置默认首次还款日期为下个月1日
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    firstPaymentDate.value = nextMonth.toISOString().slice(0, 10);
    combinedFirstDate.value = nextMonth.toISOString().slice(0, 10);
    
    // 设置默认贷款开始日期为一年前
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), 1);
    loanStartDate.value = oneYearAgo.toISOString().slice(0, 10);
    
    // 图表实例
    let basicChartInstance = null;
    let combinedChartInstance = null;
    let prepaymentChartInstance = null;
    let compareChartInstance = null;
    
    // 当前图表类型
    let currentChartType = 'payment';
    
    // 利率参考数据
    const rateReferenceData = {
      commercial: {
        name: '商业贷款基准利率',
        rates: [
          { term: '6个月以内（含6个月）', rate: 3.70 },
          { term: '6个月至1年（含1年）', rate: 3.90 },
          { term: '1至3年（含3年）', rate: 4.10 },
          { term: '3至5年（含5年）', rate: 4.75 },
          { term: '5年以上', rate: 4.90 }
        ]
      },
      housing: {
        name: '公积金贷款基准利率',
        rates: [
          { term: '5年以下（含5年）', rate: 2.75 },
          { term: '5年以上', rate: 3.25 }
        ]
      }
    };
    
    // 标签页切换
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      });
    });
    
    // 图表类型切换
    chartTypeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        chartTypeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentChartType = btn.dataset.type;
        
        // 重新计算以更新图表
        calculateLoan();
      });
    });
    
    // 显示/隐藏税费和保险详情
    includeTax.addEventListener('change', updateTaxInsuranceVisibility);
    includeInsurance.addEventListener('change', updateTaxInsuranceVisibility);
    
    function updateTaxInsuranceVisibility() {
      if (includeTax.checked || includeInsurance.checked) {
        taxInsuranceDetails.style.display = 'block';
      } else {
        taxInsuranceDetails.style.display = 'none';
      }
    }
    
    // 组合贷款比例滑块
    combinedRatio.addEventListener('input', updateCombinedRatio);
    
    function updateCombinedRatio() {
      const ratio = combinedRatio.value;
      commercialRatio.textContent = ratio + '%';
      housingRatio.textContent = (100 - ratio) + '%';
    }
    
    // 显示利率参考
    rateReference.addEventListener('click', () => {
      const type = loanType.value;
      LoanUI.showRateReference(type, rateReferenceData, (rate) => {
        interestRate.value = rate;
      });
    });
    
    // 计算基础贷款
    function calculateLoan() {
      // 获取输入值
      const amount = parseFloat(loanAmount.value);
      let term = parseInt(loanTerm.value);
      const baseRate = parseFloat(interestRate.value) / 100;
      const adjustment = parseFloat(rateAdjustment.value) / 100;
      const rate = baseRate + adjustment;
      const isEqualInstallment = methodEqualInstallment.checked;
      const isEqualPrincipal = methodEqualPrincipal.checked;
      const isInterestOnly = methodInterestOnly.checked;
      const startDate = new Date(firstPaymentDate.value);
      
      // 计算税费和保险
      let additionalCosts = 0;
      if (includeTax.checked) {
        additionalCosts += amount * (parseFloat(taxRate.value) / 100);
      }
      if (includeInsurance.checked) {
        additionalCosts += amount * (parseFloat(insuranceRate.value) / 100);
      }
      
      // 验证输入
      if (isNaN(amount) || amount <= 0) {
        LoanUtils.showToast('请输入有效的贷款金额', 'warning');
        return;
      }
      
      if (isNaN(term) || term <= 0) {
        LoanUtils.showToast('请输入有效的贷款期限', 'warning');
        return;
      }
      
      if (isNaN(rate) || rate <= 0) {
        LoanUtils.showToast('请输入有效的年利率', 'warning');
        return;
      }
      
      if (isNaN(startDate.getTime())) {
        LoanUtils.showToast('请选择有效的首次还款日期', 'warning');
        return;
      }
      
      // 验证税费和保险
      if (includeTax.checked && (isNaN(parseFloat(taxRate.value)) || parseFloat(taxRate.value) < 0)) {
        LoanUtils.showToast('请输入有效的契税税率', 'warning');
        return;
      }
      
      if (includeInsurance.checked && (isNaN(parseFloat(insuranceRate.value)) || parseFloat(insuranceRate.value) < 0)) {
        LoanUtils.showToast('请输入有效的保险费率', 'warning');
        return;
      }
      
      // 如果期限单位是年，转换为月
      if (termUnit.value === 'year') {
        term *= 12;
      }
      
      // 计算还款计划
      let result;
      if (isEqualInstallment) {
        result = LoanCore.calculateEqualInstallment(amount, term, rate, startDate);
      } else if (isEqualPrincipal) {
        result = LoanCore.calculateEqualPrincipal(amount, term, rate, startDate);
      } else if (isInterestOnly) {
        result = LoanCore.calculateInterestOnly(amount, term, rate, startDate);
      }
      
      // 显示结果摘要
      LoanUI.displaySummary(
        loanSummary,
        amount, 
        additionalCosts, 
        term, 
        rate, 
        result.totalPayment, 
        result.totalInterest, 
        isEqualInstallment, 
        isEqualPrincipal, 
        isInterestOnly
      );
      
      // 显示还款计划
      LoanUI.displaySchedule(loanSchedule, result.schedule, scheduleFilter.value);
      
      // 显示图表
      if (basicChartInstance) {
        basicChartInstance.destroy();
      }
      
      if (currentChartType === 'payment') {
        basicChartInstance = LoanCharts.displayPaymentChart(result.schedule, loanChart);
      } else if (currentChartType === 'balance') {
        basicChartInstance = LoanCharts.displayBalanceChart(result.schedule, loanChart);
      } else if (currentChartType === 'ratio') {
        basicChartInstance = LoanCharts.displayRatioChart(result.schedule, loanChart);
      }
      
      // 启用导出按钮和保存方案按钮
      exportBtn.disabled = false;
      savePlanBtn.disabled = false;
      
      return result;
    }
    
    // 创建容器对象，用于传递给各个模块
    const container = {
      // 基础计算元素
      loanType, loanAmount, loanTerm, termUnit, interestRate, rateAdjustment,
      methodEqualInstallment, methodEqualPrincipal, methodInterestOnly,
      firstPaymentDate, includeTax, includeInsurance, taxRate, insuranceRate,
      calculateBtn, clearBtn, savePlanBtn, exportBtn, loanSummary, loanChart,
      chartTypeButtons, scheduleFilter, loanSchedule, basicChartInstance,
      
      // 组合贷款元素
      commercialAmount, commercialTerm, commercialRate,
      housingAmount, housingTerm, housingRate,
      combinedEqualInstallment, combinedEqualPrincipal, combinedFirstDate,
      calculateCombinedBtn, clearCombinedBtn, exportCombinedBtn,
      combinedSummary, combinedChart, combinedFilter, combinedSchedule,
      combinedChartInstance,
      
      // 提前还款元素
      originalAmount, originalTerm, originalTermUnit, originalRate,
      loanStartDate, alreadyPaid, prepaymentAmount,
      methodReduceTerm, methodReduceAmount,
      originalEqualInstallment, originalEqualPrincipal,
      calculatePrepaymentBtn, clearPrepaymentBtn, exportPrepaymentBtn,
      prepaymentSummary, prepaymentComparison, prepaymentChart, prepaymentSchedule,
      prepaymentChartInstance,
      
      // 方案比较元素
      compareAmount, compareTerm, compareCommercial, compareHousing, compareCombined,
      combinedRatio, commercialRatio, housingRatio,
      compareEqualInstallment, compareEqualPrincipal,
      calculateCompareBtn, clearCompareBtn, exportCompareBtn,
      compareChart, compareTable, compareChartInstance
    };
    
    // 初始化各个模块
    const part2 = window.initLoanCalculatorPart2(container);
    const part3 = window.initLoanCalculatorPart3(container);
    const part4 = window.initLoanCalculatorPart4(container);
    const part5 = window.initLoanCalculatorPart5(container);
    
    // 事件监听 - 基础计算
    calculateBtn.addEventListener('click', calculateLoan);
    
    clearBtn.addEventListener('click', () => {
      loanAmount.value = '100000';
      loanTerm.value = '12';
      termUnit.value = 'month';
      interestRate.value = '4.35';
      rateAdjustment.value = '0';
      methodEqualInstallment.checked = true;
      includeTax.checked = false;
      includeInsurance.checked = false;
      taxInsuranceDetails.style.display = 'none';
      
      // 重置首次还款日期为下个月1日
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      firstPaymentDate.value = nextMonth.toISOString().slice(0, 10);
      
      // 清空结果
      loanSummary.innerHTML = '';
      loanSchedule.querySelector('tbody').innerHTML = '';
      
      // 销毁图表
      if (basicChartInstance) {
        basicChartInstance.destroy();
        basicChartInstance = null;
      }
      
      // 禁用导出按钮和保存方案按钮
      exportBtn.disabled = true;
      savePlanBtn.disabled = true;
    });
    
    exportBtn.addEventListener('click', part5.exportScheduleToCSV);
    savePlanBtn.addEventListener('click', part5.savePlan);
    
    // 过滤器变更时更新还款计划
    scheduleFilter.addEventListener('change', () => {
      // 重新计算贷款以更新显示
      calculateLoan();
    });
    
    // 期限单位变更时调整默认值
    termUnit.addEventListener('change', () => {
      if (termUnit.value === 'year') {
        // 如果切换到年，默认值除以12（向上取整）
        const currentTerm = parseInt(loanTerm.value);
        if (!isNaN(currentTerm) && currentTerm > 12) {
          loanTerm.value = Math.ceil(currentTerm / 12);
        }
      } else {
        // 如果切换到月，默认值乘以12
        const currentTerm = parseInt(loanTerm.value);
        if (!isNaN(currentTerm) && currentTerm < 30) {
          loanTerm.value = currentTerm * 12;
        }
      }
    });
    
    // 贷款类型变更时更新默认利率
    loanType.addEventListener('change', () => {
      if (loanType.value === 'commercial') {
        interestRate.value = '4.35';
      } else if (loanType.value === 'housing') {
        interestRate.value = '3.25';
      }
    });
    
    // 事件监听 - 组合贷款
    calculateCombinedBtn.addEventListener('click', part2.calculateCombinedLoan);
    
    clearCombinedBtn.addEventListener('click', () => {
      commercialAmount.value = '500000';
      commercialTerm.value = '30';
      commercialRate.value = '4.35';
      housingAmount.value = '300000';
      housingTerm.value = '30';
      housingRate.value = '3.25';
      combinedEqualInstallment.checked = true;
      
      // 重置首次还款日期为下个月1日
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      combinedFirstDate.value = nextMonth.toISOString().slice(0, 10);
      
      // 清空结果
      combinedSummary.innerHTML = '';
      combinedSchedule.querySelector('tbody').innerHTML = '';
      
      // 销毁图表
      if (combinedChartInstance) {
        combinedChartInstance.destroy();
        combinedChartInstance = null;
      }
      
      // 禁用导出按钮
      exportCombinedBtn.disabled = true;
    });
    
    // 事件监听 - 提前还款
    calculatePrepaymentBtn.addEventListener('click', part3.calculatePrepayment);
    
    clearPrepaymentBtn.addEventListener('click', () => {
      originalAmount.value = '500000';
      originalTerm.value = '30';
      originalTermUnit.value = 'year';
      originalRate.value = '4.35';
      alreadyPaid.value = '12';
      prepaymentAmount.value = '100000';
      methodReduceTerm.checked = true;
      originalEqualInstallment.checked = true;
      
      // 重置贷款开始日期为一年前
      const today = new Date();
      const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), 1);
      loanStartDate.value = oneYearAgo.toISOString().slice(0, 10);
      
      // 清空结果
      prepaymentSummary.innerHTML = '';
      prepaymentComparison.innerHTML = '';
      prepaymentSchedule.querySelector('tbody').innerHTML = '';
      
      // 销毁图表
      if (prepaymentChartInstance) {
        prepaymentChartInstance.destroy();
        prepaymentChartInstance = null;
      }
      
      // 禁用导出按钮
      exportPrepaymentBtn.disabled = true;
    });
    
    // 事件监听 - 方案比较
    calculateCompareBtn.addEventListener('click', part4.compareLoans);
    
    clearCompareBtn.addEventListener('click', () => {
      compareAmount.value = '500000';
      compareTerm.value = '30';
      compareCommercial.checked = true;
      compareHousing.checked = true;
      compareCombined.checked = true;
      combinedRatio.value = '50';
      updateCombinedRatio();
      compareEqualInstallment.checked = true;
      compareEqualPrincipal.checked = true;
      
      // 清空结果
      compareTable.querySelector('tbody').innerHTML = '';
      
      // 销毁图表
      if (compareChartInstance) {
        compareChartInstance.destroy();
        compareChartInstance = null;
      }
      
      // 禁用导出按钮
      exportCompareBtn.disabled = true;
    });
    
    // 初始禁用导出按钮和保存方案按钮
    exportBtn.disabled = true;
    savePlanBtn.disabled = true;
    exportCombinedBtn.disabled = true;
    exportPrepaymentBtn.disabled = true;
    exportCompareBtn.disabled = true;
    
    // 加载Chart.js库
    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      document.head.appendChild(script);
      
      script.onload = () => {
        LoanUtils.showToast('Chart.js库加载成功', 'success');
      };
      
      script.onerror = () => {
        LoanUtils.showToast('Chart.js库加载失败，请检查网络连接', 'error');
      };
    }
  }
  
  // 注册工具
  window.tools.loanCalculator = tool;
})();