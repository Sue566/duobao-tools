/**
 * 多宝工具库
 * 版本: 1.3.0
 * 最后更新: 2025-08-08
 * 
 * 这是一个全面的前端工具库，提供了丰富的功能模块：
 * - 通用工具函数
 * - 文件处理
 * - 图像处理
 * - 颜色处理
 * - 数学计算
 * - 日期时间处理
 * - 字符串处理
 * - 数组操作
 * - 对象操作
 * - 网络请求
 * - 存储管理
 */

// 通用工具函数
const DuobaoUtils = {
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
  
  // 格式化货币
  formatCurrency: function(amount, currency = 'CNY', locale = 'zh-CN') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  },
  
  // 格式化数字
  formatNumber: function(number, decimals = 0, decimalSeparator = '.', thousandsSeparator = ',') {
    const fixed = parseFloat(number).toFixed(decimals);
    const [whole, fraction] = fixed.split('.');
    
    const wholeFormatted = whole.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    
    return fraction !== undefined ? wholeFormatted + decimalSeparator + fraction : wholeFormatted;
  },
  
  // 格式化百分比
  formatPercent: function(number, decimals = 2) {
    return (number * 100).toFixed(decimals) + '%';
  },
  
  // 生成随机颜色
  randomColor: function(format = 'hex') {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    
    switch (format.toLowerCase()) {
      case 'hex':
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      case 'rgb':
        return `rgb(${r}, ${g}, ${b})`;
      case 'rgba':
        return `rgba(${r}, ${g}, ${b}, 1)`;
      case 'object':
        return { r, g, b };
      default:
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
  },
  
  // 显示通知
  showNotification: function(message, type = 'info', duration = 3000) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `duobao-notification duobao-notification-${type}`;
    notification.innerHTML = `
      <div class="duobao-notification-content">
        <div class="duobao-notification-icon">${this.getNotificationIcon(type)}</div>
        <div class="duobao-notification-message">${message}</div>
      </div>
      <div class="duobao-notification-close">&times;</div>
    `;
    
    // 添加样式
    this.addNotificationStyles();
    
    // 添加到文档
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // 关闭按钮事件
    const closeButton = notification.querySelector('.duobao-notification-close');
    closeButton.addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    });
    
    // 自动隐藏
    if (duration > 0) {
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          if (notification.parentNode) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, duration);
    }
    
    return notification;
  },
  
  // 获取通知图标
  getNotificationIcon: function(type) {
    switch (type) {
      case 'success':
        return '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>';
      case 'error':
        return '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>';
      case 'warning':
        return '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></svg>';
      case 'info':
      default:
        return '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>';
    }
  },
  
  // 添加通知样式
  addNotificationStyles: function() {
    if (document.getElementById('duobao-notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'duobao-notification-styles';
    style.innerHTML = `
      .duobao-notification {
        position: fixed;
        top: 16px;
        right: 16px;
        max-width: 350px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 9999;
      }
      
      .duobao-notification.show {
        transform: translateX(0);
      }
      
      .duobao-notification-content {
        display: flex;
        align-items: center;
        padding: 12px 16px;
      }
      
      .duobao-notification-icon {
        margin-right: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .duobao-notification-message {
        font-size: 14px;
        line-height: 1.5;
      }
      
      .duobao-notification-close {
        padding: 12px 16px;
        cursor: pointer;
        font-size: 18px;
        opacity: 0.7;
        transition: opacity 0.2s ease;
      }
      
      .duobao-notification-close:hover {
        opacity: 1;
      }
      
      .duobao-notification-success {
        border-left: 4px solid #52c41a;
      }
      
      .duobao-notification-success .duobao-notification-icon {
        color: #52c41a;
      }
      
      .duobao-notification-error {
        border-left: 4px solid #f5222d;
      }
      
      .duobao-notification-error .duobao-notification-icon {
        color: #f5222d;
      }
      
      .duobao-notification-warning {
        border-left: 4px solid #faad14;
      }
      
      .duobao-notification-warning .duobao-notification-icon {
        color: #faad14;
      }
      
      .duobao-notification-info {
        border-left: 4px solid #1890ff;
      }
      
      .duobao-notification-info .duobao-notification-icon {
        color: #1890ff;
      }
    `;
    
    document.head.appendChild(style);
  },
  
  // 复制文本到剪贴板
  copyToClipboard: function(text) {
    // 创建临时文本区域
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      // 执行复制命令
      const successful = document.execCommand('copy');
      
      if (successful) {
        this.showNotification('复制成功', 'success');
      } else {
        this.showNotification('复制失败，请手动复制', 'error');
      }
    } catch (err) {
      this.showNotification('复制失败: ' + err, 'error');
    }
    
    document.body.removeChild(textarea);
  }
};

// 字符串处理工具
window.DuobaoString = {
  // 截断字符串
  truncate: function(str, length, suffix = '...') {
    if (!str || str.length <= length) return str;
    return str.substring(0, length) + suffix;
  },
  
  // 首字母大写
  capitalize: function(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  // 全部单词首字母大写
  capitalizeWords: function(str) {
    if (!str) return str;
    return str.replace(/\b\w/g, char => char.toUpperCase());
  },
  
  // 驼峰命名转连字符
  kebabCase: function(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  },
  
  // 连字符转驼峰命名
  camelCase: function(str) {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
  },
  
  // 帕斯卡命名法
  pascalCase: function(str) {
    const camel = this.camelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  },
  
  // 蛇形命名法
  snakeCase: function(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .toLowerCase();
  },
  
  // 反转字符串
  reverse: function(str) {
    return str.split('').reverse().join('');
  },
  
  // 计算字符串长度（支持中文）
  length: function(str, countChinese = true) {
    if (!countChinese) return str.length;
    
    let len = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
        len += 2;
      } else {
        len++;
      }
    }
    return len;
  },
  
  // 生成随机字符串
  random: function(length, chars) {
    return DuobaoUtils.randomString(length, chars);
  },
  
  // 去除HTML标签
  stripTags: function(str) {
    return str.replace(/<[^>]*>/g, '');
  },
  
  // 转义HTML特殊字符
  escapeHtml: function(str) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, m => map[m]);
  },
  
  // 反转义HTML特殊字符
  unescapeHtml: function(str) {
    const map = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'"
    };
    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, m => map[m]);
  },
  
  // 格式化数字为千分位
  formatNumber: function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  
  // 格式化文件大小
  formatFileSize: function(bytes) {
    return DuobaoUtils.formatFileSize(bytes);
  },
  
  // 生成UUID
  uuid: function() {
    return DuobaoUtils.generateUUID();
  },
  
  // 生成指定范围内的随机数
  randomNumber: function(min, max) {
    return DuobaoUtils.random(min, max);
  },
  
  // 检查字符串是否为空
  isEmpty: function(str) {
    return !str || str.trim().length === 0;
  },
  
  // 检查字符串是否为数字
  isNumeric: function(str) {
    return /^-?\d+(\.\d+)?$/.test(str);
  },
  
  // 检查字符串是否为整数
  isInteger: function(str) {
    return /^-?\d+$/.test(str);
  },
  
  // 检查字符串是否为邮箱
  isEmail: function(str) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  },
  
  // 检查字符串是否为URL
  isUrl: function(str) {
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  // 检查字符串是否为手机号码（中国）
  isMobilePhone: function(str) {
    return /^1[3-9]\d{9}$/.test(str);
  },
  
  // 检查字符串是否为身份证号码（中国）
  isIdCard: function(str) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
  },
  
  // 检查字符串是否为IP地址
  isIpAddress: function(str) {
    return /^(\d{1,3}\.){3}\d{1,3}$/.test(str) && str.split('.').every(num => parseInt(num) <= 255);
  },
  
  // 检查字符串是否为日期
  isDate: function(str) {
    return !isNaN(Date.parse(str));
  },
  
  // 检查字符串是否包含特定字符
  contains: function(str, search) {
    return str.indexOf(search) !== -1;
  },
  
  // 检查字符串是否以特定字符开头
  startsWith: function(str, search) {
    return str.indexOf(search) === 0;
  },
  
  // 检查字符串是否以特定字符结尾
  endsWith: function(str, search) {
    const position = str.length - search.length;
    return position >= 0 && str.indexOf(search, position) === position;
  },
  
  // 重复字符串
  repeat: function(str, count) {
    return str.repeat(count);
  },
  
  // 填充字符串到指定长度
  pad: function(str, length, char = ' ', right = false) {
    const padding = length - str.length;
    if (padding <= 0) return str;
    
    const padStr = char.repeat(padding);
    return right ? str + padStr : padStr + str;
  },
  
  // 左填充
  padStart: function(str, length, char = ' ') {
    return this.pad(str, length, char, false);
  },
  
  // 右填充
  padEnd: function(str, length, char = ' ') {
    return this.pad(str, length, char, true);
  },
  
  // 移除字符串两端空白
  trim: function(str) {
    return str.trim();
  },
  
  // 移除字符串左侧空白
  trimStart: function(str) {
    return str.trimStart();
  },
  
  // 移除字符串右侧空白
  trimEnd: function(str) {
    return str.trimEnd();
  },
  
  // 移除字符串中的所有空白
  removeWhitespace: function(str) {
    return str.replace(/\s+/g, '');
  },
  
  // 将字符串拆分为单词数组
  words: function(str) {
    return str.trim().split(/\s+/);
  },
  
  // 计算单词数量
  wordCount: function(str) {
    return this.words(str).length;
  },
  
  // 计算字符出现次数
  countOccurrences: function(str, char) {
    return str.split(char).length - 1;
  },
  
  // 替换所有匹配项
  replaceAll: function(str, search, replacement) {
    return str.split(search).join(replacement);
  },
  
  // 生成指定长度的随机字母数字字符串
  randomAlphanumeric: function(length) {
    return this.random(length, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
  },
  
  // 生成指定长度的随机字母字符串
  randomAlpha: function(length) {
    return this.random(length, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
  },
  
  // 生成指定长度的随机数字字符串
  randomNumeric: function(length) {
    return this.random(length, '0123456789');
  },
  
  // 将字符串转换为URL友好的slug
  slugify: function(str) {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 移除非单词字符
      .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
      .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
  },
  
  // 将字符串转换为Base64
  toBase64: function(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode('0x' + p1)));
  },
  
  // 将Base64转换为字符串
  fromBase64: function(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  },
  
  // 将字符串转换为整数
  toInt: function(str, radix = 10) {
    return parseInt(str, radix);
  },
  
  // 将字符串转换为浮点数
  toFloat: function(str) {
    return parseFloat(str);
  },
  
  // 将字符串转换为布尔值
  toBool: function(str) {
    return ['true', 'yes', '1', 'on'].includes(str.toLowerCase());
  },
  
  // 将字符串转换为JSON对象
  toJson: function(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  },
  
  // 将对象转换为JSON字符串
  fromJson: function(obj, pretty = false) {
    return pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
  },
  
  // 将字符串转换为查询参数对象
  parseQueryString: function(str) {
    if (!str) return {};
    
    const queryString = str.startsWith('?') ? str.substring(1) : str;
    const params = {};
    
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (key) {
        params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
      }
    });
    
    return params;
  },
  
  // 将对象转换为查询字符串
  toQueryString: function(obj) {
    return Object.keys(obj)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
      .join('&');
  },
  
  // 将字符串转换为颜色
  toColor: function(str) {
    // 简单的字符串哈希算法
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // 转换为RGB颜色
    const r = (hash & 0xFF0000) >> 16;
    const g = (hash & 0x00FF00) >> 8;
    const b = hash & 0x0000FF;
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },
  
  // 将字符串转换为数组
  toArray: function(str, delimiter = ',') {
    return str.split(delimiter).map(item => item.trim());
  },
  
  // 将数组转换为字符串
  fromArray: function(arr, delimiter = ',') {
    return arr.join(delimiter);
  },
  
  // 将字符串转换为驼峰命名
  toCamelCase: function(str) {
    return this.camelCase(str);
  },
  
  // 将字符串转换为帕斯卡命名
  toPascalCase: function(str) {
    return this.pascalCase(str);
  },
  
  // 将字符串转换为蛇形命名
  toSnakeCase: function(str) {
    return this.snakeCase(str);
  },
  
  // 将字符串转换为连字符命名
  toKebabCase: function(str) {
    return this.kebabCase(str);
  },
  
  // 将字符串转换为常量命名
  toConstantCase: function(str) {
    return this.snakeCase(str).toUpperCase();
  },
  
  // 将字符串转换为标题命名
  toTitleCase: function(str) {
    return this.capitalizeWords(str);
  },
  
  // 将字符串转换为句子命名
  toSentenceCase: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  
  // 将字符串转换为路径命名
  toPathCase: function(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1/$2')
      .replace(/\s+/g, '/')
      .toLowerCase();
  },
  
  // 将字符串转换为点命名
  toDotCase: function(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1.$2')
      .replace(/\s+/g, '.')
      .toLowerCase();
  },
  
  // 将字符串转换为反引号命名
  toBacktickCase: function(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1`$2')
      .replace(/\s+/g, '`')
      .toLowerCase();
  },
  
  // 将字符串转换为空格命名
  toSpaceCase: function(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_]+/g, ' ')
      .toLowerCase();
  },
  
  // 将字符串转换为首字母小写
  toLowerFirst: function(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  },
  
  // 将字符串转换为首字母大写
  toUpperFirst: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  // 将字符串转换为全部小写
  toLowerCase: function(str) {
    return str.toLowerCase();
  },
  
  // 将字符串转换为全部大写
  toUpperCase: function(str) {
    return str.toUpperCase();
  },
  
  // 将字符串转换为交替大小写
  toAlternatingCase: function(str) {
    return str.split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('');
  },
  
  // 将字符串转换为反转大小写
  toInverseCase: function(str) {
    return str.split('').map(char => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      }
      return char.toUpperCase();
    }).join('');
  },
  
  // 将字符串转换为随机大小写
  toRandomCase: function(str) {
    return str.split('').map(char => {
      return Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
    }).join('');
  },
  
  // 将字符串转换为首字母缩写
  toAcronym: function(str) {
    return str.split(/\s+/).map(word => word.charAt(0).toUpperCase()).join('');
  },
  
  // 将字符串转换为缩写
  toAbbreviation: function(str, maxLength = 3) {
    return str.split(/\s+/).map(word => word.substring(0, maxLength)).join('');
  },
  
  // 将字符串转换为掩码（如信用卡号）
  mask: function(str, maskChar = '*', visibleChars = 4, position = 'end') {
    if (str.length <= visibleChars) return str;
    
    const masked = maskChar.repeat(str.length - visibleChars);
    
    if (position === 'start') {
      return str.substring(0, visibleChars) + masked;
    } else if (position === 'middle') {
      const startChars = Math.ceil(visibleChars / 2);
      const endChars = visibleChars - startChars;
      return str.substring(0, startChars) + masked + str.substring(str.length - endChars);
    } else { // end
      return masked + str.substring(str.length - visibleChars);
    }
  },
  
  // 将字符串转换为掩码电话号码
  maskPhoneNumber: function(phone, maskChar = '*') {
    if (!phone || phone
};

// 文件处理工具
window.DuobaoFile = {
  // 读取文件内容
  readAsText: function(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(e);
      reader.readAsText(file);
    });
  },
  
  // 读取文件为DataURL
  readAsDataURL: function(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(e);
      reader.readAsDataURL(file);
    });
  },
  
  // 读取文件为ArrayBuffer
  readAsArrayBuffer: function(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(e);
      reader.readAsArrayBuffer(file);
    });
  },
  
  // 保存文本为文件
  saveAsFile: function(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  
  // 获取文件扩展名
  getExtension: function(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  },
  
  // 获取文件名（不含扩展名）
  getBasename: function(filename) {
    return filename.split('.').slice(0, -1).join('.');
  },
  
  // 检查文件类型
  checkFileType: function(file, allowedTypes) {
    if (!file || !allowedTypes) return false;
    
    // 如果allowedTypes是字符串，转换为数组
    if (typeof allowedTypes === 'string') {
      allowedTypes = [allowedTypes];
    }
    
    const fileType = file.type;
    const extension = this.getExtension(file.name).toLowerCase();
    
    // 检查MIME类型
    for (const type of allowedTypes) {
      // 检查完整MIME类型
      if (fileType === type) return true;
      
      // 检查MIME类型前缀
      if (type.endsWith('/*') && fileType.startsWith(type.slice(0, -2))) return true;
      
      // 检查文件扩展名
      if (type.startsWith('.') && extension === type.slice(1)) return true;
    }
    
    return false;
  },
  
  // 检查文件大小
  checkFileSize: function(file, maxSize) {
    return file.size <= maxSize;
  },
  
  // 格式化文件大小
  formatFileSize: function(bytes) {
    return DuobaoUtils.formatFileSize(bytes);
  }
};

