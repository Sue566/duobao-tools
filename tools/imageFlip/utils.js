/**
 * 多宝工具箱 - 图片对称反转工具 - 工具类模块
 */

const utils = {
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
    
    return [h, s, l];
  },
  
  // HSL转RGB
  hslToRgb: function(h, s, l) {
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
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  },
  
  // 格式化文件大小
  formatFileSize: function(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  // 显示提示消息
  showToast: function(message, type = 'info') {
    if (window.showToast) {
      window.showToast(message, type);
    } else {
      console.log(message);
      alert(message);
    }
  },
  
  // 创建下载链接
  createDownloadLink: function(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  
  // 加载外部脚本
  loadScript: function(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = () => {
      console.error(`加载脚本失败: ${src}`);
      if (callback) callback(new Error(`加载脚本失败: ${src}`));
    };
    document.head.appendChild(script);
  },
  
  // 创建并下载ZIP文件
  createAndDownloadZip: function(images, zipFileName, onProgress, onComplete, onError) {
    // 检查是否有JSZip库
    if (typeof JSZip === 'undefined') {
      // 加载JSZip库
      this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', (err) => {
        if (err) {
          if (onError) onError(err);
          return;
        }
        this.createZipFile(images, zipFileName, onProgress, onComplete, onError);
      });
    } else {
      this.createZipFile(images, zipFileName, onProgress, onComplete, onError);
    }
  },
  
  // 创建ZIP文件
  createZipFile: function(images, zipFileName, onProgress, onComplete, onError) {
    const zip = new JSZip();
    
    // 添加每个图片到ZIP
    images.forEach((image, index) => {
      zip.file(image.fileName, image.blob);
      if (onProgress) onProgress(index + 1, images.length);
    });
    
    // 生成ZIP文件
    zip.generateAsync({ type: 'blob' })
      .then(content => {
        // 下载ZIP文件
        this.createDownloadLink(content, zipFileName || 'flipped_images.zip');
        if (onComplete) onComplete(content);
      })
      .catch(err => {
        console.error('打包失败:', err);
        if (onError) onError(err);
      });
  }
};

module.exports = utils;