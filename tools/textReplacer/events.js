/**
 * 文本替换工具 - 事件处理模块
 */

const utils = require('./utils');
const history = require('./history');
const rules = require('./rules');

const events = {
  // 初始化事件
  init: function(container) {
    // 获取元素
    const sourceText = container.querySelector('#source-text');
    const resultText = container.querySelector('#result-text');
    const addRuleBtn = container.querySelector('#add-rule');
    const clearRulesBtn = container.querySelector('#clear-rules');
    const testRulesBtn = container.querySelector('#test-rules');
    const replaceBtn = container.querySelector('#replace-btn');
    const resetBtn = container.querySelector('#reset-btn');
    const swapBtn = container.querySelector('#swap-btn');
    const copyBtn = container.querySelector('#copy-btn');
    const downloadBtn = container.querySelector('#download-btn');
    const saveRulesBtn = container.querySelector('#save-rules');
    const loadRulesBtn = container.querySelector('#load-rules');
    const exportRulesBtn = container.querySelector('#export-rules');
    const importRulesBtn = container.querySelector('#import-rules');
    const importRulesInput = container.querySelector('#import-rules-input');
    const clearHistoryBtn = container.querySelector('#clear-history');
    const toggleInfoBtn = container.querySelector('.toggle-info-btn');
    
    // 对话框元素
    const saveRulesDialog = container.querySelector('#save-rules-dialog');
    const loadRulesDialog = container.querySelector('#load-rules-dialog');
    const saveRulesConfirmBtn = container.querySelector('#save-rules-confirm');
    const ruleName = container.querySelector('#rule-name');
    const ruleDescription = container.querySelector('#rule-description');
    const savedRulesList = container.querySelector('#saved-rules-list');
    
    // 关闭对话框按钮
    container.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        saveRulesDialog.style.display = 'none';
        loadRulesDialog.style.display = 'none';
      });
    });
    
    // 添加规则
    let ruleCounter = 1;
    addRuleBtn.addEventListener('click', () => {
      ruleCounter++;
      const ruleItem = document.createElement('div');
      ruleItem.className = 'rule-item';
      ruleItem.innerHTML = `
        <div class="rule-header">
          <span class="rule-title">规则 ${ruleCounter}</span>
          <div class="rule-actions">
            <button class="btn-rule-toggle" title="展开/折叠"><i class="fa fa-chevron-up"></i></button>
            <button class="btn-rule-delete" title="删除规则"><i class="fa fa-trash"></i></button>
          </div>
        </div>
        <div class="rule-content">
          <div class="rule-inputs">
            <input type="text" class="form-control search-text" placeholder="查找内容..." />
            <span class="rule-arrow"><i class="fa fa-arrow-right"></i></span>
            <input type="text" class="form-control replace-text" placeholder="替换为..." />
          </div>
          <div class="rule-options">
            <label><input type="checkbox" class="use-regex" /> 使用正则表达式</label>
            <label><input type="checkbox" class="case-sensitive" /> 区分大小写</label>
            <label><input type="checkbox" class="global-match" checked /> 全局替换</label>
            <label><input type="checkbox" class="multiline" /> 多行模式</label>
          </div>
        </div>
      `;
      container.querySelector('#rules-container').appendChild(ruleItem);
      
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
      ruleItem.querySelector('.btn-rule-delete').addEventListener('click', () => {
        container.querySelector('#rules-container').removeChild(ruleItem);
        ruleCounter = utils.updateRuleTitles(container);
      });
    });
    
    // 为第一个规则添加折叠/展开事件
    const firstRuleToggle = container.querySelector('.btn-rule-toggle');
    if (firstRuleToggle) {
      firstRuleToggle.addEventListener('click', (e) => {
        const content = e.currentTarget.closest('.rule-item').querySelector('.rule-content');
        const icon = e.currentTarget.querySelector('i');
        if (content.style.display === 'none') {
          content.style.display = 'block';
          icon.className = 'fa fa-chevron-up';
        } else {
          content.style.display = 'none';
          icon.className = 'fa fa-chevron-down';
        }
      });
    }
    
    // 清空规则
    clearRulesBtn.addEventListener('click', () => {
      // 保留第一个规则，清空其输入
      const firstRule = container.querySelector('.rule-item');
      if (firstRule) {
        firstRule.querySelector('.search-text').value = '';
        firstRule.querySelector('.replace-text').value = '';
        firstRule.querySelector('.use-regex').checked = false;
        firstRule.querySelector('.case-sensitive').checked = false;
        firstRule.querySelector('.global-match').checked = true;
        firstRule.querySelector('.multiline').checked = false;
      }
      
      // 移除其他规则
      const rulesContainer = container.querySelector('#rules-container');
      const ruleItems = rulesContainer.querySelectorAll('.rule-item');
      for (let i = 1; i < ruleItems.length; i++) {
        rulesContainer.removeChild(ruleItems[i]);
      }
      
      // 重置计数器
      ruleCounter = 1;
      utils.updateRuleTitles(container);
    });
    
    // 测试规则
    testRulesBtn.addEventListener('click', () => {
      const testResult = rules.testRules(container);
      if (!testResult) {
        this.showToast('请先输入源文本', 'warning');
        return;
      }
      
      // 创建高亮预览
      const previewDialog = document.createElement('div');
      previewDialog.className = 'modal';
      previewDialog.style.display = 'block';
      previewDialog.innerHTML = `
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h3>规则匹配预览</h3>
            <span class="close-preview">&times;</span>
          </div>
          <div class="modal-body">
            <div class="preview-content"></div>
            <div class="preview-stats">找到 <span class="match-count">0</span> 处匹配</div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary close-preview">关闭</button>
          </div>
        </div>
      `;
      container.appendChild(previewDialog);
      
      const previewContent = previewDialog.querySelector('.preview-content');
      const matchCountEl = previewDialog.querySelector('.match-count');
      
      // 更新预览内容
      previewContent.innerHTML = `<pre>${testResult.highlightedText}</pre>`;
      matchCountEl.textContent = testResult.matchCount;
      
      // 添加关闭预览事件
      previewDialog.querySelectorAll('.close-preview').forEach(btn => {
        btn.addEventListener('click', () => {
          container.removeChild(previewDialog);
        });
      });
      
      // 添加预览样式
      const previewStyle = document.createElement('style');
      previewStyle.textContent = `
        .modal-lg {
          width: 80%;
          max-width: 1000px;
        }
        
        .preview-content {
          max-height: 400px;
          overflow-y: auto;
          border: 1px solid var(--border-color);
          padding: 10px;
          background-color: var(--bg-color);
          margin-bottom: 10px;
        }
        
        .preview-content pre {
          white-space: pre-wrap;
          word-break: break-word;
          margin: 0;
        }
        
        .preview-stats {
          text-align: right;
          font-style: italic;
          color: var(--text-muted);
        }
        
        .highlight-0 { background-color: #ffeb3b; color: #000; }
        .highlight-1 { background-color: #4caf50; color: #fff; }
        .highlight-2 { background-color: #2196f3; color: #fff; }
        .highlight-3 { background-color: #9c27b0; color: #fff; }
        .highlight-4 { background-color: #f44336; color: #fff; }
      `;
      container.appendChild(previewStyle);
    });
    
    // 执行替换
    replaceBtn.addEventListener('click', () => {
      const source = sourceText.value;
      if (!source) {
        this.showToast('请先输入源文本', 'warning');
        return;
      }
      
      const { result, changes } = rules.applyRules(container);
      
      // 显示结果
      resultText.value = result;
      
      // 更新统计信息
      utils.updateTextStats(container);
      container.querySelector('#changes-count').textContent = changes;
      
      // 添加到历史记录
      history.addToHistory(container, source, result);
      
      // 显示成功提示
      this.showToast(`替换完成！共有 ${changes} 处更改`, 'success');
    });
    
    // 重置
    resetBtn.addEventListener('click', () => {
      sourceText.value = '';
      resultText.value = '';
      clearRulesBtn.click();
      utils.updateTextStats(container);
    });
    
    // 交换源文本和结果
    swapBtn.addEventListener('click', () => {
      const temp = sourceText.value;
      sourceText.value = resultText.value;
      resultText.value = temp;
      utils.updateTextStats(container);
    });
    
    // 复制结果
    copyBtn.addEventListener('click', () => {
      if (resultText.value) {
        window.copyToClipboard(resultText.value);
      } else {
        this.showToast('没有可复制的内容', 'warning');
      }
    });
    
    // 下载结果
    downloadBtn.addEventListener('click', () => {
      if (!resultText.value) {
        this.showToast('没有可下载的内容', 'warning');
        return;
      }
      
      const blob = new Blob([resultText.value], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'replaced_text_' + new Date().toISOString().slice(0, 10) + '.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    
    // 保存规则
    saveRulesBtn.addEventListener('click', () => {
      const rulesData = utils.getRulesData(container);
      if (rulesData.length === 0 || (rulesData.length === 1 && !rulesData[0].search)) {
        this.showToast('没有可保存的规则', 'warning');
        return;
      }
      
      saveRulesDialog.style.display = 'block';
      ruleName.focus();
    });
    
    // 确认保存规则
    saveRulesConfirmBtn.addEventListener('click', () => {
      const name = ruleName.value.trim();
      if (!name) {
        this.showToast('请输入规则名称', 'warning');
        return;
      }
      
      if (rules.saveRule(container, name, ruleDescription.value.trim())) {
        this.showToast('规则已保存', 'success');
        saveRulesDialog.style.display = 'none';
        ruleName.value = '';
        ruleDescription.value = '';
      } else {
        this.showToast('保存规则失败', 'error');
      }
    });
    
    // 加载规则
    loadRulesBtn.addEventListener('click', () => {
      const savedRules = utils.getSavedRules();
      
      if (Object.keys(savedRules).length === 0) {
        this.showToast('没有保存的规则', 'warning');
        return;
      }
      
      // 更新规则列表
      const rulesList = savedRulesList.querySelector('.no-saved-rules');
      if (rulesList) {
        savedRulesList.innerHTML = '';
      }
      
      // 添加规则项
      for (const name in savedRules) {
        const rule = savedRules[name];
        const ruleItem = document.createElement('div');
        ruleItem.className = 'saved-rule-item';
        
        const date = new Date(rule.date);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        ruleItem.innerHTML = `
          <div class="saved-rule-header">
            <div class="saved-rule-name">${name}</div>
            <div class="saved-rule-date">${dateStr}</div>
          </div>
          <div class="saved-rule-description">${rule.description || '无描述'}</div>
          <div class="saved-rule-stats">${rule.rules.length} 条规则</div>
          <div class="saved-rule-actions">
            <button class="btn btn-sm btn-load-rule"><i class="fa fa-check"></i> 加载</button>
            <button class="btn btn-sm btn-delete-rule"><i class="fa fa-trash"></i> 删除</button>
          </div>
        `;
        
        // 加载规则事件
        ruleItem.querySelector('.btn-load-rule').addEventListener('click', () => {
          ruleCounter = utils.loadRulesData(container, rule.rules);
          loadRulesDialog.style.display = 'none';
          this.showToast('规则已加载', 'success');
        });
        
        // 删除规则事件
        ruleItem.querySelector('.btn-delete-rule').addEventListener('click', () => {
          if (rules.deleteRule(name)) {
            savedRulesList.removeChild(ruleItem);
            
            if (Object.keys(utils.getSavedRules()).length === 0) {
              savedRulesList.innerHTML = '<div class="no-saved-rules">暂无保存的规则</div>';
            }
            
            this.showToast('规则已删除', 'success');
          } else {
            this.showToast('删除规则失败', 'error');
          }
        });
        
        savedRulesList.appendChild(ruleItem);
      }
      
      loadRulesDialog.style.display = 'block';
    });
    
    // 导出规则
    exportRulesBtn.addEventListener('click', () => {
      const exportData = rules.exportRules(container);
      if (!exportData) {
        this.showToast('没有可导出的规则', 'warning');
        return;
      }
      
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'text_replacer_rules_' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      this.showToast('规则已导出', 'success');
    });
    
    // 导入规则
    importRulesBtn.addEventListener('click', () => {
      importRulesInput.click();
    });
    
    importRulesInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = rules.importRules(container, event.target.result);
        if (result) {
          ruleCounter = result;
          this.showToast('规则已导入', 'success');
        } else {
          this.showToast('无效的规则文件格式', 'error');
        }
      };
      reader.readAsText(file);
      
      // 重置文件输入，以便可以重复选择同一个文件
      importRulesInput.value = '';
    });
    
    // 清空历史
    clearHistoryBtn.addEventListener('click', () => {
      history.clearHistory(container);
    });
    
    // 展开/收起说明
    toggleInfoBtn.addEventListener('click', () => {
      const infoContent = container.querySelector('.info-content');
      const icon = toggleInfoBtn.querySelector('i');
      
      if (infoContent.style.display === 'none') {
        infoContent.style.display = 'block';
        icon.className = 'fa fa-chevron-up';
      } else {
        infoContent.style.display = 'none';
        icon.className = 'fa fa-chevron-down';
      }
    });
    
    // 初始化文本统计
    sourceText.addEventListener('input', () => {
      utils.updateTextStats(container);
    });
    
    resultText.addEventListener('input', () => {
      utils.updateTextStats(container);
    });
  },
  
  // 显示提示消息
  showToast: function(message, type = 'info') {
    if (window.showToast) {
      window.showToast(message, type);
    } else {
      alert(message);
    }
  }
};

module.exports = events;