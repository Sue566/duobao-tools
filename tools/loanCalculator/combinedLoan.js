/**
 * 贷款计算器 - 组合贷款计算模块
 */
(function() {
  // 定义组合贷款模块
  const CombinedLoan = {
    // 图表实例
    chartInstance: null,
    
    // 初始化模块
    init: function() {
      // 获取DOM元素
      this.commercialAmount = document.getElementById('commercial-amount');
      this.commercialTerm = document.getElementById('commercial-term');
      this.commercialRate = document.getElementById('commercial-rate');
      this.housingAmount = document.getElementById('housing-amount');
      this.housingTerm = document.getElementById('housing-term');
      this.housingRate = document.getElementById('housing-rate');
      this.combinedEqualInstallment = document.getElementById('combined-equal-installment');
      this.combinedEqualPrincipal = document.getElementById('combined-equal-principal');
      this.combinedFirstDate = document.getElementById('combined-first-date');
      this.calculateCombinedBtn = document.getElementById('calculate-combined-btn');
      this.clearCombinedBtn = document.getElementById('clear-combined-btn');
      this.exportCombinedBtn = document.getElementById('export-combined-btn');
      this.combinedSummary = document.getElementById('combined-summary');
      this.combinedChart = document.getElementById('combined-chart');
      this.combinedFilter = document.getElementById('combined-filter');
      this.combinedSchedule = document.getElementById('combined-schedule');
      
      // 设置默认首次还款日期为下个月1日
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      this.combinedFirstDate.value = nextMonth.toISOString().slice(0, 10);
      
      // 绑定事件
      this.bindEvents();
      
      // 初始禁用导出按钮
      this.exportCombinedBtn.disabled = true;
    },
    
    // 绑定事件
    bindEvents: function() {
      // 计算组合贷款
      this.calculateCombinedBtn.addEventListener('click', this.calculateCombinedLoan.bind(this));
      
      // 清空输入
      this.clearCombinedBtn.addEventListener('click', this.clearInputs.bind(this));
      
      // 导出
      this.exportCombinedBtn.addEventListener('click', () => ExportTools.exportScheduleToCSV('combined'));
      
      // 过滤器变更时更新还款计划
      this.combinedFilter.addEventListener('change', () => {
        // 如果已经计算过，重新显示结果
        if (window.combinedLoanResult) {
          this.displayCombinedResults(window.combinedLoanResult);
        }
      });
    },
    
    // 计算组合贷款
    calculateCombinedLoan: function() {
      // 获取商业贷款输入值
      const commercialAmount = parseFloat(this.commercialAmount.value);
      const commercialTerm = parseInt(this.commercialTerm.value) * 12; // 转换为月
      const commercialRate = parseFloat(this.commercialRate.value) / 100;
      
      // 获取公积金贷款输入值
      const housingAmount = parseFloat(this.housingAmount.value);
      const housingTerm = parseInt(this.housingTerm.value) * 12; // 转换为月
      const housingRate = parseFloat(this.housingRate.value) / 100;
      
      // 获取其他输入值
      const isEqualInstallment = this.combinedEqualInstallment.checked;
      const isEqualPrincipal = this.combinedEqualPrincipal.checked;
      const startDate = new Date(this.combinedFirstDate.value);
      
      // 验证输入
      if (isNaN(commercialAmount) || commercialAmount <= 0) {
        LoanUtils.showToast('请输入有效的商业贷款金额', 'warning');
        return;
      }
      
      if (isNaN(commercialTerm) || commercialTerm <= 0) {
        LoanUtils.showToast('请输入有效的商业贷款期限', 'warning');
        return;
      }
      
      if (isNaN(commercialRate) || commercialRate <= 0) {
        LoanUtils.showToast('请输入有效的商业贷款年利率', 'warning');
        return;
      }
      
      if (isNaN(housingAmount) || housingAmount <= 0) {
        LoanUtils.showToast('请输入有效的公积金贷款金额', 'warning');
        return;
      }
      
      if (isNaN(housingTerm) || housingTerm <= 0) {
        LoanUtils.showToast('请输入有效的公积金贷款期限', 'warning');
        return;
      }
      
      if (isNaN(housingRate) || housingRate <= 0) {
        LoanUtils.showToast('请输入有效的公积金贷款年利率', 'warning');
        return;
      }
      
      if (isNaN(startDate.getTime())) {
        LoanUtils.showToast('请选择有效的首次还款日期', 'warning');
        return;
      }
      
      // 计算商业贷款还款计划
      let commercialResult;
      if (isEqualInstallment) {
        commercialResult = LoanCore.calculateEqualInstallment(commercialAmount, commercialTerm, commercialRate, startDate);
      } else if (isEqualPrincipal) {
        commercialResult = LoanCore.calculateEqualPrincipal(commercialAmount, commercialTerm, commercialRate, startDate);
      }
      
      // 计算公积金贷款还款计划
      let housingResult;
      if (isEqualInstallment) {
        housingResult = LoanCore.calculateEqualInstallment(housingAmount, housingTerm, housingRate, startDate);
      } else if (isEqualPrincipal) {
        housingResult = LoanCore.calculateEqualPrincipal(housingAmount, housingTerm, housingRate, startDate);
      }
      
      // 合并两种贷款的结果
      const combinedResult = this.combineLoanResults(commercialResult, housingResult);
      
      // 保存结果到全局变量，供导出使用
      window.combinedLoanResult = combinedResult;
      window.combinedLoanParams = {
        commercialAmount, commercialTerm, commercialRate,
        housingAmount, housingTerm, housingRate,
        isEqualInstallment, isEqualPrincipal
      };
      
      // 显示结果
      this.displayCombinedResults(combinedResult);
      
      // 启用导出按钮
      this.exportCombinedBtn.disabled = false;
      
      return combinedResult;
    },
    
    // 合并两种贷款的结果
    combineLoanResults: function(commercialResult, housingResult) {
      // 获取最长的贷款期限
      const maxTerm = Math.max(commercialResult.schedule.length, housingResult.schedule.length);
      
      // 创建合并后的还款计划
      const combinedSchedule = [];
      
      // 合并每月的还款数据
      for (let i = 0; i < maxTerm; i++) {
        const commercialPayment = i < commercialResult.schedule.length ? commercialResult.schedule[i] : null;
        const housingPayment = i < housingResult.schedule.length ? housingResult.schedule[i] : null;
        
        // 创建合并后的月度还款数据
        const combinedPayment = {
          month: i + 1,
          date: commercialPayment ? commercialPayment.date : housingPayment.date,
          payment: 0,
          principal: 0,
          interest: 0,
          balance: 0,
          commercialPayment: commercialPayment ? commercialPayment.payment : 0,
          commercialPrincipal: commercialPayment ? commercialPayment.principal : 0,
          commercialInterest: commercialPayment ? commercialPayment.interest : 0,
          commercialBalance: commercialPayment ? commercialPayment.balance : 0,
          housingPayment: housingPayment ? housingPayment.payment : 0,
          housingPrincipal: housingPayment ? housingPayment.principal : 0,
          housingInterest: housingPayment ? housingPayment.interest : 0,
          housingBalance: housingPayment ? housingPayment.balance : 0
        };
        
        // 计算合并后的总额
        combinedPayment.payment = combinedPayment.commercialPayment + combinedPayment.housingPayment;
        combinedPayment.principal = combinedPayment.commercialPrincipal + combinedPayment.housingPrincipal;
        combinedPayment.interest = combinedPayment.commercialInterest + combinedPayment.housingInterest;
        combinedPayment.balance = combinedPayment.commercialBalance + combinedPayment.housingBalance;
        
        combinedSchedule.push(combinedPayment);
      }
      
      // 计算合并后的总还款额和总利息
      const totalPayment = commercialResult.totalPayment + housingResult.totalPayment;
      const totalInterest = commercialResult.totalInterest + housingResult.totalInterest;
      
      return {
        commercialResult,
        housingResult,
        schedule: combinedSchedule,
        totalPayment,
        totalInterest
      };
    },
    
    // 显示组合贷款结果
    displayCombinedResults: function(result) {
      // 获取参数
      const params = window.combinedLoanParams;
      
      // 显示结果摘要
      const totalAmount = params.commercialAmount + params.housingAmount;
      
      // 显示摘要
      this.combinedSummary.innerHTML = `
        <div class="summary-section">
          <h3>贷款总览</h3>
          <div class="summary-row">
            <div class="summary-label">贷款总额:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(totalAmount)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">商业贷款:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(params.commercialAmount)} (${(params.commercialAmount / totalAmount * 100).toFixed(2)}%)</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">公积金贷款:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(params.housingAmount)} (${(params.housingAmount / totalAmount * 100).toFixed(2)}%)</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">还款方式:</div>
            <div class="summary-value">${params.isEqualInstallment ? '等额本息' : '等额本金'}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">总还款额:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(result.totalPayment)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">总利息:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(result.totalInterest)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">利息占比:</div>
            <div class="summary-value">${(result.totalInterest / result.totalPayment * 100).toFixed(2)}%</div>
          </div>
        </div>
        
        <div class="summary-section">
          <h3>商业贷款</h3>
          <div class="summary-row">
            <div class="summary-label">贷款金额:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(params.commercialAmount)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">贷款期限:</div>
            <div class="summary-value">${params.commercialTerm / 12}年 (${params.commercialTerm}月)</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">年利率:</div>
            <div class="summary-value">${(params.commercialRate * 100).toFixed(2)}%</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">总还款额:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(result.commercialResult.totalPayment)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">总利息:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(result.commercialResult.totalInterest)}</div>
          </div>
        </div>
        
        <div class="summary-section">
          <h3>公积金贷款</h3>
          <div class="summary-row">
            <div class="summary-label">贷款金额:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(params.housingAmount)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">贷款期限:</div>
            <div class="summary-value">${params.housingTerm / 12}年 (${params.housingTerm}月)</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">年利率:</div>
            <div class="summary-value">${(params.housingRate * 100).toFixed(2)}%</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">总还款额:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(result.housingResult.totalPayment)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">总利息:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(result.housingResult.totalInterest)}</div>
          </div>
        </div>
      `;
      
      // 显示还款计划
      LoanUI.displayCombinedSchedule(this.combinedSchedule, result.schedule, this.combinedFilter.value);
      
      // 显示图表
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      
      this.chartInstance = LoanCharts.displayCombinedChart(result.schedule, this.combinedChart);
    },
    
    // 清空输入
    clearInputs: function() {
      this.commercialAmount.value = '500000';
      this.commercialTerm.value = '30';
      this.commercialRate.value = '4.35';
      this.housingAmount.value = '300000';
      this.housingTerm.value = '30';
      this.housingRate.value = '3.25';
      this.combinedEqualInstallment.checked = true;
      
      // 重置首次还款日期为下个月1日
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      this.combinedFirstDate.value = nextMonth.toISOString().slice(0, 10);
      
      // 清空结果
      this.combinedSummary.innerHTML = '';
      this.combinedSchedule.querySelector('tbody').innerHTML = '';
      
      // 销毁图表
      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.chartInstance = null;
      }
      
      // 禁用导出按钮
      this.exportCombinedBtn.disabled = true;
      
      // 清除全局变量
      window.combinedLoanResult = null;
      window.combinedLoanParams = null;
    }
  };
  
  // 导出模块
  window.CombinedLoan = CombinedLoan;
})();