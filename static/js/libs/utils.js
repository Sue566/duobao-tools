/**
 * 多宝工具库 - 通用工具函数
 */

window.DuobaoUtils = {
  // 格式化日期
  formatDate: function(date, format) {
    const o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),
      "S": date.getMilliseconds()
    };

    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (let k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }

    return format;
  },

  // 生成UUID
  generateUUID: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  // 防抖函数
  debounce: function(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },

  // 节流函数
  throttle: function(func, wait, options) {
    let context, args, result;
    let timeout = null;
    let previous = 0;
    if (!options) options = {};
    const later = function() {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      const now = Date.now();
      if (!previous && options.leading === false) previous = now;
      const remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  },

  // 深拷贝
  deepClone: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
      return obj.map(item => this.deepClone(item));
    }
    
    if (obj instanceof Object) {
      const copy = {};
      Object.keys(obj).forEach(key => {
        copy[key] = this.deepClone(obj[key]);
      });
      return copy;
    }
    
    throw new Error('Unable to copy obj! Its type isn\'t supported.');
  },

  // 格式化文件大小
  formatFileSize: function(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },

  // 获取URL参数
  getUrlParam: function(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  },

  // 设置URL参数
  setUrlParam: function(name, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.replaceState({}, "", url);
  },

  // 删除URL参数
  removeUrlParam: function(name) {
    const url = new URL(window.location.href);
    url.searchParams.delete(name);
    window.history.replaceState({}, "", url);
  },

  // 随机数生成
  random: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // 随机字符串生成
  randomString: function(length, chars) {
    chars = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // 检查是否为移动设备
  isMobile: function() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // 检查是否为特定浏览器
  isBrowser: function(name) {
    const userAgent = navigator.userAgent.toLowerCase();
    
    switch (name.toLowerCase()) {
      case 'chrome':
        return /chrome/.test(userAgent) && !/edge/.test(userAgent);
      case 'firefox':
        return /firefox/.test(userAgent);
      case 'safari':
        return /safari/.test(userAgent) && !/chrome/.test(userAgent);
      case 'edge':
        return /edge/.test(userAgent);
      case 'ie':
        return /msie/.test(userAgent) || /trident/.test(userAgent);
      case 'opera':
        return /opera/.test(userAgent) || /opr/.test(userAgent);
      default:
        return false;
    }
  },
  
  // 检查是否支持特定功能
  supports: function(feature) {
    switch (feature.toLowerCase()) {
      case 'touch':
        return 'ontouchstart' in window;
      case 'geolocation':
        return 'geolocation' in navigator;
      case 'localstorage':
        return 'localStorage' in window;
      case 'sessionstorage':
        return 'sessionStorage' in window;
      case 'websocket':
        return 'WebSocket' in window;
      case 'webworker':
        return 'Worker' in window;
      case 'serviceworker':
        return 'serviceWorker' in navigator;
      case 'webgl':
        try {
          const canvas = document.createElement('canvas');
          return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
          return false;
        }
      default:
        return false;
    }
  },

  // 检查是否为空
  isEmpty: function(value) {
    if (value === null || value === undefined) {
      return true;
    }
    
    if (typeof value === 'string') {
      return value.trim() === '';
    }
    
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    
    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }
    
    return false;
  },

  // 转义HTML
  escapeHtml: function(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  },

  // 反转义HTML
  unescapeHtml: function(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent;
  },

  // 复制到剪贴板
  copyToClipboard: function(text) {
    return new Promise((resolve, reject) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
          .then(() => resolve(true))
          .catch(err => reject(err));
      } else {
        try {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          resolve(true);
        } catch (err) {
          reject(err);
        }
      }
    });
  },

  // 从剪贴板粘贴
  pasteFromClipboard: function() {
    return new Promise((resolve, reject) => {
      if (navigator.clipboard) {
        navigator.clipboard.readText()
          .then(text => resolve(text))
          .catch(err => reject(err));
      } else {
        reject(new Error('Clipboard API not supported'));
      }
    });
  },

  // 延迟执行
  delay: function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // 重试函数
  retry: function(fn, times, delay) {
    return new Promise((resolve, reject) => {
      const attempt = async (attemptsLeft) => {
        try {
          const result = await fn();
          resolve(result);
        } catch (err) {
          if (attemptsLeft <= 1) {
            reject(err);
            return;
          }
          
          setTimeout(() => attempt(attemptsLeft - 1), delay);
        }
      };
      
      attempt(times);
    });
  },

  // 缓存函数结果
  memoize: function(fn) {
    const cache = new Map();
    
    return function(...args) {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = fn.apply(this, args);
      cache.set(key, result);
      
      return result;
    };
  }
};