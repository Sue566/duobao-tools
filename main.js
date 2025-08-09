// 工具模块引用
const modules = window.tools;

// 加载菜单
function loadMenu() {
  const list = document.getElementById('menu');
  window.menu.forEach(cat => {
    const li = document.createElement('li');
    const iconClass = cat.icon || getCategoryIcon(cat.title);
    const toolCount = cat.count || cat.children.length;
    li.innerHTML = `<span class="cat">
      <div><i class="${iconClass}"></i> ${cat.title}</div>
      <div><span class="tool-count">${toolCount}</span> <i class="fas fa-chevron-down menu-arrow"></i></div>
    </span>`;
    const ul = document.createElement('ul');
    cat.children.forEach(child => {
      const item = document.createElement('li');
      item.innerHTML = `<a href="#tool-${child.tool}" data-tool="${child.tool}"><i class="fa ${getToolIcon(child.tool)}"></i> ${child.title}</a>`;
      ul.appendChild(item);
    });
    li.appendChild(ul);
    list.appendChild(li);
  });
  
  // 添加菜单点击事件
  document.querySelectorAll('#menu a').forEach(a => {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 移除所有活动状态
      document.querySelectorAll('#menu a').forEach(link => {
        link.classList.remove('active');
      });
      
      // 添加活动状态
      this.classList.add('active');
      
      // 显示对应工具
      const toolId = this.getAttribute('data-tool');
      showTool(toolId);
      
      // 更新URL
      window.location.hash = `tool-${toolId}`;
      
      // 在移动设备上自动收起侧边栏
      if (window.innerWidth <= 768) {
        toggleSidebar();
      }
    });
  });
  
  // 展开/折叠分类 - 使用事件委托
  document.getElementById('menu').addEventListener('click', function(e) {
    // 检查点击的是否是菜单分类标题或其子元素
    const cat = e.target.closest('.cat');
    if (!cat) return; // 如果不是点击的菜单分类，直接返回
    
    // 如果点击的是链接，不处理展开/折叠
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      return;
    }
    
    // 阻止事件冒泡
    e.preventDefault();
    e.stopPropagation();
    
    // 获取父级li元素
    const li = cat.closest('li');
    if (!li) return;
    
    // 获取子菜单ul元素
    const ul = li.querySelector('ul');
    if (!ul) return; // 防止空引用错误
    
    // 检查子菜单数量
    const childCount = ul.querySelectorAll('li').length;
    console.log('菜单:', cat.textContent.trim(), '子菜单数量:', childCount);
    
    // 如果没有子菜单，不执行展开/折叠操作
    if (childCount === 0) {
      console.log('该菜单没有子菜单，跳过展开/折叠操作');
      return;
    }
    
    const isExpanded = ul.classList.contains('expanded');
    console.log('点击菜单:', cat.textContent.trim(), '当前状态:', isExpanded ? '已展开' : '已折叠');
    
    // 关闭所有其他分类
    document.querySelectorAll('#menu > li').forEach(otherLi => {
      if (otherLi !== li) {
        collapseMenu(otherLi);
      }
    });
    
    // 切换当前分类
    if (!isExpanded) {
      expandMenu(li);
    } else {
      collapseMenu(li);
    }
  });
  
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

// 恢复菜单展开状态
function restoreMenuState() {
  try {
    const expandedMenus = JSON.parse(localStorage.getItem('expandedMenus')) || [];
    document.querySelectorAll('#menu > li').forEach((li, index) => {
      if (expandedMenus.includes(index)) {
        expandMenu(li);
      }
    });
  } catch (e) {
    console.error('恢复菜单状态失败:', e);
  }
}

// 辅助函数：展开指定菜单
function expandMenu(li) {
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
}

// 辅助函数：折叠指定菜单
function collapseMenu(li) {
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
}
  
  // 恢复菜单状态或默认展开第一个分类
  setTimeout(() => {
    try {
      const expandedMenus = JSON.parse(localStorage.getItem('expandedMenus')) || [];
      if (expandedMenus.length > 0) {
        // 恢复保存的菜单状态
        restoreMenuState();
      } else {
        // 如果没有保存的状态，默认展开第一个分类
        const firstLi = document.querySelector('#menu > li:first-child');
        expandMenu(firstLi);
      }
    } catch (e) {
      console.error('恢复菜单状态失败，默认展开第一个菜单:', e);
      const firstLi = document.querySelector('#menu > li:first-child');
      expandMenu(firstLi);
    }
  }, 300); // 增加延迟时间，确保DOM已完全渲染
  
  // 加载所有工具
  loadAllTools(window.menu);
  
  // 监听URL哈希变化
  window.addEventListener('hashchange', handleHashChange);
  
  // 初始处理URL
  handleHashChange();
}

// 保存最后访问的工具
function saveLastVisitedTool(toolId) {
  if (!toolId) return;
  
  try {
    localStorage.setItem('lastVisitedTool', toolId);
  } catch (e) {
    console.error('保存最后访问的工具失败:', e);
  }
}

// 获取最后访问的工具
function getLastVisitedTool() {
  try {
    return localStorage.getItem('lastVisitedTool');
  } catch (e) {
    console.error('获取最后访问的工具失败:', e);
    return null;
  }
}

// 处理URL哈希变化
function handleHashChange() {
  if (window.location.hash) {
    if (window.location.hash.startsWith('#tool-')) {
      const toolId = window.location.hash.substring(6); // 去掉 #tool- 前缀
      showTool(toolId);
      saveLastVisitedTool(toolId);
    }
  } else {
    // 检查是否有最后访问的工具
    const lastTool = getLastVisitedTool();
    const showLastTool = localStorage.getItem('showLastToolOnStartup') === 'true';
    
    if (lastTool && showLastTool) {
      // 自动打开最后访问的工具
      window.location.hash = `tool-${lastTool}`;
    } else {
      // 默认显示首页
      showHomepage();
    }
  }
}

