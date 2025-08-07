/**
 * 随机选择器 - UI模块
 */

// UI模块
const RandomPickerUI = {
  // 获取HTML模板
  getHTML: function() {
    return `
      <div class="tool-header">
        <h2><i class="fa fa-random"></i> 随机选择器</h2>
        <p class="tool-description">从列表中随机选择一个或多个项目，支持自定义权重、分组选择和多种概率分布。</p>
      </div>
      
      <div class="picker-tabs">
        <div class="tab-header">
          <button class="tab-btn active" data-tab="basic">基础选择</button>
          <button class="tab-btn" data-tab="group">分组选择</button>
          <button class="tab-btn" data-tab="advanced">高级设置</button>
          <button class="tab-btn" data-tab="visual">结果可视化</button>
        </div>
        
        <div class="tab-content active" id="tab-basic">
          <div class="picker-container">
            <div class="picker-input-section">
              <div class="form-group">
                <label for="items-input">输入项目列表</label>
                <textarea id="items-input" class="form-control" placeholder="每行输入一个项目，可选添加权重，格式：项目名称|权重"></textarea>
              </div>
              
              <div class="form-group">
                <label for="pick-count">选择数量</label>
                <input type="number" id="pick-count" class="form-control" value="1" min="1" />
              </div>
              
              <div class="form-group">
                <label>选择模式</label>
                <div class="pick-mode-options">
                  <div class="form-check">
                    <input type="radio" name="pick-mode" id="mode-no-repeat" value="no-repeat" checked />
                    <label for="mode-no-repeat">不重复选择</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="pick-mode" id="mode-allow-repeat" value="allow-repeat" />
                    <label for="mode-allow-repeat">允许重复选择</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="pick-mode" id="mode-shuffle" value="shuffle" />
                    <label for="mode-shuffle">洗牌模式</label>
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label>选项</label>
                <div class="picker-options">
                  <div class="form-check">
                    <input type="checkbox" id="use-weights" />
                    <label for="use-weights">使用权重</label>
                  </div>
                  <div class="form-check">
                    <input type="checkbox" id="show-animation" checked />
                    <label for="show-animation">显示动画效果</label>
                  </div>
                  <div class="form-check">
                    <input type="checkbox" id="exclude-previous" />
                    <label for="exclude-previous">排除上次结果</label>
                  </div>
                </div>
              </div>
              
              <div class="picker-actions">
                <button id="pick-btn" class="btn btn-success"><i class="fa fa-random"></i> 随机选择</button>
                <button id="clear-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
                <button id="example-btn" class="btn"><i class="fa fa-lightbulb-o"></i> 示例</button>
              </div>
            </div>
            
            <div class="picker-result-section">
              <div class="result-header">
                <h3>选择结果</h3>
                <div class="result-actions">
                  <button id="copy-result" class="btn btn-sm"><i class="fa fa-copy"></i> 复制结果</button>
                  <button id="save-result" class="btn btn-sm"><i class="fa fa-save"></i> 保存结果</button>
                </div>
              </div>
              
              <div class="picker-result" id="picker-result">
                <div class="no-result">点击"随机选择"按钮开始</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="tab-content" id="tab-group">
          <div class="group-picker-container">
            <div class="group-input-section">
              <div class="form-group">
                <label for="group-definition">定义分组</label>
                <textarea id="group-definition" class="form-control" placeholder="格式：组名称:项目1,项目2,项目3"></textarea>
                <div class="form-text">每行一个组，组名和项目用冒号分隔，项目之间用逗号分隔</div>
              </div>
              
              <div class="form-group">
                <label for="group-pick-mode">选择模式</label>
                <select id="group-pick-mode" class="form-control">
                  <option value="one-from-each">从每组选择一个</option>
                  <option value="one-group">随机选择一个组</option>
                  <option value="custom">自定义选择</option>
                </select>
              </div>
              
              <div id="custom-group-settings" style="display: none;">
                <div class="form-group">
                  <label for="group-count">选择组数</label>
                  <input type="number" id="group-count" class="form-control" value="1" min="1" />
                </div>
                
                <div class="form-group">
                  <label for="items-per-group">每组选择数量</label>
                  <input type="number" id="items-per-group" class="form-control" value="1" min="1" />
                </div>
              </div>
              
              <div class="form-group">
                <div class="form-check">
                  <input type="checkbox" id="group-show-animation" checked />
                  <label for="group-show-animation">显示动画效果</label>
                </div>
              </div>
              
              <div class="group-actions">
                <button id="group-pick-btn" class="btn btn-success"><i class="fa fa-random"></i> 分组选择</button>
                <button id="group-clear-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
                <button id="group-example-btn" class="btn"><i class="fa fa-lightbulb-o"></i> 示例</button>
              </div>
            </div>
            
            <div class="group-result-section">
              <div class="result-header">
                <h3>分组选择结果</h3>
                <div class="result-actions">
                  <button id="group-copy-result" class="btn btn-sm"><i class="fa fa-copy"></i> 复制结果</button>
                  <button id="group-save-result" class="btn btn-sm"><i class="fa fa-save"></i> 保存结果</button>
                </div>
              </div>
              
              <div class="group-result" id="group-result">
                <div class="no-result">点击"分组选择"按钮开始</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="tab-content" id="tab-advanced">
          <div class="advanced-settings">
            <div class="form-group">
              <label for="distribution-type">概率分布</label>
              <select id="distribution-type" class="form-control">
                <option value="uniform">均匀分布</option>
                <option value="normal">正态分布</option>
                <option value="exponential">指数分布</option>
                <option value="custom">自定义分布</option>
              </select>
            </div>
            
            <div id="distribution-params" style="display: none;">
              <div class="form-group" id="normal-params">
                <label for="normal-mean">均值</label>
                <input type="number" id="normal-mean" class="form-control" value="0" step="0.1" />
                
                <label for="normal-std">标准差</label>
                <input type="number" id="normal-std" class="form-control" value="1" min="0.1" step="0.1" />
              </div>
              
              <div class="form-group" id="exponential-params">
                <label for="exponential-rate">速率参数</label>
                <input type="number" id="exponential-rate" class="form-control" value="1" min="0.1" step="0.1" />
              </div>
              
              <div class="form-group" id="custom-params">
                <label for="custom-distribution">自定义概率</label>
                <textarea id="custom-distribution" class="form-control" placeholder="格式：值:概率，例如 1:0.2,2:0.5,3:0.3"></textarea>
              </div>
            </div>
            
            <div class="form-group">
              <label for="seed-input">随机种子</label>
              <div class="seed-input-container">
                <input type="text" id="seed-input" class="form-control" placeholder="留空使用随机种子" />
                <button id="generate-seed" class="btn"><i class="fa fa-refresh"></i> 生成种子</button>
              </div>
              <div class="form-text">使用相同的种子可以重现相同的随机结果</div>
            </div>
            
            <div class="form-group">
              <label for="batch-count">批量选择次数</label>
              <input type="number" id="batch-count" class="form-control" value="1" min="1" max="100" />
              <div class="form-text">一次性执行多次随机选择</div>
            </div>
            
            <div class="advanced-actions">
              <button id="apply-advanced" class="btn btn-success"><i class="fa fa-check"></i> 应用设置</button>
              <button id="reset-advanced" class="btn btn-secondary"><i class="fa fa-refresh"></i> 重置设置</button>
            </div>
          </div>
        </div>
        
        <div class="tab-content" id="tab-visual">
          <div class="visual-container">
            <div class="visual-settings">
              <div class="form-group">
                <label for="chart-type">图表类型</label>
                <select id="chart-type" class="form-control">
                  <option value="bar">柱状图</option>
                  <option value="pie">饼图</option>
                  <option value="radar">雷达图</option>
                  <option value="polar">极坐标图</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="simulation-count">模拟次数</label>
                <input type="number" id="simulation-count" class="form-control" value="1000" min="100" max="10000" />
                <div class="form-text">执行多次模拟以生成概率分布图</div>
              </div>
              
              <div class="visual-actions">
                <button id="run-simulation" class="btn btn-success"><i class="fa fa-play"></i> 运行模拟</button>
                <button id="export-chart" class="btn"><i class="fa fa-download"></i> 导出图表</button>
              </div>
            </div>
            
            <div class="chart-container">
              <canvas id="result-chart"></canvas>
              <div class="no-chart">运行模拟以生成图表</div>
            </div>
            
            <div class="simulation-stats" id="simulation-stats"></div>
          </div>
        </div>
      </div>
      
      <div class="picker-history">
        <div class="history-header">
          <h3>历史记录</h3>
          <button id="clear-history" class="btn btn-sm btn-secondary"><i class="fa fa-trash-o"></i> 清空历史</button>
        </div>
        <div class="history-content" id="history-content">
          <div class="no-history">暂无历史记录</div>
        </div>
      </div>
    `;
  },
  
  // 初始化UI和事件监听
  init: function(container) {
    // 获取元素
    const tabButtons = container.querySelectorAll('.tab-btn');
    const tabContents = container.querySelectorAll('.tab-content');
    
    // 基础选择元素
    const itemsInput = container.querySelector('#items-input');
    const pickCount = container.querySelector('#pick-count');
    const modeNoRepeat = container.querySelector('#mode-no-repeat');
    const modeAllowRepeat = container.querySelector('#mode-allow-repeat');
    const modeShuffle = container.querySelector('#mode-shuffle');
    const useWeights = container.querySelector('#use-weights');
    const showAnimation = container.querySelector('#show-animation');
    const excludePrevious = container.querySelector('#exclude-previous');
    const pickBtn = container.querySelector('#pick-btn');
    const clearBtn = container.querySelector('#clear-btn');
    const exampleBtn = container.querySelector('#example-btn');
    const copyResult = container.querySelector('#copy-result');
    const saveResult = container.querySelector('#save-result');
    const pickerResult = container.querySelector('#picker-result');
    const historyContent = container.querySelector('#history-content');
    const clearHistory = container.querySelector('#clear-history');
    
    // 分组选择元素
    const groupDefinition = container.querySelector('#group-definition');
    const groupPickMode = container.querySelector('#group-pick-mode');
    const customGroupSettings = container.querySelector('#custom-group-settings');
    const groupCount = container.querySelector('#group-count');
    const itemsPerGroup = container.querySelector('#items-per-group');
    const groupShowAnimation = container.querySelector('#group-show-animation');
    const groupPickBtn = container.querySelector('#group-pick-btn');
    const groupClearBtn = container.querySelector('#group-clear-btn');
    const groupExampleBtn = container.querySelector('#group-example-btn');
    const groupCopyResult = container.querySelector('#group-copy-result');
    const groupSaveResult = container.querySelector('#group-save-result');
    const groupResult = container.querySelector('#group-result');
    
    // 高级设置元素
    const distributionType = container.querySelector('#distribution-type');
    const distributionParams = container.querySelector('#distribution-params');
    const normalParams = container.querySelector('#normal-params');
    const exponentialParams = container.querySelector('#exponential-params');
    const customParams = container.querySelector('#custom-params');
    const normalMean = container.querySelector('#normal-mean');
    const normalStd = container.querySelector('#normal-std');
    const exponentialRate = container.querySelector('#exponential-rate');
    const customDistribution = container.querySelector('#custom-distribution');
    const seedInput = container.querySelector('#seed-input');
    const generateSeed = container.querySelector('#generate-seed');
    const batchCount = container.querySelector('#batch-count');
    const applyAdvanced = container.querySelector('#apply-advanced');
    const resetAdvanced = container.querySelector('#reset-advanced');
    
    // 可视化元素
    const chartType = container.querySelector('#chart-type');
    const simulationCount = container.querySelector('#simulation-count');
    const runSimulation = container.querySelector('#run-simulation');
    const exportChart = container.querySelector('#export-chart');
    const resultChart = container.querySelector('#result-chart');
    const simulationStats = container.querySelector('#simulation-stats');
    
    // 切换标签页
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      });
    });
    
    // 事件监听 - 基础选择
    pickBtn.addEventListener('click', () => RandomPickerCore.pickRandomItems(container));
    
    clearBtn.addEventListener('click', () => {
      itemsInput.value = '';
      pickCount.value = '1';
      modeNoRepeat.checked = true;
      useWeights.checked = false;
      excludePrevious.checked = false;
      pickerResult.innerHTML = '<div class="no-result">点击"随机选择"按钮开始</div>';
    });
    
    exampleBtn.addEventListener('click', () => {
      const randomExample = RandomPickerData.examples[Math.floor(Math.random() * RandomPickerData.examples.length)];
      itemsInput.value = randomExample;
    });
    
    copyResult.addEventListener('click', () => RandomPickerUtils.copyResultToClipboard(container));
    
    saveResult.addEventListener('click', () => RandomPickerUtils.saveResultToFile(container));
    
    // 事件监听 - 分组选择
    groupPickBtn.addEventListener('click', () => RandomPickerCore.pickGroupItems(container));
    
    groupClearBtn.addEventListener('click', () => {
      groupDefinition.value = '';
      groupPickMode.value = 'one-from-each';
      customGroupSettings.style.display = 'none';
      groupCount.value = '1';
      itemsPerGroup.value = '1';
      groupResult.innerHTML = '<div class="no-result">点击"分组选择"按钮开始</div>';
    });
    
    groupExampleBtn.addEventListener('click', () => {
      const randomExample = RandomPickerData.groupExamples[Math.floor(Math.random() * RandomPickerData.groupExamples.length)];
      groupDefinition.value = randomExample;
    });
    
    groupPickMode.addEventListener('change', () => {
      if (groupPickMode.value === 'custom') {
        customGroupSettings.style.display = 'block';
      } else {
        customGroupSettings.style.display = 'none';
      }
    });
    
    groupCopyResult.addEventListener('click', () => RandomPickerUtils.copyGroupResultToClipboard(container));
    
    groupSaveResult.addEventListener('click', () => RandomPickerUtils.saveGroupResultToFile(container));
    
    // 事件监听 - 高级设置
    distributionType.addEventListener('change', () => {
      const type = distributionType.value;
      
      // 显示/隐藏相应的参数设置
      distributionParams.style.display = type === 'uniform' ? 'none' : 'block';
      normalParams.style.display = type === 'normal' ? 'block' : 'none';
      exponentialParams.style.display = type === 'exponential' ? 'block' : 'none';
      customParams.style.display = type === 'custom' ? 'block' : 'none';
    });
    
    generateSeed.addEventListener('click', () => {
      // 生成随机种子
      const randomSeed = Math.random().toString(36).substring(2, 10);
      seedInput.value = randomSeed;
    });
    
    applyAdvanced.addEventListener('click', () => {
      // 应用高级设置
      RandomPickerCore.setSeed(seedInput.value);
      RandomPickerUtils.showToast('高级设置已应用', 'success');
      
      // 切换回基础选择标签页
      tabButtons[0].click();
    });
    
    resetAdvanced.addEventListener('click', () => {
      // 重置高级设置
      distributionType.value = 'uniform';
      distributionParams.style.display = 'none';
      normalMean.value = '0';
      normalStd.value = '1';
      exponentialRate.value = '1';
      customDistribution.value = '';
      seedInput.value = '';
      batchCount.value = '1';
      
      // 重置随机生成器
      RandomPickerCore.setSeed('');
      
      RandomPickerUtils.showToast('高级设置已重置', 'info');
    });
    
    // 事件监听 - 可视化
    runSimulation.addEventListener('click', () => RandomPickerVisual.runSimulation(container));
    
    exportChart.addEventListener('click', () => RandomPickerVisual.exportChart());
    
    clearHistory.addEventListener('click', () => {
      if (confirm('确定要清空历史记录吗？')) {
        localStorage.removeItem('randomPickerHistory');
        RandomPickerHistory.updateHistoryDisplay(container);
        RandomPickerUtils.showToast('历史记录已清空', 'info');
      }
    });
    
    // 当切换到可视化标签页时加载Chart.js
    tabButtons.forEach(btn => {
      if (btn.dataset.tab === 'visual') {
        btn.addEventListener('click', () => {
          RandomPickerUtils.loadChartJs().catch(err => {
            console.error('加载Chart.js失败:', err);
            RandomPickerUtils.showToast('加载图表库失败，请检查网络连接', 'error');
          });
        });
      }
    });
    
    // 初始化
    RandomPickerHistory.updateHistoryDisplay(container);
    
    // 初始化分布类型显示
    distributionParams.style.display = 'none';
  },
  
  // 获取样式
  getStyles: function() {
    return `
      .picker-tabs {
        margin-bottom: 20px;
      }
      
      .tab-header {
        display: flex;
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 20px;
        overflow-x: auto;
      }
      
      .tab-btn {
        padding: 10px 15px;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        transition: var(--transition);
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
      .picker-container,
      .group-picker-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .picker-input-section,
      .group-input-section {
        flex: 1;
        min-width: 300px;
      }
      
      .picker-result-section,
      .group-result-section {
        flex: 1;
        min-width: 300px;
      }
      
      .pick-mode-options,
      .picker-options {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 10px;
      }
      
      .form-check {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      
      .picker-actions,
      .group-actions,
      .advanced-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 20px;
      }
      
      .result-header,
      .stats-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .result-header h3 {
        margin: 0;
      }
      
      .result-actions {
        display: flex;
        gap: 10px;
      }
      
      .picker-result,
      .group-result {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 15px;
        min-height: 200px;
      }
      
      .no-result,
      .picking-animation,
      .no-chart {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 170px;
        color: var(--text-muted);
      }
      
      .picking-animation {
        font-size: 18px;
      }
      
      .picking-animation i {
        margin-right: 10px;
      }
      
      .single-result,
      .batch-result {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 170px;
      }
      
      .single-result .result-name {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 10px;
      }
      
      .single-result .result-weight {
        color: var(--text-muted);
      }
      
      .multi-results,
      .batch-results {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .batch-result {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--border-color);
      }
      
      .batch-header {
        font-weight: 500;
        margin-bottom: 10px;
        padding: 5px 10px;
        background-color: var(--bg-light);
        border-radius: 4px;
      }
      
      .batch-content {
        padding-left: 10px;
      }
      
      .result-item,
      .group-item {
        display: flex;
        align-items: center;
        padding: 10px;
        background-color: var(--bg-color);
        border-radius: 4px;
      }
      
      .result-index,
      .item-index {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        font-weight: 500;
      }
      
      .result-name,
      .item-name {
        flex-grow: 1;
      }
      
      .result-weight {
        color: var(--text-muted);
        font-size: 14px;
      }
      
      .group-results {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      
      .group-result-item {
        background-color: var(--bg-color);
        border-radius: 8px;
        padding: 15px;
      }
      
      .group-name {
        font-weight: 500;
        margin-bottom: 10px;
        padding-bottom: 5px;
        border-bottom: 1px solid var(--border-color);
      }
      
      .group-items {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      
      .advanced-settings {
        max-width: 600px;
        margin: 0 auto;
      }
      
      .seed-input-container {
        display: flex;
        gap: 10px;
      }
      
      .visual-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      
      .visual-settings {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
      }
      
      .visual-settings .form-group {
        flex: 1;
        min-width: 200px;
      }
      
      .chart-container {
        position: relative;
        height: 400px;
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 15px;
      }
      
      .simulation-stats {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 15px;
      }
      
      .stats-content {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 10px;
        margin-top: 10px;
      }
      
      .stats-item {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
      }
      
      .stats-label {
        font-weight: 500;
      }
      
      .form-text {
        font-size: 12px;
        color: var(--text-muted);
        margin-top: 5px;
      }
      
      .picker-history {
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
        flex-wrap: wrap;
        margin-bottom: 10px;
      }
      
      .history-date {
        color: var(--text-muted);
        font-size: 12px;
      }
      
      .history-count,
      .history-type {
        font-size: 12px;
        background-color: var(--border-color);
        padding: 2px 8px;
        border-radius: 10px;
        margin-left: 5px;
      }
      
      .history-type {
        background-color: var(--primary-color);
        color: white;
      }
      
      .history-batch-header,
      .history-group-header {
        font-weight: 500;
        margin-top: 10px;
        margin-bottom: 5px;
        padding: 3px 0;
        border-bottom: 1px dashed var(--border-color);
      }
      
      .history-item-content {
        margin-bottom: 10px;
      }
      
      .history-result-item {
        margin-bottom: 5px;
      }
      
      .history-result-index {
        display: inline-block;
        width: 20px;
      }
      
      .history-result-weight {
        color: var(--text-muted);
        font-size: 12px;
        margin-left: 5px;
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
        .picker-container {
          flex-direction: column;
        }
      }
    `;
  }
};

// 导出模块
window.RandomPickerUI = RandomPickerUI;
