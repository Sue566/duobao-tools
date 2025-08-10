/**
 * 时间戳转换工具 - 工具函数
 */

window.timestampUtils = {
  /**
   * 初始化工具函数
   * @param {HTMLElement} container - 容器元素
   */
  init: function(container) {
    this.container = container;
  },
  
  /**
   * 格式化日期
   * @param {Date} date - 日期对象
   * @param {string} format - 格式类型
   * @returns {string} 格式化后的日期字符串
   */
  formatDate: function(date, format = 'local') {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return '-';
    }
    
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    
    if (format === 'utc') {
      options.timeZone = 'UTC';
    }
    
    return date.toLocaleString('zh-CN', options);
  },
  
  /**
   * 计算相对时间
   * @param {number} timestamp - Unix时间戳
   * @returns {string} 相对时间字符串
   */
  getRelativeTime: function(timestamp) {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    
    if (diff < 0) {
      // 未来时间
      const absDiff = Math.abs(diff);
      if (absDiff < 60) return `${absDiff}秒后`;
      if (absDiff < 3600) return `${Math.floor(absDiff / 60)}分钟后`;
      if (absDiff < 86400) return `${Math.floor(absDiff / 3600)}小时后`;
      if (absDiff < 2592000) return `${Math.floor(absDiff / 86400)}天后`;
      if (absDiff < 31536000) return `${Math.floor(absDiff / 2592000)}个月后`;
      return `${Math.floor(absDiff / 31536000)}年后`;
    } else {
      // 过去时间
      if (diff < 60) return `${diff}秒前`;
      if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
      if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;
      if (diff < 31536000) return `${Math.floor(diff / 2592000)}个月前`;
      return `${Math.floor(diff / 31536000)}年前`;
    }
  },
  
  /**
   * 显示提示消息
   * @param {string} message - 消息内容
   * @param {string} type - 消息类型
   */
  showToast: function(message, type = 'info') {
    if (window.DuobaoNotification) {
      window.DuobaoNotification[type](message, '');
    } else {
      alert(message);
    }
  },
  
  /**
   * 复制文本到剪贴板
   * @param {string} text - 要复制的文本
   */
  copyToClipboard: function(text) {
    navigator.clipboard.writeText(text)
      .then(() => {
        this.showToast('已复制到剪贴板', 'success');
      })
      .catch(err => {
        console.error('复制失败:', err);
        this.showToast('复制失败', 'error');
      });
  }
};