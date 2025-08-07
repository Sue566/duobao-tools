/**
 * JSON格式化工具 - 主入口文件
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 加载HTML内容
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'tools/jsonFormatter/index.html', true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // 解析HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(xhr.responseText, 'text/html');
            const content = doc.querySelector('#json-formatter-tool');
            
            // 添加到容器
            if (content) {
              container.appendChild(content);
            } else {
              container.innerHTML = '<div class="tool-error">无法加载工具内容</div>';
            }
            
            // 加载CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'tools/jsonFormatter/jsonFormatter.css';
            document.head.appendChild(link);
            
            // 加载模块JS文件
            const loadScript = (src) => {
              return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
              });
            };
            
            // 按顺序加载所有模块
            Promise.all([
              loadScript('tools/jsonFormatter/core.js'),
              loadScript('tools/jsonFormatter/treeView.js'),
              loadScript('tools/jsonFormatter/queryModule.js'),
              loadScript('tools/jsonFormatter/convertModule.js'),
              loadScript('tools/jsonFormatter/compareModule.js')
            ]).then(() => {
              // 最后加载主模块
              loadScript('tools/jsonFormatter/main.js');
            }).catch(error => {
              console.error('加载模块失败:', error);
              container.innerHTML = '<div class="tool-error">加载模块失败</div>';
            });
          } else {
            container.innerHTML = '<div class="tool-error">加载工具失败</div>';
          }
        }
      };
      xhr.send();
    }
  };

  // 注册工具
  window.duobaoTools = window.duobaoTools || {};
  window.duobaoTools.jsonFormatter = {
    name: 'JSON格式化',
    icon: 'fa-code',
    description: '格式化、验证、查询和转换JSON数据，提供树视图和路径查询功能。',
    render: tool.render
  };
})();
