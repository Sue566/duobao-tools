/**
 * 文本长度统计工具 - 文件处理功能
 */

window.textLengthFileHandler = {
  /**
   * 初始化文件处理功能
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
    this.processFileBtn = this.container.querySelector('#process-file-btn');
    this.fileDropArea = this.container.querySelector('.file-drop-area');
  },
  
  /**
   * 设置事件处理
   */
  setupEvents: function() {
    // 文件选择事件
    if (this.fileInput) {
      this.fileInput.addEventListener('change', () => this.handleFileSelect());
    }
    
    // 处理文件按钮
    if (this.processFileBtn) {
      this.processFileBtn.addEventListener('click', () => this.processFile());
    }
    
    // 文件拖放区域
    if (this.fileDropArea) {
      this.setupDropArea();
    }
  },
  
  /**
   * 设置文件拖放区域
   */
  setupDropArea: function() {
    // 阻止默认拖放行为
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      this.fileDropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
    
    // 添加拖放效果
    ['dragenter', 'dragover'].forEach(eventName => {
      this.fileDropArea.addEventListener(eventName, () => {
        this.fileDropArea.classList.add('highlight');
      });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      this.fileDropArea.addEventListener(eventName, () => {
        this.fileDropArea.classList.remove('highlight');
      });
    });
    
    // 处理文件放置
    this.fileDropArea.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      
      if (files.length > 0) {
        this.fileInput.files = files;
        this.handleFileSelect();
      }
    });
  },
  
  /**
   * 处理文件选择
   */
  handleFileSelect: function() {
    if (!this.fileInput.files.length) {
      return;
    }
    
    const file = this.fileInput.files[0];
    
    // 显示文件信息
    if (this.fileInfo) {
      this.fileInfo.innerHTML = `
        <div class="file-info-item">
          <span class="file-info-label">文件名:</span>
          <span class="file-info-value">${file.name}</span>
        </div>
        <div class="file-info-item">
          <span class="file-info-label">类型:</span>
          <span class="file-info-value">${file.type || '未知'}</span>
        </div>
        <div class="file-info-item">
          <span class="file-info-label">大小:</span>
          <span class="file-info-value">${this.formatFileSize(file.size)}</span>
        </div>
      `;
    }
    
    // 启用处理按钮
    if (this.processFileBtn) {
      this.processFileBtn.disabled = false;
    }
  },
  
  /**
   * 处理文件
   */
  processFile: function() {
    if (!this.fileInput.files.length) {
      window.textLengthUtils.showToast('请先选择文件', 'warning');
      return;
    }
    
    const file = this.fileInput.files[0];
    const fileType = file.type;
    
    // 检查文件类型
    if (!this.isSupportedFileType(fileType)) {
      window.textLengthUtils.showToast('不支持的文件类型', 'error');
      return;
    }
    
    // 显示加载状态
    window.textLengthUtils.showToast('正在处理文件...', 'info');
    
    // 根据文件类型选择不同的处理方法
    if (fileType === 'text/plain') {
      this.readTextFile(file);
    } else if (fileType === 'application/json') {
      this.readJsonFile(file);
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel') || file.name.endsWith('.csv')) {
      this.readCsvFile(file);
    } else if (fileType.includes('word') || fileType.includes('document')) {
      this.readDocFile(file);
    } else {
      // 尝试作为文本文件读取
      this.readTextFile(file);
    }
  },
  
  /**
   * 读取文本文件
   * @param {File} file - 文件对象
   */
  readTextFile: function(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target.result;
      
      // 将文本设置到输入框
      const textInput = this.container.querySelector('#text-input');
      if (textInput) {
        textInput.value = text;
        
        // 触发输入事件，更新统计
        const inputEvent = new Event('input', { bubbles: true });
        textInput.dispatchEvent(inputEvent);
        
        // 切换到文本标签页
        const textTabBtn = this.container.querySelector('.tab-btn[data-tab="text"]');
        if (textTabBtn) {
          textTabBtn.click();
        }
        
        window.textLengthUtils.showToast('文件已加载', 'success');
      }
    };
    
    reader.onerror = () => {
      window.textLengthUtils.showToast('读取文件失败', 'error');
    };
    
    reader.readAsText(file);
  },
  
  /**
   * 读取JSON文件
   * @param {File} file - 文件对象
   */
  readJsonFile: function(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const json = JSON.parse(text);
        
        // 将JSON转换为格式化的文本
        const formattedText = JSON.stringify(json, null, 2);
        
        // 将文本设置到输入框
        const textInput = this.container.querySelector('#text-input');
        if (textInput) {
          textInput.value = formattedText;
          
          // 触发输入事件，更新统计
          const inputEvent = new Event('input', { bubbles: true });
          textInput.dispatchEvent(inputEvent);
          
          // 切换到文本标签页
          const textTabBtn = this.container.querySelector('.tab-btn[data-tab="text"]');
          if (textTabBtn) {
            textTabBtn.click();
          }
          
          window.textLengthUtils.showToast('JSON文件已加载', 'success');
        }
      } catch (error) {
        window.textLengthUtils.showToast('解析JSON文件失败: ' + error.message, 'error');
      }
    };
    
    reader.onerror = () => {
      window.textLengthUtils.showToast('读取文件失败', 'error');
    };
    
    reader.readAsText(file);
  },
  
  /**
   * 读取CSV文件
   * @param {File} file - 文件对象
   */
  readCsvFile: function(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target.result;
      
      // 将文本设置到输入框
      const textInput = this.container.querySelector('#text-input');
      if (textInput) {
        textInput.value = text;
        
        // 触发输入事件，更新统计
        const inputEvent = new Event('input', { bubbles: true });
        textInput.dispatchEvent(inputEvent);
        
        // 切换到文本标签页
        const textTabBtn = this.container.querySelector('.tab-btn[data-tab="text"]');
        if (textTabBtn) {
          textTabBtn.click();
        }
        
        window.textLengthUtils.showToast('CSV文件已加载', 'success');
      }
    };
    
    reader.onerror = () => {
      window.textLengthUtils.showToast('读取文件失败', 'error');
    };
    
    reader.readAsText(file);
  },
  
  /**
   * 读取DOC文件（简单实现，实际上浏览器无法直接读取DOC文件内容）
   * @param {File} file - 文件对象
   */
  readDocFile: function(file) {
    window.textLengthUtils.showToast('暂不支持直接读取Word文档内容，请复制文本后粘贴', 'warning');
  },
  
  /**
   * 检查是否为支持的文件类型
   * @param {string} fileType - 文件MIME类型
   * @returns {boolean} 是否支持
   */
  isSupportedFileType: function(fileType) {
    const supportedTypes = [
      'text/plain',
      'text/html',
      'text/css',
      'text/javascript',
      'text/csv',
      'application/json',
      'application/xml',
      'application/javascript',
      'application/x-javascript'
    ];
    
    // 检查文件类型是否在支持列表中
    if (supportedTypes.includes(fileType)) {
      return true;
    }
    
    // 检查文件类型是否包含某些关键字
    const supportedKeywords = [
      'text',
      'json',
      'xml',
      'csv',
      'spreadsheet',
      'excel'
    ];
    
    for (const keyword of supportedKeywords) {
      if (fileType.includes(keyword)) {
        return true;
      }
    }
    
    return false;
  },
  
  /**
   * 格式化文件大小
   * @param {number} bytes - 文件大小（字节）
   * @returns {string} 格式化后的大小
   */
  formatFileSize: function(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  /**
   * 从历史记录加载
   * @param {object} item - 历史记录项
   */
  loadFromHistory: function(item) {
    if (!item || !item.fileData) return;
    
    // 将文本设置到输入框
    const textInput = this.container.querySelector('#text-input');
    if (textInput) {
      textInput.value = item.fileData;
      
      // 触发输入事件，更新统计
      const inputEvent = new Event('input', { bubbles: true });
      textInput.dispatchEvent(inputEvent);
      
      window.textLengthUtils.showToast('已加载历史文件数据', 'success');
    }
  }
};