/**
 * 多宝工具箱 - 颜色转换工具 - 调色板模块
 */
(function() {
  const palette = {
    // 初始化调色板
    initPalette: function(container) {
      const baseColorInput = container.querySelector('#base-color-input');
      const baseColorPicker = container.querySelector('#base-color-picker');
      const baseColorPreview = container.querySelector('#base-color-preview');
      const generatePaletteBtn = container.querySelector('#generate-palette');
      const paletteType = container.querySelector('#palette-type');
      const paletteCount = container.querySelector('#palette-count');
      const paletteResult = container.querySelector('#palette-result');
      const copyPaletteBtn = container.querySelector('#copy-palette');
      const downloadPaletteBtn = container.querySelector('#download-palette');
      
      // 更新基础颜色预览
      const updateBaseColorPreview = () => {
        const color = baseColorInput.value;
        if (window.colorConverter.utils.isValidColor(color)) {
          baseColorPreview.style.backgroundColor = color;
          baseColorPicker.value = this.normalizeColor(color);
        }
      };
      
      // 生成调色板
      const generatePalette = () => {
        const baseColor = baseColorInput.value;
        
        if (!window.colorConverter.utils.isValidColor(baseColor)) {
          window.colorConverter.utils.showToast('无效的颜色格式', 'error');
          return;
        }
        
        const type = paletteType.value;
        const count = parseInt(paletteCount.value);
        
        // 生成调色板
        const colors = this.generateColorPalette(baseColor, type, count);
        
        // 显示结果
        this.displayPalette(paletteResult, colors);
      };
      
      // 复制调色板
      const copyPalette = () => {
        const colors = this.getGeneratedColors();
        
        if (colors.length === 0) {
          window.colorConverter.utils.showToast('请先生成调色板', 'warning');
          return;
        }
        
        let text = '';
        
        // 根据类型选择复制格式
        const format = document.querySelector('input[name="palette-format"]:checked').value;
        
        switch (format) {
          case 'hex':
            text = colors.map(color => color.hex).join('\n');
            break;
          case 'rgb':
            text = colors.map(color => color.rgb).join('\n');
            break;
          case 'hsl':
            text = colors.map(color => color.hsl).join('\n');
            break;
          case 'css-vars':
            text = colors.map((color, index) => `--color-${index + 1}: ${color.hex};`).join('\n');
            break;
          case 'sass-vars':
            text = colors.map((color, index) => `$color-${index + 1}: ${color.hex};`).join('\n');
            break;
          case 'json':
            text = JSON.stringify(colors.map(color => color.hex), null, 2);
            break;
        }
        
        if (window.colorConverter.utils.copyToClipboard(text)) {
          window.colorConverter.utils.showToast('已复制调色板到剪贴板', 'success');
        } else {
          window.colorConverter.utils.showToast('复制失败', 'error');
        }
      };
      
      // 下载调色板
      const downloadPalette = () => {
        const colors = this.getGeneratedColors();
        
        if (colors.length === 0) {
          window.colorConverter.utils.showToast('请先生成调色板', 'warning');
          return;
        }
        
        // 创建SVG调色板
        const svg = this.createPaletteSVG(colors);
        
        // 创建下载链接
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'color-palette.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
      
      // 事件监听
      baseColorInput.addEventListener('input', updateBaseColorPreview);
      baseColorPicker.addEventListener('input', () => {
        baseColorInput.value = baseColorPicker.value;
        updateBaseColorPreview();
      });
      
      generatePaletteBtn.addEventListener('click', generatePalette);
      copyPaletteBtn.addEventListener('click', copyPalette);
      downloadPaletteBtn.addEventListener('click', downloadPalette);
      
      // 初始化
      updateBaseColorPreview();
      
      // 如果有初始颜色，则自动生成调色板
      if (baseColorInput.value) {
        generatePalette();
      }
    },
    
    // 生成颜色调色板
    generateColorPalette: function(baseColor, type, count) {
      // 解析基础颜色
      const rgb = this.parseColor(baseColor);
      if (!rgb) return [];
      
      const { r, g, b } = rgb;
      
      // 转换为HSL
      const hsl = window.colorConverter.utils.rgbToHsl(r, g, b);
      const { h, s, l } = hsl;
      
      const colors = [];
      
      switch (type) {
        case 'monochromatic':
          // 单色调色板 - 改变亮度
          for (let i = 0; i < count; i++) {
            const newL = Math.max(0, Math.min(100, l - 40 + (i * 80 / (count - 1))));
            const newRgb = window.colorConverter.utils.hslToRgb(h, s, newL);
            colors.push(this.createColorObject(newRgb.r, newRgb.g, newRgb.b));
          }
          break;
          
        case 'analogous':
          // 类似色调色板 - 相邻色相
          const hueRange = 60; // 色相范围
          for (let i = 0; i < count; i++) {
            const newH = (h - hueRange / 2 + (i * hueRange / (count - 1))) % 360;
            const newRgb = window.colorConverter.utils.hslToRgb(newH, s, l);
            colors.push(this.createColorObject(newRgb.r, newRgb.g, newRgb.b));
          }
          break;
          
        case 'complementary':
          // 互补色调色板
          const complementaryH = (h + 180) % 360;
          
          if (count === 2) {
            // 只有两种颜色时，直接使用原色和互补色
            colors.push(this.createColorObject(r, g, b));
            
            const compRgb = window.colorConverter.utils.hslToRgb(complementaryH, s, l);
            colors.push(this.createColorObject(compRgb.r, compRgb.g, compRgb.b));
          } else {
            // 多于两种颜色时，在原色和互补色之间插值
            for (let i = 0; i < count; i++) {
              const ratio = i / (count - 1);
              const newH = (h + ratio * 180) % 360;
              const newRgb = window.colorConverter.utils.hslToRgb(newH, s, l);
              colors.push(this.createColorObject(newRgb.r, newRgb.g, newRgb.b));
            }
          }
          break;
          
        case 'triadic':
          // 三色调色板
          for (let i = 0; i < count; i++) {
            const newH = (h + (i * 120)) % 360;
            const newRgb = window.colorConverter.utils.hslToRgb(newH, s, l);
            colors.push(this.createColorObject(newRgb.r, newRgb.g, newRgb.b));
          }
          break;
          
        case 'tetradic':
          // 四色调色板
          for (let i = 0; i < count; i++) {
            const newH = (h + (i * 90)) % 360;
            const newRgb = window.colorConverter.utils.hslToRgb(newH, s, l);
            colors.push(this.createColorObject(newRgb.r, newRgb.g, newRgb.b));
          }
          break;
          
        case 'shades':
          // 阴影调色板 - 改变饱和度和亮度
          for (let i = 0; i < count; i++) {
            const ratio = i / (count - 1);
            const newS = Math.max(0, Math.min(100, s - 30 * ratio));
            const newL = Math.max(0, Math.min(100, l - 50 * ratio));
            const newRgb = window.colorConverter.utils.hslToRgb(h, newS, newL);
            colors.push(this.createColorObject(newRgb.r, newRgb.g, newRgb.b));
          }
          break;
          
        case 'tints':
          // 色调调色板 - 改变饱和度和亮度
          for (let i = 0; i < count; i++) {
            const ratio = i / (count - 1);
            const newS = Math.max(0, Math.min(100, s - 30 * ratio));
            const newL = Math.max(0, Math.min(100, l + (100 - l) * ratio));
            const newRgb = window.colorConverter.utils.hslToRgb(h, newS, newL);
            colors.push(this.createColorObject(newRgb.r, newRgb.g, newRgb.b));
          }
          break;
          
        case 'random':
          // 随机调色板
          colors.push(this.createColorObject(r, g, b)); // 添加基础颜色
          
          for (let i = 1; i < count; i++) {
            const newH = Math.floor(Math.random() * 360);
            const newS = Math.floor(Math.random() * 60) + 40; // 40-100
            const newL = Math.floor(Math.random() * 60) + 20; // 20-80
            const newRgb = window.colorConverter.utils.hslToRgb(newH, newS, newL);
            colors.push(this.createColorObject(newRgb.r, newRgb.g, newRgb.b));
          }
          break;
      }
      
      return colors;
    },
    
    // 显示调色板
    displayPalette: function(container, colors) {
      let html = '<div class="palette-colors">';
      
      colors.forEach(color => {
        html += `
          <div class="palette-color" data-color="${color.hex}">
            <div class="color-preview" style="background-color: ${color.hex}"></div>
            <div class="color-info">
              <div class="color-hex">${color.hex}</div>
              <div class="color-rgb">${color.rgb}</div>
            </div>
          </div>
        `;
      });
      
      html += '</div>';
      
      container.innerHTML = html;
      
      // 添加点击事件
      const colorElements = container.querySelectorAll('.palette-color');
      colorElements.forEach(element => {
        element.addEventListener('click', () => {
          const color = element.dataset.color;
          
          if (window.colorConverter.utils.copyToClipboard(color)) {
            window.colorConverter.utils.showToast(`已复制 ${color} 到剪贴板`, 'success');
          } else {
            window.colorConverter.utils.showToast('复制失败', 'error');
          }
        });
      });
    },
    
    // 获取生成的颜色
    getGeneratedColors: function() {
      const colorElements = document.querySelectorAll('.palette-color');
      const colors = [];
      
      colorElements.forEach(element => {
        const hex = element.dataset.color;
        const rgb = element.querySelector('.color-rgb').textContent;
        const hsl = this.hexToHsl(hex);
        
        colors.push({
          hex: hex,
          rgb: rgb,
          hsl: hsl
        });
      });
      
      return colors;
    },
    
    // 创建调色板SVG
    createPaletteSVG: function(colors) {
      const width = 800;
      const height = 400;
      const colorWidth = width / colors.length;
      
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
      
      // 添加颜色条
      colors.forEach((color, index) => {
        const x = index * colorWidth;
        svg += `<rect x="${x}" y="0" width="${colorWidth}" height="${height * 0.8}" fill="${color.hex}" />`;
      });
      
      // 添加颜色值
      colors.forEach((color, index) => {
        const x = index * colorWidth + colorWidth / 2;
        const y = height * 0.9;
        
        // 计算文本颜色 (黑色或白色，取决于背景色的亮度)
        const rgb = this.parseColor(color.hex);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        const textColor = brightness > 128 ? '#000000' : '#FFFFFF';
        
        svg += `<text x="${x}" y="${y}" font-family="Arial" font-size="14" text-anchor="middle" fill="${textColor}">${color.hex}</text>`;
      });
      
      svg += '</svg>';
      
      return svg;
    },
    
    // 解析颜色
    parseColor: function(color) {
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
      
      return null;
    },
    
    // 创建颜色对象
    createColorObject: function(r, g, b) {
      const hex = window.colorConverter.utils.rgbToHex(r, g, b);
      const rgb = `rgb(${r}, ${g}, ${b})`;
      const hsl = window.colorConverter.utils.rgbToHsl(r, g, b);
      const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      
      return {
        hex: hex,
        rgb: rgb,
        hsl: hslStr
      };
    },
    
    // 将HEX转换为HSL字符串
    hexToHsl: function(hex) {
      const rgb = window.colorConverter.utils.hexToRgb(hex);
      const hsl = window.colorConverter.utils.rgbToHsl(rgb.r, rgb.g, rgb.b);
      return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
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
        return window.colorConverter.utils.rgbToHex(r, g, b);
      }
      
      return '#000000';
    }
  };
  
  // 将调色板添加到全局命名空间
  window.colorConverter.palette = palette;
})();