/**
 * 随机选择器 - 历史记录模块
 */
(function() {
  // 历史记录模块
  window.randomPicker.history = {
    // 获取历史记录
    getHistory: function() {
      const history = localStorage.getItem('randomPickerHistory');
      return history ? JSON.parse(history) : [];
    },
    
    // 添加到历史记录
    addToHistory: function(items, withWeights) {
      const history = this.getHistory();
      
      // 创建历史记录项
      const historyItem = {
        type: '列表选择',
        timestamp: Date.now(),
        items: items,
        withWeights: withWeights,
        tab: 'list',
        canVisualize: true,
        rawResult: items,
        result: ''
      };
      
      // 生成结果HTML
      const resultList = document.createElement('div');
      resultList.className = 'result-list';
      
      items.forEach((item, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        if (withWeights) {
          resultItem.innerHTML = `${index + 1}. ${item.name} <span class="weight">(权重: ${item.weight})</span>`;
        } else {
          resultItem.innerHTML = `${index + 1}. ${item.name || item}`;
        }
        
        resultList.appendChild(resultItem);
      });
      
      historyItem.result = resultList.outerHTML;
      
      // 添加到历史记录
      history.unshift(historyItem);
      
      // 限制历史记录数量
      if (history.length > 50) {
        history.pop();
      }
      
      // 保存历史记录
      localStorage.setItem('randomPickerHistory', JSON.stringify(history));
    },
    
    // 添加批量结果到历史记录
    addBatchToHistory: function(batchResults, withWeights) {
      const history = this.getHistory();
      
      // 创建历史记录项
      const historyItem = {
        type: '批量选择',
        timestamp: Date.now(),
        batchResults: batchResults,
        withWeights: withWeights,
        tab: 'list',
        canVisualize: true,
        rawResult: batchResults[0], // 使用第一批结果进行可视化
        result: ''
      };
      
      // 生成结果HTML
      const batchContainer = document.createElement('div');
      batchContainer.className = 'batch-results';
      
      batchResults.forEach((batch, batchIndex) => {
        const batchDiv = document.createElement('div');
        batchDiv.className = 'batch-item';
        
        const batchHeader = document.createElement('h4');
        batchHeader.textContent = `批次 ${batchIndex + 1}`;
        batchDiv.appendChild(batchHeader);
        
        const resultList = document.createElement('div');
        resultList.className = 'result-list';
        
        batch.forEach((item, index) => {
          const resultItem = document.createElement('div');
          resultItem.className = 'result-item';
          
          if (withWeights) {
            resultItem.innerHTML = `${index + 1}. ${item.name} <span class="weight">(权重: ${item.weight})</span>`;
          } else {
            resultItem.innerHTML = `${index + 1}. ${item.name || item}`;
          }
          
          resultList.appendChild(resultItem);
        });
        
        batchDiv.appendChild(resultList);
        batchContainer.appendChild(batchDiv);
      });
      
      historyItem.result = batchContainer.outerHTML;
      
      // 添加到历史记录
      history.unshift(historyItem);
      
      // 限制历史记录数量
      if (history.length > 50) {
        history.pop();
      }
      
      // 保存历史记录
      localStorage.setItem('randomPickerHistory', JSON.stringify(history));
    },
    
    // 添加分组结果到历史记录
    addGroupToHistory: function(results) {
      const history = this.getHistory();
      
      // 按组分类结果
      const groups = {};
      results.forEach(result => {
        if (!groups[result.group]) {
          groups[result.group] = [];
        }
        groups[result.group].push(result.item);
      });
      
      // 创建历史记录项
      const historyItem = {
        type: '分组选择',
        timestamp: Date.now(),
        groups: groups,
        tab: 'group',
        canVisualize: false,
        result: ''
      };
      
      // 生成结果HTML
      const groupsContainer = document.createElement('div');
      groupsContainer.className = 'groups-container';
      
      Object.keys(groups).forEach(groupName => {
        const group = groups[groupName];
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group-item';
        
        const groupHeader = document.createElement('h4');
        groupHeader.textContent = groupName;
        groupDiv.appendChild(groupHeader);
        
        const groupList = document.createElement('ul');
        group.forEach(member => {
          const memberItem = document.createElement('li');
          memberItem.textContent = member;
          groupList.appendChild(memberItem);
        });
        
        groupDiv.appendChild(groupList);
        groupsContainer.appendChild(groupDiv);
      });
      
      historyItem.result = groupsContainer.outerHTML;
      
      // 添加到历史记录
      history.unshift(historyItem);
      
      // 限制历史记录数量
      if (history.length > 50) {
        history.pop();
      }
      
      // 保存历史记录
      localStorage.setItem('randomPickerHistory', JSON.stringify(history));
    },
    
    // 保存结果
    saveResult: function(resultHTML) {
      const history = this.getHistory();
      
      // 创建历史记录项
      const historyItem = {
        type: '保存结果',
        timestamp: Date.now(),
        tab: document.querySelector('.tab-btn.active')?.dataset.tab || 'list',
        canVisualize: false,
        result: resultHTML
      };
      
      // 添加到历史记录
      history.unshift(historyItem);
      
      // 限制历史记录数量
      if (history.length > 50) {
        history.pop();
      }
      
      // 保存历史记录
      localStorage.setItem('randomPickerHistory', JSON.stringify(history));
    },
    
    // 删除历史记录项
    deleteHistoryItem: function(index) {
      const history = this.getHistory();
      
      if (index >= 0 && index < history.length) {
        history.splice(index, 1);
        localStorage.setItem('randomPickerHistory', JSON.stringify(history));
      }
    },
    
    // 清空历史记录
    clearHistory: function() {
      localStorage.removeItem('randomPickerHistory');
    },
    
    // 导出历史记录
    exportHistory: function() {
      const history = this.getHistory();
      
      if (history.length === 0) {
        window.randomPicker.utils.showToast('没有历史记录可导出', 'warning');
        return;
      }
      
      // 导出为JSON文件
      const exportData = {
        tool: '随机选择器',
        version: '1.0',
        exportDate: new Date().toISOString(),
        history: history
      };
      
      window.randomPicker.utils.exportToJson(exportData, '随机选择器历史记录.json');
    }
  };
})();