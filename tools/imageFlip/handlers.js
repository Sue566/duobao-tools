/**
 * 多宝工具箱 - 图片对称反转工具 - 事件处理模块
 */
const core = require('./core');
const utils = require('./utils');
const partialFlip = require('./partialFlip');
const config = require('./config');
const download = require('./download');
const preview = require('./preview');

const handlers = {
  // 存储选择的文件
  selectedFiles: [],
  
  // 存储反转后的图片
  flippedImages: [],
  
  // 存储预览相关变量
  previewCanvas: null,
  previewCtx: null,
  previewImage: null,
  customSelection: { x: 0, y: 0, width: 0, height: 0, active: false },
  selectionArea: null,
  
  // 初始化事件处理
  initEventHandlers: function(container) {
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
        if (this.selectedFiles.length > 0 && this.previewImage) {
          this.updatePreview();
        }
      });
    });
    
    // 更新滑块值显示
    qualitySlider.addEventListener('input', () => {
      qualityValue.textContent = `${qualitySlider.value}%`;
      this.updatePreview();
    });
    
    brightnessSlider.addEventListener('input', () => {
      brightnessValue.textContent = brightnessSlider.value;
      this.updatePreview();
    });
    
    contrastSlider.addEventListener('input', () => {
      contrastValue.textContent = contrastSlider.value;
      this.updatePreview();
    });
    
    saturationSlider.addEventListener('input', () => {
      saturationValue.textContent = saturationSlider.value;
      this.updatePreview();
    });
    
    grayscaleOption.addEventListener('change', () => this.updatePreview());
    
    // 区域反转模式切换
    partialModes.forEach(mode => {
      mode.addEventListener('change', () => {
        if (mode.value === 'custom') {
          customAreaControls.style.display = 'block';
        } else {
          customAreaControls.style.display = 'none';
        }
        this.updatePreview();
      });
    });
    
    // 重置选区
    resetAreaBtn.addEventListener('click', () => {
      if (this.previewCanvas) {
        partialFlip.resetSelectionArea(this.previewCanvas, this.customSelection);
        this.updatePreview();
      }
    });
    
    // 反转方向切换
    flipHorizontal.addEventListener('change', () => this.updatePreview());
    flipVertical.addEventListener('change', () => this.updatePreview());
    flipBoth.addEventListener('change', () => this.updatePreview());
    
    // 输出格式切换
    formatSame.addEventListener('change', () => this.updatePreview());
    formatJpg.addEventListener('change', () => this.updatePreview());
    formatPng.addEventListener('change', () => this.updatePreview());
    formatWebp.addEventListener('change', () => this.updatePreview());
    
    // 文件选择处理
    imageInput.addEventListener('change', (e) => {
      this.handleFiles(e.target.files, fileCount, flipBtn, clearBtn, previewSection);
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
        this.handleFiles(e.dataTransfer.files, fileCount, flipBtn, clearBtn, previewSection);
      }
    });
    
    // 反转图片
    flipBtn.addEventListener('click', () => {
      this.flipImages(
        resultsContainer,
        downloadBtn,
        downloadAllBtn,
        downloadZipBtn,
        qualitySlider,
        brightnessSlider,
        contrastSlider,
        saturationSlider,
        grayscaleOption,
        formatSame
      );
    });
    
    // 下载当前图片
    downloadBtn.addEventListener('click', () => {
      this.downloadCurrentImage();
    });
    
    // 下载所有图片
    downloadAllBtn.addEventListener('click', () => {
      this.downloadAllImages();
    });
    
    // 打包下载
    downloadZipBtn.addEventListener('click', () => {
      this.downloadZipImages(downloadZipBtn);
    });
    
    // 清空
    clearBtn.addEventListener('click', () => {
      this.clearAll(
        imageInput,
        fileCount,
        resultsContainer,
        previewSection,
        flipBtn,
        clearBtn,
        downloadBtn,
        downloadAllBtn,
        downloadZipBtn
      );
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
  },
  
  // 处理选择的文件
  handleFiles: function(files, fileCount, flipBtn, clearBtn, previewSection) {
    if (!files || files.length === 0) return;
    
    // 清空之前的文件
    this.selectedFiles = [];
    
    // 筛选图片文件
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        this.selectedFiles.push(file);
      }
    }
    
    if (this.selectedFiles.length === 0) {
      utils.showToast('请选择有效的图片文件', 'warning');
      return;
    }
    
    // 更新文件计数
    fileCount.textContent = this.selectedFiles.length === 1 
      ? `已选择1个文件` 
      : `已选择${this.selectedFiles.length}个文件`;
    
    // 启用按钮
    flipBtn.disabled = false;
    clearBtn.disabled = false;
    
    // 显示预览
    this.showPreview(this.selectedFiles[0], previewSection);
  },
  
  // 显示图片预览
  showPreview: function(file, previewSection) {
    const previewContainer = document.getElementById('preview-container');
    
    preview.showPreview(file, previewSection, previewContainer, this.customSelection, (previewObjects) => {
      // 保存预览相关对象
      this.previewCanvas = previewObjects.canvas;
      this.previewCtx = previewObjects.ctx;
      this.previewImage = previewObjects.image;
      this.selectionArea = previewObjects.selectionArea;
      
      // 添加选区变化事件监听
      this.previewCanvas.addEventListener('selectionchange', () => this.updatePreview());
      
      // 更新预览
      this.updatePreview();
    });
  },
  
  // 更新预览
  updatePreview: function() {
    if (!this.previewCanvas || !this.previewCtx || !this.previewImage) return;
    
    // 获取当前选项
    const options = this.getCurrentOptions();
    
    // 更新预览
    preview.updatePreview(
      this.previewCanvas,
      this.previewCtx,
      this.previewImage,
      options,
      this.customSelection,
      this.selectionArea
    );
  },
  
  // 获取当前选项
  getCurrentOptions: function() {
    return {
      direction: document.querySelector('input[name="flip-direction"]:checked').value,
      partialMode: document.querySelector('input[name="partial-mode"]:checked').value,
      brightness: parseInt(document.querySelector('#brightness-slider').value),
      contrast: parseInt(document.querySelector('#contrast-slider').value),
      saturation: parseInt(document.querySelector('#saturation-slider').value),
      grayscale: document.querySelector('#grayscale-option').checked,
      quality: parseInt(document.querySelector('#quality-slider').value) / 100,
      outputFormat: document.querySelector('input[name="output-format"]:checked').value === 'same' ? 
        null : document.querySelector('input[name="output-format"]:checked').value,
      customSelection: this.customSelection
    };
  },
  
  // 反转图片
  flipImages: function(
    resultsContainer,
    downloadBtn,
    downloadAllBtn,
    downloadZipBtn,
    qualitySlider,
    brightnessSlider,
    contrastSlider,
    saturationSlider,
    grayscaleOption,
    formatSame
  ) {
    if (this.selectedFiles.length === 0) {
      utils.showToast('请先选择图片', 'warning');
      return;
    }
    
    // 获取反转选项
    const options = this.getCurrentOptions();
    
    // 显示加载状态
    resultsContainer.innerHTML = `
      <div class="loading">
        <i class="fa fa-spinner fa-spin"></i> 正在处理图片，请稍候...
      </div>
    `;
    
    // 清空之前的结果
    this.flippedImages = [];
    
    // 延迟执行，让UI有时间更新
    setTimeout(() => {
      try {
        // 处理所有选择的图片
        let processedCount = 0;
        
        // 创建处理完成的回调
        const onProcessComplete = () => {
          processedCount++;
          
          // 当所有图片都处理完成时
          if (processedCount === this.selectedFiles.length) {
            // 显示结果
            this.displayResults(resultsContainer);
            
            // 启用下载按钮
            downloadBtn.disabled = false;
            downloadAllBtn.disabled = this.selectedFiles.length <= 1;
            downloadZipBtn.disabled = this.selectedFiles.length <= 1;
            
            utils.showToast(`${this.selectedFiles.length}张图片反转完成`, 'success');
          }
        };
        
        // 处理每张图片
        for (let i = 0; i < this.selectedFiles.length; i++) {
          core.flipImage(
            this.selectedFiles[i], 
            options,
            (err, result) => {
              if (err) {
                console.error('反转图片出错:', err);
              } else if (result) {
                this.flippedImages.push(result);
              }
              onProcessComplete();
            }
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
        
        utils.showToast('反转图片失败: ' + error.message, 'error');
      }
    }, 100);
  },
  
  // 显示反转结果
  displayResults: function(resultsContainer) {
    download.displayResults(resultsContainer, this.flippedImages, (index) => {
      this.downloadImage(this.flippedImages[index]);
    });
  },
  
  // 下载单个图片
  downloadImage: function(image) {
    download.downloadImage(image);
  },
  
  // 下载当前图片
  downloadCurrentImage: function() {
    if (this.flippedImages.length === 0) {
      utils.showToast('没有可下载的图片', 'warning');
      return;
    }
    
    // 下载第一张图片
    download.downloadImage(this.flippedImages[0]);
  },
  
  // 下载所有图片
  downloadAllImages: function() {
    download.downloadAllImages(this.flippedImages);
  },
  
  // 打包下载
  downloadZipImages: function(downloadZipBtn) {
    download.downloadZipImages(this.flippedImages, downloadZipBtn);
  },
  
  // 清空
  clearAll: function(
    imageInput,
    fileCount,
    resultsContainer,
    previewSection,
    flipBtn,
    clearBtn,
    downloadBtn,
    downloadAllBtn,
    downloadZipBtn
  ) {
    this.selectedFiles = [];
    this.flippedImages = [];
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
  }
};

module.exports = handlers;