export function render(target) {
  target.innerHTML = `
    <h2>Base64 \u7f16\u7801/\u89e3\u7801</h2>
    <textarea id="b64-input" placeholder="\u8f93\u5165\u6587\u672c"></textarea>
    <div class="buttons">
      <button onclick="encodeB64()">\u7f16\u7801</button>
      <button onclick="decodeB64()">\u89e3\u7801</button>
    </div>
    <textarea id="b64-output" placeholder="\u7ed3\u679c" readonly></textarea>
  `;
}

window.encodeB64 = function() {
  const val = document.getElementById('b64-input').value;
  const encoded = btoa(unescape(encodeURIComponent(val)));
  document.getElementById('b64-output').value = encoded;
};

window.decodeB64 = function() {
  const val = document.getElementById('b64-input').value;
  try {
    const decoded = decodeURIComponent(escape(atob(val)));
    document.getElementById('b64-output').value = decoded;
  } catch (e) {
    alert('\u65e0\u6cd5\u89e3\u7801');
  }
};
