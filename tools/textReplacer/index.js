/**
 * 文本替换工具 - 入口文件
 * 增强版：支持批量替换、正则表达式、替换规则保存与导入导出
 */

// 定义工具
(function() {
  // 工具配置
  const config = {
    // 默认配置
    defaultRules: [
      {
        search: '',
        replace: '',
        useRegex: false,
        caseSensitive: false,
        globalMatch: true,
        multiline: false
      }
    ],
    maxHistoryItems: 10
  };
  
  // 工具模块
  const tool = {
    // 工具初始化
    init: function() {
      console.log('文本替换工具初始化');
    },
    
    // 渲染工具界面
    render: function(container) {
      // 加载HTML模板
      this.loadTemplate(container)
        .then(() => {
          // 加载CSS样式
          return this.loadStyles();
        })
        .then(() => {
          // 确保工具函数已加载
          return this.loadUtils();
        })
        .then(() => {
          // 添加收藏按钮
          if (typeof window.addFavoriteButton === 'function') {
            const header = container.querySelector('.tool-header');
            window.addFavoriteButton('textReplacer', header);
          }
          
          // 初始化事件
          this.setupEvents(container);
          
          // 初始化文本统计
          if (window.textReplacerUtils && window.textReplacerUtils.updateTextStats) {
            window.textReplacerUtils.updateTextStats(container);
          } else {
            console.error('textReplacerUtils 未正确加载');
          }
        })
        .catch(error => {
          console.error('加载文本替换工具失败:', error);
          container.innerHTML = '<div class="tool-error">加载工具失败，请刷新页面重试。</div>';
        });
    },
    
    // 加载HTML模板
    loadTemplate: function(container) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'tools/textReplacer/template.html', true);
        xhr.onload = function() {
          if (xhr.status === 200) {
            container.innerHTML = xhr.responseText;
            resolve();
          } else {
            reject(new Error('无法加载HTML模板'));
          }
        };
        xhr.onerror = function() {
          reject(new Error('加载HTML模板时发生错误'));
        };
        xhr.send();
      });
    },
    
    // 加载CSS样式
    loadStyles: function() {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'tools/textReplacer/styles.css';
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });
    },
    
    // 加载工具函数
    loadUtils: function() {
      return new Promise((resolve, reject) => {
        // 检查是否已经加载
        if (window.textReplacerUtils) {
          resolve();
          return;
        }
        
        // 动态加载utils.js
        const script = document.createElement('script');
        script.src = 'tools/textReplacer/utils.js';
        script.onload = function() {
          if (window.textReplacerUtils) {
            resolve();
          } else {
            reject(new Error('textReplacerUtils 未正确定义'));
          }
        };
        script.onerror = function() {
          reject(new Error('无法加载 textReplacer/utils.js'));
        };
        document.head.appendChild(script);
      });
    },
    
    // 设置事件处理
    setupEvents: function(container) {
      
      // 源文本输入事件
      const sourceText = container.querySelector('#source-text');
      if (sourceText) {
        sourceText.addEventListener('input', () => {
          window.textReplacerUtils.updateTextStats(container);
        });
      }
      
      // 结果文本输入事件
      const resultText = container.querySelector('#result-text');
      if (resultText) {
        resultText.addEventListener('input', () => {
          window.textReplacerUtils.updateTextStats(container);
        });
      }
      
      // 替换按钮点击事件
      const replaceBtn = container.querySelector('#replace-btn');
      if (replaceBtn) {
        replaceBtn.addEventListener('click', () => {
          this.performReplace(container);
        });
      }
      
      // 添加规则按钮点击事件
      const addRuleBtn = container.querySelector('#add-rule-btn');
      if (addRuleBtn) {
        addRuleBtn.addEventListener('click', () => {
          this.addRule(container);
        });
      }
      
      // 清空按钮点击事件
      const clearBtn = container.querySelector('#clear-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (sourceText) sourceText.value = '';
          if (resultText) resultText.value = '';
          if (window.textReplacerUtils && window.textReplacerUtils.updateTextStats) {
            window.textReplacerUtils.updateTextStats(container);
          }
        });
      }
      
      // 复制结果按钮点击事件
      const copyBtn = container.querySelector('#copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          if (resultText) {
            resultText.select();
            document.execCommand('copy');
            
            // 显示复制成功提示
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa fa-check"></i> 已复制';
            setTimeout(() => {
              copyBtn.innerHTML = originalText;
            }, 2000);
          }
        });
      }
      
      // 交换按钮点击事件
      const swapBtn = container.querySelector('#swap-btn');
      if (swapBtn) {
        swapBtn.addEventListener('click', () => {
          if (sourceText && resultText) {
            const temp = sourceText.value;
            sourceText.value = resultText.value;
            resultText.value = temp;
            if (window.textReplacerUtils && window.textReplacerUtils.updateTextStats) {
              window.textReplacerUtils.updateTextStats(container);
            }
          }
        });
      }
      
      // 保存规则按钮点击事件
      const saveRulesBtn = container.querySelector('#save-rules-btn');
      if (saveRulesBtn) {
        saveRulesBtn.addEventListener('click', () => {
          this.saveRules(container);
        });
      }
      
      // 加载规则按钮点击事件
      const loadRulesBtn = container.querySelector('#load-rules-btn');
      if (loadRulesBtn) {
        loadRulesBtn.addEventListener('click', () => {
          this.loadRules(container);
        });
      }
    },
    
    // 更新文本统计信息 - 使用 window.textReplacerUtils 中的方法
    updateTextStats: function(container) {
      window.textReplacerUtils.updateTextStats(container);
    },
    
    // 执行替换操作
    performReplace: function(container) {
      const sourceText = container.querySelector('#source-text');
      const resultText = container.querySelector('#result-text');
      
      if (!sourceText || !resultText) return;
      
      let text = sourceText.value;
      const rules = window.textReplacerUtils.getRulesData(container);
      
      // 应用每条规则
      rules.forEach(rule => {
        if (!rule.search) return;
        
        let searchValue;
        let flags = '';
        
        if (rule.useRegex) {
          // 设置正则表达式标志
          if (!rule.caseSensitive) flags += 'i';
          if (rule.globalMatch) flags += 'g';
          if (rule.multiline) flags += 'm';
          
          try {
            searchValue = new RegExp(rule.search, flags);
          } catch (e) {
            console.error('正则表达式错误:', e);
            return;
          }
        } else {
          // 普通文本替换
          searchValue = rule.caseSensitive ? rule.search : new RegExp(window.textReplacerUtils.escapeRegExp(rule.search), 'gi');
        }
        
        // 执行替换
        text = text.replace(searchValue, rule.replace);
      });
      
      // 更新结果
      resultText.value = text;
      if (window.textReplacerUtils && window.textReplacerUtils.updateTextStats) {
        window.textReplacerUtils.updateTextStats(container);
      }
      
      // 添加到历史记录
      this.addToHistory(container, sourceText.value, text, rules);
    },
    
    // 添加规则
    addRule: function(container) {
      const rulesContainer = container.querySelector('#rules-container');
      if (!rulesContainer) return;
      
      const ruleCount = window.textReplacerUtils.updateRuleTitles(container);
      
      const ruleItem = document.createElement('div');
      ruleItem.className = 'rule-item';
      ruleItem.innerHTML = `
        <div class="rule-header">
          <span class="rule-title">规则 ${ruleCount + 1}</span>
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
      ruleItem.querySelector('.btn-rule-delete').addEventListener('click', () => {
        rulesContainer.removeChild(ruleItem);
        window.textReplacerUtils.updateRuleTitles(container);
      });
    },
    
    // 更新规则标题 - 使用 window.textReplacerUtils 中的方法
    updateRuleTitles: function(container) {
      return window.textReplacerUtils.updateRuleTitles(container);
    },
    
    // 获取规则数据 - 使用 window.textReplacerUtils 中的方法
    getRulesData: function(container) {
      return window.textReplacerUtils.getRulesData(container);
    },
    
    // 保存规则
    saveRules: function(container) {
      const rulesData = window.textReplacerUtils.getRulesData(container);
      if (rulesData.length === 0) return;
      
      const ruleName = prompt('请输入规则集名称:', '我的规则集');
      if (!ruleName) return;
      
      try {
        // 获取已保存的规则
        const savedRules = window.textReplacerUtils.getSavedRules();
        
        // 添加新规则集
        savedRules[ruleName] = rulesData;
        
        // 保存到本地存储
        localStorage.setItem('textReplacer_savedRules', JSON.stringify(savedRules));
        
        alert(`规则集 "${ruleName}" 已保存`);
      } catch (e) {
        console.error('保存规则失败', e);
        alert('保存规则失败，请重试');
      }
    },
    
    // 加载规则
    loadRules: function(container) {
      try {
        // 获取已保存的规则
        const savedRules = window.textReplacerUtils.getSavedRules();
        const ruleNames = Object.keys(savedRules);
        
        if (ruleNames.length === 0) {
          alert('没有找到已保存的规则集');
          return;
        }
        
        // 创建选择列表
        const selectList = document.createElement('select');
        selectList.id = 'rule-select';
        selectList.className = 'form-control';
        
        ruleNames.forEach(name => {
          const option = document.createElement('option');
          option.value = name;
          option.textContent = name;
          selectList.appendChild(option);
        });
        
        // 创建对话框
        const dialog = document.createElement('div');
        dialog.className = 'modal-dialog';
        dialog.innerHTML = `
          <div class="modal-content">
            <div class="modal-header">
              <h3>加载规则集</h3>
              <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              <p>请选择要加载的规则集:</p>
              <div id="select-container"></div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-cancel">取消</button>
              <button class="btn btn-load">加载</button>
              <button class="btn btn-delete">删除</button>
            </div>
          </div>
        `;
        
        // 添加对话框到页面
        document.body.appendChild(dialog);
        document.getElementById('select-container').appendChild(selectList);
        
        // 关闭按钮事件
        dialog.querySelector('.close-btn').addEventListener('click', () => {
          document.body.removeChild(dialog);
        });
        
        // 取消按钮事件
        dialog.querySelector('.btn-cancel').addEventListener('click', () => {
          document.body.removeChild(dialog);
        });
        
        // 加载按钮事件
        dialog.querySelector('.btn-load').addEventListener('click', () => {
          const selectedName = selectList.value;
          const selectedRules = savedRules[selectedName];
          
          if (selectedRules) {
            this.loadRulesData(container, selectedRules);
          }
          
          document.body.removeChild(dialog);
        });
        
        // 删除按钮事件
        dialog.querySelector('.btn-delete').addEventListener('click', () => {
          const selectedName = selectList.value;
          
          if (confirm(`确定要删除规则集 "${selectedName}" 吗?`)) {
            delete savedRules[selectedName];
            localStorage.setItem('textReplacer_savedRules', JSON.stringify(savedRules));
            
            // 从选择列表中移除
            selectList.remove(selectList.selectedIndex);
            
            if (selectList.options.length === 0) {
              document.body.removeChild(dialog);
              alert('没有更多规则集');
            }
          }
        });
      } catch (e) {
        console.error('加载规则失败', e);
        alert('加载规则失败，请重试');
      }
    },
    
    // 加载规则数据
    loadRulesData: function(container, rulesData) {
      return window.textReplacerUtils.loadRulesData(container, rulesData);
    },
    
    // 添加到历史记录
    addToHistory: function(container, sourceText, resultText, rules) {
      // 历史记录功能实现
      console.log('添加到历史记录', { sourceText, resultText, rules });
    },
    
    // 获取保存的规则 - 使用 window.textReplacerUtils 中的方法
    getSavedRules: function() {
      return window.textReplacerUtils.getSavedRules();
    },
    
    // 转义正则表达式特殊字符 - 使用 window.textReplacerUtils 中的方法
    escapeRegExp: function(string) {
      return window.textReplacerUtils.escapeRegExp(string);
    }
  };
  
  // 注册工具
  window.tools = window.tools || {};
  window.tools.textReplacer = tool;
})();