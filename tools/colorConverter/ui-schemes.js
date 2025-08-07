/**
 * 多宝工具箱 - 颜色转换工具 - 色彩方案UI模块
 */

const uiSchemes = {
  // 渲染色彩方案标签页
  render: function(container) {
    const schemesTab = container.querySelector('#tab-schemes');
    
    schemesTab.innerHTML = `
      <div class="schemes-container">
        <div class="schemes-header">
          <h3>色彩方案生成器</h3>
          <p class="schemes-description">基于当前颜色生成各种色彩方案</p>
        </div>
        
        <div class="schemes-controls">
          <div class="form-group">
            <label for="scheme-type">方案类型</label>
            <select id="scheme-type" class="form-control">
              <option value="monochromatic">单色方案</option>
              <option value="analogous">类似色方案</option>
              <option value="complementary">互补色方案</option>
              <option value="triadic">三色方案</option>
              <option value="tetradic">四色方案</option>
              <option value="split-complementary">分离互补色方案</option>
              <option value="shades">色调方案</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="scheme-count">颜色数量</label>
            <input type="range" id="scheme-count" min="3" max="10" value="5" class="form-control" />
            <div class="range-value"><span id="scheme-count-value">5</span> 个颜色</div>
          </div>
          
          <div class="schemes-actions">
            <button id="generate-scheme" class="btn btn-success"><i class="fa fa-refresh"></i> 生成方案</button>
            <button id="save-scheme" class="btn"><i class="fa fa-save"></i> 保存方案</button>
          </div>
        </div>
        
        <div class="schemes-result">
          <div class="schemes-preview" id="schemes-preview">
            <!-- 色彩方案预览将在JavaScript中动态生成 -->
          </div>
          
          <div class="schemes-info">
            <div class="schemes-info-header">
              <h4>方案信息</h4>
              <button id="copy-scheme" class="btn btn-sm"><i class="fa fa-copy"></i> 复制方案</button>
            </div>
            
            <div class="schemes-info-content" id="schemes-info-content">
              <!-- 方案信息将在JavaScript中动态生成 -->
            </div>
          </div>
        </div>
        
        <div class="saved-schemes">
          <div class="saved-schemes-header">
            <h3>已保存的方案</h3>
            <button id="clear-schemes" class="btn btn-sm btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
          </div>
          
          <div class="saved-schemes-content" id="saved-schemes-content">
            <div class="no-schemes">暂无保存的色彩方案</div>
          </div>
        </div>
      </div>
    `;
    
    // 添加样式
    this.addStyles(container);
  },
  
  // 添加色彩方案样式
  addStyles: function(container) {
    const style = document.createElement('style');
    style.textContent = `
      /* 色彩方案样式 */
      .schemes-container {
        padding: 20px;
      }
      
      .schemes-header {
        margin-bottom: 20px;
      }
      
      .schemes-header h3 {
        margin: 0 0 10px 0;
      }
      
      .schemes-description {
        color: var(--text-muted);
        margin: 0;
      }
      
      .schemes-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-bottom: 30px;
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 20px;
      }
      
      .schemes-controls .form-group {
        flex: 1;
        min-width: 200px;
      }
      
      .range-value {
        margin-top: 5px;
        color: var(--text-muted);
        font-size: 14px;
      }
      
      .schemes-actions {
        display: flex;
        gap: 10px;
        align-items: flex-end;
      }
      
      .schemes-result {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .schemes-preview {
        flex: 1;
        min-width: 300px;
        display: flex;
        border-radius: 8px;
        overflow: hidden;
        height: 100px;
      }
      
      .scheme-color {
        flex: 1;
        position: relative;
      }
      
      .scheme-color-info {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px;
        font-family: monospace;
        font-size: 12px;
        text-align: center;
        opacity: 0;
        transition: opacity 0.2s;
      }
      
      .scheme-color:hover .scheme-color-info {
        opacity: 1;
      }
      
      .schemes-info {
        flex: 1;
        min-width: 300px;
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
      }
      
      .schemes-info-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid var(--border-color);
      }
      
      .schemes-info-header h4 {
        margin: 0;
      }
      
      .schemes-info-content {
        padding: 15px;
      }
      
      .scheme-info-item {
        display: flex;
        margin-bottom: 10px;
      }
      
      .scheme-info-label {
        width: 100px;
        color: var(--text-muted);
      }
      
      .scheme-info-value {
        font-weight: 500;
      }
      
      .scheme-info-colors {
        margin-top: 15px;
      }
      
      .scheme-info-color {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .scheme-info-color:last-child {
        margin-bottom: 0;
      }
      
      .scheme-info-color-preview {
        width: 30px;
        height: 30px;
        border-radius: 4px;
        border: 1px solid var(--border-color);
        margin-right: 10px;
      }
      
      .scheme-info-color-values {
        font-family: monospace;
        font-size: 14px;
      }
      
      .saved-schemes {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
      }
      
      .saved-schemes-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid var(--border-color);
      }
      
      .saved-schemes-header h3 {
        margin: 0;
      }
      
      .saved-schemes-content {
        padding: 15px;
        max-height: 300px;
        overflow-y: auto;
      }
      
      .saved-scheme {
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid var(--border-color);
      }
      
      .saved-scheme:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
      
      .saved-scheme-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .saved-scheme-title {
        font-weight: 500;
      }
      
      .saved-scheme-actions {
        display: flex;
        gap: 5px;
      }
      
      .saved-scheme-colors {
        display: flex;
        height: 30px;
        border-radius: 4px;
        overflow: hidden;
      }
      
      .saved-scheme-color {
        flex: 1;
      }
      
      .no-schemes {
        text-align: center;
        padding: 20px;
        color: var(--text-muted);
      }
    `;
    container.appendChild(style);
  }
};

module.exports = uiSchemes;