export function render(target) {
  target.innerHTML = `
    <h2>文本长度统计</h2>
    <textarea id="tl-input" placeholder="输入文本"></textarea>
    <div>长度：<span id="tl-count">0</span></div>
  `;
  document.getElementById('tl-input').addEventListener('input', () => {
    document.getElementById('tl-count').textContent =
      document.getElementById('tl-input').value.length;
  });
}
