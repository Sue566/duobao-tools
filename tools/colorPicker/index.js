/**
 * 多宝工具箱 - 颜色选择器 (入口文件)
 */
import { initUI, renderUI } from './ui.js';
import { setupEventListeners } from './events.js';
import { loadSettings, saveSettings } from './config.js';

(function() {
  // 定义工具
  const tool = {
    id: 'colorPicker',
    name: '颜色选择器',
    icon: 'fa-eyedropper',
    
    // 工具配置
    config: {
      // 保存用户设置
      saveSettings: function(settings) {
        saveSettings(settings);
      },
      
      // 加载用户设置
      loadSettings: function() {
        return loadSettings();
      }
    },
    
    // 工具初始化时调用
    init: function() {
      // 检查浏览器是否支持屏幕取色API
      if (!window.EyeDropper) {
        console.log('浏览器不支持屏幕取色API');
      }
    },
    
    render: function(container) {
      // 创建工具界面
      renderUI(container);
      
      // 初始化UI组件
      const uiElements = initUI(container);
      
      // 设置事件监听器
      setupEventListeners(container, uiElements, this.config);
    }
  };
  
  // 注册工具
  window.tools = window.tools || {};
  window.tools.colorPicker = tool;
})();