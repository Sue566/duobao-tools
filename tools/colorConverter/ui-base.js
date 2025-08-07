/**
 * 多宝工具箱 - 颜色转换工具 - 基础UI模块
 */

const uiBase = {
  // 渲染工具界面
  renderUI: function(container) {
    // 创建工具界面
    container.innerHTML = `
      <div class="tool-header">
        <h2><i class="fa fa-eyedropper"></i> 颜色转换</h2>
        <p class="tool-description">在不同颜色格式之间转换，生成色彩方案，检测颜色可访问性。</p>
      </div>
      
      <div class="color-tabs">
        <div class="tab-header">
          <button class="tab-btn active" data-tab="converter">转换器</button>
          <button class="tab-btn" data-tab="schemes">色彩方案</button>
          <button class="tab-btn" data-tab="accessibility">可访问性</button>
          <button class="tab-btn" data-tab="palette">调色板</button>
        </div>
        
        <div class="tab-content active" id="tab-converter">
          <!-- 转换器内容将由ui-converter.js渲染 -->
        </div>
        
        <div class="tab-content" id="tab-schemes">
          <!-- 色彩方案内容将由ui-schemes.js渲染 -->
        </div>
        
        <div class="tab-content" id="tab-accessibility">
          <!-- 可访问性内容将由ui-accessibility.js渲染 -->
        </div>
        
        <div class="tab-content" id="tab-palette">
          <!-- 调色板内容将由ui-palette.js渲染 -->
        </div>
      </div>
    `;
    
    // 添加样式
    this.addStyles(container);
    
    // 添加收藏按钮
    window.addFavoriteButton('colorConverter', container.querySelector('.tool-header'));
    
    // 初始化标签页切换
    this.initTabs(container);
  },
  
  // 初始化标签页切换
  initTabs: function(container) {
    const tabButtons = container.querySelectorAll('.color-tabs > .tab-header > .tab-btn');
    const tabContents = container.querySelectorAll('.color-tabs > .tab-content');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.getAttribute('data-tab');
        
        // 移除所有活动状态
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // 添加活动状态
        button.classList.add('active');
        container.querySelector(`#tab-${tab}`).classList.add('active');
      });
    });
  },
  
  // 添加基础样式
  addStyles: function(container) {
    const style = document.createElement('style');
    style.textContent = `
      .tab-header {
        display: flex;
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 15px;
      }
      
      .tab-btn {
        padding: 10px 15px;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        transition: var(--transition);
      }
      
      .tab-btn.active {
        border-bottom-color: var(--primary-color);
        color: var(--primary-color);
      }
      
      .tab-content {
        display: none;
      }
      
      .tab-content.active {
        display: block;
      }
      
      @media (max-width: 768px) {
        .color-container {
          flex-direction: column;
        }
        
        .schemes-result {
          flex-direction: column;
        }
        
        .accessibility-result {
          flex-direction: column;
        }
      }
    `;
    container.appendChild(style);
  }
};

module.exports = uiBase;