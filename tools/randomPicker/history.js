/**
 * 随机选择器 - 历史记录管理模块
 */

// 历史记录管理模块
const RandomPickerHistory = {
  // 最大历史记录数量
  maxHistorySize: 50,
  
  // 添加结果到历史记录
  addToHistory: function(items, withWeights = false) {
    const history = JSON.parse(localStorage.getItem('randomPickerHistory') || '[]');
    
    // 创建新的历史记录项
    const historyItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      items: items.map(item => ({
        name: item.name,
        weight: withWeights ? item.weight : undefined
      })),
      withWeights: withWeights
    };
    
    // 添加到历史记录开头
    history.unshift(historyItem);
    
    // 限制历史记录大小
    if (history.length > this.maxHistorySize) {
      history.pop();
    }
    
    // 保存到本地存储
    localStorage.setItem('randomPickerHistory', JSON.stringify(history));
    
    return historyItem;
  },
  
  // 添加批量结果到历史记录
  addBatchToHistory: function(batchResults, withWeights = false) {
    const history = JSON.parse(localStorage.getItem('randomPickerHistory') || '[]');
    
    // 创建新的历史记录项
    const historyItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      batchResults: batchResults.map(batch => 
        batch.map(item => ({
          name: item.name,
          weight: withWeights ? item.weight : undefined
        }))
      ),
      withWeights: withWeights,
      isBatch: true
    };
    
    // 添加到历史记录开头
    history.unshift(historyItem);
    
    // 限制历史记录大小
    if (history.length > this.maxHistorySize) {
      history.pop();
    }
    
    // 保存到本地存储
    localStorage.setItem('randomPickerHistory', JSON.stringify(history));
    
    return historyItem;
  },
  
  // 添加分组结果到历史记录
  addGroupToHistory: function(groupResults) {
    const history = JSON.parse(localStorage.getItem('randomPickerHistory') || '[]');
    
    // 创建新的历史记录项
    const historyItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      groupResults: groupResults.map(result => ({
        group: result.group,
        item: result.item
      })),
      isGroup: true
    };
    
    // 添加到历史记录开头
    history.unshift(historyItem);
    
    // 限制历史记录大小
    if (history.length > this.maxHistorySize) {
      history.pop();
    }
    
    // 保存到本地存储
    localStorage.setItem('randomPickerHistory', JSON.stringify(history));
    
    return historyItem;
  },
  
  // 获取历史记录
  getHistory: function() {
    return JSON.parse(localStorage.getItem('randomPickerHistory') || '[]');
  },
  
  // 清除历史记录
  clearHistory: function() {
    localStorage.removeItem('randomPickerHistory');
  },
  
  // 删除特定历史记录
  deleteHistoryItem: function(id) {
    const history = this.getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem('randomPickerHistory', JSON.stringify(updatedHistory));
  },
  
  // 导出历史记录
  exportHistory: function() {
    const history = this.getHistory();
    
    if (history.length === 0) {
      RandomPickerUtils.showToast('没有历史记录可导出', 'warning');
      return;
    }
    
    // 格式化历史记录以便于导出
    const exportData = history.map(item => {
      const formattedDate = new Date(item.timestamp).toLocaleString();
      
      if (item.isGroup) {
        // 分组结果
        return {
          日期: formattedDate,
          类型: '分组选择',
          结果: item.groupResults.map(r => `${r.group}: ${r.item}`).join(', ')
        };
      } else if (item.isBatch) {
        // 批量结果
        return {
          日期: formattedDate,
          类型: '批量选择',
          结果: item.batchResults.map((batch, i) => 
            `批次${i+1}: ${batch.map(i => i.name).join(', ')}`
          ).join(' | ')
        };
      } else {
        // 普通结果
        return {
          日期: formattedDate,
          类型: '单次选择',
          结果: item.items.map(i => i.name).join(', ')
        };
      }
    });
    
    // 导出为CSV
    RandomPickerUtils.exportToCsv(exportData, '随机选择器历史记录.csv');
  },
  
  // 显示历史记录
  displayHistory: function(container) {
    const history = this.getHistory();
    const historyContainer = container.querySelector('#history-container');
    
    if (!historyContainer) return;
    
    if (history.length === 0) {
      historyContainer.innerHTML = '<div class="empty-history">没有历史记录</div>';
      return;
    }
    
    // 创建历史记录列表
    let html = '<div class="history-list">';
    
    history.forEach(item => {
      const date = new Date(item.timestamp);
      const formattedDate = RandomPickerUtils.formatDateTime(date);
      
      html += `<div class="history-item" data-id="${item.id}">`;
      html += `<div class="history-header">`;
      html += `<span class="history-date">${formattedDate}</span>`;
      html += `<div class="history-actions">`;
      html += `<button class="btn-reuse" title="重新使用这个结果"><i class="fas fa-redo"></i></button>`;
      html += `<button class="btn-delete" title="删除这条历史记录"><i class="fas fa-trash"></i></button>`;
      html += `</div></div>`;
      
      if (item.isGroup) {
        // 分组结果
        html += `<div class="history-content group-history">`;
        
        // 按组分类
        const groupedResults = {};
        item.groupResults.forEach(result => {
          if (!groupedResults[result.group]) {
            groupedResults[result.group] = [];
          }
          groupedResults[result.group].push(result.item);
        });
        
        // 显示每个组的结果
        for (const [group, items] of Object.entries(groupedResults)) {
          html += `<div class="history-group">`;
          html += `<div class="group-name">${group}</div>`;
          html += `<div class="group-items">${items.join(', ')}</div>`;
          html += `</div>`;
        }
        
        html += `</div>`;
      } else if (item.isBatch) {
        // 批量结果
        html += `<div class="history-content batch-history">`;
        
        item.batchResults.forEach((batch, index) => {
          html += `<div class="batch-item">`;
          html += `<div class="batch-header">批次 ${index + 1}</div>`;
          html += `<div class="batch-content">${batch.map(i => i.name).join(', ')}</div>`;
          html += `</div>`;
        });
        
        html += `</div>`;
      } else {
        // 普通结果
        html += `<div class="history-content">`;
        html += `<div class="history-items">${item.items.map(i => i.name).join(', ')}</div>`;
        html += `</div>`;
      }
      
      html += `</div>`;
    });
    
    html += '</div>';
    html += '<div class="history-footer">';
    html += '<button id="clear-history" class="btn btn-danger">清除所有历史记录</button>';
    html += '<button id="export-history" class="btn btn-primary">导出历史记录</button>';
    html += '</div>';
    
    historyContainer.innerHTML = html;
    
    // 添加事件监听器
    this.addHistoryEventListeners(container);
  },
  
  // 添加历史记录事件监听器
  addHistoryEventListeners: function(container) {
    const historyContainer = container.querySelector('#history-container');
    if (!historyContainer) return;
    
    // 清除历史记录按钮
    const clearHistoryBtn = historyContainer.querySelector('#clear-history');
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => {
        if (confirm('确定要清除所有历史记录吗？')) {
          this.clearHistory();
          this.displayHistory(container);
          RandomPickerUtils.showToast('历史记录已清除', 'success');
        }
      });
    }
    
    // 导出历史记录按钮
    const exportHistoryBtn = historyContainer.querySelector('#export-history');
    if (exportHistoryBtn) {
      exportHistoryBtn.addEventListener('click', () => {
        this.exportHistory();
      });
    }
    
    // 删除单条历史记录按钮
    const deleteButtons = historyContainer.querySelectorAll('.btn-delete');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const historyItem = btn.closest('.history-item');
        const id = parseInt(historyItem.dataset.id);
        
        if (confirm('确定要删除这条历史记录吗？')) {
          this.deleteHistoryItem(id);
          historyItem.remove();
          
          // 如果删除后没有历史记录了，显示空状态
          const remainingItems = historyContainer.querySelectorAll('.history-item');
          if (remainingItems.length === 0) {
            historyContainer.innerHTML = '<div class="empty-history">没有历史记录</div>';
          }
          
          RandomPickerUtils.showToast('历史记录已删除', 'success');
        }
      });
    });
    
    // 重用历史记录按钮
    const reuseButtons = historyContainer.querySelectorAll('.btn-reuse');
    reuseButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const historyItem = btn.closest('.history-item');
        const id = parseInt(historyItem.dataset.id);
        
        // 获取对应的历史记录
        const history = this.getHistory();
        const item = history.find(h => h.id === id);
        
        if (item) {
          // 根据历史记录类型执行不同的操作
          if (item.isGroup) {
            // 分组结果重用
            RandomPickerUI.reuseGroupHistory(container, item);
          } else if (item.isBatch) {
            // 批量结果重用
            RandomPickerUI.reuseBatchHistory(container, item);
          } else {
            // 普通结果重用
            RandomPickerUI.reuseHistory(container, item);
          }
          
          RandomPickerUtils.showToast('已重用历史记录', 'success');
        }
      });
    });
  }
};

// 导出模块
window.RandomPickerHistory = RandomPickerHistory;