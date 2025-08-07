/**
 * 多宝工具箱 - 增强版工具加载器
 * 负责动态加载工具模块，实现智能懒加载以提高性能
 * 支持依赖管理、预加载策略和缓存机制
 */

(function() {
  // 工具加载状态记录
  window.toolsStatus = {
    loaded: {},     // 已加载的工具
    loading: {},    // 正在加载的工具
    dependencies: { // 工具依赖关系
      'textReplacer': ['textReplacer-utils']
      // 可以根据需要添加更多依赖关系
    },
    popular: [      // 热门工具，可以预加载
      'jsonFormatter',
      'qrCodeGenerator',
      'timestamp',
      'regexTester',
      'passwordGenerator',
      'textReplacer'
    ],
    usage: {},      // 工具使用次数统计
    lastUsed: {}    // 工具最后使用时间
  };
  
  // 初始化工具对象
  window.tools = {};
  
  // 从本地存储加载使用统计
  try {
    const savedUsage = localStorage.getItem('toolsUsageStats');
    if (savedUsage) {
      const stats = JSON.parse(savedUsage);
      window.toolsStatus.usage = stats.usage || {};
      window.toolsStatus.lastUsed = stats.lastUsed || {};
    }
  } catch (e) {
    console.warn('加载工具使用统计失败:', e);
  }
  
  /**
   * 保存工具使用统计到本地存储
   */
  function saveUsageStats() {
    try {
      localStorage.setItem('toolsUsageStats', JSON.stringify({
        usage: window.toolsStatus.usage,
        lastUsed: window.toolsStatus.lastUsed
      }));
    } catch (e) {
      console.warn('保存工具使用统计失败:', e);
    }
  }
  
  /**
   * 记录工具使用
   * @param {string} toolId - 工具ID
   */
  window.recordToolUsage = function(toolId) {
    if (!toolId) return;
    
    // 更新使用次数
    window.toolsStatus.usage[toolId] = (window.toolsStatus.usage[toolId] || 0) + 1;
    
    // 更新最后使用时间
    window.toolsStatus.lastUsed[toolId] = Date.now();
    
    // 保存到本地存储
    saveUsageStats();
    
    // 动态更新热门工具列表
    updatePopularTools();
  };
  
  /**
   * 动态更新热门工具列表
   */
  function updatePopularTools() {
    // 只在有足够使用数据时更新
    const usageEntries = Object.entries(window.toolsStatus.usage);
    if (usageEntries.length < 8) return;
    
    // 根据使用频率和最近使用时间计算工具得分
    const now = Date.now();
    const toolScores = usageEntries.map(([toolId, count]) => {
      const lastUsed = window.toolsStatus.lastUsed[toolId] || 0;
      const recency = Math.max(0, 1 - (now - lastUsed) / (7 * 24 * 60 * 60 * 1000)); // 一周内的时间衰减
      const score = count * 0.7 + recency * 0.3; // 使用次数和最近使用的加权得分
      return { toolId, score };
    });
    
    // 按得分排序并取前6个
    const topTools = toolScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.toolId);
    
    // 更新热门工具列表
    window.toolsStatus.popular = topTools;
  }
  
  /**
   * 加载单个工具
   * @param {string} toolId - 工具ID
   * @param {boolean} [isDependent=false] - 是否是作为依赖加载
   * @returns {Promise} - 加载完成的Promise
   */
  window.loadTool = function(toolId, isDependent = false) {
    // 如果工具已加载，直接返回成功
    if (window.toolsStatus.loaded[toolId]) {
      return Promise.resolve(toolId);
    }
    
    // 如果工具正在加载，返回已有的Promise
    if (window.toolsStatus.loading[toolId]) {
      return window.toolsStatus.loading[toolId];
    }
    
    // 首先加载依赖
    const dependencies = window.toolsStatus.dependencies[toolId] || [];
    const dependencyPromises = dependencies.map(depId => window.loadTool(depId, true));
    
    // 创建加载Promise
    const loadPromise = Promise.all(dependencyPromises)
      .then(() => {
        return new Promise((resolve, reject) => {
          console.log(`开始加载工具: ${toolId}`);
          
          const script = document.createElement('script');
          script.src = `tools/${toolId}.js?v=${getCacheVersion()}`;
          script.async = true;
          
          // 加载成功回调
          script.onload = function() {
            console.log(`工具 ${toolId} 加载成功`);
            window.toolsStatus.loaded[toolId] = true;
            delete window.toolsStatus.loading[toolId];
            
            // 非依赖工具记录使用
            if (!isDependent) {
              window.recordToolUsage(toolId);
            }
            
            resolve(toolId);
          };
          
          // 加载失败回调
          script.onerror = function(error) {
            console.error(`工具 ${toolId} 加载失败:`, error);
            delete window.toolsStatus.loading[toolId];
            
            // 显示友好的错误提示
            if (!isDependent) {
              const toolSection = document.getElementById(`tool-${toolId}`);
              if (toolSection) {
                toolSection.innerHTML = `
                  <div class="tool-error">
                    <h3><i class="fa fa-exclamation-triangle"></i> 工具加载失败</h3>
                    <p>很抱歉，工具 "${toolId}" 加载失败，可能是由于以下原因：</p>
                    <ul>
                      <li>网络连接问题</li>
                      <li>工具文件不存在或已损坏</li>
                      <li>浏览器兼容性问题</li>
                    </ul>
                    <p>您可以尝试刷新页面或稍后再试。</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">刷新页面</button>
                  </div>
                `;
              } else {
                // 如果找不到工具容器，创建一个错误通知
                const notification = document.createElement('div');
                notification.className = 'tool-load-error-notification';
                notification.innerHTML = `
                  <div class="notification-content">
                    <i class="fa fa-exclamation-circle"></i>
                    <span>工具 "${toolId}" 加载失败</span>
                    <button class="close-notification">&times;</button>
                  </div>
                `;
                document.body.appendChild(notification);
                
                // 添加关闭按钮事件
                notification.querySelector('.close-notification').addEventListener('click', () => {
                  document.body.removeChild(notification);
                });
                
                // 自动关闭通知
                setTimeout(() => {
                  if (notification.parentNode) {
                    document.body.removeChild(notification);
                  }
                }, 5000);
              }
            }
            
            reject(new Error(`工具 ${toolId} 加载失败`));
          };
          
          document.head.appendChild(script);
        });
      });
    
    // 记录加载状态
    window.toolsStatus.loading[toolId] = loadPromise;
    
    return loadPromise;
  };
  
  /**
   * 获取缓存版本号
   * 用于避免浏览器缓存过期的脚本
   */
  function getCacheVersion() {
    // 使用应用版本或当前日期作为缓存版本
    return window.appVersion || new Date().toISOString().slice(0, 10).replace(/-/g, '');
  }
  
  /**
   * 预加载热门工具
   */
  function preloadPopularTools() {
    // 使用 Intersection Observer 检测用户滚动到页面底部时预加载
    if ('IntersectionObserver' in window) {
      const footer = document.querySelector('footer') || document.createElement('div');
      
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // 用户已滚动到页面底部，开始预加载
          startPreloading();
          observer.disconnect();
        }
      }, { threshold: 0.1 });
      
      observer.observe(footer);
      
      // 如果用户在页面停留超过5秒，也开始预加载
      setTimeout(() => {
        if (!window.toolsStatus.preloadStarted) {
          startPreloading();
        }
      }, 5000);
    } else {
      // 兼容不支持 IntersectionObserver 的浏览器
      setTimeout(startPreloading, 3000);
    }
  }
  
  /**
   * 开始预加载过程
   */
  function startPreloading() {
    // 避免重复预加载
    if (window.toolsStatus.preloadStarted) return;
    window.toolsStatus.preloadStarted = true;
    
    // 使用 requestIdleCallback 在浏览器空闲时预加载热门工具
    const preloadFn = () => {
      let index = 0;
      
      function loadNext() {
        if (index >= window.toolsStatus.popular.length) return;
        
        const toolId = window.toolsStatus.popular[index++];
        window.loadTool(toolId, true)
          .catch(err => {
            console.warn(`预加载工具 ${toolId} 失败:`, err);
          })
          .finally(() => {
            // 使用 setTimeout 避免长时间阻塞主线程
            setTimeout(loadNext, 300);
          });
      }
      
      loadNext();
    };
    
    if (window.requestIdleCallback) {
      window.requestIdleCallback(preloadFn, { timeout: 5000 });
    } else {
      setTimeout(preloadFn, 1000);
    }
  }
  
  /**
   * 初始化菜单
   */
  function initializeMenu() {
    // 检查window.loadMenu函数是否存在
    if (typeof window.loadMenu === 'function') {
      window.loadMenu();
      
      // 菜单加载完成后，预加载热门工具
      preloadPopularTools();
    } else {
      console.error('loadMenu函数未定义，菜单初始化失败');
      
      // 尝试延迟加载
      setTimeout(() => {
        if (typeof window.loadMenu === 'function') {
          window.loadMenu();
          console.log('菜单延迟初始化成功');
          
          // 菜单加载完成后，预加载热门工具
          preloadPopularTools();
        } else {
          console.error('菜单延迟初始化失败');
        }
      }, 1000);
    }
  }
  
  // 页面加载完成后初始化菜单
  if (document.readyState === 'complete') {
    initializeMenu();
  } else {
    window.addEventListener('load', initializeMenu);
  }
})();
