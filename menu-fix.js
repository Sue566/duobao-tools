/**
 * 菜单展开/折叠修复脚本
 */

(function() {
  // 等待DOM加载完成
  document.addEventListener('DOMContentLoaded', function() {
    // 等待一段时间确保菜单已经初始化
    setTimeout(fixMenuExpansion, 500);
  });

  // 修复菜单展开状态
  function fixMenuExpansion() {
    console.log('开始修复菜单展开状态...');
    
    // 获取所有菜单项
    const menuItems = document.querySelectorAll('#menu > li');
    
    menuItems.forEach((li, index) => {
      const cat = li.querySelector('.cat');
      const ul = li.querySelector('ul');
      const arrow = cat?.querySelector('.menu-arrow');
      
      if (!cat || !ul) return;
      
      // 检查菜单是否应该展开
      const shouldBeExpanded = ul.classList.contains('expanded');
      const isVisuallyExpanded = ul.style.maxHeight !== '0px' && 
                                ul.style.opacity !== '0' && 
                                ul.style.visibility !== 'hidden';
      
      console.log(`菜单 ${index+1}: ${cat.textContent.trim()}`);
      console.log(`  - 类状态: ${shouldBeExpanded ? '已展开' : '已折叠'}`);
      console.log(`  - 视觉状态: ${isVisuallyExpanded ? '已展开' : '已折叠'}`);
      
      // 修复不一致的状态
      if (shouldBeExpanded && !isVisuallyExpanded) {
        console.log(`  - 修复: 设置为展开状态`);
        ul.style.maxHeight = '2000px';
        ul.style.opacity = '1';
        ul.style.visibility = 'visible';
        if (arrow) arrow.classList.add('rotated');
        
        // 计算实际高度
        setTimeout(() => {
          const scrollHeight = ul.scrollHeight;
          ul.style.maxHeight = (scrollHeight + 100) + 'px';
          console.log(`  - 设置高度: ${scrollHeight}px`);
        }, 50);
      } 
      else if (!shouldBeExpanded && isVisuallyExpanded) {
        console.log(`  - 修复: 设置为折叠状态`);
        ul.style.maxHeight = '0px';
        ul.style.opacity = '0';
        ul.style.visibility = 'hidden';
        if (arrow) arrow.classList.remove('rotated');
      }
    });
    
    // 添加菜单点击事件修复
    fixMenuClickEvents();
    
    console.log('菜单修复完成');
  }
  
  // 修复菜单点击事件
  function fixMenuClickEvents() {
    // 确保菜单点击事件正确处理
    document.querySelectorAll('#menu .cat').forEach(cat => {
      // 移除可能的旧事件监听器
      const newCat = cat.cloneNode(true);
      cat.parentNode.replaceChild(newCat, cat);
      
      // 添加新的点击事件
      newCat.addEventListener('click', function(e) {
        // 如果点击的是链接，不处理展开/折叠
        if (e.target.tagName === 'A' || e.target.closest('a')) {
          return;
        }
        
        // 阻止事件冒泡
        e.preventDefault();
        e.stopPropagation();
        
        // 获取父级li元素
        const li = this.closest('li');
        if (!li) return;
        
        // 获取子菜单ul元素
        const ul = li.querySelector('ul');
        if (!ul) return;
        
        const isExpanded = ul.classList.contains('expanded');
        console.log('点击菜单:', this.textContent.trim(), '当前状态:', isExpanded ? '已展开' : '已折叠');
        
        // 关闭所有其他分类
        document.querySelectorAll('#menu > li').forEach(otherLi => {
          if (otherLi !== li) {
            const otherUl = otherLi.querySelector('ul');
            const otherArrow = otherLi.querySelector('.menu-arrow');
            
            if (otherUl) {
              otherUl.classList.remove('expanded');
              otherUl.style.maxHeight = '0px';
              otherUl.style.opacity = '0';
              otherUl.style.visibility = 'hidden';
            }
            
            if (otherArrow) {
              otherArrow.classList.remove('rotated');
            }
          }
        });
        
        // 切换当前分类
        if (!isExpanded) {
          // 展开菜单
          ul.classList.add('expanded');
          ul.style.maxHeight = '2000px';
          ul.style.opacity = '1';
          ul.style.visibility = 'visible';
          
          // 添加旋转箭头类
          const arrow = this.querySelector('.menu-arrow');
          if (arrow) {
            arrow.classList.add('rotated');
          }
          
          // 计算实际高度
          setTimeout(() => {
            const scrollHeight = ul.scrollHeight;
            ul.style.maxHeight = (scrollHeight + 100) + 'px';
          }, 50);
        } else {
          // 折叠菜单
          ul.classList.remove('expanded');
          ul.style.maxHeight = '0px';
          ul.style.opacity = '0';
          ul.style.visibility = 'hidden';
          
          // 移除旋转箭头类
          const arrow = this.querySelector('.menu-arrow');
          if (arrow) {
            arrow.classList.remove('rotated');
          }
        }
        
        // 保存菜单状态
        saveMenuState();
      });
    });
  }
  
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
})();