/**
 * 随机选择器 - 可视化模块
 */
(function() {
  // 可视化模块
  window.randomPicker.visual = {
    // 创建饼图
    createPieChart: function(result, type, container) {
      // 清空容器
      container.innerHTML = '';
      
      // 准备数据
      let data = [];
      
      if (Array.isArray(result)) {
        if (result.length === 0) return;
        
        // 处理不同类型的结果
        if (type === 'list') {
          // 列表结果
          data = result.map((item, index) => {
            const name = item.name || item;
            const value = item.weight || 1;
            return { name, value };
          });
        } else if (type === 'range') {
          // 范围结果
          data = result.map(item => {
            return { name: item.toString(), value: 1 };
          });
        } else if (type === 'dice') {
          // 骰子结果
          const counts = {};
          result.forEach(value => {
            counts[value] = (counts[value] || 0) + 1;
          });
          
          data = Object.keys(counts).map(key => {
            return { name: key, value: counts[key] };
          });
        } else if (type === 'coin') {
          // 硬币结果
          const counts = {};
          result.forEach(value => {
            counts[value] = (counts[value] || 0) + 1;
          });
          
          data = Object.keys(counts).map(key => {
            return { name: key, value: counts[key] };
          });
        } else if (type === 'card') {
          // 扑克牌结果
          const suitCounts = {};
          result.forEach(card => {
            const suit = card.suit || '未知';
            suitCounts[suit] = (suitCounts[suit] || 0) + 1;
          });
          
          data = Object.keys(suitCounts).map(key => {
            return { name: key, value: suitCounts[key] };
          });
        }
      }
      
      // 如果没有数据，返回
      if (data.length === 0) return;
      
      // 计算总值
      const total = data.reduce((sum, item) => sum + item.value, 0);
      
      // 创建SVG元素
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('viewBox', '-1 -1 2 2');
      
      // 创建图例
      const legend = document.createElement('div');
      legend.className = 'chart-legend';
      
      // 绘制饼图
      let startAngle = 0;
      data.forEach((item, index) => {
        const percentage = item.value / total;
        const endAngle = startAngle + percentage * Math.PI * 2;
        
        // 计算路径
        const x1 = Math.cos(startAngle);
        const y1 = Math.sin(startAngle);
        const x2 = Math.cos(endAngle);
        const y2 = Math.sin(endAngle);
        
        // 确定是否是大弧
        const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
        
        // 创建路径
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2} Z`);
        
        // 设置颜色
        const color = window.randomPicker.utils.generateRandomColor(index, data.length);
        path.setAttribute('fill', color);
        path.setAttribute('stroke', '#fff');
        path.setAttribute('stroke-width', '0.01');
        
        // 添加标签
        const midAngle = startAngle + (endAngle - startAngle) / 2;
        const labelX = Math.cos(midAngle) * 0.6;
        const labelY = Math.sin(midAngle) * 0.6;
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', labelX);
        text.setAttribute('y', labelY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', '#fff');
        text.setAttribute('font-size', '0.1');
        text.textContent = Math.round(percentage * 100) + '%';
        
        // 添加到SVG
        svg.appendChild(path);
        svg.appendChild(text);
        
        // 添加图例项
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
          <span class="legend-color" style="background-color: ${color}"></span>
          <span class="legend-text">${item.name} (${Math.round(percentage * 100)}%)</span>
        `;
        legend.appendChild(legendItem);
        
        // 更新起始角度
        startAngle = endAngle;
      });
      
      // 创建容器
      const chartContainer = document.createElement('div');
      chartContainer.className = 'chart-container';
      chartContainer.style.display = 'flex';
      chartContainer.style.width = '100%';
      chartContainer.style.height = '100%';
      
      // 创建SVG容器
      const svgContainer = document.createElement('div');
      svgContainer.className = 'svg-container';
      svgContainer.style.flex = '1';
      svgContainer.appendChild(svg);
      
      // 设置图例样式
      legend.style.flex = '0 0 150px';
      legend.style.marginLeft = '10px';
      legend.style.overflowY = 'auto';
      legend.style.maxHeight = '100%';
      
      // 添加到容器
      chartContainer.appendChild(svgContainer);
      chartContainer.appendChild(legend);
      container.appendChild(chartContainer);
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .chart-legend {
          font-size: 12px;
        }
        .legend-item {
          margin-bottom: 5px;
          display: flex;
          align-items: center;
        }
        .legend-color {
          display: inline-block;
          width: 12px;
          height: 12px;
          margin-right: 5px;
          border-radius: 2px;
        }
      `;
      container.appendChild(style);
    },
    
    // 创建柱状图
    createBarChart: function(result, type, container) {
      // 清空容器
      container.innerHTML = '';
      
      // 准备数据
      let data = [];
      
      if (Array.isArray(result)) {
        if (result.length === 0) return;
        
        // 处理不同类型的结果
        if (type === 'list') {
          // 列表结果
          data = result.map((item, index) => {
            const name = item.name || item;
            const value = item.weight || 1;
            return { name, value };
          });
        } else if (type === 'range') {
          // 范围结果
          data = result.map(item => {
            return { name: item.toString(), value: 1 };
          });
        } else if (type === 'dice') {
          // 骰子结果
          const counts = {};
          result.forEach(value => {
            counts[value] = (counts[value] || 0) + 1;
          });
          
          data = Object.keys(counts).map(key => {
            return { name: key, value: counts[key] };
          });
        } else if (type === 'coin') {
          // 硬币结果
          const counts = {};
          result.forEach(value => {
            counts[value] = (counts[value] || 0) + 1;
          });
          
          data = Object.keys(counts).map(key => {
            return { name: key, value: counts[key] };
          });
        } else if (type === 'card') {
          // 扑克牌结果
          const suitCounts = {};
          result.forEach(card => {
            const suit = card.suit || '未知';
            suitCounts[suit] = (suitCounts[suit] || 0) + 1;
          });
          
          data = Object.keys(suitCounts).map(key => {
            return { name: key, value: suitCounts[key] };
          });
        }
      }
      
      // 如果没有数据，返回
      if (data.length === 0) return;
      
      // 找出最大值
      const maxValue = Math.max(...data.map(item => item.value));
      
      // 创建SVG元素
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('viewBox', `0 0 ${data.length * 60 + 40} 220`);
      
      // 创建坐标轴
      const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      xAxis.setAttribute('x1', '30');
      xAxis.setAttribute('y1', '180');
      xAxis.setAttribute('x2', `${data.length * 60 + 30}`);
      xAxis.setAttribute('y2', '180');
      xAxis.setAttribute('stroke', '#333');
      xAxis.setAttribute('stroke-width', '1');
      svg.appendChild(xAxis);
      
      const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      yAxis.setAttribute('x1', '30');
      yAxis.setAttribute('y1', '20');
      yAxis.setAttribute('x2', '30');
      yAxis.setAttribute('y2', '180');
      yAxis.setAttribute('stroke', '#333');
      yAxis.setAttribute('stroke-width', '1');
      svg.appendChild(yAxis);
      
      // 绘制柱状图
      data.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * 150;
        const barWidth = 40;
        const x = index * 60 + 40;
        const y = 180 - barHeight;
        
        // 创建柱子
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', barHeight);
        
        // 设置颜色
        const color = window.randomPicker.utils.generateRandomColor(index, data.length);
        rect.setAttribute('fill', color);
        
        // 添加数值标签
        const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        valueText.setAttribute('x', x + barWidth / 2);
        valueText.setAttribute('y', y - 5);
        valueText.setAttribute('text-anchor', 'middle');
        valueText.setAttribute('font-size', '12');
        valueText.textContent = item.value;
        
        // 添加名称标签
        const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        nameText.setAttribute('x', x + barWidth / 2);
        nameText.setAttribute('y', 195);
        nameText.setAttribute('text-anchor', 'middle');
        nameText.setAttribute('font-size', '12');
        nameText.textContent = item.name;
        
        // 添加到SVG
        svg.appendChild(rect);
        svg.appendChild(valueText);
        svg.appendChild(nameText);
      });
      
      // 添加到容器
      container.appendChild(svg);
    },
    
    // 创建转盘
    createWheel: function(result, type, container) {
      // 清空容器
      container.innerHTML = '';
      
      // 准备数据
      let data = [];
      
      if (Array.isArray(result)) {
        if (result.length === 0) return;
        
        // 处理不同类型的结果
        if (type === 'list') {
          // 列表结果
          data = result.map((item, index) => {
            const name = item.name || item;
            const value = item.weight || 1;
            return { name, value };
          });
        } else if (type === 'range') {
          // 范围结果
          data = result.map(item => {
            return { name: item.toString(), value: 1 };
          });
        } else if (type === 'dice' || type === 'coin' || type === 'card') {
          // 其他结果
          data = result.map((item, index) => {
            const name = typeof item === 'object' ? 
              (item.suit && item.rank ? `${item.suit} ${item.rank}` : JSON.stringify(item)) : 
              item.toString();
            return { name, value: 1 };
          });
        }
      }
      
      // 如果没有数据，返回
      if (data.length === 0) return;
      
      // 计算总值
      const total = data.reduce((sum, item) => sum + item.value, 0);
      
      // 创建转盘容器
      const wheelContainer = document.createElement('div');
      wheelContainer.className = 'wheel-container';
      
      // 创建转盘
      const wheel = document.createElement('div');
      wheel.className = 'wheel';
      
      // 创建指针
      const pointer = document.createElement('div');
      pointer.className = 'wheel-pointer';
      
      // 绘制转盘扇区
      let startAngle = 0;
      data.forEach((item, index) => {
        const percentage = item.value / total;
        const angle = percentage * 360;
        
        // 创建扇区
        const slice = document.createElement('div');
        slice.className = 'wheel-slice';
        
        // 设置颜色
        const color = window.randomPicker.utils.generateRandomColor(index, data.length);
        
        // 设置样式
        slice.style.transform = `rotate(${startAngle}deg)`;
        slice.style.backgroundColor = color;
        slice.style.clipPath = `polygon(0 0, 100% 0, 100% 100%)`;
        slice.style.transform = `rotate(${startAngle}deg)`;
        
        // 添加标签
        const label = document.createElement('div');
        label.className = 'wheel-label';
        label.textContent = item.name;
        label.style.position = 'absolute';
        label.style.transform = `rotate(${angle / 2}deg) translateX(80px) rotate(-${angle / 2}deg)`;
        label.style.fontSize = '10px';
        label.style.whiteSpace = 'nowrap';
        
        // 添加到扇区
        slice.appendChild(label);
        
        // 添加到转盘
        wheel.appendChild(slice);
        
        // 更新起始角度
        startAngle += angle;
      });
      
      // 添加旋转按钮
      const spinButton = document.createElement('button');
      spinButton.className = 'btn btn-primary spin-button';
      spinButton.textContent = '旋转';
      spinButton.style.position = 'absolute';
      spinButton.style.bottom = '-40px';
      spinButton.style.left = '50%';
      spinButton.style.transform = 'translateX(-50%)';
      
      // 添加旋转事件
      spinButton.addEventListener('click', () => {
        // 随机旋转角度
        const spinAngle = 3600 + Math.random() * 360;
        wheel.style.transition = 'transform 3s cubic-bezier(0.2, 0.8, 0.3, 1)';
        wheel.style.transform = `rotate(${spinAngle}deg)`;
      });
      
      // 添加到容器
      wheelContainer.appendChild(wheel);
      wheelContainer.appendChild(pointer);
      wheelContainer.appendChild(spinButton);
      container.appendChild(wheelContainer);
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .wheel-container {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto;
        }
        
        .wheel {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          position: relative;
          overflow: hidden;
          border: 2px solid #333;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
        
        .wheel-slice {
          position: absolute;
          width: 50%;
          height: 50%;
          transform-origin: bottom right;
          left: 50%;
          top: 50%;
        }
        
        .wheel-label {
          position: absolute;
          top: 10px;
          left: 10px;
          color: white;
          text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
        }
        
        .wheel-pointer {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 20px solid red;
          z-index: 2;
        }
        
        .spin-button {
          margin-top: 20px;
        }
      `;
      container.appendChild(style);
    }
  };
})();