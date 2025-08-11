/**
 * Markdown编辑器核心功能模块
 */
(function() {
  // 定义核心功能模块
  window.markdownEditorCore = {
    /**
     * 默认示例文本
     */
    defaultText: `# Markdown 编辑器示例

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
`,
    
    /**
     * 渲染Markdown为HTML
     * @param {string} text - Markdown文本
     * @returns {string} 渲染后的HTML
     */
    renderMarkdown: function(text) {
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
      
      return html;
    },
    
    /**
     * 处理工具栏操作
     * @param {string} action - 操作类型
     * @param {string} selection - 选中的文本
     * @returns {Object} 替换文本和光标偏移
     */
    handleToolbarAction: function(action, selection) {
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
          if (selection && selection.includes('\n')) {
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
      }
      
      return {
        replacement: replacement,
        cursorOffset: cursorOffset
      };
    }
  };
})();