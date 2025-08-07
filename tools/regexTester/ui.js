/**
 * 正则表达式测试工具 - UI渲染模块
 */
import { addStyles } from './styles.js';

/**
 * 渲染工具界面
 * @param {HTMLElement} container - 容器元素
 */
export function renderUI(container) {
  // 创建工具界面
  container.innerHTML = `
    <div class="tool-header">
      <h2><i class="fa fa-terminal"></i> 正则表达式测试</h2>
      <p class="tool-description">测试、验证和保存正则表达式，实时查看匹配结果和替换效果。</p>
    </div>
    
    <div class="regex-container">
      <div class="regex-input-section">
        <div class="form-group">
          <div class="regex-header">
            <label for="regex-pattern">正则表达式</label>
            <div class="regex-actions-small">
              <button id="save-regex" class="btn btn-sm" title="保存正则表达式"><i class="fa fa-save"></i></button>
              <button id="load-regex" class="btn btn-sm" title="加载保存的正则表达式"><i class="fa fa-folder-open"></i></button>
              <button id="templates-btn" class="btn btn-sm" title="常用正则模板"><i class="fa fa-list"></i></button>
            </div>
          </div>
          <div class="regex-input-wrapper">
            <span class="regex-delimiter">/</span>
            <input type="text" id="regex-pattern" class="form-control" placeholder="输入正则表达式..." />
            <span class="regex-delimiter">/</span>
            <input type="text" id="regex-flags" class="form-control regex-flags" placeholder="gim" maxlength="5" />
          </div>
        </div>
        
        <div class="form-group">
          <label for="regex-test-string">测试文本</label>
          <div class="textarea-with-stats">
            <textarea id="regex-test-string" class="form-control" placeholder="输入需要测试的文本..."></textarea>
            <div class="text-stats">
              <span class="stat-item"><i class="fa fa-font"></i> <span id="char-count">0</span> 字符</span>
              <span class="stat-item"><i class="fa fa-align-left"></i> <span id="line-count">0</span> 行</span>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="regex-replace">替换为 <small>(可选)</small></label>
          <input type="text" id="regex-replace" class="form-control" placeholder="输入替换文本，可使用 $1, $2 等引用捕获组..." />
        </div>
        
        <div class="regex-options">
          <div class="form-check">
            <input type="checkbox" id="highlight-matches" checked />
            <label for="highlight-matches">高亮匹配</label>
          </div>
          <div class="form-check">
            <input type="checkbox" id="line-numbers" checked />
            <label for="line-numbers">显示行号</label>
          </div>
          <div class="form-check">
            <input type="checkbox" id="auto-update" checked />
            <label for="auto-update">自动更新</label>
          </div>
          <div class="form-check">
            <input type="checkbox" id="show-replace" />
            <label for="show-replace">显示替换结果</label>
          </div>
        </div>
        
        <div class="regex-actions">
          <button id="test-btn" class="btn btn-success"><i class="fa fa-play"></i> 测试</button>
          <button id="copy-regex-btn" class="btn btn-info"><i class="fa fa-copy"></i> 复制正则</button>
          <button id="clear-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
          <button id="export-btn" class="btn btn-secondary"><i class="fa fa-download"></i> 导出</button>
        </div>
      </div>
      
      <div class="regex-result-section">
        <div class="regex-tabs">
          <button class="regex-tab active" data-tab="match">匹配结果</button>
          <button class="regex-tab" data-tab="replace">替换结果</button>
          <button class="regex-tab" data-tab="details">匹配详情</button>
          <div class="regex-stats">
            <span id="match-count">0 个匹配</span>
          </div>
        </div>
        
        <div class="regex-tab-content active" id="tab-match">
          <div class="regex-result-content">
            <div id="regex-result" class="regex-result"></div>
          </div>
        </div>
        
        <div class="regex-tab-content" id="tab-replace">
          <div class="regex-result-content">
            <div id="regex-replace-result" class="regex-result"></div>
          </div>
          <div class="regex-result-actions">
            <button id="copy-replace-btn" class="btn btn-sm"><i class="fa fa-copy"></i> 复制替换结果</button>
          </div>
        </div>
        
        <div class="regex-tab-content" id="tab-details">
          <div class="regex-matches-content">
            <div id="regex-matches" class="regex-matches"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="regex-cheatsheet">
      <div class="cheatsheet-header" id="toggle-cheatsheet">
        <h3><i class="fa fa-book"></i> 正则表达式速查表</h3>
        <i class="fa fa-chevron-down"></i>
      </div>
      <div class="cheatsheet-content" id="cheatsheet-content" style="display: none;">
        <div class="cheatsheet-section">
          <h4>字符类</h4>
          <table>
            <tr>
              <td><code>.</code></td>
              <td>匹配除换行符外的任意字符</td>
            </tr>
            <tr>
              <td><code>\\w</code></td>
              <td>匹配字母、数字、下划线</td>
            </tr>
            <tr>
              <td><code>\\d</code></td>
              <td>匹配数字</td>
            </tr>
            <tr>
              <td><code>\\s</code></td>
              <td>匹配空白字符</td>
            </tr>
            <tr>
              <td><code>\\W</code></td>
              <td>匹配非字母、数字、下划线</td>
            </tr>
            <tr>
              <td><code>\\D</code></td>
              <td>匹配非数字</td>
            </tr>
            <tr>
              <td><code>\\S</code></td>
              <td>匹配非空白字符</td>
            </tr>
            <tr>
              <td><code>[abc]</code></td>
              <td>匹配a、b或c</td>
            </tr>
            <tr>
              <td><code>[^abc]</code></td>
              <td>匹配除a、b、c之外的字符</td>
            </tr>
            <tr>
              <td><code>[a-z]</code></td>
              <td>匹配a到z的小写字母</td>
            </tr>
          </table>
        </div>
        
        <div class="cheatsheet-section">
          <h4>锚点</h4>
          <table>
            <tr>
              <td><code>^</code></td>
              <td>匹配行的开头</td>
            </tr>
            <tr>
              <td><code>$</code></td>
              <td>匹配行的结尾</td>
            </tr>
            <tr>
              <td><code>\\b</code></td>
              <td>匹配单词边界</td>
            </tr>
            <tr>
              <td><code>\\B</code></td>
              <td>匹配非单词边界</td>
            </tr>
          </table>
        </div>
        
        <div class="cheatsheet-section">
          <h4>量词</h4>
          <table>
            <tr>
              <td><code>*</code></td>
              <td>匹配前面的表达式0次或多次</td>
            </tr>
            <tr>
              <td><code>+</code></td>
              <td>匹配前面的表达式1次或多次</td>
            </tr>
            <tr>
              <td><code>?</code></td>
              <td>匹配前面的表达式0次或1次</td>
            </tr>
            <tr>
              <td><code>{n}</code></td>
              <td>匹配前面的表达式恰好n次</td>
            </tr>
            <tr>
              <td><code>{n,}</code></td>
              <td>匹配前面的表达式至少n次</td>
            </tr>
            <tr>
              <td><code>{n,m}</code></td>
              <td>匹配前面的表达式n到m次</td>
            </tr>
          </table>
        </div>
        
        <div class="cheatsheet-section">
          <h4>分组和引用</h4>
          <table>
            <tr>
              <td><code>(abc)</code></td>
              <td>捕获组，匹配abc并记住匹配项</td>
            </tr>
            <tr>
              <td><code>(?:abc)</code></td>
              <td>非捕获组，匹配abc但不记住匹配项</td>
            </tr>
            <tr>
              <td><code>\\1</code></td>
              <td>反向引用，匹配第一个捕获组的内容</td>
            </tr>
          </table>
        </div>
        
        <div class="cheatsheet-section">
          <h4>特殊字符</h4>
          <table>
            <tr>
              <td><code>\\</code></td>
              <td>转义字符</td>
            </tr>
            <tr>
              <td><code>|</code></td>
              <td>或运算符</td>
            </tr>
            <tr>
              <td><code>\\n</code></td>
              <td>换行符</td>
            </tr>
            <tr>
              <td><code>\\t</code></td>
              <td>制表符</td>
            </tr>
          </table>
        </div>
        
        <div class="cheatsheet-section">
          <h4>标志</h4>
          <table>
            <tr>
              <td><code>g</code></td>
              <td>全局匹配</td>
            </tr>
            <tr>
              <td><code>i</code></td>
              <td>忽略大小写</td>
            </tr>
            <tr>
              <td><code>m</code></td>
              <td>多行匹配</td>
            </tr>
            <tr>
              <td><code>s</code></td>
              <td>允许.匹配换行符</td>
            </tr>
            <tr>
              <td><code>u</code></td>
              <td>Unicode模式</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    
    <!-- 保存正则表达式对话框 -->
    <div id="save-regex-dialog" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>保存正则表达式</h3>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="regex-name">名称</label>
            <input type="text" id="regex-name" class="form-control" placeholder="输入名称...">
          </div>
          <div class="form-group">
            <label for="regex-description">描述 (可选)</label>
            <textarea id="regex-description" class="form-control" placeholder="输入描述..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button id="save-regex-confirm" class="btn btn-success">保存</button>
          <button class="btn btn-secondary close-modal">取消</button>
        </div>
      </div>
    </div>
    
    <!-- 加载正则表达式对话框 -->
    <div id="load-regex-dialog" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>加载正则表达式</h3>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <div id="saved-regex-list" class="saved-regex-list">
            <div class="no-saved-regex">暂无保存的正则表达式</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary close-modal">取消</button>
        </div>
      </div>
    </div>
    
    <!-- 正则表达式模板对话框 -->
    <div id="templates-dialog" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>常用正则表达式模板</h3>
          <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="templates-list">
            <div class="template-category">
              <h4>验证类</h4>
              <div class="template-items">
                <div class="template-item" data-pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$" data-flags="i">
                  <div class="template-name">电子邮箱</div>
                  <div class="template-desc">验证电子邮箱地址格式</div>
                </div>
                <div class="template-item" data-pattern="^1[3-9]\\d{9}$" data-flags="">
                  <div class="template-name">中国手机号</div>
                  <div class="template-desc">验证中国大陆手机号码</div>
                </div>
                <div class="template-item" data-pattern="^(https?|ftp):\\/\\/[^\\s/$.?#].[^\\s]*$" data-flags="i">
                  <div class="template-name">URL地址</div>
                  <div class="template-desc">验证URL地址格式</div>
                </div>
                <div class="template-item" data-pattern="^[1-9]\\d{5}(19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[0-9Xx]$" data-flags="">
                  <div class="template-name">身份证号</div>
                  <div class="template-desc">验证中国大陆身份证号码</div>
                </div>
              </div>
            </div>
            
            <div class="template-category">
              <h4>提取类</h4>
              <div class="template-items">
                <div class="template-item" data-pattern="\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b" data-flags="g">
                  <div class="template-name">提取邮箱</div>
                  <div class="template-desc">从文本中提取所有电子邮箱地址</div>
                </div>
                <div class="template-item" data-pattern="\\b1[3-9]\\d{9}\\b" data-flags="g">
                  <div class="template-name">提取手机号</div>
                  <div class="template-desc">从文本中提取所有手机号码</div>
                </div>
                <div class="template-item" data-pattern="(https?|ftp):\\/\\/[^\\s/$.?#].[^\\s]*" data-flags="gi">
                  <div class="template-name">提取URL</div>
                  <div class="template-desc">从文本中提取所有URL地址</div>
                </div>
                <div class="template-item" data-pattern="#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b" data-flags="g">
                  <div class="template-name">提取颜色代码</div>
                  <div class="template-desc">从文本中提取所有十六进制颜色代码</div>
                </div>
              </div>
            </div>
            
            <div class="template-category">
              <h4>替换类</h4>
              <div class="template-items">
                <div class="template-item" data-pattern="\\s{2,}" data-flags="g" data-replace=" ">
                  <div class="template-name">合并空格</div>
                  <div class="template-desc">将多个连续空格替换为单个空格</div>
                </div>
                <div class="template-item" data-pattern="^\\s+|\\s+$" data-flags="gm" data-replace="">
                  <div class="template-name">去除首尾空格</div>
                  <div class="template-desc">去除每行文本的首尾空格</div>
                </div>
                <div class="template-item" data-pattern="([a-z])([A-Z])" data-flags="g" data-replace="$1_$2">
                  <div class="template-name">驼峰转下划线</div>
                  <div class="template-desc">将驼峰命名法转换为下划线命名法</div>
                </div>
                <div class="template-item" data-pattern="\\b([a-z])([a-z]*)" data-flags="g" data-replace="function(m, p1, p2) { return p1.toUpperCase() + p2; }">
                  <div class="template-name">首字母大写</div>
                  <div class="template-desc">将每个单词的首字母转为大写</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary close-modal">取消</button>
        </div>
      </div>
    </div>
  `;
  
  // 添加收藏按钮
  window.addFavoriteButton('regexTester', container.querySelector('.tool-header'));
  
  // 添加样式
  addStyles(container);
  
  // 设置默认示例
  const patternInput = container.querySelector('#regex-pattern');
  const flagsInput = container.querySelector('#regex-flags');
  const testString = container.querySelector('#regex-test-string');
  
  patternInput.value = '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b';
  flagsInput.value = 'g';
  testString.value = `联系我们：
support@example.com
sales@company.cn
john.doe@mail.co.uk
这不是一个邮箱地址: test@
另一个无效地址: @example.com
`;
}