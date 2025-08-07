/**
 * JSON格式化工具 - 格式化和验证模块
 */

const utils = require('./utils');

const formatter = {
  // 格式化JSON
  formatJson: function(json, indent = 4, doSortKeys = false) {
    try {
      let parsedJson = JSON.parse(json);
      
      if (doSortKeys) {
        parsedJson = this.sortObjectKeys(parsedJson);
      }
      
      return JSON.stringify(parsedJson, null, indent);
    } catch (error) {
      throw new Error(`JSON解析错误: ${error.message}`);
    }
  },

  // 排序对象键
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
  },

  // 压缩JSON
  minifyJson: function(json) {
    try {
      const parsedJson = JSON.parse(json);
      return JSON.stringify(parsedJson);
    } catch (error) {
      throw new Error(`JSON解析错误: ${error.message}`);
    }
  },

  // 验证JSON
  validateJson: function(json) {
    try {
      JSON.parse(json);
      return { valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  },

  // 更新JSON统计信息
  updateJsonStats: function(json, statsElements) {
    const { jsonSize, jsonNodes, jsonDepth } = statsElements;
    
    const size = new TextEncoder().encode(JSON.stringify(json)).length;
    const nodes = utils.countNodes(json);
    const depth = utils.calculateDepth(json);
    
    jsonSize.textContent = utils.formatSize(size);
    jsonNodes.textContent = nodes;
    jsonDepth.textContent = depth;
  },

  // 处理JSON
  processJson: function(json, options, elements) {
    try {
      if (!json.trim()) return;
      
      const { indent, doSortKeys } = options;
      const { jsonOutput, jsonTree } = elements;
      
      const formattedJson = this.formatJson(json, indent, doSortKeys);
      jsonOutput.innerHTML = utils.syntaxHighlight(formattedJson);
      jsonOutput.classList.remove('error', 'success');
      
      const parsedJson = JSON.parse(json);
      this.updateJsonStats(parsedJson, elements);
      
      // 创建树视图
      if (typeof elements.createJsonTreeView === 'function') {
        elements.createJsonTreeView(parsedJson, jsonTree);
      }
      
      return parsedJson;
    } catch (error) {
      jsonOutput.textContent = `错误: ${error.message}`;
      jsonOutput.classList.add('error');
      jsonTree.innerHTML = '';
      throw error;
    }
  }
};

module.exports = formatter;