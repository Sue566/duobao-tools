/**
 * 多宝工具箱 - 二维码扫描器
 */
(function() {
  // 定义工具
  const tool = {
    // 工具初始化时调用
    init: function() {
      // 加载二维码扫描库
      if (!window.QrScanner) {
        console.log('正在加载二维码扫描库...');
        
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/qr-scanner@1.4.2/qr-scanner.min.js';
          document.head.appendChild(script);
          
          script.onload = () => {
            console.log('二维码扫描库加载成功');
            resolve();
          };
          
          script.onerror = () => {
            console.error('二维码扫描库加载失败');
            showToast('组件加载失败，请刷新页面重试', 'error');
            resolve();
          };
        });
      }
    },
    
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-qrcode"></i> 二维码扫描器</h2>
          <p class="tool-description">扫描二维码并解析其中的内容，支持从摄像头、图片文件或屏幕截图中识别二维码。</p>
        </div>
        
        <div class="tool-container">
          <!-- 扫描区域 -->
          <div class="tool-input-section">
            <div class="scan-options">
              <button id="start-camera" class="btn btn-primary"><i class="fa fa-camera"></i> 打开摄像头</button>
              <button id="stop-camera" class="btn btn-secondary" style="display: none;"><i class="fa fa-stop"></i> 停止扫描</button>
              <div class="or-divider">或</div>
              <div class="file-input-container">
                <input type="file" id="qr-file" accept="image/*" />
                <label for="qr-file" class="btn"><i class="fa fa-file-image-o"></i> 从图片文件扫描</label>
              </div>
            </div>
            
            <div id="scanner-container" class="scanner-container">
              <div class="camera-placeholder">
                <i class="fa fa-camera"></i>
                <p>点击"打开摄像头"按钮开始扫描</p>
                <small>或者上传包含二维码的图片</small>
              </div>
              <video id="qr-video" style="display: none;"></video>
              <div class="scan-region-highlight"></div>
              <div class="scan-region-highlight-svg"></div>
            </div>
            
            <div class="scanner-controls" style="display: none;">
              <div class="form-group">
                <label for="camera-select">选择摄像头</label>
                <select id="camera-select" class="form-control"></select>
              </div>
              <div class="form-group">
                <label>扫描设置</label>
                <div class="options-container">
                  <div class="form-check">
                    <input type="checkbox" id="option-mirror" />
                    <label for="option-mirror">镜像模式</label>
                  </div>
                  <div class="form-check">
                    <input type="checkbox" id="option-highlight" checked />
                    <label for="option-highlight">高亮显示二维码</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 结果区域 -->
          <div class="tool-result-section">
            <div class="result-header">
              <h3><i class="fa fa-check-circle"></i> 扫描结果</h3>
              <div class="result-actions">
                <button id="copy-result" class="btn btn-sm btn-outline"><i class="fa fa-copy"></i> 复制</button>
                <button id="open-link" class="btn btn-sm btn-outline" style="display: none;"><i class="fa fa-external-link"></i> 打开链接</button>
                <button id="clear-result" class="btn btn-sm btn-outline"><i class="fa fa-trash-o"></i> 清空</button>
              </div>
            </div>
            
            <div class="tool-result" id="scan-result">
              <div class="no-result">
                <i class="fa fa-info-circle"></i>
                <p>扫描结果将显示在这里</p>
              </div>
            </div>
            
            <div class="scan-history" id="history-container" style="display: none;">
              <h4><i class="fa fa-history"></i> 扫描历史</h4>
              <div id="history-list" class="history-list"></div>
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
              <p>二维码扫描器可以帮助您快速识别二维码中的内容，支持多种扫描方式，适用于各种需要解码二维码的场景。</p>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-list-ol"></i> 使用步骤</h4>
              <ol>
                <li><strong>使用摄像头扫描</strong> - 点击"打开摄像头"按钮，将二维码对准摄像头</li>
                <li><strong>从图片文件扫描</strong> - 点击"从图片文件扫描"按钮，选择包含二维码的图片</li>
                <li><strong>查看结果</strong> - 扫描成功后，结果将显示在右侧区域</li>
                <li><strong>处理结果</strong> - 可以复制结果文本，如果是链接还可以直接打开</li>
              </ol>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-lightbulb-o"></i> 使用技巧</h4>
              <ul>
                <li>确保二维码清晰可见，避免反光或阴影</li>
                <li>如果有多个摄像头，可以在设置中切换</li>
                <li>对于较小的二维码，可以将摄像头靠近一些</li>
                <li>系统会保存扫描历史，方便查看之前的结果</li>
              </ul>
            </div>
            
            <div class="info-item">
              <h4><i class="fa fa-exclamation-triangle"></i> 注意事项</h4>
              <ul>
                <li>使用摄像头功能需要您授予浏览器摄像头访问权限</li>
                <li>扫描结果仅在本地处理，不会上传到服务器</li>
                <li>对于复杂或损坏的二维码，可能无法正确识别</li>
                <li>请谨慎打开扫描结果中的链接，确保来源可信</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('qrCodeScanner', container.querySelector('.tool-header'));
      
      // 获取元素
      const startCameraBtn = container.querySelector('#start-camera');
      const stopCameraBtn = container.querySelector('#stop-camera');
      const qrFileInput = container.querySelector('#qr-file');
      const scannerContainer = container.querySelector('#scanner-container');
      const qrVideo = container.querySelector('#qr-video');
      const cameraSelect = container.querySelector('#camera-select');
      const scannerControls = container.querySelector('.scanner-controls');
      const optionMirror = container.querySelector('#option-mirror');
      const optionHighlight = container.querySelector('#option-highlight');
      const resultContainer = container.querySelector('#scan-result');
      const copyResultBtn = container.querySelector('#copy-result');
      const openLinkBtn = container.querySelector('#open-link');
      const clearResultBtn = container.querySelector('#clear-result');
      const historyContainer = container.querySelector('#history-container');
      const historyList = container.querySelector('#history-list');
      const toggleInfoBtn = container.querySelector('.toggle-info-btn');
      
      // 二维码扫描器实例
      let qrScanner = null;
      
      // 检查是否支持摄像头
      const hasCamera = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
      if (!hasCamera) {
        startCameraBtn.disabled = true;
        startCameraBtn.title = '您的浏览器不支持摄像头功能';
        startCameraBtn.innerHTML = '<i class="fa fa-camera"></i> 摄像头不可用';
      }
      
      // 初始化扫描器
      function initScanner() {
        if (!window.QrScanner) {
          showToast('二维码扫描库未加载，请刷新页面重试', 'error');
          return;
        }
        
        // 创建扫描器实例
        qrScanner = new QrScanner(
          qrVideo,
          result => {
            handleScanResult(result.data);
          },
          {
            highlightScanRegion: optionHighlight.checked,
            highlightCodeOutline: optionHighlight.checked,
          }
        );
        
        // 获取可用摄像头
        QrScanner.listCameras().then(cameras => {
          cameras.forEach(camera => {
            const option = document.createElement('option');
            option.value = camera.id;
            option.text = camera.label || `摄像头 ${cameraSelect.options.length + 1}`;
            cameraSelect.add(option);
          });
          
          if (cameras.length > 0) {
            cameraSelect.disabled = false;
          }
        });
      }
      
      // 处理扫描结果
      function handleScanResult(result) {
        if (!result) return;
        
        // 显示结果
        resultContainer.innerHTML = `
          <div class="result-content">
            <div class="result-type">
              ${isUrl(result) ? '<i class="fa fa-link"></i> 网址链接' : '<i class="fa fa-file-text-o"></i> 文本内容'}
            </div>
            <div class="result-text">${escapeHtml(result)}</div>
          </div>
        `;
        
        // 如果是链接，显示打开链接按钮
        if (isUrl(result)) {
          openLinkBtn.style.display = 'inline-flex';
          openLinkBtn.onclick = () => {
            window.open(result, '_blank');
          };
        } else {
          openLinkBtn.style.display = 'none';
        }
        
        // 添加到历史记录
        addToHistory(result);
        
        // 如果是使用文件扫描，扫描完成后停止
        if (!qrScanner || !qrScanner.isScanning) {
          showToast('扫描成功', 'success');
        }
      }
      
      // 判断是否是URL
      function isUrl(text) {
        try {
          new URL(text);
          return true;
        } catch {
          return false;
        }
      }
      
      // 开始摄像头扫描
      startCameraBtn.addEventListener('click', () => {
        if (!qrScanner) {
          initScanner();
        }
        
        // 显示视频元素
        qrVideo.style.display = 'block';
        scannerContainer.querySelector('.camera-placeholder').style.display = 'none';
        
        // 开始扫描
        qrScanner.start().then(() => {
          startCameraBtn.style.display = 'none';
          stopCameraBtn.style.display = 'inline-flex';
          scannerControls.style.display = 'block';
        }).catch(err => {
          console.error('启动摄像头失败:', err);
          showToast('无法访问摄像头，请确保已授予权限', 'error');
          qrVideo.style.display = 'none';
          scannerContainer.querySelector('.camera-placeholder').style.display = 'flex';
        });
      });
      
      // 停止摄像头扫描
      stopCameraBtn.addEventListener('click', () => {
        if (qrScanner) {
          qrScanner.stop();
        }
        
        qrVideo.style.display = 'none';
        scannerContainer.querySelector('.camera-placeholder').style.display = 'flex';
        startCameraBtn.style.display = 'inline-flex';
        stopCameraBtn.style.display = 'none';
        scannerControls.style.display = 'none';
      });
      
      // 切换摄像头
      cameraSelect.addEventListener('change', () => {
        if (qrScanner) {
          qrScanner.setCamera(cameraSelect.value);
        }
      });
      
      // 镜像模式切换
      optionMirror.addEventListener('change', () => {
        if (qrVideo) {
          qrVideo.style.transform = optionMirror.checked ? 'scaleX(-1)' : '';
        }
      });
      
      // 高亮显示切换
      optionHighlight.addEventListener('change', () => {
        if (qrScanner) {
          qrScanner.setHighlightScanRegion(optionHighlight.checked);
          qrScanner.setHighlightCodeOutline(optionHighlight.checked);
        }
      });
      
      // 从文件扫描
      qrFileInput.addEventListener('change', async (e) => {
        if (!e.target.files || !e.target.files[0]) return;
        
        const file = e.target.files[0];
        
        try {
          resultContainer.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i> 正在扫描，请稍候...</div>';
          
          if (!window.QrScanner) {
            await tool.init();
          }
          
          const result = await QrScanner.scanImage(file);
          handleScanResult(result);
        } catch (error) {
          console.error('扫描图片失败:', error);
          resultContainer.innerHTML = `
            <div class="error-result">
              <i class="fa fa-exclamation-triangle"></i>
              <p>无法识别二维码</p>
              <small>请确保图片清晰且包含有效的二维码</small>
            </div>
          `;
          showToast('扫描失败: 未能识别二维码', 'error');
        } finally {
          // 清空文件输入，以便可以重新选择同一文件
          qrFileInput.value = '';
        }
      });
      
      // 复制结果
      copyResultBtn.addEventListener('click', () => {
        const resultText = resultContainer.querySelector('.result-text');
        if (!resultText) {
          showToast('没有可复制的结果', 'warning');
          return;
        }
        
        window.copyToClipboard(resultText.textContent);
        showToast('结果已复制到剪贴板', 'success');
      });
      
      // 清空结果
      clearResultBtn.addEventListener('click', () => {
        resultContainer.innerHTML = `
          <div class="no-result">
            <i class="fa fa-info-circle"></i>
            <p>扫描结果将显示在这里</p>
          </div>
        `;
        openLinkBtn.style.display = 'none';
      });
      
      // 添加到历史记录
      function addToHistory(result) {
        try {
          // 获取历史记录
          let history = JSON.parse(localStorage.getItem('qrScanHistory')) || [];
          
          // 检查是否已存在相同结果
          const exists = history.some(item => item.result === result);
          if (exists) return;
          
          // 添加新记录
          const newRecord = {
            id: Date.now(),
            result: result,
            type: isUrl(result) ? 'url' : 'text',
            timestamp: new Date().toISOString()
          };
          
          // 添加到开头
          history.unshift(newRecord);
          
          // 限制数量
          if (history.length > 10) {
            history = history.slice(0, 10);
          }
          
          // 保存历史记录
          localStorage.setItem('qrScanHistory', JSON.stringify(history));
          
          // 更新历史记录显示
          updateHistoryDisplay(history);
        } catch (e) {
          console.error('保存历史记录失败', e);
        }
      }
      
      // 更新历史记录显示
      function updateHistoryDisplay(history) {
        if (!history || history.length === 0) {
          historyContainer.style.display = 'none';
          return;
        }
        
        historyContainer.style.display = 'block';
        historyList.innerHTML = '';
        
        history.forEach(record => {
          const item = document.createElement('div');
          item.className = 'history-item';
          
          const isLink = record.type === 'url';
          const displayText = record.result.length > 40 ? record.result.substring(0, 40) + '...' : record.result;
          
          item.innerHTML = `
            <div class="history-content">
              <div class="history-text">
                <div class="history-type">
                  ${isLink ? '<i class="fa fa-link"></i> 链接' : '<i class="fa fa-file-text-o"></i> 文本'}
                </div>
                <div class="history-result">${escapeHtml(displayText)}</div>
              </div>
              <div class="history-meta">
                <span class="history-time">${formatTime(record.timestamp)}</span>
              </div>
            </div>
            <div class="history-actions">
              <button class="btn-icon history-use" title="使用此结果" data-id="${record.id}">
                <i class="fa fa-reply"></i>
              </button>
              <button class="btn-icon history-delete" title="删除记录" data-id="${record.id}">
                <i class="fa fa-times"></i>
              </button>
            </div>
          `;
          
          historyList.appendChild(item);
        });
        
        // 添加使用历史记录事件
        historyList.querySelectorAll('.history-use').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const record = history.find(r => r.id == id);
            if (record) {
              handleScanResult(record.result);
            }
          });
        });
        
        // 添加删除历史记录事件
        historyList.querySelectorAll('.history-delete').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const newHistory = history.filter(r => r.id != id);
            
            // 保存更新后的历史记录
            localStorage.setItem('qrScanHistory', JSON.stringify(newHistory));
            
            // 更新显示
            updateHistoryDisplay(newHistory);
            
            showToast('已删除历史记录', 'info');
          });
        });
      }
      
      // 格式化时间
      function formatTime(timestamp) {
        try {
          const date = new Date(timestamp);
          const now = new Date();
          const diff = now - date;
          
          // 一分钟内
          if (diff < 60 * 1000) {
            return '刚刚';
          }
          
          // 一小时内
          if (diff < 60 * 60 * 1000) {
            return `${Math.floor(diff / (60 * 1000))}分钟前`;
          }
          
          // 一天内
          if (diff < 24 * 60 * 60 * 1000) {
            return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
          }
          
          // 一周内
          if (diff < 7 * 24 * 60 * 60 * 1000) {
            return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`;
          }
          
          // 其他情况显示日期
          return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        } catch (e) {
          return '未知时间';
        }
      }
      
      // HTML转义
      function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }
      
      // 加载历史记录
      try {
        const history = JSON.parse(localStorage.getItem('qrScanHistory')) || [];
        updateHistoryDisplay(history);
      } catch (e) {
        console.error('加载历史记录失败', e);
      }
      
      // 使用说明折叠/展开
      toggleInfoBtn.addEventListener('click', () => {
        const infoContent = container.querySelector('.info-content');
        const isCollapsed = infoContent.style.display === 'none';
        
        infoContent.style.display = isCollapsed ? 'block' : 'none';
        toggleInfoBtn.innerHTML = isCollapsed ? 
          '<i class="fa fa-chevron-up"></i>' : 
          '<i class="fa fa-chevron-down"></i>';
        
        // 保存偏好
        localStorage.setItem('infoCollapsed_qrCodeScanner', !isCollapsed);
      });
      
      // 检查是否应该折叠说明
      const shouldCollapseInfo = localStorage.getItem('infoCollapsed_qrCodeScanner') === 'true';
      if (shouldCollapseInfo) {
        const infoContent = container.querySelector('.info-content');
        infoContent.style.display = 'none';
        toggleInfoBtn.innerHTML = '<i class="fa fa-chevron-down"></i>';
      }
      
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
        
        .scan-options {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .or-divider {
          color: var(--text-muted);
          font-size: 14px;
        }
        
        .file-input-container {
          position: relative;
          overflow: hidden;
        }
        
        .file-input-container input[type="file"] {
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        
        .scanner-container {
          position: relative;
          width: 100%;
          height: 300px;
          background-color: #000;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 20px;
        }
        
        .camera-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #fff;
          text-align: center;
          padding: 20px;
        }
        
        .camera-placeholder i {
          font-size: 48px;
          margin-bottom: 15px;
          opacity: 0.7;
        }
        
        .camera-placeholder p {
          margin: 0 0 10px 0;
          font-size: 16px;
        }
        
        .camera-placeholder small {
          opacity: 0.7;
        }
        
        #qr-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .scan-region-highlight {
          border: 2px solid rgba(255, 255, 255, 0.5);
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200px;
          height: 200px;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        
        .scanner-controls {
          margin-top: 20px;
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
        
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
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
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 170px;
          color: var(--text-muted);
          text-align: center;
        }
        
        .loading i {
          font-size: 24px;
          margin-bottom: 10px;
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
          padding: 10px;
        }
        
        .result-type {
          font-weight: bold;
          margin-bottom: 10px;
          color: var(--primary-color);
        }
        
        .result-text {
          word-break: break-all;
          white-space: pre-wrap;
          background-color: var(--bg-color);
          padding: 10px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          max-height: 200px;
          overflow-y: auto;
        }
        
        .scan-history {
          margin-top: 20px;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
        }
        
        .scan-history h4 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 16px;
        }
        
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background-color: var(--bg-color);
        }
        
        .history-content {
          flex: 1;
          overflow: hidden;
        }
        
        .history-type {
          font-size: 12px;
          color: var(--primary-color);
          margin-bottom: 5px;
        }
        
        .history-result {
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .history-meta {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 5px;
        }
        
        .history-actions {
          display: flex;
          gap: 5px;
        }
        
        .btn-icon {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          background-color: var(--border-color);
          border: none;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .btn-icon:hover {
          background-color: var(--hover-bg);
        }
        
        .tool-info {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
          margin-top: 20px;
        }
        
        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .info-header h3 {
          margin: 0;
        }
        
        .toggle-info-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-color);
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
          
          .scanner-container {
            height: 250px;
          }
        }
      `;
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.qrCodeScanner = tool;
})();
