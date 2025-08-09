/**
 * 修复菜单展开/折叠和工具加载问题
 */

(function() {
  console.log('正在修复菜单和工具加载问题...');
  
  // 全局定义expandMenu和collapseMenu函数，使其可以被其他函数调用
  window.expandMenu = function(li) {
    if (!li) return;
    
    const cat = li.querySelector('.cat');
    const ul = li.querySelector('ul');
    
    if (!cat || !ul) return;
    
    // 展开菜单
    ul.classList.add('expanded');
    ul.style.maxHeight = '10000px'; // 设置一个足够大的值
    ul.style.opacity = '1';
    ul.style.visibility = 'visible';
    
    // 添加旋转箭头类
    const arrow = cat.querySelector('.menu-arrow');
    if (arrow) {
      arrow.classList.add('rotated');
    }
    
    // 计算实际高度
    setTimeout(() => {
      if (ul.classList.contains('expanded')) {
        const scrollHeight = ul.scrollHeight;
        ul.style.maxHeight = (scrollHeight + 100) + 'px';
        console.log('展开菜单:', cat.textContent.trim(), '高度:', scrollHeight);
      }
    }, 200);
    
    // 保存菜单状态
    saveMenuState();
  };
  
  window.collapseMenu = function(li) {
    if (!li) return;
    
    const cat = li.querySelector('.cat');
    const ul = li.querySelector('ul');
    
    if (!cat || !ul) return;
    
    // 折叠菜单
    ul.classList.remove('expanded');
    ul.style.maxHeight = '0px';
    ul.style.opacity = '0';
    ul.style.visibility = 'hidden';
    
    // 移除旋转箭头类
    const arrow = cat.querySelector('.menu-arrow');
    if (arrow) {
      arrow.classList.remove('rotated');
    }
    
    console.log('折叠菜单:', cat.textContent.trim());
    
    // 保存菜单状态
    saveMenuState();
  };
  
  // 保存菜单展开状态
  function saveMenuState() {
    const expandedMenus = [];
    document.querySelectorAll('#menu > li').forEach((li, index) => {
      const ul = li.querySelector('ul');
      if (ul && ul.classList.contains('expanded')) {
        expandedMenus.push(index);
      }
    });
    
    try {
      localStorage.setItem('expandedMenus', JSON.stringify(expandedMenus));
    } catch (e) {
      console.error('保存菜单状态失败:', e);
    }
  }
  
  // 修复expandMenuByToolId函数
  window.expandMenuByToolId = function(toolId) {
    // 查找包含该工具的菜单项
    const menuItem = document.querySelector(`#menu a[data-tool="${toolId}"]`);
    if (!menuItem) return;
    
    // 找到父级li元素
    const parentLi = menuItem.closest('#menu > li');
    if (!parentLi) return;
    
    // 展开该菜单
    window.expandMenu(parentLi);
    
    // 添加活动状态
    document.querySelectorAll('#menu a').forEach(link => {
      link.classList.remove('active');
    });
    menuItem.classList.add('active');
  };
  
  // 修复工具加载问题
  const originalShowTool = window.showTool;
  if (originalShowTool) {
    window.showTool = function(toolId) {
      try {
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
        window.expandMenuByToolId(toolId);
        
        // 先加载工具，再显示
        window.loadTool(toolId)
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
                const module = window.tools[toolId];
                if (module && module.render) {
                  // 如果工具有初始化方法，先初始化
                  if (module.init) {
                    Promise.resolve(module.init())
                      .then(() => {
                        module.render(toolSection);
                        
                        // 添加工具使用次数
                        incrementToolUsage(toolId);
                        
                        // 添加到历史记录
                        if (window.addToHistory) {
                          window.addToHistory(toolId);
                        }
                      })
                      .catch(err => {
                        console.error(`工具 ${toolId} 初始化失败:`, err);
                        toolSection.innerHTML = `
                          <div class="tool-error">
                            <i class="fa fa-exclamation-triangle"></i>
                            <h3>工具加载失败</h3>
                            <p>很抱歉，工具初始化时出现错误。请刷新页面重试。</p>
                            <p class="error-details">错误详情: ${err.message}</p>
                          </div>
                        `;
                      });
                  } else {
                    module.render(toolSection);
                    
                    // 添加工具使用次数
                    incrementToolUsage(toolId);
                    
                    // 添加到历史记录
                    if (window.addToHistory) {
                      window.addToHistory(toolId);
                    }
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
      } catch (error) {
        console.error('showTool 函数执行出错:', error);
        alert('工具加载失败，请刷新页面重试');
      }
    };
  }
  
  // 记录工具使用次数
  function incrementToolUsage(toolId) {
    try {
      let usage = JSON.parse(localStorage.getItem('toolUsage')) || {};
      usage[toolId] = (usage[toolId] || 0) + 1;
      localStorage.setItem('toolUsage', JSON.stringify(usage));
    } catch (e) {
      console.error('无法记录工具使用次数', e);
    }
  }
  
  console.log('菜单和工具加载问题修复完成');
})();