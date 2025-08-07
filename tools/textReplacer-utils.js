/**
 * 文本替换工具辅助函数
 * 提供文本替换工具所需的各种辅助功能
 */
(function() {
  // 创建工具辅助对象
  window.textReplacerUtils = {
    /**
     * 转义正则表达式特殊字符
     * @param {string} string - 需要转义的字符串
     * @returns {string} - 转义后的字符串
     */
    escapeRegExp: function(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },
    
    /**
     * 更新规则标题
     * @param {HTMLElement} container - 容器元素
     * @returns {number} - 规则数量
     */
    updateRuleTitles: function(container) {
      const rulesContainer = container.querySelector('#rules-container');
      const rules = rulesContainer.querySelectorAll('.rule-item');
      rules.forEach((rule, index) => {
        rule.querySelector('.rule-title').textContent = `规则 ${index + 1}`;
      });
      return rules.length;
    },
    
    /**
     * 更新文本统计信息
     * @param {HTMLElement} container - 容器元素
     */
    updateTextStats: function(container) {
      const sourceText = container.querySelector('#source-text');
      const resultText = container.querySelector('#result-text');
      const sourceChars = container.querySelector('#source-chars');
      const sourceLines = container.querySelector('#source-lines');
      const resultChars = container.querySelector('#result-chars');
      const resultLines = container.querySelector('#result-lines');
      
      if (sourceText && sourceChars && sourceLines) {
        sourceChars.textContent = sourceText.value.length;
        sourceLines.textContent = sourceText.value ? (sourceText.value.match(/\n/g) || []).length + 1 : 0;
      }
      
      if (resultText && resultChars && resultLines) {
        resultChars.textContent = resultText.value.length;
        resultLines.textContent = resultText.value ? (resultText.value.match(/\n/g) || []).length + 1 : 0;
      }
    },
    
    /**
     * 获取当前规则数据
     * @param {HTMLElement} container - 容器元素
     * @returns {Array} - 规则数据数组
     */
    getRulesData: function(container) {
      const rulesContainer = container.querySelector('#rules-container');
      const rules = rulesContainer.querySelectorAll('.rule-item');
      const rulesData = [];
      
      rules.forEach(rule => {
        rulesData.push({
          search: rule.querySelector('.search-text').value,
          replace: rule.querySelector('.replace-text').value,
          useRegex: rule.querySelector('.use-regex').checked,
          caseSensitive: rule.querySelector('.case-sensitive').checked,
          globalMatch: rule.querySelector('.global-match').checked,
          multiline: rule.querySelector('.multiline').checked
        });
      });
      
      return rulesData;
    },
    
    /**
     * 获取保存的规则
     * @returns {Object} - 保存的规则对象
     */
    getSavedRules: function() {
      try {
        const savedRules = localStorage.getItem('textReplacer_savedRules');
        return savedRules ? JSON.parse(savedRules) : {};
      } catch (e) {
        console.error('加载保存的规则失败', e);
        return {};
      }
    },
    
    /**
     * 添加到历史记录
     * @param {HTMLElement} container - 容器元素
     * @param {string} source - 源文本
     * @param {string} result - 结果文本
     */
    addToHistory: function(container, source, result) {
      const historyContainer = container.querySelector('#history-container');
      const noHistory = historyContainer.querySelector('.no-history');
      
      if (noHistory) {
        noHistory.remove();
      }
      
      // 创建历史记录项
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      
      // 获取当前时间
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      
      // 截取文本预览
      const sourcePreview = source.length > 50 ? source.substring(0, 50) + '...' : source;
      
      historyItem.innerHTML = `
        <div class="history-header">
          <span class="history-time">${timeString}</span>
          <div class="history-actions">
            <button class="btn-history-restore" title="恢复此结果"><i class="fa fa-undo"></i></button>
            <button class="btn-history-delete" title="删除此记录"><i class="fa fa-trash"></i></button>
          </div>
        </div>
        <div class="history-preview">${this.escapeHtml(sourcePreview)}</div>
      `;
      
      // 添加到历史容器的顶部
      historyContainer.insertBefore(historyItem, historyContainer.firstChild);
      
      // 限制历史记录数量
      const maxHistory = 10;
      const historyItems = historyContainer.querySelectorAll('.history-item');
      if (historyItems.length > maxHistory) {
        for (let i = maxHistory; i < historyItems.length; i++) {
          historyContainer.removeChild(historyItems[i]);
        }
      }
      
      // 保存历史数据到元素中
      historyItem._historyData = {
        source: source,
        result: result,
        timestamp: now.getTime()
      };
      
      // 添加恢复事件
      historyItem.querySelector('.btn-history-restore').addEventListener('click', () => {
        const sourceText = container.querySelector('#source-text');
        const resultText = container.querySelector('#result-text');
        
        sourceText.value = source;
        resultText.value = result;
        
        this.updateTextStats(container);
        showToast('已恢复历史记录', 'success');
      });
      
      // 添加删除事件
      historyItem.querySelector('.btn-history-delete').addEventListener('click', () => {
        historyContainer.removeChild(historyItem);
        
        // 如果没有历史记录了，显示提示
        if (historyContainer.children.length === 0) {
          historyContainer.innerHTML = '<div class="no-history">暂无替换历史</div>';
        }
        
        showToast('已删除历史记录', 'info');
      });
    },
    
    /**
     * HTML转义
     * @param {string} html - 需要转义的HTML字符串
     * @returns {string} - 转义后的字符串
     */
    escapeHtml: function(html) {
      const div = document.createElement('div');
      div.textContent = html;
      return div.innerHTML;
    },
    
    /**
     * 导出规则为JSON文件
     * @param {Array} rules - 规则数据数组
     * @param {string} [name='替换规则'] - 规则名称
     */
    exportRules: function(rules, name = '替换规则') {
      const data = {
        name: name,
        rules: rules,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name.replace(/[^\w\u4e00-\u9fa5]/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    
    /**
     * 导入规则
     * @param {File} file - JSON文件
     * @returns {Promise} - 包含规则数据的Promise
     */
    importRules: function(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            if (Array.isArray(data.rules)) {
              resolve(data);
            } else {
              reject(new Error('无效的规则文件格式'));
            }
          } catch (error) {
            reject(new Error('解析规则文件失败: ' + error.message));
          }
        };
        
        reader.onerror = () => {
          reject(new Error('读取文件失败'));
        };
        
        reader.readAsText(file);
      });
    },
    
    /**
     * 加载规则数据
     * @param {HTMLElement} container - 容器元素
     * @param {Array} rules - 规则数据数组
     * @returns {number} - 规则数量
     */
    loadRulesData: function(container, rules) {
      return this.applyRules(container, rules);
    },
    
    /**
     * 应用规则到容器
     * @param {HTMLElement} container - 容器元素
     * @param {Array} rules - 规则数据数组
     * @returns {number} - 规则数量
     */
    applyRules: function(container, rules) {
      const rulesContainer = container.querySelector('#rules-container');
      
      // 清空现有规则
      rulesContainer.innerHTML = '';
      
      // 添加新规则
      rules.forEach((rule, index) => {
        const ruleItem = document.createElement('div');
        ruleItem.className = 'rule-item';
        ruleItem.innerHTML = `
          <div class="rule-header">
            <span class="rule-title">规则 ${index + 1}</span>
            <div class="rule-actions">
              <button class="btn-rule-toggle" title="展开/折叠"><i class="fa fa-chevron-up"></i></button>
              ${index > 0 ? '<button class="btn-rule-delete" title="删除规则"><i class="fa fa-trash"></i></button>' : ''}
            </div>
          </div>
          <div class="rule-content">
            <div class="rule-inputs">
              <input type="text" class="form-control search-text" placeholder="查找内容..." value="${this.escapeHtml(rule.search || '')}" />
              <span class="rule-arrow"><i class="fa fa-arrow-right"></i></span>
              <input type="text" class="form-control replace-text" placeholder="替换为..." value="${this.escapeHtml(rule.replace || '')}" />
            </div>
            <div class="rule-options">
              <label><input type="checkbox" class="use-regex" ${rule.useRegex ? 'checked' : ''} /> 使用正则表达式</label>
              <label><input type="checkbox" class="case-sensitive" ${rule.caseSensitive ? 'checked' : ''} /> 区分大小写</label>
              <label><input type="checkbox" class="global-match" ${rule.globalMatch !== false ? 'checked' : ''} /> 全局替换</label>
              <label><input type="checkbox" class="multiline" ${rule.multiline ? 'checked' : ''} /> 多行模式</label>
            </div>
          </div>
        `;
        rulesContainer.appendChild(ruleItem);
        
        // 添加规则折叠/展开事件
        ruleItem.querySelector('.btn-rule-toggle').addEventListener('click', (e) => {
          const content = ruleItem.querySelector('.rule-content');
          const icon = e.currentTarget.querySelector('i');
          if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.className = 'fa fa-chevron-up';
          } else {
            content.style.display = 'none';
            icon.className = 'fa fa-chevron-down';
          }
        });
        
        // 添加删除规则事件
        const deleteBtn = ruleItem.querySelector('.btn-rule-delete');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', () => {
            rulesContainer.removeChild(ruleItem);
            this.updateRuleTitles(container);
          });
        }
      });
      
      return rules.length;
    }
  };
})();