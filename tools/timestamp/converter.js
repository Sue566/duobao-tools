/**
 * 时间戳转换工具 - 转换功能
 */

window.timestampConverter = {
  /**
   * 初始化转换功能
   * @param {HTMLElement} container - 容器元素
   */
  init: function(container) {
    this.container = container;
    this.utils = window.timestampUtils;
    this.history = window.timestampHistory;
    
    this.setupReferences();
    this.setupEvents();
  },
  
  /**
   * 设置DOM引用
   */
  setupReferences: function() {
    // 时间戳转日期元素
    this.timestampInput = this.container.querySelector('#timestamp-input');
    this.timestampMs = this.container.querySelector('#timestamp-ms');
    this.convertToDate = this.container.querySelector('#convert-to-date');
    this.nowToDate = this.container.querySelector('#now-to-date');
    this.timestampLocal = this.container.querySelector('#timestamp-local');
    this.timestampUtc = this.container.querySelector('#timestamp-utc');
    this.timestampIso = this.container.querySelector('#timestamp-iso');
    this.timestampRfc = this.container.querySelector('#timestamp-rfc');
    this.timestampRelative = this.container.querySelector('#timestamp-relative');
    this.saveTimestampResult = this.container.querySelector('#save-timestamp-result');
    
    // 日期转时间戳元素
    this.dateInput = this.container.querySelector('#date-input');
    this.dateFormatInput = this.container.querySelector('#date-format-input');
    this.dateFormatSelect = this.container.querySelector('#date-format-select');
    this.convertToTimestamp = this.container.querySelector('#convert-to-timestamp');
    this.convertFormatToTimestamp = this.container.querySelector('#convert-format-to-timestamp');
    this.nowToTimestamp = this.container.querySelector('#now-to-timestamp');
    this.dateUnix = this.container.querySelector('#date-unix');
    this.dateUnixMs = this.container.querySelector('#date-unix-ms');
    this.dateIso = this.container.querySelector('#date-iso');
    this.saveDateResult = this.container.querySelector('#save-date-result');
  },
  
  /**
   * 设置事件处理
   */
  setupEvents: function() {
    // 时间戳转日期事件
    if (this.convertToDate) {
      this.convertToDate.addEventListener('click', () => this.timestampToDate());
    }
    
    if (this.nowToDate) {
      this.nowToDate.addEventListener('click', () => {
        const now = Math.floor(Date.now() / 1000);
        this.timestampInput.value = now;
        this.timestampToDate();
      });
    }
    
    if (this.saveTimestampResult) {
      this.saveTimestampResult.addEventListener('click', () => {
        const input = this.timestampInput.value;
        const output = `${this.timestampLocal.textContent} (${this.timestampRelative.textContent})`;
        
        this.history.saveHistory('timestamp_to_date', input, output);
        this.utils.showToast('结果已保存到历史记录', 'success');
      });
    }
    
    // 日期转时间戳事件
    if (this.convertToTimestamp) {
      this.convertToTimestamp.addEventListener('click', () => this.dateToTimestamp());
    }
    
    if (this.convertFormatToTimestamp) {
      this.convertFormatToTimestamp.addEventListener('click', () => this.formatDateToTimestamp());
    }
    
    if (this.nowToTimestamp) {
      this.nowToTimestamp.addEventListener('click', () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        this.dateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
        this.dateToTimestamp();
      });
    }
    
    if (this.saveDateResult) {
      this.saveDateResult.addEventListener('click', () => {
        const input = this.dateInput.value;
        const output = this.dateUnix.textContent;
        
        this.history.saveHistory('date_to_timestamp', input, output);
        this.utils.showToast('结果已保存到历史记录', 'success');
      });
    }
  },
  
  /**
   * 时间戳转日期
   */
  timestampToDate: function() {
    let timestamp = this.timestampInput.value.trim();
    if (!timestamp) {
      this.utils.showToast('请输入时间戳', 'warning');
      return;
    }
    
    // 移除非数字字符
    timestamp = timestamp.replace(/[^\d]/g, '');
    
    if (!timestamp) {
      this.utils.showToast('请输入有效的时间戳', 'warning');
      return;
    }
    
    let ts = parseInt(timestamp);
    
    // 检查是否为毫秒时间戳
    if (!this.timestampMs.checked && ts > 10000000000) {
      // 自动检测并提示
      if (confirm('检测到可能是毫秒时间戳，是否转换为秒？')) {
        ts = Math.floor(ts / 1000);
        this.timestampInput.value = ts;
      }
    }
    
    // 如果是秒级时间戳，转换为毫秒
    if (!this.timestampMs.checked) {
      ts *= 1000;
    }
    
    const date = new Date(ts);
    
    if (isNaN(date.getTime())) {
      this.utils.showToast('无效的时间戳', 'error');
      return;
    }
    
    // 更新结果
    this.timestampLocal.textContent = this.utils.formatDate(date, 'local');
    this.timestampUtc.textContent = this.utils.formatDate(date, 'utc');
    this.timestampIso.textContent = date.toISOString();
    this.timestampRfc.textContent = date.toUTCString();
    
    // 计算相对时间
    const unixTs = Math.floor(ts / 1000);
    this.timestampRelative.textContent = this.utils.getRelativeTime(unixTs);
  },
  
  /**
   * 日期转时间戳
   */
  dateToTimestamp: function() {
    const dateValue = this.dateInput.value;
    if (!dateValue) {
      this.utils.showToast('请输入日期时间', 'warning');
      return;
    }
    
    const date = new Date(dateValue);
    
    if (isNaN(date.getTime())) {
      this.utils.showToast('无效的日期格式', 'error');
      return;
    }
    
    // 更新结果
    const timestamp = Math.floor(date.getTime() / 1000);
    this.dateUnix.textContent = timestamp;
    this.dateUnixMs.textContent = date.getTime();
    this.dateIso.textContent = date.toISOString();
  },
  
  /**
   * 格式化日期转时间戳
   */
  formatDateToTimestamp: function() {
    const formatValue = this.dateFormatInput.value.trim();
    if (!formatValue) {
      this.utils.showToast('请输入日期', 'warning');
      return;
    }
    
    const formatType = this.dateFormatSelect.value;
    let date;
    
    if (formatType === 'auto') {
      date = new Date(formatValue);
    } else {
      // 这里可以添加更复杂的日期格式解析逻辑
      date = new Date(formatValue);
    }
    
    if (isNaN(date.getTime())) {
      this.utils.showToast('无效的日期格式', 'error');
      return;
    }
    
    // 更新结果
    const timestamp = Math.floor(date.getTime() / 1000);
    this.dateUnix.textContent = timestamp;
    this.dateUnixMs.textContent = date.getTime();
    this.dateIso.textContent = date.toISOString();
  }
};