/**
 * 多宝工具箱 - 颜色转换工具 - 转换器模块
 */
const utils = require('./utils');

const converter = {
  // 初始化转换器
  initConverter: function(container) {
    // 获取元素
    const colorPreview = container.querySelector('#color-preview');
    const colorPreviewText = container.querySelector('#color-preview-text');
    
    const hexInput = container.querySelector('#hex-input');
    const rgbRInput = container.querySelector('#rgb-r');
    const rgbGInput = container.querySelector('#rgb-g');
    const rgbBInput = container.querySelector('#rgb-b');
    const hslHInput = container.querySelector('#hsl-h');
    const hslSInput = container.querySelector('#hsl-s');
    const hslLInput = container.querySelector('#hsl-l');
    const namedColorSelect = container.querySelector('#named-color');
    
    const convertHexBtn = container.querySelector('#convert-hex');
    const convertRgbBtn = container.querySelector('#convert-rgb');
    const convertHslBtn = container.querySelector('#convert-hsl');
    const convertNamedBtn = container.querySelector('#convert-named');
    
    const outputHex = container.querySelector('#output-hex');
    const outputRgb = container.querySelector('#output-rgb');
    const outputRgba = container.querySelector('#output-rgba');
    const outputHsl = container.querySelector('#output-hsl');
    const outputHsla = container.querySelector('#output-hsla');
    const outputNamed = container.querySelector('#output-named');
    const outputCmyk = container.querySelector('#output-cmyk');
    const outputHwb = container.querySelector('#output-hwb');
    
    const copyAllBtn = container.querySelector('#copy-all');
    
    // 更新颜色预览
    const updateColorPreview = (color) => {
      colorPreview.style.backgroundColor = color;
      colorPreviewText.textContent = color;
    };
    
    // 更新输出结果
    const updateOutputs = (r, g, b) => {
      // HEX
      const hex = utils.rgbToHex(r, g, b);
      outputHex.textContent = hex;
      
      // RGB
      outputRgb.textContent = `rgb(${r}, ${g}, ${b})`;
      
      // RGBA
      outputRgba.textContent = `rgba(${r}, ${g}, ${b}, 1)`;
      
      // HSL
      const hsl = utils.rgbToHsl(r, g, b);
      outputHsl.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      
      // HSLA
      outputHsla.textContent = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`;
      
      // CMYK
      const cmyk = utils.rgbToCmyk(r, g, b);
      outputCmyk.textContent = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
      
      // HWB
      const hwb = utils.rgbToHwb(r, g, b);
      outputHwb.textContent = `hwb(${hwb.h}, ${hwb.w}%, ${hwb.b}%)`;
      
      // 命名颜色
      const namedColor = this.findClosestNamedColor(hex, namedColorSelect);
      if (namedColor && namedColor.hex.toLowerCase() === hex.toLowerCase()) {
        outputNamed.textContent = namedColor.name;
      } else {
        outputNamed.textContent = '-';
      }
      
      // 更新颜色预览
      updateColorPreview(hex);
    };
    
    // 从HEX输入转换
    const convertFromHex = () => {
      let hex = hexInput.value.trim();
      
      // 验证HEX格式
      if (!hex.match(/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)) {
        utils.showToast('无效的HEX颜色格式', 'error');
        return;
      }
      
      // 确保有#前缀
      if (!hex.startsWith('#')) {
        hex = '#' + hex;
        hexInput.value = hex;
      }
      
      // 转换为RGB
      const rgb = utils.hexToRgb(hex);
      
      // 更新RGB输入
      rgbRInput.value = rgb.r;
      rgbGInput.value = rgb.g;
      rgbBInput.value = rgb.b;
      
      // 转换为HSL
      const hsl = utils.rgbToHsl(rgb.r, rgb.g, rgb.b);
      
      // 更新HSL输入
      hslHInput.value = hsl.h;
      hslSInput.value = hsl.s;
      hslLInput.value = hsl.l;
      
      // 更新输出
      updateOutputs(rgb.r, rgb.g, rgb.b);
    };
    
    // 从RGB输入转换
    const convertFromRgb = () => {
      const r = parseInt(rgbRInput.value) || 0;
      const g = parseInt(rgbGInput.value) || 0;
      const b = parseInt(rgbBInput.value) || 0;
      
      // 验证RGB范围
      if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        utils.showToast('RGB值必须在0-255之间', 'error');
        return;
      }
      
      // 转换为HEX
      const hex = utils.rgbToHex(r, g, b);
      
      // 更新HEX输入
      hexInput.value = hex;
      
      // 转换为HSL
      const hsl = utils.rgbToHsl(r, g, b);
      
      // 更新HSL输入
      hslHInput.value = hsl.h;
      hslSInput.value = hsl.s;
      hslLInput.value = hsl.l;
      
      // 更新输出
      updateOutputs(r, g, b);
    };
    
    // 从HSL输入转换
    const convertFromHsl = () => {
      const h = parseInt(hslHInput.value) || 0;
      const s = parseInt(hslSInput.value) || 0;
      const l = parseInt(hslLInput.value) || 0;
      
      // 验证HSL范围
      if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) {
        utils.showToast('HSL值超出范围', 'error');
        return;
      }
      
      // 转换为RGB
      const rgb = utils.hslToRgb(h, s, l);
      
      // 更新RGB输入
      rgbRInput.value = rgb.r;
      rgbGInput.value = rgb.g;
      rgbBInput.value = rgb.b;
      
      // 转换为HEX
      const hex = utils.rgbToHex(rgb.r, rgb.g, rgb.b);
      
      // 更新HEX输入
      hexInput.value = hex;
      
      // 更新输出
      updateOutputs(rgb.r, rgb.g, rgb.b);
    };
    
    // 从命名颜色转换
    const convertFromNamed = () => {
      const colorName = namedColorSelect.value;
      const colorText = namedColorSelect.options[namedColorSelect.selectedIndex].text;
      const hex = colorText.split(' - ')[1];
      
      // 更新HEX输入
      hexInput.value = hex;
      
      // 转换为RGB
      const rgb = utils.hexToRgb(hex);
      
      // 更新RGB输入
      rgbRInput.value = rgb.r;
      rgbGInput.value = rgb.g;
      rgbBInput.value = rgb.b;
      
      // 转换为HSL
      const hsl = utils.rgbToHsl(rgb.r, rgb.g, rgb.b);
      
      // 更新HSL输入
      hslHInput.value = hsl.h;
      hslSInput.value = hsl.s;
      hslLInput.value = hsl.l;
      
      // 更新输出
      updateOutputs(rgb.r, rgb.g, rgb.b);
    };
    
    // 复制所有格式
    const copyAllFormats = () => {
      const formats = [
        `HEX: ${outputHex.textContent}`,
        `RGB: ${outputRgb.textContent}`,
        `RGBA: ${outputRgba.textContent}`,
        `HSL: ${outputHsl.textContent}`,
        `HSLA: ${outputHsla.textContent}`,
        `CMYK: ${outputCmyk.textContent}`,
        `HWB: ${outputHwb.textContent}`
      ];
      
      if (outputNamed.textContent !== '-') {
        formats.push(`命名颜色: ${outputNamed.textContent}`);
      }
      
      const text = formats.join('\n');
      utils.copyToClipboard(text);
    };
    
    // 事件监听
    convertHexBtn.addEventListener('click', convertFromHex);
    convertRgbBtn.addEventListener('click', convertFromRgb);
    convertHslBtn.addEventListener('click', convertFromHsl);
    convertNamedBtn.addEventListener('click', convertFromNamed);
    
    copyAllBtn.addEventListener('click', copyAllFormats);
    
    // 复制按钮
    container.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const targetElement = container.querySelector(`#${targetId}`);
        if (targetElement && targetElement.textContent !== '-') {
          utils.copyToClipboard(targetElement.textContent);
        }
      });
    });
    
    // 初始化
    convertFromHex();
  },
  
  // 查找最接近的命名颜色
  findClosestNamedColor: function(hex, namedColorSelect) {
    // 移除#号并转换为小写
    hex = hex.replace(/^#/, '').toLowerCase();
    
    // 遍历所有选项
    let closestColor = null;
    let closestDistance = Infinity;
    
    Array.from(namedColorSelect.options).forEach(option => {
      const colorHex = option.text.split(' - ')[1].replace(/^#/, '').toLowerCase();
      
      // 计算颜色距离
      const distance = utils.calculateColorDistance(hex, colorHex);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestColor = {
          name: option.text.split(' - ')[0],
          value: option.value,
          hex: '#' + colorHex
        };
      }
    });
    
    // 如果距离太远，认为没有匹配的命名颜色
    if (closestDistance > 10) {
      return null;
    }
    
    return closestColor;
  }
};

module.exports = converter;