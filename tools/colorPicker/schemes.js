/**
 * 多宝工具箱 - 颜色选择器 (颜色方案模块)
 */

import { hslToHex } from './colorUtils.js';

/**
 * 更新颜色方案
 * @param {HTMLElement} colorScheme - 颜色方案容器元素
 * @param {string} type - 方案类型
 * @param {Object} currentColor - 当前颜色 {h, s, l, a}
 * @param {Function} setColorFromHex - 设置颜色的回调函数
 * @param {Function} showToast - 显示提示的函数
 */
export function updateColorScheme(colorScheme, type, currentColor, setColorFromHex, showToast) {
  const h = currentColor.h;
  const s = currentColor.s;
  const l = currentColor.l;
  
  let colors = [];
  
  switch (type) {
    case 'monochromatic':
      // 单色方案：保持色调不变，改变亮度和饱和度
      colors = [
        { h, s, l: Math.max(l - 30, 10) },
        { h, s: Math.min(s + 10, 100), l: Math.max(l - 15, 20) },
        { h, s, l },
        { h, s: Math.max(s - 10, 0), l: Math.min(l + 15, 90) },
        { h, s, l: Math.min(l + 30, 90) }
      ];
      break;
      
    case 'analogous':
      // 类似色方案：相邻色调
      colors = [
        { h: (h - 30 + 360) % 360, s, l },
        { h: (h - 15 + 360) % 360, s, l },
        { h, s, l },
        { h: (h + 15) % 360, s, l },
        { h: (h + 30) % 360, s, l }
      ];
      break;
      
    case 'complementary':
      // 互补色方案：对立色调
      const complementary = (h + 180) % 360;
      colors = [
        { h, s: Math.max(s - 10, 0), l: Math.max(l - 10, 10) },
        { h, s, l },
        { h, s: Math.min(s + 10, 100), l: Math.min(l + 10, 90) },
        { h: complementary, s: Math.max(s - 10, 0), l: Math.max(l - 10, 10) },
        { h: complementary, s, l }
      ];
      break;
      
    case 'triadic':
      // 三色方案：三等分色环
      colors = [
        { h, s, l },
        { h: (h + 120) % 360, s, l },
        { h: (h + 240) % 360, s, l },
        { h: (h + 120) % 360, s: Math.min(s + 10, 100), l: Math.min(l + 10, 90) },
        { h: (h + 240) % 360, s: Math.min(s + 10, 100), l: Math.min(l + 10, 90) }
      ];
      break;
      
    case 'tetradic':
      // 四色方案：四等分色环
      colors = [
        { h, s, l },
        { h: (h + 90) % 360, s, l },
        { h: (h + 180) % 360, s, l },
        { h: (h + 270) % 360, s, l },
        { h: (h + 180) % 360, s: Math.min(s + 10, 100), l: Math.min(l + 10, 90) }
      ];
      break;
      
    case 'split-complementary':
      // 分离互补色方案：互补色的邻近色
      colors = [
        { h, s, l },
        { h: (h + 150) % 360, s, l },
        { h: (h + 210) % 360, s, l },
        { h: (h + 150) % 360, s: Math.min(s + 10, 100), l: Math.min(l + 10, 90) },
        { h: (h + 210) % 360, s: Math.min(s + 10, 100), l: Math.min(l + 10, 90) }
      ];
      break;
  }
  
  // 更新颜色方案显示
  colorScheme.innerHTML = '';
  
  colors.forEach(color => {
    const hex = hslToHex(color.h, color.s, color.l);
    const colorElement = document.createElement('div');
    colorElement.className = 'scheme-color';
    colorElement.style.backgroundColor = hex;
    colorElement.setAttribute('data-color', hex);
    colorElement.setAttribute('title', hex);
    
    // 点击颜色块设置为当前颜色
    colorElement.addEventListener('click', () => {
      setColorFromHex(hex);
      showToast(`已选择颜色: ${hex}`, 'info');
    });
    
    colorScheme.appendChild(colorElement);
  });
}

/**
 * 更新颜色和谐
 * @param {HTMLElement} colorHarmonies - 颜色和谐容器元素
 * @param {Object} currentColor - 当前颜色 {h, s, l, a}
 * @param {Function} setColorFromHex - 设置颜色的回调函数
 * @param {Function} showToast - 显示提示的函数
 */
export function updateColorHarmonies(colorHarmonies, currentColor, setColorFromHex, showToast) {
  const h = currentColor.h;
  const s = currentColor.s;
  const l = currentColor.l;
  
  // 定义不同的和谐关系
  const harmonies = [
    { name: '互补色', colors: [{ h, s, l }, { h: (h + 180) % 360, s, l }] },
    { name: '三分色', colors: [{ h, s, l }, { h: (h + 120) % 360, s, l }, { h: (h + 240) % 360, s, l }] },
    { name: '分离互补', colors: [{ h, s, l }, { h: (h + 150) % 360, s, l }, { h: (h + 210) % 360, s, l }] },
    { name: '类似色', colors: [{ h: (h - 30 + 360) % 360, s, l }, { h, s, l }, { h: (h + 30) % 360, s, l }] }
  ];
  
  // 更新和谐显示
  colorHarmonies.innerHTML = '';
  
  harmonies.forEach(harmony => {
    const harmonyContainer = document.createElement('div');
    harmonyContainer.className = 'harmony-item';
    
    const harmonyTitle = document.createElement('div');
    harmonyTitle.className = 'harmony-title';
    harmonyTitle.textContent = harmony.name;
    harmonyContainer.appendChild(harmonyTitle);
    
    const harmonyColors = document.createElement('div');
    harmonyColors.className = 'harmony-colors';
    
    harmony.colors.forEach(color => {
      const hex = hslToHex(color.h, color.s, color.l);
      const colorElement = document.createElement('div');
      colorElement.className = 'harmony-color';
      colorElement.style.backgroundColor = hex;
      colorElement.setAttribute('data-color', hex);
      colorElement.setAttribute('title', hex);
      
      // 点击颜色块设置为当前颜色
      colorElement.addEventListener('click', () => {
        setColorFromHex(hex);
        showToast(`已选择颜色: ${hex}`, 'info');
      });
      
      harmonyColors.appendChild(colorElement);
    });
    
    harmonyContainer.appendChild(harmonyColors);
    colorHarmonies.appendChild(harmonyContainer);
  });
}