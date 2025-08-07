/**
 * 多宝工具箱 - 颜色转换工具 - 可访问性检测模块
 */
const utils = require('./utils');

const accessibility = {
  // 初始化可访问性检测
  initAccessibility: function(container) {
    const foregroundInput = container.querySelector('#foreground-input');
    const foregroundPicker = container.querySelector('#foreground-picker');
    const foregroundPreview = container.querySelector('#foreground-preview');
    
    const backgroundInput = container.querySelector('#background-input');
    const backgroundPicker = container.querySelector('#background-picker');
    const backgroundPreview = container.querySelector('#background-preview');
    
    const checkContrastBtn = container.querySelector('#check-contrast');
    const swapColorsBtn = container.querySelector('#swap-colors');
    const textPreviewContent = container.querySelector('#text-preview-content');
    const contrastResultContent = container.querySelector('#contrast-result-content');
    
    // 更新前景色预览
    const updateForegroundPreview = () => {
      const color = foregroundInput.value;
      foregroundPreview.style.backgroundColor = color;
      foregroundPicker.value = this.normalizeColor(color);
      
      // 更新文本预览
      this.updateTextPreview(textPreviewContent, foregroundInput.value, backgroundInput.value);
    };
    
    // 更新背景色预览
    const updateBackgroundPreview = () => {
      const color = backgroundInput.value;
      backgroundPreview.style.backgroundColor = color;
      backgroundPicker.value = this.normalizeColor(color);
      
      // 更新文本预览
      this.updateTextPreview(textPreviewContent, foregroundInput.value, backgroundInput.value);
    };
    
    // 检查对比度
    const checkContrast = () => {
      const foreground = foregroundInput.value;
      const background = backgroundInput.value;
      
      // 验证颜色格式
      if (!this.isValidColor(foreground) || !this.isValidColor(background)) {
        utils.showToast('无效的颜色格式', 'error');
        return;
      }
      
      // 计算对比度
      const contrast = this.calculateContrast(foreground, background);
      
      // 更新结果
      this.updateContrastResult(contrastResultContent, contrast);
      
      // 更新文本预览
      this.updateTextPreview(textPreviewContent, foreground, background);
    };
    
    // 交换颜色
    const swapColors = () => {
      const foreground = foregroundInput.value;
      const background = backgroundInput.value;
      
      foregroundInput.value = background;
      backgroundInput.value = foreground;
      
      updateForegroundPreview();
      updateBackgroundPreview();
      checkContrast();
    };
    
    // 事件监听
    foregroundInput.addEventListener('input', updateForegroundPreview);
    foregroundPicker.addEventListener('input', () => {
      foregroundInput.value = foregroundPicker.value;
      updateForegroundPreview();
    });
    
    backgroundInput.addEventListener('input', updateBackgroundPreview);
    backgroundPicker.addEventListener('input', () => {
      backgroundInput.value = backgroundPicker.value;
      updateBackgroundPreview();
    });
    
    checkContrastBtn.addEventListener('click', checkContrast);
    swapColorsBtn.addEventListener('click', swapColors);
    
    // 初始化
    updateForegroundPreview();
    updateBackgroundPreview();
    checkContrast();
  },
  
  // 更新文本预览
  updateTextPreview: function(previewElement, foreground, background) {
    previewElement.style.color = foreground;
    previewElement.style.backgroundColor = background;
  },
  
  // 更新对比度结果
  updateContrastResult: function(resultElement, contrast) {
    const ratio = contrast.ratio.toFixed(2);
    let wcagAA = '不通过';
    let wcagAAA = '不通过';
    let wcagAALarge = '不通过';
    let wcagAAALarge = '不通过';
    
    // WCAG 2.0 标准
    // AA 级要求：普通文本 4.5:1，大号文本 3:1
    // AAA 级要求：普通文本 7:1，大号文本 4.5:1
    if (contrast.ratio >= 4.5) {
      wcagAA = '通过';
      wcagAALarge = '通过';
    } else if (contrast.ratio >= 3) {
      wcagAALarge = '通过';
    }
    
    if (contrast.ratio >= 7) {
      wcagAAA = '通过';
      wcagAAALarge = '通过';
    } else if (contrast.ratio >= 4.5) {
      wcagAAALarge = '通过';
    }
    
    let resultClass = '';
    if (contrast.ratio >= 7) {
      resultClass = 'excellent';
    } else if (contrast.ratio >= 4.5) {
      resultClass = 'good';
    } else if (contrast.ratio >= 3) {
      resultClass = 'fair';
    } else {
      resultClass = 'poor';
    }
    
    let html = `
      <div class="contrast-ratio ${resultClass}">
        <div class="contrast-ratio-value">${ratio}:1</div>
        <div class="contrast-ratio-label">${this.getContrastRatingText(contrast.ratio)}</div>
      </div>
      
      <div class="wcag-results">
        <div class="wcag-result-item">
          <div class="wcag-result-label">WCAG AA (普通文本)</div>
          <div class="wcag-result-value ${wcagAA === '通过' ? 'pass' : 'fail'}">${wcagAA}</div>
        </div>
        
        <div class="wcag-result-item">
          <div class="wcag-result-label">WCAG AA (大号文本)</div>
          <div class="wcag-result-value ${wcagAALarge === '通过' ? 'pass' : 'fail'}">${wcagAALarge}</div>
        </div>
        
        <div class="wcag-result-item">
          <div class="wcag-result-label">WCAG AAA (普通文本)</div>
          <div class="wcag-result-value ${wcagAAA === '通过' ? 'pass' : 'fail'}">${wcagAAA}</div>
        </div>
        
        <div class="wcag-result-item">
          <div class="wcag-result-label">WCAG AAA (大号文本)</div>
          <div class="wcag-result-value ${wcagAAALarge === '通过' ? 'pass' : 'fail'}">${wcagAAALarge}</div>
        </div>
      </div>
      
      <div class="contrast-tips">
        <div class="contrast-tip-header">提示</div>
        <ul class="contrast-tip-list">
          <li>普通文本需要至少 4.5:1 的对比度 (WCAG AA)</li>
          <li>大号文本 (18pt+ 或 14pt+ 粗体) 需要至少 3:1 的对比度 (WCAG AA)</li>
          <li>最佳可访问性需要至少 7:1 的对比度 (WCAG AAA)</li>
        </ul>
      </div>
    `;
    
    resultElement.innerHTML = html;
  },
  
  // 获取对比度评级文本
  getContrastRatingText: function(ratio) {
    if (ratio >= 7) {
      return '优秀 - 符合 WCAG AAA';
    } else if (ratio >= 4.5) {
      return '良好 - 符合 WCAG AA';
    } else if (ratio >= 3) {
      return '一般 - 仅适用于大号文本';
    } else {
      return '较差 - 不符合 WCAG 标准';
    }
  },
  
  // 计算对比度
  calculateContrast: function(color1, color2) {
    // 转换为RGB
    const rgb1 = this.colorToRgb(color1);
    const rgb2 = this.colorToRgb(color2);
    
    // 计算相对亮度
    const luminance1 = this.calculateRelativeLuminance(rgb1);
    const luminance2 = this.calculateRelativeLuminance(rgb2);
    
    // 计算对比度
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    const ratio = (lighter + 0.05) / (darker + 0.05);
    
    return {
      ratio: ratio,
      luminance1: luminance1,
      luminance2: luminance2
    };
  },
  
  // 计算相对亮度
  calculateRelativeLuminance: function(rgb) {
    // 将RGB值转换为相对亮度
    // 参考: https://www.w3.org/TR/WCAG20/#relativeluminancedef
    
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  },
  
  // 将颜色转换为RGB
  colorToRgb: function(color) {
    // 创建临时元素来获取计算后的颜色值
    const tempElement = document.createElement('div');
    tempElement.style.color = color;
    document.body.appendChild(tempElement);
    
    // 获取计算后的颜色
    const computedColor = getComputedStyle(tempElement).color;
    document.body.removeChild(tempElement);
    
    // 解析RGB值
    const match = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3])
      };
    }
    
    // 如果无法解析，返回黑色
    return { r: 0, g: 0, b: 0 };
  },
  
  // 验证颜色格式
  isValidColor: function(color) {
    const tempElement = document.createElement('div');
    tempElement.style.color = '';
    tempElement.style.color = color;
    return tempElement.style.color !== '';
  },
  
  // 标准化颜色格式为HEX
  normalizeColor: function(color) {
    // 创建临时元素来获取计算后的颜色值
    const tempElement = document.createElement('div');
    tempElement.style.color = color;
    document.body.appendChild(tempElement);
    
    // 获取计算后的颜色
    const computedColor = getComputedStyle(tempElement).color;
    document.body.removeChild(tempElement);
    
    // 解析RGB值
    const match = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      
      // 转换为HEX
      return utils.rgbToHex(r, g, b);
    }
    
    return '#000000';
  }
};

module.exports = accessibility;