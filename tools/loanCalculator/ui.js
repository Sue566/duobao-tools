/**
 * 贷款计算器 - UI交互模块
 */

// UI交互功能
const LoanUI = {
  /**
   * 显示结果摘要
   * @param {object} container - 摘要容器元素
   * @param {number} amount - 贷款金额
   * @param {number} additionalCosts - 附加费用
   * @param {number} term - 贷款期限(月)
   * @param {number} rate - 年利率(小数)
   * @param {number} totalPayment - 总还款额
   * @param {number} totalInterest - 总利息
   * @param {boolean} isEqualInstallment - 是否等额本息
   * @param {boolean} isEqualPrincipal - 是否等额本金
   * @param {boolean} isInterestOnly - 是否先息后本
   */
  displaySummary: function(container, amount, additionalCosts, term, rate, totalPayment, totalInterest, isEqualInstallment, isEqualPrincipal, isInterestOnly) {
    let repaymentMethod = '';
    let paymentLabel = '';
    
    if (isEqualInstallment) {
      repaymentMethod = '等额本息';
      paymentLabel = '月供';
    } else if (isEqualPrincipal) {
      repaymentMethod = '等额本金';
      paymentLabel = '首月还款额';
    } else if (isInterestOnly) {
      repaymentMethod = '先息后本';
      paymentLabel = '月供(仅利息)';
    }
    
    // 计算月供
    let monthlyPayment;
    if (isEqualInstallment) {
      monthlyPayment = totalPayment / term;
    } else if (isEqualPrincipal) {
      monthlyPayment = (amount / term) + (amount * (rate / 12));
    } else if (isInterestOnly) {
      monthlyPayment = amount * (rate / 12);
    }
    
    // 计算总成本
    const totalCost = amount + additionalCosts + totalInterest;
    
    container.innerHTML = `
      <div class="summary-item">
        <div class="summary-label">贷款金额</div>
        <div class="summary-value">${LoanUtils.formatCurrency(amount)}</div>
      </div>
      ${additionalCosts > 0 ? `
      <div class="summary-item">
        <div class="summary-label">附加费用</div>
        <div class="summary-value">${LoanUtils.formatCurrency(additionalCosts)}</div>
      </div>` : ''}
      <div class="summary-item">
        <div class="summary-label">贷款期限</div>
        <div class="summary-value">${term} 个月 (${Math.floor(term / 12)} 年 ${term % 12} 个月)</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">年利率</div>
        <div class="summary-value">${(rate * 100).toFixed(2)}%</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">还款方式</div>
        <div class="summary-value">${repaymentMethod}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">${paymentLabel}</div>
        <div class="summary-value highlight">${LoanUtils.formatCurrency(monthlyPayment)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">总还款额</div>
        <div class="summary-value">${LoanUtils.formatCurrency(totalPayment)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">总利息</div>
        <div class="summary-value">${LoanUtils.formatCurrency(totalInterest)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">利息占比</div>
        <div class="summary-value">${(totalInterest / totalPayment * 100).toFixed(2)}%</div>
      </div>
      ${additionalCosts > 0 ? `
      <div class="summary-item">
        <div class="summary-label">总成本</div>
        <div class="summary-value">${LoanUtils.formatCurrency(totalCost)}</div>
      </div>` : ''}
    `;
  },
  
  /**
   * 显示组合贷款结果摘要
   * @param {object} container - 摘要容器元素
   * @param {number} commercialAmount - 商业贷款金额
   * @param {number} commercialTerm - 商业贷款期限(月)
   * @param {number} commercialRate - 商业贷款年利率(小数)
   * @param {number} housingAmount - 公积金贷款金额
   * @param {number} housingTerm - 公积金贷款期限(月)
   * @param {number} housingRate - 公积金贷款年利率(小数)
   * @param {number} totalPayment - 总还款额
   * @param {number} totalInterest - 总利息
   * @param {number} totalMonthlyPayment - 总月供
   * @param {boolean} isEqualInstallment - 是否等额本息
   */
  displayCombinedSummary: function(container, commercialAmount, commercialTerm, commercialRate, housingAmount, housingTerm, housingRate, totalPayment, totalInterest, totalMonthlyPayment, isEqualInstallment) {
    const totalAmount = commercialAmount + housingAmount;
    const repaymentMethod = isEqualInstallment ? '等额本息' : '等额本金';
    
    container.innerHTML = `
      <div class="summary-item">
        <div class="summary-label">商业贷款金额</div>
        <div class="summary-value">${LoanUtils.formatCurrency(commercialAmount)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">商业贷款期限</div>
        <div class="summary-value">${commercialTerm} 个月 (${Math.floor(commercialTerm / 12)} 年 ${commercialTerm % 12} 个月)</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">商业贷款年利率</div>
        <div class="summary-value">${(commercialRate * 100).toFixed(2)}%</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">公积金贷款金额</div>
        <div class="summary-value">${LoanUtils.formatCurrency(housingAmount)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">公积金贷款期限</div>
        <div class="summary-value">${housingTerm} 个月 (${Math.floor(housingTerm / 12)} 年 ${housingTerm % 12} 个月)</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">公积金贷款年利率</div>
        <div class="summary-value">${(housingRate * 100).toFixed(2)}%</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">总贷款金额</div>
        <div class="summary-value">${LoanUtils.formatCurrency(totalAmount)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">还款方式</div>
        <div class="summary-value">${repaymentMethod}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">总月供</div>
        <div class="summary-value highlight">${LoanUtils.formatCurrency(totalMonthlyPayment)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">总还款额</div>
        <div class="summary-value">${LoanUtils.formatCurrency(totalPayment)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">总利息</div>
        <div class="summary-value">${LoanUtils.formatCurrency(totalInterest)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">利息占比</div>
        <div class="summary-value">${(totalInterest / totalPayment * 100).toFixed(2)}%</div>
      </div>
    `;
  },
  
  /**
   * 显示提前还款结果摘要
   * @param {object} container - 摘要容器元素
   * @param {object} result - 提前还款计算结果
   */
  displayPrepaymentSummary: function(container, result) {
    container.innerHTML = `
      <div class="summary-item">
        <div class="summary-label">原贷款金额</div>
        <div class="summary-value">${LoanUtils.formatCurrency(result.originalSchedule[0].remainingPrincipal)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">已还期数</div>
        <div class="summary-value">${result.paidSchedule.length} 期</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">已还本金</div>
        <div class="summary-value">${LoanUtils.formatCurrency(result.paidPrincipal)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">已还利息</div>
        <div class="summary-value">${LoanUtils.formatCurrency(result.paidInterest)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">剩余本金</div>
        <div class="summary-value">${LoanUtils.formatCurrency(result.remainingPrincipal)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">提前还款金额</div>
        <div class="summary-value highlight">${LoanUtils.formatCurrency(result.prepaymentAmount)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">提前还款后剩余本金</div>
        <div class="summary-value">${LoanUtils.formatCurrency(result.newRemainingPrincipal)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">节省利息</div>
        <div class="summary-value highlight positive">${LoanUtils.formatCurrency(result.interestSaved)}</div>
      </div>
      ${result.termReduced > 0 ? `
      <div class="summary-item">
        <div class="summary-label">缩短期限</div>
        <div class="summary-value highlight positive">${result.termReduced} 期 (${Math.floor(result.termReduced / 12)} 年 ${result.termReduced % 12} 个月)</div>
      </div>` : ''}
    `;
  },
  
  /**
   * 显示提前还款对比结果
   * @param {object} container - 对比容器元素
   * @param {object} result - 提前还款计算结果
   * @param {boolean} isReduceTerm - 是否缩短贷款期限
   */
  displayPrepaymentComparison: function(container, result, isReduceTerm) {
    // 计算原计划总利息
    const originalRemainingInterest = result.originalSchedule.slice(result.paidSchedule.length).reduce((sum, item) => sum + item.interest, 0);
    const originalTotalInterest = result.paidInterest + originalRemainingInterest;
    
    // 计算提前还款后总利息
    const newTotalInterest = result.paidInterest + result.newSchedule.reduce((sum, item) => sum + item.interest, 0);
    
    // 计算原计划总还款额
    const originalTotalPayment = result.paidPrincipal + result.paidInterest + result.remainingPrincipal + originalRemainingInterest;
    
    // 计算提前还款后总还款额
    const newTotalPayment = result.paidPrincipal + result.paidInterest + result.prepaymentAmount + 
      result.newSchedule.reduce((sum, item) => sum + item.payment, 0);
    
    // 计算原计划剩余期数
    const originalRemainingTerm = result.originalSchedule.length - result.paidSchedule.length;
    
    // 计算提前还款后剩余期数
    const newRemainingTerm = result.newSchedule.length;
    
    // 计算原计划月供
    const originalMonthlyPayment = result.originalSchedule[result.paidSchedule.length]?.payment || 0;
    
    // 计算提前还款后月供
    const newMonthlyPayment = result.newSchedule[0]?.payment || 0;
    
    container.innerHTML = `
      <div class="comparison-item">
        <div class="comparison-label">总利息</div>
        <div class="comparison-value">
          <div>原计划: ${LoanUtils.formatCurrency(originalTotalInterest)}</div>
          <div>提前还款后: ${LoanUtils.formatCurrency(newTotalInterest)}</div>
          <div class="comparison-value positive">节省: ${LoanUtils.formatCurrency(result.interestSaved)}</div>
        </div>
      </div>
      
      <div class="comparison-item">
        <div class="comparison-label">总还款额</div>
        <div class="comparison-value">
          <div>原计划: ${LoanUtils.formatCurrency(originalTotalPayment)}</div>
          <div>提前还款后: ${LoanUtils.formatCurrency(newTotalPayment)}</div>
          <div class="comparison-value positive">节省: ${LoanUtils.formatCurrency(originalTotalPayment - newTotalPayment)}</div>
        </div>
      </div>
      
      <div class="comparison-item">
        <div class="comparison-label">剩余期数</div>
        <div class="comparison-value">
          <div>原计划: ${originalRemainingTerm} 期</div>
          <div>提前还款后: ${newRemainingTerm} 期</div>
          ${isReduceTerm ? `<div class="comparison-value positive">缩短: ${result.termReduced} 期</div>` : ''}
        </div>
      </div>
      
      <div class="comparison-item">
        <div class="comparison-label">月供</div>
        <div class="comparison-value">
          <div>原计划: ${LoanUtils.formatCurrency(originalMonthlyPayment)}</div>
          <div>提前还款后: ${LoanUtils.formatCurrency(newMonthlyPayment)}</div>
          ${!isReduceTerm ? `<div class="comparison-value positive">减少: ${LoanUtils.formatCurrency(originalMonthlyPayment - newMonthlyPayment)}</div>` : ''}
        </div>
      </div>
    `;
  },
  
  /**
   * 显示还款计划表格
   * @param {object} tableElement - 表格元素
   * @param {Array} schedule - 还款计划数组
   * @param {string} filterValue - 过滤器值
   */
  displaySchedule: function(tableElement, schedule, filterValue) {
    const tbody = tableElement.querySelector('tbody');
    tbody.innerHTML = '';
    
    // 根据过滤器筛选显示的还款计划
    let filteredSchedule = [...schedule];
    
    if (filterValue === 'first-year') {
      filteredSchedule = schedule.slice(0, 12);
    } else if (filterValue === 'first-5-years') {
      filteredSchedule = schedule.slice(0, 60);
    } else if (filterValue === 'first-10') {
      filteredSchedule = schedule.slice(0, 10);
    } else if (filterValue === 'last-10') {
      filteredSchedule = schedule.slice(-10);
    }
    
    // 生成表格行
    filteredSchedule.forEach(item => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${item.period}</td>
        <td>${LoanUtils.formatDate(item.date)}</td>
        <td>${LoanUtils.formatCurrency(item.payment)}</td>
        <td>${LoanUtils.formatCurrency(item.principal)}</td>
        <td>${LoanUtils.formatCurrency(item.interest)}</td>
        <td>${LoanUtils.formatCurrency(item.remainingPrincipal)}</td>
      `;
      
      tbody.appendChild(row);
    });
  },
  
  /**
   * 显示组合贷款还款计划表格
   * @param {object} tableElement - 表格元素
   * @param {Array} schedule - 组合贷款还款计划数组
   * @param {string} filterValue - 过滤器值
   */
  displayCombinedSchedule: function(tableElement, schedule, filterValue) {
    const tbody = tableElement.querySelector('tbody');
    tbody.innerHTML = '';
    
    // 根据过滤器筛选显示的还款计划
    let filteredSchedule = [...schedule];
    
    if (filterValue === 'first-year') {
      filteredSchedule = schedule.slice(0, 12);
    } else if (filterValue === 'first-5-years') {
      filteredSchedule = schedule.slice(0, 60);
    } else if (filterValue === 'first-10') {
      filteredSchedule = schedule.slice(0, 10);
    } else if (filterValue === 'last-10') {
      filteredSchedule = schedule.slice(-10);
    }
    
    // 生成表格行
    filteredSchedule.forEach(item => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${item.period}</td>
        <td>${LoanUtils.formatDate(item.date)}</td>
        <td>${LoanUtils.formatCurrency(item.cPayment || 0)}</td>
        <td>${LoanUtils.formatCurrency(item.hPayment || 0)}</td>
        <td>${LoanUtils.formatCurrency(item.payment)}</td>
        <td>${LoanUtils.formatCurrency(item.principal)}</td>
        <td>${LoanUtils.formatCurrency(item.interest)}</td>
        <td>${LoanUtils.formatCurrency(item.remainingPrincipal)}</td>
      `;
      
      tbody.appendChild(row);
    });
  },
  
  /**
   * 显示贷款方案比较表格
   * @param {object} tableElement - 表格元素
   * @param {Array} results - 比较结果数组
   */
  displayCompareTable: function(tableElement, results) {
    const tbody = tableElement.querySelector('tbody');
    tbody.innerHTML = '';
    
    // 生成表格行
    results.forEach(item => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${LoanUtils.formatCurrency(item.amount)}</td>
        <td>${Math.floor(item.term / 12)} 年 ${item.term % 12} 个月</td>
        <td>${item.repaymentMethod}</td>
        <td>${LoanUtils.formatCurrency(item.monthlyPayment)}</td>
        <td>${LoanUtils.formatCurrency(item.totalPayment)}</td>
        <td>${LoanUtils.formatCurrency(item.totalInterest)}</td>
        <td>${(item.interestRatio * 100).toFixed(2)}%</td>
      `;
      
      tbody.appendChild(row);
    });
  },
  
  /**
   * 显示利率参考弹窗
   * @param {string} type - 贷款类型
   * @param {object} rateReferenceData - 利率参考数据
   * @param {function} callback - 选择利率后的回调函数
   */
  showRateReference: function(type, rateReferenceData, callback) {
    const data = rateReferenceData[type];
    
    let html = `<div class="rate-reference-modal">
      <div class="rate-reference-header">
        <h3>${data.name}</h3>
      </div>
      <div class="rate-reference-content">
        <table class="rate-table">
          <thead>
            <tr>
              <th>贷款期限</th>
              <th>基准年利率(%)</th>
            </tr>
          </thead>
          <tbody>`;
    
    data.rates.forEach(item => {
      html += `
        <tr>
          <td>${item.term}</td>
          <td>${item.rate.toFixed(2)}</td>
        </tr>`;
    });
    
    html += `
          </tbody>
        </table>
      </div>
      <div class="rate-reference-footer">
        <button id="apply-rate" class="btn btn-sm btn-success">应用选中利率</button>
        <button id="close-rate-reference" class="btn btn-sm">关闭</button>
      </div>
    </div>`;
    
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = html;
    document.body.appendChild(modal);
    
    // 添加事件监听
    modal.querySelector('#close-rate-reference').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // 点击行选择利率
    const rows = modal.querySelectorAll('.rate-table tbody tr');
    rows.forEach(row => {
      row.addEventListener('click', () => {
        rows.forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
      });
    });
    
    // 应用选中利率
    modal.querySelector('#apply-rate').addEventListener('click', () => {
      const selectedRow = modal.querySelector('.rate-table tbody tr.selected');
      if (selectedRow) {
        const rate = selectedRow.querySelector('td:nth-child(2)').textContent;
        callback(rate);
      }
      document.body.removeChild(modal);
    });
  },
  
  /**
   * 导出还款计划为CSV
   * @param {Array} schedule - 还款计划数组
   * @param {string} filename - 文件名
   */
  exportScheduleToCSV: function(schedule, filename) {
    // 创建CSV内容
    let csv = '期数,还款日期,月供,本金,利息,剩余本金\n';
    
    schedule.forEach(item => {
      csv += `${item.period},"${LoanUtils.formatDate(item.date)}",${item.payment},${item.principal},${item.interest},${item.remainingPrincipal}\n`;
    });
    
    // 创建下载链接
    LoanUtils.downloadTextFile(csv, filename, 'text/csv;charset=utf-8;');
  },
  
  /**
   * 导出组合贷款还款计划为CSV
   * @param {Array} schedule - 组合贷款还款计划数组
   * @param {string} filename - 文件名
   */
  exportCombinedScheduleToCSV: function(schedule, filename) {
    // 创建CSV内容
    let csv = '期数,还款日期,商贷月供,公积金月供,总月供,总本金,总利息,剩余本金\n';
    
    schedule.forEach(item => {
      csv += `${item.period},"${LoanUtils.formatDate(item.date)}",${item.cPayment || 0},${item.hPayment || 0},${item.payment},${item.principal},${item.interest},${item.remainingPrincipal}\n`;
    });
    
    // 创建下载链接
    LoanUtils.downloadTextFile(csv, filename, 'text/csv;charset=utf-8;');
  },
  
  /**
   * 导出贷款方案比较结果为CSV
   * @param {Array} results - 比较结果数组
   * @param {string} filename - 文件名
   */
  exportCompareResultsToCSV: function(results, filename) {
    // 创建CSV内容
    let csv = '贷款方案,贷款金额,贷款期限,还款方式,月供,总还款额,总利息,利息占比\n';
    
    results.forEach(item => {
      csv += `"${item.name}",${item.amount},"${Math.floor(item.term / 12)} 年 ${item.term % 12} 个月","${item.repaymentMethod}",${item.monthlyPayment},${item.totalPayment},${item.totalInterest},${(item.interestRatio * 100).toFixed(2)}%\n`;
    });
    
    // 创建下载链接
    LoanUtils.downloadTextFile(csv, filename, 'text/csv;charset=utf-8;');
  }
};

// 导出模块
window.LoanUI = LoanUI;