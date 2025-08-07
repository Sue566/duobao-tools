/**
 * JSON格式化工具 - 格式转换模块
 */

const utils = require('./utils');

const converter = {
  // JSON转YAML转换器（简单实现）
  jsonToYaml: function(json) {
    try {
      const obj = typeof json === 'string' ? JSON.parse(json) : json;
      return this.jsonToYamlConverter(obj);
    } catch (error) {
      throw new Error(`JSON解析错误: ${error.message}`);
    }
  },
  
  // JSON对象转YAML
  jsonToYamlConverter: function(obj, indent = 0) {
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
          yaml += '\n' + this.jsonToYamlConverter(item, indent + 2);
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
          yaml += '\n' + this.jsonToYamlConverter(value, indent + 2);
        } else if (typeof value === 'string') {
          yaml += `"${value}"\n`;
        } else {
          yaml += `${value}\n`;
        }
      }
    }
    
    return yaml;
  },

  // YAML转JSON转换器（简单实现）
  yamlToJson: function(yaml) {
    try {
      return this.yamlToJsonConverter(yaml);
    } catch (error) {
      throw new Error(`YAML解析错误: ${error.message}`);
    }
  },
  
  // YAML字符串转JSON对象
  yamlToJsonConverter: function(yaml) {
    // 这是一个非常简化的实现，实际应该使用专门的YAML解析库
    // 这里仅作为示例，不能处理复杂的YAML
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

  // JSON转XML（简单实现）
  jsonToXml: function(json) {
    try {
      const obj = typeof json === 'string' ? JSON.parse(json) : json;
      return this.jsonToXmlConverter(obj);
    } catch (error) {
      throw new Error(`JSON解析错误: ${error.message}`);
    }
  },
  
  // JSON对象转XML
  jsonToXmlConverter: function(obj, rootName = 'root') {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    
    const convertToXml = (obj, name) => {
      if (obj === null) {
        return `<${name} xsi:nil="true"/>`;
      } else if (Array.isArray(obj)) {
        return obj.map(item => {
          if (typeof item === 'object' && item !== null) {
            return convertToXml(item, 'item');
          } else {
            return `<${name}>${item}</${name}>`;
          }
        }).join('\n');
      } else if (typeof obj === 'object') {
        let result = `<${name}>`;
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === 'object' && value !== null) {
              result += '\n  ' + convertToXml(value, key);
            } else {
              result += `\n  <${key}>${value}</${key}>`;
            }
          }
        }
        result += `\n</${name}>`;
        return result;
      } else {
        return `<${name}>${obj}</${name}>`;
      }
    };
    
    xml += convertToXml(obj, rootName);
    return xml;
  },

  // XML转JSON（简单实现）
  xmlToJson: function(xml) {
    try {
      // 这是一个非常简化的实现，实际应该使用专门的XML解析库
      // 这里仅作为示例，不能处理复杂的XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      
      const convertXmlToJson = (node) => {
        // 如果是文本节点，直接返回文本内容
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
            
            if (childNode.nodeType === 1) {
              const childName = childNode.nodeName;
              
              // 检查是否有同名子节点
              const siblings = Array.from(node.childNodes).filter(n => 
                n.nodeType === 1 && n.nodeName === childName
              );
              
              if (siblings.length > 1) {
                // 如果有多个同名子节点，创建数组
                if (!obj[childName]) {
                  obj[childName] = [];
                }
                obj[childName].push(convertXmlToJson(childNode));
              } else {
                // 单个子节点
                obj[childName] = convertXmlToJson(childNode);
              }
            } else if (childNode.nodeType === 3 && childNode.nodeValue.trim()) {
              // 文本内容
              if (node.childNodes.length === 1) {
                return childNode.nodeValue.trim();
              } else {
                obj['#text'] = childNode.nodeValue.trim();
              }
            }
          }
          
          return obj;
        }
        
        return null;
      };
      
      return convertXmlToJson(xmlDoc.documentElement);
    } catch (error) {
      throw new Error(`XML解析错误: ${error.message}`);
    }
  },

  // JSON转CSV（简单实现）
  jsonToCsv: function(json) {
    try {
      const obj = typeof json === 'string' ? JSON.parse(json) : json;
      
      // 确保输入是数组
      if (!Array.isArray(obj)) {
        throw new Error('JSON必须是对象数组才能转换为CSV');
      }
      
      if (obj.length === 0) {
        return '';
      }
      
      // 获取所有可能的列
      const columns = new Set();
      obj.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => columns.add(key));
        }
      });
      
      const columnArray = Array.from(columns);
      
      // 创建CSV头
      let csv = columnArray.join(',') + '\n';
      
      // 添加数据行
      obj.forEach(item => {
        const row = columnArray.map(column => {
          const value = item[column];
          
          // 处理不同类型的值
          if (value === undefined || value === null) {
            return '';
          } else if (typeof value === 'string') {
            // 转义引号并用引号包裹
            return `"${value.replace(/"/g, '""')}"`;
          } else if (typeof value === 'object') {
            // 对象和数组转为JSON字符串
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          } else {
            return value;
          }
        }).join(',');
        
        csv += row + '\n';
      });
      
      return csv;
    } catch (error) {
      throw new Error(`JSON转CSV错误: ${error.message}`);
    }
  },

  // CSV转JSON（简单实现）
  csvToJson: function(csv) {
    try {
      const lines = csv.split('\n');
      
      // 移除空行
      while (lines.length > 0 && !lines[lines.length - 1].trim()) {
        lines.pop();
      }
      
      if (lines.length < 2) {
        return [];
      }
      
      // 解析CSV行，处理引号内的逗号
      const parseCSVLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            // 处理引号
            if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
              // 转义的引号
              current += '"';
              i++;
            } else {
              // 开始或结束引号
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            // 非引号内的逗号，分隔字段
            result.push(current);
            current = '';
          } else {
            // 普通字符
            current += char;
          }
        }
        
        // 添加最后一个字段
        result.push(current);
        
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
        
        // 将值映射到标题
        for (let j = 0; j < headers.length; j++) {
          if (j < values.length) {
            let value = values[j];
            
            // 尝试解析数字和布尔值
            if (value === '') {
              obj[headers[j]] = '';
            } else if (value === 'true') {
              obj[headers[j]] = true;
            } else if (value === 'false') {
              obj[headers[j]] = false;
            } else if (value === 'null') {
              obj[headers[j]] = null;
            } else if (!isNaN(value) && value.trim() !== '') {
              obj[headers[j]] = Number(value);
            } else {
              // 尝试解析JSON字符串
              try {
                if (value.startsWith('{') || value.startsWith('[')) {
                  obj[headers[j]] = JSON.parse(value);
                } else {
                  obj[headers[j]] = value;
                }
              } catch (e) {
                obj[headers[j]] = value;
              }
            }
          } else {
            obj[headers[j]] = '';
          }
        }
        
        result.push(obj);
      }
      
      return result;
    } catch (error) {
      throw new Error(`CSV转JSON错误: ${error.message}`);
    }
  },

  // 执行转换
  executeConversion: function(input, conversionType, elements) {
    try {
      const { convertResult } = elements;
      
      if (!input) {
        convertResult.textContent = '请输入需要转换的数据';
        convertResult.classList.add('error');
        return;
      }
      
      let result;
      
      switch (conversionType) {
        case 'json-to-yaml':
          result = this.jsonToYaml(input);
          convertResult.textContent = result;
          break;
        case 'yaml-to-json':
          result = this.yamlToJson(input);
          const formattedJson = JSON.stringify(result, null, 2);
          convertResult.innerHTML = utils.syntaxHighlight(formattedJson);
          break;
        case 'json-to-xml':
          result = this.jsonToXml(input);
          convertResult.textContent = result;
          break;
        case 'xml-to-json':
          result = this.xmlToJson(input);
          const xmlToJsonFormatted = JSON.stringify(result, null, 2);
          convertResult.innerHTML = utils.syntaxHighlight(xmlToJsonFormatted);
          break;
        case 'json-to-csv':
          result = this.jsonToCsv(input);
          convertResult.textContent = result;
          break;
        case 'csv-to-json':
          result = this.csvToJson(input);
          const csvToJsonFormatted = JSON.stringify(result, null, 2);
          convertResult.innerHTML = utils.syntaxHighlight(csvToJsonFormatted);
          break;
        default:
          throw new Error('不支持的转换类型');
      }
      
      convertResult.classList.remove('error');
      return result;
    } catch (error) {
      convertResult.textContent = `错误: ${error.message}`;
      convertResult.classList.add('error');
      throw error;
    }
  }
};

module.exports = converter;