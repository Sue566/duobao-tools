/**
 * 工具加载器 - 负责动态加载工具模块
 */

// 工具状态管理
window.toolsStatus = {
  loaded: {},  // 已加载的工具
  loading: {}, // 正在加载的工具
  failed: {},  // 加载失败的工具
  popular: []  // 热门工具（预加载用）
};

// 工具模块存储
window.tools = {};
window.duobaoTools = {}; // 兼容现有工具注册方式

// 加载工具
window.loadTool = function(toolId) {
  return new Promise((resolve, reject) => {
    // 如果工具已加载，直接返回
    if (window.tools[toolId]) {
      resolve(window.tools[toolId]);
      return;
    }
    
    // 如果正在加载，返回已有的promise
    if (window.toolsStatus.loading[toolId]) {
      return window.toolsStatus.loading[toolId];
    }
    
    // 开始加载
    console.log(`开始加载工具: ${toolId}`);
    
    // 创建加载promise
    const loadPromise = new Promise((resolveLoad, rejectLoad) => {
      // 尝试加载工具模块
      const script = document.createElement('script');
      script.src = `tools/${toolId}.js`;
      script.onload = function() {
        console.log(`工具 ${toolId} 加载成功`);
        window.toolsStatus.loaded[toolId] = true;
        delete window.toolsStatus.loading[toolId];
        
        // 同步duobaoTools到tools
        if (window.duobaoTools && window.duobaoTools[toolId]) {
          window.tools[toolId] = window.duobaoTools[toolId];
        }
        
        resolveLoad(window.tools[toolId]);
      };
      script.onerror = function(err) {
        console.error(`工具 ${toolId} 加载失败`, err);
        window.toolsStatus.failed[toolId] = true;
        delete window.toolsStatus.loading[toolId];
        
        // 尝试加载index.js作为备选
        const indexScript = document.createElement('script');
        indexScript.src = `tools/${toolId}/index.js`;
        indexScript.onload = function() {
          console.log(`工具 ${toolId} 通过index.js加载成功`);
          window.toolsStatus.loaded[toolId] = true;
          delete window.toolsStatus.failed[toolId];
          resolveLoad(window.tools[toolId]);
        };
        indexScript.onerror = function(indexErr) {
          console.error(`工具 ${toolId} 通过index.js加载也失败`, indexErr);
          rejectLoad(new Error(`无法加载工具 ${toolId}`));
        };
        document.head.appendChild(indexScript);
      };
      document.head.appendChild(script);
    });
    
    // 记录加载状态
    window.toolsStatus.loading[toolId] = loadPromise;
    
    // 返回promise
    loadPromise.then(resolve).catch(reject);
  });
};

// 预加载热门工具
function preloadPopularTools() {
  if (window.toolsStatus.popular && window.toolsStatus.popular.length > 0) {
    console.log('预加载热门工具:', window.toolsStatus.popular);
    window.toolsStatus.popular.forEach(toolId => {
      // 使用setTimeout避免阻塞主线程
      setTimeout(() => {
        window.loadTool(toolId).catch(err => {
          console.warn(`预加载工具 ${toolId} 失败:`, err);
        });
      }, 2000); // 延迟2秒预加载，优先加载页面
    });
  }
}

// 页面加载完成后预加载热门工具
window.addEventListener('load', () => {
  preloadPopularTools();
});

// 注册工具模块
window.registerTool = function(toolId, module) {
  window.tools[toolId] = module;
  console.log(`工具 ${toolId} 已注册`);
};