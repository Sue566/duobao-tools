/**
 * 多宝工具箱 - 图片对称反转工具 - 图像调整模块
 */
const utils = require('./utils');

const imageAdjust = {
  // 应用图像调整
  applyImageAdjustments: function(ctx, canvas, options) {
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
      const hsl = utils.rgbToHsl(r, g, b);
      
      // 调整亮度
      hsl[2] = Math.max(0, Math.min(1, hsl[2] + options.brightness / 200));
      
      // 调整对比度
      if (options.contrast !== 0) {
        const factor = (259 * (options.contrast + 255)) / (255 * (259 - options.contrast));
        hsl[2] = Math.max(0, Math.min(1, factor * (hsl[2] - 0.5) + 0.5));
      }
      
      // 调整饱和度
      hsl[1] = Math.max(0, Math.min(1, hsl[1] + options.saturation / 200));
      
      // 灰度处理
      if (options.grayscale) {
        hsl[1] = 0;
      }
      
      // 转换回RGB
      const rgb = utils.hslToRgb(hsl[0], hsl[1], hsl[2]);
      
      // 更新像素数据
      data[i] = rgb[0];
      data[i + 1] = rgb[1];
      data[i + 2] = rgb[2];
    }
    
    // 将处理后的图像数据绘制回画布
    ctx.putImageData(imageData, 0, 0);
  }
};

module.exports = imageAdjust;