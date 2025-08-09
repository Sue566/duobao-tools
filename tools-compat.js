/**
 * 工具兼容层 - 用于确保所有工具都能正确加载和渲染
 */

(function() {
  // 工具模块映射
  const toolModules = {};
  
  // 工具路径映射
  const toolPaths = {
    'jsonFormatter': 'tools/jsonFormatter',
    'loanCalculator': 'tools/loanCalculator',
    'unitConverter': 'tools/unitConverter',
    'imageFlip': 'tools/imageFlip',
    'colorConverter': 'tools/colorConverter',
    'hashCalculator': 'tools/hashCalculator',
    'colorPicker': 'tools/colorPicker',
    'regexTester': 'tools/regexTester',
    'randomPicker': 'tools/randomPicker',
    'textReplacer': 'tools/textReplacer'
  };
  
  // 加载工具模块
  function loadToolModule(toolId) {
    return new Promise((resolve, reject) => {
      // 如果工具模块已加载，直接返回
      if (toolModules[toolId]) {
        resolve(toolModules[toolId]);
        return;
      }
      
      // 获取工具路径
      const toolPath = toolPaths[toolId] || `tools/${toolId}`;
      
      // 尝试加载工具模块
      const script = document.createElement('script');
      script.src = `${toolPath}.js`;
      script.onload = function() {
        console.log(`工具 ${toolId} 加载成功`);
        
        // 检查工具是否已注册
        if (window.tools[toolId] || window.duobaoTools[toolId]) {
          // 同步工具对象
          if (window.duobaoTools[toolId] && !window.tools[toolId]) {
            window.tools[toolId] = window.duobaoTools[toolId];
          }
          if (window.tools[toolId] && !window.duobaoTools[toolId]) {
            window.duobaoTools[toolId] = window.tools[toolId];
          }
          
          // 缓存工具模块
          toolModules[toolId] = window.tools[toolId] || window.duobaoTools[toolId];
          resolve(toolModules[toolId]);
        } else {
          // 尝试加载index.js
          const indexScript = document.createElement('script');
          indexScript.src = `${toolPath}/index.js`;
          indexScript.onload = function() {
            console.log(`工具 ${toolId} 通过index.js加载成功`);
            
            // 同步工具对象
            if (window.duobaoTools[toolId] && !window.tools[toolId]) {
              window.tools[toolId] = window.duobaoTools[toolId];
            }
            if (window.tools[toolId] && !window.duobaoTools[toolId]) {
              window.duobaoTools[toolId] = window.tools[toolId];
            }
            
            // 缓存工具模块
            toolModules[toolId] = window.tools[toolId] || window.duobaoTools[toolId];
            resolve(toolModules[toolId]);
          };
          indexScript.onerror = function(err) {
            console.error(`工具 ${toolId} 通过index.js加载失败`, err);
            reject(new Error(`无法加载工具 ${toolId}`));
          };
          document.head.appendChild(indexScript);
        }
      };
      script.onerror = function(err) {
        console.error(`工具 ${toolId} 加载失败`, err);
        
        // 尝试加载index.js
        const indexScript = document.createElement('script');
        indexScript.src = `${toolPath}/index.js`;
        indexScript.onload = function() {
          console.log(`工具 ${toolId} 通过index.js加载成功`);
          
          // 同步工具对象
          if (window.duobaoTools[toolId] && !window.tools[toolId]) {
            window.tools[toolId] = window.duobaoTools[toolId];
          }
          if (window.tools[toolId] && !window.duobaoTools[toolId]) {
            window.duobaoTools[toolId] = window.tools[toolId];
          }
          
          // 缓存工具模块
          toolModules[toolId] = window.tools[toolId] || window.duobaoTools[toolId];
          resolve(toolModules[toolId]);
        };
        indexScript.onerror = function(indexErr) {
          console.error(`工具 ${toolId} 通过index.js加载也失败`, indexErr);
          reject(new Error(`无法加载工具 ${toolId}`));
        };
        document.head.appendChild(indexScript);
      };
      document.head.appendChild(script);
    });
  }
  
  // 渲染工具
  function renderTool(toolId, container) {
    return loadToolModule(toolId)
      .then(module => {
        if (module && module.render) {
          module.render(container);
        } else {
          throw new Error(`工具 ${toolId} 没有render方法`);
        }
      });
  }
  
  // 替换原始的loadTool函数
  window.loadTool = loadToolModule;
  
  // 添加renderTool函数
  window.renderTool = renderTool;
  
  // 修复showTool函数
  const originalShowTool = window.showTool;
  if (originalShowTool) {
    window.showTool = function(toolId) {
      // 显示加载状态
      const loadingEl = document.createElement('div');
      loadingEl.className = 'tool-loading';
      loadingEl.innerHTML = `
        <div class="loading-spinner"></div>
        <p>正在加载工具，请稍候...</p>
      `;
      document.getElementById('content').appendChild(loadingEl);
      
      // 隐藏所有工具
      document.querySelectorAll('#content section').forEach(sec => {
        sec.style.display = 'none';
      });
      
      // 隐藏首页
      const homepage = document.getElementById('homepage');
      if (homepage) {
        homepage.style.display = 'none';
      }
      
      // 展开对应的菜单
      if (window.expandMenuByToolId) {
        window.expandMenuByToolId(toolId);
      }
      
      // 加载并渲染工具
      loadToolModule(toolId)
        .then(() => {
          // 移除加载状态
          if (loadingEl.parentNode) {
            loadingEl.parentNode.removeChild(loadingEl);
          }
          
          // 显示指定工具
          const toolSection = document.getElementById(`tool-${toolId}`);
          if (toolSection) {
            toolSection.style.display = 'block';
            
            // 如果工具还没有渲染，则渲染它
            if (toolSection.innerHTML === '') {
              const module = window.tools[toolId] || window.duobaoTools[toolId];
              if (module && module.render) {
                try {
                  module.render(toolSection);
                  
                  // 添加工具使用次数
                  if (window.incrementToolUsage) {
                    window.incrementToolUsage(toolId);
                  }
                  
                  // 添加到历史记录
                  if (window.addToHistory) {
                    window.addToHistory(toolId);
                  }
                } catch (err) {
                  console.error(`工具 ${toolId} 渲染失败:`, err);
                  toolSection.innerHTML = `
                    <div class="tool-error">
                      <i class="fa fa-exclamation-triangle"></i>
                      <h3>工具渲染失败</h3>
                      <p>很抱歉，工具渲染时出现错误。请刷新页面重试。</p>
                      <p class="error-details">错误详情: ${err.message}</p>
                    </div>
                  `;
                }
              } else {
                toolSection.innerHTML = `
                  <div class="tool-error">
                    <i class="fa fa-exclamation-triangle"></i>
                    <h3>工具加载失败</h3>
                    <p>很抱歉，无法找到该工具。请刷新页面重试。</p>
                  </div>
                `;
              }
            }
            
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // 更新页面标题
            const toolTitle = toolSection.dataset.title || '工具';
            document.title = `${toolTitle} - 多宝工具箱`;
            
            // 添加面包屑导航
            if (window.updateBreadcrumb) {
              window.updateBreadcrumb(toolId);
            }
          }
        })
        .catch(err => {
          // 移除加载状态
          if (loadingEl.parentNode) {
            loadingEl.parentNode.removeChild(loadingEl);
          }
          
          console.error(`加载工具 ${toolId} 失败:`, err);
          
          // 显示错误信息
          const errorSection = document.createElement('section');
          errorSection.id = `tool-${toolId}`;
          errorSection.innerHTML = `
            <div class="tool-error">
              <i class="fa fa-exclamation-triangle"></i>
              <h3>工具加载失败</h3>
              <p>很抱歉，工具加载时出现错误。请刷新页面重试。</p>
              <p class="error-details">错误详情: ${err.message}</p>
            </div>
          `;
          document.getElementById('content').appendChild(errorSection);
          errorSection.style.display = 'block';
          
          // 更新面包屑导航
          if (window.updateBreadcrumb) {
            window.updateBreadcrumb(toolId);
          }
        });
    };
  }
  
  console.log('工具兼容层已初始化');
})();