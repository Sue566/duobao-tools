/**
 * URL编解码工具
 */
(function () {
  const toolId = 'urlEncoder';

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
          console.error('加载URL编解码工具失败:', error);
          container.innerHTML = '<div class="tool-error">加载URL编解码工具失败</div>';
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
        xhr.open('GET', 'tools/urlEncoder/template.html', true);
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
        link.href = 'tools/urlEncoder/styles.css';
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });
    },

    // 设置事件处理
    setupEvents: function (container) {
      // DOM 引用
      const refs = {
        encodeComponent: container.querySelector('#url-encode-component'),
        encodeAll: container.querySelector('#url-encode-all'),
        autoUpdate: container.querySelector('#url-auto-update'),
        wrapLines: container.querySelector('#url-wrap-lines'),
        
        text: {
          panel: container.querySelector('.url-panel[data-type="text"]'),
          input: container.querySelector('.url-panel[data-type="text"] .panel-input'),
          btnCopy: container.querySelector('.url-panel[data-type="text"] .btn-copy'),
          btnClear: container.querySelector('.url-panel[data-type="text"] .btn-clear'),
          charCount: container.querySelector('.url-panel[data-type="text"] .char-count')
        },
        
        url: {
          panel: container.querySelector('.url-panel[data-type="url"]'),
          input: container.querySelector('.url-panel[data-type="url"] .panel-input'),
          btnCopy: container.querySelector('.url-panel[data-type="url"] .btn-copy'),
          btnClear: container.querySelector('.url-panel[data-type="url"] .btn-clear'),
          charCount: container.querySelector('.url-panel[data-type="url"] .char-count')
        },
        
        encode: container.querySelector('#url-encode'),
        decode: container.querySelector('#url-decode'),
        swap: container.querySelector('#url-swap'),
        clear: container.querySelector('#url-clear'),
        
        charBtns: container.querySelectorAll('.char-btn')
      };

      // 更新字符计数
      const updateCharCount = () => {
        const textLen = refs.text.input.value.length;
        const urlLen = refs.url.input.value.length;
        
        refs.text.charCount.textContent = `${textLen.toLocaleString()} 个字符`;
        refs.url.charCount.textContent = `${urlLen.toLocaleString()} 个字符`;
      };

      // 编码
      const encode = () => {
        try {
          const text = refs.text.input.value;
          if (!text) {
            refs.url.input.value = '';
            updateCharCount();
            return;
          }
          
          const encodeComponent = refs.encodeComponent.checked;
          const encodeAll = refs.encodeAll.checked;
          
          let encoded;
          if (encodeAll) {
            // 完全编码（包括URL保留字符）
            encoded = [...text].map(char => {
              // 将每个字符转换为百分比编码
              const hex = char.charCodeAt(0).toString(16).toUpperCase();
              return `%${hex.padStart(2, '0')}`;
            }).join('');
          } else if (encodeComponent) {
            // 使用encodeURIComponent（编码URL组件）
            encoded = encodeURIComponent(text);
          } else {
            // 使用encodeURI（保留URL结构字符）
            encoded = encodeURI(text);
          }
          
          refs.url.input.value = encoded;
          updateCharCount();
        } catch (e) {
          console.error('URL编码错误:', e);
          alert('编码失败: ' + e.message);
        }
      };

      // 解码
      const decode = () => {
        try {
          const url = refs.url.input.value;
          if (!url) {
            refs.text.input.value = '';
            updateCharCount();
            return;
          }
          
          // 尝试使用decodeURIComponent（可以解码更多字符）
          // 如果失败，回退到decodeURI
          let decoded;
          try {
            decoded = decodeURIComponent(url);
          } catch (e) {
            try {
              decoded = decodeURI(url);
            } catch (e2) {
              throw new Error('无法解码URL，格式可能不正确');
            }
          }
          
          refs.text.input.value = decoded;
          updateCharCount();
        } catch (e) {
          console.error('URL解码错误:', e);
          alert('解码失败: ' + e.message);
        }
      };

      // 清空所有
      const clearAll = () => {
        refs.text.input.value = '';
        refs.url.input.value = '';
        updateCharCount();
      };

      // 互换
      const swap = () => {
        const temp = refs.text.input.value;
        refs.text.input.value = refs.url.input.value;
        refs.url.input.value = temp;
        updateCharCount();
      };

      // 复制到剪贴板
      const copyToClipboard = (text) => {
        if (!text) return;
        
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
            if (typeof window.showToast === 'function') {
              window.showToast('已复制到剪贴板', 'success');
            }
          } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
            if (typeof window.showToast === 'function') {
              window.showToast('已复制到剪贴板', 'success');
            }
          }
        } catch (e) {
          console.error('复制失败:', e);
          if (typeof window.showToast === 'function') {
            window.showToast('复制失败: ' + e.message, 'error');
          }
        }
      };

      // 设置自动换行
      const setWrapLines = () => {
        const wrap = refs.wrapLines.checked;
        refs.text.input.style.whiteSpace = wrap ? 'pre-wrap' : 'pre';
        refs.url.input.style.whiteSpace = wrap ? 'pre-wrap' : 'pre';
      };

      // 插入特殊字符
      const insertChar = (char) => {
        const input = refs.text.input;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const text = input.value;
        
        input.value = text.substring(0, start) + char + text.substring(end);
        input.selectionStart = input.selectionEnd = start + char.length;
        input.focus();
        
        // 如果启用了自动更新，触发编码
        if (refs.autoUpdate.checked) {
          encode();
        }
        
        updateCharCount();
      };

      // 绑定事件
      refs.encode.addEventListener('click', encode);
      refs.decode.addEventListener('click', decode);
      refs.swap.addEventListener('click', swap);
      refs.clear.addEventListener('click', clearAll);
      
      refs.text.btnCopy.addEventListener('click', () => copyToClipboard(refs.text.input.value));
      refs.url.btnCopy.addEventListener('click', () => copyToClipboard(refs.url.input.value));
      
      refs.text.btnClear.addEventListener('click', () => {
        refs.text.input.value = '';
        updateCharCount();
      });
      
      refs.url.btnClear.addEventListener('click', () => {
        refs.url.input.value = '';
        updateCharCount();
      });
      
      refs.wrapLines.addEventListener('change', setWrapLines);
      
      // 特殊字符按钮
      refs.charBtns.forEach(btn => {
        const char = btn.getAttribute('data-char');
        btn.addEventListener('click', () => insertChar(char));
      });
      
      // 自动更新
      const setupAutoUpdate = () => {
        const autoUpdate = refs.autoUpdate.checked;
        
        if (autoUpdate) {
          refs.text.input.addEventListener('input', encode);
          refs.url.input.addEventListener('input', decode);
        } else {
          refs.text.input.removeEventListener('input', encode);
          refs.url.input.removeEventListener('input', decode);
        }
      };
      
      refs.autoUpdate.addEventListener('change', setupAutoUpdate);
      
      // 编码选项变更
      refs.encodeComponent.addEventListener('change', () => {
        if (refs.autoUpdate.checked) {
          encode();
        }
      });
      
      refs.encodeAll.addEventListener('change', () => {
        if (refs.autoUpdate.checked) {
          encode();
        }
      });
      
      // 初始化
      updateCharCount();
      setWrapLines();
      setupAutoUpdate();
    }
  };

  // 将工具对象暴露给主模块
  if (window.tools && window.tools.urlEncoder) {
    // 如果主模块已经存在，则扩展它
    Object.assign(window.tools.urlEncoder, {
      _internalTool: tool
    });
  } else {
    // 如果主模块不存在，则创建它
    window.tools = window.tools || {};
    window.tools.urlEncoder = {
      _internalTool: tool,
      render: function(container) {
        return tool.render(container);
      }
    };
  }
})();