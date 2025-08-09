/**
 * 贷款计算器 - 工具函数模块
 */
(function() {
  // 定义工具函数模块
  const LoanUtils = {
    // 格式化日期为 YYYY-MM-DD
    formatDate: function(date) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    },
    
    // 格式化货币，添加千位分隔符和保留两位小数
    formatCurrency: function(amount) {
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    },
    
    // 显示提示消息
    showToast: function(message, type = 'info') {
      // 创建toast元素
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = message;
      
      // 添加到文档
      document.body.appendChild(toast);
      
      // 显示动画
      setTimeout(() => {
        toast.classList.add('show');
      }, 10);
      
      // 自动隐藏
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    },
    
    // 复制文本到剪贴板
    copyToClipboard: function(text) {
      // 创建临时文本区域
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        // 执行复制命令
        const successful = document.execCommand('copy');
        
        if (successful) {
          this.showToast('复制成功', 'success');
        } else {
          this.showToast('复制失败，请手动复制', 'error');
        }
      } catch (err) {
        this.showToast('复制失败: ' + err, 'error');
      }
      
      document.body.removeChild(textarea);
    },
    
    // 计算下一个还款日期
    calculateNextPaymentDate: function(currentDate) {
      const nextDate = new Date(currentDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
      return nextDate;
    },
    
    // 计算两个日期之间的月数
    calculateMonthsBetween: function(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const yearDiff = end.getFullYear() - start.getFullYear();
      const monthDiff = end.getMonth() - start.getMonth();
      
      return yearDiff * 12 + monthDiff;
    },
    
    // 验证输入是否为有效数字
    isValidNumber: function(value) {
      return !isNaN(parseFloat(value)) && isFinite(value) && parseFloat(value) > 0;
    },
    
    // 验证日期是否有效
    isValidDate: function(dateString) {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    },
    
    // 计算月供（等额本息）
    calculateMonthlyPayment: function(principal, term, rate) {
      const monthlyRate = rate / 12;
      return principal * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
    },
    
    // 计算首月月供（等额本金）
    calculateFirstMonthlyPayment: function(principal, term, rate) {
      const monthlyPrincipal = principal / term;
      const monthlyInterest = principal * (rate / 12);
      return monthlyPrincipal + monthlyInterest;
    },
    
    // 计算最后一月月供（等额本金）
    calculateLastMonthlyPayment: function(principal, term, rate) {
      const monthlyPrincipal = principal / term;
      const lastMonthInterest = monthlyPrincipal * (rate / 12);
      return monthlyPrincipal + lastMonthInterest;
    },
    
    // 计算总利息（等额本息）
    calculateTotalInterest: function(principal, term, rate) {
      const monthlyPayment = this.calculateMonthlyPayment(principal, term, rate);
      return monthlyPayment * term - principal;
    },
    
    // 计算总利息（等额本金）
    calculateTotalInterestEqualPrincipal: function(principal, term, rate) {
      const monthlyRate = rate / 12;
      let totalInterest = 0;
      
      for (let i = 0; i < term; i++) {
        const remainingPrincipal = principal * (1 - i / term);
        totalInterest += remainingPrincipal * monthlyRate;
      }
      
      return totalInterest;
    },
    
    // 计算提前还款后的剩余本金
    calculateRemainingPrincipal: function(principal, term, rate, paidMonths, prepaymentAmount) {
      if (paidMonths >= term) {
        return 0;
      }
      
      const monthlyRate = rate / 12;
      const monthlyPayment = this.calculateMonthlyPayment(principal, term, rate);
      
      let remainingPrincipal = principal;
      
      // 计算已还期数后的剩余本金
      for (let i = 0; i < paidMonths; i++) {
        const interest = remainingPrincipal * monthlyRate;
        const principalPaid = monthlyPayment - interest;
        remainingPrincipal -= principalPaid;
      }
      
      // 减去提前还款金额
      remainingPrincipal -= prepaymentAmount;
      
      return Math.max(0, remainingPrincipal);
    },
    
    // 计算提前还款后的新贷款期限（保持月供不变）
    calculateNewTerm: function(remainingPrincipal, monthlyPayment, rate) {
      const monthlyRate = rate / 12;
      
      // 使用等额本息公式反推期限
      // P = L * [r(1+r)^n] / [(1+r)^n - 1]
      // 其中 P 是月供，L 是贷款金额，r 是月利率，n 是期限
      
      // 如果月供小于或等于月利息，则无法还清
      const monthlyInterest = remainingPrincipal * monthlyRate;
      if (monthlyPayment <= monthlyInterest) {
        return Infinity;
      }
      
      // 计算新期限
      const numerator = Math.log(monthlyPayment);
      const denominator = Math.log(monthlyPayment - remainingPrincipal * monthlyRate);
      const newTerm = Math.log(monthlyPayment / (monthlyPayment - remainingPrincipal * monthlyRate)) / Math.log(1 + monthlyRate);
      
      return Math.ceil(newTerm);
    },
    
    // 计算提前还款后的新月供（保持期限不变）
    calculateNewMonthlyPayment: function(remainingPrincipal, remainingTerm, rate) {
      return this.calculateMonthlyPayment(remainingPrincipal, remainingTerm, rate);
    },
    
    // 生成随机颜色
    generateRandomColor: function() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    
    // 生成对比色
    generateContrastColor: function(hexColor) {
      // 将十六进制颜色转换为RGB
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      
      // 计算亮度
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      
      // 根据亮度返回黑色或白色
      return brightness > 128 ? '#000000' : '#FFFFFF';
    }
  };
  
  // 导出模块
  window.LoanUtils = LoanUtils;
})();