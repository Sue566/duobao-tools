/**
 * 大小写转换工具 - 工具函数
 */

window.caseConverterUtils = {
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
   * 保存文本到文件
   * @param {string} text - 要保存的文本
   * @param {string} filename - 文件名
   */
  saveToFile: function(text, filename) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    this.showToast('文件已保存', 'success');
  },
  
  /**
   * 更新文本统计信息
   * @param {HTMLTextAreaElement} textarea - 文本输入框
   * @param {HTMLElement} charCount - 字符数显示元素
   * @param {HTMLElement} wordCount - 单词数显示元素
   * @param {HTMLElement} lineCount - 行数显示元素
   */
  updateTextStats: function(textarea, charCount, wordCount, lineCount) {
    const text = textarea.value;
    
    // 字符数
    charCount.textContent = text.length;
    
    // 单词数（简单实现，按空格分割）
    const words = text.trim().split(/\s+/);
    wordCount.textContent = text.trim() ? words.length : 0;
    
    // 行数
    const lines = text.split('\n');
    lineCount.textContent = lines.length;
  }
};