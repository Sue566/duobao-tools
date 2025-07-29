window.tools.rmbUppercase = {
  render(target) {
    target.innerHTML = `
      <h2>数字转中文大写</h2>
      <input id="rmb-input" placeholder="输入数字" />
      <div class="buttons">
        <button onclick="convertRMB()">转换</button>
      </div>
      <input id="rmb-output" placeholder="结果" readonly />
    `;
  }
};

window.convertRMB = function() {
  const val = document.getElementById('rmb-input').value.trim();
  if (!val) return;
  if (!/^\d+(\.\d+)?$/.test(val)) {
    alert('请输入数字');
    return;
  }
  document.getElementById('rmb-output').value = numberToChinese(parseFloat(val));
};

function numberToChinese(num) {
  const fraction = ['角', '分'];
  const digit = ['零','壹','贰','叁','肆','伍','陆','柒','捌','玖'];
  const unit = [['元','万','亿'], ['', '拾','佰','仟']];
  let head = num < 0 ? '负' : '';
  num = Math.abs(num);
  let s = '';
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(num * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i++) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j++) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return head + s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}
