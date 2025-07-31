/**
 * 二维码生成器
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-qrcode"></i> 二维码生成器</h2>
          <p class="tool-description">生成自定义二维码，支持多种格式和样式。</p>
        </div>
        
        <div class="qrcode-container">
          <div class="qrcode-form">
            <div class="form-group">
              <label for="qr-content">二维码内容</label>
              <textarea id="qr-content" class="form-control" placeholder="输入文本、网址或其他内容..."></textarea>
            </div>
            
            <div class="form-group">
              <label>二维码类型</label>
              <div class="qr-type-selector">
                <label class="qr-type-option">
                  <input type="radio" name="qr-type" value="text" checked />
                  <span class="qr-type-icon"><i class="fa fa-font"></i></span>
                  <span class="qr-type-text">文本</span>
                </label>
                <label class="qr-type-option">
                  <input type="radio" name="qr-type" value="url" />
                  <span class="qr-type-icon"><i class="fa fa-link"></i></span>
                  <span class="qr-type-text">网址</span>
                </label>
                <label class="qr-type-option">
                  <input type="radio" name="qr-type" value="email" />
                  <span class="qr-type-icon"><i class="fa fa-envelope"></i></span>
                  <span class="qr-type-text">邮箱</span>
                </label>
                <label class="qr-type-option">
                  <input type="radio" name="qr-type" value="phone" />
                  <span class="qr-type-icon"><i class="fa fa-phone"></i></span>
                  <span class="qr-type-text">电话</span>
                </label>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group half">
                <label for="qr-size">二维码大小</label>
                <div class="range-with-value">
                  <input type="range" id="qr-size" min="100" max="400" value="200" step="10" />
                  <span id="qr-size-value">200 x 200</span>
                </div>
              </div>
              
              <div class="form-group half">
                <label for="qr-correction">纠错级别</label>
                <select id="qr-correction" class="form-control">
                  <option value="L">低 (7%)</option>
                  <option value="M" selected>中 (15%)</option>
                  <option value="Q">高 (25%)</option>
                  <option value="H">最高 (30%)</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group half">
                <label for="qr-color">前景色</label>
                <input type="color" id="qr-color" value="#000000" class="color-picker" />
              </div>
              
              <div class="form-group half">
                <label for="qr-bg-color">背景色</label>
                <input type="color" id="qr-bg-color" value="#ffffff" class="color-picker" />
              </div>
            </div>
            
            <div class="form-group">
              <label for="qr-logo">添加Logo (可选)</label>
              <div class="file-input-container">
                <input type="file" id="qr-logo" accept="image/*" />
                <label for="qr-logo" class="file-input-label">
                  <i class="fa fa-upload"></i> 选择图片
                </label>
                <span id="qr-logo-name">未选择文件</span>
                <button id="qr-logo-clear" class="btn btn-sm btn-secondary" style="display: none;">
                  <i class="fa fa-times"></i> 移除
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <button id="generate-btn" class="btn btn-success"><i class="fa fa-refresh"></i> 生成二维码</button>
              <button id="reset-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 重置</button>
            </div>
          </div>
          
          <div class="qrcode-result">
            <div class="qrcode-preview">
              <div id="qrcode"></div>
            </div>
            
            <div class="qrcode-actions">
              <button id="download-png" class="btn"><i class="fa fa-download"></i> 下载PNG</button>
              <button id="download-svg" class="btn"><i class="fa fa-download"></i> 下载SVG</button>
              <button id="copy-btn" class="btn"><i class="fa fa-copy"></i> 复制图像</button>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('qrCodeGenerator', container.querySelector('.tool-header'));
      
      // 获取元素
      const contentInput = container.querySelector('#qr-content');
      const sizeInput = container.querySelector('#qr-size');
      const sizeValue = container.querySelector('#qr-size-value');
      const correctionInput = container.querySelector('#qr-correction');
      const colorInput = container.querySelector('#qr-color');
      const bgColorInput = container.querySelector('#qr-bg-color');
      const logoInput = container.querySelector('#qr-logo');
      const logoName = container.querySelector('#qr-logo-name');
      const logoClear = container.querySelector('#qr-logo-clear');
      const generateBtn = container.querySelector('#generate-btn');
      const resetBtn = container.querySelector('#reset-btn');
      const qrcodeContainer = container.querySelector('#qrcode');
      const downloadPng = container.querySelector('#download-png');
      const downloadSvg = container.querySelector('#download-svg');
      const copyBtn = container.querySelector('#copy-btn');
      const typeRadios = container.querySelectorAll('input[name="qr-type"]');
      
      // 初始状态
      let qrcode = null;
      let logoImage = null;
      
      // 更新大小显示
      sizeInput.addEventListener('input', () => {
        sizeValue.textContent = `${sizeInput.value} x ${sizeInput.value}`;
      });
      
      // 处理Logo上传
      logoInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          logoName.textContent = file.name;
          logoClear.style.display = 'inline-block';
          
          const reader = new FileReader();
          reader.onload = (event) => {
            logoImage = new Image();
            logoImage.src = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
      
      // 清除Logo
      logoClear.addEventListener('click', () => {
        logoInput.value = '';
        logoName.textContent = '未选择文件';
        logoClear.style.display = 'none';
        logoImage = null;
      });
      
      // 类型选择
      typeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
          const type = radio.value;
          let placeholder = '';
          
          switch (type) {
            case 'text':
              placeholder = '输入文本、网址或其他内容...';
              break;
            case 'url':
              placeholder = '输入网址，例如：https://www.example.com';
              break;
            case 'email':
              placeholder = '输入邮箱地址，例如：example@mail.com';
              break;
            case 'phone':
              placeholder = '输入电话号码，例如：+86 123 4567 8901';
              break;
          }
          
          contentInput.placeholder = placeholder;
        });
      });
      
      // 生成二维码
      generateBtn.addEventListener('click', () => {
        const content = contentInput.value.trim();
        if (!content) {
          showToast('请输入二维码内容', 'warning');
          return;
        }
        
        // 根据类型格式化内容
        let formattedContent = content;
        const type = document.querySelector('input[name="qr-type"]:checked').value;
        
        switch (type) {
          case 'url':
            if (!content.match(/^https?:\/\//i)) {
              formattedContent = 'https://' + content;
            }
            break;
          case 'email':
            if (!content.match(/^mailto:/i)) {
              formattedContent = 'mailto:' + content;
            }
            break;
          case 'phone':
            if (!content.match(/^tel:/i)) {
              formattedContent = 'tel:' + content.replace(/\s+/g, '');
            }
            break;
        }
        
        // 获取参数
        const size = parseInt(sizeInput.value);
        const correction = correctionInput.value;
        const color = colorInput.value;
        const bgColor = bgColorInput.value;
        
        // 清空容器
        qrcodeContainer.innerHTML = '';
        
        // 创建二维码
        qrcode = new QRCode(qrcodeContainer, {
          text: formattedContent,
          width: size,
          height: size,
          colorDark: color,
          colorLight: bgColor,
          correctLevel: QRCode.CorrectLevel[correction]
        });
        
        // 如果有Logo，添加到二维码中心
        if (logoImage) {
          setTimeout(() => {
            const canvas = qrcodeContainer.querySelector('canvas');
            if (canvas) {
              const ctx = canvas.getContext('2d');
              const logoSize = size * 0.2; // Logo大小为二维码的20%
              const logoX = (size - logoSize) / 2;
              const logoY = (size - logoSize) / 2;
              
              // 绘制白色背景
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
              
              // 绘制Logo
              ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
            }
          }, 100);
        }
        
        // 显示下载按钮
        downloadPng.disabled = false;
        downloadSvg.disabled = false;
        copyBtn.disabled = false;
      });
      
      // 重置
      resetBtn.addEventListener('click', () => {
        contentInput.value = '';
        sizeInput.value = 200;
        sizeValue.textContent = '200 x 200';
        correctionInput.value = 'M';
        colorInput.value = '#000000';
        bgColorInput.value = '#FFFFFF';
        logoInput.value = '';
        logoName.textContent = '未选择文件';
        logoClear.style.display = 'none';
        logoImage = null;
        document.querySelector('input[value="text"]').checked = true;
        contentInput.placeholder = '输入文本、网址或其他内容...';
        qrcodeContainer.innerHTML = '';
      });
      
      // 下载PNG
      downloadPng.addEventListener('click', () => {
        const canvas = qrcodeContainer.querySelector('canvas');
        if (!canvas) {
          showToast('请先生成二维码', 'warning');
          return;
        }
        
        const dataURL = canvas.toDataURL('image/png');
        downloadImage(dataURL, 'qrcode.png');
      });
      
      // 下载SVG
      downloadSvg.addEventListener('click', () => {
        const canvas = qrcodeContainer.querySelector('canvas');
        if (!canvas) {
          showToast('请先生成二维码', 'warning');
          return;
        }
        
        // 将Canvas转换为SVG
        const size = parseInt(sizeInput.value);
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;
        
        let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
        
        // 背景
        svgContent += `<rect width="${size}" height="${size}" fill="${bgColorInput.value}" />`;
        
        // 像素
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const index = (y * size + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];
            
            // 如果是黑色像素
            if (r === 0 && g === 0 && b === 0 && a === 255) {
              svgContent += `<rect x="${x}" y="${y}" width="1" height="1" fill="${colorInput.value}" />`;
            }
          }
        }
        
        svgContent += '</svg>';
        
        // 下载SVG
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        downloadImage(url, 'qrcode.svg');
        URL.revokeObjectURL(url);
      });
      
      // 复制图像
      copyBtn.addEventListener('click', () => {
        const canvas = qrcodeContainer.querySelector('canvas');
        if (!canvas) {
          showToast('请先生成二维码', 'warning');
          return;
        }
        
        canvas.toBlob(blob => {
          try {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(() => {
              showToast('已复制到剪贴板', 'success');
            }).catch(err => {
              showToast('复制失败: ' + err, 'error');
            });
          } catch (e) {
            showToast('您的浏览器不支持图像复制', 'error');
          }
        });
      });
      
      // 下载图像
      function downloadImage(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showToast(`已下载 ${filename}`, 'success');
      }
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .qrcode-container {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
        }
        
        .qrcode-form {
          flex: 1;
          min-width: 300px;
        }
        
        .qrcode-result {
          flex: 1;
          min-width: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        
        .qrcode-preview {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 240px;
          min-width: 240px;
        }
        
        .qrcode-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .form-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .form-group.half {
          flex: 1;
          min-width: 150px;
        }
        
        .range-with-value {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .range-with-value input {
          flex: 1;
        }
        
        .range-with-value span {
          min-width: 80px;
          text-align: right;
          color: var(--text-muted);
        }
        
        .color-picker {
          width: 100%;
          height: 40px;
          padding: 0;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          cursor: pointer;
        }
        
        .qr-type-selector {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }
        
        .qr-type-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }
        
        .qr-type-option input {
          position: absolute;
          opacity: 0;
        }
        
        .qr-type-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: var(--text-muted);
          transition: var(--transition);
        }
        
        .qr-type-option input:checked + .qr-type-icon {
          background-color: var(--primary-color);
          color: white;
        }
        
        .qr-type-text {
          margin-top: 8px;
          font-size: 14px;
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
        
        #qr-logo-name {
          color: var(--text-muted);
          font-size: 14px;
        }
        
        #qrcode {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        #qrcode img {
          max-width: 100%;
          height: auto;
        }
        
        @media (max-width: 768px) {
          .qrcode-container {
            flex-direction: column;
          }
        }
      `;
      container.appendChild(style);
      
      // 加载QRCode库
      if (!window.QRCode) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
        document.head.appendChild(script);
        
        script.onload = () => {
          showToast('QRCode库加载成功', 'success');
        };
        
        script.onerror = () => {
          showToast('QRCode库加载失败，请检查网络连接', 'error');
        };
      }
    }
  };
  
  // 注册工具
  window.tools.qrCodeGenerator = tool;
})();