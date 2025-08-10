/**
 * Base64 文件编解码功能
 */

const fileEncoder = {
  /**
   * 初始化文件编解码功能
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
    this.fileInput = this.container.querySelector('#file-input');
    this.fileInfo = this.container.querySelector('#file-info');
    this.fileUrlsafe = this.container.querySelector('#file-urlsafe');
    this.fileKeepPad = this.container.querySelector('#file-keep-pad');
    this.includeDataUri = this.container.querySelector('#include-data-uri');
    this.encodeFileBtn = this.container.querySelector('#encode-file');
    this.copyFileResultBtn = this.container.querySelector('#copy-file-result');
    this.downloadFileResultBtn = this.container.querySelector('#download-file-result');
    this.fileResult = this.container.querySelector('#file-result');
    
    this.decodeInput = this.container.querySelector('#decode-input');
    this.autoDetectPrefix = this.container.querySelector('#auto-detect-prefix');
    this.outputFilename = this.container.querySelector('#output-filename');
    this.decodeToFileBtn = this.container.querySelector('#decode-to-file');
    this.previewFileBtn = this.container.querySelector('#preview-file');
    this.previewContainer = this.container.querySelector('#preview-container');
    
    this.fileUploadArea = this.container.querySelector('.file-upload-area');
    
    // 文件选择处理
    this.selectedFile = null;
  },
  
  /**
   * 设置事件处理
   */
  setupEvents: function() {
    // 文件上传区域拖放功能
    this.fileUploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.fileUploadArea.classList.add('dragover');
    });
    
    this.fileUploadArea.addEventListener('dragleave', () => {
      this.fileUploadArea.classList.remove('dragover');
    });
    
    this.fileUploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      this.fileUploadArea.classList.remove('dragover');
      
      if (e.dataTransfer.files.length > 0) {
        this.fileInput.files = e.dataTransfer.files;
        this.handleFileSelect();
      }
    });
    
    // 文件选择事件
    this.fileInput.addEventListener('change', () => this.handleFileSelect());
    
    // 编码文件按钮
    this.encodeFileBtn.addEventListener('click', () => this.encodeFile());
    
    // 复制文件编码结果
    this.copyFileResultBtn.addEventListener('click', () => this.copyFileResult());
    
    // 下载文件编码结果
    this.downloadFileResultBtn.addEventListener('click', () => this.downloadFileResult());
    
    // 解码为文件
    this.decodeToFileBtn.addEventListener('click', () => this.decodeToFile());
    
    // 预览文件
    this.previewFileBtn.addEventListener('click', () => this.previewFile());
  },
  
  /**
   * 处理文件选择
   */
  handleFileSelect: function() {
    if (this.fileInput.files.length === 0) {
      return;
    }
    
    this.selectedFile = this.fileInput.files[0];
    const size = window.base64Utils.formatFileSize(this.selectedFile.size);
    
    this.fileInfo.innerHTML = `
      <div><strong>文件名:</strong> ${this.selectedFile.name}</div>
      <div><strong>类型:</strong> ${this.selectedFile.type || '未知'}</div>
      <div><strong>大小:</strong> ${size}</div>
    `;
    
    // 重置结果
    this.fileResult.value = '';
    this.copyFileResultBtn.disabled = true;
    this.downloadFileResultBtn.disabled = true;
  },
  
  /**
   * 编码文件
   */
  encodeFile: function() {
    if (!this.selectedFile) {
      window.base64Utils.showToast('请先选择文件', 'warning');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        // 获取文件内容作为 ArrayBuffer
        const arrayBuffer = e.target.result;
        
        // 转换为 Uint8Array
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // 转换为字符串
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i]);
        }
        
        // 编码为 Base64
        let base64 = btoa(binaryString);
        
        // 应用选项
        if (this.fileUrlsafe.checked) {
          base64 = base64.replace(/\+/g, '-').replace(/\//g, '_');
        }
        
        if (!this.fileKeepPad.checked) {
          base64 = base64.replace(/=+$/, '');
        }
        
        // 添加 Data URI 前缀
        if (this.includeDataUri.checked) {
          const mimeType = this.selectedFile.type || 'application/octet-stream';
          base64 = `data:${mimeType};base64,${base64}`;
        }
        
        // 显示结果
        this.fileResult.value = base64;
        
        // 启用按钮
        this.copyFileResultBtn.disabled = false;
        this.downloadFileResultBtn.disabled = false;
        
        // 保存到历史记录
        const historyItem = {
          id: Date.now(),
          type: 'file_encode',
          input: this.selectedFile.name,
          output: base64.substring(0, 100) + (base64.length > 100 ? '...' : ''),
          options: {
            urlSafe: this.fileUrlsafe.checked,
            keepPad: this.fileKeepPad.checked,
            dataUri: this.includeDataUri.checked
          },
          timestamp: new Date().toISOString()
        };
        
        window.base64History.addItem(historyItem);
        
        window.base64Utils.showToast('文件编码完成', 'success');
      } catch (e) {
        console.error('文件编码错误:', e);
        window.base64Utils.showToast('文件编码失败: ' + e.message, 'error');
      }
    };
    
    reader.onerror = () => {
      window.base64Utils.showToast('读取文件失败', 'error');
    };
    
    reader.readAsArrayBuffer(this.selectedFile);
  },
  
  /**
   * 复制文件编码结果
   */
  copyFileResult: function() {
    const text = this.fileResult.value;
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
   * 下载文件编码结果
   */
  downloadFileResult: function() {
    const text = this.fileResult.value;
    if (!text) {
      window.base64Utils.showToast('没有可下载的内容', 'warning');
      return;
    }
    
    window.base64Utils.downloadTextAsFile(text, `${this.selectedFile.name}.base64.txt`)
      .then(() => {
        window.base64Utils.showToast('文件已下载', 'success');
      })
      .catch(err => {
        console.error('下载失败:', err);
        window.base64Utils.showToast('下载失败', 'error');
      });
  },
  
  /**
   * 解码为文件
   */
  decodeToFile: function() {
    const base64Input = this.decodeInput.value.trim();
    if (!base64Input) {
      window.base64Utils.showToast('请输入Base64编码', 'warning');
      return;
    }
    
    try {
      // 处理输入
      let base64 = base64Input;
      let mimeType = 'application/octet-stream';
      
      // 自动检测并移除Data URI前缀
      if (this.autoDetectPrefix.checked) {
        const dataUriMatch = base64.match(/^data:([^;]+);base64,(.+)$/);
        if (dataUriMatch) {
          mimeType = dataUriMatch[1];
          base64 = dataUriMatch[2];
        }
      }
      
      // 处理URL安全字符
      base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
      
      // 添加填充
      while (base64.length % 4) {
        base64 += '=';
      }
      
      // 解码Base64
      const binaryString = atob(base64);
      
      // 转换为Uint8Array
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // 创建Blob
      const blob = new Blob([bytes], { type: mimeType });
      
      // 获取文件名
      let filename = this.outputFilename.value.trim();
      if (!filename) {
        filename = 'decoded_file';
      }
      
      // 下载文件
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // 启用预览按钮
      this.previewFileBtn.disabled = false;
      
      // 保存到历史记录
      const historyItem = {
        id: Date.now(),
        type: 'file_decode',
        input: base64Input.substring(0, 100) + (base64Input.length > 100 ? '...' : ''),
        output: filename,
        timestamp: new Date().toISOString()
      };
      
      window.base64History.addItem(historyItem);
      
      window.base64Utils.showToast('文件解码完成', 'success');
    } catch (e) {
      console.error('解码错误:', e);
      window.base64Utils.showToast('解码失败: ' + e.message, 'error');
    }
  },
  
  /**
   * 预览文件
   */
  previewFile: function() {
    const base64Input = this.decodeInput.value.trim();
    if (!base64Input) {
      window.base64Utils.showToast('请输入Base64编码', 'warning');
      return;
    }
    
    try {
      // 处理输入
      let base64 = base64Input;
      let mimeType = 'application/octet-stream';
      
      // 自动检测并提取Data URI前缀
      const dataUriMatch = base64.match(/^data:([^;]+);base64,(.+)$/);
      if (dataUriMatch) {
        mimeType = dataUriMatch[1];
        base64 = dataUriMatch[2];
      }
      
      // 处理URL安全字符
      base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
      
      // 添加填充
      while (base64.length % 4) {
        base64 += '=';
      }
      
      // 根据MIME类型预览
      if (mimeType.startsWith('image/')) {
        // 图片预览
        this.previewContainer.innerHTML = `<img src="data:${mimeType};base64,${base64}" alt="预览图片">`;
      } else if (mimeType.startsWith('audio/')) {
        // 音频预览
        this.previewContainer.innerHTML = `<audio controls src="data:${mimeType};base64,${base64}"></audio>`;
      } else if (mimeType.startsWith('video/')) {
        // 视频预览
        this.previewContainer.innerHTML = `<video controls src="data:${mimeType};base64,${base64}"></video>`;
      } else if (mimeType === 'text/plain' || mimeType === 'text/html' || mimeType === 'application/json') {
        // 文本预览
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(bytes);
        
        this.previewContainer.innerHTML = `<pre class="preview-text">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
      } else {
        // 其他类型
        this.previewContainer.innerHTML = `<div>无法预览此类型的文件 (${mimeType})</div>`;
      }
    } catch (e) {
      console.error('预览错误:', e);
      this.previewContainer.innerHTML = `<div class="error">预览失败: ${e.message}</div>`;
    }
  },
  
  /**
   * 从历史记录加载
   * @param {Object} historyItem - 历史记录项
   */
  loadFromHistory: function(historyItem) {
    if (historyItem.type === 'file_encode') {
      // 暂时不支持从历史记录加载文件编码
      window.base64Utils.showToast('暂不支持从历史记录加载文件编码', 'info');
    } else if (historyItem.type === 'file_decode') {
      this.decodeInput.value = historyItem.input || '';
      this.outputFilename.value = historyItem.output || '';
    }
  }
};

// 导出文件编解码器
window.base64FileEncoder = fileEncoder;