// 图像处理工具
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
  }
};

// 颜色处理工具
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
  
  // 计算两个颜色之间的对比度
  getContrastRatio: function(color1, color2) {
    // 将颜色转换为RGB
    const rgb1 = typeof color1 === 'string' ? this.hexToRgb(color1) : color1;
    const rgb2 = typeof color2 === 'string' ? this.hexToRgb(color2) : color2;
    
    // 计算相对亮度
    const luminance1 = this.calculateLuminance(rgb1);
    const luminance2 = this.calculateLuminance(rgb2);
    
    // 计算对比度
    const ratio = luminance1 > luminance2 
      ? (luminance1 + 0.05) / (luminance2 + 0.05)
      : (luminance2 + 0.05) / (luminance1 + 0.05);
    
    return parseFloat(ratio.toFixed(2));
  },
  
  // 计算颜色的相对亮度
  calculateLuminance: function(rgb) {
    // 将RGB值标准化
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    // 应用gamma校正
    const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    
    // 计算亮度
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  },
  
  // 检查颜色是否符合WCAG可访问性标准
  isAccessible: function(foreground, background, level = 'AA', isLargeText = false) {
    const ratio = this.getContrastRatio(foreground, background);
    
    if (level === 'AA') {
      return isLargeText ? ratio >= 3 : ratio >= 4.5;
    } else if (level === 'AAA') {
      return isLargeText ? ratio >= 4.5 : ratio >= 7;
    }
    
    return false;
  }
};

