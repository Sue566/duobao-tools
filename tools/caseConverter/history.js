/**
 * 大小写转换工具 - 历史记录功能
 */

window.caseConverterHistory = {
  /**
   * 初始化历史记录功能
   * @param {HTMLElement} container - 容器元素
   */
  init: function(container) {
    this.container = container;
    this.utils = window.caseConverterUtils;
    
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
        localStorage.removeItem('caseConverterHistory');
        this.renderHistory();
        if (this.utils && typeof this.utils.showToast === 'function') {
          this.utils.showToast('历史记录已清空', 'success');
        }
      });
    }
  },
  
  /**
   * 保存到历史记录
   * @param {string} operation - 操作类型
   * @param {string} input - 输入文本
   * @param {string} output - 输出文本
   */
  saveToHistory: function(operation, input, output) {
    // 创建历史记录项
    const historyItem = {
      id: Date.now(),
      operation,
      input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
      output: output.substring(0, 100) + (output.length > 100 ? '...' : ''),
      timestamp: new Date().toISOString(),
      fullInput: input,
      fullOutput: output
    };
    
    // 添加到历史记录
    this.historyItems.unshift(historyItem);
    
    // 限制历史记录数量
    if (this.historyItems.length > 10) {
      this.historyItems = this.historyItems.slice(0, 10);
    }
    
    // 保存到本地存储
    try {
      localStorage.setItem('caseConverterHistory', JSON.stringify(this.historyItems));
    } catch (error) {
      console.error('保存历史记录失败:', error);
    }
    
    // 更新历史记录显示
    this.renderHistory();
  },
  
  /**
   * 加载历史记录
   * @returns {Array} 历史记录数组
   */
  loadHistory: function() {
    try {
      const saved = localStorage.getItem('caseConverterHistory');
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
    
    if (!this.historyItems || this.historyItems.length === 0) {
      this.historyList.innerHTML = '<div class="no-history"><i class="fa fa-info-circle"></i> 暂无历史记录</div>';
      return;
    }
    
    let html = '';
    
    this.historyItems.forEach(item => {
      const date = new Date(item.timestamp);
      const formattedDate = date.toLocaleString();
      
      html += `
        <div class="history-item" data-id="${item.id}">
          <div class="history-item-content">
            <div class="history-item-type">${item.operation}</div>
            <div class="history-item-text">${item.input} → ${item.output}</div>
            <div class="history-item-time">${formattedDate}</div>
          </div>
          <div class="history-item-actions">
            <button class="btn btn-sm history-use-btn" data-id="${item.id}">使用</button>
            <button class="btn btn-sm btn-outline history-delete-btn" data-id="${item.id}">删除</button>
          </div>
        </div>
      `;
    });
    
    this.historyList.innerHTML = html;
    
    // 添加历史记录项事件
    const useButtons = this.historyList.querySelectorAll('.history-use-btn');
    if (useButtons && useButtons.length) {
      useButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.getAttribute('data-id'), 10);
          const item = this.historyItems.find(h => h.id === id);
          
          if (item) {
            const inputTextarea = this.container.querySelector('#case-input');
            const outputTextarea = this.container.querySelector('#case-output');
            
            if (inputTextarea && outputTextarea) {
              inputTextarea.value = item.fullInput;
              outputTextarea.value = item.fullOutput;
              
              // 更新统计信息
              const charCount = this.container.querySelector('#char-count');
              const wordCount = this.container.querySelector('#word-count');
              const lineCount = this.container.querySelector('#line-count');
              const outputCharCount = this.container.querySelector('#output-char-count');
              const outputWordCount = this.container.querySelector('#output-word-count');
              const outputLineCount = this.container.querySelector('#output-line-count');
              
              if (this.utils && typeof this.utils.updateTextStats === 'function') {
                this.utils.updateTextStats(inputTextarea, charCount, wordCount, lineCount);
                this.utils.updateTextStats(outputTextarea, outputCharCount, outputWordCount, outputLineCount);
              }
            }
          }
        });
      });
    }
    
    const deleteButtons = this.historyList.querySelectorAll('.history-delete-btn');
    if (deleteButtons && deleteButtons.length) {
      deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.getAttribute('data-id'), 10);
          this.historyItems = this.historyItems.filter(h => h.id !== id);
          
          // 保存到本地存储
          try {
            localStorage.setItem('caseConverterHistory', JSON.stringify(this.historyItems));
          } catch (error) {
            console.error('保存历史记录失败:', error);
          }
          
          // 更新历史记录显示
          this.renderHistory();
        });
      });
    }
  }
};