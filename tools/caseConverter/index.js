/**
 * 多宝工具箱 - 大小写转换工具
 * 增强版：支持多种文本转换格式和历史记录
 */
(function() {
  // 定义工具
  const tool = {
    /**
     * 初始化工具
     * @param {HTMLElement} container - 工具容器
     * @returns {Function} 清理函数
     */
    render: async function(container) {
      // 加载模板
      const templateResponse = await fetch('tools/caseConverter/template.html');
      const template = await templateResponse.text();
      container.innerHTML = template;
      
      // 添加样式
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'tools/caseConverter/styles.css';
      document.head.appendChild(link);
      
      // 添加收藏按钮
      window.addFavoriteButton('caseConverter', container.querySelector('.tool-header'));
      
      // 初始化面包屑导航
      this.initBreadcrumb(container);
      
      // 初始化各个模块
      const utils = window.caseConverterUtils;
      const converter = window.caseConverterCore;
      const history = window.caseConverterHistory;
      
      // 确保所有模块都已加载
      if (!utils || !converter || !history) {
        container.innerHTML = '<div class="error-message">工具模块加载失败，请刷新页面重试。</div>';
        return;
      }
      
      // 初始化工具模块
      utils.init(container);
      converter.init(container);
      history.init(container);
      
      // 获取输入文本框
      const inputTextarea = container.querySelector('#case-input');
      
      // 初始化文本统计
      if (inputTextarea) {
        const charCount = container.querySelector('#char-count');
        const wordCount = container.querySelector('#word-count');
        const lineCount = container.querySelector('#line-count');
        
        utils.updateTextStats(inputTextarea, charCount, wordCount, lineCount);
      }
      
      // 初始化帮助对话框
      this.initHelpDialog(container);
      
      // 返回清理函数
      return function() {
        // 移除样式
        const styleLink = document.querySelector('link[href="tools/caseConverter/styles.css"]');
        if (styleLink) {
          document.head.removeChild(styleLink);
        }
      };
    },
    
    /**
     * 初始化面包屑导航
     * @param {HTMLElement} container - 工具容器
     */
    initBreadcrumb: function(container) {
      const breadcrumbItems = container.querySelectorAll('.breadcrumb-item');
      
      breadcrumbItems.forEach(item => {
        if (item.classList.contains('current')) return;
        
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const page = item.getAttribute('data-page');
          const category = item.getAttribute('data-category');
          
          if (page === 'home') {
            // 跳转到首页
            if (typeof showHomepage === 'function') {
              showHomepage();
            } else {
              window.location.hash = '';
            }
          } else if (category) {
            // 跳转到分类页面
            if (typeof showCategory === 'function') {
              showCategory(category);
            } else {
              window.location.hash = `category/${category}`;
            }
          }
        });
      });
    },
    
    /**
     * 初始化帮助对话框
     * @param {HTMLElement} container - 工具容器
     */
    initHelpDialog: function(container) {
      const helpButton = container.querySelector('#help-button');
      const helpDialog = container.querySelector('#help-dialog');
      const closeButton = helpDialog?.querySelector('.dialog-close');
      
      if (helpButton && helpDialog) {
        helpButton.addEventListener('click', () => {
          helpDialog.style.display = 'flex';
        });
        
        if (closeButton) {
          closeButton.addEventListener('click', () => {
            helpDialog.style.display = 'none';
          });
        }
        
        // 点击对话框外部关闭
        helpDialog.addEventListener('click', (e) => {
          if (e.target === helpDialog) {
            helpDialog.style.display = 'none';
          }
        });
      }
    }
  };
  
  // 注册工具
  window.tools = window.tools || {};
  window.tools.caseConverter = tool;
})();