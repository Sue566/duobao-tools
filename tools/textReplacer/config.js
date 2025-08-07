/**
 * 文本替换工具 - 配置模块
 */

const config = {
  // 保存用户设置
  saveSettings: function(settings) {
    try {
      localStorage.setItem('settings_textReplacer', JSON.stringify(settings));
    } catch (e) {
      console.error('保存设置失败', e);
    }
  },
  
  // 加载用户设置
  loadSettings: function() {
    try {
      const settings = localStorage.getItem('settings_textReplacer');
      return settings ? JSON.parse(settings) : null;
    } catch (e) {
      console.error('加载设置失败', e);
      return null;
    }
  }
};

module.exports = config;