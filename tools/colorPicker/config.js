/**
 * 多宝工具箱 - 颜色选择器 (配置模块)
 */

/**
 * 保存用户设置
 * @param {Object} settings - 用户设置对象
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem('settings_colorPicker', JSON.stringify(settings));
  } catch (e) {
    console.error('保存设置失败', e);
  }
}

/**
 * 加载用户设置
 * @returns {Object|null} 用户设置对象，如果不存在则返回null
 */
export function loadSettings() {
  try {
    const settings = localStorage.getItem('settings_colorPicker');
    return settings ? JSON.parse(settings) : null;
  } catch (e) {
    console.error('加载设置失败', e);
    return null;
  }
}

/**
 * 获取首选颜色格式
 * @returns {string} 首选颜色格式 ('hex', 'rgb', 或 'hsl')
 */
export function getPreferredColorFormat() {
  // 从设置中获取，如果没有则默认为hex
  const settings = loadSettings() || {};
  return settings.preferredFormat || 'hex';
}

/**
 * 保存调色板到本地存储
 * @param {Array} paletteColors - 调色板颜色数组
 */
export function savePalette(paletteColors) {
  localStorage.setItem('colorPicker_palette', JSON.stringify(paletteColors));
}

/**
 * 加载调色板
 * @returns {Array} 调色板颜色数组
 */
export function loadPalette() {
  try {
    const savedPalette = localStorage.getItem('colorPicker_palette');
    if (savedPalette) {
      return JSON.parse(savedPalette);
    }
  } catch (e) {
    console.error('加载调色板失败:', e);
  }
  return [];
}