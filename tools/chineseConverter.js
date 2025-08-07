/**
 * 多宝工具箱 - 中文繁简转换工具
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
    
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-exchange"></i> 中文繁简转换</h2>
          <p class="tool-description">在简体中文和繁体中文之间进行转换，支持批量文本处理和多种转换选项。</p>
        </div>
        
        <div class="tool-container">
          <!-- 输入区域 -->
          <div class="tool-input-section">
            <div class="form-group">
              <label for="chinese-input">输入文本</label>
              <textarea id="chinese-input" class="form-control" rows="6" placeholder="请输入需要转换的中文文本..."></textarea>
              <small class="form-text text-muted">支持直接粘贴或拖放文本文件</small>
            </div>
            
            <div class="form-group">
              <label>转换方向</label>
              <div class="options-container">
                <div class="form-check">
                  <input type="radio" name="convert-direction" id="direction-s2t" value="s2t" checked />
                  <label for="direction-s2t">简体 → 繁体</label>
                </div>
                <div class="form-check">
                  <input type="radio" name="convert-direction" id="direction-t2s" value="t2s" />
                  <label for="direction-t2s">繁体 → 简体</label>
                </div>
                <div class="form-check">
                  <input type="radio" name="convert-direction" id="direction-auto" value="auto" />
                  <label for="direction-auto">自动检测</label>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label>转换选项</label>
              <div class="options-container">
                <div class="form-check">
                  <input type="checkbox" id="option-hongkong" />
                  <label for="option-hongkong">香港繁体（仅繁体转换时有效）</label>
                </div>
                <div class="form-check">
                  <input type="checkbox" id="option-taiwan" />
                  <label for="option-taiwan">台湾繁体（仅繁体转换时有效）</label>
                </div>
                <div class="form-check">
                  <input type="checkbox" id="option-keep-punctuation" checked />
                  <label for="option-keep-punctuation">保留原有标点符号</label>
                </div>
              </div>
            </div>
            
            <!-- 按钮区域 -->
            <div class="tool-actions">
              <button id="convert-btn" class="btn btn-primary"><i class="fa fa-exchange"></i> 转换</button>
              <button id="clear-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
              <button id="example-btn" class="btn btn-info"><i class="fa fa-lightbulb-o"></i> 示例</button>
              <button id="swap-btn" class="btn"><i class="fa fa-refresh"></i> 交换文本</button>
            </div>
          </div>
          
          <!-- 结果区域 -->
          <div class="tool-result-section">
            <div class="result-header">
              <h3><i class="fa fa-check-circle"></i> 转换结果</h3>
              <div class="result-actions">
                <button id="copy-result" class="btn btn-sm btn-outline"><i class="fa fa-copy"></i> 复制</button>
                <button id="download-result" class="btn btn-sm btn-outline"><i class="fa fa-download"></i> 下载</button>
              </div>
            </div>
            
            <div class="tool-result" id="conversion-result">
              <div class="no-result">
                <i class="fa fa-info-circle"></i>
                <p>点击"转换"按钮开始</p>
              </div>
            </div>
            
            <!-- 转换统计信息 -->
            <div class="result-stats" id="result-stats" style="display: none;">
              <div class="stat-item">
                <span class="stat-label">转换字符数:</span>
                <span class="stat-value" id="converted-chars">0</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">处理时间:</span>
                <span class="stat-value" id="process-time">0 ms</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 工具说明区域 -->
        <div class="tool-info">
          <div class="info-header">
            <h3><i class="fa fa-question-circle"></i> 使用指南</h3>
            <button class="toggle-info-btn" title="展开/收起说明"><i class="fa fa-chevron-up"></i></button>
          </div>
          <div class="info-content">
            <div class="info-item">
              <h4><i class="fa fa-info-circle"></i> 功能介绍</h4>
              <p>中文繁简转换工具可以在简体中文和繁体中文之间进行快速转换，支持批量文本处理，适用于文档本地化、学习研究、文献阅读等多种场景。</p>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-list-ol"></i> 转换选项说明</h4>
              <ul>
                <li><strong>简体 → 繁体</strong> - 将简体中文文本转换为繁体中文</li>
                <li><strong>繁体 → 简体</strong> - 将繁体中文文本转换为简体中文</li>
                <li><strong>自动检测</strong> - 自动检测文本类型并进行相应转换</li>
                <li><strong>香港繁体</strong> - 使用香港地区常用的繁体字形和用字习惯</li>
                <li><strong>台湾繁体</strong> - 使用台湾地区常用的繁体字形和用字习惯</li>
                <li><strong>保留原有标点符号</strong> - 保留原文中的标点符号不进行转换</li>
              </ul>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-lightbulb-o"></i> 使用技巧</h4>
              <ul>
                <li>使用"自动检测"选项可以智能判断文本是简体还是繁体，并进行相应转换</li>
                <li>对于混合文本，建议先转换为简体，再转换为繁体，以获得更一致的结果</li>
                <li>使用"交换文本"按钮可以快速将转换结果作为输入进行再次转换</li>
                <li>转换大量文本时，可能需要等待几秒钟，请耐心等待</li>
              </ul>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-exclamation-triangle"></i> 注意事项</h4>
              <ul>
                <li>繁简转换主要针对汉字，非中文字符将保持不变</li>
                <li>某些词汇在不同地区有不同的用字习惯，转换结果可能需要人工校对</li>
                <li>自动检测功能基于文本中简繁体字符的比例，对于混合文本可能不够准确</li>
                <li>香港繁体和台湾繁体选项会影响某些专有名词和习惯用语的转换结果</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      
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
        window.copyToClipboard(text);
        showToast('结果已复制到剪贴板', 'success');
      });
      
      // 下载结果按钮点击事件
      downloadResult.addEventListener('click', () => {
        const resultContent = resultContainer.querySelector('.result-content');
        if (!resultContent) {
          showToast('没有可下载的结果', 'warning');
          return;
        }
        
        const text = resultContent.textContent;
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // 获取转换方向
        const direction = document.querySelector('input[name="convert-direction"]:checked').value;
        let directionText = '繁简转换';
        if (direction === 's2t') directionText = '简转繁';
        if (direction === 't2s') directionText = '繁转简';
        
        a.download = `中文${directionText}_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('结果已下载', 'success');
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
      
      // 检查是否应该折叠说明
      const shouldCollapseInfo = localStorage.getItem('infoCollapsed_chineseConverter') === 'true';
      if (shouldCollapseInfo) {
        const infoContent = container.querySelector('.info-content');
        infoContent.style.display = 'none';
        toggleInfoBtn.innerHTML = '<i class="fa fa-chevron-down"></i>';
      }
      
      // 检测文本类型（简体或繁体）
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
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .tool-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .tool-input-section {
          flex: 1;
          min-width: 300px;
        }
        
        .tool-result-section {
          flex: 1;
          min-width: 300px;
        }
        
        .options-container {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 10px;
        }
        
        .form-check {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .tool-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }
        
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .result-actions {
          display: flex;
          gap: 10px;
        }
        
        .tool-result {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
          min-height: 200px;
          max-height: 400px;
          overflow: auto;
        }
        
        .no-result, .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 170px;
          color: var(--text-muted);
          text-align: center;
        }
        
        .loading i {
          font-size: 24px;
          margin-bottom: 10px;
        }
        
        .error-result {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 170px;
          color: #e74c3c;
          text-align: center;
        }
        
        .error-result i {
          font-size: 32px;
          margin-bottom: 10px;
        }
        
        .result-content {
          white-space: pre-wrap;
          word-break: break-all;
        }
        
        .result-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 15px;
          padding: 10px 15px;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 14px;
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .stat-label {
          color: var(--text-muted);
        }
        
        .stat-value {
          font-weight: 500;
        }
        
        .tool-info {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
          margin-top: 20px;
        }
        
        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .info-header h3 {
          margin: 0;
        }
        
        .toggle-info-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-color);
        }
        
        .info-content {
          padding: 15px;
        }
        
        .info-item {
          margin-bottom: 20px;
        }
        
        .info-item:last-child {
          margin-bottom: 0;
        }
        
        .info-item h4 {
          margin-top: 0;
          margin-bottom: 10px;
        }
        
        .info-item p {
          margin: 0 0 10px 0;
        }
        
        .info-item ul, .info-item ol {
          margin-top: 5px;
          margin-bottom: 5px;
          padding-left: 20px;
        }
        
        @media (max-width: 768px) {
          .tool-container {
            flex-direction: column;
          }
        }
      `;
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.chineseConverter = tool;
})();