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
      
      // 加载HTML模板
      this.loadTemplate(container)
        .then(() => {
          // 加载CSS样式
          return this.loadStyles();
        })
        .then(() => {
          // 添加收藏按钮
          if (typeof window.addFavoriteButton === 'function') {
            const header = container.querySelector('.tool-header');
            window.addFavoriteButton(TOOL_ID, header);
          }
          
          // 添加事件处理
          this.setupEvents(container);
          
          // 加载设置
          this.loadAndApplySettings(container);
        })
        .catch(error => {
          console.error('加载模板失败:', error);
          container.innerHTML = '<div class="tool-error">加载模板失败</div>';
        });
    },
    
    /**
     * 加载HTML模板
     * @param {HTMLElement} container - 工具容器元素
     * @returns {Promise} 加载完成的Promise
     */
    loadTemplate: function(container) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'tools/tool-template/template.html', true);
        xhr.onload = function() {
          if (xhr.status === 200) {
            container.innerHTML = xhr.responseText;
            resolve();
          } else {
            reject(new Error(`加载模板失败: ${xhr.status}`));
          }
        };
        xhr.onerror = function() {
          reject(new Error('网络错误，无法加载模板'));
        };
        xhr.send();
      });
    },
    
    /**
     * 加载CSS样式
     * @returns {Promise} 加载完成的Promise
     */
    loadStyles: function() {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'tools/tool-template/styles.css';
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });
    },
    
    /**
     * 设置事件处理
     * @param {HTMLElement} container - 工具容器元素
     */
    setupEvents: function(container) {
      // 获取元素
      const input = container.querySelector('#template-input');
      const select = container.querySelector('#template-select');
      const textarea = container.querySelector('#template-textarea');
      const primaryBtn = container.querySelector('#template-primary-btn');
      const secondaryBtn = container.querySelector('#template-secondary-btn');
      const dangerBtn = container.querySelector('#template-danger-btn');
      const result = container.querySelector('#template-result');
      
      // 设置相关元素
      const themeSelect = container.querySelector('#template-theme');
      const fontSizeSelect = container.querySelector('#template-font-size');
      const autoSaveCheckbox = container.querySelector('#template-auto-save');
      const saveSettingsBtn = container.querySelector('#template-save-settings');
      const resetSettingsBtn = container.querySelector('#template-reset-settings');
      
      // 主要按钮点击事件
      primaryBtn.addEventListener('click', () => {
        const inputValue = input.value.trim();
        const selectValue = select.value;
        const textareaValue = textarea.value.trim();
        
        if (inputValue || textareaValue) {
          result.innerHTML = `
            <div class="result-success">
              <h4>处理成功</h4>
              ${inputValue ? `<p><strong>输入内容:</strong> ${inputValue}</p>` : ''}
              ${textareaValue ? `<p><strong>多行文本:</strong> ${textareaValue}</p>` : ''}
              <p><strong>选择项:</strong> ${selectValue}</p>
              <p><strong>处理时间:</strong> ${new Date().toLocaleString()}</p>
            </div>
          `;
        } else {
          result.innerHTML = `
            <div class="result-warning">
              <h4>提示</h4>
              <p>请先输入一些内容</p>
            </div>
          `;
        }
      });
      
      // 次要按钮点击事件
      secondaryBtn.addEventListener('click', () => {
        const settings = this.loadSettings();
        
        result.innerHTML = `
          <div class="result-success">
            <h4>当前设置</h4>
            <p><strong>主题:</strong> ${settings.theme}</p>
            <p><strong>字体大小:</strong> ${settings.fontSize}</p>
            <p><strong>自动保存:</strong> ${settings.autoSave ? '是' : '否'}</p>
          </div>
        `;
      });
      
      // 危险按钮点击事件
      dangerBtn.addEventListener('click', () => {
        if (confirm('确定要执行此操作吗？这是一个模拟的危险操作。')) {
          result.innerHTML = `
            <div class="result-error">
              <h4>操作执行</h4>
              <p>这是一个模拟的危险操作结果。在实际应用中，这可能是删除数据或重置设置等操作。</p>
              <p><strong>执行时间:</strong> ${new Date().toLocaleString()}</p>
            </div>
          `;
        }
      });
      
      // 保存设置按钮点击事件
      saveSettingsBtn.addEventListener('click', () => {
        const settings = {
          theme: themeSelect.value,
          fontSize: fontSizeSelect.value,
          autoSave: autoSaveCheckbox.checked
        };
        
        this.saveSettings(settings);
        this.applySettings(settings, container);
        
        result.innerHTML = `
          <div class="result-success">
            <h4>设置已保存</h4>
            <p>您的设置已成功保存。</p>
          </div>
        `;
      });
      
      // 重置设置按钮点击事件
      resetSettingsBtn.addEventListener('click', () => {
        const defaultSettings = this.getDefaultSettings();
        
        themeSelect.value = defaultSettings.theme;
        fontSizeSelect.value = defaultSettings.fontSize;
        autoSaveCheckbox.checked = defaultSettings.autoSave;
        
        this.saveSettings(defaultSettings);
        this.applySettings(defaultSettings, container);
        
        result.innerHTML = `
          <div class="result-success">
            <h4>设置已重置</h4>
            <p>您的设置已恢复为默认值。</p>
          </div>
        `;
      });
      
      // 设置变更事件（如果启用了自动保存）
      const handleSettingChange = () => {
        if (autoSaveCheckbox.checked) {
          const settings = {
            theme: themeSelect.value,
            fontSize: fontSizeSelect.value,
            autoSave: autoSaveCheckbox.checked
          };
          
          this.saveSettings(settings);
          this.applySettings(settings, container);
        }
      };
      
      themeSelect.addEventListener('change', handleSettingChange);
      fontSizeSelect.addEventListener('change', handleSettingChange);
      
      // 添加输入框回车事件
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          primaryBtn.click();
        }
      });
      
      // 自动聚焦输入框
      setTimeout(() => {
        input.focus();
      }, 300);
    },
    
    /**
     * 加载并应用设置
     * @param {HTMLElement} container - 工具容器元素
     */
    loadAndApplySettings: function(container) {
      const settings = this.loadSettings();
      
      // 更新设置控件
      const themeSelect = container.querySelector('#template-theme');
      const fontSizeSelect = container.querySelector('#template-font-size');
      const autoSaveCheckbox = container.querySelector('#template-auto-save');
      
      if (themeSelect) themeSelect.value = settings.theme;
      if (fontSizeSelect) fontSizeSelect.value = settings.fontSize;
      if (autoSaveCheckbox) autoSaveCheckbox.checked = settings.autoSave;
      
      // 应用设置
      this.applySettings(settings, container);
    },
    
    /**
     * 应用设置到界面
     * @param {Object} settings - 设置对象
     * @param {HTMLElement} container - 工具容器元素
     */
    applySettings: function(settings, container) {
      // 应用字体大小
      container.style.fontSize = {
        'small': '14px',
        'medium': '16px',
        'large': '18px'
      }[settings.fontSize] || '16px';
      
      // 主题应用可能需要与全局主题系统协调
      console.log(`应用设置: 主题=${settings.theme}, 字体大小=${settings.fontSize}, 自动保存=${settings.autoSave}`);
    },
    
    /**
     * 保存工具设置
     * @param {Object} settings - 要保存的设置
     */
    saveSettings: function(settings) {
      try {
        localStorage.setItem(`settings_${TOOL_ID}`, JSON.stringify(settings));
        console.log(`${TOOL_ID} 设置已保存:`, settings);
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
  if (typeof window.registerTool === 'function') {
    window.registerTool(TOOL_ID, tool);
  } else {
    window.tools[TOOL_ID] = tool;
    console.log(`工具 ${TOOL_ID} 已注册`);
  }
  
  // 如果使用duobaoTools注册方式，也进行注册
  if (window.duobaoTools) {
    window.duobaoTools[TOOL_ID] = {
      name: '工具模板',
      icon: 'fa-puzzle-piece',
      description: '这是一个用于创建新工具的基础模板，提供了常用UI组件和功能示例。',
      render: tool.render.bind(tool)
    };
  }
  
  console.log(`${TOOL_ID} 已注册`);
})();