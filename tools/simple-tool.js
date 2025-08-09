/**
 * 简单工具示例 - 用于测试工具加载系统
 */

(function() {
  // 注册工具
  window.tools['simple-tool'] = {
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
          <h2>简单工具示例</h2>
          <p class="tool-description">这是一个用于测试工具加载系统的简单示例工具。</p>
        </div>
        
        <section>
          <div class="form-group">
            <label for="test-input">测试输入</label>
            <input type="text" id="test-input" class="form-control" placeholder="请输入任意内容">
          </div>
          
          <div class="form-group">
            <button id="test-button" class="btn">测试按钮</button>
            <button id="test-error-button" class="btn btn-danger">测试错误处理</button>
          </div>
          
          <div id="test-result" class="mt-3"></div>
        </section>
      `;
      
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
      const testResult = container.querySelector('#test-result');
      
      // 添加按钮点击事件
      testButton.addEventListener('click', () => {
        const inputValue = testInput.value.trim();
        
        if (inputValue) {
          testResult.innerHTML = `
            <div style="padding: 15px; background-color: var(--success-color-light); border-left: 4px solid var(--success-color); margin-top: 15px;">
              <h4>测试成功</h4>
              <p>您输入的内容: ${inputValue}</p>
              <p>当前时间: ${new Date().toLocaleString()}</p>
            </div>
          `;
        } else {
          testResult.innerHTML = `
            <div style="padding: 15px; background-color: var(--warning-color-light); border-left: 4px solid var(--warning-color); margin-top: 15px;">
              <h4>提示</h4>
              <p>请先输入一些内容</p>
            </div>
          `;
        }
      });
      
      // 添加错误测试按钮事件
      testErrorButton.addEventListener('click', () => {
        testResult.innerHTML = `
          <div style="padding: 15px; background-color: var(--danger-color-light); border-left: 4px solid var(--danger-color); margin-top: 15px;">
            <h4>错误测试</h4>
            <p>这是一个模拟的错误提示，用于测试错误处理功能。</p>
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
              <div style="padding: 15px; background-color: var(--success-color-light); border-left: 4px solid var(--success-color); margin-top: 15px;">
                <h4>错误已被捕获</h4>
                <p>错误信息: ${err.message}</p>
                <p>错误处理功能正常工作！</p>
              </div>
            `;
          }
        }, 1000);
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
  
  // 如果使用duobaoTools注册方式，也进行注册
  if (window.duobaoTools) {
    window.duobaoTools['simple-tool'] = window.tools['simple-tool'];
  }
  
  console.log('简单工具示例已注册');
})();