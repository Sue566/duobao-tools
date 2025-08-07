/**
 * 哈希计算器
 * 增强版：支持更多哈希算法、文件分块处理、哈希比较和验证功能
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
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
                <div class="hash-result-actions">
                <button id="copy-all-btn" class="btn btn-sm"><i class="fa fa-copy"></i> 复制所有</button>
                <button id="save-results-btn" class="btn btn-sm"><i class="fa fa-download"></i> 保存结果</button>
                <button id="clear-results-btn" class="btn btn-sm btn-secondary"><i class="fa fa-trash-o"></i> 清空结果</button>
              </div>
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
      
      // 添加收藏按钮
      window.addFavoriteButton('hashCalculator', container.querySelector('.tool-header'));
      
      // 获取元素
      const tabButtons = container.querySelectorAll('.hash-tab-btn');
      const tabPanes = container.querySelectorAll('.hash-tab-pane');
      
      const textInput = container.querySelector('#text-input');
      const fileInput = container.querySelector('#file-input');
      const fileName = container.querySelector('#file-name');
      const fileInfo = container.querySelector('#file-info');
      const chunkProcessing = container.querySelector('#chunk-processing');
      const progressContainer = container.querySelector('#progress-container');
      const progressBar = container.querySelector('#progress-bar');
      
      const hash1Input = container.querySelector('#hash1-input');
      const hash2Input = container.querySelector('#hash2-input');
      const compareBtn = container.querySelector('#compare-btn');
      const compareResult = container.querySelector('#compare-result');
      
      const verifyFileInput = container.querySelector('#verify-file-input');
      const verifyFileName = container.querySelector('#verify-file-name');
      const verifyHashInput = container.querySelector('#verify-hash-input');
      const verifyAlgorithm = container.querySelector('#verify-algorithm');
      const verifyBtn = container.querySelector('#verify-btn');
      const verifyResult = container.querySelector('#verify-result');
      
      const algoMd5 = container.querySelector('#algo-md5');
      const algoSha1 = container.querySelector('#algo-sha1');
      const algoSha256 = container.querySelector('#algo-sha256');
      const algoSha512 = container.querySelector('#algo-sha512');
      const algoSha3 = container.querySelector('#algo-sha3');
      const algoRipemd160 = container.querySelector('#algo-ripemd160');
      const algoBlake2b = container.querySelector('#algo-blake2b');
      const algoKeccak = container.querySelector('#algo-keccak');
      
      const calculateBtn = container.querySelector('#calculate-btn');
      const clearBtn = container.querySelector('#clear-btn');
      const copyAllBtn = container.querySelector('#copy-all-btn');
      const saveResultsBtn = container.querySelector('#save-results-btn');
      const clearResultsBtn = container.querySelector('#clear-results-btn');
      const hashResults = container.querySelector('#hash-results');
      
      // 切换标签页
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
      
      // 文件选择处理
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          fileName.textContent = file.name;
          
          // 显示文件信息
          const size = formatFileSize(file.size);
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
      verifyFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          verifyFileName.textContent = e.target.files[0].name;
        } else {
          verifyFileName.textContent = '未选择文件';
        }
      });
      
      // 格式化文件大小
      function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }
      
      // 计算文本哈希
      function calculateTextHash() {
        const text = textInput.value;
        if (!text) {
          showToast('请输入文本', 'warning');
          return;
        }
        
        // 获取选中的编码
        const encoding = document.querySelector('input[name="text-encoding"]:checked').value;
        
        // 获取选中的算法
        const algorithms = getSelectedAlgorithms();
        if (algorithms.length === 0) {
          showToast('请至少选择一种哈希算法', 'warning');
          return;
        }
        
        // 显示加载状态
        hashResults.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i> 计算中...</div>';
        
        // 使用setTimeout让UI有时间更新
        setTimeout(() => {
          try {
            const results = {};
            
            // 计算各种哈希值
            algorithms.forEach(algo => {
              switch (algo) {
                case 'md5':
                  results.md5 = CryptoJS.MD5(text).toString();
                  break;
                case 'sha1':
                  results.sha1 = CryptoJS.SHA1(text).toString();
                  break;
                case 'sha256':
                  results.sha256 = CryptoJS.SHA256(text).toString();
                  break;
                case 'sha512':
                  results.sha512 = CryptoJS.SHA512(text).toString();
                  break;
                case 'sha3':
                  results.sha3 = CryptoJS.SHA3(text).toString();
                  break;
                case 'ripemd160':
                  results.ripemd160 = CryptoJS.RIPEMD160(text).toString();
                  break;
              }
            });
            
            // 显示结果
            displayResults(results);
          } catch (e) {
            hashResults.innerHTML = `<div class="error">计算哈希值时出错: ${e.message}</div>`;
          }
        }, 100);
      }
      
      // 计算文件哈希
      function calculateFileHash() {
        const file = fileInput.files[0];
        if (!file) {
          showToast('请选择文件', 'warning');
          return;
        }
        
        // 获取选中的算法
        const algorithms = getSelectedAlgorithms();
        if (algorithms.length === 0) {
          showToast('请至少选择一种哈希算法', 'warning');
          return;
        }
        
        // 显示加载状态
        hashResults.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i> 计算中，请稍候...</div>';
        
        // 检查是否使用分块处理
        if (chunkProcessing.checked && file.size > 1024 * 1024) { // 大于1MB才使用分块
          calculateFileHashInChunks(file, algorithms);
        } else {
          calculateFileHashAtOnce(file, algorithms);
        }
      }
      
      // 一次性计算文件哈希
      function calculateFileHashAtOnce(file, algorithms) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          const fileContent = e.target.result;
          
          // 使用setTimeout让UI有时间更新
          setTimeout(() => {
            try {
              const results = {};
              
              // 计算各种哈希值
              algorithms.forEach(algo => {
                switch (algo) {
                  case 'md5':
                    results.md5 = CryptoJS.MD5(CryptoJS.lib.WordArray.create(fileContent)).toString();
                    break;
                  case 'sha1':
                    results.sha1 = CryptoJS.SHA1(CryptoJS.lib.WordArray.create(fileContent)).toString();
                    break;
                  case 'sha256':
                    results.sha256 = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(fileContent)).toString();
                    break;
                  case 'sha512':
                    results.sha512 = CryptoJS.SHA512(CryptoJS.lib.WordArray.create(fileContent)).toString();
                    break;
                  case 'sha3':
                    results.sha3 = CryptoJS.SHA3(CryptoJS.lib.WordArray.create(fileContent)).toString();
                    break;
                  case 'ripemd160':
                    results.ripemd160 = CryptoJS.RIPEMD160(CryptoJS.lib.WordArray.create(fileContent)).toString();
                    break;
                  case 'blake2b':
                    if (CryptoJS.BLAKE2b) {
                      results.blake2b = CryptoJS.BLAKE2b(CryptoJS.lib.WordArray.create(fileContent)).toString();
                    } else {
                      results.blake2b = '不支持 BLAKE2b 算法';
                    }
                    break;
                  case 'keccak':
                    if (CryptoJS.Keccak) {
                      results.keccak = CryptoJS.Keccak(CryptoJS.lib.WordArray.create(fileContent)).toString();
                    } else {
                      results.keccak = '不支持 Keccak 算法';
                    }
                    break;
                }
              });
              
              // 显示结果
              displayResults(results);
              
              // 保存到历史记录
              saveToHistory(file.name, results);
            } catch (e) {
              hashResults.innerHTML = `<div class="error">计算哈希值时出错: ${e.message}</div>`;
            }
          }, 100);
        };
        
        reader.onerror = function() {
          hashResults.innerHTML = '<div class="error">读取文件时出错</div>';
        };
        
        reader.readAsArrayBuffer(file);
      }
      
      // 分块计算文件哈希
      function calculateFileHashInChunks(file, algorithms) {
        const chunkSize = 2 * 1024 * 1024; // 2MB 块大小
        const chunks = Math.ceil(file.size / chunkSize);
        let currentChunk = 0;
        
        // 显示进度条
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
        
        // 初始化哈希对象
        const hashObjects = {};
        algorithms.forEach(algo => {
          switch (algo) {
            case 'md5':
              hashObjects.md5 = CryptoJS.algo.MD5.create();
              break;
            case 'sha1':
              hashObjects.sha1 = CryptoJS.algo.SHA1.create();
              break;
            case 'sha256':
              hashObjects.sha256 = CryptoJS.algo.SHA256.create();
              break;
            case 'sha512':
              hashObjects.sha512 = CryptoJS.algo.SHA512.create();
              break;
            case 'sha3':
              hashObjects.sha3 = CryptoJS.algo.SHA3.create();
              break;
            case 'ripemd160':
              hashObjects.ripemd160 = CryptoJS.algo.RIPEMD160.create();
              break;
            case 'blake2b':
              if (CryptoJS.algo.BLAKE2b) {
                hashObjects.blake2b = CryptoJS.algo.BLAKE2b.create();
              }
              break;
            case 'keccak':
              if (CryptoJS.algo.Keccak) {
                hashObjects.keccak = CryptoJS.algo.Keccak.create();
              }
              break;
          }
        });
        
        // 读取下一个块
        function readNextChunk() {
          const start = currentChunk * chunkSize;
          const end = Math.min(start + chunkSize, file.size);
          
          const reader = new FileReader();
          reader.onload = function(e) {
            const chunk = e.target.result;
            
            // 更新哈希
            algorithms.forEach(algo => {
              if (hashObjects[algo]) {
                hashObjects[algo].update(CryptoJS.lib.WordArray.create(chunk));
              }
            });
            
            // 更新进度
            currentChunk++;
            const progress = Math.round((currentChunk / chunks) * 100);
            progressBar.style.width = progress + '%';
            progressBar.textContent = progress + '%';
            
            // 继续读取下一个块或完成
            if (currentChunk < chunks) {
              readNextChunk();
            } else {
              // 完成所有块的处理
              const results = {};
              
              // 获取最终哈希值
              algorithms.forEach(algo => {
                if (hashObjects[algo]) {
                  results[algo] = hashObjects[algo].finalize().toString();
                }
              });
              
              // 隐藏进度条
              progressContainer.style.display = 'none';
              
              // 显示结果
              displayResults(results);
              
              // 保存到历史记录
              saveToHistory(file.name, results);
            }
          };
          
          reader.onerror = function() {
            hashResults.innerHTML = '<div class="error">读取文件块时出错</div>';
            progressContainer.style.display = 'none';
          };
          
          const blob = file.slice(start, end);
          reader.readAsArrayBuffer(blob);
        }
        
        // 开始读取第一个块
        readNextChunk();
      }
      
      // 获取选中的算法
      function getSelectedAlgorithms() {
        const algorithms = [];
        
        if (algoMd5.checked) algorithms.push('md5');
        if (algoSha1.checked) algorithms.push('sha1');
        if (algoSha256.checked) algorithms.push('sha256');
        if (algoSha512.checked) algorithms.push('sha512');
        if (algoSha3.checked) algorithms.push('sha3');
        if (algoRipemd160.checked) algorithms.push('ripemd160');
        if (algoBlake2b && algoBlake2b.checked) algorithms.push('blake2b');
        if (algoKeccak && algoKeccak.checked) algorithms.push('keccak');
        
        return algorithms;
      }
      
      // 比较哈希值
      function compareHashes() {
        const hash1 = hash1Input.value.trim().toLowerCase();
        const hash2 = hash2Input.value.trim().toLowerCase();
        
        if (!hash1 || !hash2) {
          showToast('请输入两个哈希值进行比较', 'warning');
          return;
        }
        
        // 移除所有空格和换行符
        const cleanHash1 = hash1.replace(/\s+/g, '');
        const cleanHash2 = hash2.replace(/\s+/g, '');
        
        if (cleanHash1 === cleanHash2) {
          compareResult.innerHTML = `
            <div class="compare-match">
              <i class="fa fa-check-circle"></i> 哈希值匹配
            </div>
          `;
        } else {
          // 计算差异位数
          let diffCount = 0;
          const minLength = Math.min(cleanHash1.length, cleanHash2.length);
          
          for (let i = 0; i < minLength; i++) {
            if (cleanHash1[i] !== cleanHash2[i]) {
              diffCount++;
            }
          }
          
          // 添加长度差异
          diffCount += Math.abs(cleanHash1.length - cleanHash2.length);
          
          // 计算差异百分比
          const diffPercentage = (diffCount / Math.max(cleanHash1.length, cleanHash2.length) * 100).toFixed(2);
          
          compareResult.innerHTML = `
            <div class="compare-mismatch">
              <i class="fa fa-times-circle"></i> 哈希值不匹配
              <div class="diff-details">
                <div>差异位数: ${diffCount}</div>
                <div>差异百分比: ${diffPercentage}%</div>
              </div>
            </div>
            <div class="hash-diff-view">
              ${generateHashDiffView(cleanHash1, cleanHash2)}
            </div>
          `;
        }
      }
      
      // 生成哈希差异视图
      function generateHashDiffView(hash1, hash2) {
        let html = '<div class="hash-diff-container">';
        
        // 第一个哈希
        html += '<div class="hash-diff-row"><span class="hash-label">哈希1:</span> ';
        for (let i = 0; i < hash1.length; i++) {
          const char = hash1[i];
          const isDifferent = i >= hash2.length || char !== hash2[i];
          html += `<span class="hash-char ${isDifferent ? 'diff' : ''}">${char}</span>`;
        }
        html += '</div>';
        
        // 第二个哈希
        html += '<div class="hash-diff-row"><span class="hash-label">哈希2:</span> ';
        for (let i = 0; i < hash2.length; i++) {
          const char = hash2[i];
          const isDifferent = i >= hash1.length || char !== hash1[i];
          html += `<span class="hash-char ${isDifferent ? 'diff' : ''}">${char}</span>`;
        }
        html += '</div>';
        
        html += '</div>';
        return html;
      }
      
      // 验证文件哈希
      function verifyFileHash() {
        const file = verifyFileInput.files[0];
        const expectedHash = verifyHashInput.value.trim().toLowerCase().replace(/\s+/g, '');
        const algorithm = verifyAlgorithm.value;
        
        if (!file) {
          showToast('请选择文件', 'warning');
          return;
        }
        
        if (!expectedHash) {
          showToast('请输入预期的哈希值', 'warning');
          return;
        }
        
        // 显示加载状态
        verifyResult.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i> 验证中，请稍候...</div>';
        
        // 检查文件大小，决定是否使用分块处理
        if (file.size > 10 * 1024 * 1024) { // 大于10MB
          verifyFileHashInChunks(file, algorithm, expectedHash);
        } else {
          verifyFileHashAtOnce(file, algorithm, expectedHash);
        }
      }
      
      // 一次性验证文件哈希
      function verifyFileHashAtOnce(file, algorithm, expectedHash) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          const fileContent = e.target.result;
          
          setTimeout(() => {
            try {
              let actualHash;
              
              // 计算哈希值
              switch (algorithm) {
                case 'md5':
                  actualHash = CryptoJS.MD5(CryptoJS.lib.WordArray.create(fileContent)).toString();
                  break;
                case 'sha1':
                  actualHash = CryptoJS.SHA1(CryptoJS.lib.WordArray.create(fileContent)).toString();
                  break;
                case 'sha256':
                  actualHash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(fileContent)).toString();
                  break;
                case 'sha512':
                  actualHash = CryptoJS.SHA512(CryptoJS.lib.WordArray.create(fileContent)).toString();
                  break;
                case 'sha3':
                  actualHash = CryptoJS.SHA3(CryptoJS.lib.WordArray.create(fileContent)).toString();
                  break;
                case 'ripemd160':
                  actualHash = CryptoJS.RIPEMD160(CryptoJS.lib.WordArray.create(fileContent)).toString();
                  break;
              }
              
              // 显示验证结果
              displayVerificationResult(actualHash, expectedHash);
            } catch (e) {
              verifyResult.innerHTML = `<div class="error">验证哈希值时出错: ${e.message}</div>`;
            }
          }, 100);
        };
        
        reader.onerror = function() {
          verifyResult.innerHTML = '<div class="error">读取文件时出错</div>';
        };
        
        reader.readAsArrayBuffer(file);
      }
      
      // 分块验证文件哈希
      function verifyFileHashInChunks(file, algorithm, expectedHash) {
        const chunkSize = 2 * 1024 * 1024; // 2MB 块大小
        const chunks = Math.ceil(file.size / chunkSize);
        let currentChunk = 0;
        
        // 初始化哈希对象
        let hashObject;
        
        switch (algorithm) {
          case 'md5':
            hashObject = CryptoJS.algo.MD5.create();
            break;
          case 'sha1':
            hashObject = CryptoJS.algo.SHA1.create();
            break;
          case 'sha256':
            hashObject = CryptoJS.algo.SHA256.create();
            break;
          case 'sha512':
            hashObject = CryptoJS.algo.SHA512.create();
            break;
          case 'sha3':
            hashObject = CryptoJS.algo.SHA3.create();
            break;
          case 'ripemd160':
            hashObject = CryptoJS.algo.RIPEMD160.create();
            break;
        }
        
        // 读取下一个块
        function readNextChunk() {
          const start = currentChunk * chunkSize;
          const end = Math.min(start + chunkSize, file.size);
          
          const reader = new FileReader();
          reader.onload = function(e) {
            const chunk = e.target.result;
            
            // 更新哈希
            hashObject.update(CryptoJS.lib.WordArray.create(chunk));
            
            // 更新进度
            currentChunk++;
            const progress = Math.round((currentChunk / chunks) * 100);
            verifyResult.innerHTML = `<div class="loading"><i class="fa fa-spinner fa-spin"></i> 验证中 ${progress}%</div>`;
            
            // 继续读取下一个块或完成
            if (currentChunk < chunks) {
              readNextChunk();
            } else {
              // 完成所有块的处理
              const actualHash = hashObject.finalize().toString();
              
              // 显示验证结果
              displayVerificationResult(actualHash, expectedHash);
            }
          };
          
          reader.onerror = function() {
            verifyResult.innerHTML = '<div class="error">读取文件块时出错</div>';
          };
          
          const blob = file.slice(start, end);
          reader.readAsArrayBuffer(blob);
        }
        
        // 开始读取第一个块
        readNextChunk();
      }
      
      // 显示验证结果
      function displayVerificationResult(actualHash, expectedHash) {
        if (actualHash.toLowerCase() === expectedHash.toLowerCase()) {
          verifyResult.innerHTML = `
            <div class="verify-success">
              <i class="fa fa-check-circle"></i> 验证成功！文件哈希值匹配
              <div class="hash-details">
                <div><strong>预期哈希值:</strong> ${expectedHash}</div>
                <div><strong>实际哈希值:</strong> ${actualHash}</div>
              </div>
            </div>
          `;
        } else {
          verifyResult.innerHTML = `
            <div class="verify-failure">
              <i class="fa fa-times-circle"></i> 验证失败！文件哈希值不匹配
              <div class="hash-details">
                <div><strong>预期哈希值:</strong> ${expectedHash}</div>
                <div><strong>实际哈希值:</strong> ${actualHash}</div>
              </div>
            </div>
          `;
        }
      }
      
      // 保存到历史记录
      function saveToHistory(name, results) {
        // 获取现有历史记录
        let history = JSON.parse(localStorage.getItem('hashCalculatorHistory') || '[]');
        
        // 添加新记录
        history.unshift({
          name: name,
          results: results,
          timestamp: new Date().toISOString()
        });
        
        // 限制历史记录数量
        if (history.length > 10) {
          history = history.slice(0, 10);
        }
        
        // 保存历史记录
        localStorage.setItem('hashCalculatorHistory', JSON.stringify(history));
      }
      
      // 显示结果
      function displayResults(results) {
        if (Object.keys(results).length === 0) {
          hashResults.innerHTML = '<div class="no-results">没有计算结果</div>';
          return;
        }
        
        let html = '';
        
        if (results.md5) {
          html += createResultItem('MD5', results.md5);
        }
        
        if (results.sha1) {
          html += createResultItem('SHA-1', results.sha1);
        }
        
        if (results.sha256) {
          html += createResultItem('SHA-256', results.sha256);
        }
        
        if (results.sha512) {
          html += createResultItem('SHA-512', results.sha512);
        }
        
        if (results.sha3) {
          html += createResultItem('SHA-3', results.sha3);
        }
        
        if (results.ripemd160) {
          html += createResultItem('RIPEMD-160', results.ripemd160);
        }
        
        if (results.blake2b) {
          html += createResultItem('BLAKE2b', results.blake2b);
        }
        
        if (results.keccak) {
          html += createResultItem('Keccak', results.keccak);
        }
        
        hashResults.innerHTML = html;
        
        // 添加复制按钮事件
        hashResults.querySelectorAll('.copy-hash').forEach(btn => {
          btn.addEventListener('click', () => {
            const hash = btn.getAttribute('data-hash');
            copyToClipboard(hash);
          });
        });
      }
      
      // 保存结果到文件
      function saveResultsToFile() {
        const resultItems = hashResults.querySelectorAll('.hash-result-item');
        if (resultItems.length === 0) {
          showToast('没有可保存的哈希值', 'warning');
          return;
        }
        
        let content = '';
        
        // 添加文件信息
        if (fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          content += `文件名: ${file.name}\n`;
          content += `文件大小: ${formatFileSize(file.size)}\n`;
          content += `计算时间: ${new Date().toLocaleString()}\n\n`;
        } else {
          content += `文本哈希计算结果\n`;
          content += `计算时间: ${new Date().toLocaleString()}\n\n`;
        }
        
        // 添加哈希值
        resultItems.forEach(item => {
          const algorithm = item.querySelector('.hash-algorithm').textContent;
          const hash = item.querySelector('.hash-value').textContent;
          content += `${algorithm}: ${hash}\n`;
        });
        
        // 创建下载链接
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'hash_results.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('哈希结果已保存到文件', 'success');
      }
      
      // 创建结果项
      function createResultItem(algorithm, hash) {
        return `
          <div class="hash-result-item">
            <div class="hash-algorithm">${algorithm}</div>
            <div class="hash-value">${hash}</div>
            <div class="hash-actions">
              <button class="btn btn-icon btn-sm copy-hash" data-hash="${hash}" title="复制"><i class="fa fa-copy"></i></button>
              <button class="btn btn-icon btn-sm verify-hash" data-hash="${hash}" title="验证"><i class="fa fa-check-circle"></i></button>
            </div>
          </div>
        `;
      }
      
      // 复制所有哈希值
      function copyAllHashes() {
        const resultItems = hashResults.querySelectorAll('.hash-result-item');
        if (resultItems.length === 0) {
          showToast('没有可复制的哈希值', 'warning');
          return;
        }
        
        let text = '';
        resultItems.forEach(item => {
          const algorithm = item.querySelector('.hash-algorithm').textContent;
          const hash = item.querySelector('.hash-value').textContent;
          text += `${algorithm}: ${hash}\n`;
        });
        
        copyToClipboard(text.trim());
      }
      
      // 复制到剪贴板
      function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
          const successful = document.execCommand('copy');
          document.body.removeChild(textarea);
          if (successful) {
            showToast('已复制到剪贴板', 'success');
          } else {
            showToast('复制失败', 'error');
          }
        } catch (err) {
          document.body.removeChild(textarea);
          showToast('复制失败: ' + err, 'error');
        }
      }
      
      // 显示提示消息
      function showToast(message, type = 'info') {
        if (window.showToast) {
          window.showToast(message, type);
        } else {
          alert(message);
        }
      }
      
      // 事件监听
      calculateBtn.addEventListener('click', () => {
        const activeTab = container.querySelector('.hash-tab-btn.active').getAttribute('data-tab');
        
        if (activeTab === 'text') {
          calculateTextHash();
        } else if (activeTab === 'file') {
          calculateFileHash();
        }
      });
      
      clearBtn.addEventListener('click', () => {
        textInput.value = '';
        fileInput.value = '';
        fileName.textContent = '未选择文件';
        fileInfo.innerHTML = '';
        hashResults.innerHTML = '<div class="no-results">请输入文本或选择文件并计算哈希值</div>';
      });
      
      copyAllBtn.addEventListener('click', copyAllHashes);
      saveResultsBtn.addEventListener('click', saveResultsToFile);
      clearResultsBtn.addEventListener('click', () => {
        hashResults.innerHTML = '<div class="no-results">请输入文本或选择文件并计算哈希值</div>';
      });
      
      compareBtn.addEventListener('click', compareHashes);
      
      verifyBtn.addEventListener('click', verifyFileHash);
      
      // 添加哈希验证事件
      hashResults.addEventListener('click', (e) => {
        if (e.target.closest('.verify-hash')) {
          const btn = e.target.closest('.verify-hash');
          const hash = btn.getAttribute('data-hash');
          
          // 切换到验证标签页
          tabButtons.forEach(btn => {
            if (btn.getAttribute('data-tab') === 'verify') {
              btn.click();
            }
          });
          
          // 填充哈希值
          verifyHashInput.value = hash;
        }
      });
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .hash-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 15px;
          overflow-x: auto;
        }
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
      
      // 加载CryptoJS库
      if (!window.CryptoJS) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
        document.head.appendChild(script);
        
        script.onload = () => {
          showToast('CryptoJS库加载成功', 'success');
        };
        
        script.onerror = () => {
          showToast('CryptoJS库加载失败，请检查网络连接', 'error');
        };
      }
    }
  };
  
  // 注册工具
  window.tools.hashCalculator = tool;
})();
