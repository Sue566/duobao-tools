/**
 * 随机选择器
 * 增强版：支持分组选择、自定义概率分布、结果可视化和更多选择模式
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
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
      
      // 添加收藏按钮
      window.addFavoriteButton('randomPicker', container.querySelector('.tool-header'));
      
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
      
      // 示例数据
      const examples = [
        "苹果|10\n香蕉|8\n橙子|5\n葡萄|7\n西瓜|3\n草莓|9",
        "张三\n李四\n王五\n赵六\n钱七\n孙八\n周九\n吴十",
        "红队\n蓝队\n黄队\n绿队",
        "看电影\n吃火锅\n唱歌\n逛街\n打游戏\n野餐\n爬山\n骑行"
      ];
      
      // 分组示例数据
      const groupExamples = [
        "水果:苹果,香蕉,橙子,葡萄,西瓜,草莓\n蔬菜:白菜,黄瓜,西红柿,胡萝卜,土豆,茄子\n肉类:牛肉,猪肉,羊肉,鸡肉,鸭肉,鱼肉",
        "前端:HTML,CSS,JavaScript,React,Vue,Angular\n后端:Java,Python,Node.js,PHP,Go,Ruby\n数据库:MySQL,MongoDB,Redis,PostgreSQL,SQLite",
        "周一:上午,下午,晚上\n周二:上午,下午,晚上\n周三:上午,下午,晚上\n周四:上午,下午,晚上\n周五:上午,下午,晚上",
        "组A:张三,李四,王五\n组B:赵六,钱七,孙八\n组C:周九,吴十,郑十一"
      ];
      
      // 随机数生成器
      let randomGenerator = Math;
      
      // 设置随机种子
      function setSeed(seed) {
        if (!seed) {
          randomGenerator = Math;
          return;
        }
        
        // 简单的伪随机数生成器
        const seedNumber = hashString(seed);
        
        randomGenerator = {
          random: function() {
            // 线性同余生成器
            let x = seedNumber;
            return function() {
              x = (1664525 * x + 1013904223) % 4294967296;
              return x / 4294967296;
            }();
          }
        };
      }
      
      // 字符串哈希函数
      function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // 转换为32位整数
        }
        return Math.abs(hash);
      }
      
      // 解析输入项目
      function parseItems(input) {
        const lines = input.trim().split('\n');
        const items = [];
        
        for (const line of lines) {
          if (!line.trim()) continue;
          
          // 检查是否有权重
          const parts = line.split('|');
          const name = parts[0].trim();
          let weight = 1;
          
          if (parts.length > 1) {
            const parsedWeight = parseFloat(parts[1]);
            if (!isNaN(parsedWeight) && parsedWeight > 0) {
              weight = parsedWeight;
            }
          }
          
          items.push({ name, weight });
        }
        
        return items;
      }
      
      // 解析分组定义
      function parseGroups(input) {
        const lines = input.trim().split('\n');
        const groups = [];
        
        for (const line of lines) {
          if (!line.trim()) continue;
          
          // 检查格式是否正确
          const parts = line.split(':');
          if (parts.length !== 2) continue;
          
          const groupName = parts[0].trim();
          const itemsStr = parts[1].trim();
          const items = itemsStr.split(',').map(item => item.trim()).filter(item => item);
          
          if (items.length > 0) {
            groups.push({
              name: groupName,
              items: items
            });
          }
        }
        
        return groups;
      }
      
      // 随机选择
      function pickRandomItems() {
        const input = itemsInput.value.trim();
        if (!input) {
          showToast('请输入项目列表', 'warning');
          return;
        }
        
        const count = parseInt(pickCount.value);
        if (isNaN(count) || count < 1) {
          showToast('请输入有效的选择数量', 'warning');
          return;
        }
        
        const items = parseItems(input);
        if (items.length === 0) {
          showToast('没有有效的项目', 'warning');
          return;
        }
        
        const allowRepeat = modeAllowRepeat.checked;
        const isShuffle = modeShuffle.checked;
        const withWeights = useWeights.checked;
        const shouldExcludePrevious = excludePrevious.checked;
        
        // 检查选择数量是否超过项目数量（在不重复模式下）
        if (!allowRepeat && count > items.length) {
          showToast(`选择数量不能超过项目数量 (${items.length})`, 'warning');
          return;
        }
        
        // 获取上次结果
        let previousItems = [];
        if (shouldExcludePrevious) {
          const history = JSON.parse(localStorage.getItem('randomPickerHistory') || '[]');
          if (history.length > 0) {
            previousItems = history[0].items.map(item => item.name);
          }
        }
        
        // 执行选择
        let selectedItems = [];
        
        if (isShuffle) {
          // 洗牌模式
          selectedItems = shuffleItems(items, withWeights);
          if (count < selectedItems.length) {
            selectedItems = selectedItems.slice(0, count);
          }
        } else {
          // 普通选择模式
          const availableItems = [...items];
          
          // 如果需要排除上次结果
          if (shouldExcludePrevious && previousItems.length > 0) {
            for (let i = availableItems.length - 1; i >= 0; i--) {
              if (previousItems.includes(availableItems[i].name)) {
                availableItems.splice(i, 1);
              }
            }
            
            if (availableItems.length === 0) {
              showToast('排除上次结果后没有可选项目', 'warning');
              return;
            }
          }
          
          for (let i = 0; i < count; i++) {
            if (availableItems.length === 0) break;
            
            let selectedIndex;
            
            if (withWeights) {
              // 带权重的选择
              selectedIndex = weightedRandomSelect(availableItems);
            } else {
              // 等概率选择
              selectedIndex = Math.floor(randomGenerator.random() * availableItems.length);
            }
            
            selectedItems.push(availableItems[selectedIndex]);
            
            if (!allowRepeat) {
              availableItems.splice(selectedIndex, 1);
            }
          }
        }
        
        // 批量选择
        const batchSize = parseInt(batchCount.value) || 1;
        if (batchSize > 1) {
          const allResults = [];
          
          // 第一次选择结果已经计算
          allResults.push(selectedItems);
          
          // 计算剩余批次
          for (let b = 1; b < batchSize; b++) {
            if (isShuffle) {
              const shuffled = shuffleItems(items, withWeights);
              allResults.push(shuffled.slice(0, count));
            } else {
              const batchItems = [];
              const batchAvailable = [...items];
              
              for (let i = 0; i < count; i++) {
                if (batchAvailable.length === 0) break;
                
                let selectedIndex;
                
                if (withWeights) {
                  selectedIndex = weightedRandomSelect(batchAvailable);
                } else {
                  selectedIndex = Math.floor(randomGenerator.random() * batchAvailable.length);
                }
                
                batchItems.push(batchAvailable[selectedIndex]);
                
                if (!allowRepeat) {
                  batchAvailable.splice(selectedIndex, 1);
                }
              }
              
              allResults.push(batchItems);
            }
          }
          
          // 显示批量结果
          displayBatchResults(allResults, withWeights);
          
          // 添加到历史记录
          addBatchToHistory(allResults, withWeights);
        } else {
          // 显示单次结果
          displayResults(selectedItems, withWeights);
          
          // 添加到历史记录
          addToHistory(selectedItems, withWeights);
        }
      }
      
      // 带权重的随机选择
      function weightedRandomSelect(items) {
        // 根据分布类型选择不同的随机方法
        const distribution = distributionType.value;
        
        if (distribution === 'uniform') {
          // 均匀分布（默认）
          const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
          let random = randomGenerator.random() * totalWeight;
          
          let selectedIndex = 0;
          for (let j = 0; j < items.length; j++) {
            random -= items[j].weight;
            if (random <= 0) {
              selectedIndex = j;
              break;
            }
          }
          
          return selectedIndex;
        } else if (distribution === 'normal') {
          // 正态分布
          const mean = parseFloat(normalMean.value) || 0;
          const std = parseFloat(normalStd.value) || 1;
          
          // Box-Muller 变换生成正态分布随机数
          const u1 = randomGenerator.random();
          const u2 = randomGenerator.random();
          const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
          const normalRandom = mean + z * std;
          
          // 映射到索引范围
          const index = Math.floor(normalRandom * items.length / 6 + items.length / 2);
          return Math.max(0, Math.min(items.length - 1, index));
        } else if (distribution === 'exponential') {
          // 指数分布
          const rate = parseFloat(exponentialRate.value) || 1;
          
          // 生成指数分布随机数
          const expRandom = -Math.log(randomGenerator.random()) / rate;
          
          // 映射到索引范围
          const index = Math.floor(expRandom * items.length / 5);
          return Math.min(items.length - 1, index);
        } else if (distribution === 'custom') {
          // 自定义分布
          try {
            const customProbs = parseCustomDistribution();
            if (customProbs.length === 0) {
              return Math.floor(randomGenerator.random() * items.length);
            }
            
            // 根据自定义概率选择
            const random = randomGenerator.random();
            let cumProb = 0;
            
            for (let i = 0; i < customProbs.length; i++) {
              cumProb += customProbs[i].probability;
              if (random <= cumProb) {
                const index = Math.floor(customProbs[i].value * items.length);
                return Math.min(items.length - 1, Math.max(0, index));
              }
            }
            
            return items.length - 1;
          } catch (e) {
            console.error('解析自定义分布出错:', e);
            return Math.floor(randomGenerator.random() * items.length);
          }
        }
        
        // 默认均匀分布
        return Math.floor(randomGenerator.random() * items.length);
      }
      
      // 解析自定义分布
      function parseCustomDistribution() {
        const input = customDistribution.value.trim();
        if (!input) return [];
        
        const parts = input.split(',');
        const result = [];
        let totalProb = 0;
        
        for (const part of parts) {
          const valueProbPair = part.split(':');
          if (valueProbPair.length !== 2) continue;
          
          const value = parseFloat(valueProbPair[0].trim());
          const prob = parseFloat(valueProbPair[1].trim());
          
          if (isNaN(value) || isNaN(prob) || prob < 0) continue;
          
          result.push({
            value: value,
            probability: prob
          });
          
          totalProb += prob;
        }
        
        // 归一化概率
        if (totalProb > 0) {
          for (const item of result) {
            item.probability /= totalProb;
          }
        }
        
        return result;
      }
      
      // 洗牌算法
      function shuffleItems(items, withWeights) {
        const result = [...items];
        
        // Fisher-Yates 洗牌算法
        for (let i = result.length - 1; i > 0; i--) {
          let j;
          
          if (withWeights) {
            // 带权重的洗牌
            const totalWeight = result.slice(0, i + 1).reduce((sum, item) => sum + item.weight, 0);
            let random = randomGenerator.random() * totalWeight;
            
            j = 0;
            for (let k = 0; k <= i; k++) {
              random -= result[k].weight;
              if (random <= 0) {
                j = k;
                break;
              }
            }
          } else {
            // 等概率洗牌
            j = Math.floor(randomGenerator.random() * (i + 1));
          }
          
          // 交换元素
          [result[i], result[j]] = [result[j], result[i]];
        }
        
        return result;
      }
      
      // 分组选择
      function pickGroupItems() {
        const input = groupDefinition.value.trim();
        if (!input) {
          showToast('请输入分组定义', 'warning');
          return;
        }
        
        const groups = parseGroups(input);
        if (groups.length === 0) {
          showToast('没有有效的分组', 'warning');
          return;
        }
        
        const mode = groupPickMode.value;
        let results = [];
        
        if (mode === 'one-from-each') {
          // 从每组选择一个
          results = groups.map(group => {
            const randomIndex = Math.floor(randomGenerator.random() * group.items.length);
            return {
              group: group.name,
              item: group.items[randomIndex]
            };
          });
        } else if (mode === 'one-group') {
          // 随机选择一个组
          const randomGroupIndex = Math.floor(randomGenerator.random() * groups.length);
          const selectedGroup = groups[randomGroupIndex];
          
          results = selectedGroup.items.map(item => {
            return {
              group: selectedGroup.name,
              item: item
            };
          });
        } else if (mode === 'custom') {
          // 自定义选择
          const groupCountValue = parseInt(groupCount.value);
          const itemsPerGroupValue = parseInt(itemsPerGroup.value);
          
          if (isNaN(groupCountValue) || groupCountValue < 1) {
            showToast('请输入有效的组数', 'warning');
            return;
          }
          
          if (isNaN(itemsPerGroupValue) || itemsPerGroupValue < 1) {
            showToast('请输入有效的每组选择数量', 'warning');
            return;
          }
          
          // 随机选择组
          const selectedGroupIndices = [];
          const availableGroups = [...Array(groups.length).keys()];
          
          for (let i = 0; i < Math.min(groupCountValue, groups.length); i++) {
            const randomIndex = Math.floor(randomGenerator.random() * availableGroups.length);
            selectedGroupIndices.push(availableGroups[randomIndex]);
            availableGroups.splice(randomIndex, 1);
          }
          
          // 从每个选中的组中选择项目
          for (const groupIndex of selectedGroupIndices) {
            const group = groups[groupIndex];
            const availableItems = [...group.items];
            
            for (let i = 0; i < Math.min(itemsPerGroupValue, availableItems.length); i++) {
              const randomItemIndex = Math.floor(randomGenerator.random() * availableItems.length);
              results.push({
                group: group.name,
                item: availableItems[randomItemIndex]
              });
              availableItems.splice(randomItemIndex, 1);
            }
          }
        }
        
        // 显示分组结果
        displayGroupResults(results);
        
        // 添加到历史记录
        addGroupToHistory(results);
      }
      
      // 显示结果
      function displayResults(items, showWeights) {
        if (items.length === 0) {
          pickerResult.innerHTML = '<div class="no-result">没有选择结果</div>';
          return;
        }
        
        // 如果启用动画效果
        if (showAnimation.checked) {
          // 先显示动画
          pickerResult.innerHTML = '<div class="picking-animation"><i class="fa fa-refresh fa-spin"></i> 正在选择...</div>';
          
          // 延迟显示结果
          setTimeout(() => {
            showResults(items, showWeights);
          }, 800);
        } else {
          // 直接显示结果
          showResults(items, showWeights);
        }
      }
      
      // 显示批量结果
      function displayBatchResults(batches, showWeights) {
        if (batches.length === 0) {
          pickerResult.innerHTML = '<div class="no-result">没有选择结果</div>';
          return;
        }
        
        // 如果启用动画效果
        if (showAnimation.checked) {
          // 先显示动画
          pickerResult.innerHTML = '<div class="picking-animation"><i class="fa fa-refresh fa-spin"></i> 正在选择...</div>';
          
          // 延迟显示结果
          setTimeout(() => {
            showBatchResults(batches, showWeights);
          }, 800);
        } else {
          // 直接显示结果
          showBatchResults(batches, showWeights);
        }
      }
      
      // 显示批量结果
      function showBatchResults(batches, showWeights) {
        let html = '<div class="batch-results">';
        
        batches.forEach((items, batchIndex) => {
          html += `
            <div class="batch-result">
              <div class="batch-header">批次 ${batchIndex + 1}</div>
              <div class="batch-content">
          `;
          
          if (items.length === 1) {
            // 单个结果显示
            const item = items[0];
            html += `
              <div class="single-result">
                <div class="result-name">${item.name}</div>
                ${showWeights ? `<div class="result-weight">权重: ${item.weight}</div>` : ''}
              </div>
            `;
          } else {
            // 多个结果显示
            items.forEach((item, index) => {
              html += `
                <div class="result-item">
                  <div class="result-index">${index + 1}</div>
                  <div class="result-name">${item.name}</div>
                  ${showWeights ? `<div class="result-weight">权重: ${item.weight}</div>` : ''}
                </div>
              `;
            });
          }
          
          html += `
              </div>
            </div>
          `;
        });
        
        html += '</div>';
        pickerResult.innerHTML = html;
      }
      
      // 显示分组结果
      function displayGroupResults(results) {
        if (results.length === 0) {
          groupResult.innerHTML = '<div class="no-result">没有选择结果</div>';
          return;
        }
        
        // 如果启用动画效果
        if (groupShowAnimation.checked) {
          // 先显示动画
          groupResult.innerHTML = '<div class="picking-animation"><i class="fa fa-refresh fa-spin"></i> 正在选择...</div>';
          
          // 延迟显示结果
          setTimeout(() => {
            showGroupResults(results);
          }, 800);
        } else {
          // 直接显示结果
          showGroupResults(results);
        }
      }
      
      // 显示分组结果
      function showGroupResults(results) {
        // 按组分类结果
        const groupedResults = {};
        
        results.forEach(result => {
          if (!groupedResults[result.group]) {
            groupedResults[result.group] = [];
          }
          groupedResults[result.group].push(result.item);
        });
        
        let html = '<div class="group-results">';
        
        Object.keys(groupedResults).forEach(groupName => {
          const items = groupedResults[groupName];
          
          html += `
            <div class="group-result-item">
              <div class="group-name">${groupName}</div>
              <div class="group-items">
          `;
          
          items.forEach((item, index) => {
            html += `
              <div class="group-item">
                <span class="item-index">${index + 1}.</span>
                <span class="item-name">${item}</span>
              </div>
            `;
          });
          
          html += `
              </div>
            </div>
          `;
        });
        
        html += '</div>';
        groupResult.innerHTML = html;
      }
      
      // 显示最终结果
      function showResults(items, showWeights) {
        let html = '';
        
        if (items.length === 1) {
          // 单个结果显示
          const item = items[0];
          html = `
            <div class="single-result">
              <div class="result-name">${item.name}</div>
              ${showWeights ? `<div class="result-weight">权重: ${item.weight}</div>` : ''}
            </div>
          `;
        } else {
          // 多个结果显示
          html = '<div class="multi-results">';
          
          items.forEach((item, index) => {
            html += `
              <div class="result-item">
                <div class="result-index">${index + 1}</div>
                <div class="result-name">${item.name}</div>
                ${showWeights ? `<div class="result-weight">权重: ${item.weight}</div>` : ''}
              </div>
            `;
          });
          
          html += '</div>';
        }
        
        pickerResult.innerHTML = html;
      }
      
      // 添加到历史记录
      function addToHistory(items, showWeights) {
        // 获取现有历史记录
        let history = JSON.parse(localStorage.getItem('randomPickerHistory') || '[]');
        
        // 添加新记录
        history.unshift({
          type: 'basic',
          items: items,
          showWeights: showWeights,
          timestamp: new Date().toISOString()
        });
        
        // 限制历史记录数量
        if (history.length > 20) {
          history = history.slice(0, 20);
        }
        
        // 保存历史记录
        localStorage.setItem('randomPickerHistory', JSON.stringify(history));
        
        // 更新历史记录显示
        updateHistoryDisplay();
      }
      
      // 添加批量结果到历史记录
      function addBatchToHistory(batches, showWeights) {
        // 获取现有历史记录
        let history = JSON.parse(localStorage.getItem('randomPickerHistory') || '[]');
        
        // 添加新记录
        history.unshift({
          type: 'batch',
          batches: batches,
          showWeights: showWeights,
          timestamp: new Date().toISOString()
        });
        
        // 限制历史记录数量
        if (history.length > 20) {
          history = history.slice(0, 20);
        }
        
        // 保存历史记录
        localStorage.setItem('randomPickerHistory', JSON.stringify(history));
        
        // 更新历史记录显示
        updateHistoryDisplay();
      }
      
      // 添加分组结果到历史记录
      function addGroupToHistory(results) {
        // 获取现有历史记录
        let history = JSON.parse(localStorage.getItem('randomPickerHistory') || '[]');
        
        // 按组分类结果
        const groupedResults = {};
        
        results.forEach(result => {
          if (!groupedResults[result.group]) {
            groupedResults[result.group] = [];
          }
          groupedResults[result.group].push(result.item);
        });
        
        // 添加新记录
        history.unshift({
          type: 'group',
          groups: groupedResults,
          timestamp: new Date().toISOString()
        });
        
        // 限制历史记录数量
        if (history.length > 20) {
          history = history.slice(0, 20);
        }
        
        // 保存历史记录
        localStorage.setItem('randomPickerHistory', JSON.stringify(history));
        
        // 更新历史记录显示
        updateHistoryDisplay();
      }
      
      // 更新历史记录显示
      function updateHistoryDisplay() {
        const history = JSON.parse(localStorage.getItem('randomPickerHistory') || '[]');
        
        if (history.length === 0) {
          historyContent.innerHTML = '<div class="no-history">暂无历史记录</div>';
          return;
        }
        
        let html = '';
        history.forEach((record, index) => {
          const date = new Date(record.timestamp);
          const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
          
          if (record.type === 'basic') {
            html += `
              <div class="history-item">
                <div class="history-item-header">
                  <span class="history-date">${formattedDate}</span>
                  <span class="history-count">${record.items.length} 个项目</span>
                  <span class="history-type">基础选择</span>
                </div>
                <div class="history-item-content">
            `;
            
            record.items.forEach((item, itemIndex) => {
              html += `
                <div class="history-result-item">
                  <span class="history-result-index">${itemIndex + 1}.</span>
                  <span class="history-result-name">${item.name}</span>
                  ${record.showWeights ? `<span class="history-result-weight">(权重: ${item.weight})</span>` : ''}
                </div>
              `;
            });
            
            html += `
                </div>
                <div class="history-item-actions">
                  <button class="btn btn-sm use-history" data-index="${index}" data-type="basic"><i class="fa fa-arrow-up"></i> 使用这些结果</button>
                </div>
              </div>
            `;
          } else if (record.type === 'batch') {
            html += `
              <div class="history-item">
                <div class="history-item-header">
                  <span class="history-date">${formattedDate}</span>
                  <span class="history-count">${record.batches.length} 个批次</span>
                  <span class="history-type">批量选择</span>
                </div>
                <div class="history-item-content">
            `;
            
            record.batches.forEach((batch, batchIndex) => {
              html += `<div class="history-batch-header">批次 ${batchIndex + 1} (${batch.length} 项)</div>`;
              
              batch.forEach((item, itemIndex) => {
                html += `
                  <div class="history-result-item">
                    <span class="history-result-index">${itemIndex + 1}.</span>
                    <span class="history-result-name">${item.name}</span>
                    ${record.showWeights ? `<span class="history-result-weight">(权重: ${item.weight})</span>` : ''}
                  </div>
                `;
              });
            });
            
            html += `
                </div>
                <div class="history-item-actions">
                  <button class="btn btn-sm use-history" data-index="${index}" data-type="batch"><i class="fa fa-arrow-up"></i> 使用这些结果</button>
                </div>
              </div>
            `;
          } else if (record.type === 'group') {
            const groupNames = Object.keys(record.groups);
            
            html += `
              <div class="history-item">
                <div class="history-item-header">
                  <span class="history-date">${formattedDate}</span>
                  <span class="history-count">${groupNames.length} 个组</span>
                  <span class="history-type">分组选择</span>
                </div>
                <div class="history-item-content">
            `;
            
            groupNames.forEach(groupName => {
              const items = record.groups[groupName];
              
              html += `<div class="history-group-header">${groupName} (${items.length} 项)</div>`;
              
              items.forEach((item, itemIndex) => {
                html += `
                  <div class="history-result-item">
                    <span class="history-result-index">${itemIndex + 1}.</span>
                    <span class="history-result-name">${item}</span>
                  </div>
                `;
              });
            });
            
            html += `
                </div>
                <div class="history-item-actions">
                  <button class="btn btn-sm use-history" data-index="${index}" data-type="group"><i class="fa fa-arrow-up"></i> 使用这些结果</button>
                </div>
              </div>
            `;
          }
        });
        
        historyContent.innerHTML = html;
        
        // 添加事件监听
        historyContent.querySelectorAll('.use-history').forEach(btn => {
          btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            const type = btn.getAttribute('data-type');
            const record = history[index];
            
            if (type === 'basic') {
              // 切换到基础选择标签页
              tabButtons[0].click();
              
              // 显示结果
              displayResults(record.items, record.showWeights);
            } else if (type === 'batch') {
              // 切换到基础选择标签页
              tabButtons[0].click();
              
              // 显示批量结果
              displayBatchResults(record.batches, record.showWeights);
            } else if (type === 'group') {
              // 切换到分组选择标签页
              tabButtons[1].click();
              
              // 转换为分组结果格式
              const results = [];
              Object.keys(record.groups).forEach(groupName => {
                record.groups[groupName].forEach(item => {
                  results.push({
                    group: groupName,
                    item: item
                  });
                });
              });
              
              // 显示分组结果
              displayGroupResults(results);
            }
          });
        });
      }
      
      // 运行模拟
      function runSimulation() {
        const input = itemsInput.value.trim();
        if (!input) {
          showToast('请输入项目列表', 'warning');
          return;
        }
        
        const items = parseItems(input);
        if (items.length === 0) {
          showToast('没有有效的项目', 'warning');
          return;
        }
        
        const count = parseInt(simulationCount.value);
        if (isNaN(count) || count < 100 || count > 10000) {
          showToast('请输入有效的模拟次数 (100-10000)', 'warning');
          return;
        }
        
        // 显示加载状态
        document.querySelector('.no-chart').style.display = 'none';
        simulationStats.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i> 正在模拟中...</div>';
        
        // 使用setTimeout让UI有时间更新
        setTimeout(() => {
          // 执行模拟
          const results = {};
          const withWeights = useWeights.checked;
          
          for (let i = 0; i < count; i++) {
            let selectedIndex;
            
            if (withWeights) {
              // 带权重的选择
              selectedIndex = weightedRandomSelect(items);
            } else {
              // 等概率选择
              selectedIndex = Math.floor(randomGenerator.random() * items.length);
            }
            
            const selectedItem = items[selectedIndex].name;
            
            if (!results[selectedItem]) {
              results[selectedItem] = 0;
            }
            
            results[selectedItem]++;
          }
          
          // 计算统计信息
          const stats = calculateStats(results, count);
          
          // 显示图表
          displayChart(results, count);
          
          // 显示统计信息
          displayStats(stats);
        }, 100);
      }
      
      // 计算统计信息
      function calculateStats(results, totalCount) {
        const counts = Object.values(results);
        const names = Object.keys(results);
        
        // 计算平均值
        const sum = counts.reduce((a, b) => a + b, 0);
        const mean = sum / counts.length;
        
        // 计算标准差
        const squaredDiffs = counts.map(count => Math.pow(count - mean, 2));
        const variance = squaredDiffs.reduce((a, b) => a + b, 0) / counts.length;
        const stdDev = Math.sqrt(variance);
        
        // 找出最大和最小值
        const max = Math.max(...counts);
        const min = Math.min(...counts);
        const maxName = names[counts.indexOf(max)];
        const minName = names[counts.indexOf(min)];
        
        // 计算期望概率
        const expectedProbs = {};
        if (useWeights.checked) {
          const totalWeight = parseItems(itemsInput.value.trim()).reduce((sum, item) => sum + item.weight, 0);
          parseItems(itemsInput.value.trim()).forEach(item => {
            expectedProbs[item.name] = item.weight / totalWeight;
          });
        } else {
          const itemCount = parseItems(itemsInput.value.trim()).length;
          parseItems(itemsInput.value.trim()).forEach(item => {
            expectedProbs[item.name] = 1 / itemCount;
          });
        }
        
        return {
          totalCount,
          itemCount: counts.length,
          mean,
          stdDev,
          max,
          min,
          maxName,
          minName,
          expectedProbs
        };
      }
      
      // 显示统计信息
      function displayStats(stats) {
        let html = `
          <div class="stats-header">模拟统计</div>
          <div class="stats-content">
            <div class="stats-item">
              <span class="stats-label">总模拟次数:</span>
              <span class="stats-value">${stats.totalCount}</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">项目数量:</span>
              <span class="stats-value">${stats.itemCount}</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">平均选中次数:</span>
              <span class="stats-value">${stats.mean.toFixed(2)}</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">标准差:</span>
              <span class="stats-value">${stats.stdDev.toFixed(2)}</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">最高选中次数:</span>
              <span class="stats-value">${stats.max} (${stats.maxName})</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">最低选中次数:</span>
              <span class="stats-value">${stats.min} (${stats.minName})</span>
            </div>
          </div>
        `;
        
        simulationStats.innerHTML = html;
      }
      
      // 显示图表
      function displayChart(results, totalCount) {
        const chartCanvas = document.getElementById('result-chart');
        const chartType = document.getElementById('chart-type').value;
        
        // 准备数据
        const labels = Object.keys(results);
        const data = Object.values(results);
        const percentages = data.map(count => (count / totalCount * 100).toFixed(1) + '%');
        
        // 准备颜色
        const backgroundColors = generateColors(labels.length);
        
        // 销毁旧图表
        if (window.resultChart) {
          window.resultChart.destroy();
        }
        
        // 创建新图表
        window.resultChart = new Chart(chartCanvas, {
          type: chartType,
          data: {
            labels: labels,
            datasets: [{
              label: '选中次数',
              data: data,
              backgroundColor: backgroundColors,
              borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const index = context.dataIndex;
                    return `${context.dataset.label}: ${context.raw} (${percentages[index]})`;
                  }
                }
              },
              legend: {
                display: chartType === 'pie' || chartType === 'polar' || chartType === 'radar'
              }
            }
          }
        });
      }
      
      // 生成颜色数组
      function generateColors(count) {
        const colors = [];
        const hueStep = 360 / count;
        
        for (let i = 0; i < count; i++) {
          const hue = i * hueStep;
          colors.push(`hsla(${hue}, 70%, 60%, 0.6)`);
        }
        
        return colors;
      }
      
      // 事件监听 - 基础选择
      pickBtn.addEventListener('click', pickRandomItems);
      
      clearBtn.addEventListener('click', () => {
        itemsInput.value = '';
        pickCount.value = '1';
        modeNoRepeat.checked = true;
        useWeights.checked = false;
        excludePrevious.checked = false;
        pickerResult.innerHTML = '<div class="no-result">点击"随机选择"按钮开始</div>';
      });
      
      exampleBtn.addEventListener('click', () => {
        const randomExample = examples[Math.floor(Math.random() * examples.length)];
        itemsInput.value = randomExample;
      });
      
      copyResult.addEventListener('click', () => {
        // 获取结果文本
        const resultItems = [];
        
        // 检查是否是批量结果
        const batchResults = pickerResult.querySelectorAll('.batch-result');
        if (batchResults.length > 0) {
          batchResults.forEach((batch, batchIndex) => {
            resultItems.push(`批次 ${batchIndex + 1}:`);
            
            const singleResult = batch.querySelector('.single-result');
            if (singleResult) {
              const name = singleResult.querySelector('.result-name').textContent;
              resultItems.push(`  ${name}`);
            } else {
              const multiResults = batch.querySelectorAll('.result-item');
              multiResults.forEach(item => {
                const index = item.querySelector('.result-index').textContent;
                const name = item.querySelector('.result-name').textContent;
                resultItems.push(`  ${index}. ${name}`);
              });
            }
            
            resultItems.push(''); // 添加空行分隔批次
          });
        } else {
          // 单次结果
          const singleResult = pickerResult.querySelector('.single-result');
          if (singleResult) {
            const name = singleResult.querySelector('.result-name').textContent;
            resultItems.push(name);
          } else {
            const multiResults = pickerResult.querySelectorAll('.result-item');
            multiResults.forEach(item => {
              const index = item.querySelector('.result-index').textContent;
              const name = item.querySelector('.result-name').textContent;
              resultItems.push(`${index}. ${name}`);
            });
          }
        }
        
        if (resultItems.length === 0) {
          showToast('没有可复制的结果', 'warning');
          return;
        }
        
        copyToClipboard(resultItems.join('\n'));
      });
      
      // 事件监听 - 分组选择
      groupPickBtn.addEventListener('click', pickGroupItems);
      
      groupClearBtn.addEventListener('click', () => {
        groupDefinition.value = '';
        groupPickMode.value = 'one-from-each';
        customGroupSettings.style.display = 'none';
        groupCount.value = '1';
        itemsPerGroup.value = '1';
        groupResult.innerHTML = '<div class="no-result">点击"分组选择"按钮开始</div>';
      });
      
      groupExampleBtn.addEventListener('click', () => {
        const randomExample = groupExamples[Math.floor(Math.random() * groupExamples.length)];
        groupDefinition.value = randomExample;
      });
      
      groupPickMode.addEventListener('change', () => {
        if (groupPickMode.value === 'custom') {
          customGroupSettings.style.display = 'block';
        } else {
          customGroupSettings.style.display = 'none';
        }
      });
      
      groupCopyResult.addEventListener('click', () => {
        // 获取结果文本
        const resultItems = [];
        
        const groupResults = groupResult.querySelectorAll('.group-result-item');
        groupResults.forEach(group => {
          const groupName = group.querySelector('.group-name').textContent;
          resultItems.push(`${groupName}:`);
          
          const items = group.querySelectorAll('.group-item');
          items.forEach(item => {
            const index = item.querySelector('.item-index').textContent;
            const name = item.querySelector('.item-name').textContent;
            resultItems.push(`  ${index} ${name}`);
          });
          
          resultItems.push(''); // 添加空行
        });
        
        if (resultItems.length === 0) {
          showToast('没有可复制的结果', 'warning');
          return;
        }
        
        copyToClipboard(resultItems.join('\n'));
      });
      
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
        setSeed(seedInput.value);
        showToast('高级设置已应用', 'success');
        
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
        randomGenerator = Math;
        
        showToast('高级设置已重置', 'info');
      });
      
      // 事件监听 - 可视化
      runSimulation.addEventListener('click', runSimulation);
      
      exportChart.addEventListener('click', () => {
        if (!window.resultChart) {
          showToast('没有可导出的图表', 'warning');
          return;
        }
        
        // 导出图表为图片
        const canvas = document.getElementById('result-chart');
        const image = canvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.href = image;
        link.download = `随机选择模拟_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('图表已导出', 'success');
      });
      
      saveResult.addEventListener('click', () => {
        // 检查是否有结果
        if (pickerResult.querySelector('.no-result') || pickerResult.querySelector('.picking-animation')) {
          showToast('没有可保存的结果', 'warning');
          return;
        }
        
        // 获取结果文本
        const resultItems = [];
        
        // 检查是否是批量结果
        const batchResults = pickerResult.querySelectorAll('.batch-result');
        if (batchResults.length > 0) {
          batchResults.forEach((batch, batchIndex) => {
            resultItems.push(`批次 ${batchIndex + 1}:`);
            
            const singleResult = batch.querySelector('.single-result');
            if (singleResult) {
              const name = singleResult.querySelector('.result-name').textContent;
              resultItems.push(`  ${name}`);
            } else {
              const multiResults = batch.querySelectorAll('.result-item');
              multiResults.forEach(item => {
                const index = item.querySelector('.result-index').textContent;
                const name = item.querySelector('.result-name').textContent;
                resultItems.push(`  ${index}. ${name}`);
              });
            }
            
            resultItems.push(''); // 添加空行分隔批次
          });
        } else {
          // 单次结果
          const singleResult = pickerResult.querySelector('.single-result');
          if (singleResult) {
            const name = singleResult.querySelector('.result-name').textContent;
            resultItems.push(name);
          } else {
            const multiResults = pickerResult.querySelectorAll('.result-item');
            multiResults.forEach(item => {
              const index = item.querySelector('.result-index').textContent;
              const name = item.querySelector('.result-name').textContent;
              resultItems.push(`${index}. ${name}`);
            });
          }
        }
        
        if (resultItems.length === 0) {
          showToast('没有可保存的结果', 'warning');
          return;
        }
        
        // 创建下载链接
        const text = resultItems.join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `随机选择结果_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('结果已保存', 'success');
      });
      
      groupSaveResult.addEventListener('click', () => {
        // 检查是否有结果
        if (groupResult.querySelector('.no-result') || groupResult.querySelector('.picking-animation')) {
          showToast('没有可保存的结果', 'warning');
          return;
        }
        
        // 获取结果文本
        const resultItems = [];
        
        const groupResults = groupResult.querySelectorAll('.group-result-item');
        groupResults.forEach(group => {
          const groupName = group.querySelector('.group-name').textContent;
          resultItems.push(`${groupName}:`);
          
          const items = group.querySelectorAll('.group-item');
          items.forEach(item => {
            const index = item.querySelector('.item-index').textContent;
            const name = item.querySelector('.item-name').textContent;
            resultItems.push(`  ${index} ${name}`);
          });
          
          resultItems.push(''); // 添加空行
        });
        
        if (resultItems.length === 0) {
          showToast('没有可保存的结果', 'warning');
          return;
        }
        
        // 创建下载链接
        const text = resultItems.join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `分组选择结果_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('结果已保存', 'success');
      });
      
      clearHistory.addEventListener('click', () => {
        if (confirm('确定要清空历史记录吗？')) {
          localStorage.removeItem('randomPickerHistory');
          updateHistoryDisplay();
          showToast('历史记录已清空', 'info');
        }
      });
      
      // 加载Chart.js库
      function loadChartJs() {
        return new Promise((resolve, reject) => {
          if (window.Chart) {
            resolve(window.Chart);
            return;
          }
          
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
          script.onload = () => resolve(window.Chart);
          script.onerror = () => reject(new Error('Failed to load Chart.js'));
          document.head.appendChild(script);
        });
      }
      
      // 当切换到可视化标签页时加载Chart.js
      tabButtons.forEach(btn => {
        if (btn.dataset.tab === 'visual') {
          btn.addEventListener('click', () => {
            loadChartJs().catch(err => {
              console.error('加载Chart.js失败:', err);
              showToast('加载图表库失败，请检查网络连接', 'error');
            });
          });
        }
      });
      
      // 初始化
      updateHistoryDisplay();
      
      // 初始化分布类型显示
      distributionParams.style.display = 'none';
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
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
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.randomPicker = tool;
})();
