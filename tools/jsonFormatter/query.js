/**
 * JSON格式化工具 - JSONPath查询模块
 */

(function() {
  const query = {
    // JSONPath查询
    jsonPathQuery: function(obj, path) {
      // 简单实现，仅支持基本语法
      if (!path) return undefined;
      
      // 处理根路径
      if (path === '$') return obj;
      
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
            const value = this.jsonPathQuery(item, nextSegment);
            if (value !== undefined) {
              results.push(value);
            }
          }
          
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

    // 执行查询
    executeQuery: function(json, path, elements) {
      try {
        const { queryResult } = elements;
        
        if (!json) {
          queryResult.textContent = '请输入JSON数据';
          queryResult.classList.add('error');
          return;
        }
        
        if (!path) {
          queryResult.textContent = '请输入JSONPath查询表达式';
          queryResult.classList.add('error');
          return;
        }
        
        const parsedJson = JSON.parse(json);
        const result = this.jsonPathQuery(parsedJson, path);
        
        if (result === undefined || (Array.isArray(result) && result.length === 0)) {
          queryResult.textContent = '未找到匹配结果';
          queryResult.classList.add('warning');
        } else {
          const formattedResult = JSON.stringify(result, null, 2);
          queryResult.innerHTML = window.jsonFormatter.utils.syntaxHighlight(formattedResult);
          queryResult.classList.remove('error', 'warning');
        }
        
        return result;
      } catch (error) {
        queryResult.textContent = `错误: ${error.message}`;
        queryResult.classList.add('error');
        throw error;
      }
    },

    // 获取示例查询
    getExampleQueries: function() {
      return [
        { name: '根对象', path: '$' },
        { name: '属性访问', path: '$.store.book' },
        { name: '数组索引', path: '$.store.book[0]' },
        { name: '数组所有元素', path: '$.store.book[*]' },
        { name: '特定属性', path: '$.store.book[*].author' },
        { name: '嵌套属性', path: '$.store.book[0].title' },
        { name: '过滤数组', path: '$.store.book[*].price' }
      ];
    },

    // 初始化帮助对话框
    initHelpDialog: function(container) {
      const helpContent = `
        <h3>JSONPath 语法指南</h3>
        <table class="help-table">
          <tr>
            <th>语法</th>
            <th>描述</th>
            <th>示例</th>
          </tr>
          <tr>
            <td>$</td>
            <td>根对象</td>
            <td>$</td>
          </tr>
          <tr>
            <td>.</td>
            <td>子元素操作符</td>
            <td>$.store.book</td>
          </tr>
          <tr>
            <td>[]</td>
            <td>数组下标操作符</td>
            <td>$.store.book[0]</td>
          </tr>
          <tr>
            <td>[*]</td>
            <td>数组通配符</td>
            <td>$.store.book[*]</td>
          </tr>
          <tr>
            <td>..</td>
            <td>递归下降</td>
            <td>$..author</td>
          </tr>
        </table>
        <p>注意：此实现仅支持基本语法，不支持复杂的过滤器和脚本表达式。</p>
      `;
      
      const helpDialog = document.createElement('div');
      helpDialog.id = 'json-path-help';
      helpDialog.className = 'help-dialog';
      helpDialog.innerHTML = `
        <div class="help-content">
          <div class="help-header">
            <h2>JSONPath 帮助</h2>
            <button class="close-help">&times;</button>
          </div>
          <div class="help-body">
            ${helpContent}
          </div>
        </div>
      `;
      
      container.appendChild(helpDialog);
      
      // 关闭帮助按钮点击事件
      const closeHelp = helpDialog.querySelector('.close-help');
      closeHelp.addEventListener('click', () => {
        helpDialog.style.display = 'none';
      });
      
      return helpDialog;
    }
  };

  // 将查询模块添加到全局命名空间
  window.jsonFormatter = window.jsonFormatter || {};
  window.jsonFormatter.query = query;
})();