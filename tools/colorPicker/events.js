/**
 * 多宝工具箱 - 颜色选择器 (事件处理模块)
 */

import { 
  hexToRgb, 
  rgbToHsl, 
  normalizeHex, 
  isValidRgb, 
  isValidHsl 
} from './colorUtils.js';
import { updateColorScheme, updateColorHarmonies } from './schemes.js';
import { 
  addColorToPalette, 
  updatePaletteDisplay, 
  handleSavePalette, 
  handleLoadPalette 
} from './palette.js';
import { getPreferredColorFormat, savePalette, loadPalette } from './config.js';

/**
 * 设置事件监听器
 * @param {HTMLElement} container - 容器元素
 * @param {Object} uiElements - UI元素对象
 * @param {Object} config - 配置对象
 */
export function setupEventListeners(container, uiElements, config) {
  const {
    colorPreview,
    hexValue,
    rgbValue,
    hslValue,
    hueSlider,
    saturationSlider,
    lightnessSlider,
    alphaSlider,
    eyedropperBtn,
    randomColorBtn,
    copyColorBtn,
    addToPaletteBtn,
    colorPalette,
    clearPaletteBtn,
    savePaletteBtn,
    loadPaletteBtn,
    schemeType,
    colorScheme,
    copySchemeBtn,
    addSchemeToPaletteBtn,
    exportSchemeBtn,
    colorHarmonies,
    toggleInfoBtn
  } = uiElements;
  
  // 当前颜色状态
  let currentColor = {
    h: 204,
    s: 70,
    l: 53,
    a: 100
  };
  
  // 调色板颜色
  let paletteColors = loadPalette();
  
  // 初始化颜色预览
  updateColorPreview();
  
  // 更新颜色方案
  updateColorScheme(colorScheme, schemeType.value, currentColor, setColorFromHex, showToast);
  
  // 更新颜色和谐
  updateColorHarmonies(colorHarmonies, currentColor, setColorFromHex, showToast);
  
  // 更新调色板显示
  updatePaletteDisplay(paletteColors, colorPalette, setColorFromHex, showToast);
  
  // 检查是否支持屏幕取色API
  if (!window.EyeDropper) {
    eyedropperBtn.disabled = true;
    eyedropperBtn.title = '您的浏览器不支持屏幕取色功能';
  }
  
  // 屏幕取色按钮点击事件
  eyedropperBtn.addEventListener('click', async () => {
    if (!window.EyeDropper) {
      showToast('您的浏览器不支持屏幕取色功能', 'warning');
      return;
    }
    
    try {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      
      // 设置颜色
      setColorFromHex(result.sRGBHex);
      
      showToast('颜色已选取', 'success');
    } catch (error) {
      console.error('屏幕取色失败:', error);
      showToast('取色操作已取消', 'info');
    }
  });
  
  // 随机颜色按钮点击事件
  randomColorBtn.addEventListener('click', () => {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 80) + 20; // 20-100 更好看的饱和度
    const l = Math.floor(Math.random() * 60) + 20; // 20-80 避免太亮或太暗
    
    currentColor.h = h;
    currentColor.s = s;
    currentColor.l = l;
    
    updateSliders();
    updateColorPreview();
    updateColorScheme(colorScheme, schemeType.value, currentColor, setColorFromHex, showToast);
    updateColorHarmonies(colorHarmonies, currentColor, setColorFromHex, showToast);
    
    showToast('已生成随机颜色', 'info');
  });
  
  // 复制颜色按钮点击事件
  copyColorBtn.addEventListener('click', () => {
    const format = getPreferredColorFormat();
    let colorText = '';
    
    switch (format) {
      case 'hex':
        colorText = hexValue.value;
        break;
      case 'rgb':
        colorText = `rgb(${rgbValue.value})`;
        break;
      case 'hsl':
        colorText = `hsl(${hslValue.value})`;
        break;
    }
    
    window.copyToClipboard(colorText);
    showToast(`已复制颜色: ${colorText}`, 'success');
  });
  
  // 添加到调色板按钮点击事件
  addToPaletteBtn.addEventListener('click', () => {
    addColorToPalette(
      hexToRgb(hexValue.value), 
      hexValue.value, 
      paletteColors, 
      colorPalette, 
      updatePaletteDisplay, 
      showToast
    );
    showToast('颜色已添加到调色板', 'success');
  });
  
  // 清空调色板按钮点击事件
  clearPaletteBtn.addEventListener('click', () => {
    if (paletteColors.length === 0) {
      showToast('调色板已经是空的', 'info');
      return;
    }
    
    if (confirm('确定要清空调色板吗？')) {
      paletteColors = [];
      updatePaletteDisplay(paletteColors, colorPalette, setColorFromHex, showToast);
      savePalette(paletteColors);
      showToast('调色板已清空', 'info');
    }
  });
  
  // 保存调色板按钮点击事件
  savePaletteBtn.addEventListener('click', () => {
    handleSavePalette(paletteColors, showToast);
  });
  
  // 加载调色板按钮点击事件
  loadPaletteBtn.addEventListener('click', () => {
    handleLoadPalette(
      paletteColors, 
      colorPalette, 
      updatePaletteDisplay, 
      setColorFromHex, 
      showToast
    );
  });
  
  // 复制方案按钮点击事件
  copySchemeBtn.addEventListener('click', () => {
    const colors = Array.from(colorScheme.querySelectorAll('.scheme-color'))
      .map(el => el.getAttribute('data-color'));
    
    if (colors.length === 0) {
      showToast('没有可复制的颜色方案', 'warning');
      return;
    }
    
    window.copyToClipboard(colors.join(', '));
    showToast('颜色方案已复制到剪贴板', 'success');
  });
  
  // 添加方案到调色板按钮点击事件
  addSchemeToPaletteBtn.addEventListener('click', () => {
    const colors = Array.from(colorScheme.querySelectorAll('.scheme-color'));
    
    if (colors.length === 0) {
      showToast('没有可添加的颜色方案', 'warning');
      return;
    }
    
    colors.forEach(el => {
      const hex = el.getAttribute('data-color');
      addColorToPalette(
        hexToRgb(hex), 
        hex, 
        paletteColors, 
        colorPalette, 
        updatePaletteDisplay, 
        showToast
      );
    });
    
    showToast('颜色方案已添加到调色板', 'success');
  });
  
  // 导出方案按钮点击事件
  exportSchemeBtn.addEventListener('click', () => {
    const colors = Array.from(colorScheme.querySelectorAll('.scheme-color'))
      .map(el => el.getAttribute('data-color'));
    
    if (colors.length === 0) {
      showToast('没有可导出的颜色方案', 'warning');
      return;
    }
    
    const format = prompt('选择导出格式 (hex, rgb, hsl, css):', 'hex');
    if (!format) return;
    
    let exportText = '';
    
    switch (format.toLowerCase()) {
      case 'hex':
        exportText = colors.join('\n');
        break;
      case 'rgb':
        exportText = colors.map(hex => {
          const rgb = hexToRgb(hex);
          return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        }).join('\n');
        break;
      case 'hsl':
        exportText = colors.map(hex => {
          const rgb = hexToRgb(hex);
          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
          return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
        }).join('\n');
        break;
      case 'css':
        exportText = `:root {\n`;
        colors.forEach((hex, index) => {
          exportText += `  --color-${index + 1}: ${hex};\n`;
        });
        exportText += `}`;
        break;
      default:
        exportText = colors.join('\n');
    }
    
    // 创建下载链接
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `color-scheme-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('颜色方案已导出', 'success');
  });
  
  // 方案类型选择事件
  schemeType.addEventListener('change', () => {
    updateColorScheme(colorScheme, schemeType.value, currentColor, setColorFromHex, showToast);
  });
  
  // 色调滑块事件
  hueSlider.addEventListener('input', () => {
    currentColor.h = parseInt(hueSlider.value);
    updateColorPreview();
    updateColorScheme(colorScheme, schemeType.value, currentColor, setColorFromHex, showToast);
    updateColorHarmonies(colorHarmonies, currentColor, setColorFromHex, showToast);
  });
  
  // 饱和度滑块事件
  saturationSlider.addEventListener('input', () => {
    currentColor.s = parseInt(saturationSlider.value);
    updateColorPreview();
    updateColorScheme(colorScheme, schemeType.value, currentColor, setColorFromHex, showToast);
    updateColorHarmonies(colorHarmonies, currentColor, setColorFromHex, showToast);
  });
  
  // 亮度滑块事件
  lightnessSlider.addEventListener('input', () => {
    currentColor.l = parseInt(lightnessSlider.value);
    updateColorPreview();
    updateColorScheme(colorScheme, schemeType.value, currentColor, setColorFromHex, showToast);
    updateColorHarmonies(colorHarmonies, currentColor, setColorFromHex, showToast);
  });
  
  // 透明度滑块事件
  alphaSlider.addEventListener('input', () => {
    currentColor.a = parseInt(alphaSlider.value);
    updateColorPreview();
  });
  
  // HEX输入框事件
  hexValue.addEventListener('change', () => {
    setColorFromHex(hexValue.value);
  });
  
  // RGB输入框事件
  rgbValue.addEventListener('change', () => {
    try {
      const rgbParts = rgbValue.value.split(',').map(part => parseInt(part.trim()));
      if (rgbParts.length >= 3) {
        const [r, g, b] = rgbParts;
        if (isValidRgb(r, g, b)) {
          const hsl = rgbToHsl(r, g, b);
          currentColor.h = hsl.h;
          currentColor.s = hsl.s;
          currentColor.l = hsl.l;
          
          updateSliders();
          updateColorPreview();
          updateColorScheme(colorScheme, schemeType.value, currentColor, setColorFromHex, showToast);
          updateColorHarmonies(colorHarmonies, currentColor, setColorFromHex, showToast);
        }
      }
    } catch (e) {
      console.error('RGB解析错误:', e);
    }
  });
  
  // HSL输入框事件
  hslValue.addEventListener('change', () => {
    try {
      const hslParts = hslValue.value.split(',').map(part => parseInt(part.trim()));
      if (hslParts.length >= 3) {
        const [h, s, l] = hslParts;
        if (isValidHsl(h, s, l)) {
          currentColor.h = h;
          currentColor.s = s;
          currentColor.l = l;
          
          updateSliders();
          updateColorPreview();
          updateColorScheme(colorScheme, schemeType.value, currentColor, setColorFromHex, showToast);
          updateColorHarmonies(colorHarmonies, currentColor, setColorFromHex, showToast);
        }
      }
    } catch (e) {
      console.error('HSL解析错误:', e);
    }
  });
  
  // 使用说明折叠/展开
  toggleInfoBtn.addEventListener('click', () => {
    const infoContent = container.querySelector('.info-content');
    const isCollapsed = infoContent.style.display === 'none';
    
    infoContent.style.display = isCollapsed ? 'block' : 'none';
    toggleInfoBtn.innerHTML = isCollapsed ? 
      '<i class="fa fa-chevron-up"></i>' : 
      '<i class="fa fa-chevron-down"></i>';
    
    // 保存偏好
    localStorage.setItem('infoCollapsed_colorPicker', !isCollapsed);
  });
  
  // 检查是否应该折叠说明
  const shouldCollapseInfo = localStorage.getItem('infoCollapsed_colorPicker') === 'true';
  if (shouldCollapseInfo) {
    const infoContent = container.querySelector('.info-content');
    infoContent.style.display = 'none';
    toggleInfoBtn.innerHTML = '<i class="fa fa-chevron-down"></i>';
  }
  
  /**
   * 更新颜色预览
   */
  function updateColorPreview() {
    const { hslToHex, hslToRgb } = await import('./colorUtils.js');
    const hex = hslToHex(currentColor.h, currentColor.s, currentColor.l);
    const rgb = hslToRgb(currentColor.h, currentColor.s, currentColor.l);
    
    // 更新预览区域
    colorPreview.style.backgroundColor = `hsla(${currentColor.h}, ${currentColor.s}%, ${currentColor.l}%, ${currentColor.a / 100})`;
    
    // 更新输入框
    hexValue.value = hex;
    rgbValue.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    hslValue.value = `${Math.round(currentColor.h)}, ${Math.round(currentColor.s)}%, ${Math.round(currentColor.l)}%`;
    
    // 更新滑块背景
    updateSliderBackgrounds();
  }
  
  /**
   * 更新滑块
   */
  function updateSliders() {
    hueSlider.value = currentColor.h;
    saturationSlider.value = currentColor.s;
    lightnessSlider.value = currentColor.l;
    
    updateSliderBackgrounds();
  }
  
  /**
   * 更新滑块背景
   */
  function updateSliderBackgrounds() {
    // 色调滑块背景
    const hueGradient = [];
    for (let i = 0; i <= 360; i += 60) {
      hueGradient.push(`hsl(${i}, 100%, 50%)`);
    }
    hueSlider.style.background = `linear-gradient(to right, ${hueGradient.join(', ')})`;
    
    // 饱和度滑块背景
    saturationSlider.style.background = `linear-gradient(to right, 
      hsl(${currentColor.h}, 0%, ${currentColor.l}%), 
      hsl(${currentColor.h}, 100%, ${currentColor.l}%))`;
    
    // 亮度滑块背景
    lightnessSlider.style.background = `linear-gradient(to right, 
      hsl(${currentColor.h}, ${currentColor.s}%, 0%), 
      hsl(${currentColor.h}, ${currentColor.s}%, 50%), 
      hsl(${currentColor.h}, ${currentColor.s}%, 100%))`;
    
    // 透明度滑块背景
    const alphaGradient = `linear-gradient(to right, 
      hsla(${currentColor.h}, ${currentColor.s}%, ${currentColor.l}%, 0), 
      hsla(${currentColor.h}, ${currentColor.s}%, ${currentColor.l}%, 1))`;
    alphaSlider.style.background = alphaGradient;
  }
  
  /**
   * 从HEX设置颜色
   * @param {string} hex - HEX颜色值
   */
  function setColorFromHex(hex) {
    if (!hex) return;
    
    // 规范化HEX值
    hex = normalizeHex(hex);
    if (!hex) return;
    
    const rgb = hexToRgb(hex);
    if (!rgb) return;
    
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    currentColor.h = hsl.h;
    currentColor.s = hsl.s;
    currentColor.l = hsl.l;
    
    updateSliders();
    updateColorPreview();
    updateColorScheme(colorScheme, schemeType.value, currentColor, setColorFromHex, showToast);
    updateColorHarmonies(colorHarmonies, currentColor, setColorFromHex, showToast);
  }
  
  /**
   * 显示提示消息
   * @param {string} message - 消息内容
   * @param {string} type - 消息类型 ('success', 'info', 'warning', 'error')
   */
  function showToast(message, type = 'info') {
    window.showToast(message, type);
  }
}