// 数学计算工具
window.DuobaoMath = {
  // 基本数学运算
  add: function(a, b) {
    return a + b;
  },
  
  subtract: function(a, b) {
    return a - b;
  },
  
  multiply: function(a, b) {
    return a * b;
  },
  
  divide: function(a, b) {
    if (b === 0) throw new Error('除数不能为零');
    return a / b;
  },
  
  // 四舍五入到指定小数位
  round: function(value, decimals = 0) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  },
  
  // 向上取整到指定小数位
  ceil: function(value, decimals = 0) {
    return Number(Math.ceil(value + 'e' + decimals) + 'e-' + decimals);
  },
  
  // 向下取整到指定小数位
  floor: function(value, decimals = 0) {
    return Number(Math.floor(value + 'e' + decimals) + 'e-' + decimals);
  },
  
  // 计算平均值
  average: function(arr) {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  },
  
  // 计算中位数
  median: function(arr) {
    if (!arr || arr.length === 0) return 0;
    
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  },
  
  // 计算众数
  mode: function(arr) {
    if (!arr || arr.length === 0) return null;
    
    const counts = {};
    let maxCount = 0;
    let modes = [];
    
    for (const num of arr) {
      counts[num] = (counts[num] || 0) + 1;
      
      if (counts[num] > maxCount) {
        maxCount = counts[num];
        modes = [num];
      } else if (counts[num] === maxCount) {
        modes.push(num);
      }
    }
    
    return modes.length === Object.keys(counts).length ? null : modes;
  },
  
  // 计算标准差
  standardDeviation: function(arr) {
    if (!arr || arr.length <= 1) return 0;
    
    const mean = this.average(arr);
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    
    return Math.sqrt(variance);
  },
  
  // 计算百分位数
  percentile: function(arr, p) {
    if (!arr || arr.length === 0) return 0;
    if (p < 0 || p > 100) throw new Error('百分位数必须在0到100之间');
    
    const sorted = [...arr].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const floor = Math.floor(index);
    const ceil = Math.ceil(index);
    
    if (floor === ceil) return sorted[floor];
    
    const d = index - floor;
    return sorted[floor] * (1 - d) + sorted[ceil] * d;
  },
  
  // 计算阶乘
  factorial: function(n) {
    if (n < 0) throw new Error('阶乘不能用于负数');
    if (n === 0 || n === 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    
    return result;
  },
  
  // 计算排列数
  permutation: function(n, r) {
    if (n < 0 || r < 0) throw new Error('排列数不能用于负数');
    if (r > n) throw new Error('r不能大于n');
    
    return this.factorial(n) / this.factorial(n - r);
  },
  
  // 计算组合数
  combination: function(n, r) {
    if (n < 0 || r < 0) throw new Error('组合数不能用于负数');
    if (r > n) throw new Error('r不能大于n');
    
    return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
  },
  
  // 计算最大公约数
  gcd: function(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    
    while (b) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    
    return a;
  },
  
  // 计算最小公倍数
  lcm: function(a, b) {
    return Math.abs(a * b) / this.gcd(a, b);
  },
  
  // 判断是否为质数
  isPrime: function(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    
    const limit = Math.sqrt(n);
    for (let i = 5; i <= limit; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    
    return true;
  },
  
  // 生成指定范围内的质数
  generatePrimes: function(start, end) {
    const primes = [];
    
    for (let i = Math.max(2, start); i <= end; i++) {
      if (this.isPrime(i)) {
        primes.push(i);
      }
    }
    
    return primes;
  },
  
  // 计算斐波那契数列
  fibonacci: function(n) {
    if (n <= 0) return [];
    if (n === 1) return [0];
    if (n === 2) return [0, 1];
    
    const fib = [0, 1];
    for (let i = 2; i < n; i++) {
      fib.push(fib[i - 1] + fib[i - 2]);
    }
    
    return fib;
  },
  
  // 角度转弧度
  degToRad: function(degrees) {
    return degrees * (Math.PI / 180);
  },
  
  // 弧度转角度
  radToDeg: function(radians) {
    return radians * (180 / Math.PI);
  },
  
  // 计算两点之间的距离
  distance: function(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },
  
  // 计算三角形面积（已知三边长）
  triangleArea: function(a, b, c) {
    // 使用海伦公式
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  },
  
  // 计算圆的面积
  circleArea: function(radius) {
    return Math.PI * radius * radius;
  },
  
  // 计算圆的周长
  circleCircumference: function(radius) {
    return 2 * Math.PI * radius;
  },
  
  // 线性插值
  lerp: function(a, b, t) {
    return a + (b - a) * t;
  },
  
  // 将数值限制在指定范围内
  clamp: function(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },
  
  // 计算百分比
  percentage: function(value, total) {
    return (value / total) * 100;
  },
  
  // ===== 贷款计算相关函数 =====
  
  // 计算等额本息月供
  calculateEqualInstallmentPayment: function(principal, term, rate) {
    // 月利率
    const monthlyRate = rate / 12;
    
    // 月供
    return principal * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
  },
  
  // 计算等额本息总利息
  calculateEqualInstallmentTotalInterest: function(principal, term, rate) {
    const monthlyPayment = this.calculateEqualInstallmentPayment(principal, term, rate);
    return monthlyPayment * term - principal;
  },
  
  // 计算等额本金首月月供
  calculateEqualPrincipalFirstPayment: function(principal, term, rate) {
    const monthlyPrincipal = principal / term;
    const monthlyInterest = principal * (rate / 12);
    return monthlyPrincipal + monthlyInterest;
  },
  
  // 计算等额本金月供（指定月份）
  calculateEqualPrincipalPayment: function(principal, term, rate, month) {
    if (month < 1 || month > term) {
      throw new Error('月份必须在1到贷款期限之间');
    }
    
    const monthlyPrincipal = principal / term;
    const remainingPrincipal = principal - (monthlyPrincipal * (month - 1));
    const monthlyInterest = remainingPrincipal * (rate / 12);
    
    return monthlyPrincipal + monthlyInterest;
  },
  
  // 计算等额本金总利息
  calculateEqualPrincipalTotalInterest: function(principal, term, rate) {
    const monthlyRate = rate / 12;
    let totalInterest = 0;
    
    for (let i = 0; i < term; i++) {
      const remainingPrincipal = principal * (1 - i / term);
      totalInterest += remainingPrincipal * monthlyRate;
    }
    
    return totalInterest;
  },
  
  // 计算只还利息方式的月供
  calculateInterestOnlyPayment: function(principal, rate) {
    return principal * (rate / 12);
  },
  
  // 计算只还利息方式的总利息
  calculateInterestOnlyTotalInterest: function(principal, term, rate) {
    return principal * (rate / 12) * term;
  },
  
  // 计算提前还款后的剩余本金（等额本息）
  calculateRemainingPrincipalAfterPrepayment: function(principal, term, rate, paidMonths, prepaymentAmount) {
    if (paidMonths >= term) {
      return 0;
    }
    
    const monthlyRate = rate / 12;
    const monthlyPayment = this.calculateEqualInstallmentPayment(principal, term, rate);
    
    let remainingPrincipal = principal;
    
    // 计算已还期数后的剩余本金
    for (let i = 0; i < paidMonths; i++) {
      const interest = remainingPrincipal * monthlyRate;
      const principalPaid = monthlyPayment - interest;
      remainingPrincipal -= principalPaid;
    }
    
    // 减去提前还款金额
    remainingPrincipal -= prepaymentAmount;
    
    return Math.max(0, remainingPrincipal);
  },
  
  // 计算提前还款后的新贷款期限（保持月供不变）
  calculateNewTermAfterPrepayment: function(remainingPrincipal, monthlyPayment, rate) {
    const monthlyRate = rate / 12;
    
    // 如果月供小于或等于月利息，则无法还清
    const monthlyInterest = remainingPrincipal * monthlyRate;
    if (monthlyPayment <= monthlyInterest) {
      return Infinity;
    }
    
    // 计算新期限
    const newTerm = Math.log(monthlyPayment / (monthlyPayment - remainingPrincipal * monthlyRate)) / Math.log(1 + monthlyRate);
    
    return Math.ceil(newTerm);
  },
  
  // 计算提前还款后的新月供（保持期限不变）
  calculateNewPaymentAfterPrepayment: function(remainingPrincipal, remainingTerm, rate) {
    return this.calculateEqualInstallmentPayment(remainingPrincipal, remainingTerm, rate);
  },
  
  // 计算组合贷款月供（等额本息）
  calculateCombinedLoanPayment: function(commercialAmount, commercialRate, housingAmount, housingRate, term) {
    const commercialPayment = this.calculateEqualInstallmentPayment(commercialAmount, term, commercialRate);
    const housingPayment = this.calculateEqualInstallmentPayment(housingAmount, term, housingRate);
    
    return commercialPayment + housingPayment;
  },
  
  // 计算组合贷款总利息（等额本息）
  calculateCombinedLoanTotalInterest: function(commercialAmount, commercialRate, housingAmount, housingRate, term) {
    const commercialInterest = this.calculateEqualInstallmentTotalInterest(commercialAmount, term, commercialRate);
    const housingInterest = this.calculateEqualInstallmentTotalInterest(housingAmount, term, housingRate);
    
    return commercialInterest + housingInterest;
  },
  
  // 计算贷款每月递减金额（等额本金）
  calculateMonthlyDecrement: function(principal, term, rate) {
    const monthlyPrincipal = principal / term;
    return monthlyPrincipal * (rate / 12);
  },
  
  // 计算还款计划（等额本息）
  generateEqualInstallmentSchedule: function(principal, term, rate, startDate) {
    // 月利率
    const monthlyRate = rate / 12;
    
    // 月供
    const monthlyPayment = this.calculateEqualInstallmentPayment(principal, term, rate);
    
    // 生成还款计划
    const schedule = [];
    let balance = principal;
    let currentDate = new Date(startDate);
    
    for (let month = 1; month <= term; month++) {
      // 计算当月利息
      const interest = balance * monthlyRate;
      
      // 计算当月本金
      const principalPaid = monthlyPayment - interest;
      
      // 更新剩余本金
      balance -= principalPaid;
      
      // 处理最后一期可能的舍入误差
      if (month === term) {
        balance = 0;
      }
      
      // 添加到还款计划
      schedule.push({
        month: month,
        date: new Date(currentDate),
        payment: monthlyPayment,
        principal: principalPaid,
        interest: interest,
        balance: balance
      });
      
      // 更新下一个还款日期
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return schedule;
  },
  
  // 计算还款计划（等额本金）
  generateEqualPrincipalSchedule: function(principal, term, rate, startDate) {
    // 月利率
    const monthlyRate = rate / 12;
    
    // 每月本金
    const monthlyPrincipal = principal / term;
    
    // 生成还款计划
    const schedule = [];
    let balance = principal;
    let currentDate = new Date(startDate);
    
    for (let month = 1; month <= term; month++) {
      // 计算当月利息
      const interest = balance * monthlyRate;
      
      // 计算当月月供
      const payment = monthlyPrincipal + interest;
      
      // 更新剩余本金
      balance -= monthlyPrincipal;
      
      // 处理最后一期可能的舍入误差
      if (month === term) {
        balance = 0;
      }
      
      // 添加到还款计划
      schedule.push({
        month: month,
        date: new Date(currentDate),
        payment: payment,
        principal: monthlyPrincipal,
        interest: interest,
        balance: balance
      });
      
      // 更新下一个还款日期
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return schedule;
  }
};

// 日期时间处理工具
window.DuobaoDate = {
  // 格式化日期
  format: function(date, format) {
    return DuobaoUtils.formatDate(date, format);
  },
  
  // 获取当前日期时间
  now: function() {
    return new Date();
  },
  
  // 获取当前时间戳
  timestamp: function() {
    return Date.now();
  },
  
  // 创建日期对象
  create: function(year, month, day, hour = 0, minute = 0, second = 0, millisecond = 0) {
    return new Date(year, month - 1, day, hour, minute, second, millisecond);
  },
  
  // 解析日期字符串
  parse: function(dateString) {
    return new Date(dateString);
  },
  
  // 添加天数
  addDays: function(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  
  // 添加月数
  addMonths: function(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  },
  
  // 添加年数
  addYears: function(date, years) {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  },
  
  // 添加小时
  addHours: function(date, hours) {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
  },
  
  // 添加分钟
  addMinutes: function(date, minutes) {
    return new Date(date.getTime() + minutes * 60 * 1000);
  },
  
  // 添加秒数
  addSeconds: function(date, seconds) {
    return new Date(date.getTime() + seconds * 1000);
  },
  
  // 计算两个日期之间的天数差
  diffInDays: function(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  },
  
  // 计算两个日期之间的月数差
  diffInMonths: function(date1, date2) {
    const months1 = date1.getFullYear() * 12 + date1.getMonth();
    const months2 = date2.getFullYear() * 12 + date2.getMonth();
    return Math.abs(months2 - months1);
  },
  
  // 计算两个日期之间的年数差
  diffInYears: function(date1, date2) {
    return Math.abs(date2.getFullYear() - date1.getFullYear());
  },
  
  // 获取某月的天数
  daysInMonth: function(year, month) {
    return new Date(year, month, 0).getDate();
  },
  
  // 获取某年的天数
  daysInYear: function(year) {
    return this.isLeapYear(year) ? 366 : 365;
  },
  
  // 判断是否为闰年
  isLeapYear: function(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  },
  
  // 获取日期是一年中的第几天
  dayOfYear: function(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  },
  
  // 获取日期是一周中的第几天（0-6，0表示周日）
  dayOfWeek: function(date) {
    return date.getDay();
  },
  
  // 获取日期所在周的第一天（周日）
  startOfWeek: function(date) {
    const result = new Date(date);
    result.setDate(result.getDate() - result.getDay());
    result.setHours(0, 0, 0, 0);
    return result;
  },
  
  // 获取日期所在周的最后一天（周六）
  endOfWeek: function(date) {
    const result = new Date(date);
    result.setDate(result.getDate() + (6 - result.getDay()));
    result.setHours(23, 59, 59, 999);
    return result;
  },
  
  // 获取日期所在月的第一天
  startOfMonth: function(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },
  
  // 获取日期所在月的最后一天
  endOfMonth: function(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  },
  
  // 获取日期所在年的第一天
  startOfYear: function(date) {
    return new Date(date.getFullYear(), 0, 1);
  },
  
  // 获取日期所在年的最后一天
  endOfYear: function(date) {
    return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
  },
  
  // 判断是否为同一天
  isSameDay: function(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  },
  
  // 判断是否为同一月
  isSameMonth: function(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth();
  },
  
  // 判断是否为同一年
  isSameYear: function(date1, date2) {
    return date1.getFullYear() === date2.getFullYear();
  },
  
  // 判断日期是否在过去
  isPast: function(date) {
    return date.getTime() < Date.now();
  },
  
  // 判断日期是否在未来
  isFuture: function(date) {
    return date.getTime() > Date.now();
  },
  
  // 判断日期是否为今天
  isToday: function(date) {
    return this.isSameDay(date, new Date());
  },
  
  // 判断日期是否为昨天
  isYesterday: function(date) {
    const yesterday = this.addDays(new Date(), -1);
    return this.isSameDay(date, yesterday);
  },
  
  // 判断日期是否为明天
  isTomorrow: function(date) {
    const tomorrow = this.addDays(new Date(), 1);
    return this.isSameDay(date, tomorrow);
  },
  
  // 判断日期是否为周末
  isWeekend: function(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  },
  
  // 判断日期是否为工作日
  isWeekday: function(date) {
    return !this.isWeekend(date);
  },
  
  // 获取相对时间描述
  timeAgo: function(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval + ' 年前';
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + ' 个月前';
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + ' 天前';
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + ' 小时前';
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + ' 分钟前';
    }
    
    if (seconds < 10) {
      return '刚刚';
    }
    
    return Math.floor(seconds) + ' 秒前';
  }
};

// 引入子模块
(function() {
  // 字符串处理子模块
  const stringModules = [
    'static/js/libs/string/base.js',
    'static/js/libs/string/html.js',
    'static/js/libs/string/convert.js',
    'static/js/libs/string/validate.js'
  ];
  
  // 其他模块
  const otherModules = [
    'static/js/libs/array.js',
    'static/js/libs/object.js',
    'static/js/libs/network.js',
    'static/js/libs/storage.js',
    'static/js/libs/date.js'
  ];
  
  // 加载所有模块
  const allModules = [...stringModules, ...otherModules];
  
  // 使用Promise加载所有模块
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false; // 保持加载顺序
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  // 初始化命名空间
  window.DuobaoString = window.DuobaoString || {};
  window.DuobaoArray = window.DuobaoArray || {};
  window.DuobaoObject = window.DuobaoObject || {};
  window.DuobaoNetwork = window.DuobaoNetwork || {};
  window.DuobaoStorage = window.DuobaoStorage || {};
  
  // 按顺序加载所有模块
  allModules.reduce((promise, src) => {
    return promise.then(() => loadScript(src));
  }, Promise.resolve()).then(() => {
    // 所有模块加载完成后触发事件
    const event = new Event('duobao-libs-loaded');
    document.dispatchEvent(event);
    console.log('多宝工具库加载完成');
  }).catch(error => {
    console.error('模块加载失败:', error);
  });
})();

// UI组件工具
window.DuobaoUI = {
  // 创建模态框
  createModal: function(options = {}) {
    const defaultOptions = {
      id: 'duobao-modal-' + Date.now(),
      title: '提示',
      content: '',
      width: '500px',
      height: 'auto',
      closable: true,
      maskClosable: true,
      showFooter: true,
      okText: '确定',
      cancelText: '取消',
      onOk: null,
      onCancel: null,
      onClose: null,
      className: '',
      zIndex: 1000
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // 创建模态框容器
    const modal = document.createElement('div');
    modal.id = mergedOptions.id;
    modal.className = `duobao-modal ${mergedOptions.className}`;
    modal.style.zIndex = mergedOptions.zIndex;
    
    // 创建遮罩层
    const mask = document.createElement('div');
    mask.className = 'duobao-modal-mask';
    
    // 创建模态框内容
    const modalContent = document.createElement('div');
    modalContent.className = 'duobao-modal-content';
    modalContent.style.width = mergedOptions.width;
    modalContent.style.height = mergedOptions.height;
    
    // 创建模态框头部
    const header = document.createElement('div');
    header.className = 'duobao-modal-header';
    
    const title = document.createElement('div');
    title.className = 'duobao-modal-title';
    title.textContent = mergedOptions.title;
    
    header.appendChild(title);
    
    // 创建关闭按钮
    if (mergedOptions.closable) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'duobao-modal-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.onclick = function() {
        if (typeof mergedOptions.onClose === 'function') {
          mergedOptions.onClose();
        }
        modal.remove();
      };
      
      header.appendChild(closeBtn);
    }
    
    // 创建模态框主体
    const body = document.createElement('div');
    body.className = 'duobao-modal-body';
    
    if (typeof mergedOptions.content === 'string') {
      body.innerHTML = mergedOptions.content;
    } else if (mergedOptions.content instanceof HTMLElement) {
      body.appendChild(mergedOptions.content);
    }
    
    // 创建模态框底部
    let footer = null;
    if (mergedOptions.showFooter) {
      footer = document.createElement('div');
      footer.className = 'duobao-modal-footer';
      
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'duobao-modal-btn duobao-modal-btn-cancel';
      cancelBtn.textContent = mergedOptions.cancelText;
      cancelBtn.onclick = function() {
        if (typeof mergedOptions.onCancel === 'function') {
          mergedOptions.onCancel();
        }
        modal.remove();
      };
      
      const okBtn = document.createElement('button');
      okBtn.className = 'duobao-modal-btn duobao-modal-btn-primary';
      okBtn.textContent = mergedOptions.okText;
      okBtn.onclick = function() {
        if (typeof mergedOptions.onOk === 'function') {
          mergedOptions.onOk();
        }
        modal.remove();
      };
      
      footer.appendChild(cancelBtn);
      footer.appendChild(okBtn);
    }
    
    // 组装模态框
    modalContent.appendChild(header);
    modalContent.appendChild(body);
    if (footer) {
      modalContent.appendChild(footer);
    }
    
    modal.appendChild(mask);
    modal.appendChild(modalContent);
    
    // 添加样式
    this.addModalStyles();
    
    // 点击遮罩层关闭模态框
    if (mergedOptions.maskClosable) {
      mask.onclick = function(e) {
        if (e.target === mask) {
          if (typeof mergedOptions.onClose === 'function') {
            mergedOptions.onClose();
          }
          modal.remove();
        }
      };
    }
    
    // 添加到文档
    document.body.appendChild(modal);
    
    // 返回模态框对象
    return {
      element: modal,
      close: function() {
        modal.remove();
      },
      setTitle: function(title) {
        modal.querySelector('.duobao-modal-title').textContent = title;
      },
      setContent: function(content) {
        const body = modal.querySelector('.duobao-modal-body');
        if (typeof content === 'string') {
          body.innerHTML = content;
        } else if (content instanceof HTMLElement) {
          body.innerHTML = '';
          body.appendChild(content);
        }
      }
    };
  },
  
  // 添加模态框样式
  addModalStyles: function() {
    if (document.getElementById('duobao-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'duobao-modal-styles';
    style.innerHTML = `
      .duobao-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .duobao-modal-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
      
      .duobao-modal-content {
        position: relative;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 90%;
        max-height: 90%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      
      .duobao-modal-header {
        padding: 16px 24px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .duobao-modal-title {
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
      }
      
      .duobao-modal-close {
        padding: 0;
        background: transparent;
        border: none;
        outline: none;
        font-size: 16px;
        line-height: 1;
        color: rgba(0, 0, 0, 0.45);
        cursor: pointer;
        transition: color 0.3s;
      }
      
      .duobao-modal-close:hover {
        color: rgba(0, 0, 0, 0.75);
      }
      
      .duobao-modal-body {
        padding: 24px;
        overflow-y: auto;
        flex: 1;
      }
      
      .duobao-modal-footer {
        padding: 10px 16px;
        border-top: 1px solid #f0f0f0;
        text-align: right;
      }
      
      .duobao-modal-btn {
        margin-left: 8px;
        padding: 8px 16px;
        font-size: 14px;
        border-radius: 2px;
        border: 1px solid #d9d9d9;
        background-color: #fff;
        cursor: pointer;
        transition: all 0.3s;
        outline: none;
      }
      
      .duobao-modal-btn-primary {
        background-color: #1890ff;
        border-color: #1890ff;
        color: #fff;
      }
      
      .duobao-modal-btn-primary:hover {
        background-color: #40a9ff;
        border-color: #40a9ff;
      }
      
      .duobao-modal-btn-cancel:hover {
        border-color: #40a9ff;
        color: #40a9ff;
      }
    `;
    
    document.head.appendChild(style);
  },
  
  // 创建消息提示
  message: {
    _container: null,
    
    _createContainer: function() {
      if (this._container) return this._container;
      
      const container = document.createElement('div');
      container.className = 'duobao-message-container';
      document.body.appendChild(container);
      
      // 添加样式
      this._addStyles();
      
      this._container = container;
      return container;
    },
    
    _addStyles: function() {
      if (document.getElementById('duobao-message-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'duobao-message-styles';
      style.innerHTML = `
        .duobao-message-container {
          position: fixed;
          top: 16px;
          left: 0;
          width: 100%;
          pointer-events: none;
          text-align: center;
          z-index: 1010;
        }
        
        .duobao-message {
          display: inline-block;
          padding: 9px 16px;
          background-color: #fff;
          border-radius: 2px;
          box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
          pointer-events: all;
          margin-bottom: 16px;
          transition: all 0.3s;
          max-width: 80%;
        }
        
        .duobao-message-content {
          display: flex;
          align-items: center;
        }
        
        .duobao-message-icon {
          margin-right: 8px;
          font-size: 16px;
          line-height: 1;
        }
        
        .duobao-message-info .duobao-message-icon {
          color: #1890ff;
        }
        
        .duobao-message-success .duobao-message-icon {
          color: #52c41a;
        }
        
        .duobao-message-warning .duobao-message-icon {
          color: #faad14;
        }
        
        .duobao-message-error .duobao-message-icon {
          color: #f5222d;
        }
        
        .duobao-message-loading .duobao-message-icon {
          color: #1890ff;
        }
      `;
      
      document.head.appendChild(style);
    },
    
    _getIcon: function(type) {
      switch (type) {
        case 'info':
          return '<svg viewBox="0 0 1024 1024" width="1em" height="1em"><path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path fill="currentColor" d="M512 336m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z"></path><path fill="currentColor" d="M536 448h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path></svg>';
        case 'success':
          return '<svg viewBox="0 0 1024 1024" width="1em" height="1em"><path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path fill="currentColor" d="M712 304c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-60zM650.9 340.8L521.7 470.1l-57.6-57.6c-4.7-4.7-12.3-4.7-17 0l-84.1 84.1c-4.7 4.7-4.7 12.3 0 17l143.6 143.6c4.7 4.7 12.3 4.7 17 0l226.4-226.4c4.7-4.7 4.7-12.3 0-17l-84.1-84.1c-4.7-4.7-12.3-4.7-17 .1z"></path></svg>';
        case 'warning':
          return '<svg viewBox="0 0 1024 1024" width="1em" height="1em"><path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path fill="currentColor" d="M512 196c-28.5 0-51.7 23.3-51.7 52v384c0 28.7 23.2 52 51.7 52s51.7-23.3 51.7-52V248c0-28.7-23.2-52-51.7-52z"></path><path fill="currentColor" d="M512 764m-52 0a52 52 0 1 0 104 0 52 52 0 1 0-104 0Z"></path></svg>';
        case 'error':
          return '<svg viewBox="0 0 1024 1024" width="1em" height="1em"><path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path fill="currentColor" d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path></svg>';
        case 'loading':
          return '<svg viewBox="0 0 1024 1024" width="1em" height="1em" class="duobao-message-loading-icon"><path fill="currentColor" d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg>';
        default:
          return '';
      }
    },
    
    _show: function(type, content, duration = 3000) {
      const container = this._createContainer();
      
      const messageElement = document.createElement('div');
      messageElement.className = `duobao-message duobao-message-${type}`;
      
      const messageContent = document.createElement('div');
      messageContent.className = 'duobao-message-content';
      
      const icon = document.createElement('span');
      icon.className = 'duobao-message-icon';
      icon.innerHTML = this._getIcon(type);
      
      const text = document.createElement('span');
      text.className = 'duobao-message-text';
      text.textContent = content;
      
      messageContent.appendChild(icon);
      messageContent.appendChild(text);
      messageElement.appendChild(messageContent);
      
      container.appendChild(messageElement);
      
      // 添加动画
      setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(-100%)';
        
        setTimeout(() => {
          container.removeChild(messageElement);
          
          // 如果容器为空，移除容器
          if (container.children.length === 0) {
            document.body.removeChild(container);
            this._container = null;
          }
        }, 300);
      }, duration);
      
      return {
        element: messageElement
      };
    },
    
    info: function(content, duration) {
      return this._show('info', content, duration);
    },
    
    success: function(content, duration) {
      return this._show('success', content, duration);
    },
    
    warning: function(content, duration) {
      return this._show('warning', content, duration);
    },
    
    error: function(content, duration) {
      return this._show('error', content, duration);
    },
    
    loading: function(content, duration) {
      return this._show('loading', content, duration);
    }
  },
  
  // 创建抽屉
  createDrawer: function(options = {}) {
    const defaultOptions = {
      id: 'duobao-drawer-' + Date.now(),
      title: '抽屉',
      content: '',
      width: '378px',
      height: '100%',
      placement: 'right', // right, left, top, bottom
      closable: true,
      maskClosable: true,
      showFooter: false,
      okText: '确定',
      cancelText: '取消',
      onOk: null,
      onCancel: null,
      onClose: null,
      className: '',
      zIndex: 1000
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // 创建抽屉容器
    const drawer = document.createElement('div');
    drawer.id = mergedOptions.id;
    drawer.className = `duobao-drawer duobao-drawer-${mergedOptions.placement} ${mergedOptions.className}`;
    drawer.style.zIndex = mergedOptions.zIndex;
    
    // 创建遮罩层
    const mask = document.createElement('div');
    mask.className = 'duobao-drawer-mask';
    
    // 创建抽屉内容
    const drawerContent = document.createElement('div');
    drawerContent.className = 'duobao-drawer-content';
    
    if (mergedOptions.placement === 'left' || mergedOptions.placement === 'right') {
      drawerContent.style.width = mergedOptions.width;
    } else {
      drawerContent.style.height = mergedOptions.height;
    }
    
    // 创建抽屉头部
    const header = document.createElement('div');
    header.className = 'duobao-drawer-header';
    
    const title = document.createElement('div');
    title.className = 'duobao-drawer-title';
    title.textContent = mergedOptions.title;
    
    header.appendChild(title);
    
    // 创建关闭按钮
    if (mergedOptions.closable) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'duobao-drawer-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.onclick = function() {
        if (typeof mergedOptions.onClose === 'function') {
          mergedOptions.onClose();
        }
        drawer.classList.remove('duobao-drawer-open');
        setTimeout(() => {
          drawer.remove();
        }, 300);
      };
      
      header.appendChild(closeBtn);
    }
    
    // 创建抽屉主体
    const body = document.createElement('div');
    body.className = 'duobao-drawer-body';
    
    if (typeof mergedOptions.content === 'string') {
      body.innerHTML = mergedOptions.content;
    } else if (mergedOptions.content instanceof HTMLElement) {
      body.appendChild(mergedOptions.content);
    }
    
    // 创建抽屉底部
    let footer = null;
    if (mergedOptions.showFooter) {
      footer = document.createElement('div');
      footer.className = 'duobao-drawer-footer';
      
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'duobao-drawer-btn duobao-drawer-btn-cancel';
      cancelBtn.textContent = mergedOptions.cancelText;
      cancelBtn.onclick = function() {
        if (typeof mergedOptions.onCancel === 'function') {
          mergedOptions.onCancel();
        }
        drawer.classList.remove('duobao-drawer-open');
        setTimeout(() => {
          drawer.remove();
        }, 300);
      };
      
      const okBtn = document.createElement('button');
      okBtn.className = 'duobao-drawer-btn duobao-drawer-btn-primary';
      okBtn.textContent = mergedOptions.okText;
      okBtn.onclick = function() {
        if (typeof mergedOptions.onOk === 'function') {
          mergedOptions.onOk();
        }
        drawer.classList.remove('duobao-drawer-open');
        setTimeout(() => {
          drawer.remove();
        }, 300);
      };
      
      footer.appendChild(cancelBtn);
      footer.appendChild(okBtn);
    }
    
    // 组装抽屉
    drawerContent.appendChild(header);
    drawerContent.appendChild(body);
    if (footer) {
      drawerContent.appendChild(footer);
    }
    
    drawer.appendChild(mask);
    drawer.appendChild(drawerContent);
    
    // 添加样式
    this.addDrawerStyles();
    
    // 点击遮罩层关闭抽屉
    if (mergedOptions.maskClosable) {
      mask.onclick = function() {
        if (typeof mergedOptions.onClose === 'function') {
          mergedOptions.onClose();
        }
        drawer.classList.remove('duobao-drawer-open');
        setTimeout(() => {
          drawer.remove();
        }, 300);
      };
    }
    
    // 添加到文档
    document.body.appendChild(drawer);
    
    // 触发动画
    setTimeout(() => {
      drawer.classList.add('duobao-drawer-open');
    }, 10);
    
    // 返回抽屉对象
    return {
      element: drawer,
      close: function() {
        drawer.classList.remove('duobao-drawer-open');
        setTimeout(() => {
          drawer.remove();
        }, 300);
      },
      setTitle: function(title) {
        drawer.querySelector('.duobao-drawer-title').textContent = title;
      },
      setContent: function(content) {
        const body = drawer.querySelector('.duobao-drawer-body');
        if (typeof content === 'string') {
          body.innerHTML = content;
        } else if (content instanceof HTMLElement) {
          body.innerHTML = '';
          body.appendChild(content);
        }
      }
    };
  },
  
  // 添加抽屉样式
  addDrawerStyles: function() {
    if (document.getElementById('duobao-drawer-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'duobao-drawer-styles';
    style.innerHTML = `
      .duobao-drawer {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1000;
      }
      
      .duobao-drawer-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.45);
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
      }
      
      .duobao-drawer-open .duobao-drawer-mask {
        opacity: 1;
        pointer-events: auto;
      }
      
      .duobao-drawer-content {
        position: absolute;
        background-color: #fff;
        box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
        transition: transform 0.3s;
        display: flex;
        flex-direction: column;
        pointer-events: auto;
      }
      
      .duobao-drawer-right .duobao-drawer-content {
        top: 0;
        right: 0;
        height: 100%;
        transform: translateX(100%);
      }
      
      .duobao-drawer-left .duobao-drawer-content {
        top: 0;
        left: 0;
        height: 100%;
        transform: translateX(-100%);
      }
      
      .duobao-drawer-top .duobao-drawer-content {
        top: 0;
        left: 0;
        width: 100%;
        transform: translateY(-100%);
      }
      
      .duobao-drawer-bottom .duobao-drawer-content {
        bottom: 0;
        left: 0;
        width: 100%;
        transform: translateY(100%);
      }
      
      .duobao-drawer-open.duobao-drawer-right .duobao-drawer-content,
      .duobao-drawer-open.duobao-drawer-left .duobao-drawer-content,
      .duobao-drawer-open.duobao-drawer-top .duobao-drawer-content,
      .duobao-drawer-open.duobao-drawer-bottom .duobao-drawer-content {
        transform: translate(0, 0);
      }
      
      .duobao-drawer-header {
        padding: 16px 24px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .duobao-drawer-title {
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
      }
      
      .duobao-drawer-close {
        padding: 0;
        background: transparent;
        border: none;
        outline: none;
        font-size: 16px;
        line-height: 1;
        color: rgba(0, 0, 0, 0.45);
        cursor: pointer;
        transition: color 0.3s;
      }
      
      .duobao-drawer-close:hover {
        color: rgba(0, 0, 0, 0.75);
      }
      
      .duobao-drawer-body {
        padding: 24px;
        overflow-y: auto;
        flex: 1;
      }
      
      .duobao-drawer-footer {
        padding: 10px 16px;
        border-top: 1px solid #f0f0f0;
        text-align: right;
      }
      
      .duobao-drawer-btn {
        margin-left: 8px;
        padding: 8px 16px;
        font-size: 14px;
        border-radius: 2px;
        border: 1px solid #d9d9d9;
        background-color: #fff;
        cursor: pointer;
        transition: all 0.3s;
        outline: none;
      }
      
      .duobao-drawer-btn-primary {
        background-color: #1890ff;
        border-color: #1890ff;
        color: #fff;
      }
      
      .duobao-drawer-btn-primary:hover {
        background-color: #40a9ff;
        border-color: #40a9ff;
      }
      
      .duobao-drawer-btn-cancel:hover {
        border-color: #40a9ff;
        color: #40a
/**
 * 多宝工具库
 * 版本: 1.3.0
 * 最后更新: 2025-08-08
 * 
 * 这是一个全面的前端工具库，提供了丰富的功能模块：
 * - 通用工具函数
 * - 文件处理
 * - 图像处理
 * - 颜色处理
 * - 数学计算
 * - 日期时间处理
 * - 字符串处理
 * - 数组操作
 * - 对象操作
 * - 网络请求
 * - 存储管理
 */

// 通用工具函数
const DuobaoUtils = {
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
  
  // 格式化货币
  formatCurrency: function(amount, currency = 'CNY', locale = 'zh-CN') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  },
  
  // 格式化数字
  formatNumber: function(number, decimals = 0, decimalSeparator = '.', thousandsSeparator = ',') {
    const fixed = parseFloat(number).toFixed(decimals);
    const [whole, fraction] = fixed.split('.');
    
    const wholeFormatted = whole.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    
    return fraction !== undefined ? wholeFormatted + decimalSeparator + fraction : wholeFormatted;
  },
  
  // 格式化百分比
  formatPercent: function(number, decimals = 2) {
    return (number * 100).toFixed(decimals) + '%';
  },
  
  // 生成随机颜色
  randomColor: function(format = 'hex') {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    
    switch (format.toLowerCase()) {
      case 'hex':
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      case 'rgb':
        return `rgb(${r}, ${g}, ${b})`;
      case 'rgba':
        return `rgba(${r}, ${g}, ${b}, 1)`;
      case 'object':
        return { r, g, b };
      default:
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
  },
  
  // 显示通知
  showNotification: function(message, type = 'info', duration = 3000) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `duobao-notification duobao-notification-${type}`;
    notification.innerHTML = `
      <div class="duobao-notification-content">
        <div class="duobao-notification-icon">${this.getNotificationIcon(type)}</div>
        <div class="duobao-notification-message">${message}</div>
      </div>
      <div class="duobao-notification-close">&times;</div>
    `;
    
    // 添加样式
    this.addNotificationStyles();
    
    // 添加到文档
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // 关闭按钮事件
    const closeButton = notification.querySelector('.duobao-notification-close');
    closeButton.addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    });
    
    // 自动隐藏
    if (duration > 0) {
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          if (notification.parentNode) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, duration);
    }
    
    return notification;
  },
  
  // 获取通知图标
  getNotificationIcon: function(type) {
    switch (type) {
      case 'success':
        return '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>';
      case 'error':
        return '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>';
      case 'warning':
        return '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></svg>';
      case 'info':
      default:
        return '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>';
    }
  },
  
  // 添加通知样式
  addNotificationStyles: function() {
    if (document.getElementById('duobao-notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'duobao-notification-styles';
    style.innerHTML = `
      .duobao-notification {
        position: fixed;
        top: 16px;
        right: 16px;
        max-width: 350px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 9999;
      }
      
      .duobao-notification.show {
        transform: translateX(0);
      }
      
      .duobao-notification-content {
        display: flex;
        align-items: center;
        padding: 12px 16px;
      }
      
      .duobao-notification-icon {
        margin-right: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .duobao-notification-message {
        font-size: 14px;
        line-height: 1.5;
      }
      
      .duobao-notification-close {
        padding: 12px 16px;
        cursor: pointer;
        font-size: 18px;
        opacity: 0.7;
        transition: opacity 0.2s ease;
      }
      
      .duobao-notification-close:hover {
        opacity: 1;
      }
      
      .duobao-notification-success {
        border-left: 4px solid #52c41a;
      }
      
      .duobao-notification-success .duobao-notification-icon {
        color: #52c41a;
      }
      
      .duobao-notification-error {
        border-left: 4px solid #f5222d;
      }
      
      .duobao-notification-error .duobao-notification-icon {
        color: #f5222d;
      }
      
      .duobao-notification-warning {
        border-left: 4px solid #faad14;
      }
      
      .duobao-notification-warning .duobao-notification-icon {
        color: #faad14;
      }
      
      .duobao-notification-info {
        border-left: 4px solid #1890ff;
      }
      
      .duobao-notification-info .duobao-notification-icon {
        color: #1890ff;
      }
    `;
    
    document.head.appendChild(style);
  },
  
  // 复制文本到剪贴板
  copyToClipboard: function(text) {
    // 创建临时文本区域
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      // 执行复制命令
      const successful = document.execCommand('copy');
      
      if (successful) {
        this.showNotification('复制成功', 'success');
      } else {
        this.showNotification('复制失败，请手动复制', 'error');
      }
    } catch (err) {
      this.showNotification('复制失败: ' + err, 'error');
    }
    
    document.body.removeChild(textarea);
  }
};

// 字符串处理工具
window.DuobaoString = {
  // 截断字符串
  truncate: function(str, length, suffix = '...') {
    if (!str || str.length <= length) return str;
    return str.substring(0, length) + suffix;
  },
  
  // 首字母大写
  capitalize: function(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  // 全部单词首字母大写
  capitalizeWords: function(str) {
    if (!str) return str;
    return str.replace(/\b\w/g, char => char.toUpperCase());
  },
  
  // 驼峰命名转连字符
  kebabCase: function(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  },
  
  // 连字符转驼峰命名
  camelCase: function(str) {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
  },
  
  // 帕斯卡命名法
  pascalCase: function(str) {
    const camel = this.camelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  },
  
  // 蛇形命名法
  snakeCase: function(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .toLowerCase();
  },
  
  // 反转字符串
  reverse: function(str) {
    return str.split('').reverse().join('');
  },
  
  // 计算字符串长度（支持中文）
  length: function(str, countChinese = true) {
    if (!countChinese) return str.length;
    
    let len = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
        len += 2;
      } else {
        len++;
      }
    }
    return len;
  },
  
  // 生成随机字符串
  random: function(length, chars) {
    return DuobaoUtils.randomString(length, chars);
  },
  
  // 去除HTML标签
  stripTags: function(str) {
    return str.replace(/<[^>]*>/g, '');
  },
  
  // 转义HTML特殊字符
  escapeHtml: function(str) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, m => map[m]);
  },
  
  // 反转义HTML特殊字符
  unescapeHtml: function(str) {
    const map = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'"
    };
    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, m => map[m]);
  },
  
  // 格式化数字为千分位
  formatNumber: function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  
  // 格式化文件大小
  formatFileSize: function(bytes) {
    return DuobaoUtils.formatFileSize(bytes);
  },
  
  // 生成UUID
  uuid: function() {
    return DuobaoUtils.generateUUID();
  },
  
  // 生成指定范围内的随机数
  randomNumber: function(min, max) {
    return DuobaoUtils.random(min, max);
  },
  
  // 检查字符串是否为空
  isEmpty: function(str) {
    return !str || str.trim().length === 0;
  },
  
  // 检查字符串是否为数字
  isNumeric: function(str) {
    return /^-?\d+(\.\d+)?$/.test(str);
  },
  
  // 检查字符串是否为整数
  isInteger: function(str) {
    return /^-?\d+$/.test(str);
  },
  
  // 检查字符串是否为邮箱
  isEmail: function(str) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  },
  
  // 检查字符串是否为URL
  isUrl: function(str) {
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  // 检查字符串是否为手机号码（中国）
  isMobilePhone: function(str) {
    return /^1[3-9]\d{9}$/.test(str);
  },
  
  // 检查字符串是否为身份证号码（中国）
  isIdCard: function(str) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
  },
  
  // 检查字符串是否为IP地址
  isIpAddress: function(str) {
    return /^(\d{1,3}\.){3}\d{1,3}$/.test(str) && str.split('.').every(num => parseInt(num) <= 255);
  },
  
  // 检查字符串是否为日期
  isDate: function(str) {
    return !isNaN(Date.parse(str));
  },
  
  // 检查字符串是否包含特定字符
  contains: function(str, search) {
    return str.indexOf(search) !== -1;
  },
  
  // 检查字符串是否以特定字符开头
  startsWith: function(str, search) {
    return str.indexOf(search) === 0;
  },
  
  // 检查字符串是否以特定字符结尾
  endsWith: function(str, search) {
    const position = str.length - search.length;
    return position >= 0 && str.indexOf(search, position) === position;
  },
  
  // 重复字符串
  repeat: function(str, count) {
    return str.repeat(count);
  },
  
  // 填充字符串到指定长度
  pad: function(str, length, char = ' ', right = false) {
    const padding = length - str.length;
    if (padding <= 0) return str;
    
    const padStr = char.repeat(padding);
    return right ? str + padStr : padStr + str;
  },
  
  // 左填充
  padStart: function(str, length, char = ' ') {
    return this.pad(str, length, char, false);
  },
  
  // 右填充
  padEnd: function(str, length, char = ' ') {
    return this.pad(str, length, char, true);
  },
  
  // 移除字符串两端空白
  trim: function(str) {
    return str.trim();
  },
  
  // 移除字符串左侧空白
  trimStart: function(str) {
    return str.trimStart();
  },
  
  // 移除字符串右侧空白
  trimEnd: function(str) {
    return str.trimEnd();
  },
  
  // 移除字符串中的所有空白
  removeWhitespace: function(str) {
    return str.replace(/\s+/g, '');
  },
  
  // 将字符串拆分为单词数组
  words: function(str) {
    return str.trim().split(/\s+/);
  },
  
  // 计算单词数量
  wordCount: function(str) {
    return this.words(str).length;
  },
  
  // 计算字符出现次数
  countOccurrences: function(str, char) {
    return str.split(char).length - 1;
  },
  
  // 替换所有匹配项
  replaceAll: function(str, search, replacement) {
    return str.split(search).join(replacement);
  },
  
  // 生成指定长度的随机字母数字字符串
  randomAlphanumeric: function(length) {
    return this.random(length, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
  },
  
  // 生成指定长度的随机字母字符串
  randomAlpha: function(length) {
    return this.random(length, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
  },
  
  // 生成指定长度的随机数字字符串
  randomNumeric: function(length) {
    return this.random(length, '0123456789');
  },
  
  // 将字符串转换为URL友好的slug
  slugify: function(str) {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 移除非单词字符
      .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
      .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
  },
  
  // 将字符串转换为Base64
  toBase64: function(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode('0x' + p1)));
  },
  
  // 将Base64转换为字符串
  fromBase64: function(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  },
  
  // 将字符串转换为整数
  toInt: function(str, radix = 10) {
    return parseInt(str, radix);
  },
  
  // 将字符串转换为浮点数
  toFloat: function(str) {
    return parseFloat(str);
  },
  
  // 将字符串转换为布尔值
  toBool: function(str) {
    return ['true', 'yes', '1', 'on'].includes(str.toLowerCase());
  },
  
  // 将字符串转换为JSON对象
  toJson: function(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  },
  
  // 将对象转换为JSON字符串
  fromJson: function(obj, pretty = false) {
    return pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
  },
  
  // 将字符串转换为查询参数对象
  parseQueryString: function(str) {
    if (!str) return {};
    
    const queryString = str.startsWith('?') ? str.substring(1) : str;
    const params = {};
    
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (key) {
        params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
      }
    });
    
    return params;
  },
  
  // 将对象转换为查询字符串
  toQueryString: function(obj) {
    return Object.keys(obj)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
      .join('&');
  },
  
  // 将字符串转换为颜色
  toColor: function(str) {
    // 简单的字符串哈希算法
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // 转换为RGB颜色
    const r = (hash & 0xFF0000) >> 16;
    const g = (hash & 0x00FF00) >> 8;
    const b = hash & 0x0000FF;
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },
  
  // 将字符串转换为数组
  toArray: function(str, delimiter = ',') {
    return str.split(delimiter).map(item => item.trim());
  },
  
  // 将数组转换为字符串
  fromArray: function(arr, delimiter = ',') {
    return arr.join(delimiter);
  },
  
  // 将字符串转换为驼峰命名
  toCamelCase: function(str) {
    return this.camelCase(str);
  },
  
  // 将字符串转换为帕斯卡命名
  toPascalCase: function(str) {
    return this.pascalCase(str);
  },
  
  // 将字符串转换为蛇形命名
  toSnakeCase: function(str) {
    return this.snakeCase(str);
  },
  
  // 将字符串转换为连字符命名
  toKebabCase: function(str) {
    return this.kebabCase(str);
  },
  
  // 将字符串转换为常量命名
  toConstantCase: function(str) {
    return this.snakeCase(str).toUpperCase();
  },
  
  // 将字符串转换为标题命名
  toTitleCase: function(str) {
    return this.capitalizeWords(str);
  },
  
  // 将字符串转换为句子命名
  toSentenceCase: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  
  // 将字符串转换为路径命名
  toPathCase: function(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1/$2')
      .replace(/\s+/g, '/')
      .toLowerCase();
  },
  
  // 将字符串转换为点命名
  toDotCase: function(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1.$2')
      .replace(/\s+/g, '.')
      .toLowerCase();
  },
  
  // 将字符串转换为反引号命名
  toBacktickCase: function(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1`$2')
      .replace(/\s+/g, '`')
      .toLowerCase();
  },
  
  // 将字符串转换为空格命名
  toSpaceCase: function(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_]+/g, ' ')
      .toLowerCase();
  },
  
  // 将字符串转换为首字母小写
  toLowerFirst: function(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  },
  
  // 将字符串转换为首字母大写
  toUpperFirst: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  // 将字符串转换为全部小写
  toLowerCase: function(str) {
    return str.toLowerCase();
  },
  
  // 将字符串转换为全部大写
  toUpperCase: function(str) {
    return str.toUpperCase();
  },
  
  // 将字符串转换为交替大小写
  toAlternatingCase: function(str) {
    return str.split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('');
  },
  
  // 将字符串转换为反转大小写
  toInverseCase: function(str) {
    return str.split('').map(char => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      }
      return char.toUpperCase();
    }).join('');
  },
  
  // 将字符串转换为随机大小写
  toRandomCase: function(str) {
    return str.split('').map(char => {
      return Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
    }).join('');
  },
  
  // 将字符串转换为首字母缩写
  toAcronym: function(str) {
    return str.split(/\s+/).map(word => word.charAt(0).toUpperCase()).join('');
  },
  
  // 将字符串转换为缩写
  toAbbreviation: function(str, maxLength = 3) {
    return str.split(/\s+/).map(word => word.substring(0, maxLength)).join('');
  },
  
  // 将字符串转换为掩码（如信用卡号）
  mask: function(str, maskChar = '*', visibleChars = 4, position = 'end') {
    if (str.length <= visibleChars) return str;
    
    const masked = maskChar.repeat(str.length - visibleChars);
    
    if (position === 'start') {
      return str.substring(0, visibleChars) + masked;
    } else if (position === 'middle') {
      const startChars = Math.ceil(visibleChars / 2);
      const endChars = visibleChars - startChars;
      return str.substring(0, startChars) + masked + str.substring(str.length - endChars);
    } else { // end
      return masked + str.substring(str.length - visibleChars);
    }
  },
  
  // 将字符串转换为掩码电话号码
  maskPhoneNumber: function(phone, maskChar = '*') {
    if (!phone || phone
};

// 文件处理工具
window.DuobaoFile = {
  // 读取文件内容
  readAsText: function(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(e);
      reader.readAsText(file);
    });
  },
  
  // 读取文件为DataURL
  readAsDataURL: function(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(e);
      reader.readAsDataURL(file);
    });
  },
  
  // 读取文件为ArrayBuffer
  readAsArrayBuffer: function(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(e);
      reader.readAsArrayBuffer(file);
    });
  },
  
  // 保存文本为文件
  saveAsFile: function(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  
  // 获取文件扩展名
  getExtension: function(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  },
  
  // 获取文件名（不含扩展名）
  getBasename: function(filename) {
    return filename.split('.').slice(0, -1).join('.');
  },
  
  // 检查文件类型
  checkFileType: function(file, allowedTypes) {
    if (!file || !allowedTypes) return false;
    
    // 如果allowedTypes是字符串，转换为数组
    if (typeof allowedTypes === 'string') {
      allowedTypes = [allowedTypes];
    }
    
    const fileType = file.type;
    const extension = this.getExtension(file.name).toLowerCase();
    
    // 检查MIME类型
    for (const type of allowedTypes) {
      // 检查完整MIME类型
      if (fileType === type) return true;
      
      // 检查MIME类型前缀
      if (type.endsWith('/*') && fileType.startsWith(type.slice(0, -2))) return true;
      
      // 检查文件扩展名
      if (type.startsWith('.') && extension === type.slice(1)) return true;
    }
    
    return false;
  },
  
  // 检查文件大小
  checkFileSize: function(file, maxSize) {
    return file.size <= maxSize;
  },
  
  // 格式化文件大小
  formatFileSize: function(bytes) {
    return DuobaoUtils.formatFileSize(bytes);
  }
};

