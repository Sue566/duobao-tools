/**
 * Markdown编辑器
 */
(function() {
  // 定义工具ID
  const toolId = 'markdownEditor';
  
  // 定义工具
  const tool = {
    /**
     * 初始化工具
     */
    init: function() {
      return Promise.resolve();
    },
    
    /**
     * 渲染工具
     * @param {HTMLElement} container - 工具容器元素
     * @returns {Function} 清理函数
     */
    render: function(container) {
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
          
          // 初始化UI
          window.markdownEditorUI.init(container);
        })
        .catch(error => {
          console.error('加载Markdown编辑器失败:', error);
          container.innerHTML = '<div class="tool-error">加载Markdown编辑器失败</div>';
        });
        
      // 返回清理函数
      return function cleanup() {
        // 移除样式
        const styleLink = document.querySelector('link[href="tools/markdownEditor/styles.css"]');
        if (styleLink) {
          document.head.removeChild(styleLink);
        }
        
        // 移除脚本
        const scripts = [
          'tools/markdownEditor/utils.js',
          'tools/markdownEditor/core.js',
          'tools/markdownEditor/ui.js'
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
        xhr.open('GET', 'tools/markdownEditor/template.html', true);
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
        link.href = 'tools/markdownEditor/styles.css';
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
        'tools/markdownEditor/utils.js',
        'tools/markdownEditor/core.js',
        'tools/markdownEditor/ui.js'
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