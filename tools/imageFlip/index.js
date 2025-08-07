/**
 * 多宝工具箱 - 图片对称反转工具 - 主入口文件
 */
(function() {
  // 导入模块
  const ui = require('./ui');
  const core = require('./core');
  const utils = require('./utils');
  const config = require('./config');
  const handlers = require('./handlers');
  const partialFlip = require('./partialFlip');
  const imageAdjust = require('./imageAdjust');
  
  // 定义工具
  const tool = {
    // 工具配置
    config: config,
    
    // 工具初始化时调用
    init: function() {
      console.log('图片对称反转工具初始化');
      
      // 加载用户设置
      const savedSettings = this.config.loadSettings();
      if (savedSettings) {
        console.log('已加载用户设置');
      }
    },
    
    // 渲染工具界面
    render: function(container) {
      // 创建工具界面
      ui.renderUI(container);
      
      // 初始化事件处理
      handlers.initEventHandlers(container);
    }
  };
  
  // 注册工具
  window.tools.imageFlip = tool;
})();