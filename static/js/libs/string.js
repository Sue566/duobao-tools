/**
 * 多宝工具库 - 字符串处理工具
 */

window.DuobaoString = {
  // 截取字符串
  truncate: function(str, length, suffix = '...') {
    if (!str || str.length <= length) {
      return str;
    }
    
    return str.substring(0, length) + suffix;
  },
  
  // 首字母大写
  capitalize: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  // 全部单词首字母大写
  titleCase: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/\b\w+/g, word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  },
  
  // 驼峰命名转换
  camelCase: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^[A-Z]/, c => c.toLowerCase());
  },
  
  // 帕斯卡命名转换
  pascalCase: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    const camel = this.camelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  },
  
  // 短横线命名转换
  kebabCase: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },
  
  // 下划线命名转换
  snakeCase: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
  },
  
  // 反转字符串
  reverse: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.split('').reverse().join('');
  },
  
  // 去除HTML标签
  stripHtml: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/<[^>]*>/g, '');
  },
  
  // 转义HTML特殊字符
  escapeHtml: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    
    return str.replace(/[&<>"'`=\/]/g, s => entityMap[s]);
  },
  
  // 反转义HTML特殊字符
  unescapeHtml: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    const entityMap = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x2F;': '/',
      '&#x60;': '`',
      '&#x3D;': '='
    };
    
    return str.replace(/&(amp|lt|gt|quot|#39|#x2F|#x60|#x3D);/g, s => entityMap[s]);
  },
  
  // 生成随机字符串
  random: function(length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let result = '';
    const charsLength = chars.length;
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charsLength));
    }
    
    return result;
  },
  
  // 生成UUID
  uuid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  
  // 计算字符串长度（支持中文）
  length: function(str) {
    if (!str || typeof str !== 'string') return 0;
    
    // 将中文字符计为2个长度
    return str.replace(/[\u4e00-\u9fa5]/g, '**').length;
  },
  
  // 计算字符串字节长度
  byteLength: function(str) {
    if (!str || typeof str !== 'string') return 0;
    
    let length = 0;
    
    for (let i = 0; i < str.length; i++) {
      // 中文字符通常占用3个字节
      if (str.charCodeAt(i) > 127) {
        length += 3;
      } else {
        length += 1;
      }
    }
    
    return length;
  },
  
  // 填充字符串
  pad: function(str, length, char = ' ', position = 'right') {
    if (!str || typeof str !== 'string') return str;
    
    const padLength = Math.max(0, length - str.length);
    const padding = char.repeat(padLength);
    
    if (position === 'left') {
      return padding + str;
    } else if (position === 'both') {
      const leftPad = char.repeat(Math.floor(padLength / 2));
      const rightPad = char.repeat(Math.ceil(padLength / 2));
      return leftPad + str + rightPad;
    } else {
      return str + padding;
    }
  },
  
  // 左填充
  padLeft: function(str, length, char = ' ') {
    return this.pad(str, length, char, 'left');
  },
  
  // 右填充
  padRight: function(str, length, char = ' ') {
    return this.pad(str, length, char, 'right');
  },
  
  // 居中填充
  padCenter: function(str, length, char = ' ') {
    return this.pad(str, length, char, 'both');
  },
  
  // 重复字符串
  repeat: function(str, count) {
    if (!str || typeof str !== 'string' || count < 0) return '';
    
    return str.repeat(count);
  },
  
  // 检查字符串是否为空或只包含空白字符
  isEmpty: function(str) {
    return !str || /^\s*$/.test(str);
  },
  
  // 检查字符串是否包含指定子串
  contains: function(str, substring, ignoreCase = false) {
    if (!str || typeof str !== 'string') return false;
    
    if (ignoreCase) {
      return str.toLowerCase().includes(substring.toLowerCase());
    }
    
    return str.includes(substring);
  },
  
  // 计算两个字符串的相似度（Levenshtein距离）
  similarity: function(str1, str2) {
    if (!str1 || !str2) return 0;
    
    const len1 = str1.length;
    const len2 = str2.length;
    
    // 创建距离矩阵
    const matrix = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));
    
    // 初始化第一行和第一列
    for (let i = 0; i <= len1; i++) {
      matrix[i][0] = i;
    }
    
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }
    
    // 填充矩阵
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // 删除
          matrix[i][j - 1] + 1, // 插入
          matrix[i - 1][j - 1] + cost // 替换
        );
      }
    }
    
    // 计算相似度
    const maxLen = Math.max(len1, len2);
    if (maxLen === 0) return 1; // 两个空字符串视为完全相同
    
    return 1 - matrix[len1][len2] / maxLen;
  },
  
  // 格式化字符串（类似于C#的string.Format）
  format: function(template, ...args) {
    if (!template || typeof template !== 'string') return template;
    
    if (args.length === 1 && typeof args[0] === 'object') {
      // 命名参数格式化：format("Hello, {name}!", { name: "World" })
      const params = args[0];
      return template.replace(/{([^{}]*)}/g, (match, key) => {
        const value = key.split('.').reduce((obj, prop) => obj && obj[prop], params);
        return value !== undefined ? value : match;
      });
    } else {
      // 索引参数格式化：format("Hello, {0}!", "World")
      return template.replace(/{(\d+)}/g, (match, index) => {
        return args[index] !== undefined ? args[index] : match;
      });
    }
  },
  
  // 将字符串转换为URL友好的slug
  slugify: function(str) {
    if (!str || typeof str !== 'string') return '';
    
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // 移除非单词字符
      .replace(/[\s_-]+/g, '-') // 将空格、下划线和连字符替换为单个连字符
      .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
  },
  
  // 将字符串转换为数字
  toNumber: function(str, defaultValue = 0) {
    if (!str || typeof str !== 'string') return defaultValue;
    
    const num = parseFloat(str);
    return isNaN(num) ? defaultValue : num;
  },
  
  // 将字符串转换为布尔值
  toBoolean: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const lowered = str.toLowerCase().trim();
    return lowered === 'true' || lowered === 'yes' || lowered === '1' || lowered === 'on';
  },
  
  // 将字符串转换为数组
  toArray: function(str, delimiter = ',') {
    if (!str || typeof str !== 'string') return [];
    
    return str.split(delimiter).map(item => item.trim());
  },
  
  // 将字符串转换为对象
  toObject: function(str, itemDelimiter = ',', keyValueDelimiter = ':') {
    if (!str || typeof str !== 'string') return {};
    
    const result = {};
    const items = str.split(itemDelimiter);
    
    for (const item of items) {
      const [key, value] = item.split(keyValueDelimiter).map(part => part.trim());
      if (key) {
        result[key] = value || '';
      }
    }
    
    return result;
  },
  
  // 将字符串转换为JSON对象
  toJson: function(str, defaultValue = {}) {
    if (!str || typeof str !== 'string') return defaultValue;
    
    try {
      return JSON.parse(str);
    } catch (e) {
      return defaultValue;
    }
  },
  
  // 将字符串转换为日期对象
  toDate: function(str, defaultValue = null) {
    if (!str || typeof str !== 'string') return defaultValue;
    
    const date = new Date(str);
    return isNaN(date.getTime()) ? defaultValue : date;
  },
  
  // 检查字符串是否为有效的电子邮件地址
  isEmail: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(str);
  },
  
  // 检查字符串是否为有效的URL
  isUrl: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  // 检查字符串是否为有效的IP地址
  isIp: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    // IPv4
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipv4Match = str.match(ipv4Regex);
    
    if (ipv4Match) {
      return ipv4Match.slice(1).every(part => parseInt(part, 10) <= 255);
    }
    
    // IPv6 (简化检查)
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv6Regex.test(str);
  },
  
  // 检查字符串是否为有效的手机号码（中国）
  isMobilePhone: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(str);
  },
  
  // 检查字符串是否为有效的身份证号码（中国）
  isIdCard: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    // 18位身份证号码
    const idCardRegex = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
    
    if (!idCardRegex.test(str)) {
      return false;
    }
    
    // 验证校验位
    if (str.length === 18) {
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      const parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
      let sum = 0;
      
      for (let i = 0; i < 17; i++) {
        sum += parseInt(str[i], 10) * factor[i];
      }
      
      const check = parity[sum % 11];
      return check.toUpperCase() === str[17].toUpperCase();
    }
    
    return true;
  },
  
  // 检查字符串是否为有效的邮政编码（中国）
  isPostalCode: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const postalCodeRegex = /^[1-9]\d{5}$/;
    return postalCodeRegex.test(str);
  },
  
  // 检查字符串是否为有效的信用卡号
  isCreditCard: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    // 移除空格和连字符
    const sanitized = str.replace(/[\s-]/g, '');
    
    // 检查是否只包含数字
    if (!/^\d+$/.test(sanitized)) {
      return false;
    }
    
    // 检查长度
    if (sanitized.length < 13 || sanitized.length > 19) {
      return false;
    }
    
    // Luhn算法验证
    let sum = 0;
    let double = false;
    
    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized[i], 10);
      
      if (double) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      double = !double;
    }
    
    return sum % 10 === 0;
  },
  
  // 检查字符串是否为有效的日期格式
  isDate: function(str, format = 'YYYY-MM-DD') {
    if (!str || typeof str !== 'string') return false;
    
    // 简单格式验证
    let regex;
    
    switch (format.toUpperCase()) {
      case 'YYYY-MM-DD':
        regex = /^\d{4}-\d{2}-\d{2}$/;
        break;
      case 'MM/DD/YYYY':
        regex = /^\d{2}\/\d{2}\/\d{4}$/;
        break;
      case 'DD/MM/YYYY':
        regex = /^\d{2}\/\d{2}\/\d{4}$/;
        break;
      case 'YYYY/MM/DD':
        regex = /^\d{4}\/\d{2}\/\d{2}$/;
        break;
      default:
        return false;
    }
    
    if (!regex.test(str)) {
      return false;
    }
    
    // 解析日期并验证
    let year, month, day;
    
    if (format.toUpperCase() === 'YYYY-MM-DD') {
      [year, month, day] = str.split('-').map(Number);
    } else if (format.toUpperCase() === 'YYYY/MM/DD') {
      [year, month, day] = str.split('/').map(Number);
    } else if (format.toUpperCase() === 'MM/DD/YYYY') {
      const parts = str.split('/').map(Number);
      month = parts[0];
      day = parts[1];
      year = parts[2];
    } else if (format.toUpperCase() === 'DD/MM/YYYY') {
      const parts = str.split('/').map(Number);
      day = parts[0];
      month = parts[1];
      year = parts[2];
    }
    
    // 验证月份和日期
    if (month < 1 || month > 12) {
      return false;
    }
    
    const daysInMonth = new Date(year, month, 0).getDate();
    return day >= 1 && day <= daysInMonth;
  },
  
  // 检查字符串是否为有效的时间格式
  isTime: function(str, format = 'HH:mm:ss') {
    if (!str || typeof str !== 'string') return false;
    
    // 简单格式验证
    let regex;
    
    switch (format.toUpperCase()) {
      case 'HH:MM:SS':
      case 'HH:MM':
        regex = new RegExp(`^\\d{2}:\\d{2}${format.length > 5 ? ':\\d{2}' : ''}$`);
        break;
      case 'H:MM:SS':
      case 'H:MM':
        regex = new RegExp(`^\\d{1,2}:\\d{2}${format.length > 4 ? ':\\d{2}' : ''}$`);
        break;
      default:
        return false;
    }
    
    if (!regex.test(str)) {
      return false;
    }
    
    // 解析时间并验证
    const parts = str.split(':').map(Number);
    const hours = parts[0];
    const minutes = parts[1];
    const seconds = parts.length > 2 ? parts[2] : 0;
    
    return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60 && seconds >= 0 && seconds < 60;
  },
  
  // 检查字符串是否为有效的十六进制颜色
  isHexColor: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(str);
  },
  
  // 检查字符串是否为有效的RGB颜色
  isRgbColor: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const regex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
    const match = str.match(regex);
    
    if (!match) {
      return false;
    }
    
    return match.slice(1).every(value => parseInt(value, 10) <= 255);
  },
  
  // 检查字符串是否为有效的RGBA颜色
  isRgbaColor: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const regex = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]|0?\.\d+)\s*\)$/;
    const match = str.match(regex);
    
    if (!match) {
      return false;
    }
    
    return match.slice(1, 4).every(value => parseInt(value, 10) <= 255) && parseFloat(match[4]) <= 1;
  },
  
  // 检查字符串是否为有效的HSL颜色
  isHslColor: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const regex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;
    const match = str.match(regex);
    
    if (!match) {
      return false;
    }
    
    const [_, h, s, l] = match.map(Number);
    return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100;
  },
  
  // 检查字符串是否为有效的HSLA颜色
  isHslaColor: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const regex = /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*([01]|0?\.\d+)\s*\)$/;
    const match = str.match(regex);
    
    if (!match) {
      return false;
    }
    
    const [_, h, s, l, a] = match.map(Number);
    return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100 && a >= 0 && a <= 1;
  },
  
  // 检查字符串是否为有效的JSON
  isJson: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  // 检查字符串是否为有效的XML
  isXml: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(str, 'application/xml');
      const errorNode = doc.querySelector('parsererror');
      return !errorNode;
    } catch (e) {
      return false;
    }
  },
  
  // 检查字符串是否为有效的Base64
  isBase64: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    
    // 检查字符是否有效
    if (!base64Regex.test(str)) {
      return false;
    }
    
    // 检查长度是否为4的倍数（可能有填充）
    const paddingLength = str.endsWith('==') ? 2 : (str.endsWith('=') ? 1 : 0);
    return (str.length - paddingLength) % 4 === 0;
  },
  
  // 检查字符串是否为有效的数字
  isNumeric: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[+-]?\d+(\.\d+)?$/.test(str);
  },
  
  // 检查字符串是否为有效的整数
  isInteger: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[+-]?\d+$/.test(str);
  },
  
  // 检查字符串是否为有效的浮点数
  isFloat: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[+-]?\d+\.\d+$/.test(str);
  },
  
  // 检查字符串是否为有效的十六进制数
  isHex: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[0-9a-fA-F]+$/.test(str);
  },
  
  // 检查字符串是否为有效的二进制数
  isBinary: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[01]+$/.test(str);
  },
  
  // 检查字符串是否为有效的八进制数
  isOctal: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[0-7]+$/.test(str);
  },
  
  // 检查字符串是否只包含字母
  isAlpha: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[a-zA-Z]+$/.test(str);
  },
  
  // 检查字符串是否只包含字母和数字
  isAlphanumeric: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[a-zA-Z0-9]+$/.test(str);
  },
  
  // 检查字符串是否只包含ASCII字符
  isAscii: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[\x00-\x7F]+$/.test(str);
  },
  
  // 检查字符串是否为有效的文件名
  isFileName: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[^<>:"/\\|?*\x00-\x1F]+$/.test(str) && str.length <= 255;
  },
  
  // 检查字符串是否为有效的路径
  isPath: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    // 简单检查，不同操作系统有不同的路径规则
    return /^[^<>:"|?*\x00-\x1F]*$/.test(str);
  },
  
  // 检查字符串是否为有效的域名
  isDomain: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    return domainRegex.test(str);
  },
  
  // 检查字符串是否为有效的MAC地址
  isMacAddress: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(str);
  },
  
  // 检查字符串是否为有效的ISBN
  isIsbn: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    // 移除所有连字符和空格
    const sanitized = str.replace(/[\s-]/g, '');
    
    // ISBN-10
    if (sanitized.length === 10) {
      if (!/^\d{9}[\dX]$/i.test(sanitized)) {
        return false;
      }
      
      // 验证校验位
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(sanitized[i], 10) * (10 - i);
      }
      
      const checkDigit = sanitized[9].toUpperCase() === 'X' ? 10 : parseInt(sanitized[9], 10);
      return (sum + checkDigit) % 11 === 0;
    }
    
    // ISBN-13
    if (sanitized.length === 13) {
      if (!/^\d{13}$/.test(sanitized)) {
        return false;
      }
      
      // 验证校验位
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += parseInt(sanitized[i], 10) * (i % 2 === 0 ? 1 : 3);
      }
      
      const checkDigit = (10 - (sum % 10)) % 10;
      return parseInt(sanitized[12], 10) === checkDigit;
    }
    
    return false;
  },
  
  // 高亮文本中的关键词
  highlight: function(text, keyword, highlightClass = 'highlight') {
    if (!text || !keyword || typeof text !== 'string' || typeof keyword !== 'string') {
      return text;
    }
    
    const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
    
    return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
  },
  
  // 将文本转换为HTML
  nl2br: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/\n/g, '<br>');
  },
  
  // 将HTML转换为纯文本
  br2nl: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/<br\s*\/?>/gi, '\n');
  },
  
  // 将文本转换为HTML段落
  toParagraphs: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str
      .split(/\n\n+/)
      .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
      .join('');
  },
  
  // 将文本转换为HTML列表
  toList: function(str, ordered = false) {
    if (!str || typeof str !== 'string') return str;
    
    const lines = str.split('\n').filter(line => line.trim());
    const listTag = ordered ? 'ol' : 'ul';
    
    return `<${listTag}>${lines.map(line => `<li>${line}</li>`).join('')}</${listTag}>`;
  },
  
  // 将文本转换为HTML表格
  toTable: function(str, delimiter = ',', hasHeader = true) {
    if (!str || typeof str !== 'string') return str;
    
    const lines = str.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return '';
    }
    
    const rows = lines.map(line => line.split(delimiter));
    
    let html = '<table>';
    
    if (hasHeader) {
      html += '<thead><tr>';
      html += rows[0].map(cell => `<th>${cell}</th>`).join('');
      html += '</tr></thead>';
      rows.shift();
    }
    
    html += '<tbody>';
    rows.forEach(row => {
      html += '<tr>';
      html += row.map(cell => `<td>${cell}</td>`).join('');
      html += '</tr>';
    });
    html += '</tbody></table>';
    
    return html;
  },
  
  // 将文本转换为URL编码
  encodeUrl: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return encodeURIComponent(str);
  },
  
  // 将URL编码转换为文本
  decodeUrl: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return decodeURIComponent(str);
  },
  
  // 将文本转换为Base64编码
  encodeBase64: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return btoa(unescape(encodeURIComponent(str)));
  },
  
  // 将Base64编码转换为文本
  decodeBase64: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return decodeURIComponent(escape(atob(str)));
  },
  
  // 将文本转换为HTML实体编码
  encodeHtmlEntities: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    const textarea = document.createElement('textarea');
    textarea.textContent = str;
    return textarea.innerHTML;
  },
  
  // 将HTML实体编码转换为文本
  decodeHtmlEntities: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.textContent;
  },
  
  // 将文本转换为Markdown
  toMarkdown: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    // 这只是一个简单的示例，实际转换需要更复杂的逻辑
    return str
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1">')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
      .replace(/^---$/gm, '<hr>');
  },
  
  // 将文本转换为驼峰命名
  toCamelCase: function(str) {
    return this.camelCase(str);
  },
  
  // 将文本转换为帕斯卡命名
  toPascalCase: function(str) {
    return this.pascalCase(str);
  },
  
  // 将文本转换为短横线命名
  toKebabCase: function(str) {
    return this.kebabCase(str);
  },
  
  // 将文本转换为下划线命名
  toSnakeCase: function(str) {
    return this.snakeCase(str);
  },
  
  // 将文本转换为常量命名
  toConstantCase: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return this.snakeCase(str).toUpperCase();
  },
  
  // 将文本转换为标题命名
  toTitleCase: function(str) {
    return this.titleCase(str);
  },
  
  // 将文本转换为句子命名
  toSentenceCase: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  
  // 将文本转换为小写
  toLowerCase: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.toLowerCase();
  },
  
  // 将文本转换为大写
  toUpperCase: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.toUpperCase();
  },
  
  // 将文本转换为首字母大写
  toCapitalize: function(str) {
    return this.capitalize(str);
  },
  
  // 将文本转换为反转
  toReverse: function(str) {
    return this.reverse(str);
  },
  
  // 将文本转换为截断
  toTruncate: function(str, length, suffix = '...') {
    return this.truncate(str, length, suffix);
  },
  
  // 将文本转换为填充
  toPad: function(str, length, char = ' ', position = 'right') {
    return this.pad(str, length, char, position);
  },
  
  // 将文本转换为重复
  toRepeat: function(str, count) {
    return this.repeat(str, count);
  },
  
  // 将文本转换为去除空格
  trim: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.trim();
  },
  
  // 将文本转换为去除左侧空格
  trimLeft: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.trimStart();
  },
  
  // 将文本转换为去除右侧空格
  trimRight: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.trimEnd();
  },
  
  // 将文本转换为去除所有空格
  trimAll: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/\s+/g, '');
  },
  
  // 将文本转换为去除重复空格
  normalizeSpaces: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/\s+/g, ' ').trim();
  },
  
  // 将文本转换为去除非字母数字字符
  removeNonAlphanumeric: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/[^a-zA-Z0-9]/g, '');
  },
  
  // 将文本转换为去除非数字字符
  removeNonNumeric: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/[^0-9]/g, '');
  },
  
  // 将文本转换为去除非字母字符
  removeNonAlpha: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/[^a-zA-Z]/g, '');
  },
  
  // 将文本转换为去除HTML标签
  removeHtml: function(str) {
    return this.stripHtml(str);
  },
  
  // 将文本转换为去除特殊字符
  removeSpecialChars: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/[^\w\s]/g, '');
  },
  
  // 将文本转换为去除重音符号
  removeAccents: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  },
  
  // 将文本转换为去除表情符号
  removeEmojis: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    // 简单的表情符号范围
    return str.replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, '');
  },
  
  // 将文本转换为去除控制字符
  removeControlChars: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  },
  
  // 将文本转换为去除换行符
  removeNewlines: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/[\r\n]+/g, ' ');
  },
  
  // 将文本转换为去除制表符
  removeTabs: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/\t+/g, ' ');
  },
  
  // 将文本转换为去除多余空格
  removeExtraSpaces: function(str) {
    return this.normalizeSpaces(str);
  },
  
  // 将文本转换为去除前导零
  removeLeadingZeros: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/^0+/, '');
  },
  
  // 将文本转换为去除尾随零
  removeTrailingZeros: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/0+$/, '');
  },
  
  // 将文本转换为去除前导和尾随零
  removePaddingZeros: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/^0+/, '').replace(/0+$/, '');
  },
  
  // 将文本转换为去除重复字符
  removeRepeatedChars: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/(.)\1+/g, '$1');
  },
  
  // 将文本转换为去除指定字符
  removeChars: function(str, chars) {
    if (!str || typeof str !== 'string') return str;
    if (!chars || typeof chars !== 'string') return str;
    
    const regex = new RegExp(`[${chars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`, 'g');
    return str.replace(regex, '');
  },
  
  // 将文本转换为去除指定前缀
  removePrefix: function(str, prefix) {
    if (!str || typeof str !== 'string') return str;
    if (!prefix || typeof prefix !== 'string') return str;
    
    if (str.startsWith(prefix)) {
      return str.slice(prefix.length);
    }
    
    return str;
  },
  
  // 将文本转换为去除指定后缀
  removeSuffix: function(str, suffix) {
    if (!str || typeof str !== 'string') return str;
    if (!suffix || typeof suffix !== 'string') return str;
    
    if (str.endsWith(suffix)) {
      return str.slice(0, -suffix.length);
    }
    
    return str;
  },
  
  // 将文本转换为去除首尾指定字符
  removeSurrounding: function(str, surrounding) {
    if (!str || typeof str !== 'string') return str;
    if (!surrounding || typeof surrounding !== 'string') return str;
    
    if (str.startsWith(surrounding) && str.endsWith(surrounding)) {
      return str.slice(surrounding.length, -surrounding.length);
    }
    
    return str;
  },
  
  // 将文本转换为去除首尾指定字符对
  removeSurroundingPair: function(str, start, end) {
    if (!str || typeof str !== 'string') return str;
    if (!start || typeof start !== 'string') return str;
    if (!end || typeof end !== 'string') return str;
    
    if (str.startsWith(start) && str.endsWith(end)) {
      return str.slice(start.length, -end.length);
    }
    
    return str;
  },
  
  // 将文本转换为去除注释
  removeComments: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    // 移除C风格注释
    return str
      .replace(/\/\*[\s\S]*?\*\//g, '') // 多行注释
      .replace(/\/\/.*$/gm, ''); // 单行注释
  },
  
  // 将文本转换为去除引号
  removeQuotes: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/["'`]/g, '');
  },
  
  // 将文本转换为去除括号及其内容
  removeBrackets: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str
      .replace(/\(.*?\)/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\{.*?\}/g, '');
  },
  
  // 将文本转换为去除URL
  removeUrls: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/https?:\/\/[^\s]+/g, '');
  },
  
  // 将文本转换为去除电子邮件地址
  removeEmails: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');
  },
  
  // 将文本转换为去除电话号码
  removePhoneNumbers: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/g, '');
  },
  
  // 将文本转换为去除IP地址
  removeIpAddresses: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '');
  },
  
  // 将文本转换为去除日期
  removeDates: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str
      .replace(/\d{4}[-/]\d{1,2}[-/]\d{1,2}/g, '') // YYYY-MM-DD
      .replace(/\d{1,2}[-/]\d{1,2}[-/]\d{4}/g, ''); // MM-DD-YYYY or DD-MM-YYYY
  },
  
  // 将文本转换为去除时间
  removeTimes: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/\d{1,2}:\d{2}(:\d{2})?(\s*[ap]m)?/gi, '');
  },
  
  // 将文本转换为去除货币符号
  removeCurrencySymbols: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/[$€£¥₹₽₩]/g, '');
  },
  
  // 将文本转换为去除数字
  removeNumbers: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/\d+/g, '');
  },
  
  // 将文本转换为去除标点符号
  removePunctuation: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  },
  
  // 将文本转换为去除停用词
  removeStopWords: function(str, stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'from', 'up', 'down', 'of', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']) {
    if (!str || typeof str !== 'string') return str;
    
    const words = str.toLowerCase().match(/\b\w+\b/g) || [];
    const filteredWords = words.filter(word => !stopWords.includes(word.toLowerCase()));
    
    return filteredWords.join(' ');
  },
  
  // 将文本转换为分词
  tokenize: function(str) {
    if (!str || typeof str !== 'string') return [];
    
    return str.match(/\b\w+\b/g) || [];
  },
  
  // 将文本转换为句子
  sentences: function(str) {
    if (!str || typeof str !== 'string') return [];
    
    return str.match(/[^.!?]+[.!?]+/g) || [];
  },
  
  // 将文本转换为段落
  paragraphs: function(str) {
    if (!str || typeof str !== 'string') return [];
    
    return str.split(/\n\n+/) || [];
  },
  
  // 将文本转换为行
  lines: function(str) {
    if (!str || typeof str !== 'string') return [];
    
    return str.split(/\r?\n/) || [];
  },
  
  // 将文本转换为字符
  chars: function(str) {
    if (!str || typeof str !== 'string') return [];
    
    return str.split('');
  },
  
  // 将文本转换为单词
  words: function(str) {
    if (!str || typeof str !== 'string') return [];
    
    return str.match(/\b\w+\b/g) || [];
  },
  
  // 将文本转换为单词计数
  wordCount: function(str) {
    if (!str || typeof str !== 'string') return 0;
    
    return (str.match(/\b\w+\b/g) || []).length;
  },
  
  // 将文本转换为字符计数
  charCount: function(str) {
    if (!str || typeof str !== 'string') return 0;
    
    return str.length;
  },
  
  // 将文本转换为句子计数
  sentenceCount: function(str) {
    if (!str || typeof str !== 'string') return 0;
    
    return (str.match(/[^.!?]+[.!?]+/g) || []).length;
  },
  
  // 将文本转换为段落计数
  paragraphCount: function(str) {
    if (!str || typeof str !== 'string') return 0;
    
    return (str.split(/\n\n+/) || []).length;
  },
  
  // 将文本转换为行计数
  lineCount: function(str) {
    if (!str || typeof str !== 'string') return 0;
    
    return (str.split(/\r?\n/) || []).length;
  },
  
  // 将文本转换为单词频率
  wordFrequency: function(str) {
    if (!str || typeof str !== 'string') return {};
    
    const words = str.toLowerCase().match(/\b\w+\b/g) || [];
    const frequency = {};
    
    for (const word of words) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
    
    return frequency;
  },
  
  // 将文本转换为字符频率
  charFrequency: function(str) {
    if (!str || typeof str !== 'string') return {};
    
    const frequency = {};
    
    for (const char of str) {
      frequency[char] = (frequency[char] || 0) + 1;
    }
    
    return frequency;
  },
  
  // 将文本转换为阅读时间（分钟）
  readingTime: function(str, wordsPerMinute = 200) {
    if (!str || typeof str !== 'string') return 0;
    
    const words = str.match(/\b\w+\b/g) || [];
    return Math.ceil(words.length / wordsPerMinute);
  },
  
  // 将文本转换为阅读级别（Flesch-Kincaid Grade Level）
  readingLevel: function(str) {
    if (!str || typeof str !== 'string') return 0;
    
    const sentences = str.match(/[^.!?]+[.!?]+/g) || [];
    const words = str.match(/\b\w+\b/g) || [];
    const syllables = this.countSyllables(str);
    
    if (sentences.length === 0 || words.length === 0) {
      return 0;
    }
    
    const averageWordsPerSentence = words.length / sentences.length;
    const averageSyllablesPerWord = syllables / words.length;
    
    return 0.39 * averageWordsPerSentence + 11.8 * averageSyllablesPerWord - 15.59;
  },
  
  // 计算音节数（英文）
  countSyllables: function(str) {
    if (!str || typeof str !== 'string') return 0;
    
    const words = str.toLowerCase().match(/\b\w+\b/g) || [];
    let count = 0;
    
    for (const word of words) {
      // 简单的音节计数规则
      count += Math.max(1, (word.match(/[aeiouy]{1,2}/g) || []).length);
    }
    
    return count;
  },
  
  // 将文本转换为摘要
  summarize: function(str, sentenceCount = 3) {
    if (!str || typeof str !== 'string') return str;
    
    const sentences = str.match(/[^.!?]+[.!?]+/g) || [];
    
    if (sentences.length <= sentenceCount) {
      return str;
    }
    
    // 简单摘要：取前几句
    return sentences.slice(0, sentenceCount).join(' ');
  },
  
  // 将文本转换为关键词
  keywords: function(str, count = 5) {
    if (!str || typeof str !== 'string') return [];
    
    // 简单的关键词提取：按频率排序
    const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'from', 'up', 'down', 'of', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'];
    const words = str.toLowerCase().match(/\b\w+
/**
 * 多宝工具库 - 字符串处理工具
 */

window.DuobaoString = {
  // 截取字符串
  truncate: function(str, length, suffix = '...') {
    if (!str || str.length <= length) {
      return str;
    }
    
    return str.substring(0, length) + suffix;
  },
  
  // 首字母大写
  capitalize: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  // 全部单词首字母大写
  titleCase: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/\b\w+/g, word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  },
  
  // 驼峰命名转换
  camelCase: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^[A-Z]/, c => c.toLowerCase());
  },
  
  // 帕斯卡命名转换
  pascalCase: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    const camel = this.camelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  },
  
  // 短横线命名转换
  kebabCase: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },
  
  // 下划线命名转换
  snakeCase: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
  },
  
  // 反转字符串
  reverse: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.split('').reverse().join('');
  },
  
  // 去除HTML标签
  stripHtml: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    return str.replace(/<[^>]*>/g, '');
  },
  
  // 转义HTML特殊字符
  escapeHtml: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    
    return str.replace(/[&<>"'`=\/]/g, s => entityMap[s]);
  },
  
  // 反转义HTML特殊字符
  unescapeHtml: function(str) {
    if (!str || typeof str !== 'string') return str;
    
    const entityMap = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x2F;': '/',
      '&#x60;': '`',
      '&#x3D;': '='
    };
    
    return str.replace(/&(amp|lt|gt|quot|#39|#x2F|#x60|#x3D);/g, s => entityMap[s]);
  },
  
  // 生成随机字符串
  random: function(length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let result = '';
    const charsLength = chars.length;
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charsLength));
    }
    
    return result;
  },
  
  // 生成UUID
  uuid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  
  // 计算字符串长度（支持中文）
  length: function(str) {
    if (!str || typeof str !== 'string') return 0;
    
    // 将中文字符计为2个长度
    return str.replace(/[\u4e00-\u9fa5]/g, '**').length;
  },
  
  // 计算字符串字节长度
  byteLength: function(str) {
    if (!str || typeof str !== 'string') return 0;
    
    let length = 0;
    
    for (let i = 0; i < str.length; i++) {
      // 中文字符通常占用3个字节
      if (str.charCodeAt(i) > 127) {
        length += 3;
      } else {
        length += 1;
      }
    }
    
    return length;
  },
  
  // 填充字符串
  pad: function(str, length, char = ' ', position = 'right') {
    if (!str || typeof str !== 'string') return str;
    
    const padLength = Math.max(0, length - str.length);
    const padding = char.repeat(padLength);
    
    if (position === 'left') {
      return padding + str;
    } else if (position === 'both') {
      const leftPad = char.repeat(Math.floor(padLength / 2));
      const rightPad = char.repeat(Math.ceil(padLength / 2));
      return leftPad + str + rightPad;
    } else {
      return str + padding;
    }
  },
  
  // 左填充
  padLeft: function(str, length, char = ' ') {
    return this.pad(str, length, char, 'left');
  },
  
  // 右填充
  padRight: function(str, length, char = ' ') {
    return this.pad(str, length, char, 'right');
  },
  
  // 居中填充
  padCenter: function(str, length, char = ' ') {
    return this.pad(str, length, char, 'both');
  },
  
  // 重复字符串
  repeat: function(str, count) {
    if (!str || typeof str !== 'string' || count < 0) return '';
    
    return str.repeat(count);
  },
  
  // 检查字符串是否为空或只包含空白字符
  isEmpty: function(str) {
    return !str || /^\s*$/.test(str);
  },
  
  // 检查字符串是否包含指定子串
  contains: function(str, substring, ignoreCase = false) {
    if (!str || typeof str !== 'string') return false;
    
    if (ignoreCase) {
      return str.toLowerCase().includes(substring.toLowerCase());
    }
    
    return str.includes(substring);
  },
  
  // 计算两个字符串的相似度（Levenshtein距离）
  similarity: function(str1, str2) {
    if (!str1 || !str2) return 0;
    
    const len1 = str1.length;
    const len2 = str2.length;
    
    // 创建距离矩阵
    const matrix = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));
    
    // 初始化第一行和第一列
    for (let i = 0; i <= len1; i++) {
      matrix[i][0] = i;
    }
    
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }
    
    // 填充矩阵
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // 删除
          matrix[i][j - 1] + 1, // 插入
          matrix[i - 1][j - 1] + cost // 替换
        );
      }
    }
    
    // 计算相似度
    const maxLen = Math.max(len1, len2);
    if (maxLen === 0) return 1; // 两个空字符串视为完全相同
    
    return 1 - matrix[len1][len2] / maxLen;
  },
  
  // 格式化字符串（类似于C#的string.Format）
  format: function(template, ...args) {
    if (!template || typeof template !== 'string') return template;
    
    if (args.length === 1 && typeof args[0] === 'object') {
      // 命名参数格式化：format("Hello, {name}!", { name: "World" })
      const params = args[0];
      return template.replace(/{([^{}]*)}/g, (match, key) => {
        const value = key.split('.').reduce((obj, prop) => obj && obj[prop], params);
        return value !== undefined ? value : match;
      });
    } else {
      // 索引参数格式化：format("Hello, {0}!", "World")
      return template.replace(/{(\d+)}/g, (match, index) => {
        return args[index] !== undefined ? args[index] : match;
      });
    }
  },
  
  // 将字符串转换为URL友好的slug
  slugify: function(str) {
    if (!str || typeof str !== 'string') return '';
    
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // 移除非单词字符
      .replace(/[\s_-]+/g, '-') // 将空格、下划线和连字符替换为单个连字符
      .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
  },
  
  // 将字符串转换为数字
  toNumber: function(str, defaultValue = 0) {
    if (!str || typeof str !== 'string') return defaultValue;
    
    const num = parseFloat(str);
    return isNaN(num) ? defaultValue : num;
  },
  
  // 将字符串转换为布尔值
  toBoolean: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const lowered = str.toLowerCase().trim();
    return lowered === 'true' || lowered === 'yes' || lowered === '1' || lowered === 'on';
  },
  
  // 将字符串转换为数组
  toArray: function(str, delimiter = ',') {
    if (!str || typeof str !== 'string') return [];
    
    return str.split(delimiter).map(item => item.trim());
  },
  
  // 将字符串转换为对象
  toObject: function(str, itemDelimiter = ',', keyValueDelimiter = ':') {
    if (!str || typeof str !== 'string') return {};
    
    const result = {};
    const items = str.split(itemDelimiter);
    
    for (const item of items) {
      const [key, value] = item.split(keyValueDelimiter).map(part => part.trim());
      if (key) {
        result[key] = value || '';
      }
    }
    
    return result;
  },
  
  // 将字符串转换为JSON对象
  toJson: function(str, defaultValue = {}) {
    if (!str || typeof str !== 'string') return defaultValue;
    
    try {
      return JSON.parse(str);
    } catch (e) {
      return defaultValue;
    }
  },
  
  // 将字符串转换为日期对象
  toDate: function(str, defaultValue = null) {
    if (!str || typeof str !== 'string') return defaultValue;
    
    const date = new Date(str);
    return isNaN(date.getTime()) ? defaultValue : date;
  },
  
  // 检查字符串是否为有效的电子邮件地址
  isEmail: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(str);
  },
  
  // 检查字符串是否为有效的URL
  isUrl: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  // 检查字符串是否为有效的IP地址
  isIp: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    // IPv4
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipv4Match = str.match(ipv4Regex);
    
    if (ipv4Match) {
      return ipv4Match.slice(1).every(part => parseInt(part, 10) <= 255);
    }
    
    // IPv6 (简化检查)
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv6Regex.test(str);
  },
  
  // 检查字符串是否为有效的手机号码（中国）
  isMobilePhone: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(str);
  },
  
  // 检查字符串是否为有效的身份证号码（中国）
  isIdCard: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    // 18位身份证号码
    const idCardRegex = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
    
    if (!idCardRegex.test(str)) {
      return false;
    }
    
    // 验证校验位
    if (str.length === 18) {
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      const parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
      let sum = 0;
      
      for (let i = 0; i < 17; i++) {
        sum += parseInt(str[i], 10) * factor[i];
      }
      
      const check = parity[sum % 11];
      return check.toUpperCase() === str[17].toUpperCase();
    }
    
    return true;
  },
  
  // 检查字符串是否为有效的邮政编码（中国）
  isPostalCode: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const postalCodeRegex = /^[1-9]\d{5}$/;
    return postalCodeRegex.test(str);
  },
  
  // 检查字符串是否为有效的信用卡号
  isCreditCard: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    // 移除空格和连字符
    const sanitized = str.replace(/[\s-]/g, '');
    
    // 检查是否只包含数字
    if (!/^\d+$/.test(sanitized)) {
      return false;
    }
    
    // 检查长度
    if (sanitized.length < 13 || sanitized.length > 19) {
      return false;
    }
    
    // Luhn算法验证
    let sum = 0;
    let double = false;
    
    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized[i], 10);
      
      if (double) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      double = !double;
    }
    
    return sum % 10 === 0;
  },
  
  // 检查字符串是否为有效的日期格式
  isDate: function(str, format = 'YYYY-MM-DD') {
    if (!str || typeof str !== 'string') return false;
    
    // 简单格式验证
    let regex;
    
    switch (format.toUpperCase()) {
      case 'YYYY-MM-DD':
        regex = /^\d{4}-\d{2}-\d{2}$/;
        break;
      case 'MM/DD/YYYY':
        regex = /^\d{2}\/\d{2}\/\d{4}$/;
        break;
      case 'DD/MM/YYYY':
        regex = /^\d{2}\/\d{2}\/\d{4}$/;
        break;
      case 'YYYY/MM/DD':
        regex = /^\d{4}\/\d{2}\/\d{2}$/;
        break;
      default:
        return false;
    }
    
    if (!regex.test(str)) {
      return false;
    }
    
    // 解析日期并验证
    let year, month, day;
    
    if (format.toUpperCase() === 'YYYY-MM-DD') {
      [year, month, day] = str.split('-').map(Number);
    } else if (format.toUpperCase() === 'YYYY/MM/DD') {
      [year, month, day] = str.split('/').map(Number);
    } else if (format.toUpperCase() === 'MM/DD/YYYY') {
      const parts = str.split('/').map(Number);
      month = parts[0];
      day = parts[1];
      year = parts[2];
    } else if (format.toUpperCase() === 'DD/MM/YYYY') {
      const parts = str.split('/').map(Number);
      day = parts[0];
      month = parts[1];
      year = parts[2];
    }
    
    // 验证月份和日期
    if (month < 1 || month > 12) {
      return false;
    }
    
    const daysInMonth = new Date(year, month, 0).getDate();
    return day >= 1 && day <= daysInMonth;
  },
  
  // 检查字符串是否为有效的时间格式
  isTime: function(str, format = 'HH:mm:ss') {
    if (!str || typeof str !== 'string') return false;
    
    // 简单格式验证
    let regex;
    
    switch (format.toUpperCase()) {
      case 'HH:MM:SS':
      case 'HH:MM':
        regex = new RegExp(`^\\d{2}:\\d{2}${format.length > 5 ? ':\\d{2}' : ''}$`);
        break;
      case 'H:MM:SS':
      case 'H:MM':
        regex = new RegExp(`^\\d{1,2}:\\d{2}${format.length > 4 ? ':\\d{2}' : ''}$`);
        break;
      default:
        return false;
    }
    
    if (!regex.test(str)) {
      return false;
    }
    
    // 解析时间并验证
    const parts = str.split(':').map(Number);
    const hours = parts[0];
    const minutes = parts[1];
    const seconds = parts.length > 2 ? parts[2] : 0;
    
    return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60 && seconds >= 0 && seconds < 60;
  },
  
  // 检查字符串是否为有效的十六进制颜色
  isHexColor: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(str);
  },
  
  // 检查字符串是否为有效的RGB颜色
  isRgbColor: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const regex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
    const match = str.match(regex);
    
    if (!match) {
      return false;
    }
    
    return match.slice(1).every(value => parseInt(value, 10) <= 255);
  },
  
  // 检查字符串是否为有效的RGBA颜色
  isRgbaColor: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const regex = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]|0?\.\d+)\s*\)$/;
    const match = str.match(regex);
    
    if (!match) {
      return false;
    }
    
    return match.slice(1, 4).every(value => parseInt(value, 10) <= 255) && parseFloat(match[4]) <= 1;
  },
  
  // 检查字符串是否为有效的HSL颜色
  isHslColor: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const regex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;
    const match = str.match(regex);
    
    if (!match) {
      return false;
    }
    
    const [_, h, s, l] = match.map(Number);
    return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100;
  },
  
  // 检查字符串是否为有效的HSLA颜色
  isHslaColor: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const regex = /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*([01]|0?\.\d+)\s*\)$/;
    const match = str.match(regex);
    
    if (!match) {
      return false;
    }
    
    const [_, h, s, l, a] = match.map(Number);
    return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100 && a >= 0 && a <= 1;
  },
  
  // 检查字符串是否为有效的JSON
  isJson: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  // 检查字符串是否为有效的XML
  isXml: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(str, 'application/xml');
      const errorNode = doc.querySelector('parsererror');
      return !errorNode;
    } catch (e) {
      return false;
    }
  },
  
  // 检查字符串是否为有效的Base64
  isBase64: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    
    // 检查字符是否有效
    if (!base64Regex.test(str)) {
      return false;
    }
    
    // 检查长度是否为4的倍数（可能有填充）
    const paddingLength = str.endsWith('==') ? 2 : (str.endsWith('=') ? 1 : 0);
    return (str.length - paddingLength) % 4 === 0;
  },
  
  // 检查字符串是否为有效的数字
  isNumeric: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[+-]?\d+(\.\d+)?$/.test(str);
  },
  
  // 检查字符串是否为有效的整数
  isInteger: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[+-]?\d+$/.test(str);
  },
  
  // 检查字符串是否为有效的浮点数
  isFloat: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[+-]?\d+\.\d+$/.test(str);
  },
  
  // 检查字符串是否为有效的十六进制数
  isHex: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[0-9a-fA-F]+$/.test(str);
  },
  
  // 检查字符串是否为有效的二进制数
  isBinary: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[01]+$/.test(str);
  },
  
  // 检查字符串是否为有效的八进制数
  isOctal: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[0-7]+$/.test(str);
  },
  
  // 检查字符串是否只包含字母
  isAlpha: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[a-zA-Z]+$/.test(str);
  },
  
  // 检查字符串是否只包含字母和数字
  isAlphanumeric: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[a-zA-Z0-9]+$/.test(str);
  },
  
  // 检查字符串是否只包含ASCII字符
  isAscii: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[\x00-\x7F]+$/.test(str);
  },
  
  // 检查字符串是否为有效的文件名
  isFileName: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^[^<>:"/\\|?*\x00-\x1F]+$/.test(str) && str.length <= 255;
  },
  
  // 检查字符串是否为有效的路径
  isPath: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    // 简单检查，不同操作系统有不同的路径规则
    return /^[^<>:"|?*\x00-\x1F]*$/.test(str);
  },
  
  // 检查字符串是否为有效的域名
  isDomain: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    return domainRegex.test(str);
  },
  
  // 检查字符串是否为有效的MAC地址
  isMacAddress: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(str);
  },
  
  // 检查字符串是否为有效的ISBN
  isIsbn: function(str) {
    if (!str || typeof str !== 'string') return false;
    
    // 移除所有连字符和空格
    const sanitized = str.replace(/[\s-]/g, '');
    
    // ISBN-10
    if (sanitized.length === 10) {
      if (!/^\d{9}[\dX]$/i.test(sanitized)) {
        return false;
      }
      
      // 验证校验位
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(sanitized[i], 10) * (10 - i);
      }
      
      const checkDigit = sanitized[9].toUpperCase() === 'X' ? 10 : parseInt(sanitized[9], 10);
      return (sum + checkDigit) % 11 === 0;
    }
    
    // ISBN-13
    if (sanitized.length === 13) {
      if (!/^\d{13}$/.test(sanitized)) {
        return false;
      }
      
      // 验证校验位
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += parseInt(sanitized[i], 10) * (i % 2 === 0 ? 1 : 3);
      }
      
      const checkDigit = (10 - (sum % 10)) % 10;
      return parseInt(sanitized[12], 10) === checkDigit;
    }
    
    return false;
