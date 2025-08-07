/**
 * 正则表达式测试工具 - 工具函数模块
 */

/**
 * 转义HTML特殊字符
 * @param {string} text - 需要转义的文本
 * @returns {string} 转义后的文本
 */
export function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 更新文本统计信息
 * @param {HTMLElement} container - 容器元素
 * @param {string} text - 文本内容
 */
export function updateTextStats(container, text) {
  const charCount = container.querySelector('#char-count');
  const lineCount = container.querySelector('#line-count');
  
  charCount.textContent = text.length;
  lineCount.textContent = text.split('\n').length;
}

/**
 * 获取保存的正则表达式
 * @returns {Object} 保存的正则表达式对象
 */
export function getSavedRegexes() {
  try {
    const saved = localStorage.getItem('regexTester_savedRegexes');
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error('加载保存的正则表达式失败', e);
    return {};
  }
}

/**
 * 显示提示消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 ('success', 'info', 'warning', 'error')
 */
export function showToast(message, type = 'info') {
  window.showToast(message, type);
}