// 获取分类图标
function getCategoryIcon(category) {
  // 直接从菜单数据中获取图标
  for (const item of window.menu) {
    if (item.title === category && item.icon) {
      return item.icon;
    }
  }
  
  // 如果没有在菜单数据中找到，使用默认图标映射
  const iconMap = {
    '文本处理': 'fas fa-font',
    '编码转换': 'fas fa-exchange-alt',
    '图片工具': 'fas fa-image',
    '开发工具': 'fas fa-code',
    '日期时间': 'fas fa-calendar-alt',
    '数字计算': 'fas fa-calculator',
    '格式化工具': 'fas fa-indent',
    '加密解密': 'fas fa-lock',
    '网络工具': 'fas fa-globe',
    '生活工具': 'fas fa-heart',
    '颜色工具': 'fas fa-palette'
  };
  
  return iconMap[category] || 'fas fa-wrench';
}

// 获取工具图标
function getToolIcon(tool) {
  const iconMap = {
    'caseConverter': 'fa-text-height',
    'textLength': 'fa-text-width',
    'urlEncoder': 'fa-link',
    'base64': 'fa-file-code-o',
    'jsonFormatter': 'fa-code',
    'textDiff': 'fa-files-o',
    'markdownEditor': 'fa-file-text-o',
    'textReplacer': 'fa-exchange',
    'qrCodeGenerator': 'fa-qrcode',
    'htmlEntityConverter': 'fa-html5',
    'baseConverter': 'fa-exchange',
    'rmbUppercase': 'fa-jpy',
    'unitConverter': 'fa-balance-scale',
    'calculator': 'fa-calculator',
    'timestamp': 'fa-clock-o',
    'dateCalculator': 'fa-calendar-plus-o',
    'calendar': 'fa-calendar',
    'colorConverter': 'fa-eyedropper',
    'colorPicker': 'fa-paint-brush',
    'gradientGenerator': 'fa-barcode',
    'imageCompressor': 'fa-compress',
    'imageConverter': 'fa-picture-o',
    'imageCropper': 'fa-crop',
    'regexTester': 'fa-terminal',
    'cssMinifier': 'fa-css3',
    'jsMinifier': 'fa-file-code-o',
    'jsonValidator': 'fa-check-square-o',
    'uuidGenerator': 'fa-key',
    'hashCalculator': 'fa-hashtag',
    'passwordGenerator': 'fa-lock',
    'ipLookup': 'fa-globe',
    'userAgent': 'fa-info-circle',
    'portScanner': 'fa-search',
    'md5': 'fa-shield',
    'sha1': 'fa-shield',
    'sha256': 'fa-shield',
    'aesEncryption': 'fa-lock',
    'bmiCalculator': 'fa-user-md',
    'loanCalculator': 'fa-money',
    'randomPicker': 'fa-random'
  };
  
  return iconMap[tool] || 'fa-wrench';
}

// 根据工具ID查找并展开对应的菜单
function expandMenuByToolId(toolId) {
  // 查找包含该工具的菜单项
  const menuItem = document.querySelector(`#menu a[data-tool="${toolId}"]`);
  if (!menuItem) return;
  
  // 找到父级li元素
  const parentLi = menuItem.closest('#menu > li');
  if (!parentLi) return;
  
  // 展开该菜单
  expandMenu(parentLi);
  
  // 添加活动状态
  document.querySelectorAll('#menu a').forEach(link => {
    link.classList.remove('active');
  });
  menuItem.classList.add('active');
}

// 显示指定工具
function showTool(toolId) {
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
  expandMenuByToolId(toolId);
  
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
                  window.addToHistory(toolId);
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
              window.addToHistory(toolId);
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
        updateBreadcrumb(toolId);
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
      updateBreadcrumb(toolId);
    });
}

// 更新面包屑导航
function updateBreadcrumb(toolId) {
  let breadcrumb = document.getElementById('breadcrumb');
  if (!breadcrumb) {
    breadcrumb = document.createElement('div');
    breadcrumb.id = 'breadcrumb';
    breadcrumb.className = 'breadcrumb';
    document.getElementById('content').prepend(breadcrumb);
  }
  
  // 查找工具信息
  let toolTitle = '';
  let categoryTitle = '';
  
  window.menu.forEach(cat => {
    cat.children.forEach(child => {
      if (child.tool === toolId) {
        toolTitle = child.title;
        categoryTitle = cat.title;
      }
    });
  });
  
  breadcrumb.innerHTML = `
    <a href="#" onclick="showHomepage(); return false;"><i class="fa fa-home"></i> 首页</a>
    <span class="separator"><i class="fa fa-angle-right"></i></span>
    <span>${categoryTitle}</span>
    <span class="separator"><i class="fa fa-angle-right"></i></span>
    <span class="current">${toolTitle}</span>
  `;
  
  breadcrumb.style.display = toolId ? 'flex' : 'none';
}

