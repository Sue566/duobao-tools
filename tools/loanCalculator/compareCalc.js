/**
 * 贷款计算器 - 贷款方案比较模块
 */
(function() {
  // 定义贷款方案比较模块
  const CompareCalc = {
    // 图表实例
    chartInstance: null,
    
    // 初始化模块
    init: function() {
      // 获取DOM元素
      this.compareAmount = document.getElementById('compare-amount');
      this.compareTerm = document.getElementById('compare-term');
      this.compareCommercial = document.getElementById('compare-commercial');
      this.compareHousing = document.getElementById('compare-housing');
      this.compareCombined = document.getElementById('compare-combined');
      this.combinedRatio = document.getElementById('combined-ratio');
      this.commercialRatio = document.getElementById('commercial-ratio');
      this.housingRatio = document.getElementById('housing-ratio');
      this.compareEqualInstallment = document.getElementById('compare-equal-installment');
      this.compareEqualPrincipal = document.getElementById('compare-equal-principal');
      this.calculateCompareBtn = document.getElementById('calculate-compare-btn');
      this.clearCompareBtn = document.getElementById('clear-compare-btn');
      this.exportCompareBtn = document.getElementById('export-compare-btn');
      this.compareChart = document.getElementById('compare-chart');
      this.compareTable = document.getElementById('compare-table');
      
      // 绑定事件
      this.bindEvents();
      
      // 初始禁用导出按钮
      this.exportCompareBtn.disabled = true;
      
      // 初始化比例显示
      this.updateCombinedRatio();
    },
    
    // 绑定事件
    bindEvents: function() {
      // 计算贷款方案比较
      this.calculateCompareBtn.addEventListener('click', this.compareLoans.bind(this));
      
      // 清空输入
      this.clearCompareBtn.addEventListener('click', this.clearInputs.bind(this));
      
      // 导出
      this.exportCompareBtn.addEventListener('click', () => ExportTools.exportComparisonToCSV());
      
      // 组合贷款比例滑块
      this.combinedRatio.addEventListener('input', this.updateCombinedRatio.bind(this));
    },
    
    // 更新组合贷款比例显示
    updateCombinedRatio: function() {
      const ratio = this.combinedRatio.value;
      this.commercialRatio.textContent = ratio + '%';
      this.housingRatio.textContent = (100 - ratio) + '%';
    },
    
    // 比较贷款方案
    compareLoans: function() {
      // 获取输入值
      const amount = parseFloat(this.compareAmount.value);
      const term = parseInt(this.compareTerm.value) * 12; // 转换为月
      const includeCommercial = this.compareCommercial.checked;
      const includeHousing = this.compareHousing.checked;
      const includeCombined = this.compareCombined.checked;
      const combinedRatio = parseInt(this.combinedRatio.value) / 100;
      const includeEqualInstallment = this.compareEqualInstallment.checked;
      const includeEqualPrincipal = this.compareEqualPrincipal.checked;
      
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
        LoanUtils.showToast('请至少选择一种贷款类型进行比较', 'warning');
        return;
      }
      
      if (!includeEqualInstallment && !includeEqualPrincipal) {
        LoanUtils.showToast('请至少选择一种还款方式进行比较', 'warning');
        return;
      }
      
      // 设置首次还款日期为下个月1日
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      
      // 定义利率
      const commercialRate = 0.0435; // 商业贷款利率
      const housingRate = 0.0325; // 公积金贷款利率
      
      // 创建比较结果数组
      const comparisonResults = [];
      
      // 计算商业贷款
      if (includeCommercial) {
        if (includeEqualInstallment) {
          const result = LoanCore.calculateEqualInstallment(amount, term, commercialRate, nextMonth);
          comparisonResults.push({
            type: '商业贷款',
            method: '等额本息',
            amount: amount,
            term: term,
            rate: commercialRate,
            monthlyPayment: result.schedule[0].payment,
            totalPayment: result.totalPayment,
            totalInterest: result.totalInterest,
            interestRatio: result.totalInterest / result.totalPayment,
            firstPayment: result.schedule[0].payment,
            lastPayment: result.schedule[result.schedule.length - 1].payment,
            schedule: result.schedule
          });
        }
        
        if (includeEqualPrincipal) {
          const result = LoanCore.calculateEqualPrincipal(amount, term, commercialRate, nextMonth);
          comparisonResults.push({
            type: '商业贷款',
            method: '等额本金',
            amount: amount,
            term: term,
            rate: commercialRate,
            monthlyPayment: result.schedule[0].payment,
            totalPayment: result.totalPayment,
            totalInterest: result.totalInterest,
            interestRatio: result.totalInterest / result.totalPayment,
            firstPayment: result.schedule[0].payment,
            lastPayment: result.schedule[result.schedule.length - 1].payment,
            schedule: result.schedule
          });
        }
      }
      
      // 计算公积金贷款
      if (includeHousing) {
        if (includeEqualInstallment) {
          const result = LoanCore.calculateEqualInstallment(amount, term, housingRate, nextMonth);
          comparisonResults.push({
            type: '公积金贷款',
            method: '等额本息',
            amount: amount,
            term: term,
            rate: housingRate,
            monthlyPayment: result.schedule[0].payment,
            totalPayment: result.totalPayment,
            totalInterest: result.totalInterest,
            interestRatio: result.totalInterest / result.totalPayment,
            firstPayment: result.schedule[0].payment,
            lastPayment: result.schedule[result.schedule.length - 1].payment,
            schedule: result.schedule
          });
        }
        
        if (includeEqualPrincipal) {
          const result = LoanCore.calculateEqualPrincipal(amount, term, housingRate, nextMonth);
          comparisonResults.push({
            type: '公积金贷款',
            method: '等额本金',
            amount: amount,
            term: term,
            rate: housingRate,
            monthlyPayment: result.schedule[0].payment,
            totalPayment: result.totalPayment,
            totalInterest: result.totalInterest,
            interestRatio: result.totalInterest / result.totalPayment,
            firstPayment: result.schedule[0].payment,
            lastPayment: result.schedule[result.schedule.length - 1].payment,
            schedule: result.schedule
          });
        }
      }
      
      // 计算组合贷款
      if (includeCombined) {
        const commercialAmount = amount * combinedRatio;
        const housingAmount = amount * (1 - combinedRatio);
        
        if (includeEqualInstallment) {
          // 计算商业贷款部分
          const commercialResult = LoanCore.calculateEqualInstallment(commercialAmount, term, commercialRate, nextMonth);
          
          // 计算公积金贷款部分
          const housingResult = LoanCore.calculateEqualInstallment(housingAmount, term, housingRate, nextMonth);
          
          // 合并结果
          const totalPayment = commercialResult.totalPayment + housingResult.totalPayment;
          const totalInterest = commercialResult.totalInterest + housingResult.totalInterest;
          
          // 创建合并后的还款计划
          const combinedSchedule = [];
          for (let i = 0; i < term; i++) {
            combinedSchedule.push({
              month: i + 1,
              date: commercialResult.schedule[i].date,
              payment: commercialResult.schedule[i].payment + housingResult.schedule[i].payment,
              principal: commercialResult.schedule[i].principal + housingResult.schedule[i].principal,
              interest: commercialResult.schedule[i].interest + housingResult.schedule[i].interest,
              balance: commercialResult.schedule[i].balance + housingResult.schedule[i].balance
            });
          }
          
          comparisonResults.push({
            type: '组合贷款',
            method: '等额本息',
            amount: amount,
            term: term,
            rate: '商业' + (commercialRate * 100).toFixed(2) + '% / 公积金' + (housingRate * 100).toFixed(2) + '%',
            commercialRatio: combinedRatio,
            housingRatio: 1 - combinedRatio,
            monthlyPayment: combinedSchedule[0].payment,
            totalPayment: totalPayment,
            totalInterest: totalInterest,
            interestRatio: totalInterest / totalPayment,
            firstPayment: combinedSchedule[0].payment,
            lastPayment: combinedSchedule[combinedSchedule.length - 1].payment,
            schedule: combinedSchedule
          });
        }
        
        if (includeEqualPrincipal) {
          // 计算商业贷款部分
          const commercialResult = LoanCore.calculateEqualPrincipal(commercialAmount, term, commercialRate, nextMonth);
          
          // 计算公积金贷款部分
          const housingResult = LoanCore.calculateEqualPrincipal(housingAmount, term, housingRate, nextMonth);
          
          // 合并结果
          const totalPayment = commercialResult.totalPayment + housingResult.totalPayment;
          const totalInterest = commercialResult.totalInterest + housingResult.totalInterest;
          
          // 创建合并后的还款计划
          const combinedSchedule = [];
          for (let i = 0; i < term; i++) {
            combinedSchedule.push({
              month: i + 1,
              date: commercialResult.schedule[i].date,
              payment: commercialResult.schedule[i].payment + housingResult.schedule[i].payment,
              principal: commercialResult.schedule[i].principal + housingResult.schedule[i].principal,
              interest: commercialResult.schedule[i].interest + housingResult.schedule[i].interest,
              balance: commercialResult.schedule[i].balance + housingResult.schedule[i].balance
            });
          }
          
          comparisonResults.push({
            type: '组合贷款',
            method: '等额本金',
            amount: amount,
            term: term,
            rate: '商业' + (commercialRate * 100).toFixed(2) + '% / 公积金' + (housingRate * 100).toFixed(2) + '%',
            commercialRatio: combinedRatio,
            housingRatio: 1 - combinedRatio,
            monthlyPayment: combinedSchedule[0].payment,
            totalPayment: totalPayment,
            totalInterest: totalInterest,
            interestRatio: totalInterest / totalPayment,
            firstPayment: combinedSchedule[0].payment,
            lastPayment: combinedSchedule[combinedSchedule.length - 1].payment,
            schedule: combinedSchedule
          });
        }
      }
      
      // 保存结果到全局变量，供导出使用
      window.comparisonResults = comparisonResults;
      window.comparisonParams = {
        amount, term, includeCommercial, includeHousing, includeCombined,
        combinedRatio, includeEqualInstallment, includeEqualPrincipal
      };
      
      // 显示比较结果
      this.displayComparisonResults(comparisonResults);
      
      // 启用导出按钮
      this.exportCompareBtn.disabled = false;
      
      return comparisonResults;
    },
    
    // 显示比较结果
    displayComparisonResults: function(results) {
      // 显示比较表格
      const tbody = this.compareTable.querySelector('tbody');
      tbody.innerHTML = '';
      
      results.forEach(result => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
          <td>${result.type}</td>
          <td>${result.method}</td>
          <td>${LoanUtils.formatCurrency(result.amount)}</td>
          <td>${result.term / 12}年</td>
          <td>${typeof result.rate === 'string' ? result.rate : (result.rate * 100).toFixed(2) + '%'}</td>
          <td>${LoanUtils.formatCurrency(result.firstPayment)}</td>
          <td>${LoanUtils.formatCurrency(result.lastPayment)}</td>
          <td>${LoanUtils.formatCurrency(result.totalPayment)}</td>
          <td>${LoanUtils.formatCurrency(result.totalInterest)}</td>
          <td>${(result.interestRatio * 100).toFixed(2)}%</td>
          <td>
            <button class="btn btn-sm btn-primary view-schedule-btn" data-index="${results.indexOf(result)}">
              查看详情
            </button>
          </td>
        `;
        
        tbody.appendChild(row);
      });
      
      // 添加查看详情按钮事件
      const viewButtons = tbody.querySelectorAll('.view-schedule-btn');
      viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.dataset.index);
          const result = results[index];
          
          LoanUI.showScheduleModal(result.type + ' - ' + result.method, result.schedule);
        });
      });
      
      // 显示比较图表
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      
      this.chartInstance = LoanCharts.displayComparisonChart(results, this.compareChart);
    },
    
    // 清空输入
    clearInputs: function() {
      this.compareAmount.value = '500000';
      this.compareTerm.value = '30';
      this.compareCommercial.checked = true;
      this.compareHousing.checked = true;
      this.compareCombined.checked = true;
      this.combinedRatio.value = '50';
      this.updateCombinedRatio();
      this.compareEqualInstallment.checked = true;
      this.compareEqualPrincipal.checked = true;
      
      // 清空结果
      this.compareTable.querySelector('tbody').innerHTML = '';
      
      // 销毁图表
      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.chartInstance = null;
      }
      
      // 禁用导出按钮
      this.exportCompareBtn.disabled = true;
      
      // 清除全局变量
      window.comparisonResults = null;
      window.comparisonParams = null;
    }
  };
  
  // 导出模块
  window.CompareCalc = CompareCalc;
})();