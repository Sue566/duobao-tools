/**
 * 时间戳转换工具
 * 增强版：支持多种时间格式、时区转换、倒计时计算和历史记录
 */
(function() {
  // 定义工具
  const tool = {
    /**
     * 初始化工具
     * @param {HTMLElement} container - 工具容器
     * @returns {Function} 清理函数
     */
    render: async function(container) {
      // 加载模板
      const templateResponse = await fetch('tools/timestamp/template.html');
      const template = await templateResponse.text();
      container.innerHTML = template;
      
      // 添加样式
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'tools/timestamp/styles.css';
      document.head.appendChild(link);
      
      // 添加收藏按钮
      window.addFavoriteButton('timestamp', container.querySelector('.tool-header'));
      
      // 获取元素
      const localTime = container.querySelector('#local-time');
      const utcTime = container.querySelector('#utc-time');
      const unixTime = container.querySelector('#unix-time');
      const unixTimeMs = container.querySelector('#unix-time-ms');
      const isoTime = container.querySelector('#iso-time');
      const rfcTime = container.querySelector('#rfc-time');
      const refreshTime = container.querySelector('#refresh-time');
      const copyUnix = container.querySelector('#copy-unix');
      const copyUnixMs = container.querySelector('#copy-unix-ms');
      const copyIso = container.querySelector('#copy-iso');
      const copyRfc = container.querySelector('#copy-rfc');
      
      // 获取标签页元素
      const tabButtons = container.querySelectorAll('.tab-btn');
      const tabContents = container.querySelectorAll('.tab-content');
      
      // 初始化各个模块
      const utils = window.timestampUtils;
      const converter = window.timestampConverter;
      const history = window.timestampHistory;
      const batchProcessor = window.timestampBatchProcessor;
      const timezone = window.timestampTimezone;
      const countdown = window.timestampCountdown;
      
      // 确保所有模块都已加载
      if (!utils || !converter || !history || !batchProcessor || !timezone || !countdown) {
        container.innerHTML = '<div class="error-message">工具模块加载失败，请刷新页面重试。</div>';
        return;
      }
      
      // 初始化工具模块
      utils.init(container);
      converter.init(container);
      history.init(container);
      batchProcessor.init(container);
      timezone.init(container);
      countdown.init(container);
      
      /**
       * 更新当前时间
       */
      function updateCurrentTime() {
        const now = new Date();
        
        // 本地时间
        localTime.textContent = utils.formatDate(now, 'local');
        
        // UTC时间
        utcTime.textContent = utils.formatDate(now, 'utc');
        
        // Unix时间戳
        const timestamp = Math.floor(now.getTime() / 1000);
        unixTime.textContent = timestamp;
        
        // Unix毫秒时间戳
        unixTimeMs.textContent = now.getTime();
        
        // ISO 8601
        isoTime.textContent = now.toISOString();
        
        // RFC 2822
        rfcTime.textContent = now.toUTCString();
      }
      
      /**
       * 切换标签页
       * @param {string} tabId - 标签页ID
       */
      function switchTab(tabId) {
        tabButtons.forEach(btn => {
          if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
        
        tabContents.forEach(content => {
          if (content.id === `tab-${tabId}`) {
            content.classList.add('active');
          } else {
            content.classList.remove('active');
          }
        });
        
        // 如果切换到历史记录标签页，更新显示
        if (tabId === 'history') {
          history.renderHistory();
        }
        
        // 如果切换到时区转换标签页，更新世界时钟
        if (tabId === 'timezone') {
          timezone.updateWorldClock();
        }
      }
      
      // 事件监听
      refreshTime.addEventListener('click', updateCurrentTime);
      
      copyUnix.addEventListener('click', () => {
        utils.copyToClipboard(unixTime.textContent);
      });
      
      copyUnixMs.addEventListener('click', () => {
        utils.copyToClipboard(unixTimeMs.textContent);
      });
      
      copyIso.addEventListener('click', () => {
        utils.copyToClipboard(isoTime.textContent);
      });
      
      copyRfc.addEventListener('click', () => {
        utils.copyToClipboard(rfcTime.textContent);
      });
      
      // 标签页切换事件
      tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const tabId = this.getAttribute('data-tab');
          switchTab(tabId);
        });
      });
      
      // 初始化
      updateCurrentTime();
      
      // 设置定时器，每秒更新一次当前时间
      const timer = setInterval(updateCurrentTime, 1000);
      
      // 在组件销毁时清除定时器
      return function cleanup() {
        clearInterval(timer);
        document.head.removeChild(link);
      };
    }
  };
  
  // 注册工具
  window.tools.timestamp = tool;
})();