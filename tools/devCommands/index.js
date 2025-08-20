/**
 * 开发命令速查工具 - 主模块
 * 优化版本
 */

window.duobaoTools = window.duobaoTools || {};

window.duobaoTools.DevCommands = function() {
  // 私有变量
  let container;
  let currentCategory = 'mysql';
  let searchInput;
  let commandsList;
  let categoryTabs;
  let clearSearchBtn;
  let lastSearchQuery = '';
  let commandsCount;
  let copyTooltip;
  let searchTimeout;
  let favorites = [];
  
  // 从本地存储加载收藏夹
  const loadFavorites = () => {
    try {
      const storedFavorites = localStorage.getItem('devCommandsFavorites');
      if (storedFavorites) {
        favorites = JSON.parse(storedFavorites);
      }
    } catch (e) {
      console.error('加载收藏夹失败:', e);
      favorites = [];
    }
  };
  
  // 保存收藏夹到本地存储
  const saveFavorites = () => {
    try {
      localStorage.setItem('devCommandsFavorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('保存收藏夹失败:', e);
    }
  };
  
  // 检查命令是否已收藏
  const isFavorite = (cmd) => {
    return favorites.some(fav => fav.cmd === cmd);
  };
  
  // 添加命令到收藏夹
  const addToFavorites = (command) => {
    if (!isFavorite(command.cmd)) {
      favorites.push(command);
      saveFavorites();
      return true;
    }
    return false;
  };
  
  // 从收藏夹移除命令
  const removeFromFavorites = (cmd) => {
    const initialLength = favorites.length;
    favorites = favorites.filter(fav => fav.cmd !== cmd);
    if (favorites.length !== initialLength) {
      saveFavorites();
      return true;
    }
    return false;
  };
  
  // 初始化工具
  this.init = function() {
    // 获取容器
    container = document.querySelector('#tool-container');
    if (!container) return;
    
    // 加载收藏夹
    loadFavorites();
    
    // 获取UI元素
    searchInput = document.getElementById('dev-commands-search');
    commandsList = document.getElementById('commands-list');
    categoryTabs = document.getElementById('category-tabs');
    clearSearchBtn = document.getElementById('clear-search');
    
    // 创建命令计数元素
    commandsCount = document.createElement('div');
    commandsCount.className = 'dev-commands-count';
    commandsList.parentNode.insertBefore(commandsCount, commandsList);
    
    // 创建复制成功提示
    copyTooltip = document.createElement('div');
    copyTooltip.className = 'copy-success-tooltip';
    document.body.appendChild(copyTooltip);
    
    // 初始化分类标签
    this.initCategoryTabs();
    
    // 绑定事件
    this.bindEvents();
    
    // 检查URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');
    
    // 如果有搜索参数，执行搜索
    if (searchParam) {
      searchInput.value = searchParam;
      clearSearchBtn.style.display = 'block';
      this.searchCommands(searchParam);
    } 
    // 如果有分类参数，显示该分类
    else if (categoryParam && window.duobaoTools.commandsData.categories.some(cat => cat.id === categoryParam)) {
      currentCategory = categoryParam;
      // 更新标签状态
      document.querySelectorAll('#category-tabs li').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.category === currentCategory) {
          item.classList.add('active');
        }
      });
      this.showCategory(currentCategory);
    } 
    // 否则显示默认分类
    else {
      this.showCategory(currentCategory);
    }
    
    // 添加收藏夹分类
    this.addFavoritesTab();
  };
  
  // 添加收藏夹标签
  this.addFavoritesTab = function() {
    // 检查是否已存在收藏夹标签
    if (document.querySelector('#category-tabs li[data-category="favorites"]')) {
      return;
    }
    
    const favTab = document.createElement('li');
    favTab.dataset.category = 'favorites';
    favTab.innerHTML = '<i class="fas fa-star"></i> 收藏夹';
    if (currentCategory === 'favorites') {
      favTab.classList.add('active');
    }
    
    // 插入到标签列表的开头
    categoryTabs.insertBefore(favTab, categoryTabs.firstChild);
    
    // 绑定点击事件
    favTab.addEventListener('click', () => {
      // 更新当前分类
      currentCategory = 'favorites';
      
      // 更新标签状态
      document.querySelectorAll('#category-tabs li').forEach(item => {
        item.classList.remove('active');
      });
      favTab.classList.add('active');
      
      // 显示收藏夹命令
      this.showFavorites();
      
      // 清空搜索
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      
      // 更新URL参数
      this.updateUrlParams('favorites');
    });
  };
  
  // 显示收藏夹命令
  this.showFavorites = function() {
    if (favorites.length === 0) {
      commandsList.innerHTML = '<div class="dev-commands-empty">收藏夹为空，请在浏览命令时点击星标添加收藏</div>';
      commandsCount.textContent = '收藏夹: 0 条命令';
      return;
    }
    
    this.renderCommands(favorites, true);
    commandsCount.textContent = `收藏夹: ${favorites.length} 条命令`;
  };
  
  // 更新URL参数
  this.updateUrlParams = function(category, search = null) {
    const url = new URL(window.location.href);
    
    if (category) {
      url.searchParams.set('category', category);
    } else {
      url.searchParams.delete('category');
    }
    
    if (search) {
      url.searchParams.set('search', search);
    } else {
      url.searchParams.delete('search');
    }
    
    window.history.replaceState({}, '', url);
  };
  
  // 初始化分类标签
  this.initCategoryTabs = function() {
    const categories = window.duobaoTools.commandsData.categories;
    let tabsHtml = '';
    
    categories.forEach(category => {
      const activeClass = category.id === currentCategory ? 'active' : '';
      tabsHtml += `
        <li data-category="${category.id}" class="${activeClass}">
          <i class="${category.icon}"></i> ${category.name}
        </li>
      `;
    });
    
    categoryTabs.innerHTML = tabsHtml;
  };
  
  // 绑定事件
  this.bindEvents = function() {
    // 分类标签点击事件
    categoryTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('li');
      if (!tab || tab.dataset.category === 'favorites') return; // 收藏夹标签有单独的处理
      
      // 更新当前分类
      currentCategory = tab.dataset.category;
      
      // 更新标签状态
      document.querySelectorAll('#category-tabs li').forEach(item => {
        item.classList.remove('active');
      });
      tab.classList.add('active');
      
      // 显示分类命令
      this.showCategory(currentCategory);
      
      // 清空搜索
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      
      // 更新URL参数
      this.updateUrlParams(currentCategory);
    });
    
    // 搜索输入事件 - 使用防抖
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      
      // 显示/隐藏清除按钮
      clearSearchBtn.style.display = query ? 'block' : 'none';
      
      // 清除之前的定时器
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      
      // 设置新的定时器
      searchTimeout = setTimeout(() => {
        // 搜索命令
        if (query) {
          this.searchCommands(query);
          // 更新URL参数
          this.updateUrlParams(null, query);
        } else {
          if (currentCategory === 'favorites') {
            this.showFavorites();
          } else {
            this.showCategory(currentCategory);
          }
          // 更新URL参数
          this.updateUrlParams(currentCategory);
        }
        
        lastSearchQuery = query;
      }, 300); // 300ms延迟
    });
    
    // 搜索框键盘事件
    searchInput.addEventListener('keydown', (e) => {
      // 按下ESC键清空搜索
      if (e.key === 'Escape') {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        if (currentCategory === 'favorites') {
          this.showFavorites();
        } else {
          this.showCategory(currentCategory);
        }
        this.updateUrlParams(currentCategory);
      }
    });
    
    // 清除搜索按钮点击事件
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      if (currentCategory === 'favorites') {
        this.showFavorites();
      } else {
        this.showCategory(currentCategory);
      }
      searchInput.focus();
      this.updateUrlParams(currentCategory);
    });
    
    // 添加键盘快捷键
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + F 聚焦搜索框
      if ((e.ctrlKey || e.metaKey) && e.key === 'f' && container.contains(e.target)) {
        e.preventDefault();
        searchInput.focus();
      }
    });
  };
  
  // 显示分类命令
  this.showCategory = function(categoryId) {
    if (categoryId === 'favorites') {
      this.showFavorites();
      return;
    }
    
    const commands = window.duobaoTools.commandsData.getCategoryCommands(categoryId);
    this.renderCommands(commands);
    
    // 更新命令计数
    const category = window.duobaoTools.commandsData.categories.find(cat => cat.id === categoryId);
    commandsCount.textContent = `${category.name}: ${commands.length} 条命令`;
  };
  
  // 搜索命令
  this.searchCommands = function(query) {
    const commands = window.duobaoTools.commandsData.searchCommands(query);
    this.renderCommands(commands, true);
    
    // 更新命令计数
    commandsCount.textContent = `搜索结果: ${commands.length} 条命令`;
  };
  
  // 显示复制成功提示
  this.showCopyTooltip = function(text) {
    copyTooltip.textContent = text;
    copyTooltip.classList.add('show');
    
    setTimeout(() => {
      copyTooltip.classList.remove('show');
    }, 2000);
  };
  
  // 渲染命令列表
  this.renderCommands = function(commands, showCategory = false) {
    // 清空列表
    commandsList.innerHTML = '';
    
    if (commands.length === 0) {
      commandsList.innerHTML = '<div class="dev-commands-empty">没有找到命令</div>';
      return;
    }
    
    // 如果显示分类，按分类分组
    if (showCategory) {
      // 按分类分组命令
      const groupedCommands = {};
      commands.forEach(command => {
        if (!groupedCommands[command.categoryId]) {
          groupedCommands[command.categoryId] = [];
        }
        groupedCommands[command.categoryId].push(command);
      });
      
      // 按分类渲染命令
      Object.keys(groupedCommands).forEach(categoryId => {
        const category = window.duobaoTools.commandsData.categories.find(cat => cat.id === categoryId);
        if (!category) return;
        
        // 创建分组标题
        const groupTitle = document.createElement('div');
        groupTitle.className = 'dev-commands-group-title';
        groupTitle.innerHTML = `<i class="${category.icon}"></i> ${category.name}`;
        commandsList.appendChild(groupTitle);
        
        // 渲染该分类的命令
        groupedCommands[categoryId].forEach(command => {
          this.renderCommandItem(command, showCategory);
        });
      });
    } else {
      // 直接渲染命令
      commands.forEach(command => {
        this.renderCommandItem(command, showCategory);
      });
    }
  };
  
  // 渲染单个命令项
  this.renderCommandItem = function(command, showCategory = false) {
    const commandItem = document.createElement('div');
    commandItem.className = 'dev-command-item';
    
    const commandCode = document.createElement('div');
    commandCode.className = 'dev-command-code';
    commandCode.textContent = command.cmd;
    
    // 复制按钮
    const copyButton = document.createElement('button');
    copyButton.className = 'dev-command-copy';
    copyButton.innerHTML = '<i class="far fa-copy"></i> 复制';
    copyButton.title = '复制命令';
    copyButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.copyToClipboard(command.cmd);
      copyButton.innerHTML = '<i class="fas fa-check"></i> 已复制';
      this.showCopyTooltip('命令已复制到剪贴板');
      setTimeout(() => {
        copyButton.innerHTML = '<i class="far fa-copy"></i> 复制';
      }, 1500);
    });
    
    // 收藏按钮
    const favoriteButton = document.createElement('button');
    favoriteButton.className = 'dev-command-favorite';
    favoriteButton.style.position = 'absolute';
    favoriteButton.style.top = '8px';
    favoriteButton.style.right = '80px';
    favoriteButton.style.background = 'none';
    favoriteButton.style.border = 'none';
    favoriteButton.style.cursor = 'pointer';
    favoriteButton.style.fontSize = '16px';
    favoriteButton.style.color = isFavorite(command.cmd) ? '#f1c40f' : '#ccc';
    favoriteButton.innerHTML = '<i class="' + (isFavorite(command.cmd) ? 'fas' : 'far') + ' fa-star"></i>';
    favoriteButton.title = isFavorite(command.cmd) ? '取消收藏' : '添加到收藏夹';
    
    favoriteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if (isFavorite(command.cmd)) {
        if (removeFromFavorites(command.cmd)) {
          favoriteButton.innerHTML = '<i class="far fa-star"></i>';
          favoriteButton.style.color = '#ccc';
          favoriteButton.title = '添加到收藏夹';
          this.showCopyTooltip('已从收藏夹移除');
          
          // 如果当前在收藏夹页面，需要刷新列表
          if (currentCategory === 'favorites') {
            this.showFavorites();
          }
        }
      } else {
        if (addToFavorites({...command, categoryId: command.categoryId || currentCategory})) {
          favoriteButton.innerHTML = '<i class="fas fa-star"></i>';
          favoriteButton.style.color = '#f1c40f';
          favoriteButton.title = '取消收藏';
          this.showCopyTooltip('已添加到收藏夹');
        }
      }
    });
    
    commandCode.appendChild(favoriteButton);
    commandCode.appendChild(copyButton);
    
    const commandDesc = document.createElement('div');
    commandDesc.className = 'dev-command-description';
    commandDesc.textContent = command.description;
    
    commandItem.appendChild(commandCode);
    commandItem.appendChild(commandDesc);
    
    // 如果需要显示分类且不在分组视图中
    if (showCategory && command.category && document.querySelectorAll('.dev-commands-group-title').length === 0) {
      const categoryBadge = document.createElement('div');
      categoryBadge.className = 'dev-command-category';
      categoryBadge.innerHTML = `<i class="${window.duobaoTools.commandsData.categories.find(c => c.id === command.categoryId)?.icon || 'fas fa-tag'}"></i> ${command.category}`;
      commandItem.appendChild(categoryBadge);
    }
    
    // 点击命令项复制命令
    commandItem.addEventListener('click', (e) => {
      // 避免点击复制按钮或收藏按钮时触发
      if (e.target === copyButton || e.target.closest('.dev-command-copy') || 
          e.target === favoriteButton || e.target.closest('.dev-command-favorite')) {
        return;
      }
      
      this.copyToClipboard(command.cmd);
      this.showCopyTooltip('命令已复制到剪贴板');
    });
    
    commandsList.appendChild(commandItem);
  };
  
  // 复制到剪贴板
  this.copyToClipboard = function(text) {
    // 使用现代API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(err => {
        console.error('复制失败:', err);
        this.fallbackCopyToClipboard(text);
      });
    } else {
      // 回退方法
      this.fallbackCopyToClipboard(text);
    }
  };
  
  // 回退的复制方法
  this.fallbackCopyToClipboard = function(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('复制失败:', err);
    }
    
    document.body.removeChild(textarea);
  };
};
