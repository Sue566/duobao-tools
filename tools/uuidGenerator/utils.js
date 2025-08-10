/**
 * UUID生成器 - 工具函数
 */

window.uuidGeneratorUtils = {
  /**
   * 初始化工具函数
   * @param {HTMLElement} container - 容器元素
   */
  init: function(container) {
    this.container = container;
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
  },
  
  /**
   * 下载文本文件
   * @param {string} text - 文件内容
   * @param {string} filename - 文件名
   */
  downloadTextFile: function(text, filename) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showToast('文件已下载', 'success');
  }
};