/**
 * 多宝工具箱 - 图片对称反转工具 - 核心功能模块
 */
const utils = require('./utils');
const imageAdjust = require('./imageAdjust');
const partialFlip = require('./partialFlip');

const core = {
  // 反转图片处理
  flipImage: function(file, options, callback) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // 创建画布
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        
        // 根据部分反转模式选择处理方法
        if (options.partialMode === 'disabled' || options.partialMode === 'custom') {
          // 全图反转或自定义区域反转
          this.applyFullFlip(ctx, img, options.direction);
        } else {
          // 部分区域反转
          partialFlip.applyPartialFlip(ctx, img, options);
        }
        
        // 应用图像调整
        if (options.brightness !== 0 || options.contrast !== 0 || 
            options.saturation !== 0 || options.grayscale) {
          imageAdjust.applyImageAdjustments(ctx, canvas, options);
        }
        
        // 确定输出格式
        let format = options.outputFormat;
        if (!format || format === 'same') {
          format = file.type;
        }
        
        // 对于PNG，质量参数无效，所以我们使用默认值
        const compressionQuality = format === 'image/png' ? undefined : options.quality;
        
        // 转换为Blob
        canvas.toBlob((blob) => {
          if (!blob) {
            if (callback) callback(new Error('无法创建图片数据'));
            return;
          }
          
          // 获取文件扩展名
          let extension = 'jpg';
          if (format === 'image/png') extension = 'png';
          else if (format === 'image/webp') extension = 'webp';
          else if (format === 'image/gif') extension = 'gif';
          
          // 生成文件名
          const fileName = file.name.replace(/\.[^/.]+$/, '') + '_flipped.' + extension;
          
          // 创建结果对象
          const result = {
            blob: blob,
            fileName: fileName,
            originalSize: file.size,
            flippedSize: blob.size,
            width: img.width,
            height: img.height,
            format: format,
            originalName: file.name
          };
          
          // 调用回调
          if (callback) callback(null, result);
        }, format, compressionQuality);
      };
      
      img.onerror = () => {
        console.error('图片加载失败');
        if (callback) callback(new Error('图片加载失败'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      console.error('文件读取失败');
      if (callback) callback(new Error('文件读取失败'));
    };
    
    reader.readAsDataURL(file);
  },
  
  // 应用全图反转
  applyFullFlip: function(ctx, img, direction) {
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
  },
  
  // 更新预览
  updatePreview: function(previewCanvas, previewCtx, previewImage, options, customSelection, selectionArea) {
    if (!previewCanvas || !previewCtx || !previewImage) return;
    
    // 清除画布
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    // 保存画布状态
    previewCtx.save();
    
    // 应用反转变换
    if (options.partialMode === 'disabled' || options.partialMode === 'custom') {
      // 全图反转或自定义区域反转
      this.applyFullFlip(previewCtx, previewImage, options.direction);
    } else {
      // 部分区域反转
      partialFlip.applyPartialFlip(previewCtx, previewImage, options, previewCanvas);
    }
    
    // 恢复画布状态
    previewCtx.restore();
    
    // 应用图像调整
    if (options.brightness !== 0 || options.contrast !== 0 || 
        options.saturation !== 0 || options.grayscale) {
      imageAdjust.applyImageAdjustments(previewCtx, previewCanvas, options);
    }
    
    // 如果是自定义区域反转，绘制选区
    if (options.partialMode === 'custom') {
      if (selectionArea) {
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
    } else {
      if (selectionArea) selectionArea.style.display = 'none';
    }
  }
};

module.exports = core;