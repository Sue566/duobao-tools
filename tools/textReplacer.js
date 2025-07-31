/**
 * 文本替换工具
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-exchange"></i> 文本替换工具</h2>
          <p class="tool-description">批量替换文本内容，支持普通文本和正则表达式替换。</p>
        </div>
        
        <div class="form-group">
          <label for="source-text">源文本</label>
          <textarea id="source-text" class="form-control" placeholder="请输入需要处理的文本..."></textarea>
        </div>
        
        <div class="form-group">
          <label>替换规则</label>
          <div id="rules-container">
            <div class="rule-item">
              <div class="rule-inputs">
                <input type="text" class="form-control search-text" placeholder="查找内容..." />
                <span class="rule-arrow"><i class="fa fa-arrow-right"></i></span>
                <input type="text" class="form-control replace-text" placeholder="替换为..." />
              </div>
              <div class="rule-options">
                <label><input type="checkbox" class="use-regex" /> 使用正则表达式</label>
                <label><input type="checkbox" class="case-sensitive" /> 区分大小写</label>
                <label><input type="checkbox" class="global-match" checked /> 全局替换</label>
              </div>
            </div>
          </div>
          <div class="rule-actions">
            <button id="add-rule" class="btn btn-sm"><i class="fa fa-plus"></i> 添加规则</button>
            <button id="clear-rules" class="btn btn-sm btn-secondary"><i class="fa fa-trash"></i> 清空规则</button>
          </div>
        </div>
        
        <div class="form-group">
          <div class="btn-group">
            <button id="replace-btn" class="btn btn-success"><i class="fa fa-exchange"></i> 替换</button>
            <button id="reset-btn" class="btn btn-secondary"><i class="fa fa-refresh"></i> 重置</button>
            <button id="copy-btn" class="btn"><i class="fa fa-copy"></i> 复制结果</button>
          </div>
        </div>
        
        <div class="form-group">
          <label for="result-text">替换结果</label>
          <textarea id="result-text" class="form-control" placeholder="替换后的文本将显示在这里..." readonly></textarea>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('textReplacer', container.querySelector('.tool-header'));
      
      // 获取元素
      const sourceText = container.querySelector('#source-text');
      const resultText = container.querySelector('#result-text');
      const rulesContainer = container.querySelector('#rules-container');
      const addRuleBtn = container.querySelector('#add-rule');
      const clearRulesBtn = container.querySelector('#clear-rules');
      const replaceBtn = container.querySelector('#replace-btn');
      const resetBtn = container.querySelector('#reset-btn');
      const copyBtn = container.querySelector('#copy-btn');
      
      // 添加规则
      addRuleBtn.addEventListener('click', () => {
        const ruleItem = document.createElement('div');
        ruleItem.className = 'rule-item';
        ruleItem.innerHTML = `
          <div class="rule-inputs">
            <input type="text" class="form-control search-text" placeholder="查找内容..." />
            <span class="rule-arrow"><i class="fa fa-arrow-right"></i></span>
            <input type="text" class="form-control replace-text" placeholder="替换为..." />
            <button class="remove-rule"><i class="fa fa-times"></i></button>
          </div>
          <div class="rule-options">
            <label><input type="checkbox" class="use-regex" /> 使用正则表达式</label>
            <label><input type="checkbox" class="case-sensitive" /> 区分大小写</label>
            <label><input type="checkbox" class="global-match" checked /> 全局替换</label>
          </div>
        `;
        rulesContainer.appendChild(ruleItem);
        
        // 添加删除规则事件
        ruleItem.querySelector('.remove-rule').addEventListener('click', () => {
          rulesContainer.removeChild(ruleItem);
        });
      });
      
      // 清空规则
      clearRulesBtn.addEventListener('click', () => {
        // 保留第一个规则，清空其输入
        const firstRule = rulesContainer.querySelector('.rule-item');
        if (firstRule) {
          firstRule.querySelector('.search-text').value = '';
          firstRule.querySelector('.replace-text').value = '';
          firstRule.querySelector('.use-regex').checked = false;
          firstRule.querySelector('.case-sensitive').checked = false;
          firstRule.querySelector('.global-match').checked = true;
        }
        
        // 移除其他规则
        const rules = rulesContainer.querySelectorAll('.rule-item');
        for (let i = 1; i < rules.length; i++) {
          rulesContainer.removeChild(rules[i]);
        }
      });
      
      // 执行替换
      replaceBtn.addEventListener('click', () => {
        const source = sourceText.value;
        let result = source;
        
        // 获取所有规则
        const rules = rulesContainer.querySelectorAll('.rule-item');
        
        // 应用每个规则
        rules.forEach(rule => {
          const searchText = rule.querySelector('.search-text').value;
          const replaceText = rule.querySelector('.replace-text').value;
          const useRegex = rule.querySelector('.use-regex').checked;
          const caseSensitive = rule.querySelector('.case-sensitive').checked;
          const globalMatch = rule.querySelector('.global-match').checked;
          
          if (searchText) {
            if (useRegex) {
              try {
                const flags = (globalMatch ? 'g' : '') + (!caseSensitive ? 'i' : '');
                const regex = new RegExp(searchText, flags);
                result = result.replace(regex, replaceText);
              } catch (e) {
                showToast('正则表达式错误: ' + e.message, 'error');
              }
            } else {
              // 普通文本替换
              if (globalMatch) {
                // 全局替换
                const flags = !caseSensitive ? 'gi' : 'g';
                const regex = new RegExp(escapeRegExp(searchText), flags);
                result = result.replace(regex, replaceText);
              } else {
                // 只替换第一个匹配项
                const flags = !caseSensitive ? 'i' : '';
                const regex = new RegExp(escapeRegExp(searchText), flags);
                result = result.replace(regex, replaceText);
              }
            }
          }
        });
        
        // 显示结果
        resultText.value = result;
        
        // 显示成功提示
        showToast('替换完成！', 'success');
      });
      
      // 重置
      resetBtn.addEventListener('click', () => {
        sourceText.value = '';
        resultText.value = '';
        clearRulesBtn.click();
      });
      
      // 复制结果
      copyBtn.addEventListener('click', () => {
        if (resultText.value) {
          window.copyToClipboard(resultText.value);
        } else {
          showToast('没有可复制的内容', 'warning');
        }
      });
      
      // 辅助函数：转义正则表达式特殊字符
      function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .rule-item {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 15px;
          margin-bottom: 10px;
        }
        
        .rule-inputs {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .rule-arrow {
          color: var(--text-muted);
        }
        
        .rule-options {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .rule-options label {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 0;
          cursor: pointer;
        }
        
        .rule-actions {
          margin-top: 10px;
          display: flex;
          gap: 10px;
        }
        
        .remove-rule {
          background-color: var(--danger-color);
          color: white;
          border: none;
          border-radius: 4px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      `;
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.textReplacer = tool;
})();