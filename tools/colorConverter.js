window.tools.colorConverter = {
  render(target) {
    target.innerHTML = `
      <h2>\u989c\u8272\u8f6c\u6362</h2>
      <div class="convert-row">
        <input id="color-input" placeholder="#RRGGBB \u6216 r,g,b" />
        <button onclick="toHex()">\u8f6c Hex</button>
        <button onclick="toRgb()">\u8f6c RGB</button>
      </div>
      <input id="color-output" placeholder="\u7ed3\u679c" readonly />
    `;
  }
};

window.toHex = function() {
  const val = document.getElementById('color-input').value.trim();
  if (val.includes(',')) {
    const parts = val.split(',').map(v => parseInt(v.trim()));
    if (parts.length !== 3 || parts.some(v => isNaN(v) || v < 0 || v > 255)) {
      alert('\u8f93\u5165\u9519\u8bef');
      return;
    }
    const [r, g, b] = parts;
    const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    document.getElementById('color-output').value = '#' + hex;
  } else {
    document.getElementById('color-output').value = val;
  }
};

window.toRgb = function() {
  let hex = document.getElementById('color-input').value.trim();
  if (hex.startsWith('#')) hex = hex.slice(1);
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  if (hex.length !== 6) {
    alert('\u8f93\u5165\u9519\u8bef');
    return;
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  document.getElementById('color-output').value = `${r},${g},${b}`;
};
