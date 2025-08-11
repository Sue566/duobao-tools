/**
 * 工具模板 - UI模块
 */
(function() {
  // 定义UI模块
  window.toolTemplateUI = {
    /**
     * 初始化UI
     * @param {HTMLElement} container - 容器元素
     */
    init: function(container) {
      // 获取元素
      this.elements = {
        inputField: container.querySelector('#input-field'),
        numberInput: container.querySelector('#number-input'),
        selectInput: container.querySelector('#select-input'),
        option1: container.querySelector('#option1'),
        option2: container.querySelector('#option2'),
        option3: container.querySelector('#option3'),
        sliderInput: container.querySelector('#slider-input'),
        sliderValue: container.querySelector('#slider-value'),
        fileInput: container.querySelector('#file-input'),
        fileName: container.querySelector('#file-name'),
        processBtn: container.querySelector('#process-btn'),
        clearBtn: container.querySelector('#clear-btn'),
        exampleBtn: container.querySelector('#example-btn'),
        settingsBtn: container.querySelector('#settings-btn'),
        copyResult: container.querySelector('#copy-result'),
        downloadResult: container.querySelector('#download-result'),
        shareResult: container.querySelector('#share-result'),
        resultContainer: container.querySelector('#tool-result'),
        resultStats: container.querySelector('#result-stats'),
        processTime: container.querySelector('#process-time'),
        resultSize: container.querySelector('#result-size'),
        toggleInfoBtn: container.querySelector('.toggle-info-btn')
      };
      
      // 设置事件监听
      this.setupEventListeners();
      
      // 加载上次的工具状态
      this.loadLastState();
      
      // 设置信息折叠状态
      this.setupInfoToggle();
    },
    
    /**
     * 设置事件监听
     */
    setupEventListeners: function() {
      const elements = this.elements;
      
      // 滑块值更新
      elements.sliderInput.addEventListener('input', () => {
        elements.sliderValue.textContent = `${elements.sliderInput.value}%`;
      });
      
      // 文件选择处理
      elements.fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          const file = e.target.files[0];
          elements.fileName.textContent = file.name;
          
          // 如果是文本文件，自动读取内容到输入框
          if (file.type === 'text/plain' || file.name.endsWith('.txt') || 
              file.name.endsWith('.json') || file.name.endsWith('.csv')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              elements.inputField.value = e.target.result;
              window.toolTemplateUtils.showToast('文件内容已加载', 'success');
            };
            reader.onerror = () => {
              window.toolTemplateUtils.showToast('文件读取失败', 'error');
            };
            reader.readAsText(file);
          }
        } else {
          elements.fileName.textContent = '未选择文件';
        }
      });
      
      // 拖放文件支持
      elements.inputField.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.inputField.classList.add('dragover');
      });
      
      elements.inputField.addEventListener('dragleave', () => {
        elements.inputField.classList.remove('dragover');
      });
      
      elements.inputField.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.inputField.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
          const file = e.dataTransfer.files[0];
          if (file.type === 'text/plain' || file.name.endsWith('.txt') || 
              file.name.endsWith('.json') || file.name.endsWith('.csv')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              elements.inputField.value = e.target.result;
              window.toolTemplateUtils.showToast('文件内容已加载', 'success');
            };
            reader.onerror = () => {
              window.toolTemplateUtils.showToast('文件读取失败', 'error');
            };
            reader.readAsText(file);
          } else {
            window.toolTemplateUtils.showToast('请拖放文本文件', 'warning');
          }
        }
      });
      
      // 加载示例
      elements.exampleBtn.addEventListener('click', () => {
        const examples = window.toolTemplateConfig.examples;
        const randomExample = examples[Math.floor(Math.random() * examples.length)];
        elements.inputField.value = randomExample;
        elements.option1.checked = Math.random() > 0.5;
        elements.option2.checked = Math.random() > 0.5;
        elements.option3.checked = Math.random() > 0.5;
        elements.sliderInput.value = Math.floor(Math.random() * 100);
        elements.sliderValue.textContent = `${elements.sliderInput.value}%`;
        
        // 保存当前设置
        this.saveCurrentState();
        
        window.toolTemplateUtils.showToast('已加载示例数据', 'info');
      });
      
      // 设置按钮点击事件
      elements.settingsBtn.addEventListener('click', () => {
        this.showSettingsPanel();
      });
      
      // 处理按钮
      elements.processBtn.addEventListener('click', () => {
        window.toolTemplateCore.processInput();
      });
      
      // 清空按钮
      elements.clearBtn.addEventListener('click', () => {
        this.clearAll();
      });
      
      // 复制结果
      elements.copyResult.addEventListener('click', () => {
        this.copyResultText();
      });
      
      // 下载结果
      elements.downloadResult.addEventListener('click', () => {
        this.downloadResultText();
      });
      
      // 分享结果
      elements.shareResult.addEventListener('click', () => {
        this.shareResult();
      });
      
      // 键盘快捷键
      elements.inputField.addEventListener('keydown', (e) => {
        // Ctrl+Enter 快捷键执行
        if (e.ctrlKey && e.key === 'Enter') {
          window.toolTemplateCore.processInput();
        }
      });
    },
    
    /**
     * 显示设置面板
     */
    showSettingsPanel: function() {
      // 创建设置面板
      let settingsPanel = document.getElementById('tool-settings-panel');
      if (!settingsPanel) {
        settingsPanel = document.createElement('div');
        settingsPanel.id = 'tool-settings-panel';
        settingsPanel.className = 'settings-panel';
        settingsPanel.innerHTML = `
          <div class="settings-header">
            <h3><i class="fa fa-cog"></i> 高级设置</h3>
            <button class="close-btn"><i class="fa fa-times"></i></button>
          </div>
          <div class="settings-content">
            <div class="settings-section">
              <h4>处理选项</h4>
              <div class="setting-item">
                <label>
                  <input type="checkbox" id="setting-option1" checked>
                  启用高级处理模式
                </label>
              </div>
              <div class="setting-item">
                <label>
                  <input type="checkbox" id="setting-option2">
                  自动保存结果
                </label>
              </div>
            </div>
            <div class="settings-section">
              <h4>显示选项</h4>
              <div class="setting-item">
                <label>结果格式</label>
                <select id="setting-format" class="form-control">
                  <option value="plain">纯文本</option>
                  <option value="json">JSON</option>
                  <option value="html">HTML</option>
                </select>
              </div>
            </div>
            <div class="settings-actions">
              <button id="save-settings" class="btn btn-primary">保存设置</button>
              <button id="reset-settings" class="btn">恢复默认</button>
            </div>
          </div>
        `;
        document.body.appendChild(settingsPanel);
        
        // 添加事件监听
        settingsPanel.querySelector('.close-btn').addEventListener('click', () => {
          settingsPanel.classList.remove('active');
        });
        
        settingsPanel.querySelector('#save-settings').addEventListener('click', () => {
          this.saveSettings();
          settingsPanel.classList.remove('active');
          window.toolTemplateUtils.showToast('设置已保存', 'success');
        });
        
        settingsPanel.querySelector('#reset-settings').addEventListener('click', () => {
          this.resetSettings();
          window.toolTemplateUtils.showToast('已恢复默认设置', 'info');
        });
      }
      
      // 显示设置面板
      settingsPanel.classList.add('active');
      
      // 加载当前设置
      this.loadSettings();
    },
    
    /**
     * 保存设置
     */
    saveSettings: function() {
      const settings = {
        advancedMode: document.getElementById('setting-option1').checked,
        autoSave: document.getElementById('setting-option2').checked,
        resultFormat: document.getElementById('setting-format').value
      };
      
      window.toolTemplateConfig.saveSettings(settings);
    },
    
    /**
     * 加载设置
     */
    loadSettings: function() {
      const settings = window.toolTemplateConfig.loadSettings();
      
      document.getElementById('setting-option1').checked = settings.advancedMode;
      document.getElementById('setting-option2').checked = settings.autoSave;
      document.getElementById('setting-format').value = settings.resultFormat;
    },
    
    /**
     * 重置设置
     */
    resetSettings: function() {
      document.getElementById('setting-option1').checked = window.toolTemplateConfig.defaultSettings.advancedMode;
      document.getElementById('setting-option2').checked = window.toolTemplateConfig.defaultSettings.autoSave;
      document.getElementById('setting-format').value = window.toolTemplateConfig.defaultSettings.resultFormat;
      
      this.saveSettings();
    },
    
    /**
     * 保存当前工具状态
     */
    saveCurrentState: function() {
      const elements = this.elements;
      const currentState = {
        input: elements.inputField.value,
        number: elements.numberInput.value,
        select: elements.selectInput.value,
        option1: elements.option1.checked,
        option2: elements.option2.checked,
        option3: elements.option3.checked,
        slider: elements.sliderInput.value
      };
      
      window.toolTemplateConfig.saveState(currentState);
    },
    
    /**
     * 加载上次的工具状态
     */
    loadLastState: function() {
      const elements = this.elements;
      const lastState = window.toolTemplateConfig.loadState();
      
      if (lastState) {
        elements.inputField.value = lastState.input || '';
        elements.numberInput.value = lastState.number || '10';
        elements.selectInput.value = lastState.select || 'option1';
        elements.option1.checked = lastState.option1 || false;
        elements.option2.checked = lastState.option2 || false;
        elements.option3.checked = lastState.option3 || false;
        elements.sliderInput.value = lastState.slider || '50';
        elements.sliderValue.textContent = `${elements.sliderInput.value}%`;
      }
    },
    
    /**
     * 设置信息折叠/展开
     */
    setupInfoToggle: function() {
      const elements = this.elements;
      const infoContent = document.querySelector('.info-content');
      
      elements.toggleInfoBtn.addEventListener('click', () => {
        const isCollapsed = infoContent.style.display === 'none';
        
        infoContent.style.display = isCollapsed ? 'block' : 'none';
        elements.toggleInfoBtn.innerHTML = isCollapsed ? 
          '<i class="fa fa-chevron-up"></i>' : 
          '<i class="fa fa-chevron-down"></i>';
        
        // 保存偏好
        window.toolTemplateConfig.saveInfoCollapsed(!isCollapsed);
      });
      
      // 检查是否应该折叠说明
      const shouldCollapseInfo = window.toolTemplateConfig.loadInfoCollapsed();
      if (shouldCollapseInfo) {
        infoContent.style.display = 'none';
        elements.toggleInfoBtn.innerHTML = '<i class="fa fa-chevron-down"></i>';
      }
    },
    
    /**
     * 显示结果
     * @param {string} result - 处理结果
     * @param {string} format - 结果格式
     */
    displayResult: function(result, format) {
      const elements = this.elements;
      let formattedResult = '';
      let downloadType = 'text/plain';
      let fileExtension = 'txt';
      
      // 根据格式处理结果
      switch (format) {
        case 'json':
          try {
            // 尝试解析为JSON
            const jsonObj = typeof result === 'string' ? JSON.parse(result) : result;
            formattedResult = JSON.stringify(jsonObj, null, 2);
            downloadType = 'application/json';
            fileExtension = 'json';
          } catch (e) {
            formattedResult = result;
            window.toolTemplateUtils.showToast('结果不是有效的JSON格式，以纯文本显示', 'warning');
          }
          break;
          
        case 'html':
          formattedResult = result;
          downloadType = 'text/html';
          fileExtension = 'html';
          break;
          
        case 'plain':
        default:
          formattedResult = result;
          break;
      }
      
      // 更新下载按钮的文件类型
      elements.downloadResult.setAttribute('data-type', downloadType);
      elements.downloadResult.setAttribute('data-ext', fileExtension);
      
      // 显示结果
      elements.resultContainer.innerHTML = `
        <div class="result-content">
          <pre>${window.toolTemplateUtils.escapeHtml(formattedResult)}</pre>
        </div>
      `;
      
      // 添加复制按钮
      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn btn-sm btn-outline-secondary copy-btn';
      copyBtn.innerHTML = '<i class="fa fa-copy"></i> 复制结果';
      copyBtn.addEventListener('click', () => {
        window.toolTemplateUtils.copyToClipboard(formattedResult);
        copyBtn.innerHTML = '<i class="fa fa-check"></i> 已复制';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa fa-copy"></i> 复制结果';
        }, 2000);
      });
      
      elements.resultContainer.querySelector('.result-content').appendChild(copyBtn);
    },
    
    /**
     * 清空输入和结果
     */
    clearAll: function() {
      const elements = this.elements;
      
      elements.inputField.value = '';
      elements.numberInput.value = '10';
      elements.selectInput.value = 'option1';
      elements.option1.checked = false;
      elements.option2.checked = false;
      elements.option3.checked = false;
      elements.sliderInput.value = '50';
      elements.sliderValue.textContent = '50%';
      elements.fileInput.value = '';
      elements.fileName.textContent = '未选择文件';
      elements.resultContainer.innerHTML = `
        <div class="no-result">
          <i class="fa fa-info-circle"></i>
          <p>点击"立即处理"按钮开始</p>
          <small>结果将在此处显示</small>
        </div>
      `;
      elements.resultStats.style.display = 'none';
      
      // 保存当前状态
      this.saveCurrentState();
    },
    
    /**
     * 复制结果文本
     */
    copyResultText: function() {
      const elements = this.elements;
      const resultContent = elements.resultContainer.querySelector('.result-content');
      
      if (!resultContent) {
        window.toolTemplateUtils.showToast('没有可复制的结果', 'warning');
        return;
      }
      
      const text = resultContent.textContent;
      window.toolTemplateUtils.copyToClipboard(text);
    },
    
    /**
     * 下载结果文本
     */
    downloadResultText: function() {
      const elements = this.elements;
      const resultContent = elements.resultContainer.querySelector('.result-content');
      
      if (!resultContent) {
        window.toolTemplateUtils.showToast('没有可下载的结果', 'warning');
        return;
      }
      
      const text = resultContent.textContent;
      const type = elements.downloadResult.getAttribute('data-type') || 'text/plain';
      const ext = elements.downloadResult.getAttribute('data-ext') || 'txt';
      
      // 生成文件名
      const toolName = document.querySelector('.tool-header h2').textContent.trim().replace(/[^\w\u4e00-\u9fa5]/g, '_');
      const filename = window.toolTemplateUtils.generateTimestampFilename(`多宝工具箱_${toolName}`, ext);
      
      window.toolTemplateUtils.downloadFile(filename, text, type);
    },
    
    /**
     * 分享结果
     */
    shareResult: function() {
      const elements = this.elements;
      const resultContent = elements.resultContainer.querySelector('.result-content');
      
      if (!resultContent) {
        window.toolTemplateUtils.showToast('没有可分享的结果', 'warning');
        return;
      }
      
      // 检查是否支持网页分享API
      if (navigator.share) {
        const text = resultContent.textContent;
        const toolName = document.querySelector('.tool-header h2').textContent.trim();
        
        navigator.share({
          title: `多宝工具箱 - ${toolName}`,
          text: text.length > 100 ? text.substring(0, 100) + '...' : text,
          url: window.location.href
        })
        .then(() => {
          window.toolTemplateUtils.showToast('分享成功', 'success');
        })
        .catch((error) => {
          console.error('分享失败:', error);
          window.toolTemplateUtils.showToast('分享失败', 'error');
        });
      } else {
        // 如果不支持分享API，则复制链接
        window.toolTemplateUtils.copyToClipboard(window.location.href);
        window.toolTemplateUtils.showToast('链接已复制，请手动分享', 'info');
      }
    }
  };
})();