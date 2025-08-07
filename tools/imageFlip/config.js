/**
 * 多宝工具箱 - 图片对称反转工具 - 配置模块
 */
const config = {
  // 保存用户设置
  saveSettings: function(settings) {
    try {
      localStorage.setItem('settings_imageFlip', JSON.stringify(settings));
    } catch (e) {
      console.error('保存设置失败', e);
    }
  },
  
  // 加载用户设置
  loadSettings: function() {
    try {
      const settings = localStorage.getItem('settings_imageFlip');
      return settings ? JSON.parse(settings) : null;
    } catch (e) {
      console.error('加载设置失败', e);
      return null;
    }
  },
  
  // 默认设置
  defaultSettings: {
    quality: 90,
    direction: 'horizontal',
    outputFormat: 'same',
    partialMode: 'disabled',
    brightness: 0,
    contrast: 0,
    saturation: 0,
    grayscale: false,
    infoCollapsed: false
  }
};

module.exports = config;