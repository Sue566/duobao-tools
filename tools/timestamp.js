export function render(target) {
  target.innerHTML = `
    <h2>时间戳转换</h2>
    <div class="convert-row">
      <input id="ts-input" placeholder="时间戳或日期字符串" />
      <button onclick="toTimestamp()">转时间戳</button>
      <button onclick="fromTimestamp()">转日期</button>
    </div>
    <input id="ts-output" placeholder="结果" readonly />
  `;
}

window.toTimestamp = function() {
  const val = document.getElementById('ts-input').value.trim();
  const date = new Date(val);
  if (isNaN(date.getTime())) {
    alert('无法解析日期');
    return;
  }
  document.getElementById('ts-output').value = Math.floor(date.getTime() / 1000);
};

window.fromTimestamp = function() {
  const val = document.getElementById('ts-input').value.trim();
  const ts = parseInt(val, 10);
  if (isNaN(ts)) {
    alert('请输入有效时间戳');
    return;
  }
  document.getElementById('ts-output').value = new Date(ts * 1000).toISOString();
};
