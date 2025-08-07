/**
 * JSON格式化工具 - 核心功能模块
 */

// 核心功能
const JsonFormatterCore = {
  /**
   * 格式化JSON字符串
   * @param {string} jsonStr - JSON字符串
   * @param {object} options - 格式化选项
   * @returns {object} 包含格式化结果和统计信息
   */
  formatJson: function(jsonStr, options = {}) {
    const defaultOptions = {
      indentSize: 4,
      sortKeys: false,
      useTab: false
    };
    
    const opts = { ...defaultOptions, ...options };
    
    try {
      // 解析JSON字符串
      const jsonObj = JSON.parse(jsonStr);
      
      // 获取统计信息
      const stats = this.getJsonStats(jsonObj);
      
      // 格式化JSON
      const indent = opts.useTab ? '\t' : ' '.repeat(opts.indentSize);
      let formattedJson;
      
      if (opts.sortKeys) {
        formattedJson = JSON.stringify(this.sortObjectKeys(jsonObj), null, indent);
      } else {
        formattedJson = JSON.stringify(jsonObj, null, indent);
      }
      
      return {
        success: true,
        result: formattedJson,
        stats: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * 压缩JSON字符串
   * @param {string} jsonStr - JSON字符串
   * @returns {object} 包含压缩结果
   */
  minifyJson: function(jsonStr) {
    try {
      const jsonObj = JSON.parse(jsonStr);
      return {
        success: true,
        result: JSON.stringify(jsonObj)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  /**
   * 验证JSON字符串
   * @param {string} jsonStr - JSON字符串
   * @returns {object} 验证结果
   */
  validateJson: function(jsonStr) {
    try {
      JSON.parse(jsonStr);
      return {
        valid: true
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
        position: this.getErrorPosition(error)
      };
    }
  },
  
  /**
   * 获取JSON错误位置
   * @param {Error} error - JSON解析错误
   * @returns {object|null} 错误位置信息
   */
  getErrorPosition: function(error) {
    const match = error.message.match(/at position (\d+)/);
    if (match && match[1]) {
      const pos = parseInt(match[1], 10);
      return { position: pos };
    }
    return null;
  },
  
  /**
   * 获取JSON统计信息
   * @param {object} jsonObj - JSON对象
   * @returns {object} 统计信息
   */
  getJsonStats: function(jsonObj) {
    const jsonStr = JSON.stringify(jsonObj);
    const size = new Blob([jsonStr]).size;
    
    let nodeCount = 0;
    let maxDepth = 0;
    
    const countNodes = (obj, depth = 0) => {
      nodeCount++;
      maxDepth = Math.max(maxDepth, depth);
      
      if (obj && typeof obj === 'object') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            countNodes(obj[key], depth + 1);
          }
        }
      }
    };
    
    countNodes(jsonObj);
    
    return {
      size: size,
      nodes: nodeCount,
      depth: maxDepth
    };
  },
  
  /**
   * 递归排序对象键名
   * @param {object} obj - 要排序的对象
   * @returns {object} 排序后的对象
   */
  sortObjectKeys: function(obj) {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
      return obj;
    }
    
    const sortedObj = {};
    const keys = Object.keys(obj).sort();
    
    for (const key of keys) {
      sortedObj[key] = this.sortObjectKeys(obj[key]);
    }
    
    return sortedObj;
  }
};

// 导出模块
window.JsonFormatterCore = JsonFormatterCore;