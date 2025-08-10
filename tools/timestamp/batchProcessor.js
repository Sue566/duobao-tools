/**
 * 时间戳转换工具 - 批量处理功能
 */

window.timestampBatchProcessor = {
  /**
   * 初始化批量处理功能
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
    this.batchInput = this.container.querySelector('#batch-input');
    this.batchOutput = this.container.querySelector('#batch-output');
    this.batchConvert = this.container.querySelector('#batch-convert');
    this.batchClear = this.container.querySelector('#batch-clear');
    this.batchTimestampToDate = this.container.querySelector('#batch-timestamp-to-date');
    this.batchDateToTimestamp = this.container.querySelector('#batch-date-to-timestamp');
    this.batchIncludeMs = this.container.querySelector('#batch-include-ms');
    this.batchIncludeRelative = this.container.querySelector('#batch-include-relative');
    this.batchOutputFormat = this.container.querySelector('#batch-output-format');
    this.batchCustomFormat = this.container.querySelector('#batch-custom-format');
    this.customFormatGroup = this.container.querySelector('#custom-format-group');
  },
  
  /**
   * 设置事件处理
   */
  setupEvents: function() {
    if (this.batchConvert) {
      this.batchConvert.addEventListener('click', () => this.batchConversion());
    }
    
    if (this.batchClear) {
      this.batchClear.addEventListener('click', () => {
        this.batchInput.value = '';
        this.batchOutput.value = '';
      });
    }
    
    if (this.batchOutputFormat) {
      this.batchOutputFormat.addEventListener('change', () => {
        if (this.batchOutputFormat.value === 'custom') {
          this.customFormatGroup.style.display = 'block';
        } else {
          this.customFormatGroup.style.display = 'none';
        }
      });
    }
  },
  
  /**
   * 批量转换
   */
  batchConversion: function() {
    const input = this.batchInput.value.trim();
    if (!input) {
      this.utils.showToast('请输入需要转换的内容', 'warning');
      return;
    }
    
    const lines = input.split('\n');
    const results = [];
    const outputFormat = this.batchOutputFormat.value;
    const customFormat = this.batchCustomFormat.value;
    
    if (this.batchTimestampToDate.checked) {
      // 时间戳转日期
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
          results.push('');
          continue;
        }
        
        // 移除非数字字符
        const timestamp = trimmed.replace(/[^\d]/g, '');
        if (!timestamp) {
          results.push(`[错误] 无效的时间戳: ${trimmed}`);
          continue;
        }
        
        let ts = parseInt(timestamp);
        
        // 如果是秒级时间戳，转换为毫秒
        if (!this.batchIncludeMs.checked) {
          ts *= 1000;
        }
        
        const date = new Date(ts);
        
        if (isNaN(date.getTime())) {
          results.push(`[错误] 无效的时间戳: ${trimmed}`);
        } else {
          let formattedDate;
          
          switch (outputFormat) {
            case 'iso':
              formattedDate = date.toISOString();
              break;
            case 'rfc':
              formattedDate = date.toUTCString();
              break;
            case 'custom':
              // 简单的自定义格式实现
              formattedDate = customFormat
                .replace('YYYY', date.getFullYear())
                .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
                .replace('DD', String(date.getDate()).padStart(2, '0'))
                .replace('HH', String(date.getHours()).padStart(2, '0'))
                .replace('mm', String(date.getMinutes()).padStart(2, '0'))
                .replace('ss', String(date.getSeconds()).padStart(2, '0'));
              break;
            default:
              formattedDate = this.utils.formatDate(date, 'local');
          }
          
          let result = `${trimmed} => ${formattedDate}`;
          
          if (this.batchIncludeRelative.checked) {
            const unixTs = Math.floor(ts / 1000);
            result += ` (${this.utils.getRelativeTime(unixTs)})`;
          }
          
          results.push(result);
        }
      }
    } else {
      // 日期转时间戳
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
          results.push('');
          continue;
        }
        
        const date = new Date(trimmed);
        
        if (isNaN(date.getTime())) {
          results.push(`[错误] 无效的日期格式: ${trimmed}`);
        } else {
          const timestamp = this.batchIncludeMs.checked ? date.getTime() : Math.floor(date.getTime() / 1000);
          results.push(`${trimmed} => ${timestamp}`);
        }
      }
    }
    
    this.batchOutput.value = results.join('\n');
  }
};