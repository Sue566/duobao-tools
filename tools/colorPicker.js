/**
 * 多宝工具箱 - 颜色选择器
 */
(function() {
  // 定义工具
  const tool = {
    id: 'colorPicker',
    name: '颜色选择器',
    icon: 'fa-eyedropper',
    // 工具配置
    config: {
      // 保存用户设置
      saveSettings: function(settings) {
        try {
          localStorage.setItem('settings_colorPicker', JSON.stringify(settings));
        } catch (e) {
          console.error('保存设置失败', e);
        }
      },
      
      // 加载用户设置
      loadSettings: function() {
        try {
          const settings = localStorage.getItem('settings_colorPicker');
          return settings ? JSON.parse(settings) : null;
        } catch (e) {
          console.error('加载设置失败', e);
          return null;
        }
      }
    },
    
    // 工具初始化时调用
    init: function() {
      // 检查浏览器是否支持屏幕取色API
      if (!window.EyeDropper) {
        console.log('浏览器不支持屏幕取色API');
      }
    },
    
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-eyedropper"></i> 颜色选择器</h2>
          <p class="tool-description">多功能颜色选择工具，支持屏幕取色、颜色格式转换、颜色调整和配色方案生成。</p>
        </div>
        
        <div class="tool-container">
          <!-- 颜色选择区域 -->
          <div class="tool-input-section">
            <div class="color-picker-container">
              <div class="color-preview-container">
                <div id="color-preview" class="color-preview"></div>
                <div class="color-info">
                  <div class="color-value">
                    <span>HEX:</span>
                    <input type="text" id="hex-value" class="color-input" value="#3498db" />
                  </div>
                  <div class="color-value">
                    <span>RGB:</span>
                    <input type="text" id="rgb-value" class="color-input" value="52, 152, 219" />
                  </div>
                  <div class="color-value">
                    <span>HSL:</span>
                    <input type="text" id="hsl-value" class="color-input" value="204, 70%, 53%" />
                  </div>
                </div>
              </div>
              
              <div class="color-controls">
                <div class="control-group">
                  <label>色调 (H)</label>
                  <input type="range" id="hue-slider" min="0" max="360" value="204" class="color-slider hue-slider" />
                </div>
                <div class="control-group">
                  <label>饱和度 (S)</label>
                  <input type="range" id="saturation-slider" min="0" max="100" value="70" class="color-slider" />
                </div>
                <div class="control-group">
                  <label>亮度 (L)</label>
                  <input type="range" id="lightness-slider" min="0" max="100" value="53" class="color-slider" />
                </div>
                <div class="control-group">
                  <label>透明度 (A)</label>
                  <input type="range" id="alpha-slider" min="0" max="100" value="100" class="color-slider" />
                </div>
              </div>
              
              <div class="color-actions">
                <button id="eyedropper-btn" class="btn btn-primary" title="从屏幕上选择颜色">
                  <i class="fa fa-eyedropper"></i> 屏幕取色
                </button>
                <button id="random-color-btn" class="btn" title="生成随机颜色">
                  <i class="fa fa-random"></i> 随机颜色
                </button>
                <button id="copy-color-btn" class="btn" title="复制当前颜色">
                  <i class="fa fa-copy"></i> 复制颜色
                </button>
                <button id="add-to-palette-btn" class="btn" title="添加到调色板">
                  <i class="fa fa-plus"></i> 添加到调色板
                </button>
              </div>
            </div>
            
            <div class="color-palette-container">
              <h3><i class="fa fa-paint-brush"></i> 调色板</h3>
              <div id="color-palette" class="color-palette"></div>
              <div class="palette-actions">
                <button id="clear-palette-btn" class="btn btn-sm btn-outline">
                  <i class="fa fa-trash-o"></i> 清空调色板
                </button>
                <button id="save-palette-btn" class="btn btn-sm btn-outline">
                  <i class="fa fa-save"></i> 保存调色板
                </button>
                <button id="load-palette-btn" class="btn btn-sm btn-outline">
                  <i class="fa fa-folder-open-o"></i> 加载调色板
                </button>
              </div>
            </div>
          </div>
          
          <!-- 颜色方案区域 -->
          <div class="tool-result-section">
            <div class="result-header">
              <h3><i class="fa fa-th"></i> 颜色方案</h3>
              <div class="scheme-type-selector">
                <select id="scheme-type" class="form-control">
                  <option value="monochromatic">单色方案</option>
                  <option value="analogous">类似色方案</option>
                  <option value="complementary">互补色方案</option>
                  <option value="triadic">三色方案</option>
                  <option value="tetradic">四色方案</option>
                  <option value="split-complementary">分离互补色方案</option>
                </select>
              </div>
            </div>
            
            <div id="color-scheme" class="color-scheme"></div>
            
            <div class="scheme-actions">
              <button id="copy-scheme-btn" class="btn btn-sm btn-outline">
                <i class="fa fa-copy"></i> 复制方案
              </button>
              <button id="add-scheme-to-palette-btn" class="btn btn-sm btn-outline">
                <i class="fa fa-plus"></i> 添加到调色板
              </button>
              <button id="export-scheme-btn" class="btn btn-sm btn-outline">
                <i class="fa fa-download"></i> 导出方案
              </button>
            </div>
            
            <div class="color-harmonies">
              <h3><i class="fa fa-magic"></i> 颜色和谐</h3>
              <div id="color-harmonies" class="harmonies-container"></div>
            </div>
          </div>
        </div>
        
        <!-- 工具说明区域 -->
        <div class="tool-info">
          <div class="info-header">
            <h3><i class="fa fa-question-circle"></i> 使用指南</h3>
            <button class="toggle-info-btn" title="展开/收起说明"><i class="fa fa-chevron-up"></i></button>
          </div>
          <div class="info-content">
            <div class="info-item">
              <h4><i class="fa fa-info-circle"></i> 功能介绍</h4>
              <p>颜色选择器是一个多功能颜色工具，可以帮助您选择、调整、转换颜色，并生成和谐的配色方案，适用于设计、开发等各种场景。</p>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-list-ol"></i> 主要功能</h4>
              <ul>
                <li><strong>屏幕取色</strong> - 从屏幕上任意位置选取颜色（需要浏览器支持）</li>
                <li><strong>颜色调整</strong> - 通过滑块精确调整色调、饱和度、亮度和透明度</li>
                <li><strong>格式转换</strong> - 自动在HEX、RGB、HSL等格式之间转换</li>
                <li><strong>调色板</strong> - 保存和管理您喜欢的颜色</li>
                <li><strong>配色方案</strong> - 生成各种类型的和谐配色方案</li>
              </ul>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-lightbulb-o"></i> 使用技巧</h4>
              <ul>
                <li>使用屏幕取色功能可以从网页上任何位置获取颜色</li>
                <li>调整HSL滑块比直接编辑RGB值更直观</li>
                <li>保存您的调色板以便将来使用</li>
                <li>尝试不同的配色方案类型，找到最适合您项目的组合</li>
                <li>点击颜色方案中的颜色可以将其设为当前颜色</li>
              </ul>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-exclamation-triangle"></i> 注意事项</h4>
              <ul>
                <li>屏幕取色功能需要浏览器支持EyeDropper API</li>
                <li>颜色值可以手动输入，支持多种格式（如#RGB、#RRGGBB、rgb()、hsl()等）</li>
                <li>调色板数据保存在本地浏览器中，清除浏览器数据可能会丢失</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('colorPicker', container.querySelector('.tool-header'));
      
      // 获取元素
      const colorPreview = container.querySelector('#color-preview');
      const hexValue = container.querySelector('#hex-value');
      const rgbValue = container.querySelector('#rgb-value');
      const hslValue = container.querySelector('#hsl-value');
      const hueSlider = container.querySelector('#hue-slider');
      const saturationSlider = container.querySelector('#saturation-slider');
      const lightnessSlider = container.querySelector('#lightness-slider');
      const alphaSlider = container.querySelector('#alpha-slider');
      const eyedropperBtn = container.querySelector('#eyedropper-btn');
      const randomColorBtn = container.querySelector('#random-color-btn');
      const copyColorBtn = container.querySelector('#copy-color-btn');
      const addToPaletteBtn = container.querySelector('#add-to-palette-btn');
      const colorPalette = container.querySelector('#color-palette');
      const clearPaletteBtn = container.querySelector('#clear-palette-btn');
      const savePaletteBtn = container.querySelector('#save-palette-btn');
      const loadPaletteBtn = container.querySelector('#load-palette-btn');
      const schemeType = container.querySelector('#scheme-type');
      const colorScheme = container.querySelector('#color-scheme');
      const copySchemeBtn = container.querySelector('#copy-scheme-btn');
      const addSchemeToPaletteBtn = container.querySelector('#add-scheme-to-palette-btn');
      const exportSchemeBtn = container.querySelector('#export-scheme-btn');
      const colorHarmonies = container.querySelector('#color-harmonies');
      const toggleInfoBtn = container.querySelector('.toggle-info-btn');
      
      // 当前颜色状态
      let currentColor = {
        h: 204,
        s: 70,
        l: 53,
        a: 100
      };
      
      // 调色板颜色
      let paletteColors = [];
      
      // 加载保存的调色板
      loadPalette();
      
      // 初始化颜色预览
      updateColorPreview();
      
      // 更新颜色方案
      updateColorScheme();
      
      // 更新颜色和谐
      updateColorHarmonies();
      
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
        updateColorScheme();
        updateColorHarmonies();
        
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
        addColorToPalette(hexToRgb(hexValue.value), hexValue.value);
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
          updatePaletteDisplay();
          savePalette();
          showToast('调色板已清空', 'info');
        }
      });
      
      // 保存调色板按钮点击事件
      savePaletteBtn.addEventListener('click', () => {
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
      });
      
      // 加载调色板按钮点击事件
      loadPaletteBtn.addEventListener('click', () => {
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
            
            paletteColors = [...selectedPalette];
            updatePaletteDisplay();
            savePalette();
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
          addColorToPalette(hexToRgb(hex), hex);
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
        updateColorScheme();
      });
      
      // 色调滑块事件
      hueSlider.addEventListener('input', () => {
        currentColor.h = parseInt(hueSlider.value);
        updateColorPreview();
        updateColorScheme();
        updateColorHarmonies();
      });
      
      // 饱和度滑块事件
      saturationSlider.addEventListener('input', () => {
        currentColor.s = parseInt(saturationSlider.value);
        updateColorPreview();
        updateColorScheme();
        updateColorHarmonies();
      });
      
      // 亮度滑块事件
      lightnessSlider.addEventListener('input', () => {
        currentColor.l = parseInt(lightnessSlider.value);
        updateColorPreview();
        updateColorScheme();
        updateColorHarmonies();
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
              updateColorScheme();
              updateColorHarmonies();
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
              updateColorScheme();
              updateColorHarmonies();
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
      
      // 更新颜色预览
      function updateColorPreview() {
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
      
      // 更新滑块
      function updateSliders() {
        hueSlider.value = currentColor.h;
        saturationSlider.value = currentColor.s;
        lightnessSlider.value = currentColor.l;
        
        updateSliderBackgrounds();
      }
      
      // 更新滑块背景
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
      
      // 从HEX设置颜色
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
        updateColorScheme();
        updateColorHarmonies();
      }
      
      // 规范化HEX值
      function normalizeHex(hex) {
        // 移除#前缀
        hex = hex.replace(/^#/, '');
        
        // 处理简写形式 (例如 #ABC -> #AABBCC)
        if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        
        // 验证HEX格式
        if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
          console.error('无效的HEX颜色值:', hex);
          return null;
        }
        
        return '#' + hex.toUpperCase();
      }
      
      // 获取首选颜色格式
      function getPreferredColorFormat() {
        // 从设置中获取，如果没有则默认为hex
        const settings = tool.config.loadSettings() || {};
        return settings.preferredFormat || 'hex';
      }
      
      // HEX转RGB
      function hexToRgb(hex) {
        // 移除#前缀
        hex = hex.replace(/^#/, '');
        
        // 处理简写形式
        if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
      }
      
      // RGB转HSL
      function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
          h = s = 0; // 灰色
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          
          h /= 6;
        }
        
        return {
          h: Math.round(h * 360),
          s: Math.round(s * 100),
          l: Math.round(l * 100)
        };
      }
      
      // HSL转RGB
      function hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;
        
        if (s === 0) {
          r = g = b = l; // 灰色
        } else {
          const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
          };
          
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
        }
        
        return {
          r: Math.round(r * 255),
          g: Math.round(g * 255),
          b: Math.round(b * 255)
        };
      }
      
      // HSL转HEX
      function hslToHex(h, s, l) {
        const rgb = hslToRgb(h, s, l);
        return rgbToHex(rgb.r, rgb.g, rgb.b);
      }
      
      // RGB转HEX
      function rgbToHex(r, g, b) {
        const toHex = (c) => {
          const hex = c.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
      }
      
      // 验证RGB值
      function isValidRgb(r, g, b) {
        return !isNaN(r) && !isNaN(g) && !isNaN(b) &&
               r >= 0 && r <= 255 &&
               g >= 0 && g <= 255 &&
               b >= 0 && b <= 255;
      }
      
      // 验证HSL值
      function isValidHsl(h, s, l) {
        return !isNaN(h) && !isNaN(s) && !isNaN(l) &&
               h >= 0 && h <= 360 &&
               s >= 0 && s <= 100 &&
               l >= 0 && l <= 100;
      }
      
      // 更新颜色方案
      function updateColorScheme() {
        const type = schemeType.value;
        const h = currentColor.h;
        const s = currentColor.s;
        const l = currentColor.l;
        
        let colors = [];
        
        switch (type) {
          case 'monochromatic':
            // 单色方案：保持色调不变，改变亮度和饱和度
            colors = [
              { h, s, l: Math.max(l - 30, 10) },
              { h, s: Math.min(s + 10, 100), l: Math.max(l - 15, 20) },
              { h, s, l },
              { h, s: Math.max(s - 10, 0), l: Math.min(l + 15, 90) },
              { h, s, l: Math.min(l + 30, 90) }
            ];
            break;
            
          case 'analogous':
            // 类似色方案：相邻色调
            colors = [
              { h: (h - 30 + 360) % 360, s, l },
              { h: (h - 15 + 360) % 360, s, l },
              { h, s, l },
              { h: (h + 15) % 360, s, l },
              { h: (h + 30) % 360, s, l }
            ];
            break;
            
          case 'complementary':
            // 互补色方案：对立色调
            const complementary = (h + 180) % 360;
            colors = [
              { h, s: Math.max(s - 10, 0), l: Math.max(l - 10, 10) },
              { h, s, l },
              { h, s: Math.min(s + 10, 100), l: Math.min(l + 10, 90) },
              { h: complementary, s: Math.max(s - 10, 0), l: Math.max(l - 10, 10) },
              { h: complementary, s, l }
            ];
            break;
            
          case 'triadic':
            // 三色方案：三等分色环
            colors = [
              { h, s, l },
              { h: (h + 120) % 360, s, l },
              { h: (h + 240) % 360, s, l },
              { h: (h + 120) % 360, s: Math.min(s + 10, 100), l: Math.min(l + 10, 90) },
              { h: (h + 240) % 360, s: Math.min(s + 10, 100), l: Math.min(l + 10, 90) }
            ];
            break;
            
          case 'tetradic':
            // 四色方案：四等分色环
            colors = [
              { h, s, l },
              { h: (h + 90) % 360, s, l },
              { h: (h + 180) % 360, s, l },
              { h: (h + 270) % 360, s, l },
              { h: (h + 180) % 360, s: Math.min(s + 10, 100), l: Math.min(l + 10, 90) }
            ];
            break;
            
          case 'split-complementary':
            // 分离互补色方案：互补色的邻近色
            colors = [
              { h, s, l },
              { h: (h + 150) % 360, s, l },
              { h: (h + 210) % 360, s, l },
              { h: (h + 150) % 360, s: Math.min(s + 10, 100), l: Math.min(l + 10, 90) },
              { h: (h + 210) % 360, s: Math.min(s + 10, 100), l: Math.min(l + 10, 90) }
            ];
            break;
        }
        
        // 更新颜色方案显示
        colorScheme.innerHTML = '';
        
        colors.forEach(color => {
          const hex = hslToHex(color.h, color.s, color.l);
          const colorElement = document.createElement('div');
          colorElement.className = 'scheme-color';
          colorElement.style.backgroundColor = hex;
          colorElement.setAttribute('data-color', hex);
          colorElement.setAttribute('title', hex);
          
          // 点击颜色块设置为当前颜色
          colorElement.addEventListener('click', () => {
            setColorFromHex(hex);
            showToast(`已选择颜色: ${hex}`, 'info');
          });
          
          colorScheme.appendChild(colorElement);
        });
      }
      
      // 更新颜色和谐
      function updateColorHarmonies() {
        const h = currentColor.h;
        const s = currentColor.s;
        const l = currentColor.l;
        
        // 定义不同的和谐关系
        const harmonies = [
          { name: '互补色', colors: [{ h, s, l }, { h: (h + 180) % 360, s, l }] },
          { name: '三分色', colors: [{ h, s, l }, { h: (h + 120) % 360, s, l }, { h: (h + 240) % 360, s, l }] },
          { name: '分离互补', colors: [{ h, s, l }, { h: (h + 150) % 360, s, l }, { h: (h + 210) % 360, s, l }] },
          { name: '类似色', colors: [{ h: (h - 30 + 360) % 360, s, l }, { h, s, l }, { h: (h + 30) % 360, s, l }] }
        ];
        
        // 更新和谐显示
        colorHarmonies.innerHTML = '';
        
        harmonies.forEach(harmony => {
          const harmonyContainer = document.createElement('div');
          harmonyContainer.className = 'harmony-item';
          
          const harmonyTitle = document.createElement('div');
          harmonyTitle.className = 'harmony-title';
          harmonyTitle.textContent = harmony.name;
          harmonyContainer.appendChild(harmonyTitle);
          
          const harmonyColors = document.createElement('div');
          harmonyColors.className = 'harmony-colors';
          
          harmony.colors.forEach(color => {
            const hex = hslToHex(color.h, color.s, color.l);
            const colorElement = document.createElement('div');
            colorElement.className = 'harmony-color';
            colorElement.style.backgroundColor = hex;
            colorElement.setAttribute('data-color', hex);
            colorElement.setAttribute('title', hex);
            
            // 点击颜色块设置为当前颜色
            colorElement.addEventListener('click', () => {
              setColorFromHex(hex);
              showToast(`已选择颜色: ${hex}`, 'info');
            });
            
            harmonyColors.appendChild(colorElement);
          });
          
          harmonyContainer.appendChild(harmonyColors);
          colorHarmonies.appendChild(harmonyContainer);
        });
      }
      
      // 添加颜色到调色板
      function addColorToPalette(rgb, hex) {
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
        updatePaletteDisplay();
        
        // 保存调色板
        savePalette();
      }
      
      // 更新调色板显示
      function updatePaletteDisplay() {
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
              updatePaletteDisplay();
              savePalette();
              showToast('颜色已从调色板中删除', 'info');
            }
          });
          
          colorPalette.appendChild(colorElement);
        });
      }
      
      // 保存调色板到本地存储
      function savePalette() {
        localStorage.setItem('colorPicker_palette', JSON.stringify(paletteColors));
      }
      
      // 加载调色板
      function loadPalette() {
        try {
          const savedPalette = localStorage.getItem('colorPicker_palette');
          if (savedPalette) {
            paletteColors = JSON.parse(savedPalette);
            updatePaletteDisplay();
          }
        } catch (e) {
          console.error('加载调色板失败:', e);
          paletteColors = [];
        }
      }
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .color-picker-container {
          margin-bottom: 20px;
        }
        
        .color-preview-container {
          display: flex;
          margin-bottom: 15px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .color-preview {
          width: 100px;
          height: 100px;
          background-color: #3498db;
          flex-shrink: 0;
        }
        
        .color-info {
          flex: 1;
          padding: 10px;
          background-color: var(--card-bg);
        }
        
        .color-value {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .color-value:last-child {
          margin-bottom: 0;
        }
        
        .color-value span {
          width: 50px;
          font-weight: bold;
        }
        
        .color-input {
          flex: 1;
          padding: 5px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background-color: var(--input-bg);
          color: var(--text-color);
        }
        
        .color-controls {
          margin-bottom: 15px;
        }
        
        .control-group {
          margin-bottom: 10px;
        }
        
        .control-group label {
          display: block;
          margin-bottom: 5px;
        }
        
        .color-slider {
          width: 100%;
          height: 20px;
          border-radius: 10px;
          -webkit-appearance: none;
          appearance: none;
          outline: none;
          cursor: pointer;
        }
        
        .color-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 2px solid var(--border-color);
          cursor: pointer;
        }
        
        .hue-slider {
          background: linear-gradient(to right, 
            hsl(0, 100%, 50%), 
            hsl(60, 100%, 50%), 
            hsl(120, 100%, 50%), 
            hsl(180, 100%, 50%), 
            hsl(240, 100%, 50%), 
            hsl(300, 100%, 50%), 
            hsl(360, 100%, 50%)
          );
        }
        
        .color-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .color-palette-container {
          margin-bottom: 20px;
        }
        
        .color-palette {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
          gap: 5px;
          margin: 10px 0;
          min-height: 30px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 5px;
          background-color: var(--card-bg);
        }
        
        .palette-color {
          height: 30px;
          border-radius: 4px;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .palette-color:hover {
          transform: scale(1.1);
        }
        
        .empty-palette {
          padding: 10px;
          text-align: center;
          color: var(--text-muted);
        }
        
        .palette-actions {
          display: flex;
          gap: 10px;
        }
        
        .color-scheme {
          display: flex;
          gap: 5px;
          margin: 15px 0;
          min-height: 50px;
        }
        
        .scheme-color {
          flex: 1;
          height: 50px;
          border-radius: 4px;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .scheme-color:hover {
          transform: scale(1.05);
        }
        
        .scheme-actions {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .harmonies-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 10px;
        }
        
        .harmony-item {
          border: 1px solid var(--border-color);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .harmony-title {
          padding: 5px 10px;
          background-color: var(--border-color);
          font-weight: bold;
        }
        
        .harmony-colors {
          display: flex;
          height: 30px;
        }
        
        .harmony-color {
          flex: 1;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .harmony-color:hover {
          transform: scaleY(1.1);
        }
        
        .dialog {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .dialog-content {
          background-color: var(--bg-color);
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }
        
        .dialog-header {
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .dialog-header h3 {
          margin: 0;
        }
        
        .dialog-body {
          padding: 15px;
        }
        
        .dialog-footer {
          padding: 15px;
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        
        .palette-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 10px;
          min-height: 30px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 5px;
        }
        
        .palette-color-preview {
          width: 30px;
          height: 30px;
          border-radius: 4px;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: var(--text-color);
        }
        
        @media (max-width: 768px) {
          .color-preview-container {
            flex-direction: column;
          }
          
          .color-preview {
            width: 100%;
            height: 80px;
          }
          
          .color-actions {
            flex-direction: column;
          }
          
          .color-actions button {
            width: 100%;
          }
        }
      `;
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools = window.tools || {};
  window.tools.colorPicker = tool;
})();
