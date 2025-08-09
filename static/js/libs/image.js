/**
 * 多宝工具库 - 图像处理工具
 */

window.DuobaoImage = {
  // 加载图像
  load: function(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },
  
  // 调整图像大小
  resize: function(image, width, height, options = {}) {
    const { quality = 0.8, type = 'image/jpeg', keepAspectRatio = true } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    let newWidth = width;
    let newHeight = height;
    
    if (keepAspectRatio) {
      const ratio = Math.min(width / image.width, height / image.height);
      newWidth = image.width * ratio;
      newHeight = image.height * ratio;
    }
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    ctx.drawImage(image, 0, 0, newWidth, newHeight);
    
    return canvas.toDataURL(type, quality);
  },
  
  // 裁剪图像
  crop: function(image, x, y, width, height, options = {}) {
    const { quality = 0.8, type = 'image/jpeg' } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
    
    return canvas.toDataURL(type, quality);
  },
  
  // 旋转图像
  rotate: function(image, degrees, options = {}) {
    const { quality = 0.8, type = 'image/jpeg' } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const radians = degrees * Math.PI / 180;
    const sin = Math.sin(radians);
    const cos = Math.cos(radians);
    
    // 计算旋转后的尺寸
    const width = Math.abs(image.width * cos) + Math.abs(image.height * sin);
    const height = Math.abs(image.width * sin) + Math.abs(image.height * cos);
    
    canvas.width = width;
    canvas.height = height;
    
    // 移动到中心点
    ctx.translate(width / 2, height / 2);
    
    // 旋转
    ctx.rotate(radians);
    
    // 绘制图像
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    
    return canvas.toDataURL(type, quality);
  },
  
  // 翻转图像
  flip: function(image, horizontal = true, vertical = false, options = {}) {
    const { quality = 0.8, type = 'image/jpeg' } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = image.width;
    canvas.height = image.height;
    
    ctx.save();
    
    // 水平翻转
    if (horizontal) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    
    // 垂直翻转
    if (vertical) {
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
    }
    
    ctx.drawImage(image, 0, 0);
    
    ctx.restore();
    
    return canvas.toDataURL(type, quality);
  },
  
  // 调整亮度
  adjustBrightness: function(image, value, options = {}) {
    const { quality = 0.8, type = 'image/jpeg' } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = image.width;
    canvas.height = image.height;
    
    ctx.drawImage(image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, data[i] + value));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + value));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + value));
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    return canvas.toDataURL(type, quality);
  },
  
  // 调整对比度
  adjustContrast: function(image, value, options = {}) {
    const { quality = 0.8, type = 'image/jpeg' } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = image.width;
    canvas.height = image.height;
    
    ctx.drawImage(image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const factor = (259 * (value + 255)) / (255 * (259 - value));
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
      data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    return canvas.toDataURL(type, quality);
  },
  
  // 应用灰度滤镜
  grayscale: function(image, options = {}) {
    const { quality = 0.8, type = 'image/jpeg' } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = image.width;
    canvas.height = image.height;
    
    ctx.drawImage(image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    return canvas.toDataURL(type, quality);
  },
  
  // 应用反色滤镜
  invert: function(image, options = {}) {
    const { quality = 0.8, type = 'image/jpeg' } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = image.width;
    canvas.height = image.height;
    
    ctx.drawImage(image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    return canvas.toDataURL(type, quality);
  },
  
  // 应用模糊滤镜
  blur: function(image, radius = 5, options = {}) {
    const { quality = 0.8, type = 'image/jpeg' } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = image.width;
    canvas.height = image.height;
    
    ctx.filter = `blur(${radius}px)`;
    ctx.drawImage(image, 0, 0);
    
    return canvas.toDataURL(type, quality);
  },
  
  // 获取图像主色调
  getDominantColor: function(image) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 缩小图像以提高性能
    const size = 50;
    canvas.width = size;
    canvas.height = size;
    
    ctx.drawImage(image, 0, 0, size, size);
    
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    
    // 颜色计数
    const colorCounts = {};
    
    for (let i = 0; i < data.length; i += 4) {
      const r = Math.floor(data[i] / 10) * 10;
      const g = Math.floor(data[i + 1] / 10) * 10;
      const b = Math.floor(data[i + 2] / 10) * 10;
      
      const color = `rgb(${r},${g},${b})`;
      
      if (colorCounts[color]) {
        colorCounts[color]++;
      } else {
        colorCounts[color] = 1;
      }
    }
    
    // 找出出现次数最多的颜色
    let dominantColor = '';
    let maxCount = 0;
    
    for (const color in colorCounts) {
      if (colorCounts[color] > maxCount) {
        maxCount = colorCounts[color];
        dominantColor = color;
      }
    }
    
    return dominantColor;
  },
  
  // 应用滤镜
  applyFilter: function(image, filter, options = {}) {
    const { quality = 0.8, type = 'image/jpeg' } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = image.width;
    canvas.height = image.height;
    
    ctx.filter = filter;
    ctx.drawImage(image, 0, 0);
    
    return canvas.toDataURL(type, quality);
  },
  
  // 添加水印
  addWatermark: function(image, watermark, options = {}) {
    const {
      position = 'bottomRight',
      margin = 10,
      opacity = 0.7,
      scale = 1,
      quality = 0.8,
      type = 'image/jpeg'
    } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = image.width;
    canvas.height = image.height;
    
    // 绘制原始图像
    ctx.drawImage(image, 0, 0);
    
    // 计算水印尺寸
    const watermarkWidth = watermark.width * scale;
    const watermarkHeight = watermark.height * scale;
    
    // 计算水印位置
    let x, y;
    
    switch (position) {
      case 'topLeft':
        x = margin;
        y = margin;
        break;
      case 'topRight':
        x = canvas.width - watermarkWidth - margin;
        y = margin;
        break;
      case 'bottomLeft':
        x = margin;
        y = canvas.height - watermarkHeight - margin;
        break;
      case 'bottomRight':
      default:
        x = canvas.width - watermarkWidth - margin;
        y = canvas.height - watermarkHeight - margin;
        break;
      case 'center':
        x = (canvas.width - watermarkWidth) / 2;
        y = (canvas.height - watermarkHeight) / 2;
        break;
    }
    
    // 设置透明度
    ctx.globalAlpha = opacity;
    
    // 绘制水印
    ctx.drawImage(watermark, x, y, watermarkWidth, watermarkHeight);
    
    // 恢复透明度
    ctx.globalAlpha = 1.0;
    
    return canvas.toDataURL(type, quality);
  },
  
  // 转换为黑白图像
  toBlackAndWhite: function(image, threshold = 128, options = {}) {
    const { quality = 0.8, type = 'image/jpeg' } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = image.width;
    canvas.height = image.height;
    
    ctx.drawImage(image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const val = avg >= threshold ? 255 : 0;
      
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    return canvas.toDataURL(type, quality);
  },
  
  // 调整饱和度
  adjustSaturation: function(image, value, options = {}) {
    const { quality = 0.8, type = 'image/jpeg' } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = image.width;
    canvas.height = image.height;
    
    ctx.drawImage(image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // 转换为HSL
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2;
      
      if (max === min) {
        // 灰色，不调整
        continue;
      }
      
      const d = max - min;
      const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      // 调整饱和度
      const newS = Math.max(0, Math.min(1, s * (1 + value / 100)));
      
      // 转换回RGB
      const newRGB = this._hslToRgb(this._rgbToHsl(r, g, b, true).h, newS, l);
      
      data[i] = newRGB.r;
      data[i + 1] = newRGB.g;
      data[i + 2] = newRGB.b;
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    return canvas.toDataURL(type, quality);
  },
  
  // 辅助方法：RGB转HSL
  _rgbToHsl: function(r, g, b, normalized = false) {
    if (!normalized) {
      r /= 255;
      g /= 255;
      b /= 255;
    }
    
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
    
    return { h, s, l };
  },
  
  // 辅助方法：HSL转RGB
  _hslToRgb: function(h, s, l) {
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
  
  // 图像合成
  composite: function(baseImage, overlayImage, options = {}) {
    const {
      x = 0,
      y = 0,
      opacity = 1,
      blendMode = 'source-over',
      quality = 0.8,
      type = 'image/jpeg'
    } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = baseImage.width;
    canvas.height = baseImage.height;
    
    // 绘制基础图像
    ctx.drawImage(baseImage, 0, 0);
    
    // 设置混合模式和透明度
    ctx.globalCompositeOperation = blendMode;
    ctx.globalAlpha = opacity;
    
    // 绘制叠加图像
    ctx.drawImage(overlayImage, x, y);
    
    // 恢复默认设置
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
    
    return canvas.toDataURL(type, quality);
  }
};