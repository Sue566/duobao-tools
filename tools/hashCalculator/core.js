/**
 * 多宝工具箱 - 哈希计算器 - 核心模块
 */
(function() {
  const core = {
    // 计算文本哈希
    calculateTextHash: function(container) {
      const textInput = container.querySelector('#text-input');
      const hashResults = container.querySelector('#hash-results');
      
      const text = textInput.value;
      if (!text) {
        window.hashCalculator.utils.showToast('请输入文本', 'warning');
        return;
      }
      
      // 获取选中的编码
      const encoding = container.querySelector('input[name="text-encoding"]:checked').value;
      
      // 获取选中的算法
      const algorithms = window.hashCalculator.utils.getSelectedAlgorithms(container);
      if (algorithms.length === 0) {
        window.hashCalculator.utils.showToast('请至少选择一种哈希算法', 'warning');
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
              case 'blake2b':
                if (CryptoJS.BLAKE2b) {
                  results.blake2b = CryptoJS.BLAKE2b(text).toString();
                } else {
                  results.blake2b = '不支持 BLAKE2b 算法';
                }
                break;
              case 'keccak':
                if (CryptoJS.Keccak) {
                  results.keccak = CryptoJS.Keccak(text).toString();
                } else {
                  results.keccak = '不支持 Keccak 算法';
                }
                break;
            }
          });
          
          // 显示结果
          window.hashCalculator.utils.displayResults(container, results);
        } catch (e) {
          hashResults.innerHTML = `<div class="error">计算哈希值时出错: ${e.message}</div>`;
        }
      }, 100);
    },
    
    // 计算文件哈希
    calculateFileHash: function(container) {
      const fileInput = container.querySelector('#file-input');
      const chunkProcessing = container.querySelector('#chunk-processing');
      const hashResults = container.querySelector('#hash-results');
      
      const file = fileInput.files[0];
      if (!file) {
        window.hashCalculator.utils.showToast('请选择文件', 'warning');
        return;
      }
      
      // 获取选中的算法
      const algorithms = window.hashCalculator.utils.getSelectedAlgorithms(container);
      if (algorithms.length === 0) {
        window.hashCalculator.utils.showToast('请至少选择一种哈希算法', 'warning');
        return;
      }
      
      // 显示加载状态
      hashResults.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i> 计算中，请稍候...</div>';
      
      // 检查是否使用分块处理
      if (chunkProcessing.checked && file.size > 1024 * 1024) { // 大于1MB才使用分块
        this.calculateFileHashInChunks(container, file, algorithms);
      } else {
        this.calculateFileHashAtOnce(container, file, algorithms);
      }
    },
    
    // 一次性计算文件哈希
    calculateFileHashAtOnce: function(container, file, algorithms) {
      const hashResults = container.querySelector('#hash-results');
      
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
            window.hashCalculator.utils.displayResults(container, results);
            
            // 保存到历史记录
            window.hashCalculator.utils.saveToHistory(file.name, results);
          } catch (e) {
            hashResults.innerHTML = `<div class="error">计算哈希值时出错: ${e.message}</div>`;
          }
        }, 100);
      };
      
      reader.onerror = function() {
        hashResults.innerHTML = '<div class="error">读取文件时出错</div>';
      };
      
      reader.readAsArrayBuffer(file);
    },
    
    // 分块计算文件哈希
    calculateFileHashInChunks: function(container, file, algorithms) {
      const hashResults = container.querySelector('#hash-results');
      const progressContainer = container.querySelector('#progress-container');
      const progressBar = container.querySelector('#progress-bar');
      
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
      const readNextChunk = () => {
        const start = currentChunk * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        
        const reader = new FileReader();
        reader.onload = (e) => {
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
            window.hashCalculator.utils.displayResults(container, results);
            
            // 保存到历史记录
            window.hashCalculator.utils.saveToHistory(file.name, results);
          }
        };
        
        reader.onerror = function() {
          hashResults.innerHTML = '<div class="error">读取文件块时出错</div>';
          progressContainer.style.display = 'none';
        };
        
        const blob = file.slice(start, end);
        reader.readAsArrayBuffer(blob);
      };
      
      // 开始读取第一个块
      readNextChunk();
    }
  };

  // 导出核心模块
  window.hashCalculator = window.hashCalculator || {};
  window.hashCalculator.core = core;
})();
