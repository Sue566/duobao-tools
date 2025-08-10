/**
 * 多宝工具箱 - 中文繁简转换工具
 * 增强版：支持多种转换选项和历史记录
 */
(function() {
  // 定义工具
  const tool = {
    // 工具配置
    config: {
      // 保存用户设置
      saveSettings: function(settings) {
        try {
          localStorage.setItem('settings_chineseConverter', JSON.stringify(settings));
        } catch (e) {
          console.error('保存设置失败', e);
        }
      },
      
      // 加载用户设置
      loadSettings: function() {
        try {
          const settings = localStorage.getItem('settings_chineseConverter');
          return settings ? JSON.parse(settings) : null;
        } catch (e) {
          console.error('加载设置失败', e);
          return null;
        }
      }
    },
    
    // 工具初始化时调用
    init: function() {
      // 加载繁简转换库
      if (!window.chineseConversionUtil) {
        console.log('正在加载繁简转换库...');
        
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/chinese-conv@1.0.1/dist/chineseConv.min.js';
          document.head.appendChild(script);
          
          script.onload = () => {
            console.log('繁简转换库加载成功');
            window.chineseConversionUtil = window.chineseConv;
            resolve();
          };
          
          script.onerror = () => {
            console.error('繁简转换库加载失败');
            // 创建一个简单的备用转换函数
            window.chineseConversionUtil = {
              s2t: function(text) {
                return text + ' (繁简转换库加载失败)';
              },
              t2s: function(text) {
                return text + ' (繁简转换库加载失败)';
              }
            };
            resolve();
          };
        });
      }
    },
    
    /**
     * 初始化工具
     * @param {HTMLElement} container - 工具容器
     * @returns {Function} 清理函数
     */
    render: async function(container) {
      // 加载模板
      const templateResponse = await fetch('tools/chineseConverter/template.html');
      const template = await templateResponse.text();
      container.innerHTML = template;
      
      // 添加样式
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'tools/chineseConverter/styles.css';
      document.head.appendChild(link);
      
      // 添加收藏按钮
      window.addFavoriteButton('chineseConverter', container.querySelector('.tool-header'));
      
      // 获取元素
      const chineseInput = container.querySelector('#chinese-input');
      const convertBtn = container.querySelector('#convert-btn');
      const clearBtn = container.querySelector('#clear-btn');
      const exampleBtn = container.querySelector('#example-btn');
      const swapBtn = container.querySelector('#swap-btn');
      const copyResult = container.querySelector('#copy-result');
      const downloadResult = container.querySelector('#download-result');
      const resultContainer = container.querySelector('#conversion-result');
      const resultStats = container.querySelector('#result-stats');
      const convertedChars = container.querySelector('#converted-chars');
      const processTime = container.querySelector('#process-time');
      const toggleInfoBtn = container.querySelector('.toggle-info-btn');
      const clearHistoryBtn = container.querySelector('#clear-history');
      const historyList = container.querySelector('#history-list');
      
      // 历史记录数组
      let historyItems = loadHistory();
      
      // 转换按钮点击事件
      convertBtn.addEventListener('click', () => {
        const text = chineseInput.value.trim();
        if (!text) {
          showToast('请输入需要转换的文本', 'warning');
          return;
        }
        
        // 获取转换选项
        const direction = document.querySelector('input[name="convert-direction"]:checked').value;
        const useHongKong = document.querySelector('#option-hongkong').checked;
        const useTaiwan = document.querySelector('#option-taiwan').checked;
        const keepPunctuation = document.querySelector('#option-keep-punctuation').checked;
        
        // 显示加载状态
        resultContainer.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i> 正在转换，请稍候...</div>';
        resultStats.style.display = 'none';
        
        // 记录开始时间
        const startTime = performance.now();
        
        // 延迟执行，让UI有时间更新
        setTimeout(() => {
          try {
            // 自动检测文本类型
            let actualDirection = direction;
            if (direction === 'auto') {
              actualDirection = detectTextType(text);
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
            resultContainer.innerHTML = `
              <div class="result-content">
                <pre>${result}</pre>
              </div>
            `;
            
            // 显示统计信息
            resultStats.style.display = 'flex';
            convertedChars.textContent = text.length;
            processTime.textContent = `${processingTime} ms`;
            
            // 保存到历史记录
            saveToHistory(actualDirection, text, result);
            
            // 显示成功提示
            showToast('转换完成', 'success');
          } catch (error) {
            console.error('转换错误:', error);
            
            // 显示错误
            resultContainer.innerHTML = `
              <div class="error-result">
                <i class="fa fa-exclamation-triangle"></i>
                <p>转换出错: ${error.message}</p>
              </div>
            `;
            
            // 显示错误提示
            showToast('转换失败: ' + error.message, 'error');
          }
        }, 100);
      });
      
      // 清空按钮点击事件
      clearBtn.addEventListener('click', () => {
        chineseInput.value = '';
        resultContainer.innerHTML = `
          <div class="no-result">
            <i class="fa fa-info-circle"></i>
            <p>点击"转换"按钮开始</p>
          </div>
        `;
        resultStats.style.display = 'none';
      });
      
      // 示例按钮点击事件
      exampleBtn.addEventListener('click', () => {
        // 根据当前选择的转换方向提供不同的示例
        const direction = document.querySelector('input[name="convert-direction"]:checked').value;
        
        if (direction === 't2s' || direction === 'auto') {
          chineseInput.value = '多寶工具箱是一個集合了各種實用在線工具的網站，旨在幫助用戶提高工作效率和解決日常問題。\n\n我們提供了文本處理、編碼轉換、圖片處理等多種工具，希望能夠滿足您的各種需求。';
        } else {
          chineseInput.value = '多宝工具箱是一个集合了各种实用在线工具的网站，旨在帮助用户提高工作效率和解决日常问题。\n\n我们提供了文本处理、编码转换、图片处理等多种工具，希望能够满足您的各种需求。';
        }
        
        showToast('已加载示例文本', 'info');
      });
      
      // 交换文本按钮点击事件
      swapBtn.addEventListener('click', () => {
        const resultContent = resultContainer.querySelector('.result-content');
        if (!resultContent) {
          showToast('没有可交换的结果', 'warning');
          return;
        }
        
        // 交换输入和结果
        const inputText = chineseInput.value;
        const resultText = resultContent.textContent;
        
        chineseInput.value = resultText;
        
        // 更新结果区域
        resultContainer.innerHTML = `
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
        
        showToast('已交换文本', 'info');
      });
      
      // 复制结果按钮点击事件
      copyResult.addEventListener('click', () => {
        const resultContent = resultContainer.querySelector('.result-content');
        if (!resultContent) {
          showToast('没有可复制的结果', 'warning');
          return;
        }
        
        const text = resultContent.textContent;
        copyToClipboard(text);
      });
      
      // 下载结果按钮点击事件
      downloadResult.addEventListener('click', () => {
        const resultContent = resultContainer.querySelector('.result-content');
        if (!resultContent) {
          showToast('没有可下载的结果', 'warning');
          return;
        }
        
        const text = resultContent.textContent;
        saveToFile(text);
      });
      
      // 使用说明折叠/展开
      toggleInfoBtn.addEventListener('click', () => {
        const infoContent = container.querySelector('.info-content');
        const isCollapsed = infoContent.style.display === 'none';
        
        infoContent.style.display = isCollapsed ? 'block' : 'none';
        toggleInfoBtn.innerHTML = isCollapsed ? 
          '<i class="fa fa-chevron-up"></i>' : 
          '<i class="fa fa-chevron-down"></i>';
        
        // 保存偏好
        localStorage.setItem('infoCollapsed_chineseConverter', !isCollapsed);
      });
      
      // 清空历史记录按钮点击事件
      clearHistoryBtn.addEventListener('click', () => {
        historyItems = [];
        localStorage.removeItem('chineseConverterHistory');
        renderHistory();
        showToast('历史记录已清空', 'success');
      });
      
      /**
       * 检测文本类型（简体或繁体）
       * @param {string} text - 输入文本
       * @returns {string} 转换方向
       */
      function detectTextType(text) {
        // 简体字和繁体字的特征字符
        const simplifiedChars = '国东车里与关么专业习';
        const traditionalChars = '國東車裡與關麼專業習';
        
        let simplifiedCount = 0;
        let traditionalCount = 0;
        
        // 统计特征字符出现次数
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          if (simplifiedChars.includes(char)) {
            simplifiedCount++;
          } else if (traditionalChars.includes(char)) {
            traditionalCount++;
          }
        }
        
        // 根据统计结果判断文本类型
        if (traditionalCount > simplifiedCount) {
          return 't2s'; // 繁体转简体
        } else {
          return 's2t'; // 简体转繁体
        }
      }
      
      /**
       * 复制文本到剪贴板
       * @param {string} text - 要复制的文本
       */
      function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
          .then(() => {
            showToast('已复制到剪贴板', 'success');
          })
          .catch(err => {
            console.error('复制失败:', err);
            
            // 备用复制方法
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = 0;
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
              const successful = document.execCommand('copy');
              document.body.removeChild(textarea);
              
              if (successful) {
                showToast('已复制到剪贴板', 'success');
              } else {
                showToast('复制失败', 'error');
              }
            } catch (err) {
              document.body.removeChild(textarea);
              showToast('复制失败: ' + err, 'error');
            }
          });
      }
      
      /**
       * 保存文本到文件
       * @param {string} text - 要保存的文本
       */
      function saveToFile(text) {
        // 获取转换方向
        const direction = document.querySelector('input[name="convert-direction"]:checked').value;
        let directionText = '繁简转换';
        if (direction === 's2t') directionText = '简转繁';
        if (direction === 't2s') directionText = '繁转简';
        
        const filename = `中文${directionText}_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.txt`;
        
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('结果已下载', 'success');
      }
      
      /**
       * 显示提示消息
       * @param {string} message - 消息内容
       * @param {string} type - 消息类型
       */
      function showToast(message, type = 'info') {
        if (window.DuobaoNotification) {
          window.DuobaoNotification[type](message, '');
        } else {
          alert(message);
        }
      }
      
      /**
       * 保存到历史记录
       * @param {string} direction - 转换方向
       * @param {string} input - 输入文本
       * @param {string} output - 输出文本
       */
      function saveToHistory(direction, input, output) {
        // 创建历史记录项
        const historyItem = {
          id: Date.now(),
          direction,
          input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
          output: output.substring(0, 100) + (output.length > 100 ? '...' : ''),
          timestamp: new Date().toISOString(),
          fullInput: input,
          fullOutput: output
        };
        
        // 添加到历史记录
        historyItems.unshift(historyItem);
        
        // 限制历史记录数量
        if (historyItems.length > 10) {
          historyItems = historyItems.slice(0, 10);
        }
        
        // 保存到本地存储
        localStorage.setItem('chineseConverterHistory', JSON.stringify(historyItems));
        
        // 更新历史记录显示
        renderHistory();
      }
      
      /**
       * 加载历史记录
       * @returns {Array} 历史记录数组
       */
      function loadHistory() {
        try {
          const saved = localStorage.getItem('chineseConverterHistory');
          return saved ? JSON.parse(saved) : [];
        } catch (error) {
          console.error('加载历史记录失败:', error);
          return [];
        }
      }
      
      /**
       * 渲染历史记录
       */
      function renderHistory() {
        if (historyItems.length === 0) {
          historyList.innerHTML = '<div class="no-history">暂无历史记录</div>';
          return;
        }
        
        let html = '';
        
        historyItems.forEach(item => {
          const date = new Date(item.timestamp);
          const formattedDate = date.toLocaleString();
          
          let directionText = '自动检测';
          if (item.direction === 's2t') directionText = '简体 → 繁体';
          if (item.direction === 't2s') directionText = '繁体 → 简体';
          
          html += `
            <div class="history-item" data-id="${item.id}">
              <div class="history-item-content">
                <div class="history-item-type">${directionText}</div>
                <div class="history-item-text">${item.input}</div>
                <div class="history-item-time">${formattedDate}</div>
              </div>
              <div class="history-item-actions">
                <button class="btn btn-sm history-use-btn" data-id="${item.id}">使用</button>
                <button class="btn btn-sm btn-danger history-delete-btn" data-id="${item.id}">删除</button>
              </div>
            </div>
          `;
        });
        
        historyList.innerHTML = html;
        
        // 添加历史记录项事件
        historyList.querySelectorAll('.history-use-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const item = historyItems.find(h => h.id === id);
            
            if (item) {
              chineseInput.value = item.fullInput;
              
              // 设置转换方向
              if (item.direction === 's2t') {
                document.querySelector('#direction-s2t').checked = true;
              } else if (item.direction === 't2s') {
                document.querySelector('#direction-t2s').checked = true;
              } else {
                document.querySelector('#direction-auto').checked = true;
              }
              
              // 滚动到输入区域
              chineseInput.scrollIntoView({ behavior: 'smooth' });
            }
          });
        });
        
        historyList.querySelectorAll('.history-delete-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            historyItems = historyItems.filter(h => h.id !== id);
            
            // 保存到本地存储
            localStorage.setItem('chineseConverterHistory', JSON.stringify(historyItems));
            
            // 更新历史记录显示
            renderHistory();
          });
        });
      }
      
      // 检查是否应该折叠说明
      const shouldCollapseInfo = localStorage.getItem('infoCollapsed_chineseConverter') === 'true';
      if (shouldCollapseInfo) {
        const infoContent = container.querySelector('.info-content');
        infoContent.style.display = 'none';
        toggleInfoBtn.innerHTML = '<i class="fa fa-chevron-down"></i>';
      }
      
      // 初始化
      renderHistory();
      
      // 返回清理函数
      return function() {
        // 移除样式
        const styleLink = document.querySelector('link[href="tools/chineseConverter/styles.css"]');
        if (styleLink) {
          document.head.removeChild(styleLink);
        }
      };
    }
  };
  
  // 注册工具
  window.tools = window.tools || {};
  window.tools.chineseConverter = tool;
})();