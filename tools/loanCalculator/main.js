/**
 * 贷款计算器 - 主入口文件
 * 整合所有功能模块
 */

(function() {
  // 页面加载完成后初始化
  document.addEventListener('DOMContentLoaded', function() {
    initLoanCalculator();
  });

  function initLoanCalculator() {
    // 获取元素 - 标签页
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // 基础计算元素
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
    
    // 保存的贷款方案
    const savedPlans = JSON.parse(localStorage.getItem('savedLoanPlans') || '[]');
    
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
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
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
        LoanUtils.show