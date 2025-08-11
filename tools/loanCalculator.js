/**
 * 多宝工具箱 - 贷款计算器工具
 * 
 * 这是一个入口文件，用于加载模块化的贷款计算器工具
 */

// 加载贷款计算器模块
(function() {
  // 加载主模块
  const script = document.createElement('script');
  script.src = 'tools/loanCalculator/index.js';
  document.head.appendChild(script);
})();