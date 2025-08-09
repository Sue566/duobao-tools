/**
 * 随机选择器 - UI模块
 */
const RandomPickerUI = {
  // 获取HTML模板
  getHTML: function() {
    return `
      <div class="tool-container">
        <div class="tool-header">
          <h2><i class="fa fa-random"></i> 随机选择器</h2>
          <p class="tool-description">从列表、范围或自定义数据中随机选择项目，支持权重、排除和历史记录。</p>
        </div>
        
        <div class="tool-content">
          <div class="tabs">
            <div class="tab-header">
              <button class="tab-btn active" data-tab="list">列表选择</button>
              <button class="tab-btn" data-tab="range">范围选择</button>
              <button class="tab-btn" data-tab="custom">自定义选择</button>
              <button class="tab-btn" data-tab="group">分组选择</button>
              <button class="tab-btn" data-tab="history">历史记录</button>
            </div>
            
            <div class="tab-content active" id="tab-list">
              <div class="form-group">
                <label for="list-input">输入列表项（每行一项）：</label>
                <textarea id="list-input" class="form-control" rows="8" placeholder="项目1&#10;项目2&#10;项目3"></textarea>
              </div>
              
              <div class="form-group">
                <label for="list-count">选择数量：</label>
                <input type="number" id="list-count" class="form-control" min="1" value="1">
              </div>
              
              <div class="form-check">
                <input type="checkbox" id="list-unique" class="form-check-input" checked>
                <label for="list-unique" class="form-check-label">不重复选择</label>
              </div>
              
              <div class="form-check">
                <input type="checkbox" id="list-weight" class="form-check-input">
                <label for="list-weight" class="form-check-label">使用权重</label>
              </div>
              
              <div id="list-weight-container" class="form-group" style="display: none;">
                <label for="list-weight-input">权重（与列表项一一对应，每行一个数字）：</label>
                <textarea id="list-weight-input" class="form-control" rows="4" placeholder="1&#10;2&#10;1"></textarea>
              </div>
              
              <div class="form-group">
                <button id="list-pick-btn" class="btn btn-primary">随机选择</button>
                <button id="list-clear-btn" class="btn btn-secondary">清空</button>
                <button id="list-save-btn" class="btn btn-info">保存列表</button>
                <button id="list-load-btn" class="btn btn-info">加载列表</button>
              </div>
            </div>
            
            <div class="tab-content" id="tab-range">
              <div class="form-group">
                <label for="range-min">最小值：</label>
                <input type="number" id="range-min" class="form-control" value="1">
              </div>
              
              <div class="form-group">
                <label for="range-max">最大值：</label>
                <input type="number" id="range-max" class="form-control" value="100">
              </div>
              
              <div class="form-group">
                <label for="range-count">选择数量：</label>
                <input type="number" id="range-count" class="form-control" min="1" value="1">
              </div>
              
              <div class="form-check">
                <input type="checkbox" id="range-unique" class="form-check-input" checked>
                <label for="range-unique" class="form-check-label">不重复选择</label>
              </div>
              
              <div class="form-group">
                <label for="range-exclude">排除数字（用逗号分隔）：</label>
                <input type="text" id="range-exclude" class="form-control" placeholder="例如：13,17,42">
              </div>
              
              <div class="form-group">
                <button id="range-pick-btn" class="btn btn-primary">随机选择</button>
                <button id="range-clear-btn" class="btn btn-secondary">清空</button>
              </div>
            </div>
            
            <div class="tab-content" id="tab-custom">
              <div class="form-group">
                <label for="custom-type">自定义类型：</label>
                <select id="custom-type" class="form-control">
                  <option value="dice">骰子</option>
                  <option value="coin">硬币</option>
                  <option value="card">扑克牌</option>
                  <option value="color">随机颜色</option>
                  <option value="date">随机日期</option>
                  <option value="password">随机密码</option>
                </select>
              </div>
              
              <div id="custom-options" class="form-group">
                <!-- 动态加载选项 -->
              </div>
              
              <div class="form-group">
                <button id="custom-pick-btn" class="btn btn-primary">随机选择</button>
                <button id="custom-clear-btn" class="btn btn-secondary">清空</button>
              </div>
            </div>
            
            <div class="tab-content" id="tab-group">
              <div class="form-group">
                <label for="group-count">分组数量：</label>
                <input type="number" id="group-count" class="form-control" min="2" value="2">
              </div>
              
              <div class="form-group">
                <label for="group-input">输入待分组项目（每行一项）：</label>
                <textarea id="group-input" class="form-control" rows="8" placeholder="成员1&#10;成员2&#10;成员3&#10;成员4"></textarea>
              </div>
              
              <div class="form-check">
                <input type="checkbox" id="group-balance" class="form-check-input" checked>
                <label for="group-balance" class="form-check-label">平衡分组（每组人数尽量相等）</label>
              </div>
              
              <div class="form-group">
                <button id="group-pick-btn" class="btn btn-primary">随机分组</button>
                <button id="group-clear-btn" class="btn btn-secondary">清空</button>
              </div>
            </div>
            
            <div class="tab-content" id="tab-history">
              <div class="form-group">
                <button id="history-clear-btn" class="btn btn-danger">清空历史记录</button>
                <button id="history-export-btn" class="btn btn-info">导出历史记录</button>
              </div>
              
              <div id="history-list" class="history-container">
                <!-- 历史记录将在这里显示 -->
                <div class="no-history">暂无历史记录</div>
              </div>
            </div>
          </div>
          
          <div class="result-container">
            <h3>结果</h3>
            <div id="result-display" class="result-display">
              <div class="no-result">点击"随机选择"按钮获取结果</div>
            </div>
            
            <div class="result-actions">
              <button id="copy-result-btn" class="btn btn-sm btn-secondary" disabled>复制结果</button>
              <button id="save-result-btn" class="btn btn-sm btn-info" disabled>保存结果</button>
              <button id="visual-result-btn" class="btn btn-sm btn-primary" disabled>可视化</button>
            </div>
          </div>
          
          <div id="visual-container" class="visual-container" style="display: none;">
            <h3>结果可视化</h3>
            <div class="visual-options">
              <select id="visual-type" class="form-control">
                <option value="pie">饼图</option>
                <option value="bar">柱状图</option>
                <option value="wheel">转盘</option>
              </select>
              <button id="visual-close-btn" class="btn btn-sm btn-secondary">关闭</button>
            </div>
            <div id="visual-display" class="visual-display"></div>
          </div>
        </div>
      </div>
    `;
  },
  
  // 获取样式
  getStyles: function() {
    return `
      .tool-container {
        padding: 15px;
        font-family: Arial, sans-serif;
      }
      
      .tool-header {
        margin-bottom: 20px;
      }
      
      .tool-description {
        color: #666;
        margin-top: 5px;
      }
      
      .tabs {
        margin-bottom: 20px;
      }
      
      .tab-header {
        display: flex;
        border-bottom: 1px solid #ddd;
        margin-bottom: 15px;
      }
      
      .tab-btn {
        padding: 8px 15px;
        background: none;
        border: none;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        outline: none;
      }
      
      .tab-btn:hover {
        background-color: #f5f5f5;
      }
      
      .tab-btn.active {
        border-bottom: 2px solid #007bff;
        color: #007bff;
      }
      
      .tab-content {
        display: none;
        padding: 10px;
      }
      
      .tab-content.active {
        display: block;
      }
      
      .form-group {
        margin-bottom: 15px;
      }
      
      .form-control {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      
      .form-check {
        margin-bottom: 15px;
      }
      
      .btn {
        padding: 8px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 5px;
      }
      
      .btn-primary {
        background-color: #007bff;
        color: white;
      }
      
      .btn-secondary {
        background-color: #6c757d;
        color: white;
      }
      
      .btn-info {
        background-color: #17a2b8;
        color: white;
      }
      
      .btn-danger {
        background-color: #dc3545;
        color: white;
      }
      
      .result-container {
        margin-top: 20px;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      
      .result-display {
        min-height: 100px;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 4px;
        margin-bottom: 10px;
      }
      
      .no-result {
        color: #999;
        text-align: center;
        padding: 20px;
      }
      
      .result-item {
        padding: 8px;
        margin-bottom: 5px;
        background-color: #e9ecef;
        border-radius: 4px;
      }
      
      .result-actions {
        display: flex;
        justify-content: flex-end;
      }
      
      .history-container {
        max-height: 300px;
        overflow-y: auto;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 10px;
      }
      
      .history-item {
        padding: 10px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
      }
      
      .history-item:hover {
        background-color: #f5f5f5;
      }
      
      .history-item-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
      }
      
      .history-item-title {
        font-weight: bold;
      }
      
      .history-item-date {
        color: #999;
        font-size: 0.9em;
      }
      
      .no-history {
        color: #999;
        text-align: center;
        padding: 20px;
      }
      
      .visual-container {
        margin-top: 20px;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      
      .visual-options {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
      }
      
      .visual-display {
        height: 300px;
        background-color: #f8f9fa;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .wheel-container {
        position: relative;
        width: 300px;
        height: 300px;
      }
      
      .wheel {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: relative;
        overflow: hidden;
        transition: transform 3s ease-out;
      }
      
      .wheel-slice {
        position: absolute;
        width: 50%;
        height: 50%;
        transform-origin: bottom right;
        left: 0;
        top: 0;
        text-align: center;
      }
      
      .wheel-pointer {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 20px solid red;
        z-index: 2;
      }
    `;
  },
  
  // 初始化UI和事件监听
  init: function(container) {
    // 获取DOM元素
    this.container = container;
    this.tabButtons = container.querySelectorAll('.tab-btn');
    this.tabContents = container.querySelectorAll('.tab-content');
    
    // 列表选择元素
    this.listInput = container.querySelector('#list-input');
    this.listCount = container.querySelector('#list-count');
    this.listUnique = container.querySelector('#list-unique');
    this.listWeight = container.querySelector('#list-weight');
    this.listWeightContainer = container.querySelector('#list-weight-container');
    this.listWeightInput = container.querySelector('#list-weight-input');
    this.listPickBtn = container.querySelector('#list-pick-btn');
    this.listClearBtn = container.querySelector('#list-clear-btn');
    this.listSaveBtn = container.querySelector('#list-save-btn');
    this.listLoadBtn = container.querySelector('#list-load-btn');
    
    // 范围选择元素
    this.rangeMin = container.querySelector('#range-min');
    this.rangeMax = container.querySelector('#range-max');
    this.rangeCount = container.querySelector('#range-count');
    this.rangeUnique = container.querySelector('#range-unique');
    this.rangeExclude = container.querySelector('#range-exclude');
    this.rangePickBtn = container.querySelector('#range-pick-btn');
    this.rangeClearBtn = container.querySelector('#range-clear-btn');
    
    // 自定义选择元素
    this.customType = container.querySelector('#custom-type');
    this.customOptions = container.querySelector('#custom-options');
    this.customPickBtn = container.querySelector('#custom-pick-btn');
    this.customClearBtn = container.querySelector('#custom-clear-btn');
    
    // 分组选择元素
    this.groupCount = container.querySelector('#group-count');
    this.groupInput = container.querySelector('#group-input');
    this.groupBalance = container.querySelector('#group-balance');
    this.groupPickBtn = container.querySelector('#group-pick-btn');
    this.groupClearBtn = container.querySelector('#group-clear-btn');
    
    // 历史记录元素
    this.historyList = container.querySelector('#history-list');
    this.historyClearBtn = container.querySelector('#history-clear-btn');
    this.historyExportBtn = container.querySelector('#history-export-btn');
    
    // 结果显示元素
    this.resultDisplay = container.querySelector('#result-display');
    this.copyResultBtn = container.querySelector('#copy-result-btn');
    this.saveResultBtn = container.querySelector('#save-result-btn');
    this.visualResultBtn = container.querySelector('#visual-result-btn');
    
    // 可视化元素
    this.visualContainer = container.querySelector('#visual-container');
    this.visualType = container.querySelector('#visual-type');
    this.visualDisplay = container.querySelector('#visual-display');
    this.visualCloseBtn = container.querySelector('#visual-close-btn');
    
    // 绑定事件
    this.bindEvents();
    
    // 初始化自定义选项
    this.updateCustomOptions();
    
    // 加载历史记录
    this.loadHistory();
  },
  
  // 绑定事件
  bindEvents: function() {
    // 标签页切换
    this.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.tabButtons.forEach(b => b.classList.remove('active'));
        this.tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        this.container.querySelector('#tab-' + btn.dataset.tab).classList.add('active');
      });
    });
    
    // 列表选择事件
    this.listWeight.addEventListener('change', () => {
      this.listWeightContainer.style.display = this.listWeight.checked ? 'block' : 'none';
    });
    
    this.listPickBtn.addEventListener('click', () => {
      RandomPickerCore.pickFromList(
        this.listInput.value,
        parseInt(this.listCount.value),
        this.listUnique.checked,
        this.listWeight.checked ? this.listWeightInput.value : null
      );
    });
    
    this.listClearBtn.addEventListener('click', () => {
      this.listInput.value = '';
      this.listCount.value = '1';
      this.listWeightInput.value = '';
      this.resultDisplay.innerHTML = '<div class="no-result">点击"随机选择"按钮获取结果</div>';
      this.copyResultBtn.disabled = true;
      this.saveResultBtn.disabled = true;
      this.visualResultBtn.disabled = true;
    });
    
    this.listSaveBtn.addEventListener('click', () => {
      RandomPickerData.saveList(this.listInput.value);
    });
    
    this.listLoadBtn.addEventListener('click', () => {
      RandomPickerData.loadList(list => {
        if (list) {
          this.listInput.value = list;
        }
      });
    });
    
    // 范围选择事件
    this.rangePickBtn.addEventListener('click', () => {
      RandomPickerCore.pickFromRange(
        parseInt(this.rangeMin.value),
        parseInt(this.rangeMax.value),
        parseInt(this.rangeCount.value),
        this.rangeUnique.checked,
        this.rangeExclude.value
      );
    });
    
    this.rangeClearBtn.addEventListener('click', () => {
      this.rangeMin.value = '1';
      this.rangeMax.value = '100';
      this.rangeCount.value = '1';
      this.rangeExclude.value = '';
      this.resultDisplay.innerHTML = '<div class="no-result">点击"随机选择"按钮获取结果</div>';
      this.copyResultBtn.disabled = true;
      this.saveResultBtn.disabled = true;
      this.visualResultBtn.disabled = true;
    });
    
    // 自定义选择事件
    this.customType.addEventListener('change', () => {
      this.updateCustomOptions();
    });
    
    this.customPickBtn.addEventListener('click', () => {
      const type = this.customType.value;
      const options = this.getCustomOptions(type);
      RandomPickerCore.pickFromCustom(type, options);
    });
    
    this.customClearBtn.addEventListener('click', () => {
      this.updateCustomOptions();
      this.resultDisplay.innerHTML = '<div class="no-result">点击"随机选择"按钮获取结果</div>';
      this.copyResultBtn.disabled = true;
      this.saveResultBtn.disabled = true;
      this.visualResultBtn.disabled = true;
    });
    
    // 分组选择事件
    this.groupPickBtn.addEventListener('click', () => {
      RandomPickerCore.createGroups(
        this.groupInput.value,
        parseInt(this.groupCount.value),
        this.groupBalance.checked
      );
    });
    
    this.groupClearBtn.addEventListener('click', () => {
      this.groupInput.value = '';
      this.groupCount.value = '2';
      this.resultDisplay.innerHTML = '<div class="no-result">点击"随机选择"按钮获取结果</div>';
      this.copyResultBtn.disabled = true;
      this.saveResultBtn.disabled = true;
      this.visualResultBtn.disabled = true;
    });
    
    // 历史记录事件
    this.historyClearBtn.addEventListener('click', () => {
      if (confirm('确定要清空所有历史记录吗？')) {
        RandomPickerHistory.clearHistory();
        this.loadHistory();
      }
    });
    
    this.historyExportBtn.addEventListener('click', () => {
      RandomPickerHistory.exportHistory();
    });
    
    // 结果操作事件
    this.copyResultBtn.addEventListener('click', () => {
      RandomPickerUtils.copyToClipboard(this.resultDisplay.innerText);
    });
    
    this.saveResultBtn.addEventListener('click', () => {
      const result = this.resultDisplay.innerHTML;
      RandomPickerHistory.saveResult(result);
      this.loadHistory();
    });
    
    this.visualResultBtn.addEventListener('click', () => {
      this.visualContainer.style.display = 'block';
      this.updateVisualization();
    });
    
    this.visualCloseBtn.addEventListener('click', () => {
      this.visualContainer.style.display = 'none';
    });
    
    this.visualType.addEventListener('change', () => {
      this.updateVisualization();
    });
  },
  
  // 更新自定义选项
  updateCustomOptions: function() {
    const type = this.customType.value;
    let html = '';
    
    switch (type) {
      case 'dice':
        html = `
          <div class="form-group">
            <label for="dice-sides">骰子面数：</label>
            <input type="number" id="dice-sides" class="form-control" min="2" value="6">
          </div>
          <div class="form-group">
            <label for="dice-count">骰子数量：</label>
            <input type="number" id="dice-count" class="form-control" min="1" value="1">
          </div>
        `;
        break;
        
      case 'coin':
        html = `
          <div class="form-group">
            <label for="coin-count">硬币数量：</label>
            <input type="number" id="coin-count" class="form-control" min="1" value="1">
          </div>
          <div class="form-check">
            <input type="checkbox" id="coin-custom" class="form-check-input">
            <label for="coin-custom" class="form-check-label">自定义正反面文字</label>
          </div>
          <div id="coin-custom-container" style="display: none;">
            <div class="form-group">
              <label for="coin-heads">正面文字：</label>
              <input type="text" id="coin-heads" class="form-control" value="正面">
            </div>
            <div class="form-group">
              <label for="coin-tails">反面文字：</label>
              <input type="text" id="coin-tails" class="form-control" value="反面">
            </div>
          </div>
        `;
        break;
        
      case 'card':
        html = `
          <div class="form-group">
            <label for="card-count">抽取牌数：</label>
            <input type="number" id="card-count" class="form-control" min="1" max="52" value="1">
          </div>
          <div class="form-check">
            <input type="checkbox" id="card-jokers" class="form-check-input">
            <label for="card-jokers" class="form-check-label">包含大小王</label>
          </div>
          <div class="form-check">
            <input type="checkbox" id="card-unique" class="form-check-input" checked>
            <label for="card-unique" class="form-check-label">不重复抽取</label>
          </div>
        `;
        break;
        
      case 'color':
        html = `
          <div class="form-group">
            <label for="color-count">颜色数量：</label>
            <input type="number" id="color-count" class="form-control" min="1" value="1">
          </div>
          <div class="form-group">
            <label for="color-format">颜色格式：</label>
            <select id="color-format" class="form-control">
              <option value="hex">十六进制 (#RRGGBB)</option>
              <option value="rgb">RGB (rgb(r,g,b))</option>
              <option value="hsl">HSL (hsl(h,s%,l%))</option>
            </select>
          </div>
        `;
        break;
        
      case 'date':
        html = `
          <div class="form-group">
            <label for="date-start">开始日期：</label>
            <input type="date" id="date-start" class="form-control" value="${new Date().toISOString().slice(0, 10)}">
          </div>
          <div class="form-group">
            <label for="date-end">结束日期：</label>
            <input type="date" id="date-end" class="form-control" value="${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}">
          </div>
          <div class="form-group">
            <label for="date-count">日期数量：</label>
            <input type="number" id="date-count" class="form-control" min="1" value="1">
          </div>
          <div class="form-check">
            <input type="checkbox" id="date-unique" class="form-check-input" checked>
            <label for="date-unique" class="form-check-label">不重复选择</label>
          </div>
        `;
        break;
        
      case 'password':
        html = `
          <div class="form-group">
            <label for="password-length">密码长度：</label>
            <input type="number" id="password-length" class="form-control" min="4" max="64" value="12">
          </div>
          <div class="form-check">
            <input type="checkbox" id="password-uppercase" class="form-check-input" checked>
            <label for="password-uppercase" class="form-check-label">包含大写字母</label>
          </div>
          <div class="form-check">
            <input type="checkbox" id="password-lowercase" class="form-check-input" checked>
            <label for="password-lowercase" class="form-check-label">包含小写字母</label>
          </div>
          <div class="form-check">
            <input type="checkbox" id="password-numbers" class="form-check-input" checked>
            <label for="password-numbers" class="form-check-label">包含数字</label>
          </div>
          <div class="form-check">
            <input type="checkbox" id="password-symbols" class="form-check-input" checked>
            <label for="password-symbols" class="form-check-label">包含特殊符号</label>
          </div>
          <div class="form-group">
            <label for="password-count">生成数量：</label>
            <input type="number" id="password-count" class="form-control" min="1" value="1">
          </div>
        `;
        break;
    }
    
    this.customOptions.innerHTML = html;
    
    // 绑定额外事件
    if (type === 'coin') {
      const coinCustom = this.container.querySelector('#coin-custom');
      const coinCustomContainer = this.container.querySelector('#coin-custom-container');
      
      coinCustom.addEventListener('change', () => {
        coinCustomContainer.style.display = coinCustom.checked ? 'block' : 'none';
      });
    }
  },
  
  // 获取自定义选项
  getCustomOptions: function(type) {
    const options = {};
    
    switch (type) {
      case 'dice':
        options.sides = parseInt(this.container.querySelector('#dice-sides').value);
        options.count = parseInt(this.container.querySelector('#dice-count').value);
        break;
        
      case 'coin':
        options.count = parseInt(this.container.querySelector('#coin-count').value);
        const coinCustom = this.container.querySelector('#coin-custom');
        options.custom = coinCustom.checked;
        
        if (options.custom) {
          options.heads = this.container.querySelector('#coin-heads').value;
          options.tails = this.container.querySelector('#coin-tails').value;
        }
        break;
        
      case 'card':
        options.count = parseInt(this.container.querySelector('#card-count').value);
        options.jokers = this.container.querySelector('#card-jokers').checked;
        options.unique = this.container.querySelector('#card-unique').checked;
        break;
        
      case 'color':
        options.count = parseInt(this.container.querySelector('#color-count').value);
        options.format = this.container.querySelector('#color-format').value;
        break;
        
      case 'date':
        options.start = this.container.querySelector('#date-start').value;
        options.end = this.container.querySelector('#date-end').value;
        options.count = parseInt(this.container.querySelector('#date-count').value);
        options.unique = this.container.querySelector('#date-unique').checked;
        break;
        
      case 'password':
        options.length = parseInt(this.container.querySelector('#password-length').value);
        options.uppercase = this.container.querySelector('#password-uppercase').checked;
        options.lowercase = this.container.querySelector('#password-lowercase').checked;
        options.numbers = this.container.querySelector('#password-numbers').checked;
        options.symbols = this.container.querySelector('#password-symbols').checked;
        options.count = parseInt(this.container.querySelector('#password-count').value);
        break;
    }
    
    return options;
  },
  
  // 显示结果
  displayResult: function(result, type) {
    // 清空结果显示区域
    this.resultDisplay.innerHTML = '';
    
    // 启用结果操作按钮
    this.copyResultBtn.disabled = false;
    this.saveResultBtn.disabled = false;
    
    // 根据结果类型显示不同的内容
    if (Array.isArray(result)) {
      // 数组结果
      if (result.length === 0) {
        this.resultDisplay.innerHTML = '<div class="no-result">没有找到符合条件的结果</div>';
        this.copyResultBtn.disabled = true;
        this.saveResultBtn.disabled = true;
        this.visualResultBtn.disabled = true;
        return;
      }
      
      // 检查是否可以可视化
      this.visualResultBtn.disabled = !(type === 'list' || type === 'range' || type === 'dice' || type === 'coin' || type === 'card');
      
      // 创建结果列表
      const resultList = document.createElement('div');
      resultList.className = 'result-list';
      
      result.forEach((item, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        if (typeof item === 'object' && item !== null) {
          // 对象结果（如扑克牌）
          if (item.suit && item.rank) {
            resultItem.innerHTML = `${index + 1}. ${item.suit} ${item.rank}`;
          } else {
            resultItem.innerHTML = `${index + 1}. ${JSON.stringify(item)}`;
          }
        } else {
          // 简单值结果
          resultItem.innerHTML = `${index + 1}. ${item}`;
        }
        
        resultList.appendChild(resultItem);
      });
      
      this.resultDisplay.appendChild(resultList);
    } else if (typeof result === 'object' && result !== null) {
      // 对象结果（如分组）
      if (type === 'group') {
        // 分组结果
        this.visualResultBtn.disabled = false;
        
        const groupsContainer = document.createElement('div');
        groupsContainer.className = 'groups-container';
        
        Object.keys(result).forEach(groupName => {
          const group = result[groupName];
          const groupDiv = document.createElement('div');
          groupDiv.className = 'group-item';
          
          const groupHeader = document.createElement('h4');
          groupHeader.textContent = groupName;
          groupDiv.appendChild(groupHeader);
          
          const groupList = document.createElement('ul');
          group.forEach(member => {
            const memberItem = document.createElement('li');
            memberItem.textContent = member;
            groupList.appendChild(memberItem);
          });
          
          groupDiv.appendChild(groupList);
          groupsContainer.appendChild(groupDiv);
        });
        
        this.resultDisplay.appendChild(groupsContainer);
      } else {
        // 其他对象结果
        this.visualResultBtn.disabled = true;
        
        const resultText = document.createElement('pre');
        resultText.textContent = JSON.stringify(result, null, 2);
        this.resultDisplay.appendChild(resultText);
      }
    } else {
      // 简单值结果
      this.visualResultBtn.disabled = true;
      
      const resultText = document.createElement('div');
      resultText.className = 'result-text';
      resultText.textContent = result.toString();
      this.resultDisplay.appendChild(resultText);
    }
    
    // 保存到全局变量，用于可视化
    window.randomPickerLastResult = {
      result: result,
      type: type
    };
  },
  
  // 更新可视化
  updateVisualization: function() {
    if (!window.randomPickerLastResult) {
      return;
    }
    
    const result = window.randomPickerLastResult.result;
    const type = window.randomPickerLastResult.type;
    const visualType = this.visualType.value;
    
    // 清空可视化区域
    this.visualDisplay.innerHTML = '';
    
    // 根据可视化类型显示不同的图表
    if (visualType === 'pie') {
      RandomPickerVisual.createPieChart(result, type, this.visualDisplay);
    } else if (visualType === 'bar') {
      RandomPickerVisual.createBarChart(result, type, this.visualDisplay);
    } else if (visualType === 'wheel') {
      RandomPickerVisual.createWheel(result, type, this.visualDisplay);
    }
  },
  
  // 加载历史记录
  loadHistory: function() {
    const history = RandomPickerHistory.getHistory();
    
    if (history.length === 0) {
      this.historyList.innerHTML = '<div class="no-history">暂无历史记录</div>';
      return;
    }
    
    this.historyList.innerHTML = '';
    
    history.forEach((item, index) => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      
      const header = document.createElement('div');
      header.className = 'history-item-header';
      
      const title = document.createElement('div');
      title.className = 'history-item-title';
      title.textContent = `${item.type} - ${new Date(item.timestamp).toLocaleString()}`;
      
      const actions = document.createElement('div');
      actions.className = 'history-item-actions';
      
      const loadBtn = document.createElement('button');
      loadBtn.className = 'btn btn-sm btn-info';
      loadBtn.textContent = '加载';
      loadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.loadHistoryItem(item);
      });
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-sm btn-danger';
      deleteBtn.textContent = '删除';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        RandomPickerHistory.deleteHistoryItem(index);
        this.loadHistory();
      });
      
      actions.appendChild(loadBtn);
      actions.appendChild(deleteBtn);
      
      header.appendChild(title);
      header.appendChild(actions);
      
      const content = document.createElement('div');
      content.className = 'history-item-content';
      content.innerHTML = item.result;
      
      historyItem.appendChild(header);
      historyItem.appendChild(content);
      
      this.historyList.appendChild(historyItem);
    });
  },
  
  // 加载历史记录项
  loadHistoryItem: function(item) {
    // 切换到对应的标签页
    this.tabButtons.forEach(btn => {
      if (btn.dataset.tab === item.tab) {
        btn.click();
      }
    });
    
    // 显示结果
    this.resultDisplay.innerHTML = item.result;
    
    // 启用结果操作按钮
    this.copyResultBtn.disabled = false;
    this.saveResultBtn.disabled = false;
    this.visualResultBtn.disabled = !item.canVisualize;
    
    // 如果可以可视化，保存到全局变量
    if (item.canVisualize) {
      window.randomPickerLastResult = {
        result: item.rawResult,
        type: item.type
      };
    }
  }
};
