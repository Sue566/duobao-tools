/**
 * IP地址查询工具
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-globe"></i> IP地址查询</h2>
          <p class="tool-description">查询IP地址的地理位置和网络信息。</p>
        </div>
        
        <div class="form-group">
          <label for="ip-input">IP地址</label>
          <div class="input-group">
            <input type="text" id="ip-input" class="form-control" placeholder="输入IP地址，如：8.8.8.8" />
            <button id="query-btn" class="btn btn-success"><i class="fa fa-search"></i> 查询</button>
            <button id="my-ip-btn" class="btn"><i class="fa fa-user"></i> 我的IP</button>
          </div>
        </div>
        
        <div id="result-container" style="display: none;">
          <div class="result-card">
            <h3>查询结果</h3>
            <div id="ip-result">
              <div class="loading">
                <i class="fa fa-spinner fa-spin"></i> 正在查询...
              </div>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('ipLookup', container.querySelector('.tool-header'));
      
      // 获取元素
      const ipInput = container.querySelector('#ip-input');
      const queryBtn = container.querySelector('#query-btn');
      const myIpBtn = container.querySelector('#my-ip-btn');
      const resultContainer = container.querySelector('#result-container');
      const ipResult = container.querySelector('#ip-result');
      
      // 查询IP信息
      queryBtn.addEventListener('click', () => {
        const ip = ipInput.value.trim();
        if (!ip) {
          showToast('请输入IP地址', 'warning');
          return;
        }
        
        // 显示结果容器和加载状态
        resultContainer.style.display = 'block';
        ipResult.innerHTML = `<div class="loading"><i class="fa fa-spinner fa-spin"></i> 正在查询...</div>`;
        
        // 模拟API请求
        setTimeout(() => {
          queryIpInfo(ip);
        }, 800);
      });
      
      // 获取我的IP
      myIpBtn.addEventListener('click', () => {
        ipInput.value = '';
        ipInput.placeholder = '正在获取您的IP...';
        myIpBtn.disabled = true;
        
        // 模拟API请求
        setTimeout(() => {
          // 这里应该是真实的API调用，这里只是模拟
          const myIp = generateRandomIp();
          ipInput.value = myIp;
          ipInput.placeholder = '输入IP地址，如：8.8.8.8';
          myIpBtn.disabled = false;
          
          // 自动查询
          queryBtn.click();
        }, 1000);
      });
      
      // 按回车键查询
      ipInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          queryBtn.click();
        }
      });
      
      // 查询IP信息
      function queryIpInfo(ip) {
        // 这里应该是真实的API调用，这里只是模拟
        const isPrivate = isPrivateIp(ip);
        
        if (isPrivate) {
          // 私有IP
          ipResult.innerHTML = `
            <div class="alert alert-info">
              <i class="fa fa-info-circle"></i> ${ip} 是私有IP地址，不能获取地理位置信息。
            </div>
            <div class="ip-info-table">
              <table>
                <tr>
                  <th>IP地址</th>
                  <td>${ip}</td>
                </tr>
                <tr>
                  <th>类型</th>
                  <td>私有IP</td>
                </tr>
                <tr>
                  <th>网络</th>
                  <td>局域网</td>
                </tr>
              </table>
            </div>
          `;
        } else {
          // 公网IP，生成模拟数据
          const country = ['中国', '美国', '日本', '德国', '英国', '法国', '俄罗斯', '加拿大'][Math.floor(Math.random() * 8)];
          const city = {
            '中国': ['北京', '上海', '广州', '深圳', '杭州', '成都'][Math.floor(Math.random() * 6)],
            '美国': ['纽约', '洛杉矶', '芝加哥', '休斯顿', '西雅图'][Math.floor(Math.random() * 5)],
            '日本': ['东京', '大阪', '京都', '名古屋'][Math.floor(Math.random() * 4)],
            '德国': ['柏林', '慕尼黑', '汉堡', '科隆'][Math.floor(Math.random() * 4)],
            '英国': ['伦敦', '曼彻斯特', '利物浦', '爱丁堡'][Math.floor(Math.random() * 4)],
            '法国': ['巴黎', '马赛', '里昂', '波尔多'][Math.floor(Math.random() * 4)],
            '俄罗斯': ['莫斯科', '圣彼得堡', '新西伯利亚', '喀山'][Math.floor(Math.random() * 4)],
            '加拿大': ['多伦多', '温哥华', '蒙特利尔', '渥太华'][Math.floor(Math.random() * 4)]
          }[country];
          
          const isp = ['电信', '联通', '移动', '谷歌', '亚马逊', '微软', 'Cloudflare'][Math.floor(Math.random() * 7)];
          const latitude = (Math.random() * 180 - 90).toFixed(6);
          const longitude = (Math.random() * 360 - 180).toFixed(6);
          
          ipResult.innerHTML = `
            <div class="ip-info-table">
              <table>
                <tr>
                  <th>IP地址</th>
                  <td>${ip}</td>
                </tr>
                <tr>
                  <th>国家/地区</th>
                  <td>${country}</td>
                </tr>
                <tr>
                  <th>城市</th>
                  <td>${city}</td>
                </tr>
                <tr>
                  <th>ISP</th>
                  <td>${isp}</td>
                </tr>
                <tr>
                  <th>经纬度</th>
                  <td>${latitude}, ${longitude}</td>
                </tr>
              </table>
            </div>
            <div class="map-placeholder">
              <div class="map-info">
                <i class="fa fa-map-marker"></i> 地图加载中...
              </div>
            </div>
          `;
        }
      }
      
      // 判断是否为私有IP
      function isPrivateIp(ip) {
        // 简单判断，实际应该使用更准确的方法
        return ip.startsWith('10.') || 
               ip.startsWith('192.168.') || 
               ip.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./);
      }
      
      // 生成随机IP
      function generateRandomIp() {
        return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
      }
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .input-group {
          display: flex;
          gap: 10px;
        }
        
        .result-card {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
        }
        
        .result-card h3 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;
        }
        
        .loading {
          text-align: center;
          padding: 20px;
          color: var(--text-muted);
        }
        
        .alert {
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .alert-info {
          background-color: rgba(23, 162, 184, 0.1);
          border: 1px solid rgba(23, 162, 184, 0.2);
          color: var(--info-color);
        }
        
        .ip-info-table table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .ip-info-table th, .ip-info-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }
        
        .ip-info-table th {
          width: 120px;
          color: var(--text-muted);
        }
        
        .map-placeholder {
          height: 300px;
          background-color: var(--border-color);
          border-radius: 4px;
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .map-info {
          color: var(--text-muted);
          font-size: 16px;
        }
      `;
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.ipLookup = tool;
})();