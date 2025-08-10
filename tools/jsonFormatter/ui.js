/**
 * JSON格式化工具 - UI模块
 */

(function() {
  const ui = {
    // 初始化UI和事件绑定
    init: function(modules) {
      const { formatter, treeView, query, converter, compare, utils } = modules;
      
      // 获取DOM元素
      const elements = this.getDOMElements();
      
      // 初始化标签页切换
      this.initTabSwitching(elements);
      
      // 初始化结果视图切换
      this.initResultViewSwitching(elements);
      
      // 绑定格式化相关事件
      this.bindFormatterEvents(elements, formatter, treeView);
      
      // 绑定查询相关事件
      this.bindQueryEvents(elements, query, utils);
      
      // 绑定转换相关事件
      this.bindConverterEvents(elements, converter);
      
      // 绑定比较相关事件
      this.bindCompareEvents(elements, compare);
    },
    
    // 获取DOM元素
    getDOMElements: function() {
      return {
        // 格式化相关元素
        jsonInput: document.getElementById('json-input'),
        jsonOutput: document.getElementById('json-output'),
        formatBtn: document.getElementById('format-btn'),
        minifyBtn: document.getElementById('minify-btn'),
        validateBtn: document.getElementById('validate-btn'),
        clearBtn: document.getElementById('clear-btn'),
        copyBtn: document.getElementById('copy-btn'),
        downloadBtn: document.getElementById('download-btn'),
        pasteBtn: document.getElementById('paste-btn'),
        loadFileBtn: document.getElementById('load-file-btn'),
        fileInput: document.getElementById('file-input'),
        autoFormat: document.getElementById('auto-format'),
        indentSize: document.getElementById('indent-size'),
        sortKeys: document.getElementById('sort-keys'),
        jsonStats: document.getElementById('json-stats'),
        jsonSize: document.getElementById('json-size'),
        jsonNodes: document.getElementById('json-nodes'),
        jsonDepth: document.getElementById('json-depth'),
        jsonTree: document.getElementById('json-tree'),
        expandAll: document.getElementById('expand-all'),
        collapseAll: document.getElementById('collapse-all'),
        
        // 查询相关元素
        queryJsonInput: document.getElementById('query-json-input'),
        jsonPath: document.getElementById('json-path'),
        queryBtn: document.getElementById('query-btn'),
        queryResult: document.getElementById('query-result'),
        pathHelp: document.getElementById('path-help'),
        jsonPathHelp: document.getElementById('json-path-help'),
        closeHelp: document.querySelector('.close-help'),
        exampleBtns: document.querySelectorAll('.example-btn'),
        copyQueryResult: document.getElementById('copy-query-result'),
        
        // 转换相关元素
        convertInput: document.getElementById('convert-input'),
        convertResult: document.getElementById('convert-result'),
        jsonToYaml: document.getElementById('json-to-yaml'),
        yamlToJson: document.getElementById('yaml-to-json'),
        jsonToXml: document.getElementById('json-to-xml'),
        xmlToJson: document.getElementById('xml-to-json'),
        jsonToCsv: document.getElementById('json-to-csv'),
        csvToJson: document.getElementById('csv-to-json'),
        copyConvert: document.getElementById('copy-convert'),
        downloadConvert: document.getElementById('download-convert'),
        
        // 比较相关元素
        jsonLeft: document.getElementById('json-left'),
        jsonRight: document.getElementById('json-right'),
        compareBtn: document.getElementById('compare-btn'),
        compareResult: document.getElementById('compare-result'),
        
        // 标签页相关元素
        tabBtns: document.querySelectorAll('.tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        resultTabs: document.querySelectorAll('.result-tab'),
        resultContents: document.querySelectorAll('.result-content')
      };
    },
    
    // 初始化标签页切换
    initTabSwitching: function(elements) {
      const { tabBtns, tabContents } = elements;
      
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
    },
    
    // 初始化结果视图切换
    initResultViewSwitching: function(elements) {
      const { resultTabs, resultContents } = elements;
      
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
    },
    
    // 绑定格式化相关事件
    bindFormatterEvents: function(elements, formatter, treeView) {
      const {
        jsonInput, jsonOutput, formatBtn, minifyBtn, validateBtn, clearBtn,
        copyBtn, downloadBtn, pasteBtn, loadFileBtn, fileInput, autoFormat,
        indentSize, sortKeys, jsonTree, expandAll, collapseAll
      } = elements;
      
      // 格式化按钮点击事件
      formatBtn.addEventListener('click', () => {
        try {
          formatter.processJson(jsonInput.value, {
            indent: indentSize.value === 'tab' ? '\t' : parseInt(indentSize.value),
            doSortKeys: sortKeys.checked
          }, {
            ...elements,
            createJsonTreeView: treeView.createJsonTreeView.bind(treeView)
          });
        } catch (error) {
          console.error('格式化错误:', error);
        }
      });
      
      // 压缩按钮点击事件
      minifyBtn.addEventListener('click', () => {
        try {
          const json = jsonInput.value.trim();
          if (!json) return;
          
          const parsedJson = JSON.parse(json);
          const minified = JSON.stringify(parsedJson);
          
          jsonOutput.textContent = minified;
          jsonOutput.innerHTML = window.jsonFormatter.utils.syntaxHighlight(minified);
          formatter.updateJsonStats(parsedJson, elements);
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
          
          const result = formatter.validateJson(json);
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
        elements.jsonSize.textContent = '0 字节';
        elements.jsonNodes.textContent = '0';
        elements.jsonDepth.textContent = '0';
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
              formatBtn.click();
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
            formatBtn.click();
          }
        };
        reader.readAsText(file);
      });
      
      // 输入框内容变化事件
      jsonInput.addEventListener('input', () => {
        if (autoFormat.checked) {
          formatBtn.click();
        }
      });
      
      // 展开全部按钮点击事件
      expandAll.addEventListener('click', () => {
        treeView.expandAll(jsonTree);
      });
      
      // 折叠全部按钮点击事件
      collapseAll.addEventListener('click', () => {
        treeView.collapseAll(jsonTree);
      });
    },
    
    // 绑定查询相关事件
    bindQueryEvents: function(elements, query, utils) {
      const {
        queryJsonInput, jsonPath, queryBtn, queryResult,
        pathHelp, jsonPathHelp, closeHelp, exampleBtns, copyQueryResult
      } = elements;
      
      // 查询按钮点击事件
      queryBtn.addEventListener('click', () => {
        try {
          query.executeQuery(queryJsonInput.value, jsonPath.value, elements);
        } catch (error) {
          console.error('查询错误:', error);
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
    },
    
    // 绑定转换相关事件
    bindConverterEvents: function(elements, converter) {
      const {
        convertInput, convertResult, jsonToYaml, yamlToJson,
        jsonToXml, xmlToJson, jsonToCsv, csvToJson,
        copyConvert, downloadConvert
      } = elements;
      
      // JSON转YAML按钮点击事件
      jsonToYaml.addEventListener('click', () => {
        try {
          converter.executeConversion(convertInput.value, 'json-to-yaml', elements);
        } catch (error) {
          console.error('转换错误:', error);
        }
      });
      
      // YAML转JSON按钮点击事件
      yamlToJson.addEventListener('click', () => {
        try {
          converter.executeConversion(convertInput.value, 'yaml-to-json', elements);
        } catch (error) {
          console.error('转换错误:', error);
        }
      });
      
      // JSON转XML按钮点击事件
      jsonToXml.addEventListener('click', () => {
        try {
          converter.executeConversion(convertInput.value, 'json-to-xml', elements);
        } catch (error) {
          console.error('转换错误:', error);
        }
      });
      
      // XML转JSON按钮点击事件
      xmlToJson.addEventListener('click', () => {
        try {
          converter.executeConversion(convertInput.value, 'xml-to-json', elements);
        } catch (error) {
          console.error('转换错误:', error);
        }
      });
      
      // JSON转CSV按钮点击事件
      jsonToCsv.addEventListener('click', () => {
        try {
          converter.executeConversion(convertInput.value, 'json-to-csv', elements);
        } catch (error) {
          console.error('转换错误:', error);
        }
      });
      
      // CSV转JSON按钮点击事件
      csvToJson.addEventListener('click', () => {
        try {
          converter.executeConversion(convertInput.value, 'csv-to-json', elements);
        } catch (error) {
          console.error('转换错误:', error);
        }
      });
      
      // 复制转换结果按钮点击事件
      copyConvert.addEventListener('click', () => {
        const text = convertResult.textContent;
        if (!text) return;
        
        navigator.clipboard.writeText(text)
          .then(() => {
            const originalText = copyConvert.innerHTML;
            copyConvert.innerHTML = '<i class="fa fa-check"></i> 已复制';
            setTimeout(() => {
              copyConvert.innerHTML = originalText;
            }, 2000);
          })
          .catch(err => {
            console.error('复制失败:', err);
          });
      });
      
      // 下载转换结果按钮点击事件
      downloadConvert.addEventListener('click', () => {
        const text = convertResult.textContent;
        if (!text) return;
        
        let filename = 'converted';
        let type = 'text/plain';
        
        // 根据当前活动的转换按钮确定文件类型
        if (jsonToYaml.classList.contains('active')) {
          filename += '.yaml';
          type = 'application/x-yaml';
        } else if (yamlToJson.classList.contains('active')) {
          filename += '.json';
          type = 'application/json';
        } else if (jsonToXml.classList.contains('active')) {
          filename += '.xml';
          type = 'application/xml';
        } else if (xmlToJson.classList.contains('active')) {
          filename += '.json';
          type = 'application/json';
        } else if (jsonToCsv.classList.contains('active')) {
          filename += '.csv';
          type = 'text/csv';
        } else if (csvToJson.classList.contains('active')) {
          filename += '.json';
          type = 'application/json';
        }
        
        const blob = new Blob([text], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    },
    
    // 绑定比较相关事件
    bindCompareEvents: function(elements, compare) {
      const { jsonLeft, jsonRight, compareBtn, compareResult } = elements;
      
      // 比较按钮点击事件
      compareBtn.addEventListener('click', () => {
        try {
          compare.executeComparison(jsonLeft.value, jsonRight.value, elements);
        } catch (error) {
          console.error('比较错误:', error);
        }
      });
    }
  };

  // 将UI模块添加到全局命名空间
  window.jsonFormatter = window.jsonFormatter || {};
  window.jsonFormatter.ui = ui;
})();
