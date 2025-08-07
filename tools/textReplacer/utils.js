/**
 * 文本替换工具 - 工具函数模块
 */

const utils = {
  // 转义正则表达式特殊字符
  escapeRegExp: function(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },
  
  // 更新文本统计信息
  updateTextStats: function(container) {
    const sourceText = container.querySelector('#source-text');
    const resultText = container.querySelector('#result-text');
    const sourceChars = container.querySelector('#source-chars');
    const sourceLines = container.querySelector('#source-lines');
    const resultChars = container.querySelector('#result-chars');
    const resultLines = container.querySelector('#result-lines');
    
    if (sourceText && sourceChars && sourceLines) {
      const source = sourceText.value;
      sourceChars.textContent = source.length;
      sourceLines.textContent = source ? (source.match(/\n/g) || []).length + 1 : 0;
    }
    
    if (resultText && resultChars && resultLines) {
      const result = resultText.value;
      resultChars.textContent = result.length;
      resultLines.textContent = result ? (result.match(/\n/g) || []).length + 1 : 0;
    }
  },
  
  // 更新规则标题
  updateRuleTitles: function(container) {
    const rules = container.querySelectorAll('.rule-item');
    rules.forEach((rule, index) => {
      const title = rule.querySelector('.rule-title');
      if (title) {
        title.textContent = `规则 ${index + 1}`;
      }
    });
    return rules.length;
  },
  
  // 获取规则数据
  getRulesData: function(container) {
    const rules = container.querySelectorAll('.rule-item');
    const rulesData = [];
    
    rules.forEach(rule => {
      const searchText = rule.querySelector('.search-text').value;
      const replaceText = rule.querySelector('.replace-text').value;
      const useRegex = rule.querySelector('.use-regex').checked;
      const caseSensitive = rule.querySelector('.case-sensitive').checked;
      const globalMatch = rule.querySelector('.global-match').checked;
      const multiline = rule.querySelector('.multiline').checked;
      
      rulesData.push({
        search: searchText,
        replace: replaceText,
        useRegex: useRegex,
        caseSensitive: caseSensitive,
        globalMatch: globalMatch,
        multiline: multiline
      });
    });
    
    return rulesData;
  },
  
  // 加载规则数据
  loadRulesData: function(container, rulesData) {
    // 清空现有规则
    const rulesContainer = container.querySelector('#rules-container');
    rulesContainer.innerHTML = '';
    
    // 添加新规则
    rulesData.forEach((rule, index) => {
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
            <input type="text" class="form-control search-text" placeholder="查找内容..." value="${rule.search || ''}" />
            <span class="rule-arrow"><i class="fa fa-arrow-right"></i></span>
            <input type="text" class="form-control replace-text" placeholder="替换为..." value="${rule.replace || ''}" />
          </div>
          <div class="rule-options">
            <label><input type="checkbox" class="use-regex" ${rule.useRegex ? 'checked' : ''} /> 使用正则表达式</label>
            <label><input type="checkbox" class="case-sensitive" ${rule.caseSensitive ? 'checked' : ''} /> 区分大小写</label>
            <label><input type="checkbox" class="global-match" ${rule.globalMatch ? 'checked' : ''} /> 全局替换</label>
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
    
    return rulesData.length;
  },
  
  // 获取保存的规则
  getSavedRules: function() {
    try {
      const savedRules = localStorage.getItem('textReplacer_savedRules');
      return savedRules ? JSON.parse(savedRules) : {};
    } catch (e) {
      console.error('获取保存的规则失败', e);
      return {};
    }
  }
};

// 将工具函数注册到全局
window.textReplacerUtils = utils;

module.exports = utils;