/**
 * 简单工具示例 - 用于测试工具加载系统
 */

(function() {
  const toolId = 'simple-tool';
  
  // 定义工具
  const tool = {
    /**
     * 初始化工具
     */
    init: function() {
      console.log('简单工具示例初始化');
      return Promise.resolve();
    },
    
    /**
     * 渲染工具
     * @param {HTMLElement} container - 工具容器元素
     */
    render: function(container) {
      console.log('渲染简单工具示例');
      
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-wrench"></i> 简单工具示例</h2>
          <p class="tool-description">这是一个用于测试工具加载系统的简单示例工具，支持基本输入输出和错误处理。</p>
        </div>
        
        <div class="simple-tool-container">
          <div class="input-section card">
            <div class="form-group">
              <label for="test-input">测试输入</label>
              <input type="text" id="test-input" class="form-control" placeholder="请输入任意内容">
            </div>
            
            <div class="form-actions">
              <button id="test-button" class="btn btn-primary"><i class="fa fa-check"></i> 测试按钮</button>
              <button id="test-error-button" class="btn btn-danger"><i class="fa fa-exclamation-triangle"></i> 测试错误处理</button>
              <button id="test-clear-button" class="btn"><i class="fa fa-eraser"></i> 清空</button>
            </div>
          </div>
          
          <div class="result-section">
            <div class="result-header">
              <h3>测试结果</h3>
              <div class="result-actions">
                <button id="copy-result-button" class="btn btn-sm" title="复制结果"><i class="fa fa-copy"></i> 复制</button>
              </div>
            </div>
            <div id="test-result" class="result-content"></div>
          </div>
          
          <div class="info-section card">
            <div class="info-header">
              <h3>工具说明</h3>
            </div>
            <div class="info-content">
              <p>这个简单工具示例用于测试工具加载系统的基本功能，包括：</p>
              <ul>
                <li>基本的用户输入处理</li>
                <li>按钮点击事件响应</li>
                <li>结果显示和格式化</li>
                <li>错误处理和异常捕获</li>
                <li>复制结果到剪贴板</li>
              </ul>
              <p>您可以在输入框中输入任意内容，然后点击"测试按钮"查看结果，或者点击"测试错误处理"按钮来模拟一个错误情况。</p>
            </div>
          </div>
        </div>
      `;
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .simple-tool-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .form-control {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--bg-light);
          font-size: 16px;
        }
        
        .form-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .btn {
          border: 1px solid var(--border-color);
          background: var(--card-bg);
          border-radius: 6px;
          padding: 8px 16px;
          cursor: pointer;
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        
        .btn:hover {
          border-color: var(--primary-color);
          background: rgba(74,108,247,0.08);
        }
        
        .btn-primary {
          background: var(--primary-color);
          color: #fff;
          border-color: var(--primary-color);
        }
        
        .btn-primary:hover {
          filter: brightness(0.95);
        }
        
        .btn-danger {
          background: #e74c3c;
          color: #fff;
          border-color: #c0392b;
        }
        
        .btn-danger:hover {
          filter: brightness(0.95);
        }
        
        .btn-sm {
          padding: 4px 8px;
          font-size: 14px;
        }
        
        .result-section {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .result-header h3 {
          margin: 0;
          font-size: 16px;
        }
        
        .result-content {
          padding: 16px;
          min-height: 100px;
        }
        
        .result-message {
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 6px;
        }
        
        .result-message:last-child {
          margin-bottom: 0;
        }
        
        .result-message h4 {
          margin-top: 0;
          margin-bottom: 10px;
        }
        
        .result-message p {
          margin: 0 0 8px 0;
        }
        
        .result-message p:last-child {
          margin-bottom: 0;
        }
        
        .result-success {
          background-color: rgba(46, 204, 113, 0.15);
          border-left: 4px solid #2ecc71;
        }
        
        .result-warning {
          background-color: rgba(241, 196, 15, 0.15);
          border-left: 4px solid #f1c40f;
        }
        
        .result-error {
          background-color: rgba(231, 76, 60, 0.15);
          border-left: 4px solid #e74c3c;
        }
        
        .info-header {
          margin-bottom: 12px;
        }
        
        .info-header h3 {
          margin: 0;
          font-size: 16px;
        }
        
        .info-content {
          font-size: 14px;
          line-height: 1.5;
        }
        
        .info-content p {
          margin: 0 0 10px 0;
        }
        
        .info-content ul {
          margin: 0 0 10px 0;
          padding-left: 20px;
        }
        
        .info-content li {
          margin-bottom: 5px;
        }
        
        @media (max-width: 768px) {
          .form-actions {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
          }
        }
      `;
      container.appendChild(style);
      
      // 添加收藏按钮
      if (typeof window.addFavoriteButton === 'function') {
        const header = container.querySelector('.tool-header');
        window.addFavoriteButton(toolId, header);
      }
      
      // 添加事件处理
      this.setupEvents(container);
    },
    
    /**
     * 设置事件处理
     * @param {HTMLElement} container - 工具容器元素
     */
    setupEvents: function(container) {
      // 获取元素
      const testInput = container.querySelector('#test-input');
      const testButton = container.querySelector('#test-button');
      const testErrorButton = container.querySelector('#test-error-button');
      const testClearButton = container.querySelector('#test-clear-button');
      const testResult = container.querySelector('#test-result');
      const copyResultButton = container.querySelector('#copy-result-button');
      
      // 添加按钮点击事件
      testButton.addEventListener('click', () => {
        const inputValue = testInput.value.trim();
        
        if (inputValue) {
          testResult.innerHTML = `
            <div class="result-message result-success">
              <h4>测试成功</h4>
              <p><strong>您输入的内容:</strong> ${inputValue}</p>
              <p><strong>当前时间:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>字符数:</strong> ${inputValue.length}</p>
            </div>
          `;
        } else {
          testResult.innerHTML = `
            <div class="result-message result-warning">
              <h4>提示</h4>
              <p>请先输入一些内容</p>
            </div>
          `;
        }
      });
      
      // 添加错误测试按钮事件
      testErrorButton.addEventListener('click', () => {
        testResult.innerHTML = `
          <div class="result-message result-error">
            <h4>错误测试</h4>
            <p>这是一个模拟的错误提示，用于测试错误处理功能。</p>
            <p>系统将在1秒后尝试访问一个不存在的对象属性...</p>
          </div>
        `;
        
        // 故意抛出一个错误，测试错误处理
        setTimeout(() => {
          try {
            // 故意制造一个错误
            const nonExistentObject = null;
            nonExistentObject.someProperty = 'test';
          } catch (err) {
            console.error('测试错误:', err);
            
            // 显示错误已被捕获
            testResult.innerHTML += `
              <div class="result-message result-success">
                <h4>错误已被捕获</h4>
                <p><strong>错误信息:</strong> ${err.message}</p>
                <p><strong>错误类型:</strong> ${err.name}</p>
                <p>错误处理功能正常工作！</p>
              </div>
            `;
          }
        }, 1000);
      });
      
      // 添加清空按钮事件
      testClearButton.addEventListener('click', () => {
        testInput.value = '';
        testResult.innerHTML = '';
        testInput.focus();
      });
      
      // 添加复制结果按钮事件
      copyResultButton.addEventListener('click', () => {
        const resultText = testResult.textContent.trim();
        
        if (resultText) {
          copyToClipboard(resultText);
        } else {
          testResult.innerHTML = `
            <div class="result-message result-warning">
              <h4>提示</h4>
              <p>没有可复制的结果</p>
            </div>
          `;
        }
      });
      
      // 添加输入框回车事件
      testInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          testButton.click();
        }
      });
      
      // 自动聚焦输入框
      setTimeout(() => {
        testInput.focus();
      }, 300);
    }
  };
  
  // 复制到剪贴板函数
  function copyToClipboard(text) {
    if (!text) return;
    
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
        showToast('已复制到剪贴板', 'success');
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        showToast('已复制到剪贴板', 'success');
      }
    } catch (e) {
      console.error('复制失败:', e);
      showToast('复制失败: ' + e.message, 'error');
    }
  }
  
  // 显示提示消息
  function showToast(message, type) {
    if (typeof window.showToast === 'function') {
      window.showToast(message, type);
    } else {
      console.log(`[${type}] ${message}`);
    }
  }
  
  // 注册工具
  if (typeof window.registerTool === 'function') {
    window.registerTool(toolId, tool);
  } else {
    window.tools[toolId] = tool;
    console.log('工具 ' + toolId + ' 已注册');
  }
  
  // 如果使用duobaoTools注册方式，也进行注册
  if (window.duobaoTools) {
    window.duobaoTools[toolId] = {
      name: '简单工具示例',
      icon: 'fa-wrench',
      description: '这是一个用于测试工具加载系统的简单示例工具，支持基本输入输出和错误处理。',
      render: tool.render.bind(tool)
    };
  }
  
  console.log('简单工具示例已注册');
})();