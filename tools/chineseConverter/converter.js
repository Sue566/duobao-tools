/**
 * 中文繁简转换工具 - 转换功能
 */

window.chineseConverterCore = {
  /**
   * 初始化转换功能
   * @param {HTMLElement} container - 容器元素
   */
  init: function(container) {
    this.container = container;
    this.utils = window.chineseConverterUtils;
    this.history = window.chineseConverterHistory;
    
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
    this.swapBtn = this.container.querySelector('#swap-btn');
    this.copyResult = this.container.querySelector('#copy-result');
    this.downloadResult = this.container.querySelector('#download-result');
    this.resultContainer = this.container.querySelector('#conversion-result');
    this.resultStats = this.container.querySelector('#result-stats');
    this.convertedChars = this.container.querySelector('#converted-chars');
    this.processTime = this.container.querySelector('#process-time');
    this.toggleInfoBtn = this.container.querySelector('.toggle-info-btn');
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
        // 根据当前选择的转换方向提供不同的示例
        const direction = document.querySelector('input[name="convert-direction"]:checked').value;
        
        if (direction === 't2s' || direction === 'auto') {
          this.chineseInput.value = '多寶工具箱是一個集合了各種實用在線工具的網站，旨在幫助用戶提高工作效率和解決日常問題。\n\n我們提供了文本處理、編碼轉換、圖片處理等多種工具，希望能夠滿足您的各種需求。';
        } else {
          this.chineseInput.value = '多宝工具箱是一个集合了各种实用在线工具的网站，旨在帮助用户提高工作效率和解决日常问题。\n\n我们提供了文本处理、编码转换、图片处理等多种工具，希望能够满足您的各种需求。';
        }
        
        this.utils.showToast('已加载示例文本', 'info');
      });
    }
    
    // 交换文本按钮点击事件
    if (this.swapBtn) {
      this.swapBtn.addEventListener('click', () => {
        const resultContent = this.resultContainer.querySelector('.result-content');
        if (!resultContent) {
          this.utils.showToast('没有可交换的结果', 'warning');
          return;
        }
        
        // 交换输入和结果
        const inputText = this.chineseInput.value;
        const resultText = resultContent.textContent;
        
        this.chineseInput.value = resultText;
        
        // 更新结果区域
        this.resultContainer.innerHTML = `
          <div class="result-content">
            <pre>${inputText}</pre>
          </div>
        `;
        
        // 自动切换转换方向
        const currentDirection = document.querySelector('input[name="convert-direction"]:checked').value;
        if (currentDirection === 's2t') {
          document.querySelector('#direction-t2s').checked = true;
        } else if (currentDirection === 't2s') {
          document.querySelector('#direction-s2t').checked = true;
        }
        
        this.utils.showToast('已交换文本', 'info');
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
        localStorage.setItem('infoCollapsed_chineseConverter', !isCollapsed);
      });
      
      // 检查是否应该折叠说明
      const shouldCollapseInfo = localStorage.getItem('infoCollapsed_chineseConverter') === 'true';
      if (shouldCollapseInfo) {
        const infoContent = this.container.querySelector('.info-content');
        infoContent.style.display = 'none';
        this.toggleInfoBtn.innerHTML = '<i class="fa fa-chevron-down"></i>';
      }
    }
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
    const direction = document.querySelector('input[name="convert-direction"]:checked').value;
    const useHongKong = document.querySelector('#option-hongkong').checked;
    const useTaiwan = document.querySelector('#option-taiwan').checked;
    const keepPunctuation = document.querySelector('#option-keep-punctuation').checked;
    
    // 显示加载状态
    this.resultContainer.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i> 正在转换，请稍候...</div>';
    this.resultStats.style.display = 'none';
    
    // 记录开始时间
    const startTime = performance.now();
    
    // 延迟执行，让UI有时间更新
    setTimeout(() => {
      try {
        // 自动检测文本类型
        let actualDirection = direction;
        if (direction === 'auto') {
          actualDirection = this.utils.detectTextType(text);
        }
        
        // 转换文本
        let result = '';
        if (window.chineseConversionUtil) {
          if (actualDirection === 's2t') {
            // 简体转繁体
            let conversionType = 'traditional';
            if (useHongKong) conversionType = 'hongkong';
            if (useTaiwan) conversionType = 'taiwan';
            
            result = window.chineseConversionUtil.s2t(text, { type: conversionType, keepPunctuation });
          } else {
            // 繁体转简体
            result = window.chineseConversionUtil.t2s(text, { keepPunctuation });
          }
        } else {
          // 转换库未加载，显示错误
          result = '繁简转换库未能正确加载，请刷新页面重试。';
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
        this.history.saveToHistory(actualDirection, text, result);
        
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
   * 保存文本到文件
   * @param {string} text - 要保存的文本
   */
  saveToFile: function(text) {
    // 获取转换方向
    const direction = document.querySelector('input[name="convert-direction"]:checked').value;
    let directionText = '繁简转换';
    if (direction === 's2t') directionText = '简转繁';
    if (direction === 't2s') directionText = '繁转简';
    
    const filename = `中文${directionText}_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.txt`;
    
    this.utils.saveToFile(text, filename);
  }
};