/**
 * 文本替换工具 - 规则管理模块
 */

const utils = require('./utils');

const rules = {
  // 保存规则
  saveRule: function(container, name, description) {
    const rules = utils.getRulesData(container);
    if (rules.length === 0 || (rules.length === 1 && !rules[0].search)) {
      return false;
    }
    
    const savedRules = utils.getSavedRules();
    
    savedRules[name] = {
      description: description,
      rules: rules,
      date: new Date().toISOString()
    };
    
    localStorage.setItem('textReplacer_savedRules', JSON.stringify(savedRules));
    return true;
  },
  
  // 加载规则
  loadRule: function(container, ruleName) {
    const savedRules = utils.getSavedRules();
    if (!savedRules[ruleName]) {
      return false;
    }
    
    const ruleData = savedRules[ruleName];
    const ruleCounter = utils.loadRulesData(container, ruleData.rules);
    return ruleCounter;
  },
  
  // 删除规则
  deleteRule: function(ruleName) {
    const savedRules = utils.getSavedRules();
    if (!savedRules[ruleName]) {
      return false;
    }
    
    delete savedRules[ruleName];
    localStorage.setItem('textReplacer_savedRules', JSON.stringify(savedRules));
    return true;
  },
  
  // 导出规则
  exportRules: function(container) {
    const rules = utils.getRulesData(container);
    if (rules.length === 0 || (rules.length === 1 && !rules[0].search)) {
      return null;
    }
    
    const exportData = {
      name: '文本替换规则',
      description: '导出于 ' + new Date().toLocaleString(),
      rules: rules,
      version: '1.0'
    };
    
    return JSON.stringify(exportData, null, 2);
  },
  
  // 导入规则
  importRules: function(container, jsonData) {
    try {
      const data = JSON.parse(jsonData);
      if (data && data.rules && Array.isArray(data.rules)) {
        const ruleCounter = utils.loadRulesData(container, data.rules);
        return ruleCounter;
      }
      return false;
    } catch (e) {
      console.error('导入规则失败', e);
      return false;
    }
  },
  
  // 应用规则进行替换
  applyRules: function(container) {
    const sourceText = container.querySelector('#source-text').value;
    if (!sourceText) {
      return { result: '', changes: 0 };
    }
    
    let result = sourceText;
    let totalChanges = 0;
    
    // 获取所有规则
    const ruleElements = container.querySelectorAll('.rule-item');
    
    // 应用每个规则
    ruleElements.forEach(rule => {
      const searchText = rule.querySelector('.search-text').value;
      const replaceText = rule.querySelector('.replace-text').value;
      const useRegex = rule.querySelector('.use-regex').checked;
      const caseSensitive = rule.querySelector('.case-sensitive').checked;
      const globalMatch = rule.querySelector('.global-match').checked;
      const multiline = rule.querySelector('.multiline').checked;
      
      if (searchText) {
        try {
          let regex;
          let originalResult = result;
          
          if (useRegex) {
            const flags = (globalMatch ? 'g' : '') + (!caseSensitive ? 'i' : '') + (multiline ? 'm' : '');
            regex = new RegExp(searchText, flags);
            result = result.replace(regex, replaceText);
          } else {
            // 普通文本替换
            if (globalMatch) {
              // 全局替换
              const flags = (!caseSensitive ? 'gi' : 'g') + (multiline ? 'm' : '');
              regex = new RegExp(utils.escapeRegExp(searchText), flags);
              result = result.replace(regex, replaceText);
            } else {
              // 只替换第一个匹配项
              const flags = (!caseSensitive ? 'i' : '') + (multiline ? 'm' : '');
              regex = new RegExp(utils.escapeRegExp(searchText), flags);
              result = result.replace(regex, replaceText);
            }
          }
          
          // 计算更改数量
          if (globalMatch) {
            const matches = originalResult.match(regex);
            if (matches) {
              totalChanges += matches.length;
            }
          } else if (regex.test(originalResult)) {
            totalChanges += 1;
          }
        } catch (e) {
          console.error('正则表达式错误', e);
        }
      }
    });
    
    return { result, changes: totalChanges };
  },
  
  // 测试规则
  testRules: function(container) {
    const source = container.querySelector('#source-text').value;
    if (!source) {
      return null;
    }
    
    // 获取所有规则
    const rules = container.querySelectorAll('.rule-item');
    let highlightedText = source;
    let matchCount = 0;
    
    // 应用每个规则进行高亮
    const highlights = [];
    rules.forEach((rule, index) => {
      const searchText = rule.querySelector('.search-text').value;
      const useRegex = rule.querySelector('.use-regex').checked;
      const caseSensitive = rule.querySelector('.case-sensitive').checked;
      const globalMatch = rule.querySelector('.global-match').checked;
      const multiline = rule.querySelector('.multiline').checked;
      
      if (searchText) {
        try {
          let regex;
          if (useRegex) {
            const flags = (globalMatch ? 'g' : '') + (!caseSensitive ? 'i' : '') + (multiline ? 'm' : '');
            regex = new RegExp(searchText, flags);
          } else {
            const flags = (globalMatch ? 'g' : '') + (!caseSensitive ? 'i' : '');
            regex = new RegExp(utils.escapeRegExp(searchText), flags);
          }
          
          // 计算匹配数量
          const matches = source.match(regex);
          const currentMatchCount = matches ? matches.length : 0;
          matchCount += currentMatchCount;
          
          // 保存高亮信息
          highlights.push({
            regex: regex,
            highlightClass: `highlight-${index % 5}`
          });
        } catch (e) {
          console.error('正则表达式错误', e);
        }
      }
    });
    
    // 应用高亮
    let lastIndex = 0;
    const parts = [];
    const text = source;
    
    // 查找所有匹配
    const allMatches = [];
    highlights.forEach(highlight => {
      let match;
      const regex = new RegExp(highlight.regex.source, highlight.regex.flags);
      while ((match = regex.exec(text)) !== null) {
        allMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
          highlightClass: highlight.highlightClass
        });
        
        if (!highlight.regex.global) break;
      }
    });
    
    // 按开始位置排序
    allMatches.sort((a, b) => a.start - b.start);
    
    // 合并重叠的匹配
    const mergedMatches = [];
    for (const match of allMatches) {
      if (mergedMatches.length === 0) {
        mergedMatches.push(match);
        continue;
      }
      
      const lastMatch = mergedMatches[mergedMatches.length - 1];
      if (match.start <= lastMatch.end) {
        // 重叠，合并
        lastMatch.end = Math.max(lastMatch.end, match.end);
        lastMatch.text = text.substring(lastMatch.start, lastMatch.end);
      } else {
        mergedMatches.push(match);
      }
    }
    
    // 构建高亮文本
    for (const match of mergedMatches) {
      if (match.start > lastIndex) {
        parts.push(text.substring(lastIndex, match.start));
      }
      parts.push(`<mark class="${match.highlightClass}">${match.text}</mark>`);
      lastIndex = match.end;
    }
    
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return {
      highlightedText: parts.join(''),
      matchCount: matchCount
    };
  }
};

module.exports = rules;