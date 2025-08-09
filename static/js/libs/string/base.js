/**
 * 多宝工具库 - 字符串基础操作工具
 */

window.DuobaoString = window.DuobaoString || {};

window.DuobaoString.Base = {
  // 检查是否为空字符串
  isEmpty: function(str) {
    return typeof str === 'string' && str.trim() === '';
  },
  
  // 检查是否为非空字符串
  isNotEmpty: function(str) {
    return typeof str === 'string' && str.trim() !== '';
  },
  
  // 反转字符串
  reverse: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.split('').reverse().join('');
  },
  
  // 首字母大写
  capitalize: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    if (str.length === 0) return str;
    
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  // 首字母小写
  uncapitalize: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    if (str.length === 0) return str;
    
    return str.charAt(0).toLowerCase() + str.slice(1);
  },
  
  // 驼峰命名转换
  camelCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^(.)/, c => c.toLowerCase());
  },
  
  // 帕斯卡命名转换
  pascalCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const camel = this.camelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  },
  
  // 短横线命名转换
  kebabCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },
  
  // 下划线命名转换
  snakeCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
  },
  
  // 常量命名转换
  constantCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return this.snakeCase(str).toUpperCase();
  },
  
  // 标题命名转换
  titleCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str
      .toLowerCase()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },
  
  // 句子命名转换
  sentenceCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str
      .toLowerCase()
      .replace(/^\s*\w|[.!?]\s*\w/g, c => c.toUpperCase());
  },
  
  // 路径命名转换
  pathCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str
      .replace(/([a-z])([A-Z])/g, '$1/$2')
      .replace(/[\s_-]+/g, '/')
      .toLowerCase();
  },
  
  // 截断字符串
  truncate: function(str, length, suffix = '...') {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    if (str.length <= length) return str;
    
    return str.slice(0, length) + suffix;
  },
  
  // 填充字符串（左侧）
  padStart: function(str, length, char = ' ') {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.padStart(length, char);
  },
  
  // 填充字符串（右侧）
  padEnd: function(str, length, char = ' ') {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.padEnd(length, char);
  },
  
  // 重复字符串
  repeat: function(str, count) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.repeat(count);
  },
  
  // 替换所有匹配项
  replaceAll: function(str, search, replacement) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.split(search).join(replacement);
  },
  
  // 删除所有空白字符
  removeWhitespace: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.replace(/\s+/g, '');
  },
  
  // 删除多余空白字符
  normalizeWhitespace: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.replace(/\s+/g, ' ').trim();
  },
  
  // 删除非字母数字字符
  removeNonAlphanumeric: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.replace(/[^a-zA-Z0-9]/g, '');
  },
  
  // 删除非数字字符
  removeNonNumeric: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.replace(/[^0-9]/g, '');
  },
  
  // 删除非字母字符
  removeNonAlpha: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.replace(/[^a-zA-Z]/g, '');
  },
  
  // 删除HTML标签
  stripTags: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.replace(/<\/?[^>]+(>|$)/g, '');
  },
  
  // 删除特定字符
  removeChars: function(str, chars) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const regex = new RegExp(`[${chars}]`, 'g');
    return str.replace(regex, '');
  },
  
  // 计算字符串长度（考虑Unicode）
  length: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return [...str].length;
  },
  
  // 计算字符串字节长度
  byteLength: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return new Blob([str]).size;
  },
  
  // 计算字符串单词数
  wordCount: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.trim().split(/\s+/).length;
  },
  
  // 获取字符串中的单词
  words: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.trim().split(/\s+/);
  },
  
  // 获取字符串中的字符
  chars: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return [...str];
  },
  
  // 获取字符串中的行
  lines: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.split(/\r?\n/);
  },
  
  // 获取字符串中的句子
  sentences: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.split(/[.!?]+/).filter(Boolean).map(s => s.trim());
  },
  
  // 获取字符串中的段落
  paragraphs: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.split(/\n\s*\n/).filter(Boolean).map(p => p.trim());
  },
  
  // 检查字符串是否以指定字符串开头
  startsWith: function(str, prefix, position = 0) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.startsWith(prefix, position);
  },
  
  // 检查字符串是否以指定字符串结尾
  endsWith: function(str, suffix, position = str.length) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.endsWith(suffix, position);
  },
  
  // 检查字符串是否包含指定字符串
  includes: function(str, search, position = 0) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.includes(search, position);
  },
  
  // 获取字符串中指定字符串的索引
  indexOf: function(str, search, position = 0) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.indexOf(search, position);
  },
  
  // 获取字符串中指定字符串的最后索引
  lastIndexOf: function(str, search, position = str.length) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.lastIndexOf(search, position);
  },
  
  // 获取字符串中指定字符串的所有索引
  indexesOf: function(str, search) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const indexes = [];
    let index = str.indexOf(search);
    
    while (index !== -1) {
      indexes.push(index);
      index = str.indexOf(search, index + 1);
    }
    
    return indexes;
  },
  
  // 计算字符串中指定字符串的出现次数
  count: function(str, search) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return (str.match(new RegExp(search, 'g')) || []).length;
  },
  
  // 检查字符串是否相等（区分大小写）
  equals: function(str1, str2) {
    return str1 === str2;
  },
  
  // 检查字符串是否相等（不区分大小写）
  equalsIgnoreCase: function(str1, str2) {
    if (typeof str1 !== 'string' || typeof str2 !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str1.toLowerCase() === str2.toLowerCase();
  },
  
  // 比较字符串
  compare: function(str1, str2) {
    if (typeof str1 !== 'string' || typeof str2 !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str1.localeCompare(str2);
  },
  
  // 比较字符串（不区分大小写）
  compareIgnoreCase: function(str1, str2) {
    if (typeof str1 !== 'string' || typeof str2 !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str1.toLowerCase().localeCompare(str2.toLowerCase());
  },
  
  // 获取字符串的子字符串
  substring: function(str, start, end) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.substring(start, end);
  },
  
  // 获取字符串的切片
  slice: function(str, start, end) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.slice(start, end);
  },
  
  // 分割字符串
  split: function(str, separator, limit) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.split(separator, limit);
  },
  
  // 连接字符串
  join: function(arr, separator = '') {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.join(separator);
  },
  
  // 替换字符串中的第一个匹配项
  replace: function(str, search, replacement) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.replace(search, replacement);
  },
  
  // 替换字符串中的所有匹配项（使用正则表达式）
  replaceRegex: function(str, regex, replacement) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.replace(new RegExp(regex, 'g'), replacement);
  },
  
  // 替换字符串中的所有匹配项（使用回调函数）
  replaceCallback: function(str, search, callback) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    if (typeof callback !== 'function') {
      throw new Error('回调必须是函数');
    }
    
    return str.replace(new RegExp(search, 'g'), callback);
  },
  
  // 转换为大写
  toUpperCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.toUpperCase();
  },
  
  // 转换为小写
  toLowerCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.toLowerCase();
  },
  
  // 转换为本地大写
  toLocaleUpperCase: function(str, locale) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.toLocaleUpperCase(locale);
  },
  
  // 转换为本地小写
  toLocaleLowerCase: function(str, locale) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.toLocaleLowerCase(locale);
  },
  
  // 修剪字符串（去除首尾空白）
  trim: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.trim();
  },
  
  // 修剪字符串左侧（去除首部空白）
  trimStart: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.trimStart();
  },
  
  // 修剪字符串右侧（去除尾部空白）
  trimEnd: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.trimEnd();
  },
  
  // 修剪字符串（去除首尾指定字符）
  trimChars: function(str, chars) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const regex = new RegExp(`^[${chars}]+|[${chars}]+$`, 'g');
    return str.replace(regex, '');
  },
  
  // 修剪字符串左侧（去除首部指定字符）
  trimStartChars: function(str, chars) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const regex = new RegExp(`^[${chars}]+`, 'g');
    return str.replace(regex, '');
  },
  
  // 修剪字符串右侧（去除尾部指定字符）
  trimEndChars: function(str, chars) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const regex = new RegExp(`[${chars}]+$`, 'g');
    return str.replace(regex, '');
  },
  
  // 获取字符串的字符代码
  charCodeAt: function(str, index = 0) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.charCodeAt(index);
  },
  
  // 获取字符串的代码点
  codePointAt: function(str, index = 0) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.codePointAt(index);
  },
  
  // 从字符代码创建字符串
  fromCharCode: function(...codes) {
    return String.fromCharCode(...codes);
  },
  
  // 从代码点创建字符串
  fromCodePoint: function(...codePoints) {
    return String.fromCodePoint(...codePoints);
  },
  
  // 检查字符串是否为空或仅包含空白
  isBlank: function(str) {
    return typeof str !== 'string' || str.trim() === '';
  },
  
  // 检查字符串是否不为空且不仅包含空白
  isNotBlank: function(str) {
    return typeof str === 'string' && str.trim() !== '';
  },
  
  // 检查字符串是否为null或undefined
  isNullOrUndefined: function(str) {
    return str === null || str === undefined;
  },
  
  // 检查字符串是否不为null且不为undefined
  isNotNullOrUndefined: function(str) {
    return str !== null && str !== undefined;
  },
  
  // 检查字符串是否为null、undefined或空
  isNullOrEmpty: function(str) {
    return str === null || str === undefined || str === '';
  },
  
  // 检查字符串是否不为null、不为undefined且不为空
  isNotNullOrEmpty: function(str) {
    return str !== null && str !== undefined && str !== '';
  },
  
  // 检查字符串是否为null、undefined、空或仅包含空白
  isNullOrBlank: function(str) {
    return str === null || str === undefined || (typeof str === 'string' && str.trim() === '');
  },
  
  // 检查字符串是否不为null、不为undefined、不为空且不仅包含空白
  isNotNullOrBlank: function(str) {
    return str !== null && str !== undefined && typeof str === 'string' && str.trim() !== '';
  },
  
  // 获取默认值（如果字符串为null、undefined或空）
  defaultIfEmpty: function(str, defaultValue = '') {
    return this.isNullOrEmpty(str) ? defaultValue : str;
  },
  
  // 获取默认值（如果字符串为null、undefined、空或仅包含空白）
  defaultIfBlank: function(str, defaultValue = '') {
    return this.isNullOrBlank(str) ? defaultValue : str;
  },
  
  // 获取字符串的第一个字符
  firstChar: function(str) {
    if (typeof str !== 'string' || str.length === 0) {
      return '';
    }
    
    return str.charAt(0);
  },
  
  // 获取字符串的最后一个字符
  lastChar: function(str) {
    if (typeof str !== 'string' || str.length === 0) {
      return '';
    }
    
    return str.charAt(str.length - 1);
  },
  
  // 获取字符串的第n个字符
  charAt: function(str, index) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.charAt(index);
  },
  
  // 检查字符串是否仅包含字母
  isAlpha: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[a-zA-Z]+$/.test(str);
  },
  
  // 检查字符串是否仅包含字母和数字
  isAlphanumeric: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[a-zA-Z0-9]+$/.test(str);
  },
  
  // 检查字符串是否仅包含数字
  isNumeric: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-9]+$/.test(str);
  },
  
  // 检查字符串是否仅包含空白
  isWhitespace: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^\s+$/.test(str);
  },
  
  // 检查字符串是否为有效的JSON
  isJson: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  // 检查字符串是否为有效的URL
  isUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  // 检查字符串是否为有效的电子邮件地址
  isEmail: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  },
  
  // 检查字符串是否为有效的IP地址
  isIp: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(str);
  },
  
  // 检查字符串是否为有效的MAC地址
  isMac: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(str);
  },
  
  // 检查字符串是否为有效的UUID
  isUuid: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
  },
  
  // 检查字符串是否为有效的十六进制颜色
  isHexColor: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(str);
  },
  
  // 检查字符串是否为有效的十六进制数
  isHex: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-9A-Fa-f]+$/.test(str);
  },
  
  // 检查字符串是否为有效的二进制数
  isBinary: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[01]+$/.test(str);
  },
  
  // 检查字符串是否为有效的八进制数
  isOctal: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-7]+$/.test(str);
  },
  
  // 检查字符串是否为有效的十进制数
  isDecimal: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^-?\d+(\.\d+)?$/.test(str);
  },
  
  // 检查字符串是否为有效的整数
  isInteger: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^-?\d+$/.test(str);
  },
  
  // 检查字符串是否为有效的浮点数
  isFloat: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^-?\d+\.\d+$/.test(str);
  },
  
  // 检查字符串是否为有效的正数
  isPositive: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^\d+(\.\d+)?$/.test(str) && parseFloat(str) > 0;
  },
  
  // 检查字符串是否为有效的负数
  isNegative: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^-\d+(\.\d+)?$/.test(str) && parseFloat(str) < 0;
  },
  
  // 检查字符串是否为有效的非负数
  isNonNegative: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^\d+(\.\d+)?$/.test(str) && parseFloat(str) >= 0;
  },
  
  // 检查字符串是否为有效的非正数
  isNonPositive: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^-\d+(\.\d+)?$/.test(str) && parseFloat(str) <= 0;
  },
  
  // 检查字符串是否为有效的日期
  isDate: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    const date = new Date(str);
    return !isNaN(date.getTime());
  },
  
  // 检查字符串是否为有效的时间
  isTime: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.test(str);
  },
  
  // 检查字符串是否为有效的信用卡号
  isCreditCard: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    // 移除空格和连字符
    const sanitized = str.replace(/[\s-]/g, '');
    
    // 检查长度和是否只包含数字
    if (!/^\d{13,19}$/.test(sanitized)) {
      return false;
    }
    
    // Luhn算法验证
    let sum = 0;
    let double = false;
    
    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized.charAt(i), 10);
      
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
  
  // 检查字符串是否为有效的手机号码（简单验证）
  isPhone: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/.test(str);
  },
  
  // 检查字符串是否为有效的邮政编码（简单验证）
  isPostalCode: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-9]{5}(?:-[0-9]{4})?$/.test(str);
  },
  
  // 检查字符串是否为有效的ISBN（简单验证）
  isIsbn: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    const sanitized = str.replace(/[\s-]/g, '');
    
    return /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/.test(sanitized);
  },
  
  // 生成随机字符串
  random: function(length = 10, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
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
  
  // 字符串转换为整数
  toInt: function(str, radix = 10) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return parseInt(str, radix);
  },
  
  // 字符串转换为浮点数
  toFloat: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return parseFloat(str);
  },
  
  // 字符串转换为布尔值
  toBoolean: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const lowerStr = str.toLowerCase();
    return lowerStr === 'true' || lowerStr === '1' || lowerStr === 'yes' || lowerStr === 'y';
  },
  
  // 字符串转换为数组
  toArray: function(str, separator = '') {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return separator ? str.split(separator) : [...str];
  },
  
  // 字符串转换为对象
  toObject: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    try {
      return JSON.parse(str);
    } catch (e) {
      throw new Error('无效的JSON字符串');
    }
  },
  
  // 字符串转换为日期
  toDate: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const date = new Date(str);
    
    if (isNaN(date.getTime())) {
      throw new Error('无效的日期字符串');
    }
    
    return date;
  },
  
  // 字符串转换为正则表达式
  toRegExp: function(str, flags = '') {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return new RegExp(str, flags);
  },
  
  // 字符串转换为Base64
  toBase64: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode('0x' + p1);
    }));
  },
  
  // Base64转换为字符串
  fromBase64: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    try {
      return decodeURIComponent(Array.prototype.map.call(atob(str), c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (e) {
      throw new Error('无效的Base64字符串');
    }
  },
  
  // 字符串转换为URL编码
  encodeUrl: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return encodeURIComponent(str);
  },
  
  // URL编码转换为字符串
  decodeUrl: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    try {
      return decodeURIComponent(str);
    } catch (e) {
      throw new Error('无效的URL编码字符串');
    }
  },
  
  // 字符串转换为HTML实体
  escapeHtml: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },
  
  // HTML实体转换为字符串
  unescapeHtml: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  },
  
  // 字符串转换为驼峰命名
  toCamelCase: function(str) {
    return this.camelCase(str);
  },
  
  // 字符串转换为帕斯卡命名
  toPascalCase: function(str) {
    return this.pascalCase(str);
  },
  
  // 字符串转换为短横线命名
  toKebabCase: function(str) {
    return this.kebabCase(str);
  },
  
  // 字符串转换为下划线命名
  toSnakeCase: function(str) {
    return this.snakeCase(str);
  },
  
  // 字符串转换为常量命名
  toConstantCase: function(str) {
    return this.constantCase(str);
  },
  
  // 字符串转换为标题命名
  toTitleCase: function(str) {
    return this.titleCase(str);
  },
  
  // 字符串转换为句子命名
  toSentenceCase: function(str) {
    return this.sentenceCase(str);
  },
  
  // 字符串转换为路径命名
  toPathCase: function(str) {
    return this.pathCase(str);
  }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.DuobaoString.Base;
}
