/**
 * 工具模板 - 配置模块
 */
(function() {
  // 定义配置模块
  window.toolTemplateConfig = {
    // 工具ID
    toolId: 'toolTemplate',
    
    // 默认设置
    defaultSettings: {
      advancedMode: true,
      autoSave: false,
      resultFormat: 'plain'
    },
    
    // 示例数据
    examples: [
      "这是示例文本1，用于演示多宝工具箱的功能。",
      "这是示例文本2，包含一些特殊字符：!@#$%^&*()。您可以看到工具如何处理这些字符。",
      "这是示例文本3，包含数字123和英文ABC。多宝工具箱可以轻松处理各种语言和格式的文本。",
      "这是一个较长的示例，演示工具处理多行文本的能力。\n第二行内容\n第三行内容\n可以看到工具如何保持文本的格式和结构。"
    ],
    
    /**
     * 保存用户设置
     * @param {Object} settings - 用户设置
     */
    saveSettings: function(settings) {
      try {
        localStorage.setItem(`settings_${this.toolId}`, JSON.stringify(settings));
      } catch (e) {
        console.error('保存设置失败', e);
      }
    },
    
    /**
     * 加载用户设置
     * @returns {Object} 用户设置
     */
    loadSettings: function() {
      try {
        const settings = localStorage.getItem(`settings_${this.toolId}`);
        return settings ? JSON.parse(settings) : this.defaultSettings;
      } catch (e) {
        console.error('加载设置失败', e);
        return this.defaultSettings;
      }
    },
    
    /**
     * 保存当前工具状态
     * @param {Object} state - 工具状态
     */
    saveState: function(state) {
      try {
        localStorage.setItem(`toolState_${this.toolId}`, JSON.stringify(state));
      } catch (e) {
        console.error('保存状态失败', e);
      }
    },
    
    /**
     * 加载工具状态
     * @returns {Object|null} 工具状态
     */
    loadState: function() {
      try {
        const state = localStorage.getItem(`toolState_${this.toolId}`);
        return state ? JSON.parse(state) : null;
      } catch (e) {
        console.error('加载状态失败', e);
        return null;
      }
    },
    
    /**
     * 保存信息折叠状态
     * @param {boolean} isCollapsed - 是否折叠
     */
    saveInfoCollapsed: function(isCollapsed) {
      localStorage.setItem(`infoCollapsed_${this.toolId}`, isCollapsed);
    },
    
    /**
     * 加载信息折叠状态
     * @returns {boolean} 是否折叠
     */
    loadInfoCollapsed: function() {
      return localStorage.getItem(`infoCollapsed_${this.toolId}`) === 'true';
    }
  };
})();