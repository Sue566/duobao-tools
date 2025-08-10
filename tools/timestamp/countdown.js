/**
 * 时间戳转换工具 - 倒计时计算功能
 */

window.timestampCountdown = {
  /**
   * 初始化倒计时计算功能
   * @param {HTMLElement} container - 容器元素
   */
  init: function(container) {
    this.container = container;
    this.utils = window.timestampUtils;
    
    this.setupReferences();
    this.setupEvents();
  },
  
  /**
   * 设置DOM引用
   */
  setupReferences: function() {
    this.countdownFrom = this.container.querySelector('#countdown-from');
    this.countdownTo = this.container.querySelector('#countdown-to');
    this.countdownFromNow = this.container.querySelector('#countdown-from-now');
    this.countdownToNow = this.container.querySelector('#countdown-to-now');
    this.calculateCountdown = this.container.querySelector('#calculate-countdown');
    this.countdownTotal = this.container.querySelector('#countdown-total');
    this.countdownDetailed = this.container.querySelector('#countdown-detailed');
    this.countdownWorkdays = this.container.querySelector('#countdown-workdays');
    this.commonDateBtns = this.container.querySelectorAll('.common-date-btn');
  },
  
  /**
   * 设置事件处理
   */
  setupEvents: function() {
    if (this.countdownFromNow) {
      this.countdownFromNow.addEventListener('click', () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        this.countdownFrom.value = `${year}-${month}-${day}T${hours}:${minutes}`;
      });
    }
    
    if (this.countdownToNow) {
      this.countdownToNow.addEventListener('click', () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        this.countdownTo.value = `${year}-${month}-${day}T${hours}:${minutes}`;
      });
    }
    
    if (this.calculateCountdown) {
      this.calculateCountdown.addEventListener('click', () => this.calculateCountdownFunc());
    }
    
    // 常用日期按钮事件
    if (this.commonDateBtns) {
      this.commonDateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const days = parseInt(btn.getAttribute('data-days'));
          const now = new Date();
          const targetDate = new Date(now.getTime() + days * 86400000);
          
          const year = targetDate.getFullYear();
          const month = String(targetDate.getMonth() + 1).padStart(2, '0');
          const day = String(targetDate.getDate()).padStart(2, '0');
          const hours = String(targetDate.getHours()).padStart(2, '0');
          const minutes = String(targetDate.getMinutes()).padStart(2, '0');
          
          this.countdownTo.value = `${year}-${month}-${day}T${hours}:${minutes}`;
          
          if (this.countdownFrom.value) {
            this.calculateCountdownFunc();
          }
        });
      });
    }
  },
  
  /**
   * 计算倒计时
   */
  calculateCountdownFunc: function() {
    const fromValue = this.countdownFrom.value;
    const toValue = this.countdownTo.value;
    
    if (!fromValue || !toValue) {
      this.utils.showToast('请选择开始和结束日期', 'warning');
      return;
    }
    
    const fromDate = new Date(fromValue);
    const toDate = new Date(toValue);
    
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      this.utils.showToast('无效的日期格式', 'error');
      return;
    }
    
    // 计算时间差（毫秒）
    const diffMs = toDate.getTime() - fromDate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    // 计算天数、小时、分钟、秒
    const days = Math.floor(diffSeconds / 86400);
    const hours = Math.floor((diffSeconds % 86400) / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = diffSeconds % 60;
    
    // 计算工作日（简化实现，不考虑节假日）
    let workdays = 0;
    let currentDate = new Date(fromDate);
    
    while (currentDate <= toDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workdays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // 更新结果
    if (diffMs >= 0) {
      this.countdownTotal.textContent = `${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;
      this.countdownDetailed.textContent = `${diffMs}毫秒 / ${diffSeconds}秒 / ${days}天`;
      this.countdownWorkdays.textContent = `${workdays}个工作日`;
    } else {
      this.countdownTotal.textContent = `-${Math.abs(days)}天 ${Math.abs(hours)}小时 ${Math.abs(minutes)}分钟 ${Math.abs(seconds)}秒`;
      this.countdownDetailed.textContent = `${diffMs}毫秒 / ${diffSeconds}秒 / ${days}天`;
      this.countdownWorkdays.textContent = `${workdays}个工作日`;
    }
  }
};