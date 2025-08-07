/**
 * 多宝工具箱 - 哈希计算器 - 比较和验证模块
 */

const utils = require('./utils');

const compare = {
  // 比较哈希值
  compareHashes: function(container) {
    const hash1Input = container.querySelector('#hash1-input');
    const hash2Input = container.querySelector('#hash2-input');
    const compareResult = container.querySelector('#compare-result');
    
    const hash1 = hash1Input.value.trim().toLowerCase();
    const hash2 = hash2Input.value.trim().toLowerCase();
    
    if (!hash1 || !hash2) {
      utils.showToast('请输入两个哈希值进行比较', 'warning');
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
          ${this.generateHashDiffView(cleanHash1, cleanHash2)}
        </div>
      `;
    }
  },
  
  // 生成哈希差异视图
  generateHashDiffView: function(hash1, hash2) {
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
  },
  
  // 验证文件哈希
  verifyFileHash: function(container) {
    const verifyFileInput = container.querySelector('#verify-file-input');
    const verifyHashInput = container.querySelector('#verify-hash-input');
    const verifyAlgorithm = container.querySelector('#verify-algorithm');
    const verifyResult = container.querySelector('#verify-result');
    
    const file = verifyFileInput.files[0];
    const expectedHash = verifyHashInput.value.trim().toLowerCase().replace(/\s+/g, '');
    const algorithm = verifyAlgorithm.value;
    
    if (!file) {
      utils.showToast('请选择文件', 'warning');
      return;
    }
    
    if (!expectedHash) {
      utils.showToast('请输入预期的哈希值', 'warning');
      return;
    }
    
    // 显示加载状态
    verifyResult.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i> 验证中，请稍候...</div>';
    
    // 检查文件大小，决定是否使用分块处理
    if (file.size > 10 * 1024 * 1024) { // 大于10MB
      this.verifyFileHashInChunks(container, file, algorithm, expectedHash);
    } else {
      this.verifyFileHashAtOnce(container, file, algorithm, expectedHash);
    }
  },
  
  // 一次性验证文件哈希
  verifyFileHashAtOnce: function(container, file, algorithm, expectedHash) {
    const verifyResult = container.querySelector('#verify-result');
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
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
          this.displayVerificationResult(verifyResult, actualHash, expectedHash);
        } catch (e) {
          verifyResult.innerHTML = `<div class="error">验证哈希值时出错: ${e.message}</div>`;
        }
      }, 100);
    };
    
    reader.onerror = function() {
      verifyResult.innerHTML = '<div class="error">读取文件时出错</div>';
    };
    
    reader.readAsArrayBuffer(file);
  },
  
  // 分块验证文件哈希
  verifyFileHashInChunks: function(container, file, algorithm, expectedHash) {
    const verifyResult = container.querySelector('#verify-result');
    
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
    const readNextChunk = () => {
      const start = currentChunk * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      
      const reader = new FileReader();
      reader.onload = (e) => {
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
          this.displayVerificationResult(verifyResult, actualHash, expectedHash);
        }
      };
      
      reader.onerror = function() {
        verifyResult.innerHTML = '<div class="error">读取文件块时出错</div>';
      };
      
      const blob = file.slice(start, end);
      reader.readAsArrayBuffer(blob);
    };
    
    // 开始读取第一个块
    readNextChunk();
  },
  
  // 显示验证结果
  displayVerificationResult: function(verifyResult, actualHash, expectedHash) {
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
};

module.exports = compare;