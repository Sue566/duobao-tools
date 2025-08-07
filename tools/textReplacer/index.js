/**
 * 文本替换工具 - 入口文件
 * 增强版：支持批量替换、正则表达式、替换规则保存与导入导出
 */

const config = require('./config');
const ui = require('./ui');
const utils = require('./utils');
const events = require('./events');
const history = require('./history');
const rules = require('./rules');

// 定义工具
const tool = {
  // 工具配置
  config: config,
  
  // 工具初始化
  init: function() {
    console.log('文本替换工具初始化');
  },
  
  // 渲染工具界面
  render: function(container) {
    // 渲染UI
    ui.render(container);
    
    // 初始化事件
    events.init(container);
    
    // 初始化文本统计
    utils.updateTextStats(container);
  }
};

// 注册工具
window.tools.textReplacer = tool;