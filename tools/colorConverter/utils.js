/**
 * 多宝工具箱 - 颜色转换工具 - 工具函数模块
 */
(function() {
  const utils = {
    // 显示提示消息
    showToast: function(message, type = 'info') {
      if (window.duobao && window.duobao.notification) {
        window.duobao.notification.show(message, type);
      } else {
        alert(message);
      }
    },
    
    // 复制文本到剪贴板
    copyToClipboard: function(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        return successful;
      } catch (err) {
        document.body.removeChild(textarea);
        return false;
      }
    },
    
    // 验证颜色格式
    isValidColor: function(color) {
      const tempElement = document.createElement('div');
      tempElement.style.color = '';
      tempElement.style.color = color;
      return tempElement.style.color !== '';
    },
    
    // 将RGB转换为HEX
    rgbToHex: function(r, g, b) {
      return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    },
    
    // 将HEX转换为RGB
    hexToRgb: function(hex) {
      // 移除#号
      hex = hex.replace(/^#/, '');
      
      // 处理简写形式 (#RGB)
      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
      }
      
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      
      return { r, g, b };
    },
    
    // 将RGB转换为HSL
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
    
    // 将HSL转换为RGB
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
    
    // 将RGB转换为HSV
    rgbToHsv: function(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, v = max;
      
      const d = max - min;
      s = max === 0 ? 0 : d / max;
      
      if (max === min) {
        h = 0; // 灰色
      } else {
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
        v: Math.round(v * 100)
      };
    },
    
    // 将HSV转换为RGB
    hsvToRgb: function(h, s, v) {
      h /= 360;
      s /= 100;
      v /= 100;
      
      let r, g, b;
      
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      
      switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
      }
      
      return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
      };
    },
    
    // 将RGB转换为CMYK
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
    
    // 将CMYK转换为RGB
    cmykToRgb: function(c, m, y, k) {
      c /= 100;
      m /= 100;
      y /= 100;
      k /= 100;
      
      const r = 255 * (1 - c) * (1 - k);
      const g = 255 * (1 - m) * (1 - k);
      const b = 255 * (1 - y) * (1 - k);
      
      return {
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(b)
      };
    },
    
    // 将RGB转换为LAB
    rgbToLab: function(r, g, b) {
      // 先转换为XYZ
      r /= 255;
      g /= 255;
      b /= 255;
      
      r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
      g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
      b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
      
      r *= 100;
      g *= 100;
      b *= 100;
      
      const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
      const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
      const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
      
      // 然后转换为Lab
      const xRef = 95.047;
      const yRef = 100.0;
      const zRef = 108.883;
      
      const x1 = x / xRef;
      const y1 = y / yRef;
      const z1 = z / zRef;
      
      const fx = x1 > 0.008856 ? Math.pow(x1, 1/3) : (7.787 * x1) + (16 / 116);
      const fy = y1 > 0.008856 ? Math.pow(y1, 1/3) : (7.787 * y1) + (16 / 116);
      const fz = z1 > 0.008856 ? Math.pow(z1, 1/3) : (7.787 * z1) + (16 / 116);
      
      const l = (116 * fy) - 16;
      const a = 500 * (fx - fy);
      const b2 = 200 * (fy - fz);
      
      return {
        l: Math.round(l),
        a: Math.round(a),
        b: Math.round(b2)
      };
    },
    
    // 将LAB转换为RGB
    labToRgb: function(l, a, b) {
      // 先转换为XYZ
      const y = (l + 16) / 116;
      const x = a / 500 + y;
      const z = y - b / 200;
      
      const y3 = Math.pow(y, 3);
      const x3 = Math.pow(x, 3);
      const z3 = Math.pow(z, 3);
      
      let y1 = y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787;
      let x1 = x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787;
      let z1 = z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787;
      
      const xRef = 95.047;
      const yRef = 100.0;
      const zRef = 108.883;
      
      x1 *= xRef;
      y1 *= yRef;
      z1 *= zRef;
      
      // 然后转换为RGB
      let r = x1 * 3.2406 + y1 * -1.5372 + z1 * -0.4986;
      let g = x1 * -0.9689 + y1 * 1.8758 + z1 * 0.0415;
      let b1 = x1 * 0.0557 + y1 * -0.2040 + z1 * 1.0570;
      
      r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
      g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
      b1 = b1 > 0.0031308 ? 1.055 * Math.pow(b1, 1 / 2.4) - 0.055 : 12.92 * b1;
      
      r = Math.max(0, Math.min(1, r));
      g = Math.max(0, Math.min(1, g));
      b1 = Math.max(0, Math.min(1, b1));
      
      return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b1 * 255)
      };
    },
    
    // 保存颜色到历史记录
    saveColorToHistory: function(color) {
      try {
        // 获取历史记录
        let history = localStorage.getItem('colorConverterHistory');
        history = history ? JSON.parse(history) : [];
        
        // 检查是否已存在
        const exists = history.includes(color);
        if (exists) {
          // 移除旧记录
          history = history.filter(c => c !== color);
        }
        
        // 添加到开头
        history.unshift(color);
        
        // 限制历史记录数量
        if (history.length > 20) {
          history = history.slice(0, 20);
        }
        
        // 保存历史记录
        localStorage.setItem('colorConverterHistory', JSON.stringify(history));
        
        return true;
      } catch (e) {
        console.error('保存历史记录失败:', e);
        return false;
      }
    },
    
    // 获取颜色历史记录
    getColorHistory: function() {
      try {
        const history = localStorage.getItem('colorConverterHistory');
        return history ? JSON.parse(history) : [];
      } catch (e) {
        console.error('获取历史记录失败:', e);
        return [];
      }
    },
    
    // 清空历史记录
    clearColorHistory: function() {
      try {
        localStorage.removeItem('colorConverterHistory');
        return true;
      } catch (e) {
        console.error('清空历史记录失败:', e);
        return false;
      }
    }
  };
  
  // 将工具函数添加到全局命名空间
  window.colorConverter.utils = utils;
})();