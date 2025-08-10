/**
 * Base64 历史记录功能
 */

const historyManager = {
  // 历史记录数组
  historyItems: [],
  
  // 最大历史记录数量
  maxHistoryItems: 50,
  
  /**
   * 初始化历史记录
   */
  init: function() {
    this.loadHistory();
  },
  
  /**
   * 加载历史记录
   */
  loadHistory: function() {
    try {
      const saved = localStorage.getItem('base64_history');
      this.historyItems = saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('加载历史记录失败:', error);
      this.historyItems = [];
    }
  },
  
  /**
   * 保存历史记录
   */
  saveHistory: function() {
    try {
      localStorage.setItem('base64_history', JSON.stringify(this.historyItems));
    } catch (error) {
      console.error('保存历史记录失败:', error);
    }
  },
  
  /**
   * 添加历史记录项
   * @param {Object} item - 历史记录项
   */
  addItem: function(item) {
    // 添加到历史记录
    this.historyItems.unshift(item);
    
    // 限制历史记录数量
    if (this.historyItems.length > this.maxHistoryItems) {
      this.historyItems = this.historyItems.slice(0, this.maxHistoryItems);
    }
    
    // 保存到本地存储
    this.saveHistory();
  },
  
  /**
   * 删除历史记录项
   * @param {number} id - 历史记录项ID
   */
  deleteItem: function(id) {
    this.historyItems = this.historyItems.filter(item => item.id !== id);
    this.saveHistory();
  },
  
  /**
   * 清空历史记录
   */
  clearHistory: function() {
    this.historyItems = [];
    localStorage.removeItem('base64_history');
  },
  
  /**
   * 获取历史记录
   * @returns {Array} 历史记录数组
   */
  getHistory: function() {
    return this.historyItems;
  },
  
  /**
   * 渲染历史记录
   * @param {HTMLElement} container - 容器元素
   */
  renderHistory: function(container) {
    const historyList = container.querySelector('#history-list');
    
    if (!historyList) {
      console.error('找不到历史记录列表元素');
      return;
    }
    
    if (this.historyItems.length === 0) {
      historyList.innerHTML = '<div class="no-history">暂无历史记录</div>';
      return;
    }
    
    let html = '';
    
    this.historyItems.forEach(item => {
      const date = new Date(item.timestamp);
      const formattedDate = window.base64Utils.formatDateTime(date);
      
      let typeText = '';
      let contentPreview = '';
      
      switch (item.type) {
        case 'text':
          typeText = '文本编解码';
          contentPreview = `
            <div>输入: ${item.input.substring(0, 50)}${item.input.length > 50 ? '...' : ''}</div>
            <div>输出: ${item.output.substring(0, 50)}${item.output.length > 50 ? '...' : ''}</div>
          `;
          break;
        case 'file_encode':
          typeText = '文件编码';
          contentPreview = `
            <div>文件: ${item.input}</div>
            <div>输出: ${item.output}</div>
          `;
          break;
        case 'file_decode':
          typeText = '文件解码';
          contentPreview = `
            <div>输入: ${item.input}</div>
            <div>输出文件: ${item.output}</div>
          `;
          break;
        case 'batch':
          typeText = '批量处理';
          contentPreview = `
            <div>模式: ${item.options.mode === 'encode' ? '编码' : '解码'}</div>
            <div>处理: ${item.input}</div>
          `;
          break;
      }
      
      html += `
        <div class="history-item" data-id="${item.id}" data-type="${item.type}">
          <div class="history-item-content">
            <div class="history-item-type">${typeText}</div>
            ${contentPreview}
            <div class="history-item-time">${formattedDate}</div>
          </div>
          <div class="history-item-actions">
            <button class="btn btn-sm history-use-btn" data-id="${item.id}">使用</button>
            <button class="btn btn-sm btn-danger history-delete-btn" data-id="${item.id}">删除</button>
          </div>
        </div>
      `;
    });
    
    historyList.innerHTML = html;
  },
  
  /**
   * 设置历史记录事件
   * @param {HTMLElement} container - 容器元素
   * @param {Object} callbacks - 回调函数对象
   */
  setupHistoryEvents: function(container, callbacks) {
    const historyList = container.querySelector('#history-list');
    const clearHistoryBtn = container.querySelector('#clear-history');
    
    if (!historyList || !clearHistoryBtn) {
      console.error('找不到历史记录元素');
      return;
    }
    
    // 清空历史记录
    clearHistoryBtn.addEventListener('click', () => {
      if (confirm('确定要清空所有历史记录吗？')) {
        this.clearHistory();
        this.renderHistory(container);
        window.base64Utils.showToast('历史记录已清空', 'success');
      }
    });
    
    // 委托事件处理
    historyList.addEventListener('click', (e) => {
      const useBtn = e.target.closest('.history-use-btn');
      const deleteBtn = e.target.closest('.history-delete-btn');
      
      if (useBtn) {
        const id = parseInt(useBtn.getAttribute('data-id'));
        const item = this.historyItems.find(h => h.id === id);
        
        if (item && callbacks && callbacks.onUseHistory) {
          callbacks.onUseHistory(item);
        }
      } else if (deleteBtn) {
        const id = parseInt(deleteBtn.getAttribute('data-id'));
        this.deleteItem(id);
        this.renderHistory(container);
        window.base64Utils.showToast('已删除历史记录', 'success');
      }
    });
  }
};

// 导出历史记录管理器
window.base64History = historyManager;