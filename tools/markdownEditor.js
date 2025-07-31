/**
 * Markdown编辑器
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-file-text-o"></i> Markdown编辑器</h2>
          <p class="tool-description">编辑Markdown文本并实时预览效果。</p>
        </div>
        
        <div class="markdown-container">
          <div class="markdown-toolbar">
            <button class="md-btn" title="加粗" data-action="bold"><i class="fa fa-bold"></i></button>
            <button class="md-btn" title="斜体" data-action="italic"><i class="fa fa-italic"></i></button>
            <button class="md-btn" title="标题" data-action="heading"><i class="fa fa-header"></i></button>
            <span class="separator"></span>
            <button class="md-btn" title="链接" data-action="link"><i class="fa fa-link"></i></button>
            <button class="md-btn" title="图片" data-action="image"><i class="fa fa-image"></i></button>
            <button class="md-btn" title="代码块" data-action="code"><i class="fa fa-code"></i></button>
            <span class="separator"></span>
            <button class="md-btn" title="无序列表" data-action="unordered-list"><i class="fa fa-list-ul"></i></button>
            <button class="md-btn" title="有序列表" data-action="ordered-list"><i class="fa fa-list-ol"></i></button>
            <button class="md-btn" title="引用" data-action="quote"><i class="fa fa-quote-right"></i></button>
            <span class="separator"></span>
            <button class="md-btn" title="表格" data-action="table"><i class="fa fa-table"></i></button>
            <button class="md-btn" title="水平线" data-action="hr"><i class="fa fa-minus"></i></button>
            <div class="flex-spacer"></div>
            <button class="md-btn" title="清空" data-action="clear"><i class="fa fa-trash-o"></i></button>
            <button class="md-btn" title="复制HTML" data-action="copy-html"><i class="fa fa-clipboard"></i></button>
          </div>
          
          <div class="markdown-editor">
            <div class="editor-pane">
              <textarea id="md-editor" class="form-control" placeholder="在此输入Markdown文本..."></textarea>
            </div>
            <div class="preview-pane">
              <div id="md-preview" class="markdown-preview"></div>
            </div>
          </div>
          
          <div class="markdown-footer">
            <div class="markdown-stats">
              <span id="md-stats">0 个字符 | 0 个单词 | 0 行</span>
            </div>
            <div class="markdown-actions">
              <button id="md-download" class="btn btn-sm"><i class="fa fa-download"></i> 下载 Markdown</button>
              <button id="md-download-html" class="btn btn-sm"><i class="fa fa-html5"></i> 下载 HTML</button>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('markdownEditor', container.querySelector('.tool-header'));
      
      // 获取元素
      const editor = container.querySelector('#md-editor');
      const preview = container.querySelector('#md-preview');
      const stats = container.querySelector('#md-stats');
      const downloadMd = container.querySelector('#md-download');
      const downloadHtml = container.querySelector('#md-download-html');
      const toolbar = container.querySelector('.markdown-toolbar');
      
      // 默认示例文本
      const defaultText = `# Markdown 编辑器示例

## 基本语法

### 标题

# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

### 强调

*斜体文本* 或 _斜体文本_

**粗体文本** 或 __粗体文本__

***粗斜体文本*** 或 ___粗斜体文本___

### 列表

无序列表:
- 项目1
- 项目2
  - 子项目2.1
  - 子项目2.2
- 项目3

有序列表:
1. 第一项
2. 第二项
3. 第三项

### 链接和图片

[链接文本](https://www.example.com)

![图片描述](https://via.placeholder.com/150)

### 引用

> 这是一段引用文本。
> 
> 引用可以有多个段落。

### 代码

行内代码: \`console.log('Hello World');\`

代码块:
\`\`\`javascript
function sayHello() {
  console.log('Hello World!');
}
\`\`\`

### 表格

| 表头1 | 表头2 | 表头3 |
|-------|-------|-------|
| 单元格1 | 单元格2 | 单元格3 |
| 单元格4 | 单元格5 | 单元格6 |

### 水平线

---

### 任务列表

- [x] 已完成任务
- [ ] 未完成任务
`;

      // 设置默认文本
      editor.value = defaultText;
      
      // 初始渲染
      renderMarkdown();
      updateStats();
      
      // 实时渲染
      editor.addEventListener('input', () => {
        renderMarkdown();
        updateStats();
      });
      
      // 工具栏操作
      toolbar.addEventListener('click', (e) => {
        const button = e.target.closest('.md-btn');
        if (!button) return;
        
        const action = button.getAttribute('data-action');
        if (!action) return;
        
        e.preventDefault();
        
        // 获取选中文本
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selection = editor.value.substring(start, end);
        
        // 执行操作
        let replacement = '';
        let cursorOffset = 0;
        
        switch (action) {
          case 'bold':
            replacement = `**${selection || '粗体文本'}**`;
            cursorOffset = selection ? 0 : -2;
            break;
            
          case 'italic':
            replacement = `*${selection || '斜体文本'}*`;
            cursorOffset = selection ? 0 : -1;
            break;
            
          case 'heading':
            replacement = `## ${selection || '标题'}`;
            cursorOffset = selection ? 0 : -0;
            break;
            
          case 'link':
            replacement = `[${selection || '链接文本'}](https://example.com)`;
            cursorOffset = selection ? -1 : -13;
            break;
            
          case 'image':
            replacement = `![${selection || '图片描述'}](https://example.com/image.jpg)`;
            cursorOffset = selection ? -1 : -13;
            break;
            
          case 'code':
            if (selection.includes('\n')) {
              replacement = `\`\`\`\n${selection || '代码块'}\n\`\`\``;
            } else {
              replacement = `\`${selection || '代码'}\``;
              cursorOffset = selection ? 0 : -1;
            }
            break;
            
          case 'unordered-list':
            if (selection) {
              replacement = selection.split('\n').map(line => `- ${line}`).join('\n');
            } else {
              replacement = '- 列表项';
            }
            break;
            
          case 'ordered-list':
            if (selection) {
              replacement = selection.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
            } else {
              replacement = '1. 列表项';
            }
            break;
            
          case 'quote':
            if (selection) {
              replacement = selection.split('\n').map(line => `> ${line}`).join('\n');
            } else {
              replacement = '> 引用文本';
            }
            break;
            
          case 'table':
            replacement = `| 表头1 | 表头2 | 表头3 |\n|-------|-------|-------|\n| 内容1 | 内容2 | 内容3 |\n| 内容4 | 内容5 | 内容6 |`;
            break;
            
          case 'hr':
            replacement = `\n---\n`;
            break;
            
          case 'clear':
            editor.value = '';
            renderMarkdown();
            updateStats();
            return;
            
          case 'copy-html':
            copyToClipboard(preview.innerHTML);
            return;
        }
        
        // 插入文本
        editor.focus();
        document.execCommand('insertText', false, replacement);
        
        // 调整光标位置
        if (cursorOffset !== 0) {
          editor.selectionStart = editor.selectionEnd + cursorOffset;
          editor.selectionEnd = editor.selectionStart;
        }
        
        // 更新预览
        renderMarkdown();
        updateStats();
      });
      
      // 下载Markdown
      downloadMd.addEventListener('click', () => {
        const content = editor.value;
        if (!content) {
          showToast('没有内容可下载', 'warning');
          return;
        }
        
        downloadFile('markdown.md', content, 'text/markdown');
      });
      
      // 下载HTML
      downloadHtml.addEventListener('click', () => {
        const content = preview.innerHTML;
        if (!content) {
          showToast('没有内容可下载', 'warning');
          return;
        }
        
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown转换的HTML</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
    img { max-width: 100%; }
    pre { background-color: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
    code { background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
    blockquote { border-left: 4px solid #ddd; padding-left: 15px; color: #777; }
    table { border-collapse: collapse; width: 100%; }
    table, th, td { border: 1px solid #ddd; }
    th, td { padding: 8px; text-align: left; }
    th { background-color: #f5f5f5; }
  </style>
</head>
<body>
${content}
</body>
</html>`;
        
        downloadFile('markdown.html', htmlContent, 'text/html');
      });
      
      // 渲染Markdown
      function renderMarkdown() {
        const text = editor.value;
        
        // 简单的Markdown解析器，实际应该使用成熟的库如marked.js
        let html = text
          // 转义HTML
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          
          // 标题
          .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
          .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
          .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
          .replace(/^#### (.*?)$/gm, '<h4>$1</h4>')
          .replace(/^##### (.*?)$/gm, '<h5>$1</h5>')
          .replace(/^###### (.*?)$/gm, '<h6>$1</h6>')
          
          // 粗体和斜体
          .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
          .replace(/___(.*)___/g, '<strong><em>$1</em></strong>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/__(.*)__/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/_(.*)_/g, '<em>$1</em>')
          
          // 链接和图片
          .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
          
          // 代码块
          .replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
          .replace(/`([^`]+)`/g, '<code>$1</code>')
          
          // 列表
          .replace(/^- (.*?)$/gm, '<li>$1</li>')
          .replace(/^(\d+)\. (.*?)$/gm, '<li>$2</li>')
          
          // 引用
          .replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>')
          
          // 水平线
          .replace(/^---$/gm, '<hr>')
          
          // 表格 (简化版)
          .replace(/\|(.+)\|/g, '<tr><td>$1</td></tr>')
          .replace(/<td>(.+)<\/td>/g, function(match, p1) {
            return '<td>' + p1.replace(/\|/g, '</td><td>') + '</td>';
          });
        
        // 处理列表
        html = html.replace(/<li>(.+?)<\/li>/g, function(match) {
          if (html.indexOf('<ul>') === -1 && html.indexOf('<ol>') === -1) {
            return '<ul>' + match + '</ul>';
          }
          return match;
        });
        
        // 处理段落
        html = html.replace(/^([^<].*?)$/gm, '<p>$1</p>');
        
        // 清理空段落
        html = html.replace(/<p><\/p>/g, '');
        
        preview.innerHTML = html;
      }
      
      // 更新统计信息
      function updateStats() {
        const text = editor.value;
        const chars = text.length;
        const words = text.trim().split(/\s+/).length;
        const lines = text.split('\n').length;
        
        stats.textContent = `${chars} 个字符 | ${words} 个单词 | ${lines} 行`;
      }
      
      // 下载文件
      function downloadFile(filename, content, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast(`已下载 ${filename}`, 'success');
      }
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .markdown-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .markdown-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          padding: 10px;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }
        
        .md-btn {
          width: 36px;
          height: 36px;
          border: none;
          background-color: transparent;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-color);
          transition: var(--transition);
        }
        
        .md-btn:hover {
          background-color: var(--hover-bg);
        }
        
        .separator {
          width: 1px;
          height: 24px;
          background-color: var(--border-color);
          margin: 0 5px;
        }
        
        .flex-spacer {
          flex-grow: 1;
        }
        
        .markdown-editor {
          display: flex;
          gap: 20px;
          height: 500px;
        }
        
        .editor-pane, .preview-pane {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 300px;
        }
        
        .editor-pane textarea {
          flex-grow: 1;
          resize: none;
          font-family: monospace;
          padding: 15px;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .markdown-preview {
          flex-grow: 1;
          padding: 15px;
          overflow: auto;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }
        
        .markdown-preview h1, .markdown-preview h2, .markdown-preview h3,
        .markdown-preview h4, .markdown-preview h5, .markdown-preview h6 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        
        .markdown-preview h1 {
          font-size: 2em;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.3em;
        }
        
        .markdown-preview h2 {
          font-size: 1.5em;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.3em;
        }
        
        .markdown-preview p {
          margin: 1em 0;
        }
        
        .markdown-preview img {
          max-width: 100%;
        }
        
        .markdown-preview pre {
          background-color: var(--bg-color);
          padding: 15px;
          border-radius: 4px;
          overflow-x: auto;
        }
        
        .markdown-preview code {
          background-color: var(--bg-color);
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
        }
        
        .markdown-preview blockquote {
          border-left: 4px solid var(--border-color);
          padding-left: 15px;
          color: var(--text-muted);
          margin: 1em 0;
        }
        
        .markdown-preview table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        
        .markdown-preview table, .markdown-preview th, .markdown-preview td {
          border: 1px solid var(--border-color);
        }
        
        .markdown-preview th, .markdown-preview td {
          padding: 8px;
          text-align: left;
        }
        
        .markdown-preview th {
          background-color: var(--bg-color);
        }
        
        .markdown-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }
        
        .markdown-stats {
          color: var(--text-muted);
          font-size: 14px;
        }
        
        .markdown-actions {
          display: flex;
          gap: 10px;
        }
        
        .btn-sm {
          padding: 5px 10px;
          font-size: 14px;
        }
        
        @media (max-width: 768px) {
          .markdown-editor {
            flex-direction: column;
            height: auto;
          }
          
          .editor-pane textarea {
            height: 300px;
          }
          
          .preview-pane {
            height: 300px;
          }
        }
      `;
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.markdownEditor = tool;
})();