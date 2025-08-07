/**
 * JSON格式化工具 - 查询模块
 */

// JSON路径查询功能
const JsonPathQuery = {
  /**
   * 执行JSONPath查询
   * @param {object} jsonObj - JSON对象
   * @param {string} path - JSONPath表达式
   * @returns {object} 查询结果
   */
  query: function(jsonObj, path) {
    try {
      // 简单的JSONPath实现
      if (!path || path === '$') {
        return {
          success: true,
          result: jsonObj
        };
      }
      
      // 处理基本路径查询
      const result = this.evaluatePath(jsonObj, path);
      
      return {
        success: true,
        result: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * 评估JSONPath表达式
   * @param {object} obj - JSON对象
   * @param {string} path - JSONPath表达式
   * @returns {*} 查询结果
   */
  evaluatePath: function(obj, path) {
    // 确保路径以$开头
    if (!path.startsWith('$')) {
      path = '$' + path;
    }
    
    // 分割路径
    const segments = path.split('.');
    
    // 从根开始遍历
    let current = obj;
    
    for (let i = 0; i < segments.length; i++) {
      let segment = segments[i];
      
      // 处理根节点
      if (segment === '$') continue;
      
      // 处理数组索引，如 book[0]
      const arrayMatch = segment.match(/^([^\[]+)\[(\d+)\]$/);
      if (arrayMatch) {
        const prop = arrayMatch[1];
        const index = parseInt(arrayMatch[2]);
        
        if (!current[prop] || !Array.isArray(current[prop])) {
          return undefined;
        }
        
        if (index >= current[prop].length) {
          return undefined;
        }
        
        current = current[prop][index];
        continue;
      }
      
      // 处理通配符，如 book[*]
      const wildcardMatch = segment.match(/^([^\[]+)\[\*\]$/);
      if (wildcardMatch) {
        const prop = wildcardMatch[1];
        
        if (!current[prop] || !Array.isArray(current[prop])) {
          return undefined;
        }
        
        // 如果是最后一个段，返回整个数组
        if (i === segments.length - 1) {
          return current[prop];
        }
        
        // 否则，收集所有匹配的子元素
        const results = [];
        const nextSegment = segments[i + 1];
        
        for (const item of current[prop]) {
          const value = this.evaluatePath(item, nextSegment);
          if (value !== undefined) {
            results.push(value);
          }
        }
        
        return results;
      }
      
      // 处理过滤表达式，如 book[?(@.price < 10)]
      const filterMatch = segment.match(/^([^\[]+)\[\?\((.+)\)\]$/);
      if (filterMatch) {
        const prop = filterMatch[1];
        const condition = filterMatch[2];
        
        if (!current[prop] || !Array.isArray(current[prop])) {
          return undefined;
        }
        
        // 简单过滤器实现
        const results = current[prop].filter(item => {
          try {
            // 替换@为item
            const expr = condition.replace(/@/g, 'item');
            return eval(expr);
          } catch (e) {
            return false;
          }
        });
        
        return results;
      }
      
      // 处理普通属性
      if (current[segment] === undefined) {
        return undefined;
      }
      
      current = current[segment];
    }
    
    return current;
  },
  
  /**
   * 获取常用查询示例
   * @returns {Array} 示例数组
   */
  getExamples: function() {
    return [
      { name: '根节点', path: '$.' },
      { name: '第一本书', path: '$.store.book[0]' },
      { name: '所有书名', path: '$.store.book[*].title' },
      { name: '价格小于10的书', path: '$.store.book[?(@.price < 10)]' }
    ];
  }
};

// 导出模块
window.JsonPathQuery = JsonPathQuery;