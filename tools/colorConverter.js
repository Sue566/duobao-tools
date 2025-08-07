/**
 * 颜色转换工具 - 主入口文件
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
        loadScript('tools/colorConverter/utils.js'),
        loadScript('tools/colorConverter/converter.js'),
        loadScript('tools/colorConverter/palette.js'),
        loadScript('tools/colorConverter/schemes.js'),
        loadScript('tools/colorConverter/accessibility.js')
      ]).then(() => {
        // 最后加载UI模块
        loadScript('tools/colorConverter/ui.js').then(() => {
          // 加载主模块
          loadScript('tools/colorConverter/index.js');
        });
      }).catch(error => {
        console.error('加载模块失败:', error);
        container.innerHTML = '<div class="tool-error">加载模块失败</div>';
      });
    }
  };

  // 注册工具
  window.duobaoTools = window.duobaoTools || {};
  window.duobaoTools.colorConverter = {
    name: '颜色转换器',
    icon: 'fa-eyedropper',
    description: '在不同颜色格式之间转换，支持HEX、RGB、HSL、HSV等多种格式。',
    render: tool.render
  };
})();