// 显示首页
function showHomepage() {
  // 创建首页内容
  const content = document.getElementById('content');
  
  // 检查首页是否已存在
  let homepage = document.getElementById('homepage');
  if (!homepage) {
    homepage = document.createElement('section');
    homepage.id = 'homepage';
    content.prepend(homepage);
    
    // 渲染首页内容
    homepage.innerHTML = `
      <div class="homepage-header">
        <h1><i class="fa fa-cubes"></i> 欢迎使用多宝工具箱</h1>
        <p class="tool-description">这里集合了各种实用的在线工具，帮助您提高工作效率和解决日常问题。无需安装，随时随地使用。</p>
      </div>
      
      <div class="search-box-large">
        <i class="fa fa-search"></i>
        <input type="text" id="home-search" placeholder="搜索工具..." />
      </div>
      
      <h2><i class="fa fa-fire"></i> 热门工具</h2>
      <div class="grid-container" id="popular-tools"></div>
      
      <h2><i class="fa fa-clock-o"></i> 最近更新</h2>
      <div class="grid-container" id="recent-tools"></div>
      
      <h2><i class="fa fa-th-large"></i> 工具分类</h2>
      <div class="category-grid" id="category-grid"></div>
    `;
    
    // 添加热门工具
    const popularTools = [
      { title: 'JSON 格式化', tool: 'jsonFormatter', icon: 'fa-code', desc: '格式化和验证JSON数据，提高可读性' },
      { title: '二维码生成器', tool: 'qrCodeGenerator', icon: 'fa-qrcode', desc: '生成自定义二维码，支持多种格式' },
      { title: '时间戳转换', tool: 'timestamp', icon: 'fa-clock-o', desc: '时间戳与日期互转，多种格式支持' },
      { title: '正则表达式测试', tool: 'regexTester', icon: 'fa-terminal', desc: '测试和验证正则表达式，实时匹配' },
      { title: '密码生成器', tool: 'passwordGenerator', icon: 'fa-key', desc: '生成安全的随机密码，可自定义规则' },
      { title: '文本替换工具', tool: 'textReplacer', icon: 'fa-exchange', desc: '批量替换文本内容，支持正则表达式' }
    ];
    
    const popularContainer = document.getElementById('popular-tools');
    popularTools.forEach(tool => {
      const div = document.createElement('div');
      div.className = 'grid-item';
      div.innerHTML = `
        <div class="tool-card">
          <div class="tool-card-header">
            <i class="fa ${tool.icon}"></i> ${tool.title}
          </div>
          <div class="tool-card-body">
            ${tool.desc}
          </div>
          <div class="tool-card-footer">
            <button class="tool-link" data-tool="${tool.tool}">立即使用 <i class="fa fa-arrow-right"></i></button>
          </div>
        </div>
      `;
      popularContainer.appendChild(div);
    });
    
    // 添加最近更新工具
    const recentTools = [
      { title: 'BMI 计算器', tool: 'bmiCalculator', icon: 'fa-user-md', desc: '计算体质指数，评估健康状况' },
      { title: '贷款计算器', tool: 'loanCalculator', icon: 'fa-money', desc: '计算贷款利息和还款计划' },
      { title: '图片压缩', tool: 'imageCompressor', icon: 'fa-file-image-o', desc: '无损压缩图片文件大小' },
      { title: 'IP 地址查询', tool: 'ipLookup', icon: 'fa-globe', desc: '查询 IP 地址的地理位置和网络信息' }
    ];
    
    const recentContainer = document.getElementById('recent-tools');
    recentTools.forEach(tool => {
      const div = document.createElement('div');
      div.className = 'grid-item';
      div.innerHTML = `
        <div class="tool-card">
          <div class="tool-card-header">
            <i class="fa ${tool.icon}"></i> ${tool.title}
            <span class="tag tag-success">新</span>
          </div>
          <div class="tool-card-body">
            ${tool.desc}
          </div>
          <div class="tool-card-footer">
            <button class="tool-link" data-tool="${tool.tool}">立即使用 <i class="fa fa-arrow-right"></i></button>
          </div>
        </div>
      `;
      recentContainer.appendChild(div);
    });
    
    // 添加工具分类
    const categoryGrid = document.getElementById('category-grid');
    window.menu.forEach(cat => {
      const div = document.createElement('div');
      div.className = 'category-item';
      
      const toolsList = cat.children.map(child => 
        `<a href="#tool-${child.tool}" data-tool="${child.tool}">${child.title}</a>`
      ).join('');
      
      div.innerHTML = `
        <div class="category-card">
          <div class="category-icon">
            <i class="fa ${getCategoryIcon(cat.title)}"></i>
          </div>
          <div class="category-title">${cat.title}</div>
          <div class="category-count">${cat.children.length}个工具</div>
          <div class="category-tools">
            ${toolsList}
          </div>
        </div>
      `;
      categoryGrid.appendChild(div);
    });
    
    // 添加工具链接点击事件
    document.querySelectorAll('.tool-link, .category-tools a').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const toolId = this.getAttribute('data-tool');
        showTool(toolId);
        
        // 更新URL
        window.location.hash = `tool-${toolId}`;
        
        // 设置活动状态
        document.querySelectorAll('#menu a').forEach(link => {
          link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`#menu a[data-tool="${toolId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
          
          // 展开包含活动链接的分类
          const parentUl = activeLink.closest('ul');
          if (parentUl) {
            parentUl.style.maxHeight = parentUl.scrollHeight + 'px';
            parentUl.classList.add('expanded');
          }
        }
      });
    });
    
    // 添加首页搜索功能
    const homeSearch = document.getElementById('home-search');
    if (homeSearch) {
      homeSearch.addEventListener('input', e => {
        const term = e.target.value.trim();
        document.getElementById('search').value = term;
        filterMenu(term);
      });
      
      // 添加回车键搜索
      homeSearch.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const term = e.target.value.trim();
          if (term) {
            document.getElementById('search').value = term;
            filterMenu(term);
            
            // 如果只有一个匹配结果，自动打开它
            const visibleTools = document.querySelectorAll('#menu a[style="display: list-item;"]');
            if (visibleTools.length === 1) {
              visibleTools[0].click();
            }
          }
        }
      });
    }
  }
  
  // 显示首页
  homepage.style.display = 'block';
  
  // 隐藏所有工具
  document.querySelectorAll('#content section:not(#homepage)').forEach(sec => {
    sec.style.display = 'none';
  });
  
  // 隐藏面包屑
  const breadcrumb = document.getElementById('breadcrumb');
  if (breadcrumb) {
    breadcrumb.style.display = 'none';
  }
  
  // 更新页面标题
  document.title = '多宝工具箱 - 实用在线工具集合';
  
  // 清空搜索框
  document.getElementById('search').value = '';
}

// 搜索工具
function filterMenu(term) {
  const lowerTerm = term.toLowerCase();
  let hasMatch = false;
  
  // 搜索菜单项
  document.querySelectorAll('#menu > li').forEach(li => {
    const cat = li.querySelector('.cat');
    const ul = li.querySelector('ul');
    
    if (!cat || !ul) return; // 防止空引用错误
    
    let categoryHasMatch = false;
    
    ul.querySelectorAll('a').forEach(a => {
      const match = a.textContent.toLowerCase().includes(lowerTerm);
      if (a.parentElement) {
        a.parentElement.style.display = match ? 'list-item' : 'none';
      }
      if (match) {
        categoryHasMatch = true;
        hasMatch = true;
      }
    });
    
    // 显示/隐藏分类
    li.style.display = categoryHasMatch ? 'block' : 'none';
    
    // 展开匹配的分类或折叠不匹配的分类
    if (categoryHasMatch && term) {
      expandMenu(li);
    } else if (!categoryHasMatch && term) {
      collapseMenu(li);
    }
  });
  
  // 搜索工具内容
  document.querySelectorAll('#content section').forEach(sec => {
    if (sec.id === 'homepage') return;
    
    const title = sec.querySelector('h2')?.textContent || '';
    const description = sec.querySelector('.tool-description')?.textContent || '';
    const match = title.toLowerCase().includes(lowerTerm) || description.toLowerCase().includes(lowerTerm);
    sec.style.display = match && term ? 'block' : 'none';
    
    if (match && term) {
      hasMatch = true;
    }
  });
  
  // 显示/隐藏首页
  const homepage = document.getElementById('homepage');
  if (homepage) {
    homepage.style.display = term ? 'none' : 'block';
  }
  
  // 显示搜索结果提示
  let searchResult = document.getElementById('search-result');
  if (!searchResult && term) {
    searchResult = document.createElement('div');
    searchResult.id = 'search-result';
    searchResult.className = 'search-result';
    const content = document.getElementById('content');
    if (content) {
      content.prepend(searchResult);
    }
  }
  
  if (searchResult) {
    if (!term) {
      if (searchResult.parentNode) {
        searchResult.parentNode.removeChild(searchResult);
      }
    } else {
      searchResult.innerHTML = hasMatch 
        ? `<p><i class="fa fa-search"></i> 搜索结果: "${term}"</p>` 
        : `<p><i class="fa fa-exclamation-circle"></i> 没有找到与 "${term}" 相关的工具</p>`;
      searchResult.style.display = term ? 'block' : 'none';
    }
  }
  
  // 更新首页搜索框
  const homeSearch = document.getElementById('home-search');
  if (homeSearch && term) {
    homeSearch.value = term;
  }
  
  // 更新顶部搜索框
  const headerSearch = document.getElementById('search');
  if (headerSearch) {
    headerSearch.value = term;
  }
  
  console.log('搜索完成:', term, '找到匹配:', hasMatch);
  return hasMatch;
}

// 加载所有工具容器
function loadAllTools(menu) {
  const content = document.getElementById('content');
  
  menu.forEach(cat => {
    cat.children.forEach(child => {
      const section = document.createElement('section');
      section.id = `tool-${child.tool}`;
      section.dataset.title = child.title;
      section.dataset.category = cat.title;
      section.style.display = 'none'; // 默认隐藏所有工具
      content.appendChild(section);
    });
  });
  
  // 添加工具使用统计功能
  updateToolsUsageStats();
}

// 更新工具使用统计
function updateToolsUsageStats() {
  try {
    // 获取工具使用次数
    const usage = JSON.parse(localStorage.getItem('toolUsage')) || {};
    
    // 获取最近使用的工具
    const history = JSON.parse(localStorage.getItem('toolHistory')) || [];
    
    // 更新热门工具列表
    const popularTools = Object.entries(usage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([toolId]) => toolId);
    
    // 更新预加载列表
    if (window.toolsStatus && popularTools.length > 0) {
      window.toolsStatus.popular = popularTools;
    }
    
    console.log('热门工具统计更新完成');
  } catch (e) {
    console.error('更新工具统计失败', e);
  }
}

// 复制文本到剪贴板
window.copyToClipboard = function(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast('复制成功！', 'success');
      })
      .catch(err => {
        showToast('复制失败: ' + err, 'error');
      });
  } else {
    // 兼容性处理
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      showToast('复制成功！', 'success');
    } catch (err) {
      showToast('复制失败: ' + err, 'error');
    }
    
    document.body.removeChild(textarea);
  }
};

// 显示提示消息
window.showToast = function(message, type = 'info') {
  // 创建toast容器
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  // 创建toast元素
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // 添加图标
  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-check-circle';
  if (type === 'warning') icon = 'fa-exclamation-triangle';
  if (type === 'error') icon = 'fa-times-circle';
  
  toast.innerHTML = `<i class="fa ${icon}"></i> ${message}`;
  container.appendChild(toast);
  
  // 自动移除
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 3000);
};

// 切换侧边栏
window.toggleSidebar = function() {
  const aside = document.querySelector('aside');
  const main = document.querySelector('main');
  
  if (aside.classList.contains('collapsed')) {
    aside.classList.remove('collapsed');
    main.classList.remove('expanded');
  } else {
    aside.classList.add('collapsed');
    main.classList.add('expanded');
  }
  
  // 在移动设备上，点击菜单项后自动收起侧边栏
  if (window.innerWidth <= 768) {
    document.querySelectorAll('#menu a').forEach(link => {
      link.addEventListener('click', () => {
        aside.classList.add('collapsed');
        main.classList.add('expanded');
      });
    });
    
    // 点击主内容区域时自动收起侧边栏
    main.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && !aside.classList.contains('collapsed')) {
        aside.classList.add('collapsed');
        main.classList.add('expanded');
      }
    });
  }
};

// 响应窗口大小变化
window.addEventListener('resize', () => {
  // 在移动设备上默认收起侧边栏
  if (window.innerWidth <= 768) {
    const aside = document.querySelector('aside');
    const main = document.querySelector('main');
    aside.classList.add('collapsed');
    main.classList.add('expanded');
  }
});

// 在移动设备上点击菜单外区域自动收起菜单
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) {
    const aside = document.querySelector('aside');
    const main = document.querySelector('main');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    // 如果点击的不是侧边栏内的元素，也不是菜单按钮，则收起侧边栏
    if (!aside.contains(e.target) && !menuBtn.contains(e.target) && !aside.classList.contains('collapsed')) {
      aside.classList.add('collapsed');
      main.classList.add('expanded');
    }
  }
});

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

// 获取常用工具
function getFrequentlyUsedTools(limit = 5) {
  try {
    const usage = JSON.parse(localStorage.getItem('toolUsage')) || {};
    return Object.entries(usage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([toolId]) => toolId);
  } catch (e) {
    console.error('无法获取常用工具', e);
    return [];
  }
}

// 添加主题切换功能
function setupThemeToggle() {
  // 检查是否已有主题设置
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // 创建主题切换按钮
  const themeToggle = document.createElement('div');
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = `
    <button id="theme-toggle-btn" title="切换主题">
      <i class="fa ${currentTheme === 'dark' ? 'fa-sun-o' : 'fa-moon-o'}"></i>
    </button>
  `;
  document.body.appendChild(themeToggle);
  
  // 添加点击事件
  document.getElementById('theme-toggle-btn').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // 更新图标
    const icon = document.querySelector('#theme-toggle-btn i');
    icon.className = `fa ${newTheme === 'dark' ? 'fa-sun-o' : 'fa-moon-o'}`;
    
    showToast(`已切换到${newTheme === 'dark' ? '深色' : '浅色'}主题`, 'success');
  });
}

// 添加移动端菜单按钮
function setupMobileMenu() {
  const header = document.querySelector('header');
  
  const menuButton = document.createElement('button');
  menuButton.className = 'mobile-menu-btn';
  menuButton.innerHTML = '<i class="fa fa-bars"></i>';
  menuButton.setAttribute('title', '菜单');
  header.prepend(menuButton);
  
  menuButton.addEventListener('click', () => {
    toggleSidebar();
  });
}

// 添加工具收藏功能
function setupFavorites() {
  // 获取收藏列表
  const getFavorites = () => {
    try {
      return JSON.parse(localStorage.getItem('favorites')) || [];
    } catch (e) {
      console.error('无法获取收藏工具', e);
      return [];
    }
  };
  
  // 添加收藏按钮到每个工具页面
  window.addFavoriteButton = function(toolId, container) {
    const favorites = getFavorites();
    const isFavorite = favorites.includes(toolId);
    
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = `favorite-btn ${isFavorite ? 'active' : ''}`;
    favoriteBtn.innerHTML = `<i class="fa ${isFavorite ? 'fa-star' : 'fa-star-o'}"></i>`;
    favoriteBtn.title = isFavorite ? '取消收藏' : '添加到收藏';
    
    favoriteBtn.addEventListener('click', () => {
      const favorites = getFavorites();
      const index = favorites.indexOf(toolId);
      
      if (index === -1) {
        // 添加收藏
        favorites.push(toolId);
        favoriteBtn.classList.add('active');
        favoriteBtn.innerHTML = '<i class="fa fa-star"></i>';
        favoriteBtn.title = '取消收藏';
        showToast('已添加到收藏', 'success');
      } else {
        // 取消收藏
        favorites.splice(index, 1);
        favoriteBtn.classList.remove('active');
        favoriteBtn.innerHTML = '<i class="fa fa-star-o"></i>';
        favoriteBtn.title = '添加到收藏';
        showToast('已从收藏中移除', 'info');
      }
      
      localStorage.setItem('favorites', JSON.stringify(favorites));
      
      // 更新首页收藏区域
      updateFavoritesSection();
    });
    
    container.appendChild(favoriteBtn);
  };
  
  // 更新首页收藏区域
  function updateFavoritesSection() {
    const favorites = getFavorites();
    const homepage = document.getElementById('homepage');
    
    if (!homepage) return;
    
    // 检查是否已有收藏区域
    let favoritesSection = document.getElementById('favorites-section');
    
    if (favorites.length === 0) {
      // 如果没有收藏，移除收藏区域
      if (favoritesSection) {
        favoritesSection.remove();
      }
      return;
    }
    
    // 创建收藏区域
    if (!favoritesSection) {
      favoritesSection = document.createElement('div');
      favoritesSection.id = 'favorites-section';
      
      // 插入到热门工具之前
      const popularToolsHeading = homepage.querySelector('h2');
      if (popularToolsHeading) {
        homepage.insertBefore(favoritesSection, popularToolsHeading);
      } else {
        homepage.appendChild(favoritesSection);
      }
    }
    
    // 获取收藏工具信息
    const favoriteTools = [];
    window.menu.forEach(cat => {
      cat.children.forEach(child => {
        if (favorites.includes(child.tool)) {
          favoriteTools.push({
            title: child.title,
            tool: child.tool,
            icon: getToolIcon(child.tool)
          });
        }
      });
    });
    
    // 渲染收藏区域
    favoritesSection.innerHTML = `
      <h2><i class="fa fa-star"></i> 我的收藏</h2>
      <div class="grid-container" id="favorite-tools"></div>
    `;
    
    const container = document.getElementById('favorite-tools');
    favoriteTools.forEach(tool => {
      const div = document.createElement('div');
      div.className = 'grid-item';
      div.innerHTML = `
        <div class="tool-card favorite">
          <div class="tool-card-header">
            <i class="fa ${tool.icon}"></i> ${tool.title}
          </div>
          <div class="tool-card-footer">
            <button class="tool-link" data-tool="${tool.tool}">打开工具 <i class="fa fa-arrow-right"></i></button>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  }
  
  // 初始化收藏功能
  updateFavoritesSection();
}

// 添加历史记录功能
function setupHistory() {
  // 获取历史记录
  const getHistory = () => {
    try {
      return JSON.parse(localStorage.getItem('toolHistory')) || [];
    } catch (e) {
      console.error('无法获取历史记录', e);
      return [];
    }
  };
  
  // 添加工具到历史记录
  window.addToHistory = function(toolId) {
    if (!toolId) return;
    
    try {
      let history = getHistory();
      
      // 如果已存在，先移除
      history = history.filter(id => id !== toolId);
      
      // 添加到开头
      history.unshift(toolId);
      
      // 限制数量
      if (history.length > 10) {
        history = history.slice(0, 10);
      }
      
      localStorage.setItem('toolHistory', JSON.stringify(history));
    } catch (e) {
      console.error('无法添加到历史记录', e);
    }
  };
}

// 添加数据导入导出功能
function setupDataExport() {
  // 导出所有用户数据
  window.exportUserData = function() {
    try {
      const userData = {
        favorites: JSON.parse(localStorage.getItem('favorites')) || [],
        toolUsage: JSON.parse(localStorage.getItem('toolUsage')) || {},
        toolHistory: JSON.parse(localStorage.getItem('toolHistory')) || [],
        theme: localStorage.getItem('theme') || 'light',
        toolSettings: {} // 各工具的设置
      };
      
      // 获取所有工具设置
      window.menu.forEach(cat => {
        cat.children.forEach(child => {
          const toolId = child.tool;
          const settings = localStorage.getItem(`settings_${toolId}`);
          if (settings) {
            userData.toolSettings[toolId] = JSON.parse(settings);
          }
        });
      });
      
      // 转换为JSON字符串
      const jsonStr = JSON.stringify(userData, null, 2);
      
      // 创建下载链接
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '多宝工具箱_用户数据.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('数据导出成功', 'success');
    } catch (e) {
      console.error('导出数据失败', e);
      showToast('导出数据失败: ' + e.message, 'error');
    }
  };
  
  // 导入用户数据
  window.importUserData = function(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const userData = JSON.parse(e.target.result);
        
        // 导入收藏
        if (userData.favorites) {
          localStorage.setItem('favorites', JSON.stringify(userData.favorites));
        }
        
        // 导入使用次数
        if (userData.toolUsage) {
          localStorage.setItem('toolUsage', JSON.stringify(userData.toolUsage));
        }
        
        // 导入历史记录
        if (userData.toolHistory) {
          localStorage.setItem('toolHistory', JSON.stringify(userData.toolHistory));
        }
        
        // 导入主题
        if (userData.theme) {
          localStorage.setItem('theme', userData.theme);
          document.documentElement.setAttribute('data-theme', userData.theme);
        }
        
        // 导入工具设置
        if (userData.toolSettings) {
          Object.keys(userData.toolSettings).forEach(toolId => {
            localStorage.setItem(`settings_${toolId}`, JSON.stringify(userData.toolSettings[toolId]));
          });
        }
        
        showToast('数据导入成功，刷新页面生效', 'success');
        
        // 延迟刷新页面
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (e) {
        console.error('导入数据失败', e);
        showToast('导入数据失败: ' + e.message, 'error');
      }
    };
    reader.readAsText(file);
  };
}

// 添加设置面板
function setupSettingsPanel() {
  // 创建设置按钮
  const settingsBtn = document.createElement('div');
  settingsBtn.className = 'settings-btn';
  settingsBtn.innerHTML = `<button title="设置"><i class="fa fa-cog"></i></button>`;
  document.body.appendChild(settingsBtn);
  
  // 获取当前设置
  const showLastTool = localStorage.getItem('showLastToolOnStartup') === 'true';
  
  // 创建设置面板
  const settingsPanel = document.createElement('div');
  settingsPanel.className = 'settings-panel';
  settingsPanel.innerHTML = `
    <div class="settings-header">
      <h3><i class="fa fa-cog"></i> 设置</h3>
      <button class="close-btn"><i class="fa fa-times"></i></button>
    </div>
    <div class="settings-content">
      <div class="settings-section">
        <h4>外观</h4>
        <div class="setting-item">
          <label>主题</label>
          <div class="theme-selector">
            <button class="theme-btn light-theme" data-theme="light">浅色</button>
            <button class="theme-btn dark-theme" data-theme="dark">深色</button>
          </div>
        </div>
      </div>
      <div class="settings-section">
        <h4>行为</h4>
        <div class="setting-item">
          <label>
            <input type="checkbox" id="show-last-tool" ${showLastTool ? 'checked' : ''}>
            启动时自动打开上次使用的工具
          </label>
        </div>
      </div>
      <div class="settings-section">
        <h4>数据</h4>
        <div class="setting-item">
          <label>导入/导出数据</label>
          <div class="data-actions">
            <button id="export-data-btn" class="btn"><i class="fa fa-download"></i> 导出数据</button>
            <label for="import-data-input" class="btn"><i class="fa fa-upload"></i> 导入数据</label>
            <input type="file" id="import-data-input" accept=".json" style="display: none;" />
          </div>
        </div>
      </div>
      <div class="settings-section">
        <h4>关于</h4>
        <div class="about-info">
          <p>多宝工具箱 v1.0.0</p>
          <p>一个实用的在线工具集合，帮助您提高工作效率。</p>
          <p>© 2023 多宝工具箱</p>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(settingsPanel);
  
  // 添加设置按钮点击事件
  settingsBtn.querySelector('button').addEventListener('click', () => {
    settingsPanel.classList.toggle('active');
  });
  
  // 添加关闭按钮点击事件
  settingsPanel.querySelector('.close-btn').addEventListener('click', () => {
    settingsPanel.classList.remove('active');
  });
  
  // 添加主题切换事件
  settingsPanel.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      
      // 更新主题切换按钮图标
      const icon = document.querySelector('#theme-toggle-btn i');
      icon.className = `fa ${theme === 'dark' ? 'fa-sun-o' : 'fa-moon-o'}`;
      
      // 添加选中状态
      settingsPanel.querySelectorAll('.theme-btn').forEach(b => {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      
      showToast(`已切换到${theme === 'dark' ? '深色' : '浅色'}主题`, 'success');
    });
  });
  
  // 设置当前主题按钮选中状态
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  settingsPanel.querySelector(`.theme-btn[data-theme="${currentTheme}"]`).classList.add('active');
  
  // 添加导出数据事件
  document.getElementById('export-data-btn').addEventListener('click', () => {
    window.exportUserData();
  });
  
  // 添加导入数据事件
  document.getElementById('import-data-input').addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      window.importUserData(e.target.files[0]);
    }
  });
}

// 添加快捷键功能
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Alt + / 聚焦搜索框
    if (e.altKey && e.key === '/') {
      e.preventDefault();
      document.getElementById('search').focus();
    }
    
    // Esc 返回首页
    if (e.key === 'Escape' && window.location.hash) {
      window.location.hash = '';
      showHomepage();
    }
    
    // Alt + T 切换主题
    if (e.altKey && e.key === 't') {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // 更新图标
      const icon = document.querySelector('#theme-toggle-btn i');
      if (icon) {
        icon.className = `fa ${newTheme === 'dark' ? 'fa-sun-o' : 'fa-moon-o'}`;
      }
      
      showToast(`已切换到${newTheme === 'dark' ? '深色' : '浅色'}主题`, 'success');
    }
    
    // Alt + S 打开设置面板
    if (e.altKey && e.key === 's') {
      e.preventDefault();
      const settingsPanel = document.querySelector('.settings-panel');
      if (settingsPanel) {
        settingsPanel.classList.toggle('active');
      }
    }
  });
}

// 添加工具提示功能
function setupTooltips() {
  window.showTooltip = function(element, text) {
    // 检查是否已有提示
    let tooltip = document.getElementById('tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'tooltip';
      document.body.appendChild(tooltip);
    }
    
    // 设置提示内容
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    
    // 计算位置
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.bottom + 10 + 'px';
    
    // 添加事件监听
    const hideTooltip = () => {
      tooltip.style.display = 'none';
      element.removeEventListener('mouseleave', hideTooltip);
      document.removeEventListener('click', hideTooltip);
    };
    
    element.addEventListener('mouseleave', hideTooltip);
    document.addEventListener('click', hideTooltip);
  };
  
  // 为所有带有data-tooltip属性的元素添加提示
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-tooltip]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        window.showTooltip(el, el.getAttribute('data-tooltip'));
      });
    });
  });
}

// 添加工具分享功能
function setupShareTools() {
  window.shareToolLink = function(toolId) {
    const url = `${window.location.origin}${window.location.pathname}#tool-${toolId}`;
    
    if (navigator.share) {
      navigator.share({
        title: '多宝工具箱',
        text: '我发现了一个很实用的在线工具，分享给你！',
        url: url
      }).catch(err => {
        console.error('分享失败:', err);
        // 如果分享API失败，回退到复制链接
        copyShareLink(url);
      });
    } else {
      // 不支持分享API，直接复制链接
      copyShareLink(url);
    }
  };
  
  function copyShareLink(url) {
    window.copyToClipboard(url)
      .then(() => {
        showToast('链接已复制到剪贴板，可以分享给朋友了！', 'success');
      })
      .catch(() => {
        showToast('复制链接失败，请手动复制浏览器地址栏', 'error');
      });
  }
}

