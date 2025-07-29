window.tools.baseConverter = {
  render(target) {
    target.innerHTML = `
      <h2>进制转换</h2>
      <div class="convert-row">
        <input id="number-input" placeholder="输入数字" />
      <select id="from-base">
        <option value="10">10进制</option>
        <option value="2">2进制</option>
        <option value="16">16进制</option>
      </select>
      <span>→</span>
      <select id="to-base">
        <option value="2">2进制</option>
        <option value="10">10进制</option>
        <option value="16">16进制</option>
      </select>
      <button onclick="convertBase()">转换</button>
    </div>
    <input id="number-output" placeholder="输出结果" readonly />
  `;
  }
};

window.convertBase = function() {
  const val = document.getElementById('number-input').value.trim();
  const fromBase = parseInt(document.getElementById('from-base').value);
  const toBase = parseInt(document.getElementById('to-base').value);
  if (!val) return;
  const parsed = parseInt(val, fromBase);
  if (isNaN(parsed)) {
    alert('输入格式错误');
    return;
  }
  document.getElementById('number-output').value = parsed.toString(toBase);
};
