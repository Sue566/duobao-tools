/**
 * 时间戳转换工具
 * 增强版：支持多种时间格式、时区转换、倒计时计算和历史记录
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-clock-o"></i> 时间戳转换</h2>
          <p class="tool-description">时间戳与日期互转，支持多种格式、时区转换、倒计时计算和历史记录。</p>
        </div>
        
        <div class="timestamp-tabs">
          <div class="tab-header">
            <button class="tab-btn active" data-tab="converter">转换器</button>
            <button class="tab-btn" data-tab="timezone">时区转换</button>
            <button class="tab-btn" data-tab="countdown">倒计时</button>
            <button class="tab-btn" data-tab="history">历史记录</button>
          </div>
          
          <div class="tab-content active" id="tab-converter">
            <div class="timestamp-container">
              <div class="timestamp-current">
                <div class="current-time">
                  <div class="current-time-header">
                    <h3>当前时间</h3>
                    <button id="refresh-time" class="btn btn-sm"><i class="fa fa-refresh"></i> 刷新</button>
                  </div>
                  <div class="current-time-display">
                    <div class="time-item">
                      <div class="time-label">本地时间</div>
                      <div class="time-value" id="local-time">-</div>
                    </div>
                    <div class="time-item">
                      <div class="time-label">UTC时间</div>
                      <div class="time-value" id="utc-time">-</div>
                    </div>
                    <div class="time-item">
                      <div class="time-label">Unix时间戳</div>
                      <div class="time-value" id="unix-time">-</div>
                      <button id="copy-unix" class="btn btn-icon btn-sm" title="复制"><i class="fa fa-copy"></i></button>
                    </div>
                    <div class="time-item">
                      <div class="time-label">Unix毫秒时间戳</div>
                      <div class="time-value" id="unix-time-ms">-</div>
                      <button id="copy-unix-ms" class="btn btn-icon btn-sm" title="复制"><i class="fa fa-copy"></i></button>
                    </div>
                    <div class="time-item">
                      <div class="time-label">ISO 8601</div>
                      <div class="time-value" id="iso-time">-</div>
                      <button id="copy-iso" class="btn btn-icon btn-sm" title="复制"><i class="fa fa-copy"></i></button>
                    </div>
                    <div class="time-item">
                      <div class="time-label">RFC 2822</div>
                      <div class="time-value" id="rfc-time">-</div>
                      <button id="copy-rfc" class="btn btn-icon btn-sm" title="复制"><i class="fa fa-copy"></i></button>
                    </div>
                  </div>
                </div>
              </div>
          
              <div class="timestamp-converter">
                <div class="converter-section">
                  <h3>时间戳转日期</h3>
                  <div class="form-group">
                    <label for="timestamp-input">输入时间戳</label>
                    <div class="input-with-buttons">
                      <input type="text" id="timestamp-input" class="form-control" placeholder="输入Unix时间戳..." />
                      <button id="convert-to-date" class="btn btn-success"><i class="fa fa-arrow-right"></i> 转换</button>
                      <button id="now-to-date" class="btn"><i class="fa fa-clock-o"></i> 当前</button>
                    </div>
                    <div class="form-check">
                      <input type="checkbox" id="timestamp-ms" />
                      <label for="timestamp-ms">毫秒时间戳</label>
                    </div>
                  </div>
                  
                  <div class="result-section" id="date-result">
                    <div class="result-item">
                      <div class="result-label">本地时间</div>
                      <div class="result-value" id="timestamp-local">-</div>
                      <button class="btn btn-icon btn-sm copy-btn" data-target="timestamp-local" title="复制"><i class="fa fa-copy"></i></button>
                    </div>
                    <div class="result-item">
                      <div class="result-label">UTC时间</div>
                      <div class="result-value" id="timestamp-utc">-</div>
                      <button class="btn btn-icon btn-sm copy-btn" data-target="timestamp-utc" title="复制"><i class="fa fa-copy"></i></button>
                    </div>
                    <div class="result-item">
                      <div class="result-label">ISO 8601</div>
                      <div class="result-value" id="timestamp-iso">-</div>
                      <button class="btn btn-icon btn-sm copy-btn" data-target="timestamp-iso" title="复制"><i class="fa fa-copy"></i></button>
                    </div>
                    <div class="result-item">
                      <div class="result-label">RFC 2822</div>
                      <div class="result-value" id="timestamp-rfc">-</div>
                      <button class="btn btn-icon btn-sm copy-btn" data-target="timestamp-rfc" title="复制"><i class="fa fa-copy"></i></button>
                    </div>
                    <div class="result-item">
                      <div class="result-label">相对时间</div>
                      <div class="result-value" id="timestamp-relative">-</div>
                    </div>
                    <div class="result-actions">
                      <button id="save-timestamp-result" class="btn btn-sm"><i class="fa fa-save"></i> 保存结果</button>
                    </div>
                  </div>
                </div>
                
                <div class="converter-section">
                  <h3>日期转时间戳</h3>
                  <div class="form-group">
                    <label for="date-input">输入日期时间</label>
                    <div class="input-with-buttons">
                      <input type="datetime-local" id="date-input" class="form-control" />
                      <button id="convert-to-timestamp" class="btn btn-success"><i class="fa fa-arrow-right"></i> 转换</button>
                      <button id="now-to-timestamp" class="btn"><i class="fa fa-clock-o"></i> 当前</button>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="date-format-input">或输入格式化日期</label>
                    <div class="input-with-format">
                      <input type="text" id="date-format-input" class="form-control" placeholder="例如: 2023-01-01 12:00:00" />
                      <select id="date-format-select" class="form-control">
                        <option value="auto">自动识别</option>
                        <option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</option>
                        <option value="MM/DD/YYYY HH:mm:ss">MM/DD/YYYY HH:mm:ss</option>
                        <option value="DD/MM/YYYY HH:mm:ss">DD/MM/YYYY HH:mm:ss</option>
                        <option value="YYYY年MM月DD日 HH时mm分ss秒">YYYY年MM月DD日 HH时mm分ss秒</option>
                      </select>
                    </div>
                    <button id="convert-format-to-timestamp" class="btn btn-success"><i class="fa fa-arrow-right"></i> 转换</button>
                  </div>
                  
                  <div class="result-section" id="timestamp-result">
                    <div class="result-item">
                      <div class="result-label">Unix时间戳</div>
                      <div class="result-value" id="date-unix">-</div>
                      <button class="btn btn-icon btn-sm copy-btn" data-target="date-unix" title="复制"><i class="fa fa-copy"></i></button>
                    </div>
                    <div class="result-item">
                      <div class="result-label">Unix毫秒时间戳</div>
                      <div class="result-value" id="date-unix-ms">-</div>
                      <button class="btn btn-icon btn-sm copy-btn" data-target="date-unix-ms" title="复制"><i class="fa fa-copy"></i></button>
                    </div>
                    <div class="result-item">
                      <div class="result-label">ISO 8601</div>
                      <div class="result-value" id="date-iso">-</div>
                      <button class="btn btn-icon btn-sm copy-btn" data-target="date-iso" title="复制"><i class="fa fa-copy"></i></button>
                    </div>
                    <div class="result-actions">
                      <button id="save-date-result" class="btn btn-sm"><i class="fa fa-save"></i> 保存结果</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="tab-content" id="tab-timezone">
            <div class="timezone-container">
              <div class="timezone-header">
                <h3>时区转换</h3>
                <p class="timezone-description">在不同时区之间转换时间</p>
              </div>
              
              <div class="timezone-converter">
                <div class="form-group">
                  <label for="timezone-date">选择日期时间</label>
                  <div class="input-with-buttons">
                    <input type="datetime-local" id="timezone-date" class="form-control" />
                    <button id="timezone-now" class="btn"><i class="fa fa-clock-o"></i> 当前</button>
                  </div>
                </div>
                
                <div class="timezone-selectors">
                  <div class="form-group">
                    <label for="timezone-from">从时区</label>
                    <select id="timezone-from" class="form-control">
                      <option value="local">本地时区</option>
                      <option value="UTC">UTC</option>
                      <option value="Asia/Shanghai">亚洲/上海 (UTC+8)</option>
                      <option value="America/New_York">美国/纽约 (UTC-5/UTC-4)</option>
                      <option value="Europe/London">欧洲/伦敦 (UTC+0/UTC+1)</option>
                      <option value="Europe/Paris">欧洲/巴黎 (UTC+1/UTC+2)</option>
                      <option value="Asia/Tokyo">亚洲/东京 (UTC+9)</option>
                      <option value="Australia/Sydney">澳大利亚/悉尼 (UTC+10/UTC+11)</option>
                    </select>
                  </div>
                  
                  <div class="timezone-arrow">
                    <i class="fa fa-arrow-right"></i>
                  </div>
                  
                  <div class="form-group">
                    <label for="timezone-to">到时区</label>
                    <select id="timezone-to" class="form-control">
                      <option value="UTC">UTC</option>
                      <option value="local">本地时区</option>
                      <option value="Asia/Shanghai">亚洲/上海 (UTC+8)</option>
                      <option value="America/New_York">美国/纽约 (UTC-5/UTC-4)</option>
                      <option value="Europe/London">欧洲/伦敦 (UTC+0/UTC+1)</option>
                      <option value="Europe/Paris">欧洲/巴黎 (UTC+1/UTC+2)</option>
                      <option value="Asia/Tokyo">亚洲/东京 (UTC+9)</option>
                      <option value="Australia/Sydney">澳大利亚/悉尼 (UTC+10/UTC+11)</option>
                    </select>
                  </div>
                </div>
                
                <div class="timezone-actions">
                  <button id="convert-timezone" class="btn btn-success"><i class="fa fa-exchange"></i> 转换</button>
                </div>
                
                <div class="timezone-result">
                  <div class="result-section">
                    <div class="result-item">
                      <div class="result-label">转换结果</div>
                      <div class="result-value" id="timezone-result-value">-</div>
                      <button class="btn btn-icon btn-sm copy-btn" data-target="timezone-result-value" title="复制"><i class="fa fa-copy"></i></button>
                    </div>
                    <div class="result-item">
                      <div class="result-label">时区偏移</div>
                      <div class="result-value" id="timezone-offset">-</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="timezone-world-clock">
                <div class="world-clock-header">
                  <h3>世界时钟</h3>
                  <button id="refresh-world-clock" class="btn btn-sm"><i class="fa fa-refresh"></i> 刷新</button>
                </div>
                
                <div class="world-clock-list" id="world-clock-list">
                  <!-- 世界时钟将在JavaScript中动态生成 -->
                </div>
              </div>
            </div>
          </div>
          
          <div class="tab-content" id="tab-countdown">
            <div class="countdown-container">
              <div class="countdown-header">
                <h3>倒计时计算</h3>
                <p class="countdown-description">计算两个日期之间的时间差</p>
              </div>
              
              <div class="countdown-calculator">
                <div class="form-group">
                  <label for="countdown-from">开始日期</label>
                  <div class="input-with-buttons">
                    <input type="datetime-local" id="countdown-from" class="form-control" />
                    <button id="countdown-from-now" class="btn"><i class="fa fa-clock-o"></i> 当前</button>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="countdown-to">结束日期</label>
                  <div class="input-with-buttons">
                    <input type="datetime-local" id="countdown-to" class="form-control" />
                    <button id="countdown-to-now" class="btn"><i class="fa fa-clock-o"></i> 当前</button>
                  </div>
                </div>
                
                <div class="countdown-actions">
                  <button id="calculate-countdown" class="btn btn-success"><i class="fa fa-calculator"></i> 计算</button>
                </div>
                
                <div class="countdown-result">
                  <div class="result-section">
                    <div class="result-item">
                      <div class="result-label">总计</div>
                      <div class="result-value" id="countdown-total">-</div>
                    </div>
                    <div class="result-item">
                      <div class="result-label">详细</div>
                      <div class="result-value" id="countdown-detailed">-</div>
                    </div>
                    <div class="result-item">
                      <div class="result-label">工作日</div>
                      <div class="result-value" id="countdown-workdays">-</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="common-dates">
                <div class="common-dates-header">
                  <h3>常用日期</h3>
                </div>
                
                <div class="common-dates-list">
                  <button class="common-date-btn" data-days="7">一周后</button>
                  <button class="common-date-btn" data-days="30">一个月后</button>
                  <button class="common-date-btn" data-days="90">三个月后</button>
                  <button class="common-date-btn" data-days="180">半年后</button>
                  <button class="common-date-btn" data-days="365">一年后</button>
                  <button class="common-date-btn" data-days="-7">一周前</button>
                  <button class="common-date-btn" data-days="-30">一个月前</button>
                  <button class="common-date-btn" data-days="-365">一年前</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="tab-content" id="tab-history">
            <div class="history-container">
              <div class="history-header">
                <h3>历史记录</h3>
                <div class="history-actions">
                  <button id="clear-history-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空历史</button>
                </div>
              </div>
              
              <div class="history-list" id="timestamp-history-list">
                <div class="no-history">暂无历史记录</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="timestamp-batch">
          <div class="batch-header">
            <h3>批量转换</h3>
            <div class="batch-actions">
              <button id="batch-convert" class="btn btn-success"><i class="fa fa-exchange"></i> 批量转换</button>
              <button id="batch-clear" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
            </div>
          </div>
          
          <div class="batch-content">
            <div class="form-group">
              <label for="batch-input">输入时间戳或日期（每行一个）</label>
              <textarea id="batch-input" class="form-control" placeholder="输入时间戳或日期，每行一个..."></textarea>
            </div>
            
            <div class="form-group">
              <label for="batch-output">转换结果</label>
              <textarea id="batch-output" class="form-control" readonly></textarea>
            </div>
            
            <div class="batch-options">
              <div class="form-check">
                <input type="radio" name="batch-mode" id="batch-timestamp-to-date" checked />
                <label for="batch-timestamp-to-date">时间戳转日期</label>
              </div>
              <div class="form-check">
                <input type="radio" name="batch-mode" id="batch-date-to-timestamp" />
                <label for="batch-date-to-timestamp">日期转时间戳</label>
              </div>
              <div class="form-check">
                <input type="checkbox" id="batch-include-ms" />
                <label for="batch-include-ms">包含毫秒</label>
              </div>
              <div class="form-check">
                <input type="checkbox" id="batch-include-relative" />
                <label for="batch-include-relative">包含相对时间</label>
              </div>
            </div>
            
            <div class="batch-format-options">
              <div class="form-group">
                <label for="batch-output-format">输出格式</label>
                <select id="batch-output-format" class="form-control">
                  <option value="default">默认格式</option>
                  <option value="iso">ISO 8601</option>
                  <option value="rfc">RFC 2822</option>
                  <option value="custom">自定义格式</option>
                </select>
              </div>
              <div class="form-group" id="custom-format-group" style="display: none;">
                <label for="batch-custom-format">自定义格式</label>
                <input type="text" id="batch-custom-format" class="form-control" placeholder="例如: YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss" />
              </div>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('timestamp', container.querySelector('.tool-header'));
      
      // 获取元素
      const localTime = container.querySelector('#local-time');
      const utcTime = container.querySelector('#utc-time');
      const unixTime = container.querySelector('#unix-time');
      const unixTimeMs = container.querySelector('#unix-time-ms');
      const refreshTime = container.querySelector('#refresh-time');
      const copyUnix = container.querySelector('#copy-unix');
      const copyUnixMs = container.querySelector('#copy-unix-ms');
      
      const timestampInput = container.querySelector('#timestamp-input');
      const timestampMs = container.querySelector('#timestamp-ms');
      const convertToDate = container.querySelector('#convert-to-date');
      const nowToDate = container.querySelector('#now-to-date');
      const timestampLocal = container.querySelector('#timestamp-local');
      const timestampUtc = container.querySelector('#timestamp-utc');
      const timestampIso = container.querySelector('#timestamp-iso');
      const timestampRelative = container.querySelector('#timestamp-relative');
      
      const dateInput = container.querySelector('#date-input');
      const convertToTimestamp = container.querySelector('#convert-to-timestamp');
      const nowToTimestamp = container.querySelector('#now-to-timestamp');
      const dateUnix = container.querySelector('#date-unix');
      const dateUnixMs = container.querySelector('#date-unix-ms');
      const dateIso = container.querySelector('#date-iso');
      
      const batchInput = container.querySelector('#batch-input');
      const batchOutput = container.querySelector('#batch-output');
      const batchConvert = container.querySelector('#batch-convert');
      const batchClear = container.querySelector('#batch-clear');
      const batchTimestampToDate = container.querySelector('#batch-timestamp-to-date');
      const batchDateToTimestamp = container.querySelector('#batch-date-to-timestamp');
      const batchIncludeMs = container.querySelector('#batch-include-ms');
      
      // 获取额外元素
      const tabButtons = container.querySelectorAll('.tab-btn');
      const tabContents = container.querySelectorAll('.tab-content');
      
      // 当前时间额外元素
      const isoTime = container.querySelector('#iso-time');
      const rfcTime = container.querySelector('#rfc-time');
      const copyIso = container.querySelector('#copy-iso');
      const copyRfc = container.querySelector('#copy-rfc');
      
      // 时间戳转日期额外元素
      const timestampRfc = container.querySelector('#timestamp-rfc');
      const saveTim
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('timestamp', container.querySelector('.tool-header'));
      
      // 获取元素
      const localTime = container.querySelector('#local-time');
      const utcTime = container.querySelector('#utc-time');
      const unixTime = container.querySelector('#unix-time');
      const unixTimeMs = container.querySelector('#unix-time-ms');
      const refreshTime = container.querySelector('#refresh-time');
      const copyUnix = container.querySelector('#copy-unix');
      const copyUnixMs = container.querySelector('#copy-unix-ms');
      
      const timestampInput = container.querySelector('#timestamp-input');
      const timestampMs = container.querySelector('#timestamp-ms');
      const convertToDate = container.querySelector('#convert-to-date');
      const nowToDate = container.querySelector('#now-to-date');
      const timestampLocal = container.querySelector('#timestamp-local');
      const timestampUtc = container.querySelector('#timestamp-utc');
      const timestampIso = container.querySelector('#timestamp-iso');
      const timestampRelative = container.querySelector('#timestamp-relative');
      
      const dateInput = container.querySelector('#date-input');
      const convertToTimestamp = container.querySelector('#convert-to-timestamp');
      const nowToTimestamp = container.querySelector('#now-to-timestamp');
      const dateUnix = container.querySelector('#date-unix');
      const dateUnixMs = container.querySelector('#date-unix-ms');
      const dateIso = container.querySelector('#date-iso');
      
      const batchInput = container.querySelector('#batch-input');
      const batchOutput = container.querySelector('#batch-output');
      const batchConvert = container.querySelector('#batch-convert');
      const batchClear = container.querySelector('#batch-clear');
      const batchTimestampToDate = container.querySelector('#batch-timestamp-to-date');
      const batchDateToTimestamp = container.querySelector('#batch-date-to-timestamp');
      const batchIncludeMs = container.querySelector('#batch-include-ms');
      
      // 更新当前时间
      function updateCurrentTime() {
        const now = new Date();
        
        // 本地时间
        localTime.textContent = formatDate(now, 'local');
        
        // UTC时间
        utcTime.textContent = formatDate(now, 'utc');
        
        // Unix时间戳
        const timestamp = Math.floor(now.getTime() / 1000);
        unixTime.textContent = timestamp;
        
        // Unix毫秒时间戳
        unixTimeMs.textContent = now.getTime();
      }
      
      // 格式化日期
      function formatDate(date, format = 'local') {
        if (!(date instanceof Date)) {
          return '-';
        }
        
        const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        };
        
        if (format === 'utc') {
          options.timeZone = 'UTC';
        }
        
        return date.toLocaleString('zh-CN', options);
      }
      
      // 计算相对时间
      function getRelativeTime(timestamp) {
        const now = Math.floor(Date.now() / 1000);
        const diff = now - timestamp;
        
        if (diff < 0) {
          // 未来时间
          const absDiff = Math.abs(diff);
          if (absDiff < 60) return `${absDiff}秒后`;
          if (absDiff < 3600) return `${Math.floor(absDiff / 60)}分钟后`;
          if (absDiff < 86400) return `${Math.floor(absDiff / 3600)}小时后`;
          if (absDiff < 2592000) return `${Math.floor(absDiff / 86400)}天后`;
          if (absDiff < 31536000) return `${Math.floor(absDiff / 2592000)}个月后`;
          return `${Math.floor(absDiff / 31536000)}年后`;
        } else {
          // 过去时间
          if (diff < 60) return `${diff}秒前`;
          if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
          if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
          if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;
          if (diff < 31536000) return `${Math.floor(diff / 2592000)}个月前`;
          return `${Math.floor(diff / 31536000)}年前`;
        }
      }
      
      // 时间戳转日期
      function timestampToDate() {
        let timestamp = timestampInput.value.trim();
        if (!timestamp) {
          showToast('请输入时间戳', 'warning');
          return;
        }
        
        // 移除非数字字符
        timestamp = timestamp.replace(/[^\d]/g, '');
        
        if (!timestamp) {
          showToast('请输入有效的时间戳', 'warning');
          return;
        }
        
        let ts = parseInt(timestamp);
        
        // 检查是否为毫秒时间戳
        if (!timestampMs.checked && ts > 10000000000) {
          // 自动检测并提示
          if (confirm('检测到可能是毫秒时间戳，是否转换为秒？')) {
            ts = Math.floor(ts / 1000);
            timestampInput.value = ts;
          }
        }
        
        // 如果是秒级时间戳，转换为毫秒
        if (!timestampMs.checked) {
          ts *= 1000;
        }
        
        const date = new Date(ts);
        
        if (isNaN(date.getTime())) {
          showToast('无效的时间戳', 'error');
          return;
        }
        
        // 更新结果
        timestampLocal.textContent = formatDate(date, 'local');
        timestampUtc.textContent = formatDate(date, 'utc');
        timestampIso.textContent = date.toISOString();
        
        // 计算相对时间
        const unixTs = Math.floor(ts / 1000);
        timestampRelative.textContent = getRelativeTime(unixTs);
      }
      
      // 日期转时间戳
      function dateToTimestamp() {
        const dateValue = dateInput.value;
        if (!dateValue) {
          showToast('请输入日期时间', 'warning');
          return;
        }
        
        const date = new Date(dateValue);
        
        if (isNaN(date.getTime())) {
          showToast('无效的日期格式', 'error');
          return;
        }
        
        // 更新结果
        const timestamp = Math.floor(date.getTime() / 1000);
        dateUnix.textContent = timestamp;
        dateUnixMs.textContent = date.getTime();
        dateIso.textContent = date.toISOString();
      }
      
      // 批量转换
      function batchConversion() {
        const input = batchInput.value.trim();
        if (!input) {
          showToast('请输入需要转换的内容', 'warning');
          return;
        }
        
        const lines = input.split('\n');
        const results = [];
        
        if (batchTimestampToDate.checked) {
          // 时间戳转日期
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) {
              results.push('');
              continue;
            }
            
            // 移除非数字字符
            const timestamp = trimmed.replace(/[^\d]/g, '');
            if (!timestamp) {
              results.push(`[错误] 无效的时间戳: ${trimmed}`);
              continue;
            }
            
            let ts = parseInt(timestamp);
            
            // 如果是秒级时间戳，转换为毫秒
            if (!batchIncludeMs.checked) {
              ts *= 1000;
            }
            
            const date = new Date(ts);
            
            if (isNaN(date.getTime())) {
              results.push(`[错误] 无效的时间戳: ${trimmed}`);
            } else {
              results.push(`${trimmed} => ${formatDate(date, 'local')}`);
            }
          }
        } else {
          // 日期转时间戳
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) {
              results.push('');
              continue;
            }
            
            const date = new Date(trimmed);
            
            if (isNaN(date.getTime())) {
              results.push(`[错误] 无效的日期格式: ${trimmed}`);
            } else {
              const timestamp = batchIncludeMs.checked ? date.getTime() : Math.floor(date.getTime() / 1000);
              results.push(`${trimmed} => ${timestamp}`);
            }
          }
        }
        
        batchOutput.value = results.join('\n');
      }
      
      // 事件监听
      refreshTime.addEventListener('click', updateCurrentTime);
      
      copyUnix.addEventListener('click', () => {
        copyToClipboard(unixTime.textContent);
      });
      
      copyUnixMs.addEventListener('click', () => {
        copyToClipboard(unixTimeMs.textContent);
      });
      
      convertToDate.addEventListener('click', timestampToDate);
      
      nowToDate.addEventListener('click', () => {
        const now = Math.floor(Date.now() / 1000);
        timestampInput.value = now;
        timestampToDate();
      });
      
      convertToTimestamp.addEventListener('click', dateToTimestamp);
      
      nowToTimestamp.addEventListener('click', () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        dateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
        dateToTimestamp();
      });
      
      batchConvert.addEventListener('click', batchConversion);
      
      batchClear.addEventListener('click', () => {
        batchInput.value = '';
        batchOutput.value = '';
      });
      
      // 复制按钮
      container.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-target');
          const targetElement = container.querySelector(`#${targetId}`);
          if (targetElement) {
            copyToClipboard(targetElement.textContent);
          }
        });
      });
      
      // 初始化
      updateCurrentTime();
      
      // 设置定时器，每秒更新一次当前时间
      const timer = setInterval(updateCurrentTime, 1000);
      
      // 在组件销毁时清除定时器
      return () => {
        clearInterval(timer);
      };
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .timestamp-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .timestamp-current {
          flex: 1;
          min-width: 300px;
        }
        
        .timestamp-converter {
          flex: 2;
          min-width: 400px;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .converter-section {
          flex: 1;
          min-width: 300px;
        }
        
        .current-time {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .current-time-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .current-time-header h3 {
          margin: 0;
        }
        
        .current-time-display {
          padding: 15px;
        }
        
        .time-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .time-item:last-child {
          margin-bottom: 0;
        }
        
        .time-label {
          width: 120px;
          color: var(--text-muted);
        }
        
        .time-value {
          flex-grow: 1;
          font-family: monospace;
          font-size: 16px;
        }
        
        .input-with-buttons {
          display: flex;
          gap: 10px;
        }
        
        .input-with-buttons input {
          flex-grow: 1;
        }
        
        .result-section {
          margin-top: 20px;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
        }
        
        .result-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .result-item:last-child {
          margin-bottom: 0;
        }
        
        .result-label {
          width: 120px;
          color: var(--text-muted);
        }
        
        .result-value {
          flex-grow: 1;
          font-family: monospace;
          overflow-wrap: break-word;
        }
        
        .timestamp-batch {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .batch-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .batch-header h3 {
          margin: 0;
        }
        
        .batch-actions {
          display: flex;
          gap: 10px;
        }
        
        .batch-content {
          padding: 15px;
        }
        
        .batch-options {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 15px;
        }
        
        .form-check {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        @media (max-width: 768px) {
          .timestamp-container {
            flex-direction: column;
          }
          
          .timestamp-converter {
            flex-direction: column;
          }
        }
      `;
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.timestamp = tool;
})();