/**
 * 多宝工具箱 - 颜色转换工具 - 可访问性UI模块
 */

const uiAccessibility = {
  // 渲染可访问性标签页
  render: function(container) {
    const accessibilityTab = container.querySelector('#tab-accessibility');
    
    accessibilityTab.innerHTML = `
      <div class="accessibility-container">
        <div class="accessibility-header">
          <h3>颜色可访问性检测</h3>
          <p class="accessibility-description">检测前景色和背景色的对比度，确保符合WCAG标准</p>
        </div>
        
        <div class="accessibility-controls">
          <div class="color-pair">
            <div class="color-pair-item">
              <label>前景色 (文本)</label>
              <div class="color-input-group">
                <div class="color-preview-small" id="foreground-preview" style="background-color: #000000;"></div>
                <input type="text" id="foreground-input" class="form-control" value="#000000" />
                <input type="color" id="foreground-picker" value="#000000" />
              </div>
            </div>
            
            <div class="color-pair-item">
              <label>背景色</label>
              <div class="color-input-group">
                <div class="color-preview-small" id="background-preview" style="background-color: #FFFFFF;"></div>
                <input type="text" id="background-input" class="form-control" value="#FFFFFF" />
                <input type="color" id="background-picker" value="#FFFFFF" />
              </div>
            </div>
          </div>
          
          <div class="accessibility-actions">
            <button id="check-contrast" class="btn btn-success"><i class="fa fa-check"></i> 检测对比度</button>
            <button id="swap-colors" class="btn"><i class="fa fa-exchange"></i> 交换颜色</button>
          </div>
        </div>
        
        <div class="accessibility-result">
          <div class="text-preview">
            <div class="text-preview-header">
              <h4>文本预览</h4>
            </div>
            
            <div class="text-preview-content" id="text-preview-content">
              <div class="text-sample text-large">大号文本示例 (18pt)</div>
              <div class="text-sample text-medium">中号文本示例 (14pt)</div>
              <div class="text-sample text-small">小号文本示例 (12pt)</div>
            </div>
          </div>
          
          <div class="contrast-result">
            <div class="contrast-result-header">
              <h4>对比度结果</h4>
            </div>
            
            <div class="contrast-result-content" id="contrast-result-content">
              <!-- 对比度结果将在JavaScript中动态生成 -->
            </div>
          </div>
        </div>
      </div>
    `;
    
    // 添加样式
    this.addStyles(container);
  },
  
  // 添加可访问性样式
  addStyles: function(container) {
    const style = document.createElement('style');
    style.textContent = `
      /* 可访问性检测样式 */
      .accessibility-container {
        padding: 20px;
      }
      
      .accessibility-header {
        margin-bottom: 20px;
      }
      
      .accessibility-header h3 {
        margin: 0 0 10px 0;
      }
      
      .accessibility-description {
        color: var(--text-muted);
        margin: 0;
      }
      
      .accessibility-controls {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 30px;
      }
      
      .color-pair {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-bottom: 20px;
      }
      
      .color-pair-item {
        flex: 1;
        min-width: 200px;
      }
      
      .color-input-group {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .color-preview-small {
        width: 30px;
        height: 30px;
        border-radius: 4px;
        border: 1px solid var(--border-color);
      }
      
      .accessibility-actions {
        display: flex;
        gap: 10px;
      }
      
      .accessibility-result {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
      }
      
      .text-preview {
        flex: 1;
        min-width: 300px;
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
      }
      
      .text-preview-header {
        padding: 15px;
        border-bottom: 1px solid var(--border-color);
      }
      
      .text-preview-header h4 {
        margin: 0;
      }
      
      .text-preview-content {
        padding: 20px;
      }
      
      .text-sample {
        margin-bottom: 15px;
      }
      
      .text-sample:last-child {
        margin-bottom: 0;
      }
      
      .text-large {
        font-size: 18pt;
        font-weight: bold;
      }
      
      .text-medium {
        font-size: 14pt;
      }
      
      .text-small {
        font-size: 12pt;
      }
      
      .contrast-result {
        flex: 1;
        min-width: 300px;
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
      }
      
      .contrast-result-header {
        padding: 15px;
        border-bottom: 1px solid var(--border-color);
      }
      
      .contrast-result-header h4 {
        margin: 0;
      }
      
      .contrast-result-content {
        padding: 15px;
      }
      
      .contrast-ratio {
        text-align: center;
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 8px;
      }
      
      .contrast-ratio.excellent {
        background-color: #d4edda;
        color: #155724;
      }
      
      .contrast-ratio.good {
        background-color: #d1ecf1;
        color: #0c5460;
      }
      
      .contrast-ratio.fair {
        background-color: #fff3cd;
        color: #856404;
      }
      
      .contrast-ratio.poor {
        background-color: #f8d7da;
        color: #721c24;
      }
      
      .contrast-ratio-value {
        font-size: 24px;
        font-weight: bold;
      }
      
      .contrast-ratio-label {
        margin-top: 5px;
      }
      
      .wcag-results {
        margin-bottom: 15px;
      }
      
      .wcag-result-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid var(--border-color);
      }
      
      .wcag-result-item:last-child {
        border-bottom: none;
      }
      
      .wcag-result-value.pass {
        color: #28a745;
        font-weight: bold;
      }
      
      .wcag-result-value.fail {
        color: #dc3545;
      }
      
      .contrast-tips {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 15px;
        margin-top: 15px;
      }
      
      .contrast-tip-header {
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      .contrast-tip-list {
        margin: 0;
        padding-left: 20px;
      }
      
      .contrast-tip-list li {
        margin-bottom: 5px;
      }
      
      .contrast-tip-list li:last-child {
        margin-bottom: 0;
      }
    `;
    container.appendChild(style);
  }
};

module.exports = uiAccessibility;