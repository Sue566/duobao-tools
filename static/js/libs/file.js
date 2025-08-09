/**
 * 多宝工具库 - 文件处理工具
 */

window.DuobaoFile = {
  // 读取文件内容
  readAsText: function(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(e);
      reader.readAsText(file);
    });
  },
  
  // 读取文件为DataURL
  readAsDataURL: function(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(e);
      reader.readAsDataURL(file);
    });
  },
  
  // 读取文件为ArrayBuffer
  readAsArrayBuffer: function(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => reject(e);
      reader.readAsArrayBuffer(file);
    });
  },
  
  // 保存文本为文件
  saveAsFile: function(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  
  // 获取文件扩展名
  getExtension: function(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  },
  
  // 获取文件名（不含扩展名）
  getBasename: function(filename) {
    return filename.split('.').slice(0, -1).join('.');
  },
  
  // 检查文件类型
  checkFileType: function(file, allowedTypes) {
    if (!file || !allowedTypes) return false;
    
    // 如果allowedTypes是字符串，转换为数组
    if (typeof allowedTypes === 'string') {
      allowedTypes = [allowedTypes];
    }
    
    const fileType = file.type;
    const extension = this.getExtension(file.name).toLowerCase();
    
    // 检查MIME类型
    for (const type of allowedTypes) {
      // 检查完整MIME类型
      if (fileType === type) return true;
      
      // 检查MIME类型前缀
      if (type.endsWith('/*') && fileType.startsWith(type.slice(0, -2))) return true;
      
      // 检查文件扩展名
      if (type.startsWith('.') && extension === type.slice(1)) return true;
    }
    
    return false;
  },
  
  // 检查文件大小
  checkFileSize: function(file, maxSize) {
    return file.size <= maxSize;
  },
  
  // 格式化文件大小
  formatFileSize: function(bytes) {
    return DuobaoUtils.formatFileSize(bytes);
  },
  
  // 创建文件选择器
  createFilePicker: function(options = {}) {
    const {
      multiple = false,
      accept = '*/*',
      onSelect = null
    } = options;
    
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = multiple;
      input.accept = accept;
      input.style.display = 'none';
      
      input.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        
        if (onSelect) {
          onSelect(files);
        }
        
        resolve(files);
        
        // 清理DOM
        document.body.removeChild(input);
      });
      
      document.body.appendChild(input);
      input.click();
    });
  },
  
  // 拖放文件处理
  setupFileDrop: function(element, options = {}) {
    const {
      onDragEnter = null,
      onDragOver = null,
      onDragLeave = null,
      onDrop = null,
      acceptTypes = null
    } = options;
    
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    
    if (!element) return;
    
    const preventDefault = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    element.addEventListener('dragenter', (e) => {
      preventDefault(e);
      if (onDragEnter) onDragEnter(e);
    });
    
    element.addEventListener('dragover', (e) => {
      preventDefault(e);
      if (onDragOver) onDragOver(e);
    });
    
    element.addEventListener('dragleave', (e) => {
      preventDefault(e);
      if (onDragLeave) onDragLeave(e);
    });
    
    element.addEventListener('drop', (e) => {
      preventDefault(e);
      
      const files = Array.from(e.dataTransfer.files);
      
      // 过滤文件类型
      const filteredFiles = acceptTypes
        ? files.filter(file => this.checkFileType(file, acceptTypes))
        : files;
      
      if (onDrop) onDrop(filteredFiles, e);
    });
    
    return {
      destroy: () => {
        element.removeEventListener('dragenter', preventDefault);
        element.removeEventListener('dragover', preventDefault);
        element.removeEventListener('dragleave', preventDefault);
        element.removeEventListener('drop', preventDefault);
      }
    };
  },
  
  // 文件上传
  upload: function(url, file, options = {}) {
    const {
      method = 'POST',
      fieldName = 'file',
      headers = {},
      onProgress = null,
      withCredentials = false,
      extraData = null
    } = options;
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      
      // 添加文件
      formData.append(fieldName, file);
      
      // 添加额外数据
      if (extraData) {
        Object.entries(extraData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }
      
      // 进度事件
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete, e);
          }
        });
      }
      
      // 完成事件
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });
      
      // 错误事件
      xhr.addEventListener('error', () => {
        reject(new Error('Network error occurred during upload'));
      });
      
      // 超时事件
      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timed out'));
      });
      
      // 打开请求
      xhr.open(method, url, true);
      
      // 设置请求头
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
      
      // 设置凭证
      xhr.withCredentials = withCredentials;
      
      // 发送请求
      xhr.send(formData);
    });
  },
  
  // 批量上传文件
  uploadMultiple: function(url, files, options = {}) {
    const {
      concurrency = 3,
      ...uploadOptions
    } = options;
    
    const queue = [...files];
    const results = [];
    let activeUploads = 0;
    let completed = 0;
    
    return new Promise((resolve, reject) => {
      const processQueue = () => {
        if (queue.length === 0 && activeUploads === 0) {
          resolve(results);
          return;
        }
        
        while (queue.length > 0 && activeUploads < concurrency) {
          const file = queue.shift();
          activeUploads++;
          
          this.upload(url, file, uploadOptions)
            .then(result => {
              results.push({ file, result, success: true });
            })
            .catch(error => {
              results.push({ file, error, success: false });
            })
            .finally(() => {
              activeUploads--;
              completed++;
              
              if (options.onProgress) {
                options.onProgress(completed / files.length * 100);
              }
              
              processQueue();
            });
        }
      };
      
      processQueue();
    });
  },
  
  // 下载文件
  download: function(url, filename) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      
      xhr.onload = function() {
        if (xhr.status === 200) {
          const blob = xhr.response;
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = filename || url.split('/').pop();
          link.click();
          window.URL.revokeObjectURL(link.href);
          resolve();
        } else {
          reject(new Error(`Download failed with status ${xhr.status}`));
        }
      };
      
      xhr.onerror = function() {
        reject(new Error('Network error occurred during download'));
      };
      
      xhr.send();
    });
  }
};