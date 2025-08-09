/**
 * 贷款计算器 - 基础贷款计算模块
 */
(function() {
  // 定义基础贷款模块
  const BasicLoan = {
    // 图表实例
    chartInstance: null,
    
    // 当前图表类型
    currentChartType: 'payment',
    
    // 初始化模块
    init: function() {
      // 获取DOM元素
      this.loanType = document.getElementById('loan-type');
      this.loanAmount = document.getElementById('loan-amount');
      this.loanTerm = document.getElementById('loan-term');
      this.termUnit = document.getElementById('term-unit');
      this.interestRate = document.getElementById('interest-rate');
      this.rateAdjustment = document.getElementById('rate-adjustment');
      this.rateReference = document.getElementById('rate-reference');
      this.methodEqualInstallment = document.getElementById('method-equal-installment');
      this.methodEqualPrincipal = document.getElementById('method-equal-principal');
      this.methodInterestOnly = document.getElementById('method-interest-only');
      this.firstPaymentDate = document.getElementById('first-payment-date');
      this.includeTax = document.getElementById('include-tax');
      this.includeInsurance = document.getElementById('include-insurance');
      this.taxInsuranceDetails = document.getElementById('tax-insurance-details');
      this.taxRate = document.getElementById('tax-rate');
      this.insuranceRate = document.getElementById('insurance-rate');
      this.calculateBtn = document.getElementById('calculate-btn');
      this.clearBtn = document.getElementById('clear-btn');
      this.savePlanBtn = document.getElementById('save-plan-btn');
      this.exportBtn = document.getElementById('export-btn');
      this.loanSummary = document.getElementById('loan-summary');
      this.loanChart = document.getElementById('loan-chart');
      this.chartTypeButtons = document.querySelectorAll('.chart-type-btn');
      this.scheduleFilter = document.getElementById('schedule-filter');
      this.loanSchedule = document.getElementById('loan-schedule');
      
      // 设置默认首次还款日期为下个月1日
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      this.firstPaymentDate.value = nextMonth.toISOString().slice(0, 10);
      
      // 利率参考数据
      this.rateReferenceData = {
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
      
      // 绑定事件
      this.bindEvents();
      
      // 初始禁用导出按钮和保存方案按钮
      this.exportBtn.disabled = true;
      this.savePlanBtn.disabled = true;
    },
    
    // 绑定事件
    bindEvents: function() {
      // 图表类型切换
      this.chartTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.chartTypeButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentChartType = btn.dataset.type;
          
          // 重新计算以更新图表
          this.calculateLoan();
        });
      });
      
      // 显示/隐藏税费和保险详情
      this.includeTax.addEventListener('change', this.updateTaxInsuranceVisibility.bind(this));
      this.includeInsurance.addEventListener('change', this.updateTaxInsuranceVisibility.bind(this));
      
      // 显示利率参考
      this.rateReference.addEventListener('click', () => {
        const type = this.loanType.value;
        LoanUI.showRateReference(type, this.rateReferenceData, (rate) => {
          this.interestRate.value = rate;
        });
      });
      
      // 计算贷款
      this.calculateBtn.addEventListener('click', this.calculateLoan.bind(this));
      
      // 清空输入
      this.clearBtn.addEventListener('click', this.clearInputs.bind(this));
      
      // 导出和保存
      this.exportBtn.addEventListener('click', () => ExportTools.exportScheduleToCSV('basic'));
      this.savePlanBtn.addEventListener('click', () => ExportTools.savePlan('basic'));
      
      // 过滤器变更时更新还款计划
      this.scheduleFilter.addEventListener('change', () => {
        // 重新计算贷款以更新显示
        this.calculateLoan();
      });
      
      // 期限单位变更时调整默认值
      this.termUnit.addEventListener('change', () => {
        if (this.termUnit.value === 'year') {
          // 如果切换到年，默认值除以12（向上取整）
          const currentTerm = parseInt(this.loanTerm.value);
          if (!isNaN(currentTerm) && currentTerm > 12) {
            this.loanTerm.value = Math.ceil(currentTerm / 12);
          }
        } else {
          // 如果切换到月，默认值乘以12
          const currentTerm = parseInt(this.loanTerm.value);
          if (!isNaN(currentTerm) && currentTerm < 30) {
            this.loanTerm.value = currentTerm * 12;
          }
        }
      });
      
      // 贷款类型变更时更新默认利率
      this.loanType.addEventListener('change', () => {
        if (this.loanType.value === 'commercial') {
          this.interestRate.value = '4.35';
        } else if (this.loanType.value === 'housing') {
          this.interestRate.value = '3.25';
        }
      });
    },
    
    // 更新税费和保险详情的可见性
    updateTaxInsuranceVisibility: function() {
      if (this.includeTax.checked || this.includeInsurance.checked) {
        this.taxInsuranceDetails.style.display = 'block';
      } else {
        this.taxInsuranceDetails.style.display = 'none';
      }
    },
    
    // 计算贷款
    calculateLoan: function() {
      // 获取输入值
      const amount = parseFloat(this.loanAmount.value);
      let term = parseInt(this.loanTerm.value);
      const baseRate = parseFloat(this.interestRate.value) / 100;
      const adjustment = parseFloat(this.rateAdjustment.value) / 100;
      const rate = baseRate + adjustment;
      const isEqualInstallment = this.methodEqualInstallment.checked;
      const isEqualPrincipal = this.methodEqualPrincipal.checked;
      const isInterestOnly = this.methodInterestOnly.checked;
      const startDate = new Date(this.firstPaymentDate.value);
      
      // 计算税费和保险
      let additionalCosts = 0;
      if (this.includeTax.checked) {
        additionalCosts += amount * (parseFloat(this.taxRate.value) / 100);
      }
      if (this.includeInsurance.checked) {
        additionalCosts += amount * (parseFloat(this.insuranceRate.value) / 100);
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
      if (this.includeTax.checked && (isNaN(parseFloat(this.taxRate.value)) || parseFloat(this.taxRate.value) < 0)) {
        LoanUtils.showToast('请输入有效的契税税率', 'warning');
        return;
      }
      
      if (this.includeInsurance.checked && (isNaN(parseFloat(this.insuranceRate.value)) || parseFloat(this.insuranceRate.value) < 0)) {
        LoanUtils.showToast('请输入有效的保险费率', 'warning');
        return;
      }
      
      // 如果期限单位是年，转换为月
      if (this.termUnit.value === 'year') {
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
      
      // 保存结果到全局变量，供导出使用
      window.basicLoanResult = result;
      window.basicLoanParams = {
        amount, additionalCosts, term, rate, 
        isEqualInstallment, isEqualPrincipal, isInterestOnly
      };
      
      // 显示结果摘要
      LoanUI.displaySummary(
        this.loanSummary,
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
      LoanUI.displaySchedule(this.loanSchedule, result.schedule, this.scheduleFilter.value);
      
      // 显示图表
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      
      if (this.currentChartType === 'payment') {
        this.chartInstance = LoanCharts.displayPaymentChart(result.schedule, this.loanChart);
      } else if (this.currentChartType === 'balance') {
        this.chartInstance = LoanCharts.displayBalanceChart(result.schedule, this.loanChart);
      } else if (this.currentChartType === 'ratio') {
        this.chartInstance = LoanCharts.displayRatioChart(result.schedule, this.loanChart);
      }
      
      // 启用导出按钮和保存方案按钮
      this.exportBtn.disabled = false;
      this.savePlanBtn.disabled = false;
      
      return result;
    },
    
    // 清空输入
    clearInputs: function() {
      this.loanAmount.value = '100000';
      this.loanTerm.value = '12';
      this.termUnit.value = 'month';
      this.interestRate.value = '4.35';
      this.rateAdjustment.value = '0';
      this.methodEqualInstallment.checked = true;
      this.includeTax.checked = false;
      this.includeInsurance.checked = false;
      this.taxInsuranceDetails.style.display = 'none';
      
      // 重置首次还款日期为下个月1日
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      this.firstPaymentDate.value = nextMonth.toISOString().slice(0, 10);
      
      // 清空结果
      this.loanSummary.innerHTML = '';
      this.loanSchedule.querySelector('tbody').innerHTML = '';
      
      // 销毁图表
      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.chartInstance = null;
      }
      
      // 禁用导出按钮和保存方案按钮
      this.exportBtn.disabled = true;
      this.savePlanBtn.disabled = true;
    }
  };
  
  // 导出模块
  window.BasicLoan = BasicLoan;
})();