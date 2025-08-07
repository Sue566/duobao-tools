/**
 * JSON格式化工具
 * 增强版：支持JSON路径查询、架构验证、转换和比较功能
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-code"></i> JSON格式化</h2>
          <p class="tool-description">格式化、验证、查询和转换JSON数据，提供树视图和路径查询功能。</p>
        </div>
        
        <div class="json-tabs">
          <div class="tab-header">
            <button class="tab-btn active" data-tab="format">格式化</button>
            <button class="tab-btn" data-tab="query">路径查询</button>
            <button class="tab-btn" data-tab="convert">转换</button>
            <button class="tab-btn" data-tab="compare">比较</button>
          </div>
          
          <div class="tab-content active" id="tab-format">
            <div class="json-container">
              <div class="json-input-section">
                <div class="form-group">
                  <label for="json-input">JSON输入</label>
                  <div class="textarea-with-actions">
                    <textarea id="json-input" class="form-control" placeholder="在此粘贴JSON数据..."></textarea>
                    <div class="textarea-actions">
                      <button id="paste-btn" class="btn btn-sm" title="从剪贴板粘贴"><i class="fa fa-clipboard"></i></button>
                      <button id="load-file-btn" class="btn btn-sm" title="从文件加载"><i class="fa fa-folder-open"></i></button>
                      <input type="file" id="file-input" accept=".json" style="display: none;">
                    </div>
                  </div>
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
          </div>
          
          <div class="tab-content" id="tab-query">
            <div class="query-container">
              <div class="query-input-section">
                <div class="form-group">
                  <label for="query-json-input">JSON数据</label>
                  <textarea id="query-json-input" class="form-control" placeholder="在此粘贴JSON数据..."></textarea>
                </div>
                
                <div class="form-group">
                  <label for="json-path">JSONPath查询</label>
                  <div class="path-input-wrapper">
                    <input type="text" id="json-path" class="form-control" placeholder="输入JSONPath表达式，例如 $.store.book[0].title" />
                    <button id="query-btn" class="btn btn-success">查询</button>
                  </div>
                </div>
                
                <div class="query-examples">
                  <h4>常用JSONPath示例</h4>
                  <div class="example-buttons">
                    <button class="example-btn" data-path="$.store.book[*].author">所有书籍作者</button>
                    <button class="example-btn" data-path="$..book[?(@.price<10)]">价格小于10的书</button>
                    <button class="example-btn" data-path="$..*">所有节点</button>
                    <button class="example-btn" data-path="$..book[-1:]">最后一本书</button>
                  </div>
                </div>
              </div>
              
              <div class="query-result-section">
                <div class="query-result-header">
                  <h3>查询结果</h3>
                </div>
                
                <div class="query-result-wrapper">
                  <pre id="query-result" class="query-result"></pre>
                </div>
              </div>
            </div>
          </div>
          
          <div class="tab-content" id="tab-convert">
            <div class="convert-container">
              <div class="convert-input-section">
                <div class="form-group">
                  <label for="convert-input">输入数据</label>
                  <textarea id="convert-input" class="form-control" placeholder="在此粘贴要转换的数据..."></textarea>
                </div>
                
                <div class="convert-options">
                  <div class="form-group">
                    <label>转换类型</label>
                    <div class="convert-type-buttons">
                      <button id="json-to-yaml" class="btn btn-sm">JSON → YAML</button>
                      <button id="yaml-to-json" class="btn btn-sm">YAML → JSON</button>
                      <button id="json-to-xml" class="btn btn-sm">JSON → XML</button>
                      <button id="xml-to-json" class="btn btn-sm">XML → JSON</button>
                      <button id="json-to-csv" class="btn btn-sm">JSON → CSV</button>
                      <button id="csv-to-json" class="btn btn-sm">CSV → JSON</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="convert-result-section">
                <div class="convert-result-header">
                  <h3>转换结果</h3>
                </div>
                
                <div class="convert-result-wrapper">
                  <pre id="convert-result" class="convert-result"></pre>
                </div>
                
                <div class="convert-result-actions">
                  <button id="copy-convert-btn" class="btn"><i class="fa fa-copy"></i> 复制</button>
                  <button id="download-convert-btn" class="btn"><i class="fa fa-download"></i> 下载</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="tab-content" id="tab-compare">
            <div class="compare-container">
              <div class="compare-input-section">
                <div class="compare-inputs">
                  <div class="form-group">
                    <label for="json-left">左侧JSON</label>
                    <textarea id="json-left" class="form-control" placeholder="在此粘贴第一个JSON..."></textarea>
                  </div>
                  
                  <div class="form-group">
                    <label for="json-right">右侧JSON</label>
                    <textarea id="json-right" class="form-control" placeholder="在此粘贴第二个JSON..."></textarea>
                  </div>
                </div>
                
                <div class="compare-actions">
                  <button id="compare-btn" class="btn btn-success"><i class="fa fa-exchange"></i> 比较</button>
                  <div class="form-check">
                    <input type="checkbox" id="ignore-order" checked />
                    <label for="ignore-order">忽略数组顺序</label>
                  </div>
                </div>
              </div>
              
              <div class="compare-result-section">
                <div class="compare-result-header">
                  <h3>比较结果</h3>
                </div>
                
                <div class="compare-result-wrapper">
                  <div id="compare-result" class="compare-result"></div>
                </div>
              </div>
            </div>
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
      
      // 获取额外元素
      const tabButtons = container.querySelectorAll('.tab-btn');
      const tabContents = container.querySelectorAll('.tab-content');
      const pasteBtn = container.querySelector('#paste-btn');
      const loadFileBtn = container.querySelector('#load-file-btn');
      const fileInput = container.querySelector('#file-input');
      
      // 查询相关元素
      const queryJsonInput = container.querySelector('#query-json-input');
      const jsonPath = container.querySelector('#json-path');
      const queryBtn = container.querySelector('#query-btn');
      const queryResult = container.querySelector('#query-result');
      const exampleBtns = container.querySelectorAll('.example-btn');
      
      // 转换相关元素
      const convertInput = container.querySelector('#convert-input');
      const convertResult = container.querySelector('#convert-result');
      const jsonToYaml = container.querySelector('#json-to-yaml');
      const yamlToJson = container.querySelector('#yaml-to-json');
      const jsonToXml = container.querySelector('#json-to-xml');
      const xmlToJson = container.querySelector('#xml-to-json');
      const jsonToCsv = container.querySelector('#json-to-csv');
      const csvToJson = container.querySelector('#csv-to-json');
      const copyConvertBtn = container.querySelector('#copy-convert-btn');
      const downloadConvertBtn = container.querySelector('#download-convert-btn');
      
      // 比较相关元素
      const jsonLeft = container.querySelector('#json-left');
      const jsonRight = container.querySelector('#json-right');
      const compareBtn = container.querySelector('#compare-btn');
      const ignoreOrder = container.querySelector('#ignore-order');
      const compareResult = container.querySelector('#compare-result');
      
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
      
      // 查询示例
      const queryExample = {
        "store": {
          "book": [
            {
              "category": "reference",
              "author": "Nigel Rees",
              "title": "Sayings of the Century",
              "price": 8.95
            },
            {
              "category": "fiction",
              "author": "Evelyn Waugh",
              "title": "Sword of Honour",
              "price": 12.99
            },
            {
              "category": "fiction",
              "author": "Herman Melville",
              "title": "Moby Dick",
              "isbn": "0-553-21311-3",
              "price": 8.99
            },
            {
              "category": "fiction",
              "author": "J. R. R. Tolkien",
              "title": "The Lord of the Rings",
              "isbn": "0-395-19395-8",
              "price": 22.99
            }
          ],
          "bicycle": {
            "color": "red",
            "price": 19.95
          }
        }
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
      
      // 切换标签页
      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          tabButtons.forEach(b => b.classList.remove('active'));
          tabContents.forEach(c => c.classList.remove('active'));
          
          btn.classList.add('active');
          document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
          
          // 同步数据
          if (btn.dataset.tab === 'query' && jsonInput.value) {
            queryJsonInput.value = jsonInput.value;
          } else if (btn.dataset.tab === 'convert' && jsonInput.value) {
            convertInput.value = jsonInput.value;
          } else if (btn.dataset.tab === 'compare' && jsonInput.value) {
            if (!jsonLeft.value) {
              jsonLeft.value = jsonInput.value;
            }
          }
        });
      });
      
      // 从剪贴板粘贴
      pasteBtn.addEventListener('click', async () => {
        try {
          const text = await navigator.clipboard.readText();
          jsonInput.value = text;
          if (autoFormat.checked) {
            processJson();
          }
        } catch (e) {
          showToast('无法访问剪贴板，请手动粘贴', 'warning');
        }
      });
      
      // 从文件加载
      loadFileBtn.addEventListener('click', () => {
        fileInput.click();
      });
      
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            jsonInput.value = event.target.result;
            if (autoFormat.checked) {
              processJson();
            }
          };
          reader.readAsText(file);
        }
      });
      
      // JSONPath查询
      queryBtn.addEventListener('click', () => {
        const input = queryJsonInput.value.trim();
        const path = jsonPath.value.trim();
        
        if (!input) {
          showToast('请输入JSON数据', 'warning');
          return;
        }
        
        if (!path) {
          showToast('请输入JSONPath表达式', 'warning');
          return;
        }
        
        try {
          const json = JSON.parse(input);
          const result = jsonPathQuery(json, path);
          
          if (result !== undefined) {
            queryResult.innerHTML = syntaxHighlight(JSON.stringify(result, null, 2));
          } else {
            queryResult.innerHTML = '<span class="json-error">未找到匹配结果</span>';
          }
        } catch (e) {
          queryResult.innerHTML = `<span class="json-error">错误: ${e.message}</span>`;
        }
      });
      
      // JSONPath查询函数
      function jsonPathQuery(obj, path) {
        // 简单实现，仅支持基本的JSONPath语法
        try {
          // 替换$为obj
          let result = obj;
          
          // 处理路径
          if (path === '$') {
            return obj;
          }
          
          if (path.startsWith('$.')) {
            path = path.substring(2);
          } else if (path.startsWith('$')) {
            path = path.substring(1);
          }
          
          // 处理通配符
          if (path === '.*' || path === '..*') {
            return getAllValues(obj);
          }
          
          // 处理简单路径
          const segments = path.split('.');
          
          for (let i = 0; i < segments.length; i++) {
            let segment = segments[i];
            
            // 处理数组索引
            if (segment.includes('[') && segment.includes(']')) {
              const arrayName = segment.substring(0, segment.indexOf('['));
              const indexStr = segment.substring(segment.indexOf('[') + 1, segment.indexOf(']'));
              
              if (arrayName) {
                result = result[arrayName];
              }
              
              // 处理通配符
              if (indexStr === '*') {
                return result;
              }
              
              // 处理负索引
              if (indexStr.startsWith('-')) {
                const index = result.length + parseInt(indexStr);
                result = result[index];
              } else {
                result = result[parseInt(indexStr)];
              }
            } else {
              result = result[segment];
            }
            
            if (result === undefined) {
              return undefined;
            }
          }
          
          return result;
        } catch (e) {
          console.error('JSONPath查询错误:', e);
          return undefined;
        }
      }
      
      // 获取所有值
      function getAllValues(obj) {
        const result = [];
        
        function traverse(o) {
          if (o === null || typeof o !== 'object') {
            result.push(o);
            return;
          }
          
          result.push(o);
          
          if (Array.isArray(o)) {
            o.forEach(item => traverse(item));
          } else {
            for (const key in o) {
              if (o.hasOwnProperty(key)) {
                traverse(o[key]);
              }
            }
          }
        }
        
        traverse(obj);
        return result;
      }
      
      // 示例按钮
      exampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          jsonPath.value = btn.dataset.path;
          if (!queryJsonInput.value) {
            queryJsonInput.value = JSON.stringify(queryExample, null, 2);
          }
        });
      });
      
      // 转换功能
      jsonToYaml.addEventListener('click', () => {
        try {
          const json = JSON.parse(convertInput.value);
          const yaml = jsonToYamlConverter(json);
          convertResult.textContent = yaml;
        } catch (e) {
          convertResult.innerHTML = `<span class="json-error">错误: ${e.message}</span>`;
        }
      });
      
      yamlToJson.addEventListener('click', () => {
        try {
          const json = yamlToJsonConverter(convertInput.value);
          convertResult.innerHTML = syntaxHighlight(JSON.stringify(json, null, 2));
        } catch (e) {
          convertResult.innerHTML = `<span class="json-error">错误: ${e.message}</span>`;
        }
      });
      
      jsonToXml.addEventListener('click', () => {
        try {
          const json = JSON.parse(convertInput.value);
          const xml = jsonToXmlConverter(json);
          convertResult.textContent = xml;
        } catch (e) {
          convertResult.innerHTML = `<span class="json-error">错误: ${e.message}</span>`;
        }
      });
      
      xmlToJson.addEventListener('click', () => {
        try {
          const json = xmlToJsonConverter(convertInput.value);
          convertResult.innerHTML = syntaxHighlight(JSON.stringify(json, null, 2));
        } catch (e) {
          convertResult.innerHTML = `<span class="json-error">错误: ${e.message}</span>`;
        }
      });
      
      jsonToCsv.addEventListener('click', () => {
        try {
          const json = JSON.parse(convertInput.value);
          const csv = jsonToCsvConverter(json);
          convertResult.textContent = csv;
        } catch (e) {
          convertResult.innerHTML = `<span class="json-error">错误: ${e.message}</span>`;
        }
      });
      
      csvToJson.addEventListener('click', () => {
        try {
          const json = csvToJsonConverter(convertInput.value);
          convertResult.innerHTML = syntaxHighlight(JSON.stringify(json, null, 2));
        } catch (e) {
          convertResult.innerHTML = `<span class="json-error">错误: ${e.message}</span>`;
        }
      });
      
      // 复制转换结果
      copyConvertBtn.addEventListener('click', () => {
        const text = convertResult.textContent;
        if (text) {
          copyToClipboard(text);
        } else {
          showToast('没有内容可复制', 'warning');
        }
      });
      
      // 下载转换结果
      downloadConvertBtn.addEventListener('click', () => {
        const text = convertResult.textContent;
        if (text) {
          let extension = 'txt';
          let mimeType = 'text/plain';
          
          // 根据当前转换类型确定文件扩展名
          if (convertResult.innerHTML.includes('json-')) {
            extension = 'json';
            mimeType = 'application/json';
          } else if (text.trim().startsWith('<')) {
            extension = 'xml';
            mimeType = 'application/xml';
          } else if (text.includes(',') && text.includes('\n')) {
            extension = 'csv';
            mimeType = 'text/csv';
          } else if (!text.includes('{') && !text.includes('[')) {
            extension = 'yaml';
            mimeType = 'application/yaml';
          }
          
          const blob = new Blob([text], { type: mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `converted.${extension}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } else {
          showToast('没有内容可下载', 'warning');
        }
      });
      
      // 比较JSON
      compareBtn.addEventListener('click', () => {
        const left = jsonLeft.value.trim();
        const right = jsonRight.value.trim();
        
        if (!left || !right) {
          showToast('请输入两个JSON进行比较', 'warning');
          return;
        }
        
        try {
          const leftJson = JSON.parse(left);
          const rightJson = JSON.parse(right);
          
          const differences = compareJson(leftJson, rightJson, ignoreOrder.checked);
          
          if (differences.length === 0) {
            compareResult.innerHTML = '<div class="compare-equal">两个JSON完全相同</div>';
          } else {
            let html = '<div class="compare-diff-count">发现 ' + differences.length + ' 处差异</div>';
            html += '<ul class="compare-diff-list">';
            
            differences.forEach(diff => {
              html += `<li class="compare-diff-item">
                <div class="diff-path">${diff.path || 'root'}</div>
                <div class="diff-type">${diff.type}</div>
                <div class="diff-values">
                  <div class="diff-left">${formatDiffValue(diff.left)}</div>
                  <div class="diff-right">${formatDiffValue(diff.right)}</div>
                </div>
              </li>`;
            });
            
            html += '</ul>';
            compareResult.innerHTML = html;
          }
        } catch (e) {
          compareResult.innerHTML = `<span class="json-error">错误: ${e.message}</span>`;
        }
      });
      
      // 格式化比较差异值
      function formatDiffValue(value) {
        if (value === undefined) {
          return '<span class="diff-undefined">undefined</span>';
        }
        
        if (value === null) {
          return '<span class="diff-null">null</span>';
        }
        
        if (typeof value === 'object') {
          return syntaxHighlight(JSON.stringify(value));
        }
        
        if (typeof value === 'string') {
          return `<span class="json-string">"${value}"</span>`;
        }
        
        if (typeof value === 'number') {
          return `<span class="json-number">${value}</span>`;
        }
        
        if (typeof value === 'boolean') {
          return `<span class="json-boolean">${value}</span>`;
        }
        
        return String(value);
      }
      
      // 比较两个JSON对象
      function compareJson(left, right, ignoreOrder = false, path = '', differences = []) {
        // 类型不同
        if (typeof left !== typeof right) {
          differences.push({
            path: path,
            type: '类型不同',
            left: left,
            right: right
          });
          return differences;
        }
        
        // 处理null
        if (left === null && right === null) {
          return differences;
        }
        
        if (left === null || right === null) {
          differences.push({
            path: path,
            type: '值不同',
            left: left,
            right: right
          });
          return differences;
        }
        
        // 处理基本类型
        if (typeof left !== 'object') {
          if (left !== right) {
            differences.push({
              path: path,
              type: '值不同',
              left: left,
              right: right
            });
          }
          return differences;
        }
        
        // 处理数组
        if (Array.isArray(left) && Array.isArray(right)) {
          if (left.length !== right.length) {
            differences.push({
              path: path,
              type: '数组长度不同',
              left: `长度: ${left.length}`,
              right: `长度: ${right.length}`
            });
          }
          
          if (ignoreOrder) {
            // 忽略顺序比较
            const leftCopy = [...left];
            const rightCopy = [...right];
            
            for (let i = 0; i < Math.max(leftCopy.length, rightCopy.length); i++) {
              if (i >= leftCopy.length) {
                differences.push({
                  path: `${path}[${i}]`,
                  type: '右侧多出元素',
                  left: undefined,
                  right: rightCopy[i]
                });
                continue;
              }
              
              if (i >= rightCopy.length) {
                differences.push({
                  path: `${path}[${i}]`,
                  type: '左侧多出元素',
                  left: leftCopy[i],
                  right: undefined
                });
                continue;
              }
              
              compareJson(leftCopy[i], rightCopy[i], ignoreOrder, `${path}[${i}]`, differences);
            }
          } else {
            // 考虑顺序比较
            for (let i = 0; i < Math.max(left.length, right.length); i++) {
              if (i >= left.length) {
                differences.push({
                  path: `${path}[${i}]`,
                  type: '右侧多出元素',
                  left: undefined,
                  right: right[i]
                });
                continue;
              }
              
              if (i >= right.length) {
                differences.push({
                  path: `${path}[${i}]`,
                  type: '左侧多出元素',
                  left: left[i],
                  right: undefined
                });
                continue;
              }
              
              compareJson(left[i], right[i], ignoreOrder, `${path}[${i}]`, differences);
            }
          }
          
          return differences;
        }
        
        // 处理对象
        if (typeof left === 'object' && typeof right === 'object') {
          const leftKeys = Object.keys(left);
          const rightKeys = Object.keys(right);
          
          // 检查左侧多出的键
          leftKeys.forEach(key => {
            if (!right.hasOwnProperty(key)) {
              differences.push({
                path: path ? `${path}.${key}` : key,
                type: '左侧多出键',
                left: left[key],
                right: undefined
              });
            }
          });
          
          // 检查右侧多出的键
          rightKeys.forEach(key => {
            if (!left.hasOwnProperty(key)) {
              differences.push({
                path: path ? `${path}.${key}` : key,
                type: '右侧多出键',
                left: undefined,
                right: right[key]
              });
            }
          });
          
          // 检查共有键的值
          leftKeys.filter(key => right.hasOwnProperty(key)).forEach(key => {
            compareJson(
              left[key],
              right[key],
              ignoreOrder,
              path ? `${path}.${key}` : key,
              differences
            );
          });
          
          return differences;
        }
        
        return differences;
      }
      
      // JSON转YAML转换器
      function jsonToYamlConverter(json, level = 0) {
        const indent = '  '.repeat(level);
        let yaml = '';
        
        if (Array.isArray(json)) {
          if (json.length === 0) {
            yaml += '[]';
          } else {
            for (let i = 0; i < json.length; i++) {
              const value = json[i];
              if (typeof value === 'object' && value !== null) {
                yaml += `${indent}- `;
                if (Array.isArray(value)) {
                  yaml += '\n' + jsonToYamlConverter(value, level + 1);
                } else {
                  yaml += '\n' + jsonToYamlConverter(value, level + 1);
                }
              } else {
                yaml += `${indent}- ${formatYamlValue(value)}\n`;
              }
            }
          }
        } else {
          const keys = Object.keys(json);
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = json[key];
            
            if (typeof value === 'object' && value !== null) {
              yaml += `${indent}${key}:`;
              if (Object.keys(value).length === 0) {
                if (Array.isArray(value)) {
                  yaml += ' []\n';
                } else {
                  yaml += ' {}\n';
                }
              } else {
                yaml += '\n' + jsonToYamlConverter(value, level + 1);
              }
            } else {
              yaml += `${indent}${key}: ${formatYamlValue(value)}\n`;
            }
          }
        }
        
        return yaml;
      }
      
      // 格式化YAML值
      function formatYamlValue(value) {
        if (value === null) return 'null';
        if (value === undefined) return '';
        if (typeof value === 'string') {
          if (value.includes('\n') || value.includes(':') || value.includes('#')) {
            return '|\n' + value.split('\n').map(line => '  ' + line).join('\n');
          }
          if (value === '') return '""';
          if (/^[0-9]+$/.test(value) || value === 'true' || value === 'false' || value === 'null') {
            return `"${value}"`;
          }
          return value;
        }
        return String(value);
      }
      
      // YAML转JSON转换器 (简单实现)
      function yamlToJsonConverter(yaml) {
        // 这是一个非常简化的实现，仅支持基本的YAML语法
        const lines = yaml.split('\n');
        const result = {};
        let currentObj = result;
        const stack = [{ obj: result, indent: -1 }];
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trimRight();
          if (!line || line.trim().startsWith('#')) continue;
          
          const indent = line.search(/\S/);
          const content = line.trim();
          
          // 处理键值对
          if (content.includes(':')) {
            const [key, ...valueParts] = content.split(':');
            let value = valueParts.join(':').trim();
            
            // 调整堆栈
            while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
              stack.pop();
            }
            
            currentObj = stack[stack.length - 1].obj;
            
            if (!value) {
              // 对象或数组开始
              const newObj = content.endsWith('- ') ? [] : {};
              currentObj[key.trim()] = newObj;
              stack.push({ obj: newObj, indent });
              currentObj = newObj;
            } else {
              // 简单值
              currentObj[key.trim()] = parseYamlValue(value);
            }
          } else if (content.startsWith('- ')) {
            // 数组项
            const value = content.substring(2).trim();
            if (Array.isArray(currentObj)) {
              if (!value) {
                const newObj = {};
                currentObj.push(newObj);
                stack.push({ obj: newObj, indent });
                currentObj = newObj;
              } else {
                currentObj.push(parseYamlValue(value));
              }
            }
          }
        }
        
        return result;
      }
      
      // 解析YAML值
      function parseYamlValue(value) {
        if (value === 'null' || value === '~') return null;
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (!isNaN(value) && value.trim() !== '') return Number(value);
        if (value.startsWith('"') && value.endsWith('"')) {
          return value.substring(1, value.length - 1);
        }
        if (value.startsWith("'") && value.endsWith("'")) {
          return value.substring(1, value.length - 1);
        }
        return value;
      }
      
      // JSON转XML转换器
      function jsonToXmlConverter(json, rootName = 'root') {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        
        function processValue(value, name) {
          if (value === null || value === undefined) {
            return `<${name} />\n`;
          } else if (typeof value === 'object') {
            if (Array.isArray(value)) {
              let arrayXml = '';
              for (let i = 0; i < value.length; i++) {
                const itemName = isNaN(name) ? `${name.replace(/s$/, '')}` : name;
                arrayXml += processValue(value[i], itemName);
              }
              return arrayXml;
            } else {
              let objectXml = `<${name}>\n`;
              for (const key in value) {
                if (value.hasOwnProperty(key)) {
                  objectXml += processValue(value[key], key);
                }
              }
              objectXml += `</${name}>\n`;
              return objectXml;
            }
          } else {
            return `<${name}>${escapeXml(String(value))}</${name}>\n`;
          }
        }
        
        xml += processValue(json, rootName);
        return xml;
      }
      
      // 转义XML特殊字符
      function escapeXml(text) {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      }
      
      // XML转JSON转换器 (简单实现)
      function xmlToJsonConverter(xml) {
        // 这是一个非常简化的实现，仅支持基本的XML语法
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'text/xml');
        
        function xmlToObj(node) {
          // 如果是文本节点
          if (node.nodeType === 3) {
            const text = node.nodeValue.trim();
            return text || undefined;
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
              
              const childName = childNode.nodeName;
              
              if (childName === '#text') {
                const text = childNode.nodeValue.trim();
                if (text) {
                  if (Object.keys(obj).length === 0) {
                    return text;
                  } else {
                    obj['#text'] = text;
                  }
                }
              } else {
                const childValue = xmlToObj(childNode);
                
                if (obj[childName] !== undefined) {
                  if (!Array.isArray(obj[childName])) {
                    obj[childName] = [obj[childName]];
                  }
                  obj[childName].push(childValue);
                } else {
                  obj[childName] = childValue;
                }
              }
            }
            
            return obj;
          }
          
          return null;
        }
        
        const rootNode = xmlDoc.documentElement;
        const result = {};
        result[rootNode.nodeName] = xmlToObj(rootNode);
        return result;
      }
      
      // JSON转CSV转换器
      function jsonToCsvConverter(json) {
        if (!Array.isArray(json)) {
          if (typeof json === 'object' && json !== null) {
            json = [json];
          } else {
            throw new Error('JSON必须是对象或数组');
          }
        }
        
        if (json.length === 0) {
          return '';
        }
        
        // 获取所有可能的列
        const columns = new Set();
        json.forEach(item => {
          if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach(key => columns.add(key));
          }
        });
        
        const columnArray = Array.from(columns);
        
        // 创建CSV头
        let csv = columnArray.map(column => `"${column}"`).join(',') + '\n';
        
        // 添加数据行
        json.forEach(item => {
          const row = columnArray.map(column => {
            const value = item[column];
            if (value === undefined || value === null) {
              return '';
            } else if (typeof value === 'object') {
              return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            } else {
              return `"${String(value).replace(/"/g, '""')}"`;
            }
          });
          
          csv += row.join(',') + '\n';
        });
        
        return csv;
      }
      
      // CSV转JSON转换器
      function csvToJsonConverter(csv) {
        const lines = csv.split('\n');
        if (lines.length < 2) {
          throw new Error('CSV必须至少包含标题行和一行数据');
        }
        
        // 解析CSV行
        function parseCSVLine(line) {
          const result = [];
          let inQuotes = false;
          let currentValue = '';
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
              if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                // 处理双引号转义
                currentValue += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              result.push(currentValue);
              currentValue = '';
            } else {
              currentValue += char;
            }
          }
          
          result.push(currentValue);
          return result;
        }
        
        // 解析标题行
        const headers = parseCSVLine(lines[0]);
        
        // 解析数据行
        const result = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = parseCSVLine(line);
          const obj = {};
          
          for (let j = 0; j < headers.length; j++) {
            if (j < values.length) {
              let value = values[j];
              
              //
/**
 * JSON格式化工具
 * 增强版：支持JSON路径查询、架构验证、转换和比较功能
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-code"></i> JSON格式化</h2>
          <p class="tool-description">格式化、验证、查询和转换JSON数据，提供树视图和路径查询功能。</p>
        </div>
        
        <div class="json-tabs">
          <div class="tab-header">
            <button class="tab-btn active" data-tab="format">格式化</button>
            <button class="tab-btn" data-tab="query">路径查询</button>
            <button class="tab-btn" data-tab="convert">转换</button>
            <button class="tab-btn" data-tab="compare">比较</button>
          </div>
          
          <div class="tab-content active" id="tab-format">
            <div class="json-container">
              <div class="json-input-section">
                <div class="form-group">
                  <label for="json-input">JSON输入</label>
                  <div class="textarea-with-actions">
                    <textarea id="json-input" class="form-control" placeholder="在此粘贴JSON数据..."></textarea>
                    <div class="textarea-actions">
                      <button id="paste-btn" class="btn btn-sm" title="从剪贴板粘贴"><i class="fa fa-clipboard"></i></button>
                      <button id="load-file-btn" class="btn btn-sm" title="从文件加载"><i class="fa fa-folder-open"></i></button>
                      <input type="file" id="file-input" accept=".json" style="display: none;">
                    </div>
                  </div>
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
          </div>
          
          <div class="tab-content" id="tab-query">
            <div class="query-container">
              <div class="query-input-section">
                <div class="form-group">
                  <label for="query-json-input">JSON数据</label>
                  <textarea id="query-json-input" class="form-control" placeholder="在此粘贴JSON数据..."></textarea>
                </div>
                
                <div class="form-group">
                  <label for="json-path">JSONPath查询</label>
                  <div class="path-input-wrapper">
                    <input type="text" id="json-path" class="form-control" placeholder="输入JSONPath表达式，例如 $.store.book[0].title" />
                    <button id="query-btn" class="btn btn-success">查询</button>
                  </div>
                </div>
                
                <div class="query-examples">
                  <h4>常用JSONPath示例</h4>
                  <div class="example-buttons">
                    <button class="example-btn" data-path="$.store.book[*].author">所有书籍作者</button>
                    <button class="example-btn" data-path="$..book[?(@.price<10)]">价格小于10的书</button>
                    <button class="example-btn" data-path="$..*">所有节点</button>
                    <button class="example-btn" data-path="$..book[-1:]">最后一本书</button>
                  </div>
                </div>
              </div>
              
              <div class="query-result-section">
                <div class="query-result-header">
                  <h3>查询结果</h3>
                </div>
                
                <div class="query-result-wrapper">
                  <pre id="query-result" class="query-result"></pre>
                </div>
              </div>
            </div>
          </div>
          
          <div class="tab-content" id="tab-convert">
            <div class="convert-container">
              <div class="convert-input-section">
                <div class="form-group">
                  <label for="convert-input">输入数据</label>
                  <textarea id="convert-input" class="form-control" placeholder="在此粘贴要转换的数据..."></textarea>
                </div>
                
                <div class="convert-options">
                  <div class="form-group">
                    <label>转换类型</label>
                    <div class="convert-type-buttons">
                      <button id="json-to-yaml" class="btn btn-sm">JSON → YAML</button>
                      <button id="yaml-to-json" class="btn btn-sm">YAML → JSON</button>
                      <button id="json-to-xml" class="btn btn-sm">JSON → XML</button>
                      <button id="xml-to-json" class="btn btn-sm">XML → JSON</button>
                      <button id="json-to-csv" class="btn btn-sm">JSON → CSV</button>
                      <button id="csv-to-json" class="btn btn-sm">CSV → JSON</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="convert-result-section">
                <div class="convert-result-header">
                  <h3>转换结果</h3>
                </div>
                
                <div class="convert-result-wrapper">
                  <pre id="convert-result" class="convert-result"></pre>
                </div>
                
                <div class="convert-result-actions">
                  <button id="copy-convert-btn" class="btn"><i class="fa fa-copy"></i> 复制</button>
                  <button id="download-convert-btn" class="btn"><i class="fa fa-download"></i> 下载</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="tab-content" id="tab-compare">
            <div class="compare-container">
              <div class="compare-input-section">
                <div class="compare-inputs">
                  <div class="form-group">
                    <label for="json-left">左侧JSON</label>
                    <textarea id="json-left" class="form-control" placeholder="在此粘贴第一个JSON..."></textarea>
                  </div>
                  
                  <div class="form-group">
                    <label for="json-right">右侧JSON</label>
                    <textarea id="json-right" class="form-control" placeholder="在此粘贴第二个JSON..."></textarea>
                  </div>
                </div>
                
                <div class="compare-actions">
                  <button id="compare-btn" class="btn btn-success"><i class="fa fa-exchange"></i> 比较</button>
                  <div class="form-check">
                    <input type="checkbox" id="ignore-order" checked />
                    <label for="ignore-order">忽略数组顺序</label>
                  </div>
                </div>
              </div>
              
              <div class="compare-result-section">
                <div class="compare-result-header">
                  <h3>比较结果</h3>
                </div>
                
                <div class="compare-result-wrapper">
                  <div id="compare-result" class="compare-result"></div>
                </div>
              </div>
            </div>
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
      
      // 获取额外元素
      const tabButtons = container.querySelectorAll('.tab-btn');
      const tabContents = container.querySelectorAll('.tab-content');
      const pasteBtn = container.querySelector('#paste-btn');
      const loadFileBtn = container.querySelector('#load-file-btn');
      const fileInput = container.querySelector('#file-input');
      
      // 查询相关元素
      const queryJsonInput = container.querySelector('#query-json-input');
      const jsonPath = container.querySelector('#json-path');
      const queryBtn = container.querySelector('#query-btn');
      const queryResult = container.querySelector('#query-result');
      const exampleBtns = container.querySelectorAll('.example-btn');
      
      // 转换相关元素
      const convertInput = container.querySelector('#convert-input');
      const convertResult = container.querySelector('#convert-result');
      const jsonToYaml = container.querySelector('#json-to-yaml');
      const yamlToJson = container.querySelector('#yaml-to-json');
      const jsonToXml = container.querySelector('#json-to-xml');
      const xmlToJson = container.querySelector('#xml-to-json');
      const jsonToCsv = container.querySelector('#json-to-csv');
      const csvToJson = container.querySelector('#csv-to-json');
      const copyConvertBtn = container.querySelector('#copy-convert-btn');
      const downloadConvertBtn = container.querySelector('#download-convert-btn');
      
      // 比较相关元素
      const jsonLeft = container.querySelector('#json-left');
      const jsonRight = container.querySelector('#json-right');
      const compareBtn = container.querySelector('#compare-btn');
      const ignoreOrder = container.querySelector('#ignore-order');
      const compareResult = container.querySelector('#compare-result');
      
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
      
      // 查询示例
      const queryExample = {
        "store": {
          "book": [
            {
              "category": "reference",
              "author": "Nigel Rees",
              "title": "Sayings of the Century",
              "price": 8.95
            },
            {
              "category": "fiction",
              "author": "Evelyn Waugh",
              "title": "Sword of Honour",
              "price": 12.99
            },
            {
              "category": "fiction",
              "author": "Herman Melville",
              "title": "Moby Dick",
              "isbn": "0-553-21311-3",
              "price": 8.99
            },
            {
              "category": "fiction",
              "author": "J. R. R. Tolkien",
              "title": "The Lord of the Rings",
              "isbn": "0-395-19395-8",
              "price": 22.99
            }
          ],
          "bicycle": {
            "color": "red",
            "price": 19.95
          }
        }
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
      
      // 切换标签页
      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          tabButtons.forEach(b => b.classList.remove('active'));
          tabContents.forEach(c => c.classList.remove('active'));
          
          btn.classList.add('active');
          document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
          
          // 同步数据
          if (btn.dataset.tab === 'query' && jsonInput.value) {
            queryJsonInput.value = jsonInput.value;
          } else if (btn.dataset.tab === 'convert' && jsonInput.value) {
            convertInput.value = jsonInput.value;
          } else if (btn.dataset.tab === 'compare' && jsonInput.value) {
            if (!jsonLeft.value) {
              jsonLeft.value = jsonInput.value;
            }