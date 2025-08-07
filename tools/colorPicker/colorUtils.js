/**
 * 多宝工具箱 - 颜色选择器 (颜色工具模块)
 */

/**
 * HEX转RGB
 * @param {string} hex - HEX颜色值
 * @returns {Object} RGB颜色对象 {r, g, b}
 */
export function hexToRgb(hex) {
  // 移除#前缀
  hex = hex.replace(/^#/, '');
  
  // 处理简写形式
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
}

/**
 * RGB转HSL
 * @param {number} r - 红色通道值 (0-255)
 * @param {number} g - 绿色通道值 (0-255)
 * @param {number} b - 蓝色通道值 (0-255)
 * @returns {Object} HSL颜色对象 {h, s, l}
 */
export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // 灰色
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * HSL转RGB
 * @param {number} h - 色调 (0-360)
 * @param {number} s - 饱和度 (0-100)
 * @param {number} l - 亮度 (0-100)
 * @returns {Object} RGB颜色对象 {r, g, b}
 */
export function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // 灰色
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * HSL转HEX
 * @param {number} h - 色调 (0-360)
 * @param {number} s - 饱和度 (0-100)
 * @param {number} l - 亮度 (0-100)
 * @returns {string} HEX颜色值
 */
export function hslToHex(h, s, l) {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * RGB转HEX
 * @param {number} r - 红色通道值 (0-255)
 * @param {number} g - 绿色通道值 (0-255)
 * @param {number} b - 蓝色通道值 (0-255)
 * @returns {string} HEX颜色值
 */
export function rgbToHex(r, g, b) {
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * 规范化HEX值
 * @param {string} hex - HEX颜色值
 * @returns {string|null} 规范化的HEX颜色值，如果无效则返回null
 */
export function normalizeHex(hex) {
  // 移除#前缀
  hex = hex.replace(/^#/, '');
  
  // 处理简写形式 (例如 #ABC -> #AABBCC)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  // 验证HEX格式
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    console.error('无效的HEX颜色值:', hex);
    return null;
  }
  
  return '#' + hex.toUpperCase();
}

/**
 * 验证RGB值
 * @param {number} r - 红色通道值
 * @param {number} g - 绿色通道值
 * @param {number} b - 蓝色通道值
 * @returns {boolean} 是否为有效的RGB值
 */
export function isValidRgb(r, g, b) {
  return !isNaN(r) && !isNaN(g) && !isNaN(b) &&
         r >= 0 && r <= 255 &&
         g >= 0 && g <= 255 &&
         b >= 0 && b <= 255;
}

/**
 * 验证HSL值
 * @param {number} h - 色调
 * @param {number} s - 饱和度
 * @param {number} l - 亮度
 * @returns {boolean} 是否为有效的HSL值
 */
export function isValidHsl(h, s, l) {
  return !isNaN(h) && !isNaN(s) && !isNaN(l) &&
         h >= 0 && h <= 360 &&
         s >= 0 && s <= 100 &&
         l >= 0 && l <= 100;
}