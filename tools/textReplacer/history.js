/**
 * 文本替换工具 - 历史记录模块
 */

window.textReplacerHistory = {
  // 添加到历史记录
  addToHistory: function(container, source, result) {
    if (!source || !result || source === result) return;
    
    const historyContainer = container.querySelector('#history-container');
    const noHistory = historyContainer.querySelector('.no-history');
    
    if (noHistory) {
      historyContainer.innerHTML = '';
    }
    
    // 创建历史记录项
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    // 获取当前时间
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    
    // 截断长文本
    const truncate = (text, maxLength = 30) => {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };
    
    historyItem.innerHTML = `
      <div class="history-time">${timeStr}</div>
      <div class="history-preview">
        <div class="history-source" title="${source}">${truncate(source)}</div>
        <div class="history-arrow"><i class="fa fa-arrow-right"></i></div>
        <div class="history-result" title="${result}">${truncate(result)}</div>
      </div>
      <button class="history-restore" title="恢复此结果"><i class="fa fa-history"></i></button>
    `;
    
    // 添加恢复事件
    historyItem.querySelector('.history-restore').addEventListener('click', () => {
      const resultText = container.querySelector('#result-text');
      resultText.value = result;
      
      // 更新统计信息
      window.textReplacerUtils.updateTextStats(container);
    });
    
    // 添加到历史记录容器
    historyContainer.insertBefore(historyItem, historyContainer.firstChild);
    
    // 限制历史记录数量
    const maxHistory = 10;
    const historyItems = historyContainer.querySelectorAll('.history-item');
    if (historyItems.length > maxHistory) {
      for (let i = maxHistory; i < historyItems.length; i++) {
        historyContainer.removeChild(historyItems[i]);
      }
    }
  },
  
  // 清空历史记录
  clearHistory: function(container) {
    const historyContainer = container.querySelector('#history-container');
    historyContainer.innerHTML = '<div class="no-history">暂无替换历史</div>';
  }
};

// 注意：这个模块已经在开头通过 window.textReplacerHistory 注册到全局
