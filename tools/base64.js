/**
 * 多宝工具箱 - Base64编解码工具
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-file-code-o"></i> Base64编解码</h2>
          <p class="tool-description">将文本转换为Base64编码或将Base64编码解码为文本，支持中文和特殊字符。</p>
        </div>
        
        <div class="tool-content">
          <div class="form-group">
            <label for="input-text">输入内容</label>
            <textarea id="input-text" class="form-control" placeholder="请输入需要编码或解码的内容..."></textarea>
          </div>
          
          <div class="form-group">
            <div class="btn-group">
              <button id="encode-btn" class="btn btn-success"><i class="fa fa-lock"></i> 编码</button>
              <button id="decode-btn" class="btn btn-primary"><i class="fa fa-unlock"></i> 解码</button>
              <button id="reset-btn" class="btn btn-secondary"><i class="fa fa-refresh"></i> 重置</button>
              <button id="copy-btn" class="btn"><i class="fa fa-copy"></i> 复制结果</button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="result-text">结果输出</label>
            <textarea id="result-text" class="form-control" placeholder="编码或解码的结果将显示在这里..." readonly></textarea>
          </div>
          
          <div class="info-panel">
            <h4><i class="fa fa-info-circle"></i> 关于Base64</h4>
            <p>Base64是一种基于64个可打印字符来表示二进制数据的表示方法。常用于在处理文本数据的场合，表示、传输、存储一些二进制数据，包括MIME的电子邮件及XML的一些复杂数据。</p>
            <p>使用场景：</p>
            <ul>
              <li>在URL中传输复杂数据</li>
              <li>在XML或JSON中存储二进制数据</li>
              <li>电子邮件附件编码</li>
              <li>简单的数据加密（注意：Base64不是加密算法，只是编码）</li>
            </ul>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('base64', container.querySelector('.tool-header'));
      
      // 获取元素
      const inputText = container.querySelector('#input-text');
      const resultText = container.querySelector('#result-text');
      const encodeBtn = container.querySelector('#encode-btn');
      const decodeBtn = container.querySelector('#decode-btn');
      const resetBtn = container.querySelector('#reset-btn');
      const copyBtn = container.querySelector('#copy-btn');
      
      // 编码
      encodeBtn.addEventListener('click', () => {
        const input = inputText.value;
        if (!input) {
          showToast('请输入需要编码的内容', 'warning');
          return;
        }
        
        try {
          const encoded = btoa(unescape(encodeURIComponent(input)));
          resultText.value = encoded;
          showToast('编码成功', 'success');
        } catch (e) {
          showToast('编码失败: ' + e.message, 'error');
        }
      });
      
      // 解码
      decodeBtn.addEventListener('click', () => {
        const input = inputText.value;
        if (!input) {
          showToast('请输入需要解码的内容', 'warning');
          return;
        }
        
        try {
          const decoded = decodeURIComponent(escape(atob(input)));
          resultText.value = decoded;
          showToast('解码成功', 'success');
        } catch (e) {
          showToast('解码失败: 输入的不是有效的Base64编码', 'error');
        }
      });
      
      // 重置
      resetBtn.addEventListener('click', () => {
        inputText.value = '';
        resultText.value = '';
      });
      
      // 复制结果
      copyBtn.addEventListener('click', () => {
        if (resultText.value) {
          window.copyToClipboard(resultText.value);
        } else {
          showToast('没有可复制的内容', 'warning');
        }
      });
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .btn-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        textarea.form-control {
          min-height: 120px;
          font-family: monospace;
        }
        
        .info-panel {
          margin-top: 30px;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
        }
        
        .info-panel h4 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 16px;
        }
        
        .info-panel p {
          margin-bottom: 10px;
          font-size: 14px;
        }
        
        .info-panel ul {
          padding-left: 20px;
          margin-bottom: 0;
        }
        
        .info-panel li {
          margin-bottom: 5px;
          font-size: 14px;
        }
      `;
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.base64 = tool;
})();
