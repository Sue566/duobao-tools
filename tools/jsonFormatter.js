export function render(target) {
  target.innerHTML = `
    <h2>JSON \u683c\u5f0f\u5316</h2>
    <textarea id="json-input" placeholder="\u8f93\u5165 JSON"></textarea>
    <div class="buttons">
      <button onclick="formatJson()">\u683c\u5f0f\u5316</button>
      <button onclick="compactJson()">\u538b\u7f29</button>
    </div>
    <textarea id="json-output" placeholder="\u7ed3\u679c" readonly></textarea>
  `;
}

window.formatJson = function() {
  try {
    const obj = JSON.parse(document.getElementById('json-input').value);
    document.getElementById('json-output').value = JSON.stringify(obj, null, 2);
  } catch (e) {
    alert('\u89e3\u6790\u5931\u8d25');
  }
};

window.compactJson = function() {
  try {
    const obj = JSON.parse(document.getElementById('json-input').value);
    document.getElementById('json-output').value = JSON.stringify(obj);
  } catch (e) {
    alert('\u89e3\u6790\u5931\u8d25');
  }
};
