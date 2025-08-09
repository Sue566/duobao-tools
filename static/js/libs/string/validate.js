/**
 * 多宝工具库 - 字符串验证工具
 */

window.DuobaoString = window.DuobaoString || {};

window.DuobaoString.Validate = {
  // 检查是否为空字符串
  isEmpty: function(str) {
    return typeof str === 'string' && str === '';
  },
  
  // 检查是否为空白字符串
  isBlank: function(str) {
    return typeof str === 'string' && str.trim() === '';
  },
  
  // 检查是否不为空字符串
  isNotEmpty: function(str) {
    return typeof str === 'string' && str !== '';
  },
  
  // 检查是否不为空白字符串
  isNotBlank: function(str) {
    return typeof str === 'string' && str.trim() !== '';
  },
  
  // 检查是否为null或undefined
  isNullOrUndefined: function(str) {
    return str === null || str === undefined;
  },
  
  // 检查是否不为null且不为undefined
  isNotNullOrUndefined: function(str) {
    return str !== null && str !== undefined;
  },
  
  // 检查是否为null、undefined或空
  isNullOrEmpty: function(str) {
    return str === null || str === undefined || str === '';
  },
  
  // 检查是否不为null、不为undefined且不为空
  isNotNullOrEmpty: function(str) {
    return str !== null && str !== undefined && str !== '';
  },
  
  // 检查是否为null、undefined、空或仅包含空白
  isNullOrBlank: function(str) {
    return str === null || str === undefined || (typeof str === 'string' && str.trim() === '');
  },
  
  // 检查是否不为null、不为undefined、不为空且不仅包含空白
  isNotNullOrBlank: function(str) {
    return str !== null && str !== undefined && typeof str === 'string' && str.trim() !== '';
  },
  
  // 检查是否仅包含字母
  isAlpha: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[a-zA-Z]+$/.test(str);
  },
  
  // 检查是否仅包含字母和数字
  isAlphanumeric: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[a-zA-Z0-9]+$/.test(str);
  },
  
  // 检查是否仅包含数字
  isNumeric: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-9]+$/.test(str);
  },
  
  // 检查是否仅包含空白
  isWhitespace: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^\s+$/.test(str);
  },
  
  // 检查是否为有效的整数
  isInteger: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^-?\d+$/.test(str);
  },
  
  // 检查是否为有效的浮点数
  isFloat: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^-?\d+(\.\d+)?$/.test(str);
  },
  
  // 检查是否为有效的十六进制数
  isHex: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-9A-Fa-f]+$/.test(str);
  },
  
  // 检查是否为有效的二进制数
  isBinary: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[01]+$/.test(str);
  },
  
  // 检查是否为有效的八进制数
  isOctal: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-7]+$/.test(str);
  },
  
  // 检查是否为有效的电子邮件地址
  isEmail: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  },
  
  // 检查是否为有效的URL
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
  
  // 检查是否为有效的IP地址
  isIp: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(str);
  },
  
  // 检查是否为有效的IPv4地址
  isIpv4: function(str) {
    return this.isIp(str);
  },
  
  // 检查是否为有效的IPv6地址
  isIpv6: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/.test(str);
  },
  
  // 检查是否为有效的MAC地址
  isMac: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(str);
  },
  
  // 检查是否为有效的UUID
  isUuid: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
  },
  
  // 检查是否为有效的日期
  isDate: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    const date = new Date(str);
    return !isNaN(date.getTime());
  },
  
  // 检查是否为有效的时间
  isTime: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.test(str);
  },
  
  // 检查是否为有效的日期时间
  isDateTime: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    const date = new Date(str);
    return !isNaN(date.getTime());
  },
  
  // 检查是否为有效的ISO日期
  isIsoDate: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})?)?$/.test(str);
  },
  
  // 检查是否为有效的JSON
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
  
  // 检查是否为有效的XML
  isXml: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(str, 'text/xml');
      
      return xmlDoc.getElementsByTagName('parsererror').length === 0;
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的HTML
  isHtml: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /<[a-z][\s\S]*>/i.test(str);
  },
  
  // 检查是否为有效的Base64
  isBase64: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      return btoa(atob(str)) === str;
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的十六进制颜色
  isHexColor: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(str);
  },
  
  // 检查是否为有效的RGB颜色
  isRgbColor: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/.test(str);
  },
  
  // 检查是否为有效的RGBA颜色
  isRgbaColor: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d*(?:\.\d+)?)\s*\)$/.test(str);
  },
  
  // 检查是否为有效的HSL颜色
  isHslColor: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/.test(str);
  },
  
  // 检查是否为有效的HSLA颜色
  isHslaColor: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d*(?:\.\d+)?)\s*\)$/.test(str);
  },
  
  // 检查是否为有效的颜色
  isColor: function(str) {
    return this.isHexColor(str) || this.isRgbColor(str) || this.isRgbaColor(str) || this.isHslColor(str) || this.isHslaColor(str);
  },
  
  // 检查是否为有效的信用卡号
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
  
  // 检查是否为有效的手机号码（简单验证）
  isPhone: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/.test(str);
  },
  
  // 检查是否为有效的中国手机号码
  isChinesePhone: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^1[3-9]\d{9}$/.test(str);
  },
  
  // 检查是否为有效的邮政编码（简单验证）
  isPostalCode: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-9]{5}(?:-[0-9]{4})?$/.test(str);
  },
  
  // 检查是否为有效的中国邮政编码
  isChinesePostalCode: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[1-9]\d{5}$/.test(str);
  },
  
  // 检查是否为有效的ISBN（简单验证）
  isIsbn: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    const sanitized = str.replace(/[\s-]/g, '');
    
    return /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/.test(sanitized);
  },
  
  // 检查是否为有效的ISBN-10
  isIsbn10: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    const sanitized = str.replace(/[\s-]/g, '');
    
    if (!/^[0-9]{9}[0-9X]$/.test(sanitized)) {
      return false;
    }
    
    // 验证校验位
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(sanitized.charAt(i), 10) * (10 - i);
    }
    
    const checkDigit = sanitized.charAt(9);
    const calculatedCheckDigit = (11 - (sum % 11)) % 11;
    
    return (checkDigit === 'X' && calculatedCheckDigit === 10) || (parseInt(checkDigit, 10) === calculatedCheckDigit);
  },
  
  // 检查是否为有效的ISBN-13
  isIsbn13: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    const sanitized = str.replace(/[\s-]/g, '');
    
    if (!/^[0-9]{13}$/.test(sanitized)) {
      return false;
    }
    
    // 验证校验位
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(sanitized.charAt(i), 10) * (i % 2 === 0 ? 1 : 3);
    }
    
    const checkDigit = parseInt(sanitized.charAt(12), 10);
    const calculatedCheckDigit = (10 - (sum % 10)) % 10;
    
    return checkDigit === calculatedCheckDigit;
  },
  
  // 检查是否为有效的身份证号（简单验证）
  isIdCard: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-9]{15}$|^[0-9]{17}[0-9X]$/.test(str);
  },
  
  // 检查是否为有效的中国身份证号
  isChineseIdCard: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    // 15位身份证号
    if (/^[1-9]\d{5}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}$/.test(str)) {
      return true;
    }
    
    // 18位身份证号
    if (!/^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/.test(str)) {
      return false;
    }
    
    // 验证校验位
    const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let sum = 0;
    
    for (let i = 0; i < 17; i++) {
      sum += parseInt(str.charAt(i), 10) * factor[i];
    }
    
    return parity[sum % 11] === str.charAt(17).toUpperCase();
  },
  
  // 检查是否为有效的护照号（简单验证）
  isPassport: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[A-Z]{1,2}[0-9]{6,9}$/.test(str);
  },
  
  // 检查是否为有效的中国护照号
  isChinesePassport: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[EG]\d{8}$|^[DPS]\d{7}$/.test(str);
  },
  
  // 检查是否为有效的驾驶证号（简单验证）
  isDriverLicense: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-9A-Z]{5,20}$/.test(str);
  },
  
  // 检查是否为有效的中国驾驶证号
  isChineseDriverLicense: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/.test(str);
  },
  
  // 检查是否为有效的车牌号（简单验证）
  isLicensePlate: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[A-Z0-9]{5,8}$/.test(str);
  },
  
  // 检查是否为有效的中国车牌号
  isChineseLicensePlate: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{4,5}[A-Z0-9挂学警港澳]$/.test(str);
  },
  
  // 检查是否为有效的社会保险号（简单验证）
  isSsn: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-9]{3}-[0-9]{2}-[0-9]{4}$/.test(str);
  },
  
  // 检查是否为有效的中国社会保险号
  isChineseSsn: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^\d{17}[\dX]$|^\d{15}$/.test(str);
  },
  
  // 检查是否为有效的纳税人识别号（简单验证）
  isTaxId: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-9A-Z]{10,20}$/.test(str);
  },
  
  // 检查是否为有效的中国纳税人识别号
  isChineseTaxId: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-9A-Z]{15,20}$/.test(str);
  },
  
  // 检查是否为有效的组织机构代码（简单验证）
  isOrgCode: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-9A-Z]{8,10}$/.test(str);
  },
  
  // 检查是否为有效的中国组织机构代码
  isChineseOrgCode: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-9A-Z]{8}-[0-9X]$/.test(str);
  },
  
  // 检查是否为有效的统一社会信用代码（简单验证）
  isUnifiedSocialCreditCode: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-9A-Z]{18}$/.test(str);
  },
  
  // 检查是否为有效的中国统一社会信用代码
  isChineseUnifiedSocialCreditCode: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/.test(str);
  },
  
  // 检查是否为有效的银行卡号（简单验证）
  isBankCard: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
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
  
  // 检查是否为有效的中国银行卡号
  isChineseBankCard: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    const sanitized = str.replace(/[\s-]/g, '');
    
    // 检查长度和是否只包含数字
    if (!/^\d{16,19}$/.test(sanitized)) {
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
  
  // 检查是否为有效的密码（简单验证）
  isPassword: function(str, options = {}) {
    if (typeof str !== 'string') {
      return false;
    }
    
    const {
      minLength = 8,
      maxLength = 20,
      requireUppercase = true,
      requireLowercase = true,
      requireNumbers = true,
      requireSpecialChars = true
    } = options;
    
    if (str.length < minLength || str.length > maxLength) {
      return false;
    }
    
    if (requireUppercase && !/[A-Z]/.test(str)) {
      return false;
    }
    
    if (requireLowercase && !/[a-z]/.test(str)) {
      return false;
    }
    
    if (requireNumbers && !/[0-9]/.test(str)) {
      return false;
    }
    
    if (requireSpecialChars && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(str)) {
      return false;
    }
    
    return true;
  },
  
  // 检查是否为有效的用户名（简单验证）
  isUsername: function(str, options = {}) {
    if (typeof str !== 'string') {
      return false;
    }
    
    const {
      minLength = 3,
      maxLength = 20,
      allowedChars = /^[a-zA-Z0-9_]+$/
    } = options;
    
    if (str.length < minLength || str.length > maxLength) {
      return false;
    }
    
    return allowedChars.test(str);
  },
  
  // 检查是否为有效的域名
  isDomain: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/.test(str.toLowerCase());
  },
  
  // 检查是否为有效的子域名
  isSubdomain: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    const parts = str.toLowerCase().split('.');
    return parts.length > 2 && this.isDomain(str);
  },
  
  // 检查是否为有效的文件名
  isFileName: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^[^\\\/\:\*\?\"\<\>\|]+$/.test(str);
  },
  
  // 检查是否为有效的文件路径
  isFilePath: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^(?:[a-zA-Z]\:|\\\\[\w\.]+\\[\w.$]+)\\(?:[\w]+\\)*\w([\w.])+$/.test(str);
  },
  
  // 检查是否为有效的URL路径
  isUrlPath: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^\/[\w\-\.~\/]*$/.test(str);
  },
  
  // 检查是否为有效的查询字符串
  isQueryString: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^\?([\w\-\.~\:\/\?#\[\]@\!\$&'\(\)\*\+,;=]+=[\w\-\.~\:\/\?#\[\]@\!\$&'\(\)\*\+,;=]*&)*[\w\-\.~\:\/\?#\[\]@\!\$&'\(\)\*\+,;=]+=[\w\-\.~\:\/\?#\[\]@\!\$&'\(\)\*\+,;=]*$/.test(str);
  },
  
  // 检查是否为有效的URL片段
  isUrlFragment: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^#[\w\-\.~\:\/\?#\[\]@\!\$&'\(\)\*\+,;=]*$/.test(str);
  },
  
  // 检查是否为有效的URL
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
  
  // 检查是否为有效的HTTP URL
  isHttpUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的HTTPS URL
  isHttpsUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      return url.protocol === 'https:';
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的FTP URL
  isFtpUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      return url.protocol === 'ftp:';
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的文件URL
  isFileUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      return url.protocol === 'file:';
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的数据URL
  isDataUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    return /^data:([a-z]+\/[a-z0-9-+.]+)?;base64,([a-zA-Z0-9+/=]*)$/.test(str);
  },
  
  // 检查是否为有效的图片URL
  isImageUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif') || path.endsWith('.bmp') || path.endsWith('.webp') || path.endsWith('.svg');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的视频URL
  isVideoUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.ogg') || path.endsWith('.mov') || path.endsWith('.avi') || path.endsWith('.wmv') || path.endsWith('.flv');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的音频URL
  isAudioUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.mp3') || path.endsWith('.wav') || path.endsWith('.ogg') || path.endsWith('.aac') || path.endsWith('.flac') || path.endsWith('.m4a');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的文档URL
  isDocumentUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.pdf') || path.endsWith('.doc') || path.endsWith('.docx') || path.endsWith('.xls') || path.endsWith('.xlsx') || path.endsWith('.ppt') || path.endsWith('.pptx') || path.endsWith('.txt');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的压缩文件URL
  isArchiveUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.zip') || path.endsWith('.rar') || path.endsWith('.7z') || path.endsWith('.tar') || path.endsWith('.gz') || path.endsWith('.bz2');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的执行文件URL
  isExecutableUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.exe') || path.endsWith('.msi') || path.endsWith('.bat') || path.endsWith('.cmd') || path.endsWith('.sh') || path.endsWith('.app');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的脚本URL
  isScriptUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.js') || path.endsWith('.py') || path.endsWith('.php') || path.endsWith('.rb') || path.endsWith('.pl') || path.endsWith('.sh');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的样式表URL
  isStylesheetUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.css') || path.endsWith('.scss') || path.endsWith('.less');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的字体URL
  isFontUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.ttf') || path.endsWith('.otf') || path.endsWith('.woff') || path.endsWith('.woff2') || path.endsWith('.eot');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的JSON URL
  isJsonUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.json');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的XML URL
  isXmlUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.xml');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的HTML URL
  isHtmlUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.html') || path.endsWith('.htm') || path.endsWith('.xhtml');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的Markdown URL
  isMarkdownUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.md') || path.endsWith('.markdown');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的CSV URL
  isCsvUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.csv');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的SVG URL
  isSvgUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.svg');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的WebP URL
  isWebpUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.webp');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的YAML URL
  isYamlUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.yml') || path.endsWith('.yaml');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的TOML URL
  isTomlUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.toml');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的INI URL
  isIniUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.ini');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的配置文件URL
  isConfigUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.json') || path.endsWith('.xml') || path.endsWith('.yml') || path.endsWith('.yaml') || path.endsWith('.toml') || path.endsWith('.ini') || path.endsWith('.conf') || path.endsWith('.config');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的数据文件URL
  isDataFileUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.json') || path.endsWith('.xml') || path.endsWith('.csv') || path.endsWith('.yml') || path.endsWith('.yaml') || path.endsWith('.toml');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的文本文件URL
  isTextFileUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.txt') || path.endsWith('.md') || path.endsWith('.markdown') || path.endsWith('.log') || path.endsWith('.ini') || path.endsWith('.conf') || path.endsWith('.config');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的二进制文件URL
  isBinaryFileUrl: function(str) {
    if (typeof str !== 'string') {
      return false;
    }
    
    try {
      const url = new URL(str);
      const path = url.pathname.toLowerCase();
      return path.endsWith('.bin') || path.endsWith('.dat') || path.endsWith('.exe') || path.endsWith('.dll') || path.endsWith('.so') || path.endsWith('.dylib');
    } catch (e) {
      return false;
    }
  },
  
  // 检查是否为有效的图像文件URL
  isImageFileUrl: function(str) {
    return this.isImageUrl(str);
  },
  
  // 检查是否为有效的视频文件URL
  isVideoFileUrl: function(str) {
    return this.isVideoUrl(str);
  },
  
  // 检查是否为有效的音频文件URL
  isAudioFileUrl: function(str) {
    return this.isAudioUrl(str);
  },
  
  // 检查是否为有效的文档文件URL
  isDocumentFileUrl: function(str) {
    return this.isDocumentUrl(str);
  },
  
  // 检查是否为有效的压缩文件URL
  isArchiveFileUrl: function(str) {
    return this.isArchiveUrl(str);
  },
  
  // 检查是否为有效的执行文件URL
  isExecutableFileUrl: function(str) {
    return this.isExecutableUrl(str);
  },
  
  // 检查是否为有效的脚本文件URL
  isScriptFileUrl: function(str) {
    return this.isScriptUrl(str);
  },
  
  // 检查是否为有效的样式表文件URL
  isStylesheetFileUrl: function(str) {
    return this.isStylesheetUrl(str);
  },
  
  // 检查是否为有效的字体文件URL
  isFontFileUrl: function(str) {
    return this.isFontUrl(str);
  }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.DuobaoString.Validate;
}
