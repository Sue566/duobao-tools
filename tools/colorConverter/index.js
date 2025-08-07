/**
 * 多宝工具箱 - 颜色转换工具 - 入口文件
 */

// 导入模块
const utils = require('./utils');
const converter = require('./converter');
const palette = require('./palette');
const schemes = require('./schemes');
const accessibility = require('./accessibility');
const ui = require('./ui');

// 定义工具
(function() {
  const tool = {
    render: function(container) {
      // 渲染UI
      ui.renderUI(container);
      
      // 初始化各个模块
      converter.initConverter(container);
      palette.initPalette(container);
      schemes.initSchemes(container);
      accessibility.initAccessibility(container);
    }
  };
  
  // 注册工具
  window.tools.colorConverter = tool;
})();