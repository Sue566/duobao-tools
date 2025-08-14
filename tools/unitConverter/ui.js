/**
 * 单位转换工具 - UI模块
 * 负责界面渲染和样式
 */

const UnitConverterUI = {
  // 获取主HTML模板
  getHTML: function() {
    return `
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
  },
  
  // 获取样式
  getStyles: function() {
    return `
      .unit-tabs {
        margin-bottom: 30px;
      }
      
      /* 美化工具标题 */
      .tool-header {
        background: linear-gradient(135deg, #4a90e2, #6a5acd);
        color: white;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 25px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
      }
      
      .tool-header::before {
        content: '';
        position: absolute;
        top: -10px;
        right: -10px;
        width: 100px;
        height: 100px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        z-index: 0;
      }
      
      .tool-header h2 {
        margin-top: 0;
        display: flex;
        align-items: center;
        font-size: 24px;
      }
      
      .tool-header h2 i {
        margin-right: 10px;
        font-size: 28px;
      }
      
      .tab-header {
        display: flex;
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 20px;
        overflow-x: auto;
      }
      
      .tab-btn {
        padding: 12px 20px;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        font-weight: 500;
        color: var(--text-color);
        white-space: nowrap;
        transition: all 0.3s ease;
        border-radius: 6px 6px 0 0;
      }
      
      .tab-btn:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      
      .tab-btn.active {
        border-bottom-color: var(--primary-color);
        color: var(--primary-color);
        background-color: rgba(74, 144, 226, 0.1);
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
        background-color: var(--card-bg);
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
        background-color: var(--card-bg);
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
        background-color: var(--card-bg);
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
        background-color: var(--card-bg);
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
        margin-top: 15px;
      }
      
      .btn {
        transition: all 0.2s ease;
        border-radius: 6px;
        font-weight: 500;
        padding: 8px 16px;
      }
      
      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      
      .btn-success {
        background: linear-gradient(to right, #4a90e2, #5e72e4);
        border: none;
      }
      
      .btn-success:hover {
        background: linear-gradient(to right, #3a80d2, #4e62d4);
      }
      
      .btn-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
      }
      
      .btn-icon:hover {
        background-color: var(--primary-color);
        color: white;
        transform: rotate(180deg);
      }
      
      .unit-formula {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
        margin: 25px 0;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
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
        background-color: rgba(0, 0, 0, 0.02);
        border-radius: 4px;
        color: #333;
      }
      
      .unit-history {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        margin-bottom: 20px;
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
        padding: 12px;
        border-bottom: 1px solid var(--border-color);
        transition: all 0.2s ease;
        border-radius: 6px;
      }
      
      .history-item:hover {
        background-color: rgba(0, 0, 0, 0.02);
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
  }
};