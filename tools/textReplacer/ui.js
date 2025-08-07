/**
 * 文本替换工具 - UI模块
 */

const ui = {
  // 渲染工具界面
  render: function(container) {
    // 创建工具界面
    container.innerHTML = `
      <div class="tool-header">
        <h2><i class="fa fa-exchange"></i> 文本替换工具</h2>
        <p class="tool-description">批量替换文本内容，支持普通文本和正则表达式替换，可保存和导入替换规则。</p>
      </div>
      
      <div class="tool-container">
        <!-- 左侧：输入和规则 -->
        <div class="tool-input-section">
          <div class="form-group">
            <label for="source-text">源文本</label>
            <div class="textarea-with-stats">
              <textarea id="source-text" class="form-control" placeholder="请输入需要处理的文本..."></textarea>
              <div class="text-stats" id="source-stats">
                <span class="stat-item"><i class="fa fa-font"></i> <span id="source-chars">0</span> 字符</span>
                <span class="stat-item"><i class="fa fa-align-left"></i> <span id="source-lines">0</span> 行</span>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <div class="section-header">
              <label>替换规则</label>
              <div class="section-actions">
                <button id="save-rules" class="btn btn-sm" title="保存当前规则"><i class="fa fa-save"></i></button>
                <button id="load-rules" class="btn btn-sm" title="加载保存的规则"><i class="fa fa-folder-open"></i></button>
                <button id="export-rules" class="btn btn-sm" title="导出规则"><i class="fa fa-download"></i></button>
                <button id="import-rules" class="btn btn-sm" title="导入规则"><i class="fa fa-upload"></i></button>
                <input type="file" id="import-rules-input" accept=".json" style="display: none;">
              </div>
            </div>
            
            <div id="rules-container">
              <div class="rule-item">
                <div class="rule-header">
                  <span class="rule-title">规则 1</span>
                  <div class="rule-actions">
                    <button class="btn-rule-toggle" title="展开/折叠"><i class="fa fa-chevron-up"></i></button>
                  </div>
                </div>
                <div class="rule-content">
                  <div class="rule-inputs">
                    <input type="text" class="form-control search-text" placeholder="查找内容..." />
                    <span class="rule-arrow"><i class="fa fa-arrow-right"></i></span>
                    <input type="text" class="form-control replace-text" placeholder="替换为..." />
                  </div>
                  <div class="rule-options">
                    <label><input type="checkbox" class="use-regex" /> 使用正则表达式</label>
                    <label><input type="checkbox" class="case-sensitive" /> 区分大小写</label>
                    <label><input type="checkbox" class="global-match" checked /> 全局替换</label>
                    <label><input type="checkbox" class="multiline" /> 多行模式</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="rule-actions">
              <button id="add-rule" class="btn btn-sm"><i class="fa fa-plus"></i> 添加规则</button>
              <button id="clear-rules" class="btn btn-sm btn-secondary"><i class="fa fa-trash"></i> 清空规则</button>
              <button id="test-rules" class="btn btn-sm btn-info"><i class="fa fa-flask"></i> 测试规则</button>
            </div>
          </div>
          
          <div class="form-group">
            <div class="btn-group">
              <button id="replace-btn" class="btn btn-success"><i class="fa fa-exchange"></i> 替换</button>
              <button id="reset-btn" class="btn btn-secondary"><i class="fa fa-refresh"></i> 重置</button>
              <button id="swap-btn" class="btn btn-info" title="交换源文本和结果"><i class="fa fa-retweet"></i> 交换</button>
            </div>
          </div>
        </div>
        
        <!-- 右侧：结果 -->
        <div class="tool-result-section">
          <div class="form-group">
            <div class="result-header">
              <label for="result-text">替换结果</label>
              <div class="result-actions">
                <button id="copy-btn" class="btn btn-sm"><i class="fa fa-copy"></i> 复制</button>
                <button id="download-btn" class="btn btn-sm"><i class="fa fa-download"></i> 下载</button>
              </div>
            </div>
            <div class="textarea-with-stats">
              <textarea id="result-text" class="form-control" placeholder="替换后的文本将显示在这里..." readonly></textarea>
              <div class="text-stats" id="result-stats">
                <span class="stat-item"><i class="fa fa-font"></i> <span id="result-chars">0</span> 字符</span>
                <span class="stat-item"><i class="fa fa-align-left"></i> <span id="result-lines">0</span> 行</span>
                <span class="stat-item"><i class="fa fa-exchange"></i> <span id="changes-count">0</span> 处更改</span>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <div class="section-header">
              <label>替换历史</label>
              <button id="clear-history" class="btn btn-sm btn-secondary"><i class="fa fa-trash"></i> 清空历史</button>
            </div>
            <div id="history-container" class="history-container">
              <div class="no-history">暂无替换历史</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 工具说明区域 -->
      <div class="tool-info">
        <div class="info-header">
          <h3><i class="fa fa-question-circle"></i> 使用指南</h3>
          <button class="toggle-info-btn" title="展开/收起说明"><i class="fa fa-chevron-up"></i></button>
        </div>
        <div class="info-content">
          <div class="info-item">
            <h4><i class="fa fa-info-circle"></i> 功能介绍</h4>
            <p>文本替换工具可以帮助您快速批量替换文本内容，支持普通文本和正则表达式替换，适用于数据清洗、代码重构、文本格式化等场景。</p>
          </div>
          
          <div class="info-item">
            <h4><i class="fa fa-list-ol"></i> 使用步骤</h4>
            <ol>
              <li>在<strong>源文本</strong>框中输入或粘贴需要处理的文本</li>
              <li>添加一条或多条<strong>替换规则</strong>，每条规则包含"查找内容"和"替换为"</li>
              <li>根据需要设置规则选项：
                <ul>
                  <li><strong>使用正则表达式</strong>：启用后可使用正则表达式语法进行高级匹配</li>
                  <li><strong>区分大小写</strong>：启用后区分大小写进行匹配</li>
                  <li><strong>全局替换</strong>：启用后替换所有匹配项，否则只替换第一个</li>
                  <li><strong>多行模式</strong>：启用后 ^ 和 $ 将匹配每行的开始和结束</li>
                </ul>
              </li>
              <li>点击<strong>替换</strong>按钮执行替换操作</li>
              <li>在<strong>替换结果</strong>框中查看处理后的文本</li>
            </ol>
          </div>
          
          <div class="info-item">
            <h4><i class="fa fa-star"></i> 高级功能</h4>
            <ul>
              <li><strong>保存规则</strong>：将当前规则保存到本地，方便下次使用</li>
              <li><strong>加载规则</strong>：加载之前保存的规则</li>
              <li><strong>导出规则</strong>：将规则导出为JSON文件，可分享给他人</li>
              <li><strong>导入规则</strong>：从JSON文件导入规则</li>
              <li><strong>测试规则</strong>：在不修改结果的情况下，预览规则匹配的内容</li>
              <li><strong>替换历史</strong>：记录最近的替换操作，可以快速恢复之前的结果</li>
            </ul>
          </div>
          
          <div class="info-item">
            <h4><i class="fa fa-lightbulb-o"></i> 正则表达式示例</h4>
            <table class="regex-examples">
              <tr>
                <th>查找内容</th>
                <th>说明</th>
              </tr>
              <tr>
                <td>\\d+</td>
                <td>匹配一个或多个数字</td>
              </tr>
              <tr>
                <td>[a-zA-Z]+</td>
                <td>匹配一个或多个字母</td>
              </tr>
              <tr>
                <td>^\\s+</td>
                <td>匹配行首的空白字符（需启用多行模式）</td>
              </tr>
              <tr>
                <td>(\\w+)@(\\w+)\\.com</td>
                <td>匹配电子邮件地址，可在替换中使用 $1 和 $2 引用捕获组</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      
      <!-- 保存规则对话框 -->
      <div id="save-rules-dialog" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>保存替换规则</h3>
            <span class="close-modal">&times;</span>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="rule-name">规则名称</label>
              <input type="text" id="rule-name" class="form-control" placeholder="输入规则名称...">
            </div>
            <div class="form-group">
              <label for="rule-description">规则描述 (可选)</label>
              <textarea id="rule-description" class="form-control" placeholder="输入规则描述..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button id="save-rules-confirm" class="btn btn-success">保存</button>
            <button class="btn btn-secondary close-modal">取消</button>
          </div>
        </div>
      </div>
      
      <!-- 加载规则对话框 -->
      <div id="load-rules-dialog" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>加载替换规则</h3>
            <span class="close-modal">&times;</span>
          </div>
          <div class="modal-body">
            <div id="saved-rules-list" class="saved-rules-list">
              <div class="no-saved-rules">暂无保存的规则</div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary close-modal">取消</button>
          </div>
        </div>
      </div>
    `;
    
    // 添加收藏按钮
    window.addFavoriteButton('textReplacer', container.querySelector('.tool-header'));
    
    // 添加样式
    this.addStyles(container);
  },
  
  // 添加样式
  addStyles: function(container) {
    const style = document.createElement('style');
    style.textContent = `
      .tool-container {
        display: flex;
        gap: 20px;
      }
      
      .tool-input-section, .tool-result-section {
        flex: 1;
        min-width: 0;
      }
      
      .textarea-with-stats {
        position: relative;
      }
      
      .text-stats {
        display: flex;
        justify-content: flex-end;
        gap: 15px;
        margin-top: 5px;
        color: var(--text-muted);
        font-size: 0.9em;
      }
      
      .stat-item {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .section-actions {
        display: flex;
        gap: 5px;
      }
      
      .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .result-actions {
        display: flex;
        gap: 5px;
      }
      
      .rule-item {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 10px;
        margin-bottom: 10px;
      }
      
      .rule-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .rule-actions {
        display: flex;
        gap: 5px;
      }
      
      .rule-inputs {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      }
      
      .rule-arrow {
        color: var(--text-muted);
      }
      
      .rule-options {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
      }
      
      .rule-options label {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 0;
        cursor: pointer;
      }
      
      .btn-rule-toggle, .btn-rule-delete {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 2px 5px;
        border-radius: 3px;
      }
      
      .btn-rule-toggle:hover, .btn-rule-delete:hover {
        background-color: var(--hover-bg);
      }
      
      .btn-rule-delete:hover {
        color: var(--danger-color);
      }
      
      .history-container {
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 10px;
      }
      
      .no-history, .no-saved-rules {
        color: var(--text-muted);
        text-align: center;
        padding: 20px;
      }
      
      .history-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        border-bottom: 1px solid var(--border-color);
      }
      
      .history-item:last-child {
        border-bottom: none;
      }
      
      .history-time {
        color: var(--text-muted);
        font-size: 0.9em;
        width: 80px;
      }
      
      .history-preview {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0 10px;
        overflow: hidden;
      }
      
      .history-source, .history-result {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .history-arrow {
        color: var(--text-muted);
      }
      
      .history-restore {
        background: none;
        border: none;
        color: var(--primary-color);
        cursor: pointer;
      }
      
      .tool-info {
        margin-top: 20px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
      }
      
      .info-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        background-color: var(--card-header-bg);
        border-bottom: 1px solid var(--border-color);
      }
      
      .info-header h3 {
        margin: 0;
        font-size: 1.1em;
      }
      
      .toggle-info-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
      }
      
      .info-content {
        padding: 15px;
      }
      
      .info-item {
        margin-bottom: 20px;
      }
      
      .info-item:last-child {
        margin-bottom: 0;
      }
      
      .info-item h4 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 1em;
      }
      
      .regex-examples {
        width: 100%;
        border-collapse: collapse;
      }
      
      .regex-examples th, .regex-examples td {
        border: 1px solid var(--border-color);
        padding: 8px;
        text-align: left;
      }
      
      .regex-examples th {
        background-color: var(--card-header-bg);
      }
      
      .saved-rules-list {
        max-height: 300px;
        overflow-y: auto;
      }
      
      .saved-rule-item {
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 10px;
        margin-bottom: 10px;
      }
      
      .saved-rule-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
      }
      
      .saved-rule-name {
        font-weight: bold;
      }
      
      .saved-rule-date {
        color: var(--text-muted);
        font-size: 0.9em;
      }
      
      .saved-rule-description {
        margin-bottom: 5px;
        color: var(--text-color);
      }
      
      .saved-rule-stats {
        color: var(--text-muted);
        font-size: 0.9em;
        margin-bottom: 10px;
      }
      
      .saved-rule-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
      
      .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
      
      .modal-content {
        background-color: var(--bg-color);
        margin: 10% auto;
        padding: 0;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        width: 500px;
        max-width: 90%;
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid var(--border-color);
      }
      
      .modal-header h3 {
        margin: 0;
      }
      
      .close-modal, .close-preview {
        color: var(--text-muted);
        font-size: 1.5em;
        cursor: pointer;
      }
      
      .close-modal:hover, .close-preview:hover {
        color: var(--text-color);
      }
      
      .modal-body {
        padding: 15px;
      }
      
      .modal-footer {
        padding: 15px;
        border-top: 1px solid var(--border-color);
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
      
      @media (max-width: 768px) {
        .tool-container {
          flex-direction: column;
        }
        
        .rule-options {
          flex-direction: column;
          gap: 5px;
        }
        
        .history-preview {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .history-source, .history-result {
          width: 100%;
        }
      }
    `;
    container.appendChild(style);
  }
};

module.exports = ui;