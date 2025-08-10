/**
 * 中文转拼音工具 - 历史记录功能
 */

window.chineseToPinyinHistory = {
  /**
   * 初始化历史记录功能
   * @param {HTMLElement} container - 容器元素
   */
  init: function(container) {
    this.container = container;
    this.utils = window.chineseToPinyinUtils;
    
    this.setupReferences();
    this.setupEvents();
    
    // 加载历史记录
    this.historyItems = this.loadHistory();
    
    // 初始渲染
    this.renderHistory();
  },
  
  /**
   * 设置DOM引用
   */
  setupReferences: function() {
    this.clearHistoryBtn = this.container.querySelector('#clear-history');
    this.historyList = this.container.querySelector('#history-list');
  },
  
  /**
   * 设置事件处理
   */
  setupEvents: function() {
    if (this.clearHistoryBtn) {
      this.clearHistoryBtn.addEventListener('click', () => {
        this.historyItems = [];
        localStorage.removeItem('chineseToPinyinHistory');
        this.renderHistory();
        this.utils.showToast('历史记录已清空', 'success');
      });
    }
  },
  
  /**
   * 保存到历史记录
   * @param {string} input - 输入文本
   * @param {string} output - 输出文本
   * @param {Object} options - 转换选项
   */
  saveToHistory: function(input, output, options) {
    // 创建历史记录项
    const historyItem = {
      id: Date.now(),
      input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
      output: output.substring(0, 100) + (output.length > 100 ? '...' : ''),
      timestamp: new Date().toISOString(),
      fullInput: input,
      fullOutput: output,
      options: options
    };
    
    // 添加到历史记录
    this.historyItems.unshift(historyItem);
    
    // 限制历史记录数量
    if (this.historyItems.length > 10) {
      this.historyItems = this.historyItems.slice(0, 10);
    }
    
    // 保存到本地存储
    localStorage.setItem('chineseToPinyinHistory', JSON.stringify(this.historyItems));
    
    // 更新历史记录显示
    this.renderHistory();
  },
  
  /**
   * 加载历史记录
   * @returns {Array} 历史记录数组
   */
  loadHistory: function() {
    try {
      const saved = localStorage.getItem('chineseToPinyinHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('加载历史记录失败:', error);
      return [];
    }
  },
  
  /**
   * 渲染历史记录
   */
  renderHistory: function() {
    if (!this.historyList) return;
    
    if (this.historyItems.length === 0) {
      this.historyList.innerHTML = '<div class="no-history">暂无历史记录</div>';
      return;
    }
    
    let html = '';
    
    this.historyItems.forEach(item => {
      const date = new Date(item.timestamp);
      const formattedDate = date.toLocaleString();
      
      // 获取选项描述
      let optionsText = [];
      if (item.options) {
        if (item.options.firstLetter) optionsText.push('首字母');
        if (item.options.tone) optionsText.push('带声调');
        if (item.options.uppercase) optionsText.push('大写');
        if (item.options.spaceSeparated) optionsText.push('空格分隔');
        if (item.options.keepNonChinese) optionsText.push('保留非中文');
      }
      
      const optionsDescription = optionsText.length > 0 ? optionsText.join(', ') : '默认选项';
      
      html += `
        <div class="history-item" data-id="${item.id}">
          <div class="history-item-content">
            <div class="history-item-type">${optionsDescription}</div>
            <div class="history-item-text">${item.input}</div>
            <div class="history-item-time">${formattedDate}</div>
          </div>
          <div class="history-item-actions">
            <button class="btn btn-sm history-use-btn" data-id="${item.id}">使用</button>
            <button class="btn btn-sm btn-danger history-delete-btn" data-id="${item.id}">删除</button>
          </div>
        </div>
      `;
    });
    
    this.historyList.innerHTML = html;
    
    // 添加历史记录项事件
    this.historyList.querySelectorAll('.history-use-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const item = this.historyItems.find(h => h.id === id);
        
        if (item) {
          const chineseInput = this.container.querySelector('#chinese-input');
          if (chineseInput) {
            chineseInput.value = item.fullInput;
            
            // 设置转换选项
            if (item.options) {
              const toneOption = this.container.querySelector('#option-tone');
              const firstLetterOption = this.container.querySelector('#option-first-letter');
              const upperCaseOption = this.container.querySelector('#option-uppercase');
              const spaceSeparatedOption = this.container.querySelector('#option-space');
              const keepNonChineseOption = this.container.querySelector('#option-keep-non-chinese');
              
              if (toneOption) toneOption.checked = item.options.tone;
              if (firstLetterOption) firstLetterOption.checked = item.options.firstLetter;
              if (upperCaseOption) upperCaseOption.checked = item.options.uppercase;
              if (spaceSeparatedOption) spaceSeparatedOption.checked = item.options.spaceSeparated;
              if (keepNonChineseOption) keepNonChineseOption.checked = item.options.keepNonChinese;
            }
            
            // 滚动到输入区域
            chineseInput.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
    
    this.historyList.querySelectorAll('.history-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        this.historyItems = this.historyItems.filter(h => h.id !== id);
        
        // 保存到本地存储
        localStorage.setItem('chineseToPinyinHistory', JSON.stringify(this.historyItems));
        
        // 更新历史记录显示
        this.renderHistory();
      });
    });
  }
};