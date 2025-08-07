/**
 * 颜色转换工具
 * 增强版：支持多种颜色格式、色彩方案生成和颜色可访问性检测
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-eyedropper"></i> 颜色转换</h2>
          <p class="tool-description">在不同颜色格式之间转换，生成色彩方案，检测颜色可访问性。</p>
        </div>
        
        <div class="color-tabs">
          <div class="tab-header">
            <button class="tab-btn active" data-tab="converter">转换器</button>
            <button class="tab-btn" data-tab="schemes">色彩方案</button>
            <button class="tab-btn" data-tab="accessibility">可访问性</button>
            <button class="tab-btn" data-tab="palette">调色板</button>
          </div>
          
          <div class="tab-content active" id="tab-converter">
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
            </div>
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
          </div>
          
          <div class="tab-content" id="tab-schemes">
            <div class="schemes-container">
              <div class="schemes-header">
                <h3>色彩方案生成器</h3>
                <p class="schemes-description">基于当前颜色生成各种色彩方案</p>
              </div>
              
              <div class="schemes-controls">
                <div class="form-group">
                  <label for="scheme-type">方案类型</label>
                  <select id="scheme-type" class="form-control">
                    <option value="monochromatic">单色方案</option>
                    <option value="analogous">类似色方案</option>
                    <option value="complementary">互补色方案</option>
                    <option value="triadic">三色方案</option>
                    <option value="tetradic">四色方案</option>
                    <option value="split-complementary">分离互补色方案</option>
                    <option value="shades">色调方案</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="scheme-count">颜色数量</label>
                  <input type="range" id="scheme-count" min="3" max="10" value="5" class="form-control" />
                  <div class="range-value"><span id="scheme-count-value">5</span> 个颜色</div>
                </div>
                
                <div class="schemes-actions">
                  <button id="generate-scheme" class="btn btn-success"><i class="fa fa-refresh"></i> 生成方案</button>
                  <button id="save-scheme" class="btn"><i class="fa fa-save"></i> 保存方案</button>
                </div>
              </div>
              
              <div class="schemes-result">
                <div class="schemes-preview" id="schemes-preview">
                  <!-- 色彩方案预览将在JavaScript中动态生成 -->
                </div>
                
                <div class="schemes-info">
                  <div class="schemes-info-header">
                    <h4>方案信息</h4>
                    <button id="copy-scheme" class="btn btn-sm"><i class="fa fa-copy"></i> 复制方案</button>
                  </div>
                  
                  <div class="schemes-info-content" id="schemes-info-content">
                    <!-- 方案信息将在JavaScript中动态生成 -->
                  </div>
                </div>
              </div>
              
              <div class="saved-schemes">
                <div class="saved-schemes-header">
                  <h3>已保存的方案</h3>
                  <button id="clear-schemes" class="btn btn-sm btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
                </div>
                
                <div class="saved-schemes-content" id="saved-schemes-content">
                  <div class="no-schemes">暂无保存的色彩方案</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="tab-content" id="tab-accessibility">
            <div class="accessibility-container">
              <div class="accessibility-header">
                <h3>颜色可访问性检测</h3>
                <p class="accessibility-description">检测前景色和背景色的对比度，确保符合WCAG标准</p>
              </div>
              
              <div class="accessibility-controls">
                <div class="color-pair">
                  <div class="color-pair-item">
                    <label>前景色 (文本)</label>
                    <div class="color-input-group">
                      <div class="color-preview-small" id="foreground-preview" style="background-color: #000000;"></div>
                      <input type="text" id="foreground-input" class="form-control" value="#000000" />
                      <input type="color" id="foreground-picker" value="#000000" />
                    </div>
                  </div>
                  
                  <div class="color-pair-item">
                    <label>背景色</label>
                    <div class="color-input-group">
                      <div class="color-preview-small" id="background-preview" style="background-color: #FFFFFF;"></div>
                      <input type="text" id="background-input" class="form-control" value="#FFFFFF" />
                      <input type="color" id="background-picker" value="#FFFFFF" />
                    </div>
                  </div>
                </div>
                
                <div class="accessibility-actions">
                  <button id="check-contrast" class="btn btn-success"><i class="fa fa-check"></i> 检测对比度</button>
                  <button id="swap-colors" class="btn"><i class="fa fa-exchange"></i> 交换颜色</button>
                </div>
              </div>
              
              <div class="accessibility-result">
                <div class="text-preview">
                  <div class="text-preview-header">
                    <h4>文本预览</h4>
                  </div>
                  
                  <div class="text-preview-content" id="text-preview-content">
                    <div class="text-sample text-large">大号文本示例 (18pt)</div>
                    <div class="text-sample text-medium">中号文本示例 (14pt)</div>
                    <div class="text-sample text-small">小号文本示例 (12pt)</div>
                  </div>
                </div>
                
                <div class="contrast-result">
                  <div class="contrast-result-header">
                    <h4>对比度结果</h4>
                  </div>
                  
                  <div class="contrast-result-content" id="contrast-result-content">
                    <!-- 对比度结果将在JavaScript中动态生成 -->
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
            </div>
          </div>
        </div>
        
        <div class="color-palette">
          <div class="palette-header">
            <h3>颜色调色板</h3>
            <div class="palette-actions">
              <button id="clear-palette" class="btn btn-sm btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
            </div>
          </div>
          
          <div class="palette-content" id="palette-content">
            <div class="no-colors">暂无保存的颜色</div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('colorConverter', container.querySelector('.tool-header'));
      
      // 获取元素
      const colorPreview = container.querySelector('#color-preview');
      const colorPreviewText = container.querySelector('#color-preview-text');
      
      const tabButtons = container.querySelectorAll('.tab-btn');
      const tabPanes = container.querySelectorAll('.tab-pane');
      
      const hexInput = container.querySelector('#hex-input');
      const rgbRInput = container.querySelector('#rgb-r');
      const rgbGInput = container.querySelector('#rgb-g');
      const rgbBInput = container.querySelector('#rgb-b');
      const hslHInput = container.querySelector('#hsl-h');
      const hslSInput = container.querySelector('#hsl-s');
      const hslLInput = container.querySelector('#hsl-l');
      const namedColorSelect = container.querySelector('#named-color');
      
      const convertHexBtn = container.querySelector('#convert-hex');
      const convertRgbBtn = container.querySelector('#convert-rgb');
      const convertHslBtn = container.querySelector('#convert-hsl');
      const convertNamedBtn = container.querySelector('#convert-named');
      
      const outputHex = container.querySelector('#output-hex');
      const outputRgb = container.querySelector('#output-rgb');
      const outputRgba = container.querySelector('#output-rgba');
      const outputHsl = container.querySelector('#output-hsl');
      const outputHsla = container.querySelector('#output-hsla');
      const outputNamed = container.querySelector('#output-named');
      
      const copyAllBtn = container.querySelector('#copy-all');
      const addToPaletteBtn = container.querySelector('#add-to-palette');
      const clearPaletteBtn = container.querySelector('#clear-palette');
      const paletteContent = container.querySelector('#palette-content');
      
      // 切换标签页
      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          const tab = button.getAttribute('data-tab');
          
          // 移除所有活动状态
          tabButtons.forEach(btn => btn.classList.remove('active'));
          tabPanes.forEach(pane => pane.classList.remove('active'));
          
          // 添加活动状态
          button.classList.add('active');
          container.querySelector(`#tab-${tab}`).classList.add('active');
        });
      });
      
      // HEX转RGB
      function hexToRgb(hex) {
        // 移除#号
        hex = hex.replace(/^#/, '');
        
        // 处理简写形式
        if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
      }
      
      // RGB转HEX
      function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        }).join('');
      }
      
      // RGB转HSL
      function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
          h = s = 0; // 灰色
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          
          h /= 6;
        }
        
        return {
          h: Math.round(h * 360),
          s: Math.round(s * 100),
          l: Math.round(l * 100)
        };
      }
      
      // HSL转RGB
      function hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;
        
        if (s === 0) {
          r = g = b = l; // 灰色
        } else {
          const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
          };
          
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
        }
        
        return {
          r: Math.round(r * 255),
          g: Math.round(g * 255),
          b: Math.round(b * 255)
        };
      }
      
      // 查找最接近的命名颜色
      function findClosestNamedColor(hex) {
        // 移除#号并转换为小写
        hex = hex.replace(/^#/, '').toLowerCase();
        
        // 遍历所有选项
        let closestColor = null;
        let closestDistance = Infinity;
        
        Array.from(namedColorSelect.options).forEach(option => {
          const colorHex = option.text.split(' - ')[1].replace(/^#/, '').toLowerCase();
          
          // 计算颜色距离
          const distance = calculateColorDistance(hex, colorHex);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestColor = {
              name: option.text.split(' - ')[0],
              value: option.value,
              hex: '#' + colorHex
            };
          }
        });
        
        // 如果距离太远，认为没有匹配的命名颜色
        if (closestDistance > 10) {
          return null;
        }
        
        return closestColor;
      }
      
      // 计算两个颜色的距离
      function calculateColorDistance(hex1, hex2) {
        // 将HEX转换为RGB
        const r1 = parseInt(hex1.substring(0, 2), 16);
        const g1 = parseInt(hex1.substring(2, 4), 16);
        const b1 = parseInt(hex1.substring(4, 6), 16);
        
        const r2 = parseInt(hex2.substring(0, 2), 16);
        const g2 = parseInt(hex2.substring(2, 4), 16);
        const b2 = parseInt(hex2.substring(4, 6), 16);
        
        // 计算欧几里得距离
        return Math.sqrt(
          Math.pow(r1 - r2, 2) +
          Math.pow(g1 - g2, 2) +
          Math.pow(b1 - b2, 2)
        );
      }
      
      // 更新颜色预览
      function updateColorPreview(color) {
        colorPreview.style.backgroundColor = color;
        colorPreviewText.textContent = color;
      }
      
      // 更新输出结果
      function updateOutputs(r, g, b) {
        // HEX
        const hex = rgbToHex(r, g, b);
        outputHex.textContent = hex;
        
        // RGB
        outputRgb.textContent = `rgb(${r}, ${g}, ${b})`;
        
        // RGBA
        outputRgba.textContent = `rgba(${r}, ${g}, ${b}, 1)`;
        
        // HSL
        const hsl = rgbToHsl(r, g, b);
        outputHsl.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        
        // HSLA
        outputHsla.textContent = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`;
        
        // 命名颜色
        const namedColor = findClosestNamedColor(hex);
        if (namedColor && namedColor.hex.toLowerCase() === hex.toLowerCase()) {
          outputNamed.textContent = namedColor.name;
        } else {
          outputNamed.textContent = '-';
        }
        
        // 更新颜色预览
        updateColorPreview(hex);
      }
      
      // 从HEX输入转换
      function convertFromHex() {
        let hex = hexInput.value.trim();
        
        // 验证HEX格式
        if (!hex.match(/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)) {
          showToast('无效的HEX颜色格式', 'error');
          return;
        }
        
        // 确保有#前缀
        if (!hex.startsWith('#')) {
          hex = '#' + hex;
          hexInput.value = hex;
        }
        
        // 转换为RGB
        const rgb = hexToRgb(hex);
        
        // 更新RGB输入
        rgbRInput.value = rgb.r;
        rgbGInput.value = rgb.g;
        rgbBInput.value = rgb.b;
        
        // 转换为HSL
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // 更新HSL输入
        hslHInput.value = hsl.h;
        hslSInput.value = hsl.s;
        hslLInput.value = hsl.l;
        
        // 更新输出
        updateOutputs(rgb.r, rgb.g, rgb.b);
      }
      
      // 从RGB输入转换
      function convertFromRgb() {
        const r = parseInt(rgbRInput.value) || 0;
        const g = parseInt(rgbGInput.value) || 0;
        const b = parseInt(rgbBInput.value) || 0;
        
        // 验证RGB范围
        if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
          showToast('RGB值必须在0-255之间', 'error');
          return;
        }
        
        // 转换为HEX
        const hex = rgbToHex(r, g, b);
        
        // 更新HEX输入
        hexInput.value = hex;
        
        // 转换为HSL
        const hsl = rgbToHsl(r, g, b);
        
        // 更新HSL输入
        hslHInput.value = hsl.h;
        hslSInput.value = hsl.s;
        hslLInput.value = hsl.l;
        
        // 更新输出
        updateOutputs(r, g, b);
      }
      
      // 从HSL输入转换
      function convertFromHsl() {
        const h = parseInt(hslHInput.value) || 0;
        const s = parseInt(hslSInput.value) || 0;
        const l = parseInt(hslLInput.value) || 0;
        
        // 验证HSL范围
        if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) {
          showToast('HSL值超出范围', 'error');
          return;
        }
        
        // 转换为RGB
        const rgb = hslToRgb(h, s, l);
        
        // 更新RGB输入
        rgbRInput.value = rgb.r;
        rgbGInput.value = rgb.g;
        rgbBInput.value = rgb.b;
        
        // 转换为HEX
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        
        // 更新HEX输入
        hexInput.value = hex;
        
        // 更新输出
        updateOutputs(rgb.r, rgb.g, rgb.b);
      }
      
      // 从命名颜色转换
      function convertFromNamed() {
        const colorName = namedColorSelect.value;
        const colorText = namedColorSelect.options[namedColorSelect.selectedIndex].text;
        const hex = colorText.split(' - ')[1];
        
        // 更新HEX输入
        hexInput.value = hex;
        
        // 转换为RGB
        const rgb = hexToRgb(hex);
        
        // 更新RGB输入
        rgbRInput.value = rgb.r;
        rgbGInput.value = rgb.g;
        rgbBInput.value = rgb.b;
        
        // 转换为HSL
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // 更新HSL输入
        hslHInput.value = hsl.h;
        hslSInput.value = hsl.s;
        hslLInput.value = hsl.l;
        
        // 更新输出
        updateOutputs(rgb.r, rgb.g, rgb.b);
      }
      
      // 添加颜色到调色板
      function addToPalette() {
        const hex = outputHex.textContent;
        const rgb = outputRgb.textContent;
        
        // 获取现有调色板
        let palette = JSON.parse(localStorage.getItem('colorPalette') || '[]');
        
        // 检查是否已存在
        if (palette.some(color => color.hex === hex)) {
          showToast('该颜色已在调色板中', 'info');
          return;
        }
        
        // 添加新颜色
        palette.push({
          hex: hex,
          rgb: rgb,
          timestamp: new Date().toISOString()
        });
        
        // 保存调色板
        localStorage.setItem('colorPalette', JSON.stringify(palette));
        
        // 更新调色板显示
        updatePaletteDisplay();
        
        showToast('颜色已添加到调色板', 'success');
      }
      
      // 更新调色板显示
      function updatePaletteDisplay() {
        const palette = JSON.parse(localStorage.getItem('colorPalette') || '[]');
        
        if (palette.length === 0) {
          paletteContent.innerHTML = '<div class="no-colors">暂无保存的颜色</div>';
          return;
        }
        
        let html = '';
        palette.forEach((color, index) => {
          html += `
            <div class="palette-item">
              <div class="palette-color" style="background-color: ${color.hex}"></div>
              <div class="palette-info">
                <div class="palette-hex">${color.hex}</div>
                <div class="palette-rgb">${color.rgb}</div>
              </div>
              <div class="palette-actions">
                <button class="btn btn-icon btn-sm use-color" data-index="${index}" title="使用此颜色"><i class="fa fa-arrow-up"></i></button>
                <button class="btn btn-icon btn-sm remove-color" data-index="${index}" title="移除"><i class="fa fa-times"></i></button>
              </div>
            </div>
          `;
        });
        
        paletteContent.innerHTML = html;
        
        // 添加事件监听
        paletteContent.querySelectorAll('.use-color').forEach(btn => {
          btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            const color = palette[index];
            
            // 设置HEX输入并转换
            hexInput.value = color.hex;
            convertFromHex();
            
            // 切换到HEX标签页
            tabButtons[0].click();
          });
        });
        
        paletteContent.querySelectorAll('.remove-color').forEach(btn => {
          btn.addEventListener('click', () => {
            const index = parseInt(btn.getAttribute('data-index'));
            
            // 移除颜色
            palette.splice(index, 1);
            
            // 保存调色板
            localStorage.setItem('colorPalette', JSON.stringify(palette));
            
            // 更新显示
            updatePaletteDisplay();
            
            showToast('颜色已从调色板移除', 'info');
          });
        });
      }
      
      // 复制所有格式
      function copyAllFormats() {
        const formats = [
          `HEX: ${outputHex.textContent}`,
          `RGB: ${outputRgb.textContent}`,
          `RGBA: ${outputRgba.textContent}`,
          `HSL: ${outputHsl.textContent}`,
          `HSLA: ${outputHsla.textContent}`
        ];
        
        if (outputNamed.textContent !== '-') {
          formats.push(`命名颜色: ${outputNamed.textContent}`);
        }
        
        const text = formats.join('\n');
        copyToClipboard(text);
      }
      
      // 事件监听
      convertHexBtn.addEventListener('click', convertFromHex);
      convertRgbBtn.addEventListener('click', convertFromRgb);
      convertHslBtn.addEventListener('click', convertFromHsl);
      convertNamedBtn.addEventListener('click', convertFromNamed);
      
      copyAllBtn.addEventListener('click', copyAllFormats);
      addToPaletteBtn.addEventListener('click', addToPalette);
      clearPaletteBtn.addEventListener('click', () => {
        if (confirm('确定要清空调色板吗？')) {
          localStorage.removeItem('colorPalette');
          updatePaletteDisplay();
          showToast('调色板已清空', 'info');
        }
      });
      
      // 复制按钮
      container.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-target');
          const targetElement = container.querySelector(`#${targetId}`);
          if (targetElement && targetElement.textContent !== '-') {
            copyToClipboard(targetElement.textContent);
          }
        });
      });
      
      // 初始化
      convertFromHex();
      updatePaletteDisplay();
      
      // 添加样式
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
        
        .tab-header {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 15px;
        }
        
        .tab-btn {
          padding: 10px 15px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .tab-btn.active {
          border-bottom-color: var(--primary-color);
          color: var(--primary-color);
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
        
        .color-palette {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .palette-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .palette-header h3 {
          margin: 0;
        }
        
        .palette-content {
          padding: 15px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .palette-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .palette-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .palette-color {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          margin-right: 15px;
        }
        
        .palette-info {
          flex-grow: 1;
        }
        
        .palette-hex {
          font-family: monospace;
          font-weight: 500;
        }
        
        .palette-rgb {
          font-family: monospace;
          font-size: 12px;
          color: var(--text-muted);
        }
        
        .palette-actions {
          display: flex;
          gap: 5px;
        }
        
        .no-colors {
          text-align: center;
          padding: 20px;
          color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
          .color-container {
            flex-direction: column;
          }
        }
      `;
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.colorConverter = tool;
})();
