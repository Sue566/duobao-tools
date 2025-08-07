/**
 * 多宝工具箱 - 颜色转换工具 - 工具类模块
 */

const utils = {
  // 显示提示消息
  showToast: function(message, type = 'info') {
    if (window.showToast) {
      window.showToast(message, type);
    } else {
      alert(message);
    }
  },
  
  // 复制到剪贴板
  copyToClipboard: function(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = 0;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (successful) {
        this.showToast('已复制到剪贴板', 'success');
      } else {
        this.showToast('复制失败', 'error');
      }
    } catch (err) {
      document.body.removeChild(textarea);
      this.showToast('复制失败: ' + err, 'error');
    }
  },
  
  // HEX转RGB
  hexToRgb: function(hex) {
    // 移除#号
    hex = hex.replace(/^#/, '');
    
    // 处理简写形式
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  },
  
  // RGB转HEX
  rgbToHex: function(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  },
  
  // RGB转HSL
  rgbToHsl: function(r, g, b) {
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
  },
  
  // HSL转RGB
  hslToRgb: function(h, s, l) {
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
  },
  
  // RGB转CMYK
  rgbToCmyk: function(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const k = 1 - Math.max(r, g, b);
    
    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 100 };
    }
    
    const c = (1 - r - k) / (1 - k);
    const m = (1 - g - k) / (1 - k);
    const y = (1 - b - k) / (1 - k);
    
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  },
  
  // RGB转HWB
  rgbToHwb: function(r, g, b) {
    const hsl = this.rgbToHsl(r, g, b);
    const white = Math.min(r, g, b) / 255;
    const black = 1 - Math.max(r, g, b) / 255;
    
    return {
      h: hsl.h,
      w: Math.round(white * 100),
      b: Math.round(black * 100)
    };
  },
  
  // 计算两个颜色的距离
  calculateColorDistance: function(hex1, hex2) {
    // 将HEX转换为RGB
    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);
    
    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);
    
    // 计算欧几里得距离
    return Math.sqrt(
      Math.pow(r1 - r2, 2) +
      Math.pow(g1 - g2, 2) +
      Math.pow(b1 - b2, 2)
    );
  }
};

module.exports = utils;