/**
 * 多宝工具箱 - 颜色转换工具 - 色彩方案模块
 */
const utils = require('./utils');

const schemes = {
  // 初始化色彩方案
  initSchemes: function(container) {
    const schemeType = container.querySelector('#scheme-type');
    const schemeCount = container.querySelector('#scheme-count');
    const schemeCountValue = container.querySelector('#scheme-count-value');
    const generateSchemeBtn = container.querySelector('#generate-scheme');
    const saveSchemeBtn = container.querySelector('#save-scheme');
    const schemesPreview = container.querySelector('#schemes-preview');
    const schemesInfoContent = container.querySelector('#schemes-info-content');
    const copySchemeBtn = container.querySelector('#copy-scheme');
    const savedSchemesContent = container.querySelector('#saved-schemes-content');
    const clearSchemesBtn = container.querySelector('#clear-schemes');
    
    // 更新范围值显示
    schemeCount.addEventListener('input', () => {
      schemeCountValue.textContent = schemeCount.value;
    });
    
    // 生成色彩方案
    const generateScheme = () => {
      const type = schemeType.value;
      const count = parseInt(schemeCount.value);
      
      // 获取当前颜色
      const hexInput = container.querySelector('#hex-input');
      const hex = hexInput.value;
      const rgb = utils.hexToRgb(hex);
      const hsl = utils.rgbToHsl(rgb.r, rgb.g, rgb.b);
      
      // 根据类型生成方案
      let colors = [];
      
      switch (type) {
        case 'monochromatic':
          colors = this.generateMonochromaticScheme(hsl, count);
          break;
        case 'analogous':
          colors = this.generateAnalogousScheme(hsl, count);
          break;
        case 'complementary':
          colors = this.generateComplementaryScheme(hsl, count);
          break;
        case 'triadic':
          colors = this.generateTriadicScheme(hsl, count);
          break;
        case 'tetradic':
          colors = this.generateTetradicScheme(hsl, count);
          break;
        case 'split-complementary':
          colors = this.generateSplitComplementaryScheme(hsl, count);
          break;
        case 'shades':
          colors = this.generateShadesScheme(hsl, count);
          break;
      }
      
      // 更新预览
      this.updateSchemePreview(schemesPreview, colors);
      
      // 更新信息
      this.updateSchemeInfo(schemesInfoContent, colors, type);
      
      // 保存当前方案到会话存储
      sessionStorage.setItem('currentScheme', JSON.stringify({
        type: type,
        colors: colors
      }));
    };
    
    // 保存方案
    const saveScheme = () => {
      const currentScheme = JSON.parse(sessionStorage.getItem('currentScheme'));
      
      if (!currentScheme) {
        utils.showToast('请先生成色彩方案', 'error');
        return;
      }
      
      // 获取已保存的方案
      let savedSchemes = JSON.parse(localStorage.getItem('colorSchemes') || '[]');
      
      // 添加新方案
      savedSchemes.push({
        ...currentScheme,
        timestamp: new Date().toISOString()
      });
      
      // 保存方案
      localStorage.setItem('colorSchemes', JSON.stringify(savedSchemes));
      
      // 更新显示
      this.updateSavedSchemes(savedSchemesContent);
      
      utils.showToast('色彩方案已保存', 'success');
    };
    
    // 复制方案
    const copyScheme = () => {
      const currentScheme = JSON.parse(sessionStorage.getItem('currentScheme'));
      
      if (!currentScheme) {
        utils.showToast('请先生成色彩方案', 'error');
        return;
      }
      
      const text = currentScheme.colors.map(color => color.hex).join('\n');
      utils.copyToClipboard(text);
    };
    
    // 清空已保存的方案
    const clearSchemes = () => {
      if (confirm('确定要清空所有已保存的色彩方案吗？')) {
        localStorage.removeItem('colorSchemes');
        this.updateSavedSchemes(savedSchemesContent);
        utils.showToast('已清空所有色彩方案', 'info');
      }
    };
    
    // 事件监听
    generateSchemeBtn.addEventListener('click', generateScheme);
    saveSchemeBtn.addEventListener('click', saveScheme);
    copySchemeBtn.addEventListener('click', copyScheme);
    clearSchemesBtn.addEventListener('click', clearSchemes);
    
    // 初始化已保存的方案
    this.updateSavedSchemes(savedSchemesContent);
  },
  
  // 更新方案预览
  updateSchemePreview: function(previewElement, colors) {
    let html = '';
    
    colors.forEach(color => {
      html += `
        <div class="scheme-color" style="background-color: ${color.hex}">
          <div class="scheme-color-info">
            <div class="scheme-color-hex">${color.hex}</div>
          </div>
        </div>
      `;
    });
    
    previewElement.innerHTML = html;
  },
  
  // 更新方案信息
  updateSchemeInfo: function(infoElement, colors, type) {
    let typeText = '';
    
    switch (type) {
      case 'monochromatic': typeText = '单色方案'; break;
      case 'analogous': typeText = '类似色方案'; break;
      case 'complementary': typeText = '互补色方案'; break;
      case 'triadic': typeText = '三色方案'; break;
      case 'tetradic': typeText = '四色方案'; break;
      case 'split-complementary': typeText = '分离互补色方案'; break;
      case 'shades': typeText = '色调方案'; break;
    }
    
    let html = `
      <div class="scheme-info-item">
        <div class="scheme-info-label">方案类型</div>
        <div class="scheme-info-value">${typeText}</div>
      </div>
      <div class="scheme-info-item">
        <div class="scheme-info-label">颜色数量</div>
        <div class="scheme-info-value">${colors.length}</div>
      </div>
      <div class="scheme-info-colors">
    `;
    
    colors.forEach(color => {
      html += `
        <div class="scheme-info-color">
          <div class="scheme-info-color-preview" style="background-color: ${color.hex}"></div>
          <div class="scheme-info-color-values">
            <div>${color.hex}</div>
            <div>rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})</div>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    
    infoElement.innerHTML = html;
  },
  
  // 更新已保存的方案
  updateSavedSchemes: function(savedSchemesElement) {
    const savedSchemes = JSON.parse(localStorage.getItem('colorSchemes') || '[]');
    
    if (savedSchemes.length === 0) {
      savedSchemesElement.innerHTML = '<div class="no-schemes">暂无保存的色彩方案</div>';
      return;
    }
    
    let html = '';
    
    savedSchemes.forEach((scheme, index) => {
      let typeText = '';
      
      switch (scheme.type) {
        case 'monochromatic': typeText = '单色方案'; break;
        case 'analogous': typeText = '类似色方案'; break;
        case 'complementary': typeText = '互补色方案'; break;
        case 'triadic': typeText = '三色方案'; break;
        case 'tetradic': typeText = '四色方案'; break;
        case 'split-complementary': typeText = '分离互补色方案'; break;
        case 'shades': typeText = '色调方案'; break;
      }
      
      html += `
        <div class="saved-scheme">
          <div class="saved-scheme-header">
            <div class="saved-scheme-title">${typeText}</div>
            <div class="saved-scheme-actions">
              <button class="btn btn-icon btn-sm load-scheme" data-index="${index}" title="加载"><i class="fa fa-arrow-up"></i></button>
              <button class="btn btn-icon btn-sm remove-scheme" data-index="${index}" title="删除"><i class="fa fa-times"></i></button>
            </div>
          </div>
          <div class="saved-scheme-colors">
      `;
      
      scheme.colors.forEach(color => {
        html += `<div class="saved-scheme-color" style="background-color: ${color.hex}"></div>`;
      });
      
      html += `
          </div>
        </div>
      `;
    });
    
    savedSchemesElement.innerHTML = html;
    
    // 添加事件监听
    savedSchemesElement.querySelectorAll('.load-scheme').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        const scheme = savedSchemes[index];
        
        // 保存到会话存储
        sessionStorage.setItem('currentScheme', JSON.stringify(scheme));
        
        // 更新预览和信息
        const schemesPreview = document.querySelector('#schemes-preview');
        const schemesInfoContent = document.querySelector('#schemes-info-content');
        
        this.updateSchemePreview(schemesPreview, scheme.colors);
        this.updateSchemeInfo(schemesInfoContent, scheme.colors, scheme.type);
        
        utils.showToast('已加载色彩方案', 'success');
      });
    });
    
    savedSchemesElement.querySelectorAll('.remove-scheme').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        
        // 移除方案
        savedSchemes.splice(index, 1);
        
        // 保存
        localStorage.setItem('colorSchemes', JSON.stringify(savedSchemes));
        
        // 更新显示
        this.updateSavedSchemes(savedSchemesElement);
        
        utils.showToast('已删除色彩方案', 'info');
      });
    });
  },
  
  // 生成单色方案
  generateMonochromaticScheme: function(hsl, count) {
    const colors = [];
    const step = 100 / (count - 1);
    
    for (let i = 0; i < count; i++) {
      const l = Math.min(90, Math.max(10, i * step));
      const rgb = utils.hslToRgb(hsl.h, hsl.s, l);
      const hex = utils.rgbToHex(rgb.r, rgb.g, rgb.b);
      
      colors.push({
        hex: hex,
        rgb: rgb
      });
    }
    
    return colors;
  },
  
  // 生成类似色方案
  generateAnalogousScheme: function(hsl, count) {
    const colors = [];
    const hueStep = 30;
    const hueRange = hueStep * (count - 1);
    const startHue = (hsl.h - hueRange / 2 + 360) % 360;
    
    for (let i = 0; i < count; i++) {
      const h = (startHue + i * hueStep) % 360;
      const rgb = utils.hslToRgb(h, hsl.s, hsl.l);
      const hex = utils.rgbToHex(rgb.r, rgb.g, rgb.b);
      
      colors.push({
        hex: hex,
        rgb: rgb
      });
    }
    
    return colors;
  },
  
  // 生成互补色方案
  generateComplementaryScheme: function(hsl, count) {
    const colors = [];
    const complementaryHue = (hsl.h + 180) % 360;
    
    // 在原色和互补色之间插值
    for (let i = 0; i < count; i++) {
      const ratio = i / (count - 1);
      const h = Math.round(hsl.h + ratio * 180) % 360;
      const s = hsl.s;
      const l = hsl.l;
      
      const rgb = utils.hslToRgb(h, s, l);
      const hex = utils.rgbToHex(rgb.r, rgb.g, rgb.b);
      
      colors.push({
        hex: hex,
        rgb: rgb
      });
    }
    
    return colors;
  },
  
  // 生成三色方案
  generateTriadicScheme: function(hsl, count) {
    const colors = [];
    const hue1 = hsl.h;
    const hue2 = (hsl.h + 120) % 360;
    const hue3 = (hsl.h + 240) % 360;
    
    // 在三个颜色之间插值
    const segments = count - 1;
    const segment1 = Math.floor(segments / 2);
    const segment2 = segments - segment1;
    
    // 第一段：从hue1到hue2
    for (let i = 0; i <= segment1; i++) {
      const ratio = i / segment1;
      const h = Math.round(hue1 + ratio * 120) % 360;
      const rgb = utils.hslToRgb(h, hsl.s, hsl.l);
      const hex = utils.rgbToHex(rgb.r, rgb.g, rgb.b);
      
      colors.push({
        hex: hex,
        rgb: rgb
      });
    }
    
    // 第二段：从hue2到hue3
    for (let i = 1; i <= segment2; i++) {
      const ratio = i / segment2;
      const h = Math.round(hue2 + ratio * 120) % 360;
      const rgb = utils.hslToRgb(h, hsl.s, hsl.l);
      const hex = utils.rgbToHex(rgb.r, rgb.g, rgb.b);
      
      colors.push({
        hex: hex,
        rgb: rgb
      });
    }
    
    return colors;
  },
  
  // 生成四色方案
  generateTetradicScheme: function(hsl, count) {
    const colors = [];
    const hue1 = hsl.h;
    const hue2 = (hsl.h + 90) % 360;
    const hue3 = (hsl.h + 180) % 360;
    const hue4 = (hsl.h + 270) % 360;
    
    // 在四个颜色之间插值
    const segments = count - 1;
    const segment1 = Math.floor(segments / 3);
    const segment2 = Math.floor(segments / 3);
    const segment3 = segments - segment1 - segment2;
    
    // 第一段：从hue1到hue2
    for (let i = 0; i <= segment1; i++) {
      const ratio = i / segment1;
      const h = Math.round(hue1 + ratio * 90) % 360;
      const rgb = utils.hslToRgb(h, hsl.s, hsl.l);
      const hex = utils.rgbToHex(rgb.r, rgb.g, rgb.b);
      
      colors.push({
        hex: hex,
        rgb: rgb
      });
    }
    
    // 第二段：从hue2到hue3
    for (let i = 1; i <= segment2; i++) {
      const ratio = i / segment2;
      const h = Math.round(hue2 + ratio * 90) % 360;
      const rgb = utils.hslToRgb(h, hsl.s, hsl.l);
      const hex = utils.rgbToHex(rgb.r, rgb.g, rgb.b);
      
      colors.push({
        hex: hex,
        rgb: rgb
      });
    }
    
    // 第三段：从hue3到hue4
    for (let i = 1; i <= segment3; i++) {
      const ratio = i / segment3;
      const h = Math.round(hue3 + ratio * 90) % 360;
      const rgb = utils.hslToRgb(h, hsl.s, hsl.l);
      const hex = utils.rgbToHex(rgb.r, rgb.g, rgb.b);
      
      colors.push({
        hex: hex,
        rgb: rgb
      });
    }
    
    return colors;
  },
  
  // 生成分离互补色方案
  generateSplitComplementaryScheme: function(hsl, count) {
    const colors = [];
    const hue1 = hsl.h;
    const hue2 = (hsl.h + 150) % 360;
    const hue3 = (hsl.h + 210) % 360;
    
    // 在三个颜色之间插值
    const segments = count - 1;
    const segment1 = Math.floor(segments / 2);
    const segment2 = segments - segment1;
    
    // 第一段：从hue1到hue2
    for (let i = 0; i <= segment1; i++) {
      const ratio = i / segment1;
      const h = Math.round(hue1 + ratio * 150) % 360;
      const rgb = utils.hslToRgb(h, hsl.s, hsl.l);
      const hex = utils.rgbToHex(rgb.r, rgb.g, rgb.b);
      
      colors.push({
        hex: hex,
        rgb: rgb
      });
    }
    
    // 第二段：从hue2到hue3
    for (let i = 1; i <= segment2; i++) {
      const ratio = i / segment2;
      const h = Math.round(hue2 + ratio * 60) % 360;
      const rgb = utils.hslToRgb(h, hsl.s, hsl.l);
      const hex = utils.rgbToHex(rgb.r, rgb.g, rgb.b);
      
      colors.push({
        hex: hex,
        rgb: rgb
      });
    }
    
    return colors;
  },
  
  // 生成色调方案
  generateShadesScheme: function(hsl, count) {
    const colors = [];
    
    for (let i = 0; i < count; i++) {
      const ratio = i / (count - 1);
      const l = Math.max(0, Math.min(100, 100 - ratio * 100));
      
      const rgb = utils.hslToRgb(hsl.h, hsl.s, l);
      const hex = utils.rgbToHex(rgb.r, rgb.g, rgb.b);
      
      colors.push({
        hex: hex,
        rgb: rgb
      });
    }
    
    return colors;
  }
};

module.exports = schemes;