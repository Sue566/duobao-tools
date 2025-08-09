/**
 * 工具模板 - 用于创建新工具的基础模板
 */

(function() {
  // 工具ID
  const TOOL_ID = 'tool-template';
  
  // 工具对象
  const tool = {
    /**
     * 初始化工具
     * @returns {Promise} 初始化完成的Promise
     */
    init: function() {
      console.log(`${TOOL_ID} 初始化`);
      return Promise.resolve();
    },
    
    /**
     * 渲染工具
     * @param {HTMLElement} container - 工具容器元素
     */
    render: function(container) {
      console.log(`渲染 ${TOOL_ID}`);
      
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2>工具模板</h2>
          <p class="tool-description">这是一个用于创建新工具的基础模板。</p>
        </div>
        
        <section>
          <div class="alert alert-info">
            <h4>如何使用此模板</h4>
            <p>1. 复制 tools/tool-template 目录到 tools/你的工具ID</p>
            <p>2. 修改工具ID、标题和描述</p>
            <p>3. 实现你的工具功能</p>
            <p>4. 在 menu.js 中添加你的工具到菜单</p>
          </div>
          
          <div class="form-group">
            <label for="template-input">示例输入</label>
            <input type="text" id="template-input" class="form-control" placeholder="请输入内容">
          </div>
          
          <div class="form-group">
            <button id="template-button" class="btn">示例按钮</button>
          </div>
          
          <div id="template-result" class="mt-3"></div>
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
      const input = container.querySelector('#template-input');
      const button = container.querySelector('#template-button');
      const result = container.querySelector('#template-result');
      
      // 添加按钮点击事件
      button.addEventListener('click', () => {
        const inputValue = input.value.trim();
        
        if (inputValue) {
          result.innerHTML = `
            <div style="padding: 15px; background-color: var(--success-color-light); border-left: 4px solid var(--success-color); margin-top: 15px;">
              <h4>处理结果</h4>
              <p>输入内容: ${inputValue}</p>
              <p>处理时间: ${new Date().toLocaleString()}</p>
            </div>
          `;
        } else {
          result.innerHTML = `
            <div style="padding: 15px; background-color: var(--warning-color-light); border-left: 4px solid var(--warning-color); margin-top: 15px;">
              <h4>提示</h4>
              <p>请先输入内容</p>
            </div>
          `;
        }
      });
      
      // 添加输入框回车事件
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          button.click();
        }
      });
      
      // 自动聚焦输入框
      setTimeout(() => {
        input.focus();
      }, 300);
    },
    
    /**
     * 保存工具设置
     * @param {Object} settings - 要保存的设置
     */
    saveSettings: function(settings) {
      try {
        localStorage.setItem(`settings_${TOOL_ID}`, JSON.stringify(settings));
      } catch (e) {
        console.error(`保存 ${TOOL_ID} 设置失败:`, e);
      }
    },
    
    /**
     * 加载工具设置
     * @returns {Object} 加载的设置，如果没有则返回默认设置
     */
    loadSettings: function() {
      try {
        const settings = localStorage.getItem(`settings_${TOOL_ID}`);
        return settings ? JSON.parse(settings) : this.getDefaultSettings();
      } catch (e) {
        console.error(`加载 ${TOOL_ID} 设置失败:`, e);
        return this.getDefaultSettings();
      }
    },
    
    /**
     * 获取默认设置
     * @returns {Object} 默认设置
     */
    getDefaultSettings: function() {
      return {
        theme: 'light',
        fontSize: 'medium',
        autoSave: true
      };
    }
  };
  
  // 注册工具
  window.tools[TOOL_ID] = tool;
  
  // 如果使用duobaoTools注册方式，也进行注册
  if (window.duobaoTools) {
    window.duobaoTools[TOOL_ID] = tool;
  }
  
  console.log(`${TOOL_ID} 已注册`);
})();