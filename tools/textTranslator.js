/**
 * 多宝工具箱 - 文本翻译工具
 */
(function() {
  // 定义工具
  const tool = {
    // 工具初始化时调用
    init: function() {
      // 加载翻译API库
      if (!window.translationAPI) {
        console.log('初始化翻译API...');
        
        // 创建简单的翻译API接口
        window.translationAPI = {
          // 支持的语言列表
          languages: [
            { code: 'auto', name: '自动检测' },
            { code: 'zh', name: '中文' },
            { code: 'en', name: '英语' },
            { code: 'ja', name: '日语' },
            { code: 'ko', name: '韩语' },
            { code: 'fr', name: '法语' },
            { code: 'de', name: '德语' },
            { code: 'es', name: '西班牙语' },
            { code: 'it', name: '意大利语' },
            { code: 'ru', name: '俄语' },
            { code: 'ar', name: '阿拉伯语' },
            { code: 'pt', name: '葡萄牙语' },
            { code: 'vi', name: '越南语' },
            { code: 'th', name: '泰语' }
          ],
          
          // 翻译函数
          translate: async function(text, from, to) {
            if (!text) return '';
            
            try {
              // 这里使用免费的翻译API
              const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
              
              const response = await fetch(url);
              const data = await response.json();
              
              if (data && data.responseData && data.responseData.translatedText) {
                return data.responseData.translatedText;
              } else if (data.responseStatus && data.responseStatus !== 200) {
                throw new Error(data.responseDetails || '翻译失败');
              } else {
                throw new Error('无法获取翻译结果');
              }
            } catch (error) {
              console.error('翻译错误:', error);
              throw error;
            }
          },
          
          // 检测语言
          detect: async function(text) {
            if (!text) return 'auto';
            
            try {
              // 简单的语言检测逻辑
              // 中文字符范围
              const zhPattern = /[\u4e00-\u9fa5]/;
              // 日语特有字符范围
              const jaPattern = /[\u3040-\u309F\u30A0-\u30FF]/;
              // 韩语字符范围
              const koPattern = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF]/;
              // 俄语字符范围
              const ruPattern = /[\u0400-\u04FF]/;
              // 阿拉伯语字符范围
              const arPattern = /[\u0600-\u06FF]/;
              
              if (zhPattern.test(text)) return 'zh';
              if (jaPattern.test(text)) return 'ja';
              if (koPattern.test(text)) return 'ko';
              if (ruPattern.test(text)) return 'ru';
              if (arPattern.test(text)) return 'ar';
              
              // 默认假设是英语
              return 'en';
            } catch (error) {
              console.error('语言检测错误:', error);
              return 'auto';
            }
          }
        };
      }
    },
    
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-language"></i> 文本翻译</h2>
          <p class="tool-description">在线翻译工具，支持多种语言之间的互译，帮助您快速翻译文本内容。</p>
        </div>
        
        <div class="tool-container">
          <!-- 输入区域 -->
          <div class="tool-input-section">
            <div class="language-selector">
              <select id="source-language" class="form-control">
                <option value="auto">自动检测</option>
                <option value="zh">中文</option>
                <option value="en">英语</option>
                <option value="ja">日语</option>
                <option value="ko">韩语</option>
                <option value="fr">法语</option>
                <option value="de">德语</option>
                <option value="es">西班牙语</option>
                <option value="it">意大利语</option>
                <option value="ru">俄语</option>
                <option value="ar">阿拉伯语</option>
                <option value="pt">葡萄牙语</option>
                <option value="vi">越南语</option>
                <option value="th">泰语</option>
              </select>
              
              <button id="swap-languages" class="btn btn-icon" title="交换语言">
                <i class="fa fa-exchange"></i>
              </button>
              
              <select id="target-language" class="form-control">
                <option value="zh">中文</option>
                <option value="en">英语</option>
                <option value="ja">日语</option>
                <option value="ko">韩语</option>
                <option value="fr">法语</option>
                <option value="de">德语</option>
                <option value="es">西班牙语</option>
                <option value="it">意大利语</option>
                <option value="ru">俄语</option>
                <option value="ar">阿拉伯语</option>
                <option value="pt">葡萄牙语</option>
                <option value="vi">越南语</option>
                <option value="th">泰语</option>
              </select>
            </div>
            
            <div class="form-group">
              <textarea id="source-text" class="form-control" rows="6" placeholder="请输入需要翻译的文本..."></textarea>
              <div class="text-actions">
                <button id="clear-source" class="btn btn-sm btn-outline"><i class="fa fa-times"></i> 清空</button>
                <button id="detect-language" class="btn btn-sm btn-outline"><i class="fa fa-magic"></i> 检测语言</button>
              </div>
            </div>
            
            <div class="tool-actions">
              <button id="translate-btn" class="btn btn-primary"><i class="fa fa-language"></i> 翻译</button>
              <button id="example-btn" class="btn btn-info"><i class="fa fa-lightbulb-o"></i> 示例</button>
            </div>
          </div>
          
          <!-- 结果区域 -->
          <div class="tool-result-section">
            <div class="result-header">
              <h3><i class="fa fa-check-circle"></i> 翻译结果</h3>
              <div class="result-actions">
                <button id="copy-result" class="btn btn-sm btn-outline"><i class="fa fa-copy"></i> 复制</button>
                <button id="listen-result" class="btn btn-sm btn-outline"><i class="fa fa-volume-up"></i> 朗读</button>
                <button id="download-result" class="btn btn-sm btn-outline"><i class="fa fa-download"></i> 下载</button>
              </div>
            </div>
            
            <div class="tool-result" id="translation-result">
              <div class="no-result">
                <i class="fa fa-info-circle"></i>
                <p>翻译结果将显示在这里</p>
              </div>
            </div>
            
            <div class="translation-history" id="history-container" style="display: none;">
              <h4><i class="fa fa-history"></i> 翻译历史</h4>
              <div id="history-list" class="history-list"></div>
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
              <p>文本翻译工具可以帮助您快速翻译不同语言之间的文本内容，支持多种常用语言，适用于学习外语、阅读外文资料、跨语言交流等场景。</p>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-list-ol"></i> 使用步骤</h4>
              <ol>
                <li>选择源语言（或使用自动检测）和目标语言</li>
                <li>在输入框中输入需要翻译的文本</li>
                <li>点击"翻译"按钮开始翻译</li>
                <li>查看翻译结果，可以复制、朗读或下载结果</li>
              </ol>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-lightbulb-o"></i> 使用技巧</h4>
              <ul>
                <li>使用"检测语言"按钮可以自动识别输入文本的语言</li>
                <li>点击语言之间的交换按钮可以快速切换源语言和目标语言</li>
                <li>翻译结果支持文本朗读功能，帮助您学习正确的发音</li>
                <li>系统会保存最近的翻译历史，方便您查看之前的翻译内容</li>
              </ul>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-exclamation-triangle"></i> 注意事项</h4>
              <ul>
                <li>翻译结果的准确性可能受到多种因素影响，仅供参考</li>
                <li>对于专业术语或特定领域的文本，建议结合专业知识理解翻译结果</li>
                <li>翻译API可能有调用次数限制，如遇到频繁使用限制，请稍后再试</li>
                <li>朗读功能需要浏览器支持语音合成API</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('textTranslator', container.querySelector('.tool-header'));
      
      // 获取元素
      const sourceLanguage = container.querySelector('#source-language');
      const targetLanguage = container.querySelector('#target-language');
      const swapLanguages = container.querySelector('#swap-languages');
      const sourceText = container.querySelector('#source-text');
      const clearSource = container.querySelector('#clear-source');
      const detectLanguage = container.querySelector('#detect-language');
      const translateBtn = container.querySelector('#translate-btn');
      const exampleBtn = container.querySelector('#example-btn');
      const resultContainer = container.querySelector('#translation-result');
      const copyResult = container.querySelector('#copy-result');
      const listenResult = container.querySelector('#listen-result');
      const downloadResult = container.querySelector('#download-result');
      const historyContainer = container.querySelector('#history-container');
      const historyList = container.querySelector('#history-list');
      const toggleInfoBtn = container.querySelector('.toggle-info-btn');
      
      // 设置默认目标语言
      // 如果浏览器语言是中文，默认目标语言设为英语；否则设为中文
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'zh') {
        targetLanguage.value = 'en';
      } else {
        targetLanguage.value = 'zh';
      }
      
      // 交换语言
      swapLanguages.addEventListener('click', () => {
        // 不能交换自动检测
        if (sourceLanguage.value === 'auto') {
          showToast('自动检测语言不能交换', 'warning');
          return;
        }
        
        const temp = sourceLanguage.value;
        sourceLanguage.value = targetLanguage.value;
        targetLanguage.value = temp;
        
        // 如果已有翻译结果和源文本，也交换它们
        const resultContent = resultContainer.querySelector('.result-content');
        if (resultContent && sourceText.value) {
          const tempText = sourceText.value;
          sourceText.value = resultContent.textContent;
          resultContent.textContent = tempText;
        }
      });
      
      // 清空源文本
      clearSource.addEventListener('click', () => {
        sourceText.value = '';
        sourceText.focus();
      });
      
      // 检测语言
      detectLanguage.addEventListener('click', async () => {
        const text = sourceText.value.trim();
        if (!text) {
          showToast('请先输入文本', 'warning');
          return;
        }
        
        try {
          detectLanguage.disabled = true;
          detectLanguage.innerHTML = '<i class="fa fa-spinner fa-spin"></i> 检测中...';
          
          const detectedLang = await window.translationAPI.detect(text);
          
          // 更新源语言选择
          if (detectedLang !== 'auto') {
            sourceLanguage.value = detectedLang;
            
            // 获取语言名称
            const langName = window.translationAPI.languages.find(l => l.code === detectedLang)?.name || detectedLang;
            showToast(`检测到语言: ${langName}`, 'success');
          } else {
            showToast('无法确定语言，请手动选择', 'warning');
          }
        } catch (error) {
          console.error('语言检测错误:', error);
          showToast('语言检测失败: ' + error.message, 'error');
        } finally {
          detectLanguage.disabled = false;
          detectLanguage.innerHTML = '<i class="fa fa-magic"></i> 检测语言';
        }
      });
      
      // 翻译按钮点击事件
      translateBtn.addEventListener('click', async () => {
        const text = sourceText.value.trim();
        if (!text) {
          showToast('请输入需要翻译的文本', 'warning');
          return;
        }
        
        const from = sourceLanguage.value;
        const to = targetLanguage.value;
        
        // 显示加载状态
        resultContainer.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i> 正在翻译，请稍候...</div>';
        translateBtn.disabled = true;
        translateBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> 翻译中...';
        
        try {
          const result = await window.translationAPI.translate(text, from, to);
          
          // 显示结果
          resultContainer.innerHTML = `
            <div class="result-content">
              ${result}
            </div>
          `;
          
          // 添加到历史记录
          addToHistory(text, result, from, to);
          
          // 显示成功提示
          showToast('翻译完成', 'success');
        } catch (error) {
          console.error('翻译错误:', error);
          
          // 显示错误
          resultContainer.innerHTML = `
            <div class="error-result">
              <i class="fa fa-exclamation-triangle"></i>
              <p>翻译出错: ${error.message}</p>
              <small>请稍后重试或尝试其他翻译服务</small>
            </div>
          `;
          
          // 显示错误提示
          showToast('翻译失败: ' + error.message, 'error');
        } finally {
          translateBtn.disabled = false;
          translateBtn.innerHTML = '<i class="fa fa-language"></i> 翻译';
        }
      });
      
      // 示例按钮点击事件
      exampleBtn.addEventListener('click', () => {
        // 根据当前源语言选择示例文本
        let exampleText = '';
        
        if (sourceLanguage.value === 'zh' || sourceLanguage.value === 'auto') {
          exampleText = '多宝工具箱是一个集合了各种实用在线工具的网站，旨在帮助用户提高工作效率和解决日常问题。我们提供了文本处理、编码转换、图片处理等多种工具，希望能够满足您的各种需求。';
          sourceLanguage.value = 'zh';
        } else if (sourceLanguage.value === 'en') {
          exampleText = 'The Multi-treasure Toolbox is a website that collects various practical online tools, aiming to help users improve work efficiency and solve daily problems. We provide a variety of tools such as text processing, encoding conversion, image processing, etc., hoping to meet your various needs.';
        } else if (sourceLanguage.value === 'ja') {
          exampleText = 'マルチトレジャーツールボックスは、さまざまな実用的なオンラインツールを集めたウェブサイトで、ユーザーの作業効率を向上させ、日常の問題を解決することを目的としています。テキスト処理、エンコード変換、画像処理などのさまざまなツールを提供しており、さまざまなニーズを満たすことを願っています。';
        } else {
          exampleText = 'Hello, world! This is a sample text for translation. Please translate this text to see how the translation tool works.';
          sourceLanguage.value = 'en';
        }
        
        sourceText.value = exampleText;
        showToast('已加载示例文本', 'info');
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
      
      // 朗读结果按钮点击事件
      listenResult.addEventListener('click', () => {
        const resultContent = resultContainer.querySelector('.result-content');
        if (!resultContent) {
          showToast('没有可朗读的内容', 'warning');
          return;
        }
        
        const text = resultContent.textContent;
        
        // 检查浏览器是否支持语音合成
        if ('speechSynthesis' in window) {
          // 停止之前的朗读
          window.speechSynthesis.cancel();
          
          // 创建语音对象
          const speech = new SpeechSynthesisUtterance(text);
          
          // 设置语言
          speech.lang = targetLanguage.value;
          
          // 开始朗读
          window.speechSynthesis.speak(speech);
          
          // 更新按钮状态
          listenResult.innerHTML = '<i class="fa fa-volume-up"></i> 朗读中...';
          
          // 朗读结束后恢复按钮
          speech.onend = () => {
            listenResult.innerHTML = '<i class="fa fa-volume-up"></i> 朗读';
          };
          
          // 朗读错误处理
          speech.onerror = () => {
            listenResult.innerHTML = '<i class="fa fa-volume-up"></i> 朗读';
            showToast('朗读失败，请重试', 'error');
          };
        } else {
          showToast('您的浏览器不支持语音合成功能', 'error');
        }
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
        
        // 获取源语言和目标语言的名称
        const fromLang = sourceLanguage.options[sourceLanguage.selectedIndex].text;
        const toLang = targetLanguage.options[targetLanguage.selectedIndex].text;
        
        a.download = `翻译结果_${fromLang}到${toLang}_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('结果已下载', 'success');
      });
      
      // 添加到历史记录
      function addToHistory(sourceText, resultText, fromLang, toLang) {
        try {
          // 获取历史记录
          let history = JSON.parse(localStorage.getItem('translationHistory')) || [];
          
          // 添加新记录
          const newRecord = {
            id: Date.now(),
            sourceText: sourceText.length > 100 ? sourceText.substring(0, 100) + '...' : sourceText,
            resultText: resultText.length > 100 ? resultText.substring(0, 100) + '...' : resultText,
            fromLang,
            toLang,
            timestamp: new Date().toISOString()
          };
          
          // 添加到开头
          history.unshift(newRecord);
          
          // 限制数量
          if (history.length > 10) {
            history = history.slice(0, 10);
          }
          
          // 保存历史记录
          localStorage.setItem('translationHistory', JSON.stringify(history));
          
          // 更新历史记录显示
          updateHistoryDisplay(history);
        } catch (e) {
          console.error('保存历史记录失败', e);
        }
      }
      
      // 更新历史记录显示
      function updateHistoryDisplay(history) {
        if (!history || history.length === 0) {
          historyContainer.style.display = 'none';
          return;
        }
        
        historyContainer.style.display = 'block';
        historyList.innerHTML = '';
        
        history.forEach(record => {
          const fromLangName = window.translationAPI.languages.find(l => l.code === record.fromLang)?.name || record.fromLang;
          const toLangName = window.translationAPI.languages.find(l => l.code === record.toLang)?.name || record.toLang;
          
          const item = document.createElement('div');
          item.className = 'history-item';
          item.innerHTML = `
            <div class="history-content">
              <div class="history-text">
                <div class="source-text">${record.sourceText}</div>
                <div class="result-text">${record.resultText}</div>
              </div>
              <div class="history-meta">
                <span class="history-langs">${fromLangName} → ${toLangName}</span>
                <span class="history-time">${formatTime(record.timestamp)}</span>
              </div>
            </div>
            <div class="history-actions">
              <button class="btn-icon history-use" title="使用此翻译" data-id="${record.id}">
                <i class="fa fa-reply"></i>
              </button>
              <button class="btn-icon history-delete" title="删除记录" data-id="${record.id}">
                <i class="fa fa-times"></i>
              </button>
            </div>
          `;
          
          historyList.appendChild(item);
        });
        
        // 添加使用历史记录事件
        historyList.querySelectorAll('.history-use').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const record = history.find(r => r.id == id);
            if (record) {
              // 填充翻译表单
              sourceLanguage.value = record.fromLang;
              targetLanguage.value = record.toLang;
              sourceText.value = record.sourceText.endsWith('...') ? 
                record.sourceText.substring(0, record.sourceText.length - 3) : 
                record.sourceText;
              
              showToast('已加载历史记录', 'info');
            }
          });
        });
        
        // 添加删除历史记录事件
        historyList.querySelectorAll('.history-delete').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const newHistory = history.filter(r => r.id != id);
            
            // 保存更新后的历史记录
            localStorage.setItem('translationHistory', JSON.stringify(newHistory));
            
            // 更新显示
            updateHistoryDisplay(newHistory);
            
            showToast('已删除历史记录', 'info');
          });
        });
      }
      
      // 格式化时间
      function formatTime(timestamp) {
        try {
          const date = new Date(timestamp);
          const now = new Date();
          const diff = now - date;
          
          // 一分钟内
          if (diff < 60 * 1000) {
            return '刚刚';
          }
          
          // 一小时内
          if (diff < 60 * 60 * 1000) {
            return `${Math.floor(diff / (60 * 1000))}分钟前`;
          }
          
          // 一天内
          if (diff < 24 * 60 * 60 * 1000) {
            return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
          }
          
          // 一周内
          if (diff < 7 * 24 * 60 * 60 * 1000) {
            return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`;
          }
          
          // 其他情况显示日期
          return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        } catch (e) {
          return '未知时间';
        }
      }
      
      // 加载历史记录
      try {
        const history = JSON.parse(localStorage.getItem('translationHistory')) || [];
        updateHistoryDisplay(history);
      } catch (e) {
        console.error('加载历史记录失败', e);
      }
      
      // 使用说明折叠/展开
      toggleInfoBtn.addEventListener('click', () => {
        const infoContent = container.querySelector('.info-content');
        const isCollapsed = infoContent.style.display === 'none';
        
        infoContent.style.display = isCollapsed ? 'block' : 'none';
        toggleInfoBtn.innerHTML = isCollapsed ? 
          '<i class="fa fa-chevron-up"></i>' : 
          '<i class="fa fa-chevron-down"></i>';
        
        // 保存偏好
        localStorage.setItem('infoCollapsed_textTranslator', !isCollapsed);
      });
      
      // 检查是否应该折叠说明
      const shouldCollapseInfo = localStorage.getItem('infoCollapsed_textTranslator') === 'true';
      if (shouldCollapseInfo) {
        const infoContent = container.querySelector('.info-content');
        infoContent.style.display = 'none';
        toggleInfoBtn.innerHTML = '<i class="fa fa-chevron-down"></i>';
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
        
        .language-selector {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .language-selector select {
          flex: 1;
        }
        
        .btn-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          background-color: var(--border-color);
          border: none;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .btn-icon:hover {
          background-color: var(--hover-bg);
        }
        
        .text-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 5px;
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
        
        .translation-history {
          margin-top: 20px;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
        }
        
        .translation-history h4 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 16px;
        }
        
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background-color: var(--bg-color);
        }
        
        .history-content {
          flex: 1;
          overflow: hidden;
        }
        
        .history-text {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .source-text {
          color: var(--text-color);
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .result-text {
          color: var(--text-muted);
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .history-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 5px;
          font-size: 12px;
          color: var(--text-muted);
        }
        
        .history-actions {
          display: flex;
          gap: 5px;
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
  window.tools.textTranslator = tool;
})();
