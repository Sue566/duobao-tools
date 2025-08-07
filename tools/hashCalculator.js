/**
 * 哈希计算器工具 - 主入口文件
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 加载模块JS文件
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };
      
      // 按顺序加载所有模块
      Promise.all([
        loadScript('tools/hashCalculator/utils.js'),
        loadScript('tools/hashCalculator/core.js'),
        loadScript('tools/hashCalculator/compare.js')
      ]).then(() => {
        // 最后加载UI模块
        loadScript('tools/hashCalculator/ui.js').then(() => {
          // 加载主模块
          loadScript('tools/hashCalculator/index.js');
        });
      }).catch(error => {
        console.error('加载模块失败:', error);
        container.innerHTML = '<div class="tool-error">加载模块失败</div>';
      });
    }
  };

  // 注册工具
  window.duobaoTools = window.duobaoTools || {};
  window.duobaoTools.hashCalculator = {
    name: '哈希计算器',
    icon: 'fa-hashtag',
    description: '计算文件或文本的哈希值，支持MD5、SHA-1、SHA-256等多种算法。',
    render: tool.render
  };
})();