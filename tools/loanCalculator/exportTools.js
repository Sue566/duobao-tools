/**
 * 贷款计算器 - 导出工具模块
 */
(function() {
  // 定义导出工具模块
  const ExportTools = {
    // 初始化模块
    init: function() {
      // 获取DOM元素
      this.exportBtn = document.getElementById('export-btn');
      this.savePlanBtn = document.getElementById('save-plan-btn');
      this.exportCombinedBtn = document.getElementById('export-combined-btn');
      this.exportPrepaymentBtn = document.getElementById('export-prepayment-btn');
      this.exportCompareBtn = document.getElementById('export-compare-btn');
    },
    
    // 导出还款计划到CSV
    exportScheduleToCSV: function(type) {
      let schedule, filename, headers;
      
      // 根据类型获取不同的数据
      if (type === 'basic') {
        if (!window.basicLoanResult) {
          LoanUtils.showToast('没有可导出的数据', 'warning');
          return;
        }
        
        schedule = window.basicLoanResult.schedule;
        filename = '贷款还款计划_' + LoanUtils.formatDate(new Date()) + '.csv';
        headers = ['期数', '还款日期', '月供', '本金', '利息', '剩余本金'];
      } else if (type === 'combined') {
        if (!window.combinedLoanResult) {
          LoanUtils.showToast('没有可导出的数据', 'warning');
          return;
        }
        
        schedule = window.combinedLoanResult.schedule;
        filename = '组合贷款还款计划_' + LoanUtils.formatDate(new Date()) + '.csv';
        headers = ['期数', '还款日期', '月供', '本金', '利息', '剩余本金', '商业贷款月供', '公积金贷款月供'];
      } else if (type === 'prepayment') {
        if (!window.prepaymentResult) {
          LoanUtils.showToast('没有可导出的数据', 'warning');
          return;
        }
        
        // 提前还款导出两个计划
        const originalSchedule = window.prepaymentResult.originalSchedule;
        const newSchedule = window.prepaymentResult.newSchedule;
        const alreadyPaid = window.prepaymentParams.alreadyPaid;
        
        filename = '提前还款对比_' + LoanUtils.formatDate(new Date()) + '.csv';
        
        // 创建CSV内容
        let csvContent = '原还款计划\n';
        csvContent += '期数,还款日期,月供,本金,利息,剩余本金\n';
        
        originalSchedule.forEach(payment => {
          csvContent += [
            payment.month,
            LoanUtils.formatDate(payment.date),
            payment.payment.toFixed(2),
            payment.principal.toFixed(2),
            payment.interest.toFixed(2),
            payment.balance.toFixed(2)
          ].join(',') + '\n';
        });
        
        csvContent += '\n提前还款后计划\n';
        csvContent += '期数,还款日期,月供,本金,利息,剩余本金\n';
        
        // 添加已还期数
        for (let i = 0; i < alreadyPaid; i++) {
          csvContent += [
            originalSchedule[i].month,
            LoanUtils.formatDate(originalSchedule[i].date),
            originalSchedule[i].payment.toFixed(2),
            originalSchedule[i].principal.toFixed(2),
            originalSchedule[i].interest.toFixed(2),
            originalSchedule[i].balance.toFixed(2)
          ].join(',') + '\n';
        }
        
        // 添加提前还款
        csvContent += [
          alreadyPaid + 1,
          LoanUtils.formatDate(newSchedule[0].date),
          window.prepaymentParams.prepaymentAmount.toFixed(2),
          window.prepaymentParams.prepaymentAmount.toFixed(2),
          '0.00',
          (originalSchedule[alreadyPaid].balance - window.prepaymentParams.prepaymentAmount).toFixed(2)
        ].join(',') + '\n';
        
        // 添加新还款计划
        newSchedule.forEach(payment => {
          csvContent += [
            payment.month + alreadyPaid + 1,
            LoanUtils.formatDate(payment.date),
            payment.payment.toFixed(2),
            payment.principal.toFixed(2),
            payment.interest.toFixed(2),
            payment.balance.toFixed(2)
          ].join(',') + '\n';
        });
        
        // 创建并下载CSV文件
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        LoanUtils.showToast('导出成功', 'success');
        return;
      }
      
      // 创建CSV内容
      let csvContent = headers.join(',') + '\n';
      
      schedule.forEach(payment => {
        const row = [
          payment.month,
          LoanUtils.formatDate(payment.date),
          payment.payment.toFixed(2),
          payment.principal.toFixed(2),
          payment.interest.toFixed(2),
          payment.balance.toFixed(2)
        ];
        
        // 如果是组合贷款，添加额外的列
        if (type === 'combined') {
          row.push(payment.commercialPayment.toFixed(2));
          row.push(payment.housingPayment.toFixed(2));
        }
        
        csvContent += row.join(',') + '\n';
      });
      
      // 创建并下载CSV文件
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      LoanUtils.showToast('导出成功', 'success');
    },
    
    // 导出贷款方案比较到CSV
    exportComparisonToCSV: function() {
      if (!window.comparisonResults) {
        LoanUtils.showToast('没有可导出的数据', 'warning');
        return;
      }
      
      const results = window.comparisonResults;
      const filename = '贷款方案比较_' + LoanUtils.formatDate(new Date()) + '.csv';
      
      // 创建CSV内容
      let csvContent = '贷款类型,还款方式,贷款金额,贷款期限,年利率,首月月供,末月月供,总还款额,总利息,利息占比\n';
      
      results.forEach(result => {
        csvContent += [
          result.type,
          result.method,
          result.amount.toFixed(2),
          result.term / 12 + '年',
          typeof result.rate === 'string' ? result.rate : (result.rate * 100).toFixed(2) + '%',
          result.firstPayment.toFixed(2),
          result.lastPayment.toFixed(2),
          result.totalPayment.toFixed(2),
          result.totalInterest.toFixed(2),
          (result.interestRatio * 100).toFixed(2) + '%'
        ].join(',') + '\n';
      });
      
      // 创建并下载CSV文件
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      LoanUtils.showToast('导出成功', 'success');
    },
    
    // 保存贷款方案
    savePlan: function(type) {
      if (type === 'basic' && !window.basicLoanResult) {
        LoanUtils.showToast('没有可保存的方案', 'warning');
        return;
      }
      
      // 获取当前方案数据
      const planData = {
        type: type,
        date: new Date().toISOString(),
        params: type === 'basic' ? window.basicLoanParams : null,
        result: type === 'basic' ? {
          totalPayment: window.basicLoanResult.totalPayment,
          totalInterest: window.basicLoanResult.totalInterest
        } : null
      };
      
      // 获取已保存的方案
      let savedPlans = localStorage.getItem('loanCalculatorPlans');
      savedPlans = savedPlans ? JSON.parse(savedPlans) : [];
      
      // 添加新方案
      savedPlans.push(planData);
      
      // 保存到本地存储
      localStorage.setItem('loanCalculatorPlans', JSON.stringify(savedPlans));
      
      LoanUtils.showToast('方案保存成功', 'success');
      
      // 显示保存的方案
      this.showSavedPlans();
    },
    
    // 显示已保存的方案
    showSavedPlans: function() {
      // 获取已保存的方案
      let savedPlans = localStorage.getItem('loanCalculatorPlans');
      savedPlans = savedPlans ? JSON.parse(savedPlans) : [];
      
      if (savedPlans.length === 0) {
        LoanUtils.showToast('没有已保存的方案', 'info');
        return;
      }
      
      // 创建模态框
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>已保存的贷款方案</h3>
            <span class="close">&times;</span>
          </div>
          <div class="modal-body">
            <table class="table">
              <thead>
                <tr>
                  <th>保存时间</th>
                  <th>贷款类型</th>
                  <th>贷款金额</th>
                  <th>贷款期限</th>
                  <th>年利率</th>
                  <th>还款方式</th>
                  <th>总还款额</th>
                  <th>总利息</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // 填充表格
      const tbody = modal.querySelector('tbody');
      
      savedPlans.forEach((plan, index) => {
        if (plan.type === 'basic') {
          const row = document.createElement('tr');
          
          const params = plan.params;
          const result = plan.result;
          
          row.innerHTML = `
            <td>${new Date(plan.date).toLocaleString()}</td>
            <td>${params.amount < 1000000 ? '个人贷款' : '房贷'}</td>
            <td>${LoanUtils.formatCurrency(params.amount)}</td>
            <td>${params.term}月</td>
            <td>${(params.rate * 100).toFixed(2)}%</td>
            <td>${params.isEqualInstallment ? '等额本息' : (params.isEqualPrincipal ? '等额本金' : '只还利息')}</td>
            <td>${LoanUtils.formatCurrency(result.totalPayment)}</td>
            <td>${LoanUtils.formatCurrency(result.totalInterest)}</td>
            <td>
              <button class="btn btn-sm btn-primary load-plan-btn" data-index="${index}">加载</button>
              <button class="btn btn-sm btn-danger delete-plan-btn" data-index="${index}">删除</button>
            </td>
          `;
          
          tbody.appendChild(row);
        }
      });
      
      // 添加事件监听
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
      
      // 加载方案
      const loadBtns = modal.querySelectorAll('.load-plan-btn');
      loadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.dataset.index);
          const plan = savedPlans[index];
          
          if (plan.type === 'basic') {
            // 填充表单
            document.getElementById('loan-amount').value = plan.params.amount;
            document.getElementById('loan-term').value = plan.params.term;
            document.getElementById('term-unit').value = 'month';
            document.getElementById('interest-rate').value = (plan.params.rate * 100).toFixed(2);
            document.getElementById('rate-adjustment').value = '0';
            
            if (plan.params.isEqualInstallment) {
              document.getElementById('method-equal-installment').checked = true;
            } else if (plan.params.isEqualPrincipal) {
              document.getElementById('method-equal-principal').checked = true;
            } else {
              document.getElementById('method-interest-only').checked = true;
            }
            
            // 关闭模态框
            document.body.removeChild(modal);
            
            // 自动计算
            document.getElementById('calculate-btn').click();
          }
        });
      });
      
      // 删除方案
      const deleteBtns = modal.querySelectorAll('.delete-plan-btn');
      deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.dataset.index);
          
          // 确认删除
          if (confirm('确定要删除这个方案吗？')) {
            savedPlans.splice(index, 1);
            localStorage.setItem('loanCalculatorPlans', JSON.stringify(savedPlans));
            
            // 重新显示
            document.body.removeChild(modal);
            this.showSavedPlans();
          }
        });
      });
    }
  };
  
  // 导出模块
  window.ExportTools = ExportTools;
})();