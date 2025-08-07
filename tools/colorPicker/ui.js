/**
 * 多宝工具箱 - 颜色选择器 (UI模块)
 */

/**
 * 渲染UI界面
 * @param {HTMLElement} container - 容器元素
 */
export function renderUI(container) {
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
  
  // 添加样式
  addStyles(container);
}

/**
 * 初始化UI元素
 * @param {HTMLElement} container - 容器元素
 * @returns {Object} UI元素对象
 */
export function initUI(container) {
  return {
    colorPreview: container.querySelector('#color-preview'),
    hexValue: container.querySelector('#hex-value'),
    rgbValue: container.querySelector('#rgb-value'),
    hslValue: container.querySelector('#hsl-value'),
    hueSlider: container.querySelector('#hue-slider'),
    saturationSlider: container.querySelector('#saturation-slider'),
    lightnessSlider: container.querySelector('#lightness-slider'),
    alphaSlider: container.querySelector('#alpha-slider'),
    eyedropperBtn: container.querySelector('#eyedropper-btn'),
    randomColorBtn: container.querySelector('#random-color-btn'),
    copyColorBtn: container.querySelector('#copy-color-btn'),
    addToPaletteBtn: container.querySelector('#add-to-palette-btn'),
    colorPalette: container.querySelector('#color-palette'),
    clearPaletteBtn: container.querySelector('#clear-palette-btn'),
    savePaletteBtn: container.querySelector('#save-palette-btn'),
    loadPaletteBtn: container.querySelector('#load-palette-btn'),
    schemeType: container.querySelector('#scheme-type'),
    colorScheme: container.querySelector('#color-scheme'),
    copySchemeBtn: container.querySelector('#copy-scheme-btn'),
    addSchemeToPaletteBtn: container.querySelector('#add-scheme-to-palette-btn'),
    exportSchemeBtn: container.querySelector('#export-scheme-btn'),
    colorHarmonies: container.querySelector('#color-harmonies'),
    toggleInfoBtn: container.querySelector('.toggle-info-btn')
  };
}

/**
 * 添加样式
 * @param {HTMLElement} container - 容器元素
 */
function addStyles(container) {
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