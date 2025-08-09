/**
 * 模块打包器 - 用于处理模块化工具的加载
 */

(function() {
  // 工具模块映射
  const toolModules = {
    'jsonFormatter': [
      'utils', 'formatter', 'treeView', 'query', 'converter', 'compare', 'ui', 'core',
      'queryModule', 'convertModule', 'compareModule', 'main'
    ],
    'loanCalculator': [
      'utils', 'core', 'charts', 'ui', 'basicLoan', 'combinedLoan', 'prepaymentCalc',
      'compareCalc', 'exportTools', 'prepayment', 'compare', 'main', 'main2', 'main3',
      'main4', 'main5'
    ],
    'imageFlip': [
      'config', 'ui', 'core', 'imageAdjust', 'partialFlip', 'utils', 'handlers',
      'preview', 'download'
    ],
    'colorConverter': [
      'utils', 'converter', 'palette', 'schemes', 'accessibility', 'ui',
      'ui-base', 'ui-converter', 'ui-schemes', 'ui-accessibility', 'ui-palette'
    ],
    'hashCalculator': [
      'utils', 'core', 'compare', 'ui'
    ],
    'colorPicker': [
      'config', 'colorUtils', 'schemes', 'palette', 'events', 'ui'
    ],
    'regexTester': [
      'ui', 'styles', 'utils', 'core', 'events'
    ],
    'textReplacer': [
      'config', 'utils', 'history', 'rules', 'events', 'ui'
    ],
    'unitConverter': [
      'data', 'core', 'utils', 'history', 'batch', 'table', 'custom', 'ui'
    ],
    'randomPicker': [
      'ui', 'utils', 'history', 'visual', 'data', 'core'
    ]
  };
  
  // 预加载工具模块
  function preloadToolModules(toolId) {
    if (!toolModules[toolId]) return Promise.resolve();
    
    const modules = toolModules[toolId];
    const promises = modules.map(module => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `tools/${toolId}/${module}.js`;
        script.onload = () => {
          console.log(`模块 ${toolId}/${module}.js 加载成功`);
          resolve();
        };
        script.onerror = (err) => {
          console.warn(`模块 ${toolId}/${module}.js 加载失败`, err);
          resolve(); // 即使失败也继续，不阻止其他模块加载
        };
        document.head.appendChild(script);
      });
    });
    
    return Promise.all(promises);
  }
  
  // 修改工具加载函数
  const originalLoadTool = window.loadTool;
  if (originalLoadTool) {
    window.loadTool = function(toolId) {
      // 如果是模块化工具，先预加载模块
      if (toolModules[toolId]) {
        return preloadToolModules(toolId)
          .then(() => originalLoadTool(toolId))
          .catch(err => {
            console.error(`预加载工具 ${toolId} 模块失败`, err);
            return originalLoadTool(toolId);
          });
      } else {
        return originalLoadTool(toolId);
      }
    };
  }
  
  // 添加全局模块解析函数
  window.resolveModule = function(toolId, moduleName) {
    // 尝试从全局对象中获取模块
    if (window[moduleName]) {
      return window[moduleName];
    }
    
    // 尝试从工具对象中获取模块
    if (window.tools[toolId] && window.tools[toolId][moduleName]) {
      return window.tools[toolId][moduleName];
    }
    
    // 尝试从duobaoTools对象中获取模块
    if (window.duobaoTools[toolId] && window.duobaoTools[toolId][moduleName]) {
      return window.duobaoTools[toolId][moduleName];
    }
    
    // 返回空对象
    return {};
  };
  
  console.log('模块打包器已初始化');
})();