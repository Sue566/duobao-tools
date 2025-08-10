/**
 * 时间戳转换工具 - 时区转换功能
 */

window.timestampTimezone = {
  /**
   * 初始化时区转换功能
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
    this.timezoneDate = this.container.querySelector('#timezone-date');
    this.timezoneNow = this.container.querySelector('#timezone-now');
    this.timezoneFrom = this.container.querySelector('#timezone-from');
    this.timezoneTo = this.container.querySelector('#timezone-to');
    this.convertTimezone = this.container.querySelector('#convert-timezone');
    this.timezoneResultValue = this.container.querySelector('#timezone-result-value');
    this.timezoneOffset = this.container.querySelector('#timezone-offset');
    this.refreshWorldClock = this.container.querySelector('#refresh-world-clock');
    this.worldClockList = this.container.querySelector('#world-clock-list');
  },
  
  /**
   * 设置事件处理
   */
  setupEvents: function() {
    if (this.timezoneNow) {
      this.timezoneNow.addEventListener('click', () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        this.timezoneDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;
        this.convertTimezoneFunc();
      });
    }
    
    if (this.convertTimezone) {
      this.convertTimezone.addEventListener('click', () => this.convertTimezoneFunc());
    }
    
    if (this.refreshWorldClock) {
      this.refreshWorldClock.addEventListener('click', () => this.updateWorldClock());
    }
  },
  
  /**
   * 时区转换
   */
  convertTimezoneFunc: function() {
    const dateValue = this.timezoneDate.value;
    if (!dateValue) {
      this.utils.showToast('请选择日期时间', 'warning');
      return;
    }
    
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      this.utils.showToast('无效的日期格式', 'error');
      return;
    }
    
    const fromZone = this.timezoneFrom.value;
    const toZone = this.timezoneTo.value;
    
    // 简单的时区转换实现
    let result;
    let offsetInfo;
    
    try {
      if (fromZone === 'local' && toZone === 'UTC') {
        result = date.toUTCString();
        offsetInfo = `本地时区 → UTC (偏移: ${-date.getTimezoneOffset() / 60} 小时)`;
      } else if (fromZone === 'UTC' && toZone === 'local') {
        result = date.toLocaleString();
        offsetInfo = `UTC → 本地时区 (偏移: ${date.getTimezoneOffset() / 60} 小时)`;
      } else {
        // 这里需要更复杂的时区库支持，简化实现
        result = new Date(date).toLocaleString('zh-CN', { timeZone: toZone });
        offsetInfo = `${fromZone} → ${toZone}`;
      }
      
      this.timezoneResultValue.textContent = result;
      this.timezoneOffset.textContent = offsetInfo;
    } catch (error) {
      this.utils.showToast('时区转换失败: ' + error.message, 'error');
    }
  },
  
  /**
   * 更新世界时钟
   */
  updateWorldClock: function() {
    const now = new Date();
    const timezones = [
      { name: '本地时间', zone: undefined },
      { name: 'UTC', zone: 'UTC' },
      { name: '北京', zone: 'Asia/Shanghai' },
      { name: '纽约', zone: 'America/New_York' },
      { name: '伦敦', zone: 'Europe/London' },
      { name: '东京', zone: 'Asia/Tokyo' },
      { name: '悉尼', zone: 'Australia/Sydney' },
      { name: '巴黎', zone: 'Europe/Paris' }
    ];
    
    let html = '';
    
    for (const tz of timezones) {
      try {
        const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        };
        
        if (tz.zone) {
          options.timeZone = tz.zone;
        }
        
        const timeString = now.toLocaleString('zh-CN', options);
        
        html += `
          <div class="world-clock-item">
            <div class="world-clock-city">${tz.name}</div>
            <div class="world-clock-time">${timeString}</div>
          </div>
        `;
      } catch (error) {
        html += `
          <div class="world-clock-item">
            <div class="world-clock-city">${tz.name}</div>
            <div class="world-clock-time">不支持</div>
          </div>
        `;
      }
    }
    
    this.worldClockList.innerHTML = html;
  }
};