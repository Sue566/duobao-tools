/**
 * 时间戳转换工具 - 历史记录功能
 */

window.timestampHistory = {
  /**
   * 初始化历史记录功能
   * @param {HTMLElement} container - 容器元素
   */
  init: function(container) {
    this.container = container;
    this.utils = window.timestampUtils;
    
    this.setupReferences();
    this.setupEvents();
    
    // 加载历史记录
    this.historyItems = this.loadHistory();
  },
  
  /**
   * 设置DOM引用
   */
  setupReferences: function() {
    this.clearHistoryBtn = this.container.querySelector('#clear-history-btn');
    this.timestampHistoryList = this.container.querySelector('#timestamp-history-list');
  },
  
  /**
   * 设置事件处理
   */
  setupEvents: function() {
    if (this.clearHistoryBtn) {
      this.clearHistoryBtn.addEventListener('click', () => {
        if (confirm('确定要清空所有历史记录吗？')) {
          this.historyItems = [];
          localStorage.removeItem('timestamp_history');
          this.renderHistory();
        }
      });
    }
  },
  
  /**
   * 保存历史记录
   * @param {string} type - 记录类型
   * @param {string} input - 输入值
   * @param {string} output - 输出值
   */
  saveHistory: function(type, input, output) {
    const item = {
      id: Date.now(),
      type,
      input,
      output,
      timestamp: new Date().toISOString()
    };
    
    this.historyItems.unshift(item);
    
    // 限制历史记录数量
    if (this.historyItems.length > 50) {
      this.historyItems = this.historyItems.slice(0, 50);
    }
    
    // 保存到本地存储
    localStorage.setItem('timestamp_history', JSON.stringify(this.historyItems));
    
    // 如果当前在历史记录标签页，更新显示
    if (this.container.querySelector('#tab-history').classList.contains('active')) {
      this.renderHistory();
    }
  },
  
  /**
   * 加载历史记录
   * @returns {Array} 历史记录数组
   */
  loadHistory: function() {
    try {
      const saved = localStorage.getItem('timestamp_history');
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
    if (!this.timestampHistoryList) return;
    
    if (this.historyItems.length === 0) {
      this.timestampHistoryList.innerHTML = '<div class="no-history">暂无历史记录</div>';
      return;
    }
    
    let html = '';
    
    for (const item of this.historyItems) {
      const date = new Date(item.timestamp);
      const formattedDate = this.utils.formatDate(date, 'local');
      
      html += `
        <div class="history-item" data-id="${item.id}">
          <div class="history-item-content">
            <div><strong>${item.type === 'timestamp_to_date' ? '时间戳转日期' : '日期转时间戳'}</strong></div>
            <div>输入: ${item.input}</div>
            <div>结果: ${item.output}</div>
            <div class="history-item-time">${formattedDate}</div>
          </div>
          <div class="history-item-actions">
            <button class="btn btn-sm history-use-btn" data-id="${item.id}">使用</button>
            <button class="btn btn-sm btn-danger history-delete-btn" data-id="${item.id}">删除</button>
          </div>
        </div>
      `;
    }
    
    this.timestampHistoryList.innerHTML = html;
    
    // 添加事件监听
    this.timestampHistoryList.querySelectorAll('.history-use-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const item = this.historyItems.find(h => h.id === id);
        
        if (item) {
          if (item.type === 'timestamp_to_date') {
            const timestampInput = this.container.querySelector('#timestamp-input');
            if (timestampInput) {
              timestampInput.value = item.input;
              // 切换到转换器标签页
              this.switchTab('converter');
              window.timestampConverter.timestampToDate();
            }
          } else {
            const dateInput = this.container.querySelector('#date-input');
            if (dateInput) {
              dateInput.value = item.input;
              // 切换到转换器标签页
              this.switchTab('converter');
              window.timestampConverter.dateToTimestamp();
            }
          }
        }
      });
    });
    
    this.timestampHistoryList.querySelectorAll('.history-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        this.historyItems = this.historyItems.filter(h => h.id !== id);
        
        // 保存到本地存储
        localStorage.setItem('timestamp_history', JSON.stringify(this.historyItems));
        
        // 重新渲染
        this.renderHistory();
      });
    });
  },
  
  /**
   * 切换标签页
   * @param {string} tabId - 标签页ID
   */
  switchTab: function(tabId) {
    const tabButtons = this.container.querySelectorAll('.tab-btn');
    const tabContents = this.container.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    tabContents.forEach(content => {
      if (content.id === `tab-${tabId}`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }
};