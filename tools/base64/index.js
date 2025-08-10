/**
 * Base64 编解码工具
 * 增强版：支持文件编解码、批量处理和历史记录
 */
(function () {
  const toolId = 'base64';

  // 工具模块
  const tool = {
    /**
     * 初始化工具
     */
    init: function () {
      return Promise.resolve();
    },
    
    /**
     * 渲染工具
     * @param {HTMLElement} container - 工具容器元素
     * @returns {Function} 清理函数
     */
    render: function (container) {
      // 加载HTML模板
      this.loadTemplate(container)
        .then(() => {
          // 加载CSS样式
          return this.loadStyles();
        })
        .then(() => {
          // 加载依赖模块
          return this.loadModules();
        })
        .then(() => {
          // 添加收藏按钮
          if (typeof window.addFavoriteButton === 'function') {
            const header = container.querySelector('.tool-header');
            window.addFavoriteButton(toolId, header);
          }
          
          // 初始化事件处理
          this.setupEvents(container);
        })
        .catch(error => {
          console.error('加载Base64工具失败:', error);
          container.innerHTML = '<div class="tool-error">加载Base64工具失败</div>';
        });
        
      // 返回清理函数
      return function cleanup() {
        // 移除样式
        const styleLink = document.querySelector('link[href="tools/base64/styles.css"]');
        if (styleLink) {
          document.head.removeChild(styleLink);
        }
        
        // 移除脚本
        const scripts = [
          'tools/base64/utils.js',
          'tools/base64/history.js',
          'tools/base64/textEncoder.js',
          'tools/base64/fileEncoder.js',
          'tools/base64/batchProcessor.js'
        ];
        
        scripts.forEach(src => {
          const script = document.querySelector(`script[src="${src}"]`);
          if (script) {
            document.head.removeChild(script);
          }
        });
      };
    },
    
    /**
     * 加载HTML模板
     * @param {HTMLElement} container - 工具容器元素
     * @returns {Promise} 加载完成的Promise
     */
    loadTemplate: function(container) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'tools/base64/template.html', true);
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
        link.href = 'tools/base64/styles.css';
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });
    },
    
    /**
     * 加载依赖模块
     * @returns {Promise} 加载完成的Promise
     */
    loadModules: function() {
      const modules = [
        'tools/base64/utils.js',
        'tools/base64/history.js',
        'tools/base64/textEncoder.js',
        'tools/base64/fileEncoder.js',
        'tools/base64/batchProcessor.js'
      ];
      
      const promises = modules.map(module => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = module;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      });
      
      return Promise.all(promises);
    },

    // 设置事件处理
    setupEvents: function (container) {
      // 等待模块加载完成
      setTimeout(() => {
        // 初始化历史记录
        window.base64History.init();
        
        // 设置标签页切换
        this.setupTabs(container);
        
        // 初始化文本编解码功能
        window.base64TextEncoder.init(container);
        
        // 初始化文件编解码功能
        window.base64FileEncoder.init(container);
        
        // 初始化批量处理功能
        window.base64BatchProcessor.init(container);
        
        // 设置历史记录事件
        this.setupHistoryEvents(container);
        
        // 设置信息折叠/展开
        this.setupInfoToggle(container);
      }, 100);
    },
    
    /**
     * 设置标签页切换
     * @param {HTMLElement} container - 工具容器
     */
    setupTabs: function(container) {
      const tabButtons = container.querySelectorAll('.tab-btn');
      const tabContents = container.querySelectorAll('.tab-content');
      
      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const tabId = btn.getAttribute('data-tab');
          
          // 更新按钮状态
          tabButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          // 更新内容显示
          tabContents.forEach(content => {
            if (content.id === `tab-${tabId}`) {
              content.classList.add('active');
            } else {
              content.classList.remove('active');
            }
          });
          
          // 如果切换到历史记录标签，刷新历史记录
          if (tabId === 'history') {
            window.base64History.renderHistory(container);
          }
        });
      });
    },
    
    /**
     * 设置历史记录事件
     * @param {HTMLElement} container - 工具容器
     */
    setupHistoryEvents: function(container) {
      window.base64History.setupHistoryEvents(container, {
        onUseHistory: (item) => {
          // 根据历史记录类型切换到相应标签页
          let tabId = 'text';
          
          switch (item.type) {
            case 'text':
              tabId = 'text';
              window.base64TextEncoder.loadFromHistory(item);
              break;
            case 'file_encode':
            case 'file_decode':
              tabId = 'file';
              window.base64FileEncoder.loadFromHistory(item);
              break;
            case 'batch':
              tabId = 'batch';
              window.base64BatchProcessor.loadFromHistory(item);
              break;
          }
          
          // 切换到相应标签页
          const tabBtn = container.querySelector(`.tab-btn[data-tab="${tabId}"]`);
          if (tabBtn) {
            tabBtn.click();
          }
        }
      });
    },
    
    /**
     * 设置信息折叠/展开
     * @param {HTMLElement} container - 工具容器
     */
    setupInfoToggle: function(container) {
      const toggleInfoBtn = container.querySelector('.toggle-info-btn');
      const infoContent = container.querySelector('.info-content');
      
      if (!toggleInfoBtn || !infoContent) return;
      
      toggleInfoBtn.addEventListener('click', () => {
        const isCollapsed = infoContent.style.display === 'none';
        
        infoContent.style.display = isCollapsed ? 'block' : 'none';
        toggleInfoBtn.innerHTML = isCollapsed ? 
          '<i class="fa fa-chevron-up"></i>' : 
          '<i class="fa fa-chevron-down"></i>';
        
        // 保存偏好
        localStorage.setItem('infoCollapsed_base64', !isCollapsed);
      });
      
      // 检查是否应该折叠说明
      const shouldCollapseInfo = localStorage.getItem('infoCollapsed_base64') === 'true';
      if (shouldCollapseInfo) {
        infoContent.style.display = 'none';
        toggleInfoBtn.innerHTML = '<i class="fa fa-chevron-down"></i>';
      }
    }
  };

  // 注册工具
  if (typeof window.registerTool === 'function') {
    window.registerTool(toolId, tool);
  } else {
    window.tools = window.tools || {};
    window.tools[toolId] = tool;
    console.log('工具 ' + toolId + ' 已注册');
  }
})();
