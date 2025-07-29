window.tools.caseConverter = {
  render(target) {
    target.innerHTML = `
      <h2>大小写转换</h2>
      <textarea id="case-input" placeholder="输入文本"></textarea>
      <div class="buttons">
        <button onclick="toUpper()">转大写</button>
        <button onclick="toLower()">转小写</button>
      </div>
      <textarea id="case-output" placeholder="输出结果" readonly></textarea>
    `;
  }
};

window.toUpper = function() {
  const val = document.getElementById('case-input').value;
  document.getElementById('case-output').value = val.toUpperCase();
};

window.toLower = function() {
  const val = document.getElementById('case-input').value;
  document.getElementById('case-output').value = val.toLowerCase();
};
