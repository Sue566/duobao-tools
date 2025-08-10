/**
 * JSON格式化工具 - 工具函数模块
 */

(function() {
  const utils = {
    // 格式化文件大小
    formatSize: function(bytes) {
      if (bytes < 1024) {
        return `${bytes} 字节`;
      } else if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(2)} KB`;
      } else {
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      }
    },

    // 计算节点数
    countNodes: function(obj, count = 0) {
      count++;
      
      if (obj !== null && typeof obj === 'object') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            count = this.countNodes(obj[key], count);
          }
        }
      }
      
      return count;
    },

    // 计算深度
    calculateDepth: function(obj, depth = 0) {
      if (obj === null || typeof obj !== 'object') {
        return depth;
      }
      
      let maxDepth = depth;
      
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const childDepth = this.calculateDepth(obj[key], depth + 1);
          maxDepth = Math.max(maxDepth, childDepth);
        }
      }
      
      return maxDepth;
    },

    // HTML转义
    escapeHtml: function(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    // 语法高亮
    syntaxHighlight: function(json) {
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key';
          } else {
            cls = 'json-string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      });
    },

    // 格式化差异值
    formatDiffValue: function(value) {
      if (value === null) {
        return '<span class="json-null">null</span>';
      } else if (typeof value === 'string') {
        return `<span class="json-string">"${this.escapeHtml(value)}"</span>`;
      } else if (typeof value === 'number') {
        return `<span class="json-number">${value}</span>`;
      } else if (typeof value === 'boolean') {
        return `<span class="json-boolean">${value}</span>`;
      } else if (typeof value === 'object') {
        return '<span class="json-object">[对象]</span>';
      }
      
      return String(value);
    }
  };

  // 将工具函数添加到全局命名空间
  window.jsonFormatter = window.jsonFormatter || {};
  window.jsonFormatter.utils = utils;
})();