// 调试菜单状态
function debugMenuState() {
  console.log('===== 菜单状态调试 =====');
  document.querySelectorAll('#menu > li').forEach((li, index) => {
    const cat = li.querySelector('.cat');
    const ul = li.querySelector('ul');
    const catText = cat ? cat.textContent.trim() : '未知';
    const isExpanded = ul ? ul.classList.contains('expanded') : false;
    const maxHeight = ul ? ul.style.maxHeight : 'N/A';
    const opacity = ul ? ul.style.opacity : 'N/A';
    const visibility = ul ? ul.style.visibility : 'N/A';
    const childCount = ul ? ul.querySelectorAll('li').length : 0;
    const arrow = cat ? cat.querySelector('.menu-arrow') : null;
    const arrowRotated = arrow ? arrow.classList.contains('rotated') : false;
    
    console.log(`菜单 ${index+1}: ${catText}`);
    console.log(`  - 展开状态: ${isExpanded ? '已展开' : '已折叠'}`);
    console.log(`  - 最大高度: ${maxHeight}`);
    console.log(`  - 不透明度: ${opacity}`);
    console.log(`  - 可见性: ${visibility}`);
    console.log(`  - 子菜单数量: ${childCount}`);
    console.log(`  - 箭头旋转: ${arrowRotated ? '已旋转' : '未旋转'}`);
  });
  console.log('========================');
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
  // 加载第三方库
  loadExternalLibraries();
  
  // 加载菜单
  loadMenu();
  
  // 添加调试按钮（仅在开发环境使用）
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const debugBtn = document.createElement('button');
    debugBtn.textContent = '调试菜单';
    debugBtn.style.position = 'fixed';
    debugBtn.style.bottom = '80px';
    debugBtn.style.right = '20px';
    debugBtn.style.zIndex = '1000';
    debugBtn.style.padding = '8px 12px';
    debugBtn.style.backgroundColor = '#f44336';
    debugBtn.style.color = 'white';
    debugBtn.style.border = 'none';
    debugBtn.style.borderRadius = '4px';
    debugBtn.style.cursor = 'pointer';
    debugBtn.onclick = debugMenuState;
    document.body.appendChild(debugBtn);
  }
  
  // 搜索功能
  document.getElementById('search').addEventListener('input', e => {
    filterMenu(e.target.value);
  });
  
  // 添加返回首页按钮事件
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
      window.location.hash = '';
      showHomepage();
      
      // 移除所有活动状态
      document.querySelectorAll('#menu a').forEach(link => {
        link.classList.remove('active');
      });
    });
  }
  
  // 设置主题切换
  setupThemeToggle();
  
  // 设置移动端菜单
  setupMobileMenu();
  
  // 设置收藏功能
  setupFavorites();
  
  // 设置历史记录功能
  setupHistory();
  
  // 设置数据导入导出功能
  setupDataExport();
  
  // 设置设置面板
  setupSettingsPanel();
  
  // 设置键盘快捷键
  setupKeyboardShortcuts();
  
  // 设置工具提示
  setupTooltips();
  
  // 设置工具分享功能
  setupShareTools();
  
  // 添加页面滚动监听
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
});

