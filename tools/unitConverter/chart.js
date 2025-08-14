/**
 * 单位转换器 - 图表可视化模块
 * 提供单位转换的可视化图表功能
 */

(function() {
  'use strict';
  
  // 私有变量
  let chartContainer = null;
  let baseValue = 1;
  let baseUnit = '';
  let targetUnits = [];
  let conversionValues = [];
  let colors = [
    '#4285F4', '#EA4335', '#FBBC05', '#34A853', 
    '#5E35B1', '#D81B60', '#00ACC1', '#43A047',
    '#8E24AA', '#E53935', '#1E88E5', '#00897B'
  ];
  
  /**
   * 初始化图表模块
   * @param {HTMLElement} container - 图表容器元素
   */
  function init(container) {
    if (!container) return;
    
    // 创建图表容器
    chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    chartContainer.innerHTML = `
      <h3>单位转换可视化</h3>
      <div class="unit-chart"></div>
      <button class="btn btn-secondary chart-close-btn">关闭图表</button>
    `;
    
    container.appendChild(chartContainer);
    
    // 绑定关闭按钮事件
    const closeBtn = chartContainer.querySelector('.chart-close-btn');
    closeBtn.addEventListener('click', hideChart);
  }
  
  /**
   * 显示单位转换图表
   * @param {number} value - 基准值
   * @param {string} fromUnit - 基准单位
   * @param {Array} results - 转换结果数组，每项包含 {unit, value}
   */
  function showChart(value, fromUnit, results) {
    if (!chartContainer) return;
    
    baseValue = value;
    baseUnit = fromUnit;
    targetUnits = [];
    conversionValues = [];
    
    // 提取数据
    results.forEach(result => {
      targetUnits.push(result.unit);
      conversionValues.push(result.value);
    });
    
    // 渲染图表
    renderBarChart();
    
    // 显示图表容器
    chartContainer.style.display = 'block';
  }
  
  /**
   * 隐藏图表
   */
  function hideChart() {
    if (chartContainer) {
      chartContainer.style.display = 'none';
    }
  }
  
  /**
   * 渲染条形图
   */
  function renderBarChart() {
    const chartElement = chartContainer.querySelector('.unit-chart');
    chartElement.innerHTML = '';
    
    // 找出最大值用于计算比例
    const maxValue = Math.max(...conversionValues);
    
    // 为每个转换结果创建条形图
    conversionValues.forEach((value, index) => {
      const percentage = (value / maxValue) * 100;
      const color = colors[index % colors.length];
      
      const chartItem = document.createElement('div');
      chartItem.className = 'chart-item';
      chartItem.innerHTML = `
        <div class="chart-label">${targetUnits[index]}</div>
        <div class="chart-bar">
          <div class="chart-bar-fill" style="width: ${percentage}%; background-color: ${color};">
            <span class="chart-value">${value}</span>
          </div>
        </div>
      `;
      
      chartElement.appendChild(chartItem);
    });
    
    // 添加基准单位说明
    const baseInfo = document.createElement('div');
    baseInfo.style.marginTop = '15px';
    baseInfo.style.fontStyle = 'italic';
    baseInfo.textContent = `基准: ${baseValue} ${baseUnit}`;
    chartElement.appendChild(baseInfo);
  }
  
  // 导出公共方法
  window.UnitConverterChart = {
    init: init,
    showChart: showChart,
    hideChart: hideChart
  };
})();