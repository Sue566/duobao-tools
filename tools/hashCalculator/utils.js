/**
 * 多宝工具箱 - 哈希计算器 - 工具类模块
 */

const utils = {
  // 显示提示消息
  showToast: function(message, type = 'info') {
    if (window.showToast) {
      window.showToast(message, type);
    } else {
      alert(message);
    }
  },
  
  // 复制到剪贴板
  copyToClipboard: function(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = 0;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (successful) {
        this.showToast('已复制到剪贴板', 'success');
      } else {
        this.showToast('复制失败', 'error');
      }
    } catch (err) {
      document.body.removeChild(textarea);
      this.showToast('复制失败: ' + err, 'error');
    }
  },
  
  // 格式化文件大小
  formatFileSize: function(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  // 获取选中的算法
  getSelectedAlgorithms: function(container) {
    const algorithms = [];
    
    const algoMd5 = container.querySelector('#algo-md5');
    const algoSha1 = container.querySelector('#algo-sha1');
    const algoSha256 = container.querySelector('#algo-sha256');
    const algoSha512 = container.querySelector('#algo-sha512');
    const algoSha3 = container.querySelector('#algo-sha3');
    const algoRipemd160 = container.querySelector('#algo-ripemd160');
    const algoBlake2b = container.querySelector('#algo-blake2b');
    const algoKeccak = container.querySelector('#algo-keccak');
    
    if (algoMd5.checked) algorithms.push('md5');
    if (algoSha1.checked) algorithms.push('sha1');
    if (algoSha256.checked) algorithms.push('sha256');
    if (algoSha512.checked) algorithms.push('sha512');
    if (algoSha3.checked) algorithms.push('sha3');
    if (algoRipemd160.checked) algorithms.push('ripemd160');
    if (algoBlake2b && algoBlake2b.checked) algorithms.push('blake2b');
    if (algoKeccak && algoKeccak.checked) algorithms.push('keccak');
    
    return algorithms;
  },
  
  // 创建结果项
  createResultItem: function(algorithm, hash) {
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
  },
  
  // 显示结果
  displayResults: function(container, results) {
    const hashResults = container.querySelector('#hash-results');
    
    if (Object.keys(results).length === 0) {
      hashResults.innerHTML = '<div class="no-results">没有计算结果</div>';
      return;
    }
    
    let html = '';
    
    if (results.md5) {
      html += this.createResultItem('MD5', results.md5);
    }
    
    if (results.sha1) {
      html += this.createResultItem('SHA-1', results.sha1);
    }
    
    if (results.sha256) {
      html += this.createResultItem('SHA-256', results.sha256);
    }
    
    if (results.sha512) {
      html += this.createResultItem('SHA-512', results.sha512);
    }
    
    if (results.sha3) {
      html += this.createResultItem('SHA-3', results.sha3);
    }
    
    if (results.ripemd160) {
      html += this.createResultItem('RIPEMD-160', results.ripemd160);
    }
    
    if (results.blake2b) {
      html += this.createResultItem('BLAKE2b', results.blake2b);
    }
    
    if (results.keccak) {
      html += this.createResultItem('Keccak', results.keccak);
    }
    
    hashResults.innerHTML = html;
    
    // 添加复制按钮事件
    hashResults.querySelectorAll('.copy-hash').forEach(btn => {
      btn.addEventListener('click', () => {
        const hash = btn.getAttribute('data-hash');
        this.copyToClipboard(hash);
      });
    });
  },
  
  // 保存到历史记录
  saveToHistory: function(name, results) {
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
  },
  
  // 保存结果到文件
  saveResultsToFile: function(container) {
    const hashResults = container.querySelector('#hash-results');
    const resultItems = hashResults.querySelectorAll('.hash-result-item');
    const fileInput = container.querySelector('#file-input');
    
    if (resultItems.length === 0) {
      this.showToast('没有可保存的哈希值', 'warning');
      return;
    }
    
    let content = '';
    
    // 添加文件信息
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      content += `文件名: ${file.name}\n`;
      content += `文件大小: ${this.formatFileSize(file.size)}\n`;
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
    
    this.showToast('哈希结果已保存到文件', 'success');
  }
};

module.exports = utils;