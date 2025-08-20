/**
 * 多宝工具箱 - 大小写转换工具
 * 主入口文件
 */

// 主工具对象
window.tools = window.tools || {};
window.tools.caseConverter = {
  /**
   * 渲染工具
   * @param {HTMLElement} target - 目标容器
   * @returns {Promise} 渲染完成的Promise
   */
  render: async function(target) {
    try {
      // 动态加载脚本
      await this.loadScripts([
        'tools/caseConverter/utils.js',
        'tools/caseConverter/converter.js',
        'tools/caseConverter/history.js',
        'tools/caseConverter/index.js'
      ]);
      
      // 初始化工具
      return this._internalTool.render(target);
    } catch (error) {
      console.error('加载大小写转换工具失败:', error);
      target.innerHTML = `
        <div class="error-message" style="padding: 20px; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0;">工具加载失败</h3>
          <p>加载大小写转换工具时发生错误，请刷新页面重试。</p>
          <p>错误详情: ${error.message}</p>
        </div>
      `;
    }
  },
  
  /**
   * 加载多个脚本
   * @param {Array} scripts - 脚本路径数组
   * @returns {Promise} 加载完成的Promise
   */
  loadScripts: function(scripts) {
    return Promise.all(scripts.map(src => this.loadScript(src)));
  },
  
  /**
   * 加载单个脚本
   * @param {string} src - 脚本路径
   * @returns {Promise} 加载完成的Promise
   */
  loadScript: function(src) {
    return new Promise((resolve, reject) => {
      // 检查脚本是否已加载
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
};