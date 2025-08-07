/**
 * 多宝工具箱 - 图片对称反转工具 - UI模块
 */
const ui = {
  // 渲染工具界面
  renderUI: function(container) {
    container.innerHTML = `
      <div class="tool-header">
        <h2><i class="fa fa-exchange"></i> 图片对称反转</h2>
        <p class="tool-description">将图片进行水平或垂直对称反转，支持多种图片格式，可调整输出质量和格式。</p>
      </div>
      
      <div class="flip-container">
        <div class="flip-input-section">
          <div class="form-group">
            <label for="image-input">选择图片</label>
            <div class="file-input-container">
              <input type="file" id="image-input" accept="image/*" multiple />
              <label for="image-input" class="file-input-label">
                <i class="fa fa-upload"></i> 选择图片
              </label>
              <span id="file-count">未选择文件</span>
            </div>
            <div class="drag-area" id="drag-area">
              <div class="drag-text">
                <i class="fa fa-cloud-upload"></i>
                <p>拖放图片到此处</p>
                <small>支持多张图片同时处理</small>
              </div>
            </div>
          </div>
          
          <div class="tabs">
            <div class="tab-header">
              <div class="tab active" data-tab="basic">基本设置</div>
              <div class="tab" data-tab="advanced">高级设置</div>
              <div class="tab" data-tab="partial">区域反转</div>
            </div>
            
            <div class="tab-content">
              <!-- 基本设置选项卡 -->
              <div class="tab-pane active" id="basic-tab">
                <div class="form-group">
                  <label>反转方向</label>
                  <div class="options-container">
                    <div class="form-check">
                      <input type="radio" name="flip-direction" id="flip-horizontal" value="horizontal" checked />
                      <label for="flip-horizontal">水平反转 <i class="fa fa-arrows-h"></i></label>
                    </div>
                    <div class="form-check">
                      <input type="radio" name="flip-direction" id="flip-vertical" value="vertical" />
                      <label for="flip-vertical">垂直反转 <i class="fa fa-arrows-v"></i></label>
                    </div>
                    <div class="form-check">
                      <input type="radio" name="flip-direction" id="flip-both" value="both" />
                      <label for="flip-both">水平和垂直反转 <i class="fa fa-arrows-alt"></i></label>
                    </div>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="quality-slider">输出质量</label>
                  <div class="range-with-value">
                    <input type="range" id="quality-slider" min="0" max="100" value="90" />
                    <span id="quality-value">90%</span>
                  </div>
                  <small class="form-text text-muted">仅对JPG和WebP格式有效</small>
                </div>
                
                <div class="form-group">
                  <label>输出格式</label>
                  <div class="format-options">
                    <div class="form-check">
                      <input type="radio" name="output-format" id="format-same" value="same" checked />
                      <label for="format-same">保持原格式</label>
                    </div>
                    <div class="form-check">
                      <input type="radio" name="output-format" id="format-jpg" value="image/jpeg" />
                      <label for="format-jpg">JPG</label>
                    </div>
                    <div class="form-check">
                      <input type="radio" name="output-format" id="format-png" value="image/png" />
                      <label for="format-png">PNG</label>
                    </div>
                    <div class="form-check">
                      <input type="radio" name="output-format" id="format-webp" value="image/webp" />
                      <label for="format-webp">WebP</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 高级设置选项卡 -->
              <div class="tab-pane" id="advanced-tab">
                <div class="form-group">
                  <label for="brightness-slider">亮度调整</label>
                  <div class="range-with-value">
                    <input type="range" id="brightness-slider" min="-100" max="100" value="0" />
                    <span id="brightness-value">0</span>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="contrast-slider">对比度调整</label>
                  <div class="range-with-value">
                    <input type="range" id="contrast-slider" min="-100" max="100" value="0" />
                    <span id="contrast-value">0</span>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="saturation-slider">饱和度调整</label>
                  <div class="range-with-value">
                    <input type="range" id="saturation-slider" min="-100" max="100" value="0" />
                    <span id="saturation-value">0</span>
                  </div>
                </div>
                
                <div class="form-group">
                  <div class="form-check">
                    <input type="checkbox" id="grayscale-option" />
                    <label for="grayscale-option">转换为灰度图</label>
                  </div>
                </div>
              </div>
              
              <!-- 区域反转选项卡 -->
              <div class="tab-pane" id="partial-tab">
                <div class="form-group">
                  <label>区域反转模式</label>
                  <div class="options-container">
                    <div class="form-check">
                      <input type="radio" name="partial-mode" id="mode-disabled" value="disabled" checked />
                      <label for="mode-disabled">不使用区域反转</label>
                    </div>
                    <div class="form-check">
                      <input type="radio" name="partial-mode" id="mode-left" value="left" />
                      <label for="mode-left">仅反转左半部分</label>
                    </div>
                    <div class="form-check">
                      <input type="radio" name="partial-mode" id="mode-right" value="right" />
                      <label for="mode-right">仅反转右半部分</label>
                    </div>
                    <div class="form-check">
                      <input type="radio" name="partial-mode" id="mode-top" value="top" />
                      <label for="mode-top">仅反转上半部分</label>
                    </div>
                    <div class="form-check">
                      <input type="radio" name="partial-mode" id="mode-bottom" value="bottom" />
                      <label for="mode-bottom">仅反转下半部分</label>
                    </div>
                    <div class="form-check">
                      <input type="radio" name="partial-mode" id="mode-custom" value="custom" />
                      <label for="mode-custom">自定义区域</label>
                    </div>
                  </div>
                </div>
                
                <div id="custom-area-controls" style="display: none;">
                  <p>上传图片后，可在预览区域拖动选择要反转的区域</p>
                  <div class="form-group">
                    <button id="reset-area-btn" class="btn btn-sm"><i class="fa fa-refresh"></i> 重置选区</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="preview-section" id="preview-section" style="display: none;">
            <h4>实时预览</h4>
            <div class="preview-container" id="preview-container"></div>
            <small class="form-text text-muted">调整选项可实时查看效果</small>
          </div>
          
          <div class="flip-actions">
            <button id="flip-btn" class="btn btn-primary" disabled><i class="fa fa-exchange"></i> 反转图片</button>
            <button id="clear-btn" class="btn btn-secondary" disabled><i class="fa fa-trash-o"></i> 清空</button>
          </div>
        </div>
        
        <div class="flip-result-section">
          <div class="result-header">
            <h3>反转结果</h3>
            <div class="result-actions">
              <button id="download-btn" class="btn btn-sm" disabled><i class="fa fa-download"></i> 下载图片</button>
              <button id="download-all-btn" class="btn btn-sm" disabled><i class="fa fa-download"></i> 下载全部</button>
              <button id="download-zip-btn" class="btn btn-sm" disabled><i class="fa fa-file-archive-o"></i> 打包下载</button>
            </div>
          </div>
          
          <div class="flip-results" id="flip-results">
            <div class="no-results">请选择图片并点击"反转图片"按钮</div>
          </div>
        </div>
      </div>
      
      <div class="flip-info">
        <div class="info-header">
          <h3><i class="fa fa-question-circle"></i> 使用指南</h3>
          <button class="toggle-info-btn" title="展开/收起说明"><i class="fa fa-chevron-up"></i></button>
        </div>
        <div class="info-content">
          <div class="info-item">
            <h4><i class="fa fa-info-circle"></i> 功能介绍</h4>
            <p>图片对称反转工具可以将图片进行水平或垂直方向的对称反转，也可以同时进行两个方向的反转。这个工具适用于需要创建镜像效果、调整图片方向或制作特殊视觉效果的场景。</p>
          </div>
          
          <div class="info-item">
            <h4><i class="fa fa-list-ol"></i> 反转选项说明</h4>
            <ul>
              <li><strong>水平反转</strong> - 将图片沿垂直中轴线翻转，左右互换位置</li>
              <li><strong>垂直反转</strong> - 将图片沿水平中轴线翻转，上下互换位置</li>
              <li><strong>水平和垂直反转</strong> - 同时进行水平和垂直反转，相当于旋转180度</li>
              <li><strong>区域反转</strong> - 只对图片的特定区域进行反转，可选择左半部分、右半部分、上半部分、下半部分或自定义区域</li>
              <li><strong>图像调整</strong> - 可调整亮度、对比度、饱和度或转换为灰度图</li>
              <li><strong>输出质量</strong> - 控制JPG和WebP格式的压缩质量，值越高质量越好但文件更大</li>
              <li><strong>输出格式</strong> - 可以选择保持原格式或转换为其他格式</li>
            </ul>
          </div>
          
          <div class="info-item">
            <h4><i class="fa fa-lightbulb-o"></i> 使用技巧</h4>
            <ul>
              <li>支持批量处理多张图片，可以一次性选择多个文件或拖放多个文件</li>
              <li>使用实时预览功能可以在处理前查看效果</li>
              <li>区域反转功能可以创建有趣的视觉效果，例如只反转人物的一半脸部</li>
              <li>自定义区域反转可以在预览区域拖动鼠标选择要反转的区域</li>
              <li>水平反转适合创建镜像效果或修正自拍照片的方向</li>
              <li>垂直反转可用于创建水中倒影效果</li>
              <li>对于需要保留透明背景的图片，请选择PNG格式输出</li>
              <li>WebP格式通常可以在保持相同质量的情况下获得更小的文件大小</li>
            </ul>
          </div>
          
          <div class="info-item">
            <h4><i class="fa fa-exclamation-triangle"></i> 注意事项</h4>
            <ul>
              <li>反转操作在浏览器中完成，不会上传图片到服务器</li>
              <li>处理大尺寸图片可能需要较长时间，请耐心等待</li>
              <li>如果选择了与原图不同的输出格式，可能会影响图片质量或文件大小</li>
              <li>对于包含文字的图片，水平反转后文字将会变成镜像效果</li>
              <li>批量处理大量图片可能会占用较多内存，如果遇到性能问题，请减少同时处理的图片数量</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    // 添加收藏按钮
    window.addFavoriteButton('imageFlip', container.querySelector('.tool-header'));
    
    // 添加样式
    this.addStyles(container);
  },
  
  // 添加样式
  addStyles: function(container) {
    const style = document.createElement('style');
    style.textContent = `
      .flip-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .flip-input-section {
        flex: 1;
        min-width: 300px;
      }
      
      .flip-result-section {
        flex: 1;
        min-width: 300px;
      }
      
      .file-input-container {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 10px;
      }
      
      .file-input-container input {
        display: none;
      }
      
      .file-input-label {
        padding: 8px 15px;
        background-color: var(--border-color);
        border-radius: 4px;
        cursor: pointer;
        transition: var(--transition);
      }
      
      .file-input-label:hover {
        background-color: var(--hover-bg);
      }
      
      .drag-area {
        border: 2px dashed var(--border-color);
        border-radius: 8px;
        padding: 30px;
        text-align: center;
        transition: var(--transition);
        margin-bottom: 20px;
      }
      
      .drag-area.active {
        border-color: var(--primary-color);
        background-color: rgba(74, 108, 247, 0.05);
      }
      
      .drag-text {
        color: var(--text-muted);
      }
      
      .drag-text i {
        font-size: 32px;
        margin-bottom: 10px;
      }
      
      .drag-text p {
        margin: 0;
      }
      
      .drag-text small {
        display: block;
        margin-top: 5px;
        font-size: 12px;
      }
      
      /* 选项卡样式 */
      .tabs {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 20px;
      }
      
      .tab-header {
        display: flex;
        border-bottom: 1px solid var(--border-color);
        background-color: var(--bg-color);
      }
      
      .tab {
        padding: 12px 15px;
        cursor: pointer;
        transition: all 0.3s;
        font-weight: 500;
        text-align: center;
        flex: 1;
      }
      
      .tab:hover {
        background-color: var(--hover-bg);
      }
      
      .tab.active {
        background-color: var(--card-bg);
        border-bottom: 2px solid var(--primary-color);
        color: var(--primary-color);
      }
      
      .tab-content {
        padding: 15px;
      }
      
      .tab-pane {
        display: none;
      }
      
      .tab-pane.active {
        display: block;
      }
      
      /* 预览区域 */
      .preview-section {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
      }
      
      .preview-section h4 {
        margin-top: 0;
        margin-bottom: 10px;
      }
      
      .preview-container {
        display: flex;
        justify-content: center;
        margin: 10px 0;
        position: relative;
      }
      
      .preview-container canvas {
        max-width: 100%;
        max-height: 300px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }
      
      /* 自定义区域选择 */
      .selection-area {
        position: absolute;
        border: 2px dashed var(--primary-color);
        background-color: rgba(74, 108, 247, 0.1);
        pointer-events: none;
        z-index: 10;
      }
      
      .options-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 10px;
      }
      
      .range-with-value {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .range-with-value input {
        flex: 1;
      }
      
      .format-options {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 10px;
      }
      
      .form-check {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      
      .flip-actions {
        display: flex;
        gap: 10px;
      }
      
      .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .result-header h3 {
        margin: 0;
      }
      
      .result-actions {
        display: flex;
        gap: 10px;
      }
      
      .flip-results {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 15px;
        min-height: 200px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
      }
      
      .no-results, .loading, .error-result {
        padding: 30px;
        text-align: center;
        color: var(--text-muted);
        grid-column: 1 / -1;
      }
      
      .loading i {
        margin-right: 10px;
      }
      
      .error-result {
        color: #e74c3c;
      }
      
      .error-result i {
        font-size: 32px;
        margin-bottom: 10px;
      }
      
      .preview-container, .result-container {
        margin-bottom: 20px;
      }
      
      .preview-container h4, .result-container h4 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 16px;
      }
      
      .image-preview {
        border: 1px solid var(--border-color);
        border-radius: 4px;
        overflow: hidden;
        background-color: var(--bg-color);
        margin-bottom: 10px;
        text-align: center;
      }
      
      .preview-image, .result-image {
        max-width: 100%;
        max-height: 300px;
        object-fit: contain;
      }
      
      .image-info {
        margin-bottom: 10px;
      }
      
      .image-name {
        margin-bottom: 5px;
        word-break: break-all;
        font-size: 14px;
      }
      
      .image-size, .image-dimensions {
        color: var(--text-muted);
        font-size: 12px;
      }
      
      /* 结果项样式 */
      .result-item {
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
        background-color: var(--bg-color);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      
      .result-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
      
      .result-item-image {
        width: 100%;
        height: 150px;
        object-fit: contain;
        background-color: var(--bg-color);
        display: block;
      }
      
      .result-item-info {
        padding: 10px;
      }
      
      .result-item-name {
        font-size: 14px;
        margin-bottom: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .result-item-meta {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: var(--text-muted);
      }
      
      .result-item-actions {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        border-top: 1px solid var(--border-color);
      }
      
      .flip-info {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
        margin-top: 20px;
      }
      
      .info-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid var(--border-color);
      }
      
      .info-header h3 {
        margin: 0;
      }
      
      .toggle-info-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-color);
      }
      
      .info-content {
        padding: 15px;
      }
      
      .info-item {
        margin-bottom: 20px;
      }
      
      .info-item:last-child {
        margin-bottom: 0;
      }
      
      .info-item h4 {
        margin-top: 0;
        margin-bottom: 10px;
      }
      
      .info-item p {
        margin: 0 0 10px 0;
      }
      
      .info-item ul {
        margin: 0;
        padding-left: 20px;
      }
      
      /* 下载按钮样式 */
      #download-btn, #download-all-btn, #download-zip-btn {
        background-color: var(--primary-color);
        color: white;
      }
      
      #download-btn:hover, #download-all-btn:hover, #download-zip-btn:hover {
        background-color: var(--primary-dark);
      }
      
      #download-btn:disabled, #download-all-btn:disabled, #download-zip-btn:disabled {
        background-color: var(--border-color);
      }
      
      /* 自定义区域控制 */
      #custom-area-controls {
        background-color: var(--bg-color);
        border-radius: 4px;
        padding: 10px;
        margin-top: 10px;
      }
      
      #reset-area-btn {
        background-color: var(--border-color);
        color: var(--text-color);
      }
      
      #reset-area-btn:hover {
        background-color: var(--hover-bg);
      }
      
      /* 响应式布局 */
      @media (max-width: 768px) {
        .flip-container {
          flex-direction: column;
        }
        
        .tab-header {
          flex-wrap: wrap;
        }
        
        .tab {
          flex: 0 0 auto;
          width: 33.33%;
          font-size: 14px;
          padding: 10px 5px;
        }
        
        .flip-results {
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        }
      }
    `;
    container.appendChild(style);
  }
};

module.exports = ui;