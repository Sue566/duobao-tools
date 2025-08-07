/**
 * 多宝工具箱 - 颜色转换工具 - 调色板模块
 */
const utils = require('./utils');

const palette = {
  // 初始化调色板
  initPalette: function(container) {
    const addToPaletteBtn = container.querySelector('#add-to-palette');
    const clearPaletteBtn = container.querySelector('#clear-palette');
    const paletteContent = container.querySelector('#palette-content');
    
    // 添加颜色到调色板
    const addToPalette = () => {
      const outputHex = container.querySelector('#output-hex');
      const outputRgb = container.querySelector('#output-rgb');
      
      const hex = outputHex.textContent;
      const rgb = outputRgb.textContent;
      
      // 获取现有调色板
      let palette = JSON.parse(localStorage.getItem('colorPalette') || '[]');
      
      // 检查是否已存在
      if (palette.some(color => color.hex === hex)) {
        utils.showToast('该颜色已在调色板中', 'info');
        return;
      }
      
      // 添加新颜色
      palette.push({
        hex: hex,
        rgb: rgb,
        timestamp: new Date().toISOString()
      });
      
      // 保存调色板
      localStorage.setItem('colorPalette', JSON.stringify(palette));
      
      // 更新调色板显示
      this.updatePaletteDisplay(container);
      
      utils.showToast('颜色已添加到调色板', 'success');
    };
    
    // 事件监听
    addToPaletteBtn.addEventListener('click', addToPalette);
    clearPaletteBtn.addEventListener('click', () => {
      if (confirm('确定要清空调色板吗？')) {
        localStorage.removeItem('colorPalette');
        this.updatePaletteDisplay(container);
        utils.showToast('调色板已清空', 'info');
      }
    });
    
    // 初始化调色板显示
    this.updatePaletteDisplay(container);
  },
  
  // 更新调色板显示
  updatePaletteDisplay: function(container) {
    const paletteContent = container.querySelector('#palette-content');
    const palette = JSON.parse(localStorage.getItem('colorPalette') || '[]');
    
    if (palette.length === 0) {
      paletteContent.innerHTML = '<div class="no-colors">暂无保存的颜色</div>';
      return;
    }
    
    let html = '';
    palette.forEach((color, index) => {
      html += `
        <div class="palette-item">
          <div class="palette-color" style="background-color: ${color.hex}"></div>
          <div class="palette-info">
            <div class="palette-hex">${color.hex}</div>
            <div class="palette-rgb">${color.rgb}</div>
          </div>
          <div class="palette-actions">
            <button class="btn btn-icon btn-sm use-color" data-index="${index}" title="使用此颜色"><i class="fa fa-arrow-up"></i></button>
            <button class="btn btn-icon btn-sm remove-color" data-index="${index}" title="移除"><i class="fa fa-times"></i></button>
          </div>
        </div>
      `;
    });
    
    paletteContent.innerHTML = html;
    
    // 添加事件监听
    paletteContent.querySelectorAll('.use-color').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        const color = palette[index];
        
        // 设置HEX输入并转换
        const hexInput = container.querySelector('#hex-input');
        hexInput.value = color.hex;
        
        // 触发转换
        const convertHexBtn = container.querySelector('#convert-hex');
        convertHexBtn.click();
        
        // 切换到转换器标签页
        const tabButtons = container.querySelectorAll('.tab-btn');
        tabButtons[0].click();
      });
    });
    
    paletteContent.querySelectorAll('.remove-color').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        
        // 移除颜色
        palette.splice(index, 1);
        
        // 保存调色板
        localStorage.setItem('colorPalette', JSON.stringify(palette));
        
        // 更新显示
        this.updatePaletteDisplay(container);
        
        utils.showToast('颜色已从调色板移除', 'info');
      });
    });
  }
};

module.exports = palette;