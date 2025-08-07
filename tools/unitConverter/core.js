/**
 * 单位转换工具 - 核心模块
 * 负责单位转换的核心逻辑
 */

const UnitConverterCore = {
  // 填充单位选择器
  populateUnitSelectors: function(category) {
    const container = document.getElementById('random-picker-container').closest('.tool-container');
    const fromUnit = container.querySelector('#from-unit');
    const toUnit = container.querySelector('#to-unit');
    const formulaContent = container.querySelector('#formula-content');
    
    const categoryData = UnitConverterData.units[category];
    
    // 清空选择器
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    // 填充选择器
    categoryData.units.forEach(unit => {
      fromUnit.innerHTML += `<option value="${unit.id}">${unit.name}</option>`;
      toUnit.innerHTML += `<option value="${unit.id}">${unit.name}</option>`;
    });
    
    // 设置默认选择
    if (categoryData.units.length > 1) {
      toUnit.selectedIndex = 1;
    }
    
    // 更新公式
    this.updateFormula(category);
  },
  
  // 更新公式显示
  updateFormula: function(category) {
    const container = document.getElementById('random-picker-container').closest('.tool-container');
    const formulaContent = container.querySelector('#formula-content');
    
    const categoryData = UnitConverterData.units[category];
    formulaContent.textContent = categoryData.formula;
  },
  
  // 执行单位转换
  convertUnits: function() {
    const container = document.getElementById('random-picker-container').closest('.tool-container');
    const categorySelect = container.querySelector('#unit-category');
    const fromValue = container.querySelector('#from-value');
    const fromUnit = container.querySelector('#from-unit');
    const toValue = container.querySelector('#to-value');
    const toUnit = container.querySelector('#to-unit');
    
    const category = categorySelect.value;
    const categoryData = UnitConverterData.units[category];
    const fromUnitId = fromUnit.value;
    const toUnitId = toUnit.value;
    const value = parseFloat(fromValue.value);
    
    if (isNaN(value)) {
      UnitConverterUtils.showToast('请输入有效的数值', 'warning');
      return;
    }
    
    let result;
    
    // 特殊处理温度转换
    if (category === 'temperature') {
      result = this.convertTemperature(value, fromUnitId, toUnitId);
    } 
    // 特殊处理燃油效率转换
    else if (category === 'fuel') {
      result = this.convertFuelEfficiency(value, fromUnitId, toUnitId);
    } else {
      // 通用转换方法
      const fromUnitData = categoryData.units.find(u => u.id === fromUnitId);
      const toUnitData = categoryData.units.find(u => u.id === toUnitId);
      
      if (!fromUnitData || !toUnitData) {
        UnitConverterUtils.showToast('单位转换错误', 'error');
        return;
      }
      
      result = value * (fromUnitData.factor / toUnitData.factor);
    }
    
    // 显示结果
    toValue.value = UnitConverterUtils.formatResult(result);
    
    // 添加到历史记录
    UnitConverterHistory.addToHistory(category, value, fromUnitId, result, toUnitId);
  },
  
  // 温度转换
  convertTemperature: function(value, fromUnit, toUnit) {
    // 先转换为摄氏度
    let celsius;
    
    switch (fromUnit) {
      case 'celsius':
        celsius = value;
        break;
      case 'fahrenheit':
        celsius = (value - 32) * 5 / 9;
        break;
      case 'kelvin':
        celsius = value - 273.15;
        break;
      case 'rankine':
        celsius = (value - 491.67) * 5 / 9;
        break;
      case 'reaumur':
        celsius = value * 1.25;
        break;
    }
    
    // 从摄氏度转换为目标单位
    switch (toUnit) {
      case 'celsius':
        return celsius;
      case 'fahrenheit':
        return celsius * 9 / 5 + 32;
      case 'kelvin':
        return celsius + 273.15;
      case 'rankine':
        return (celsius + 273.15) * 9 / 5;
      case 'reaumur':
        return celsius * 0.8;
    }
  },
  
  // 燃油效率转换
  convertFuelEfficiency: function(value, fromUnit, toUnit) {
    // 先转换为千米/升
    let kmPerL;
    
    switch (fromUnit) {
      case 'km_per_l':
        kmPerL = value;
        break;
      case 'l_per_100km':
        kmPerL = value > 0 ? 100 / value : 0;
        break;
      case 'mpg_us':
        kmPerL = value * 0.425144;
        break;
      case 'mpg_uk':
        kmPerL = value * 0.354006;
        break;
    }
    
    // 从千米/升转换为目标单位
    switch (toUnit) {
      case 'km_per_l':
        return kmPerL;
      case 'l_per_100km':
        return kmPerL > 0 ? 100 / kmPerL : 0;
      case 'mpg_us':
        return kmPerL / 0.425144;
      case 'mpg_uk':
        return kmPerL / 0.354006;
    }
  }
};