/**
 * 贷款计算器 - 提前还款计算模块
 */
(function() {
  // 定义提前还款计算模块
  const PrepaymentCalc = {
    // 图表实例
    chartInstance: null,
    
    // 初始化模块
    init: function() {
      // 获取DOM元素
      this.originalAmount = document.getElementById('original-amount');
      this.originalTerm = document.getElementById('original-term');
      this.originalTermUnit = document.getElementById('original-term-unit');
      this.originalRate = document.getElementById('original-rate');
      this.loanStartDate = document.getElementById('loan-start-date');
      this.alreadyPaid = document.getElementById('already-paid');
      this.prepaymentAmount = document.getElementById('prepayment-amount');
      this.methodReduceTerm = document.getElementById('method-reduce-term');
      this.methodReduceAmount = document.getElementById('method-reduce-amount');
      this.originalEqualInstallment = document.getElementById('original-equal-installment');
      this.originalEqualPrincipal = document.getElementById('original-equal-principal');
      this.calculatePrepaymentBtn = document.getElementById('calculate-prepayment-btn');
      this.clearPrepaymentBtn = document.getElementById('clear-prepayment-btn');
      this.exportPrepaymentBtn = document.getElementById('export-prepayment-btn');
      this.prepaymentSummary = document.getElementById('prepayment-summary');
      this.prepaymentComparison = document.getElementById('prepayment-comparison');
      this.prepaymentChart = document.getElementById('prepayment-chart');
      this.prepaymentSchedule = document.getElementById('prepayment-schedule');
      
      // 设置默认贷款开始日期为一年前
      const today = new Date();
      const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), 1);
      this.loanStartDate.value = oneYearAgo.toISOString().slice(0, 10);
      
      // 绑定事件
      this.bindEvents();
      
      // 初始禁用导出按钮
      this.exportPrepaymentBtn.disabled = true;
    },
    
    // 绑定事件
    bindEvents: function() {
      // 计算提前还款
      this.calculatePrepaymentBtn.addEventListener('click', this.calculatePrepayment.bind(this));
      
      // 清空输入
      this.clearPrepaymentBtn.addEventListener('click', this.clearInputs.bind(this));
      
      // 导出
      this.exportPrepaymentBtn.addEventListener('click', () => ExportTools.exportScheduleToCSV('prepayment'));
      
      // 期限单位变更时调整默认值
      this.originalTermUnit.addEventListener('change', () => {
        if (this.originalTermUnit.value === 'year') {
          // 如果切换到年，默认值除以12（向上取整）
          const currentTerm = parseInt(this.originalTerm.value);
          if (!isNaN(currentTerm) && currentTerm > 12) {
            this.originalTerm.value = Math.ceil(currentTerm / 12);
          }
        } else {
          // 如果切换到月，默认值乘以12
          const currentTerm = parseInt(this.originalTerm.value);
          if (!isNaN(currentTerm) && currentTerm < 30) {
            this.originalTerm.value = currentTerm * 12;
          }
        }
      });
    },
    
    // 计算提前还款
    calculatePrepayment: function() {
      // 获取输入值
      const originalAmount = parseFloat(this.originalAmount.value);
      let originalTerm = parseInt(this.originalTerm.value);
      const originalRate = parseFloat(this.originalRate.value) / 100;
      const loanStartDate = new Date(this.loanStartDate.value);
      const alreadyPaid = parseInt(this.alreadyPaid.value);
      const prepaymentAmount = parseFloat(this.prepaymentAmount.value);
      const isReduceTerm = this.methodReduceTerm.checked;
      const isReduceAmount = this.methodReduceAmount.checked;
      const isEqualInstallment = this.originalEqualInstallment.checked;
      const isEqualPrincipal = this.originalEqualPrincipal.checked;
      
      // 验证输入
      if (isNaN(originalAmount) || originalAmount <= 0) {
        LoanUtils.showToast('请输入有效的原贷款金额', 'warning');
        return;
      }
      
      if (isNaN(originalTerm) || originalTerm <= 0) {
        LoanUtils.showToast('请输入有效的原贷款期限', 'warning');
        return;
      }
      
      if (isNaN(originalRate) || originalRate <= 0) {
        LoanUtils.showToast('请输入有效的原贷款年利率', 'warning');
        return;
      }
      
      if (isNaN(loanStartDate.getTime())) {
        LoanUtils.showToast('请选择有效的贷款开始日期', 'warning');
        return;
      }
      
      if (isNaN(alreadyPaid) || alreadyPaid < 0) {
        LoanUtils.showToast('请输入有效的已还期数', 'warning');
        return;
      }
      
      if (isNaN(prepaymentAmount) || prepaymentAmount <= 0) {
        LoanUtils.showToast('请输入有效的提前还款金额', 'warning');
        return;
      }
      
      // 如果期限单位是年，转换为月
      if (this.originalTermUnit.value === 'year') {
        originalTerm *= 12;
      }
      
      // 验证已还期数不能超过总期数
      if (alreadyPaid >= originalTerm) {
        LoanUtils.showToast('已还期数不能大于或等于总期数', 'warning');
        return;
      }
      
      // 计算原始还款计划
      let originalSchedule;
      if (isEqualInstallment) {
        originalSchedule = LoanCore.calculateEqualInstallment(originalAmount, originalTerm, originalRate, loanStartDate).schedule;
      } else if (isEqualPrincipal) {
        originalSchedule = LoanCore.calculateEqualPrincipal(originalAmount, originalTerm, originalRate, loanStartDate).schedule;
      }
      
      // 计算提前还款后的结果
      const result = LoanPrepayment.calculatePrepayment(
        originalAmount,
        originalTerm,
        originalRate,
        loanStartDate,
        alreadyPaid,
        prepaymentAmount,
        isReduceTerm,
        isReduceAmount,
        isEqualInstallment,
        isEqualPrincipal,
        originalSchedule
      );
      
      // 保存结果到全局变量，供导出使用
      window.prepaymentResult = result;
      window.prepaymentParams = {
        originalAmount, originalTerm, originalRate, loanStartDate,
        alreadyPaid, prepaymentAmount, isReduceTerm, isReduceAmount,
        isEqualInstallment, isEqualPrincipal
      };
      
      // 显示结果
      this.displayPrepaymentResults(result);
      
      // 启用导出按钮
      this.exportPrepaymentBtn.disabled = false;
      
      return result;
    },
    
    // 显示提前还款结果
    displayPrepaymentResults: function(result) {
      // 获取参数
      const params = window.prepaymentParams;
      
      // 显示摘要
      this.prepaymentSummary.innerHTML = `
        <div class="summary-section">
          <h3>原贷款信息</h3>
          <div class="summary-row">
            <div class="summary-label">贷款金额:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(params.originalAmount)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">贷款期限:</div>
            <div class="summary-value">${params.originalTerm}月 (${(params.originalTerm / 12).toFixed(1)}年)</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">年利率:</div>
            <div class="summary-value">${(params.originalRate * 100).toFixed(2)}%</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">还款方式:</div>
            <div class="summary-value">${params.isEqualInstallment ? '等额本息' : '等额本金'}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">已还期数:</div>
            <div class="summary-value">${params.alreadyPaid}期</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">提前还款金额:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(params.prepaymentAmount)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">提前还款方式:</div>
            <div class="summary-value">${params.isReduceTerm ? '缩短贷款期限' : '减少每月还款额'}</div>
          </div>
        </div>
      `;
      
      // 显示比较结果
      this.prepaymentComparison.innerHTML = `
        <div class="summary-section">
          <h3>提前还款效果</h3>
          <div class="summary-row">
            <div class="summary-label">原总还款额:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(result.originalTotalPayment)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">新总还款额:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(result.newTotalPayment)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">节省金额:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(result.savedAmount)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">原总利息:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(result.originalTotalInterest)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">新总利息:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(result.newTotalInterest)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">节省利息:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(result.savedInterest)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">原剩余期数:</div>
            <div class="summary-value">${result.originalRemainingTerm}期</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">新剩余期数:</div>
            <div class="summary-value">${result.newRemainingTerm}期</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">减少期数:</div>
            <div class="summary-value">${result.reducedTerm}期</div>
          </div>
          ${params.isReduceAmount ? `
          <div class="summary-row">
            <div class="summary-label">原月供:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(result.originalMonthlyPayment)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">新月供:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(result.newMonthlyPayment)}</div>
          </div>
          <div class="summary-row">
            <div class="summary-label">月供减少:</div>
            <div class="summary-value">${LoanUtils.formatCurrency(result.reducedMonthlyPayment)}</div>
          </div>
          ` : ''}
        </div>
      `;
      
      // 显示还款计划
      LoanUI.displayPrepaymentSchedule(this.prepaymentSchedule, result.originalSchedule, result.newSchedule, params.alreadyPaid);
      
      // 显示图表
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      
      this.chartInstance = LoanCharts.displayPrepaymentChart(result.originalSchedule, result.newSchedule, params.alreadyPaid, this.prepaymentChart);
    },
    
    // 清空输入
    clearInputs: function() {
      this.originalAmount.value = '500000';
      this.originalTerm.value = '30';
      this.originalTermUnit.value = 'year';
      this.originalRate.value = '4.35';
      this.alreadyPaid.value = '12';
      this.prepaymentAmount.value = '100000';
      this.methodReduceTerm.checked = true;
      this.originalEqualInstallment.checked = true;
      
      // 重置贷款开始日期为一年前
      const today = new Date();
      const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), 1);
      this.loanStartDate.value = oneYearAgo.toISOString().slice(0, 10);
      
      // 清空结果
      this.prepaymentSummary.innerHTML = '';
      this.prepaymentComparison.innerHTML = '';
      this.prepaymentSchedule.querySelector('tbody').innerHTML = '';
      
      // 销毁图表
      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.chartInstance = null;
      }
      
      // 禁用导出按钮
      this.exportPrepaymentBtn.disabled = true;
      
      // 清除全局变量
      window.prepaymentResult = null;
      window.prepaymentParams = null;
    }
  };
  
  // 导出模块
  window.PrepaymentCalc = PrepaymentCalc;
})();