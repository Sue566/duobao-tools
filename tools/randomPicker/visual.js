/**
 * 随机选择器 - 可视化模块
 */

// 可视化模块
const RandomPickerVisual = {
  // 创建结果分布图表
  createDistributionChart: function(container, data, title = '结果分布') {
    const chartContainer = container.querySelector('#chart-container');
    if (!chartContainer) return;
    
    // 清除现有图表
    chartContainer.innerHTML = '<canvas id="distribution-chart"></canvas>';
    const canvas = chartContainer.querySelector('#distribution-chart');
    
    // 准备图表数据
    const labels = data.map(item => item.name);
    const values = data.map(item => item.count || 1);
    const colors = data.map((_, index) => RandomPickerUtils.generateRandomColor(index, data.length));
    
    // 创建图表
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '出现次数',
          data: values,
          backgroundColor: colors,
          borderColor: colors.map(color => this.darkenColor(color, 0.1)),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 16
            }
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.raw;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  },
  
  // 创建饼图
  createPieChart: function(container, data, title = '结果分布') {
    const chartContainer = container.querySelector('#chart-container');
    if (!chartContainer) return;
    
    // 清除现有图表
    chartContainer.innerHTML = '<canvas id="pie-chart"></canvas>';
    const canvas = chartContainer.querySelector('#pie-chart');
    
    // 准备图表数据
    const labels = data.map(item => item.name);
    const values = data.map(item => item.count || 1);
    const colors = data.map((_, index) => RandomPickerUtils.generateRandomColor(index, data.length));
    
    // 创建图表
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderColor: '#ffffff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${percentage}%`;
              }
            }
          }
        }
      }
    });
  },
  
  // 创建概率分布图表
  createProbabilityChart: function(container, distribution, title = '概率分布') {
    const chartContainer = container.querySelector('#chart-container');
    if (!chartContainer) return;
    
    // 清除现有图表
    chartContainer.innerHTML = '<canvas id="probability-chart"></canvas>';
    const canvas = chartContainer.querySelector('#probability-chart');
    
    // 准备图表数据
    const sortedDist = [...distribution].sort((a, b) => a.value - b.value);
    const labels = sortedDist.map(item => item.value.toFixed(2));
    const values = sortedDist.map(item => item.probability);
    
    // 创建图表
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: '概率',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 16
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '概率'
            }
          },
          x: {
            title: {
              display: true,
              text: '值'
            }
          }
        }
      }
    });
  },
  
  // 创建模拟结果图表
  createSimulationChart: function(container, results, title = '模拟结果') {
    const chartContainer = container.querySelector('#chart-container');
    if (!chartContainer) return;
    
    // 清除现有图表
    chartContainer.innerHTML = '<canvas id="simulation-chart"></canvas>';
    const canvas = chartContainer.querySelector('#simulation-chart');
    
    // 统计结果
    const countMap = {};
    results.forEach(item => {
      if (!countMap[item]) {
        countMap[item] = 0;
      }
      countMap[item]++;
    });
    
    // 转换为数组并排序
    const data = Object.entries(countMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    // 准备图表数据
    const labels = data.map(item => item.name);
    const values = data.map(item => item.count);
    const colors = data.map((_, index) => RandomPickerUtils.generateRandomColor(index, data.length));
    
    // 创建图表
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '出现次数',
          data: values,
          backgroundColor: colors,
          borderColor: colors.map(color => this.darkenColor(color, 0.1)),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 16
            }
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.raw;
                const total = results.length;
                const percentage = Math.round((value / total) * 100 * 10) / 10;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            },
            title: {
              display: true,
              text: '出现次数'
            }
          },
          x: {
            title: {
              display: true,
              text: '项目'
            }
          }
        }
      }
    });
    
    return data;
  },
  
  // 运行模拟
  runSimulation: function(container) {
    const itemsInput = container.querySelector('#simulation-items');
    const simulationCount = container.querySelector('#simulation-count');
    const useWeights = container.querySelector('#simulation-use-weights');
    const allowRepeat = container.querySelector('#simulation-allow-repeat');
    const pickCount = container.querySelector('#simulation-pick-count');
    
    const input = itemsInput.value.trim();
    if (!input) {
      RandomPickerUtils.showToast('请输入项目列表', 'warning');
      return;
    }
    
    const count = parseInt(simulationCount.value);
    if (isNaN(count) || count < 1) {
      RandomPickerUtils.showToast('请输入有效的模拟次数', 'warning');
      return;
    }
    
    const picks = parseInt(pickCount.value);
    if (isNaN(picks) || picks < 1) {
      RandomPickerUtils.showToast('请输入有效的选择数量', 'warning');
      return;
    }
    
    const items = RandomPickerUtils.parseItems(input);
    if (items.length === 0) {
      RandomPickerUtils.showToast('没有有效的项目', 'warning');
      return;
    }
    
    const withWeights = useWeights.checked;
    const repeat = allowRepeat.checked;
    
    // 检查选择数量是否超过项目数量（在不重复模式下）
    if (!repeat && picks > items.length) {
      RandomPickerUtils.showToast(`选择数量不能超过项目数量 (${items.length})`, 'warning');
      return;
    }
    
    // 运行模拟
    const results = [];
    
    for (let i = 0; i < count; i++) {
      const availableItems = [...items];
      const simulationResult = [];
      
      for (let j = 0; j < picks; j++) {
        if (availableItems.length === 0) break;
        
        let selectedIndex;
        
        if (withWeights) {
          // 带权重的选择
          const totalWeight = availableItems.reduce((sum, item) => sum + item.weight, 0);
          let random = Math.random() * totalWeight;
          
          selectedIndex = 0;
          for (let k = 0; k < availableItems.length; k++) {
            random -= availableItems[k].weight;
            if (random <= 0) {
              selectedIndex = k;
              break;
            }
          }
        } else {
          // 等概率选择
          selectedIndex = Math.floor(Math.random() * availableItems.length);
        }
        
        simulationResult.push(availableItems[selectedIndex].name);
        
        if (!repeat) {
          availableItems.splice(selectedIndex, 1);
        }
      }
      
      // 如果只选择一个，直接添加结果
      if (picks === 1) {
        results.push(simulationResult[0]);
      } else {
        // 否则添加组合结果
        results.push(simulationResult.join(', '));
      }
    }
    
    // 显示模拟结果
    const data = this.createSimulationChart(container, results, `模拟结果 (${count}次)`);
    
    // 显示统计信息
    const statsContainer = container.querySelector('#simulation-stats');
    if (statsContainer) {
      let statsHtml = '<h3>统计信息</h3>';
      statsHtml += '<table class="stats-table">';
      statsHtml += '<tr><th>项目</th><th>次数</th><th>概率</th></tr>';
      
      data.forEach(item => {
        const probability = (item.count / count * 100).toFixed(2);
        statsHtml += `<tr><td>${item.name}</td><td>${item.count}</td><td>${probability}%</td></tr>`;
      });
      
      statsHtml += '</table>';
      statsContainer.innerHTML = statsHtml;
    }
  },
  
  // 使颜色变暗
  darkenColor: function(color, amount) {
    // 如果是 HSL 格式
    if (color.startsWith('hsl')) {
      const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (match) {
        const h = match[1];
        const s = match[2];
        const l = Math.max(0, parseInt(match[3]) - amount * 100);
        return `hsl(${h}, ${s}%, ${l}%)`;
      }
      return color;
    }
    
    // 如果是 HEX 格式
    let hex = color;
    if (hex.startsWith('#')) {
      hex = hex.slice(1);
    }
    
    // 转换为 RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // 变暗
    r = Math.max(0, Math.floor(r * (1 - amount)));
    g = Math.max(0, Math.floor(g * (1 - amount)));
    b = Math.max(0, Math.floor(b * (1 - amount)));
    
    // 转回 HEX
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
};

// 导出模块
window.RandomPickerVisual = RandomPickerVisual;