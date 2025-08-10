/**
 * 多宝工具库
 * 版本: 1.3.0
 * 最后更新: 2025-08-08
 *
 * 这是一个全面的前端工具库，提供了丰富的功能模块：
 * - 通用工具函数
 * - 文件处理
 * - 图像处理
 * - 颜色处理
 * - 数学计算
 * - 日期时间处理
 * - 字符串处理
 * - 数组操作
 * - 对象操作
 * - 网络请求
 * - 存储管理
 */

// 定义全局命名空间
window.DuobaoLibs = {};

// 导入各个模块
(function() {
  // 动态加载模块
  function loadModule(name) {
    const script = document.createElement('script');
    script.src = `static/js/libs/${name}.js`;
    document.head.appendChild(script);
    return new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
    });
  }
  
  // 加载所有模块
  Promise.all([
    loadModule('utils'),
    loadModule('file'),
    loadModule('image'),
    loadModule('color'),
    loadModule('math'),
    loadModule('date'),
    loadModule('string'),
    loadModule('array'),
    loadModule('object'),
    loadModule('network'),
    loadModule('drawer'),
    loadModule('notification')
  ]).then(() => {
    console.log('所有库模块加载完成');
    // 触发库加载完成事件
    const event = new CustomEvent('duobaoLibsLoaded');
    document.dispatchEvent(event);
  }).catch(error => {
    console.error('库模块加载失败:', error);
  });
})();