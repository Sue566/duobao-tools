/**
 * 单位转换工具
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-balance-scale"></i> 单位转换</h2>
          <p class="tool-description">在不同单位之间进行转换，支持长度、面积、体积、重量等多种单位。</p>
        </div>
        
        <div class="unit-container">
          <div class="unit-category-selector">
            <label for="unit-category">选择单位类型</label>
            <select id="unit-category" class="form-control">
              <option value="length">长度</option>
              <option value="area">面积</option>
              <option value="volume">体积</option>
              <option value="weight">重量</option>
              <option value="temperature">温度</option>
              <option value="time">时间</option>
              <option value="speed">速度</option>
              <option value="pressure">压力</option>
              <option value="energy">能量</option>
              <option value="data">数据存储</option>
            </select>
          </div>
          
          <div class="unit-converter">
            <div class="unit-input-section">
              <div class="form-group">
                <label for="from-value">输入值</label>
                <input type="number" id="from-value" class="form-control" value="1" step="any" />
              </div>
              
              <div class="form-group">
                <label for="from-unit">从</label>
                <select id="from-unit" class="form-control"></select>
              </div>
            </div>
            
            <div class="unit-swap">
              <button id="swap-units" class="btn btn-icon" title="交换单位"><i class="fa fa-exchange"></i></button>
            </div>
            
            <div class="unit-input-section">
              <div class="form-group">
                <label for="to-value">结果</label>
                <input type="number" id="to-value" class="form-control" readonly />
              </div>
              
              <div class="form-group">
                <label for="to-unit">到</label>
                <select id="to-unit" class="form-control"></select>
              </div>
            </div>
          </div>
          
          <div class="unit-actions">
            <button id="convert-btn" class="btn btn-success"><i class="fa fa-refresh"></i> 转换</button>
            <button id="copy-result" class="btn"><i class="fa fa-copy"></i> 复制结果</button>
            <button id="clear-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
          </div>
        </div>
        
        <div class="unit-formula">
          <div class="formula-header">
            <h3>转换公式</h3>
          </div>
          <div class="formula-content" id="formula-content">
            选择单位类型和单位以查看转换公式
          </div>
        </div>
        
        <div class="unit-history">
          <div class="history-header">
            <h3>转换历史</h3>
            <button id="clear-history" class="btn btn-sm btn-secondary"><i class="fa fa-trash-o"></i> 清空历史</button>
          </div>
          <div class="history-content" id="history-content">
            <div class="no-history">暂无转换历史</div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('unitConverter', container.querySelector('.tool-header'));
      
      // 获取元素
      const categorySelect = container.querySelector('#unit-category');
      const fromValue = container.querySelector('#from-value');
      const fromUnit = container.querySelector('#from-unit');
      const toValue = container.querySelector('#to-value');
      const toUnit = container.querySelector('#to-unit');
      const swapUnits = container.querySelector('#swap-units');
      const convertBtn = container.querySelector('#convert-btn');
      const copyResult = container.querySelector('#copy-result');
      const clearBtn = container.querySelector('#clear-btn');
      const formulaContent = container.querySelector('#formula-content');
      const historyContent = container.querySelector('#history-content');
      const clearHistory = container.querySelector('#clear-history');
      
      // 单位定义
      const units = {
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
            { id: 'mile', name: '英里 (mi)', factor: 1609.344 },
            { id: 'yard', name: '码 (yd)', factor: 0.9144 },
            { id: 'foot', name: '英尺 (ft)', factor: 0.3048 },
            { id: 'inch', name: '英寸 (in)', factor: 0.0254 },
            { id: 'li', name: '里 (中国)', factor: 500 },
            { id: 'zhang', name: '丈 (中国)', factor: 3.33 },
            { id: 'chi', name: '尺 (中国)', factor: 0.33 },
            { id: 'cun', name: '寸 (中国)', factor: 0.033 },
            { id: 'nautical_mile', name: '海里', factor: 1852 }
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
            { id: 'sq_mile', name: '平方英里 (mi²)', factor: 2589988.11 },
            { id: 'acre', name: '英亩 (acre)', factor: 4046.86 },
            { id: 'sq_yard', name: '平方码 (yd²)', factor: 0.836127 },
            { id: 'sq_foot', name: '平方英尺 (ft²)', factor: 0.092903 },
            { id: 'sq_inch', name: '平方英寸 (in²)', factor: 0.00064516 },
            { id: 'mu', name: '亩 (中国)', factor: 666.67 }
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
            { id: 'cubic_foot', name: '立方英尺 (ft³)', factor: 0.0283168 },
            { id: 'cubic_inch', name: '立方英寸 (in³)', factor: 0.0000163871 },
            { id: 'cubic_yard', name: '立方码 (yd³)', factor: 0.764555 },
            { id: 'gallon_us', name: '加仑 (美制)', factor: 0.00378541 },
            { id: 'gallon_uk', name: '加仑 (英制)', factor: 0.00454609 },
            { id: 'quart_us', name: '夸脱 (美制)', factor: 0.000946353 },
            { id: 'pint_us', name: '品脱 (美制)', factor: 0.000473176 },
            { id: 'cup_us', name: '杯 (美制)', factor: 0.000236588 },
            { id: 'fluid_oz_us', name: '液量盎司 (美制)', factor: 0.0000295735 },
            { id: 'tablespoon_us', name: '汤匙 (美制)', factor: 0.0000147868 },
            { id: 'teaspoon_us', name: '茶匙 (美制)', factor: 0.00000492892 }
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
            { id: 'pound', name: '磅 (lb)', factor: 0.453592 },
            { id: 'ounce', name: '盎司 (oz)', factor: 0.0283495 },
            { id: 'stone', name: '英石 (st)', factor: 6.35029 },
            { id: 'jin', name: '斤 (中国)', factor: 0.5 },
            { id: 'liang', name: '两 (中国)', factor: 0.05 },
            { id: 'qian', name: '钱 (中国)', factor: 0.005 }
          ],
          baseUnit: 'kg',
          formula: '结果 = 输入值 × (输入单位的因子 ÷ 输出单位的因子)'
        },
        temperature: {
          name: '温度',
          units: [
            { id: 'celsius', name: '摄氏度 (°C)', factor: 1 },
            { id: 'fahrenheit', name: '华氏度 (°F)', factor: 1 },
            { id: 'kelvin', name: '开尔文 (K)', factor: 1 }
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
      };
      
      // 填充单位选择器
      function populateUnitSelectors(category) {
        const categoryData = units[category];
        
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
        updateFormula(category);
      }
      
      // 更新公式显示
      function updateFormula(category) {
        const categoryData = units[category];
        formulaContent.textContent = categoryData.formula;
      }
      
      // 执行单位转换
      function convertUnits() {
        const category = categorySelect.value;
        const categoryData = units[category];
        const fromUnitId = fromUnit.value;
        const toUnitId = toUnit.value;
        const value = parseFloat(fromValue.value);
        
        if (isNaN(value)) {
          showToast('请输入有效的数值', 'warning');
          return;
        }
        
        let result;
        
        // 特殊处理温度转换
        if (category === 'temperature') {
          result = convertTemperature(value, fromUnitId, toUnitId);
        } else {
          // 通用转换方法
          const fromUnitData = categoryData.units.find(u => u.id === fromUnitId);
          const toUnitData = categoryData.units.find(u => u.id === toUnitId);
          
          if (!fromUnitData || !toUnitData) {
            showToast('单位转换错误', 'error');
            return;
          }
          
          result = value * (fromUnitData.factor / toUnitData.factor);
        }
        
        // 显示结果
        toValue.value = formatResult(result);
        
        // 添加到历史记录
        addToHistory(category, value, fromUnitId, result, toUnitId);
      }
      
      // 温度转换
      function convertTemperature(value, fromUnit, toUnit) {
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
        }
        
        // 从摄氏度转换为目标单位
        switch (toUnit) {
          case 'celsius':
            return celsius;
          case 'fahrenheit':
            return celsius * 9 / 5 + 32;
          case 'kelvin':
            return celsius + 273.15;
        }
      }
      
      // 格式化结果
      function formatResult(value) {
        // 处理非常大或非常小的数字
        if (Math.abs(value) < 0.000001 && value !== 0) {
          return value.toExponential(6);
        }
        
        // 处理普通数字，保留适当的小数位
        const absValue = Math.abs(value);
        if (absValue >= 1000000) {
          return value.toExponential(6);
        } else if (absValue >= 100) {
          return value.toFixed(2);
        } else if (absValue >= 10) {
          return value.toFixed(4);
        } else if (absValue >= 1) {
          return value.toFixed(6);
        } else if (absValue > 0) {
          return value.toFixed(8);
        } else {
          return value.toString();
        }
      }
      
      // 获取单位名称
      function getUnitName(category, unitId) {
        const unit = units[category].units.find(u => u.id === unitId);
        return unit ? unit.name : unitId;
      }
      
      // 添加到历史记录
      function addToHistory(category, fromValue, fromUnitId, toValue, toUnitId) {
        // 获取现有历史记录
        let history = JSON.parse(localStorage.getItem('unitConversionHistory') || '[]');
        
        // 添加新记录
        history.unshift({
          category: category,
          categoryName: units[category].name,
          fromValue: fromValue,
          fromUnit: fromUnitId,
          fromUnitName: getUnitName(category, fromUnitId),
          toValue: toValue,
          toUnit: toUnitId,
          toUnitName: getUnitName(category, toUnitId),
          timestamp: new Date().toISOString()
        });
        
        // 限制历史记录数量
        if (history.length > 10) {
          history = history.slice(0, 10);
        }
        
        // 保存历史记录
        localStorage.setItem('unitConversionHistory', JSON.stringify(history));
        
        // 更新历史记录显示
        updateHistoryDisplay();
      }
      
      // 更新历史记录显示
      function updateHistoryDisplay() {
        const history = JSON.parse(localStorage.getItem('unitConversionHistory') || '[]');
        
        if (history.length === 0) {
          historyContent.innerHTML = '<div class="no-history">暂无转换历史</div>';
          return;
        }
        
        let html = '';
        history.forEach((item, index) => {
          const date = new Date(item.timestamp);
          const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
          
          html += `
            <div class="history-item">
              <div class="history-item-header">
                <span class="history-category">${item.categoryName}</span>
                <span class="history-date">${formattedDate}</span>
              </div>
              <div class="history-item-content">
                <div class="history-conversion">
                  ${formatResult(item.fromValue)} ${item.fromUnitName} = ${formatResult(item.toValue)} ${item.toUnitName}
                </div>
              </div>
              <div class="history-item-actions">
                <button class="btn btn-sm use-conversion" data-index="${index}"><i class="fa fa-arrow-up"></i> 使用</button>
              </div>
            </div>
          `;
        });
        
        historyContent.innerHTML = html;
        
        // 添加事件监听
        historyContent.querySelectorAll('.use-conversion').forEach(btn => {
          btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            const item = history[index];
            
            // 设置类别
            categorySelect.value = item.category;
            populateUnitSelectors(item.category);
            
            // 设置值和单位
            fromValue.value = item.fromValue;
            fromUnit.value = item.fromUnit;
            toUnit.value = item.toUnit;
            
            // 执行转换
            convertUnits();
          });
        });
      }
      
      // 事件监听
      categorySelect.addEventListener('change', () => {
        populateUnitSelectors(categorySelect.value);
      });
      
      swapUnits.addEventListener('click', () => {
        const tempUnit = fromUnit.value;
        fromUnit.value = toUnit.value;
        toUnit.value = tempUnit;
        
        // 如果已经有结果，也交换值
        if (toValue.value) {
          const tempValue = fromValue.value;
          fromValue.value = toValue.value;
          toValue.value = tempValue;
        }
      });
      
      convertBtn.addEventListener('click', convertUnits);
      
      copyResult.addEventListener('click', () => {
        if (toValue.value) {
          copyToClipboard(toValue.value);
        } else {
          showToast('没有结果可复制', 'warning');
        }
      });
      
      clearBtn.addEventListener('click', () => {
        fromValue.value = '1';
        toValue.value = '';
      });
      
      clearHistory.addEventListener('click', () => {
        if (confirm('确定要清空转换历史吗？')) {
          localStorage.removeItem('unitConversionHistory');
          updateHistoryDisplay();
          showToast('转换历史已清空', 'info');
        }
      });
      
      // 自动转换
      fromValue.addEventListener('input', () => {
        if (fromValue.value) {
          convertUnits();
        }
      });
      
      fromUnit.addEventListener('change', () => {
        if (fromValue.value) {
          convertUnits();
        }
      });
      
      toUnit.addEventListener('change', () => {
        if (fromValue.value) {
          convertUnits();
        }
      });
      
      // 初始化
      populateUnitSelectors(categorySelect.value);
      updateHistoryDisplay();
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .unit-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .unit-category-selector {
          margin-bottom: 10px;
        }
        
        .unit-converter {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .unit-input-section {
          flex: 1;
          min-width: 200px;
        }
        
        .unit-swap {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .unit-actions {
          display: flex;
          gap: 10px;
        }
        
        .unit-formula {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 30px;
        }
        
        .formula-header {
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .formula-header h3 {
          margin: 0;
        }
        
        .formula-content {
          padding: 15px;
          font-family: monospace;
          white-space: pre-wrap;
        }
        
        .unit-history {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .history-header h3 {
          margin: 0;
        }
        
        .history-content {
          padding: 15px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .history-item {
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .history-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .history-item-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        
        .history-category {
          font-weight: 500;
        }
        
        .history-date {
          color: var(--text-muted);
          font-size: 12px;
        }
        
        .history-conversion {
          font-family: monospace;
          margin-bottom: 10px;
        }
        
        .history-item-actions {
          display: flex;
          justify-content: flex-end;
        }
        
        .no-history {
          text-align: center;
          padding: 20px;
          color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
          .unit-converter {
            flex-direction: column;
          }
          
          .unit-swap {
            transform: rotate(90deg);
            margin: 10px 0;
          }
        }
      `;
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.unitConverter = tool;
})();
