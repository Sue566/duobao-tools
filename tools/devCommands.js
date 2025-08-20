/**
 * 多宝工具箱 - 开发命令速查工具
 * 主入口文件 (优化版本)
 */

// 注册工具
(function() {
  // 工具元数据
  const toolInfo = {
    id: 'devCommands',
    name: '开发命令速查',
    description: '常用开发命令参考，包括MySQL、Redis、Linux、Docker、Git、NPM、MongoDB、Kubernetes等',
    icon: 'fas fa-terminal',
    category: '开发工具',
    author: 'CodeBuddy',
    version: '1.1.0',
    tags: ['命令', '开发', '数据库', '容器', '版本控制', '系统管理']
  };
  
  // HTML模板
  const template = `
  <div class="dev-commands-container">
    <div class="tool-header">
      <div class="tool-header-content">
        <div class="tool-icon-wrapper">
          <div class="tool-icon">
            <i class="fas fa-terminal"></i>
          </div>
        </div>
        <div class="tool-info">
          <h2>开发命令速查</h2>
          <div class="tool-description">常用开发命令参考，包括MySQL、Redis、Linux、Docker、Git、NPM、MongoDB、Kubernetes等</div>
        </div>
      </div>
    </div>
    
    <div class="dev-commands-main">
      <div class="dev-commands-search-section">
        <div class="search-input-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input type="text" id="dev-commands-search" class="search-input" placeholder="搜索命令... (Ctrl+F)">
          <button id="clear-search" class="clear-search" style="display: none;">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="keyboard-shortcuts">
          <span title="键盘快捷键"><i class="fas fa-keyboard"></i> 快捷键: Ctrl+F 搜索 | ESC 清除搜索</span>
        </div>
      </div>
      
      <div class="dev-commands-tabs">
        <ul id="category-tabs"></ul>
      </div>
      
      <div class="dev-commands-content">
        <div class="dev-commands-count" id="commands-count"></div>
        <div id="commands-list" class="dev-commands-list"></div>
      </div>
    </div>
    
    <div class="copy-success-tooltip" id="copy-tooltip"></div>
  </div>
  `;
  
  // 主工具对象
  const devCommandsTool = {
    // 复制元数据
    ...toolInfo,
    
    /**
     * 渲染工具
     * @param {HTMLElement} target - 目标容器
     * @returns {Promise} 渲染完成的Promise
     */
    render: async function(target) {
      try {
        // 设置工具容器ID
        target.id = 'tool-container';
        
        // 直接使用内联模板
        target.innerHTML = template;
        
        // 加载样式
        this.loadStyle('tools/devCommands/styles.css');
        
        // 动态加载脚本
        await this.loadScripts([
          'tools/devCommands/commands.js',
          'tools/devCommands/index.js'
        ]);
        
        // 初始化工具
        const devCommands = new window.duobaoTools.DevCommands();
        devCommands.init();
        
        // 添加键盘快捷键支持
        this.setupKeyboardShortcuts(target);
        
        return Promise.resolve();
      } catch (error) {
        console.error('加载开发命令速查工具失败:', error);
        target.innerHTML = `
          <div class="error-message" style="padding: 20px; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0;">工具加载失败</h3>
            <p>加载开发命令速查工具时发生错误，请刷新页面重试。</p>
            <p>错误详情: ${error.message}</p>
            <button class="retry-button" style="padding: 8px 16px; background: #0275d8; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">
              <i class="fas fa-sync-alt"></i> 重试
            </button>
          </div>
        `;
        
        // 添加重试按钮事件
        const retryButton = target.querySelector('.retry-button');
        if (retryButton) {
          retryButton.addEventListener('click', () => {
            this.render(target);
          });
        }
        
        return Promise.reject(error);
      }
    },
    
    /**
     * 设置键盘快捷键
     * @param {HTMLElement} container - 工具容器
     */
    setupKeyboardShortcuts: function(container) {
      document.addEventListener('keydown', function(e) {
        // 如果焦点不在工具内，不处理
        if (!container.contains(document.activeElement) && document.activeElement !== document.body) {
          return;
        }
        
        // Ctrl+F 聚焦搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
          const searchInput = document.getElementById('dev-commands-search');
          if (searchInput && document.activeElement !== searchInput) {
            e.preventDefault(); // 阻止浏览器默认的查找功能
            searchInput.focus();
          }
        }
        
        // ESC 清除搜索
        if (e.key === 'Escape') {
          const searchInput = document.getElementById('dev-commands-search');
          if (searchInput && searchInput.value) {
            searchInput.value = '';
            document.getElementById('clear-search').style.display = 'none';
            
            // 触发input事件以更新搜索结果
            searchInput.dispatchEvent(new Event('input'));
          }
        }
      });
    },
    
    /**
     * 加载样式
     * @param {string} href - 样式文件路径
     */
    loadStyle: function(href) {
      // 检查是否已加载样式
      if (document.querySelector(`link[href="${href}"]`)) return;
      
      // 创建样式标签
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      
      // 添加到文档
      document.head.appendChild(link);
    },
  
    /**
     * 加载多个脚本
     * @param {Array} scripts - 脚本路径数组
     * @returns {Promise} 加载完成的Promise
     */
    loadScripts: function(scripts) {
      return Promise.all(scripts.map(src => this.loadScript(src)));
    },
    
    /**
     * 加载单个脚本
     * @param {string} src - 脚本路径
     * @returns {Promise} 加载完成的Promise
     */
    loadScript: function(src) {
      return new Promise((resolve, reject) => {
        // 检查脚本是否已加载
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = (e) => {
          console.error(`脚本加载失败: ${src}`, e);
          reject(new Error(`脚本加载失败: ${src}`));
        };
        document.head.appendChild(script);
      });
    },
    
    /**
     * 卸载工具
     */
    unload: function() {
      // 移除事件监听器
      document.removeEventListener('keydown', this.setupKeyboardShortcuts);
      
      // 清理DOM
      const container = document.getElementById('tool-container');
      if (container) {
        container.innerHTML = '';
      }
      
      console.log('开发命令速查工具已卸载');
    }
  };

  // 注册工具
  window.tools = window.tools || {};
  window.tools.devCommands = devCommandsTool;

  // 兼容旧版注册方式
  window.duobaoTools = window.duobaoTools || {};
  window.duobaoTools.devCommands = devCommandsTool;

  console.log('开发命令速查工具已加载 (v1.1.0)');
})();