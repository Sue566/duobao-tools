/**
 * 多宝工具箱 - 图片对称反转工具 - 下载模块
 */
const utils = require('./utils');

const download = {
  // 下载单个图片
  downloadImage: function(image) {
    if (!image || !image.blob) {
      utils.showToast('没有可下载的图片', 'warning');
      return;
    }
    
    utils.createDownloadLink(image.blob, image.fileName);
    utils.showToast('图片下载已开始', 'success');
  },
  
  // 下载所有图片
  downloadAllImages: function(images) {
    if (!images || images.length === 0) {
      utils.showToast('没有可下载的图片', 'warning');
      return;
    }
    
    // 逐个下载图片
    images.forEach((image, index) => {
      // 延迟下载，避免浏览器阻止多个下载
      setTimeout(() => {
        this.downloadImage(image);
      }, index * 300);
    });
    
    utils.showToast(`开始下载${images.length}张图片`, 'success');
  },
  
  // 打包下载
  downloadZipImages: function(images, downloadZipBtn) {
    if (!images || images.length === 0) {
      utils.showToast('没有可下载的图片', 'warning');
      return;
    }
    
    // 显示加载状态
    const originalBtnText = downloadZipBtn.innerHTML;
    downloadZipBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> 正在打包...';
    downloadZipBtn.disabled = true;
    
    // 创建并下载ZIP文件
    utils.createAndDownloadZip(
      images,
      'flipped_images.zip',
      null,
      () => {
        // 恢复按钮状态
        downloadZipBtn.innerHTML = originalBtnText;
        downloadZipBtn.disabled = false;
        utils.showToast('图片打包下载已开始', 'success');
      },
      (err) => {
        // 恢复按钮状态
        downloadZipBtn.innerHTML = originalBtnText;
        downloadZipBtn.disabled = false;
        utils.showToast('打包失败: ' + err.message, 'error');
      }
    );
  },
  
  // 显示反转结果
  displayResults: function(resultsContainer, flippedImages, onDownloadClick) {
    if (!flippedImages || flippedImages.length === 0) {
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
            <span>${utils.formatFileSize(image.flippedSize)}</span>
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
        if (onDownloadClick) {
          onDownloadClick(index);
        } else {
          this.downloadImage(flippedImages[index]);
        }
      });
    });
  }
};

module.exports = download;