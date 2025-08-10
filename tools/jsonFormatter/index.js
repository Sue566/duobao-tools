/**
 * JSON格式化工具 - 入口文件
 * 增强版：支持JSON路径查询、架构验证、转换和比较功能
 */

(function() {
  // 初始化JSON格式化工具
  function initJsonFormatter() {
    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', function() {
      // 初始化UI和事件绑定
      window.jsonFormatter.ui.init({
        formatter: window.jsonFormatter.formatter,
        treeView: window.jsonFormatter.treeView,
        query: window.jsonFormatter.query,
        converter: window.jsonFormatter.converter,
        compare: window.jsonFormatter.compare,
        utils: window.jsonFormatter.utils
      });
    });
  }

  // 创建全局命名空间
  window.jsonFormatter = window.jsonFormatter || {};
  
  // 注册工具
  window.duobaoTools = window.duobaoTools || {};
  window.duobaoTools.jsonFormatter = {
    name: 'JSON格式化',
    icon: 'fa-code',
    description: '格式化、验证、查询和转换JSON数据，提供树视图和路径查询功能。',
    render: initJsonFormatter
  };
})();