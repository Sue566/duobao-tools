/**
 * 随机选择器
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-random"></i> 随机选择器</h2>
          <p class="tool-description">从列表中随机选择一个或多个项目，支持自定义权重和多种选择模式。</p>
        </div>
        
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
      const itemsInput = container.querySelector('#items-input');
      const pickCount = container.querySelector('#pick-count');
      const modeNoRepeat = container.querySelector('#mode-no-repeat');
      const modeAllowRepeat = container.querySelector('#mode-allow-repeat');
      const useWeights = container.querySelector('#use-weights');
      const showAnimation = container.querySelector('#show-animation');
      const pickBtn = container.querySelector('#pick-btn');
      const clearBtn = container.querySelector('#clear-btn');
      const exampleBtn = container.querySelector('#example-btn');
      const copyResult = container.querySelector('#copy-result');
      const saveResult = container.querySelector('#save-result');
      const pickerResult = container.querySelector('#picker-result');
      const historyContent = container.querySelector('#history-content');
      const clearHistory = container.querySelector('#clear-history');
      
      // 示例数据
      const examples = [
        "苹果|10\n香蕉|8\n橙子|5\n葡萄|7\n西瓜|3\n草莓|9",
        "张三\n李四\n王五\n赵六\n钱七\n孙八\n周九\n吴十",
        "红队\n蓝队\n黄队\n绿队",
        "看电影\n吃火锅\n唱歌\n逛街\n打游戏\n野餐\n爬山\n骑行"
      ];
      
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
        const withWeights = useWeights.checked;
        
        // 检查选择数量是否超过项目数量（在不重复模式下）
        if (!allowRepeat && count > items.length) {
          showToast(`选择数量不能超过项目数量 (${items.length})`, 'warning');
          return;
        }
        
        // 执行选择
        const selectedItems = [];
        const availableItems = [...items];
        
        for (let i = 0; i < count; i++) {
          if (availableItems.length === 0) break;
          
          let selectedIndex;
          
          if (withWeights) {
            // 带权重的选择
            const totalWeight = availableItems.reduce((sum, item) => sum + item.weight, 0);
            let random = Math.random() * totalWeight;
            
            selectedIndex = 0;
            for (let j = 0; j < availableItems.length; j++) {
              random -= availableItems[j].weight;
              if (random <= 0) {
                selectedIndex = j;
                break;
              }
            }
          } else {
            // 等概率选择
            selectedIndex = Math.floor(Math.random() * availableItems.length);
          }
          
          selectedItems.push(availableItems[selectedIndex]);
          
          if (!allowRepeat) {
            availableItems.splice(selectedIndex, 1);
          }
        }
        
        // 显示结果
        displayResults(selectedItems, withWeights);
        
        // 添加到历史记录
        addToHistory(selectedItems, withWeights);
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
          items: items,
          showWeights: showWeights,
          timestamp: new Date().toISOString()
        });
        
        // 限制历史记录数量
        if (history.length > 10) {
          history = history.slice(0, 10);
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
          
          html += `
            <div class="history-item">
              <div class="history-item-header">
                <span class="history-date">${formattedDate}</span>
                <span class="history-count">${record.items.length} 个项目</span>
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
                <button class="btn btn-sm use-history" data-index="${index}"><i class="fa fa-arrow-up"></i> 使用这些结果</button>
              </div>
            </div>
          `;
        });
        
        historyContent.innerHTML = html;
        
        // 添加事件监听
        historyContent.querySelectorAll('.use-history').forEach(btn => {
          btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            const record = history[index];
            
            // 显示结果
            displayResults(record.items, record.showWeights);
          });
        });
      }
      
      // 事件监听
      pickBtn.addEventListener('click', pickRandomItems);
      
      clearBtn.addEventListener('click', () => {
        itemsInput.value = '';
        pickCount.value = '1';
        modeNoRepeat.checked = true;
        useWeights.checked = false;
        pickerResult.innerHTML = '<div class="no-result">点击"随机选择"按钮开始</div>';
      });
      
      exampleBtn.addEventListener('click', () => {
        const randomExample = examples[Math.floor(Math.random() * examples.length)];
        itemsInput.value = randomExample;
      });
      
      copyResult.addEventListener('click', () => {
        // 获取结果文本
        const resultItems = [];
        
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
        
        if (resultItems.length === 0) {
          showToast('没有可复制的结果', 'warning');
          return;
        }
        
        copyToClipboard(resultItems.join('\n'));
      });
      
      saveResult.addEventListener('click', () => {
        // 检查是否有结果
        if (pickerResult.querySelector('.no-result') || pickerResult.querySelector('.picking-animation')) {
          showToast('没有可保存的结果', 'warning');
          return;
        }
        
        // 获取结果文本
        const resultItems = [];
        
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
      
      clearHistory.addEventListener('click', () => {
        if (confirm('确定要清空历史记录吗？')) {
          localStorage.removeItem('randomPickerHistory');
          updateHistoryDisplay();
          showToast('历史记录已清空', 'info');
        }
      });
      
      // 初始化
      updateHistoryDisplay();
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .picker-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .picker-input-section {
          flex: 1;
          min-width: 300px;
        }
        
        .picker-result-section {
          flex: 1;
          min-width: 300px;
        }
        
        .pick-mode-options, .picker-options {
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
        
        .picker-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }
        
        .result-header {
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
        
        .picker-result {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
          min-height: 200px;
        }
        
        .no-result, .picking-animation {
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
        
        .single-result {
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
        
        .multi-results {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .result-item {
          display: flex;
          align-items: center;
          padding: 10px;
          background-color: var(--bg-color);
          border-radius: 4px;
        }
        
        .result-index {
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
        
        .result-name {
          flex-grow: 1;
        }
        
        .result-weight {
          color: var(--text-muted);
          font-size: 14px;
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
          margin-bottom: 10px;
        }
        
        .history-date {
          color: var(--text-muted);
          font-size: 12px;
        }
        
        .history-count {
          font-size: 12px;
          background-color: var(--border-color);
          padding: 2px 8px;
          border-radius: 10px;
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
