/**
 * 贷款计算器 - 主入口文件
 * 整合所有模块
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 加载HTML内容
      fetch('tools/loanCalculator/index.html')
        .then(response => response.text())
        .then(html => {
          // 创建工具界面
          container.innerHTML = html;
          
          // 添加收藏按钮
          window.addFavoriteButton('loanCalculator', container.querySelector('.tool-header'));
          
          // 加载样式
          const style = document.createElement('style');
          fetch('tools/loanCalculator/styles.css')
            .then(response => response.text())
            .then(css => {
              style.textContent = css;
              container.appendChild(style);
            });
          
          // 初始化贷款计算器
          this.loadModules().then(() => {
            this.initCalculator();
          }).catch(error => {
            console.error('加载贷款计算器模块失败:', error);
          });
        })
        .catch(error => {
          console.error('加载贷款计算器失败:', error);
          container.innerHTML = `
            <div class="tool-header">
              <h2><i class="fa fa-money"></i> 贷款计算器</h2>
              <p class="tool-description">加载失败，请刷新页面重试。</p>
            </div>
          `;
        });
    },
    
    // 加载所有模块
    loadModules: function() {
      // 加载模块JS文件
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };
      
      // 按顺序加载所有模块
      return Promise.all([
        loadScript('tools/loanCalculator/utils.js'),
        loadScript('tools/loanCalculator/core.js'),
        loadScript('tools/loanCalculator/ui.js'),
        loadScript('tools/loanCalculator/charts.js'),
        loadScript('tools/loanCalculator/prepayment.js'),
        loadScript('tools/loanCalculator/compare.js'),
        loadScript('/static/js/vendor/chart.min.js')
      ]).then(() => {
        // 最后加载功能模块
        return Promise.all([
          loadScript('tools/loanCalculator/basicLoan.js'),
          loadScript('tools/loanCalculator/combinedLoan.js'),
          loadScript('tools/loanCalculator/prepaymentCalc.js'),
          loadScript('tools/loanCalculator/compareCalc.js'),
          loadScript('tools/loanCalculator/exportTools.js')
        ]);
      });
    },
    
    // 初始化计算器
    initCalculator: function() {
      // 确保所有模块都已加载
      if (!window.LoanCore || !window.LoanUtils || !window.LoanUI || 
          !window.LoanCharts || !window.LoanPrepayment || !window.LoanCompare ||
          !window.BasicLoan || !window.CombinedLoan || !window.PrepaymentCalc ||
          !window.CompareCalc || !window.ExportTools) {
        console.error('贷款计算器模块未完全加载');
        return;
      }
      
      // 初始化各个模块
      window.BasicLoan.init();
      window.CombinedLoan.init();
      window.PrepaymentCalc.init();
      window.CompareCalc.init();
      window.ExportTools.init();
    }
  };
  
  // 注册工具
  window.tools.loanCalculator = tool;
})();