/**
 * 多宝工具箱 - 颜色选择器 (调色板模块)
 */

import { hexToRgb } from './colorUtils.js';
import { savePalette } from './config.js';

/**
 * 添加颜色到调色板
 * @param {Object} rgb - RGB颜色对象 {r, g, b}
 * @param {string} hex - HEX颜色值
 * @param {Array} paletteColors - 调色板颜色数组
 * @param {HTMLElement} colorPalette - 调色板容器元素
 * @param {Function} updatePaletteDisplay - 更新调色板显示的函数
 * @param {Function} showToast - 显示提示的函数
 */
export function addColorToPalette(rgb, hex, paletteColors, colorPalette, updatePaletteDisplay, showToast) {
  // 检查是否已存在相同颜色
  const exists = paletteColors.some(color => color.hex === hex);
  if (exists) {
    showToast('此颜色已在调色板中', 'info');
    return;
  }
  
  // 添加到调色板
  paletteColors.push({
    rgb,
    hex,
    timestamp: Date.now()
  });
  
  // 更新调色板显示
  updatePaletteDisplay(paletteColors, colorPalette);
  
  // 保存调色板
  savePalette(paletteColors);
}

/**
 * 更新调色板显示
 * @param {Array} paletteColors - 调色板颜色数组
 * @param {HTMLElement} colorPalette - 调色板容器元素
 * @param {Function} setColorFromHex - 设置颜色的回调函数
 * @param {Function} showToast - 显示提示的函数
 */
export function updatePaletteDisplay(paletteColors, colorPalette, setColorFromHex, showToast) {
  colorPalette.innerHTML = '';
  
  if (paletteColors.length === 0) {
    colorPalette.innerHTML = '<div class="empty-palette">调色板为空，请添加颜色</div>';
    return;
  }
  
  paletteColors.forEach((color, index) => {
    const colorElement = document.createElement('div');
    colorElement.className = 'palette-color';
    colorElement.style.backgroundColor = color.hex;
    colorElement.setAttribute('title', color.hex);
    
    // 点击调色板颜色设置为当前颜色
    colorElement.addEventListener('click', () => {
      setColorFromHex(color.hex);
      showToast(`已选择颜色: ${color.hex}`, 'info');
    });
    
    // 右键点击删除颜色
    colorElement.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (confirm(`确定要从调色板中删除颜色 ${color.hex} 吗？`)) {
        paletteColors.splice(index, 1);
        updatePaletteDisplay(paletteColors, colorPalette, setColorFromHex, showToast);
        savePalette(paletteColors);
        showToast('颜色已从调色板中删除', 'info');
      }
    });
    
    colorPalette.appendChild(colorElement);
  });
}

/**
 * 处理保存调色板
 * @param {Array} paletteColors - 调色板颜色数组
 * @param {Function} showToast - 显示提示的函数
 */
export function handleSavePalette(paletteColors, showToast) {
  if (paletteColors.length === 0) {
    showToast('调色板是空的，没有可保存的颜色', 'warning');
    return;
  }
  
  const paletteName = prompt('请输入调色板名称:', '我的调色板');
  if (!paletteName) return;
  
  const savedPalettes = JSON.parse(localStorage.getItem('colorPalettes') || '{}');
  savedPalettes[paletteName] = paletteColors;
  localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes));
  
  showToast(`调色板 "${paletteName}" 已保存`, 'success');
}

/**
 * 处理加载调色板
 * @param {Array} paletteColors - 调色板颜色数组
 * @param {HTMLElement} colorPalette - 调色板容器元素
 * @param {Function} updatePaletteDisplay - 更新调色板显示的函数
 * @param {Function} setColorFromHex - 设置颜色的回调函数
 * @param {Function} showToast - 显示提示的函数
 */
export function handleLoadPalette(paletteColors, colorPalette, updatePaletteDisplay, setColorFromHex, showToast) {
  const savedPalettes = JSON.parse(localStorage.getItem('colorPalettes') || '{}');
  const paletteNames = Object.keys(savedPalettes);
  
  if (paletteNames.length === 0) {
    showToast('没有保存的调色板', 'warning');
    return;
  }
  
  let selectHtml = '<select id="palette-select" class="form-control">';
  paletteNames.forEach(name => {
    selectHtml += `<option value="${name}">${name}</option>`;
  });
  selectHtml += '</select>';
  
  const dialog = document.createElement('div');
  dialog.className = 'dialog';
  dialog.innerHTML = `
    <div class="dialog-content">
      <div class="dialog-header">
        <h3>加载调色板</h3>
        <button class="close-btn">&times;</button>
      </div>
      <div class="dialog-body">
        <p>选择要加载的调色板:</p>
        ${selectHtml}
        <div class="palette-preview" id="palette-preview"></div>
      </div>
      <div class="dialog-footer">
        <button id="load-btn" class="btn btn-primary">加载</button>
        <button id="delete-btn" class="btn btn-danger">删除</button>
        <button id="cancel-btn" class="btn">取消</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  const paletteSelect = dialog.querySelector('#palette-select');
  const palettePreview = dialog.querySelector('#palette-preview');
  const loadBtn = dialog.querySelector('#load-btn');
  const deleteBtn = dialog.querySelector('#delete-btn');
  const cancelBtn = dialog.querySelector('#cancel-btn');
  const closeBtn = dialog.querySelector('.close-btn');
  
  // 显示选中调色板的预览
  function updatePalettePreview() {
    const selectedPalette = savedPalettes[paletteSelect.value];
    palettePreview.innerHTML = '';
    
    if (selectedPalette && selectedPalette.length > 0) {
      selectedPalette.forEach(color => {
        const colorSwatch = document.createElement('div');
        colorSwatch.className = 'palette-color-preview';
        colorSwatch.style.backgroundColor = color.hex;
        palettePreview.appendChild(colorSwatch);
      });
    } else {
      palettePreview.innerHTML = '<p>空调色板</p>';
    }
  }
  
  updatePalettePreview();
  
  paletteSelect.addEventListener('change', updatePalettePreview);
  
  loadBtn.addEventListener('click', () => {
    const selectedPalette = savedPalettes[paletteSelect.value];
    if (selectedPalette && selectedPalette.length > 0) {
      if (paletteColors.length > 0 && !confirm('这将替换当前调色板中的所有颜色，确定继续吗？')) {
        return;
      }
      
      // 清空并重新填充调色板
      paletteColors.length = 0;
      selectedPalette.forEach(color => paletteColors.push(color));
      
      updatePaletteDisplay(paletteColors, colorPalette, setColorFromHex, showToast);
      savePalette(paletteColors);
      showToast(`已加载调色板 "${paletteSelect.value}"`, 'success');
    }
    
    document.body.removeChild(dialog);
  });
  
  deleteBtn.addEventListener('click', () => {
    if (confirm(`确定要删除调色板 "${paletteSelect.value}" 吗？`)) {
      delete savedPalettes[paletteSelect.value];
      localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes));
      
      showToast(`已删除调色板 "${paletteSelect.value}"`, 'info');
      document.body.removeChild(dialog);
    }
  });
  
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(dialog);
  });
  
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(dialog);
  });
}