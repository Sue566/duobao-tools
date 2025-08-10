/**
 * 进制转换工具
 */
(function () {
  const toolId = 'baseConverter';
  
  // 配置与状态
  const DEFAULTS = {
    uppercase: true,
    showPrefix: true,
    groupSize: 4, // 分组位数（以目标进制字符数计，不是比特），0 表示不分组
    bitWidth: 0, // 0 表示不做位宽零填充
    signed: true
  };

  const PREFIX_MAP = {
    2: '0b',
    8: '0o',
    10: '',
    16: '0x'
  };

  // 工具模块
  const tool = {
    init: function () {},
    render: function (container) {
      // 加载HTML模板
      this.loadTemplate(container)
        .then(() => {
          // 加载CSS样式
          return this.loadStyles();
        })
        .then(() => {
          // 添加收藏按钮
          if (typeof window.addFavoriteButton === 'function') {
            const header = container.querySelector('.tool-header');
            window.addFavoriteButton(toolId, header);
          }
          
          // 初始化事件处理
          this.setupEvents(container);
        })
        .catch(error => {
          console.error('加载进制转换工具失败:', error);
          container.innerHTML = '<div class="tool-error">加载进制转换工具失败</div>';
        });
    },
    
    /**
     * 加载HTML模板
     * @param {HTMLElement} container - 工具容器元素
     * @returns {Promise} 加载完成的Promise
     */
    loadTemplate: function(container) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'tools/baseConverter/template.html', true);
        xhr.onload = function() {
          if (xhr.status === 200) {
            container.innerHTML = xhr.responseText;
            resolve();
          } else {
            reject(new Error(`加载模板失败: ${xhr.status}`));
          }
        };
        xhr.onerror = function() {
          reject(new Error('网络错误，无法加载模板'));
        };
        xhr.send();
      });
    },
    
    /**
     * 加载CSS样式
     * @returns {Promise} 加载完成的Promise
     */
    loadStyles: function() {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'tools/baseConverter/styles.css';
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });
    },

    // 设置事件处理
    setupEvents: function (container) {
      // DOM 引用
      const refs = {
        uppercase: container.querySelector('#bc-uppercase'),
        prefix: container.querySelector('#bc-prefix'),
        group: container.querySelector('#bc-group'),
        bitWidth: container.querySelector('#bc-bitwidth'),
        signed: container.querySelector('#bc-signed'),

        bin: this.areaRef(container, 'binary'),
        oct: this.areaRef(container, 'octal'),
        dec: this.areaRef(container, 'decimal'),
        hex: this.areaRef(container, 'hex'),

        clear: container.querySelector('#bc-clear'),
        sample: container.querySelector('#bc-sample'),
        copyAll: container.querySelector('#bc-copy-all'),
        
        asciiInput: container.querySelector('#bc-ascii-input'),
        asciiDec: container.querySelector('#bc-ascii-dec'),
        asciiHex: container.querySelector('#bc-ascii-hex'),
        asciiBin: container.querySelector('#bc-ascii-bin'),
        
        commonValueBtns: container.querySelectorAll('.common-value-btn')
      };

      // 添加字符计数
      const panels = [refs.bin, refs.oct, refs.dec, refs.hex];
      panels.forEach(panel => {
        const charCount = document.createElement('div');
        charCount.className = 'char-count';
        charCount.textContent = '0 个字符';
        panel.panel.appendChild(charCount);
        panel.charCount = charCount;
      });

      // 更新字符计数
      const updateCharCount = () => {
        panels.forEach(panel => {
          const len = panel.input.value.length;
          panel.charCount.textContent = `${len.toLocaleString()} 个字符`;
        });
      };

      // 初始化默认选项
      refs.uppercase.checked = DEFAULTS.uppercase;
      refs.prefix.checked = DEFAULTS.showPrefix;
      refs.group.value = String(DEFAULTS.groupSize);
      refs.bitWidth.value = String(DEFAULTS.bitWidth);
      refs.signed.checked = DEFAULTS.signed;

      // 输入联动
      let updating = false;

      const listeners = [
        ['binary', 2, refs.bin],
        ['octal', 8, refs.oct],
        ['decimal', 10, refs.dec],
        ['hex', 16, refs.hex]
      ];

      listeners.forEach(([name, base, el]) => {
        el.input.addEventListener('input', () => {
          if (updating) return;
          updating = true;
          this.convertFrom(base, el.input.value, refs, name);
          updateCharCount();
          updating = false;
        });
        el.btnCopy.addEventListener('click', () => this.copyToClipboard(el.input.value));
        el.btnClear.addEventListener('click', () => {
          el.input.value = '';
          el.hint.textContent = '';
          el.input.classList.remove('error');
          // 清空不触发联动，避免循环，将其它面板也清空
          updating = true;
          this.clearAll(refs);
          updateCharCount();
          updating = false;
        });
      });

      // 选项变化 -> 重新渲染（根据十进制为准优先）
      [refs.uppercase, refs.prefix, refs.group, refs.bitWidth, refs.signed].forEach(ctrl => {
        ctrl.addEventListener('change', () => {
          updating = true;
          // 优先从有值的面板选一个做源
          const source = this.pickSource(refs);
          if (source) {
            this.convertFrom(source.base, source.value, refs, source.name);
          } else {
            this.clearAll(refs);
          }
          updateCharCount();
          updating = false;
        });
      });

      // 清空、示例
      refs.clear.addEventListener('click', () => {
        this.clearAll(refs);
        updateCharCount();
      });

      refs.sample.addEventListener('click', () => {
        // 示例：十进制 -123456789
        refs.dec.input.value = '-123456789';
        refs.uppercase.checked = true;
        refs.prefix.checked = true;
        refs.group.value = '4';
        refs.bitWidth.value = '0';
        refs.signed.checked = true;

        updating = true;
        this.convertFrom(10, refs.dec.input.value, refs, 'decimal');
        updateCharCount();
        updating = false;
      });

      // 复制所有结果
      refs.copyAll.addEventListener('click', () => {
        const results = [];
        if (refs.bin.input.value) results.push(`二进制: ${refs.bin.input.value}`);
        if (refs.oct.input.value) results.push(`八进制: ${refs.oct.input.value}`);
        if (refs.dec.input.value) results.push(`十进制: ${refs.dec.input.value}`);
        if (refs.hex.input.value) results.push(`十六进制: ${refs.hex.input.value}`);
        
        if (results.length > 0) {
          this.copyToClipboard(results.join('\n'));
        } else {
          window.showToast && window.showToast('没有可复制的结果', 'warning');
        }
      });

      // ASCII 字符转换
      refs.asciiInput.addEventListener('input', () => {
        const char = refs.asciiInput.value;
        if (char.length === 0) {
          refs.asciiDec.textContent = '-';
          refs.asciiHex.textContent = '-';
          refs.asciiBin.textContent = '-';
          return;
        }
        
        const code = char.charCodeAt(0);
        refs.asciiDec.textContent = code.toString();
        refs.asciiHex.textContent = '0x' + code.toString(16).toUpperCase();
        refs.asciiBin.textContent = '0b' + code.toString(2).padStart(8, '0');
      });

      // 常用数值按钮
      refs.commonValueBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const value = btn.getAttribute('data-value');
          refs.dec.input.value = value;
          
          updating = true;
          this.convertFrom(10, value, refs, 'decimal');
          updateCharCount();
          updating = false;
        });
      });

      // 初始焦点
      refs.dec.input.focus();
    },
    
    // 辅助方法
    areaRef: function(root, key) {
      const panel = root.querySelector(`.bc-panel[data-key="${key}"]`);
      return {
        panel,
        input: panel.querySelector('.bc-input'),
        hint: panel.querySelector('.hint'),
        btnCopy: panel.querySelector('.bc-copy'),
        btnClear: panel.querySelector('.bc-clear')
      };
    },
    
    // 转换方法
    convertFrom: function(sourceBase, raw, refs, sourceName) {
      // 清除所有错误标记
      this.clearErrors(refs);

      const opts = this.getOptions(refs);

      if (!raw || raw.trim() === '') {
        this.clearAll(refs);
        return;
      }

      // 解析为 BigInt
      const parsed = this.parseToBigInt(raw, sourceBase, opts.signed);
      if (parsed.error) {
        this.markError(refs, sourceName, parsed.error);
        return;
      }

      const val = parsed.value; // BigInt

      // 分发到各面板
      this.setValue(refs.bin, this.formatBigInt(val, 2, opts));
      this.setValue(refs.oct, this.formatBigInt(val, 8, opts));
      this.setValue(refs.dec, this.formatBigInt(val, 10, opts));
      this.setValue(refs.hex, this.formatBigInt(val, 16, opts));
    },
    
    pickSource: function(refs) {
      // 优先十进制，其次十六、二进制、八进制
      const order = [
        { el: refs.dec, base: 10, name: 'decimal' },
        { el: refs.hex, base: 16, name: 'hex' },
        { el: refs.bin, base: 2, name: 'binary' },
        { el: refs.oct, base: 8, name: 'octal' }
      ];
      for (const item of order) {
        const v = item.el.input.value.trim();
        if (v) return { base: item.base, value: v, name: item.name };
      }
      return null;
    },
    
    // 选项
    getOptions: function(refs) {
      return {
        uppercase: !!refs.uppercase.checked,
        showPrefix: !!refs.prefix.checked,
        groupSize: parseInt(refs.group.value || '0', 10) || 0,
        bitWidth: Math.max(0, parseInt(refs.bitWidth.value || '0', 10) || 0),
        signed: !!refs.signed.checked
      };
    },
    
    // 解析相关
    normalizeInput: function(str) {
      // 去除空白与常见分隔符
      return (str || '')
        .trim()
        .replace(/[\s,_-]+/g, ''); // 允许用空格/逗号/下划线/连字符分组
    },
    
    stripPrefix: function(str, base) {
      let s = str;
      if (base === 16) s = s.replace(/^[-+]?0x/i, (m) => m[0] === '-' ? '-' : '');
      if (base === 2) s = s.replace(/^[-+]?0b/i, (m) => m[0] === '-' ? '-' : '');
      if (base === 8) s = s.replace(/^[-+]?0o/i, (m) => m[0] === '-' ? '-' : '');
      return s;
    },
    
    validPatternForBase: function(base, signed) {
      const sign = signed ? '[+-]?' : '';
      if (base === 2) return new RegExp(`^${sign}[01]+$`, 'i');
      if (base === 8) return new RegExp(`^${sign}[0-7]+$`, 'i');
      if (base === 10) return new RegExp(`^${sign}\\d+$`, 'i');
      if (base === 16) return new RegExp(`^${sign}[0-9a-f]+$`, 'i');
      return null;
    },
    
    parseToBigInt: function(raw, base, signed) {
      try {
        if (typeof raw !== 'string') raw = String(raw ?? '');
        let s = this.normalizeInput(raw);

        // 处理前缀（仅当与源进制一致时移除）
        s = this.stripPrefix(s, base);

        // 允许单独的'+'或'-'?
        if (s === '' || s === '+' || s === '-') {
          return { error: '请输入有效数值' };
        }

        // 校验字符
        const pat = this.validPatternForBase(base, signed);
        if (!pat || !pat.test(s)) {
          return { error: `包含非 base ${base} 的合法字符` };
        }

        // BigInt 解析
        let sign = 1n;
        if (s[0] === '+') s = s.slice(1);
        else if (s[0] === '-') {
          if (!signed) return { error: '当前为无符号模式，不能携带负号' };
          sign = -1n;
          s = s.slice(1);
        }

        const bi = this.baseStrToBigInt(s, base);
        return { value: sign * bi };
      } catch (e) {
        return { error: '解析失败: ' + e.message };
      }
    },
    
    baseStrToBigInt: function(s, base) {
      if (base === 10) return BigInt(s);
      const digits = s.toLowerCase();
      const map = '0123456789abcdefghijklmnopqrstuvwxyz';
      let res = 0n;
      const b = BigInt(base);
      for (let i = 0; i < digits.length; i++) {
        const ch = digits[i];
        const v = BigInt(map.indexOf(ch));
        res = res * b + v;
      }
      return res;
    },
    
    // 格式化输出
    formatBigInt: function(bi, base, opts) {
      const negative = bi < 0n;
      let value = negative ? -bi : bi;

      // 进制字符串
      let s = value.toString(base);

      // 位宽零填充（按比特位宽转换为目标进制长度）
      if (opts.bitWidth > 0 && base !== 10) {
        let digits = 0;
        if (base === 2) digits = opts.bitWidth;
        else if (base === 8) digits = Math.ceil(opts.bitWidth / 3);
        else if (base === 16) digits = Math.ceil(opts.bitWidth / 4);
        if (digits > 0) {
          if (s.length < digits) {
            s = '0'.repeat(digits - s.length) + s;
          }
        }
      }

      // 大小写
      if (opts.uppercase) s = s.toUpperCase();

      // 分组（每 groupSize 个字符分隔）
      if (opts.groupSize && opts.groupSize > 0) {
        s = this.groupString(s, opts.groupSize);
      }

      // 前缀
      const prefix = opts.showPrefix ? PREFIX_MAP[base] : '';
      const out = `${negative ? '-' : ''}${prefix}${s}`;
      return out;
    },
    
    groupString: function(s, size) {
      if (size <= 0) return s;
      // 从右向左分组，保留首段长度可能小于 size
      const arr = [];
      let i = s.length;
      while (i > 0) {
        const start = Math.max(0, i - size);
        arr.push(s.slice(start, i));
        i = start;
      }
      return arr.reverse().join(' ');
    },
    
    // 交互辅助
    clearAll: function(refs) {
      [refs.bin, refs.oct, refs.dec, refs.hex].forEach(r => {
        r.input.value = '';
        r.hint.textContent = '';
        r.input.classList.remove('error');
      });
    },
    
    markError: function(refs, name, msg) {
      const map = { binary: refs.bin, octal: refs.oct, decimal: refs.dec, hex: refs.hex };
      const ref = map[name];
      if (ref) {
        ref.input.classList.add('error');
        ref.hint.textContent = msg;
      }
      // 其他面板清空，避免显示过期数据
      Object.keys(map).forEach(k => {
        if (k !== name) {
          map[k].input.value = '';
          map[k].hint.textContent = '';
          map[k].input.classList.remove('error');
        }
      });
    },
    
    clearErrors: function(refs) {
      [refs.bin, refs.oct, refs.dec, refs.hex].forEach(r => {
        r.input.classList.remove('error');
        // 不清空 hint，直到完成一次成功转换或手动清空
      });
    },
    
    setValue: function(ref, val) {
      ref.input.value = val;
      ref.hint.textContent = '';
      ref.input.classList.remove('error');
    },
    
    copyToClipboard: function(text) {
      try {
        if (!text) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        if (typeof window.showToast === 'function') {
          window.showToast('已复制到剪贴板', 'success');
        }
      } catch (e) {
        console.error('复制失败', e);
        if (typeof window.showToast === 'function') {
          window.showToast('复制失败: ' + e.message, 'error');
        }
      }
    }
  };

  // 注册工具
  if (typeof window.registerTool === 'function') {
    window.registerTool(toolId, tool);
  } else {
    window.tools[toolId] = tool;
    console.log('工具 ' + toolId + ' 已注册');
  }
})();