window.tools.urlEncoder = {
  render(target) {
    target.innerHTML = `
      <h2>URL 编码/解码</h2>
      <textarea id="url-input" placeholder="输入文本"></textarea>
      <div class="buttons">
        <button onclick="encodeURL()">编码</button>
        <button onclick="decodeURL()">解码</button>
      </div>
      <textarea id="url-output" placeholder="结果" readonly></textarea>
    `;
  }
};

window.encodeURL = function() {
  const val = document.getElementById('url-input').value;
  document.getElementById('url-output').value = encodeURIComponent(val);
};

window.decodeURL = function() {
  const val = document.getElementById('url-input').value;
  document.getElementById('url-output').value = decodeURIComponent(val);
};
