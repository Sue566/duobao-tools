/**
 * 多宝工具箱 - 中文转拼音工具
 * 支持多种转换选项和历史记录
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
      const templateResponse = await fetch('tools/chineseToPinyin/template.html');
      const template = await templateResponse.text();
      container.innerHTML = template;
      
      // 添加样式
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'tools/chineseToPinyin/styles.css';
      document.head.appendChild(link);
      
      // 添加收藏按钮
      window.addFavoriteButton('chineseToPinyin', container.querySelector('.tool-header'));
      
      // 加载拼音转换库
      await this.loadPinyinLibrary();
      
      // 初始化各个模块
      const utils = window.chineseToPinyinUtils;
      const converter = window.chineseToPinyinConverter;
      const history = window.chineseToPinyinHistory;
      
      // 确保所有模块都已加载
      if (!utils || !converter || !history) {
        container.innerHTML = '<div class="error-message">工具模块加载失败，请刷新页面重试。</div>';
        return;
      }
      
      // 初始化工具模块
      utils.init(container);
      converter.init(container);
      history.init(container);
      
      // 获取输入文本框和统计元素
      const chineseInput = container.querySelector('#chinese-input');
      const charCount = container.querySelector('#char-count');
      const chineseCount = container.querySelector('#chinese-count');
      
      // 添加输入事件监听
      if (chineseInput && charCount && chineseCount) {
        chineseInput.addEventListener('input', () => {
          utils.updateTextStats(chineseInput.value, charCount, chineseCount);
        });
      }
      
      // 返回清理函数
      return function() {
        // 移除样式
        const styleLink = document.querySelector('link[href="tools/chineseToPinyin/styles.css"]');
        if (styleLink) {
          document.head.removeChild(styleLink);
        }
      };
    },
    
    /**
     * 加载拼音转换库
     */
    loadPinyinLibrary: async function() {
      // 检查是否已加载
      if (window.pinyinUtil) {
        return;
      }
      
      return new Promise((resolve) => {
        // 加载拼音库
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/pinyin-pro@3.13.2/dist/index.js';
        document.head.appendChild(script);
        
        script.onload = () => {
          console.log('拼音库加载成功');
          
          // 创建拼音工具对象
          window.pinyinUtil = {
            // 拼音风格常量
            STYLE_NORMAL: 0,  // 不带声调
            STYLE_TONE: 1,    // 带声调
            STYLE_TONE2: 2,   // 数字声调
            STYLE_INITIALS: 3, // 声母
            STYLE_FIRST_LETTER: 4, // 首字母
            
            /**
             * 获取拼音
             * @param {string} text - 中文文本
             * @param {string} separator - 分隔符
             * @param {number} style - 拼音风格
             * @param {boolean} filterNonChinese - 是否过滤非中文字符
             * @returns {string} 拼音结果
             */
            getPinyin: function(text, separator = '', style = 0, filterNonChinese = false) {
              let options = {};
              
              // 设置风格
              switch (style) {
                case this.STYLE_NORMAL:
                  options.toneType = 'none';
                  break;
                case this.STYLE_TONE:
                  options.toneType = 'symbol';
                  break;
                case this.STYLE_TONE2:
                  options.toneType = 'num';
                  break;
                case this.STYLE_INITIALS:
                  options.type = 'initial';
                  break;
              }
              
              // 设置分隔符
              options.separator = separator;
              
              // 是否过滤非中文字符
              options.nonZh = filterNonChinese ? 'remove' : 'retain';
              
              // 使用pinyin-pro库转换
              return window.pinyin(text, options);
            },
            
            /**
             * 获取首字母
             * @param {string} text - 中文文本
             * @param {boolean} uppercase - 是否大写
             * @returns {string} 首字母结果
             */
            getFirstLetter: function(text, uppercase = false) {
              const options = {
                type: 'first',
                nonZh: 'retain'
              };
              
              let result = window.pinyin(text, options);
              
              // 转换大小写
              return uppercase ? result.toUpperCase() : result;
            }
          };
          
          resolve();
        };
        
        script.onerror = () => {
          console.error('拼音库加载失败');
          
          // 创建一个简单的备用转换函数
          window.pinyinUtil = {
            STYLE_NORMAL: 0,
            STYLE_TONE: 1,
            STYLE_TONE2: 2,
            STYLE_INITIALS: 3,
            STYLE_FIRST_LETTER: 4,
            
            getPinyin: function(text) {
              return text + ' (拼音库加载失败)';
            },
            
            getFirstLetter: function(text) {
              return text + ' (拼音库加载失败)';
            }
          };
          
          resolve();
        };
      });
    }
  };
  
  // 注册工具
  window.tools = window.tools || {};
  window.tools.chineseToPinyin = tool;
})();