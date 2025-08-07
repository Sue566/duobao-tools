/**
 * JSON格式化工具 - 转换模块
 */

// JSON转换功能
const JsonConverter = {
  /**
   * JSON转YAML
   * @param {object} jsonObj - JSON对象
   * @returns {string} YAML字符串
   */
  jsonToYaml: function(jsonObj) {
    try {
      return this._jsonToYamlConverter(jsonObj);
    } catch (error) {
      throw new Error(`转换失败: ${error.message}`);
    }
  },
  
  /**
   * YAML转JSON
   * @param {string} yaml - YAML字符串
   * @returns {object} JSON对象
   */
  yamlToJson: function(yaml) {
    try {
      return this._yamlToJsonConverter(yaml);
    } catch (error) {
      throw new Error(`转换失败: ${error.message}`);
    }
  },
  
  /**
   * JSON转XML
   * @param {object} jsonObj - JSON对象
   * @returns {string} XML字符串
   */
  jsonToXml: function(jsonObj) {
    try {
      return this._jsonToXmlConverter(jsonObj);
    } catch (error) {
      throw new Error(`转换失败: ${error.message}`);
    }
  },
  
  /**
   * XML转JSON
   * @param {string} xml - XML字符串
   * @returns {object} JSON对象
   */
  xmlToJson: function(xml) {
    try {
      return this._xmlToJsonConverter(xml);
    } catch (error) {
      throw new Error(`转换失败: ${error.message}`);
    }
  },
  
  /**
   * JSON转CSV
   * @param {object} jsonObj - JSON对象
   * @returns {string} CSV字符串
   */
  jsonToCsv: function(jsonObj) {
    try {
      return this._jsonToCsvConverter(jsonObj);
    } catch (error) {
      throw new Error(`转换失败: ${error.message}`);
    }
  },
  
  /**
   * CSV转JSON
   * @param {string} csv - CSV字符串
   * @returns {object} JSON对象
   */
  csvToJson: function(csv) {
    try {
      return this._csvToJsonConverter(csv);
    } catch (error) {
      throw new Error(`转换失败: ${error.message}`);
    }
  },
  
  /**
   * JSON转YAML转换器（内部实现）
   * @private
   */
  _jsonToYamlConverter: function(obj, indent = 0) {
    const spaces = ' '.repeat(indent);
    let yaml = '';
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return '[]';
      }
      
      for (const item of obj) {
        yaml += spaces + '- ';
        
        if (item === null) {
          yaml += 'null\n';
        } else if (typeof item === 'object') {
          yaml += '\n' + this._jsonToYamlConverter(item, indent + 2);
        } else if (typeof item === 'string') {
          yaml += `"${item}"\n`;
        } else {
          yaml += `${item}\n`;
        }
      }
    } else if (obj !== null && typeof obj === 'object') {
      const keys = Object.keys(obj);
      
      if (keys.length === 0) {
        return '{}';
      }
      
      for (const key of keys) {
        const value = obj[key];
        yaml += spaces + key + ': ';
        
        if (value === null) {
          yaml += 'null\n';
        } else if (typeof value === 'object') {
          yaml += '\n' + this._jsonToYamlConverter(value, indent + 2);
        } else if (typeof value === 'string') {
          yaml += `"${value}"\n`;
        } else {
          yaml += `${value}\n`;
        }
      }
    }
    
    return yaml;
  },
  
  /**
   * YAML转JSON转换器（内部实现）
   * @private
   */
  _yamlToJsonConverter: function(yaml) {
    // 这是一个非常简化的实现，实际应该使用专门的YAML解析库
    const lines = yaml.split('\n');
    const result = {};
    let currentObj = result;
    let stack = [{ obj: result, indent: -2 }];
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      const indent = line.search(/\S/);
      const isArray = line.trim().startsWith('- ');
      
      // 处理缩进
      while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
        stack.pop();
        currentObj = stack[stack.length - 1].obj;
      }
      
      if (isArray) {
        // 处理数组项
        const content = line.trim().substring(2).trim();
        
        if (!Array.isArray(currentObj)) {
          // 如果当前对象不是数组，创建一个新数组
          const key = Object.keys(stack[stack.length - 1].obj).pop();
          stack[stack.length - 1].obj[key] = [];
          currentObj = stack[stack.length - 1].obj[key];
        }
        
        if (content) {
          // 简单值
          if (content === 'null') {
            currentObj.push(null);
          } else if (content === 'true') {
            currentObj.push(true);
          } else if (content === 'false') {
            currentObj.push(false);
          } else if (!isNaN(content)) {
            currentObj.push(Number(content));
          } else if (content.startsWith('"') && content.endsWith('"')) {
            currentObj.push(content.slice(1, -1));
          } else {
            currentObj.push(content);
          }
        } else {
          // 复杂对象
          const newObj = {};
          currentObj.push(newObj);
          stack.push({ obj: newObj, indent: indent });
          currentObj = newObj;
        }
      } else {
        // 处理键值对
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          const key = line.substring(0, colonIndex).trim();
          let value = line.substring(colonIndex + 1).trim();
          
          if (!value) {
            // 值为对象
            const newObj = {};
            currentObj[key] = newObj;
            stack.push({ obj: newObj, indent: indent });
            currentObj = newObj;
          } else {
            // 简单值
            if (value === 'null') {
              currentObj[key] = null;
            } else if (value === 'true') {
              currentObj[key] = true;
            } else if (value === 'false') {
              currentObj[key] = false;
            } else if (!isNaN(value)) {
              currentObj[key] = Number(value);
            } else if (value.startsWith('"') && value.endsWith('"')) {
              currentObj[key] = value.slice(1, -1);
            } else {
              currentObj[key] = value;
            }
          }
        }
      }
    }
    
    return result;
  },
  
  /**
   * JSON转XML转换器（内部实现）
   * @private
   */
  _jsonToXmlConverter: function(obj, rootName = 'root') {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    
    const convertToXml = (obj, nodeName) => {
      if (obj === null) {
        return `<${nodeName} xsi:nil="true"/>`;
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => {
          const itemName = nodeName.endsWith('s') ? nodeName.slice(0, -1) : 'item';
          return convertToXml(item, itemName);
        }).join('\n');
      }
      
      if (typeof obj === 'object') {
        let result = `<${nodeName}>`;
        
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            result += '\n  ' + convertToXml(obj[key], key);
          }
        }
        
        result += `\n</${nodeName}>`;
        return result;
      }
      
      // 处理基本类型
      const escapedValue = String(obj)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      
      return `<${nodeName}>${escapedValue}</${nodeName}>`;
    };
    
    xml += convertToXml(obj, rootName);
    return xml;
  },
  
  /**
   * XML转JSON转换器（内部实现）
   * @private
   */
  _xmlToJsonConverter: function(xml) {
    // 简单实现，实际应使用专门的XML解析库
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    
    const convertXmlToJson = (node) => {
      // 如果是文本节点
      if (node.nodeType === 3) {
        return node.nodeValue.trim();
      }
      
      // 如果是元素节点
      if (node.nodeType === 1) {
        const obj = {};
        
        // 处理属性
        if (node.attributes.length > 0) {
          obj['@attributes'] = {};
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            obj['@attributes'][attr.nodeName] = attr.nodeValue;
          }
        }
        
        // 处理子节点
        for (let i = 0; i < node.childNodes.length; i++) {
          const childNode = node.childNodes[i];
          
          // 跳过空白文本节点
          if (childNode.nodeType === 3 && !childNode.nodeValue.trim()) {
            continue;
          }
          
          const childName = childNode.nodeName;
          
          if (childName === '#text') {
            // 如果只有一个文本子节点，直接返回文本值
            if (node.childNodes.length === 1) {
              return childNode.nodeValue.trim();
            } else {
              obj['#text'] = childNode.nodeValue.trim();
            }
          } else {
            const childValue = convertXmlToJson(childNode);
            
            // 处理重复的标签名
            if (obj[childName]) {
              if (!Array.isArray(obj[childName])) {
                obj[childName] = [obj[childName]];
              }
              obj[childName].push(childValue);
            } else {
              obj[childName] = childValue;
            }
          }
        }
        
        return obj;
      }
      
      return null;
    };
    
    return convertXmlToJson(xmlDoc.documentElement);
  },
  
  /**
   * JSON转CSV转换器（内部实现）
   * @private
   */
  _jsonToCsvConverter: function(jsonObj) {
    if (!Array.isArray(jsonObj)) {
      throw new Error('只能转换JSON数组');
    }
    
    if (jsonObj.length === 0) {
      return '';
    }
    
    // 获取所有可能的列
    const columns = new Set();
    jsonObj.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach(key => columns.add(key));
      }
    });
    
    const columnArray = Array.from(columns);
    
    // 创建CSV头
    let csv = columnArray.map(column => `"${column}"`).join(',') + '\n';
    
    // 添加数据行
    jsonObj.forEach(item => {
      const row = columnArray.map(column => {
        const value = item[column];
        if (value === undefined || value === null) {
          return '';
        } else if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        } else {
          return String(value);
        }
      });
      
      csv += row.join(',') + '\n';
    });
    
    return csv;
  },
  
  /**
   * CSV转JSON转换器（内部实现）
   * @private
   */
  _csvToJsonConverter: function(csv) {
    const lines = csv.split('\n');
    
    if (lines.length < 2) {
      return [];
    }
    
    // 解析CSV行
    const parseCSVLine = (line) => {
      const result = [];
      let inQuotes = false;
      let currentValue = '';
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
            // 处理双引号转义
            currentValue += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      result.push(currentValue);
      return result;
    };
    
    // 解析标题行
    const headers = parseCSVLine(lines[0]);
    
    // 解析数据行
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = parseCSVLine(lines[i]);
      const obj = {};
      
      for (let j = 0; j < headers.length; j++) {
        if (j < values.length) {
          const value = values[j];
          
          // 尝试转换数值和布尔值
          if (value === '') {
            obj[headers[j]] = null;
          } else if (value.toLowerCase() === 'true') {
            obj[headers[j]] = true;
          } else if (value.toLowerCase() === 'false') {
            obj[headers[j]] = false;
          } else if (!isNaN(value) && value.trim() !== '') {
            obj[headers[j]] = Number(value);
          } else {
            obj[headers[j]] = value;
          }
        }
      }
      
      result.push(obj);
    }
    
    return result;
  }
};

// 导出模块
window.JsonConverter = JsonConverter;