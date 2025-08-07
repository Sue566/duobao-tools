/**
 * 中文转拼音工具
 */
(function() {
  // 定义工具
  const tool = {
    // 工具初始化时调用
    init: function() {
      // 加载拼音转换库
      if (!window.pinyinUtil) {
        console.log('正在加载拼音转换库...');
        
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/pinyin-pro@3.13.2/dist/index.js';
          document.head.appendChild(script);
          
          script.onload = () => {
            console.log('拼音转换库加载成功');
            window.pinyinUtil = window.pinyinPro;
            resolve();
          };
          
          script.onerror = () => {
            console.error('拼音转换库加载失败');
            // 创建一个简单的备用拼音转换函数
            window.pinyinUtil = {
              pinyin: function(text, options) {
                return text + ' (拼音库加载失败)';
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
          <h2><i class="fa fa-language"></i> 中文转拼音</h2>
          <p class="tool-description">将中文文本转换为拼音，支持多种拼音格式和转换选项。</p>
        </div>
        
        <div class="tool-container">
          <!-- 输入区域 -->
          <div class="tool-input-section">
            <div class="form-group">
              <label for="chinese-input">中文文本</label>
              <textarea id="chinese-input" class="form-control" rows="6" placeholder="请输入需要转换的中文文本..."></textarea>
              <small class="form-text text-muted">支持直接粘贴或拖放文本文件</small>
            </div>
            
            <div class="form-group">
              <label>转换选项</label>
              <div class="options-container">
                <div class="form-check">
                  <input type="radio" name="pinyin-type" id="type-normal" value="normal" checked />
                  <label for="type-normal">普通拼音（nǐ hǎo）</label>
                </div>
                <div class="form-check">
                  <input type="radio" name="pinyin-type" id="type-tone" value="tone" />
                  <label for="type-tone">带声调数字（ni3 hao3）</label>
                </div>
                <div class="form-check">
                  <input type="radio" name="pinyin-type" id="type-toneNum" value="toneNum" />
                  <label for="type-toneNum">仅声调数字（n3 h3）</label>
                </div>
                <div class="form-check">
                  <input type="radio" name="pinyin-type" id="type-none" value="none" />
                  <label for="type-none">不带声调（ni hao）</label>
                </div>
                <div class="form-check">
                  <input type="radio" name="pinyin-type" id="type-first" value="first" />
                  <label for="type-first">首字母（n h）</label>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label>附加选项</label>
              <div class="options-container">
                <div class="form-check">
                  <input type="checkbox" id="option-segment" checked />
                  <label for="option-segment">分词转换（提高多音字准确率）</label>
                </div>
                <div class="form-check">
                  <input type="checkbox" id="option-spacing" checked />
                  <label for="option-spacing">保留空格和标点</label>
                </div>
                <div class="form-check">
                  <input type="checkbox" id="option-capitalize" />
                  <label for="option-capitalize">首字母大写</label>
                </div>
              </div>
            </div>
            
            <!-- 按钮区域 -->
            <div class="tool-actions">
              <button id="convert-btn" class="btn btn-primary"><i class="fa fa-exchange"></i> 转换</button>
              <button id="clear-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
              <button id="example-btn" class="btn btn-info"><i class="fa fa-lightbulb-o"></i> 示例</button>
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
            
            <div class="tool-result" id="pinyin-result">
              <div class="no-result">
                <i class="fa fa-info-circle"></i>
                <p>点击"转换"按钮开始</p>
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
              <p>中文转拼音工具可以将中文文本转换为对应的拼音形式，支持多种拼音格式和转换选项，适用于学习汉语、输入法辅助、文本处理等场景。</p>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-list-ol"></i> 转换选项说明</h4>
              <ul>
                <li><strong>普通拼音</strong> - 带声调符号的拼音，如"你好"转换为"nǐ hǎo"</li>
                <li><strong>带声调数字</strong> - 声调以数字表示，如"你好"转换为"ni3 hao3"</li>
                <li><strong>仅声调数字</strong> - 仅保留声母和声调数字，如"你好"转换为"n3 h3"</li>
                <li><strong>不带声调</strong> - 不带声调的拼音，如"你好"转换为"ni hao"</li>
                <li><strong>首字母</strong> - 仅保留拼音首字母，如"你好"转换为"n h"</li>
              </ul>
              <p>附加选项：</p>
              <ul>
                <li><strong>分词转换</strong> - 启用分词功能，提高多音字转换准确率</li>
                <li><strong>保留空格和标点</strong> - 在转换结果中保留原文的空格和标点符号</li>
                <li><strong>首字母大写</strong> - 将转换结果中每个拼音的首字母大写</li>
              </ul>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-exclamation-triangle"></i> 注意事项</h4>
              <ul>
                <li>对于多音字，工具会尝试根据上下文选择最合适的读音，但可能存在不准确的情况</li>
                <li>特殊字符和非中文字符将保持原样</li>
                <li>转换大量文本可能需要较长时间，请耐心等待</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('chineseToPinyin', container.querySelector('.tool-header'));
      
      // 获取元素
      const chineseInput = container.querySelector('#chinese-input');
      const convertBtn = container.querySelector('#convert-btn');
      const clearBtn = container.querySelector('#clear-btn');
      const exampleBtn = container.querySelector('#example-btn');
      const copyResult = container.querySelector('#copy-result');
      const downloadResult = container.querySelector('#download-result');
      const resultContainer = container.querySelector('#pinyin-result');
      const toggleInfoBtn = container.querySelector('.toggle-info-btn');
      
      // 转换按钮点击事件
      convertBtn.addEventListener('click', () => {
        const chinese = chineseInput.value.trim();
        if (!chinese) {
          showToast('请输入需要转换的中文文本', 'warning');
          return;
        }
        
        // 获取转换选项
        const type = document.querySelector('input[name="pinyin-type"]:checked').value;
        const useSegment = document.querySelector('#option-segment').checked;
        const keepSpacing = document.querySelector('#option-spacing').checked;
        const capitalize = document.querySelector('#option-capitalize').checked;
        
        // 显示加载状态
        resultContainer.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i> 正在转换，请稍候...</div>';
        
        // 延迟执行，让UI有时间更新
        setTimeout(() => {
          try {
            // 转换为拼音
            let result = '';
            
            if (window.pinyinUtil) {
              // 使用拼音库转换
              const options = { type: type, toneType: 'symbol', nonZh: 'retain' };
              
              if (type === 'tone') {
                options.toneType = 'num';
              }
              
              result = window.pinyinUtil.pinyin(chinese, options);
              
              // 处理首字母大写
              if (capitalize) {
                result = result.replace(/\b[a-z]/g, letter => letter.toUpperCase());
              }
            } else {
              // 拼音库未加载，显示错误
              result = '拼音转换库未能正确加载，请刷新页面重试。';
            }
            
            // 显示结果
            resultContainer.innerHTML = `
              <div class="result-content">
                <pre>${result}</pre>
              </div>
            `;
            
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
      });
      
      // 示例按钮点击事件
      exampleBtn.addEventListener('click', () => {
        chineseInput.value = '多宝工具箱是一个集合了各种实用在线工具的网站，旨在帮助用户提高工作效率和解决日常问题。\n\n我们提供了文本处理、编码转换、图片处理等多种工具，希望能够满足您的各种需求。';
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
        a.download = '中文转拼音_' + new Date().toISOString().slice(0, 19).replace(/[:-]/g, '') + '.txt';
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
        localStorage.setItem('infoCollapsed_chineseToPinyin', !isCollapsed);
      });
      
      // 检查是否应该折叠说明
      const shouldCollapseInfo = localStorage.getItem('infoCollapsed_chineseToPinyin') === 'true';
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
  window.tools.chineseToPinyin = tool;
})();