/**
 * JSON格式化工具
 * 增强版：支持JSON路径查询、架构验证、转换和比较功能
 */
(function() {
  // 页面加载完成后初始化
  document.addEventListener('DOMContentLoaded', function() {
    initJsonFormatter();
  });

  function initJsonFormatter() {
    // 获取DOM元素
    const jsonInput = document.getElementById('json-input');
    const jsonOutput = document.getElementById('json-output');
    const formatBtn = document.getElementById('format-btn');
    const minifyBtn = document.getElementById('minify-btn');
    const validateBtn = document.getElementById('validate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const loadFileBtn = document.getElementById('load-file-btn');
    const fileInput = document.getElementById('file-input');
    const autoFormat = document.getElementById('auto-format');
    const indentSize = document.getElementById('indent-size');
    const sortKeys = document.getElementById('sort-keys');
    const jsonStats = document.getElementById('json-stats');
    const jsonSize = document.getElementById('json-size');
    const jsonNodes = document.getElementById('json-nodes');
    const jsonDepth = document.getElementById('json-depth');
    const jsonTree = document.getElementById('json-tree');
    const expandAll = document.getElementById('expand-all');
    const collapseAll = document.getElementById('collapse-all');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const resultTabs = document.querySelectorAll('.result-tab');
    const resultContents = document.querySelectorAll('.result-content');
    
    // 查询相关元素
    const queryJsonInput = document.getElementById('query-json-input');
    const jsonPath = document.getElementById('json-path');
    const queryBtn = document.getElementById('query-btn');
    const queryResult = document.getElementById('query-result');
    const pathHelp = document.getElementById('path-help');
    const jsonPathHelp = document.getElementById('json-path-help');
    const closeHelp = document.querySelector('.close-help');
    const exampleBtns = document.querySelectorAll('.example-btn');
    const copyQueryResult = document.getElementById('copy-query-result');
    
    // 转换相关元素
    const convertInput = document.getElementById('convert-input');
    const convertResult = document.getElementById('convert-result');
    const jsonToYaml = document.getElementById('json-to-yaml');
    const yamlToJson = document.getElementById('yaml-to-json');
    const jsonToXml = document.getElementById('json-to-xml');
    const xmlToJson = document.getElementById('xml-to-json');
    const jsonToCsv = document.getElementById('json-to-csv');
    const csvToJson = document.getElementById('csv-to-json');
    const copyConvert = document.getElementById('copy-convert');
    const downloadConvert = document.getElementById('download-convert');
    
    // 比较相关元素
    const jsonLeft = document.getElementById('json-left');
    const jsonRight = document.getElementById('json-right');
    const compareBtn = document.getElementById('compare-btn');
    const compareResult = document.getElementById('compare-result');

    // 初始化标签页切换
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        // 切换按钮状态
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // 切换内容区域
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`tab-${tab}`).classList.add('active');
      });
    });

    // 初始化结果视图切换
    resultTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const view = tab.dataset.view;
        
        // 切换按钮状态
        resultTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // 切换内容区域
        resultContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`${view}-view`).classList.add('active');
      });
    });

    // 格式化按钮点击事件
    formatBtn.addEventListener('click', () => {
      processJson();
    });

    // 压缩按钮点击事件
    minifyBtn.addEventListener('click', () => {
      try {
        const json = jsonInput.value.trim();
        if (!json) return;
        
        const parsedJson = JSON.parse(json);
        const minified = JSON.stringify(parsedJson);
        
        jsonOutput.textContent = minified;
        jsonOutput.innerHTML = syntaxHighlight(minified);
        updateJsonStats(parsedJson);
      } catch (error) {
        jsonOutput.textContent = `错误: ${error.message}`;
        jsonOutput.classList.add('error');
      }
    });

    // 验证按钮点击事件
    validateBtn.addEventListener('click', () => {
      try {
        const json = jsonInput.value.trim();
        if (!json) {
          jsonOutput.textContent = '请输入JSON数据';
          jsonOutput.classList.add('error');
          return;
        }
        
        const result = validateJson(json);
        if (result.valid) {
          jsonOutput.textContent = '✓ JSON格式有效';
          jsonOutput.classList.remove('error');
          jsonOutput.classList.add('success');
        } else {
          jsonOutput.textContent = `✗ JSON格式无效: ${result.error}`;
          jsonOutput.classList.remove('success');
          jsonOutput.classList.add('error');
        }
      } catch (error) {
        jsonOutput.textContent = `错误: ${error.message}`;
        jsonOutput.classList.add('error');
      }
    });

    // 清空按钮点击事件
    clearBtn.addEventListener('click', () => {
      jsonInput.value = '';
      jsonOutput.textContent = '';
      jsonOutput.classList.remove('error', 'success');
      jsonTree.innerHTML = '';
      jsonSize.textContent = '0 字节';
      jsonNodes.textContent = '0';
      jsonDepth.textContent = '0';
    });

    // 复制按钮点击事件
    copyBtn.addEventListener('click', () => {
      const text = jsonOutput.textContent;
      if (!text) return;
      
      navigator.clipboard.writeText(text)
        .then(() => {
          const originalText = copyBtn.innerHTML;
          copyBtn.innerHTML = '<i class="fa fa-check"></i> 已复制';
          setTimeout(() => {
            copyBtn.innerHTML = originalText;
          }, 2000);
        })
        .catch(err => {
          console.error('复制失败:', err);
        });
    });

    // 下载按钮点击事件
    downloadBtn.addEventListener('click', () => {
      const text = jsonOutput.textContent;
      if (!text) return;
      
      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formatted.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    // 粘贴按钮点击事件
    pasteBtn.addEventListener('click', () => {
      navigator.clipboard.readText()
        .then(text => {
          jsonInput.value = text;
          if (autoFormat.checked) {
            processJson();
          }
        })
        .catch(err => {
          console.error('粘贴失败:', err);
        });
    });

    // 加载文件按钮点击事件
    loadFileBtn.addEventListener('click', () => {
      fileInput.click();
    });

    // 文件输入变化事件
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        jsonInput.value = event.target.result;
        if (autoFormat.checked) {
          processJson();
        }
      };
      reader.readAsText(file);
    });

    // 输入框内容变化事件
    jsonInput.addEventListener('input', () => {
      if (autoFormat.checked) {
        processJson();
      }
    });

    // 展开全部按钮点击事件
    expandAll.addEventListener('click', () => {
      const details = jsonTree.querySelectorAll('details');
      details.forEach(detail => {
        detail.open = true;
      });
    });

    // 折叠全部按钮点击事件
    collapseAll.addEventListener('click', () => {
      const details = jsonTree.querySelectorAll('details');
      details.forEach(detail => {
        detail.open = false;
      });
    });

    // 查询按钮点击事件
    queryBtn.addEventListener('click', () => {
      try {
        const json = queryJsonInput.value.trim();
        const path = jsonPath.value.trim();
        
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
        const result = jsonPathQuery(parsedJson, path);
        
        if (result === undefined || (Array.isArray(result) && result.length === 0)) {
          queryResult.textContent = '未找到匹配结果';
          queryResult.classList.add('warning');
        } else {
          const formattedResult = JSON.stringify(result, null, 2);
          queryResult.innerHTML = syntaxHighlight(formattedResult);
          queryResult.classList.remove('error', 'warning');
        }
      } catch (error) {
        queryResult.textContent = `错误: ${error.message}`;
        queryResult.classList.add('error');
      }
    });

    // 路径帮助按钮点击事件
    pathHelp.addEventListener('click', () => {
      jsonPathHelp.style.display = 'flex';
    });

    // 关闭帮助按钮点击事件
    closeHelp.addEventListener('click', () => {
      jsonPathHelp.style.display = 'none';
    });

    // 示例按钮点击事件
    exampleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const path = btn.dataset.path;
        jsonPath.value = path;
      });
    });

    // 复制查询结果按钮点击事件
    copyQueryResult.addEventListener('click', () => {
      const text = queryResult.textContent;
      if (!text) return;
      
      navigator.clipboard.writeText(text)
        .then(() => {
          const originalText = copyQueryResult.innerHTML;
          copyQueryResult.innerHTML = '<i class="fa fa-check"></i> 已复制';
          setTimeout(() => {
            copyQueryResult.innerHTML = originalText;
          }, 2000);
        })
        .catch(err => {
          console.error('复制失败:', err);
        });
    });

    // JSON转YAML按钮点击事件
    jsonToYaml.addEventListener('click', () => {
      try {
        const json = convertInput.value.trim();
        if (!json) {
          convertResult.textContent = '请输入JSON数据';
          convertResult.classList.add('error');
          return;
        }
        
        const parsedJson = JSON.parse(json);
        // 这里需要引入YAML库，暂时使用简单的转换
        const yaml = jsonToYamlConverter(parsedJson);
        
        convertResult.textContent = yaml;
        convertResult.classList.remove('error');
      } catch (error) {
        convertResult.textContent = `错误: ${error.message}`;
        convertResult.classList.add('error');
      }
    });

    // YAML转JSON按钮点击事件
    yamlToJson.addEventListener('click', () => {
      try {
        const yaml = convertInput.value.trim();
        if (!yaml) {
          convertResult.textContent = '请输入YAML数据';
          convertResult.classList.add('error');
          return;
        }
        
        // 这里需要引入YAML库，暂时使用简单的转换
        const json = yamlToJsonConverter(yaml);
        const formattedJson = JSON.stringify(json, null, 2);
        
        convertResult.innerHTML = syntaxHighlight(formattedJson);
        convertResult.classList.remove('error');
      } catch (error) {
        convertResult.textContent = `错误: ${error.message}`;
        convertResult.classList.add('error');
      }
    });

    // 比较按钮点击事件
    compareBtn.addEventListener('click', () => {
      try {
        const left = jsonLeft.value.trim();
        const right = jsonRight.value.trim();
        
        if (!left || !right) {
          compareResult.textContent = '请输入两个JSON数据进行比较';
          compareResult.classList.add('error');
          return;
        }
        
        const parsedLeft = JSON.parse(left);
        const parsedRight = JSON.parse(right);
        
        const diff = compareJson(parsedLeft, parsedRight);
        compareResult.innerHTML = formatDiff(diff);
        compareResult.classList.remove('error');
      } catch (error) {
        compareResult.textContent = `错误: ${error.message}`;
        compareResult.classList.add('error');
      }
    });

    // 处理JSON函数
    function processJson() {
      try {
        const json = jsonInput.value.trim();
        if (!json) return;
        
        const indent = indentSize.value === 'tab' ? '\t' : parseInt(indentSize.value);
        const doSortKeys = sortKeys.checked;
        
        const formattedJson = formatJson(json, indent, doSortKeys);
        jsonOutput.innerHTML = syntaxHighlight(formattedJson);
        jsonOutput.classList.remove('error', 'success');
        
        const parsedJson = JSON.parse(json);
        updateJsonStats(parsedJson);
        createJsonTreeView(parsedJson, jsonTree);
      } catch (error) {
        jsonOutput.textContent = `错误: ${error.message}`;
        jsonOutput.classList.add('error');
        jsonTree.innerHTML = '';
      }
    }

    // 格式化JSON
    function formatJson(json, indent = 4, doSortKeys = false) {
      try {
        let parsedJson = JSON.parse(json);
        
        if (doSortKeys) {
          parsedJson = sortObjectKeys(parsedJson);
        }
        
        return JSON.stringify(parsedJson, null, indent);
      } catch (error) {
        throw new Error(`JSON解析错误: ${error.message}`);
      }
    }

    // 排序对象键
    function sortObjectKeys(obj) {
      if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
        return obj;
      }
      
      const sortedObj = {};
      const keys = Object.keys(obj).sort();
      
      for (const key of keys) {
        sortedObj[key] = sortObjectKeys(obj[key]);
      }
      
      return sortedObj;
    }

    // 压缩JSON
    function minifyJson(json) {
      try {
        const parsedJson = JSON.parse(json);
        return JSON.stringify(parsedJson);
      } catch (error) {
        throw new Error(`JSON解析错误: ${error.message}`);
      }
    }

    // 验证JSON
    function validateJson(json) {
      try {
        JSON.parse(json);
        return { valid: true };
      } catch (error) {
        return { valid: false, error: error.message };
      }
    }

    // 更新JSON统计信息
    function updateJsonStats(json) {
      const size = new TextEncoder().encode(JSON.stringify(json)).length;
      const nodes = countNodes(json);
      const depth = calculateDepth(json);
      
      jsonSize.textContent = formatSize(size);
      jsonNodes.textContent = nodes;
      jsonDepth.textContent = depth;
    }

    // 格式化文件大小
    function formatSize(bytes) {
      if (bytes < 1024) {
        return `${bytes} 字节`;
      } else if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(2)} KB`;
      } else {
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      }
    }

    // 计算节点数
    function countNodes(obj, count = 0) {
      count++;
      
      if (obj !== null && typeof obj === 'object') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            count = countNodes(obj[key], count);
          }
        }
      }
      
      return count;
    }

    // 计算深度
    function calculateDepth(obj, depth = 0) {
      if (obj === null || typeof obj !== 'object') {
        return depth;
      }
      
      let maxDepth = depth;
      
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const childDepth = calculateDepth(obj[key], depth + 1);
          maxDepth = Math.max(maxDepth, childDepth);
        }
      }
      
      return maxDepth;
    }

    // 创建JSON树视图
    function createJsonTreeView(json, container) {
      container.innerHTML = '';
      
      if (typeof json !== 'object' || json === null) {
        container.textContent = String(json);
        return;
      }
      
      const rootUl = document.createElement('ul');
      container.appendChild(rootUl);
      
      if (Array.isArray(json)) {
        appendArrayNode(rootUl, json);
      } else {
        appendObjectNode(rootUl, json);
      }
    }

    // 添加对象节点
    function appendObjectNode(parent, obj, keyName = null) {
      const li = document.createElement('li');
      parent.appendChild(li);
      
      const keys = Object.keys(obj);
      
      if (keyName !== null) {
        const details = document.createElement('details');
        details.open = true;
        
        const summary = document.createElement('summary');
        summary.innerHTML = `<span class="tree-key">${escapeHtml(keyName)}</span><span class="tree-colon">: </span><span class="tree-object">{${keys.length} 个属性}</span>`;
        
        details.appendChild(summary);
        li.appendChild(details);
        
        const ul = document.createElement('ul');
        details.appendChild(ul);
        
        for (const key of keys) {
          const value = obj[key];
          
          if (value === null) {
            appendValueNode(ul, value, key);
          } else if (typeof value === 'object') {
            if (Array.isArray(value)) {
              appendArrayNode(ul, value, key);
            } else {
              appendObjectNode(ul, value, key);
            }
          } else {
            appendValueNode(ul, value, key);
          }
        }
      } else {
        // 根对象
        const ul = document.createElement('ul');
        li.appendChild(ul);
        
        for (const key of keys) {
          const value = obj[key];
          
          if (value === null) {
            appendValueNode(ul, value, key);
          } else if (typeof value === 'object') {
            if (Array.isArray(value)) {
              appendArrayNode(ul, value, key);
            } else {
              appendObjectNode(ul, value, key);
            }
          } else {
            appendValueNode(ul, value, key);
          }
        }
      }
    }

    // 添加数组节点
    function appendArrayNode(parent, arr, keyName = null) {
      const li = document.createElement('li');
      parent.appendChild(li);
      
      if (keyName !== null) {
        const details = document.createElement('details');
        details.open = true;
        
        const summary = document.createElement('summary');
        summary.innerHTML = `<span class="tree-key">${escapeHtml(keyName)}</span><span class="tree-colon">: </span><span class="tree-array">[${arr.length} 个元素]</span>`;
        
        details.appendChild(summary);
        li.appendChild(details);
        
        const ul = document.createElement('ul');
        details.appendChild(ul);
        
        arr.forEach((item, index) => {
          if (item === null) {
            appendValueNode(ul, item, index);
          } else if (typeof item === 'object') {
            if (Array.isArray(item)) {
              appendArrayNode(ul, item, index);
            } else {
              appendObjectNode(ul, item, index);
            }
          } else {
            appendValueNode(ul, item, index);
          }
        });
      } else {
        // 根数组
        const ul = document.createElement('ul');
        li.appendChild(ul);
        
        arr.forEach((item, index) => {
          if (item === null) {
            appendValueNode(ul, item, index);
          } else if (typeof item === 'object') {
            if (Array.isArray(item)) {
              appendArrayNode(ul, item, index);
            } else {
              appendObjectNode(ul, item, index);
            }
          } else {
            appendValueNode(ul, item, index);
          }
        });
      }
    }

    // 添加值节点
    function appendValueNode(parent, value, key) {
      const li = document.createElement('li');
      
      let valueClass = '';
      let displayValue = '';
      
      if (value === null) {
        valueClass = 'tree-null';
        displayValue = 'null';
      } else if (typeof value === 'string') {
        valueClass = 'tree-string';
        displayValue = `"${escapeHtml(value)}"`;
      } else if (typeof value === 'number') {
        valueClass = 'tree-number';
        displayValue = value;
      } else if (typeof value === 'boolean') {
        valueClass = 'tree-boolean';
        displayValue = value;
      }
      
      li.innerHTML = `<span class="tree-key">${escapeHtml(String(key))}</span><span class="tree-colon">: </span><span class="${valueClass}">${displayValue}</span>`;
      parent.appendChild(li);
    }

    // HTML转义
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // 语法高亮
    function syntaxHighlight(json) {
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
    }

    // JSONPath查询
    function jsonPathQuery(obj, path) {
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
            const value = jsonPathQuery(item, nextSegment);
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
    }

    // JSON转YAML转换器（简单实现）
    function jsonToYamlConverter(obj, indent = 0) {
      const spaces = ' '.repeat(indent);
      let yaml = '';
      
      if (Array.isArray(obj)) {
        if (obj.length === 0) {
          return '[]';
        }
        
        for (const item of obj) {
          yaml += spaces + '- ';
          
          if (item === null) {
            yaml += 'null\n';
          } else if (typeof item === 'object') {
            yaml += '\n' + jsonToYamlConverter(item, indent + 2);
          } else if (typeof item === 'string') {
            yaml += `"${item}"\n`;
          } else {
            yaml += `${item}\n`;
          }
        }
      } else if (obj !== null && typeof obj === 'object') {
        const keys = Object.keys(obj);
        
        if (keys.length === 0) {
          return '{}';
        }
        
        for (const key of keys) {
          const value = obj[key];
          yaml += spaces + key + ': ';
          
          if (value === null) {
            yaml += 'null\n';
          } else if (typeof value === 'object') {
            yaml += '\n' + jsonToYamlConverter(value, indent + 2);
          } else if (typeof value === 'string') {
            yaml += `"${value}"\n`;
          } else {
            yaml += `${value}\n`;
          }
        }
      }
      
      return yaml;
    }

    // YAML转JSON转换器（简单实现）
    function yamlToJsonConverter(yaml) {
      // 这是一个非常简化的实现，实际应该使用专门的YAML解析库
      // 这里仅作为示例，不能处理复杂的YAML
      const lines = yaml.split('\n');
      const result = {};
      let currentObj = result;
      let stack = [{ obj: result, indent: -2 }];
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
        const indent = line.search(/\S/);
        const isArray = line.trim().startsWith('- ');
        
        // 处理缩进
        while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
          stack.pop();
          currentObj = stack[stack.length - 1].obj;
        }
        
        if (isArray) {
          // 处理数组项
          const content = line.trim().substring(2).trim();
          
          if (!Array.isArray(currentObj)) {
            // 如果当前对象不是数组，创建一个新数组
            const key = Object.keys(stack[stack.length - 1].obj).pop();
            stack[stack.length - 1].obj[key] = [];
            currentObj = stack[stack.length - 1].obj[key];
          }
          
          if (content) {
            // 简单值
            if (content === 'null') {
              currentObj.push(null);
            } else if (content === 'true') {
              currentObj.push(true);
            } else if (content === 'false') {
              currentObj.push(false);
            } else if (!isNaN(content)) {
              currentObj.push(Number(content));
            } else if (content.startsWith('"') && content.endsWith('"')) {
              currentObj.push(content.slice(1, -1));
            } else {
              currentObj.push(content);
            }
        } else {
          // 复杂对象
          const newObj = {};
          currentObj.push(newObj);
          stack.push({ obj: newObj, indent: indent });
          currentObj = newObj;
        }
      } else {
        // 处理键值对
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          const key = line.substring(0, colonIndex).trim();
          let value = line.substring(colonIndex + 1).trim();
          
          if (!value) {
            // 值为对象
            const newObj = {};
            currentObj[key] = newObj;
            stack.push({ obj: newObj, indent: indent });
            currentObj = newObj;
          } else {
            // 简单值
            if (value === 'null') {
              currentObj[key] = null;
            } else if (value === 'true') {
              currentObj[key] = true;
            } else if (value === 'false') {
              currentObj[key] = false;
            } else if (!isNaN(value)) {
              currentObj[key] = Number(value);
            } else if (value.startsWith('"') && value.endsWith('"')) {
              currentObj[key] = value.slice(1, -1);
            } else {
              currentObj[key] = value;
            }
          }
        }
      }
    }
    
    return result;
  }

  // 比较JSON对象
  function compareJson(obj1, obj2) {
    const result = {
      added: [],
      removed: [],
      changed: [],
      unchanged: []
    };
    
    // 比较两个对象
    compareObjects(obj1, obj2, '', result);
    
    return result;
  }
  
  // 递归比较对象
  function compareObjects(obj1, obj2, path, result) {
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
        compareObjects(obj1[key], obj2[key], currentPath, result);
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
  }
  
  // 格式化差异结果
  function formatDiff(diff) {
    let html = '';
    
    if (diff.added.length > 0) {
      html += '<h4>添加的属性:</h4><ul>';
      for (const item of diff.added) {
        html += `<li class="diff-added"><strong>${item.path}</strong>: ${formatDiffValue(item.value)}</li>`;
      }
      html += '</ul>';
    }
    
    if (diff.removed.length > 0) {
      html += '<h4>删除的属性:</h4><ul>';
      for (const item of diff.removed) {
        html += `<li class="diff-removed"><strong>${item.path}</strong>: ${formatDiffValue(item.value)}</li>`;
      }
      html += '</ul>';
    }
    
    if (diff.changed.length > 0) {
      html += '<h4>修改的属性:</h4><ul>';
      for (const item of diff.changed) {
        html += `<li><strong>${item.path}</strong>: <span class="diff-removed">${formatDiffValue(item.oldValue)}</span> → <span class="diff-added">${formatDiffValue(item.newValue)}</span></li>`;
      }
      html += '</ul>';
    }
    
    if (diff.unchanged.length > 0) {
      html += '<h4>未变更的属性:</h4><ul>';
      for (const item of diff.unchanged) {
        html += `<li class="diff-unchanged"><strong>${item.path}</strong>: ${formatDiffValue(item.value)}</li>`;
      }
      html += '</ul>';
    }
    
    return html;
  }
  
  // 格式化差异值
  function formatDiffValue(value) {
    if (value === null) {
      return '<span class="json-null">null</span>';
    } else if (typeof value === 'string') {
      return `<span class="json-string">"${escapeHtml(value)}"</span>`;
    } else if (typeof value === 'number') {
      return `<span class="json-number">${value}</span>`;
    } else if (typeof value === 'boolean') {
      return `<span class="json-boolean">${value}</span>`;
    } else if (typeof value === 'object') {
      return '<span class="json-object">[对象]</span>';
    }
    
    return String(value);
  }
}

// 注册工具
window.duobaoTools = window.duobaoTools || {};
window.duobaoTools.jsonFormatter = {
  name: 'JSON格式化',
  icon: 'fa-code',
  description: '格式化、验证、查询和转换JSON数据，提供树视图和路径查询功能。',
  render: initJsonFormatter
};
})();
        }