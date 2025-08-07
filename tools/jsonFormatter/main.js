/**
 * JSON格式化工具 - 主模块
 * 整合所有功能模块
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
        
        const result = JsonFormatterCore.minifyJson(json);
        
        if (result.success) {
          jsonOutput.innerHTML = JsonUtils.syntaxHighlight(result.result);
          jsonOutput.classList.remove('error');
        } else {
          jsonOutput.textContent = `错误: ${result.error}`;
          jsonOutput.classList.add('error');
        }
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
        
        const result = JsonFormatterCore.validateJson(json);
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
      JsonUtils.copyToClipboard(text, copyBtn, copyBtn.innerHTML);
    });

    // 下载按钮点击事件
    downloadBtn.addEventListener('click', () => {
      const text = jsonOutput.textContent;
      if (!text) return;
      JsonUtils.downloadText(text, 'formatted.json', 'application/json');
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
      JsonTreeView.expandAll(jsonTree);
    });

    // 折叠全部按钮点击事件
    collapseAll.addEventListener('click', () => {
      JsonTreeView.collapseAll(jsonTree);
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
        const result = JsonPathQuery.query(parsedJson, path);
        
        if (result.success) {
          if (result.result === undefined || (Array.isArray(result.result) && result.result.length === 0)) {
            queryResult.textContent = '未找到匹配结果';
            queryResult.classList.add('warning');
          } else {
            const formattedResult = JSON.stringify(result.result, null, 2);
            queryResult.innerHTML = JsonUtils.syntaxHighlight(formattedResult);
            queryResult.classList.remove('error', 'warning');
          }
        } else {
          queryResult.textContent = `错误: ${result.error}`;
          queryResult.classList.add('error');
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
      JsonUtils.copyToClipboard(text, copyQueryResult, copyQueryResult.innerHTML);
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
        const yaml = JsonConverter.jsonToYaml(parsedJson);
        
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
        
        const json = JsonConverter.yamlToJson(yaml);
        const formattedJson = JSON.stringify(json, null, 2);
        
        convertResult.innerHTML = JsonUtils.syntaxHighlight(formattedJson);
        convertResult.classList.remove('error');
      } catch (error) {
        convertResult.textContent = `错误: ${error.message}`;
        convertResult.classList.add('error');
      }
    });

    // JSON转XML按钮点击事件
    jsonToXml.addEventListener('click', () => {
      try {
        const json = convertInput.value.trim();
        if (!json) {
          convertResult.textContent = '请输入JSON数据';
          convertResult.classList.add('error');
          return;
        }
        
        const parsedJson = JSON.parse(json);
        const xml = JsonConverter.jsonToXml(parsedJson);
        
        convertResult.textContent = xml;
        convertResult.classList.remove('error');
      } catch (error) {
        convertResult.textContent = `错误: ${error.message}`;
        convertResult.classList.add('error');
      }
    });

    // XML转JSON按钮点击事件
    xmlToJson.addEventListener('click', () => {
      try {
        const xml = convertInput.value.trim();
        if (!xml) {
          convertResult.textContent = '请输入XML数据';
          convertResult.classList.add('error');
          return;
        }
        
        const json = JsonConverter.xmlToJson(xml);
        const formattedJson = JSON.stringify(json, null, 2);
        
        convertResult.innerHTML = JsonUtils.syntaxHighlight(formattedJson);
        convertResult.classList.remove('error');
      } catch (error) {
        convertResult.textContent = `错误: ${error.message}`;
        convertResult.classList.add('error');
      }
    });

    // JSON转CSV按钮点击事件
    jsonToCsv.addEventListener('click', () => {
      try {
        const json = convertInput.value.trim();
        if (!json) {
          convertResult.textContent = '请输入JSON数据';
          convertResult.classList.add('error');
          return;
        }
        
        const parsedJson = JSON.parse(json);
        const csv = JsonConverter.jsonToCsv(parsedJson);
        
        convertResult.textContent = csv;
        convertResult.classList.remove('error');
      } catch (error) {
        convertResult.textContent = `错误: ${error.message}`;
        convertResult.classList.add('error');
      }
    });

    // CSV转JSON按钮点击事件
    csvToJson.addEventListener('click', () => {
      try {
        const csv = convertInput.value.trim();
        if (!csv) {
          convertResult.textContent = '请输入CSV数据';
          convertResult.classList.add('error');
          return;
        }
        
        const json = JsonConverter.csvToJson(csv);
        const formattedJson = JSON.stringify(json, null, 2);
        
        convertResult.innerHTML = syntaxHighlight(formattedJson);
        convertResult.classList.remove('error');
      } catch (error) {
        convertResult.textContent = `错误: ${error.message}`;
        convertResult.classList.add('error');
      }
    });

    // 复制转换结果按钮点击事件
    copyConvert.addEventListener('click', () => {
      const text = convertResult.textContent;
      if (!text) return;
      JsonUtils.copyToClipboard(text, copyConvert, copyConvert.innerHTML);
    });

    // 下载转换结果按钮点击事件
    downloadConvert.addEventListener('click', () => {
      const text = convertResult.textContent;
      if (!text) return;
      JsonUtils.downloadText(text, 'converted.txt', 'text/plain');
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
        
        const diff = JsonCompare.compare(parsedLeft, parsedRight);
        compareResult.innerHTML = JsonCompare.formatDiffToHtml(diff);
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
        
        const options = {
          indentSize: indent,
          sortKeys: doSortKeys,
          useTab: indentSize.value === 'tab'
        };
        
        const result = JsonFormatterCore.formatJson(json, options);
        
        if (result.success) {
          jsonOutput.innerHTML = JsonUtils.syntaxHighlight(result.result);
          jsonOutput.classList.remove('error', 'success');
          
          // 更新统计信息
          updateJsonStats(result.stats);
          
          // 创建树视图
          const parsedJson = JSON.parse(json);
          JsonTreeView.createTreeView(parsedJson, jsonTree);
        } else {
          jsonOutput.textContent = `错误: ${result.error}`;
          jsonOutput.classList.add('error');
          jsonTree.innerHTML = '';
        }
      } catch (error) {
        jsonOutput.textContent = `错误: ${error.message}`;
        jsonOutput.classList.add('error');
        jsonTree.innerHTML = '';
      }
    }

    // 更新JSON统计信息
    function updateJsonStats(stats) {
      jsonSize.textContent = JsonUtils.formatSize(stats.size);
      jsonNodes.textContent = stats.nodes;
      jsonDepth.textContent = stats.depth;
    }
  }
})();