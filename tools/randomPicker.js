/**
 * 随机选择器工具 - 主入口文件
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
        loadScript('tools/randomPicker/utils.js'),
        loadScript('tools/randomPicker/core.js'),
        loadScript('tools/randomPicker/data.js'),
        loadScript('tools/randomPicker/history.js'),
        loadScript('tools/randomPicker/visual.js')
      ]).then(() => {
        // 最后加载UI模块
        loadScript('tools/randomPicker/ui.js').then(() => {
          // 加载主模块
          loadScript('tools/randomPicker/index.js');
        });
      }).catch(error => {
        console.error('加载模块失败:', error);
        container.innerHTML = '<div class="tool-error">加载模块失败</div>';
      });
    }
  };

  // 注册工具
  window.duobaoTools = window.duobaoTools || {};
  window.duobaoTools.randomPicker = {
    name: '随机选择器',
    icon: 'fa-random',
    description: '从列表、范围或自定义数据中随机选择项目，支持权重、排除和历史记录。',
    render: tool.render
  };
})();