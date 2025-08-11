/**
 * Markdown编辑器工具函数模块
 */
(function() {
  // 定义工具函数模块
  window.markdownEditorUtils = {
    /**
     * 将文本复制到剪贴板
     * @param {string} text - 要复制的文本
     */
    copyToClipboard: function(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      
      this.showToast('已复制到剪贴板', 'success');
    },
    
    /**
     * 显示提示消息
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型 (success, warning, error)
     */
    showToast: function(message, type) {
      if (typeof window.showToast === 'function') {
        window.showToast(message, type);
      } else {
        console.log(`[${type}] ${message}`);
      }
    },
    
    /**
     * 下载文件
     * @param {string} filename - 文件名
     * @param {string} content - 文件内容
     * @param {string} type - 文件类型
     */
    downloadFile: function(filename, content, type) {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      this.showToast(`已下载 ${filename}`, 'success');
    },
    
    /**
     * 更新统计信息
     * @param {string} text - 要统计的文本
     * @param {HTMLElement} statsElement - 统计信息显示元素
     */
    updateStats: function(text, statsElement) {
      const chars = text.length;
      const words = text.trim().split(/\s+/).length;
      const lines = text.split('\n').length;
      
      statsElement.textContent = `${chars} 个字符 | ${words} 个单词 | ${lines} 行`;
    }
  };
})();