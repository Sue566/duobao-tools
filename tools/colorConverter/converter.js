/**
 * 多宝工具箱 - 颜色转换工具 - 转换模块
 */
(function() {
  const converter = {
    // 初始化颜色转换器
    initConverter: function(container) {
      const colorInput = container.querySelector('#color-input');
      const colorPicker = container.querySelector('#color-picker');
      const colorPreview = container.querySelector('#color-preview');
      const convertBtn = container.querySelector('#convert-btn');
      const clearBtn = container.querySelector('#clear-btn');
      const copyAllBtn = container.querySelector('#copy-all-btn');
      const resultContainer = container.querySelector('#conversion-results');
      const historyContainer = container.querySelector('#color-history');
      const clearHistoryBtn = container.querySelector('#clear-history-btn');
      
      // 更新颜色预览
      const updateColorPreview = () => {
        const color = colorInput.value;
        if (window.colorConverter.utils.isValidColor(color)) {
          colorPreview.style.backgroundColor = color;
          colorPicker.value = this.normalizeColor(color);
        }
      };
      
      // 转换颜色
      const convertColor = () => {
        const color = colorInput.value;
        
        if (!window.colorConverter.utils.isValidColor(color)) {
          window.colorConverter.utils.showToast('无效的颜色格式', 'error');
          return;
        }
        
        // 保存到历史记录
        window.colorConverter.utils.saveColorToHistory(color);
        
        // 更新历史记录显示
        this.updateColorHistory(historyContainer);
        
        // 转换颜色
        const result = this.convertToAllFormats(color);
        
        // 显示结果
        this.displayConversionResults(resultContainer, result);
      };
      
      // 清空输入
      const clearInput = () => {
        colorInput.value = '';
        colorPreview.style.backgroundColor = 'transparent';
        resultContainer.innerHTML = '';
      };
      
      // 复制所有结果
      const copyAllResults = () => {
        const color = colorInput.value;
        
        if (!window.colorConverter.utils.isValidColor(color)) {
          window.colorConverter.utils.showToast('无效的颜色格式', 'error');
          return;
        }
        
        const result = this.convertToAllFormats(color);
        let text = '';
        
        for (const format in result) {
          text += `${format.toUpperCase()}: ${result[format]}\n`;
        }
        
        if (window.colorConverter.utils.copyToClipboard(text)) {
          window.colorConverter.utils.showToast('已复制所有颜色格式到剪贴板', 'success');
        } else {
          window.colorConverter.utils.showToast('复制失败', 'error');
        }
      };
      
      // 清空历史记录
      const clearHistory = () => {
        if (window.colorConverter.utils.clearColorHistory()) {
          historyContainer.innerHTML = '<div class="empty-history">暂无历史记录</div>';
          window.colorConverter.utils.showToast('历史记录已清空', 'success');
        } else {
          window.colorConverter.utils.showToast('清空历史记录失败', 'error');
        }
      };
      
      // 事件监听
      colorInput.addEventListener('input', updateColorPreview);
      colorPicker.addEventListener('input', () => {
        colorInput.value = colorPicker.value;
        updateColorPreview();
      });
      
      convertBtn.addEventListener('click', convertColor);
      clearBtn.addEventListener('click', clearInput);
      copyAllBtn.addEventListener('click', copyAllResults);
      clearHistoryBtn.addEventListener('click', clearHistory);
      
      // 初始化
      updateColorPreview();
      this.updateColorHistory(historyContainer);
      
      // 如果有初始颜色，则自动转换
      if (colorInput.value) {
        convertColor();
      }
    },
    
    // 更新颜色历史记录显示
    updateColorHistory: function(container) {
      const history = window.colorConverter.utils.getColorHistory();
      
      if (history.length === 0) {
        container.innerHTML = '<div class="empty-history">暂无历史记录</div>';
        return;
      }
      
      let html = '';
      
      history.forEach(color => {
        html += `
          <div class="history-item" data-color="${color}">
            <div class="history-color" style="background-color: ${color}"></div>
            <div class="history-value">${color}</div>
          </div>
        `;
      });
      
      container.innerHTML = html;
      
      // 添加点击事件
      const historyItems = container.querySelectorAll('.history-item');
      historyItems.forEach(item => {
        item.addEventListener('click', () => {
          const color = item.dataset.color;
          const colorInput = document.querySelector('#color-input');
          colorInput.value = color;
          colorInput.dispatchEvent(new Event('input'));
          
          // 触发转换
          document.querySelector('#convert-btn').click();
        });
      });
    },
    
    // 将颜色转换为所有格式
    convertToAllFormats: function(color) {
      // 创建临时元素来获取计算后的颜色值
      const tempElement = document.createElement('div');
      tempElement.style.color = color;
      document.body.appendChild(tempElement);
      
      // 获取计算后的颜色
      const computedColor = getComputedStyle(tempElement).color;
      document.body.removeChild(tempElement);
      
      // 解析RGB值
      const match = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      
      if (!match) {
        return {
          error: '无法解析颜色'
        };
      }
      
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      
      // 转换为各种格式
      const hex = window.colorConverter.utils.rgbToHex(r, g, b);
      const hsl = window.colorConverter.utils.rgbToHsl(r, g, b);
      const hsv = window.colorConverter.utils.rgbToHsv(r, g, b);
      const cmyk = window.colorConverter.utils.rgbToCmyk(r, g, b);
      const lab = window.colorConverter.utils.rgbToLab(r, g, b);
      
      return {
        hex: hex,
        rgb: `rgb(${r}, ${g}, ${b})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
        cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
        lab: `lab(${lab.l}, ${lab.a}, ${lab.b})`,
        
        // 单独的值
        r: r,
        g: g,
        b: b,
        h: hsl.h,
        s: hsl.s,
        l: hsl.l,
        h_hsv: hsv.h,
        s_hsv: hsv.s,
        v: hsv.v,
        c: cmyk.c,
        m: cmyk.m,
        y: cmyk.y,
        k: cmyk.k,
        l_lab: lab.l,
        a: lab.a,
        b_lab: lab.b
      };
    },
    
    // 显示转换结果
    displayConversionResults: function(container, result) {
      if (result.error) {
        container.innerHTML = `<div class="error">${result.error}</div>`;
        return;
      }
      
      let html = `
        <div class="result-group">
          <div class="result-item">
            <div class="result-label">HEX</div>
            <div class="result-value">${result.hex}</div>
            <button class="copy-btn" data-value="${result.hex}">复制</button>
          </div>
          
          <div class="result-item">
            <div class="result-label">RGB</div>
            <div class="result-value">${result.rgb}</div>
            <button class="copy-btn" data-value="${result.rgb}">复制</button>
          </div>
          
          <div class="result-item">
            <div class="result-label">HSL</div>
            <div class="result-value">${result.hsl}</div>
            <button class="copy-btn" data-value="${result.hsl}">复制</button>
          </div>
          
          <div class="result-item">
            <div class="result-label">HSV</div>
            <div class="result-value">${result.hsv}</div>
            <button class="copy-btn" data-value="${result.hsv}">复制</button>
          </div>
          
          <div class="result-item">
            <div class="result-label">CMYK</div>
            <div class="result-value">${result.cmyk}</div>
            <button class="copy-btn" data-value="${result.cmyk}">复制</button>
          </div>
          
          <div class="result-item">
            <div class="result-label">LAB</div>
            <div class="result-value">${result.lab}</div>
            <button class="copy-btn" data-value="${result.lab}">复制</button>
          </div>
        </div>
        
        <div class="result-group">
          <div class="result-header">RGB 分量</div>
          <div class="result-components">
            <div class="component">
              <div class="component-label">R</div>
              <div class="component-value">${result.r}</div>
            </div>
            
            <div class="component">
              <div class="component-label">G</div>
              <div class="component-value">${result.g}</div>
            </div>
            
            <div class="component">
              <div class="component-label">B</div>
              <div class="component-value">${result.b}</div>
            </div>
          </div>
        </div>
        
        <div class="result-group">
          <div class="result-header">HSL 分量</div>
          <div class="result-components">
            <div class="component">
              <div class="component-label">H</div>
              <div class="component-value">${result.h}°</div>
            </div>
            
            <div class="component">
              <div class="component-label">S</div>
              <div class="component-value">${result.s}%</div>
            </div>
            
            <div class="component">
              <div class="component-label">L</div>
              <div class="component-value">${result.l}%</div>
            </div>
          </div>
        </div>
        
        <div class="result-group">
          <div class="result-header">HSV 分量</div>
          <div class="result-components">
            <div class="component">
              <div class="component-label">H</div>
              <div class="component-value">${result.h_hsv}°</div>
            </div>
            
            <div class="component">
              <div class="component-label">S</div>
              <div class="component-value">${result.s_hsv}%</div>
            </div>
            
            <div class="component">
              <div class="component-label">V</div>
              <div class="component-value">${result.v}%</div>
            </div>
          </div>
        </div>
        
        <div class="result-group">
          <div class="result-header">CMYK 分量</div>
          <div class="result-components">
            <div class="component">
              <div class="component-label">C</div>
              <div class="component-value">${result.c}%</div>
            </div>
            
            <div class="component">
              <div class="component-label">M</div>
              <div class="component-value">${result.m}%</div>
            </div>
            
            <div class="component">
              <div class="component-label">Y</div>
              <div class="component-value">${result.y}%</div>
            </div>
            
            <div class="component">
              <div class="component-label">K</div>
              <div class="component-value">${result.k}%</div>
            </div>
          </div>
        </div>
        
        <div class="result-group">
          <div class="result-header">LAB 分量</div>
          <div class="result-components">
            <div class="component">
              <div class="component-label">L</div>
              <div class="component-value">${result.l_lab}</div>
            </div>
            
            <div class="component">
              <div class="component-label">a</div>
              <div class="component-value">${result.a}</div>
            </div>
            
            <div class="component">
              <div class="component-label">b</div>
              <div class="component-value">${result.b_lab}</div>
            </div>
          </div>
        </div>
      `;
      
      container.innerHTML = html;
      
      // 添加复制按钮事件
      const copyBtns = container.querySelectorAll('.copy-btn');
      copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const value = btn.dataset.value;
          
          if (window.colorConverter.utils.copyToClipboard(value)) {
            window.colorConverter.utils.showToast('已复制到剪贴板', 'success');
          } else {
            window.colorConverter.utils.showToast('复制失败', 'error');
          }
        });
      });
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
  
  // 将转换器添加到全局命名空间
  window.colorConverter.converter = converter;
})();
