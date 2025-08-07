/**
 * 正则表达式测试工具 - 事件处理模块
 */
import { testRegex, updateReplaceResult, getReplacedText } from './core.js';
import { updateTextStats, getSavedRegexes, showToast, escapeHtml } from './utils.js';

/**
 * 设置事件监听器
 * @param {HTMLElement} container - 容器元素
 */
export function setupEventListeners(container) {
  // 获取元素
  const elements = {
    patternInput: container.querySelector('#regex-pattern'),
    flagsInput: container.querySelector('#regex-flags'),
    testString: container.querySelector('#regex-test-string'),
    replaceInput: container.querySelector('#regex-replace'),
    highlightMatches: container.querySelector('#highlight-matches'),
    lineNumbers: container.querySelector('#line-numbers'),
    autoUpdate: container.querySelector('#auto-update'),
    showReplaceCheckbox: container.querySelector('#show-replace'),
    testBtn: container.querySelector('#test-btn'),
    clearBtn: container.querySelector('#clear-btn'),
    copyRegexBtn: container.querySelector('#copy-regex-btn'),
    copyReplaceBtn: container.querySelector('#copy-replace-btn'),
    exportBtn: container.querySelector('#export-btn'),
    saveRegexBtn: container.querySelector('#save-regex'),
    loadRegexBtn: container.querySelector('#load-regex'),
    templatesBtn: container.querySelector('#templates-btn'),
    resultContainer: container.querySelector('#regex-result'),
    replaceResultContainer: container.querySelector('#regex-replace-result'),
    matchesContainer: container.querySelector('#regex-matches'),
    matchCount: container.querySelector('#match-count'),
    toggleCheatsheet: container.querySelector('#toggle-cheatsheet'),
    cheatsheetContent: container.querySelector('#cheatsheet-content'),
    tabButtons: container.querySelectorAll('.regex-tab'),
    tabContents: container.querySelectorAll('.regex-tab-content'),
    saveRegexDialog: container.querySelector('#save-regex-dialog'),
    loadRegexDialog: container.querySelector('#load-regex-dialog'),
    templatesDialog: container.querySelector('#templates-dialog'),
    saveRegexConfirmBtn: container.querySelector('#save-regex-confirm'),
    regexName: container.querySelector('#regex-name'),
    regexDescription: container.querySelector('#regex-description')
  };
  
  // 更新文本统计
  updateTextStats(container, elements.testString.value);
  
  // 初始测试
  testRegex(container, elements);
  
  // 测试按钮点击事件
  elements.testBtn.addEventListener('click', () => {
    testRegex(container, elements);
  });
  
  // 清空按钮点击事件
  elements.clearBtn.addEventListener('click', () => {
    elements.patternInput.value = '';
    elements.flagsInput.value = '';
    elements.testString.value = '';
    elements.replaceInput.value = '';
    elements.resultContainer.innerHTML = '';
    elements.replaceResultContainer.innerHTML = '';
    elements.matchesContainer.innerHTML = '';
    elements.matchCount.textContent = '0 个匹配';
    updateTextStats(container, '');
  });
  
  // 复制正则表达式按钮点击事件
  elements.copyRegexBtn.addEventListener('click', () => {
    const pattern = elements.patternInput.value;
    const flags = elements.flagsInput.value;
    
    if (!pattern) {
      showToast('没有可复制的正则表达式', 'warning');
      return;
    }
    
    // 复制为JavaScript格式
    const regexStr = `/${pattern}/${flags}`;
    window.copyToClipboard(regexStr);
    showToast('正则表达式已复制到剪贴板', 'success');
  });
  
  // 复制替换结果按钮点击事件
  elements.copyReplaceBtn.addEventListener('click', () => {
    const replaceResult = getReplacedText(
      elements.patternInput.value,
      elements.flagsInput.value,
      elements.testString.value,
      elements.replaceInput.value
    );
    
    if (!replaceResult) {
      showToast('没有可复制的替换结果', 'warning');
      return;
    }
    
    window.copyToClipboard(replaceResult);
    showToast('替换结果已复制到剪贴板', 'success');
  });
  
  // 导出正则表达式按钮点击事件
  elements.exportBtn.addEventListener('click', () => {
    const pattern = elements.patternInput.value;
    const flags = elements.flagsInput.value;
    const replaceValue = elements.replaceInput.value;
    
    if (!pattern) {
      showToast('没有可导出的正则表达式', 'warning');
      return;
    }
    
    const exportData = {
      pattern: pattern,
      flags: flags,
      replace: replaceValue,
      date: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'regex_' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('正则表达式已导出', 'success');
  });
  
  // 保存正则表达式按钮点击事件
  elements.saveRegexBtn.addEventListener('click', () => {
    const pattern = elements.patternInput.value;
    
    if (!pattern) {
      showToast('请先输入正则表达式', 'warning');
      return;
    }
    
    elements.saveRegexDialog.style.display = 'block';
    elements.regexName.focus();
  });
  
  // 确认保存正则表达式
  elements.saveRegexConfirmBtn.addEventListener('click', () => {
    const name = elements.regexName.value.trim();
    if (!name) {
      showToast('请输入名称', 'warning');
      return;
    }
    
    const savedRegexes = getSavedRegexes();
    
    savedRegexes[name] = {
      pattern: elements.patternInput.value,
      flags: elements.flagsInput.value,
      replace: elements.replaceInput.value,
      description: elements.regexDescription.value.trim(),
      date: new Date().toISOString()
    };
    
    localStorage.setItem('regexTester_savedRegexes', JSON.stringify(savedRegexes));
    elements.saveRegexDialog.style.display = 'none';
    showToast('正则表达式已保存', 'success');
    
    // 清空输入
    elements.regexName.value = '';
    elements.regexDescription.value = '';
  });
  
  // 加载正则表达式按钮点击事件
  elements.loadRegexBtn.addEventListener('click', () => {
    const savedRegexes = getSavedRegexes();
    const savedRegexList = container.querySelector('#saved-regex-list');
    
    if (Object.keys(savedRegexes).length === 0) {
      savedRegexList.innerHTML = '<div class="no-saved-regex">暂无保存的正则表达式</div>';
    } else {
      let html = '';
      
      for (const name in savedRegexes) {
        const regex = savedRegexes[name];
        const date = new Date(regex.date);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        html += `
          <div class="saved-regex-item" data-name="${name}">
            <div class="saved-regex-header">
              <div class="saved-regex-name">${name}</div>
              <div class="saved-regex-actions">
                <button class="btn-load-regex" title="加载"><i class="fa fa-check"></i></button>
                <button class="btn-delete-regex" title="删除"><i class="fa fa-trash"></i></button>
              </div>
            </div>
            <div class="saved-regex-pattern">${escapeHtml(regex.pattern)}</div>
            ${regex.description ? `<div class="saved-regex-description">${escapeHtml(regex.description)}</div>` : ''}
            <div class="saved-regex-meta">
              <span class="saved-regex-flags">${regex.flags ? `标志: ${escapeHtml(regex.flags)}` : ''}</span>
              <span class="saved-regex-date">保存于: ${formattedDate}</span>
            </div>
          </div>
        `;
      }
      
      savedRegexList.innerHTML = html;
      
      // 添加加载事件
      savedRegexList.querySelectorAll('.btn-load-regex').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const name = e.currentTarget.closest('.saved-regex-item').dataset.name;
          const regex = savedRegexes[name];
          
          elements.patternInput.value = regex.pattern;
          elements.flagsInput.value = regex.flags || '';
          elements.replaceInput.value = regex.replace || '';
          
          elements.loadRegexDialog.style.display = 'none';
          testRegex(container, elements);
        });
      });
      
      // 添加删除事件
      savedRegexList.querySelectorAll('.btn-delete-regex').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const name = e.currentTarget.closest('.saved-regex-item').dataset.name;
          
          if (confirm(`确定要删除正则表达式 "${name}" 吗？`)) {
            delete savedRegexes[name];
            localStorage.setItem('regexTester_savedRegexes', JSON.stringify(savedRegexes));
            e.currentTarget.closest('.saved-regex-item').remove();
            
            if (Object.keys(savedRegexes).length === 0) {
              savedRegexList.innerHTML = '<div class="no-saved-regex">暂无保存的正则表达式</div>';
            }
          }
        });
      });
    }
    
    elements.loadRegexDialog.style.display = 'block';
  });
  
  // 显示正则表达式模板
  elements.templatesBtn.addEventListener('click', () => {
    elements.templatesDialog.style.display = 'block';
  });
  
  // 选择模板
  container.querySelectorAll('.template-item').forEach(item => {
    item.addEventListener('click', () => {
      elements.patternInput.value = item.dataset.pattern;
      elements.flagsInput.value = item.dataset.flags || '';
      
      if (item.dataset.replace !== undefined) {
        elements.replaceInput.value = item.dataset.replace;
      }
      
      elements.templatesDialog.style.display = 'none';
      testRegex(container, elements);
    });
  });
  
  // 自动更新
  const autoUpdateHandler = () => {
    if (elements.autoUpdate.checked) {
      testRegex(container, elements);
    }
    updateTextStats(container, elements.testString.value);
  };
  
  elements.patternInput.addEventListener('input', autoUpdateHandler);
  elements.flagsInput.addEventListener('input', autoUpdateHandler);
  elements.testString.addEventListener('input', autoUpdateHandler);
  elements.replaceInput.addEventListener('input', autoUpdateHandler);
  elements.highlightMatches.addEventListener('change', autoUpdateHandler);
  elements.lineNumbers.addEventListener('change', autoUpdateHandler);
  
  // 显示替换结果复选框事件
  elements.showReplaceCheckbox.addEventListener('change', () => {
    if (elements.showReplaceCheckbox.checked) {
      elements.tabButtons.forEach(btn => {
        if (btn.dataset.tab === 'replace') {
          btn.click();
        }
      });
    } else {
      elements.tabButtons.forEach(btn => {
        if (btn.dataset.tab === 'match') {
          btn.click();
        }
      });
    }
    testRegex(container, elements);
  });
  
  // 切换速查表
  elements.toggleCheatsheet.addEventListener('click', () => {
    const isHidden = elements.cheatsheetContent.style.display === 'none';
    elements.cheatsheetContent.style.display = isHidden ? 'block' : 'none';
    elements.toggleCheatsheet.querySelector('i.fa').className = isHidden ? 'fa fa-chevron-up' : 'fa fa-chevron-down';
  });
  
  // 切换标签页
  elements.tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.tabButtons.forEach(b => b.classList.remove('active'));
      elements.tabContents.forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      
      if (btn.dataset.tab === 'replace' && !elements.replaceInput.value) {
        showToast('请输入替换文本', 'info');
      }
    });
  });
  
  // 关闭对话框按钮
  container.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      elements.saveRegexDialog.style.display = 'none';
      elements.loadRegexDialog.style.display = 'none';
      elements.templatesDialog.style.display = 'none';
    });
  });
}