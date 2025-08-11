/**
 * 工具模板 - 工具函数模块
 */
(function() {
  // 定义工具函数模块
  window.toolTemplateUtils = {
    /**
     * 复制文本到剪贴板
     * @param {string} text - 要复制的文本
     */
    copyToClipboard: function(text) {
      // 优先使用现代剪贴板API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => {
            this.showToast('已复制到剪贴板', 'success');
          })
          .catch(err => {
            console.error('剪贴板API失败，使用备用方法', err);
            this.fallbackCopyToClipboard(text);
          });
      } else {
        this.fallbackCopyToClipboard(text);
      }
    },
    
    /**
     * 备用复制方法
     * @param {string} text - 要复制的文本
     */
    fallbackCopyToClipboard: function(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        const success = document.execCommand('copy');
        if (success) {
          this.showToast('已复制到剪贴板', 'success');
        } else {
          this.showToast('复制失败，请手动复制', 'error');
        }
      } catch (err) {
        console.error('复制失败', err);
        this.showToast('复制失败，请手动复制', 'error');
      }
      document.body.removeChild(textarea);
    },
    
    /**
     * 显示提示消息
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型 (success, warning, error, info)
     */
    showToast: function(message, type) {
      // 检查是否存在全局toast函数
      if (typeof window.showToast === 'function') {
        window.showToast(message, type);
        return;
      }
      
      // 如果没有全局toast函数，创建一个简单的toast
      let toast = document.getElementById('tool-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'tool-toast';
        document.body.appendChild(toast);
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
          #tool-toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            max-width: 300px;
            padding: 10px 15px;
            background-color: #333;
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 9999;
            transition: opacity 0.3s, transform 0.3s;
            opacity: 0;
            transform: translateY(20px);
          }
          #tool-toast.show {
            opacity: 1;
            transform: translateY(0);
          }
          #tool-toast.info { background-color: #3498db; }
          #tool-toast.success { background-color: #2ecc71; }
          #tool-toast.warning { background-color: #f39c12; }
          #tool-toast.error { background-color: #e74c3c; }
        `;
        document.head.appendChild(style);
      }
      
      // 设置消息和类型
      toast.textContent = message;
      toast.className = type;
      
      // 显示toast
      setTimeout(() => {
        toast.classList.add('show');
        
        // 3秒后隐藏
        setTimeout(() => {
          toast.classList.remove('show');
        }, 3000);
      }, 10);
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
     * HTML转义
     * @param {string} text - 要转义的文本
     * @returns {string} 转义后的HTML
     */
    escapeHtml: function(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },
    
    /**
     * 生成时间戳文件名
     * @param {string} prefix - 文件名前缀
     * @param {string} ext - 文件扩展名
     * @returns {string} 生成的文件名
     */
    generateTimestampFilename: function(prefix, ext) {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      return `${prefix}_${timestamp}.${ext}`;
    }
  };
})();