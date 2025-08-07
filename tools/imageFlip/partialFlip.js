/**
 * 多宝工具箱 - 图片对称反转工具 - 部分反转模块
 */

const partialFlip = {
  // 应用部分区域反转
  applyPartialFlip: function(ctx, img, options, canvas) {
    // 获取画布尺寸
    const width = canvas ? canvas.width : img.width;
    const height = canvas ? canvas.height : img.height;
    
    // 先绘制原始图像
    ctx.drawImage(img, 0, 0, width, height);
    
    // 创建临时画布
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // 在临时画布上绘制原始图像
    tempCtx.drawImage(img, 0, 0, width, height);
    
    // 根据模式确定反转区域
    let x = 0, y = 0, regionWidth = 0, regionHeight = 0;
    
    switch (options.partialMode) {
      case 'left':
        regionWidth = width / 2;
        regionHeight = height;
        break;
      case 'right':
        x = width / 2;
        regionWidth = width / 2;
        regionHeight = height;
        break;
      case 'top':
        regionWidth = width;
        regionHeight = height / 2;
        break;
      case 'bottom':
        y = height / 2;
        regionWidth = width;
        regionHeight = height / 2;
        break;
      case 'custom':
        if (options.customSelection && options.customSelection.active) {
          x = options.customSelection.x;
          y = options.customSelection.y;
          regionWidth = options.customSelection.width;
          regionHeight = options.customSelection.height;
        } else {
          // 如果没有有效的自定义选区，使用整个图像
          regionWidth = width;
          regionHeight = height;
        }
        break;
    }
    
    // 清除主画布上的对应区域
    ctx.clearRect(x, y, regionWidth, regionHeight);
    
    // 保存临时画布状态
    tempCtx.save();
    
    // 设置裁剪区域
    tempCtx.beginPath();
    tempCtx.rect(x, y, regionWidth, regionHeight);
    tempCtx.clip();
    
    // 清除临时画布
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // 应用反转变换
    if (options.direction === 'horizontal' || options.direction === 'both') {
      tempCtx.translate(tempCanvas.width, 0);
      tempCtx.scale(-1, 1);
    }
    
    if (options.direction === 'vertical' || options.direction === 'both') {
      tempCtx.translate(0, tempCanvas.height);
      tempCtx.scale(1, -1);
    }
    
    // 在临时画布上绘制反转后的图像
    tempCtx.drawImage(img, 0, 0, width, height);
    
    // 恢复临时画布状态
    tempCtx.restore();
    
    // 将临时画布的内容绘制到主画布上
    ctx.drawImage(tempCanvas, 0, 0);
  },
  
  // 设置自定义区域选择
  setupCustomAreaSelection: function(previewCanvas, previewContainer, customSelection) {
    // 创建选区元素
    const selectionArea = document.createElement('div');
    selectionArea.className = 'selection-area';
    selectionArea.style.display = 'none';
    previewContainer.appendChild(selectionArea);
    
    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    
    // 鼠标按下事件
    previewCanvas.addEventListener('mousedown', (e) => {
      const customMode = document.querySelector('#mode-custom');
      if (!customMode || !customMode.checked) return;
      
      isDrawing = true;
      const rect = previewCanvas.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
      
      // 重置选区
      customSelection.x = startX;
      customSelection.y = startY;
      customSelection.width = 0;
      customSelection.height = 0;
      customSelection.active = true;
      
      this.updateSelectionArea(selectionArea, customSelection);
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
      
      this.updateSelectionArea(selectionArea, customSelection);
    });
    
    // 鼠标松开事件
    window.addEventListener('mouseup', () => {
      if (isDrawing) {
        isDrawing = false;
        // 触发预览更新
        const event = new Event('selectionchange');
        previewCanvas.dispatchEvent(event);
      }
    });
    
    return selectionArea;
  },
  
  // 更新选区显示
  updateSelectionArea: function(selectionArea, customSelection) {
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
  },
  
  // 重置选区
  resetSelectionArea: function(previewCanvas, customSelection) {
    if (previewCanvas) {
      customSelection.x = 0;
      customSelection.y = 0;
      customSelection.width = previewCanvas.width;
      customSelection.height = previewCanvas.height;
      customSelection.active = false;
    }
  }
};

module.exports = partialFlip;