/**
 * 单位转换工具 - 表格模块
 * 处理单位换算表功能
 */

const UnitConverterTable = {
  // 生成换算表
  generateConversionTable: function() {
    const container = document.getElementById('random-picker-container').closest('.tool-container');
    const tableCategory = container.querySelector('#table-category');
    const tableContent = container.querySelector('#table-content');
    
    const category = tableCategory.value;
    const categoryData = UnitConverterData.units[category];
    const unitsList = categoryData.units;
    
    if (unitsList.length === 0) {
      tableContent.innerHTML = '<div class="table-placeholder">该单位类型没有可用的单位</div>';
      return;
    }
    
    // 创建表格
    let tableHtml = '<div class="table-filter-container"><input type="text" id="table-filter" class="form-control" placeholder="搜索单位..."></div>';
    tableHtml += '<table class="conversion-table" id="conversion-table">';
    
    // 表头
    tableHtml += '<thead><tr><th>单位</th>';
    unitsList.forEach(unit => {
      tableHtml += `<th>${unit.name}</th>`;
    });
    tableHtml += '</tr></thead>';
    
    // 表体
    tableHtml += '<tbody>';
    unitsList.forEach(fromUnit => {
      tableHtml += `<tr data-unit="${fromUnit.id}"><th>${fromUnit.name}</th>`;
      
      unitsList.forEach(toUnit => {
        let value;
        
        // 特殊处理温度
        if (category === 'temperature') {
          // 对于温度，我们使用1作为示例值
          value = UnitConverterCore.convertTemperature(1, fromUnit.id, toUnit.id);
        } 
        // 特殊处理燃油效率
        else if (category === 'fuel') {
          value = UnitConverterCore.convertFuelEfficiency(1, fromUnit.id, toUnit.id);
        } else {
          // 通用转换
          value = 1 * (fromUnit.factor / toUnit.factor);
        }
        
        tableHtml += `<td>${UnitConverterUtils.formatResult(value)}</td>`;
      });
      
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';
    
    tableContent.innerHTML = tableHtml;
    
    // 添加表格过滤功能
    const tableFilter = document.getElementById('table-filter');
    if (tableFilter) {
      tableFilter.addEventListener('input', function() {
        const filterValue = this.value.toLowerCase();
        const table = document.getElementById('conversion-table');
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
          const unitName = row.querySelector('th').textContent.toLowerCase();
          if (unitName.includes(filterValue)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    }
    
    // 添加表格行高亮功能
    const tableRows = document.querySelectorAll('#conversion-table tbody tr');
    tableRows.forEach(row => {
      row.addEventListener('mouseover', function() {
        this.classList.add('highlight-row');
      });
      
      row.addEventListener('mouseout', function() {
        this.classList.remove('highlight-row');
      });
    });
    
    UnitConverterUtils.showToast('换算表已生成', 'success');
  },
  
  // 导出表格为CSV
  exportTableToCSV: function() {
    const container = document.getElementById('random-picker-container').closest('.tool-container');
    const tableCategory = container.querySelector('#table-category');
    
    const category = tableCategory.value;
    const categoryData = UnitConverterData.units[category];
    const unitsList = categoryData.units;
    
    if (unitsList.length === 0) {
      UnitConverterUtils.showToast('没有可导出的数据', 'warning');
      return;
    }
    
    // 创建CSV内容
    let csvContent = '单位';
    unitsList.forEach(unit => {
      csvContent += `,${unit.name}`;
    });
    csvContent += '\n';
    
    unitsList.forEach(fromUnit => {
      csvContent += `${fromUnit.name}`;
      
      unitsList.forEach(toUnit => {
        let value;
        
        // 特殊处理温度
        if (category === 'temperature') {
          value = UnitConverterCore.convertTemperature(1, fromUnit.id, toUnit.id);
        } else if (category === 'fuel') {
          value = UnitConverterCore.convertFuelEfficiency(1, fromUnit.id, toUnit.id);
        } else {
          value = 1 * (fromUnit.factor / toUnit.factor);
        }
        
        csvContent += `,${UnitConverterUtils.formatResult(value)}`;
      });
      
      csvContent += '\n';
    });
    
    // 导出CSV
    UnitConverterUtils.exportToCSV(csvContent, `${categoryData.name}单位换算表.csv`);
    UnitConverterUtils.showToast('换算表已导出为CSV文件', 'success');
  },
  
  // 打印表格
  printConversionTable: function() {
    const container = document.getElementById('random-picker-container').closest('.tool-container');
    const tableCategory = container.querySelector('#table-category');
    const tableContent = container.querySelector('#table-content');
    
    const category = tableCategory.value;
    const categoryData = UnitConverterData.units[category];
    
    // 创建打印窗口
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
      <head>
        <title>${categoryData.name}单位换算表</title>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${categoryData.name}单位换算表</h1>
        <div style="text-align: center;">
          <button onclick="window.print()">打印</button>
          <button onclick="window.close()">关闭</button>
        </div>
        ${tableContent.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
  }
};