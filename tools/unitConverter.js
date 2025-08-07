/**
 * 单位转换工具
 * 增强版：支持更多单位类型、批量转换、自定义单位和单位换算表
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-balance-scale"></i> 单位转换</h2>
          <p class="tool-description">在不同单位之间进行转换，支持长度、面积、体积、重量等多种单位，提供批量转换和单位换算表。</p>
        </div>
        
        <div class="unit-tabs">
          <div class="tab-header">
            <button class="tab-btn active" data-tab="converter">单位转换</button>
            <button class="tab-btn" data-tab="batch">批量转换</button>
            <button class="tab-btn" data-tab="table">换算表</button>
            <button class="tab-btn" data-tab="custom">自定义单位</button>
          </div>
          
          <div class="tab-content active" id="tab-converter">
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
                  <option value="currency">货币</option>
                  <option value="angle">角度</option>
                  <option value="fuel">燃油效率</option>
                  <option value="power">功率</option>
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
            </div>
          </div>
          
          <div class="tab-content" id="tab-batch">
            <div class="batch-container">
              <div class="batch-header">
                <h3>批量单位转换</h3>
                <p class="batch-description">一次性转换多个值，每行输入一个数值</p>
              </div>
              
              <div class="batch-settings">
                <div class="form-group">
                  <label for="batch-category">单位类型</label>
                  <select id="batch-category" class="form-control">
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
                    <option value="currency">货币</option>
                    <option value="angle">角度</option>
                    <option value="fuel">燃油效率</option>
                    <option value="power">功率</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="batch-from-unit">从</label>
                  <select id="batch-from-unit" class="form-control"></select>
                </div>
                
                <div class="form-group">
                  <label for="batch-to-unit">到</label>
                  <select id="batch-to-unit" class="form-control"></select>
                </div>
              </div>
              
              <div class="batch-content">
                <div class="form-group">
                  <label for="batch-input">输入值（每行一个）</label>
                  <textarea id="batch-input" class="form-control" placeholder="输入要转换的值，每行一个..."></textarea>
                </div>
                
                <div class="batch-actions">
                  <button id="batch-convert-btn" class="btn btn-success"><i class="fa fa-refresh"></i> 批量转换</button>
                  <button id="batch-clear-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
                </div>
                
                <div class="form-group">
                  <label for="batch-output">转换结果</label>
                  <textarea id="batch-output" class="form-control" readonly></textarea>
                </div>
                
                <div class="batch-output-actions">
                  <button id="batch-copy-btn" class="btn"><i class="fa fa-copy"></i> 复制结果</button>
                  <div class="form-check">
                    <input type="checkbox" id="batch-include-unit" checked />
                    <label for="batch-include-unit">包含单位</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="tab-content" id="tab-table">
            <div class="table-container">
              <div class="table-header">
                <h3>单位换算表</h3>
                <div class="table-actions">
                  <select id="table-category" class="form-control">
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
                    <option value="currency">货币</option>
                    <option value="angle">角度</option>
                    <option value="fuel">燃油效率</option>
                    <option value="power">功率</option>
                  </select>
                  <button id="generate-table" class="btn btn-success"><i class="fa fa-table"></i> 生成换算表</button>
                </div>
              </div>
              
              <div class="table-content" id="table-content">
                <div class="table-placeholder">选择单位类型并点击"生成换算表"按钮</div>
              </div>
              
              <div class="table-export">
                <button id="export-table" class="btn"><i class="fa fa-download"></i> 导出为CSV</button>
                <button id="print-table" class="btn"><i class="fa fa-print"></i> 打印表格</button>
              </div>
            </div>
          </div>
          
          <div class="tab-content" id="tab-custom">
            <div class="custom-container">
              <div class="custom-header">
                <h3>自定义单位</h3>
                <p class="custom-description">创建自定义单位和转换因子</p>
              </div>
              
              <div class="custom-form">
                <div class="form-group">
                  <label for="custom-category">单位类型</label>
                  <select id="custom-category" class="form-control">
                    <option value="length">长度</option>
                    <option value="area">面积</option>
                    <option value="volume">体积</option>
                    <option value="weight">重量</option>
                    <option value="speed">速度</option>
                    <option value="pressure">压力</option>
                    <option value="energy">能量</option>
                    <option value="data">数据存储</option>
                    <option value="power">功率</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="custom-id">单位ID</label>
                  <input type="text" id="custom-id" class="form-control" placeholder="例如: my_unit" />
                </div>
                
                <div class="form-group">
                  <label for="custom-name">单位名称</label>
                  <input type="text" id="custom-name" class="form-control" placeholder="例如: 我的单位 (mu)" />
                </div>
                
                <div class="form-group">
                  <label for="custom-factor">转换因子（相对于基本单位）</label>
                  <input type="number" id="custom-factor" class="form-control" placeholder="例如: 2.5" step="any" />
                </div>
                
                <div class="custom-actions">
                  <button id="add-custom-unit" class="btn btn-success"><i class="fa fa-plus"></i> 添加单位</button>
                  <button id="reset-custom-units" class="btn btn-secondary"><i class="fa fa-refresh"></i> 重置为默认</button>
                </div>
              </div>
              
              <div class="custom-units">
                <div class="custom-units-header">
                  <h3>已添加的自定义单位</h3>
                </div>
                
                <div class="custom-units-list" id="custom-units-list">
                  <div class="no-custom-units">暂无自定义单位</div>
                </div>
              </div>
            </div>
          </div>
        
        <div class="unit-history">
          <div class="history-header">
            <h3>转换历史</h3>
            <div class="history-actions">
              <button id="export-history" class="btn btn-sm"><i class="fa fa-download"></i> 导出</button>
              <button id="clear-history" class="btn btn-sm btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
            </div>
          </div>
          <div class="history-content" id="history-content">
            <div class="no-history">暂无转换历史</div>
          </div>
        </div>
        
        <div class="unit-favorites">
          <div class="favorites-header">
            <h3>常用转换</h3>
            <button id="clear-favorites" class="btn btn-sm btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
          </div>
          <div class="favorites-content" id="favorites-content">
            <div class="no-favorites">暂无常用转换，点击历史记录中的<i class="fa fa-star-o"></i>添加</div>
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
      
      // 获取额外元素
      const tabButtons = container.querySelectorAll('.tab-btn');
      const tabContents = container.querySelectorAll('.tab-content');
      
      // 批量转换元素
      const batchCategory = container.querySelector('#batch-category');
      const batchFromUnit = container.querySelector('#batch-from-unit');
      const batchToUnit = container.querySelector('#batch-to-unit');
      const batchInput = container.querySelector('#batch-input');
      const batchOutput = container.querySelector('#batch-output');
      const batchConvertBtn = container.querySelector('#batch-convert-btn');
      const batchClearBtn = container.querySelector('#batch-clear-btn');
      const batchCopyBtn = container.querySelector('#batch-copy-btn');
      const batchIncludeUnit = container.querySelector('#batch-include-unit');
      
      // 换算表元素
      const tableCategory = container.querySelector('#table-category');
      const generateTable = container.querySelector('#generate-table');
      const tableContent = container.querySelector('#table-content');
      const exportTable = container.querySelector('#export-table');
      const printTable = container.querySelector('#print-table');
      
      // 自定义单位元素
      const customCategory = container.querySelector('#custom-category');
      const customId = container.querySelector('#custom-id');
      const customName = container.querySelector('#custom-name');
      const customFactor = container.querySelector('#custom-factor');
      const addCustomUnit = container.querySelector('#add-custom-unit');
      const resetCustomUnits = container.querySelector('#reset-custom-units');
      const customUnitsList = container.querySelector('#custom-units-list');
      
      // 切换标签页
      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          tabButtons.forEach(b => b.classList.remove('active'));
          tabContents.forEach(c => c.classList.remove('active'));
          
          btn.classList.add('active');
          document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
          
          // 同步数据
          if (btn.dataset.tab === 'batch') {
            batchCategory.value = categorySelect.value;
            populateBatchUnitSelectors(batchCategory.value);
          } else if (btn.dataset.tab === 'table') {
            tableCategory.value = categorySelect.value;
          } else if (btn.dataset.tab === 'custom') {
            updateCustomUnitsList();
          }
        });
      });
      
      // 单位定义
      const defaultUnits = {
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
        } 
        // 特殊处理燃油效率转换
        else if (category === 'fuel') {
          result = convertFuelEfficiency(value, fromUnitId, toUnitId);
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
      }
      
      // 燃油效率转换
      function convertFuelEfficiency(value, fromUnit, toUnit) {
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
      
      // 格式化数字，添加千位分隔符
      function formatNumberWithCommas(value) {
        // 检查是否为指数表示法
        if (String(value).includes('e')) {
          return value;
        }
        
        // 分离整数部分和小数部分
        const parts = String(value).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        return parts.join('.');
      }
      
      // 复制到剪贴板
      function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
          const successful = document.execCommand('copy');
          document.body.removeChild(textarea);
          if (successful) {
            showToast('已复制到剪贴板', 'success');
          } else {
            showToast('复制失败', 'error');
          }
        } catch (err) {
          document.body.removeChild(textarea);
          showToast('复制失败: ' + err, 'error');
        }
      }
      
      // 显示提示消息
      function showToast(message, type = 'info') {
        if (window.showToast) {
          window.showToast(message, type);
        } else {
          alert(message);
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
        const favorites = JSON.parse(localStorage.getItem('unitConversionFavorites') || '[]');
        
        if (history.length === 0) {
          historyContent.innerHTML = '<div class="no-history">暂无转换历史</div>';
        } else {
          let html = '';
          history.forEach((item, index) => {
            const date = new Date(item.timestamp);
            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            
            // 检查是否为收藏项
            const isFavorite = favorites.some(fav => 
              fav.category === item.category && 
              fav.fromUnit === item.fromUnit && 
              fav.toUnit === item.toUnit
            );
            
            html += `
              <div class="history-item">
                <div class="history-item-header">
                  <span class="history-category">${item.categoryName}</span>
                  <span class="history-date">${formattedDate}</span>
                </div>
                <div class="history-item-content">
                  <div class="history-conversion">
                    ${formatNumberWithCommas(formatResult(item.fromValue))} ${item.fromUnitName} = ${formatNumberWithCommas(formatResult(item.toValue))} ${item.toUnitName}
                  </div>
                </div>
                <div class="history-item-actions">
                  <button class="btn btn-sm use-conversion" data-index="${index}" title="使用此转换"><i class="fa fa-arrow-up"></i></button>
                  <button class="btn btn-sm toggle-favorite" data-index="${index}" title="${isFavorite ? '取消收藏' : '添加到常用'}">
                    <i class="fa ${isFavorite ? 'fa-star' : 'fa-star-o'}"></i>
                  </button>
                  <button class="btn btn-sm delete-history" data-index="${index}" title="删除此记录"><i class="fa fa-times"></i></button>
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
              
              // 切换到转换标签页
              tabButtons[0].click();
            });
          });
          
          // 添加收藏/取消收藏事件
          historyContent.querySelectorAll('.toggle-favorite').forEach(btn => {
            btn.addEventListener('click', () => {
              const index = parseInt(btn.getAttribute('data-index'));
              const item = history[index];
              
              toggleFavorite(item);
              updateHistoryDisplay();
              updateFavoritesDisplay();
            });
          });
          
          // 添加删除历史记录事件
          historyContent.querySelectorAll('.delete-history').forEach(btn => {
            btn.addEventListener('click', () => {
              const index = parseInt(btn.getAttribute('data-index'));
              
              // 删除历史记录
              history.splice(index, 1);
              localStorage.setItem('unitConversionHistory', JSON.stringify(history));
              
              // 更新显示
              updateHistoryDisplay();
            });
          });
        }
        
        // 更新收藏夹显示
        updateFavoritesDisplay();
      }
      
      // 更新收藏夹显示
      function updateFavoritesDisplay() {
        const favorites = JSON.parse(localStorage.getItem('unitConversionFavorites') || '[]');
        
        if (favorites.length === 0) {
          favoritesContent.innerHTML = '<div class="no-favorites">暂无常用转换，点击历史记录中的<i class="fa fa-star-o"></i>添加</div>';
        } else {
          let html = '';
          favorites.forEach((item, index) => {
            html += `
              <div class="favorite-item">
                <div class="favorite-item-header">
                  <span class="favorite-category">${item.categoryName}</span>
                </div>
                <div class="favorite-item-content">
                  <div class="favorite-conversion">
                    ${item.fromUnitName} → ${item.toUnitName}
                  </div>
                </div>
                <div class="favorite-item-actions">
                  <button class="btn btn-sm use-favorite" data-index="${index}" title="使用此转换"><i class="fa fa-arrow-up"></i></button>
                  <button class="btn btn-sm remove-favorite" data-index="${index}" title="从常用中移除"><i class="fa fa-times"></i></button>
                </div>
              </div>
            `;
          });
          
          favoritesContent.innerHTML = html;
          
          // 添加事件监听
          favoritesContent.querySelectorAll('.use-favorite').forEach(btn => {
            btn.addEventListener('click', () => {
              const index = parseInt(btn.getAttribute('data-index'));
              const item = favorites[index];
              
              // 设置类别
              categorySelect.value = item.category;
              populateUnitSelectors(item.category);
              
              // 设置单位
              fromUnit.value = item.fromUnit;
              toUnit.value = item.toUnit;
              
              // 如果有值，设置值
              if (item.fromValue) {
                fromValue.value = item.fromValue;
              }
              
              // 执行转换
              convertUnits();
              
              // 切换到转换标签页
              tabButtons[0].click();
            });
          });
          
          // 添加删除收藏事件
          favoritesContent.querySelectorAll('.remove-favorite').forEach(btn => {
            btn.addEventListener('click', () => {
              const index = parseInt(btn.getAttribute('data-index'));
              
              // 删除收藏
              favorites.splice(index, 1);
              localStorage.setItem('unitConversionFavorites', JSON.stringify(favorites));
              
              // 更新显示
              updateFavoritesDisplay();
              updateHistoryDisplay();
            });
          });
        }
      }
      
      // 切换收藏状态
      function toggleFavorite(item) {
        const favorites = JSON.parse(localStorage.getItem('unitConversionFavorites') || '[]');
        
        // 检查是否已收藏
        const existingIndex = favorites.findIndex(fav => 
          fav.category === item.category && 
          fav.fromUnit === item.fromUnit && 
          fav.toUnit === item.toUnit
        );
        
        if (existingIndex >= 0) {
          // 取消收藏
          favorites.splice(existingIndex, 1);
          showToast('已从常用转换中移除', 'info');
        } else {
          // 添加收藏
          favorites.push({
            category: item.category,
            categoryName: item.categoryName,
            fromUnit: item.fromUnit,
            fromUnitName: item.fromUnitName,
            toUnit: item.toUnit,
            toUnitName: item.toUnitName,
            fromValue: item.fromValue
          });
          showToast('已添加到常用转换', 'success');
        }
        
        localStorage.setItem('unitConversionFavorites', JSON.stringify(favorites));
      }
      
      // 导出历史记录
      function exportHistory() {
        const history = JSON.parse(localStorage.getItem('unitConversionHistory') || '[]');
        
        if (history.length === 0) {
          showToast('没有历史记录可导出', 'warning');
          return;
        }
        
        // 创建CSV内容
        let csvContent = '类别,输入值,输入单位,结果值,结果单位,时间\n';
        
        history.forEach(item => {
          const date = new Date(item.timestamp);
          const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
          
          csvContent += `${item.categoryName},${item.fromValue},${item.fromUnitName},${item.toValue},${item.toUnitName},${formattedDate}\n`;
        });
        
        // 创建下载链接
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', '单位转换历史记录.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('历史记录已导出为CSV文件', 'success');
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
      
      // 导出历史记录按钮
      const exportHistoryBtn = container.querySelector('#export-history');
      exportHistoryBtn.addEventListener('click', exportHistory);
      
      // 清空历史记录按钮
      clearHistory.addEventListener('click', () => {
        if (confirm('确定要清空转换历史吗？')) {
          localStorage.removeItem('unitConversionHistory');
          updateHistoryDisplay();
          showToast('转换历史已清空', 'info');
        }
      });
      
      // 清空收藏按钮
      const clearFavorites = container.querySelector('#clear-favorites');
      clearFavorites.addEventListener('click', () => {
        if (confirm('确定要清空常用转换吗？')) {
          localStorage.removeItem('unitConversionFavorites');
          updateFavoritesDisplay();
          updateHistoryDisplay();
          showToast('常用转换已清空', 'info');
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
      
      // 批量转换功能
      function populateBatchUnitSelectors(category) {
        const categoryData = units[category];
        
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
      }
      
      // 执行批量转换
      function batchConvert() {
        const category = batchCategory.value;
        const categoryData = units[category];
        const fromUnitId = batchFromUnit.value;
        const toUnitId = batchToUnit.value;
        const inputLines = batchInput.value.trim().split('\n');
        
        if (inputLines.length === 0 || (inputLines.length === 1 && inputLines[0] === '')) {
          showToast('请输入要转换的值', 'warning');
          return;
        }
        
        const results = [];
        let hasError = false;
        
        inputLines.forEach(line => {
          // 支持带单位的输入，如 "5 km" 或 "5km"
          const cleanLine = line.trim();
          const match = cleanLine.match(/^([-+]?\d*\.?\d+)\s*([a-zA-Z°'"\u00B0\u2032\u2033_]+)?$/);
          
          let value, detectedUnit;
          
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
                fromUnitId = unitMatch.id;
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
            result = convertTemperature(value, fromUnitId, toUnitId);
          } 
          // 特殊处理燃油效率转换
          else if (category === 'fuel') {
            result = convertFuelEfficiency(value, fromUnitId, toUnitId);
          } else {
            // 通用转换方法
            const fromUnitData = categoryData.units.find(u => u.id === fromUnitId);
            const toUnitData = categoryData.units.find(u => u.id === toUnitId);
            
            if (!fromUnitData || !toUnitData) {
              results.push('单位转换错误');
              hasError = true;
              return;
            }
            
            result = value * (fromUnitData.factor / toUnitData.factor);
          }
          
          // 格式化结果
          const formattedResult = formatResult(result);
          
          // 添加单位
          if (batchIncludeUnit.checked) {
            const toUnitName = getUnitName(category, toUnitId);
            results.push(`${formattedResult} ${toUnitName}`);
          } else {
            results.push(formattedResult);
          }
        });
        
        // 显示结果
        batchOutput.value = results.join('\n');
        
        if (hasError) {
          showToast('部分值转换失败，请检查输入', 'warning');
        } else {
          showToast('批量转换完成', 'success');
        }
      }
      
      // 生成换算表
      function generateConversionTable() {
        const category = tableCategory.value;
        const categoryData = units[category];
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
              value = convertTemperature(1, fromUnit.id, toUnit.id);
            } 
            // 特殊处理燃油效率
            else if (category === 'fuel') {
              value = convertFuelEfficiency(1, fromUnit.id, toUnit.id);
            } else {
              // 通用转换
              value = 1 * (fromUnit.factor / toUnit.factor);
            }
            
            tableHtml += `<td>${formatResult(value)}</td>`;
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
        
        showToast('换算表已生成', 'success');
      }
      
      // 导出表格为CSV
      function exportTableToCSV() {
        const category = tableCategory.value;
        const categoryData = units[category];
        const unitsList = categoryData.units;
        
        if (unitsList.length === 0) {
          showToast('没有可导出的数据', 'warning');
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
              value = convertTemperature(1, fromUnit.id, toUnit.id);
            } else {
              value = 1 * (fromUnit.factor / toUnit.factor);
            }
            
            csvContent += `,${formatResult(value)}`;
          });
          
          csvContent += '\n';
        });
        
        // 创建下载链接
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${categoryData.name}单位换算表.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      // 打印表格
      function printConversionTable() {
        const category = tableCategory.value;
        const categoryData = units[category];
        
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
      
      // 自定义单位功能
      function loadCustomUnits() {
        const savedUnits = JSON.parse(localStorage.getItem('customUnits') || '{}');
        
        // 合并默认单位和自定义单位
        units = JSON.parse(JSON.stringify(defaultUnits)); // 深拷贝默认单位
        
        // 添加自定义单位
        for (const category in savedUnits) {
          if (units[category]) {
            savedUnits[category].forEach(customUnit => {
              // 检查是否已存在相同ID的单位
              const existingIndex = units[category].units.findIndex(u => u.id === customUnit.id);
              if (existingIndex >= 0) {
                // 替换现有单位
                units[category].units[existingIndex] = customUnit;
              } else {
                // 添加新单位
                units[category].units.push(customUnit);
              }
            });
          }
        }
      }
      
      // 添加自定义单位
      function addCustomUnit() {
        const category = customCategory.value;
        const id = customId.value.trim();
        const name = customName.value.trim();
        const factor = parseFloat(customFactor.value);
        
        if (!id || !name) {
          showToast('请输入单位ID和名称', 'warning');
          return;
        }
        
        if (isNaN(factor) || factor <= 0) {
          showToast('请输入有效的转换因子', 'warning');
          return;
        }
        
        // 获取现有自定义单位
        const savedUnits = JSON.parse(localStorage.getItem('customUnits') || '{}');
        if (!savedUnits[category]) {
          savedUnits[category] = [];
        }
        
        // 检查是否已存在相同ID的单位
        const existingIndex = savedUnits[category].findIndex(u => u.id === id);
        const customUnit = { id, name, factor };
        
        if (existingIndex >= 0) {
          // 更新现有单位
          savedUnits[category][existingIndex] = customUnit;
        } else {
          // 添加新单位
          savedUnits[category].push(customUnit);
        }
        
        // 保存自定义单位
        localStorage.setItem('customUnits', JSON.stringify(savedUnits));
        
        // 重新加载单位
        loadCustomUnits();
        
        // 更新选择器
        populateUnitSelectors(categorySelect.value);
        if (batchCategory.value === category) {
          populateBatchUnitSelectors(category);
        }
        
        // 更新自定义单位列表
        updateCustomUnitsList();
        
        // 清空输入
        customId.value = '';
        customName.value = '';
        customFactor.value = '';
        
        showToast('自定义单位已添加', 'success');
      }
      
      // 重置自定义单位
      function resetCustomUnits() {
        if (confirm('确定要重置所有自定义单位吗？这将恢复默认单位设置。')) {
          localStorage.removeItem('customUnits');
          units = JSON.parse(JSON.stringify(defaultUnits)); // 深拷贝默认单位
          
          // 更新选择器
          populateUnitSelectors(categorySelect.value);
          if (tabButtons[1].classList.contains('active')) {
            populateBatchUnitSelectors(batchCategory.value);
          }
          
          // 更新自定义单位列表
          updateCustomUnitsList();
          
          showToast('已重置为默认单位', 'info');
        }
      }
      
      // 更新自定义单位列表
      function updateCustomUnitsList() {
        const savedUnits = JSON.parse(localStorage.getItem('customUnits') || '{}');
        const category = customCategory.value;
        
        if (!savedUnits[category] || savedUnits[category].length === 0) {
          customUnitsList.innerHTML = '<div class="no-custom-units">暂无自定义单位</div>';
          return;
        }
        
        let html = '';
        savedUnits[category].forEach(unit => {
          html += `
            <div class="custom-unit-item">
              <div class="custom-unit-info">
                <div class="custom-unit-name">${unit.name}</div>
                <div class="custom-unit-details">ID: ${unit.id}, 因子: ${unit.factor}</div>
              </div>
              <div class="custom-unit-actions">
                <button class="btn btn-sm btn-danger delete-custom-unit" data-id="${unit.id}"><i class="fa fa-trash-o"></i></button>
              </div>
            </div>
          `;
        });
        
        customUnitsList.innerHTML = html;
        
        // 添加删除事件
        customUnitsList.querySelectorAll('.delete-custom-unit').forEach(btn => {
          btn.addEventListener('click', () => {
            const unitId = btn.getAttribute('data-id');
            deleteCustomUnit(category, unitId);
          });
        });
      }
      
      // 删除自定义单位
      function deleteCustomUnit(category, unitId) {
        if (confirm('确定要删除此自定义单位吗？')) {
          const savedUnits = JSON.parse(localStorage.getItem('customUnits') || '{}');
          
          if (savedUnits[category]) {
            const index = savedUnits[category].findIndex(u => u.id === unitId);
            if (index >= 0) {
              savedUnits[category].splice(index, 1);
              
              // 如果分类为空，删除分类
              if (savedUnits[category].length === 0) {
                delete savedUnits[category];
              }
              
              // 保存更新后的单位
              localStorage.setItem('customUnits', JSON.stringify(savedUnits));
              
              // 重新加载单位
              loadCustomUnits();
              
              // 更新选择器
              populateUnitSelectors(categorySelect.value);
              if (batchCategory.value === category) {
                populateBatchUnitSelectors(category);
              }
              
              // 更新自定义单位列表
              updateCustomUnitsList();
              
              showToast('自定义单位已删除', 'info');
            }
          }
        }
      }
      
      // 批量转换事件监听
      batchCategory.addEventListener('change', () => {
        populateBatchUnitSelectors(batchCategory.value);
      });
      
      batchConvertBtn.addEventListener('click', batchConvert);
      
      batchClearBtn.addEventListener('click', () => {
        batchInput.value = '';
        batchOutput.value = '';
      });
      
      batchCopyBtn.addEventListener('click', () => {
        if (batchOutput.value) {
          copyToClipboard(batchOutput.value);
        } else {
          showToast('没有结果可复制', 'warning');
        }
      });
      
      // 换算表事件监听
      generateTable.addEventListener('click', generateConversionTable);
      
      exportTable.addEventListener('click', exportTableToCSV);
      
      printTable.addEventListener('click', printConversionTable);
      
      // 自定义单位事件监听
      customCategory.addEventListener('change', updateCustomUnitsList);
      
      addCustomUnit.addEventListener('click', addCustomUnit);
      
      resetCustomUnits.addEventListener('click', resetCustomUnits);
      
      // 加载自定义单位
      loadCustomUnits();
      
      // 初始化
      populateUnitSelectors(categorySelect.value);
      updateHistoryDisplay();
      
      // 添加货币单位
      function addCurrencyUnits() {
        if (!units.currency) {
          units.currency = {
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
        
        // 添加汇率更新按钮
        const currencyUpdateBtn = document.createElement('button');
        currencyUpdateBtn.className = 'btn btn-sm';
        currencyUpdateBtn.innerHTML = '<i class="fa fa-refresh"></i> 更新汇率';
        currencyUpdateBtn.title = '尝试获取最新汇率数据';
        
        // 只在选择货币类型时显示更新按钮
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
              const unitIndex = units.currency.units.findIndex(u => u.id === code);
              if (unitIndex >= 0) {
                units.currency.units[unitIndex].factor = rate;
              }
            }
            
            // 更新当前显示
            if (categorySelect.value === 'currency') {
              convertUnits();
            }
            
            // 恢复按钮状态
            this.disabled = false;
            this.innerHTML = '<i class="fa fa-refresh"></i> 更新汇率';
            
            // 显示更新时间
            const now = new Date();
            const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            showToast(`汇率已更新 (${timeStr})`, 'success');
            
            // 保存到本地存储
            const savedRates = {
              rates: newRates,
              timestamp: now.getTime()
            };
            localStorage.setItem('currencyRates', JSON.stringify(savedRates));
          }, 1500);
        });
        
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
                const unitIndex = units.currency.units.findIndex(u => u.id === code);
                if (unitIndex >= 0) {
                  units.currency.units[unitIndex].factor = rate;
                }
              }
            }
          } catch (e) {
            console.error('加载保存的汇率失败', e);
          }
        }
      }
      
      // 添加角度单位
      function addAngleUnits() {
        if (!units.angle) {
          units.angle = {
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
      }
      
      // 添加燃油效率单位
      function addFuelUnits() {
        if (!units.fuel) {
          units.fuel = {
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
      }
      
      // 添加功率单位
      function addPowerUnits() {
        if (!units.power) {
          units.power = {
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
      }
      
      // 初始化额外单位
      addCurrencyUnits();
      addAngleUnits();
      addFuelUnits();
      addPowerUnits();
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .unit-tabs {
          margin-bottom: 30px;
        }
        
        .tab-header {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 20px;
          overflow-x: auto;
        }
        
        .tab-btn {
          padding: 10px 20px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-weight: 500;
          color: var(--text-color);
          white-space: nowrap;
        }
        
        .tab-btn.active {
          border-bottom-color: var(--primary-color);
          color: var(--primary-color);
        }
        
        .tab-content {
          display: none;
        }
        
        .tab-content.active {
          display: block;
        }
        
        .batch-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .batch-settings {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }
        
        .batch-settings .form-group {
          flex: 1;
          min-width: 150px;
        }
        
        .batch-actions {
          display: flex;
          gap: 10px;
          margin: 15px 0;
        }
        
        .batch-output-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }
        
        .table-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .table-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        
        .table-content {
          overflow-x: auto;
          margin: 20px 0;
        }
        
        .table-placeholder {
          text-align: center;
          padding: 30px;
          color: var(--text-muted);
        }
        
        .table-export {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        
        .conversion-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .conversion-table th,
        .conversion-table td {
          border: 1px solid var(--border-color);
          padding: 8px;
          text-align: center;
        }
        
        .conversion-table th {
          background-color: var(--card-bg);
          font-weight: 500;
        }
        
        .conversion-table tr:nth-child(even) td {
          background-color: var(--bg-light);
        }
        
        .custom-container {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        .custom-form {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 20px;
        }
        
        .custom-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        
        .custom-units-header {
          margin-bottom: 15px;
        }
        
        .custom-unit-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 15px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          margin-bottom: 10px;
          background-color: var(--card-bg);
        }
        
        .custom-unit-name {
          font-weight: 500;
          margin-bottom: 5px;
        }
        
        .custom-unit-details {
          font-size: 12px;
          color: var(--text-muted);
        }
        
        .no-custom-units {
          text-align: center;
          padding: 20px;
          color: var(--text-muted);
          border: 1px dashed var(--border-color);
          border-radius: 6px;
        }
        
        .table-filter-container {
          margin-bottom: 15px;
        }
        
        #table-filter {
          width: 100%;
          max-width: 300px;
        }
        
        .highlight-row {
          background-color: var(--highlight-color) !important;
        }
        
        .conversion-table tr:hover td {
          background-color: var(--highlight-color);
        }
        
        @media print {
          .tool-header, .tab-header, .table-actions, .table-export, .table-filter-container {
            display: none !important;
          }
          
          .conversion-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .conversion-table th, .conversion-table td {
            border: 1px solid #000;
          }
        }
        
        /* 响应式设计优化 */
        @media (max-width: 768px) {
          .batch-settings, .table-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .batch-settings .form-group, .table-actions {
            width: 100%;
          }
          
          .conversion-table {
            font-size: 12px;
          }
          
          .conversion-table th, .conversion-table td {
            padding: 4px;
          }
          
          .unit-history {
            margin-top: 30px;
          }
        }
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
