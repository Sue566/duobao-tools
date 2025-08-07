/**
 * 正则表达式测试工具 - 入口文件
 * 增强版：支持正则表达式保存、导入导出、替换预览和常用正则模板
 */
import { renderUI } from './ui.js';
import { setupEventListeners } from './events.js';

(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      renderUI(container);
      
      // 设置事件监听器
      setupEventListeners(container);
    }
  };
  
  // 注册工具
  window.tools.regexTester = tool;
})();