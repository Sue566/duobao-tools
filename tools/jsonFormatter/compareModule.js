/**
 * JSON格式化工具 - 比较模块
 */

// JSON比较功能
const JsonCompare = {
  /**
   * 比较两个JSON对象
   * @param {object} obj1 - 第一个JSON对象
   * @param {object} obj2 - 第二个JSON对象
   * @returns {object} 比较结果
   */
  compare: function(obj1, obj2) {
    const result = {
      added: [],
      removed: [],
      changed: [],
      unchanged: []
    };
    
    // 比较两个对象
    this._compareObjects(obj1, obj2, '', result);
    
    return result;
  },
  
  /**
   * 递归比较对象（内部方法）
   * @private
   */
  _compareObjects: function(obj1, obj2, path, result) {
    // 获取所有键
    const keys1 = obj1 !== null && typeof obj1 === 'object' ? Object.keys(obj1) : [];
    const keys2 = obj2 !== null && typeof obj2 === 'object' ? Object.keys(obj2) : [];
    
    // 检查删除的键
    for (const key of keys1) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (!keys2.includes(key)) {
        result.removed.push({
          path: currentPath,
          value: obj1[key]
        });
        continue;
      }
      
      // 递归比较值
      if (obj1[key] !== null && obj2[key] !== null && 
          typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        this._compareObjects(obj1[key], obj2[key], currentPath, result);
      } else if (obj1[key] !== obj2[key]) {
        result.changed.push({
          path: currentPath,
          oldValue: obj1[key],
          newValue: obj2[key]
        });
      } else {
        result.unchanged.push({
          path: currentPath,
          value: obj1[key]
        });
      }
    }
    
    // 检查添加的键
    for (const key of keys2) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (!keys1.includes(key)) {
        result.added.push({
          path: currentPath,
          value: obj2[key]
        });
      }
    }
  },
  
  /**
   * 格式化差异结果为HTML
   * @param {object} diff - 比较结果
   * @returns {string} HTML格式的差异结果
   */
  formatDiffToHtml: function(diff) {
    let html = '';
    
    if (diff.added.length > 0) {
      html += '<h4>添加的属性:</h4><ul>';
      for (const item of diff.added) {
        html += `<li class="diff-added"><strong>${item.path}</strong>: ${this._formatDiffValue(item.value)}</li>`;
      }
      html += '</ul>';
    }
    
    if (diff.removed.length > 0) {
      html += '<h4>删除的属性:</h4><ul>';
      for (const item of diff.removed) {
        html += `<li class="diff-removed"><strong>${item.path}</strong>: ${this._formatDiffValue(item.value)}</li>`;
      }
      html += '</ul>';
    }
    
    if (diff.changed.length > 0) {
      html += '<h4>修改的属性:</h4><ul>';
      for (const item of diff.changed) {
        html += `<li><strong>${item.path}</strong>: <span class="diff-removed">${this._formatDiffValue(item.oldValue)}</span> → <span class="diff-added">${this._formatDiffValue(item.newValue)}</span></li>`;
      }
      html += '</ul>';
    }
    
    if (diff.unchanged.length > 0) {
      html += '<h4>未变更的属性:</h4><ul>';
      for (const item of diff.unchanged) {
        html += `<li class="diff-unchanged"><strong>${item.path}</strong>: ${this._formatDiffValue(item.value)}</li>`;
      }
      html += '</ul>';
    }
    
    return html;
  },
  
  /**
   * 格式化差异值（内部方法）
   * @private
   */
  _formatDiffValue: function(value) {
    if (value === null) {
      return '<span class="json-null">null</span>';
    } else if (typeof value === 'string') {
      return `<span class="json-string">"${this._escapeHtml(value)}"</span>`;
    } else if (typeof value === 'number') {
      return `<span class="json-number">${value}</span>`;
    } else if (typeof value === 'boolean') {
      return `<span class="json-boolean">${value}</span>`;
    } else if (typeof value === 'object') {
      return '<span class="json-object">[对象]</span>';
    }
    
    return String(value);
  },
  
  /**
   * HTML转义（内部方法）
   * @private
   */
  _escapeHtml: function(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// 导出模块
window.JsonCompare = JsonCompare;