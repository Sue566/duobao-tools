/**
 * 多宝工具库 - 字符串转换工具
 */

window.DuobaoString = window.DuobaoString || {};

window.DuobaoString.Convert = {
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
  toUrlEncoded: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return encodeURIComponent(str);
  },
  
  // URL编码转换为字符串
  fromUrlEncoded: function(str) {
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
  toHtmlEntities: function(str) {
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
  fromHtmlEntities: function(str) {
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
  
  // 字符串转换为十六进制
  toHex: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += str.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return result;
  },
  
  // 十六进制转换为字符串
  fromHex: function(hex) {
    if (typeof hex !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    if (hex.length % 2 !== 0) {
      throw new Error('无效的十六进制字符串');
    }
    
    let result = '';
    for (let i = 0; i < hex.length; i += 2) {
      result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return result;
  },
  
  // 字符串转换为二进制
  toBinary: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += str.charCodeAt(i).toString(2).padStart(8, '0');
    }
    return result;
  },
  
  // 二进制转换为字符串
  fromBinary: function(binary) {
    if (typeof binary !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    if (binary.length % 8 !== 0) {
      throw new Error('无效的二进制字符串');
    }
    
    let result = '';
    for (let i = 0; i < binary.length; i += 8) {
      result += String.fromCharCode(parseInt(binary.substr(i, 8), 2));
    }
    return result;
  },
  
  // 字符串转换为八进制
  toOctal: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += str.charCodeAt(i).toString(8).padStart(3, '0');
    }
    return result;
  },
  
  // 八进制转换为字符串
  fromOctal: function(octal) {
    if (typeof octal !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    if (octal.length % 3 !== 0) {
      throw new Error('无效的八进制字符串');
    }
    
    let result = '';
    for (let i = 0; i < octal.length; i += 3) {
      result += String.fromCharCode(parseInt(octal.substr(i, 3), 8));
    }
    return result;
  },
  
  // 字符串转换为Unicode编码
  toUnicode: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    let result = '';
    for (let i = 0; i < str.length; i++) {
      const hex = str.charCodeAt(i).toString(16).toUpperCase();
      result += '\\u' + '0000'.substring(0, 4 - hex.length) + hex;
    }
    return result;
  },
  
  // Unicode编码转换为字符串
  fromUnicode: function(unicode) {
    if (typeof unicode !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return unicode.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });
  },
  
  // 字符串转换为ASCII码
  toAscii: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    let result = '';
    for (let i = 0; i < str.length; i++) {
      result += str.charCodeAt(i) + ' ';
    }
    return result.trim();
  },
  
  // ASCII码转换为字符串
  fromAscii: function(ascii) {
    if (typeof ascii !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const codes = ascii.split(/\s+/);
    let result = '';
    
    for (const code of codes) {
      const num = parseInt(code, 10);
      if (isNaN(num)) {
        throw new Error('无效的ASCII码');
      }
      result += String.fromCharCode(num);
    }
    
    return result;
  },
  
  // 字符串转换为Morse码
  toMorse: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const morseMap = {
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
      'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
      'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
      '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
      '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...',
      ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
    };
    
    return str.toUpperCase().split('').map(char => {
      if (char === ' ') {
        return '/';
      }
      return morseMap[char] || '';
    }).filter(Boolean).join(' ');
  },
  
  // Morse码转换为字符串
  fromMorse: function(morse) {
    if (typeof morse !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const morseMap = {
      '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
      '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
      '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z',
      '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9',
      '.-.-.-': '.', '--..--': ',', '..--..': '?', '.----.': "'", '-.-.--': '!', '-..-.': '/', '-.--.': '(', '-.--.-': ')', '.-...': '&',
      '---...': ':', '-.-.-.': ';', '-...-': '=', '.-.-.': '+', '-....-': '-', '..--.-': '_', '.-..-.': '"', '...-..-': '$', '.--.-.': '@'
    };
    
    return morse.split(' ').map(code => {
      if (code === '/') {
        return ' ';
      }
      return morseMap[code] || '';
    }).join('');
  },
  
  // 字符串转换为ROT13编码
  toRot13: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.replace(/[a-zA-Z]/g, c => {
      const code = c.charCodeAt(0);
      const isUpperCase = code >= 65 && code <= 90;
      const offset = isUpperCase ? 65 : 97;
      return String.fromCharCode((code - offset + 13) % 26 + offset);
    });
  },
  
  // ROT13编码转换为字符串
  fromRot13: function(rot13) {
    if (typeof rot13 !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    // ROT13是对称的，所以解码和编码是相同的操作
    return this.toRot13(rot13);
  },
  
  // 字符串转换为凯撒密码
  toCaesar: function(str, shift = 3) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    shift = shift % 26;
    if (shift < 0) shift += 26;
    
    return str.replace(/[a-zA-Z]/g, c => {
      const code = c.charCodeAt(0);
      const isUpperCase = code >= 65 && code <= 90;
      const offset = isUpperCase ? 65 : 97;
      return String.fromCharCode((code - offset + shift) % 26 + offset);
    });
  },
  
  // 凯撒密码转换为字符串
  fromCaesar: function(caesar, shift = 3) {
    if (typeof caesar !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return this.toCaesar(caesar, 26 - (shift % 26));
  },
  
  // 字符串转换为摩尔斯电码
  toMorseCode: function(str) {
    return this.toMorse(str);
  },
  
  // 摩尔斯电码转换为字符串
  fromMorseCode: function(morse) {
    return this.fromMorse(morse);
  },
  
  // 字符串转换为URL查询参数
  toQueryParams: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    if (str.startsWith('?')) {
      str = str.substring(1);
    }
    
    if (!str) {
      return {};
    }
    
    return str.split('&').reduce((params, param) => {
      const [key, value] = param.split('=').map(decodeURIComponent);
      params[key] = value !== undefined ? value : '';
      return params;
    }, {});
  },
  
  // 对象转换为URL查询字符串
  fromQueryParams: function(params) {
    if (typeof params !== 'object' || params === null) {
      throw new Error('参数必须是对象');
    }
    
    return Object.keys(params)
      .map(key => {
        const value = params[key];
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');
  },
  
  // 字符串转换为驼峰命名
  toCamelCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^(.)/, c => c.toLowerCase());
  },
  
  // 字符串转换为帕斯卡命名
  toPascalCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const camel = this.toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  },
  
  // 字符串转换为短横线命名
  toKebabCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  },
  
  // 字符串转换为下划线命名
  toSnakeCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();
  },
  
  // 字符串转换为常量命名
  toConstantCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return this.toSnakeCase(str).toUpperCase();
  },
  
  // 字符串转换为标题命名
  toTitleCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str
      .toLowerCase()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },
  
  // 字符串转换为句子命名
  toSentenceCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str
      .toLowerCase()
      .replace(/^\s*\w|[.!?]\s*\w/g, c => c.toUpperCase());
  },
  
  // 字符串转换为路径命名
  toPathCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str
      .replace(/([a-z])([A-Z])/g, '$1/$2')
      .replace(/[\s_-]+/g, '/')
      .toLowerCase();
  },
  
  // 字符串转换为点命名
  toDotCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str
      .replace(/([a-z])([A-Z])/g, '$1.$2')
      .replace(/[\s_-]+/g, '.')
      .toLowerCase();
  },
  
  // 字符串转换为反向字符串
  toReverse: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.split('').reverse().join('');
  },
  
  // 字符串转换为大写
  toUpperCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.toUpperCase();
  },
  
  // 字符串转换为小写
  toLowerCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.toLowerCase();
  },
  
  // 字符串转换为首字母大写
  toCapitalize: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    if (str.length === 0) return str;
    
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  // 字符串转换为首字母小写
  toUncapitalize: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    if (str.length === 0) return str;
    
    return str.charAt(0).toLowerCase() + str.slice(1);
  },
  
  // 字符串转换为交替大小写
  toAlternatingCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.split('').map((char, index) => {
      return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
    }).join('');
  },
  
  // 字符串转换为反向大小写
  toInverseCase: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.split('').map(char => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      }
      return char.toUpperCase();
    }).join('');
  },
  
  // 字符串转换为MD5哈希
  toMd5: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    // 注意：这需要一个MD5库，这里只是一个占位符
    if (typeof md5 === 'function') {
      return md5(str);
    }
    
    throw new Error('MD5函数未定义，请引入MD5库');
  },
  
  // 字符串转换为SHA-1哈希
  toSha1: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    // 注意：这需要一个SHA-1库，这里只是一个占位符
    if (typeof sha1 === 'function') {
      return sha1(str);
    }
    
    throw new Error('SHA-1函数未定义，请引入SHA-1库');
  },
  
  // 字符串转换为SHA-256哈希
  toSha256: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    // 注意：这需要一个SHA-256库，这里只是一个占位符
    if (typeof sha256 === 'function') {
      return sha256(str);
    }
    
    throw new Error('SHA-256函数未定义，请引入SHA-256库');
  },
  
  // 字符串转换为CSV
  toCsv: function(str, delimiter = ',') {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    try {
      const lines = str.split('\n');
      return lines.map(line => {
        return line.split(delimiter).map(value => {
          // 如果值包含分隔符、引号或换行符，则用引号括起来
          if (value.includes(delimiter) || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(delimiter);
      }).join('\n');
    } catch (e) {
      throw new Error('无效的CSV字符串');
    }
  },
  
  // CSV转换为字符串数组
  fromCsv: function(csv, delimiter = ',') {
    if (typeof csv !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    try {
      const lines = csv.split('\n');
      return lines.map(line => {
        const values = [];
        let inQuotes = false;
        let currentValue = '';
        let i = 0;
        
        while (i < line.length) {
          const char = line[i];
          
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              currentValue += '"';
              i += 2;
            } else {
              inQuotes = !inQuotes;
              i++;
            }
          } else if (char === delimiter && !inQuotes) {
            values.push(currentValue);
            currentValue = '';
            i++;
          } else {
            currentValue += char;
            i++;
          }
        }
        
        values.push(currentValue);
        return values;
      });
    } catch (e) {
      throw new Error('无效的CSV字符串');
    }
  },
  
  // 字符串转换为XML
  toXml: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(str, 'text/xml');
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('无效的XML字符串');
      }
      
      return xmlDoc;
    } catch (e) {
      throw new Error('无效的XML字符串');
    }
  },
  
  // XML转换为字符串
  fromXml: function(xml) {
    if (!(xml instanceof Document)) {
      throw new Error('参数必须是XML文档');
    }
    
    const serializer = new XMLSerializer();
    return serializer.serializeToString(xml);
  },
  
  // 字符串转换为YAML
  toYaml: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    // 注意：这需要一个YAML库，这里只是一个占位符
    if (typeof jsyaml !== 'undefined' && typeof jsyaml.load === 'function') {
      return jsyaml.load(str);
    }
    
    throw new Error('YAML库未定义，请引入YAML库');
  },
  
  // 对象转换为YAML字符串
  fromYaml: function(obj) {
    if (typeof obj !== 'object' || obj === null) {
      throw new Error('参数必须是对象');
    }
    
    // 注意：这需要一个YAML库，这里只是一个占位符
    if (typeof jsyaml !== 'undefined' && typeof jsyaml.dump === 'function') {
      return jsyaml.dump(obj);
    }
    
    throw new Error('YAML库未定义，请引入YAML库');
  },
  
  // 字符串转换为JSON
  toJson: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    try {
      return JSON.parse(str);
    } catch (e) {
      throw new Error('无效的JSON字符串');
    }
  },
  
  // 对象转换为JSON字符串
  fromJson: function(obj, space = 0) {
    try {
      return JSON.stringify(obj, null, space);
    } catch (e) {
      throw new Error('无法将对象转换为JSON字符串');
    }
  },
  
  // 字符串转换为HTML
  toHtml: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    try {
      const parser = new DOMParser();
      return parser.parseFromString(str, 'text/html');
    } catch (e) {
      throw new Error('无效的HTML字符串');
    }
  },
  
  // HTML转换为字符串
  fromHtml: function(html) {
    if (!(html instanceof Document)) {
      throw new Error('参数必须是HTML文档');
    }
    
    const serializer = new XMLSerializer();
    return serializer.serializeToString(html);
  },
  
  // 字符串转换为Markdown
  toMarkdown: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    // 注意：这需要一个HTML到Markdown的转换库，这里只是一个简单实现
    let markdown = str;
    
    // 替换标题
    markdown = markdown.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g, (match, level, content) => {
      return '\n' + '#'.repeat(parseInt(level)) + ' ' + this.stripHtml(content) + '\n';
    });
    
    // 替换段落
    markdown = markdown.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (match, content) => {
      return '\n' + this.stripHtml(content) + '\n';
    });
    
    // 替换粗体
    markdown = markdown.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/g, (match, tag, content) => {
      return '**' + this.stripHtml(content) + '**';
    });
    
    // 替换斜体
    markdown = markdown.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/g, (match, tag, content) => {
      return '*' + this.stripHtml(content) + '*';
    });
    
    // 替换链接
    markdown = markdown.replace(/<a[^>]*href=["'](.*?)["'][^>]*>([\s\S]*?)<\/a>/g, (match, href, content) => {
      return '[' + this.stripHtml(content) + '](' + href + ')';
    });
    
    // 替换图片
    markdown = markdown.replace(/<img[^>]*src=["'](.*?)["'][^>]*alt=["'](.*?)["'][^>]*\/?>/g, (match, src, alt) => {
      return '![' + alt + '](' + src + ')';
    });
    
    // 替换无序列表
    markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (match, content) => {
      return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (match, item) => {
        return '- ' + this.stripHtml(item) + '\n';
      });
    });
    
    // 替换有序列表
    markdown = markdown.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (match, content) => {
      let index = 1;
      return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (match, item) => {
        return index++ + '. ' + this.stripHtml(item) + '\n';
      });
    });
    
    // 替换代码块
    markdown = markdown.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/g, (match, content) => {
      return '```\n' + this.unescapeHtml(content) + '\n```\n';
    });
    
    // 替换行内代码
    markdown = markdown.replace(/<code[^>]*>([\s\S]*?)<\/code>/g, (match, content) => {
      return '`' + this.unescapeHtml(content) + '`';
    });
    
    // 替换水平线
    markdown = markdown.replace(/<hr[^>]*\/?>/g, '\n---\n');
    
    // 替换换行
    markdown = markdown.replace(/<br[^>]*\/?>/g, '\n');
    
    // 移除剩余的HTML标签
    markdown = this.stripHtml(markdown);
    
    // 修复多余的空行
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    
    return markdown.trim();
  },
  
  // Markdown转换为HTML
  fromMarkdown: function(markdown) {
    if (typeof markdown !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    // 注意：这需要一个Markdown到HTML的转换库，这里只是一个简单实现
    let html = markdown;
    
    // 替换标题
    html = html.replace(/^(#{1,6})\s+(.*?)$/gm, (match, hashes, content) => {
      const level = hashes.length;
      return `<h${level}>${content}</h${level}>`;
    });
    
    // 替换段落
    html = html.replace(/^(?!<h|<ul|<ol|<li|<blockquote|<pre|<hr)(.+)$/gm, (match, content) => {
      return `<p>${content}</p>`;
    });
    
    // 替换粗体
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 替换斜体
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 替换链接
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // 替换图片
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
    
    // 替换无序列表
    html = html.replace(/^[\*\-\+]\s+(.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>\n)+/g, (match) => {
      return `<ul>${match}</ul>`;
    });
    
    // 替换有序列表
    html = html.replace(/^\d+\.\s+(.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>\n)+/g, (match) => {
      return `<ol>${match}</ol>`;
    });
    
    // 替换代码块
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // 替换行内代码
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // 替换水平线
    html = html.replace(/^---+$/gm, '<hr>');
    
    // 替换换行
    html = html.replace(/\n/g, '<br>');
    
    return html;
  },
  
  // 辅助方法：移除HTML标签
  stripHtml: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.replace(/<\/?[^>]+(>|$)/g, '');
  },
  
  // 辅助方法：HTML实体转义
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
  
  // 辅助方法：HTML实体反转义
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
  }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.DuobaoString.Convert;
}
