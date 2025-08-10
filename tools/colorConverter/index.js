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
  
  // 初始化函数
  function init() {
    // 获取工具容器
    const container = document.querySelector('.color-converter-container');
    if (!container) return;
    
    // 初始化UI
    window.colorConverter.ui.initUI(container);
    
    console.log('颜色转换工具初始化完成');
  }
  
  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();