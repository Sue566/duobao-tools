/**
 * JSON格式化工具 - 比较模块
 */

(function() {
  const compare = {
    // 比较JSON对象
    compareJson: function(obj1, obj2) {
      const result = {
        added: [],
        removed: [],
        changed: [],
        unchanged: []
      };
      
      // 比较两个对象
      this.compareObjects(obj1, obj2, '', result);
      
      return result;
    },
    
    // 递归比较对象
    compareObjects: function(obj1, obj2, path, result) {
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
          this.compareObjects(obj1[key], obj2[key], currentPath, result);
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
    
    // 格式化差异结果
    formatDiff: function(diff) {
      let html = '';
      
      if (diff.added.length > 0) {
        html += '<h4>添加的属性:</h4><ul>';
        for (const item of diff.added) {
          html += `<li class="diff-added"><strong>${item.path}</strong>: ${window.jsonFormatter.utils.formatDiffValue(item.value)}</li>`;
        }
        html += '</ul>';
      }
      
      if (diff.removed.length > 0) {
        html += '<h4>删除的属性:</h4><ul>';
        for (const item of diff.removed) {
          html += `<li class="diff-removed"><strong>${item.path}</strong>: ${window.jsonFormatter.utils.formatDiffValue(item.value)}</li>`;
        }
        html += '</ul>';
      }
      
      if (diff.changed.length > 0) {
        html += '<h4>修改的属性:</h4><ul>';
        for (const item of diff.changed) {
          html += `<li><strong>${item.path}</strong>: <span class="diff-removed">${window.jsonFormatter.utils.formatDiffValue(item.oldValue)}</span> → <span class="diff-added">${window.jsonFormatter.utils.formatDiffValue(item.newValue)}</span></li>`;
        }
        html += '</ul>';
      }
      
      if (diff.unchanged.length > 0) {
        html += '<h4>未变更的属性:</h4><ul>';
        for (const item of diff.unchanged) {
          html += `<li class="diff-unchanged"><strong>${item.path}</strong>: ${window.jsonFormatter.utils.formatDiffValue(item.value)}</li>`;
        }
        html += '</ul>';
      }
      
      return html;
    },
    
    // 执行比较
    executeComparison: function(leftJson, rightJson, elements) {
      try {
        const { compareResult } = elements;
        
        if (!leftJson || !rightJson) {
          compareResult.textContent = '请输入两个JSON数据进行比较';
          compareResult.classList.add('error');
          return;
        }
        
        const parsedLeft = JSON.parse(leftJson);
        const parsedRight = JSON.parse(rightJson);
        
        const diff = this.compareJson(parsedLeft, parsedRight);
        compareResult.innerHTML = this.formatDiff(diff);
        compareResult.classList.remove('error');
        
        return diff;
      } catch (error) {
        compareResult.textContent = `错误: ${error.message}`;
        compareResult.classList.add('error');
        throw error;
      }
    }
  };

  // 将比较模块添加到全局命名空间
  window.jsonFormatter = window.jsonFormatter || {};
  window.jsonFormatter.compare = compare;
})();