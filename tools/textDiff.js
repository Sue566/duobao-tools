/**
 * 文本差异比较工具
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-files-o"></i> 文本差异比较</h2>
          <p class="tool-description">比较两段文本的差异，高亮显示不同之处。</p>
        </div>
        
        <div class="diff-container">
          <div class="diff-inputs">
            <div class="form-group">
              <label for="text-original">原始文本</label>
              <textarea id="text-original" class="form-control" placeholder="请输入原始文本..."></textarea>
            </div>
            
            <div class="form-group">
              <label for="text-modified">修改后文本</label>
              <textarea id="text-modified" class="form-control" placeholder="请输入修改后文本..."></textarea>
            </div>
          </div>
          
          <div class="diff-actions">
            <button id="compare-btn" class="btn btn-success"><i class="fa fa-exchange"></i> 比较差异</button>
            <button id="swap-btn" class="btn"><i class="fa fa-retweet"></i> 交换文本</button>
            <button id="clear-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
          </div>
          
          <div class="diff-result" id="diff-result" style="display: none;">
            <div class="result-header">
              <h3>比较结果</h3>
              <div class="diff-legend">
                <span class="legend-item"><span class="color-box added"></span> 新增</span>
                <span class="legend-item"><span class="color-box removed"></span> 删除</span>
                <span class="legend-item"><span class="color-box unchanged"></span> 相同</span>
              </div>
            </div>
            <div class="diff-view" id="diff-view"></div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('textDiff', container.querySelector('.tool-header'));
      
      // 获取元素
      const originalText = container.querySelector('#text-original');
      const modifiedText = container.querySelector('#text-modified');
      const compareBtn = container.querySelector('#compare-btn');
      const swapBtn = container.querySelector('#swap-btn');
      const clearBtn = container.querySelector('#clear-btn');
      const resultContainer = container.querySelector('#diff-result');
      const diffView = container.querySelector('#diff-view');
      
      // 比较差异
      compareBtn.addEventListener('click', () => {
        const original = originalText.value;
        const modified = modifiedText.value;
        
        if (!original && !modified) {
          showToast('请输入需要比较的文本', 'warning');
          return;
        }
        
        // 显示结果容器
        resultContainer.style.display = 'block';
        
        // 计算差异
        const diff = calculateDiff(original, modified);
        
        // 显示差异
        diffView.innerHTML = '';
        
        if (diff.length === 0) {
          diffView.innerHTML = '<div class="no-diff">两段文本完全相同</div>';
        } else {
          const diffHtml = document.createElement('div');
          diffHtml.className = 'diff-lines';
          
          diff.forEach(part => {
            const span = document.createElement('span');
            span.className = part.added ? 'added' : part.removed ? 'removed' : 'unchanged';
            span.textContent = part.value;
            diffHtml.appendChild(span);
          });
          
          diffView.appendChild(diffHtml);
        }
        
        // 滚动到结果
        resultContainer.scrollIntoView({ behavior: 'smooth' });
      });
      
      // 交换文本
      swapBtn.addEventListener('click', () => {
        const temp = originalText.value;
        originalText.value = modifiedText.value;
        modifiedText.value = temp;
      });
      
      // 清空
      clearBtn.addEventListener('click', () => {
        originalText.value = '';
        modifiedText.value = '';
        resultContainer.style.display = 'none';
      });
      
      // 计算差异
      function calculateDiff(text1, text2) {
        // 简单的差异算法，实际应该使用更高级的算法如Myers差异算法
        if (text1 === text2) return [];
        
        // 按行分割
        const lines1 = text1.split('\n');
        const lines2 = text2.split('\n');
        
        const result = [];
        const maxLines = Math.max(lines1.length, lines2.length);
        
        for (let i = 0; i < maxLines; i++) {
          const line1 = i < lines1.length ? lines1[i] : '';
          const line2 = i < lines2.length ? lines2[i] : '';
          
          if (line1 === line2) {
            result.push({ value: line1 + '\n', added: false, removed: false });
          } else {
            if (line1) {
              result.push({ value: line1 + '\n', added: false, removed: true });
            }
            if (line2) {
              result.push({ value: line2 + '\n', added: true, removed: false });
            }
          }
        }
        
        return result;
      }
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .diff-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .diff-inputs {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .diff-inputs .form-group {
          flex: 1;
          min-width: 300px;
        }
        
        .diff-inputs textarea {
          height: 200px;
          font-family: monospace;
        }
        
        .diff-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        
        .diff-result {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 20px;
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
        
        .diff-legend {
          display: flex;
          gap: 15px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          font-size: 14px;
        }
        
        .color-box {
          width: 16px;
          height: 16px;
          border-radius: 3px;
          margin-right: 5px;
        }
        
        .color-box.added {
          background-color: rgba(46, 204, 113, 0.2);
        }
        
        .color-box.removed {
          background-color: rgba(231, 76, 60, 0.2);
        }
        
        .color-box.unchanged {
          background-color: transparent;
          border: 1px solid var(--border-color);
        }
        
        .diff-view {
          background-color: var(--bg-color);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 15px;
          max-height: 400px;
          overflow: auto;
          font-family: monospace;
          white-space: pre-wrap;
          line-height: 1.5;
        }
        
        .diff-lines {
          display: flex;
          flex-direction: column;
        }
        
        .diff-lines span {
          padding: 2px 0;
        }
        
        .added {
          background-color: rgba(46, 204, 113, 0.2);
          color: #27ae60;
        }
        
        .removed {
          background-color: rgba(231, 76, 60, 0.2);
          color: #c0392b;
          text-decoration: line-through;
        }
        
        .no-diff {
          text-align: center;
          padding: 20px;
          color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
          .diff-inputs {
            flex-direction: column;
          }
        }
      `;
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.textDiff = tool;
})();