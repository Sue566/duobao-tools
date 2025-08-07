/**
 * 密码生成器
 * 增强版：支持多种密码类型、密码分析、自定义字符集和密码导出
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-key"></i> 密码生成器</h2>
          <p class="tool-description">生成安全的随机密码，支持多种密码类型、自定义规则和密码分析。</p>
        </div>
        
        <div class="password-container">
          <div class="password-result">
            <div class="password-display">
              <input type="text" id="password-output" class="form-control" readonly />
              <button id="copy-btn" class="btn btn-icon" title="复制密码">
                <i class="fa fa-copy"></i>
              </button>
              <button id="refresh-btn" class="btn btn-icon" title="重新生成">
                <i class="fa fa-refresh"></i>
              </button>
            </div>
            
            <div class="password-strength">
              <div class="strength-label">密码强度：</div>
              <div class="strength-meter">
                <div class="strength-bar" id="strength-bar"></div>
              </div>
              <div class="strength-text" id="strength-text">中等</div>
            </div>
            
            <div class="password-info">
              <div class="info-item">
                <span class="info-label">破解时间估计：</span>
                <span class="info-value" id="crack-time">计算中...</span>
              </div>
              <div class="info-item">
                <span class="info-label">熵值：</span>
                <span class="info-value" id="entropy-value">0 位</span>
              </div>
            </div>
          </div>
          
          <div class="password-options">
            <div class="password-presets">
              <label>密码类型</label>
              <div class="preset-buttons">
                <button id="preset-strong" class="btn btn-sm active">强密码</button>
                <button id="preset-memorable" class="btn btn-sm">易记密码</button>
                <button id="preset-pin" class="btn btn-sm">数字PIN</button>
                <button id="preset-custom" class="btn btn-sm">自定义</button>
              </div>
            </div>
            
            <div class="form-group">
              <label for="password-length">密码长度</label>
              <div class="range-with-value">
                <input type="range" id="password-length" min="4" max="128" value="16" />
                <span id="length-value">16</span>
              </div>
            </div>
            
            <div class="form-group">
              <label>字符类型</label>
              <div class="checkbox-group">
                <div class="form-check">
                  <input type="checkbox" id="include-uppercase" checked />
                  <label for="include-uppercase">大写字母 (A-Z)</label>
                </div>
                <div class="form-check">
                  <input type="checkbox" id="include-lowercase" checked />
                  <label for="include-lowercase">小写字母 (a-z)</label>
                </div>
                <div class="form-check">
                  <input type="checkbox" id="include-numbers" checked />
                  <label for="include-numbers">数字 (0-9)</label>
                </div>
                <div class="form-check">
                  <input type="checkbox" id="include-symbols" checked />
                  <label for="include-symbols">特殊符号 (!@#$%^&*)</label>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label>高级选项</label>
              <div class="checkbox-group">
                <div class="form-check">
                  <input type="checkbox" id="exclude-similar" checked />
                  <label for="exclude-similar">排除相似字符 (i, l, 1, o, 0, etc.)</label>
                </div>
                <div class="form-check">
                  <input type="checkbox" id="exclude-ambiguous" />
                  <label for="exclude-ambiguous">排除歧义字符 ({}, [], (), /\\, etc.)</label>
                </div>
                <div class="form-check">
                  <input type="checkbox" id="require-all-types" checked />
                  <label for="require-all-types">必须包含所有选中的字符类型</label>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="custom-chars">自定义字符集 <small>(可选)</small></label>
              <input type="text" id="custom-chars" class="form-control" placeholder="输入自定义字符集..." />
            </div>
            
            <div class="form-group">
              <div class="btn-group">
                <button id="generate-btn" class="btn btn-success"><i class="fa fa-refresh"></i> 生成密码</button>
                <button id="save-btn" class="btn"><i class="fa fa-save"></i> 保存密码</button>
                <button id="export-btn" class="btn btn-secondary"><i class="fa fa-download"></i> 导出密码</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="password-tabs">
          <div class="tab-header">
            <button class="tab-btn active" data-tab="history">历史记录</button>
            <button class="tab-btn" data-tab="analysis">密码分析</button>
            <button class="tab-btn" data-tab="tips">安全提示</button>
          </div>
          
          <div class="tab-content active" id="tab-history">
            <div class="history-header">
              <h3>历史记录</h3>
              <button id="clear-history" class="btn btn-sm btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
            </div>
            <div class="history-list" id="history-list">
              <div class="no-history">暂无历史记录</div>
            </div>
          </div>
          
          <div class="tab-content" id="tab-analysis">
            <div class="analysis-container">
              <div class="form-group">
                <label for="analysis-input">分析密码</label>
                <div class="analysis-input-wrapper">
                  <input type="password" id="analysis-input" class="form-control" placeholder="输入密码进行分析..." />
                  <button id="toggle-visibility" class="btn btn-icon" title="显示/隐藏密码">
                    <i class="fa fa-eye"></i>
                  </button>
                  <button id="analyze-btn" class="btn btn-primary">分析</button>
                </div>
              </div>
              
              <div class="analysis-results" id="analysis-results">
                <div class="no-analysis">输入密码后点击"分析"按钮</div>
              </div>
            </div>
          </div>
          
          <div class="tab-content" id="tab-tips">
            <div class="tips-container">
              <h3>密码安全提示</h3>
              <ul class="tips-list">
                <li><strong>长度很重要</strong> - 使用至少12个字符的密码，16个或更多更好。</li>
                <li><strong>混合字符类型</strong> - 结合使用大小写字母、数字和特殊符号。</li>
                <li><strong>避免个人信息</strong> - 不要使用生日、姓名、宠物名或其他个人信息。</li>
                <li><strong>不要重复使用</strong> - 为不同的网站和服务使用不同的密码。</li>
                <li><strong>定期更换</strong> - 定期更换重要账户的密码，特别是在数据泄露后。</li>
                <li><strong>使用密码管理器</strong> - 考虑使用密码管理器来存储和生成复杂密码。</li>
                <li><strong>启用双因素认证</strong> - 在可能的情况下，为账户添加额外的安全层。</li>
                <li><strong>检查密码是否泄露</strong> - 使用如 Have I Been Pwned 等服务检查您的密码是否在数据泄露中出现过。</li>
              </ul>
              
              <h3>常见的密码错误</h3>
              <ul class="tips-list">
                <li>使用常见密码，如 "password", "123456", "qwerty" 等。</li>
                <li>仅更改密码末尾的数字（例如 password1, password2）。</li>
                <li>使用键盘上连续的字符（如 qwerty, 12345）。</li>
                <li>使用容易猜测的个人信息。</li>
                <li>在多个网站使用相同的密码。</li>
                <li>将密码写在纸上或未加密的文件中。</li>
                <li>通过不安全的渠道（如电子邮件或短信）共享密码。</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('passwordGenerator', container.querySelector('.tool-header'));
      
      // 获取元素
      const passwordOutput = container.querySelector('#password-output');
      const copyBtn = container.querySelector('#copy-btn');
      const refreshBtn = container.querySelector('#refresh-btn');
      const lengthInput = container.querySelector('#password-length');
      const lengthValue = container.querySelector('#length-value');
      const includeUppercase = container.querySelector('#include-uppercase');
      const includeLowercase = container.querySelector('#include-lowercase');
      const includeNumbers = container.querySelector('#include-numbers');
      const includeSymbols = container.querySelector('#include-symbols');
      const excludeSimilar = container.querySelector('#exclude-similar');
      const excludeAmbiguous = container.querySelector('#exclude-ambiguous');
      const requireAllTypes = container.querySelector('#require-all-types');
      const generateBtn = container.querySelector('#generate-btn');
      const saveBtn = container.querySelector('#save-btn');
      const strengthBar = container.querySelector('#strength-bar');
      const strengthText = container.querySelector('#strength-text');
      const historyList = container.querySelector('#history-list');
      const clearHistory = container.querySelector('#clear-history');
      
      // 获取额外元素
      const customChars = container.querySelector('#custom-chars');
      const presetStrong = container.querySelector('#preset-strong');
      const presetMemorable = container.querySelector('#preset-memorable');
      const presetPin = container.querySelector('#preset-pin');
      const presetCustom = container.querySelector('#preset-custom');
      const exportBtn = container.querySelector('#export-btn');
      const crackTime = container.querySelector('#crack-time');
      const entropyValue = container.querySelector('#entropy-value');
      const tabButtons = container.querySelectorAll('.tab-btn');
      const tabContents = container.querySelectorAll('.tab-content');
      const analysisInput = container.querySelector('#analysis-input');
      const toggleVisibility = container.querySelector('#toggle-visibility');
      const analyzeBtn = container.querySelector('#analyze-btn');
      const analysisResults = container.querySelector('#analysis-results');
      
      // 字符集
      const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        memorable: {
          consonants: 'bcdfghjklmnpqrstvwxyz',
          vowels: 'aeiou',
          numbers: '23456789'
        }
      };
      
      const similarChars = 'iIlL1oO0';
      const ambiguousChars = '{}[]()/\\\'"`~,;:.<>';
      
      // 常见密码列表（用于检查）
      const commonPasswords = [
        'password', '123456', 'qwerty', 'admin', 'welcome',
        'login', '123123', '12345678', 'abc123', 'letmein',
        'monkey', '1234567', 'sunshine', 'master', '111111',
        'superman', 'iloveyou', 'trustno1', 'princess', 'dragon'
      ];
      
      // 更新长度显示
      lengthInput.addEventListener('input', () => {
        lengthValue.textContent = lengthInput.value;
      });
      
      // 生成密码
      function generatePassword() {
        const length = parseInt(lengthInput.value);
        
        // 检查是否至少选择了一种字符类型
        if (!includeUppercase.checked && !includeLowercase.checked && 
            !includeNumbers.checked && !includeSymbols.checked) {
          showToast('请至少选择一种字符类型', 'warning');
          return;
        }
        
        // 构建字符集
        let charset = '';
        let mustInclude = [];
        
        if (includeUppercase.checked) {
          let chars = charSets.uppercase;
          if (excludeSimilar.checked) {
            chars = chars.split('').filter(c => !similarChars.includes(c)).join('');
          }
          if (excludeAmbiguous.checked) {
            chars = chars.split('').filter(c => !ambiguousChars.includes(c)).join('');
          }
          charset += chars;
          if (requireAllTypes.checked && chars.length > 0) {
            mustInclude.push(chars.charAt(Math.floor(Math.random() * chars.length)));
          }
        }
        
        if (includeLowercase.checked) {
          let chars = charSets.lowercase;
          if (excludeSimilar.checked) {
            chars = chars.split('').filter(c => !similarChars.includes(c)).join('');
          }
          if (excludeAmbiguous.checked) {
            chars = chars.split('').filter(c => !ambiguousChars.includes(c)).join('');
          }
          charset += chars;
          if (requireAllTypes.checked && chars.length > 0) {
            mustInclude.push(chars.charAt(Math.floor(Math.random() * chars.length)));
          }
        }
        
        if (includeNumbers.checked) {
          let chars = charSets.numbers;
          if (excludeSimilar.checked) {
            chars = chars.split('').filter(c => !similarChars.includes(c)).join('');
          }
          charset += chars;
          if (requireAllTypes.checked && chars.length > 0) {
            mustInclude.push(chars.charAt(Math.floor(Math.random() * chars.length)));
          }
        }
        
        if (includeSymbols.checked) {
          let chars = charSets.symbols;
          if (excludeAmbiguous.checked) {
            chars = chars.split('').filter(c => !ambiguousChars.includes(c)).join('');
          }
          charset += chars;
          if (requireAllTypes.checked && chars.length > 0) {
            mustInclude.push(chars.charAt(Math.floor(Math.random() * chars.length)));
          }
        }
        
        if (charset.length === 0) {
          showToast('没有可用的字符集，请调整选项', 'warning');
          return;
        }
        
        // 生成密码
        let password = '';
        
        // 如果需要包含所有类型，先添加必须包含的字符
        if (requireAllTypes.checked) {
          if (mustInclude.length > length) {
            mustInclude = mustInclude.slice(0, length);
          }
          password = mustInclude.join('');
        }
        
        // 添加随机字符直到达到指定长度
        while (password.length < length) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset[randomIndex];
        }
        
        // 打乱密码字符顺序
        password = shuffleString(password);
        
        // 更新输出
        passwordOutput.value = password;
        
        // 评估密码强度
        evaluatePasswordStrength(password);
      }
      
      // 打乱字符串
      function shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
      }
      
      // 预设密码类型
      function applyPreset(type) {
        // 重置所有预设按钮
        [presetStrong, presetMemorable, presetPin, presetCustom].forEach(btn => {
          btn.classList.remove('active');
        });
        
        switch (type) {
          case 'strong':
            presetStrong.classList.add('active');
            lengthInput.value = 16;
            lengthValue.textContent = '16';
            includeUppercase.checked = true;
            includeLowercase.checked = true;
            includeNumbers.checked = true;
            includeSymbols.checked = true;
            excludeSimilar.checked = true;
            excludeAmbiguous.checked = false;
            requireAllTypes.checked = true;
            customChars.value = '';
            break;
            
          case 'memorable':
            presetMemorable.classList.add('active');
            lengthInput.value = 12;
            lengthValue.textContent = '12';
            includeUppercase.checked = true;
            includeLowercase.checked = true;
            includeNumbers.checked = true;
            includeSymbols.checked = false;
            excludeSimilar.checked = true;
            excludeAmbiguous.checked = true;
            requireAllTypes.checked = false;
            customChars.value = '';
            break;
            
          case 'pin':
            presetPin.classList.add('active');
            lengthInput.value = 6;
            lengthValue.textContent = '6';
            includeUppercase.checked = false;
            includeLowercase.checked = false;
            includeNumbers.checked = true;
            includeSymbols.checked = false;
            excludeSimilar.checked = false;
            excludeAmbiguous.checked = false;
            requireAllTypes.checked = false;
            customChars.value = '';
            break;
            
          case 'custom':
            presetCustom.classList.add('active');
            // 不改变当前设置
            break;
        }
        
        // 生成新密码
        generatePassword();
      }
      
      // 生成易记密码
      function generateMemorablePassword(length) {
        // 创建一个易记的密码，通常是辅音+元音的组合
        const consonants = charSets.memorable.consonants;
        const vowels = charSets.memorable.vowels;
        const numbers = charSets.memorable.numbers;
        
        let password = '';
        let syllables = Math.ceil(length / 3);
        
        for (let i = 0; i < syllables; i++) {
          // 添加辅音
          password += consonants.charAt(Math.floor(Math.random() * consonants.length));
          
          // 添加元音
          if (password.length < length) {
            password += vowels.charAt(Math.floor(Math.random() * vowels.length));
          }
          
          // 有25%的几率添加数字
          if (password.length < length && Math.random() < 0.25) {
            password += numbers.charAt(Math.floor(Math.random() * numbers.length));
          }
        }
        
        // 确保密码长度正确
        password = password.substring(0, length);
        
        // 随机将第一个字母大写
        if (includeUppercase.checked && password.length > 0) {
          password = password.charAt(0).toUpperCase() + password.slice(1);
        }
        
        return password;
      }
      
      // 计算密码熵
      function calculateEntropy(password) {
        if (!password) return 0;
        
        // 确定字符集大小
        let charsetSize = 0;
        
        if (/[A-Z]/.test(password)) charsetSize += 26;
        if (/[a-z]/.test(password)) charsetSize += 26;
        if (/[0-9]/.test(password)) charsetSize += 10;
        if (/[^A-Za-z0-9]/.test(password)) charsetSize += 33; // 估计特殊字符数量
        
        // 如果无法确定字符集，使用默认值
        if (charsetSize === 0) charsetSize = 26;
        
        // 计算熵：log2(字符集大小^密码长度) = 密码长度 * log2(字符集大小)
        const entropy = Math.log2(Math.pow(charsetSize, password.length));
        
        return entropy;
      }
      
      // 估计破解时间
      function estimateCrackTime(entropy) {
        // 假设每秒可以尝试10亿个密码
        const guessesPerSecond = 1000000000;
        
        // 平均需要尝试的次数是可能组合的一半
        const combinations = Math.pow(2, entropy);
        const seconds = combinations / (2 * guessesPerSecond);
        
        // 转换为更易读的时间格式
        if (seconds < 60) {
          return '瞬间';
        } else if (seconds < 3600) {
          return `${Math.round(seconds / 60)} 分钟`;
        } else if (seconds < 86400) {
          return `${Math.round(seconds / 3600)} 小时`;
        } else if (seconds < 31536000) {
          return `${Math.round(seconds / 86400)} 天`;
        } else if (seconds < 3153600000) {
          return `${Math.round(seconds / 31536000)} 年`;
        } else if (seconds < 315360000000) {
          return `${Math.round(seconds / 3153600000)} 世纪`;
        } else {
          return '数百万年以上';
        }
      }
      
      // 评估密码强度
      function evaluatePasswordStrength(password) {
        if (!password) {
          strengthBar.className = 'strength-bar';
          strengthBar.style.width = '0%';
          strengthText.textContent = '';
          crackTime.textContent = '';
          entropyValue.textContent = '0 位';
          return;
        }
        
        // 基础分数
        let score = 0;
        
        // 长度得分
        score += Math.min(10, password.length / 2);
        
        // 字符类型得分
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[^A-Za-z0-9]/.test(password);
        
        const typesCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
        score += typesCount * 2.5;
        
        // 额外规则
        if (password.length >= 12) score += 2;
        if (password.length >= 16) score += 2;
        
        // 重复字符和序列的惩罚
        const repeats = password.match(/(.)\1{2,}/g);
        if (repeats) {
          score -= repeats.length * 1.5;
        }
        
        // 检查是否是常见密码
        if (commonPasswords.includes(password.toLowerCase())) {
          score = Math.min(score, 5); // 限制常见密码的分数
        }
        
        // 计算熵
        const entropy = calculateEntropy(password);
        entropyValue.textContent = `${Math.round(entropy)} 位`;
        
        // 估计破解时间
        crackTime.textContent = estimateCrackTime(entropy);
        
        // 设置强度显示
        let strengthClass = '';
        let strengthDescription = '';
        
        if (score < 7) {
          strengthClass = 'very-weak';
          strengthDescription = '非常弱';
        } else if (score < 10) {
          strengthClass = 'weak';
          strengthDescription = '弱';
        } else if (score < 14) {
          strengthClass = 'medium';
          strengthDescription = '中等';
        } else if (score < 18) {
          strengthClass = 'strong';
          strengthDescription = '强';
        } else {
          strengthClass = 'very-strong';
          strengthDescription = '非常强';
        }
        
        // 更新UI
        strengthBar.className = `strength-bar ${strengthClass}`;
        strengthBar.style.width = `${Math.min(100, score * 5)}%`;
        strengthText.textContent = strengthDescription;
      }
      
      // 保存密码到历史记录
      function savePassword() {
        const password = passwordOutput.value;
        if (!password) {
          showToast('没有密码可保存', 'warning');
          return;
        }
        
        // 获取历史记录
        let history = JSON.parse(localStorage.getItem('passwordHistory') || '[]');
        
        // 添加新密码，带时间戳
        history.unshift({
          password: password,
          timestamp: new Date().toISOString(),
          length: password.length
        });
        
        // 限制历史记录数量
        if (history.length > 10) {
          history = history.slice(0, 10);
        }
        
        // 保存历史记录
        localStorage.setItem('passwordHistory', JSON.stringify(history));
        
        // 更新UI
        updateHistoryList();
        
        showToast('密码已保存到历史记录', 'success');
      }
      
      // 更新历史记录列表
      function updateHistoryList() {
        const history = JSON.parse(localStorage.getItem('passwordHistory') || '[]');
        
        if (history.length === 0) {
          historyList.innerHTML = '<div class="no-history">暂无历史记录</div>';
          return;
        }
        
        let html = '';
        history.forEach((item, index) => {
          const date = new Date(item.timestamp);
          const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
          
          html += `
            <div class="history-item">
              <div class="history-password">${item.password}</div>
              <div class="history-info">
                <span class="history-date">${formattedDate}</span>
                <span class="history-length">${item.length} 个字符</span>
              </div>
              <div class="history-actions">
                <button class="btn btn-sm use-password" data-index="${index}"><i class="fa fa-arrow-up"></i> 使用</button>
                <button class="btn btn-sm copy-password" data-index="${index}"><i class="fa fa-copy"></i> 复制</button>
              </div>
            </div>
          `;
        });
        
        historyList.innerHTML = html;
        
        // 添加事件监听
        historyList.querySelectorAll('.use-password').forEach(btn => {
          btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            passwordOutput.value = history[index].password;
            evaluatePasswordStrength(history[index].password);
          });
        });
        
        historyList.querySelectorAll('.copy-password').forEach(btn => {
          btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            copyToClipboard(history[index].password);
          });
        });
      }
      
      // 事件监听
      generateBtn.addEventListener('click', generatePassword);
      
      refreshBtn.addEventListener('click', generatePassword);
      
      copyBtn.addEventListener('click', () => {
        copyToClipboard(passwordOutput.value);
      });
      
      saveBtn.addEventListener('click', savePassword);
      
      clearHistory.addEventListener('click', () => {
        if (confirm('确定要清空所有历史记录吗？')) {
          localStorage.removeItem('passwordHistory');
          updateHistoryList();
          showToast('历史记录已清空', 'info');
        }
      });
      
      // 初始化
      generatePassword();
      updateHistoryList();
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .password-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .password-result {
          flex: 1;
          min-width: 300px;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 20px;
        }
        
        .password-options {
          flex: 1;
          min-width: 300px;
        }
        
        .password-display {
          display: flex;
          margin-bottom: 15px;
        }
        
        .password-display input {
          flex-grow: 1;
          font-family: monospace;
          font-size: 18px;
          padding: 10px 15px;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        
        .btn-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0;
          margin-left: -1px;
        }
        
        .btn-icon:last-child {
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
        
        .password-strength {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .strength-label {
          white-space: nowrap;
        }
        
        .strength-meter {
          flex-grow: 1;
          height: 8px;
          background-color: var(--border-color);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .strength-bar {
          height: 100%;
          width: 0;
          transition: width 0.3s ease, background-color 0.3s ease;
        }
        
        .strength-bar.very-weak {
          background-color: #e74c3c;
          width: 20%;
        }
        
        .strength-bar.weak {
          background-color: #e67e22;
          width: 40%;
        }
        
        .strength-bar.medium {
          background-color: #f1c40f;
          width: 60%;
        }
        
        .strength-bar.strong {
          background-color: #2ecc71;
          width: 80%;
        }
        
        .strength-bar.very-strong {
          background-color: #27ae60;
          width: 100%;
        }
        
        .strength-text {
          min-width: 60px;
          text-align: right;
        }
        
        .range-with-value {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .range-with-value input {
          flex: 1;
        }
        
        .range-with-value span {
          min-width: 30px;
          text-align: right;
        }
        
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .form-check {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .password-history {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .history-header h3 {
          margin: 0;
          font-size: 16px;
        }
        
        .history-list {
          max-height: 300px;
          overflow-y: auto;
        }
        
        .history-item {
          padding: 15px 20px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }
        
        .history-item:last-child {
          border-bottom: none;
        }
        
        .history-password {
          font-family: monospace;
          background-color: var(--bg-color);
          padding: 5px 10px;
          border-radius: 4px;
          flex-grow: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .history-info {
          display: flex;
          gap: 15px;
          color: var(--text-muted);
          font-size: 12px;
          white-space: nowrap;
        }
        
        .history-actions {
          display: flex;
          gap: 5px;
        }
        
        .no-history {
          padding: 20px;
          text-align: center;
          color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
          .password-container {
            flex-direction: column;
          }
          
          .history-item {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .history-password {
            width: 100%;
          }
          
          .history-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `;
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.passwordGenerator = tool;
})();