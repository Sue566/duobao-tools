/**
 * 多宝工具箱 - 工具模板
 * 
 * 使用说明：
 * 1. 复制此文件并重命名为你的工具名称，如 myTool.js
 * 2. 修改工具ID、名称、描述和图标
 * 3. 实现工具的界面和功能
 * 4. 在 tools-loader.js 中注册你的工具
 * 
 * 提示：
 * - 图标使用 Font Awesome 图标库，可在 https://fontawesome.com/v4.7.0/icons/ 查找
 * - 工具ID应使用驼峰命名法，如 textConverter, imageResizer 等
 * - 确保工具ID在整个工具箱中唯一
 * - 工具应遵循多宝工具箱的设计风格，保持界面简洁、直观
 * - 添加适当的错误处理和用户提示，提高用户体验
 * - 考虑添加键盘快捷键和拖放支持，增强工具的易用性
 * - 为工具添加详细的使用说明和示例，帮助用户快速上手
 */
(function() {
  // 定义工具
  const tool = {
    // 工具配置
    config: {
      // 保存用户设置
      saveSettings: function(settings) {
        try {
          localStorage.setItem('settings_toolId', JSON.stringify(settings));
        } catch (e) {
          console.error('保存设置失败', e);
        }
      },
      
      // 加载用户设置
      loadSettings: function() {
        try {
          const settings = localStorage.getItem('settings_toolId');
          return settings ? JSON.parse(settings) : null;
        } catch (e) {
          console.error('加载设置失败', e);
          return null;
        }
      }
    },
    
    // 工具初始化时调用
    init: function() {
      // 可选：在这里进行工具初始化操作
      // 例如：加载外部库、预处理数据等
      console.log('多宝工具箱 - 工具模板初始化');
      
      // 如果需要加载外部库，可以使用以下代码
      /*
      if (!window.ExternalLibrary) {
        console.log('正在加载外部库...');
        showToast('正在加载必要组件，请稍候...', 'info');
        
        const script = document.createElement('script');
        script.src = 'https://cdn.example.com/external-library.min.js';
        document.head.appendChild(script);
        
        return new Promise((resolve) => {
          script.onload = () => {
            console.log('外部库加载成功');
            showToast('组件加载完成', 'success');
            resolve();
          };
          script.onerror = () => {
            console.error('外部库加载失败');
            showToast('组件加载失败，部分功能可能无法使用', 'error');
            resolve();
          };
        });
      }
      */
      
      // 加载用户设置
      const savedSettings = this.config.loadSettings();
      if (savedSettings) {
        console.log('已加载用户设置');
        // 在这里应用保存的设置
      }
    },
    
    // 渲染工具界面
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-wrench"></i> 多宝工具名称</h2>
          <p class="tool-description">工具描述文本，说明工具的用途和功能。这里应该简明扼要地介绍工具的主要功能和使用场景。</p>
        </div>
        
        <div class="tool-container">
          <!-- 输入区域 -->
          <div class="tool-input-section">
            <!-- 文本输入示例 -->
            <div class="form-group">
              <label for="input-field">文本输入</label>
              <textarea id="input-field" class="form-control" rows="5" placeholder="请在此输入需要处理的文本内容..."></textarea>
              <small class="form-text text-muted">提示信息：支持直接粘贴或拖放文本文件到此处</small>
            </div>
            
            <!-- 数字输入示例 -->
            <div class="form-group">
              <label for="number-input">数字输入</label>
              <div class="input-with-unit">
                <input type="number" id="number-input" class="form-control" value="10" min="0" max="100" step="1" />
                <span class="unit">单位</span>
              </div>
            </div>
            
            <!-- 选择框示例 -->
            <div class="form-group">
              <label for="select-input">下拉选择</label>
              <select id="select-input" class="form-control">
                <option value="option1">选项一</option>
                <option value="option2">选项二</option>
                <option value="option3">选项三</option>
              </select>
            </div>
            
            <!-- 复选框示例 -->
            <div class="form-group">
              <label>复选框选项</label>
              <div class="options-container">
                <div class="form-check">
                  <input type="checkbox" id="option1" />
                  <label for="option1">选项1</label>
                </div>
                <div class="form-check">
                  <input type="checkbox" id="option2" />
                  <label for="option2">选项2</label>
                </div>
                <div class="form-check">
                  <input type="checkbox" id="option3" />
                  <label for="option3">选项3</label>
                </div>
              </div>
            </div>
            
            <!-- 单选框示例 -->
            <div class="form-group">
              <label>单选框选项</label>
              <div class="options-container">
                <div class="form-check">
                  <input type="radio" name="radio-option" id="radio1" value="radio1" checked />
                  <label for="radio1">选项1</label>
                </div>
                <div class="form-check">
                  <input type="radio" name="radio-option" id="radio2" value="radio2" />
                  <label for="radio2">选项2</label>
                </div>
              </div>
            </div>
            
            <!-- 滑块示例 -->
            <div class="form-group">
              <label for="slider-input">滑块控制</label>
              <div class="range-with-value">
                <input type="range" id="slider-input" min="0" max="100" value="50" />
                <span id="slider-value">50%</span>
              </div>
            </div>
            
            <!-- 文件上传示例 -->
            <div class="form-group">
              <label for="file-input">文件上传</label>
              <div class="file-input-container">
                <input type="file" id="file-input" accept=".txt,.json,.csv" />
                <label for="file-input" class="file-input-label">
                  <i class="fa fa-upload"></i> 选择文件
                </label>
                <span id="file-name">未选择文件</span>
              </div>
            </div>
            
            <!-- 按钮区域 -->
            <div class="tool-actions">
              <button id="process-btn" class="btn btn-primary"><i class="fa fa-play"></i> 立即处理</button>
              <button id="clear-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空内容</button>
              <button id="example-btn" class="btn btn-info"><i class="fa fa-lightbulb-o"></i> 使用示例</button>
              <button id="settings-btn" class="btn"><i class="fa fa-cog"></i> 高级设置</button>
            </div>
          </div>
          
          <!-- 结果区域 -->
          <div class="tool-result-section">
            <div class="result-header">
              <h3><i class="fa fa-check-circle"></i> 处理结果</h3>
              <div class="result-actions">
                <button id="copy-result" class="btn btn-sm btn-outline"><i class="fa fa-copy"></i> 复制结果</button>
                <button id="download-result" class="btn btn-sm btn-outline"><i class="fa fa-download"></i> 下载结果</button>
                <button id="share-result" class="btn btn-sm btn-outline"><i class="fa fa-share-alt"></i> 分享</button>
              </div>
            </div>
            
            <div class="tool-result" id="tool-result">
              <div class="no-result">
                <i class="fa fa-info-circle"></i>
                <p>点击"立即处理"按钮开始</p>
                <small>结果将在此处显示</small>
              </div>
            </div>
            
            <!-- 结果统计信息 -->
            <div class="result-stats" id="result-stats" style="display: none;">
              <div class="stat-item">
                <span class="stat-label">处理时间:</span>
                <span class="stat-value" id="process-time">0 ms</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">结果大小:</span>
                <span class="stat-value" id="result-size">0 字节</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 工具说明区域 -->
        <div class="tool-info">
          <div class="info-header">
            <h3><i class="fa fa-question-circle"></i> 使用指南</h3>
            <button class="toggle-info-btn" title="展开/收起说明"><i class="fa fa-chevron-up"></i></button>
          </div>
          <div class="info-content">
            <div class="info-item">
              <h4><i class="fa fa-info-circle"></i> 功能介绍</h4>
              <p>这个多宝工具可以帮助您快速完成特定任务，提高工作效率。在这里详细介绍工具的功能和适用场景。</p>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-list-ol"></i> 使用步骤</h4>
              <p>按照以下步骤使用此工具：</p>
              <ol>
                <li><strong>输入数据</strong> - 在文本框中输入或粘贴需要处理的内容</li>
                <li><strong>选择选项</strong> - 根据需要调整处理参数和选项</li>
                <li><strong>点击处理</strong> - 点击"立即处理"按钮开始操作</li>
                <li><strong>查看结果</strong> - 在结果区域查看处理后的内容</li>
                <li><strong>保存结果</strong> - 可以复制或下载处理结果</li>
              </ol>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-star"></i> 高级技巧</h4>
              <p>掌握这些技巧，让工具使用更高效：</p>
              <ul>
                <li><strong>快捷键</strong> - 使用 <kbd>Ctrl</kbd>+<kbd>Enter</kbd> 快速执行处理操作</li>
                <li><strong>文件拖放</strong> - 直接将文本文件拖放到输入框中快速导入内容</li>
                <li><strong>批量处理</strong> - 一次可以处理多行文本，每行将被单独处理</li>
                <li><strong>设置保存</strong> - 您的处理偏好设置会自动保存，下次使用时自动应用</li>
              </ul>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-exclamation-triangle"></i> 注意事项</h4>
              <p>使用本工具时请注意：</p>
              <ul>
                <li>处理大量数据可能需要较长时间，请耐心等待</li>
                <li>敏感数据仅在本地处理，不会上传到服务器</li>
                <li>建议定期备份重要的处理结果</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('toolId', container.querySelector('.tool-header'));
      
      // 获取元素
      const inputField = container.querySelector('#input-field');
      const numberInput = container.querySelector('#number-input');
      const selectInput = container.querySelector('#select-input');
      const option1 = container.querySelector('#option1');
      const option2 = container.querySelector('#option2');
      const option3 = container.querySelector('#option3');
      const sliderInput = container.querySelector('#slider-input');
      const sliderValue = container.querySelector('#slider-value');
      const fileInput = container.querySelector('#file-input');
      const fileName = container.querySelector('#file-name');
      const processBtn = container.querySelector('#process-btn');
      const clearBtn = container.querySelector('#clear-btn');
      const exampleBtn = container.querySelector('#example-btn');
      const settingsBtn = container.querySelector('#settings-btn');
      const copyResult = container.querySelector('#copy-result');
      const downloadResult = container.querySelector('#download-result');
      const shareResult = container.querySelector('#share-result');
      const resultContainer = container.querySelector('#tool-result');
      const resultStats = container.querySelector('#result-stats');
      const processTime = container.querySelector('#process-time');
      const resultSize = container.querySelector('#result-size');
      const toggleInfoBtn = container.querySelector('.toggle-info-btn');
      
      // 滑块值更新
      sliderInput.addEventListener('input', () => {
        sliderValue.textContent = `${sliderInput.value}%`;
      });
      
      // 文件选择处理
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          const file = e.target.files[0];
          fileName.textContent = file.name;
          
          // 如果是文本文件，自动读取内容到输入框
          if (file.type === 'text/plain' || file.name.endsWith('.txt') || 
              file.name.endsWith('.json') || file.name.endsWith('.csv')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              inputField.value = e.target.result;
              showToast('文件内容已加载', 'success');
            };
            reader.onerror = () => {
              showToast('文件读取失败', 'error');
            };
            reader.readAsText(file);
          }
        } else {
          fileName.textContent = '未选择文件';
        }
      });
      
      // 拖放文件支持
      inputField.addEventListener('dragover', (e) => {
        e.preventDefault();
        inputField.classList.add('dragover');
      });
      
      inputField.addEventListener('dragleave', () => {
        inputField.classList.remove('dragover');
      });
      
      inputField.addEventListener('drop', (e) => {
        e.preventDefault();
        inputField.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
          const file = e.dataTransfer.files[0];
          if (file.type === 'text/plain' || file.name.endsWith('.txt') || 
              file.name.endsWith('.json') || file.name.endsWith('.csv')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              inputField.value = e.target.result;
              showToast('文件内容已加载', 'success');
            };
            reader.onerror = () => {
              showToast('文件读取失败', 'error');
            };
            reader.readAsText(file);
          } else {
            showToast('请拖放文本文件', 'warning');
          }
        }
      });
      
      // 示例数据
      const examples = [
        "这是示例文本1，用于演示多宝工具箱的功能。",
        "这是示例文本2，包含一些特殊字符：!@#$%^&*()。您可以看到工具如何处理这些字符。",
        "这是示例文本3，包含数字123和英文ABC。多宝工具箱可以轻松处理各种语言和格式的文本。",
        "这是一个较长的示例，演示工具处理多行文本的能力。\n第二行内容\n第三行内容\n可以看到工具如何保持文本的格式和结构。"
      ];
      
      // 加载示例
      exampleBtn.addEventListener('click', () => {
        const randomExample = examples[Math.floor(Math.random() * examples.length)];
        inputField.value = randomExample;
        option1.checked = Math.random() > 0.5;
        option2.checked = Math.random() > 0.5;
        option3.checked = Math.random() > 0.5;
        sliderInput.value = Math.floor(Math.random() * 100);
        sliderValue.textContent = `${sliderInput.value}%`;
        
        // 保存当前设置
        saveCurrentSettings();
        
        showToast('已加载示例数据', 'info');
      });
      
      // 设置按钮点击事件
      settingsBtn.addEventListener('click', () => {
        showSettingsPanel();
      });
      
      // 显示设置面板
      function showSettingsPanel() {
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
            saveSettings();
            settingsPanel.classList.remove('active');
            showToast('设置已保存', 'success');
          });
          
          settingsPanel.querySelector('#reset-settings').addEventListener('click', () => {
            resetSettings();
            showToast('已恢复默认设置', 'info');
          });
        }
        
        // 显示设置面板
        settingsPanel.classList.add('active');
        
        // 加载当前设置
        loadSettings();
      }
      
      // 保存设置
      function saveSettings() {
        const settings = {
          advancedMode: document.getElementById('setting-option1').checked,
          autoSave: document.getElementById('setting-option2').checked,
          resultFormat: document.getElementById('setting-format').value
        };
        
        tool.config.saveSettings(settings);
      }
      
      // 加载设置
      function loadSettings() {
        const settings = tool.config.loadSettings() || {
          advancedMode: true,
          autoSave: false,
          resultFormat: 'plain'
        };
        
        document.getElementById('setting-option1').checked = settings.advancedMode;
        document.getElementById('setting-option2').checked = settings.autoSave;
        document.getElementById('setting-format').value = settings.resultFormat;
      }
      
      // 重置设置
      function resetSettings() {
        document.getElementById('setting-option1').checked = true;
        document.getElementById('setting-option2').checked = false;
        document.getElementById('setting-format').value = 'plain';
        
        saveSettings();
      }
      
      // 保存当前工具状态
      function saveCurrentSettings() {
        const currentSettings = {
          input: inputField.value,
          number: numberInput.value,
          select: selectInput.value,
          option1: option1.checked,
          option2: option2.checked,
          option3: option3.checked,
          slider: sliderInput.value
        };
        
        localStorage.setItem('toolState_toolId', JSON.stringify(currentSettings));
      }
      
      // 加载上次的工具状态
      function loadLastState() {
        try {
          const lastState = localStorage.getItem('toolState_toolId');
          if (lastState) {
            const state = JSON.parse(lastState);
            inputField.value = state.input || '';
            numberInput.value = state.number || '10';
            selectInput.value = state.select || 'option1';
            option1.checked = state.option1 || false;
            option2.checked = state.option2 || false;
            option3.checked = state.option3 || false;
            sliderInput.value = state.slider || '50';
            sliderValue.textContent = `${sliderInput.value}%`;
          }
        } catch (e) {
          console.error('加载上次状态失败', e);
        }
      }
      
      // 尝试加载上次的状态
      loadLastState();
      
      // 使用说明折叠/展开
      toggleInfoBtn.addEventListener('click', () => {
        const infoContent = container.querySelector('.info-content');
        const isCollapsed = infoContent.style.display === 'none';
        
        infoContent.style.display = isCollapsed ? 'block' : 'none';
        toggleInfoBtn.innerHTML = isCollapsed ? 
          '<i class="fa fa-chevron-up"></i>' : 
          '<i class="fa fa-chevron-down"></i>';
        
        // 保存偏好
        localStorage.setItem('infoCollapsed_toolId', !isCollapsed);
      });
      
      // 检查是否应该折叠说明
      const shouldCollapseInfo = localStorage.getItem('infoCollapsed_toolId') === 'true';
      if (shouldCollapseInfo) {
        const infoContent = container.querySelector('.info-content');
        infoContent.style.display = 'none';
        toggleInfoBtn.innerHTML = '<i class="fa fa-chevron-down"></i>';
      }
      
      // 处理功能
      function processInput() {
        const input = inputField.value.trim();
        if (!input) {
          showToast('请输入内容', 'warning');
          return;
        }
        
        // 显示加载状态
        resultContainer.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i> 正在处理，请稍候...</div>';
        resultStats.style.display = 'none';
        
        // 记录开始时间
        const startTime = performance.now();
        
        // 获取设置
        const settings = tool.config.loadSettings() || {
          advancedMode: true,
          autoSave: false,
          resultFormat: 'plain'
        };
        
        // 模拟异步处理
        setTimeout(() => {
          try {
            // 在这里实现工具的核心功能
            let result = input;
            
            // 获取各种输入值
            const number = parseInt(numberInput.value);
            const selectedOption = selectInput.value;
            const useOption1 = option1.checked;
            const useOption2 = option2.checked;
            const useOption3 = option3.checked;
            const sliderVal = parseInt(sliderInput.value);
            
            // 根据选项处理输入
            if (useOption1) {
              result = result.toUpperCase();
            }
            
            if (useOption2) {
              result = result.split('').reverse().join('');
            }
            
            if (useOption3) {
              result = result.repeat(2);
            }
            
            // 根据选择框选项处理
            if (selectedOption === 'option1') {
              result = `选项一处理: ${result}`;
            } else if (selectedOption === 'option2') {
              result = `选项二处理: ${result}`;
            } else if (selectedOption === 'option3') {
              result = `选项三处理: ${result}`;
            }
            
            // 高级模式处理
            if (settings.advancedMode) {
              // 在这里添加高级处理逻辑
              result = `【多宝工具箱高级处理】\n${result}`;
            }
            
            // 计算处理时间
            const endTime = performance.now();
            const processingTime = Math.round(endTime - startTime);
            
            // 显示结果
            displayResult(result, settings.resultFormat);
            
            // 显示统计信息
            resultStats.style.display = 'flex';
            processTime.textContent = `${processingTime} ms`;
            resultSize.textContent = `${new Blob([result]).size} 字节`;
            
            // 自动保存结果
            if (settings.autoSave) {
              saveResultToLocalStorage(result);
            }
            
            // 保存当前设置
            saveCurrentSettings();
            
            // 显示成功提示
            showToast('处理完成', 'success');
          } catch (error) {
            console.error('处理错误:', error);
            
            // 显示错误
            resultContainer.innerHTML = `
              <div class="error-result">
                <i class="fa fa-exclamation-triangle"></i>
                <p>处理出错: ${error.message}</p>
                <small>如果问题持续存在，请刷新页面或联系支持团队</small>
              </div>
            `;
            
            // 显示错误提示
            showToast('处理失败: ' + error.message, 'error');
          }
        }, 500); // 模拟处理延迟
      }
      
      // 显示结果
      function displayResult(result, format = 'plain') {
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
              showToast('结果不是有效的JSON格式，以纯文本显示', 'warning');
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
        downloadResult.setAttribute('data-type', downloadType);
        downloadResult.setAttribute('data-ext', fileExtension);
        
        // 显示结果
        resultContainer.innerHTML = `
          <div class="result-content">
            <pre>${escapeHtml(formattedResult)}</pre>
          </div>
        `;
        
        // 添加复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn btn-sm btn-outline-secondary copy-btn';
        copyBtn.innerHTML = '<i class="fa fa-copy"></i> 复制结果';
        copyBtn.addEventListener('click', () => {
          copyToClipboard(formattedResult);
          copyBtn.innerHTML = '<i class="fa fa-check"></i> 已复制';
          setTimeout(() => {
            copyBtn.innerHTML = '<i class="fa fa-copy"></i> 复制结果';
          }, 2000);
        });
        
        resultContainer.querySelector('.result-content').appendChild(copyBtn);
      }
      
      // 保存结果到本地存储
      function saveResultToLocalStorage(result) {
        try {
          localStorage.setItem('lastResult_toolId', result);
          localStorage.setItem('lastResultTime_toolId', new Date().toISOString());
        } catch (e) {
          console.error('保存结果失败', e);
          showToast('结果太大，无法自动保存', 'warning');
        }
      }
      
      // 辅助函数：HTML转义
      function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }
      
      // 清空输入和结果
      function clearAll() {
        inputField.value = '';
        numberInput.value = '10';
        selectInput.value = 'option1';
        option1.checked = false;
        option2.checked = false;
        option3.checked = false;
        sliderInput.value = '50';
        sliderValue.textContent = '50%';
        fileInput.value = '';
        fileName.textContent = '未选择文件';
        resultContainer.innerHTML = '<div class="no-result">点击"执行"按钮开始</div>';
      }
      
      // 复制结果
      function copyResultText() {
        const resultContent = resultContainer.querySelector('.result-content');
        if (!resultContent) {
          showToast('没有可复制的结果', 'warning');
          return;
        }
        
        const text = resultContent.textContent;
        copyToClipboard(text);
        showToast('结果已复制到剪贴板', 'success');
      }
      
      // 下载结果
      function downloadResultText() {
        const resultContent = resultContainer.querySelector('.result-content');
        if (!resultContent) {
          showToast('没有可下载的结果', 'warning');
          return;
        }
        
        const text = resultContent.textContent;
        const type = downloadResult.getAttribute('data-type') || 'text/plain';
        const ext = downloadResult.getAttribute('data-ext') || 'txt';
        
        const blob = new Blob([text], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // 生成文件名
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        const toolName = document.querySelector('.tool-header h2').textContent.trim().replace(/[^\w\u4e00-\u9fa5]/g, '_');
        a.download = `多宝工具箱_${toolName}_${timestamp}.${ext}`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('结果已下载', 'success');
      }
      
      // 分享结果
      shareResult.addEventListener('click', () => {
        const resultContent = resultContainer.querySelector('.result-content');
        if (!resultContent) {
          showToast('没有可分享的结果', 'warning');
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
            showToast('分享成功', 'success');
          })
          .catch((error) => {
            console.error('分享失败:', error);
            showToast('分享失败', 'error');
          });
        } else {
          // 如果不支持分享API，则复制链接
          copyToClipboard(window.location.href);
          showToast('链接已复制，请手动分享', 'info');
        }
      });
      
      // 辅助函数：复制到剪贴板
      function copyToClipboard(text) {
        // 优先使用现代剪贴板API
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text)
            .catch(err => {
              console.error('剪贴板API失败，使用备用方法', err);
              fallbackCopyToClipboard(text);
            });
        } else {
          fallbackCopyToClipboard(text);
        }
      }
      
      // 备用复制方法
      function fallbackCopyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('复制失败', err);
          showToast('复制失败，请手动复制', 'error');
        }
        document.body.removeChild(textarea);
      }
      
      // 显示通知提示
      function showToast(message, type = 'info') {
        // 检查是否存在全局toast函数
        if (typeof window.showToast === 'function') {
          window.showToast(message, type);
          return;
        }
        
        // 如果没有全局toast函数，创建一个简单的toast
        let toast = document.getElementById('tool-toast');
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'tool-toast';
          document.body.appendChild(toast);
          
          // 添加样式
          const style = document.createElement('style');
          style.textContent = `
            #tool-toast {
              position: fixed;
              bottom: 20px;
              right: 20px;
              max-width: 300px;
              padding: 10px 15px;
              background-color: #333;
              color: white;
              border-radius: 4px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.2);
              z-index: 9999;
              transition: opacity 0.3s, transform 0.3s;
              opacity: 0;
              transform: translateY(20px);
            }
            #tool-toast.show {
              opacity: 1;
              transform: translateY(0);
            }
            #tool-toast.info { background-color: #3498db; }
            #tool-toast.success { background-color: #2ecc71; }
            #tool-toast.warning { background-color: #f39c12; }
            #tool-toast.error { background-color: #e74c3c; }
          `;
          document.head.appendChild(style);
        }
        
        // 设置消息和类型
        toast.textContent = message;
        toast.className = type;
        
        // 显示toast
        setTimeout(() => {
          toast.classList.add('show');
          
          // 3秒后隐藏
          setTimeout(() => {
            toast.classList.remove('show');
          }, 3000);
        }, 10);
      }
      
      // 键盘快捷键
      inputField.addEventListener('keydown', (e) => {
        // Ctrl+Enter 快捷键执行
        if (e.ctrlKey && e.key === 'Enter') {
          processInput();
        }
      });
      
      // 事件监听
      processBtn.addEventListener('click', processInput);
      clearBtn.addEventListener('click', clearAll);
      copyResult.addEventListener('click', copyResultText);
      downloadResult.addEventListener('click', downloadResultText);
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .tool-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .tool-input-section {
          flex: 1;
          min-width: 300px;
        }
        
        .tool-result-section {
          flex: 1;
          min-width: 300px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-text {
          display: block;
          margin-top: 5px;
          font-size: 12px;
        }
        
        .input-with-unit {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .input-with-unit .unit {
          color: var(--text-muted);
        }
        
        .range-with-value {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .range-with-value input {
          flex: 1;
        }
        
        .file-input-container {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .file-input-container input {
          display: none;
        }
        
        .file-input-label {
          padding: 8px 15px;
          background-color: var(--border-color);
          border-radius: 4px;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .file-input-label:hover {
          background-color: var(--hover-bg);
        }
        
        .options-container {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 10px;
        }
        
        .form-check {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .tool-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }
        
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .result-header h3 {
          margin: 0;
        }
        
        .result-actions {
          display: flex;
          gap: 10px;
        }
        
        .tool-result {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
          min-height: 200px;
        }
        
        .no-result, .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 170px;
          color: var(--text-muted);
        }
        
        .loading i {
          margin-right: 10px;
        }
        
        .error-result {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 170px;
          color: #e74c3c;
          text-align: center;
        }
        
        .error-result i {
          font-size: 32px;
          margin-bottom: 10px;
        }
        
        .result-content {
          overflow-x: auto;
        }
        
        .result-content pre {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-all;
        }
        
        .tool-info {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .info-header {
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .info-header h3 {
          margin: 0;
        }
        
        .info-content {
          padding: 15px;
        }
        
        .info-item {
          margin-bottom: 20px;
        }
        
        .info-item:last-child {
          margin-bottom: 0;
        }
        
        .info-item h4 {
          margin-top: 0;
          margin-bottom: 10px;
        }
        
        .info-item p {
          margin: 0 0 10px 0;
        }
        
        .info-item ul, .info-item ol {
          margin-top: 5px;
          margin-bottom: 5px;
          padding-left: 20px;
        }
        
        @media (max-width: 768px) {
          .tool-container {
            flex-direction: column;
          }
        }
      `;
      container.appendChild(style);
    }
  };
  
  // 注册工具 (注释掉，仅作为模板)
  // window.tools.toolId = tool;
})();