/**
 * 多宝工具箱 - 颜色转换工具 - 调色板UI模块
 */

const uiPalette = {
  // 渲染调色板标签页
  render: function(container) {
    const paletteTab = container.querySelector('#tab-palette');
    
    paletteTab.innerHTML = `
      <div class="color-palette">
        <div class="palette-header">
          <h3>颜色调色板</h3>
          <div class="palette-actions">
            <button id="clear-palette" class="btn btn-sm btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
          </div>
        </div>
        
        <div class="palette-content" id="palette-content">
          <div class="no-colors">暂无保存的颜色</div>
        </div>
      </div>
    `;
    
    // 添加样式
    this.addStyles(container);
  },
  
  // 添加调色板样式
  addStyles: function(container) {
    const style = document.createElement('style');
    style.textContent = `
      .color-palette {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
      }
      
      .palette-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid var(--border-color);
      }
      
      .palette-header h3 {
        margin: 0;
      }
      
      .palette-content {
        padding: 15px;
        max-height: 300px;
        overflow-y: auto;
      }
      
      .palette-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--border-color);
      }
      
      .palette-item:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
      
      .palette-color {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        border: 1px solid var(--border-color);
        margin-right: 15px;
      }
      
      .palette-info {
        flex-grow: 1;
      }
      
      .palette-hex {
        font-family: monospace;
        font-weight: 500;
      }
      
      .palette-rgb {
        font-family: monospace;
        font-size: 12px;
        color: var(--text-muted);
      }
      
      .palette-actions {
        display: flex;
        gap: 5px;
      }
      
      .no-colors {
        text-align: center;
        padding: 20px;
        color: var(--text-muted);
      }
    `;
    container.appendChild(style);
  }
};

module.exports = uiPalette;