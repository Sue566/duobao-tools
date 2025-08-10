/**
 * 多宝工具箱 - 颜色转换工具 - 配色方案模块
 */
(function() {
  const schemes = {
    // 初始化配色方案
    initSchemes: function(container) {
      const schemeColorInput = container.querySelector('#scheme-color-input');
      const schemeColorPicker = container.querySelector('#scheme-color-picker');
      const schemeColorPreview = container.querySelector('#scheme-color-preview');
      const generateSchemeBtn = container.querySelector('#generate-scheme');
      const schemeType = container.querySelector('#scheme-type');
      const schemeResult = container.querySelector('#scheme-result');
      const copySchemeBtn = container.querySelector('#copy-scheme');
      const downloadSchemeBtn = container.querySelector('#download-scheme');
      
      // 更新基础颜色预览
      const updateSchemeColorPreview = () => {
        const color = schemeColorInput.value;
        if (window.colorConverter.utils.isValidColor(color)) {
          schemeColorPreview.style.backgroundColor = color;
          schemeColorPicker.value = this.normalizeColor(color);
        }
      };
      
      // 生成配色方案
      const generateScheme = () => {
        const baseColor = schemeColorInput.value;
        
        if (!window.colorConverter.utils.isValidColor(baseColor)) {
          window.colorConverter.utils.showToast('无效的颜色格式', 'error');
          return;
        }
        
        const type = schemeType.value;
        
        // 生成配色方案
        const colors = this.generateColorScheme(baseColor, type);
        
        // 显示结果
        this.displayScheme(schemeResult, colors, type);
      };
      
      // 复制配色方案
      const copyScheme = () => {
        const colors = this.getGeneratedSchemeColors();
        
        if (colors.length === 0) {
          window.colorConverter.utils.showToast('请先生成配色方案', 'warning');
          return;
        }
        
        let text = '';
        
        // 根据类型选择复制格式
        const format = document.querySelector('input[name="scheme-format"]:checked').value;
        
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
          window.colorConverter.utils.showToast('已复制配色方案到剪贴板', 'success');
        } else {
          window.colorConverter.utils.showToast('复制失败', 'error');
        }
      };
      
      // 下载配色方案
      const downloadScheme = () => {
        const colors = this.getGeneratedSchemeColors();
        
        if (colors.length === 0) {
          window.colorConverter.utils.showToast('请先生成配色方案', 'warning');
          return;
        }
        
        // 创建SVG配色方案
        const svg = this.createSchemeSVG(colors);
        
        // 创建下载链接
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'color-scheme.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
      
      // 事件监听
      schemeColorInput.addEventListener('input', updateSchemeColorPreview);
      schemeColorPicker.addEventListener('input', () => {
        schemeColorInput.value = schemeColorPicker.value;
        updateSchemeColorPreview();
      });
      
      generateSchemeBtn.addEventListener('click', generateScheme);
      copySchemeBtn.addEventListener('click', copyScheme);
      downloadSchemeBtn.addEventListener('click', downloadScheme);
      
      // 初始化
      updateSchemeColorPreview();
      
      // 如果有初始颜色，则自动生成配色方案
      if (schemeColorInput.value) {
        generateScheme();
      }
    },
    
    // 生成颜色配色方案
    generateColorScheme: function(baseColor, type) {
      // 解析基础颜色
      const rgb = this.parseColor(baseColor);
      if (!rgb) return [];
      
      const { r, g, b } = rgb;
      
      // 转换为HSL
      const hsl = window.colorConverter.utils.rgbToHsl(r, g, b);
      const { h, s, l } = hsl;
      
      const colors = [];
      
      switch (type) {
        case 'complementary':
          // 互补色
          colors.push(this.createColorObject(r, g, b)); // 原色
          
          // 互补色 (色相相差180度)
          const compH = (h + 180) % 360;
          const compRgb = window.colorConverter.utils.hslToRgb(compH, s, l);
          colors.push(this.createColorObject(compRgb.r, compRgb.g, compRgb.b));
          break;
          
        case 'analogous':
          // 类似色 (相邻色相)
          colors.push(this.createColorObject(r, g, b)); // 原色
          
          // 左侧色相 (-30度)
          const leftH = (h - 30 + 360) % 360;
          const leftRgb = window.colorConverter.utils.hslToRgb(leftH, s, l);
          colors.push(this.createColorObject(leftRgb.r, leftRgb.g, leftRgb.b));
          
          // 右侧色相 (+30度)
          const rightH = (h + 30) % 360;
          const rightRgb = window.colorConverter.utils.hslToRgb(rightH, s, l);
          colors.push(this.createColorObject(rightRgb.r, rightRgb.g, rightRgb.b));
          break;
          
        case 'triadic':
          // 三色配色 (色相相差120度)
          colors.push(this.createColorObject(r, g, b)); // 原色
          
          // 第二个色相 (+120度)
          const tri1H = (h + 120) % 360;
          const tri1Rgb = window.colorConverter.utils.hslToRgb(tri1H, s, l);
          colors.push(this.createColorObject(tri1Rgb.r, tri1Rgb.g, tri1Rgb.b));
          
          // 第三个色相 (+240度)
          const tri2H = (h + 240) % 360;
          const tri2Rgb = window.colorConverter.utils.hslToRgb(tri2H, s, l);
          colors.push(this.createColorObject(tri2Rgb.r, tri2Rgb.g, tri2Rgb.b));
          break;
          
        case 'tetradic':
          // 四色配色 (矩形)
          colors.push(this.createColorObject(r, g, b)); // 原色
          
          // 第二个色相 (+90度)
          const tetra1H = (h + 90) % 360;
          const tetra1Rgb = window.colorConverter.utils.hslToRgb(tetra1H, s, l);
          colors.push(this.createColorObject(tetra1Rgb.r, tetra1Rgb.g, tetra1Rgb.b));
          
          // 第三个色相 (+180度)
          const tetra2H = (h + 180) % 360;
          const tetra2Rgb = window.colorConverter.utils.hslToRgb(tetra2H, s, l);
          colors.push(this.createColorObject(tetra2Rgb.r, tetra2Rgb.g, tetra2Rgb.b));
          
          // 第四个色相 (+270度)
          const tetra3H = (h + 270) % 360;
          const tetra3Rgb = window.colorConverter.utils.hslToRgb(tetra3H, s, l);
          colors.push(this.createColorObject(tetra3Rgb.r, tetra3Rgb.g, tetra3Rgb.b));
          break;
          
        case 'split-complementary':
          // 分裂互补色
          colors.push(this.createColorObject(r, g, b)); // 原色
          
          // 互补色左侧 (+150度)
          const splitLeft = (h + 150) % 360;
          const splitLeftRgb = window.colorConverter.utils.hslToRgb(splitLeft, s, l);
          colors.push(this.createColorObject(splitLeftRgb.r, splitLeftRgb.g, splitLeftRgb.b));
          
          // 互补色右侧 (+210度)
          const splitRight = (h + 210) % 360;
          const splitRightRgb = window.colorConverter.utils.hslToRgb(splitRight, s, l);
          colors.push(this.createColorObject(splitRightRgb.r, splitRightRgb.g, splitRightRgb.b));
          break;
          
        case 'monochromatic':
          // 单色配色 (改变亮度和饱和度)
          colors.push(this.createColorObject(r, g, b)); // 原色
          
          // 较亮版本
          const lightRgb = window.colorConverter.utils.hslToRgb(h, Math.max(0, s - 20), Math.min(100, l + 20));
          colors.push(this.createColorObject(lightRgb.r, lightRgb.g, lightRgb.b));
          
          // 较暗版本
          const darkRgb = window.colorConverter.utils.hslToRgb(h, Math.min(100, s + 10), Math.max(0, l - 20));
          colors.push(this.createColorObject(darkRgb.r, darkRgb.g, darkRgb.b));
          
          // 高饱和度版本
          const satRgb = window.colorConverter.utils.hslToRgb(h, Math.min(100, s + 20), l);
          colors.push(this.createColorObject(satRgb.r, satRgb.g, satRgb.b));
          
          // 低饱和度版本
          const desatRgb = window.colorConverter.utils.hslToRgb(h, Math.max(0, s - 40), l);
          colors.push(this.createColorObject(desatRgb.r, desatRgb.g, desatRgb.b));
          break;
          
        case 'square':
          // 正方形配色 (色相相差90度)
          colors.push(this.createColorObject(r, g, b)); // 原色
          
          // 第二个色相 (+90度)
          const sq1H = (h + 90) % 360;
          const sq1Rgb = window.colorConverter.utils.hslToRgb(sq1H, s, l);
          colors.push(this.createColorObject(sq1Rgb.r, sq1Rgb.g, sq1Rgb.b));
          
          // 第三个色相 (+180度)
          const sq2H = (h + 180) % 360;
          const sq2Rgb = window.colorConverter.utils.hslToRgb(sq2H, s, l);
          colors.push(this.createColorObject(sq2Rgb.r, sq2Rgb.g, sq2Rgb.b));
          
          // 第四个色相 (+270度)
          const sq3H = (h + 270) % 360;
          const sq3Rgb = window.colorConverter.utils.hslToRgb(sq3H, s, l);
          colors.push(this.createColorObject(sq3Rgb.r, sq3Rgb.g, sq3Rgb.b));
          break;
          
        case 'compound':
          // 复合配色
          colors.push(this.createColorObject(r, g, b)); // 原色
          
          // 类似色 (+30度)
          const compoundH1 = (h + 30) % 360;
          const compoundRgb1 = window.colorConverter.utils.hslToRgb(compoundH1, s, l);
          colors.push(this.createColorObject(compoundRgb1.r, compoundRgb1.g, compoundRgb1.b));
          
          // 类似色 (-30度)
          const compoundH2 = (h - 30 + 360) % 360;
          const compoundRgb2 = window.colorConverter.utils.hslToRgb(compoundH2, s, l);
          colors.push(this.createColorObject(compoundRgb2.r, compoundRgb2.g, compoundRgb2.b));
          
          // 互补色 (+180度)
          const compoundH3 = (h + 180) % 360;
          const compoundRgb3 = window.colorConverter.utils.hslToRgb(compoundH3, s, l);
          colors.push(this.createColorObject(compoundRgb3.r, compoundRgb3.g, compoundRgb3.b));
          break;
          
        case 'shades':
          // 阴影配色 (只改变亮度)
          for (let i = 0; i < 5; i++) {
            const newL = Math.max(0, Math.min(100, l - 40 + (i * 20)));
            const shadeRgb = window.colorConverter.utils.hslToRgb(h, s, newL);
            colors.push(this.createColorObject(shadeRgb.r, shadeRgb.g, shadeRgb.b));
          }
          break;
      }
      
      return colors;
    },
    
    // 显示配色方案
    displayScheme: function(container, colors, type) {
      let html = `
        <div class="scheme-info">
          <h3>${this.getSchemeTitle(type)}</h3>
          <p>${this.getSchemeDescription(type)}</p>
        </div>
        <div class="scheme-colors">
      `;
      
      colors.forEach(color => {
        html += `
          <div class="scheme-color" data-color="${color.hex}">
            <div class="color-preview" style="background-color: ${color.hex}"></div>
            <div class="color-info">
              <div class="color-hex">${color.hex}</div>
              <div class="color-rgb">${color.rgb}</div>
            </div>
          </div>
        `;
      });
      
      html += '</div>';
      
      // 添加使用示例
      html += `
        <div class="scheme-example">
          <h4>配色方案示例</h4>
          <div class="example-container" style="background-color: ${colors[0].hex}">
            <div class="example-header" style="background-color: ${colors.length > 1 ? colors[1].hex : colors[0].hex}">
              <div class="example-title" style="color: ${this.getContrastColor(colors.length > 1 ? colors[1].hex : colors[0].hex)}">示例标题</div>
            </div>
            <div class="example-content">
              <div class="example-sidebar" style="background-color: ${colors.length > 2 ? colors[2].hex : colors[0].hex}">
                <div class="example-menu-item" style="color: ${this.getContrastColor(colors.length > 2 ? colors[2].hex : colors[0].hex)}">菜单项 1</div>
                <div class="example-menu-item active" style="background-color: ${colors.length > 3 ? colors[3].hex : colors[0].hex}; color: ${this.getContrastColor(colors.length > 3 ? colors[3].hex : colors[0].hex)}">菜单项 2</div>
                <div class="example-menu-item" style="color: ${this.getContrastColor(colors.length > 2 ? colors[2].hex : colors[0].hex)}">菜单项 3</div>
              </div>
              <div class="example-main" style="color: ${this.getContrastColor(colors[0].hex)}">
                <p>这是一个使用该配色方案的示例界面。</p>
                <button style="background-color: ${colors.length > 1 ? colors[1].hex : colors[0].hex}; color: ${this.getContrastColor(colors.length > 1 ? colors[1].hex : colors[0].hex)}">示例按钮</button>
              </div>
            </div>
            <div class="example-footer" style="background-color: ${colors.length > 2 ? colors[2].hex : colors[0].hex}; color: ${this.getContrastColor(colors.length > 2 ? colors[2].hex : colors[0].hex)}">
              示例页脚
            </div>
          </div>
        </div>
      `;
      
      container.innerHTML = html;
      
      // 添加点击事件
      const colorElements = container.querySelectorAll('.scheme-color');
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
    
    // 获取配色方案标题
    getSchemeTitle: function(type) {
      const titles = {
        'complementary': '互补色配色方案',
        'analogous': '类似色配色方案',
        'triadic': '三色配色方案',
        'tetradic': '四色配色方案',
        'split-complementary': '分裂互补色配色方案',
        'monochromatic': '单色配色方案',
        'square': '正方形配色方案',
        'compound': '复合配色方案',
        'shades': '阴影配色方案'
      };
      
      return titles[type] || '配色方案';
    },
    
    // 获取配色方案描述
    getSchemeDescription: function(type) {
      const descriptions = {
        'complementary': '互补色配色方案使用色环上相对的两种颜色，形成高对比度的组合。适合需要强烈视觉冲击的设计。',
        'analogous': '类似色配色方案使用色环上相邻的颜色，形成和谐统一的视觉效果。适合需要平静、舒适感觉的设计。',
        'triadic': '三色配色方案使用色环上等距离的三种颜色，形成平衡而又丰富的色彩组合。适合活泼、多样化的设计。',
        'tetradic': '四色配色方案使用色环上形成矩形的四种颜色，提供丰富的色彩变化。适合复杂、多元素的设计。',
        'split-complementary': '分裂互补色配色方案使用一个基础色和其互补色两侧的颜色，提供高对比度但比互补色更丰富的变化。',
        'monochromatic': '单色配色方案使用同一色相的不同亮度和饱和度变化，形成简洁、统一的视觉效果。适合简约、专业的设计。',
        'square': '正方形配色方案使用色环上等距离的四种颜色，形成平衡而丰富的组合。适合需要多样性的设计。',
        'compound': '复合配色方案结合了类似色和互补色的特点，既有和谐感又有一定的对比度。适合平衡和谐与活力的设计。',
        'shades': '阴影配色方案使用同一色相的不同亮度变化，形成深浅层次感。适合需要层次感和深度的设计。'
      };
      
      return descriptions[type] || '自定义配色方案';
    },
    
    // 获取生成的配色方案颜色
    getGeneratedSchemeColors: function() {
      const colorElements = document.querySelectorAll('.scheme-color');
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
    
    // 创建配色方案SVG
    createSchemeSVG: function(colors) {
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
    
    // 获取对比色 (黑色或白色，取决于背景色的亮度)
    getContrastColor: function(color) {
      const rgb = this.parseColor(color);
      if (!rgb) return '#000000';
      
      const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
      return brightness > 128 ? '#000000' : '#FFFFFF';
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
  
  // 将配色方案添加到全局命名空间
  window.colorConverter.schemes = schemes;
})();