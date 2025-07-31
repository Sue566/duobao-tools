/**
 * JSON格式化工具
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-code"></i> JSON格式化</h2>
          <p class="tool-description">格式化和验证JSON数据，提高可读性和查找错误。</p>
        </div>
        
        <div class="json-container">
          <div class="json-input-section">
            <div class="form-group">
              <label for="json-input">JSON输入</label>
              <textarea id="json-input" class="form-control" placeholder="在此粘贴JSON数据..."></textarea>
            </div>
            
            <div class="json-actions">
              <button id="format-btn" class="btn btn-success"><i class="fa fa-indent"></i> 格式化</button>
              <button id="minify-btn" class="btn"><i class="fa fa-compress"></i> 压缩</button>
              <button id="validate-btn" class="btn"><i class="fa fa-check-circle"></i> 验证</button>
              <button id="clear-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
            </div>
            
            <div class="json-options">
              <div class="form-check">
                <input type="checkbox" id="auto-format" checked />
                <label for="auto-format">自动格式化</label>
              </div>
              <div class="form-check">
                <input type="checkbox" id="sort-keys" />
                <label for="sort-keys">排序键值</label>
              </div>
              <div class="indent-option">
                <label for="indent-size">缩进大小:</label>
                <select id="indent-size" class="form-control form-control-sm">
                  <option value="2">2 空格</option>
                  <option value="4" selected>4 空格</option>
                  <option value="tab">Tab</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="json-output-section">
            <div class="json-output-header">
              <h3>格式化结果</h3>
              <div class="json-stats">
                <span id="json-stats">0 个字符 | 0 个键值对</span>
              </div>
            </div>
            
            <div class="json-output-wrapper">
              <pre id="json-output" class="json-output"></pre>
            </div>
            
            <div class="json-output-actions">
              <button id="copy-btn" class="btn"><i class="fa fa-copy"></i> 复制</button>
              <button id="download-btn" class="btn"><i class="fa fa-download"></i> 下载</button>
            </div>
          </div>
        </div>
        
        <div class="json-viewer-section">
          <div class="json-viewer-header">
            <h3>JSON树视图</h3>
            <div class="json-viewer-actions">
              <button id="expand-all" class="btn btn-sm"><i class="fa fa-plus-square-o"></i> 展开全部</button>
              <button id="collapse-all" class="btn btn-sm"><i class="fa fa-minus-square-o"></i> 折叠全部</button>
            </div>
          </div>
          
          <div class="json-viewer-wrapper">
            <div id="json-viewer" class="json-viewer"></div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('jsonFormatter', container.querySelector('.tool-header'));
      
      // 获取元素
      const jsonInput = container.querySelector('#json-input');
      const jsonOutput = container.querySelector('#json-output');
      const jsonViewer = container.querySelector('#json-viewer');
      const formatBtn = container.querySelector('#format-btn');
      const minifyBtn = container.querySelector('#minify-btn');
      const validateBtn = container.querySelector('#validate-btn');
      const clearBtn = container.querySelector('#clear-btn');
      const copyBtn = container.querySelector('#copy-btn');
      const downloadBtn = container.querySelector('#download-btn');
      const expandAllBtn = container.querySelector('#expand-all');
      const collapseAllBtn = container.querySelector('#collapse-all');
      const autoFormat = container.querySelector('#auto-format');
      const sortKeys = container.querySelector('#sort-keys');
      const indentSize = container.querySelector('#indent-size');
      const jsonStats = container.querySelector('#json-stats');
      
      // 默认示例
      const defaultJson = {
        "name": "多宝工具箱",
        "version": "1.0.0",
        "description": "实用在线工具集合",
        "categories": [
          "文本处理",
          "编码转换",
          "图片工具",
          "开发工具"
        ],
        "features": {
          "responsive": true,
          "darkMode": true,
          "offline": false,
          "tools": 20
        },
        "author": {
          "name": "多宝团队",
          "email": "support@example.com",
          "website": "https://www.example.com"
        },
        "license": "MIT"
      };
      
      jsonInput.value = JSON.stringify(defaultJson);
      
      // 格式化JSON
      function formatJson(json, indent = 4, doSortKeys = false) {
        try {
          let parsed;
          if (typeof json === 'string') {
            parsed = JSON.parse(json);
          } else {
            parsed = json;
          }
          
          let indentStr = indent === 'tab' ? '\t' : ' '.repeat(parseInt(indent));
          
          let formatted = JSON.stringify(parsed, doSortKeys ? sortKeysFunction : null, indentStr);
          return { success: true, result: formatted, data: parsed };
        } catch (e) {
          return { success: false, error: e.message };
        }
      }
      
      // 排序键值函数
      function sortKeysFunction(key, value) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          return Object.keys(value).sort().reduce((sorted, key) => {
            sorted[key] = value[key];
            return sorted;
          }, {});
        }
        return value;
      }
      
      // 压缩JSON
      function minifyJson(json) {
        try {
          let parsed;
          if (typeof json === 'string') {
            parsed = JSON.parse(json);
          } else {
            parsed = json;
          }
          
          let minified = JSON.stringify(parsed);
          return { success: true, result: minified, data: parsed };
        } catch (e) {
          return { success: false, error: e.message };
        }
      }
      
      // 验证JSON
      function validateJson(json) {
        try {
          let parsed;
          if (typeof json === 'string') {
            parsed = JSON.parse(json);
          } else {
            parsed = json;
          }
          
          return { success: true, data: parsed };
        } catch (e) {
          return { success: false, error: e.message };
        }
      }
      
      // 更新JSON统计信息
      function updateJsonStats(json) {
        if (typeof json === 'string') {
          try {
            json = JSON.parse(json);
          } catch (e) {
            jsonStats.textContent = `${jsonInput.value.length} 个字符 | 无效JSON`;
            return;
          }
        }
        
        const charCount = JSON.stringify(json).length;
        const keyCount = countKeys(json);
        
        jsonStats.textContent = `${charCount} 个字符 | ${keyCount} 个键值对`;
      }
      
      // 计算键值对数量
      function countKeys(obj, count = 0) {
        if (obj && typeof obj === 'object') {
          if (Array.isArray(obj)) {
            obj.forEach(item => {
              count = countKeys(item, count);
            });
          } else {
            count += Object.keys(obj).length;
            Object.values(obj).forEach(value => {
              count = countKeys(value, count);
            });
          }
        }
        return count;
      }
      
      // 创建JSON树视图
      function createJsonTreeView(json, container) {
        container.innerHTML = '';
        
        try {
          if (typeof json === 'string') {
            json = JSON.parse(json);
          }
          
          const rootElement = document.createElement('div');
          rootElement.className = 'json-tree';
          
          if (Array.isArray(json)) {
            appendArrayNode(rootElement, json, 'root');
          } else if (typeof json === 'object' && json !== null) {
            appendObjectNode(rootElement, json, 'root');
          } else {
            appendValueNode(rootElement, json, 'root');
          }
          
          container.appendChild(rootElement);
          
          // 添加折叠/展开功能
          container.querySelectorAll('.json-toggle').forEach(toggle => {
            toggle.addEventListener('click', function() {
              const content = this.parentNode.querySelector('.json-content');
              if (content) {
                content.classList.toggle('hidden');
                this.textContent = content.classList.contains('hidden') ? '+' : '-';
              }
            });
          });
        } catch (e) {
          container.innerHTML = `<div class="json-error">无法创建树视图: ${e.message}</div>`;
        }
      }
      
      // 添加对象节点
      function appendObjectNode(parent, obj, key) {
        const node = document.createElement('div');
        node.className = 'json-object';
        
        const keyElement = document.createElement('span');
        keyElement.className = 'json-key';
        keyElement.textContent = key !== 'root' ? `"${key}": ` : '';
        
        const toggle = document.createElement('span');
        toggle.className = 'json-toggle';
        toggle.textContent = '-';
        
        const bracketOpen = document.createElement('span');
        bracketOpen.className = 'json-bracket';
        bracketOpen.textContent = '{';
        
        const content = document.createElement('div');
        content.className = 'json-content';
        
        const bracketClose = document.createElement('span');
        bracketClose.className = 'json-bracket';
        bracketClose.textContent = '}';
        
        node.appendChild(keyElement);
        node.appendChild(toggle);
        node.appendChild(bracketOpen);
        node.appendChild(content);
        node.appendChild(bracketClose);
        
        const keys = Object.keys(obj);
        keys.forEach((k, i) => {
          const value = obj[k];
          
          if (Array.isArray(value)) {
            appendArrayNode(content, value, k);
          } else if (typeof value === 'object' && value !== null) {
            appendObjectNode(content, value, k);
          } else {
            appendValueNode(content, value, k);
          }
          
          if (i < keys.length - 1) {
            const comma = document.createElement('span');
            comma.className = 'json-comma';
            comma.textContent = ',';
            content.appendChild(comma);
          }
        });
        
        parent.appendChild(node);
      }
      
      // 添加数组节点
      function appendArrayNode(parent, arr, key) {
        const node = document.createElement('div');
        node.className = 'json-array';
        
        const keyElement = document.createElement('span');
        keyElement.className = 'json-key';
        keyElement.textContent = key !== 'root' ? `"${key}": ` : '';
        
        const toggle = document.createElement('span');
        toggle.className = 'json-toggle';
        toggle.textContent = '-';
        
        const bracketOpen = document.createElement('span');
        bracketOpen.className = 'json-bracket';
        bracketOpen.textContent = '[';
        
        const content = document.createElement('div');
        content.className = 'json-content';
        
        const bracketClose = document.createElement('span');
        bracketClose.className = 'json-bracket';
        bracketClose.textContent = ']';
        
        node.appendChild(keyElement);
        node.appendChild(toggle);
        node.appendChild(bracketOpen);
        node.appendChild(content);
        node.appendChild(bracketClose);
        
        arr.forEach((item, i) => {
          if (Array.isArray(item)) {
            appendArrayNode(content, item, i);
          } else if (typeof item === 'object' && item !== null) {
            appendObjectNode(content, item, i);
          } else {
            appendValueNode(content, item, i);
          }
          
          if (i < arr.length - 1) {
            const comma = document.createElement('span');
            comma.className = 'json-comma';
            comma.textContent = ',';
            content.appendChild(comma);
          }
        });
        
        parent.appendChild(node);
      }
      
      // 添加值节点
      function appendValueNode(parent, value, key) {
        const node = document.createElement('div');
        node.className = 'json-value';
        
        const keyElement = document.createElement('span');
        keyElement.className = 'json-key';
        keyElement.textContent = key !== 'root' ? `"${key}": ` : '';
        
        const valueElement = document.createElement('span');
        
        if (typeof value === 'string') {
          valueElement.className = 'json-string';
          valueElement.textContent = `"${value}"`;
        } else if (typeof value === 'number') {
          valueElement.className = 'json-number';
          valueElement.textContent = value;
        } else if (typeof value === 'boolean') {
          valueElement.className = 'json-boolean';
          valueElement.textContent = value;
        } else if (value === null) {
          valueElement.className = 'json-null';
          valueElement.textContent = 'null';
        } else {
          valueElement.className = 'json-unknown';
          valueElement.textContent = value;
        }
        
        node.appendChild(keyElement);
        node.appendChild(valueElement);
        parent.appendChild(node);
      }
      
      // 处理JSON
      function processJson() {
        const input = jsonInput.value.trim();
        if (!input) {
          jsonOutput.textContent = '';
          jsonViewer.innerHTML = '';
          jsonStats.textContent = '0 个字符 | 0 个键值对';
          return;
        }
        
        const indent = indentSize.value;
        const doSortKeys = sortKeys.checked;
        
        const result = formatJson(input, indent, doSortKeys);
        
        if (result.success) {
          // 语法高亮
          jsonOutput.innerHTML = syntaxHighlight(result.result);
          
          // 创建树视图
          createJsonTreeView(result.data, jsonViewer);
          
          // 更新统计信息
          updateJsonStats(result.data);
        } else {
          jsonOutput.innerHTML = `<span class="json-error">错误: ${result.error}</span>`;
          jsonViewer.innerHTML = `<div class="json-error">无效的JSON: ${result.error}</div>`;
          jsonStats.textContent = `${input.length} 个字符 | 无效JSON`;
        }
      }
      
      // JSON语法高亮
      function syntaxHighlight(json) {
        if (typeof json !== 'string') {
          json = JSON.stringify(json, null, 2);
        }
        
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
          let cls = 'json-number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'json-key';
              match = match.replace(/:$/, '');
            } else {
              cls = 'json-string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
          } else if (/null/.test(match)) {
            cls = 'json-null';
          }
          return `<span class="${cls}">${match}</span>`;
        });
      }
      
      // 事件监听
      formatBtn.addEventListener('click', () => {
        const indent = indentSize.value;
        const doSortKeys = sortKeys.checked;
        const result = formatJson(jsonInput.value, indent, doSortKeys);
        
        if (result.success) {
          jsonInput.value = result.result;
          processJson();
        } else {
          showToast(`格式化失败: ${result.error}`, 'error');
        }
      });
      
      minifyBtn.addEventListener('click', () => {
        const result = minifyJson(jsonInput.value);
        
        if (result.success) {
          jsonInput.value = result.result;
          processJson();
        } else {
          showToast(`压缩失败: ${result.error}`, 'error');
        }
      });
      
      validateBtn.addEventListener('click', () => {
        const result = validateJson(jsonInput.value);
        
        if (result.success) {
          showToast('JSON格式有效', 'success');
        } else {
          showToast(`JSON格式无效: ${result.error}`, 'error');
        }
      });
      
      clearBtn.addEventListener('click', () => {
        jsonInput.value = '';
        jsonOutput.textContent = '';
        jsonViewer.innerHTML = '';
        jsonStats.textContent = '0 个字符 | 0 个键值对';
      });
      
      copyBtn.addEventListener('click', () => {
        const text = jsonOutput.textContent;
        if (text) {
          copyToClipboard(text);
        } else {
          showToast('没有内容可复制', 'warning');
        }
      });
      
      downloadBtn.addEventListener('click', () => {
        const text = jsonOutput.textContent;
        if (text) {
          const blob = new Blob([text], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'formatted.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          showToast('JSON已下载', 'success');
        } else {
          showToast('没有内容可下载', 'warning');
        }
      });
      
      expandAllBtn.addEventListener('click', () => {
        jsonViewer.querySelectorAll('.json-content').forEach(content => {
          content.classList.remove('hidden');
        });
        
        jsonViewer.querySelectorAll('.json-toggle').forEach(toggle => {
          toggle.textContent = '-';
        });
      });
      
      collapseAllBtn.addEventListener('click', () => {
        jsonViewer.querySelectorAll('.json-content').forEach(content => {
          content.classList.add('hidden');
        });
        
        jsonViewer.querySelectorAll('.json-toggle').forEach(toggle => {
          toggle.textContent = '+';
        });
      });
      
      // 自动格式化
      jsonInput.addEventListener('input', () => {
        if (autoFormat.checked) {
          processJson();
        }
      });
      
      // 选项变更
      indentSize.addEventListener('change', processJson);
      sortKeys.addEventListener('change', processJson);
      
      // 初始化
      processJson();
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .json-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .json-input-section {
          flex: 1;
          min-width: 300px;
        }
        
        .json-output-section {
          flex: 1;
          min-width: 300px;
          display: flex;
          flex-direction: column;
        }
        
        .json-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .json-options {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .form-check {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .indent-option {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .indent-option select {
          width: 100px;
        }
        
        .json-output-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .json-output-header h3 {
          margin: 0;
        }
        
        .json-stats {
          color: var(--text-muted);
          font-size: 14px;
        }
        
        .json-output-wrapper {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
          flex-grow: 1;
          overflow: auto;
          max-height: 400px;
          margin-bottom: 10px;
        }
        
        .json-output {
          font-family: monospace;
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
          margin: 0;
        }
        
        .json-output-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        
        .json-viewer-section {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .json-viewer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .json-viewer-header h3 {
          margin: 0;
        }
        
        .json-viewer-actions {
          display: flex;
          gap: 10px;
        }
        
        .json-viewer-wrapper {
          padding: 15px;
          max-height: 400px;
          overflow: auto;
        }
        
        .json-viewer {
          font-family: monospace;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .json-tree {
          margin-left: 0;
        }
        
        .json-object, .json-array {
          position: relative;
          margin-left: 20px;
        }
        
        .json-value {
          margin-left: 20px;
        }
        
        .json-key {
          color: var(--primary-color);
        }
        
        .json-string {
          color: #27ae60;
        }
        
        .json-number {
          color: #e67e22;
        }
        
        .json-boolean {
          color: #8e44ad;
        }
        
        .json-null {
          color: #7f8c8d;
        }
        
        .json-toggle {
          display: inline-block;
          width: 16px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          cursor: pointer;
          color: var(--text-muted);
          margin-right: 3px;
        }
        
        .json-content {
          margin-left: 20px;
        }
        
        .json-content.hidden {
          display: none;
        }
        
        .json-bracket {
          color: var(--text-color);
        }
        
        .json-comma {
          color: var(--text-color);
        }
        
        .json-error {
          color: #e74c3c;
        }
        
        @media (max-width: 768px) {
          .json-container {
            flex-direction: column;
          }
        }
      `;
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.jsonFormatter = tool;
})();