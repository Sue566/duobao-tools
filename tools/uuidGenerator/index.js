/**
 * UUID生成器
 * 支持生成版本1和版本4的UUID，并提供多种格式选项
 */
(function() {
  // 定义工具
  const tool = {
    /**
     * 初始化工具
     * @param {HTMLElement} container - 工具容器
     */
    render: async function(container) {
      // 加载模板
      const templateResponse = await fetch('tools/uuidGenerator/template.html');
      const template = await templateResponse.text();
      container.innerHTML = template;
      
      // 添加样式
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'tools/uuidGenerator/styles.css';
      document.head.appendChild(link);
      
      // 添加收藏按钮
      window.addFavoriteButton('uuidGenerator', container.querySelector('.tool-header'));
      
      // 初始化各个模块
      const utils = window.uuidGeneratorUtils;
      const generator = window.uuidGeneratorCore;
      
      // 确保所有模块都已加载
      if (!utils || !generator) {
        container.innerHTML = '<div class="error-message">工具模块加载失败，请刷新页面重试。</div>';
        return;
      }
      
      // 初始化工具模块
      utils.init(container);
      generator.init(container);
      
      // 清理函数
      return function cleanup() {
        document.head.removeChild(link);
      };
    }
  };
  
  // 注册工具
  window.tools.uuidGenerator = tool;
})();