/**
 * JSON格式化工具 - 树视图模块
 */

(function() {
  const treeView = {
    // 创建JSON树视图
    createJsonTreeView: function(json, container) {
      container.innerHTML = '';
      
      if (typeof json !== 'object' || json === null) {
        container.textContent = String(json);
        return;
      }
      
      const rootUl = document.createElement('ul');
      container.appendChild(rootUl);
      
      if (Array.isArray(json)) {
        this.appendArrayNode(rootUl, json);
      } else {
        this.appendObjectNode(rootUl, json);
      }
    },

    // 添加对象节点
    appendObjectNode: function(parent, obj, keyName = null) {
      const li = document.createElement('li');
      parent.appendChild(li);
      
      const keys = Object.keys(obj);
      
      if (keyName !== null) {
        const details = document.createElement('details');
        details.open = true;
        
        const summary = document.createElement('summary');
        summary.innerHTML = `<span class="tree-key">${window.jsonFormatter.utils.escapeHtml(keyName)}</span><span class="tree-colon">: </span><span class="tree-object">{${keys.length} 个属性}</span>`;
        
        details.appendChild(summary);
        li.appendChild(details);
        
        const ul = document.createElement('ul');
        details.appendChild(ul);
        
        for (const key of keys) {
          const value = obj[key];
          
          if (value === null) {
            this.appendValueNode(ul, value, key);
          } else if (typeof value === 'object') {
            if (Array.isArray(value)) {
              this.appendArrayNode(ul, value, key);
            } else {
              this.appendObjectNode(ul, value, key);
            }
          } else {
            this.appendValueNode(ul, value, key);
          }
        }
      } else {
        // 根对象
        const ul = document.createElement('ul');
        li.appendChild(ul);
        
        for (const key of keys) {
          const value = obj[key];
          
          if (value === null) {
            this.appendValueNode(ul, value, key);
          } else if (typeof value === 'object') {
            if (Array.isArray(value)) {
              this.appendArrayNode(ul, value, key);
            } else {
              this.appendObjectNode(ul, value, key);
            }
          } else {
            this.appendValueNode(ul, value, key);
          }
        }
      }
    },

    // 添加数组节点
    appendArrayNode: function(parent, arr, keyName = null) {
      const li = document.createElement('li');
      parent.appendChild(li);
      
      if (keyName !== null) {
        const details = document.createElement('details');
        details.open = true;
        
        const summary = document.createElement('summary');
        summary.innerHTML = `<span class="tree-key">${window.jsonFormatter.utils.escapeHtml(keyName)}</span><span class="tree-colon">: </span><span class="tree-array">[${arr.length} 个元素]</span>`;
        
        details.appendChild(summary);
        li.appendChild(details);
        
        const ul = document.createElement('ul');
        details.appendChild(ul);
        
        arr.forEach((item, index) => {
          if (item === null) {
            this.appendValueNode(ul, item, index);
          } else if (typeof item === 'object') {
            if (Array.isArray(item)) {
              this.appendArrayNode(ul, item, index);
            } else {
              this.appendObjectNode(ul, item, index);
            }
          } else {
            this.appendValueNode(ul, item, index);
          }
        });
      } else {
        // 根数组
        const ul = document.createElement('ul');
        li.appendChild(ul);
        
        arr.forEach((item, index) => {
          if (item === null) {
            this.appendValueNode(ul, item, index);
          } else if (typeof item === 'object') {
            if (Array.isArray(item)) {
              this.appendArrayNode(ul, item, index);
            } else {
              this.appendObjectNode(ul, item, index);
            }
          } else {
            this.appendValueNode(ul, item, index);
          }
        });
      }
    },

    // 添加值节点
    appendValueNode: function(parent, value, key) {
      const li = document.createElement('li');
      
      let valueClass = '';
      let displayValue = '';
      
      if (value === null) {
        valueClass = 'tree-null';
        displayValue = 'null';
      } else if (typeof value === 'string') {
        valueClass = 'tree-string';
        displayValue = `"${window.jsonFormatter.utils.escapeHtml(value)}"`;
      } else if (typeof value === 'number') {
        valueClass = 'tree-number';
        displayValue = value;
      } else if (typeof value === 'boolean') {
        valueClass = 'tree-boolean';
        displayValue = value;
      }
      
      li.innerHTML = `<span class="tree-key">${window.jsonFormatter.utils.escapeHtml(String(key))}</span><span class="tree-colon">: </span><span class="${valueClass}">${displayValue}</span>`;
      parent.appendChild(li);
    },

    // 展开所有节点
    expandAll: function(container) {
      const details = container.querySelectorAll('details');
      details.forEach(detail => {
        detail.open = true;
      });
    },

    // 折叠所有节点
    collapseAll: function(container) {
      const details = container.querySelectorAll('details');
      details.forEach(detail => {
        detail.open = false;
      });
    }
  };

  // 将树视图模块添加到全局命名空间
  window.jsonFormatter = window.jsonFormatter || {};
  window.jsonFormatter.treeView = treeView;
})();