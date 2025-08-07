/**
 * 多宝工具箱 - 颜色转换工具 - UI模块整合
 */

const uiBase = require('./ui-base');
const uiConverter = require('./ui-converter');
const uiSchemes = require('./ui-schemes');
const uiAccessibility = require('./ui-accessibility');
const uiPalette = require('./ui-palette');

const ui = {
  // 渲染工具界面
  renderUI: function(container) {
    // 渲染基础UI结构
    uiBase.renderUI(container);
    
    // 渲染各个标签页内容
    uiConverter.render(container);
    uiSchemes.render(container);
    uiAccessibility.render(container);
    uiPalette.render(container);
  }
};

module.exports = ui;