// 加载外部库
function loadExternalLibraries() {
  // 加载Font Awesome
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
    document.head.appendChild(fontAwesome);
  }
  
  // 加载自定义主题
  if (!document.querySelector('link[href*="theme.css"]')) {
    const themeCSS = document.createElement('link');
    themeCSS.rel = 'stylesheet';
    themeCSS.href = 'static/css/theme.css';
    document.head.appendChild(themeCSS);
  }
  
  // 加载工具库
  if (!document.querySelector('script[src*="libs.js"]')) {
    const libsJS = document.createElement('script');
    libsJS.src = 'static/js/libs.js';
    document.head.appendChild(libsJS);
  }
}

// 添加CSS样式
const style = document.createElement('style');
style.textContent = `
  /* 侧边栏折叠动画 */
  #menu > li > ul {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  
  #menu > li > ul.expanded {
    max-height: 1000px;
  }
  
  /* 移动端侧边栏 */
  @media (max-width: 768px) {
    aside {
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      z-index: 1000;
      transform: translateX(0);
      transition: transform 0.3s ease;
    }
    
    aside.collapsed {
      transform: translateX(-100%);
    }
    
    main {
      margin-left: 0;
      transition: margin-left 0.3s ease;
    }
    
    main.expanded {
      margin-left: 0;
    }
    
    .mobile-menu-btn {
      display: block;
      background: transparent;
      border: none;
      color: white;
      font-size: 20px;
      padding: 5px 10px;
      cursor: pointer;
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      box-shadow: none;
    }
  }
  
  @media (min-width: 769px) {
    .mobile-menu-btn {
      display: none;
    }
  }
  
  /* 首页搜索框 */
  .search-box-large {
    position: relative;
    max-width: 600px;
    margin: 30px auto;
  }
  
  .search-box-large i {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 18px;
  }
  
  .search-box-large input {
    width: 100%;
    padding: 15px 20px 15px 50px;
    border: 2px solid var(--border-color);
    border-radius: 30px;
    font-size: 16px;
    transition: var(--transition);
    background-color: var(--card-bg);
  }
  
  .search-box-large input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.2);
  }
  
  /* 收藏按钮 */
  .favorite-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 18px;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    transition: var(--transition);
  }
  
  .favorite-btn:hover {
    color: #f1c40f;
    background-color: rgba(241, 196, 15, 0.1);
  }
  
  .favorite-btn.active {
    color: #f1c40f;
  }
  
  /* 设置面板 */
  .settings-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  }
  
  .settings-btn button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transition: var(--transition);
  }
  
  .settings-btn button:hover {
    transform: rotate(30deg);
    background-color: var(--primary-color-dark);
  }
  
  .settings-panel {
    position: fixed;
    top: 0;
    right: -350px;
    width: 350px;
    height: 100%;
    background-color: var(--card-bg);
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1100;
    transition: right 0.3s ease;
    overflow-y: auto;
  }
  
  .settings-panel.active {
    right: 0;
  }
  
  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid var(--border-color);
  }
  
  .settings-header h3 {
    margin: 0;
    font-size: 18px;
  }
  
  .settings-header .close-btn {
    background: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: var(--text-color);
  }
  
  .settings-content {
    padding: 20px;
  }
  
  .settings-section {
    margin-bottom: 30px;
  }
  
  .settings-section h4 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 16px;
    color: var(--text-muted);
  }
  
  .setting-item {
    margin-bottom: 15px;
  }
  
  .setting-item label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  .theme-selector {
    display: flex;
    gap: 10px;
  }
  
  .theme-btn {
    padding: 8px 15px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: var(--card-bg);
    cursor: pointer;
    transition: var(--transition);
  }
  
  .theme-btn.active {
    border-color: var(--primary-color);
    background-color: rgba(74, 108, 247, 0.1);
  }
  
  .light-theme {
    color: #333;
  }
  
  .dark-theme {
    color: #ddd;
    background-color: #333;
  }
  
  .data-actions {
    display: flex;
    gap: 10px;
  }
  
  .data-actions .btn {
    padding: 8px 15px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: var(--card-bg);
    cursor: pointer;
    transition: var(--transition);
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  
  .data-actions .btn:hover {
    border-color: var(--primary-color);
    background-color: rgba(74, 108, 247, 0.1);
  }
  
  .about-info {
    font-size: 14px;
    color: var(--text-muted);
  }
  
  .about-info p {
    margin: 5px 0;
  }
  
  /* 工具卡片样式优化 */
  .tool-card.favorite {
    border-color: #f1c40f;
    box-shadow: 0 2px 10px rgba(241, 196, 15, 0.2);
  }
  
  /* 工具提示 */
  #tooltip {
    position: absolute;
    background-color: var(--card-bg);
    color: var(--text-color);
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1200;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    pointer-events: none;
    display: none;
  }
  
  #tooltip:after {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    margin-left: -5px;
    border-width: 0 5px 5px;
    border-style: solid;
    border-color: var(--card-bg) transparent;
  }
  
  /* 网格布局 */
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .category-card {
    background-color: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    padding: 20px;
    transition: var(--transition);
    height: 100%;
  }
  
  .category-card:hover {
    box-shadow: var(--box-shadow);
    transform: translateY(-2px);
  }
  
  .category-icon {
    font-size: 24px;
    color: var(--primary-color);
    margin-bottom: 10px;
  }
  
  .category-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 5px;
  }
  
  .category-count {
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 15px;
  }
  
  .category-tools {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .category-tools a {
    font-size: 12px;
    color: var(--primary-color);
    text-decoration: none;
    padding: 3px 8px;
    border-radius: 3px;
    background-color: var(--primary-color-light);
    transition: var(--transition);
  }
  
  .category-tools a:hover {
    background-color: var(--primary-color);
    color: white;
  }
  
  /* 首页样式 */
  .homepage-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .homepage-header h1 {
    font-size: 28px;
    margin-bottom: 10px;
  }
  
  .tool-description {
    color: var(--text-muted);
    max-width: 600px;
    margin: 0 auto;
  }
  
  /* 响应式调整 */
  @media (max-width: 576px) {
    .grid-container {
      grid-template-columns: 1fr;
    }
    
    .category-grid {
      grid-template-columns: 1fr;
    }
    
    .homepage-header h1 {
      font-size: 24px;
    }
    
    .settings-panel {
      width: 100%;
      right: -100%;
    }
  }
`;
document.head.appendChild(style);
