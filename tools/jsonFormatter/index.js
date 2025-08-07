/**
 * JSON格式化工具 - 入口文件
 * 增强版：支持JSON路径查询、架构验证、转换和比较功能
 */

const ui = require('./ui');
const formatter = require('./formatter');
const treeView = require('./treeView');
const query = require('./query');
const converter = require('./converter');
const compare = require('./compare');
const utils = require('./utils');

// 初始化JSON格式化工具
function initJsonFormatter() {
  // 页面加载完成后初始化
  document.addEventListener('DOMContentLoaded', function() {
    // 初始化UI和事件绑定
    ui.init({
      formatter,
      treeView,
      query,
      converter,
      compare,
      utils
    });
  });
}

// 注册工具
window.duobaoTools = window.duobaoTools || {};
window.duobaoTools.jsonFormatter = {
  name: 'JSON格式化',
  icon: 'fa-code',
  description: '格式化、验证、查询和转换JSON数据，提供树视图和路径查询功能。',
  render: initJsonFormatter
};

module.exports = initJsonFormatter;