// 图像处理工具
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
  }
};

// 颜色处理工具
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
  
  // 计算两个颜色之间的对比度
  getContrastRatio: function(color1, color2) {
    // 将颜色转换为RGB
    const rgb1 = typeof color1 === 'string' ? this.hexToRgb(color1) : color1;
    const rgb2 = typeof color2 === 'string' ? this.hexToRgb(color2) : color2;
    
    // 计算相对亮度
    const luminance1 = this.calculateLuminance(rgb1);
    const luminance2 = this.calculateLuminance(rgb2);
    
    // 计算对比度
    const ratio = luminance1 > luminance2 
      ? (luminance1 + 0.05) / (luminance2 + 0.05)
      : (luminance2 + 0.05) / (luminance1 + 0.05);
    
    return parseFloat(ratio.toFixed(2));
  },
  
  // 计算颜色的相对亮度
  calculateLuminance: function(rgb) {
    // 将RGB值标准化
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    // 应用gamma校正
    const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    
    // 计算亮度
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  },
  
  // 检查颜色是否符合WCAG可访问性标准
  isAccessible: function(foreground, background, level = 'AA', isLargeText = false) {
    const ratio = this.getContrastRatio(foreground, background);
    
    if (level === 'AA') {
      return isLargeText ? ratio >= 3 : ratio >= 4.5;
    } else if (level === 'AAA') {
      return isLargeText ? ratio >= 4.5 : ratio >= 7;
    }
    
    return false;
  }
};

