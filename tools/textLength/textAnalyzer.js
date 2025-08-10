/**
 * 文本长度统计工具 - 文本分析功能
 */

window.textLengthAnalyzer = {
  /**
   * 初始化文本分析功能
   * @param {HTMLElement} container - 容器元素
   */
  init: function(container) {
    this.container = container;
    this.setupReferences();
    this.setupEvents();
  },
  
  /**
   * 设置DOM引用
   */
  setupReferences: function() {
    this.textInput = this.container.querySelector('#text-input');
    this.countBtn = this.container.querySelector('#count-btn');
    this.clearBtn = this.container.querySelector('#clear-btn');
    this.copyBtn = this.container.querySelector('#copy-btn');
    this.saveBtn = this.container.querySelector('#save-btn');
    this.resultArea = this.container.querySelector('#result-area');
    this.countOptions = this.container.querySelectorAll('input[name="count-option"]');
    this.excludeSpaces = this.container.querySelector('#exclude-spaces');
    this.excludeLineBreaks = this.container.querySelector('#exclude-line-breaks');
    this.excludePunctuation = this.container.querySelector('#exclude-punctuation');
    this.realTimeCount = this.container.querySelector('#real-time-count');
    this.charCountDisplay = this.container.querySelector('#char-count-display');
    this.wordFreqBtn = this.container.querySelector('#word-freq-btn');
    this.charDistBtn = this.container.querySelector('#char-dist-btn');
  },
  
  /**
   * 设置事件处理
   */
  setupEvents: function() {
    // 计数按钮
    this.countBtn.addEventListener('click', () => this.countText());
    
    // 清空按钮
    this.clearBtn.addEventListener('click', () => this.clearInput());
    
    // 复制按钮
    this.copyBtn.addEventListener('click', () => this.copyResult());
    
    // 保存按钮
    this.saveBtn.addEventListener('click', () => this.saveToHistory());
    
    // 输入框事件
    this.textInput.addEventListener('input', () => this.updateCharCount());
    
    // 选项变更事件
    this.countOptions.forEach(option => {
      option.addEventListener('change', () => {
        if (this.realTimeCount.checked) {
          this.countText();
        }
      });
    });
    
    this.excludeSpaces.addEventListener('change', () => {
      if (this.realTimeCount.checked) {
        this.countText();
      }
    });
    
    this.excludeLineBreaks.addEventListener('change', () => {
      if (this.realTimeCount.checked) {
        this.countText();
      }
    });
    
    this.excludePunctuation.addEventListener('change', () => {
      if (this.realTimeCount.checked) {
        this.countText();
      }
    });
    
    this.realTimeCount.addEventListener('change', () => {
      if (this.realTimeCount.checked) {
        this.countText();
      }
    });
    
    // 词频统计按钮
    if (this.wordFreqBtn) {
      this.wordFreqBtn.addEventListener('click', () => this.analyzeWordFrequency());
    }
    
    // 字符分布按钮
    if (this.charDistBtn) {
      this.charDistBtn.addEventListener('click', () => this.analyzeCharDistribution());
    }
    
    // 初始化
    this.updateCharCount();
  },
  
  /**
   * 更新字符计数
   */
  updateCharCount: function() {
    const count = this.textInput.value.length;
    this.charCountDisplay.textContent = `${window.textLengthUtils.formatNumber(count)} 个字符`;
    
    // 如果启用了实时计数，也更新结果区域
    if (this.realTimeCount.checked) {
      this.countText();
    }
  },
  
  /**
   * 计数文本
   */
  countText: function() {
    const text = this.textInput.value;
    let processedText = text;
    let originalLength = text.length;
    
    // 获取选中的计数选项
    let countOption = 'chars';
    for (const option of this.countOptions) {
      if (option.checked) {
        countOption = option.value;
        break;
      }
    }
    
    // 应用排除选项
    if (this.excludeSpaces.checked) {
      processedText = processedText.replace(/\s/g, '');
    }
    
    if (this.excludeLineBreaks.checked) {
      processedText = processedText.replace(/\n/g, '');
    }
    
    if (this.excludePunctuation.checked) {
      processedText = processedText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()，。、；：''""【】《》？！￥…（）]/g, '');
    }
    
    // 计算结果
    let result = '';
    let resultData = {};
    
    switch (countOption) {
      case 'chars':
        const processedLength = processedText.length;
        resultData = {
          '字符数（含空格和标点）': originalLength,
          '字符数（排除选项后）': processedLength
        };
        
        result = this.formatResultItems(resultData);
        break;
        
      case 'words':
        // 简单的单词计数（按空格分割）
        const words = processedText.trim().split(/\s+/).filter(word => word.length > 0);
        resultData = {
          '单词数': words.length
        };
        
        result = this.formatResultItems(resultData);
        break;
        
      case 'lines':
        // 行数计数
        const lines = text.split('\n').filter(line => line.length > 0);
        resultData = {
          '行数': lines.length
        };
        
        result = this.formatResultItems(resultData);
        break;
        
      case 'detailed':
        // 详细统计
        const charDist = window.textLengthUtils.getCharDistribution(text);
        const allWords = processedText.trim().split(/\s+/).filter(word => word.length > 0);
        const allLines = text.split('\n').filter(line => line.length > 0);
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        const readingTime = window.textLengthUtils.estimateReadingTime(text);
        const language = window.textLengthUtils.detectLanguage(text);
        
        let languageName = '其他';
        switch (language) {
          case 'zh': languageName = '中文'; break;
          case 'en': languageName = '英文'; break;
          case 'mixed': languageName = '中英混合'; break;
        }
        
        resultData = {
          '字符数（总计）': originalLength,
          '字符数（不含空格）': originalLength - charDist.space,
          '中文字符': charDist.chinese,
          '英文字符': charDist.english,
          '数字': charDist.number,
          '标点符号': charDist.punctuation,
          '空格': charDist.space,
          '其他字符': charDist.other,
          '单词数': allWords.length,
          '行数': allLines.length,
          '段落数': paragraphs.length,
          '预计阅读时间': `${readingTime.minutes}分${readingTime.seconds}秒`,
          '主要语言': languageName
        };
        
        result = this.formatResultItems(resultData);
        break;
        
      case 'all':
      default:
        // 全部统计
        const allCharDist = window.textLengthUtils.getCharDistribution(text);
        const words2 = processedText.trim().split(/\s+/).filter(word => word.length > 0);
        const lines2 = text.split('\n').filter(line => line.length > 0);
        const paragraphs2 = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        
        resultData = {
          '字符数（含空格和标点）': originalLength,
          '字符数（排除选项后）': processedText.length,
          '单词数': words2.length,
          '行数': lines2.length,
          '段落数': paragraphs2.length
        };
        
        result = this.formatResultItems(resultData);
        break;
    }
    
    // 更新结果区域
    this.resultArea.innerHTML = result;
    
    return resultData;
  },
  
  /**
   * 格式化结果项
   * @param {object} items - 结果项对象
   * @returns {string} 格式化后的HTML
   */
  formatResultItems: function(items) {
    return Object.entries(items).map(([label, value]) => {
      return `<div class="result-item">
        <div class="result-label">${label}:</div>
        <div class="result-value">${typeof value === 'number' ? window.textLengthUtils.formatNumber(value) : value}</div>
      </div>`;
    }).join('');
  },
  
  /**
   * 清空输入
   */
  clearInput: function() {
    this.textInput.value = '';
    this.resultArea.innerHTML = '';
    this.charCountDisplay.textContent = '0 个字符';
    this.textInput.focus();
  },
  
  /**
   * 复制结果
   */
  copyResult: function() {
    const resultText = Array.from(this.resultArea.querySelectorAll('.result-item'))
      .map(item => {
        const label = item.querySelector('.result-label').textContent;
        const value = item.querySelector('.result-value').textContent;
        return `${label} ${value}`;
      })
      .join('\n');
    
    window.textLengthUtils.copyToClipboard(resultText);
  },
  
  /**
   * 保存到历史记录
   */
  saveToHistory: function() {
    const text = this.textInput.value;
    
    if (!text) {
      window.textLengthUtils.showToast('没有可保存的内容', 'warning');
      return;
    }
    
    // 获取当前结果
    const results = {};
    this.resultArea.querySelectorAll('.result-item').forEach(item => {
      const label = item.querySelector('.result-label').textContent.replace(':', '');
      const value = item.querySelector('.result-value').textContent;
      results[label] = value;
    });
    
    // 获取当前选项
    let countOption = 'chars';
    for (const option of this.countOptions) {
      if (option.checked) {
        countOption = option.value;
        break;
      }
    }
    
    const options = {
      countOption,
      excludeSpaces: this.excludeSpaces.checked,
      excludeLineBreaks: this.excludeLineBreaks.checked,
      excludePunctuation: this.excludePunctuation.checked
    };
    
    // 保存到历史记录
    window.textLengthHistory.addHistoryItem({
      text,
      results,
      options
    });
    
    window.textLengthUtils.showToast('已保存到历史记录', 'success');
  },
  
  /**
   * 从历史记录加载
   * @param {object} item - 历史记录项
   */
  loadFromHistory: function(item) {
    if (!item) return;
    
    // 设置文本
    this.textInput.value = item.text;
    
    // 设置选项
    if (item.options) {
      // 设置计数选项
      this.countOptions.forEach(option => {
        if (option.value === item.options.countOption) {
          option.checked = true;
        }
      });
      
      // 设置排除选项
      if (this.excludeSpaces) {
        this.excludeSpaces.checked = !!item.options.excludeSpaces;
      }
      
      if (this.excludeLineBreaks) {
        this.excludeLineBreaks.checked = !!item.options.excludeLineBreaks;
      }
      
      if (this.excludePunctuation) {
        this.excludePunctuation.checked = !!item.options.excludePunctuation;
      }
    }
    
    // 更新字符计数
    this.updateCharCount();
    
    // 执行统计
    this.countText();
    
    window.textLengthUtils.showToast('已加载历史记录', 'success');
  },
  
  /**
   * 分析词频
   */
  analyzeWordFrequency: function() {
    const text = this.textInput.value;
    
    if (!text) {
      window.textLengthUtils.showToast('请先输入文本', 'warning');
      return;
    }
    
    // 检测语言
    const language = window.textLengthUtils.detectLanguage(text);
    let words = [];
    
    if (language === 'zh') {
      // 中文分词（简单实现，实际应用中应使用专业分词库）
      // 这里简单地将每个汉字视为一个词
      words = text.match(/[\u4e00-\u9fa5]/g) || [];
    } else {
      // 英文分词
      words = text.toLowerCase().match(/\b[a-z\d]+\b/g) || [];
    }
    
    // 统计词频
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    // 排序
    const sortedWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50); // 只显示前50个
    
    // 构建结果HTML
    let resultHTML = '<div class="word-freq-result">';
    resultHTML += '<h4>词频统计（前50个）</h4>';
    resultHTML += '<table class="word-freq-table">';
    resultHTML += '<thead><tr><th>排名</th><th>词语</th><th>出现次数</th><th>频率</th></tr></thead>';
    resultHTML += '<tbody>';
    
    const totalWords = words.length;
    sortedWords.forEach(([word, count], index) => {
      const frequency = ((count / totalWords) * 100).toFixed(2) + '%';
      resultHTML += `<tr>
        <td>${index + 1}</td>
        <td>${word}</td>
        <td>${count}</td>
        <td>${frequency}</td>
      </tr>`;
    });
    
    resultHTML += '</tbody></table></div>';
    
    // 更新结果区域
    this.resultArea.innerHTML = resultHTML;
    
    // 保存到历史记录
    window.textLengthHistory.addHistoryItem({
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      results: {
        '分析类型': '词频统计',
        '词语数量': sortedWords.length
      },
      options: {
        countOption: 'wordFrequency'
      }
    });
  },
  
  /**
   * 分析字符分布
   */
  analyzeCharDistribution: function() {
    const text = this.textInput.value;
    
    if (!text) {
      window.textLengthUtils.showToast('请先输入文本', 'warning');
      return;
    }
    
    // 获取字符分布
    const charDist = window.textLengthUtils.getCharDistribution(text);
    const totalChars = text.length;
    
    // 构建结果HTML
    let resultHTML = '<div class="char-dist-result">';
    resultHTML += '<h4>字符分布统计</h4>';
    
    // 添加饼图容器
    resultHTML += '<div class="chart-container" id="char-dist-chart"></div>';
    
    // 添加表格
    resultHTML += '<table class="char-dist-table">';
    resultHTML += '<thead><tr><th>类型</th><th>数量</th><th>占比</th></tr></thead>';
    resultHTML += '<tbody>';
    
    // 添加各类型字符的统计
    const categories = [
      { key: 'chinese', label: '中文字符' },
      { key: 'english', label: '英文字符' },
      { key: 'number', label: '数字' },
      { key: 'punctuation', label: '标点符号' },
      { key: 'space', label: '空格' },
      { key: 'other', label: '其他字符' }
    ];
    
    categories.forEach(cat => {
      const count = charDist[cat.key];
      const percentage = ((count / totalChars) * 100).toFixed(2) + '%';
      
      resultHTML += `<tr>
        <td>${cat.label}</td>
        <td>${window.textLengthUtils.formatNumber(count)}</td>
        <td>${percentage}</td>
      </tr>`;
    });
    
    resultHTML += '</tbody></table></div>';
    
    // 更新结果区域
    this.resultArea.innerHTML = resultHTML;
    
    // 如果有Chart.js，绘制饼图
    if (window.Chart) {
      setTimeout(() => {
        const ctx = document.getElementById('char-dist-chart').getContext('2d');
        
        // 设置颜色
        const colors = [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)'
        ];
        
        // 准备数据
        const data = categories.map(cat => charDist[cat.key]);
        const labels = categories.map(cat => cat.label);
        
        // 创建图表
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: colors,
              borderColor: colors.map(c => c.replace('0.7', '1')),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  boxWidth: 15,
                  padding: 15
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const percentage = ((value / totalChars) * 100).toFixed(2);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      }, 100);
    }
    
    // 保存到历史记录
    window.textLengthHistory.addHistoryItem({
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      results: {
        '分析类型': '字符分布统计',
        '总字符数': totalChars,
        '中文字符': charDist.chinese,
        '英文字符': charDist.english
      },
      options: {
        countOption: 'charDistribution'
      }
    });
  }
};