/**
 * 多宝工具箱 - 哈希计算器 - 入口文件
 */
(function () {
  const toolId = 'hashCalculator';

  // 工具模块
  const tool = {
    /**
     * 初始化工具
     */
    init: function () {
      return Promise.resolve();
    },
    
    /**
     * 渲染工具
     * @param {HTMLElement} container - 工具容器元素
     * @returns {Function} 清理函数
     */
    render: function (container) {
      // 加载HTML模板
      this.loadTemplate(container)
        .then(() => {
          // 加载CSS样式
          return this.loadStyles();
        })
        .then(() => {
          // 加载依赖模块
          return this.loadModules();
        })
        .then(() => {
          // 添加收藏按钮
          if (typeof window.addFavoriteButton === 'function') {
            const header = container.querySelector('.tool-header');
            window.addFavoriteButton(toolId, header);
          }
          
          // 初始化事件处理
          this.setupEvents(container);
        })
        .catch(error => {
          console.error('加载哈希计算器工具失败:', error);
          container.innerHTML = '<div class="tool-error">加载哈希计算器工具失败</div>';
        });
        
      // 返回清理函数
      return function cleanup() {
        // 移除样式
        const styleLink = document.querySelector('link[href="tools/hashCalculator/styles.css"]');
        if (styleLink) {
          document.head.removeChild(styleLink);
        }
      };
    },
    
    /**
     * 加载HTML模板
     * @param {HTMLElement} container - 工具容器元素
     * @returns {Promise} 加载完成的Promise
     */
    loadTemplate: function(container) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'tools/hashCalculator/template.html', true);
        xhr.onload = function() {
          if (xhr.status === 200) {
            container.innerHTML = xhr.responseText;
            resolve();
          } else {
            reject(new Error(`加载模板失败: ${xhr.status}`));
          }
        };
        xhr.onerror = function() {
          reject(new Error('网络错误，无法加载模板'));
        };
        xhr.send();
      });
    },
    
    /**
     * 加载CSS样式
     * @returns {Promise} 加载完成的Promise
     */
    loadStyles: function() {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'tools/hashCalculator/styles.css';
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });
    },
    
    /**
     * 加载依赖模块
     * @returns {Promise} 加载完成的Promise
     */
    loadModules: function() {
      // 加载CryptoJS库
      return new Promise((resolve, reject) => {
        if (window.CryptoJS) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = '/static/js/vendor/crypto-js.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    },

    // 设置事件处理
    setupEvents: function (container) {
      // 初始化标签页切换
      this.initTabs(container);
      
      // 初始化文件选择处理
      this.initFileHandlers(container);
      
      // 绑定按钮事件
      this.bindButtonEvents(container);
    },
    
    // 初始化标签页切换
    initTabs: function(container) {
      const tabButtons = container.querySelectorAll('.hash-tab-btn');
      const tabPanes = container.querySelectorAll('.hash-tab-pane');
      
      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          const tab = button.getAttribute('data-tab');
          
          // 移除所有活动状态
          tabButtons.forEach(btn => btn.classList.remove('active'));
          tabPanes.forEach(pane => pane.classList.remove('active'));
          
          // 添加活动状态
          button.classList.add('active');
          container.querySelector(`#tab-${tab}`).classList.add('active');
        });
      });
    },
    
    // 初始化文件选择处理
    initFileHandlers: function(container) {
      const fileInput = container.querySelector('#file-input');
      const fileName = container.querySelector('#file-name');
      const fileInfo = container.querySelector('#file-info');
      const chunkProcessing = container.querySelector('#chunk-processing');
      
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          fileName.textContent = file.name;
          
          // 显示文件信息
          const size = window.hashCalculator.utils.formatFileSize(file.size);
          const type = file.type || '未知类型';
          fileInfo.innerHTML = `
            <div class="file-info-item">
              <span class="file-info-label">文件名:</span>
              <span class="file-info-value">${file.name}</span>
            </div>
            <div class="file-info-item">
              <span class="file-info-label">大小:</span>
              <span class="file-info-value">${size}</span>
            </div>
            <div class="file-info-item">
              <span class="file-info-label">类型:</span>
              <span class="file-info-value">${type}</span>
            </div>
            <div class="file-info-item">
              <span class="file-info-label">修改时间:</span>
              <span class="file-info-value">${new Date(file.lastModified).toLocaleString()}</span>
            </div>
          `;
          
          // 自动选择分块处理
          chunkProcessing.checked = file.size > 10 * 1024 * 1024; // 10MB
        } else {
          fileName.textContent = '未选择文件';
          fileInfo.innerHTML = '';
        }
      });
      
      // 验证文件选择处理
      const verifyFileInput = container.querySelector('#verify-file-input');
      const verifyFileName = container.querySelector('#verify-file-name');
      
      verifyFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          verifyFileName.textContent = e.target.files[0].name;
        } else {
          verifyFileName.textContent = '未选择文件';
        }
      });
    },
    
    // 绑定按钮事件
    bindButtonEvents: function(container) {
      const calculateBtn = container.querySelector('#calculate-btn');
      const clearBtn = container.querySelector('#clear-btn');
      const copyAllBtn = container.querySelector('#copy-all-btn');
      const saveResultsBtn = container.querySelector('#save-results-btn');
      const clearResultsBtn = container.querySelector('#clear-results-btn');
      const compareBtn = container.querySelector('#compare-btn');
      const verifyBtn = container.querySelector('#verify-btn');
      const hashResults = container.querySelector('#hash-results');
      const textInput = container.querySelector('#text-input');
      const fileInput = container.querySelector('#file-input');
      const fileName = container.querySelector('#file-name');
      const fileInfo = container.querySelector('#file-info');
      
      // 计算哈希值
      calculateBtn.addEventListener('click', () => {
        const activeTab = container.querySelector('.hash-tab-btn.active').getAttribute('data-tab');
        
        if (activeTab === 'text') {
          window.hashCalculator.core.calculateTextHash(container);
        } else if (activeTab === 'file') {
          window.hashCalculator.core.calculateFileHash(container);
        }
      });
      
      // 清空输入
      clearBtn.addEventListener('click', () => {
        textInput.value = '';
        fileInput.value = '';
        fileName.textContent = '未选择文件';
        fileInfo.innerHTML = '';
        hashResults.innerHTML = '<div class="no-results">请输入文本或选择文件并计算哈希值</div>';
      });
      
      // 复制所有哈希值
      copyAllBtn.addEventListener('click', () => {
        const resultItems = hashResults.querySelectorAll('.hash-result-item');
        if (resultItems.length === 0) {
          window.hashCalculator.utils.showToast('没有可复制的哈希值', 'warning');
          return;
        }
        
        let text = '';
        resultItems.forEach(item => {
          const algorithm = item.querySelector('.hash-algorithm').textContent;
          const hash = item.querySelector('.hash-value').textContent;
          text += `${algorithm}: ${hash}\n`;
        });
        
        window.hashCalculator.utils.copyToClipboard(text.trim());
      });
      
      // 保存结果到文件
      saveResultsBtn.addEventListener('click', () => {
        window.hashCalculator.utils.saveResultsToFile(container);
      });
      
      // 清空结果
      clearResultsBtn.addEventListener('click', () => {
        hashResults.innerHTML = '<div class="no-results">请输入文本或选择文件并计算哈希值</div>';
      });
      
      // 比较哈希值
      compareBtn.addEventListener('click', () => {
        window.hashCalculator.compare.compareHashes(container);
      });
      
      // 验证文件哈希
      verifyBtn.addEventListener('click', () => {
        window.hashCalculator.compare.verifyFileHash(container);
      });
      
      // 添加哈希验证事件
      hashResults.addEventListener('click', (e) => {
        if (e.target.closest('.verify-hash')) {
          const btn = e.target.closest('.verify-hash');
          const hash = btn.getAttribute('data-hash');
          
          // 切换到验证标签页
          const tabButtons = container.querySelectorAll('.hash-tab-btn');
          tabButtons.forEach(btn => {
            if (btn.getAttribute('data-tab') === 'verify') {
              btn.click();
            }
          });
          
          // 填充哈希值
          const verifyHashInput = container.querySelector('#verify-hash-input');
          verifyHashInput.value = hash;
        }
      });
    }
  };

  // 注册工具
  if (typeof window.registerTool === 'function') {
    window.registerTool(toolId, tool);
  } else {
    window.tools = window.tools || {};
    window.tools[toolId] = tool;
    console.log('工具 ' + toolId + ' 已注册');
  }
  
  // 初始化命名空间
  window.hashCalculator = window.hashCalculator || {};
})();