/**
 * 多宝工具箱 - 哈希计算器 - 入口文件
 */

const ui = require('./ui');
const core = require('./core');
const compare = require('./compare');
const utils = require('./utils');

// 定义工具
const tool = {
  render: function(container) {
    // 渲染UI
    ui.renderUI(container);
    
    // 加载CryptoJS库
    this.loadCryptoJS();
    
    // 绑定事件
    this.bindEvents(container);
  },
  
  // 加载CryptoJS库
  loadCryptoJS: function() {
    if (!window.CryptoJS) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
      document.head.appendChild(script);
      
      script.onload = () => {
        utils.showToast('CryptoJS库加载成功', 'success');
      };
      
      script.onerror = () => {
        utils.showToast('CryptoJS库加载失败，请检查网络连接', 'error');
      };
    }
  },
  
  // 绑定事件
  bindEvents: function(container) {
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
        core.calculateTextHash(container);
      } else if (activeTab === 'file') {
        core.calculateFileHash(container);
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
        utils.showToast('没有可复制的哈希值', 'warning');
        return;
      }
      
      let text = '';
      resultItems.forEach(item => {
        const algorithm = item.querySelector('.hash-algorithm').textContent;
        const hash = item.querySelector('.hash-value').textContent;
        text += `${algorithm}: ${hash}\n`;
      });
      
      utils.copyToClipboard(text.trim());
    });
    
    // 保存结果到文件
    saveResultsBtn.addEventListener('click', () => {
      utils.saveResultsToFile(container);
    });
    
    // 清空结果
    clearResultsBtn.addEventListener('click', () => {
      hashResults.innerHTML = '<div class="no-results">请输入文本或选择文件并计算哈希值</div>';
    });
    
    // 比较哈希值
    compareBtn.addEventListener('click', () => {
      compare.compareHashes(container);
    });
    
    // 验证文件哈希
    verifyBtn.addEventListener('click', () => {
      compare.verifyFileHash(container);
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
window.tools.hashCalculator = tool;