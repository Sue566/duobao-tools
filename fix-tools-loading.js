/**
 * 工具加载修复脚本 - 解决工具加载卡死问题
 */

(function() {
  console.log('初始化工具加载修复脚本...');
  
  // 保存原始加载函数
  const originalLoadTool = window.loadTool;
  
  // 工具加载超时时间（毫秒）
  const TOOL_LOAD_TIMEOUT = 10000;
  
  // 工具依赖映射
  const toolDependencies = {
    'jsonFormatter': ['utils', 'formatter', 'treeView', 'query', 'converter', 'compare', 'ui', 'core', 
                     'queryModule', 'convertModule', 'compareModule', 'main'],
    'loanCalculator': ['utils', 'core', 'charts', 'ui', 'basicLoan', 'combinedLoan', 'prepaymentCalc', 
                      'compareCalc', 'exportTools', 'prepayment', 'compare', 'main'],
    'imageFlip': ['config', 'ui', 'core', 'imageAdjust', 'partialFlip', 'utils', 'handlers', 
                 'preview', 'download'],
    'colorConverter': ['utils', 'converter', 'palette', 'schemes', 'accessibility', 'ui',
                      'ui-base', 'ui-converter', 'ui-schemes', 'ui-accessibility', 'ui-palette'],
    'hashCalculator': ['utils', 'core', 'compare', 'ui'],
    'colorPicker': ['config', 'colorUtils', 'schemes', 'palette', 'events', 'ui'],
    'regexTester': ['ui', 'styles', 'utils', 'core', 'events'],
    'textReplacer': ['config', 'utils', 'history', 'rules', 'events', 'ui'],
    'unitConverter': ['data', 'core', 'utils', 'history', 'batch', 'table', 'custom', 'ui'],
    'randomPicker': ['ui', 'utils', 'history', 'visual', 'data', 'core']
  };
  
  // 工具模块加载状态
  const moduleLoadStatus = {};
  
  // 增强的工具加载函数
  window.loadTool = function(toolId) {
    console.log(`请求加载工具: ${toolId}`);
    
    return new Promise((resolve, reject) => {
      // 如果工具已加载，直接返回
      if (window.tools[toolId] && window.tools[toolId].render) {
        console.log(`工具 ${toolId} 已加载，直接返回`);
        resolve(window.tools[toolId]);
        return;
      }
      
      // 如果正在加载，返回已有的promise
      if (window.toolsStatus.loading[toolId]) {
        console.log(`工具 ${toolId} 正在加载中，等待完成`);
        return window.toolsStatus.loading[toolId];
      }
      
      // 创建加载promise
      const loadPromise = new Promise((resolveLoad, rejectLoad) => {
        // 添加超时处理
        const timeoutId = setTimeout(() => {
          console.error(`工具 ${toolId} 加载超时`);
          window.toolsStatus.failed[toolId] = true;
          delete window.toolsStatus.loading[toolId];
          rejectLoad(new Error(`工具 ${toolId} 加载超时`));
        }, TOOL_LOAD_TIMEOUT);
        
        // 检查是否是复杂工具（有多个模块）
        if (toolDependencies[toolId]) {
          console.log(`${toolId} 是复杂工具，加载其所有模块`);
          loadComplexTool(toolId, timeoutId, resolveLoad, rejectLoad);
        } else {
          // 简单工具，直接加载
          loadSimpleTool(toolId, timeoutId, resolveLoad, rejectLoad);
        }
      });
      
      // 记录加载状态
      window.toolsStatus.loading[toolId] = loadPromise;
      
      // 返回promise
      loadPromise.then(resolve).catch(reject);
    });
  };
  
  // 加载简单工具（单文件）
  function loadSimpleTool(toolId, timeoutId, resolve, reject) {
    console.log(`加载简单工具: ${toolId}`);
    
    // 尝试加载工具模块
    const script = document.createElement('script');
    script.src = `tools/${toolId}.js`;
    
    script.onload = function() {
      console.log(`工具 ${toolId} 脚本加载成功`);
      
      // 清除超时
      clearTimeout(timeoutId);
      
      // 同步duobaoTools到tools
      if (window.duobaoTools && window.duobaoTools[toolId]) {
        window.tools[toolId] = window.duobaoTools[toolId];
      }
      
      // 检查工具是否正确注册
      if (!window.tools[toolId]) {
        console.warn(`工具 ${toolId} 脚本已加载但未正确注册，尝试修复`);
        
        // 尝试从全局变量中查找工具
        if (window[toolId]) {
          console.log(`从全局变量中找到工具 ${toolId}，进行注册`);
          window.tools[toolId] = window[toolId];
        } else {
          // 创建一个基本的工具对象
          window.tools[toolId] = {
            render: function(container) {
              container.innerHTML = `
                <div class="tool-header">
                  <h2>${toolId}</h2>
                  <p class="tool-description">该工具加载异常，但我们创建了一个基本版本。</p>
                </div>
                <div class="tool-content">
                  <p>工具内容加载失败，请刷新页面重试。</p>
                </div>
              `;
            }
          };
        }
      }
      
      window.toolsStatus.loaded[toolId] = true;
      delete window.toolsStatus.loading[toolId];
      delete window.toolsStatus.failed[toolId];
      
      resolve(window.tools[toolId]);
    };
    
    script.onerror = function(err) {
      console.warn(`工具 ${toolId}.js 加载失败，尝试加载 ${toolId}/index.js`, err);
      
      // 尝试加载index.js作为备选
      const indexScript = document.createElement('script');
      indexScript.src = `tools/${toolId}/index.js`;
      
      indexScript.onload = function() {
        console.log(`工具 ${toolId} 通过index.js加载成功`);
        
        // 清除超时
        clearTimeout(timeoutId);
        
        // 同步duobaoTools到tools
        if (window.duobaoTools && window.duobaoTools[toolId]) {
          window.tools[toolId] = window.duobaoTools[toolId];
        }
        
        // 检查工具是否正确注册
        if (!window.tools[toolId]) {
          console.warn(`工具 ${toolId} 通过index.js加载但未正确注册，尝试修复`);
          
          // 尝试从全局变量中查找工具
          if (window[toolId]) {
            console.log(`从全局变量中找到工具 ${toolId}，进行注册`);
            window.tools[toolId] = window[toolId];
          }
        }
        
        window.toolsStatus.loaded[toolId] = true;
        delete window.toolsStatus.loading[toolId];
        delete window.toolsStatus.failed[toolId];
        
        resolve(window.tools[toolId]);
      };
      
      indexScript.onerror = function(indexErr) {
        console.error(`工具 ${toolId} 所有加载方式均失败`, indexErr);
        
        // 清除超时
        clearTimeout(timeoutId);
        
        window.toolsStatus.failed[toolId] = true;
        delete window.toolsStatus.loading[toolId];
        
        // 创建一个基本的工具对象，避免页面完全崩溃
        window.tools[toolId] = {
          render: function(container) {
            container.innerHTML = `
              <div class="tool-error">
                <i class="fa fa-exclamation-triangle"></i>
                <h3>工具加载失败</h3>
                <p>很抱歉，无法加载该工具。请刷新页面重试。</p>
                <p class="error-details">错误详情: 无法找到工具脚本文件</p>
              </div>
            `;
          }
        };
        
        reject(new Error(`无法加载工具 ${toolId}`));
      };
      
      document.head.appendChild(indexScript);
    };
    
    document.head.appendChild(script);
  }
  
  // 加载复杂工具（多文件）
  function loadComplexTool(toolId, timeoutId, resolve, reject) {
    console.log(`加载复杂工具: ${toolId}`);
    
    const modules = toolDependencies[toolId];
    let loadedCount = 0;
    const errors = [];
    
    // 初始化模块加载状态
    moduleLoadStatus[toolId] = {
      total: modules.length,
      loaded: 0,
      failed: 0,
      modules: {}
    };
    
    // 加载主模块
    const mainScript = document.createElement('script');
    mainScript.src = `tools/${toolId}/index.js`;
    
    mainScript.onload = function() {
      console.log(`工具 ${toolId} 主模块加载成功`);
      
      // 加载子模块
      modules.forEach(module => {
        const moduleScript = document.createElement('script');
        moduleScript.src = `tools/${toolId}/${module}.js`;
        
        moduleScript.onload = function() {
          console.log(`工具 ${toolId} 子模块 ${module} 加载成功`);
          loadedCount++;
          moduleLoadStatus[toolId].loaded++;
          moduleLoadStatus[toolId].modules[module] = true;
          
          // 检查是否所有模块都已加载
          checkComplexToolLoaded();
        };
        
        moduleScript.onerror = function(err) {
          console.warn(`工具 ${toolId} 子模块 ${module} 加载失败`, err);
          errors.push(`模块 ${module} 加载失败`);
          loadedCount++;
          moduleLoadStatus[toolId].failed++;
          moduleLoadStatus[toolId].modules[module] = false;
          
          // 检查是否所有模块都已尝试加载
          checkComplexToolLoaded();
        };
        
        document.head.appendChild(moduleScript);
      });
    };
    
    mainScript.onerror = function(err) {
      console.error(`工具 ${toolId} 主模块加载失败`, err);
      
      // 尝试直接加载单文件版本
      const singleFileScript = document.createElement('script');
      singleFileScript.src = `tools/${toolId}.js`;
      
      singleFileScript.onload = function() {
        console.log(`工具 ${toolId} 通过单文件方式加载成功`);
        
        // 清除超时
        clearTimeout(timeoutId);
        
        // 同步duobaoTools到tools
        if (window.duobaoTools && window.duobaoTools[toolId]) {
          window.tools[toolId] = window.duobaoTools[toolId];
        }
        
        window.toolsStatus.loaded[toolId] = true;
        delete window.toolsStatus.loading[toolId];
        delete window.toolsStatus.failed[toolId];
        
        resolve(window.tools[toolId]);
      };
      
      singleFileScript.onerror = function(singleErr) {
        console.error(`工具 ${toolId} 所有加载方式均失败`, singleErr);
        
        // 清除超时
        clearTimeout(timeoutId);
        
        window.toolsStatus.failed[toolId] = true;
        delete window.toolsStatus.loading[toolId];
        
        // 创建一个基本的工具对象，避免页面完全崩溃
        window.tools[toolId] = {
          render: function(container) {
            container.innerHTML = `
              <div class="tool-error">
                <i class="fa fa-exclamation-triangle"></i>
                <h3>工具加载失败</h3>
                <p>很抱歉，无法加载该工具。请刷新页面重试。</p>
                <p class="error-details">错误详情: 无法找到工具脚本文件</p>
              </div>
            `;
          }
        };
        
        reject(new Error(`无法加载工具 ${toolId}`));
      };
      
      document.head.appendChild(singleFileScript);
    };
    
    document.head.appendChild(mainScript);
    
    // 检查复杂工具是否加载完成
    function checkComplexToolLoaded() {
      if (loadedCount >= modules.length) {
        console.log(`工具 ${toolId} 所有模块加载尝试完成，成功: ${moduleLoadStatus[toolId].loaded}，失败: ${moduleLoadStatus[toolId].failed}`);
        
        // 清除超时
        clearTimeout(timeoutId);
        
        // 同步duobaoTools到tools
        if (window.duobaoTools && window.duobaoTools[toolId]) {
          window.tools[toolId] = window.duobaoTools[toolId];
        }
        
        // 检查工具是否正确注册
        if (!window.tools[toolId]) {
          console.warn(`工具 ${toolId} 所有模块已加载但未正确注册，尝试修复`);
          
          // 尝试从全局变量中查找工具
          if (window[toolId]) {
            console.log(`从全局变量中找到工具 ${toolId}，进行注册`);
            window.tools[toolId] = window[toolId];
          } else {
            // 创建一个基本的工具对象
            window.tools[toolId] = {
              render: function(container) {
                container.innerHTML = `
                  <div class="tool-header">
                    <h2>${toolId}</h2>
                    <p class="tool-description">该工具加载异常，但我们创建了一个基本版本。</p>
                  </div>
                  <div class="tool-content">
                    <p>工具内容加载失败，请刷新页面重试。</p>
                    <p>已加载 ${moduleLoadStatus[toolId].loaded}/${moduleLoadStatus[toolId].total} 个模块。</p>
                  </div>
                `;
              }
            };
          }
        }
        
        if (moduleLoadStatus[toolId].failed > 0) {
          console.warn(`工具 ${toolId} 部分模块加载失败，但仍尝试使用`);
        }
        
        window.toolsStatus.loaded[toolId] = true;
        delete window.toolsStatus.loading[toolId];
        
        resolve(window.tools[toolId]);
      }
    }
  }
  
  // 修复工具渲染函数
  window.fixToolRender = function() {
    // 遍历所有工具，确保它们都有render方法
    for (const toolId in window.tools) {
      if (!window.tools[toolId].render) {
        console.warn(`工具 ${toolId} 缺少render方法，添加默认实现`);
        
        window.tools[toolId].render = function(container) {
          container.innerHTML = `
            <div class="tool-header">
              <h2>${toolId}</h2>
              <p class="tool-description">该工具缺少渲染方法，显示基本版本。</p>
            </div>
            <div class="tool-content">
              <p>工具内容无法正确渲染，请联系开发者修复。</p>
            </div>
          `;
        };
      }
    }
  };
  
  // 修复工具注册问题
  window.fixToolRegistration = function() {
    // 同步duobaoTools到tools
    if (window.duobaoTools) {
      for (const toolId in window.duobaoTools) {
        if (!window.tools[toolId]) {
          console.log(`从duobaoTools同步工具 ${toolId} 到tools`);
          window.tools[toolId] = window.duobaoTools[toolId];
        }
      }
    }
    
    // 检查全局变量中的工具
    window.menu.forEach(category => {
      category.children.forEach(item => {
        const toolId = item.tool;
        
        if (!window.tools[toolId] && window[toolId]) {
          console.log(`从全局变量中注册工具 ${toolId}`);
          window.tools[toolId] = window[toolId];
        }
      });
    });
  };
  
  // 在页面加载完成后执行修复
  window.addEventListener('DOMContentLoaded', () => {
    console.log('执行工具加载修复...');
    
    // 延迟执行，确保其他脚本已加载
    setTimeout(() => {
      window.fixToolRegistration();
      window.fixToolRender();
      
      // 添加全局错误处理
      window.addEventListener('error', function(event) {
        console.error('全局错误:', event.error);
        
        // 如果错误来自工具脚本，尝试恢复
        const filename = event.filename || '';
        if (filename.includes('/tools/')) {
          const pathParts = filename.split('/');
          const toolPart = pathParts.find(part => part.includes('tools'));
          const toolIndex = pathParts.indexOf(toolPart);
          
          if (toolIndex >= 0 && toolIndex + 1 < pathParts.length) {
            const possibleToolId = pathParts[toolIndex + 1].replace('.js', '');
            console.warn(`检测到工具 ${possibleToolId} 脚本错误，尝试恢复`);
            
            // 标记工具加载失败
            if (window.toolsStatus) {
              window.toolsStatus.failed[possibleToolId] = true;
              delete window.toolsStatus.loading[possibleToolId];
            }
          }
        }
      });
      
      console.log('工具加载修复完成');
    }, 1000);
  });
  
  // 创建简单工具示例，用于测试
  window.createSimpleTool = function() {
    window.tools['simple-tool'] = {
      render: function(container) {
        container.innerHTML = `
          <div class="tool-header">
            <h2>简单工具示例</h2>
            <p class="tool-description">这是一个用于测试工具加载的简单示例。</p>
          </div>
          <div class="tool-content">
            <p>如果你能看到这个工具，说明工具加载系统正常工作！</p>
            <button id="test-btn" class="btn">测试按钮</button>
            <div id="test-result" style="margin-top: 15px;"></div>
          </div>
        `;
        
        // 添加按钮事件
        setTimeout(() => {
          const testBtn = document.getElementById('test-btn');
          const testResult = document.getElementById('test-result');
          
          if (testBtn && testResult) {
            testBtn.addEventListener('click', () => {
              testResult.innerHTML = `
                <div class="alert alert-success">
                  <i class="fa fa-check-circle"></i> 测试成功！当前时间: ${new Date().toLocaleString()}
                </div>
              `;
            });
          }
        }, 100);
      }
    };
    
    console.log('创建简单工具示例完成');
  };
  
  // 立即创建简单工具示例
  window.createSimpleTool();
})();