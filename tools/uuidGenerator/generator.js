/**
 * UUID生成器 - 生成功能
 */

window.uuidGeneratorCore = {
  /**
   * 初始化生成功能
   * @param {HTMLElement} container - 容器元素
   */
  init: function(container) {
    this.container = container;
    this.utils = window.uuidGeneratorUtils;
    
    this.setupReferences();
    this.setupEvents();
  },
  
  /**
   * 设置DOM引用
   */
  setupReferences: function() {
    this.uuidVersion = this.container.querySelector('#uuid-version');
    this.versionDescription = this.container.querySelector('#version-description');
    this.uuidCount = this.container.querySelector('#uuid-count');
    this.uppercase = this.container.querySelector('#uppercase');
    this.noHyphens = this.container.querySelector('#no-hyphens');
    this.braces = this.container.querySelector('#braces');
    this.generateBtn = this.container.querySelector('#generate-btn');
    this.copyAllBtn = this.container.querySelector('#copy-all-btn');
    this.clearBtn = this.container.querySelector('#clear-btn');
    this.downloadBtn = this.container.querySelector('#download-btn');
    this.uuidResults = this.container.querySelector('#uuid-results');
  },
  
  /**
   * 设置事件处理
   */
  setupEvents: function() {
    // 版本描述更新
    if (this.uuidVersion) {
      this.uuidVersion.addEventListener('change', () => {
        if (this.uuidVersion.value === '1') {
          this.versionDescription.textContent = '版本 1 UUID 基于时间戳和MAC地址生成，可按时间排序。';
        } else {
          this.versionDescription.textContent = '版本 4 UUID 使用随机数生成，适用于大多数场景。';
        }
      });
    }
    
    // 生成UUID按钮
    if (this.generateBtn) {
      this.generateBtn.addEventListener('click', () => this.generateUUIDs());
    }
    
    // 复制所有按钮
    if (this.copyAllBtn) {
      this.copyAllBtn.addEventListener('click', () => this.copyAllUUIDs());
    }
    
    // 清空按钮
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => this.clearResults());
    }
    
    // 下载按钮
    if (this.downloadBtn) {
      this.downloadBtn.addEventListener('click', () => this.downloadUUIDs());
    }
  },
  
  /**
   * 生成UUID
   */
  generateUUIDs: function() {
    const version = this.uuidVersion.value;
    const count = parseInt(this.uuidCount.value);
    
    if (isNaN(count) || count < 1 || count > 100) {
      this.utils.showToast('请输入1-100之间的数量', 'warning');
      return;
    }
    
    const isUppercase = this.uppercase.checked;
    const removeHyphens = this.noHyphens.checked;
    const addBraces = this.braces.checked;
    
    const uuids = [];
    for (let i = 0; i < count; i++) {
      let uuid = '';
      
      if (version === '1') {
        uuid = this.generateUUIDv1();
      } else {
        uuid = this.generateUUIDv4();
      }
      
      // 应用格式选项
      if (isUppercase) {
        uuid = uuid.toUpperCase();
      }
      
      if (removeHyphens) {
        uuid = uuid.replace(/-/g, '');
      }
      
      if (addBraces) {
        uuid = `{${uuid}}`;
      }
      
      uuids.push(uuid);
    }
    
    this.displayResults(uuids);
  },
  
  /**
   * 生成版本4 UUID (随机)
   * @returns {string} 生成的UUID
   */
  generateUUIDv4: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  
  /**
   * 生成版本1 UUID (基于时间)
   * @returns {string} 生成的UUID
   */
  generateUUIDv1: function() {
    // 简化的版本1 UUID实现
    // 实际的版本1 UUID应该使用MAC地址和精确的时间戳
    const now = new Date();
    const timestamp = now.getTime();
    const clockSeq = Math.floor(Math.random() * 0x3fff);
    
    // 模拟节点ID (在真实实现中应该使用MAC地址)
    const nodeId = [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    ];
    
    // 构建UUID
    const timeLow = ((timestamp & 0xffffffff) >>> 0).toString(16).padStart(8, '0');
    const timeMid = ((timestamp >> 32 & 0xffff) >>> 0).toString(16).padStart(4, '0');
    const timeHighAndVersion = ((timestamp >> 48 & 0x0fff) >>> 0 | 0x1000).toString(16).padStart(4, '0');
    const clockSeqHiAndReserved = ((clockSeq & 0x3f00) >>> 8 | 0x80).toString(16).padStart(2, '0');
    const clockSeqLow = (clockSeq & 0xff).toString(16).padStart(2, '0');
    const node = nodeId.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return `${timeLow}-${timeMid}-${timeHighAndVersion}-${clockSeqHiAndReserved}${clockSeqLow}-${node}`;
  },
  
  /**
   * 显示结果
   * @param {Array<string>} uuids - UUID数组
   */
  displayResults: function(uuids) {
    if (uuids.length === 0) {
      this.uuidResults.innerHTML = '<div class="no-results">没有生成结果</div>';
      return;
    }
    
    let html = '';
    
    uuids.forEach((uuid, index) => {
      html += `
        <div class="uuid-item">
          <div class="uuid-number">${index + 1}</div>
          <div class="uuid-value">${uuid}</div>
          <button class="btn btn-icon btn-sm copy-btn" data-uuid="${uuid}" title="复制"><i class="fa fa-copy"></i></button>
        </div>
      `;
    });
    
    this.uuidResults.innerHTML = html;
    
    // 添加复制按钮事件
    this.uuidResults.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const uuid = btn.getAttribute('data-uuid');
        this.utils.copyToClipboard(uuid);
      });
    });
  },
  
  /**
   * 复制所有UUID
   */
  copyAllUUIDs: function() {
    const uuidItems = this.uuidResults.querySelectorAll('.uuid-value');
    if (uuidItems.length === 0) {
      this.utils.showToast('没有可复制的UUID', 'warning');
      return;
    }
    
    const text = Array.from(uuidItems).map(item => item.textContent).join('\n');
    this.utils.copyToClipboard(text);
  },
  
  /**
   * 清空结果
   */
  clearResults: function() {
    this.uuidResults.innerHTML = '<div class="no-results">点击"生成UUID"按钮开始</div>';
  },
  
  /**
   * 下载UUID
   */
  downloadUUIDs: function() {
    const uuidItems = this.uuidResults.querySelectorAll('.uuid-value');
    if (uuidItems.length === 0) {
      this.utils.showToast('没有可下载的UUID', 'warning');
      return;
    }
    
    const text = Array.from(uuidItems).map(item => item.textContent).join('\n');
    const filename = `uuid_${new Date().toISOString().slice(0, 10)}.txt`;
    this.utils.downloadTextFile(text, filename);
  }
};