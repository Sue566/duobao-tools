/**
 * Base64 批量处理功能
 */

const batchProcessor = {
  /**
   * 初始化批量处理功能
   * @param {HTMLElement} container - 容器元素
   */
  init: function(container) {
    this.container = container;
    this.setupReferences();
    this.setupEvents();
  },
  
  /**
   * 设置DOM引用
   */
  setupReferences: function() {
    this.batchInput = this.container.querySelector('#batch-input');
    this.batchOutput = this.container.querySelector('#batch-output');
    this.batchProcess = this.container.querySelector('#batch-process');
    this.batchClearInput = this.container.querySelector('#batch-clear-input');
    this.batchCopy = this.container.querySelector('#batch-copy');
    this.batchDownload = this.container.querySelector('#batch-download');
    this.batchClearAll = this.container.querySelector('#batch-clear-all');
    this.batchModeEncode = this.container.querySelector('input[name="batch-mode"][value="encode"]');
    this.batchModeDecode = this.container.querySelector('input[name="batch-mode"][value="decode"]');
    this.batchUrlsafe = this.container.querySelector('#batch-urlsafe');
    this.batchKeepPad = this.container.querySelector('#batch-keep-pad');
  },
  
  /**
   * 设置事件处理
   */
  setupEvents: function() {
    // 批量处理按钮
    this.batchProcess.addEventListener('click', () => this.process());
    
    // 清空输入按钮
    this.batchClearInput.addEventListener('click', () => {
      this.batchInput.value = '';
    });
    
    // 复制结果按钮
    this.batchCopy.addEventListener('click', () => this.copyResult());
    
    // 下载结果按钮
    this.batchDownload.addEventListener('click', () => this.downloadResult());
    
    // 清空全部按钮
    this.batchClearAll.addEventListener('click', () => {
      this.batchInput.value = '';
      this.batchOutput.value = '';
    });
  },
  
  /**
   * 批量处理
   */
  process: function() {
    const input = this.batchInput.value.trim();
    if (!input) {
      window.base64Utils.showToast('请输入要处理的内容', 'warning');
      return;
    }
    
    const lines = input.split('\n');
    const results = [];
    const isEncode = this.batchModeEncode.checked;
    const urlSafe = this.batchUrlsafe.checked;
    const keepPad = this.batchKeepPad.checked;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        results.push('');
        continue;
      }
      
      try {
        if (isEncode) {
          // 编码
          const encoder = new TextEncoder();
          const data = encoder.encode(trimmed);
          
          let b64 = btoa(String.fromCharCode.apply(null, data));
          
          if (urlSafe) {
            b64 = b64.replace(/\+/g, '-').replace(/\//g, '_');
          }
          
          if (!keepPad) {
            b64 = b64.replace(/=+$/, '');
          }
          
          results.push(b64);
        } else {
          // 解码
          let b64 = trimmed;
          
          b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
          
          while (b64.length % 4) {
            b64 += '=';
          }
          
          const binary = atob(b64);
          const bytes = new Uint8Array(binary.length);
          
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          
          const decoder = new TextDecoder('utf-8');
          const text = decoder.decode(bytes);
          
          results.push(text);
        }
      } catch (e) {
        results.push(`[错误] ${trimmed}: ${e.message}`);
      }
    }
    
    this.batchOutput.value = results.join('\n');
    
    // 保存到历史记录
    const historyItem = {
      id: Date.now(),
      type: 'batch',
      input: input.length > 100 ? input.substring(0, 100) + '...' : input,
      output: results.join('\n').length > 100 ? results.join('\n').substring(0, 100) + '...' : results.join('\n'),
      options: {
        mode: isEncode ? 'encode' : 'decode',
        urlSafe,
        keepPad
      },
      timestamp: new Date().toISOString()
    };
    
    window.base64History.addItem(historyItem);
    
    window.base64Utils.showToast('批量处理完成', 'success');
  },
  
  /**
   * 复制结果
   */
  copyResult: function() {
    const text = this.batchOutput.value;
    if (!text) {
      window.base64Utils.showToast('没有可复制的内容', 'warning');
      return;
    }
    
    window.base64Utils.copyToClipboard(text)
      .then(() => {
        window.base64Utils.showToast('已复制到剪贴板', 'success');
      })
      .catch(err => {
        console.error('复制失败:', err);
        window.base64Utils.showToast('复制失败', 'error');
      });
  },
  
  /**
   * 下载结果
   */
  downloadResult: function() {
    const text = this.batchOutput.value;
    if (!text) {
      window.base64Utils.showToast('没有可下载的内容', 'warning');
      return;
    }
    
    const filename = `base64_batch_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.txt`;
    
    window.base64Utils.downloadTextAsFile(text, filename)
      .then(() => {
        window.base64Utils.showToast('文件已下载', 'success');
      })
      .catch(err => {
        console.error('下载失败:', err);
        window.base64Utils.showToast('下载失败', 'error');
      });
  },
  
  /**
   * 从历史记录加载
   * @param {Object} historyItem - 历史记录项
   */
  loadFromHistory: function(historyItem) {
    if (historyItem.type !== 'batch') return;
    
    this.batchInput.value = historyItem.input || '';
    
    if (historyItem.options) {
      if (historyItem.options.mode === 'encode') {
        this.batchModeEncode.checked = true;
      } else {
        this.batchModeDecode.checked = true;
      }
      
      this.batchUrlsafe.checked = !!historyItem.options.urlSafe;
      this.batchKeepPad.checked = !!historyItem.options.keepPad;
    }
  }
};

// 导出批量处理器
window.base64BatchProcessor = batchProcessor;