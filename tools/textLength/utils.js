/**
 * 文本长度统计工具 - 工具函数
 */

window.textLengthUtils = {
  /**
   * 显示提示消息
   * @param {string} message - 消息内容
   * @param {string} type - 消息类型 (success, error, warning, info)
   */
  showToast: function(message, type) {
    if (typeof window.showToast === 'function') {
      window.showToast(message, type);
    } else {
      console.log(`[${type}] ${message}`);
    }
  },
  
  /**
   * 复制文本到剪贴板
   * @param {string} text - 要复制的文本
   * @returns {Promise} 复制操作的Promise
   */
  copyToClipboard: function(text) {
    return new Promise((resolve, reject) => {
      if (!text) {
        this.showToast('没有可复制的内容', 'warning');
        reject(new Error('没有可复制的内容'));
        return;
      }
      
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text)
            .then(() => {
              this.showToast('已复制到剪贴板', 'success');
              resolve();
            })
            .catch(err => {
              console.error('复制失败:', err);
              this.showToast('复制失败: ' + err.message, 'error');
              reject(err);
            });
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
            this.showToast('已复制到剪贴板', 'success');
            resolve();
          } else {
            this.showToast('复制失败', 'error');
            reject(new Error('复制命令执行失败'));
          }
        }
      } catch (e) {
        console.error('复制错误:', e);
        this.showToast('复制失败: ' + e.message, 'error');
        reject(e);
      }
    });
  },
  
  /**
   * 格式化数字，添加千位分隔符
   * @param {number} num - 要格式化的数字
   * @returns {string} 格式化后的字符串
   */
  formatNumber: function(num) {
    return num.toLocaleString();
  },
  
  /**
   * 估算阅读时间
   * @param {string} text - 文本内容
   * @param {number} wordsPerMinute - 每分钟阅读单词数 (默认200)
   * @returns {object} 阅读时间估计 {minutes, seconds}
   */
  estimateReadingTime: function(text, wordsPerMinute = 200) {
    // 中文按字符计算，英文按单词计算
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.replace(/[\u4e00-\u9fa5]/g, '').match(/\b\w+\b/g) || []).length;
    
    // 中文阅读速度约为每分钟300字
    const chineseReadingTime = chineseChars / 300;
    // 英文阅读速度按参数传入
    const englishReadingTime = englishWords / wordsPerMinute;
    
    // 总阅读时间（分钟）
    const totalMinutes = chineseReadingTime + englishReadingTime;
    
    // 转换为分钟和秒
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.round((totalMinutes - minutes) * 60);
    
    return { minutes, seconds };
  },
  
  /**
   * 检测文本的主要语言
   * @param {string} text - 文本内容
   * @returns {string} 语言代码 ('zh', 'en', 'mixed', 'other')
   */
  detectLanguage: function(text) {
    if (!text) return 'other';
    
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
    const totalChars = text.length;
    
    const chineseRatio = chineseChars / totalChars;
    const englishRatio = englishChars / totalChars;
    
    if (chineseRatio > 0.5) {
      return 'zh';
    } else if (englishRatio > 0.5) {
      return 'en';
    } else if (chineseRatio > 0.2 && englishRatio > 0.2) {
      return 'mixed';
    } else {
      return 'other';
    }
  },
  
  /**
   * 获取文本的字符分布统计
   * @param {string} text - 文本内容
   * @returns {object} 字符分布统计
   */
  getCharDistribution: function(text) {
    if (!text) {
      return {
        chinese: 0,
        english: 0,
        number: 0,
        punctuation: 0,
        space: 0,
        other: 0
      };
    }
    
    const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const english = (text.match(/[a-zA-Z]/g) || []).length;
    const number = (text.match(/[0-9]/g) || []).length;
    const punctuation = (text.match(/[.,\/#!$%\^&\*;:{}=\-_`~()，。、；：''""【】《》？！￥…（）]/g) || []).length;
    const space = (text.match(/\s/g) || []).length;
    const other = text.length - chinese - english - number - punctuation - space;
    
    return {
      chinese,
      english,
      number,
      punctuation,
      space,
      other
    };
  }
};