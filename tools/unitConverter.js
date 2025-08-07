/**
 * 单位转换工具 - 主入口文件
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
        loadScript('tools/unitConverter/data.js'),
        loadScript('tools/unitConverter/utils.js'),
        loadScript('tools/unitConverter/core.js'),
        loadScript('tools/unitConverter/history.js'),
        loadScript('tools/unitConverter/batch.js'),
        loadScript('tools/unitConverter/table.js'),
        loadScript('tools/unitConverter/custom.js')
      ]).then(() => {
        // 最后加载UI模块
        loadScript('tools/unitConverter/ui.js').then(() => {
          // 加载主模块
          loadScript('tools/unitConverter/index.js');
        });
      }).catch(error => {
        console.error('加载模块失败:', error);
        container.innerHTML = '<div class="tool-error">加载模块失败</div>';
      });
    }
  };

  // 注册工具
  window.duobaoTools = window.duobaoTools || {};
  window.duobaoTools.unitConverter = {
    name: '单位转换器',
    icon: 'fa-exchange',
    description: '转换各种单位，包括长度、面积、体积、重量、温度、时间、速度等。',
    render: tool.render
  };
})();