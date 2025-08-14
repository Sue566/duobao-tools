/**
 * 单位转换工具 - 批量转换模块
 * 处理批量单位转换功能
 */

const UnitConverterBatch = {
  // 填充批量转换单位选择器
  populateBatchUnitSelectors: function(category) {
    const container = document.querySelector('.unit-converter-container').closest('.tool-container');
    const batchFromUnit = container.querySelector('#batch-from-unit');
    const batchToUnit = container.querySelector('#batch-to-unit');
    
    const categoryData = UnitConverterData.units[category];
    
    // 清空选择器
    batchFromUnit.innerHTML = '';
    batchToUnit.innerHTML = '';
    
    // 填充选择器
    categoryData.units.forEach(unit => {
      batchFromUnit.innerHTML += `<option value="${unit.id}">${unit.name}</option>`;
      batchToUnit.innerHTML += `<option value="${unit.id}">${unit.name}</option>`;
    });
    
    // 设置默认选择
    if (categoryData.units.length > 1) {
      batchToUnit.selectedIndex = 1;
    }
  },
  
  // 执行批量转换
  batchConvert: function() {
    const container = document.querySelector('.unit-converter-container').closest('.tool-container');
    const batchCategory = container.querySelector('#batch-category');
    const batchFromUnit = container.querySelector('#batch-from-unit');
    const batchToUnit = container.querySelector('#batch-to-unit');
    const batchInput = container.querySelector('#batch-input');
    const batchOutput = container.querySelector('#batch-output');
    const batchIncludeUnit = container.querySelector('#batch-include-unit');
    
    const category = batchCategory.value;
    const categoryData = UnitConverterData.units[category];
    const fromUnitId = batchFromUnit.value;
    const toUnitId = batchToUnit.value;
    const inputLines = batchInput.value.trim().split('\n');
    
    if (inputLines.length === 0 || (inputLines.length === 1 && inputLines[0] === '')) {
      UnitConverterUtils.showToast('请输入要转换的值', 'warning');
      return;
    }
    
    const results = [];
    let hasError = false;
    
    inputLines.forEach(line => {
      // 支持带单位的输入，如 "5 km" 或 "5km"
      const cleanLine = line.trim();
      const match = cleanLine.match(/^([-+]?\d*\.?\d+)\s*([a-zA-Z°'"\u00B0\u2032\u2033_]+)?$/);
      
      let value, detectedUnit;
      let currentFromUnitId = fromUnitId;
      
      if (match) {
        value = parseFloat(match[1]);
        detectedUnit = match[2];
        
        // 如果检测到单位，尝试匹配到正确的单位ID
        if (detectedUnit) {
          const unitMatch = categoryData.units.find(u => {
            const unitSymbols = u.name.match(/\(([^)]+)\)/);
            if (unitSymbols) {
              const symbols = unitSymbols[1].split('/');
              return symbols.some(s => s.trim().toLowerCase() === detectedUnit.toLowerCase());
            }
            return false;
          });
          
          if (unitMatch) {
            // 如果找到匹配的单位，使用它而不是选择的单位
            currentFromUnitId = unitMatch.id;
          }
        }
      } else {
        value = parseFloat(cleanLine);
      }
      
      if (isNaN(value)) {
        results.push(`错误: "${cleanLine}" 不是有效的数值`);
        hasError = true;
        return;
      }
      
      let result;
      
      // 特殊处理温度转换
      if (category === 'temperature') {
        result = UnitConverterCore.convertTemperature(value, currentFromUnitId, toUnitId);
      } 
      // 特殊处理燃油效率转换
      else if (category === 'fuel') {
        result = UnitConverterCore.convertFuelEfficiency(value, currentFromUnitId, toUnitId);
      } else {
        // 通用转换方法
        const fromUnitData = categoryData.units.find(u => u.id === currentFromUnitId);
        const toUnitData = categoryData.units.find(u => u.id === toUnitId);
        
        if (!fromUnitData || !toUnitData) {
          results.push('单位转换错误');
          hasError = true;
          return;
        }
        
        result = value * (fromUnitData.factor / toUnitData.factor);
      }
      
      // 格式化结果
      const formattedResult = UnitConverterUtils.formatResult(result);
      
      // 添加单位
      if (batchIncludeUnit.checked) {
        const toUnitName = UnitConverterUtils.getUnitName(category, toUnitId);
        results.push(`${formattedResult} ${toUnitName}`);
      } else {
        results.push(formattedResult);
      }
    });
    
    // 显示结果
    batchOutput.value = results.join('\n');
    
    if (hasError) {
      UnitConverterUtils.showToast('部分值转换失败，请检查输入', 'warning');
    } else {
      UnitConverterUtils.showToast('批量转换完成', 'success');
    }
  },
  
  // 清空批量转换输入和输出
  clearBatch: function() {
    const container = document.querySelector('.unit-converter-container').closest('.tool-container');
    const batchInput = container.querySelector('#batch-input');
    const batchOutput = container.querySelector('#batch-output');
    
    batchInput.value = '';
    batchOutput.value = '';
  },
  
  // 复制批量转换结果
  copyBatchResult: function() {
    const container = document.querySelector('.unit-converter-container').closest('.tool-container');
    const batchOutput = container.querySelector('#batch-output');
    
    if (batchOutput.value) {
      UnitConverterUtils.copyToClipboard(batchOutput.value);
    } else {
      UnitConverterUtils.showToast('没有结果可复制', 'warning');
    }
  }
};