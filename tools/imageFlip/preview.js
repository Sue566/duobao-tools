/**
 * 多宝工具箱 - 图片对称反转工具 - 预览模块
 */
const core = require('./core');
const partialFlip = require('./partialFlip');

const preview = {
  // 显示图片预览
  showPreview: function(file, previewSection, previewContainer, customSelection, onPreviewReady) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      // 显示预览区域
      previewSection.style.display = 'block';
      
      // 创建图像对象
      const previewImage = new Image();
      previewImage.onload = () => {
        // 创建预览画布
        const previewCanvas = document.createElement('canvas');
        previewContainer.appendChild(previewCanvas);
        const previewCtx = previewCanvas.getContext('2d');
        
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
        if (customSelection) {
          customSelection.x = 0;
          customSelection.y = 0;
          customSelection.width = width;
          customSelection.height = height;
          customSelection.active = false;
        }
        
        // 设置自定义区域选择
        const selectionArea = partialFlip.setupCustomAreaSelection(
          previewCanvas, 
          previewContainer, 
          customSelection
        );
        
        // 回调函数，传递预览相关对象
        if (onPreviewReady) {
          onPreviewReady({
            canvas: previewCanvas,
            ctx: previewCtx,
            image: previewImage,
            selectionArea: selectionArea
          });
        }
      };
      
      previewImage.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
  },
  
  // 更新预览
  updatePreview: function(previewCanvas, previewCtx, previewImage, options, customSelection, selectionArea) {
    core.updatePreview(
      previewCanvas,
      previewCtx,
      previewImage,
      options,
      customSelection,
      selectionArea
    );
  }
};

module.exports = preview;