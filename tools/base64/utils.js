/**
 * Base64 工具函数
 */

const utils = {
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
   * @returns {Promise} 复制操作的Promise
   */
  copyToClipboard: function(text) {
    if (!text) return Promise.reject(new Error('没有可复制的内容'));
    
    return new Promise((resolve, reject) => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text)
            .then(() => resolve())
            .catch(err => reject(err));
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          const success = document.execCommand('copy');
          ta.remove();
          
          if (success) {
            resolve();
          } else {
            reject(new Error('复制命令执行失败'));
          }
        }
      } catch (e) {
        reject(e);
      }
    });
  },
  
  /**
   * 格式化文件大小
   * @param {number} bytes - 字节数
   * @returns {string} 格式化后的大小
   */
  formatFileSize: function(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  /**
   * 下载文本为文件
   * @param {string} text - 要下载的文本
   * @param {string} filename - 文件名
   */
  downloadTextAsFile: function(text, filename) {
    if (!text) return Promise.reject(new Error('没有可下载的内容'));
    
    return new Promise((resolve, reject) => {
      try {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  
  /**
   * 格式化日期时间
   * @param {Date} date - 日期对象
   * @returns {string} 格式化后的日期时间
   */
  formatDateTime: function(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
};

// 导出工具函数
window.base64Utils = utils;