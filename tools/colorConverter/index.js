/**
 * 多宝工具箱 - 颜色转换工具
 */
(function() {
  // 全局命名空间
  window.colorConverter = {
    utils: {},
    converter: {},
    palette: {},
    schemes: {},
    accessibility: {},
    ui: {}
  };
  
  // 工具模块
  const tool = {
    render: function(container) {
      // 初始化UI
      window.colorConverter.ui.initUI(container);
      
      console.log('颜色转换工具初始化完成');
    }
  };
  
  // 将工具对象暴露给主模块
  if (window.tools && window.tools.colorConverter) {
    // 如果主模块已经存在，则扩展它
    Object.assign(window.tools.colorConverter, {
      _internalTool: tool
    });
  } else {
    // 如果主模块不存在，则创建它
    window.tools = window.tools || {};
    window.tools.colorConverter = {
      _internalTool: tool,
      render: function(container) {
        return tool.render(container);
      }
    };
  }
})();