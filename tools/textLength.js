/**
 * 文本长度统计工具
 * 支持字符数、字节数、行数、单词数统计，以及去除空格后的长度
 */
(function() {
  const toolId = 'textLength';

  const tool = {
    init: function() {},
    render: function(container) {
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-text-width"></i> 文本长度统计</h2>
          <p class="tool-description">统计文本的字符数、字节数、行数、单词数，支持实时更新和复制结果。</p>
        </div>
        
        <div class="tl-container">
          <div class="tl-input-area">
            <textarea id="tl-input" class="tl-textarea" placeholder="在此输入或粘贴文本..." spellcheck="false"></textarea>
            <div class="tl-actions">
              <button id="tl-clear" class="btn"><i class="fa fa-eraser"></i> 清空</button>
              <button id="tl-copy" class="btn"><i class="fa fa-copy"></i> 复制文本</button>
              <button id="tl-copy-stats" class="btn"><i class="fa fa-table"></i> 复制统计结果</button>
            </div>
          </div>
          
          <div class="tl-stats-area">
            <div class="tl-stats-header">
              <h3>统计结果</h3>
              <div class="tl-options">
                <label class="tl-option">
                  <input type="checkbox" id="tl-real-time" checked />
                  实时统计
                </label>
                <label class="tl-option">
                  <input type="checkbox" id="tl-trim-spaces" />
                  忽略首尾空格
                </label>
              </div>
            </div>
            
            <div class="tl-stats-grid">
              <div class="tl-stat-item">
                <div class="tl-stat-label">字符数</div>
                <div class="tl-stat-value" id="tl-char-count">0</div>
              </div>
              <div class="tl-stat-item">
                <div class="tl-stat-label">字节数 (UTF-8)</div>
                <div class="tl-stat-value" id="tl-byte-count">0</div>
              </div>
              <div class="tl-stat-item">
                <div class="tl-stat-label">行数</div>
                <div class="tl-stat-value" id="tl-line-count">0</div>
              </div>
              <div class="tl-stat-item">
                <div class="tl-stat-label">单词数</div>
                <div class="tl-stat-value" id="tl-word-count">0</div>
              </div>
              <div class="tl-stat-item">
                <div class="tl-stat-label">去空格字符数</div>
                <div class="tl-stat-value" id="tl-no-space-count">0</div>
              </div>
              <div class="tl-stat-item">
                <div class="tl-stat-label">中文字符数</div>
                <div class="tl-stat-value" id="tl-chinese-count">0</div>
              </div>
            </div>
            
            <div class="tl-additional-stats">
              <div class="tl-stat-section">
                <h4>字符分布</h4>
                <div class="tl-char-dist">
                  <div class="tl-dist-item">
                    <span class="tl-dist-label">字母</span>
                    <span class="tl-dist-value" id="tl-alpha-count">0</span>
                    <span class="tl-dist-percent" id="tl-alpha-percent">0%</span>
                  </div>
                  <div class="tl-dist-item">
                    <span class="tl-dist-label">数字</span>
                    <span class="tl-dist-value" id="tl-digit-count">0</span>
                    <span class="tl-dist-percent" id="tl-digit-percent">0%</span>
                  </div>
                  <div class="tl-dist-item">
                    <span class="tl-dist-label">空格</span>
                    <span class="tl-dist-value" id="tl-space-count">0</span>
                    <span class="tl-dist-percent" id="tl-space-percent">0%</span>
                  </div>
                  <div class="tl-dist-item">
                    <span class="tl-dist-label">标点符号</span>
                    <span class="tl-dist-value" id="tl-punct-count">0</span>
                    <span class="tl-dist-percent" id="tl-punct-percent">0%</span>
                  </div>
                  <div class="tl-dist-item">
                    <span class="tl-dist-label">其他</span>
                    <span class="tl-dist-value" id="tl-other-count">0</span>
                    <span class="tl-dist-percent" id="tl-other-percent">0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      if (typeof window.addFavoriteButton === 'function') {
        const header = container.querySelector('.tool-header');
        window.addFavoriteButton(toolId, header);
      }
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .tl-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .tl-input-area {
          flex: 1;
          min-width: 300px;
          display: flex;
          flex-direction: column;
        }
        
        .tl-stats-area {
          flex: 1;
          min-width: 300px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 16px;
        }
        
        .tl-textarea {
          width: 100%;
          min-height: 300px;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--bg-light);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          resize: vertical;
          margin-bottom: 12px;
        }
        
        .tl-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .btn {
          border: 1px solid var(--border-color);
          background: var(--card-bg);
          border-radius: 6px;
          padding: 6px 12px;
          cursor: pointer;
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        
        .btn:hover {
          border-color: var(--primary-color);
          background: rgba(74,108,247,0.08);
        }
        
        .tl-stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .tl-stats-header h3 {
          margin: 0;
        }
        
        .tl-options {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        
        .tl-option {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
        }
        
        .tl-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .tl-stat-item {
          background: var(--bg-light);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 12px;
          text-align: center;
        }
        
        .tl-stat-label {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 6px;
        }
        
        .tl-stat-value {
          font-size: 24px;
          font-weight: 600;
          color: var(--primary-color);
        }
        
        .tl-additional-stats {
          margin-top: 20px;
        }
        
        .tl-stat-section h4 {
          margin-top: 0;
          margin-bottom: 12px;
          font-size: 16px;
        }
        
        .tl-char-dist {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
        }
        
        .tl-dist-item {
          display: flex;
          flex-direction: column;
          background: var(--bg-light);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 10px;
          text-align: center;
        }
        
        .tl-dist-label {
          font-size: 14px;
          color: var(--text-muted);
        }
        
        .tl-dist-value {
          font-size: 18px;
          font-weight: 600;
          margin: 4px 0;
        }
        
        .tl-dist-percent {
          font-size: 14px;
          color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
          .tl-container {
            flex-direction: column;
          }
        }
      `;
      container.appendChild(style);
      
      // 获取元素引用
      const textarea = container.querySelector('#tl-input');
      const clearBtn = container.querySelector('#tl-clear');
      const copyBtn = container.querySelector('#tl-copy');
      const copyStatsBtn = container.querySelector('#tl-copy-stats');
      const realTimeCheckbox = container.querySelector('#tl-real-time');
      const trimSpacesCheckbox = container.querySelector('#tl-trim-spaces');
      
      // 统计结果元素
      const charCount = container.querySelector('#tl-char-count');
      const byteCount = container.querySelector('#tl-byte-count');
      const lineCount = container.querySelector('#tl-line-count');
      const wordCount = container.querySelector('#tl-word-count');
      const noSpaceCount = container.querySelector('#tl-no-space-count');
      const chineseCount = container.querySelector('#tl-chinese-count');
      
      // 字符分布元素
      const alphaCount = container.querySelector('#tl-alpha-count');
      const alphaPercent = container.querySelector('#tl-alpha-percent');
      const digitCount = container.querySelector('#tl-digit-count');
      const digitPercent = container.querySelector('#tl-digit-percent');
      const spaceCount = container.querySelector('#tl-space-count');
      const spacePercent = container.querySelector('#tl-space-percent');
      const punctCount = container.querySelector('#tl-punct-count');
      const punctPercent = container.querySelector('#tl-punct-percent');
      const otherCount = container.querySelector('#tl-other-count');
      const otherPercent = container.querySelector('#tl-other-percent');
      
      // 计算UTF-8字节数
      function getUTF8ByteLength(str) {
        let byteLength = 0;
        for (let i = 0; i < str.length; i++) {
          const charCode = str.charCodeAt(i);
          if (charCode < 0x80) {
            byteLength += 1;
          } else if (charCode < 0x800) {
            byteLength += 2;
          } else if (charCode < 0xD800 || charCode >= 0xE000) {
            byteLength += 3;
          } else {
            // 处理UTF-16代理对
            i++;
            byteLength += 4;
          }
        }
        return byteLength;
      }
      
      // 统计文本
      function countText() {
        let text = textarea.value;
        const isTrimmed = trimSpacesCheckbox.checked;
        
        if (isTrimmed) {
          text = text.trim();
        }
        
        // 基本统计
        const chars = text.length;
        const bytes = getUTF8ByteLength(text);
        const lines = text ? text.split('\n').length : 0;
        const words = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
        const noSpaces = text.replace(/\s/g, '').length;
        
        // 中文字符统计
        const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
        
        // 字符分布
        const alphaChars = (text.match(/[a-zA-Z]/g) || []).length;
        const digitChars = (text.match(/\d/g) || []).length;
        const spaceChars = (text.match(/\s/g) || []).length;
        const punctChars = (text.match(/[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/g) || []).length;
        const otherChars = chars - alphaChars - digitChars - spaceChars - punctChars;
        
        // 更新统计结果
        charCount.textContent = chars.toLocaleString();
        byteCount.textContent = bytes.toLocaleString();
        lineCount.textContent = lines.toLocaleString();
        wordCount.textContent = words.toLocaleString();
        noSpaceCount.textContent = noSpaces.toLocaleString();
        chineseCount.textContent = chineseChars.toLocaleString();
        
        // 更新字符分布
        alphaCount.textContent = alphaChars.toLocaleString();
        digitCount.textContent = digitChars.toLocaleString();
        spaceCount.textContent = spaceChars.toLocaleString();
        punctCount.textContent = punctChars.toLocaleString();
        otherCount.textContent = otherChars.toLocaleString();
        
        // 更新百分比
        if (chars > 0) {
          alphaPercent.textContent = (alphaChars / chars * 100).toFixed(1) + '%';
          digitPercent.textContent = (digitChars / chars * 100).toFixed(1) + '%';
          spacePercent.textContent = (spaceChars / chars * 100).toFixed(1) + '%';
          punctPercent.textContent = (punctChars / chars * 100).toFixed(1) + '%';
          otherPercent.textContent = (otherChars / chars * 100).toFixed(1) + '%';
        } else {
          alphaPercent.textContent = '0%';
          digitPercent.textContent = '0%';
          spacePercent.textContent = '0%';
          punctPercent.textContent = '0%';
          otherPercent.textContent = '0%';
        }
      }
      
      // 复制文本到剪贴板
      function copyToClipboard(text) {
        if (!text) return;
        
        try {
          if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text);
          } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
          }
          window.showToast && window.showToast('已复制到剪贴板', 'success');
        } catch (e) {
          window.showToast && window.showToast('复制失败：' + e.message, 'error');
        }
      }
      
      // 事件监听
      textarea.addEventListener('input', () => {
        if (realTimeCheckbox.checked) {
          countText();
        }
      });
      
      clearBtn.addEventListener('click', () => {
        textarea.value = '';
        countText();
        textarea.focus();
      });
      
      copyBtn.addEventListener('click', () => {
        copyToClipboard(textarea.value);
      });
      
      copyStatsBtn.addEventListener('click', () => {
        const stats = [
          `字符数: ${charCount.textContent}`,
          `字节数: ${byteCount.textContent}`,
          `行数: ${lineCount.textContent}`,
          `单词数: ${wordCount.textContent}`,
          `去空格字符数: ${noSpaceCount.textContent}`,
          `中文字符数: ${chineseCount.textContent}`,
          '',
          '字符分布:',
          `- 字母: ${alphaCount.textContent} (${alphaPercent.textContent})`,
          `- 数字: ${digitCount.textContent} (${digitPercent.textContent})`,
          `- 空格: ${spaceCount.textContent} (${spacePercent.textContent})`,
          `- 标点: ${punctCount.textContent} (${punctPercent.textContent})`,
          `- 其他: ${otherCount.textContent} (${otherPercent.textContent})`
        ].join('\n');
        
        copyToClipboard(stats);
      });
      
      realTimeCheckbox.addEventListener('change', () => {
        if (realTimeCheckbox.checked) {
          countText();
        }
      });
      
      trimSpacesCheckbox.addEventListener('change', countText);
      
      // 初始化
      countText();
      textarea.focus();
    }
  };
  
  // 注册工具
  if (typeof window.registerTool === 'function') {
    window.registerTool(toolId, tool);
  } else {
    window.tools[toolId] = tool;
    console.log('工具 ' + toolId + ' 已注册');
  }
})();
