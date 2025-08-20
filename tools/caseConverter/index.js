/**
 * 多宝工具箱 - 大小写转换工具
 * 增强版：支持多种文本转换格式和历史记录
 */
(function() {
  // 定义工具
  const caseConverterTool = {
    /**
     * 初始化工具
     * @param {HTMLElement} container - 工具容器
     * @returns {Function} 清理函数
     */
    render: async function(container) {
      // 加载模板
      const templateResponse = await fetch('tools/caseConverter/template.html');
      const template = await templateResponse.text();
      container.innerHTML = template;
      
      // 添加样式
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'tools/caseConverter/styles.css';
      document.head.appendChild(link);
      
      // 添加收藏按钮
      if (typeof window.addFavoriteButton === 'function') {
        window.addFavoriteButton('caseConverter', container.querySelector('.tool-header'));
      }
      
      // 初始化面包屑导航
      this.initBreadcrumb(container);
      
      // 初始化各个模块
      const utils = window.caseConverterUtils;
      const converter = window.caseConverterCore;
      const history = window.caseConverterHistory;
      
      // 确保所有模块都已加载
      if (!utils || !converter || !history) {
        container.innerHTML = '<div class="error-message">工具模块加载失败，请刷新页面重试。</div>';
        return;
      }
      
      // 初始化工具模块
      utils.init(container);
      converter.init(container);
      history.init(container);
      
      // 获取输入文本框
      const inputTextarea = container.querySelector('#case-input');
      
      // 初始化文本统计
      if (inputTextarea) {
        const charCount = container.querySelector('#char-count');
        const wordCount = container.querySelector('#word-count');
        const lineCount = container.querySelector('#line-count');
        
        utils.updateTextStats(inputTextarea, charCount, wordCount, lineCount);
        
        // 添加输入事件监听器，实时更新统计
        inputTextarea.addEventListener('input', () => {
          utils.updateTextStats(inputTextarea, charCount, wordCount, lineCount);
        });
        
        // 添加粘贴按钮功能
        const pasteButton = container.querySelector('#paste-input');
        if (pasteButton) {
          pasteButton.addEventListener('click', async () => {
            try {
              const text = await navigator.clipboard.readText();
              inputTextarea.value = text;
              utils.updateTextStats(inputTextarea, charCount, wordCount, lineCount);
              // 添加动画效果
              inputTextarea.classList.add('highlight');
              setTimeout(() => {
                inputTextarea.classList.remove('highlight');
              }, 1000);
            } catch (err) {
              console.error('粘贴失败:', err);
              alert('无法访问剪贴板，请检查浏览器权限设置。');
            }
          });
        }
        
        // 添加清空按钮功能
        const clearButton = container.querySelector('#clear-input');
        if (clearButton) {
          clearButton.addEventListener('click', () => {
            inputTextarea.value = '';
            utils.updateTextStats(inputTextarea, charCount, wordCount, lineCount);
          });
        }
      }
      
      // 初始化帮助对话框
      this.initHelpDialog(container);
      
      // 添加动画效果
      this.addAnimationEffects(container);
      
      // 返回清理函数
      return function() {
        // 移除样式
        const styleLink = document.querySelector('link[href="tools/caseConverter/styles.css"]');
        if (styleLink) {
          document.head.removeChild(styleLink);
        }
      };
    },
    
    /**
     * 初始化面包屑导航
     * @param {HTMLElement} container - 工具容器
     */
    initBreadcrumb: function(container) {
      const breadcrumbItems = container.querySelectorAll('.breadcrumb-item');
      
      breadcrumbItems.forEach(item => {
        if (item.classList.contains('current')) return;
        
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const page = item.getAttribute('data-page');
          const category = item.getAttribute('data-category');
          
          if (page === 'home') {
            // 跳转到首页
            if (typeof showHomepage === 'function') {
              showHomepage();
            } else {
              window.location.hash = '';
            }
          } else if (category) {
            // 跳转到分类页面
            if (typeof showCategory === 'function') {
              showCategory(category);
            } else {
              window.location.hash = `category/${category}`;
            }
          }
        });
      });
    },
    
    /**
     * 初始化帮助对话框
     * @param {HTMLElement} container - 工具容器
     */
    initHelpDialog: function(container) {
      const helpButton = container.querySelector('#help-button');
      const helpDialog = container.querySelector('#help-dialog');
      const closeButtons = helpDialog?.querySelectorAll('.dialog-close');
      
      if (helpButton && helpDialog) {
        helpButton.addEventListener('click', () => {
          helpDialog.style.display = 'flex';
          setTimeout(() => {
            const dialogContent = helpDialog.querySelector('.dialog-content');
            if (dialogContent) {
              dialogContent.classList.add('fade-in');
            }
          }, 10);
        });
        
        if (closeButtons && closeButtons.length) {
          closeButtons.forEach(button => {
            button.addEventListener('click', () => {
              const dialogContent = helpDialog.querySelector('.dialog-content');
              if (dialogContent) {
                dialogContent.classList.remove('fade-in');
              }
              setTimeout(() => {
                helpDialog.style.display = 'none';
              }, 200);
            });
          });
        }
        
        // 点击对话框外部关闭
        helpDialog.addEventListener('click', (e) => {
          if (e.target === helpDialog) {
            const dialogContent = helpDialog.querySelector('.dialog-content');
            if (dialogContent) {
              dialogContent.classList.remove('fade-in');
            }
            setTimeout(() => {
              helpDialog.style.display = 'none';
            }, 200);
          }
        });
      }
    },
    
    /**
     * 添加动画效果
     * @param {HTMLElement} container - 工具容器
     */
    addAnimationEffects: function(container) {
      // 为转换按钮添加悬停效果
      const actionButtons = container.querySelectorAll('.btn-action');
      actionButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
          button.classList.add('pulse');
        });
        
        button.addEventListener('mouseleave', () => {
          button.classList.remove('pulse');
        });
        
        // 添加点击动画
        button.addEventListener('click', () => {
          const outputTextarea = container.querySelector('#case-output');
          if (outputTextarea) {
            outputTextarea.classList.add('highlight');
            setTimeout(() => {
              outputTextarea.classList.remove('highlight');
            }, 1000);
          }
        });
      });
      
      // 为复制按钮添加动画效果
      const copyButton = container.querySelector('#copy-output');
      if (copyButton) {
        copyButton.addEventListener('click', () => {
          const outputTextarea = container.querySelector('#case-output');
          if (outputTextarea && outputTextarea.value) {
            navigator.clipboard.writeText(outputTextarea.value)
              .then(() => {
                // 显示复制成功动画
                copyButton.innerHTML = '<i class="fa fa-check"></i> 已复制';
                copyButton.classList.add('btn-success');
                
                setTimeout(() => {
                  copyButton.innerHTML = '<i class="fa fa-copy"></i> 复制';
                  copyButton.classList.remove('btn-success');
                }, 2000);
              })
              .catch(err => {
                console.error('复制失败:', err);
                alert('复制失败，请手动选择文本并复制。');
              });
          }
        });
      }
      
      // 为输入和输出区域添加动画
      const sections = container.querySelectorAll('.input-section, .output-section, .conversion-options');
      sections.forEach((section, index) => {
        section.classList.add('slide-in-up');
        section.style.animationDelay = `${index * 0.1}s`;
      });
    }
  };
  
  // 将工具对象暴露给主模块
  if (window.tools && window.tools.caseConverter) {
    // 如果主模块已经存在，则扩展它
    Object.assign(window.tools.caseConverter, {
      _internalTool: caseConverterTool,
      render: function(container) {
        return caseConverterTool.render(container);
      }
    });
  } else {
    // 如果主模块不存在，则创建它
    window.tools = window.tools || {};
    window.tools.caseConverter = {
      _internalTool: caseConverterTool,
      render: function(container) {
        return caseConverterTool.render(container);
      }
    };
  }
})();