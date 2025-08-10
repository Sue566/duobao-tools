/**
 * 文本长度统计工具 - 历史记录功能
 */

window.textLengthHistory = {
  /**
   * 历史记录存储键名
   */
  STORAGE_KEY: 'textLength_history',
  
  /**
   * 最大历史记录数量
   */
  MAX_HISTORY: 50,
  
  /**
   * 初始化历史记录功能
   */
  init: function() {
    // 确保历史记录存在
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  },
  
  /**
   * 获取所有历史记录
   * @returns {Array} 历史记录数组
   */
  getHistory: function() {
    try {
      const history = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      return Array.isArray(history) ? history : [];
    } catch (e) {
      console.error('解析历史记录失败:', e);
      return [];
    }
  },
  
  /**
   * 添加历史记录
   * @param {object} item - 历史记录项
   */
  addHistoryItem: function(item) {
    try {
      const history = this.getHistory();
      
      // 添加新记录
      history.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...item
      });
      
      // 限制历史记录数量
      if (history.length > this.MAX_HISTORY) {
        history.length = this.MAX_HISTORY;
      }
      
      // 保存历史记录
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('保存历史记录失败:', e);
    }
  },
  
  /**
   * 清空历史记录
   */
  clearHistory: function() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
  },
  
  /**
   * 删除指定的历史记录
   * @param {number} id - 历史记录ID
   */
  deleteHistoryItem: function(id) {
    try {
      let history = this.getHistory();
      history = history.filter(item => item.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('删除历史记录失败:', e);
    }
  },
  
  /**
   * 渲染历史记录到容器
   * @param {HTMLElement} container - 容器元素
   */
  renderHistory: function(container) {
    const historyContainer = container.querySelector('#history-list');
    if (!historyContainer) return;
    
    const history = this.getHistory();
    
    if (history.length === 0) {
      historyContainer.innerHTML = '<div class="empty-history">暂无历史记录</div>';
      return;
    }
    
    const historyHTML = history.map(item => {
      // 格式化日期
      const date = new Date(item.timestamp);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      
      // 截断文本
      const textPreview = item.text.length > 50 ? item.text.substring(0, 50) + '...' : item.text;
      
      // 构建结果预览
      let resultPreview = '';
      if (item.results) {
        const keys = Object.keys(item.results);
        if (keys.length > 0) {
          resultPreview = `${keys[0]}: ${item.results[keys[0]]}`;
          if (keys.length > 1) {
            resultPreview += `, ${keys[1]}: ${item.results[keys[1]]}`;
          }
          if (keys.length > 2) {
            resultPreview += `, ...`;
          }
        }
      }
      
      return `
        <div class="history-item" data-id="${item.id}">
          <div class="history-item-header">
            <div class="history-item-time">${formattedDate}</div>
            <div class="history-item-actions">
              <button class="history-use-btn" data-id="${item.id}" title="使用此记录">
                <i class="fa fa-refresh"></i>
              </button>
              <button class="history-delete-btn" data-id="${item.id}" title="删除此记录">
                <i class="fa fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="history-item-content">
            <div class="history-item-text">${textPreview}</div>
            <div class="history-item-result">${resultPreview}</div>
          </div>
        </div>
      `;
    }).join('');
    
    historyContainer.innerHTML = historyHTML;
    
    // 绑定事件
    this.setupHistoryEvents(container);
  },
  
  /**
   * 设置历史记录事件
   * @param {HTMLElement} container - 容器元素
   * @param {object} options - 选项
   */
  setupHistoryEvents: function(container, options = {}) {
    const historyContainer = container.querySelector('#history-list');
    if (!historyContainer) return;
    
    // 使用历史记录
    historyContainer.querySelectorAll('.history-use-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'));
        const item = this.getHistory().find(h => h.id === id);
        
        if (item && typeof options.onUseHistory === 'function') {
          options.onUseHistory(item);
        }
      });
    });
    
    // 删除历史记录
    historyContainer.querySelectorAll('.history-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'));
        this.deleteHistoryItem(id);
        this.renderHistory(container);
        window.textLengthUtils.showToast('已删除历史记录', 'success');
      });
    });
    
    // 点击整个历史记录项也可以使用该记录
    historyContainer.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt(item.getAttribute('data-id'));
        const historyItem = this.getHistory().find(h => h.id === id);
        
        if (historyItem && typeof options.onUseHistory === 'function') {
          options.onUseHistory(historyItem);
        }
      });
    });
    
    // 清空历史记录按钮
    const clearHistoryBtn = container.querySelector('#clear-history-btn');
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => {
        if (confirm('确定要清空所有历史记录吗？')) {
          this.clearHistory();
          this.renderHistory(container);
          window.textLengthUtils.showToast('已清空历史记录', 'success');
        }
      });
    }
  }
};