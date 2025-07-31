/**
 * 多宝工具箱 - 工具加载器
 * 负责动态加载所有工具模块
 */

(function() {
  // 工具列表，与menu.js中的工具保持一致
  const toolsList = [
    'textReplacer',
    'textDiff',
    'markdownEditor',
    'textLength',
    'caseConverter',
    'urlEncoder',
    'base64',
    'htmlEntityConverter',
    'baseConverter',
    'rmbUppercase',
    'imageCompressor',
    'imageConverter',
    'imageCropper',
    'jsonFormatter',
    'jsonValidator',
    'regexTester',
    'cssMinifier',
    'jsMinifier',
    'uuidGenerator',
    'timestamp',
    'dateCalculator',
    'calendar',
    'calculator',
    'unitConverter',
    'randomPicker',
    'md5',
    'sha1',
    'sha256',
    'aesEncryption',
    'hashCalculator',
    'passwordGenerator',
    'ipLookup',
    'userAgent',
    'portScanner',
    'qrCodeGenerator',
    'bmiCalculator',
    'loanCalculator',
    'colorConverter',
    'colorPicker',
    'gradientGenerator'
  ];

  // 加载所有工具
  function loadAllTools() {
    console.log('开始加载工具模块...');
    
    // 创建一个加载进度计数器
    let loadedCount = 0;
    const totalTools = toolsList.length;
    
    // 为每个工具创建一个script标签并添加到页面
    toolsList.forEach(tool => {
      const script = document.createElement('script');
      script.src = `tools/${tool}.js`;
      script.async = true;
      
      // 加载成功回调
      script.onload = function() {
        loadedCount++;
        console.log(`工具 ${tool} 加载成功 (${loadedCount}/${totalTools})`);
        
        // 所有工具加载完成后，初始化页面
        if (loadedCount === totalTools) {
          console.log('所有工具加载完成');
          // 如果页面已经加载完成，则初始化菜单
          if (document.readyState === 'complete') {
            initializeMenu();
          } else {
            // 否则等待页面加载完成
            window.addEventListener('load', initializeMenu);
          }
        }
      };
      
      // 加载失败回调
      script.onerror = function() {
        console.error(`工具 ${tool} 加载失败`);
        loadedCount++;
        
        // 即使有工具加载失败，也继续初始化页面
        if (loadedCount === totalTools) {
          console.log('工具加载完成，但有部分工具加载失败');
          if (document.readyState === 'complete') {
            initializeMenu();
          } else {
            window.addEventListener('load', initializeMenu);
          }
        }
      };
      
      document.head.appendChild(script);
    });
  }
  
  // 初始化菜单
  function initializeMenu() {
    // 检查window.loadMenu函数是否存在
    if (typeof window.loadMenu === 'function') {
      window.loadMenu();
    } else {
      console.error('loadMenu函数未定义，菜单初始化失败');
      
      // 尝试延迟加载
      setTimeout(() => {
        if (typeof window.loadMenu === 'function') {
          window.loadMenu();
          console.log('菜单延迟初始化成功');
        } else {
          console.error('菜单延迟初始化失败');
        }
      }, 1000);
    }
  }
  
  // 开始加载工具
  loadAllTools();
})();