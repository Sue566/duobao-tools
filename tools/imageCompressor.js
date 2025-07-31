/**
 * 图片压缩工具
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-compress"></i> 图片压缩</h2>
          <p class="tool-description">压缩图片文件大小，支持JPG、PNG、WebP等格式，可调整质量和尺寸。</p>
        </div>
        
        <div class="compressor-container">
          <div class="compressor-input-section">
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
                </div>
              </div>
            </div>
            
            <div class="compressor-options">
              <div class="form-group">
                <label for="quality-slider">压缩质量</label>
                <div class="range-with-value">
                  <input type="range" id="quality-slider" min="0" max="100" value="80" />
                  <span id="quality-value">80%</span>
                </div>
              </div>
              
              <div class="form-group">
                <label for="max-width">最大宽度 (可选)</label>
                <div class="input-with-unit">
                  <input type="number" id="max-width" class="form-control" placeholder="原始尺寸" min="1" />
                  <span class="unit">px</span>
                </div>
              </div>
              
              <div class="form-group">
                <label for="max-height">最大高度 (可选)</label>
                <div class="input-with-unit">
                  <input type="number" id="max-height" class="form-control" placeholder="原始尺寸" min="1" />
                  <span class="unit">px</span>
                </div>
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
            
            <div class="compressor-actions">
              <button id="compress-btn" class="btn btn-success" disabled><i class="fa fa-compress"></i> 压缩图片</button>
              <button id="clear-btn" class="btn btn-secondary" disabled><i class="fa fa-trash-o"></i> 清空</button>
            </div>
          </div>
          
          <div class="compressor-result-section">
            <div class="result-header">
              <h3>压缩结果</h3>
              <div class="result-actions">
                <button id="download-all" class="btn btn-sm" disabled><i class="fa fa-download"></i> 下载全部</button>
                <button id="download-zip" class="btn btn-sm" disabled><i class="fa fa-file-archive-o"></i> 打包下载</button>
              </div>
            </div>
            
            <div class="compressor-results" id="compressor-results">
              <div class="no-results">请选择图片并点击"压缩图片"按钮</div>
            </div>
          </div>
        </div>
        
        <div class="compressor-info">
          <div class="info-header">
            <h3>图片压缩说明</h3>
          </div>
          <div class="info-content">
            <div class="info-item">
              <h4>关于图片压缩</h4>
              <p>图片压缩是通过降低图片质量或调整图片尺寸来减小文件大小的过程。这对于网站优化、节省存储空间和提高加载速度非常有用。</p>
            </div>
            
            <div class="info-item">
              <h4>压缩质量</h4>
              <p>质量滑块控制压缩程度，较低的值会产生更小的文件，但可能会降低图像质量。对于大多数用途，70-85%的质量设置通常能在文件大小和视觉质量之间取得良好平衡。</p>
            </div>
            
            <div class="info-item">
              <h4>调整尺寸</h4>
              <p>如果指定了最大宽度或高度，图片将按比例缩小至不超过指定尺寸。这对于准备用于网站的大图片特别有用。</p>
            </div>
            
            <div class="info-item">
              <h4>支持的格式</h4>
              <p>此工具支持常见的图片格式，包括JPG、PNG、WebP和GIF。不同格式适用于不同用途：</p>
              <ul>
                <li>JPG：适合照片和复杂图像，有损压缩</li>
                <li>PNG：适合需要透明度的图像，无损压缩</li>
                <li>WebP：现代格式，提供更好的压缩率和质量</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('imageCompressor', container.querySelector('.tool-header'));
      
      // 获取元素
      const imageInput = container.querySelector('#image-input');
      const fileCount = container.querySelector('#file-count');
      const dragArea = container.querySelector('#drag-area');
      const qualitySlider = container.querySelector('#quality-slider');
      const qualityValue = container.querySelector('#quality-value');
      const maxWidth = container.querySelector('#max-width');
      const maxHeight = container.querySelector('#max-height');
      const formatSame = container.querySelector('#format-same');
      const formatJpg = container.querySelector('#format-jpg');
      const formatPng = container.querySelector('#format-png');
      const formatWebp = container.querySelector('#format-webp');
      const compressBtn = container.querySelector('#compress-btn');
      const clearBtn = container.querySelector('#clear-btn');
      const downloadAll = container.querySelector('#download-all');
      const downloadZip = container.querySelector('#download-zip');
      const resultsContainer = container.querySelector('#compressor-results');
      
      // 存储选择的文件
      let selectedFiles = [];
      
      // 存储压缩结果
      let compressedImages = [];
      
      // 更新质量显示
      qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = `${qualitySlider.value}%`;
      });
      
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
        handleFiles(e.dataTransfer.files);
      });
      
      // 处理选择的文件
      function handleFiles(files) {
        if (!files || files.length === 0) return;
        
        // 过滤出图片文件
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
          showToast('请选择有效的图片文件', 'warning');
          return;
        }
        
        selectedFiles = imageFiles;
        fileCount.textContent = `已选择 ${selectedFiles.length} 个文件`;
        
        // 启用按钮
        compressBtn.disabled = false;
        clearBtn.disabled = false;
        
        // 显示预览
        showPreviews();
      }
      
      // 显示图片预览
      function showPreviews() {
        resultsContainer.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
          const reader = new FileReader();
          
          reader.onload = (e) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
              <div class="preview-image-container">
                <img src="${e.target.result}" class="preview-image" alt="${file.name}" />
              </div>
              <div class="preview-info">
                <div class="preview-name">${file.name}</div>
                <div class="preview-size">${formatFileSize(file.size)}</div>
              </div>
            `;
            
            resultsContainer.appendChild(previewItem);
          };
          
          reader.readAsDataURL(file);
        });
      }
      
      // 压缩图片
      compressBtn.addEventListener('click', async () => {
        if (selectedFiles.length === 0) {
          showToast('请先选择图片', 'warning');
          return;
        }
        
        // 获取压缩选项
        const quality = parseInt(qualitySlider.value) / 100;
        const maxWidthValue = maxWidth.value ? parseInt(maxWidth.value) : null;
        const maxHeightValue = maxHeight.value ? parseInt(maxHeight.value) : null;
        
        // 获取输出格式
        let outputFormat = null;
        if (!formatSame.checked) {
          outputFormat = document.querySelector('input[name="output-format"]:checked').value;
        }
        
        // 显示加载状态
        resultsContainer.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i> 正在压缩图片，请稍候...</div>';
        
        // 清空之前的结果
        compressedImages = [];
        
        try {
          // 逐个处理图片
          for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            await compressImage(file, quality, maxWidthValue, maxHeightValue, outputFormat, i);
          }
          
          // 显示结果
          displayResults();
          
          // 启用下载按钮
          downloadAll.disabled = false;
          downloadZip.disabled = false;
          
          showToast('图片压缩完成', 'success');
        } catch (error) {
          resultsContainer.innerHTML = `<div class="error">压缩过程中出错: ${error.message}</div>`;
          showToast('压缩失败', 'error');
        }
      });
      
      // 压缩单个图片
      async function compressImage(file, quality, maxWidth, maxHeight, outputFormat, index) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          
          reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
              try {
                // 创建画布
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // 调整尺寸
                if (maxWidth && width > maxWidth) {
                  height = (height * maxWidth) / width;
                  width = maxWidth;
                }
                
                if (maxHeight && height > maxHeight) {
                  width = (width * maxHeight) / height;
                  height = maxHeight;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // 绘制图像
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
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
                    reject(new Error('无法创建Blob'));
                    return;
                  }
                  
                  // 获取文件扩展名
                  let extension = 'jpg';
                  if (format === 'image/png') extension = 'png';
                  else if (format === 'image/webp') extension = 'webp';
                  
                  // 生成文件名
                  const fileName = file.name.replace(/\.[^/.]+$/, '') + '_compressed.' + extension;
                  
                  // 存储结果
                  compressedImages.push({
                    original: file,
                    compressed: blob,
                    fileName: fileName,
                    originalSize: file.size,
                    compressedSize: blob.size,
                    width: width,
                    height: height
                  });
                  
                  resolve();
                }, format, compressionQuality);
              } catch (error) {
                reject(error);
              }
            };
            
            img.onerror = () => {
              reject(new Error('图片加载失败'));
            };
            
            img.src = e.target.result;
          };
          
          reader.onerror = () => {
            reject(new Error('文件读取失败'));
          };
          
          reader.readAsDataURL(file);
        });
      }
      
      // 显示压缩结果
      function displayResults() {
        if (compressedImages.length === 0) {
          resultsContainer.innerHTML = '<div class="no-results">没有压缩结果</div>';
          return;
        }
        
        resultsContainer.innerHTML = '';
        
        let totalOriginalSize = 0;
        let totalCompressedSize = 0;
        
        compressedImages.forEach((item, index) => {
          totalOriginalSize += item.originalSize;
          totalCompressedSize += item.compressedSize;
          
          const savingsPercent = ((item.originalSize - item.compressedSize) / item.originalSize * 100).toFixed(1);
          
          const resultItem = document.createElement('div');
          resultItem.className = 'result-item';
          
          resultItem.innerHTML = `
            <div class="result-image-container">
              <img src="${URL.createObjectURL(item.compressed)}" class="result-image" alt="${item.fileName}" />
            </div>
            <div class="result-info">
              <div class="result-name">${item.fileName}</div>
              <div class="result-size">
                <span class="original-size">${formatFileSize(item.originalSize)}</span>
                <i class="fa fa-arrow-right"></i>
                <span class="compressed-size">${formatFileSize(item.compressedSize)}</span>
                <span class="savings">(节省 ${savingsPercent}%)</span>
              </div>
              <div class="result-dimensions">${item.width} × ${item.height} px</div>
            </div>
            <div class="result-actions">
              <button class="btn btn-sm download-btn" data-index="${index}"><i class="fa fa-download"></i> 下载</button>
            </div>
          `;
          
          resultsContainer.appendChild(resultItem);
        });
        
        // 添加总结信息
        const totalSavingsPercent = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
        
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
          <div class="summary-info">
            <div class="summary-title">总计 ${compressedImages.length} 个文件</div>
            <div class="summary-size">
              <span class="original-size">${formatFileSize(totalOriginalSize)}</span>
              <i class="fa fa-arrow-right"></i>
              <span class="compressed-size">${formatFileSize(totalCompressedSize)}</span>
              <span class="savings">(节省 ${totalSavingsPercent}%)</span>
            </div>
          </div>
        `;
        
        resultsContainer.appendChild(summaryItem);
        
        // 添加下载按钮事件
        resultsContainer.querySelectorAll('.download-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            downloadCompressedImage(index);
          });
        });
      }
      
      // 下载单个压缩图片
      function downloadCompressedImage(index) {
        const item = compressedImages[index];
        if (!item) return;
        
        const url = URL.createObjectURL(item.compressed);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      // 下载所有压缩图片
      downloadAll.addEventListener('click', () => {
        if (compressedImages.length === 0) {
          showToast('没有可下载的图片', 'warning');
          return;
        }
        
        compressedImages.forEach((item, index) => {
          // 延迟下载，避免浏览器阻止多个下载
          setTimeout(() => {
            downloadCompressedImage(index);
          }, index * 300);
        });
        
        showToast(`正在下载 ${compressedImages.length} 个文件`, 'info');
      });
      
      // 打包下载
      downloadZip.addEventListener('click', () => {
        if (compressedImages.length === 0) {
          showToast('没有可下载的图片', 'warning');
          return;
        }
        
        // 检查是否有JSZip库
        if (!window.JSZip) {
          showToast('正在加载JSZip库...', 'info');
          
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
          document.head.appendChild(script);
          
          script.onload = () => {
            createAndDownloadZip();
          };
          
          script.onerror = () => {
            showToast('无法加载JSZip库，请检查网络连接', 'error');
          };
        } else {
          createAndDownloadZip();
        }
      });
      
      // 创建并下载ZIP文件
      function createAndDownloadZip() {
        const zip = new JSZip();
        let count = 0;
        
        // 添加所有图片到ZIP
        compressedImages.forEach(item => {
          zip.file(item.fileName, item.compressed);
        });
        
        // 生成ZIP文件
        zip.generateAsync({ type: 'blob' }).then(content => {
          // 下载ZIP文件
          const url = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = url;
          a.download = `compressed_images_${new Date().toISOString().slice(0, 10)}.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          showToast('ZIP文件下载已开始', 'success');
        }).catch(err => {
          showToast('创建ZIP文件失败: ' + err.message, 'error');
        });
      }
      
      // 清空
      clearBtn.addEventListener('click', () => {
        selectedFiles = [];
        compressedImages = [];
        imageInput.value = '';
        fileCount.textContent = '未选择文件';
        resultsContainer.innerHTML = '<div class="no-results">请选择图片并点击"压缩图片"按钮</div>';
        
        // 禁用按钮
        compressBtn.disabled = true;
        clearBtn.disabled = true;
        downloadAll.disabled = true;
        downloadZip.disabled = true;
      });
      
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
        .compressor-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .compressor-input-section {
          flex: 1;
          min-width: 300px;
        }
        
        .compressor-result-section {
          flex: 2;
          min-width: 400px;
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
        
        .compressor-options {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
        }
        
        .range-with-value {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .range-with-value input {
          flex: 1;
        }
        
        .input-with-unit {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .input-with-unit .unit {
          color: var(--text-muted);
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
        
        .compressor-actions {
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
        
        .compressor-results {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
          max-height: 600px;
          overflow-y: auto;
        }
        
        .no-results, .loading, .error {
          padding: 30px;
          text-align: center;
          color: var(--text-muted);
        }
        
        .loading i {
          margin-right: 10px;
        }
        
        .error {
          color: #e74c3c;
        }
        
        .preview-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .preview-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .preview-image-container {
          width: 80px;
          height: 80px;
          margin-right: 15px;
          border-radius: 4px;
          overflow: hidden;
          background-color: var(--bg-color);
        }
        
        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .preview-info {
          flex-grow: 1;
        }
        
        .preview-name {
          margin-bottom: 5px;
          word-break: break-all;
        }
        
        .preview-size {
          color: var(--text-muted);
          font-size: 14px;
        }
        
        .result-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .result-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .result-image-container {
          width: 80px;
          height: 80px;
          margin-right: 15px;
          border-radius: 4px;
          overflow: hidden;
          background-color: var(--bg-color);
        }
        
        .result-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .result-info {
          flex-grow: 1;
        }
        
        .result-name {
          margin-bottom: 5px;
          word-break: break-all;
        }
        
        .result-size {
          margin-bottom: 5px;
        }
        
        .original-size {
          text-decoration: line-through;
          color: var(--text-muted);
        }
        
        .compressed-size {
          color: var(--primary-color);
          font-weight: 500;
        }
        
        .savings {
          color: #2ecc71;
          margin-left: 5px;
        }
        
        .result-dimensions {
          color: var(--text-muted);
          font-size: 14px;
        }
        
        .summary-item {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 2px solid var(--border-color);
        }
        
        .summary-title {
          font-weight: 500;
          margin-bottom: 5px;
        }
        
        .compressor-info {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .info-header {
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .info-header h3 {
          margin: 0;
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
        
        @media (max-width: 768px) {
          .compressor-container {
            flex-direction: column;
          }
        }
      `;
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.imageCompressor = tool;
})();
