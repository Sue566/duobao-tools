/**
 * 中文转拼音工具 - 转换功能
 */

window.chineseToPinyinConverter = {
  /**
   * 初始化转换功能
   * @param {HTMLElement} container - 容器元素
   */
  init: function(container) {
    this.container = container;
    this.utils = window.chineseToPinyinUtils;
    this.history = window.chineseToPinyinHistory;
    
    this.setupReferences();
    this.setupEvents();
  },
  
  /**
   * 设置DOM引用
   */
  setupReferences: function() {
    this.chineseInput = this.container.querySelector('#chinese-input');
    this.convertBtn = this.container.querySelector('#convert-btn');
    this.clearBtn = this.container.querySelector('#clear-btn');
    this.exampleBtn = this.container.querySelector('#example-btn');
    this.copyResult = this.container.querySelector('#copy-result');
    this.downloadResult = this.container.querySelector('#download-result');
    this.resultContainer = this.container.querySelector('#conversion-result');
    this.resultStats = this.container.querySelector('#result-stats');
    this.convertedChars = this.container.querySelector('#converted-chars');
    this.processTime = this.container.querySelector('#process-time');
    this.toggleInfoBtn = this.container.querySelector('.toggle-info-btn');
    
    // 选项元素
    this.toneOption = this.container.querySelector('#option-tone');
    this.firstLetterOption = this.container.querySelector('#option-first-letter');
    this.upperCaseOption = this.container.querySelector('#option-uppercase');
    this.spaceSeparatedOption = this.container.querySelector('#option-space');
    this.keepNonChineseOption = this.container.querySelector('#option-keep-non-chinese');
  },
  
  /**
   * 设置事件处理
   */
  setupEvents: function() {
    // 转换按钮点击事件
    if (this.convertBtn) {
      this.convertBtn.addEventListener('click', () => this.convertText());
    }
    
    // 清空按钮点击事件
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => {
        this.chineseInput.value = '';
        this.resultContainer.innerHTML = `
          <div class="no-result">
            <i class="fa fa-info-circle"></i>
            <p>点击"转换"按钮开始</p>
          </div>
        `;
        this.resultStats.style.display = 'none';
      });
    }
    
    // 示例按钮点击事件
    if (this.exampleBtn) {
      this.exampleBtn.addEventListener('click', () => {
        this.chineseInput.value = '多宝工具箱是一个集合了各种实用在线工具的网站，旨在帮助用户提高工作效率和解决日常问题。';
        this.utils.showToast('已加载示例文本', 'info');
      });
    }
    
    // 复制结果按钮点击事件
    if (this.copyResult) {
      this.copyResult.addEventListener('click', () => {
        const resultContent = this.resultContainer.querySelector('.result-content');
        if (!resultContent) {
          this.utils.showToast('没有可复制的结果', 'warning');
          return;
        }
        
        const text = resultContent.textContent;
        this.utils.copyToClipboard(text);
      });
    }
    
    // 下载结果按钮点击事件
    if (this.downloadResult) {
      this.downloadResult.addEventListener('click', () => {
        const resultContent = this.resultContainer.querySelector('.result-content');
        if (!resultContent) {
          this.utils.showToast('没有可下载的结果', 'warning');
          return;
        }
        
        const text = resultContent.textContent;
        this.saveToFile(text);
      });
    }
    
    // 使用说明折叠/展开
    if (this.toggleInfoBtn) {
      this.toggleInfoBtn.addEventListener('click', () => {
        const infoContent = this.container.querySelector('.info-content');
        const isCollapsed = infoContent.style.display === 'none';
        
        infoContent.style.display = isCollapsed ? 'block' : 'none';
        this.toggleInfoBtn.innerHTML = isCollapsed ? 
          '<i class="fa fa-chevron-up"></i>' : 
          '<i class="fa fa-chevron-down"></i>';
        
        // 保存偏好
        localStorage.setItem('infoCollapsed_chineseToPinyin', !isCollapsed);
      });
      
      // 检查是否应该折叠说明
      const shouldCollapseInfo = localStorage.getItem('infoCollapsed_chineseToPinyin') === 'true';
      if (shouldCollapseInfo) {
        const infoContent = this.container.querySelector('.info-content');
        infoContent.style.display = 'none';
        this.toggleInfoBtn.innerHTML = '<i class="fa fa-chevron-down"></i>';
      }
    }
    
    // 保存选项设置
    const optionElements = [
      this.toneOption,
      this.firstLetterOption,
      this.upperCaseOption,
      this.spaceSeparatedOption,
      this.keepNonChineseOption
    ];
    
    optionElements.forEach(option => {
      if (option) {
        option.addEventListener('change', () => {
          this.saveOptions();
        });
      }
    });
    
    // 加载选项设置
    this.loadOptions();
  },
  
  /**
   * 转换文本
   */
  convertText: function() {
    const text = this.chineseInput.value.trim();
    if (!text) {
      this.utils.showToast('请输入需要转换的文本', 'warning');
      return;
    }
    
    // 获取转换选项
    const options = {
      tone: this.toneOption.checked,
      firstLetter: this.firstLetterOption.checked,
      uppercase: this.upperCaseOption.checked,
      spaceSeparated: this.spaceSeparatedOption.checked,
      keepNonChinese: this.keepNonChineseOption.checked
    };
    
    // 显示加载状态
    this.resultContainer.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i> 正在转换，请稍候...</div>';
    this.resultStats.style.display = 'none';
    
    // 记录开始时间
    const startTime = performance.now();
    
    // 延迟执行，让UI有时间更新
    setTimeout(() => {
      try {
        // 转换文本
        let result = '';
        if (window.pinyinUtil) {
          result = this.convertToPinyin(text, options);
        } else {
          // 转换库未加载，显示错误
          result = '拼音转换库未能正确加载，请刷新页面重试。';
        }
        
        // 计算处理时间
        const endTime = performance.now();
        const processingTime = Math.round(endTime - startTime);
        
        // 显示结果
        this.resultContainer.innerHTML = `
          <div class="result-content">
            <pre>${result}</pre>
          </div>
        `;
        
        // 显示统计信息
        this.resultStats.style.display = 'flex';
        this.convertedChars.textContent = text.length;
        this.processTime.textContent = `${processingTime} ms`;
        
        // 保存到历史记录
        this.history.saveToHistory(text, result, options);
        
        // 显示成功提示
        this.utils.showToast('转换完成', 'success');
      } catch (error) {
        console.error('转换错误:', error);
        
        // 显示错误
        this.resultContainer.innerHTML = `
          <div class="error-result">
            <i class="fa fa-exclamation-triangle"></i>
            <p>转换出错: ${error.message}</p>
          </div>
        `;
        
        // 显示错误提示
        this.utils.showToast('转换失败: ' + error.message, 'error');
      }
    }, 100);
  },
  
  /**
   * 转换为拼音
   * @param {string} text - 输入文本
   * @param {Object} options - 转换选项
   * @returns {string} 转换后的文本
   */
  convertToPinyin: function(text, options) {
    // 使用pinyinUtil库进行转换
    let result = '';
    
    if (options.firstLetter) {
      // 只获取首字母
      result = window.pinyinUtil.getFirstLetter(text, options.uppercase);
    } else {
      // 获取完整拼音
      const style = options.tone ? window.pinyinUtil.STYLE_TONE : window.pinyinUtil.STYLE_NORMAL;
      result = window.pinyinUtil.getPinyin(text, options.spaceSeparated ? ' ' : '', style, !options.keepNonChinese);
      
      // 如果需要大写
      if (options.uppercase) {
        result = result.toUpperCase();
      }
    }
    
    return result;
  },
  
  /**
   * 保存文本到文件
   * @param {string} text - 要保存的文本
   */
  saveToFile: function(text) {
    const filename = `拼音转换_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.txt`;
    this.utils.saveToFile(text, filename);
  },
  
  /**
   * 保存选项设置
   */
  saveOptions: function() {
    const options = {
      tone: this.toneOption.checked,
      firstLetter: this.firstLetterOption.checked,
      uppercase: this.upperCaseOption.checked,
      spaceSeparated: this.spaceSeparatedOption.checked,
      keepNonChinese: this.keepNonChineseOption.checked
    };
    
    this.utils.saveSettings(options);
  },
  
  /**
   * 加载选项设置
   */
  loadOptions: function() {
    const options = this.utils.loadSettings();
    
    if (options) {
      if (this.toneOption) this.toneOption.checked = options.tone;
      if (this.firstLetterOption) this.firstLetterOption.checked = options.firstLetter;
      if (this.upperCaseOption) this.upperCaseOption.checked = options.uppercase;
      if (this.spaceSeparatedOption) this.spaceSeparatedOption.checked = options.spaceSeparated;
      if (this.keepNonChineseOption) this.keepNonChineseOption.checked = options.keepNonChinese;
    }
  }
};