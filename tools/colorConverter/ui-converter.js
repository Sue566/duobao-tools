/**
 * 多宝工具箱 - 颜色转换工具 - 转换器UI模块
 */

const uiConverter = {
  // 渲染转换器标签页
  render: function(container) {
    const converterTab = container.querySelector('#tab-converter');
    
    converterTab.innerHTML = `
      <div class="color-container">
        <div class="color-input-section">
          <div class="color-preview-container">
            <div class="color-preview" id="color-preview"></div>
            <div class="color-preview-text" id="color-preview-text">#3498db</div>
            <div class="color-picker-wrapper">
              <input type="color" id="color-picker" value="#3498db" />
              <label for="color-picker" class="color-picker-label">选择颜色</label>
            </div>
          </div>
      
          <div class="color-input-tabs">
            <div class="tab-header">
              <button class="tab-btn active" data-tab="hex">HEX</button>
              <button class="tab-btn" data-tab="rgb">RGB</button>
              <button class="tab-btn" data-tab="hsl">HSL</button>
              <button class="tab-btn" data-tab="named">命名颜色</button>
            </div>
            
            <div class="tab-content">
              <div class="tab-pane active" id="tab-hex">
                <div class="form-group">
                  <label for="hex-input">HEX 颜色值</label>
                  <div class="input-with-buttons">
                    <input type="text" id="hex-input" class="form-control" placeholder="#RRGGBB 或 #RGB" value="#3498db" />
                    <button id="convert-hex" class="btn btn-success"><i class="fa fa-refresh"></i> 转换</button>
                  </div>
                </div>
              </div>
              
              <div class="tab-pane" id="tab-rgb">
                <div class="form-group">
                  <label>RGB 颜色值</label>
                  <div class="rgb-inputs">
                    <div class="rgb-input">
                      <label for="rgb-r">R</label>
                      <input type="number" id="rgb-r" class="form-control" min="0" max="255" value="52" />
                    </div>
                    <div class="rgb-input">
                      <label for="rgb-g">G</label>
                      <input type="number" id="rgb-g" class="form-control" min="0" max="255" value="152" />
                    </div>
                    <div class="rgb-input">
                      <label for="rgb-b">B</label>
                      <input type="number" id="rgb-b" class="form-control" min="0" max="255" value="219" />
                    </div>
                    <button id="convert-rgb" class="btn btn-success"><i class="fa fa-refresh"></i> 转换</button>
                  </div>
                </div>
              </div>
              
              <div class="tab-pane" id="tab-hsl">
                <div class="form-group">
                  <label>HSL 颜色值</label>
                  <div class="hsl-inputs">
                    <div class="hsl-input">
                      <label for="hsl-h">H</label>
                      <input type="number" id="hsl-h" class="form-control" min="0" max="360" value="204" />
                    </div>
                    <div class="hsl-input">
                      <label for="hsl-s">S</label>
                      <div class="input-with-unit">
                        <input type="number" id="hsl-s" class="form-control" min="0" max="100" value="70" />
                        <span class="unit">%</span>
                      </div>
                    </div>
                    <div class="hsl-input">
                      <label for="hsl-l">L</label>
                      <div class="input-with-unit">
                        <input type="number" id="hsl-l" class="form-control" min="0" max="100" value="53" />
                        <span class="unit">%</span>
                      </div>
                    </div>
                    <button id="convert-hsl" class="btn btn-success"><i class="fa fa-refresh"></i> 转换</button>
                  </div>
                </div>
              </div>
              
              <div class="tab-pane" id="tab-named">
                <div class="form-group">
                  <label for="named-color">命名颜色</label>
                  <div class="input-with-buttons">
                    <select id="named-color" class="form-control">
                      <option value="aliceblue">AliceBlue - #F0F8FF</option>
                      <option value="antiquewhite">AntiqueWhite - #FAEBD7</option>
                      <option value="aqua">Aqua - #00FFFF</option>
                      <option value="aquamarine">Aquamarine - #7FFFD4</option>
                      <option value="azure">Azure - #F0FFFF</option>
                      <option value="beige">Beige - #F5F5DC</option>
                      <option value="bisque">Bisque - #FFE4C4</option>
                      <option value="black">Black - #000000</option>
                      <option value="blanchedalmond">BlanchedAlmond - #FFEBCD</option>
                      <option value="blue">Blue - #0000FF</option>
                      <option value="blueviolet">BlueViolet - #8A2BE2</option>
                      <option value="brown">Brown - #A52A2A</option>
                      <option value="burlywood">BurlyWood - #DEB887</option>
                      <option value="cadetblue">CadetBlue - #5F9EA0</option>
                      <option value="chartreuse">Chartreuse - #7FFF00</option>
                      <option value="chocolate">Chocolate - #D2691E</option>
                      <option value="coral">Coral - #FF7F50</option>
                      <option value="cornflowerblue">CornflowerBlue - #6495ED</option>
                      <option value="cornsilk">Cornsilk - #FFF8DC</option>
                      <option value="crimson">Crimson - #DC143C</option>
                      <option value="cyan">Cyan - #00FFFF</option>
                      <option value="darkblue">DarkBlue - #00008B</option>
                      <option value="darkcyan">DarkCyan - #008B8B</option>
                      <option value="darkgoldenrod">DarkGoldenRod - #B8860B</option>
                      <option value="darkgray">DarkGray - #A9A9A9</option>
                      <option value="darkgreen">DarkGreen - #006400</option>
                      <option value="darkkhaki">DarkKhaki - #BDB76B</option>
                      <option value="darkmagenta">DarkMagenta - #8B008B</option>
                      <option value="darkolivegreen">DarkOliveGreen - #556B2F</option>
                      <option value="darkorange">DarkOrange - #FF8C00</option>
                      <option value="darkorchid">DarkOrchid - #9932CC</option>
                      <option value="darkred">DarkRed - #8B0000</option>
                      <option value="darksalmon">DarkSalmon - #E9967A</option>
                      <option value="darkseagreen">DarkSeaGreen - #8FBC8F</option>
                      <option value="darkslateblue">DarkSlateBlue - #483D8B</option>
                      <option value="darkslategray">DarkSlateGray - #2F4F4F</option>
                      <option value="darkturquoise">DarkTurquoise - #00CED1</option>
                      <option value="darkviolet">DarkViolet - #9400D3</option>
                      <option value="deeppink">DeepPink - #FF1493</option>
                      <option value="deepskyblue">DeepSkyBlue - #00BFFF</option>
                      <option value="dimgray">DimGray - #696969</option>
                      <option value="dodgerblue">DodgerBlue - #1E90FF</option>
                      <option value="firebrick">FireBrick - #B22222</option>
                      <option value="floralwhite">FloralWhite - #FFFAF0</option>
                      <option value="forestgreen">ForestGreen - #228B22</option>
                      <option value="fuchsia">Fuchsia - #FF00FF</option>
                      <option value="gainsboro">Gainsboro - #DCDCDC</option>
                      <option value="ghostwhite">GhostWhite - #F8F8FF</option>
                      <option value="gold">Gold - #FFD700</option>
                      <option value="goldenrod">GoldenRod - #DAA520</option>
                      <option value="gray">Gray - #808080</option>
                      <option value="green">Green - #008000</option>
                      <option value="greenyellow">GreenYellow - #ADFF2F</option>
                      <option value="honeydew">HoneyDew - #F0FFF0</option>
                      <option value="hotpink">HotPink - #FF69B4</option>
                      <option value="indianred">IndianRed - #CD5C5C</option>
                      <option value="indigo">Indigo - #4B0082</option>
                      <option value="ivory">Ivory - #FFFFF0</option>
                      <option value="khaki">Khaki - #F0E68C</option>
                      <option value="lavender">Lavender - #E6E6FA</option>
                      <option value="lavenderblush">LavenderBlush - #FFF0F5</option>
                      <option value="lawngreen">LawnGreen - #7CFC00</option>
                      <option value="lemonchiffon">LemonChiffon - #FFFACD</option>
                      <option value="lightblue">LightBlue - #ADD8E6</option>
                      <option value="lightcoral">LightCoral - #F08080</option>
                      <option value="lightcyan">LightCyan - #E0FFFF</option>
                      <option value="lightgoldenrodyellow">LightGoldenRodYellow - #FAFAD2</option>
                      <option value="lightgray">LightGray - #D3D3D3</option>
                      <option value="lightgreen">LightGreen - #90EE90</option>
                      <option value="lightpink">LightPink - #FFB6C1</option>
                      <option value="lightsalmon">LightSalmon - #FFA07A</option>
                      <option value="lightseagreen">LightSeaGreen - #20B2AA</option>
                      <option value="lightskyblue">LightSkyBlue - #87CEFA</option>
                      <option value="lightslategray">LightSlateGray - #778899</option>
                      <option value="lightsteelblue">LightSteelBlue - #B0C4DE</option>
                      <option value="lightyellow">LightYellow - #FFFFE0</option>
                      <option value="lime">Lime - #00FF00</option>
                      <option value="limegreen">LimeGreen - #32CD32</option>
                      <option value="linen">Linen - #FAF0E6</option>
                      <option value="magenta">Magenta - #FF00FF</option>
                      <option value="maroon">Maroon - #800000</option>
                      <option value="mediumaquamarine">MediumAquaMarine - #66CDAA</option>
                      <option value="mediumblue">MediumBlue - #0000CD</option>
                      <option value="mediumorchid">MediumOrchid - #BA55D3</option>
                      <option value="mediumpurple">MediumPurple - #9370DB</option>
                      <option value="mediumseagreen">MediumSeaGreen - #3CB371</option>
                      <option value="mediumslateblue">MediumSlateBlue - #7B68EE</option>
                      <option value="mediumspringgreen">MediumSpringGreen - #00FA9A</option>
                      <option value="mediumturquoise">MediumTurquoise - #48D1CC</option>
                      <option value="mediumvioletred">MediumVioletRed - #C71585</option>
                      <option value="midnightblue">MidnightBlue - #191970</option>
                      <option value="mintcream">MintCream - #F5FFFA</option>
                      <option value="mistyrose">MistyRose - #FFE4E1</option>
                      <option value="moccasin">Moccasin - #FFE4B5</option>
                      <option value="navajowhite">NavajoWhite - #FFDEAD</option>
                      <option value="navy">Navy - #000080</option>
                      <option value="oldlace">OldLace - #FDF5E6</option>
                      <option value="olive">Olive - #808000</option>
                      <option value="olivedrab">OliveDrab - #6B8E23</option>
                      <option value="orange">Orange - #FFA500</option>
                      <option value="orangered">OrangeRed - #FF4500</option>
                      <option value="orchid">Orchid - #DA70D6</option>
                      <option value="palegoldenrod">PaleGoldenRod - #EEE8AA</option>
                      <option value="palegreen">PaleGreen - #98FB98</option>
                      <option value="paleturquoise">PaleTurquoise - #AFEEEE</option>
                      <option value="palevioletred">PaleVioletRed - #DB7093</option>
                      <option value="papayawhip">PapayaWhip - #FFEFD5</option>
                      <option value="peachpuff">PeachPuff - #FFDAB9</option>
                      <option value="peru">Peru - #CD853F</option>
                      <option value="pink">Pink - #FFC0CB</option>
                      <option value="plum">Plum - #DDA0DD</option>
                      <option value="powderblue">PowderBlue - #B0E0E6</option>
                      <option value="purple">Purple - #800080</option>
                      <option value="rebeccapurple">RebeccaPurple - #663399</option>
                      <option value="red">Red - #FF0000</option>
                      <option value="rosybrown">RosyBrown - #BC8F8F</option>
                      <option value="royalblue">RoyalBlue - #4169E1</option>
                      <option value="saddlebrown">SaddleBrown - #8B4513</option>
                      <option value="salmon">Salmon - #FA8072</option>
                      <option value="sandybrown">SandyBrown - #F4A460</option>
                      <option value="seagreen">SeaGreen - #2E8B57</option>
                      <option value="seashell">SeaShell - #FFF5EE</option>
                      <option value="sienna">Sienna - #A0522D</option>
                      <option value="silver">Silver - #C0C0C0</option>
                      <option value="skyblue">SkyBlue - #87CEEB</option>
                      <option value="slateblue">SlateBlue - #6A5ACD</option>
                      <option value="slategray">SlateGray - #708090</option>
                      <option value="snow">Snow - #FFFAFA</option>
                      <option value="springgreen">SpringGreen - #00FF7F</option>
                      <option value="steelblue">SteelBlue - #4682B4</option>
                      <option value="tan">Tan - #D2B48C</option>
                      <option value="teal">Teal - #008080</option>
                      <option value="thistle">Thistle - #D8BFD8</option>
                      <option value="tomato">Tomato - #FF6347</option>
                      <option value="turquoise">Turquoise - #40E0D0</option>
                      <option value="violet">Violet - #EE82EE</option>
                      <option value="wheat">Wheat - #F5DEB3</option>
                      <option value="white">White - #FFFFFF</option>
                      <option value="whitesmoke">WhiteSmoke - #F5F5F5</option>
                      <option value="yellow">Yellow - #FFFF00</option>
                      <option value="yellowgreen">YellowGreen - #9ACD32</option>
                    </select>
                    <button id="convert-named" class="btn btn-success"><i class="fa fa-refresh"></i> 转换</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="color-output-section">
          <div class="color-output-header">
            <h3>转换结果</h3>
            <div class="color-actions">
              <button id="copy-all" class="btn btn-sm"><i class="fa fa-copy"></i> 复制所有</button>
              <button id="add-to-palette" class="btn btn-sm"><i class="fa fa-plus"></i> 添加到调色板</button>
            </div>
          </div>
      
          <div class="color-output-content">
            <div class="color-format-item">
              <div class="format-label">HEX</div>
              <div class="format-value" id="output-hex">#3498db</div>
              <button class="btn btn-icon btn-sm copy-btn" data-target="output-hex" title="复制"><i class="fa fa-copy"></i></button>
            </div>
            
            <div class="color-format-item">
              <div class="format-label">RGB</div>
              <div class="format-value" id="output-rgb">rgb(52, 152, 219)</div>
              <button class="btn btn-icon btn-sm copy-btn" data-target="output-rgb" title="复制"><i class="fa fa-copy"></i></button>
            </div>
            
            <div class="color-format-item">
              <div class="format-label">RGBA</div>
              <div class="format-value" id="output-rgba">rgba(52, 152, 219, 1)</div>
              <button class="btn btn-icon btn-sm copy-btn" data-target="output-rgba" title="复制"><i class="fa fa-copy"></i></button>
            </div>
            
            <div class="color-format-item">
              <div class="format-label">HSL</div>
              <div class="format-value" id="output-hsl">hsl(204, 70%, 53%)</div>
              <button class="btn btn-icon btn-sm copy-btn" data-target="output-hsl" title="复制"><i class="fa fa-copy"></i></button>
            </div>
            
            <div class="color-format-item">
              <div class="format-label">HSLA</div>
              <div class="format-value" id="output-hsla">hsla(204, 70%, 53%, 1)</div>
              <button class="btn btn-icon btn-sm copy-btn" data-target="output-hsla" title="复制"><i class="fa fa-copy"></i></button>
            </div>
            
            <div class="color-format-item">
              <div class="format-label">命名颜色</div>
              <div class="format-value" id="output-named">-</div>
              <button class="btn btn-icon btn-sm copy-btn" data-target="output-named" title="复制"><i class="fa fa-copy"></i></button>
            </div>
            
            <div class="color-format-item">
              <div class="format-label">CMYK</div>
              <div class="format-value" id="output-cmyk">cmyk(76%, 31%, 0%, 14%)</div>
              <button class="btn btn-icon btn-sm copy-btn" data-target="output-cmyk" title="复制"><i class="fa fa-copy"></i></button>
            </div>
            
            <div class="color-format-item">
              <div class="format-label">HWB</div>
              <div class="format-value" id="output-hwb">hwb(204, 20%, 14%)</div>
              <button class="btn btn-icon btn-sm copy-btn" data-target="output-hwb" title="复制"><i class="fa fa-copy"></i></button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // 初始化内部标签页
    this.initInnerTabs(converterTab);
    
    // 添加样式
    this.addStyles(container);
  },
  
  // 初始化内部标签页
  initInnerTabs: function(converterTab) {
    const innerTabButtons = converterTab.querySelectorAll('.color-input-tabs > .tab-header > .tab-btn');
    const innerTabPanes = converterTab.querySelectorAll('.color-input-tabs > .tab-content > .tab-pane');
    
    innerTabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.getAttribute('data-tab');
        
        // 移除所有活动状态
        innerTabButtons.forEach(btn => btn.classList.remove('active'));
        innerTabPanes.forEach(pane => pane.classList.remove('active'));
        
        // 添加活动状态
        button.classList.add('active');
        converterTab.querySelector(`#tab-${tab}`).classList.add('active');
      });
    });
  },
  
  // 添加转换器样式
  addStyles: function(container) {
    const style = document.createElement('style');
    style.textContent = `
      .color-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .color-input-section {
        flex: 1;
        min-width: 300px;
      }
      
      .color-output-section {
        flex: 1;
        min-width: 300px;
      }
      
      .color-preview-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .color-preview {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 1px solid var(--border-color);
        margin-bottom: 10px;
        background-color: #3498db;
      }
      
      .color-preview-text {
        font-family: monospace;
        font-size: 16px;
      }
      
      .tab-pane {
        display: none;
      }
      
      .tab-pane.active {
        display: block;
      }
      
      .input-with-buttons {
        display: flex;
        gap: 10px;
      }
      
      .input-with-buttons input, .input-with-buttons select {
        flex-grow: 1;
      }
      
      .rgb-inputs, .hsl-inputs {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: flex-end;
      }
      
      .rgb-input, .hsl-input {
        flex: 1;
        min-width: 60px;
      }
      
      .rgb-input label, .hsl-input label {
        display: block;
        margin-bottom: 5px;
      }
      
      .input-with-unit {
        display: flex;
        align-items: center;
      }
      
      .input-with-unit input {
        flex-grow: 1;
      }
      
      .input-with-unit .unit {
        margin-left: 5px;
        color: var(--text-muted);
      }
      
      .color-output-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .color-output-header h3 {
        margin: 0;
      }
      
      .color-actions {
        display: flex;
        gap: 10px;
      }
      
      .color-output-content {
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 15px;
      }
      
      .color-format-item {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .color-format-item:last-child {
        margin-bottom: 0;
      }
      
      .format-label {
        width: 60px;
        color: var(--text-muted);
      }
      
      .format-value {
        flex-grow: 1;
        font-family: monospace;
      }
    `;
    container.appendChild(style);
  }
};

module.exports = uiConverter;
