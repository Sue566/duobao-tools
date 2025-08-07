/**
 * 单位转换工具 - 数据模块
 * 存储单位定义和相关数据
 */

const UnitConverterData = {
  // 默认单位定义
  defaultUnits: {
    length: {
      name: '长度',
      units: [
        { id: 'km', name: '千米 (km)', factor: 1000 },
        { id: 'm', name: '米 (m)', factor: 1 },
        { id: 'dm', name: '分米 (dm)', factor: 0.1 },
        { id: 'cm', name: '厘米 (cm)', factor: 0.01 },
        { id: 'mm', name: '毫米 (mm)', factor: 0.001 },
        { id: 'um', name: '微米 (μm)', factor: 0.000001 },
        { id: 'nm', name: '纳米 (nm)', factor: 0.000000001 },
        { id: 'pm', name: '皮米 (pm)', factor: 0.000000000001 },
        { id: 'mile', name: '英里 (mi)', factor: 1609.344 },
        { id: 'yard', name: '码 (yd)', factor: 0.9144 },
        { id: 'foot', name: '英尺 (ft)', factor: 0.3048 },
        { id: 'inch', name: '英寸 (in)', factor: 0.0254 },
        { id: 'li', name: '里 (中国)', factor: 500 },
        { id: 'zhang', name: '丈 (中国)', factor: 3.33 },
        { id: 'chi', name: '尺 (中国)', factor: 0.33 },
        { id: 'cun', name: '寸 (中国)', factor: 0.033 },
        { id: 'fen', name: '分 (中国)', factor: 0.0033 },
        { id: 'nautical_mile', name: '海里 (nmi)', factor: 1852 },
        { id: 'light_year', name: '光年 (ly)', factor: 9.461e+15 },
        { id: 'astronomical_unit', name: '天文单位 (AU)', factor: 1.496e+11 },
        { id: 'parsec', name: '秒差距 (pc)', factor: 3.086e+16 }
      ],
      baseUnit: 'm',
      formula: '结果 = 输入值 × (输入单位的因子 ÷ 输出单位的因子)'
    },
    area: {
      name: '面积',
      units: [
        { id: 'sq_km', name: '平方千米 (km²)', factor: 1000000 },
        { id: 'hectare', name: '公顷 (ha)', factor: 10000 },
        { id: 'sq_m', name: '平方米 (m²)', factor: 1 },
        { id: 'sq_dm', name: '平方分米 (dm²)', factor: 0.01 },
        { id: 'sq_cm', name: '平方厘米 (cm²)', factor: 0.0001 },
        { id: 'sq_mm', name: '平方毫米 (mm²)', factor: 0.000001 },
        { id: 'sq_um', name: '平方微米 (μm²)', factor: 1e-12 },
        { id: 'sq_mile', name: '平方英里 (mi²)', factor: 2589988.11 },
        { id: 'acre', name: '英亩 (acre)', factor: 4046.86 },
        { id: 'sq_yard', name: '平方码 (yd²)', factor: 0.836127 },
        { id: 'sq_foot', name: '平方英尺 (ft²)', factor: 0.092903 },
        { id: 'sq_inch', name: '平方英寸 (in²)', factor: 0.00064516 },
        { id: 'mu', name: '亩 (中国)', factor: 666.67 },
        { id: 'qing', name: '顷 (中国)', factor: 66666.7 }
      ],
      baseUnit: 'sq_m',
      formula: '结果 = 输入值 × (输入单位的因子 ÷ 输出单位的因子)'
    },
    volume: {
      name: '体积',
      units: [
        { id: 'cubic_m', name: '立方米 (m³)', factor: 1 },
        { id: 'cubic_dm', name: '立方分米 (dm³)', factor: 0.001 },
        { id: 'cubic_cm', name: '立方厘米 (cm³)', factor: 0.000001 },
        { id: 'cubic_mm', name: '立方毫米 (mm³)', factor: 0.000000001 },
        { id: 'liter', name: '升 (L)', factor: 0.001 },
        { id: 'milliliter', name: '毫升 (mL)', factor: 0.000001 },
        { id: 'microliter', name: '微升 (μL)', factor: 0.000000001 },
        { id: 'cubic_foot', name: '立方英尺 (ft³)', factor: 0.0283168 },
        { id: 'cubic_inch', name: '立方英寸 (in³)', factor: 0.0000163871 },
        { id: 'cubic_yard', name: '立方码 (yd³)', factor: 0.764555 },
        { id: 'gallon_us', name: '加仑 (美制)', factor: 0.00378541 },
        { id: 'gallon_uk', name: '加仑 (英制)', factor: 0.00454609 },
        { id: 'quart_us', name: '夸脱 (美制)', factor: 0.000946353 },
        { id: 'quart_uk', name: '夸脱 (英制)', factor: 0.00113652 },
        { id: 'pint_us', name: '品脱 (美制)', factor: 0.000473176 },
        { id: 'pint_uk', name: '品脱 (英制)', factor: 0.000568261 },
        { id: 'cup_us', name: '杯 (美制)', factor: 0.000236588 },
        { id: 'fluid_oz_us', name: '液量盎司 (美制)', factor: 0.0000295735 },
        { id: 'fluid_oz_uk', name: '液量盎司 (英制)', factor: 0.0000284131 },
        { id: 'tablespoon_us', name: '汤匙 (美制)', factor: 0.0000147868 },
        { id: 'tablespoon_metric', name: '汤匙 (公制)', factor: 0.000015 },
        { id: 'teaspoon_us', name: '茶匙 (美制)', factor: 0.00000492892 },
        { id: 'teaspoon_metric', name: '茶匙 (公制)', factor: 0.000005 },
        { id: 'barrel', name: '桶 (石油)', factor: 0.158987 },
        { id: 'sheng', name: '升 (中国)', factor: 0.001 },
        { id: 'dou', name: '斗 (中国)', factor: 0.01 },
        { id: 'dan', name: '石 (中国)', factor: 0.1 }
      ],
      baseUnit: 'cubic_m',
      formula: '结果 = 输入值 × (输入单位的因子 ÷ 输出单位的因子)'
    },
    weight: {
      name: '重量',
      units: [
        { id: 'ton', name: '吨 (t)', factor: 1000 },
        { id: 'kg', name: '千克 (kg)', factor: 1 },
        { id: 'g', name: '克 (g)', factor: 0.001 },
        { id: 'mg', name: '毫克 (mg)', factor: 0.000001 },
        { id: 'ug', name: '微克 (μg)', factor: 0.000000001 },
        { id: 'ng', name: '纳克 (ng)', factor: 0.000000000001 },
        { id: 'ton_us', name: '吨 (美制)', factor: 907.185 },
        { id: 'ton_uk', name: '吨 (英制)', factor: 1016.05 },
        { id: 'pound', name: '磅 (lb)', factor: 0.453592 },
        { id: 'ounce', name: '盎司 (oz)', factor: 0.0283495 },
        { id: 'stone', name: '英石 (st)', factor: 6.35029 },
        { id: 'jin', name: '斤 (中国)', factor: 0.5 },
        { id: 'liang', name: '两 (中国)', factor: 0.05 },
        { id: 'qian', name: '钱 (中国)', factor: 0.005 },
        { id: 'grain', name: '格令 (gr)', factor: 0.0000647989 },
        { id: 'carat', name: '克拉 (ct)', factor: 0.0002 },
        { id: 'atomic_mass_unit', name: '原子质量单位 (u)', factor: 1.66053906660e-27 }
      ],
      baseUnit: 'kg',
      formula: '结果 = 输入值 × (输入单位的因子 ÷ 输出单位的因子)'
    },
    temperature: {
      name: '温度',
      units: [
        { id: 'celsius', name: '摄氏度 (°C)', factor: 1 },
        { id: 'fahrenheit', name: '华氏度 (°F)', factor: 1 },
        { id: 'kelvin', name: '开尔文 (K)', factor: 1 },
        { id: 'rankine', name: '兰氏度 (°R)', factor: 1 },
        { id: 'reaumur', name: '列氏度 (°Ré)', factor: 1 }
      ],
      baseUnit: 'celsius',
      formula: '摄氏度 → 华氏度: °F = °C × 9/5 + 32\n华氏度 → 摄氏度: °C = (°F - 32) × 5/9\n摄氏度 → 开尔文: K = °C + 273.15\n开尔文 → 摄氏度: °C = K - 273.15'
    },
    time: {
      name: '时间',
      units: [
        { id: 'year', name: '年', factor: 31536000 },
        { id: 'month', name: '月 (30天)', factor: 2592000 },
        { id: 'week', name: '周', factor: 604800 },
        { id: 'day', name: '天', factor: 86400 },
        { id: 'hour', name: '小时', factor: 3600 },
        { id: 'minute', name: '分钟', factor: 60 },
        { id: 'second', name: '秒', factor: 1 },
        { id: 'millisecond', name: '毫秒', factor: 0.001 },
        { id: 'microsecond', name: '微秒', factor: 0.000001 },
        { id: 'nanosecond', name: '纳秒', factor: 0.000000001 }
      ],
      baseUnit: 'second',
      formula: '结果 = 输入值 × (输入单位的因子 ÷ 输出单位的因子)'
    },
    speed: {
      name: '速度',
      units: [
        { id: 'mps', name: '米/秒 (m/s)', factor: 1 },
        { id: 'kph', name: '千米/小时 (km/h)', factor: 0.277778 },
        { id: 'mph', name: '英里/小时 (mph)', factor: 0.44704 },
        { id: 'knot', name: '节 (kn)', factor: 0.514444 },
        { id: 'fts', name: '英尺/秒 (ft/s)', factor: 0.3048 }
      ],
      baseUnit: 'mps',
      formula: '结果 = 输入值 × (输入单位的因子 ÷ 输出单位的因子)'
    },
    pressure: {
      name: '压力',
      units: [
        { id: 'pa', name: '帕斯卡 (Pa)', factor: 1 },
        { id: 'kpa', name: '千帕 (kPa)', factor: 1000 },
        { id: 'mpa', name: '兆帕 (MPa)', factor: 1000000 },
        { id: 'bar', name: '巴 (bar)', factor: 100000 },
        { id: 'atm', name: '标准大气压 (atm)', factor: 101325 },
        { id: 'mmhg', name: '毫米汞柱 (mmHg)', factor: 133.322 },
        { id: 'psi', name: '磅/平方英寸 (psi)', factor: 6894.76 }
      ],
      baseUnit: 'pa',
      formula: '结果 = 输入值 × (输入单位的因子 ÷ 输出单位的因子)'
    },
    energy: {
      name: '能量',
      units: [
        { id: 'j', name: '焦耳 (J)', factor: 1 },
        { id: 'kj', name: '千焦 (kJ)', factor: 1000 },
        { id: 'cal', name: '卡路里 (cal)', factor: 4.184 },
        { id: 'kcal', name: '千卡 (kcal)', factor: 4184 },
        { id: 'wh', name: '瓦时 (Wh)', factor: 3600 },
        { id: 'kwh', name: '千瓦时 (kWh)', factor: 3600000 },
        { id: 'ev', name: '电子伏特 (eV)', factor: 1.602176634e-19 },
        { id: 'btu', name: '英热单位 (BTU)', factor: 1055.06 }
      ],
      baseUnit: 'j',
      formula: '结果 = 输入值 × (输入单位的因子 ÷ 输出单位的因子)'
    },
    data: {
      name: '数据存储',
      units: [
        { id: 'bit', name: '比特 (bit)', factor: 0.125 },
        { id: 'byte', name: '字节 (B)', factor: 1 },
        { id: 'kb', name: '千字节 (KB)', factor: 1024 },
        { id: 'mb', name: '兆字节 (MB)', factor: 1048576 },
        { id: 'gb', name: '吉字节 (GB)', factor: 1073741824 },
        { id: 'tb', name: '太字节 (TB)', factor: 1099511627776 },
        { id: 'pb', name: '拍字节 (PB)', factor: 1125899906842624 }
      ],
      baseUnit: 'byte',
      formula: '结果 = 输入值 × (输入单位的因子 ÷ 输出单位的因子)'
    }
  },
  
  // 当前使用的单位（包括自定义单位）
  units: {},
  
  // 初始化单位数据
  init: function() {
    // 深拷贝默认单位
    this.units = JSON.parse(JSON.stringify(this.defaultUnits));
    
    // 加载自定义单位
    this.loadCustomUnits();
  },
  
  // 添加货币单位
  addCurrencyUnits: function(container) {
    if (!this.units.currency) {
      this.units.currency = {
        name: '货币',
        units: [
          { id: 'cny', name: '人民币 (CNY)', factor: 1 },
          { id: 'usd', name: '美元 (USD)', factor: 7.1 },
          { id: 'eur', name: '欧元 (EUR)', factor: 7.7 },
          { id: 'gbp', name: '英镑 (GBP)', factor: 9.0 },
          { id: 'jpy', name: '日元 (JPY)', factor: 0.047 },
          { id: 'krw', name: '韩元 (KRW)', factor: 0.0053 },
          { id: 'hkd', name: '港币 (HKD)', factor: 0.91 },
          { id: 'aud', name: '澳元 (AUD)', factor: 4.7 },
          { id: 'cad', name: '加元 (CAD)', factor: 5.2 }
        ],
        baseUnit: 'cny',
        formula: '结果 = 输入值 × (输入单位的因子 ÷ 输出单位的因子)\n\n注意：货币汇率会随时间变化，此处使用的是近似值。'
      };
    }
    
    if (container) {
      // 添加汇率更新按钮
      const currencyUpdateBtn = document.createElement('button');
      currencyUpdateBtn.className = 'btn btn-sm';
      currencyUpdateBtn.innerHTML = '<i class="fa fa-refresh"></i> 更新汇率';
      currencyUpdateBtn.title = '尝试获取最新汇率数据';
      
      // 只在选择货币类型时显示更新按钮
      const categorySelect = container.querySelector('#unit-category');
      if (categorySelect) {
        categorySelect.addEventListener('change', function() {
          if (this.value === 'currency') {
            if (!document.querySelector('.currency-update-btn')) {
              const categoryContainer = categorySelect.closest('.unit-category-selector');
              categoryContainer.appendChild(currencyUpdateBtn);
            }
          } else {
            const updateBtn = document.querySelector('.currency-update-btn');
            if (updateBtn) {
              updateBtn.remove();
            }
          }
        });
      }
      
      // 添加更新汇率功能
      currencyUpdateBtn.addEventListener('click', function() {
        this.disabled = true;
        this.innerHTML = '<i class="fa fa-spinner fa-spin"></i> 更新中...';
        
        // 模拟API请求延迟
        setTimeout(() => {
          // 这里应该是实际的API请求，但为了演示，我们使用模拟数据
          const newRates = {
            'usd': 7.15 + (Math.random() * 0.1 - 0.05),
            'eur': 7.75 + (Math.random() * 0.1 - 0.05),
            'gbp': 9.05 + (Math.random() * 0.1 - 0.05),
            'jpy': 0.048 + (Math.random() * 0.002 - 0.001),
            'krw': 0.0054 + (Math.random() * 0.0002 - 0.0001),
            'hkd': 0.92 + (Math.random() * 0.02 - 0.01),
            'aud': 4.75 + (Math.random() * 0.1 - 0.05),
            'cad': 5.25 + (Math.random() * 0.1 - 0.05)
          };
          
          // 更新汇率
          for (const [code, rate] of Object.entries(newRates)) {
            const unitIndex = UnitConverterData.units.currency.units.findIndex(u => u.id === code);
            if (unitIndex >= 0) {
              UnitConverterData.units.currency.units[unitIndex].factor = rate;
            }
          }
          
          // 更新当前显示
          const categorySelect = container.querySelector('#unit-category');
          if (categorySelect && categorySelect.value === 'currency') {
            UnitConverterCore.convertUnits();
          }
          
          // 恢复按钮状态
          this.disabled = false;
          this.innerHTML = '<i class="fa fa-refresh"></i> 更新汇率';
          
          // 显示更新时间
          const now = new Date();
          const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          UnitConverterUtils.showToast(`汇率已更新 (${timeStr})`, 'success');
          
          // 保存到本地存储
          const savedRates = {
            rates: newRates,
            timestamp: now.getTime()
          };
          localStorage.setItem('currencyRates', JSON.stringify(savedRates));
        }, 1500);
      });
    }
    
    // 尝试从本地存储加载汇率
    const savedRatesJson = localStorage.getItem('currencyRates');
    if (savedRatesJson) {
      try {
        const savedRates = JSON.parse(savedRatesJson);
        const timestamp = savedRates.timestamp;
        const now = new Date().getTime();
        
        // 如果汇率数据不超过24小时，则使用它
        if (now - timestamp < 24 * 60 * 60 * 1000) {
          for (const [code, rate] of Object.entries(savedRates.rates)) {
            const unitIndex = this.units.currency.units.findIndex(u => u.id === code);
            if (unitIndex >= 0) {
              this.units.currency.units[unitIndex].factor = rate;
            }
          }
        }
      } catch (e) {
        console.error('加载保存的汇率失败', e);
      }
    }
  },
  
  // 添加角度单位
  addAngleUnits: function() {
    if (!this.units.angle) {
      this.units.angle = {
        name: '角度',
        units: [
          { id: 'degree', name: '度 (°)', factor: 1 },
          { id: 'radian', name: '弧度 (rad)', factor: 57.2958 },
          { id: 'gradian', name: '百分度 (grad)', factor: 0.9 },
          { id: 'minute', name: '角分 (\')', factor: 0.0166667 },
          { id: 'second', name: '角秒 (")', factor: 0.000277778 },
          { id: 'turn', name: '圈 (turn)', factor: 360 }
        ],
        baseUnit: 'degree',
        formula: '结果 = 输入值 × (输入单位的因子 ÷ 输出单位的因子)'
      };
    }
  },
  
  // 添加燃油效率单位
  addFuelUnits: function() {
    if (!this.units.fuel) {
      this.units.fuel = {
        name: '燃油效率',
        units: [
          { id: 'km_per_l', name: '千米/升 (km/L)', factor: 1 },
          { id: 'l_per_100km', name: '升/100千米 (L/100km)', factor: 100 },
          { id: 'mpg_us', name: '英里/加仑 (美制)', factor: 2.35215 },
          { id: 'mpg_uk', name: '英里/加仑 (英制)', factor: 2.82481 }
        ],
        baseUnit: 'km_per_l',
        formula: '不同的燃油效率单位需要特殊转换:\n升/100千米 = 100 ÷ (千米/升)\n千米/升 = 100 ÷ (升/100千米)\n英里/加仑 (美制) = 2.35215 × (千米/升)\n英里/加仑 (英制) = 2.82481 × (千米/升)'
      };
    }
  },
  
  // 添加功率单位
  addPowerUnits: function() {
    if (!this.units.power) {
      this.units.power = {
        name: '功率',
        units: [
          { id: 'w', name: '瓦特 (W)', factor: 1 },
          { id: 'kw', name: '千瓦 (kW)', factor: 1000 },
          { id: 'mw', name: '兆瓦 (MW)', factor: 1000000 },
          { id: 'hp', name: '马力 (hp)', factor: 745.7 },
          { id: 'ps', name: '公制马力 (PS)', factor: 735.5 },
          { id: 'btu_per_hour', name: 'BTU/小时', factor: 0.29307 },
          { id: 'ft_lb_per_sec', name: '英尺·磅/秒', factor: 1.35582 }
        ],
        baseUnit: 'w',
        formula: '结果 = 输入值 × (输入单位的因子 ÷ 输出单位的因子)'
      };
    }
  },
  
  // 加载自定义单位
  loadCustomUnits: function() {
    const savedUnits = JSON.parse(localStorage.getItem('customUnits') || '{}');
    
    // 添加自定义单位
    for (const category in savedUnits) {
      if (this.units[category]) {
        savedUnits[category].forEach(customUnit => {
          // 检查是否已存在相同ID的单位
          const existingIndex = this.units[category].units.findIndex(u => u.id === customUnit.id);
          if (existingIndex >= 0) {
            // 替换现有单位
            this.units[category].units[existingIndex] = customUnit;
          } else {
            // 添加新单位
            this.units[category].units.push(customUnit);
          }
        });
      }
    }
  }
};