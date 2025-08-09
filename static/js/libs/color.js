/**
 * 多宝工具库 - 颜色处理工具
 */

window.DuobaoColor = {
  // RGB转十六进制
  rgbToHex: function(r, g, b) {
    if (typeof r === 'object') {
      g = r.g;
      b = r.b;
      r = r.r;
    }
    
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },
  
  // 十六进制转RGB
  hexToRgb: function(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },
  
  // RGB转HSL
  rgbToHsl: function(r, g, b) {
    if (typeof r === 'object') {
      g = r.g;
      b = r.b;
      r = r.r;
    }
    
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
    if (typeof h === 'object') {
      s = h.s;
      l = h.l;
      h = h.h;
    }
    
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
    if (typeof r === 'object') {
      g = r.g;
      b = r.b;
      r = r.r;
    }
    
    r /= 255;
    g /= 255;
    b /= 255;
    
    const k = 1 - Math.max(r, g, b);
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;
    
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  },
  
  // CMYK转RGB
  cmykToRgb: function(c, m, y, k) {
    if (typeof c === 'object') {
      m = c.m;
      y = c.y;
      k = c.k;
      c = c.c;
    }
    
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
  
  // RGB转HSV
  rgbToHsv: function(r, g, b) {
    if (typeof r === 'object') {
      g = r.g;
      b = r.b;
      r = r.r;
    }
    
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
  
  // HSV转RGB
  hsvToRgb: function(h, s, v) {
    if (typeof h === 'object') {
      s = h.s;
      v = h.v;
      h = h.h;
    }
    
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
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  },
  
  // 生成互补色
  getComplementaryColor: function(hex) {
    const rgb = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    hsl.h = (hsl.h + 180) % 360;
    
    const complementaryRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
    
    return this.rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b);
  },
  
  // 生成类似色
  getAnalogousColors: function(hex, count = 2, angle = 30) {
    const rgb = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors = [];
    
    for (let i = 1; i <= count; i++) {
      const newHsl = { ...hsl };
      newHsl.h = (hsl.h + angle * i) % 360;
      
      const newRgb = this.hslToRgb(newHsl.h, newHsl.s, newHsl.l);
      colors.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    
    return colors;
  },
  
  // 生成三元色
  getTriadicColors: function(hex) {
    const rgb = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    const colors = [];
    
    for (let i = 1; i <= 2; i++) {
      const newHsl = { ...hsl };
      newHsl.h = (hsl.h + 120 * i) % 360;
      
      const newRgb = this.hslToRgb(newHsl.h, newHsl.s, newHsl.l);
      colors.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    
    return colors;
  },
  
  // 生成色调变化
  getTints: function(hex, count = 5) {
    const rgb = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const tints = [];
    
    const step = (100 - hsl.l) / (count + 1);
    
    for (let i = 1; i <= count; i++) {
      const newHsl = { ...hsl };
      newHsl.l = Math.min(100, hsl.l + step * i);
      
      const newRgb = this.hslToRgb(newHsl.h, newHsl.s, newHsl.l);
      tints.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    
    return tints;
  },
  
  // 生成色度变化
  getShades: function(hex, count = 5) {
    const rgb = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const shades = [];
    
    const step = hsl.l / (count + 1);
    
    for (let i = 1; i <= count; i++) {
      const newHsl = { ...hsl };
      newHsl.l = Math.max(0, hsl.l - step * i);
      
      const newRgb = this.hslToRgb(newHsl.h, newHsl.s, newHsl.l);
      shades.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    
    return shades;
  },
  
  // 生成单色方案
  getMonochromaticColors: function(hex, count = 5) {
    return [...this.getTints(hex, Math.floor(count / 2)), ...this.getShades(hex, Math.ceil(count / 2))];
  },
  
  // 生成分裂互补色
  getSplitComplementaryColors: function(hex, angle = 30) {
    const complementary = this.getComplementaryColor(hex);
    return [complementary, ...this.getAnalogousColors(complementary, 2, angle)];
  },
  
  // 生成四元色
  getTetradicColors: function(hex) {
    const rgb = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    const colors = [];
    
    for (let i = 1; i <= 3; i++) {
      const newHsl = { ...hsl };
      newHsl.h = (hsl.h + 90 * i) % 360;
      
      const newRgb = this.hslToRgb(newHsl.h, newHsl.s, newHsl.l);
      colors.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    
    return colors;
  },
  
  // 生成方形色
  getSquareColors: function(hex) {
    const rgb = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    const colors = [];
    
    for (let i = 1; i <= 3; i++) {
      const newHsl = { ...hsl };
      newHsl.h = (hsl.h + 90 * i) % 360;
      
      const newRgb = this.hslToRgb(newHsl.h, newHsl.s, newHsl.l);
      colors.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    
    return colors;
  },
  
  // 计算颜色亮度
  getLuminance: function(r, g, b) {
    if (typeof r === 'object') {
      g = r.g;
      b = r.b;
      r = r.r;
    } else if (typeof r === 'string') {
      const rgb = this.hexToRgb(r);
      r = rgb.r;
      g = rgb.g;
      b = rgb.b;
    }
    
    // 相对亮度公式
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  },
  
  // 计算对比度
  getContrastRatio: function(color1, color2) {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  },
  
  // 检查颜色是否可访问
  isAccessible: function(foreground, background, level = 'AA', isLargeText = false) {
    const ratio = this.getContrastRatio(foreground, background);
    
    if (level === 'AA') {
      return isLargeText ? ratio >= 3 : ratio >= 4.5;
    } else if (level === 'AAA') {
      return isLargeText ? ratio >= 4.5 : ratio >= 7;
    }
    
    return false;
  },
  
  // 获取可访问的文本颜色
  getAccessibleTextColor: function(backgroundColor, preferredColor = '#000000') {
    const blackContrast = this.getContrastRatio(backgroundColor, '#000000');
    const whiteContrast = this.getContrastRatio(backgroundColor, '#FFFFFF');
    
    if (preferredColor === '#000000' || preferredColor === '#FFFFFF') {
      return blackContrast > whiteContrast ? '#000000' : '#FFFFFF';
    }
    
    const preferredContrast = this.getContrastRatio(backgroundColor, preferredColor);
    
    if (preferredContrast >= 4.5) {
      return preferredColor;
    }
    
    return blackContrast > whiteContrast ? '#000000' : '#FFFFFF';
  },
  
  // 混合两种颜色
  mix: function(color1, color2, weight = 0.5) {
    const rgb1 = typeof color1 === 'string' ? this.hexToRgb(color1) : color1;
    const rgb2 = typeof color2 === 'string' ? this.hexToRgb(color2) : color2;
    
    const w = 2 * weight - 1;
    const a = 0; // 假设不透明度为1
    
    const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
    const w2 = 1 - w1;
    
    const r = Math.round(rgb1.r * w1 + rgb2.r * w2);
    const g = Math.round(rgb1.g * w1 + rgb2.g * w2);
    const b = Math.round(rgb1.b * w1 + rgb2.b * w2);
    
    return typeof color1 === 'string' ? this.rgbToHex(r, g, b) : { r, g, b };
  },
  
  // 随机生成颜色
  random: function() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    
    return this.rgbToHex(r, g, b);
  },
  
  // 解析颜色字符串
  parse: function(colorStr) {
    // 处理十六进制
    if (colorStr.startsWith('#')) {
      return this.hexToRgb(colorStr);
    }
    
    // 处理rgb/rgba
    const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3]),
        a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1
      };
    }
    
    // 处理hsl/hsla
    const hslMatch = colorStr.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)/);
    if (hslMatch) {
      const rgb = this.hslToRgb(
        parseInt(hslMatch[1]),
        parseInt(hslMatch[2]),
        parseInt(hslMatch[3])
      );
      
      return {
        ...rgb,
        a: hslMatch[4] ? parseFloat(hslMatch[4]) : 1
      };
    }
    
    // 处理颜色名称
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = colorStr;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    
    return { r, g, b };
  },
  
  // 转换为CSS颜色字符串
  toCssString: function(color, format = 'hex') {
    if (typeof color === 'string') {
      color = this.parse(color);
    }
    
    switch (format.toLowerCase()) {
      case 'hex':
        return this.rgbToHex(color.r, color.g, color.b);
      case 'rgb':
        return `rgb(${color.r}, ${color.g}, ${color.b})`;
      case 'rgba':
        return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a || 1})`;
      case 'hsl': {
        const hsl = this.rgbToHsl(color.r, color.g, color.b);
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      }
      case 'hsla': {
        const hsl = this.rgbToHsl(color.r, color.g, color.b);
        return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${color.a || 1})`;
      }
      default:
        return this.rgbToHex(color.r, color.g, color.b);
    }
  }
};