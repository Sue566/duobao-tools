/**
 * 文本长度统计工具
 * 增强版：支持多种统计方式、文件处理和历史记录
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
      const templateResponse = await fetch('tools/textLength/template.html');
      const template = await templateResponse.text();
      container.innerHTML = template;
      
      // 添加样式
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'tools/textLength/styles.css';
      document.head.appendChild(link);
      
      // 添加收藏按钮
      window.addFavoriteButton('textLength', container.querySelector('.tool-header'));
      
      // 初始化各个模块
      const utils = window.textLengthUtils;
      const history = window.textLengthHistory;
      const analyzer = window.textLengthAnalyzer;
      const fileHandler = window.textLengthFileHandler;
      
      // 确保所有模块都已加载
      if (!utils || !history || !analyzer || !fileHandler) {
        container.innerHTML = '<div class="error-message">工具模块加载失败，请刷新页面重试。</div>';
        return;
      }
      
      // 初始化工具模块
      utils.init(container);
      history.init(container);
      analyzer.init(container);
      fileHandler.init(container);
      
      // 获取主要元素
      const textInput = container.querySelector('#text-input');
      const textTab = container.querySelector('.tab-btn[data-tab="text"]');
      const fileTab = container.querySelector('.tab-btn[data-tab="file"]');
      const batchTab = container.querySelector('.tab-btn[data-tab="batch"]');
      const historyTab = container.querySelector('.tab-btn[data-tab="history"]');
      const tabContents = container.querySelectorAll('.tab-content');
      
      // 标签页切换
      [textTab, fileTab, batchTab, historyTab].forEach(tab => {
        if (tab) {
          tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // 更新标签按钮状态
            container.querySelectorAll('.tab-btn').forEach(btn => {
              btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // 更新标签内容显示
            tabContents.forEach(content => {
              content.classList.remove('active');
              if (content.id === `tab-${tabId}`) {
                content.classList.add('active');
              }
            });
            
            // 如果切换到历史标签页，刷新历史记录
            if (tabId === 'history') {
              history.renderHistory();
            }
          });
        }
      });
      
      // 文本输入事件 - 实时统计
      if (textInput) {
        textInput.addEventListener('input', function() {
          analyzer.analyzeInputText();
        });
        
        // 初始分析
        if (textInput.value) {
          analyzer.analyzeInputText();
        }
      }
      
      // 返回清理函数
      return function() {
        document.head.removeChild(link);
      };
    }
  };
  
  // 注册工具
  window.tools.textLength = tool;
})();