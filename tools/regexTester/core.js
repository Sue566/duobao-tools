/**
 * 正则表达式测试工具 - 核心功能模块
 */
import { escapeHtml } from './utils.js';

/**
 * 测试正则表达式
 * @param {HTMLElement} container - 容器元素
 * @param {Object} elements - UI元素对象
 */
export function testRegex(container, elements) {
  const {
    patternInput,
    flagsInput,
    testString,
    replaceInput,
    highlightMatches,
    lineNumbers,
    resultContainer,
    replaceResultContainer,
    matchesContainer,
    matchCount
  } = elements;
  
  const pattern = patternInput.value;
  const flags = flagsInput.value;
  const text = testString.value;
  
  if (!pattern) {
    resultContainer.innerHTML = '<div class="regex-error">请输入正则表达式</div>';
    matchesContainer.innerHTML = '';
    matchCount.textContent = '0 个匹配';
    return;
  }
  
  try {
    const regex = new RegExp(pattern, flags);
    
    // 更新替换结果
    updateReplaceResult(container, elements);
    
    // 高亮匹配结果
    if (highlightMatches.checked) {
      let html = '';
      const lines = text.split('\n');
      
      if (lineNumbers.checked) {
        html += '<div class="line-numbers">';
        for (let i = 0; i < lines.length; i++) {
          html += `<div class="line-number">${i + 1}</div>`;
        }
        html += '</div>';
      }
      
      html += '<div class="text-content">';
      
      if (flags.includes('g')) {
        // 全局匹配
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          let lastIndex = 0;
          let lineHtml = '';
          let match;
          
          const lineRegex = new RegExp(pattern, flags);
          while ((match = lineRegex.exec(line)) !== null) {
            // 添加匹配前的文本
            lineHtml += escapeHtml(line.substring(lastIndex, match.index));
            // 添加匹配的文本
            lineHtml += `<span class="match">${escapeHtml(match[0])}</span>`;
            lastIndex = lineRegex.lastIndex;
            
            // 防止无限循环
            if (match[0].length === 0) {
              lineRegex.lastIndex++;
            }
          }
          
          // 添加剩余的文本
          lineHtml += escapeHtml(line.substring(lastIndex));
          html += `<div class="line">${lineHtml || '&nbsp;'}</div>`;
        }
      } else {
        // 非全局匹配
        const match = text.match(regex);
        if (match) {
          const index = match.index;
          const matchedText = match[0];
          
          // 找到匹配所在的行
          let lineStart = 0;
          let lineIndex = 0;
          
          for (let i = 0; i < index; i++) {
            if (text[i] === '\n') {
              lineStart = i + 1;
              lineIndex++;
            }
          }
          
          // 处理每一行
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (i === lineIndex) {
              // 匹配所在行
              const posInLine = index - lineStart;
              const beforeMatch = line.substring(0, posInLine);
              const afterMatch = line.substring(posInLine + matchedText.length);
              html += `<div class="line">${escapeHtml(beforeMatch)}<span class="match">${escapeHtml(matchedText)}</span>${escapeHtml(afterMatch)}</div>`;
            } else {
              html += `<div class="line">${escapeHtml(line) || '&nbsp;'}</div>`;
            }
          }
        } else {
          // 没有匹配
          for (let i = 0; i < lines.length; i++) {
            html += `<div class="line">${escapeHtml(lines[i]) || '&nbsp;'}</div>`;
          }
        }
      }
      
      html += '</div>';
      resultContainer.innerHTML = html;
    } else {
      // 不高亮，只显示原始文本
      let html = '';
      const lines = text.split('\n');
      
      if (lineNumbers.checked) {
        html += '<div class="line-numbers">';
        for (let i = 0; i < lines.length; i++) {
          html += `<div class="line-number">${i + 1}</div>`;
        }
        html += '</div>';
      }
      
      html += '<div class="text-content">';
      for (let i = 0; i < lines.length; i++) {
        html += `<div class="line">${escapeHtml(lines[i]) || '&nbsp;'}</div>`;
      }
      html += '</div>';
      
      resultContainer.innerHTML = html;
    }
    
    // 显示匹配详情
    let matches = [];
    if (flags.includes('g')) {
      let match;
      const globalRegex = new RegExp(pattern, flags);
      while ((match = globalRegex.exec(text)) !== null) {
        matches.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1)
        });
        
        // 防止无限循环
        if (match[0].length === 0) {
          globalRegex.lastIndex++;
        }
      }
    } else {
      const match = text.match(regex);
      if (match) {
        matches.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1)
        });
      }
    }
    
    // 更新匹配计数
    matchCount.textContent = `${matches.length} 个匹配`;
    
    // 显示匹配详情
    if (matches.length > 0) {
      let matchesHtml = '';
      
      matches.forEach((match, i) => {
        const hasGroups = match.groups.length > 0;
        
        matchesHtml += `
          <div class="match-item">
            <div class="match-header">
              <span class="match-number">#${i + 1}</span>
              <span class="match-text">${escapeHtml(match.text)}</span>
              <span class="match-index">位置: ${match.index}</span>
            </div>
            ${hasGroups ? `
              <div class="match-groups">
                <div class="match-groups-header">捕获组:</div>
                <div class="match-groups-content">
                  ${match.groups.map((group, j) => `
                    <div class="match-group">
                      <span class="match-group-number">$${j + 1}:</span>
                      <span class="match-group-text">${escapeHtml(group || '')}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      });
      
      matchesContainer.innerHTML = matchesHtml;
    } else {
      matchesContainer.innerHTML = '<div class="no-matches">没有找到匹配项</div>';
    }
  } catch (e) {
    resultContainer.innerHTML = `<div class="regex-error">正则表达式错误: ${e.message}</div>`;
    matchesContainer.innerHTML = '';
    matchCount.textContent = '0 个匹配';
  }
}

/**
 * 获取替换后的文本
 * @param {string} pattern - 正则表达式模式
 * @param {string} flags - 正则表达式标志
 * @param {string} text - 测试文本
 * @param {string} replaceValue - 替换值
 * @returns {string} 替换后的文本
 */
export function getReplacedText(pattern, flags, text, replaceValue) {
  if (!pattern || !text) {
    return '';
  }
  
  try {
    const regex = new RegExp(pattern, flags);
    return text.replace(regex, replaceValue);
  } catch (e) {
    console.error('替换错误:', e);
    return '';
  }
}

/**
 * 更新替换结果
 * @param {HTMLElement} container - 容器元素
 * @param {Object} elements - UI元素对象
 */
export function updateReplaceResult(container, elements) {
  const {
    patternInput,
    flagsInput,
    testString,
    replaceInput,
    lineNumbers,
    replaceResultContainer
  } = elements;
  
  const replacedText = getReplacedText(
    patternInput.value,
    flagsInput.value,
    testString.value,
    replaceInput.value
  );
  
  let html = '';
  const lines = replacedText.split('\n');
  
  if (lineNumbers.checked) {
    html += '<div class="line-numbers">';
    for (let i = 0; i < lines.length; i++) {
      html += `<div class="line-number">${i + 1}</div>`;
    }
    html += '</div>';
  }
  
  html += '<div class="text-content">';
  for (let i = 0; i < lines.length; i++) {
    html += `<div class="line">${escapeHtml(lines[i]) || '&nbsp;'}</div>`;
  }
  html += '</div>';
  
  replaceResultContainer.innerHTML = html;
}