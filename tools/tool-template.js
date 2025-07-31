/**
 * 多宝工具箱 - 工具模板
 * 
 * 使用说明：
 * 1. 复制此文件并重命名为你的工具名称，如 myTool.js
 * 2. 修改工具ID、名称、描述和图标
 * 3. 实现工具的界面和功能
 * 4. 在 tools-loader.js 中注册你的工具
 * 
 * 提示：
 * - 图标使用 Font Awesome 图标库，可在 https://fontawesome.com/v4.7.0/icons/ 查找
 * - 工具ID应使用驼峰命名法，如 textConverter, imageResizer 等
 * - 确保工具ID在整个工具箱中唯一
 */
(function() {
  // 定义工具
  const tool = {
    // 工具初始化时调用
    init: function() {
      // 可选：在这里进行工具初始化操作
      // 例如：加载外部库、预处理数据等
      console.log('工具模板初始化');
      
      // 如果需要加载外部库，可以使用以下代码
      /*
      if (!window.ExternalLibrary) {
        const script = document.createElement('script');
        script.src = 'https://cdn.example.com/external-library.min.js';
        document.head.appendChild(script);
        
        return new Promise((resolve) => {
          script.onload = () => {
            console.log('外部库加载成功');
            resolve();
          };
          script.onerror = () => {
            console.error('外部库加载失败');
            showToast('外部库加载失败，部分功能可能无法使用', 'error');
            resolve();
          };
        });
      }
      */
    },
    
    // 渲染工具界面
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-wrench"></i> 工具名称</h2>
          <p class="tool-description">工具描述文本，说明工具的用途和功能。</p>
        </div>
        
        <div class="tool-container">
          <!-- 输入区域 -->
          <div class="tool-input-section">
            <!-- 文本输入示例 -->
            <div class="form-group">
              <label for="input-field">文本输入</label>
              <textarea id="input-field" class="form-control" rows="5" placeholder="请输入文本..."></textarea>
              <small class="form-text text-muted">提示信息：在这里可以添加输入字段的说明</small>
            </div>
            
            <!-- 数字输入示例 -->
            <div class="form-group">
              <label for="number-input">数字输入</label>
              <div class="input-with-unit">
                <input type="number" id="number-input" class="form-control" value="10" min="0" max="100" step="1" />
                <span class="unit">单位</span>
              </div>
            </div>
            
            <!-- 选择框示例 -->
            <div class="form-group">
              <label for="select-input">下拉选择</label>
              <select id="select-input" class="form-control">
                <option value="option1">选项一</option>
                <option value="option2">选项二</option>
                <option value="option3">选项三</option>
              </select>
            </div>
            
            <!-- 复选框示例 -->
            <div class="form-group">
              <label>复选框选项</label>
              <div class="options-container">
                <div class="form-check">
                  <input type="checkbox" id="option1" />
                  <label for="option1">选项1</label>
                </div>
                <div class="form-check">
                  <input type="checkbox" id="option2" />
                  <label for="option2">选项2</label>
                </div>
                <div class="form-check">
                  <input type="checkbox" id="option3" />
                  <label for="option3">选项3</label>
                </div>
              </div>
            </div>
            
            <!-- 单选框示例 -->
            <div class="form-group">
              <label>单选框选项</label>
              <div class="options-container">
                <div class="form-check">
                  <input type="radio" name="radio-option" id="radio1" value="radio1" checked />
                  <label for="radio1">选项1</label>
                </div>
                <div class="form-check">
                  <input type="radio" name="radio-option" id="radio2" value="radio2" />
                  <label for="radio2">选项2</label>
                </div>
              </div>
            </div>
            
            <!-- 滑块示例 -->
            <div class="form-group">
              <label for="slider-input">滑块控制</label>
              <div class="range-with-value">
                <input type="range" id="slider-input" min="0" max="100" value="50" />
                <span id="slider-value">50%</span>
              </div>
            </div>
            
            <!-- 文件上传示例 -->
            <div class="form-group">
              <label for="file-input">文件上传</label>
              <div class="file-input-container">
                <input type="file" id="file-input" accept=".txt,.json,.csv" />
                <label for="file-input" class="file-input-label">
                  <i class="fa fa-upload"></i> 选择文件
                </label>
                <span id="file-name">未选择文件</span>
              </div>
            </div>
            
            <!-- 按钮区域 -->
            <div class="tool-actions">
              <button id="process-btn" class="btn btn-success"><i class="fa fa-play"></i> 执行</button>
              <button id="clear-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
              <button id="example-btn" class="btn"><i class="fa fa-lightbulb-o"></i> 示例</button>
            </div>
          </div>
          
          <!-- 结果区域 -->
          <div class="tool-result-section">
            <div class="result-header">
              <h3>结果</h3>
              <div class="result-actions">
                <button id="copy-result" class="btn btn-sm"><i class="fa fa-copy"></i> 复制结果</button>
                <button id="download-result" class="btn btn-sm"><i class="fa fa-download"></i> 下载结果</button>
              </div>
            </div>
            
            <div class="tool-result" id="tool-result">
              <div class="no-result">点击"执行"按钮开始</div>
            </div>
          </div>
        </div>
        
        <!-- 工具说明区域 -->
        <div class="tool-info">
          <div class="info-header">
            <h3>使用说明</h3>
          </div>
          <div class="info-content">
            <div class="info-item">
              <h4>功能介绍</h4>
              <p>在这里详细介绍工具的功能和使用场景。</p>
            </div>
            
            <div class="info-item">
              <h4>使用方法</h4>
              <p>在这里说明如何使用此工具的步骤。</p>
              <ol>
                <li>第一步：输入数据</li>
                <li>第二步：选择选项</li>
                <li>第三步：点击执行按钮</li>
              </ol>
            </div>
            
            <div class="info-item">
              <h4>高级技巧</h4>
              <p>在这里可以添加一些高级用法和技巧。</p>
              <ul>
                <li>技巧一：可以使用快捷键 Ctrl+Enter 快速执行</li>
                <li>技巧二：支持拖放文件到输入框</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('toolId', container.querySelector('.tool-header'));
      
      // 获取元素
      const inputField = container.querySelector('#input-field');
      const numberInput = container.querySelector('#number-input');
      const selectInput = container.querySelector('#select-input');
      const option1 = container.querySelector('#option1');
      const option2 = container.querySelector('#option2');
      const option3 = container.querySelector('#option3');
      const sliderInput = container.querySelector('#slider-input');
      const sliderValue = container.querySelector('#slider-value');
      const fileInput = container.querySelector('#file-input');
      const fileName = container.querySelector('#file-name');
      const processBtn = container.querySelector('#process-btn');
      const clearBtn = container.querySelector('#clear-btn');
      const exampleBtn = container.querySelector('#example-btn');
      const copyResult = container.querySelector('#copy-result');
      const downloadResult = container.querySelector('#download-result');
      const resultContainer = container.querySelector('#tool-result');
      
      // 滑块值更新
      sliderInput.addEventListener('input', () => {
        sliderValue.textContent = `${sliderInput.value}%`;
      });
      
      // 文件选择处理
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          fileName.textContent = e.target.files[0].name;
        } else {
          fileName.textContent = '未选择文件';
        }
      });
      
      // 示例数据
      const examples = [
        "这是示例文本1，用于演示工具功能。",
        "这是示例文本2，包含一些特殊字符：!@#$%^&*()。",
        "这是示例文本3，包含数字123和英文ABC。"
      ];
      
      // 加载示例
      exampleBtn.addEventListener('click', () => {
        const randomExample = examples[Math.floor(Math.random() * examples.length)];
        inputField.value = randomExample;
        option1.checked = Math.random() > 0.5;
        option2.checked = Math.random() > 0.5;
        sliderInput.value = Math.floor(Math.random() * 100);
        sliderValue.textContent = `${sliderInput.value}%`;
      });
      
      // 处理功能
      function processInput() {
        const input = inputField.value.trim();
        if (!input) {
          showToast('请输入内容', 'warning');
          return;
        }
        
        // 显示加载状态
        resultContainer.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i> 正在处理，请稍候...</div>';
        
        // 模拟异步处理
        setTimeout(() => {
          try {
            // 在这里实现工具的核心功能
            let result = input;
            
            // 获取各种输入值
            const number = parseInt(numberInput.value);
            const selectedOption = selectInput.value;
            const useOption1 = option1.checked;
            const useOption2 = option2.checked;
            const useOption3 = option3.checked;
            const sliderVal = parseInt(sliderInput.value);
            
            // 根据选项处理输入
            if (useOption1) {
              result = result.toUpperCase();
            }
            
            if (useOption2) {
              result = result.split('').reverse().join('');
            }
            
            if (useOption3) {
              result = result.repeat(2);
            }
            
            // 根据选择框选项处理
            if (selectedOption === 'option1') {
              result = `选项一处理: ${result}`;
            } else if (selectedOption === 'option2') {
              result = `选项二处理: ${result}`;
            } else if (selectedOption === 'option3') {
              result = `选项三处理: ${result}`;
            }
            
            // 显示结果
            displayResult(result);
          } catch (error) {
            // 显示错误
            resultContainer.innerHTML = `
              <div class="error-result">
                <i class="fa fa-exclamation-triangle"></i>
                <p>处理出错: ${error.message}</p>
              </div>
            `;
          }
        }, 500); // 模拟处理延迟
      }
      
      // 显示结果
      function displayResult(result) {
        resultContainer.innerHTML = `
          <div class="result-content">
            <pre>${result}</pre>
          </div>
        `;
      }
      
      // 清空输入和结果
      function clearAll() {
        inputField.value = '';
        numberInput.value = '10';
        selectInput.value = 'option1';
        option1.checked = false;
        option2.checked = false;
        option3.checked = false;
        sliderInput.value = '50';
        sliderValue.textContent = '50%';
        fileInput.value = '';
        fileName.textContent = '未选择文件';
        resultContainer.innerHTML = '<div class="no-result">点击"执行"按钮开始</div>';
      }
      
      // 复制结果
      function copyResultText() {
        const resultContent = resultContainer.querySelector('.result-content');
        if (!resultContent) {
          showToast('没有可复制的结果', 'warning');
          return;
        }
        
        const text = resultContent.textContent;
        copyToClipboard(text);
      }
      
      // 下载结果
      function downloadResultText() {
        const resultContent = resultContainer.querySelector('.result-content');
        if (!resultContent) {
          showToast('没有可下载的结果', 'warning');
          return;
        }
        
        const text = resultContent.textContent;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `工具结果_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('结果已下载', 'success');
      }
      
      // 键盘快捷键
      inputField.addEventListener('keydown', (e) => {
        // Ctrl+Enter 快捷键执行
        if (e.ctrlKey && e.key === 'Enter') {
          processInput();
        }
      });
      
      // 事件监听
      processBtn.addEventListener('click', processInput);
      clearBtn.addEventListener('click', clearAll);
      copyResult.addEventListener('click', copyResultText);
      downloadResult.addEventListener('click', downloadResultText);
      
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
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-text {
          display: block;
          margin-top: 5px;
          font-size: 12px;
        }
        
        .input-with-unit {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .input-with-unit .unit {
          color: var(--text-muted);
        }
        
        .range-with-value {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .range-with-value input {
          flex: 1;
        }
        
        .file-input-container {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .file-input-container input {
          display: none;
        }
        
        .file-input-label {
          padding: 8px 15px;
          background-color: var(--border-color);
          border-radius: 4px;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .file-input-label:hover {
          background-color: var(--hover-bg);
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
        
        .result-header h3 {
          margin: 0;
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
        }
        
        .no-result, .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 170px;
          color: var(--text-muted);
        }
        
        .loading i {
          margin-right: 10px;
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
          overflow-x: auto;
        }
        
        .result-content pre {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-all;
        }
        
        .tool-info {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .info-header {
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .info-header h3 {
          margin: 0;
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
  
  // 注册工具 (注释掉，仅作为模板)
  // window.tools.toolId = tool;
})();