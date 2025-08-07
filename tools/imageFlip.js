/**
 * 多宝工具箱 - 图片对称反转工具
 * 
 * 功能：
 * - 支持水平、垂直或双向对称反转
 * - 支持部分区域反转
 * - 实时预览反转效果
 * - 支持批量处理多张图片
 * - 提供图像调整选项（亮度、对比度等）
 * - 多种输出格式和质量选项
 */
(function() {
  // 定义工具
  const tool = {
    // 工具配置
    config: {
      // 保存用户设置
      saveSettings: function(settings) {
        try {
          localStorage.setItem('settings_imageFlip', JSON.stringify(settings));
        } catch (e) {
          console.error('保存设置失败', e);
        }
      },
      
      // 加载用户设置
      loadSettings: function() {
        try {
          const settings = localStorage.getItem('settings_imageFlip');
          return settings ? JSON.parse(settings) : null;
        } catch (e) {
          console.error('加载设置失败', e);
          return null;
        }
      }
    },
    
    // 工具初始化时调用
    init: function() {
      console.log('图片对称反转工具初始化');
      
      // 加载用户设置
      const savedSettings = this.config.loadSettings();
      if (savedSettings) {
        console.log('已加载用户设置');
      }
    },
    
    // 渲染工具界面
    render: function(container) {
      // 创建工具界面
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
                <li><strong>输出质量</strong> - 控制JPG和WebP格式的压缩质量，值越高质量越好但文件更大</li>
                <li><strong>输出格式</strong> - 可以选择保持原格式或转换为其他格式</li>
              </ul>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-lightbulb-o"></i> 使用技巧</h4>
              <ul>
                <li>水平反转适合创建镜像效果或修正自拍照片的方向</li>
                <li>垂直反转可用于创建水中倒影效果</li>
                <li>对于需要保留透明背景的图片，请选择PNG格式输出</li>
                <li>WebP格式通常可以在保持相同质量的情况下获得更小的文件大小</li>
                <li>可以直接将图片拖放到指定区域，无需点击选择文件按钮</li>
              </ul>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-exclamation-triangle"></i> 注意事项</h4>
              <ul>
                <li>反转操作在浏览器中完成，不会上传图片到服务器</li>
                <li>处理大尺寸图片可能需要较长时间，请耐心等待</li>
                <li>如果选择了与原图不同的输出格式，可能会影响图片质量或文件大小</li>
                <li>对于包含文字的图片，水平反转后文字将会变成镜像效果</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('imageFlip', container.querySelector('.tool-header'));
      
      // 获取元素
      const imageInput = container.querySelector('#image-input');
      const fileCount = container.querySelector('#file-count');
      const dragArea = container.querySelector('#drag-area');
      const tabs = container.querySelectorAll('.tab');
      const tabPanes = container.querySelectorAll('.tab-pane');
      const flipHorizontal = container.querySelector('#flip-horizontal');
      const flipVertical = container.querySelector('#flip-vertical');
      const flipBoth = container.querySelector('#flip-both');
      const qualitySlider = container.querySelector('#quality-slider');
      const qualityValue = container.querySelector('#quality-value');
      const brightnessSlider = container.querySelector('#brightness-slider');
      const brightnessValue = container.querySelector('#brightness-value');
      const contrastSlider = container.querySelector('#contrast-slider');
      const contrastValue = container.querySelector('#contrast-value');
      const saturationSlider = container.querySelector('#saturation-slider');
      const saturationValue = container.querySelector('#saturation-value');
      const grayscaleOption = container.querySelector('#grayscale-option');
      const partialModes = container.querySelectorAll('input[name="partial-mode"]');
      const customAreaControls = container.querySelector('#custom-area-controls');
      const resetAreaBtn = container.querySelector('#reset-area-btn');
      const previewSection = container.querySelector('#preview-section');
      const previewContainer = container.querySelector('#preview-container');
      const formatSame = container.querySelector('#format-same');
      const formatJpg = container.querySelector('#format-jpg');
      const formatPng = container.querySelector('#format-png');
      const formatWebp = container.querySelector('#format-webp');
      const flipBtn = container.querySelector('#flip-btn');
      const clearBtn = container.querySelector('#clear-btn');
      const downloadBtn = container.querySelector('#download-btn');
      const downloadAllBtn = container.querySelector('#download-all-btn');
      const downloadZipBtn = container.querySelector('#download-zip-btn');
      const resultsContainer = container.querySelector('#flip-results');
      const toggleInfoBtn = container.querySelector('.toggle-info-btn');
      
      // 存储选择的文件
      let selectedFiles = [];
      
      // 存储反转后的图片
      let flippedImages = [];
      
      // 存储预览相关变量
      let previewCanvas = null;
      let previewCtx = null;
      let previewImage = null;
      let customSelection = { x: 0, y: 0, width: 0, height: 0, active: false };
      let selectionArea = null;
      let isDrawing = false;
      let startX = 0;
      let startY = 0;
      
      // 选项卡切换
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          // 移除所有选项卡的活动状态
          tabs.forEach(t => t.classList.remove('active'));
          tabPanes.forEach(p => p.classList.remove('active'));
          
          // 设置当前选项卡为活动状态
          tab.classList.add('active');
          const tabId = tab.getAttribute('data-tab');
          container.querySelector(`#${tabId}-tab`).classList.add('active');
          
          // 如果有预览图片，更新预览
          if (selectedFiles.length > 0 && previewImage) {
            updatePreview();
          }
        });
      });
      
      // 更新滑块值显示
      qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = `${qualitySlider.value}%`;
        updatePreview();
      });
      
      brightnessSlider.addEventListener('input', () => {
        brightnessValue.textContent = brightnessSlider.value;
        updatePreview();
      });
      
      contrastSlider.addEventListener('input', () => {
        contrastValue.textContent = contrastSlider.value;
        updatePreview();
      });
      
      saturationSlider.addEventListener('input', () => {
        saturationValue.textContent = saturationSlider.value;
        updatePreview();
      });
      
      grayscaleOption.addEventListener('change', updatePreview);
      
      // 区域反转模式切换
      partialModes.forEach(mode => {
        mode.addEventListener('change', () => {
          if (mode.value === 'custom') {
            customAreaControls.style.display = 'block';
          } else {
            customAreaControls.style.display = 'none';
          }
          updatePreview();
        });
      });
      
      // 重置选区
      resetAreaBtn.addEventListener('click', () => {
        if (previewCanvas) {
          customSelection = { 
            x: 0, 
            y: 0, 
            width: previewCanvas.width, 
            height: previewCanvas.height, 
            active: false 
          };
          updateSelectionArea();
          updatePreview();
        }
      });
      
      // 反转方向切换
      flipHorizontal.addEventListener('change', updatePreview);
      flipVertical.addEventListener('change', updatePreview);
      flipBoth.addEventListener('change', updatePreview);
      
      // 输出格式切换
      formatSame.addEventListener('change', updatePreview);
      formatJpg.addEventListener('change', updatePreview);
      formatPng.addEventListener('change', updatePreview);
      formatWebp.addEventListener('change', updatePreview);
      
      // 文件选择处理
      imageInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
      });
      
      // 拖放处理
      dragArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragArea.classList.add('active');
      });
      
      dragArea.addEventListener('dragleave', () => {
        dragArea.classList.remove('active');
      });
      
      dragArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dragArea.classList.remove('active');
        
        if (e.dataTransfer.files.length > 0) {
          handleFiles(e.dataTransfer.files);
        }
      });
      
      // 处理选择的文件
      function handleFiles(files) {
        if (!files || files.length === 0) return;
        
        // 清空之前的文件
        selectedFiles = [];
        
        // 筛选图片文件
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file.type.startsWith('image/')) {
            selectedFiles.push(file);
          }
        }
        
        if (selectedFiles.length === 0) {
          showToast('请选择有效的图片文件', 'warning');
          return;
        }
        
        // 更新文件计数
        fileCount.textContent = selectedFiles.length === 1 
          ? `已选择1个文件` 
          : `已选择${selectedFiles.length}个文件`;
        
        // 启用按钮
        flipBtn.disabled = false;
        clearBtn.disabled = false;
        
        // 显示预览
        showPreview(selectedFiles[0]);
      }
      
      // 显示图片预览
      function showPreview(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          // 显示预览区域
          previewSection.style.display = 'block';
          
          // 创建图像对象
          previewImage = new Image();
          previewImage.onload = () => {
            // 创建预览画布
            if (!previewCanvas) {
              previewCanvas = document.createElement('canvas');
              previewContainer.appendChild(previewCanvas);
              previewCtx = previewCanvas.getContext('2d');
              
              // 设置自定义区域选择
              setupCustomAreaSelection();
            }
            
            // 调整画布大小
            const maxWidth = previewContainer.clientWidth - 20;
            const maxHeight = 300;
            let width = previewImage.width;
            let height = previewImage.height;
            
            if (width > maxWidth) {
              const ratio = maxWidth / width;
              width = maxWidth;
              height = height * ratio;
            }
            
            if (height > maxHeight) {
              const ratio = maxHeight / height;
              height = maxHeight;
              width = width * ratio;
            }
            
            previewCanvas.width = width;
            previewCanvas.height = height;
            
            // 初始化自定义选区
            customSelection = { 
              x: 0, 
              y: 0, 
              width: width, 
              height: height, 
              active: false 
            };
            
            // 更新预览
            updatePreview();
          };
          
          previewImage.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
      }
      
      // 设置自定义区域选择
      function setupCustomAreaSelection() {
        // 创建选区元素
        selectionArea = document.createElement('div');
        selectionArea.className = 'selection-area';
        selectionArea.style.display = 'none';
        previewContainer.appendChild(selectionArea);
        
        // 鼠标按下事件
        previewCanvas.addEventListener('mousedown', (e) => {
          const customMode = document.querySelector('#mode-custom');
          if (!customMode || !customMode.checked) return;
          
          isDrawing = true;
          const rect = previewCanvas.getBoundingClientRect();
          startX = e.clientX - rect.left;
          startY = e.clientY - rect.top;
          
          // 重置选区
          customSelection = { x: startX, y: startY, width: 0, height: 0, active: true };
          updateSelectionArea();
        });
        
        // 鼠标移动事件
        previewCanvas.addEventListener('mousemove', (e) => {
          if (!isDrawing) return;
          
          const rect = previewCanvas.getBoundingClientRect();
          const currentX = e.clientX - rect.left;
          const currentY = e.clientY - rect.top;
          
          // 更新选区大小
          customSelection.width = currentX - startX;
          customSelection.height = currentY - startY;
          
          // 处理负值情况
          if (customSelection.width < 0) {
            customSelection.x = currentX;
            customSelection.width = Math.abs(customSelection.width);
          }
          
          if (customSelection.height < 0) {
            customSelection.y = currentY;
            customSelection.height = Math.abs(customSelection.height);
          }
          
          updateSelectionArea();
        });
        
        // 鼠标松开事件
        window.addEventListener('mouseup', () => {
          if (isDrawing) {
            isDrawing = false;
            updatePreview();
          }
        });
      }
      
      // 更新选区显示
      function updateSelectionArea() {
        if (!selectionArea) return;
        
        if (customSelection.active && customSelection.width > 5 && customSelection.height > 5) {
          selectionArea.style.display = 'block';
          selectionArea.style.left = `${customSelection.x}px`;
          selectionArea.style.top = `${customSelection.y}px`;
          selectionArea.style.width = `${customSelection.width}px`;
          selectionArea.style.height = `${customSelection.height}px`;
        } else {
          selectionArea.style.display = 'none';
        }
      }
      
      // 更新预览
      function updatePreview() {
        if (!previewCanvas || !previewCtx || !previewImage) return;
        
        // 清除画布
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        
        // 获取反转方向
        const direction = document.querySelector('input[name="flip-direction"]:checked').value;
        
        // 获取区域反转模式
        const partialMode = document.querySelector('input[name="partial-mode"]:checked').value;
        
        // 获取图像调整参数
        const brightness = parseInt(brightnessSlider.value);
        const contrast = parseInt(contrastSlider.value);
        const saturation = parseInt(saturationSlider.value);
        const grayscale = grayscaleOption.checked;
        
        // 保存画布状态
        previewCtx.save();
        
        // 应用反转变换
        if (partialMode === 'disabled' || partialMode === 'custom') {
          // 全图反转或自定义区域反转
          if (direction === 'horizontal' || direction === 'both') {
            previewCtx.translate(previewCanvas.width, 0);
            previewCtx.scale(-1, 1);
          }
          
          if (direction === 'vertical' || direction === 'both') {
            previewCtx.translate(0, previewCanvas.height);
            previewCtx.scale(1, -1);
          }
          
          // 绘制图像
          previewCtx.drawImage(previewImage, 0, 0, previewCanvas.width, previewCanvas.height);
        } else {
          // 部分区域反转
          // 先绘制原始图像
          previewCtx.drawImage(previewImage, 0, 0, previewCanvas.width, previewCanvas.height);
          
          // 创建临时画布
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = previewCanvas.width;
          tempCanvas.height = previewCanvas.height;
          const tempCtx = tempCanvas.getContext('2d');
          
          // 在临时画布上绘制原始图像
          tempCtx.drawImage(previewImage, 0, 0, previewCanvas.width, previewCanvas.height);
          
          // 根据模式确定反转区域
          let x = 0, y = 0, width = 0, height = 0;
          
          switch (partialMode) {
            case 'left':
              width = previewCanvas.width / 2;
              height = previewCanvas.height;
              break;
            case 'right':
              x = previewCanvas.width / 2;
              width = previewCanvas.width / 2;
              height = previewCanvas.height;
              break;
            case 'top':
              width = previewCanvas.width;
              height = previewCanvas.height / 2;
              break;
            case 'bottom':
              y = previewCanvas.height / 2;
              width = previewCanvas.width;
              height = previewCanvas.height / 2;
              break;
          }
          
          // 清除主画布上的对应区域
          previewCtx.clearRect(x, y, width, height);
          
          // 保存临时画布状态
          tempCtx.save();
          
          // 设置裁剪区域
          tempCtx.beginPath();
          tempCtx.rect(x, y, width, height);
          tempCtx.clip();
          
          // 清除临时画布
          tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
          
          // 应用反转变换
          if (direction === 'horizontal' || direction === 'both') {
            tempCtx.translate(tempCanvas.width, 0);
            tempCtx.scale(-1, 1);
          }
          
          if (direction === 'vertical' || direction === 'both') {
            tempCtx.translate(0, tempCanvas.height);
            tempCtx.scale(1, -1);
          }
          
          // 在临时画布上绘制反转后的图像
          tempCtx.drawImage(previewImage, 0, 0, previewCanvas.width, previewCanvas.height);
          
          // 恢复临时画布状态
          tempCtx.restore();
          
          // 将临时画布的内容绘制到主画布上
          previewCtx.drawImage(tempCanvas, 0, 0);
        }
        
        // 恢复画布状态
        previewCtx.restore();
        
        // 应用图像调整
        if (brightness !== 0 || contrast !== 0 || saturation !== 0 || grayscale) {
          // 获取图像数据
          const imageData = previewCtx.getImageData(0, 0, previewCanvas.width, previewCanvas.height);
          const data = imageData.data;
          
          // 亮度、对比度和饱和度调整
          for (let i = 0; i < data.length; i += 4) {
            // 获取RGB值
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            
            // 转换为HSL
            const hsl = rgbToHsl(r, g, b);
            
            // 调整亮度
            hsl[2] = Math.max(0, Math.min(1, hsl[2] + brightness / 200));
            
            // 调整对比度
            if (contrast !== 0) {
              const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
              hsl[2] = Math.max(0, Math.min(1, factor * (hsl[2] - 0.5) + 0.5));
            }
            
            // 调整饱和度
            hsl[1] = Math.max(0, Math.min(1, hsl[1] + saturation / 200));
            
            // 灰度处理
            if (grayscale) {
              hsl[1] = 0;
            }
            
            // 转换回RGB
            const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
            
            // 更新像素数据
            data[i] = rgb[0];
            data[i + 1] = rgb[1];
            data[i + 2] = rgb[2];
          }
          
          // 将处理后的图像数据绘制回画布
          previewCtx.putImageData(imageData, 0, 0);
        }
        
        // 如果是自定义区域反转，绘制选区
        if (partialMode === 'custom') {
          updateSelectionArea();
        } else {
          if (selectionArea) selectionArea.style.display = 'none';
        }
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
        
        return [h, s, l];
      }
      
      // HSL转RGB
      function hslToRgb(h, s, l) {
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
        
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
      }
      
      // 反转图片
      flipBtn.addEventListener('click', () => {
        if (selectedFiles.length === 0) {
          showToast('请先选择图片', 'warning');
          return;
        }
        
        // 获取反转选项
        const direction = document.querySelector('input[name="flip-direction"]:checked').value;
        const quality = parseInt(qualitySlider.value) / 100;
        
        // 获取输出格式
        let outputFormat = null;
        if (!formatSame.checked) {
          outputFormat = document.querySelector('input[name="output-format"]:checked').value;
        }
        
        // 获取区域反转模式
        const partialMode = document.querySelector('input[name="partial-mode"]:checked').value;
        
        // 获取图像调整参数
        const brightness = parseInt(brightnessSlider.value);
        const contrast = parseInt(contrastSlider.value);
        const saturation = parseInt(saturationSlider.value);
        const grayscale = grayscaleOption.checked;
        
        // 显示加载状态
        resultsContainer.innerHTML = `
          <div class="loading">
            <i class="fa fa-spinner fa-spin"></i> 正在处理图片，请稍候...
          </div>
        `;
        
        // 清空之前的结果
        flippedImages = [];
        
        // 延迟执行，让UI有时间更新
        setTimeout(() => {
          try {
            // 处理所有选择的图片
            let processedCount = 0;
            
            // 创建处理完成的回调
            const onProcessComplete = () => {
              processedCount++;
              
              // 当所有图片都处理完成时
              if (processedCount === selectedFiles.length) {
                // 显示结果
                displayResults();
                
                // 启用下载按钮
                downloadBtn.disabled = false;
                downloadAllBtn.disabled = selectedFiles.length <= 1;
                downloadZipBtn.disabled = selectedFiles.length <= 1;
                
                showToast(`${selectedFiles.length}张图片反转完成`, 'success');
              }
            };
            
            // 处理每张图片
            for (let i = 0; i < selectedFiles.length; i++) {
              flipImage(
                selectedFiles[i], 
                direction, 
                quality, 
                outputFormat, 
                partialMode,
                brightness,
                contrast,
                saturation,
                grayscale,
                customSelection,
                onProcessComplete
              );
            }
          } catch (error) {
            console.error('反转图片出错:', error);
            
            resultsContainer.innerHTML = `
              <div class="error-result">
                <i class="fa fa-exclamation-triangle"></i>
                <p>处理图片时出错: ${error.message}</p>
              </div>
            `;
            
            showToast('反转图片失败: ' + error.message, 'error');
          }
        }, 100);
      });
      
      // 反转图片处理
      function flipImage(file, direction, quality, outputFormat, partialMode, brightness, contrast, saturation, grayscale, customSelection, callback) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const img = new Image();
          
          img.onload = () => {
            // 创建画布
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            
            // 如果是全图反转或自定义区域反转
            if (partialMode === 'disabled' || partialMode === 'custom') {
              // 根据方向进行反转
              switch (direction) {
                case 'horizontal':
                  ctx.translate(img.width, 0);
                  ctx.scale(-1, 1);
                  break;
                case 'vertical':
                  ctx.translate(0, img.height);
                  ctx.scale(1, -1);
                  break;
                case 'both':
                  ctx.translate(img.width, img.height);
                  ctx.scale(-1, -1);
                  break;
              }
              
              // 绘制图像
              ctx.drawImage(img, 0, 0);
            } else {
              // 部分区域反转
              // 先绘制原始图像
              ctx.drawImage(img, 0, 0);
              
              // 创建临时画布
              const tempCanvas = document.createElement('canvas');
              tempCanvas.width = img.width;
              tempCanvas.height = img.height;
              const tempCtx = tempCanvas.getContext('2d');
              
              // 在临时画布上绘制原始图像
              tempCtx.drawImage(img, 0, 0);
              
              // 根据模式确定反转区域
              let x = 0, y = 0, width = 0, height = 0;
              
              switch (partialMode) {
                case 'left':
                  width = img.width / 2;
                  height = img.height;
                  break;
                case 'right':
                  x = img.width / 2;
                  width = img.width / 2;
                  height = img.height;
                  break;
                case 'top':
                  width = img.width;
                  height = img.height / 2;
                  break;
                case 'bottom':
                  y = img.height / 2;
                  width = img.width;
                  height = img.height / 2;
                  break;
              }
              
              // 清除主画布上的对应区域
              ctx.clearRect(x, y, width, height);
              
              // 保存临时画布状态
              tempCtx.save();
              
              // 设置裁剪区域
              tempCtx.beginPath();
              tempCtx.rect(x, y, width, height);
              tempCtx.clip();
              
              // 清除临时画布
              tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
              
              // 应用反转变换
              if (direction === 'horizontal' || direction === 'both') {
                tempCtx.translate(tempCanvas.width, 0);
                tempCtx.scale(-1, 1);
              }
              
              if (direction === 'vertical' || direction === 'both') {
                tempCtx.translate(0, tempCanvas.height);
                tempCtx.scale(1, -1);
              }
              
              // 在临时画布上绘制反转后的图像
              tempCtx.drawImage(img, 0, 0);
              
              // 恢复临时画布状态
              tempCtx.restore();
              
              // 将临时画布的内容绘制到主画布上
              ctx.drawImage(tempCanvas, 0, 0);
            }
            
            // 应用图像调整
            if (brightness !== 0 || contrast !== 0 || saturation !== 0 || grayscale) {
              // 获取图像数据
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const data = imageData.data;
              
              // 亮度、对比度和饱和度调整
              for (let i = 0; i < data.length; i += 4) {
                // 获取RGB值
                let r = data[i];
                let g = data[i + 1];
                let b = data[i + 2];
                
                // 转换为HSL
                const hsl = rgbToHsl(r, g, b);
                
                // 调整亮度
                hsl[2] = Math.max(0, Math.min(1, hsl[2] + brightness / 200));
                
                // 调整对比度
                if (contrast !== 0) {
                  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
                  hsl[2] = Math.max(0, Math.min(1, factor * (hsl[2] - 0.5) + 0.5));
                }
                
                // 调整饱和度
                hsl[1] = Math.max(0, Math.min(1, hsl[1] + saturation / 200));
                
                // 灰度处理
                if (grayscale) {
                  hsl[1] = 0;
                }
                
                // 转换回RGB
                const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
                
                // 更新像素数据
                data[i] = rgb[0];
                data[i + 1] = rgb[1];
                data[i + 2] = rgb[2];
              }
              
              // 将处理后的图像数据绘制回画布
              ctx.putImageData(imageData, 0, 0);
            }
            
            // 确定输出格式
            let format = outputFormat;
            if (!format) {
              format = file.type;
            }
            
            // 对于PNG，质量参数无效，所以我们使用默认值
            const compressionQuality = format === 'image/png' ? undefined : quality;
            
            // 转换为Blob
            canvas.toBlob((blob) => {
              if (!blob) {
                throw new Error('无法创建图片数据');
              }
              
              // 获取文件扩展名
              let extension = 'jpg';
              if (format === 'image/png') extension = 'png';
              else if (format === 'image/webp') extension = 'webp';
              else if (format === 'image/gif') extension = 'gif';
              
              // 生成文件名
              const fileName = file.name.replace(/\.[^/.]+$/, '') + '_flipped.' + extension;
              
              // 存储结果
              flippedImages.push({
                blob: blob,
                fileName: fileName,
                originalSize: file.size,
                flippedSize: blob.size,
                width: img.width,
                height: img.height,
                format: format,
                originalName: file.name
              });
              
              // 调用回调
              if (callback) callback();
            }, format, compressionQuality);
          };
          
          img.onerror = () => {
            console.error('图片加载失败');
            if (callback) callback();
          };
          
          img.src = e.target.result;
        };
        
        reader.onerror = () => {
          console.error('文件读取失败');
          if (callback) callback();
        };
        
        reader.readAsDataURL(file);
      }
      
      // 显示反转结果
      function displayResults() {
        if (flippedImages.length === 0) {
          resultsContainer.innerHTML = '<div class="no-results">没有反转结果</div>';
          return;
        }
        
        // 清空结果容器
        resultsContainer.innerHTML = '';
        
        // 添加每个结果
        flippedImages.forEach((image, index) => {
          const resultEl = document.createElement('div');
          resultEl.className = 'result-item';
          
          resultEl.innerHTML = `
            <img src="${URL.createObjectURL(image.blob)}" class="result-item-image" alt="反转后的图片" />
            <div class="result-item-info">
              <div class="result-item-name" title="${image.fileName}">${image.fileName}</div>
              <div class="result-item-meta">
                <span>${formatFileSize(image.flippedSize)}</span>
                <span>${image.width} × ${image.height}</span>
              </div>
            </div>
            <div class="result-item-actions">
              <button class="btn btn-sm download-single-btn" data-index="${index}">
                <i class="fa fa-download"></i> 下载
              </button>
            </div>
          `;
          
          // 添加到结果容器
          resultsContainer.appendChild(resultEl);
          
          // 添加下载按钮事件
          const downloadBtn = resultEl.querySelector('.download-single-btn');
          downloadBtn.addEventListener('click', () => {
            downloadImage(flippedImages[index]);
          });
        });
      }
      
      // 下载单个图片
      function downloadImage(image) {
        if (!image || !image.blob) {
          showToast('没有可下载的图片', 'warning');
          return;
        }
        
        const url = URL.createObjectURL(image.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = image.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('图片下载已开始', 'success');
      }
      
      // 下载所有图片
      downloadAllBtn.addEventListener('click', () => {
        if (flippedImages.length === 0) {
          showToast('没有可下载的图片', 'warning');
          return;
        }
        
        // 逐个下载图片
        flippedImages.forEach((image, index) => {
          // 延迟下载，避免浏览器阻止多个下载
          setTimeout(() => {
            downloadImage(image);
          }, index * 300);
        });
        
        showToast(`开始下载${flippedImages.length}张图片`, 'success');
      });
      
      // 打包下载
      downloadZipBtn.addEventListener('click', () => {
        if (flippedImages.length === 0) {
          showToast('没有可下载的图片', 'warning');
          return;
        }
        
        // 检查是否有JSZip库
        if (typeof JSZip === 'undefined') {
          // 加载JSZip库
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
          script.onload = createAndDownloadZip;
          script.onerror = () => {
            showToast('无法加载打包工具，请使用单独下载', 'error');
          };
          document.head.appendChild(script);
        } else {
          createAndDownloadZip();
        }
      });
      
      // 创建并下载ZIP文件
      function createAndDownloadZip() {
        const zip = new JSZip();
        let count = 0;
        
        // 显示加载状态
        downloadZipBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> 正在打包...';
        downloadZipBtn.disabled = true;
        
        // 添加每个图片到ZIP
        flippedImages.forEach(image => {
          zip.file(image.fileName, image.blob);
        });
        
        // 生成ZIP文件
        zip.generateAsync({ type: 'blob' }).then(content => {
          // 下载ZIP文件
          const url = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'flipped_images.zip';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          // 恢复按钮状态
          downloadZipBtn.innerHTML = '<i class="fa fa-file-archive-o"></i> 打包下载';
          downloadZipBtn.disabled = false;
          
          showToast('图片打包下载已开始', 'success');
        }).catch(err => {
          console.error('打包失败:', err);
          showToast('打包失败: ' + err.message, 'error');
          
          // 恢复按钮状态
          downloadZipBtn.innerHTML = '<i class="fa fa-file-archive-o"></i> 打包下载';
          downloadZipBtn.disabled = false;
        });
      }
      
      // 下载当前图片
      downloadBtn.addEventListener('click', () => {
        if (flippedImages.length === 0) {
          showToast('没有可下载的图片', 'warning');
          return;
        }
        
        // 下载第一张图片
        downloadImage(flippedImages[0]);
      });
      
      // 清空
      clearBtn.addEventListener('click', () => {
        selectedFiles = [];
        flippedImages = [];
        imageInput.value = '';
        fileCount.textContent = '未选择文件';
        resultsContainer.innerHTML = '<div class="no-results">请选择图片并点击"反转图片"按钮</div>';
        previewSection.style.display = 'none';
        
        // 禁用按钮
        flipBtn.disabled = true;
        clearBtn.disabled = true;
        downloadBtn.disabled = true;
        downloadAllBtn.disabled = true;
        downloadZipBtn.disabled = true;
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
        localStorage.setItem('infoCollapsed_imageFlip', !isCollapsed);
      });
      
      // 检查是否应该折叠说明
      const shouldCollapseInfo = localStorage.getItem('infoCollapsed_imageFlip') === 'true';
      if (shouldCollapseInfo) {
        const infoContent = container.querySelector('.info-content');
        infoContent.style.display = 'none';
        toggleInfoBtn.innerHTML = '<i class="fa fa-chevron-down"></i>';
      }
      
      // 更新使用指南内容
      const infoContent = container.querySelector('.info-content');
      infoContent.innerHTML = `
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
      `;
      
      // 格式化文件大小
      function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }
      
      // 添加样式
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
  
  // 注册工具
  window.tools.imageFlip = tool;
})();