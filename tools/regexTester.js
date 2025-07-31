/**
 * 正则表达式测试工具
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-terminal"></i> 正则表达式测试</h2>
          <p class="tool-description">测试和验证正则表达式，实时匹配结果。</p>
        </div>
        
        <div class="regex-container">
          <div class="regex-input-section">
            <div class="form-group">
              <label for="regex-pattern">正则表达式</label>
              <div class="regex-input-wrapper">
                <span class="regex-delimiter">/</span>
                <input type="text" id="regex-pattern" class="form-control" placeholder="输入正则表达式..." />
                <span class="regex-delimiter">/</span>
                <input type="text" id="regex-flags" class="form-control regex-flags" placeholder="gim" maxlength="5" />
              </div>
            </div>
            
            <div class="form-group">
              <label for="regex-test-string">测试文本</label>
              <textarea id="regex-test-string" class="form-control" placeholder="输入需要测试的文本..."></textarea>
            </div>
            
            <div class="regex-options">
              <div class="form-check">
                <input type="checkbox" id="highlight-matches" checked />
                <label for="highlight-matches">高亮匹配</label>
              </div>
              <div class="form-check">
                <input type="checkbox" id="line-numbers" checked />
                <label for="line-numbers">显示行号</label>
              </div>
              <div class="form-check">
                <input type="checkbox" id="auto-update" checked />
                <label for="auto-update">自动更新</label>
              </div>
            </div>
            
            <div class="regex-actions">
              <button id="test-btn" class="btn btn-success"><i class="fa fa-play"></i> 测试</button>
              <button id="clear-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
            </div>
          </div>
          
          <div class="regex-result-section">
            <div class="regex-result-header">
              <h3>匹配结果</h3>
              <div class="regex-stats">
                <span id="match-count">0 个匹配</span>
              </div>
            </div>
            
            <div class="regex-result-content">
              <div id="regex-result" class="regex-result"></div>
            </div>
            
            <div class="regex-matches-header">
              <h3>匹配详情</h3>
            </div>
            
            <div class="regex-matches-content">
              <div id="regex-matches" class="regex-matches"></div>
            </div>
          </div>
        </div>
        
        <div class="regex-cheatsheet">
          <div class="cheatsheet-header" id="toggle-cheatsheet">
            <h3><i class="fa fa-book"></i> 正则表达式速查表</h3>
            <i class="fa fa-chevron-down"></i>
          </div>
          <div class="cheatsheet-content" id="cheatsheet-content" style="display: none;">
            <div class="cheatsheet-section">
              <h4>字符类</h4>
              <table>
                <tr>
                  <td><code>.</code></td>
                  <td>匹配除换行符外的任意字符</td>
                </tr>
                <tr>
                  <td><code>\\w</code></td>
                  <td>匹配字母、数字、下划线</td>
                </tr>
                <tr>
                  <td><code>\\d</code></td>
                  <td>匹配数字</td>
                </tr>
                <tr>
                  <td><code>\\s</code></td>
                  <td>匹配空白字符</td>
                </tr>
                <tr>
                  <td><code>\\W</code></td>
                  <td>匹配非字母、数字、下划线</td>
                </tr>
                <tr>
                  <td><code>\\D</code></td>
                  <td>匹配非数字</td>
                </tr>
                <tr>
                  <td><code>\\S</code></td>
                  <td>匹配非空白字符</td>
                </tr>
                <tr>
                  <td><code>[abc]</code></td>
                  <td>匹配a、b或c</td>
                </tr>
                <tr>
                  <td><code>[^abc]</code></td>
                  <td>匹配除a、b、c之外的字符</td>
                </tr>
                <tr>
                  <td><code>[a-z]</code></td>
                  <td>匹配a到z的小写字母</td>
                </tr>
              </table>
            </div>
            
            <div class="cheatsheet-section">
              <h4>锚点</h4>
              <table>
                <tr>
                  <td><code>^</code></td>
                  <td>匹配行的开头</td>
                </tr>
                <tr>
                  <td><code>$</code></td>
                  <td>匹配行的结尾</td>
                </tr>
                <tr>
                  <td><code>\\b</code></td>
                  <td>匹配单词边界</td>
                </tr>
                <tr>
                  <td><code>\\B</code></td>
                  <td>匹配非单词边界</td>
                </tr>
              </table>
            </div>
            
            <div class="cheatsheet-section">
              <h4>量词</h4>
              <table>
                <tr>
                  <td><code>*</code></td>
                  <td>匹配前面的表达式0次或多次</td>
                </tr>
                <tr>
                  <td><code>+</code></td>
                  <td>匹配前面的表达式1次或多次</td>
                </tr>
                <tr>
                  <td><code>?</code></td>
                  <td>匹配前面的表达式0次或1次</td>
                </tr>
                <tr>
                  <td><code>{n}</code></td>
                  <td>匹配前面的表达式恰好n次</td>
                </tr>
                <tr>
                  <td><code>{n,}</code></td>
                  <td>匹配前面的表达式至少n次</td>
                </tr>
                <tr>
                  <td><code>{n,m}</code></td>
                  <td>匹配前面的表达式n到m次</td>
                </tr>
              </table>
            </div>
            
            <div class="cheatsheet-section">
              <h4>分组和引用</h4>
              <table>
                <tr>
                  <td><code>(abc)</code></td>
                  <td>捕获组，匹配abc并记住匹配项</td>
                </tr>
                <tr>
                  <td><code>(?:abc)</code></td>
                  <td>非捕获组，匹配abc但不记住匹配项</td>
                </tr>
                <tr>
                  <td><code>\\1</code></td>
                  <td>反向引用，匹配第一个捕获组的内容</td>
                </tr>
              </table>
            </div>
            
            <div class="cheatsheet-section">
              <h4>特殊字符</h4>
              <table>
                <tr>
                  <td><code>\\</code></td>
                  <td>转义字符</td>
                </tr>
                <tr>
                  <td><code>|</code></td>
                  <td>或运算符</td>
                </tr>
                <tr>
                  <td><code>\\n</code></td>
                  <td>换行符</td>
                </tr>
                <tr>
                  <td><code>\\t</code></td>
                  <td>制表符</td>
                </tr>
              </table>
            </div>
            
            <div class="cheatsheet-section">
              <h4>标志</h4>
              <table>
                <tr>
                  <td><code>g</code></td>
                  <td>全局匹配</td>
                </tr>
                <tr>
                  <td><code>i</code></td>
                  <td>忽略大小写</td>
                </tr>
                <tr>
                  <td><code>m</code></td>
                  <td>多行匹配</td>
                </tr>
                <tr>
                  <td><code>s</code></td>
                  <td>允许.匹配换行符</td>
                </tr>
                <tr>
                  <td><code>u</code></td>
                  <td>Unicode模式</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('regexTester', container.querySelector('.tool-header'));
      
      // 获取元素
      const patternInput = container.querySelector('#regex-pattern');
      const flagsInput = container.querySelector('#regex-flags');
      const testString = container.querySelector('#regex-test-string');
      const highlightMatches = container.querySelector('#highlight-matches');
      const lineNumbers = container.querySelector('#line-numbers');
      const autoUpdate = container.querySelector('#auto-update');
      const testBtn = container.querySelector('#test-btn');
      const clearBtn = container.querySelector('#clear-btn');
      const resultContainer = container.querySelector('#regex-result');
      const matchesContainer = container.querySelector('#regex-matches');
      const matchCount = container.querySelector('#match-count');
      const toggleCheatsheet = container.querySelector('#toggle-cheatsheet');
      const cheatsheetContent = container.querySelector('#cheatsheet-content');
      
      // 默认示例
      patternInput.value = '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b';
      flagsInput.value = 'g';
      testString.value = `联系我们：
support@example.com
sales@company.cn
john.doe@mail.co.uk
这不是一个邮箱地址: test@
另一个无效地址: @example.com
`;
      
      // 测试正则表达式
      function testRegex() {
        const pattern = patternInput.value;
        const flags = flagsInput.value;
        const text = testString.value;
        
        if (!pattern) {
          resultContainer.innerHTML = '<div class="regex-error">请输入正则表达式</div>';
          matchesContainer.innerHTML = '';
          matchCount.textContent = '0 个匹配';
          return;
        }
        
        try {
          const regex = new RegExp(pattern, flags);
          
          // 高亮匹配结果
          if (highlightMatches.checked) {
            let html = '';
            const lines = text.split('\n');
            
            if (lineNumbers.checked) {
              html += '<div class="line-numbers">';
              for (let i = 0; i < lines.length; i++) {
                html += `<div class="line-number">${i + 1}</div>`;
              }
              html += '</div>';
            }
            
            html += '<div class="text-content">';
            
            if (flags.includes('g')) {
              // 全局匹配
              for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                let lastIndex = 0;
                let lineHtml = '';
                let match;
                
                const lineRegex = new RegExp(pattern, flags);
                while ((match = lineRegex.exec(line)) !== null) {
                  // 添加匹配前的文本
                  lineHtml += escapeHtml(line.substring(lastIndex, match.index));
                  // 添加匹配的文本
                  lineHtml += `<span class="match">${escapeHtml(match[0])}</span>`;
                  lastIndex = lineRegex.lastIndex;
                  
                  // 防止无限循环
                  if (match[0].length === 0) {
                    lineRegex.lastIndex++;
                  }
                }
                
                // 添加剩余的文本
                lineHtml += escapeHtml(line.substring(lastIndex));
                html += `<div class="line">${lineHtml || '&nbsp;'}</div>`;
              }
            } else {
              // 非全局匹配
              const match = text.match(regex);
              if (match) {
                const index = match.index;
                const matchedText = match[0];
                
                // 找到匹配所在的行
                let lineStart = 0;
                let lineIndex = 0;
                
                for (let i = 0; i < index; i++) {
                  if (text[i] === '\n') {
                    lineStart = i + 1;
                    lineIndex++;
                  }
                }
                
                // 处理每一行
                for (let i = 0; i < lines.length; i++) {
                  const line = lines[i];
                  if (i === lineIndex) {
                    // 匹配所在行
                    const posInLine = index - lineStart;
                    const beforeMatch = line.substring(0, posInLine);
                    const afterMatch = line.substring(posInLine + matchedText.length);
                    html += `<div class="line">${escapeHtml(beforeMatch)}<span class="match">${escapeHtml(matchedText)}</span>${escapeHtml(afterMatch)}</div>`;
                  } else {
                    html += `<div class="line">${escapeHtml(line) || '&nbsp;'}</div>`;
                  }
                }
              } else {
                // 没有匹配
                for (let i = 0; i < lines.length; i++) {
                  html += `<div class="line">${escapeHtml(lines[i]) || '&nbsp;'}</div>`;
                }
              }
            }
            
            html += '</div>';
            resultContainer.innerHTML = html;
          } else {
            // 不高亮，只显示原始文本
            let html = '';
            const lines = text.split('\n');
            
            if (lineNumbers.checked) {
              html += '<div class="line-numbers">';
              for (let i = 0; i < lines.length; i++) {
                html += `<div class="line-number">${i + 1}</div>`;
              }
              html += '</div>';
            }
            
            html += '<div class="text-content">';
            for (let i = 0; i < lines.length; i++) {
              html += `<div class="line">${escapeHtml(lines[i]) || '&nbsp;'}</div>`;
            }
            html += '</div>';
            
            resultContainer.innerHTML = html;
          }
          
          // 显示匹配详情
          let matches = [];
          if (flags.includes('g')) {
            let match;
            const globalRegex = new RegExp(pattern, flags);
            while ((match = globalRegex.exec(text)) !== null) {
              matches.push({
                text: match[0],
                index: match.index,
                groups: match.slice(1)
              });
              
              // 防止无限循环
              if (match[0].length === 0) {
                globalRegex.lastIndex++;
              }
            }
          } else {
            const match = text.match(regex);
            if (match) {
              matches.push({
                text: match[0],
                index: match.index,
                groups: match.slice(1)
              });
            }
          }
          
          // 更新匹配计数
          matchCount.textContent = `${matches.length} 个匹配`;
          
          // 显示匹配详情
          if (matches.length > 0) {
            let matchesHtml = '';
            
            matches.forEach((match, i) => {
              const hasGroups = match.groups.length > 0;
              
              matchesHtml += `
                <div class="match-item">
                  <div class="match-header">
                    <span class="match-number">#${i + 1}</span>
                    <span class="match-text">${escapeHtml(match.text)}</span>
                    <span class="match-index">位置: ${match.index}</span>
                  </div>
                  ${hasGroups ? `
                    <div class="match-groups">
                      <div class="match-groups-header">捕获组:</div>
                      <div class="match-groups-content">
                        ${match.groups.map((group, j) => `
                          <div class="match-group">
                            <span class="match-group-number">$${j + 1}:</span>
                            <span class="match-group-text">${escapeHtml(group || '')}</span>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>
              `;
            });
            
            matchesContainer.innerHTML = matchesHtml;
          } else {
            matchesContainer.innerHTML = '<div class="no-matches">没有找到匹配项</div>';
          }
        } catch (e) {
          resultContainer.innerHTML = `<div class="regex-error">正则表达式错误: ${e.message}</div>`;
          matchesContainer.innerHTML = '';
          matchCount.textContent = '0 个匹配';
        }
      }
      
      // 转义HTML特殊字符
      function escapeHtml(text) {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      }
      
      // 事件监听
      testBtn.addEventListener('click', testRegex);
      
      clearBtn.addEventListener('click', () => {
        patternInput.value = '';
        flagsInput.value = '';
        testString.value = '';
        resultContainer.innerHTML = '';
        matchesContainer.innerHTML = '';
        matchCount.textContent = '0 个匹配';
      });
      
      // 自动更新
      const autoUpdateHandler = () => {
        if (autoUpdate.checked) {
          testRegex();
        }
      };
      
      patternInput.addEventListener('input', autoUpdateHandler);
      flagsInput.addEventListener('input', autoUpdateHandler);
      testString.addEventListener('input', autoUpdateHandler);
      highlightMatches.addEventListener('change', autoUpdateHandler);
      lineNumbers.addEventListener('change', autoUpdateHandler);
      
      // 切换速查表
      toggleCheatsheet.addEventListener('click', () => {
        const isHidden = cheatsheetContent.style.display === 'none';
        cheatsheetContent.style.display = isHidden ? 'block' : 'none';
        toggleCheatsheet.querySelector('i.fa').className = isHidden ? 'fa fa-chevron-up' : 'fa fa-chevron-down';
      });
      
      // 初始测试
      testRegex();
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .regex-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .regex-input-section {
          flex: 1;
          min-width: 300px;
        }
        
        .regex-result-section {
          flex: 1;
          min-width: 300px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .regex-input-wrapper {
          display: flex;
          align-items: center;
        }
        
        .regex-delimiter {
          font-size: 18px;
          padding: 0 5px;
          color: var(--text-muted);
        }
        
        .regex-flags {
          width: 80px;
          margin-left: 5px;
        }
        
        .regex-options {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .form-check {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .regex-actions {
          display: flex;
          gap: 10px;
        }
        
        .regex-result-header, .regex-matches-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .regex-result-header h3, .regex-matches-header h3 {
          margin: 0;
        }
        
        .regex-stats {
          color: var(--text-muted);
        }
        
        .regex-result-content, .regex-matches-content {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .regex-result {
          display: flex;
          font-family: monospace;
          font-size: 14px;
          line-height: 1.5;
          overflow-x: auto;
          min-height: 200px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .line-numbers {
          padding: 10px 8px;
          background-color: var(--bg-color);
          border-right: 1px solid var(--border-color);
          text-align: right;
          color: var(--text-muted);
          user-select: none;
        }
        
        .line-number {
          padding: 0 5px;
        }
        
        .text-content {
          padding: 10px;
          flex-grow: 1;
          white-space: pre-wrap;
          word-break: break-all;
        }
        
        .match {
          background-color: rgba(255, 213, 0, 0.3);
          border-radius: 2px;
          padding: 1px 0;
        }
        
        .regex-error {
          color: #e74c3c;
          padding: 10px;
        }
        
        .regex-matches {
          padding: 10px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .match-item {
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .match-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .match-header {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 8px;
        }
        
        .match-number {
          background-color: var(--primary-color);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .match-text {
          font-family: monospace;
          background-color: rgba(255, 213, 0, 0.3);
          padding: 2px 4px;
          border-radius: 2px;
          word-break: break-all;
        }
        
        .match-index {
          color: var(--text-muted);
          font-size: 12px;
        }
        
        .match-groups {
          margin-top: 8px;
          padding-left: 20px;
        }
        
        .match-groups-header {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 5px;
        }
        
        .match-group {
          display: flex;
          margin-bottom: 5px;
        }
        
        .match-group-number {
          width: 30px;
          color: var(--text-muted);
        }
        
        .match-group-text {
          font-family: monospace;
          word-break: break-all;
        }
        
        .no-matches {
          color: var(--text-muted);
          text-align: center;
          padding: 20px;
        }
        
        .regex-cheatsheet {
          margin-top: 30px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .cheatsheet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background-color: var(--card-bg);
          cursor: pointer;
        }
        
        .cheatsheet-header h3 {
          margin: 0;
          font-size: 16px;
        }
        
        .cheatsheet-content {
          padding: 15px;
          background-color: var(--bg-color);
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .cheatsheet-section {
          flex: 1;
          min-width: 250px;
        }
        
        .cheatsheet-section h4 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 14px;
        }
        
        .cheatsheet-section table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        
        .cheatsheet-section td {
          padding: 4px 0;
          vertical-align: top;
        }
        
        .cheatsheet-section td:first-child {
          width: 80px;
        }
        
        .cheatsheet-section code {
          background-color: var(--card-bg);
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
        }
        
        @media (max-width: 768px) {
          .regex-container {
            flex-direction: column;
          }
        }
      `;
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.regexTester = tool;
})();