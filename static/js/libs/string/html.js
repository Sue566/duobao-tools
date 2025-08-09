/**
 * 多宝工具库 - 字符串HTML处理工具
 */

window.DuobaoString = window.DuobaoString || {};

window.DuobaoString.HTML = {
  // 转义HTML特殊字符
  escape: function(str) {
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
  
  // 反转义HTML特殊字符
  unescape: function(str) {
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
  
  // 移除HTML标签
  stripTags: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.replace(/<\/?[^>]+(>|$)/g, '');
  },
  
  // 移除HTML标签和属性
  stripTagsAndAttributes: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const div = document.createElement('div');
    div.innerHTML = str;
    return div.textContent || div.innerText || '';
  },
  
  // 移除HTML注释
  stripComments: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.replace(/<!--[\s\S]*?-->/g, '');
  },
  
  // 移除HTML脚本标签
  stripScripts: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  },
  
  // 移除HTML样式标签
  stripStyles: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  },
  
  // 获取HTML标签属性
  getAttributes: function(tag) {
    if (typeof tag !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const attributes = {};
    const attributeRegex = /(\w+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^>\s]+)))?/g;
    let match;
    
    while ((match = attributeRegex.exec(tag)) !== null) {
      attributes[match[1]] = match[2] || match[3] || match[4] || true;
    }
    
    return attributes;
  },
  
  // 解析HTML字符串为DOM元素
  parseHTML: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const parser = new DOMParser();
    return parser.parseFromString(str, 'text/html');
  },
  
  // 将DOM元素序列化为HTML字符串
  serializeHTML: function(element) {
    if (!(element instanceof Element)) {
      throw new Error('参数必须是DOM元素');
    }
    
    return element.outerHTML;
  },
  
  // 创建HTML元素
  createElement: function(tagName, attributes = {}, content = '') {
    if (typeof tagName !== 'string') {
      throw new Error('标签名必须是字符串');
    }
    
    const element = document.createElement(tagName);
    
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    
    if (content) {
      element.innerHTML = content;
    }
    
    return element;
  },
  
  // 创建HTML元素字符串
  createElementString: function(tagName, attributes = {}, content = '') {
    if (typeof tagName !== 'string') {
      throw new Error('标签名必须是字符串');
    }
    
    const attributesString = Object.entries(attributes)
      .map(([key, value]) => `${key}="${this.escape(value.toString())}"`)
      .join(' ');
    
    const openTag = attributesString ? `<${tagName} ${attributesString}>` : `<${tagName}>`;
    
    if (this.isSelfClosingTag(tagName)) {
      return attributesString ? `<${tagName} ${attributesString} />` : `<${tagName} />`;
    }
    
    return `${openTag}${content}</${tagName}>`;
  },
  
  // 检查是否为自闭合标签
  isSelfClosingTag: function(tagName) {
    if (typeof tagName !== 'string') {
      throw new Error('标签名必须是字符串');
    }
    
    const selfClosingTags = [
      'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
      'link', 'meta', 'param', 'source', 'track', 'wbr'
    ];
    
    return selfClosingTags.includes(tagName.toLowerCase());
  },
  
  // 获取HTML标签名
  getTagName: function(tag) {
    if (typeof tag !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const match = tag.match(/<\s*(\w+)/);
    return match ? match[1].toLowerCase() : '';
  },
  
  // 获取HTML标签内容
  getTagContent: function(tag) {
    if (typeof tag !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const tagName = this.getTagName(tag);
    
    if (!tagName || this.isSelfClosingTag(tagName)) {
      return '';
    }
    
    const regex = new RegExp(`<${tagName}[^>]*>(.*?)<\\/${tagName}>`, 's');
    const match = tag.match(regex);
    
    return match ? match[1] : '';
  },
  
  // 获取HTML标签属性值
  getAttributeValue: function(tag, attributeName) {
    if (typeof tag !== 'string' || typeof attributeName !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const regex = new RegExp(`${attributeName}\\s*=\\s*["']([^"']*)["']`);
    const match = tag.match(regex);
    
    return match ? match[1] : null;
  },
  
  // 替换HTML标签属性值
  replaceAttributeValue: function(tag, attributeName, newValue) {
    if (typeof tag !== 'string' || typeof attributeName !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const regex = new RegExp(`(${attributeName}\\s*=\\s*["'])([^"']*)(["'])`, 'g');
    
    return tag.replace(regex, `$1${newValue}$3`);
  },
  
  // 添加HTML标签属性
  addAttribute: function(tag, attributeName, attributeValue) {
    if (typeof tag !== 'string' || typeof attributeName !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const hasAttribute = new RegExp(`\\s${attributeName}\\s*=`).test(tag);
    
    if (hasAttribute) {
      return this.replaceAttributeValue(tag, attributeName, attributeValue);
    }
    
    return tag.replace(/(\s*)(\/?>)/, ` ${attributeName}="${attributeValue}"$1$2`);
  },
  
  // 移除HTML标签属性
  removeAttribute: function(tag, attributeName) {
    if (typeof tag !== 'string' || typeof attributeName !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return tag.replace(new RegExp(`\\s${attributeName}\\s*=\\s*["'][^"']*["']`, 'g'), '');
  },
  
  // 替换HTML标签
  replaceTag: function(str, oldTagName, newTagName) {
    if (typeof str !== 'string' || typeof oldTagName !== 'string' || typeof newTagName !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str
      .replace(new RegExp(`<${oldTagName}(\\s[^>]*)?>`,'g'), `<${newTagName}$1>`)
      .replace(new RegExp(`</${oldTagName}>`, 'g'), `</${newTagName}>`);
  },
  
  // 包装HTML内容
  wrap: function(content, tagName, attributes = {}) {
    if (typeof content !== 'string' || typeof tagName !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return this.createElementString(tagName, attributes, content);
  },
  
  // 解包HTML内容
  unwrap: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return this.getTagContent(str);
  },
  
  // 获取HTML中的所有链接
  getLinks: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const links = [];
    const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
    let match;
    
    while ((match = regex.exec(str)) !== null) {
      links.push(match[2]);
    }
    
    return links;
  },
  
  // 获取HTML中的所有图片
  getImages: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const images = [];
    const regex = /<img\s+(?:[^>]*?\s+)?src=(["'])(.*?)\1/g;
    let match;
    
    while ((match = regex.exec(str)) !== null) {
      images.push(match[2]);
    }
    
    return images;
  },
  
  // 获取HTML中的所有表单
  getForms: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const forms = [];
    const regex = /<form\b[^>]*>([\s\S]*?)<\/form>/g;
    let match;
    
    while ((match = regex.exec(str)) !== null) {
      forms.push(match[0]);
    }
    
    return forms;
  },
  
  // 获取HTML中的所有表格
  getTables: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const tables = [];
    const regex = /<table\b[^>]*>([\s\S]*?)<\/table>/g;
    let match;
    
    while ((match = regex.exec(str)) !== null) {
      tables.push(match[0]);
    }
    
    return tables;
  },
  
  // 获取HTML中的所有列表
  getLists: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const lists = [];
    const regex = /<(ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/g;
    let match;
    
    while ((match = regex.exec(str)) !== null) {
      lists.push(match[0]);
    }
    
    return lists;
  },
  
  // 获取HTML中的所有标题
  getHeadings: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const headings = [];
    const regex = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g;
    let match;
    
    while ((match = regex.exec(str)) !== null) {
      headings.push({
        level: match[1],
        content: this.stripTags(match[2]),
        html: match[0]
      });
    }
    
    return headings;
  },
  
  // 获取HTML中的所有段落
  getParagraphs: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const paragraphs = [];
    const regex = /<p\b[^>]*>([\s\S]*?)<\/p>/g;
    let match;
    
    while ((match = regex.exec(str)) !== null) {
      paragraphs.push(match[0]);
    }
    
    return paragraphs;
  },
  
  // 获取HTML中的所有脚本
  getScripts: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const scripts = [];
    const regex = /<script\b[^>]*>([\s\S]*?)<\/script>/g;
    let match;
    
    while ((match = regex.exec(str)) !== null) {
      scripts.push(match[0]);
    }
    
    return scripts;
  },
  
  // 获取HTML中的所有样式
  getStyles: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const styles = [];
    const regex = /<style\b[^>]*>([\s\S]*?)<\/style>/g;
    let match;
    
    while ((match = regex.exec(str)) !== null) {
      styles.push(match[0]);
    }
    
    return styles;
  },
  
  // 获取HTML中的所有注释
  getComments: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const comments = [];
    const regex = /<!--([\s\S]*?)-->/g;
    let match;
    
    while ((match = regex.exec(str)) !== null) {
      comments.push(match[0]);
    }
    
    return comments;
  },
  
  // 获取HTML中的所有元素
  getElements: function(str, tagName) {
    if (typeof str !== 'string' || typeof tagName !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const elements = [];
    const regex = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'g');
    let match;
    
    while ((match = regex.exec(str)) !== null) {
      elements.push(match[0]);
    }
    
    return elements;
  },
  
  // 获取HTML中的所有自闭合元素
  getSelfClosingElements: function(str, tagName) {
    if (typeof str !== 'string' || typeof tagName !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const elements = [];
    const regex = new RegExp(`<${tagName}\\b[^>]*\\s*\\/?>`, 'g');
    let match;
    
    while ((match = regex.exec(str)) !== null) {
      elements.push(match[0]);
    }
    
    return elements;
  },
  
  // 将HTML转换为纯文本
  toPlainText: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return this.stripTagsAndAttributes(str)
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },
  
  // 将HTML转换为Markdown
  toMarkdown: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    let markdown = str;
    
    // 替换标题
    markdown = markdown.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g, (match, level, content) => {
      return '\n' + '#'.repeat(parseInt(level)) + ' ' + this.stripTags(content) + '\n';
    });
    
    // 替换段落
    markdown = markdown.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (match, content) => {
      return '\n' + this.stripTags(content) + '\n';
    });
    
    // 替换粗体
    markdown = markdown.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/g, (match, tag, content) => {
      return '**' + this.stripTags(content) + '**';
    });
    
    // 替换斜体
    markdown = markdown.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/g, (match, tag, content) => {
      return '*' + this.stripTags(content) + '*';
    });
    
    // 替换链接
    markdown = markdown.replace(/<a[^>]*href=["'](.*?)["'][^>]*>([\s\S]*?)<\/a>/g, (match, href, content) => {
      return '[' + this.stripTags(content) + '](' + href + ')';
    });
    
    // 替换图片
    markdown = markdown.replace(/<img[^>]*src=["'](.*?)["'][^>]*alt=["'](.*?)["'][^>]*\/?>/g, (match, src, alt) => {
      return '![' + alt + '](' + src + ')';
    });
    
    // 替换无序列表
    markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (match, content) => {
      return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (match, item) => {
        return '- ' + this.stripTags(item) + '\n';
      });
    });
    
    // 替换有序列表
    markdown = markdown.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (match, content) => {
      let index = 1;
      return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (match, item) => {
        return index++ + '. ' + this.stripTags(item) + '\n';
      });
    });
    
    // 替换代码块
    markdown = markdown.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/g, (match, content) => {
      return '```\n' + this.unescape(content) + '\n```\n';
    });
    
    // 替换行内代码
    markdown = markdown.replace(/<code[^>]*>([\s\S]*?)<\/code>/g, (match, content) => {
      return '`' + this.unescape(content) + '`';
    });
    
    // 替换水平线
    markdown = markdown.replace(/<hr[^>]*\/?>/g, '\n---\n');
    
    // 替换换行
    markdown = markdown.replace(/<br[^>]*\/?>/g, '\n');
    
    // 移除剩余的HTML标签
    markdown = this.stripTags(markdown);
    
    // 修复多余的空行
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    
    return markdown.trim();
  },
  
  // 将HTML转换为JSON
  toJSON: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const dom = this.parseHTML(str);
    
    const elementToJSON = (element) => {
      if (element.nodeType === Node.TEXT_NODE) {
        const text = element.textContent.trim();
        return text ? { type: 'text', content: text } : null;
      }
      
      if (element.nodeType !== Node.ELEMENT_NODE) {
        return null;
      }
      
      const result = {
        type: 'element',
        tagName: element.tagName.toLowerCase(),
        attributes: {},
        children: []
      };
      
      // 获取属性
      Array.from(element.attributes).forEach(attr => {
        result.attributes[attr.name] = attr.value;
      });
      
      // 获取子元素
      Array.from(element.childNodes).forEach(child => {
        const childJSON = elementToJSON(child);
        if (childJSON) {
          result.children.push(childJSON);
        }
      });
      
      return result;
    };
    
    return elementToJSON(dom.body);
  },
  
  // 将HTML转换为XML
  toXML: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    // 替换HTML自闭合标签为XML格式
    let xml = str.replace(/<(\w+)([^>]*)\/>/g, '<$1$2></$1>');
    
    // 添加XML声明
    if (!xml.startsWith('<?xml')) {
      xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml;
    }
    
    return xml;
  },
  
  // 美化HTML
  beautify: function(str, options = {}) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    const {
      indentSize = 2,
      indentChar = ' ',
      maxPreserveNewlines = 1,
      preserveNewlines = true,
      wrapLineLength = 0,
      unformatted = ['code', 'pre', 'textarea']
    } = options;
    
    // 简单的HTML美化实现
    let result = '';
    let indentLevel = 0;
    let inPreTag = false;
    
    // 分割HTML为标签和文本
    const tokens = str.match(/<[^>]+>|[^<]+/g) || [];
    
    for (const token of tokens) {
      // 检查是否在预格式化标签内
      if (token.match(/<pre[^>]*>/)) {
        inPreTag = true;
        result += '\n' + indentChar.repeat(indentLevel * indentSize) + token;
        continue;
      }
      
      if (token.match(/<\/pre>/)) {
        inPreTag = false;
        result += token + '\n';
        continue;
      }
      
      if (inPreTag) {
        result += token;
        continue;
      }
      
      // 处理注释
      if (token.startsWith('<!--')) {
        result += '\n' + indentChar.repeat(indentLevel * indentSize) + token + '\n';
        continue;
      }
      
      // 处理结束标签
      if (token.startsWith('</')) {
        indentLevel--;
        result += '\n' + indentChar.repeat(indentLevel * indentSize) + token;
        continue;
      }
      
      // 处理自闭合标签
      if (token.endsWith('/>')) {
        result += '\n' + indentChar.repeat(indentLevel * indentSize) + token;
        continue;
      }
      
      // 处理开始标签
      if (token.startsWith('<')) {
        result += '\n' + indentChar.repeat(indentLevel * indentSize) + token;
        
        // 检查是否为未格式化的标签
        const tagName = token.match(/<(\w+)/)?.[1].toLowerCase();
        if (tagName && !unformatted.includes(tagName)) {
          indentLevel++;
        }
        
        continue;
      }
      
      // 处理文本内容
      const text = token.trim();
      if (text) {
        result += '\n' + indentChar.repeat(indentLevel * indentSize) + text;
      }
    }
    
    return result.trim();
  },
  
  // 压缩HTML
  minify: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是字符串');
    }
    
    return str
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();
  }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.DuobaoString.HTML;
}