/**
 * Markdown编辑器UI模块
 */
(function() {
  // 定义UI模块
  window.markdownEditorUI = {
    /**
     * 初始化UI
     * @param {HTMLElement} container - 容器元素
     */
    init: function(container) {
      // 获取元素
      const editor = container.querySelector('#md-editor');
      const preview = container.querySelector('#md-preview');
      const stats = container.querySelector('#md-stats');
      const downloadMd = container.querySelector('#md-download');
      const downloadHtml = container.querySelector('#md-download-html');
      const toolbar = container.querySelector('.markdown-toolbar');
      
      // 设置默认文本
      editor.value = window.markdownEditorCore.defaultText;
      
      // 初始渲染
      this.renderPreview(editor.value, preview);
      window.markdownEditorUtils.updateStats(editor.value, stats);
      
      // 实时渲染
      editor.addEventListener('input', () => {
        this.renderPreview(editor.value, preview);
        window.markdownEditorUtils.updateStats(editor.value, stats);
      });
      
      // 工具栏操作
      this.setupToolbar(toolbar, editor, preview, stats);
      
      // 下载按钮
      this.setupDownloadButtons(downloadMd, downloadHtml, editor, preview);
    },
    
    /**
     * 渲染预览
     * @param {string} text - Markdown文本
     * @param {HTMLElement} previewElement - 预览元素
     */
    renderPreview: function(text, previewElement) {
      const html = window.markdownEditorCore.renderMarkdown(text);
      previewElement.innerHTML = html;
    },
    
    /**
     * 设置工具栏
     * @param {HTMLElement} toolbar - 工具栏元素
     * @param {HTMLElement} editor - 编辑器元素
     * @param {HTMLElement} preview - 预览元素
     * @param {HTMLElement} stats - 统计元素
     */
    setupToolbar: function(toolbar, editor, preview, stats) {
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
        
        // 特殊操作
        if (action === 'clear') {
          editor.value = '';
          this.renderPreview('', preview);
          window.markdownEditorUtils.updateStats('', stats);
          return;
        }
        
        if (action === 'copy-html') {
          window.markdownEditorUtils.copyToClipboard(preview.innerHTML);
          return;
        }
        
        // 执行操作
        const result = window.markdownEditorCore.handleToolbarAction(action, selection);
        
        // 插入文本
        editor.focus();
        document.execCommand('insertText', false, result.replacement);
        
        // 调整光标位置
        if (result.cursorOffset !== 0) {
          editor.selectionStart = editor.selectionEnd + result.cursorOffset;
          editor.selectionEnd = editor.selectionStart;
        }
        
        // 更新预览
        this.renderPreview(editor.value, preview);
        window.markdownEditorUtils.updateStats(editor.value, stats);
      });
    },
    
    /**
     * 设置下载按钮
     * @param {HTMLElement} downloadMd - Markdown下载按钮
     * @param {HTMLElement} downloadHtml - HTML下载按钮
     * @param {HTMLElement} editor - 编辑器元素
     * @param {HTMLElement} preview - 预览元素
     */
    setupDownloadButtons: function(downloadMd, downloadHtml, editor, preview) {
      // 下载Markdown
      downloadMd.addEventListener('click', () => {
        const content = editor.value;
        if (!content) {
          window.markdownEditorUtils.showToast('没有内容可下载', 'warning');
          return;
        }
        
        window.markdownEditorUtils.downloadFile('markdown.md', content, 'text/markdown');
      });
      
      // 下载HTML
      downloadHtml.addEventListener('click', () => {
        const content = preview.innerHTML;
        if (!content) {
          window.markdownEditorUtils.showToast('没有内容可下载', 'warning');
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
        
        window.markdownEditorUtils.downloadFile('markdown.html', htmlContent, 'text/html');
      });
    }
  };
})();