/**
 * 大小写转换工具 - 转换功能
 */

window.caseConverterCore = {
  /**
   * 初始化转换功能
   * @param {HTMLElement} container - 容器元素
   */
  init: function(container) {
    this.container = container;
    this.utils = window.caseConverterUtils;
    this.history = window.caseConverterHistory;
    
    this.setupReferences();
    this.setupEvents();
  },
  
  /**
   * 设置DOM引用
   */
  setupReferences: function() {
    // 输入输出元素
    this.inputTextarea = this.container.querySelector('#case-input');
    this.outputTextarea = this.container.querySelector('#case-output');
    
    // 统计信息元素
    this.charCount = this.container.querySelector('#char-count');
    this.wordCount = this.container.querySelector('#word-count');
    this.lineCount = this.container.querySelector('#line-count');
    this.outputCharCount = this.container.querySelector('#output-char-count');
    this.outputWordCount = this.container.querySelector('#output-word-count');
    this.outputLineCount = this.container.querySelector('#output-line-count');
    
    // 基本转换按钮
    this.toUpperBtn = this.container.querySelector('#to-upper');
    this.toLowerBtn = this.container.querySelector('#to-lower');
    this.toTitleBtn = this.container.querySelector('#to-title');
    this.toSentenceBtn = this.container.querySelector('#to-sentence');
    this.toToggleBtn = this.container.querySelector('#to-toggle');
    
    // 编程风格按钮
    this.toCamelBtn = this.container.querySelector('#to-camel');
    this.toPascalBtn = this.container.querySelector('#to-pascal');
    this.toSnakeBtn = this.container.querySelector('#to-snake');
    this.toKebabBtn = this.container.querySelector('#to-kebab');
    this.toConstantBtn = this.container.querySelector('#to-constant');
    
    // 特殊处理按钮
    this.removeSpacesBtn = this.container.querySelector('#remove-spaces');
    this.trimLinesBtn = this.container.querySelector('#trim-lines');
    this.removeEmptyLinesBtn = this.container.querySelector('#remove-empty-lines');
    this.addLineNumbersBtn = this.container.querySelector('#add-line-numbers');
    this.sortLinesBtn = this.container.querySelector('#sort-lines');
    
    // 操作按钮
    this.clearInputBtn = this.container.querySelector('#clear-input');
    this.pasteInputBtn = this.container.querySelector('#paste-input');
    this.copyOutputBtn = this.container.querySelector('#copy-output');
    this.saveOutputBtn = this.container.querySelector('#save-output');
  },
  
  /**
   * 设置事件处理
   */
  setupEvents: function() {
    // 输入文本事件
    if (this.inputTextarea) {
      this.inputTextarea.addEventListener('input', () => {
        if (this.utils && typeof this.utils.updateTextStats === 'function') {
          this.utils.updateTextStats(
            this.inputTextarea, 
            this.charCount, 
            this.wordCount, 
            this.lineCount
          );
        }
      });
    }
    
    // 基本转换按钮事件
    if (this.toUpperBtn) {
      this.toUpperBtn.addEventListener('click', () => {
        this.transformText(text => text.toUpperCase(), '转大写');
      });
    }
    
    if (this.toLowerBtn) {
      this.toLowerBtn.addEventListener('click', () => {
        this.transformText(text => text.toLowerCase(), '转小写');
      });
    }
    
    if (this.toTitleBtn) {
      this.toTitleBtn.addEventListener('click', () => {
        this.transformText(this.toTitleCase.bind(this), '首字母大写');
      });
    }
    
    if (this.toSentenceBtn) {
      this.toSentenceBtn.addEventListener('click', () => {
        this.transformText(this.toSentenceCase.bind(this), '句首大写');
      });
    }
    
    if (this.toToggleBtn) {
      this.toToggleBtn.addEventListener('click', () => {
        this.transformText(this.toggleCase.bind(this), '大小写互换');
      });
    }
    
    // 编程风格按钮事件
    if (this.toCamelBtn) {
      this.toCamelBtn.addEventListener('click', () => {
        this.transformText(this.toCamelCase.bind(this), '驼峰命名');
      });
    }
    
    if (this.toPascalBtn) {
      this.toPascalBtn.addEventListener('click', () => {
        this.transformText(this.toPascalCase.bind(this), '帕斯卡命名');
      });
    }
    
    if (this.toSnakeBtn) {
      this.toSnakeBtn.addEventListener('click', () => {
        this.transformText(this.toSnakeCase.bind(this), '蛇形命名');
      });
    }
    
    if (this.toKebabBtn) {
      this.toKebabBtn.addEventListener('click', () => {
        this.transformText(this.toKebabCase.bind(this), '短横线命名');
      });
    }
    
    if (this.toConstantBtn) {
      this.toConstantBtn.addEventListener('click', () => {
        this.transformText(this.toConstantCase.bind(this), '常量命名');
      });
    }
    
    // 特殊处理按钮事件
    if (this.removeSpacesBtn) {
      this.removeSpacesBtn.addEventListener('click', () => {
        this.transformText(this.removeAllSpaces.bind(this), '移除空格');
      });
    }
    
    if (this.trimLinesBtn) {
      this.trimLinesBtn.addEventListener('click', () => {
        this.transformText(this.trimLines.bind(this), '修剪行首尾空格');
      });
    }
    
    if (this.removeEmptyLinesBtn) {
      this.removeEmptyLinesBtn.addEventListener('click', () => {
        this.transformText(this.removeEmptyLines.bind(this), '移除空行');
      });
    }
    
    if (this.addLineNumbersBtn) {
      this.addLineNumbersBtn.addEventListener('click', () => {
        this.transformText(this.addLineNumbers.bind(this), '添加行号');
      });
    }
    
    if (this.sortLinesBtn) {
      this.sortLinesBtn.addEventListener('click', () => {
        this.transformText(this.sortLines.bind(this), '行排序');
      });
    }
    
    // 操作按钮事件
    if (this.clearInputBtn) {
      this.clearInputBtn.addEventListener('click', () => {
        if (this.inputTextarea) {
          this.inputTextarea.value = '';
          if (this.utils && typeof this.utils.updateTextStats === 'function') {
            this.utils.updateTextStats(
              this.inputTextarea, 
              this.charCount, 
              this.wordCount, 
              this.lineCount
            );
          }
        }
      });
    }
    
    if (this.pasteInputBtn) {
      this.pasteInputBtn.addEventListener('click', async () => {
        try {
          const text = await navigator.clipboard.readText();
          if (this.inputTextarea) {
            this.inputTextarea.value = text;
            if (this.utils && typeof this.utils.updateTextStats === 'function') {
              this.utils.updateTextStats(
                this.inputTextarea, 
                this.charCount, 
                this.wordCount, 
                this.lineCount
              );
            }
          }
        } catch (error) {
          if (this.utils && typeof this.utils.showToast === 'function') {
            this.utils.showToast('无法访问剪贴板', 'error');
          } else {
            console.error('无法访问剪贴板:', error);
          }
        }
      });
    }
    
    if (this.copyOutputBtn) {
      this.copyOutputBtn.addEventListener('click', () => {
        if (this.outputTextarea) {
          const outputText = this.outputTextarea.value;
          
          if (!outputText) {
            if (this.utils && typeof this.utils.showToast === 'function') {
              this.utils.showToast('没有可复制的内容', 'warning');
            }
            return;
          }
          
          if (this.utils && typeof this.utils.copyToClipboard === 'function') {
            this.utils.copyToClipboard(outputText);
          } else {
            navigator.clipboard.writeText(outputText)
              .then(() => {
                console.log('已复制到剪贴板');
              })
              .catch(err => {
                console.error('复制失败:', err);
              });
          }
        }
      });
    }
    
    if (this.saveOutputBtn) {
      this.saveOutputBtn.addEventListener('click', () => {
        if (this.outputTextarea) {
          const outputText = this.outputTextarea.value;
          
          if (!outputText) {
            if (this.utils && typeof this.utils.showToast === 'function') {
              this.utils.showToast('没有可保存的内容', 'warning');
            }
            return;
          }
          
          if (this.utils && typeof this.utils.saveToFile === 'function') {
            this.utils.saveToFile(outputText, 'text_conversion.txt');
          }
        }
      });
    }
  },
  
  /**
   * 转换文本并更新输出
   * @param {Function} transformFn - 转换函数
   * @param {string} operationName - 操作名称
   */
  transformText: function(transformFn, operationName) {
    if (!this.inputTextarea || !this.outputTextarea) {
      return;
    }
    
    const inputText = this.inputTextarea.value;
    
    if (!inputText) {
      if (this.utils && typeof this.utils.showToast === 'function') {
        this.utils.showToast('请先输入文本', 'warning');
      }
      return;
    }
    
    try {
      const result = transformFn(inputText);
      this.outputTextarea.value = result;
      
      if (this.utils && typeof this.utils.updateTextStats === 'function') {
        this.utils.updateTextStats(
          this.outputTextarea, 
          this.outputCharCount, 
          this.outputWordCount, 
          this.outputLineCount
        );
      }
      
      // 保存到历史记录
      if (this.history && typeof this.history.saveToHistory === 'function') {
        this.history.saveToHistory(operationName, inputText, result);
      }
    } catch (error) {
      console.error('转换失败:', error);
      if (this.utils && typeof this.utils.showToast === 'function') {
        this.utils.showToast(`转换失败: ${error.message}`, 'error');
      }
    }
  },
  
  /**
   * 首字母大写
   * @param {string} text - 输入文本
   * @returns {string} 转换后的文本
   */
  toTitleCase: function(text) {
    return text.replace(/\b\w+/g, function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  },
  
  /**
   * 句首大写
   * @param {string} text - 输入文本
   * @returns {string} 转换后的文本
   */
  toSentenceCase: function(text) {
    return text.replace(/(^\s*|[.!?]\s+)([a-z])/g, function(match, p1, p2) {
      return p1 + p2.toUpperCase();
    });
  },
  
  /**
   * 大小写互换
   * @param {string} text - 输入文本
   * @returns {string} 转换后的文本
   */
  toggleCase: function(text) {
    return text.split('').map(function(char) {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      } else {
        return char.toUpperCase();
      }
    }).join('');
  },
  
  /**
   * 转换为驼峰命名
   * @param {string} text - 输入文本
   * @returns {string} 转换后的文本
   */
  toCamelCase: function(text) {
    return text
      .replace(/[\s_-]+(.)/g, function(_, c) { return c.toUpperCase(); })
      .replace(/^[A-Z]/, function(c) { return c.toLowerCase(); })
      .replace(/[^\w]/g, '');
  },
  
  /**
   * 转换为帕斯卡命名
   * @param {string} text - 输入文本
   * @returns {string} 转换后的文本
   */
  toPascalCase: function(text) {
    return text
      .replace(/[\s_-]+(.)/g, function(_, c) { return c.toUpperCase(); })
      .replace(/^[a-z]/, function(c) { return c.toUpperCase(); })
      .replace(/[^\w]/g, '');
  },
  
  /**
   * 转换为蛇形命名
   * @param {string} text - 输入文本
   * @returns {string} 转换后的文本
   */
  toSnakeCase: function(text) {
    return text
      .replace(/([A-Z])/g, '_$1')
      .replace(/[\s-]+/g, '_')
      .toLowerCase()
      .replace(/^_/, '')
      .replace(/_+/g, '_');
  },
  
  /**
   * 转换为短横线命名
   * @param {string} text - 输入文本
   * @returns {string} 转换后的文本
   */
  toKebabCase: function(text) {
    return text
      .replace(/([A-Z])/g, '-$1')
      .replace(/[\s_]+/g, '-')
      .toLowerCase()
      .replace(/^-/, '')
      .replace(/-+/g, '-');
  },
  
  /**
   * 转换为常量命名
   * @param {string} text - 输入文本
   * @returns {string} 转换后的文本
   */
  toConstantCase: function(text) {
    return text
      .replace(/([A-Z])/g, '_$1')
      .replace(/[\s-]+/g, '_')
      .toUpperCase()
      .replace(/^_/, '')
      .replace(/_+/g, '_');
  },
  
  /**
   * 移除所有空格
   * @param {string} text - 输入文本
   * @returns {string} 转换后的文本
   */
  removeAllSpaces: function(text) {
    return text.replace(/\s+/g, '');
  },
  
  /**
   * 修剪行首尾空格
   * @param {string} text - 输入文本
   * @returns {string} 转换后的文本
   */
  trimLines: function(text) {
    return text.split('\n').map(function(line) { 
      return line.trim(); 
    }).join('\n');
  },
  
  /**
   * 移除空行
   * @param {string} text - 输入文本
   * @returns {string} 转换后的文本
   */
  removeEmptyLines: function(text) {
    return text.split('\n').filter(function(line) { 
      return line.trim() !== ''; 
    }).join('\n');
  },
  
  /**
   * 添加行号
   * @param {string} text - 输入文本
   * @returns {string} 转换后的文本
   */
  addLineNumbers: function(text) {
    const lines = text.split('\n');
    const digitCount = String(lines.length).length;
    
    return lines.map(function(line, index) {
      const lineNumber = String(index + 1).padStart(digitCount, '0');
      return `${lineNumber}: ${line}`;
    }).join('\n');
  },
  
  /**
   * 行排序
   * @param {string} text - 输入文本
   * @returns {string} 转换后的文本
   */
  sortLines: function(text) {
    return text.split('\n').sort().join('\n');
  }
};