// 数学计算工具
window.DuobaoMath = {
  // 基本数学运算
  add: function(a, b) {
    return a + b;
  },
  
  subtract: function(a, b) {
    return a - b;
  },
  
  multiply: function(a, b) {
    return a * b;
  },
  
  divide: function(a, b) {
    if (b === 0) throw new Error('除数不能为零');
    return a / b;
  },
  
  // 四舍五入到指定小数位
  round: function(value, decimals = 0) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  },
  
  // 向上取整到指定小数位
  ceil: function(value, decimals = 0) {
    return Number(Math.ceil(value + 'e' + decimals) + 'e-' + decimals);
  },
  
  // 向下取整到指定小数位
  floor: function(value, decimals = 0) {
    return Number(Math.floor(value + 'e' + decimals) + 'e-' + decimals);
  },
  
  // 计算平均值
  average: function(arr) {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  },
  
  // 计算中位数
  median: function(arr) {
    if (!arr || arr.length === 0) return 0;
    
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  },
  
  // 计算众数
  mode: function(arr) {
    if (!arr || arr.length === 0) return null;
    
    const counts = {};
    let maxCount = 0;
    let modes = [];
    
    for (const num of arr) {
      counts[num] = (counts[num] || 0) + 1;
      
      if (counts[num] > maxCount) {
        maxCount = counts[num];
        modes = [num];
      } else if (counts[num] === maxCount) {
        modes.push(num);
      }
    }
    
    return modes.length === Object.keys(counts).length ? null : modes;
  },
  
  // 计算标准差
  standardDeviation: function(arr) {
    if (!arr || arr.length <= 1) return 0;
    
    const mean = this.average(arr);
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    
    return Math.sqrt(variance);
  },
  
  // 计算百分位数
  percentile: function(arr, p) {
    if (!arr || arr.length === 0) return 0;
    if (p < 0 || p > 100) throw new Error('百分位数必须在0到100之间');
    
    const sorted = [...arr].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const floor = Math.floor(index);
    const ceil = Math.ceil(index);
    
    if (floor === ceil) return sorted[floor];
    
    const d = index - floor;
    return sorted[floor] * (1 - d) + sorted[ceil] * d;
  },
  
  // 计算阶乘
  factorial: function(n) {
    if (n < 0) throw new Error('阶乘不能用于负数');
    if (n === 0 || n === 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    
    return result;
  },
  
  // 计算排列数
  permutation: function(n, r) {
    if (n < 0 || r < 0) throw new Error('排列数不能用于负数');
    if (r > n) throw new Error('r不能大于n');
    
    return this.factorial(n) / this.factorial(n - r);
  },
  
  // 计算组合数
  combination: function(n, r) {
    if (n < 0 || r < 0) throw new Error('组合数不能用于负数');
    if (r > n) throw new Error('r不能大于n');
    
    return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
  },
  
  // 计算最大公约数
  gcd: function(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    
    while (b) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    
    return a;
  },
  
  // 计算最小公倍数
  lcm: function(a, b) {
    return Math.abs(a * b) / this.gcd(a, b);
  },
  
  // 判断是否为质数
  isPrime: function(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    
    const limit = Math.sqrt(n);
    for (let i = 5; i <= limit; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    
    return true;
  },
  
  // 生成指定范围内的质数
  generatePrimes: function(start, end) {
    const primes = [];
    
    for (let i = Math.max(2, start); i <= end; i++) {
      if (this.isPrime(i)) {
        primes.push(i);
      }
    }
    
    return primes;
  },
  
  // 计算斐波那契数列
  fibonacci: function(n) {
    if (n <= 0) return [];
    if (n === 1) return [0];
    if (n === 2) return [0, 1];
    
    const fib = [0, 1];
    for (let i = 2; i < n; i++) {
      fib.push(fib[i - 1] + fib[i - 2]);
    }
    
    return fib;
  },
  
  // 角度转弧度
  degToRad: function(degrees) {
    return degrees * (Math.PI / 180);
  },
  
  // 弧度转角度
  radToDeg: function(radians) {
    return radians * (180 / Math.PI);
  },
  
  // 计算两点之间的距离
  distance: function(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },
  
  // 计算三角形面积（已知三边长）
  triangleArea: function(a, b, c) {
    // 使用海伦公式
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  },
  
  // 计算圆的面积
  circleArea: function(radius) {
    return Math.PI * radius * radius;
  },
  
  // 计算圆的周长
  circleCircumference: function(radius) {
    return 2 * Math.PI * radius;
  },
  
  // 线性插值
  lerp: function(a, b, t) {
    return a + (b - a) * t;
  },
  
  // 将数值限制在指定范围内
  clamp: function(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },
  
  // 计算百分比
  percentage: function(value, total) {
    return (value / total) * 100;
  },
  
  // ===== 贷款计算相关函数 =====
  
  // 计算等额本息月供
  calculateEqualInstallmentPayment: function(principal, term, rate) {
    // 月利率
    const monthlyRate = rate / 12;
    
    // 月供
    return principal * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
  },
  
  // 计算等额本息总利息
  calculateEqualInstallmentTotalInterest: function(principal, term, rate) {
    const monthlyPayment = this.calculateEqualInstallmentPayment(principal, term, rate);
    return monthlyPayment * term - principal;
  },
  
  // 计算等额本金首月月供
  calculateEqualPrincipalFirstPayment: function(principal, term, rate) {
    const monthlyPrincipal = principal / term;
    const monthlyInterest = principal * (rate / 12);
    return monthlyPrincipal + monthlyInterest;
  },
  
  // 计算等额本金月供（指定月份）
  calculateEqualPrincipalPayment: function(principal, term, rate, month) {
    if (month < 1 || month > term) {
      throw new Error('月份必须在1到贷款期限之间');
    }
    
    const monthlyPrincipal = principal / term;
    const remainingPrincipal = principal - (monthlyPrincipal * (month - 1));
    const monthlyInterest = remainingPrincipal * (rate / 12);
    
    return monthlyPrincipal + monthlyInterest;
  },
  
  // 计算等额本金总利息
  calculateEqualPrincipalTotalInterest: function(principal, term, rate) {
    const monthlyRate = rate / 12;
    let totalInterest = 0;
    
    for (let i = 0; i < term; i++) {
      const remainingPrincipal = principal * (1 - i / term);
      totalInterest += remainingPrincipal * monthlyRate;
    }
    
    return totalInterest;
  },
  
  // 计算只还利息方式的月供
  calculateInterestOnlyPayment: function(principal, rate) {
    return principal * (rate / 12);
  },
  
  // 计算只还利息方式的总利息
  calculateInterestOnlyTotalInterest: function(principal, term, rate) {
    return principal * (rate / 12) * term;
  },
  
  // 计算提前还款后的剩余本金（等额本息）
  calculateRemainingPrincipalAfterPrepayment: function(principal, term, rate, paidMonths, prepaymentAmount) {
    if (paidMonths >= term) {
      return 0;
    }
    
    const monthlyRate = rate / 12;
    const monthlyPayment = this.calculateEqualInstallmentPayment(principal, term, rate);
    
    let remainingPrincipal = principal;
    
    // 计算已还期数后的剩余本金
    for (let i = 0; i < paidMonths; i++) {
      const interest = remainingPrincipal * monthlyRate;
      const principalPaid = monthlyPayment - interest;
      remainingPrincipal -= principalPaid;
    }
    
    // 减去提前还款金额
    remainingPrincipal -= prepaymentAmount;
    
    return Math.max(0, remainingPrincipal);
  },
  
  // 计算提前还款后的新贷款期限（保持月供不变）
  calculateNewTermAfterPrepayment: function(remainingPrincipal, monthlyPayment, rate) {
    const monthlyRate = rate / 12;
    
    // 如果月供小于或等于月利息，则无法还清
    const monthlyInterest = remainingPrincipal * monthlyRate;
    if (monthlyPayment <= monthlyInterest) {
      return Infinity;
    }
    
    // 计算新期限
    const newTerm = Math.log(monthlyPayment / (monthlyPayment - remainingPrincipal * monthlyRate)) / Math.log(1 + monthlyRate);
    
    return Math.ceil(newTerm);
  },
  
  // 计算提前还款后的新月供（保持期限不变）
  calculateNewPaymentAfterPrepayment: function(remainingPrincipal, remainingTerm, rate) {
    return this.calculateEqualInstallmentPayment(remainingPrincipal, remainingTerm, rate);
  },
  
  // 计算组合贷款月供（等额本息）
  calculateCombinedLoanPayment: function(commercialAmount, commercialRate, housingAmount, housingRate, term) {
    const commercialPayment = this.calculateEqualInstallmentPayment(commercialAmount, term, commercialRate);
    const housingPayment = this.calculateEqualInstallmentPayment(housingAmount, term, housingRate);
    
    return commercialPayment + housingPayment;
  },
  
  // 计算组合贷款总利息（等额本息）
  calculateCombinedLoanTotalInterest: function(commercialAmount, commercialRate, housingAmount, housingRate, term) {
    const commercialInterest = this.calculateEqualInstallmentTotalInterest(commercialAmount, term, commercialRate);
    const housingInterest = this.calculateEqualInstallmentTotalInterest(housingAmount, term, housingRate);
    
    return commercialInterest + housingInterest;
  },
  
  // 计算贷款每月递减金额（等额本金）
  calculateMonthlyDecrement: function(principal, term, rate) {
    const monthlyPrincipal = principal / term;
    return monthlyPrincipal * (rate / 12);
  },
  
  // 计算还款计划（等额本息）
  generateEqualInstallmentSchedule: function(principal, term, rate, startDate) {
    // 月利率
    const monthlyRate = rate / 12;
    
    // 月供
    const monthlyPayment = this.calculateEqualInstallmentPayment(principal, term, rate);
    
    // 生成还款计划
    const schedule = [];
    let balance = principal;
    let currentDate = new Date(startDate);
    
    for (let month = 1; month <= term; month++) {
      // 计算当月利息
      const interest = balance * monthlyRate;
      
      // 计算当月本金
      const principalPaid = monthlyPayment - interest;
      
      // 更新剩余本金
      balance -= principalPaid;
      
      // 处理最后一期可能的舍入误差
      if (month === term) {
        balance = 0;
      }
      
      // 添加到还款计划
      schedule.push({
        month: month,
        date: new Date(currentDate),
        payment: monthlyPayment,
        principal: principalPaid,
        interest: interest,
        balance: balance
      });
      
      // 更新下一个还款日期
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return schedule;
  },
  
  // 计算还款计划（等额本金）
  generateEqualPrincipalSchedule: function(principal, term, rate, startDate) {
    // 月利率
    const monthlyRate = rate / 12;
    
    // 每月本金
    const monthlyPrincipal = principal / term;
    
    // 生成还款计划
    const schedule = [];
    let balance = principal;
    let currentDate = new Date(startDate);
    
    for (let month = 1; month <= term; month++) {
      // 计算当月利息
      const interest = balance * monthlyRate;
      
      // 计算当月月供
      const payment = monthlyPrincipal + interest;
      
      // 更新剩余本金
      balance -= monthlyPrincipal;
      
      // 处理最后一期可能的舍入误差
      if (month === term) {
        balance = 0;
      }
      
      // 添加到还款计划
      schedule.push({
        month: month,
        date: new Date(currentDate),
        payment: payment,
        principal: monthlyPrincipal,
        interest: interest,
        balance: balance
      });
      
      // 更新下一个还款日期
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return schedule;
  }
};

// 日期时间处理工具
window.DuobaoDate = {
  // 格式化日期
  format: function(date, format) {
    return DuobaoUtils.formatDate(date, format);
  },
  
  // 获取当前日期时间
  now: function() {
    return new Date();
  },
  
  // 获取当前时间戳
  timestamp: function() {
    return Date.now();
  },
  
  // 创建日期对象
  create: function(year, month, day, hour = 0, minute = 0, second = 0, millisecond = 0) {
    return new Date(year, month - 1, day, hour, minute, second, millisecond);
  },
  
  // 解析日期字符串
  parse: function(dateString) {
    return new Date(dateString);
  },
  
  // 添加天数
  addDays: function(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  
  // 添加月数
  addMonths: function(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  },
  
  // 添加年数
  addYears: function(date, years) {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  },
  
  // 添加小时
  addHours: function(date, hours) {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
  },
  
  // 添加分钟
  addMinutes: function(date, minutes) {
    return new Date(date.getTime() + minutes * 60 * 1000);
  },
  
  // 添加秒数
  addSeconds: function(date, seconds) {
    return new Date(date.getTime() + seconds * 1000);
  },
  
  // 计算两个日期之间的天数差
  diffInDays: function(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  },
  
  // 计算两个日期之间的月数差
  diffInMonths: function(date1, date2) {
    const months1 = date1.getFullYear() * 12 + date1.getMonth();
    const months2 = date2.getFullYear() * 12 + date2.getMonth();
    return Math.abs(months2 - months1);
  },
  
  // 计算两个日期之间的年数差
  diffInYears: function(date1, date2) {
    return Math.abs(date2.getFullYear() - date1.getFullYear());
  },
  
  // 获取某月的天数
  daysInMonth: function(year, month) {
    return new Date(year, month, 0).getDate();
  },
  
  // 获取某年的天数
  daysInYear: function(year) {
    return this.isLeapYear(year) ? 366 : 365;
  },
  
  // 判断是否为闰年
  isLeapYear: function(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  },
  
  // 获取日期是一年中的第几天
  dayOfYear: function(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  },
  
  // 获取日期是一周中的第几天（0-6，0表示周日）
  dayOfWeek: function(date) {
    return date.getDay();
  },
  
  // 获取日期所在周的第一天（周日）
  startOfWeek: function(date) {
    const result = new Date(date);
    result.setDate(result.getDate() - result.getDay());
    result.setHours(0, 0, 0, 0);
    return result;
  },
  
  // 获取日期所在周的最后一天（周六）
  endOfWeek: function(date) {
    const result = new Date(date);
    result.setDate(result.getDate() + (6 - result.getDay()));
    result.setHours(23, 59, 59, 999);
    return result;
  },
  
  // 获取日期所在月的第一天
  startOfMonth: function(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },
  
  // 获取日期所在月的最后一天
  endOfMonth: function(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  },
  
  // 获取日期所在年的第一天
  startOfYear: function(date) {
    return new Date(date.getFullYear(), 0, 1);
  },
  
  // 获取日期所在年的最后一天
  endOfYear: function(date) {
    return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
  },
  
  // 判断是否为同一天
  isSameDay: function(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  },
  
  // 判断是否为同一月
  isSameMonth: function(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth();
  },
  
  // 判断是否为同一年
  isSameYear: function(date1, date2) {
    return date1.getFullYear() === date2.getFullYear();
  },
  
  // 判断日期是否在过去
  isPast: function(date) {
    return date.getTime() < Date.now();
  },
  
  // 判断日期是否在未来
  isFuture: function(date) {
    return date.getTime() > Date.now();
  },
  
  // 判断日期是否为今天
  isToday: function(date) {
    return this.isSameDay(date, new Date());
  },
  
  // 判断日期是否为昨天
  isYesterday: function(date) {
    const yesterday = this.addDays(new Date(), -1);
    return this.isSameDay(date, yesterday);
  },
  
  // 判断日期是否为明天
  isTomorrow: function(date) {
    const tomorrow = this.addDays(new Date(), 1);
    return this.isSameDay(date, tomorrow);
  },
  
  // 判断日期是否为周末
  isWeekend: function(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  },
  
  // 判断日期是否为工作日
  isWeekday: function(date) {
    return !this.isWeekend(date);
  },
  
  // 获取相对时间描述
  timeAgo: function(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval + ' 年前';
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + ' 个月前';
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + ' 天前';
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + ' 小时前';
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + ' 分钟前';
    }
    
    if (seconds < 10) {
      return '刚刚';
    }
    
    return Math.floor(seconds) + ' 秒前';
  }
};

// 引入子模块
(function() {
  // 字符串处理子模块
  const stringModules = [
    'static/js/libs/string/base.js',
    'static/js/libs/string/html.js',
    'static/js/libs/string/convert.js',
    'static/js/libs/string/validate.js'
  ];
  
  // 其他模块
  const otherModules = [
    'static/js/libs/array.js',
    'static/js/libs/object.js',
    'static/js/libs/network.js',
    'static/js/libs/storage.js',
    'static/js/libs/date.js'
  ];
  
  // 加载所有模块
  const allModules = [...stringModules, ...otherModules];
  
  // 使用Promise加载所有模块
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false; // 保持加载顺序
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  // 初始化命名空间
  window.DuobaoString = window.DuobaoString || {};
  window.DuobaoArray = window.DuobaoArray || {};
  window.DuobaoObject = window.DuobaoObject || {};
  window.DuobaoNetwork = window.DuobaoNetwork || {};
  window.DuobaoStorage = window.DuobaoStorage || {};
  
  // 按顺序加载所有模块
  allModules.reduce((promise, src) => {
    return promise.then(() => loadScript(src));
  }, Promise.resolve()).then(() => {
    // 所有模块加载完成后触发事件
    const event = new Event('duobao-libs-loaded');
    document.dispatchEvent(event);
    console.log('多宝工具库加载完成');
  }).catch(error => {
    console.error('模块加载失败:', error);
  });
})();

// UI组件工具
window.DuobaoUI = {
  // 创建模态框
  createModal: function(options = {}) {
    const defaultOptions = {
      id: 'duobao-modal-' + Date.now(),
      title: '提示',
      content: '',
      width: '500px',
      height: 'auto',
      closable: true,
      maskClosable: true,
      showFooter: true,
      okText: '确定',
      cancelText: '取消',
      onOk: null,
      onCancel: null,
      onClose: null,
      className: '',
      zIndex: 1000
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // 创建模态框容器
    const modal = document.createElement('div');
    modal.id = mergedOptions.id;
    modal.className = `duobao-modal ${mergedOptions.className}`;
    modal.style.zIndex = mergedOptions.zIndex;
    
    // 创建遮罩层
    const mask = document.createElement('div');
    mask.className = 'duobao-modal-mask';
    
    // 创建模态框内容
    const modalContent = document.createElement('div');
    modalContent.className = 'duobao-modal-content';
    modalContent.style.width = mergedOptions.width;
    modalContent.style.height = mergedOptions.height;
    
    // 创建模态框头部
    const header = document.createElement('div');
    header.className = 'duobao-modal-header';
    
    const title = document.createElement('div');
    title.className = 'duobao-modal-title';
    title.textContent = mergedOptions.title;
    
    header.appendChild(title);
    
    // 创建关闭按钮
    if (mergedOptions.closable) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'duobao-modal-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.onclick = function() {
        if (typeof mergedOptions.onClose === 'function') {
          mergedOptions.onClose();
        }
        modal.remove();
      };
      
      header.appendChild(closeBtn);
    }
    
    // 创建模态框主体
    const body = document.createElement('div');
    body.className = 'duobao-modal-body';
    
    if (typeof mergedOptions.content === 'string') {
      body.innerHTML = mergedOptions.content;
    } else if (mergedOptions.content instanceof HTMLElement) {
      body.appendChild(mergedOptions.content);
    }
    
    // 创建模态框底部
    let footer = null;
    if (mergedOptions.showFooter) {
      footer = document.createElement('div');
      footer.className = 'duobao-modal-footer';
      
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'duobao-modal-btn duobao-modal-btn-cancel';
      cancelBtn.textContent = mergedOptions.cancelText;
      cancelBtn.onclick = function() {
        if (typeof mergedOptions.onCancel === 'function') {
          mergedOptions.onCancel();
        }
        modal.remove();
      };
      
      const okBtn = document.createElement('button');
      okBtn.className = 'duobao-modal-btn duobao-modal-btn-primary';
      okBtn.textContent = mergedOptions.okText;
      okBtn.onclick = function() {
        if (typeof mergedOptions.onOk === 'function') {
          mergedOptions.onOk();
        }
        modal.remove();
      };
      
      footer.appendChild(cancelBtn);
      footer.appendChild(okBtn);
    }
    
    // 组装模态框
    modalContent.appendChild(header);
    modalContent.appendChild(body);
    if (footer) {
      modalContent.appendChild(footer);
    }
    
    modal.appendChild(mask);
    modal.appendChild(modalContent);
    
    // 添加样式
    this.addModalStyles();
    
    // 点击遮罩层关闭模态框
    if (mergedOptions.maskClosable) {
      mask.onclick = function(e) {
        if (e.target === mask) {
          if (typeof mergedOptions.onClose === 'function') {
            mergedOptions.onClose();
          }
          modal.remove();
        }
      };
    }
    
    // 添加到文档
    document.body.appendChild(modal);
    
    // 返回模态框对象
    return {
      element: modal,
      close: function() {
        modal.remove();
      },
      setTitle: function(title) {
        modal.querySelector('.duobao-modal-title').textContent = title;
      },
      setContent: function(content) {
        const body = modal.querySelector('.duobao-modal-body');
        if (typeof content === 'string') {
          body.innerHTML = content;
        } else if (content instanceof HTMLElement) {
          body.innerHTML = '';
          body.appendChild(content);
        }
      }
    };
  },
  
  // 添加模态框样式
  addModalStyles: function() {
    if (document.getElementById('duobao-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'duobao-modal-styles';
    style.innerHTML = `
      .duobao-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .duobao-modal-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
      
      .duobao-modal-content {
        position: relative;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 90%;
        max-height: 90%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      
      .duobao-modal-header {
        padding: 16px 24px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .duobao-modal-title {
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
      }
      
      .duobao-modal-close {
        padding: 0;
        background: transparent;
        border: none;
        outline: none;
        font-size: 16px;
        line-height: 1;
        color: rgba(0, 0, 0, 0.45);
        cursor: pointer;
        transition: color 0.3s;
      }
      
      .duobao-modal-close:hover {
        color: rgba(0, 0, 0, 0.75);
      }
      
      .duobao-modal-body {
        padding: 24px;
        overflow-y: auto;
        flex: 1;
      }
      
      .duobao-modal-footer {
        padding: 10px 16px;
        border-top: 1px solid #f0f0f0;
        text-align: right;
      }
      
      .duobao-modal-btn {
        margin-left: 8px;
        padding: 8px 16px;
        font-size: 14px;
        border-radius: 2px;
        border: 1px solid #d9d9d9;
        background-color: #fff;
        cursor: pointer;
        transition: all 0.3s;
        outline: none;
      }
      
      .duobao-modal-btn-primary {
        background-color: #1890ff;
        border-color: #1890ff;
        color: #fff;
      }
      
      .duobao-modal-btn-primary:hover {
        background-color: #40a9ff;
        border-color: #40a9ff;
      }
      
      .duobao-modal-btn-cancel:hover {
        border-color: #40a9ff;
        color: #40a9ff;
      }
    `;
    
    document.head.appendChild(style);
  }
};

// 导出主模块
window.Duobao = {
  Utils: DuobaoUtils,
  File: DuobaoFile,
  Image: DuobaoImage,
  Color: DuobaoColor,
  Math: DuobaoMath,
  Date: DuobaoDate,
  String: DuobaoString,
  Array: DuobaoArray,
  Object: DuobaoObject,
  Network: DuobaoNetwork,
  Storage: DuobaoStorage,
  UI: DuobaoUI,
  
  // 版本信息
  version: '1.3.0',
  
  // 初始化函数
  init: function(options = {}) {
    console.log(`多宝工具库 v${this.version} 初始化`);
    
    // 触发初始化事件
    const event = new CustomEvent('duobao-init', { detail: options });
    document.dispatchEvent(event);
    
    return this;
  }
};

// 如果支持模块导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.Duobao;
}
