/**
 * 贷款计算器
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-money"></i> 贷款计算器</h2>
          <p class="tool-description">计算贷款利息和还款计划，支持等额本息和等额本金两种还款方式。</p>
        </div>
        
        <div class="loan-container">
          <div class="loan-input-section">
            <div class="form-group">
              <label for="loan-amount">贷款金额</label>
              <div class="input-with-unit">
                <input type="number" id="loan-amount" class="form-control" value="100000" min="1" step="1000" />
                <span class="unit">元</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="loan-term">贷款期限</label>
              <div class="input-with-unit">
                <input type="number" id="loan-term" class="form-control" value="12" min="1" max="360" />
                <select id="term-unit" class="form-control">
                  <option value="month">月</option>
                  <option value="year">年</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="interest-rate">年利率</label>
              <div class="input-with-unit">
                <input type="number" id="interest-rate" class="form-control" value="4.35" min="0.01" step="0.01" />
                <span class="unit">%</span>
              </div>
            </div>
            
            <div class="form-group">
              <label>还款方式</label>
              <div class="repayment-options">
                <div class="form-check">
                  <input type="radio" name="repayment-method" id="method-equal-installment" value="equal-installment" checked />
                  <label for="method-equal-installment">等额本息</label>
                </div>
                <div class="form-check">
                  <input type="radio" name="repayment-method" id="method-equal-principal" value="equal-principal" />
                  <label for="method-equal-principal">等额本金</label>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label>首次还款日期</label>
              <input type="date" id="first-payment-date" class="form-control" />
            </div>
            
            <div class="loan-actions">
              <button id="calculate-btn" class="btn btn-success"><i class="fa fa-calculator"></i> 计算</button>
              <button id="clear-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
            </div>
          </div>
          
          <div class="loan-result-section">
            <div class="result-header">
              <h3>计算结果</h3>
              <div class="result-actions">
                <button id="export-btn" class="btn btn-sm"><i class="fa fa-download"></i> 导出还款计划</button>
              </div>
            </div>
            
            <div class="loan-summary" id="loan-summary"></div>
            
            <div class="loan-chart-container">
              <canvas id="loan-chart"></canvas>
            </div>
            
            <div class="loan-schedule-header">
              <h3>还款计划</h3>
              <div class="schedule-filter">
                <label for="schedule-filter">显示:</label>
                <select id="schedule-filter" class="form-control form-control-sm">
                  <option value="all">全部</option>
                  <option value="first-year">第一年</option>
                  <option value="first-5-years">前5年</option>
                  <option value="first-10">前10期</option>
                  <option value="last-10">后10期</option>
                </select>
              </div>
            </div>
            
            <div class="loan-schedule-container">
              <table class="loan-schedule" id="loan-schedule">
                <thead>
                  <tr>
                    <th>期数</th>
                    <th>还款日期</th>
                    <th>月供</th>
                    <th>本金</th>
                    <th>利息</th>
                    <th>剩余本金</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div class="loan-info">
          <div class="info-header">
            <h3>还款方式说明</h3>
          </div>
          <div class="info-content">
            <div class="info-item">
              <h4>等额本息</h4>
              <p>每月还款金额相同，其中本金逐月递增，利息逐月递减。适合收入稳定的借款人。</p>
              <p>计算公式：每月还款额 = 贷款本金 × 月利率 × (1 + 月利率)^还款月数 ÷ [(1 + 月利率)^还款月数 - 1]</p>
            </div>
            
            <div class="info-item">
              <h4>等额本金</h4>
              <p>每月归还等额本金和剩余贷款在该月所产生的利息，月供逐月递减。前期还款压力较大，但总利息较低。</p>
              <p>计算公式：每月归还本金 = 贷款本金 ÷ 还款月数<br>每月利息 = 剩余本金 × 月利率<br>每月还款额 = 每月归还本金 + 每月利息</p>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('loanCalculator', container.querySelector('.tool-header'));
      
      // 获取元素
      const loanAmount = container.querySelector('#loan-amount');
      const loanTerm = container.querySelector('#loan-term');
      const termUnit = container.querySelector('#term-unit');
      const interestRate = container.querySelector('#interest-rate');
      const methodEqualInstallment = container.querySelector('#method-equal-installment');
      const methodEqualPrincipal = container.querySelector('#method-equal-principal');
      const firstPaymentDate = container.querySelector('#first-payment-date');
      const calculateBtn = container.querySelector('#calculate-btn');
      const clearBtn = container.querySelector('#clear-btn');
      const exportBtn = container.querySelector('#export-btn');
      const loanSummary = container.querySelector('#loan-summary');
      const loanChart = container.querySelector('#loan-chart');
      const scheduleFilter = container.querySelector('#schedule-filter');
      const loanSchedule = container.querySelector('#loan-schedule');
      
      // 设置默认首次还款日期为下个月1日
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      firstPaymentDate.value = nextMonth.toISOString().slice(0, 10);
      
      // 图表实例
      let chartInstance = null;
      
      // 计算贷款
      function calculateLoan() {
        // 获取输入值
        const amount = parseFloat(loanAmount.value);
        let term = parseInt(loanTerm.value);
        const rate = parseFloat(interestRate.value) / 100;
        const isEqualInstallment = methodEqualInstallment.checked;
        const startDate = new Date(firstPaymentDate.value);
        
        // 验证输入
        if (isNaN(amount) || amount <= 0) {
          showToast('请输入有效的贷款金额', 'warning');
          return;
        }
        
        if (isNaN(term) || term <= 0) {
          showToast('请输入有效的贷款期限', 'warning');
          return;
        }
        
        if (isNaN(rate) || rate <= 0) {
          showToast('请输入有效的年利率', 'warning');
          return;
        }
        
        if (isNaN(startDate.getTime())) {
          showToast('请选择有效的首次还款日期', 'warning');
          return;
        }
        
        // 如果期限单位是年，转换为月
        if (termUnit.value === 'year') {
          term *= 12;
        }
        
        // 月利率
        const monthlyRate = rate / 12;
        
        // 计算还款计划
        const schedule = [];
        let totalPayment = 0;
        let totalInterest = 0;
        let remainingPrincipal = amount;
        
        if (isEqualInstallment) {
          // 等额本息
          // 每月还款额 = 贷款本金 × 月利率 × (1 + 月利率)^还款月数 ÷ [(1 + 月利率)^还款月数 - 1]
          const monthlyPayment = amount * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
          
          for (let i = 1; i <= term; i++) {
            const interest = remainingPrincipal * monthlyRate;
            const principal = monthlyPayment - interest;
            remainingPrincipal -= principal;
            
            // 处理最后一期可能的舍入误差
            if (i === term) {
              remainingPrincipal = 0;
            }
            
            // 计算还款日期
            const paymentDate = new Date(startDate);
            paymentDate.setMonth(startDate.getMonth() + i - 1);
            
            schedule.push({
              period: i,
              date: paymentDate,
              payment: monthlyPayment,
              principal: principal,
              interest: interest,
              remainingPrincipal: remainingPrincipal
            });
            
            totalPayment += monthlyPayment;
            totalInterest += interest;
          }
        } else {
          // 等额本金
          // 每月归还本金 = 贷款本金 ÷ 还款月数
          const monthlyPrincipal = amount / term;
          
          for (let i = 1; i <= term; i++) {
            const interest = remainingPrincipal * monthlyRate;
            const payment = monthlyPrincipal + interest;
            remainingPrincipal -= monthlyPrincipal;
            
            // 处理最后一期可能的舍入误差
            if (i === term) {
              remainingPrincipal = 0;
            }
            
            // 计算还款日期
            const paymentDate = new Date(startDate);
            paymentDate.setMonth(startDate.getMonth() + i - 1);
            
            schedule.push({
              period: i,
              date: paymentDate,
              payment: payment,
              principal: monthlyPrincipal,
              interest: interest,
              remainingPrincipal: remainingPrincipal
            });
            
            totalPayment += payment;
            totalInterest += interest;
          }
        }
        
        // 显示结果摘要
        displaySummary(amount, term, rate, totalPayment, totalInterest, isEqualInstallment);
        
        // 显示还款计划
        displaySchedule(schedule);
        
        // 显示图表
        displayChart(schedule, isEqualInstallment);
        
        // 启用导出按钮
        exportBtn.disabled = false;
      }
      
      // 显示结果摘要
      function displaySummary(amount, term, rate, totalPayment, totalInterest, isEqualInstallment) {
        const monthlyPayment = isEqualInstallment ? totalPayment / term : (amount / term) + (amount * (rate / 12));
        
        loanSummary.innerHTML = `
          <div class="summary-item">
            <div class="summary-label">贷款金额</div>
            <div class="summary-value">${formatCurrency(amount)}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">贷款期限</div>
            <div class="summary-value">${term} 个月 (${Math.floor(term / 12)} 年 ${term % 12} 个月)</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">年利率</div>
            <div class="summary-value">${rate.toFixed(2)}%</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">还款方式</div>
            <div class="summary-value">${isEqualInstallment ? '等额本息' : '等额本金'}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">${isEqualInstallment ? '月供' : '首月还款额'}</div>
            <div class="summary-value highlight">${formatCurrency(monthlyPayment)}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">总还款额</div>
            <div class="summary-value">${formatCurrency(totalPayment)}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">总利息</div>
            <div class="summary-value">${formatCurrency(totalInterest)}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">利息占比</div>
            <div class="summary-value">${(totalInterest / totalPayment * 100).toFixed(2)}%</div>
          </div>
        `;
      }
      
      // 显示还款计划
      function displaySchedule(schedule) {
        const tbody = loanSchedule.querySelector('tbody');
        tbody.innerHTML = '';
        
        // 根据过滤器筛选显示的还款计划
        let filteredSchedule = [...schedule];
        const filterValue = scheduleFilter.value;
        
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
            <td>${formatDate(item.date)}</td>
            <td>${formatCurrency(item.payment)}</td>
            <td>${formatCurrency(item.principal)}</td>
            <td>${formatCurrency(item.interest)}</td>
            <td>${formatCurrency(item.remainingPrincipal)}</td>
          `;
          
          tbody.appendChild(row);
        });
      }
      
      // 显示图表
      function displayChart(schedule, isEqualInstallment) {
        // 如果已有图表实例，销毁它
        if (chartInstance) {
          chartInstance.destroy();
        }
        
        // 准备图表数据
        const labels = schedule.map(item => item.period);
        const principalData = schedule.map(item => item.principal);
        const interestData = schedule.map(item => item.interest);
        const paymentData = schedule.map(item => item.payment);
        const remainingData = schedule.map(item => item.remainingPrincipal);
        
        // 创建图表
        const ctx = loanChart.getContext('2d');
        chartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: '本金',
                data: principalData,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              },
              {
                label: '利息',
                data: interestData,
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              },
              {
                label: '剩余本金',
                data: remainingData,
                type: 'line',
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
                yAxisID: 'y1'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                stacked: true,
                title: {
                  display: true,
                  text: '期数'
                }
              },
              y: {
                stacked: true,
                title: {
                  display: true,
                  text: '金额 (元)'
                }
              },
              y1: {
                position: 'right',
                grid: {
                  drawOnChartArea: false
                },
                title: {
                  display: true,
                  text: '剩余本金 (元)'
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': ' + formatCurrency(context.raw);
                  }
                }
              }
            }
          }
        });
      }
      
      // 导出还款计划
      function exportSchedule() {
        // 获取表格数据
        const rows = Array.from(loanSchedule.querySelectorAll('tbody tr'));
        
        if (rows.length === 0) {
          showToast('没有可导出的还款计划', 'warning');
          return;
        }
        
        // 创建CSV内容
        let csv = '期数,还款日期,月供,本金,利息,剩余本金\n';
        
        rows.forEach(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          const rowData = cells.map(cell => `"${cell.textContent}"`).join(',');
          csv += rowData + '\n';
        });
        
        // 创建下载链接
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `贷款还款计划_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('还款计划已导出', 'success');
      }
      
      // 格式化货币
      function formatCurrency(value) {
        return new Intl.NumberFormat('zh-CN', {
          style: 'currency',
          currency: 'CNY',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value);
      }
      
      // 格式化日期
      function formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
      
      // 事件监听
      calculateBtn.addEventListener('click', calculateLoan);
      
      clearBtn.addEventListener('click', () => {
        loanAmount.value = '100000';
        loanTerm.value = '12';
        termUnit.value = 'month';
        interestRate.value = '4.35';
        methodEqualInstallment.checked = true;
        
        // 重置首次还款日期为下个月1日
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        firstPaymentDate.value = nextMonth.toISOString().slice(0, 10);
        
        // 清空结果
        loanSummary.innerHTML = '';
        loanSchedule.querySelector('tbody').innerHTML = '';
        
        // 销毁图表
        if (chartInstance) {
          chartInstance.destroy();
          chartInstance = null;
        }
        
        // 禁用导出按钮
        exportBtn.disabled = true;
      });
      
      exportBtn.addEventListener('click', exportSchedule);
      
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
      
      // 初始禁用导出按钮
      exportBtn.disabled = true;
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .loan-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .loan-input-section {
          flex: 1;
          min-width: 300px;
        }
        
        .loan-result-section {
          flex: 2;
          min-width: 400px;
        }
        
        .input-with-unit {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .input-with-unit .unit {
          color: var(--text-muted);
        }
        
        .repayment-options {
          display: flex;
          gap: 20px;
          margin-top: 10px;
        }
        
        .form-check {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .loan-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .result-header h3 {
          margin: 0;
        }
        
        .loan-summary {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .summary-item {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
        }
        
        .summary-label {
          color: var(--text-muted);
          margin-bottom: 5px;
          font-size: 14px;
        }
        
        .summary-value {
          font-size: 16px;
          font-weight: 500;
        }
        
        .summary-value.highlight {
          color: var(--primary-color);
          font-size: 18px;
        }
        
        .loan-chart-container {
          height: 300px;
          margin-bottom: 20px;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
        }
        
        .loan-schedule-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .loan-schedule-header h3 {
          margin: 0;
        }
        
        .schedule-filter {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .loan-schedule-container {
          overflow-x: auto;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
        }
        
        .loan-schedule {
          width: 100%;
          border-collapse: collapse;
        }
        
        .loan-schedule th, .loan-schedule td {
          padding: 10px;
          text-align: right;
          border-bottom: 1px solid var(--border-color);
        }
        
        .loan-schedule th:first-child, .loan-schedule td:first-child,
        .loan-schedule th:nth-child(2), .loan-schedule td:nth-child(2) {
          text-align: left;
        }
        
        .loan-schedule th {
          background-color: var(--bg-color);
          font-weight: 500;
        }
        
        .loan-info {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .info-header {
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .info-header h3 {
          margin: 0;
        }
        
        .info-content {
          padding: 15px;
        }
        
        .info-item {
          margin-bottom: 20px;
        }
        
        .info-item:last-child {
          margin-bottom: 0;
        }
        
        .info-item h4 {
          margin-top: 0;
          margin-bottom: 10px;
        }
        
        .info-item p {
          margin: 0 0 10px 0;
        }
        
        @media (max-width: 768px) {
          .loan-container {
            flex-direction: column;
          }
          
          .loan-summary {
            grid-template-columns: 1fr 1fr;
          }
        }
      `;
      container.appendChild(style);
      
      // 加载Chart.js库
      if (!window.Chart) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        document.head.appendChild(script);
        
        script.onload = () => {
          showToast('Chart.js库加载成功', 'success');
        };
        
        script.onerror = () => {
          showToast('Chart.js库加载失败，请检查网络连接', 'error');
        };
      }
    }
  };
  
  // 注册工具
  window.tools.loanCalculator = tool;
})();