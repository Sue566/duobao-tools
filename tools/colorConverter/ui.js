/**
 * 多宝工具箱 - 颜色转换工具 - UI模块
 */
(function() {
  const ui = {
    // 初始化UI
    initUI: function(container) {
      // 获取标签页按钮和内容
      const tabBtns = container.querySelectorAll('.tab-btn');
      const tabContents = container.querySelectorAll('.tab-content');
      
      // 初始化标签页切换
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.dataset.tab;
          
          // 切换按钮状态
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          // 切换内容区域
          tabContents.forEach(content => content.classList.remove('active'));
          container.querySelector(`#tab-${tab}`).classList.add('active');
        });
      });
      
      // 初始化各个模块
      this.initModules(container);
    },
    
    // 初始化各个功能模块
    initModules: function(container) {
      // 初始化转换器
      const converterTab = container.querySelector('#tab-converter');
      if (converterTab) {
        window.colorConverter.converter.initConverter(converterTab);
      }
      
      // 初始化调色板
      const paletteTab = container.querySelector('#tab-palette');
      if (paletteTab) {
        window.colorConverter.palette.initPalette(paletteTab);
      }
      
      // 初始化配色方案
      const schemesTab = container.querySelector('#tab-schemes');
      if (schemesTab) {
        window.colorConverter.schemes.initSchemes(schemesTab);
      }
      
      // 初始化可访问性检测
      const accessibilityTab = container.querySelector('#tab-accessibility');
      if (accessibilityTab) {
        window.colorConverter.accessibility.initAccessibility(accessibilityTab);
      }
    }
  };
  
  // 将UI添加到全局命名空间
  window.colorConverter.ui = ui;
})();