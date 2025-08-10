/**
 * Base64 文本编解码功能
 */

const textEncoder = {
  /**
   * 初始化文本编解码功能
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
    this.refs = {
      urlsafe: this.container.querySelector('#b64-urlsafe'),
      keepPad: this.container.querySelector('#b64-keep-pad'),
      autoUpdate: this.container.querySelector('#b64-auto-update'),
      wrapLines: this.container.querySelector('#b64-wrap-lines'),
      
      text: {
        panel: this.container.querySelector('.b64-panel[data-type="text"]'),
        input: this.container.querySelector('.b64-panel[data-type="text"] .panel-input'),
        btnCopy: this.container.querySelector('.b64-panel[data-type="text"] .btn-copy'),
        btnClear: this.container.querySelector('.b64-panel[data-type="text"] .btn-clear'),
        charCount: this.container.querySelector('.b64-panel[data-type="text"] .char-count')
      },
      
      b64: {
        panel: this.container.querySelector('.b64-panel[data-type="b64"]'),
        input: this.container.querySelector('.b64-panel[data-type="b64"] .panel-input'),
        btnCopy: this.container.querySelector('.b64-panel[data-type="b64"] .btn-copy'),
        btnClear: this.container.querySelector('.b64-panel[data-type="b64"] .btn-clear'),
        charCount: this.container.querySelector('.b64-panel[data-type="b64"] .char-count')
      },
      
      encode: this.container.querySelector('#b64-encode'),
      decode: this.container.querySelector('#b64-decode'),
      swap: this.container.querySelector('#b64-swap'),
      clear: this.container.querySelector('#b64-clear'),
      save: this.container.querySelector('#b64-save')
    };
  },
  
  /**
   * 设置事件处理
   */
  setupEvents: function() {
    // 编码按钮
    this.refs.encode.addEventListener('click', () => this.encode());
    
    // 解码按钮
    this.refs.decode.addEventListener('click', () => this.decode());
    
    // 互换按钮
    this.refs.swap.addEventListener('click', () => this.swap());
    
    // 清空按钮
    this.refs.clear.addEventListener('click', () => this.clearAll());
    
    // 保存按钮
    this.refs.save.addEventListener('click', () => this.saveToHistory());
    
    // 复制按钮
    this.refs.text.btnCopy.addEventListener('click', () => {
      window.base64Utils.copyToClipboard(this.refs.text.input.value)
        .then(() => window.base64Utils.showToast('已复制到剪贴板', 'success'))
        .catch(err => window.base64Utils.showToast('复制失败: ' + err.message, 'error'));
    });
    
    this.refs.b64.btnCopy.addEventListener('click', () => {
      window.base64Utils.copyToClipboard(this.refs.b64.input.value)
        .then(() => window.base64Utils.showToast('已复制到剪贴板', 'success'))
        .catch(err => window.base64Utils.showToast('复制失败: ' + err.message, 'error'));
    });
    
    // 清空按钮
    this.refs.text.btnClear.addEventListener('click', () => {
      this.refs.text.input.value = '';
      this.updateCharCount();
    });
    
    this.refs.b64.btnClear.addEventListener('click', () => {
      this.refs.b64.input.value = '';
      this.updateCharCount();
    });
    
    // 自动换行
    this.refs.wrapLines.addEventListener('change', () => this.setWrapLines());
    
    // 自动更新
    this.refs.autoUpdate.addEventListener('change', () => this.setupAutoUpdate());
    
    // 初始化
    this.updateCharCount();
    this.setWrapLines();
    this.setupAutoUpdate();
  },
  
  /**
   * 更新字符计数
   */
  updateCharCount: function() {
    const textLen = this.refs.text.input.value.length;
    const b64Len = this.refs.b64.input.value.length;
    
    this.refs.text.charCount.textContent = `${textLen.toLocaleString()} 个字符`;
    this.refs.b64.charCount.textContent = `${b64Len.toLocaleString()} 个字符`;
  },
  
  /**
   * 编码
   */
  encode: function() {
    try {
      const text = this.refs.text.input.value;
      if (!text) {
        this.refs.b64.input.value = '';
        this.updateCharCount();
        return;
      }
      
      const urlSafe = this.refs.urlsafe.checked;
      const keepPad = this.refs.keepPad.checked;
      
      // 使用 TextEncoder 确保正确处理 UTF-8
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      // 转换为 Base64
      let b64 = btoa(String.fromCharCode.apply(null, data));
      
      // URL安全处理
      if (urlSafe) {
        b64 = b64.replace(/\+/g, '-').replace(/\//g, '_');
      }
      
      // 填充处理
      if (!keepPad) {
        b64 = b64.replace(/=+$/, '');
      }
      
      this.refs.b64.input.value = b64;
      this.updateCharCount();
    } catch (e) {
      console.error('Base64编码错误:', e);
      window.base64Utils.showToast('编码失败: ' + e.message, 'error');
    }
  },
  
  /**
   * 解码
   */
  decode: function() {
    try {
      let b64 = this.refs.b64.input.value;
      if (!b64) {
        this.refs.text.input.value = '';
        this.updateCharCount();
        return;
      }
      
      // URL安全字符转换回标准Base64
      b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
      
      // 添加填充（如果需要）
      while (b64.length % 4) {
        b64 += '=';
      }
      
      // 解码
      const binary = atob(b64);
      
      // 转换为 UTF-8
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(bytes);
      
      this.refs.text.input.value = text;
      this.updateCharCount();
    } catch (e) {
      console.error('Base64解码错误:', e);
      window.base64Utils.showToast('解码失败: ' + e.message, 'error');
    }
  },
  
  /**
   * 清空所有
   */
  clearAll: function() {
    this.refs.text.input.value = '';
    this.refs.b64.input.value = '';
    this.updateCharCount();
  },
  
  /**
   * 互换
   */
  swap: function() {
    const temp = this.refs.text.input.value;
    this.refs.text.input.value = this.refs.b64.input.value;
    this.refs.b64.input.value = temp;
    this.updateCharCount();
  },
  
  /**
   * 设置自动换行
   */
  setWrapLines: function() {
    const wrap = this.refs.wrapLines.checked;
    this.refs.text.input.style.whiteSpace = wrap ? 'pre-wrap' : 'pre';
    this.refs.b64.input.style.whiteSpace = wrap ? 'pre-wrap' : 'pre';
  },
  
  /**
   * 设置自动更新
   */
  setupAutoUpdate: function() {
    const autoUpdate = this.refs.autoUpdate.checked;
    
    if (autoUpdate) {
      this.refs.text.input.addEventListener('input', () => this.encode());
      this.refs.b64.input.addEventListener('input', () => this.decode());
    } else {
      this.refs.text.input.removeEventListener('input', () => this.encode());
      this.refs.b64.input.removeEventListener('input', () => this.decode());
    }
  },
  
  /**
   * 保存到历史记录
   */
  saveToHistory: function() {
    const text = this.refs.text.input.value;
    const b64 = this.refs.b64.input.value;
    
    if (!text && !b64) {
      window.base64Utils.showToast('没有可保存的内容', 'warning');
      return;
    }
    
    const historyItem = {
      id: Date.now(),
      type: 'text',
      input: text,
      output: b64,
      options: {
        urlSafe: this.refs.urlsafe.checked,
        keepPad: this.refs.keepPad.checked
      },
      timestamp: new Date().toISOString()
    };
    
    window.base64History.addItem(historyItem);
    window.base64Utils.showToast('已保存到历史记录', 'success');
  },
  
  /**
   * 从历史记录加载
   * @param {Object} historyItem - 历史记录项
   */
  loadFromHistory: function(historyItem) {
    if (historyItem.type !== 'text') return;
    
    this.refs.text.input.value = historyItem.input || '';
    this.refs.b64.input.value = historyItem.output || '';
    
    if (historyItem.options) {
      this.refs.urlsafe.checked = !!historyItem.options.urlSafe;
      this.refs.keepPad.checked = !!historyItem.options.keepPad;
    }
    
    this.updateCharCount();
  }
};

// 导出文本编解码器
window.base64TextEncoder = textEncoder;