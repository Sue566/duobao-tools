/**
 * 贷款计算器 - 工具函数模块
 */

// 工具函数
const LoanUtils = {
  /**
   * 格式化货币
   * @param {number} value - 金额
   * @returns {string} 格式化后的货币字符串
   */
  formatCurrency: function(value) {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  },
  
  /**
   * 格式化日期
   * @param {Date} date - 日期对象
   * @returns {string} 格式化后的日期字符串 (YYYY-MM-DD)
   */
  formatDate: function(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  },
  
  /**
   * 格式化文件大小
   * @param {number} bytes - 字节数
   * @returns {string} 格式化后的文件大小
   */
  formatSize: function(bytes) {
    if (bytes < 1024) {
      return bytes + ' 字节';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
  },
  
  /**
   * 复制文本到剪贴板
   * @param {string} text - 要复制的文本
   * @param {HTMLElement} button - 触发复制的按钮元素
   * @param {string} originalHTML - 按钮的原始HTML内容
   */
  copyToClipboard: function(text, button, originalHTML) {
    navigator.clipboard.writeText(text)
      .then(() => {
        // 复制成功，更改按钮文本
        button.innerHTML = '<i class="fa fa-check"></i> 已复制';
        
        // 2秒后恢复原始文本
        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 2000);
      })
      .catch(err => {
        console.error('复制失败:', err);
        this.showToast('复制失败', 'error');
      });
  },
  
  /**
   * 下载文本文件
   * @param {string} text - 文件内容
   * @param {string} filename - 文件名
   * @param {string} mimeType - MIME类型
   */
  downloadTextFile: function(text, filename, mimeType) {
    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  
  /**
   * 显示提示消息
   * @param {string} message - 消息内容
   * @param {string} type - 消息类型 (success, warning, error)
   */
  showToast: function(message, type) {
    // 检查是否已存在toast容器
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
        }
        
        .toast {
          padding: 12px 20px;
          margin-bottom: 10px;
          border-radius: 4px;
          color: white;
          font-size: 14px;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, opacity 0.3s ease;
          transform: translateX(100%);
          opacity: 0;
        }
        
        .toast.show {
          transform: translateX(0);
          opacity: 1;
        }
        
        .toast.success {
          background-color: #28a745;
        }
        
        .toast.warning {
          background-color: #ffc107;
          color: #212529;
        }
        
        .toast.error {
          background-color: #dc3545;
        }
        
        .toast-icon {
          margin-right: 10px;
        }
      `;
      document.head.appendChild(style);
    }
    
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // 根据类型设置图标
    let icon = '';
    switch (type) {
      case 'success':
        icon = '<i class="fa fa-check-circle toast-icon"></i>';
        break;
      case 'warning':
        icon = '<i class="fa fa-exclamation-triangle toast-icon"></i>';
        break;
      case 'error':
        icon = '<i class="fa fa-times-circle toast-icon"></i>';
        break;
    }
    
    toast.innerHTML = `${icon}${message}`;
    toastContainer.appendChild(toast);
    
    // 显示toast
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // 3秒后隐藏并移除toast
    setTimeout(() => {
      toast.classList.remove('show');
      
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 300);
    }, 3000);
  }
};

// 导出模块
window.LoanUtils = LoanUtils;