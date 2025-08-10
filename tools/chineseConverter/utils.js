/**
 * 中文繁简转换工具 - 工具函数
 */

window.chineseConverterUtils = {
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
   * 检测文本类型（简体或繁体）
   * @param {string} text - 输入文本
   * @returns {string} 转换方向
   */
  detectTextType: function(text) {
    // 简体字和繁体字的特征字符
    const simplifiedChars = '国东车里与关么专业习';
    const traditionalChars = '國東車裡與關麼專業習';
    
    let simplifiedCount = 0;
    let traditionalCount = 0;
    
    // 统计特征字符出现次数
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (simplifiedChars.includes(char)) {
        simplifiedCount++;
      } else if (traditionalChars.includes(char)) {
        traditionalCount++;
      }
    }
    
    // 根据统计结果判断文本类型
    if (traditionalCount > simplifiedCount) {
      return 't2s'; // 繁体转简体
    } else {
      return 's2t'; // 简体转繁体
    }
  },
  
  /**
   * 保存用户设置
   * @param {Object} settings - 用户设置
   */
  saveSettings: function(settings) {
    try {
      localStorage.setItem('settings_chineseConverter', JSON.stringify(settings));
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
      const settings = localStorage.getItem('settings_chineseConverter');
      return settings ? JSON.parse(settings) : null;
    } catch (e) {
      console.error('加载设置失败', e);
      return null;
    }
  }
};