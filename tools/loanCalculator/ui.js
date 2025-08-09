/**
 * 贷款计算器 - UI模块
 */
(function() {
  // 定义UI模块
  const LoanUI = {
    // 显示贷款摘要
    displaySummary: function(container, amount, additionalCosts, term, rate, totalPayment, totalInterest, isEqualInstallment, isEqualPrincipal, isInterestOnly) {
      // 清空容器
      container.innerHTML = '';
      
      // 创建摘要表格
      const table = document.createElement('table');
      table.className = 'table table-bordered';
      
      // 添加表头
      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr>
          <th>贷款金额</th>
          <th>贷款期限</th>
          <th>年利率</th>
          <th>还款方式</th>
          <th>总还款额</th>
          <th>总利息</th>
          <th>利息占比</th>
        </tr>
      `;
      table.appendChild(thead);
      
      // 添加表体
      const tbody = document.createElement('tbody');
      const tr = document.createElement('tr');
      
      // 计算利息占比
      const interestRatio = totalInterest / totalPayment * 100;
      
      // 确定还款方式文本
      let repaymentMethod = '';
      if (isEqualInstallment) {
        repaymentMethod = '等额本息';
      } else if (isEqualPrincipal) {
        repaymentMethod = '等额本金';
      } else if (isInterestOnly) {
        repaymentMethod = '只还利息';
      }
      
      // 设置单元格内容
      tr.innerHTML = `
        <td>${LoanUtils.formatCurrency(amount)}${additionalCosts > 0 ? '<br><small>+' + LoanUtils.formatCurrency(additionalCosts) + '(税费)</small>' : ''}</td>
        <td>${term}月${term > 12 ? '<br><small>(' + (term / 12).toFixed(1) + '年)</small>' : ''}</td>
        <td>${(rate * 100).toFixed(2)}%</td>
        <td>${repaymentMethod}</td>
        <td>${LoanUtils.formatCurrency(totalPayment)}</td>
        <td>${LoanUtils.formatCurrency(totalInterest)}</td>
        <td>${interestRatio.toFixed(2)}%</td>
      `;
      
      tbody.appendChild(tr);
      table.appendChild(tbody);
      
      // 添加到容器
      container.appendChild(table);
    },
    
    // 显示还款计划
    displaySchedule: function(container, schedule, filter) {
      // 获取表格体
      const tbody = container.querySelector('tbody');
      
      // 清空表格体
      tbody.innerHTML = '';
      
      // 根据过滤器筛选数据
      let filteredSchedule = schedule;
      if (filter === 'first-year') {
        filteredSchedule = schedule.filter(payment => payment.month <= 12);
      } else if (filter === 'first-5-years') {
        filteredSchedule = schedule.filter(payment => payment.month <= 60);
      } else if (filter === 'last-year') {
        filteredSchedule = schedule.filter(payment => payment.month > schedule.length - 12);
      } else if (filter === 'key-points') {
        // 关键点：第1期、第12期、第24期、第36期、第60期、第120期、第180期、第240期、第300期、最后一期
        const keyMonths = [1, 12, 24, 36, 60, 120, 180, 240, 300, schedule.length];
        filteredSchedule = schedule.filter(payment => keyMonths.includes(payment.month));
      }
      
      // 添加行
      filteredSchedule.forEach(payment => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
          <td>${payment.month}</td>
          <td>${LoanUtils.formatDate(payment.date)}</td>
          <td>${LoanUtils.formatCurrency(payment.payment)}</td>
          <td>${LoanUtils.formatCurrency(payment.principal)}</td>
          <td>${LoanUtils.formatCurrency(payment.interest)}</td>
          <td>${LoanUtils.formatCurrency(payment.balance)}</td>
        `;
        
        // 如果有商业贷款和公积金贷款的分项
        if (payment.commercialPayment !== undefined && payment.housingPayment !== undefined) {
          tr.innerHTML += `
            <td>${LoanUtils.formatCurrency(payment.commercialPayment)}</td>
            <td>${LoanUtils.formatCurrency(payment.housingPayment)}</td>
          `;
        }
        
        tbody.appendChild(tr);
      });
    },
    
    // 显示提前还款比较
    displayPrepaymentComparison: function(container, originalResult, newResult, prepaymentAmount, alreadyPaid) {
      // 清空容器
      container.innerHTML = '';
      
      // 创建比较表格
      const table = document.createElement('table');
      table.className = 'table table-bordered';
      
      // 添加表头
      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr>
          <th></th>
          <th>原还款计划</th>
          <th>提前还款后</th>
          <th>节省</th>
        </tr>
      `;
      table.appendChild(thead);
      
      // 添加表体
      const tbody = document.createElement('tbody');
      
      // 计算节省的利息
      const savedInterest = originalResult.totalInterest - newResult.totalInterest - originalResult.schedule[alreadyPaid].interest;
      
      // 计算节省的期数
      const savedMonths = originalResult.schedule.length - newResult.schedule.length - 1;
      
      // 添加总还款额行
      const trPayment = document.createElement('tr');
      trPayment.innerHTML = `
        <td>总还款额</td>
        <td>${LoanUtils.formatCurrency(originalResult.totalPayment)}</td>
        <td>${LoanUtils.formatCurrency(newResult.totalPayment + prepaymentAmount + originalResult.paidAmount)}</td>
        <td>${LoanUtils.formatCurrency(originalResult.totalPayment - newResult.totalPayment - prepaymentAmount - originalResult.paidAmount)}</td>
      `;
      tbody.appendChild(trPayment);
      
      // 添加总利息行
      const trInterest = document.createElement('tr');
      trInterest.innerHTML = `
        <td>总利息</td>
        <td>${LoanUtils.formatCurrency(originalResult.totalInterest)}</td>
        <td>${LoanUtils.formatCurrency(newResult.totalInterest + originalResult.paidInterest)}</td>
        <td>${LoanUtils.formatCurrency(savedInterest)}</td>
      `;
      tbody.appendChild(trInterest);
      
      // 添加还款期数行
      const trTerm = document.createElement('tr');
      trTerm.innerHTML = `
        <td>还款期数</td>
        <td>${originalResult.schedule.length}期</td>
        <td>${newResult.schedule.length + alreadyPaid + 1}期</td>
        <td>${savedMonths}期</td>
      `;
      tbody.appendChild(trTerm);
      
      // 添加月供行
      const trMonthly = document.createElement('tr');
      trMonthly.innerHTML = `
        <td>月供</td>
        <td>${LoanUtils.formatCurrency(originalResult.schedule[0].payment)}</td>
        <td>${LoanUtils.formatCurrency(newResult.schedule[0].payment)}</td>
        <td>${LoanUtils.formatCurrency(originalResult.schedule[0].payment - newResult.schedule[0].payment)}</td>
      `;
      tbody.appendChild(trMonthly);
      
      table.appendChild(tbody);
      
      // 添加到容器
      container.appendChild(table);
      
      // 添加提前还款说明
      const info = document.createElement('div');
      info.className = 'alert alert-info';
      info.innerHTML = `
        <p>提前还款金额: ${LoanUtils.formatCurrency(prepaymentAmount)}</p>
        <p>已还期数: ${alreadyPaid}期</p>
        <p>提前还款后剩余期数: ${newResult.schedule.length}期</p>
        <p>节省利息: ${LoanUtils.formatCurrency(savedInterest)}</p>
      `;
      
      container.appendChild(info);
    },
    
    // 显示贷款方案比较表格
    displayComparisonTable: function(container, results) {
      // 清空容器
      container.innerHTML = '';
      
      // 创建表格
      const table = document.createElement('table');
      table.className = 'table table-bordered table-striped';
      
      // 添加表头
      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr>
          <th>贷款类型</th>
          <th>还款方式</th>
          <th>贷款金额</th>
          <th>贷款期限</th>
          <th>年利率</th>
          <th>首月月供</th>
          <th>末月月供</th>
          <th>总还款额</th>
          <th>总利息</th>
          <th>利息占比</th>
        </tr>
      `;
      table.appendChild(thead);
      
      // 添加表体
      const tbody = document.createElement('tbody');
      
      results.forEach(result => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
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
        </tr>
      `;
        
        tbody.appendChild(tr);
      });
      
      table.appendChild(tbody);
      
      // 添加到容器
      container.appendChild(table);
    },
    
    // 显示利率参考
    showRateReference: function(type, rateData, callback) {
      // 创建模态框
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.style.display = 'block';
      
      // 根据贷款类型选择数据
      const data = type === 'commercial' ? rateData.commercial : rateData.housing;
      
      // 创建模态框内容
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>${data.name}</h3>
            <span class="close">&times;</span>
          </div>
          <div class="modal-body">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>贷款期限</th>
                  <th>基准利率(%)</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                ${data.rates.map(item => `
                  <tr>
                    <td>${item.term}</td>
                    <td>${item.rate.toFixed(2)}</td>
                    <td><button class="btn btn-sm btn-primary select-rate" data-rate="${item.rate}">选择</button></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <p class="text-muted">注：以上利率仅供参考，实际利率以银行公布为准。</p>
          </div>
        </div>
      `;
      
      // 添加到文档
      document.body.appendChild(modal);
      
      // 关闭按钮事件
      const closeBtn = modal.querySelector('.close');
      closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      
      // 点击模态框外部关闭
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });
      
      // 选择利率按钮事件
      const selectBtns = modal.querySelectorAll('.select-rate');
      selectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const rate = parseFloat(btn.dataset.rate);
          callback(rate);
          document.body.removeChild(modal);
        });
      });
    }
  };
  
  // 导出模块
  window.LoanUI = LoanUI;
})();