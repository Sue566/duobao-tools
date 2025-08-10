/**
 * 中文转拼音工具 - 工具函数
 */

window.chineseToPinyinUtils = {
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
        
        // 备用复制方法
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = 0;
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
          const successful = document.execCommand('copy');
          document.body.removeChild(textarea);
          
          if (successful) {
            this.showToast('已复制到剪贴板', 'success');
          } else {
            this.showToast('复制失败', 'error');
          }
        } catch (err) {
          document.body.removeChild(textarea);
          this.showToast('复制失败: ' + err, 'error');
        }
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
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showToast('文件已下载', 'success');
  },
  
  /**
   * 更新文本统计信息
   * @param {string} text - 输入文本
   * @param {HTMLElement} charCount - 字符数显示元素
   * @param {HTMLElement} chineseCount - 中文字符数显示元素
   */
  updateTextStats: function(text, charCount, chineseCount) {
    // 字符总数
    charCount.textContent = text.length;
    
    // 中文字符数
    let chineseChars = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);
      if (this.isChinese(char)) {
        chineseChars++;
      }
    }
    chineseCount.textContent = chineseChars;
  },
  
  /**
   * 检查字符是否为中文
   * @param {string} char - 字符
   * @returns {boolean} 是否为中文
   */
  isChinese: function(char) {
    const code = char.charCodeAt(0);
    return (code >= 0x4e00 && code <= 0x9fff) || 
           (code >= 0x3400 && code <= 0x4dbf) || 
           (code >= 0xf900 && code <= 0xfaff);
  },
  
  /**
   * 保存用户设置
   * @param {Object} settings - 用户设置
   */
  saveSettings: function(settings) {
    try {
      localStorage.setItem('settings_chineseToPinyin', JSON.stringify(settings));
    } catch (e) {
      console.error('保存设置失败', e);
    }
  },
  
  /**
   * 加载用户设置
   * @returns {Object|null} 用户设置
   */
  loadSettings: function() {
    try {
      const settings = localStorage.getItem('settings_chineseToPinyin');
      return settings ? JSON.parse(settings) : null;
    } catch (e) {
      console.error('加载设置失败', e);
      return null;
    }
  }
};