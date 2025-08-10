/**
 * 多宝工具箱 - 随机选择器工具
 */
(function() {
  // 全局命名空间
  window.randomPicker = {
    utils: {},
    core: {},
    data: {},
    history: {},
    visual: {},
    ui: {}
  };
  
  // 初始化函数
  function init() {
    // 获取工具容器
    const container = document.querySelector('.random-picker-container');
    if (!container) return;
    
    // 初始化UI
    window.randomPicker.ui.init(container);
    
    console.log('随机选择器工具初始化完成');
  }
  
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = window.randomPicker.ui.getHTML();
      
      // 添加收藏按钮
      if (window.addFavoriteButton) {
        window.addFavoriteButton('randomPicker', container.querySelector('.tool-header'));
      }
      
      // 初始化UI和事件监听
      window.randomPicker.ui.init(container);
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = window.randomPicker.ui.getStyles();
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools = window.tools || {};
  window.tools.randomPicker = tool;
  
  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();