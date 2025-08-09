/**
 * 工具修复脚本 - 用于修复工具加载问题
 */

// 确保工具对象存在
window.tools = window.tools || {};
window.duobaoTools = window.duobaoTools || {};

// 同步工具对象
function syncTools() {
  // 从duobaoTools同步到tools
  if (window.duobaoTools) {
    Object.keys(window.duobaoTools).forEach(toolId => {
      if (!window.tools[toolId]) {
        window.tools[toolId] = window.duobaoTools[toolId];
        console.log(`从duobaoTools同步工具: ${toolId}`);
      }
    });
  }
  
  // 从tools同步到duobaoTools
  if (window.tools) {
    Object.keys(window.tools).forEach(toolId => {
      if (!window.duobaoTools[toolId]) {
        window.duobaoTools[toolId] = window.tools[toolId];
        console.log(`从tools同步工具: ${toolId}`);
      }
    });
  }
}

// 修复工具加载问题
function fixToolsLoading() {
  // 确保工具加载函数存在
  if (!window.loadTool) {
    window.loadTool = function(toolId) {
      return new Promise((resolve, reject) => {
        // 如果工具已加载，直接返回
        if (window.tools[toolId]) {
          resolve(window.tools[toolId]);
          return;
        }
        
        // 尝试加载工具模块
        const script = document.createElement('script');
        script.src = `tools/${toolId}.js`;
        script.onload = function() {
          console.log(`工具 ${toolId} 加载成功`);
          
          // 同步工具对象
          syncTools();
          
          resolve(window.tools[toolId] || window.duobaoTools[toolId]);
        };
        script.onerror = function(err) {
          console.error(`工具 ${toolId} 加载失败`, err);
          
          // 尝试加载index.js作为备选
          const indexScript = document.createElement('script');
          indexScript.src = `tools/${toolId}/index.js`;
          indexScript.onload = function() {
            console.log(`工具 ${toolId} 通过index.js加载成功`);
            
            // 同步工具对象
            syncTools();
            
            resolve(window.tools[toolId] || window.duobaoTools[toolId]);
          };
          indexScript.onerror = function(indexErr) {
            console.error(`工具 ${toolId} 通过index.js加载也失败`, indexErr);
            reject(new Error(`无法加载工具 ${toolId}`));
          };
          document.head.appendChild(indexScript);
        };
        document.head.appendChild(script);
      });
    };
  }
  
  // 确保工具注册函数存在
  if (!window.registerTool) {
    window.registerTool = function(toolId, module) {
      window.tools[toolId] = module;
      console.log(`工具 ${toolId} 已注册`);
      
      // 同步到duobaoTools
      window.duobaoTools[toolId] = module;
    };
  }
}

// 修复工具渲染问题
function fixToolsRendering() {
  // 修复showTool函数
  const originalShowTool = window.showTool;
  if (originalShowTool) {
    window.showTool = function(toolId) {
      // 先加载工具，再显示
      window.loadTool(toolId)
        .then(() => {
          // 调用原始的showTool函数
          originalShowTool(toolId);
        })
        .catch(err => {
          console.error(`加载工具 ${toolId} 失败:`, err);
          
          // 显示错误信息
          const toolSection = document.getElementById(`tool-${toolId}`);
          if (toolSection) {
            toolSection.innerHTML = `
              <div class="tool-error">
                <i class="fa fa-exclamation-triangle"></i>
                <h3>工具加载失败</h3>
                <p>很抱歉，工具加载时出现错误。请刷新页面重试。</p>
                <p class="error-details">错误详情: ${err.message}</p>
              </div>
            `;
            toolSection.style.display = 'block';
          }
        });
    };
  }
}

// 执行修复
document.addEventListener('DOMContentLoaded', function() {
  console.log('执行工具修复脚本...');
  
  // 修复工具加载问题
  fixToolsLoading();
  
  // 修复工具渲染问题
  fixToolsRendering();
  
  // 同步工具对象
  syncTools();
  
  console.log('工具修复完成');
});