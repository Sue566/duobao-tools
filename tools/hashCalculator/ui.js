/**
 * 多宝工具箱 - 哈希计算器 - UI模块
 */

const utils = require('./utils');

const ui = {
  // 渲染工具界面
  renderUI: function(container) {
    // 创建工具界面
    container.innerHTML = `
      <div class="tool-header">
        <h2><i class="fa fa-hashtag"></i> 哈希计算器</h2>
        <p class="tool-description">计算文本或文件的哈希值，支持MD5、SHA-1、SHA-256等多种算法，提供哈希比较和验证功能。</p>
      </div>
      
      <div class="hash-container">
        <div class="hash-input-section">
          <div class="hash-tabs">
            <button class="hash-tab-btn active" data-tab="text">文本</button>
            <button class="hash-tab-btn" data-tab="file">文件</button>
            <button class="hash-tab-btn" data-tab="compare">哈希比较</button>
            <button class="hash-tab-btn" data-tab="verify">哈希验证</button>
          </div>
          
          <div class="hash-tab-content">
            <div class="hash-tab-pane active" id="tab-text">
              <div class="form-group">
                <label for="text-input">输入文本</label>
                <textarea id="text-input" class="form-control" placeholder="输入需要计算哈希值的文本..."></textarea>
              </div>
              
              <div class="form-group">
                <label>编码</label>
                <div class="encoding-options">
                  <div class="form-check">
                    <input type="radio" name="text-encoding" id="encoding-utf8" value="utf-8" checked />
                    <label for="encoding-utf8">UTF-8</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="text-encoding" id="encoding-ascii" value="ascii" />
                    <label for="encoding-ascii">ASCII</label>
                  </div>
                  <div class="form-check">
                    <input type="radio" name="text-encoding" id="encoding-utf16" value="utf-16" />
                    <label for="encoding-utf16">UTF-16</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="hash-tab-pane" id="tab-file">
              <div class="form-group">
                <label for="file-input">选择文件</label>
                <div class="file-input-container">
                  <input type="file" id="file-input" />
                  <label for="file-input" class="file-input-label">
                    <i class="fa fa-upload"></i> 选择文件
                  </label>
                  <span id="file-name">未选择文件</span>
                </div>
              </div>
              
              <div class="file-info" id="file-info"></div>
              
              <div class="form-group">
                <div class="form-check">
                  <input type="checkbox" id="chunk-processing" checked />
                  <label for="chunk-processing">分块处理大文件（推荐用于大于10MB的文件）</label>
                </div>
              </div>
              
              <div class="progress-container" id="progress-container" style="display: none;">
                <label>处理进度</label>
                <div class="progress">
                  <div class="progress-bar" id="progress-bar" style="width: 0%;">0%</div>
                </div>
              </div>
            </div>
            
            <div class="hash-tab-pane" id="tab-compare">
              <div class="form-group">
                <label for="hash1-input">哈希值 1</label>
                <textarea id="hash1-input" class="form-control" placeholder="输入第一个哈希值..."></textarea>
              </div>
              
              <div class="form-group">
                <label for="hash2-input">哈希值 2</label>
                <textarea id="hash2-input" class="form-control" placeholder="输入第二个哈希值..."></textarea>
              </div>
              
              <div class="form-group">
                <button id="compare-btn" class="btn btn-success"><i class="fa fa-exchange"></i> 比较哈希值</button>
              </div>
              
              <div class="compare-result" id="compare-result"></div>
            </div>
            
            <div class="hash-tab-pane" id="tab-verify">
              <div class="form-group">
                <label for="verify-file-input">选择文件</label>
                <div class="file-input-container">
                  <input type="file" id="verify-file-input" />
                  <label for="verify-file-input" class="file-input-label">
                    <i class="fa fa-upload"></i> 选择文件
                  </label>
                  <span id="verify-file-name">未选择文件</span>
                </div>
              </div>
              
              <div class="form-group">
                <label for="verify-hash-input">预期哈希值</label>
                <textarea id="verify-hash-input" class="form-control" placeholder="输入预期的哈希值..."></textarea>
              </div>
              
              <div class="form-group">
                <label for="verify-algorithm">哈希算法</label>
                <select id="verify-algorithm" class="form-control">
                  <option value="md5">MD5</option>
                  <option value="sha1">SHA-1</option>
                  <option value="sha256" selected>SHA-256</option>
                  <option value="sha512">SHA-512</option>
                  <option value="sha3">SHA-3</option>
                  <option value="ripemd160">RIPEMD-160</option>
                </select>
              </div>
              
              <div class="form-group">
                <button id="verify-btn" class="btn btn-success"><i class="fa fa-check-circle"></i> 验证哈希值</button>
              </div>
              
              <div class="verify-result" id="verify-result"></div>
            </div>
          </div>
          
          <div class="hash-algorithms">
            <label>选择哈希算法</label>
            <div class="algorithm-options">
              <div class="form-check">
                <input type="checkbox" id="algo-md5" checked />
                <label for="algo-md5">MD5</label>
              </div>
              <div class="form-check">
                <input type="checkbox" id="algo-sha1" checked />
                <label for="algo-sha1">SHA-1</label>
              </div>
              <div class="form-check">
                <input type="checkbox" id="algo-sha256" checked />
                <label for="algo-sha256">SHA-256</label>
              </div>
              <div class="form-check">
                <input type="checkbox" id="algo-sha512" />
                <label for="algo-sha512">SHA-512</label>
              </div>
              <div class="form-check">
                <input type="checkbox" id="algo-sha3" />
                <label for="algo-sha3">SHA-3</label>
              </div>
              <div class="form-check">
                <input type="checkbox" id="algo-ripemd160" />
                <label for="algo-ripemd160">RIPEMD-160</label>
              </div>
              <div class="form-check">
                <input type="checkbox" id="algo-blake2b" />
                <label for="algo-blake2b">BLAKE2b</label>
              </div>
              <div class="form-check">
                <input type="checkbox" id="algo-keccak" />
                <label for="algo-keccak">Keccak</label>
              </div>
            </div>
          </div>
          
          <div class="hash-actions">
            <button id="calculate-btn" class="btn btn-success"><i class="fa fa-calculator"></i> 计算哈希值</button>
            <button id="clear-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
          </div>
        </div>
        
        <div class="hash-result-section">
          <div class="hash-result-header">
            <h3>计算结果</h3>
            <div class="hash-result-actions">
              <button id="copy-all-btn" class="btn btn-sm"><i class="fa fa-copy"></i> 复制所有</button>
              <button id="save-results-btn" class="btn btn-sm"><i class="fa fa-download"></i> 保存结果</button>
              <button id="clear-results-btn" class="btn btn-sm btn-secondary"><i class="fa fa-trash-o"></i> 清空结果</button>
            </div>
          </div>
          
          <div class="hash-results" id="hash-results">
            <div class="no-results">请输入文本或选择文件并计算哈希值</div>
          </div>
        </div>
      </div>
      
      <div class="hash-info">
        <div class="info-header">
          <h3>哈希算法说明</h3>
        </div>
        <div class="info-content">
          <div class="info-item">
            <h4>MD5</h4>
            <p>MD5（Message-Digest Algorithm 5）产生128位（16字节）哈希值。虽然速度快，但已被证明存在碰撞漏洞，不应用于安全场景。</p>
          </div>
          
          <div class="info-item">
            <h4>SHA-1</h4>
            <p>SHA-1（Secure Hash Algorithm 1）产生160位（20字节）哈希值。与MD5类似，已被证明不安全，不推荐用于安全场景。</p>
          </div>
          
          <div class="info-item">
            <h4>SHA-256</h4>
            <p>SHA-256是SHA-2家族的一部分，产生256位（32字节）哈希值。目前被广泛应用于安全场景，如数字签名和区块链。</p>
          </div>
          
          <div class="info-item">
            <h4>SHA-512</h4>
            <p>SHA-512也是SHA-2家族的一部分，产生512位（64字节）哈希值。提供比SHA-256更高的安全性，但计算速度较慢。</p>
          </div>
          
          <div class="info-item">
            <h4>SHA-3</h4>
            <p>SHA-3（Secure Hash Algorithm 3）是最新的哈希算法标准，与之前的SHA算法有着完全不同的内部结构，提供更高的安全性。</p>
          </div>
          
          <div class="info-item">
            <h4>RIPEMD-160</h4>
            <p>RIPEMD-160（RACE Integrity Primitives Evaluation Message Digest）产生160位（20字节）哈希值，在比特币中被广泛使用。</p>
          </div>
        </div>
      </div>
    `;
    
    // 添加样式
    this.addStyles(container);
    
    // 添加收藏按钮
    window.addFavoriteButton('hashCalculator', container.querySelector('.tool-header'));
    
    // 初始化标签页切换
    this.initTabs(container);
    
    // 初始化文件选择处理
    this.initFileHandlers(container);
  },
  
  // 初始化标签页切换
  initTabs: function(container) {
    const tabButtons = container.querySelectorAll('.hash-tab-btn');
    const tabPanes = container.querySelectorAll('.hash-tab-pane');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.getAttribute('data-tab');
        
        // 移除所有活动状态
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // 添加活动状态
        button.classList.add('active');
        container.querySelector(`#tab-${tab}`).classList.add('active');
      });
    });
  },
  
  // 初始化文件选择处理
  initFileHandlers: function(container) {
    const fileInput = container.querySelector('#file-input');
    const fileName = container.querySelector('#file-name');
    const fileInfo = container.querySelector('#file-info');
    const chunkProcessing = container.querySelector('#chunk-processing');
    
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        fileName.textContent = file.name;
        
        // 显示文件信息
        const size = utils.formatFileSize(file.size);
        const type = file.type || '未知类型';
        fileInfo.innerHTML = `
          <div class="file-info-item">
            <span class="file-info-label">文件名:</span>
            <span class="file-info-value">${file.name}</span>
          </div>
          <div class="file-info-item">
            <span class="file-info-label">大小:</span>
            <span class="file-info-value">${size}</span>
          </div>
          <div class="file-info-item">
            <span class="file-info-label">类型:</span>
            <span class="file-info-value">${type}</span>
          </div>
          <div class="file-info-item">
            <span class="file-info-label">修改时间:</span>
            <span class="file-info-value">${new Date(file.lastModified).toLocaleString()}</span>
          </div>
        `;
        
        // 自动选择分块处理
        chunkProcessing.checked = file.size > 10 * 1024 * 1024; // 10MB
      } else {
        fileName.textContent = '未选择文件';
        fileInfo.innerHTML = '';
      }
    });
    
    // 验证文件选择处理
    const verifyFileInput = container.querySelector('#verify-file-input');
    const verifyFileName = container.querySelector('#verify-file-name');
    
    verifyFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        verifyFileName.textContent = e.target.files[0].name;
      } else {
        verifyFileName.textContent = '未选择文件';
      }
    });
  },
  
  // 添加样式
  addStyles: function(container) {
    const style = document.createElement('style');
    style.textContent = `
      .hash-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .hash-input-section {
        flex: 1;
        min-width: 300px;
      }
      
      .hash-result-section {
        flex: 1;
        min-width: 300px;
      }
      
      .hash-tabs {
        display: flex;
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 15px;
        overflow-x: auto;
      }
      
      .hash-tab-btn {
        padding: 10px 15px;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        transition: var(--transition);
        white-space: nowrap;
      }
      
      .hash-tab-btn.active {
        border-bottom-color: var(--primary-color);
        color: var(--primary-color);
      }
      
      .hash-tab-pane {
        display: none;
      }
      
      .hash-tab-pane.active {
        display: block;
      }
      
      .encoding-options, .algorithm-options {
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
      
      .file-input-container {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      
      .file-input-container input {
        display: none;
      }
      
      .file-input-label {
        padding: 8px 15px;
        background-color: var(--border-color);
        border-radius: 4px;
        cursor: pointer;
        transition: var(--transition);
      }
      
      .file-input-label:hover {
        background-color: var(--hover-bg);
      }
      
      .file-info {
        margin-top: 15px;
      }
      
      .file-info-item {
        margin-bottom: 5px;
      }
      
      .file-info-label {
        color: var(--text-muted);
        margin-right: 10px;
      }
      
      .hash-algorithms {
        margin-top: 20px;
      }
      
      .hash-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
      }
      
      .hash-result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .hash-result-header h3 {
        margin: 0;
      }
      
      .hash-results {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 15px;
      }
      
      .hash-result-item {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid var(--border-color);
        flex-wrap: wrap;
      }
      
      .hash-result-item:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
      
      .hash-algorithm {
        width: 100px;
        font-weight: 500;
      }
      
      .hash-actions {
        display: flex;
        gap: 5px;
      }
      
      .hash-value {
        flex-grow: 1;
        font-family: monospace;
        word-break: break-all;
        padding: 0 10px;
      }
      
      .no-results, .loading, .error {
        padding: 20px;
        text-align: center;
      }
      
      .loading {
        color: var(--text-muted);
      }
      
      .error {
        color: #e74c3c;
      }
      
      .hash-info {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
      }
      
      .info-header {
        padding: 15px;
        border-bottom: 1px solid var(--border-color);
      }
      
      .info-header h3 {
        margin: 0;
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
      }
      
      .info-item p {
        margin: 0;
      }
      
      .progress-container {
        margin-top: 15px;
      }
      
      .progress {
        height: 20px;
        background-color: var(--bg-light);
        border-radius: 4px;
        overflow: hidden;
        margin-top: 5px;
      }
      
      .progress-bar {
        height: 100%;
        background-color: var(--primary-color);
        text-align: center;
        line-height: 20px;
        color: white;
        transition: width 0.3s;
      }
      
      .compare-result {
        margin-top: 20px;
      }
      
      .compare-match {
        padding: 15px;
        background-color: #d4edda;
        color: #155724;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .compare-mismatch {
        padding: 15px;
        background-color: #f8d7da;
        color: #721c24;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .diff-details {
        margin-top: 5px;
        font-size: 14px;
      }
      
      .hash-diff-container {
        margin-top: 15px;
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 15px;
        font-family: monospace;
      }
      
      .hash-diff-row {
        margin-bottom: 10px;
        word-break: break-all;
      }
      
      .hash-diff-row:last-child {
        margin-bottom: 0;
      }
      
      .hash-label {
        display: inline-block;
        width: 60px;
        font-weight: bold;
      }
      
      .hash-char {
        display: inline-block;
        padding: 1px;
      }
      
      .hash-char.diff {
        background-color: #f8d7da;
        color: #721c24;
      }
      
      .verify-result {
        margin-top: 20px;
      }
      
      .verify-success {
        padding: 15px;
        background-color: #d4edda;
        color: #155724;
        border-radius: 4px;
      }
      
      .verify-failure {
        padding: 15px;
        background-color: #f8d7da;
        color: #721c24;
        border-radius: 4px;
      }
      
      .hash-details {
        margin-top: 10px;
        font-family: monospace;
        word-break: break-all;
      }
      
      @media (max-width: 768px) {
        .hash-container {
          flex-direction: column;
        }
        
        .hash-result-item {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .hash-algorithm {
          width: auto;
          margin-bottom: 5px;
        }
        
        .hash-value {
          margin-bottom: 10px;
          padding: 0;
        }
        
        .hash-actions {
          align-self: flex-end;
        }
      }
    `;
    container.appendChild(style);
  }
};

module.exports = ui;