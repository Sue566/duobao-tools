/**
 * 贷款计算器
 * 增强版：支持商业贷款、公积金贷款、组合贷款、提前还款计算和多种利率方案
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-money"></i> 贷款计算器</h2>
          <p class="tool-description">计算贷款利息和还款计划，支持多种贷款类型、还款方式和提前还款计算。</p>
        </div>
        
        <div class="loan-tabs">
          <div class="tab-header">
            <button class="tab-btn active" data-tab="basic">基础计算</button>
            <button class="tab-btn" data-tab="combined">组合贷款</button>
            <button class="tab-btn" data-tab="prepayment">提前还款</button>
            <button class="tab-btn" data-tab="compare">方案比较</button>
          </div>
          
          <div class="tab-content active" id="tab-basic">
            <div class="loan-container">
              <div class="loan-input-section">
                <div class="form-group">
                  <label for="loan-type">贷款类型</label>
                  <select id="loan-type" class="form-control">
                    <option value="commercial">商业贷款</option>
                    <option value="housing">公积金贷款</option>
                  </select>
                </div>
            <div class="form-group">
              <label for="loan-amount">贷款金额</label>
              <div class="input-with-unit">
                <input type="number" id="loan-amount" class="form-control" value="100000" min="1" step="1000" />
                <span class="unit">元</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="loan-term">贷款期限</label>
              <div class="input-with-unit">
                <input type="number" id="loan-term" class="form-control" value="12" min="1" max="360" />
                <select id="term-unit" class="form-control">
                  <option value="month">月</option>
                  <option value="year">年</option>
                </select>
              </div>
            </div>
            
                <div class="form-group">
                  <label for="interest-rate">年利率</label>
                  <div class="input-with-unit">
                    <input type="number" id="interest-rate" class="form-control" value="4.35" min="0.01" step="0.01" />
                    <span class="unit">%</span>
                    <button id="rate-reference" class="btn btn-sm"><i class="fa fa-info-circle"></i></button>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="rate-adjustment">利率调整</label>
                  <div class="input-with-unit">
                    <input type="number" id="rate-adjustment" class="form-control" value="0" step="0.01" />
                    <span class="unit">%</span>
                  </div>
                  <div class="form-text">基准利率基础上的上浮或下调，正数为上浮，负数为下调</div>
                </div>
            
                <div class="form-group">
                  <label>还款方式</label>
                  <div class="repayment-options">
                    <div class="form-check">
                      <input type="radio" name="repayment-method" id="method-equal-installment" value="equal-installment" checked />
                      <label for="method-equal-installment">等额本息</label>
                    </div>
                    <div class="form-check">
                      <input type="radio" name="repayment-method" id="method-equal-principal" value="equal-principal" />
                      <label for="method-equal-principal">等额本金</label>
                    </div>
                    <div class="form-check">
                      <input type="radio" name="repayment-method" id="method-interest-only" value="interest-only" />
                      <label for="method-interest-only">先息后本</label>
                    </div>
                  </div>
                </div>
            
                <div class="form-group">
                  <label>首次还款日期</label>
                  <input type="date" id="first-payment-date" class="form-control" />
                </div>
                
                <div class="form-group">
                  <label>其他选项</label>
                  <div class="loan-options">
                    <div class="form-check">
                      <input type="checkbox" id="include-tax" />
                      <label for="include-tax">包含税费</label>
                    </div>
                    <div class="form-check">
                      <input type="checkbox" id="include-insurance" />
                      <label for="include-insurance">包含保险</label>
                    </div>
                  </div>
                </div>
                
                <div id="tax-insurance-details" style="display: none;">
                  <div class="form-group">
                    <label for="tax-rate">契税税率</label>
                    <div class="input-with-unit">
                      <input type="number" id="tax-rate" class="form-control" value="1" min="0" step="0.1" />
                      <span class="unit">%</span>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="insurance-rate">保险费率</label>
                    <div class="input-with-unit">
                      <input type="number" id="insurance-rate" class="form-control" value="0.5" min="0" step="0.1" />
                      <span class="unit">%</span>
                    </div>
                  </div>
                </div>
            
                <div class="loan-actions">
                  <button id="calculate-btn" class="btn btn-success"><i class="fa fa-calculator"></i> 计算</button>
                  <button id="clear-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
                  <button id="save-plan-btn" class="btn"><i class="fa fa-save"></i> 保存方案</button>
                </div>
              </div>
          
              <div class="loan-result-section">
            <div class="result-header">
              <h3>计算结果</h3>
              <div class="result-actions">
                <button id="export-btn" class="btn btn-sm"><i class="fa fa-download"></i> 导出还款计划</button>
              </div>
            </div>
            
            <div class="loan-summary" id="loan-summary"></div>
            
                <div class="loan-chart-container">
                  <div class="chart-type-selector">
                    <button class="chart-type-btn active" data-type="payment">还款构成</button>
                    <button class="chart-type-btn" data-type="balance">本金余额</button>
                    <button class="chart-type-btn" data-type="ratio">本息比例</button>
                  </div>
                  <canvas id="loan-chart"></canvas>
                </div>
            
            <div class="loan-schedule-header">
              <h3>还款计划</h3>
              <div class="schedule-filter">
                <label for="schedule-filter">显示:</label>
                <select id="schedule-filter" class="form-control form-control-sm">
                  <option value="all">全部</option>
                  <option value="first-year">第一年</option>
                  <option value="first-5-years">前5年</option>
                  <option value="first-10">前10期</option>
                  <option value="last-10">后10期</option>
                </select>
              </div>
            </div>
            
            <div class="loan-schedule-container">
              <table class="loan-schedule" id="loan-schedule">
                <thead>
                  <tr>
                    <th>期数</th>
                    <th>还款日期</th>
                    <th>月供</th>
                    <th>本金</th>
                    <th>利息</th>
                    <th>剩余本金</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
              </div>
            </div>
          </div>
          
          <div class="tab-content" id="tab-combined">
            <div class="combined-loan-container">
              <div class="combined-loan-inputs">
                <div class="commercial-loan-section">
                  <h3>商业贷款部分</h3>
                  
                  <div class="form-group">
                    <label for="commercial-amount">贷款金额</label>
                    <div class="input-with-unit">
                      <input type="number" id="commercial-amount" class="form-control" value="500000" min="1" step="1000" />
                      <span class="unit">元</span>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="commercial-term">贷款期限</label>
                    <div class="input-with-unit">
                      <input type="number" id="commercial-term" class="form-control" value="30" min="1" max="30" />
                      <span class="unit">年</span>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="commercial-rate">年利率</label>
                    <div class="input-with-unit">
                      <input type="number" id="commercial-rate" class="form-control" value="4.35" min="0.01" step="0.01" />
                      <span class="unit">%</span>
                    </div>
                  </div>
                </div>
                
                <div class="housing-loan-section">
                  <h3>公积金贷款部分</h3>
                  
                  <div class="form-group">
                    <label for="housing-amount">贷款金额</label>
                    <div class="input-with-unit">
                      <input type="number" id="housing-amount" class="form-control" value="300000" min="1" step="1000" />
                      <span class="unit">元</span>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="housing-term">贷款期限</label>
                    <div class="input-with-unit">
                      <input type="number" id="housing-term" class="form-control" value="30" min="1" max="30" />
                      <span class="unit">年</span>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="housing-rate">年利率</label>
                    <div class="input-with-unit">
                      <input type="number" id="housing-rate" class="form-control" value="3.25" min="0.01" step="0.01" />
                      <span class="unit">%</span>
                    </div>
                  </div>
                </div>
                
                <div class="combined-loan-options">
                  <div class="form-group">
                    <label>还款方式</label>
                    <div class="repayment-options">
                      <div class="form-check">
                        <input type="radio" name="combined-method" id="combined-equal-installment" value="equal-installment" checked />
                        <label for="combined-equal-installment">等额本息</label>
                      </div>
                      <div class="form-check">
                        <input type="radio" name="combined-method" id="combined-equal-principal" value="equal-principal" />
                        <label for="combined-equal-principal">等额本金</label>
                      </div>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label>首次还款日期</label>
                    <input type="date" id="combined-first-date" class="form-control" />
                  </div>
                  
                  <div class="combined-actions">
                    <button id="calculate-combined-btn" class="btn btn-success"><i class="fa fa-calculator"></i> 计算组合贷款</button>
                    <button id="clear-combined-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
                  </div>
                </div>
              </div>
              
              <div class="combined-loan-results">
                <div class="result-header">
                  <h3>组合贷款计算结果</h3>
                  <div class="result-actions">
                    <button id="export-combined-btn" class="btn btn-sm"><i class="fa fa-download"></i> 导出还款计划</button>
                  </div>
                </div>
                
                <div class="combined-summary" id="combined-summary"></div>
                
                <div class="combined-chart-container">
                  <canvas id="combined-chart"></canvas>
                </div>
                
                <div class="combined-schedule-header">
                  <h3>组合贷款还款计划</h3>
                  <div class="schedule-filter">
                    <label for="combined-filter">显示:</label>
                    <select id="combined-filter" class="form-control form-control-sm">
                      <option value="all">全部</option>
                      <option value="first-year">第一年</option>
                      <option value="first-5-years">前5年</option>
                      <option value="first-10">前10期</option>
                      <option value="last-10">后10期</option>
                    </select>
                  </div>
                </div>
                
                <div class="combined-schedule-container">
                  <table class="loan-schedule" id="combined-schedule">
                    <thead>
                      <tr>
                        <th>期数</th>
                        <th>还款日期</th>
                        <th>商贷月供</th>
                        <th>公积金月供</th>
                        <th>总月供</th>
                        <th>总本金</th>
                        <th>总利息</th>
                        <th>剩余本金</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          <div class="tab-content" id="tab-prepayment">
            <div class="prepayment-container">
              <div class="prepayment-inputs">
                <div class="form-group">
                  <label for="original-amount">原贷款金额</label>
                  <div class="input-with-unit">
                    <input type="number" id="original-amount" class="form-control" value="500000" min="1" step="1000" />
                    <span class="unit">元</span>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="original-term">原贷款期限</label>
                  <div class="input-with-unit">
                    <input type="number" id="original-term" class="form-control" value="30" min="1" />
                    <select id="original-term-unit" class="form-control">
                      <option value="year">年</option>
                      <option value="month">月</option>
                    </select>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="original-rate">原贷款年利率</label>
                  <div class="input-with-unit">
                    <input type="number" id="original-rate" class="form-control" value="4.35" min="0.01" step="0.01" />
                    <span class="unit">%</span>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="loan-start-date">贷款开始日期</label>
                  <input type="date" id="loan-start-date" class="form-control" />
                </div>
                
                <div class="form-group">
                  <label for="already-paid">已还期数</label>
                  <div class="input-with-unit">
                    <input type="number" id="already-paid" class="form-control" value="12" min="0" />
                    <span class="unit">期</span>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="prepayment-amount">提前还款金额</label>
                  <div class="input-with-unit">
                    <input type="number" id="prepayment-amount" class="form-control" value="100000" min="1" step="1000" />
                    <span class="unit">元</span>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>提前还款方式</label>
                  <div class="prepayment-options">
                    <div class="form-check">
                      <input type="radio" name="prepayment-method" id="method-reduce-term" value="reduce-term" checked />
                      <label for="method-reduce-term">缩短贷款期限</label>
                    </div>
                    <div class="form-check">
                      <input type="radio" name="prepayment-method" id="method-reduce-amount" value="reduce-amount" />
                      <label for="method-reduce-amount">减少月供金额</label>
                    </div>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>原还款方式</label>
                  <div class="repayment-options">
                    <div class="form-check">
                      <input type="radio" name="original-method" id="original-equal-installment" value="equal-installment" checked />
                      <label for="original-equal-installment">等额本息</label>
                    </div>
                    <div class="form-check">
                      <input type="radio" name="original-method" id="original-equal-principal" value="equal-principal" />
                      <label for="original-equal-principal">等额本金</label>
                    </div>
                  </div>
                </div>
                
                <div class="prepayment-actions">
                  <button id="calculate-prepayment-btn" class="btn btn-success"><i class="fa fa-calculator"></i> 计算提前还款</button>
                  <button id="clear-prepayment-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
                </div>
              </div>
              
              <div class="prepayment-results">
                <div class="result-header">
                  <h3>提前还款计算结果</h3>
                  <div class="result-actions">
                    <button id="export-prepayment-btn" class="btn btn-sm"><i class="fa fa-download"></i> 导出还款计划</button>
                  </div>
                </div>
                
                <div class="prepayment-summary" id="prepayment-summary"></div>
                
                <div class="prepayment-comparison">
                  <div class="comparison-header">
                    <h3>提前还款对比</h3>
                  </div>
                  
                  <div class="comparison-content" id="prepayment-comparison"></div>
                </div>
                
                <div class="prepayment-chart-container">
                  <canvas id="prepayment-chart"></canvas>
                </div>
                
                <div class="prepayment-schedule-header">
                  <h3>提前还款后还款计划</h3>
                </div>
                
                <div class="prepayment-schedule-container">
                  <table class="loan-schedule" id="prepayment-schedule">
                    <thead>
                      <tr>
                        <th>期数</th>
                        <th>还款日期</th>
                        <th>月供</th>
                        <th>本金</th>
                        <th>利息</th>
                        <th>剩余本金</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          <div class="tab-content" id="tab-compare">
            <div class="compare-container">
              <div class="compare-inputs">
                <div class="form-group">
                  <label for="compare-amount">贷款金额</label>
                  <div class="input-with-unit">
                    <input type="number" id="compare-amount" class="form-control" value="500000" min="1" step="1000" />
                    <span class="unit">元</span>
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="compare-term">贷款期限</label>
                  <div class="input-with-unit">
                    <input type="number" id="compare-term" class="form-control" value="30" min="1" max="30" />
                    <span class="unit">年</span>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>比较方案</label>
                  <div class="compare-options">
                    <div class="form-check">
                      <input type="checkbox" id="compare-commercial" checked />
                      <label for="compare-commercial">商业贷款</label>
                    </div>
                    <div class="form-check">
                      <input type="checkbox" id="compare-housing" checked />
                      <label for="compare-housing">公积金贷款</label>
                    </div>
                    <div class="form-check">
                      <input type="checkbox" id="compare-combined" checked />
                      <label for="compare-combined">组合贷款</label>
                    </div>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>组合贷款比例</label>
                  <div class="combined-ratio">
                    <input type="range" id="combined-ratio" min="10" max="90" value="50" class="form-range" />
                    <div class="ratio-labels">
                      <span id="commercial-ratio">50%</span>
                      <span id="housing-ratio">50%</span>
                    </div>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>还款方式</label>
                  <div class="compare-methods">
                    <div class="form-check">
                      <input type="checkbox" id="compare-equal-installment" checked />
                      <label for="compare-equal-installment">等额本息</label>
                    </div>
                    <div class="form-check">
                      <input type="checkbox" id="compare-equal-principal" checked />
                      <label for="compare-equal-principal">等额本金</label>
                    </div>
                  </div>
                </div>
                
                <div class="compare-actions">
                  <button id="calculate-compare-btn" class="btn btn-success"><i class="fa fa-calculator"></i> 比较方案</button>
                  <button id="clear-compare-btn" class="btn btn-secondary"><i class="fa fa-trash-o"></i> 清空</button>
                </div>
              </div>
              
              <div class="compare-results">
                <div class="result-header">
                  <h3>贷款方案比较</h3>
                  <div class="result-actions">
                    <button id="export-compare-btn" class="btn btn-sm"><i class="fa fa-download"></i> 导出比较结果</button>
                  </div>
                </div>
                
                <div class="compare-chart-container">
                  <canvas id="compare-chart"></canvas>
                </div>
                
                <div class="compare-table-container">
                  <table class="compare-table" id="compare-table">
                    <thead>
                      <tr>
                        <th>贷款方案</th>
                        <th>贷款金额</th>
                        <th>贷款期限</th>
                        <th>还款方式</th>
                        <th>月供</th>
                        <th>总还款额</th>
                        <th>总利息</th>
                        <th>利息占比</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="loan-info">
          <div class="info-header">
            <h3>还款方式说明</h3>
          </div>
          <div class="info-content">
            <div class="info-item">
              <h4>等额本息</h4>
              <p>每月还款金额相同，其中本金逐月递增，利息逐月递减。适合收入稳定的借款人。</p>
              <p>计算公式：每月还款额 = 贷款本金 × 月利率 × (1 + 月利率)^还款月数 ÷ [(1 + 月利率)^还款月数 - 1]</p>
            </div>
            
            <div class="info-item">
              <h4>等额本金</h4>
              <p>每月归还等额本金和剩余贷款在该月所产生的利息，月供逐月递减。前期还款压力较大，但总利息较低。</p>
              <p>计算公式：每月归还本金 = 贷款本金 ÷ 还款月数<br>每月利息 = 剩余本金 × 月利率<br>每月还款额 = 每月归还本金 + 每月利息</p>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('loanCalculator', container.querySelector('.tool-header'));
      
      // 获取元素 - 标签页
      const tabButtons = container.querySelectorAll('.tab-btn');
      const tabContents = container.querySelectorAll('.tab-content');
      
      // 基础计算元素
      const loanType = container.querySelector('#loan-type');
      const loanAmount = container.querySelector('#loan-amount');
      const loanTerm = container.querySelector('#loan-term');
      const termUnit = container.querySelector('#term-unit');
      const interestRate = container.querySelector('#interest-rate');
      const rateAdjustment = container.querySelector('#rate-adjustment');
      const rateReference = container.querySelector('#rate-reference');
      const methodEqualInstallment = container.querySelector('#method-equal-installment');
      const methodEqualPrincipal = container.querySelector('#method-equal-principal');
      const methodInterestOnly = container.querySelector('#method-interest-only');
      const firstPaymentDate = container.querySelector('#first-payment-date');
      const includeTax = container.querySelector('#include-tax');
      const includeInsurance = container.querySelector('#include-insurance');
      const taxInsuranceDetails = container.querySelector('#tax-insurance-details');
      const taxRate = container.querySelector('#tax-rate');
      const insuranceRate = container.querySelector('#insurance-rate');
      const calculateBtn = container.querySelector('#calculate-btn');
      const clearBtn = container.querySelector('#clear-btn');
      const savePlanBtn = container.querySelector('#save-plan-btn');
      const exportBtn = container.querySelector('#export-btn');
      const loanSummary = container.querySelector('#loan-summary');
      const loanChart = container.querySelector('#loan-chart');
      const chartTypeButtons = container.querySelectorAll('.chart-type-btn');
      const scheduleFilter = container.querySelector('#schedule-filter');
      const loanSchedule = container.querySelector('#loan-schedule');
      
      // 组合贷款元素
      const commercialAmount = container.querySelector('#commercial-amount');
      const commercialTerm = container.querySelector('#commercial-term');
      const commercialRate = container.querySelector('#commercial-rate');
      const housingAmount = container.querySelector('#housing-amount');
      const housingTerm = container.querySelector('#housing-term');
      const housingRate = container.querySelector('#housing-rate');
      const combinedEqualInstallment = container.querySelector('#combined-equal-installment');
      const combinedEqualPrincipal = container.querySelector('#combined-equal-principal');
      const combinedFirstDate = container.querySelector('#combined-first-date');
      const calculateCombinedBtn = container.querySelector('#calculate-combined-btn');
      const clearCombinedBtn = container.querySelector('#clear-combined-btn');
      const exportCombinedBtn = container.querySelector('#export-combined-btn');
      const combinedSummary = container.querySelector('#combined-summary');
      const combinedChart = container.querySelector('#combined-chart');
      const combinedFilter = container.querySelector('#combined-filter');
      const combinedSchedule = container.querySelector('#combined-schedule');
      
      // 提前还款元素
      const originalAmount = container.querySelector('#original-amount');
      const originalTerm = container.querySelector('#original-term');
      const originalTermUnit = container.querySelector('#original-term-unit');
      const originalRate = container.querySelector('#original-rate');
      const loanStartDate = container.querySelector('#loan-start-date');
      const alreadyPaid = container.querySelector('#already-paid');
      const prepaymentAmount = container.querySelector('#prepayment-amount');
      const methodReduceTerm = container.querySelector('#method-reduce-term');
      const methodReduceAmount = container.querySelector('#method-reduce-amount');
      const originalEqualInstallment = container.querySelector('#original-equal-installment');
      const originalEqualPrincipal = container.querySelector('#original-equal-principal');
      const calculatePrepaymentBtn = container.querySelector('#calculate-prepayment-btn');
      const clearPrepaymentBtn = container.querySelector('#clear-prepayment-btn');
      const exportPrepaymentBtn = container.querySelector('#export-prepayment-btn');
      const prepaymentSummary = container.querySelector('#prepayment-summary');
      const prepaymentComparison = container.querySelector('#prepayment-comparison');
      const prepaymentChart = container.querySelector('#prepayment-chart');
      const prepaymentSchedule = container.querySelector('#prepayment-schedule');
      
      // 方案比较元素
      const compareAmount = container.querySelector('#compare-amount');
      const compareTerm = container.querySelector('#compare-term');
      const compareCommercial = container.querySelector('#compare-commercial');
      const compareHousing = container.querySelector('#compare-housing');
      const compareCombined = container.querySelector('#compare-combined');
      const combinedRatio = container.querySelector('#combined-ratio');
      const commercialRatio = container.querySelector('#commercial-ratio');
      const housingRatio = container.querySelector('#housing-ratio');
      const compareEqualInstallment = container.querySelector('#compare-equal-installment');
      const compareEqualPrincipal = container.querySelector('#compare-equal-principal');
      const calculateCompareBtn = container.querySelector('#calculate-compare-btn');
      const clearCompareBtn = container.querySelector('#clear-compare-btn');
      const exportCompareBtn = container.querySelector('#export-compare-btn');
      const compareChart = container.querySelector('#compare-chart');
      const compareTable = container.querySelector('#compare-table');
      
      // 设置默认首次还款日期为下个月1日
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      firstPaymentDate.value = nextMonth.toISOString().slice(0, 10);
      combinedFirstDate.value = nextMonth.toISOString().slice(0, 10);
      
      // 设置默认贷款开始日期为一年前
      const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), 1);
      loanStartDate.value = oneYearAgo.toISOString().slice(0, 10);
      
      // 图表实例
      let basicChartInstance = null;
      let combinedChartInstance = null;
      let prepaymentChartInstance = null;
      let compareChartInstance = null;
      
      // 当前图表类型
      let currentChartType = 'payment';
      
      // 保存的贷款方案
      const savedPlans = JSON.parse(localStorage.getItem('savedLoanPlans') || '[]');
      
      // 利率参考数据
      const rateReferenceData = {
        commercial: {
          name: '商业贷款基准利率',
          rates: [
            { term: '6个月以内（含6个月）', rate: 3.70 },
            { term: '6个月至1年（含1年）', rate: 3.90 },
            { term: '1至3年（含3年）', rate: 4.10 },
            { term: '3至5年（含5年）', rate: 4.75 },
            { term: '5年以上', rate: 4.90 }
          ]
        },
        housing: {
          name: '公积金贷款基准利率',
          rates: [
            { term: '5年以下（含5年）', rate: 2.75 },
            { term: '5年以上', rate: 3.25 }
          ]
        }
      };
      
      // 标签页切换
      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          tabButtons.forEach(b => b.classList.remove('active'));
          tabContents.forEach(c => c.classList.remove('active'));
          
          btn.classList.add('active');
          document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
        });
      });
      
      // 图表类型切换
      chartTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          chartTypeButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentChartType = btn.dataset.type;
          
          // 重新计算以更新图表
          calculateLoan();
        });
      });
      
      // 显示/隐藏税费和保险详情
      includeTax.addEventListener('change', updateTaxInsuranceVisibility);
      includeInsurance.addEventListener('change', updateTaxInsuranceVisibility);
      
      function updateTaxInsuranceVisibility() {
        if (includeTax.checked || includeInsurance.checked) {
          taxInsuranceDetails.style.display = 'block';
        } else {
          taxInsuranceDetails.style.display = 'none';
        }
      }
      
      // 组合贷款比例滑块
      combinedRatio.addEventListener('input', updateCombinedRatio);
      
      function updateCombinedRatio() {
        const ratio = combinedRatio.value;
        commercialRatio.textContent = ratio + '%';
        housingRatio.textContent = (100 - ratio) + '%';
      }
      
      // 显示利率参考
      rateReference.addEventListener('click', showRateReference);
      
      function showRateReference() {
        const type = loanType.value;
        const data = rateReferenceData[type];
        
        let html = `<div class="rate-reference-modal">
          <div class="rate-reference-header">
            <h3>${data.name}</h3>
          </div>
          <div class="rate-reference-content">
            <table class="rate-table">
              <thead>
                <tr>
                  <th>贷款期限</th>
                  <th>基准年利率(%)</th>
                </tr>
              </thead>
              <tbody>`;
        
        data.rates.forEach(item => {
          html += `
            <tr>
              <td>${item.term}</td>
              <td>${item.rate.toFixed(2)}</td>
            </tr>`;
        });
        
        html += `
              </tbody>
            </table>
          </div>
          <div class="rate-reference-footer">
            <button id="apply-rate" class="btn btn-sm btn-success">应用选中利率</button>
            <button id="close-rate-reference" class="btn btn-sm">关闭</button>
          </div>
        </div>`;
        
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = html;
        document.body.appendChild(modal);
        
        // 添加事件监听
        modal.querySelector('#close-rate-reference').addEventListener('click', () => {
          document.body.removeChild(modal);
        });
        
        // 点击行选择利率
        const rows = modal.querySelectorAll('.rate-table tbody tr');
        rows.forEach(row => {
          row.addEventListener('click', () => {
            rows.forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
          });
        });
        
        // 应用选中利率
        modal.querySelector('#apply-rate').addEventListener('click', () => {
          const selectedRow = modal.querySelector('.rate-table tbody tr.selected');
          if (selectedRow) {
            const rate = selectedRow.querySelector('td:nth-child(2)').textContent;
            interestRate.value = rate;
          }
          document.body.removeChild(modal);
        });
      }
      
      // 计算基础贷款
      function calculateLoan() {
        // 获取输入值
        const amount = parseFloat(loanAmount.value);
        let term = parseInt(loanTerm.value);
        const baseRate = parseFloat(interestRate.value) / 100;
        const adjustment = parseFloat(rateAdjustment.value) / 100;
        const rate = baseRate + adjustment;
        const isEqualInstallment = methodEqualInstallment.checked;
        const isEqualPrincipal = methodEqualPrincipal.checked;
        const isInterestOnly = methodInterestOnly.checked;
        const startDate = new Date(firstPaymentDate.value);
        
        // 计算税费和保险
        let additionalCosts = 0;
        if (includeTax.checked) {
          additionalCosts += amount * (parseFloat(taxRate.value) / 100);
        }
        if (includeInsurance.checked) {
          additionalCosts += amount * (parseFloat(insuranceRate.value) / 100);
        }
        
        // 验证输入
        if (isNaN(amount) || amount <= 0) {
          showToast('请输入有效的贷款金额', 'warning');
          return;
        }
        
        if (isNaN(term) || term <= 0) {
          showToast('请输入有效的贷款期限', 'warning');
          return;
        }
        
        if (isNaN(rate) || rate <= 0) {
          showToast('请输入有效的年利率', 'warning');
          return;
        }
        
        if (isNaN(startDate.getTime())) {
          showToast('请选择有效的首次还款日期', 'warning');
          return;
        }
        
        // 验证税费和保险
        if (includeTax.checked && (isNaN(parseFloat(taxRate.value)) || parseFloat(taxRate.value) < 0)) {
          showToast('请输入有效的契税税率', 'warning');
          return;
        }
        
        if (includeInsurance.checked && (isNaN(parseFloat(insuranceRate.value)) || parseFloat(insuranceRate.value) < 0)) {
          showToast('请输入有效的保险费率', 'warning');
          return;
        }
        
        // 如果期限单位是年，转换为月
        if (termUnit.value === 'year') {
          term *= 12;
        }
        
        // 总贷款金额（包括税费和保险）
        const totalAmount = amount + additionalCosts;
        
        // 月利率
        const monthlyRate = rate / 12;
        
        // 计算还款计划
        const schedule = [];
        let totalPayment = 0;
        let totalInterest = 0;
        let remainingPrincipal = amount;
        
        if (isEqualInstallment) {
          // 等额本息
          // 每月还款额 = 贷款本金 × 月利率 × (1 + 月利率)^还款月数 ÷ [(1 + 月利率)^还款月数 - 1]
          const monthlyPayment = amount * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
          
          for (let i = 1; i <= term; i++) {
            const interest = remainingPrincipal * monthlyRate;
            const principal = monthlyPayment - interest;
            remainingPrincipal -= principal;
            
            // 处理最后一期可能的舍入误差
            if (i === term) {
              remainingPrincipal = 0;
            }
            
            // 计算还款日期
            const paymentDate = new Date(startDate);
            paymentDate.setMonth(startDate.getMonth() + i - 1);
            
            schedule.push({
              period: i,
              date: paymentDate,
              payment: monthlyPayment,
              principal: principal,
              interest: interest,
              remainingPrincipal: remainingPrincipal
            });
            
            totalPayment += monthlyPayment;
            totalInterest += interest;
          }
        } else if (isEqualPrincipal) {
          // 等额本金
          // 每月归还本金 = 贷款本金 ÷ 还款月数
          const monthlyPrincipal = amount / term;
          
          for (let i = 1; i <= term; i++) {
            const interest = remainingPrincipal * monthlyRate;
            const payment = monthlyPrincipal + interest;
            remainingPrincipal -= monthlyPrincipal;
            
            // 处理最后一期可能的舍入误差
            if (i === term) {
              remainingPrincipal = 0;
            }
            
            // 计算还款日期
            const paymentDate = new Date(startDate);
            paymentDate.setMonth(startDate.getMonth() + i - 1);
            
            schedule.push({
              period: i,
              date: paymentDate,
              payment: payment,
              principal: monthlyPrincipal,
              interest: interest,
              remainingPrincipal: remainingPrincipal
            });
            
            totalPayment += payment;
            totalInterest += interest;
          }
        } else if (isInterestOnly) {
          // 先息后本
          // 每月只还利息，最后一期还本金
          const monthlyInterest = amount * monthlyRate;
          
          for (let i = 1; i <= term; i++) {
            let principal = 0;
            const interest = monthlyInterest;
            let payment = interest;
            
            // 最后一期还本金
            if (i === term) {
              principal = amount;
              payment += principal;
              remainingPrincipal = 0;
            }
            
            // 计算还款日期
            const paymentDate = new Date(startDate);
            paymentDate.setMonth(startDate.getMonth() + i - 1);
            
            schedule.push({
              period: i,
              date: paymentDate,
              payment: payment,
              principal: principal,
              interest: interest,
              remainingPrincipal: remainingPrincipal
            });
            
            totalPayment += payment;
            totalInterest += interest;
          }
        }
        
        // 显示结果摘要
        displaySummary(amount, additionalCosts, term, rate, totalPayment, totalInterest, isEqualInstallment, isEqualPrincipal, isInterestOnly);
        
        // 显示还款计划
        displaySchedule(schedule);
        
        // 显示图表
        displayChart(schedule, isEqualInstallment, isEqualPrincipal, isInterestOnly);
        
        // 启用导出按钮和保存方案按钮
        exportBtn.disabled = false;
        savePlanBtn.disabled = false;
        
        return {
          amount,
          additionalCosts,
          term,
          rate,
          schedule,
          totalPayment,
          totalInterest,
          isEqualInstallment,
          isEqualPrincipal,
          isInterestOnly
        };
      }
      
      // 计算组合贷款
      function calculateCombinedLoan() {
        // 获取输入值
        const cAmount = parseFloat(commercialAmount.value);
        const cTerm = parseInt(commercialTerm.value) * 12; // 转换为月
        const cRate = parseFloat(commercialRate.value) / 100;
        
        const hAmount = parseFloat(housingAmount.value);
        const hTerm = parseInt(housingTerm.value) * 12; // 转换为月
        const hRate = parseFloat(housingRate.value) / 100;
        
        const isEqualInstallment = combinedEqualInstallment.checked;
        const startDate = new Date(combinedFirstDate.value);
        
        // 验证输入
        if (isNaN(cAmount) || cAmount <= 0) {
          showToast('请输入有效的商业贷款金额', 'warning');
          return;
        }
        
        if (isNaN(cTerm) || cTerm <= 0) {
          showToast('请输入有效的商业贷款期限', 'warning');
          return;
        }
        
        if (isNaN(cRate) || cRate <= 0) {
          showToast('请输入有效的商业贷款年利率', 'warning');
          return;
        }
        
        if (isNaN(hAmount) || hAmount <= 0) {
          showToast('请输入有效的公积金贷款金额', 'warning');
          return;
        }
        
        if (isNaN(hTerm) || hTerm <= 0) {
          showToast('请输入有效的公积金贷款期限', 'warning');
          return;
        }
        
        if (isNaN(hRate) || hRate <= 0) {
          showToast('请输入有效的公积金贷款年利率', 'warning');
          return;
        }
        
        if (isNaN(startDate.getTime())) {
          showToast('请选择有效的首次还款日期', 'warning');
          return;
        }
        
        // 月利率
        const cMonthlyRate = cRate / 12;
        const hMonthlyRate = hRate / 12;
        
        // 计算最长期限
        const maxTerm = Math.max(cTerm, hTerm);
        
        // 计算还款计划
        const schedule = [];
        let totalPayment = 0;
        let totalInterest = 0;
        let cRemainingPrincipal = cAmount;
        let hRemainingPrincipal = hAmount;
        
        if (isEqualInstallment) {
          // 等额本息
          // 商业贷款月供
          const cMonthlyPayment = cAmount * cMonthlyRate * Math.pow(1 + cMonthlyRate, cTerm) / (Math.pow(1 + cMonthlyRate, cTerm) - 1);
          
          // 公积金贷款月供
          const hMonthlyPayment = hAmount * hMonthlyRate * Math.pow(1 + hMonthlyRate, hTerm) / (Math.pow(1 + hMonthlyRate, hTerm) - 1);
          
          for (let i = 1; i <= maxTerm; i++) {
            // 商业贷款部分
            let cPayment = 0;
            let cPrincipal = 0;
            let cInterest = 0;
            
            if (i <= cTerm) {
              cInterest = cRemainingPrincipal * cMonthlyRate;
              cPrincipal = cMonthlyPayment - cInterest;
              cPayment = cMonthlyPayment;
              cRemainingPrincipal -= cPrincipal;
              
              // 处理最后一期可能的舍入误差
              if (i === cTerm) {
                cRemainingPrincipal = 0;
              }
            }
            
            // 公积金贷款部分
            let hPayment = 0;
            let hPrincipal = 0;
            let hInterest = 0;
            
            if (i <= hTerm) {
              hInterest = hRemainingPrincipal * hMonthlyRate;
              hPrincipal = hMonthlyPayment - hInterest;
              hPayment = hMonthlyPayment;
              hRemainingPrincipal -= hPrincipal;
              
              // 处理最后一期可能的舍入误差
              if (i === hTerm) {
                hRemainingPrincipal = 0;
              }
            }
            
            // 计算还款日期
            const paymentDate = new Date(startDate);
            paymentDate.setMonth(startDate.getMonth() + i - 1);
            
            // 合计
            const totalPrincipal = cPrincipal + hPrincipal;
            const totalInterestPayment = cInterest + hInterest;
            const totalMonthlyPayment = cPayment + hPayment;
            const totalRemainingPrincipal = cRemainingPrincipal + hRemainingPrincipal;
            
            schedule.push({
              period: i,
              date: paymentDate,
              cPayment,
              hPayment,
              payment: totalMonthlyPayment,
              principal: totalPrincipal,
              interest: totalInterestPayment,
              remainingPrincipal: totalRemainingPrincipal
            });
            
            totalPayment += totalMonthlyPayment;
            totalInterest += totalInterestPayment;
          }
        } else {
          // 等额本金
          // 商业贷款月还本金
          const cMonthlyPrincipal = cAmount / cTerm;
          
          // 公积金贷款月
        
        // 启用导出按钮
        exportBtn.disabled = false;
      }
      
      // 显示结果摘要
      function displaySummary(amount, additionalCosts, term, rate, totalPayment, totalInterest, isEqualInstallment, isEqualPrincipal, isInterestOnly) {
        let repaymentMethod = '';
        let paymentLabel = '';
        
        if (isEqualInstallment) {
          repaymentMethod = '等额本息';
          paymentLabel = '月供';
        } else if (isEqualPrincipal) {
          repaymentMethod = '等额本金';
          paymentLabel = '首月还款额';
        } else if (isInterestOnly) {
          repaymentMethod = '先息后本';
          paymentLabel = '月供(仅利息)';
        }
        
        // 计算月供
        let monthlyPayment;
        if (isEqualInstallment) {
          monthlyPayment = totalPayment / term;
        } else if (isEqualPrincipal) {
          monthlyPayment = (amount / term) + (amount * (rate / 12));
        } else if (isInterestOnly) {
          monthlyPayment = amount * (rate / 12);
        }
        
        // 计算总成本
        const totalCost = amount + additionalCosts + totalInterest;
        
        loanSummary.innerHTML = `
          <div class="summary-item">
            <div class="summary-label">贷款金额</div>
            <div class="summary-value">${formatCurrency(amount)}</div>
          </div>
          ${additionalCosts > 0 ? `
          <div class="summary-item">
            <div class="summary-label">附加费用</div>
            <div class="summary-value">${formatCurrency(additionalCosts)}</div>
          </div>` : ''}
          <div class="summary-item">
            <div class="summary-label">贷款期限</div>
            <div class="summary-value">${term} 个月 (${Math.floor(term / 12)} 年 ${term % 12} 个月)</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">年利率</div>
            <div class="summary-value">${(rate * 100).toFixed(2)}%</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">还款方式</div>
            <div class="summary-value">${repaymentMethod}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">${paymentLabel}</div>
            <div class="summary-value highlight">${formatCurrency(monthlyPayment)}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">总还款额</div>
            <div class="summary-value">${formatCurrency(totalPayment)}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">总利息</div>
            <div class="summary-value">${formatCurrency(totalInterest)}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">利息占比</div>
            <div class="summary-value">${(totalInterest / totalPayment * 100).toFixed(2)}%</div>
          </div>
          ${additionalCosts > 0 ? `
          <div class="summary-item">
            <div class="summary-label">总成本</div>
            <div class="summary-value">${formatCurrency(totalCost)}</div>
          </div>` : ''}
        `;
      }
      
      // 显示还款计划
      function displaySchedule(schedule) {
        const tbody = loanSchedule.querySelector('tbody');
        tbody.innerHTML = '';
        
        // 根据过滤器筛选显示的还款计划
        let filteredSchedule = [...schedule];
        const filterValue = scheduleFilter.value;
        
        if (filterValue === 'first-year') {
          filteredSchedule = schedule.slice(0, 12);
        } else if (filterValue === 'first-5-years') {
          filteredSchedule = schedule.slice(0, 60);
        } else if (filterValue === 'first-10') {
          filteredSchedule = schedule.slice(0, 10);
        } else if (filterValue === 'last-10') {
          filteredSchedule = schedule.slice(-10);
        }
        
        // 生成表格行
        filteredSchedule.forEach(item => {
          const row = document.createElement('tr');
          
          row.innerHTML = `
            <td>${item.period}</td>
            <td>${formatDate(item.date)}</td>
            <td>${formatCurrency(item.payment)}</td>
            <td>${formatCurrency(item.principal)}</td>
            <td>${formatCurrency(item.interest)}</td>
            <td>${formatCurrency(item.remainingPrincipal)}</td>
          `;
          
          tbody.appendChild(row);
        });
      }
      
      // 显示图表
      function displayChart(schedule, isEqualInstallment, isEqualPrincipal, isInterestOnly) {
        // 如果已有图表实例，销毁它
        if (basicChartInstance) {
          basicChartInstance.destroy();
        }
        
        // 根据当前选择的图表类型显示不同图表
        if (currentChartType === 'payment') {
          displayPaymentChart(schedule);
        } else if (currentChartType === 'balance') {
          displayBalanceChart(schedule);
        } else if (currentChartType === 'ratio') {
          displayRatioChart(schedule);
        }
      }
      
      // 显示还款构成图表
      function displayPaymentChart(schedule) {
        // 准备图表数据
        const labels = schedule.map(item => item.period);
        const principalData = schedule.map(item => item.principal);
        const interestData = schedule.map(item => item.interest);
        const paymentData = schedule.map(item => item.payment);
        const remainingData = schedule.map(item => item.remainingPrincipal);
        
        // 创建图表
        const ctx = loanChart.getContext('2d');
        basicChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: '本金',
                data: principalData,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              },
              {
                label: '利息',
                data: interestData,
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              },
              {
                label: '剩余本金',
                data: remainingData,
                type: 'line',
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
                yAxisID: 'y1'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                stacked: true,
                title: {
                  display: true,
                  text: '期数'
                }
              },
              y: {
                stacked: true,
                title: {
                  display: true,
                  text: '金额 (元)'
                }
              },
              y1: {
                position: 'right',
                grid: {
                  drawOnChartArea: false
                },
                title: {
                  display: true,
                  text: '剩余本金 (元)'
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': ' + formatCurrency(context.raw);
                  }
                }
              }
            }
          }
        });
      }
      
      // 显示本金余额图表
      function displayBalanceChart(schedule) {
        // 准备图表数据
        const labels = schedule.map(item => item.period);
        const remainingData = schedule.map(item => item.remainingPrincipal);
        const paidData = schedule.map((item, index, array) => {
          if (index === 0) {
            return array[0].principal;
          } else {
            return array[0].remainingPrincipal - item.remainingPrincipal;
          }
        });
        
        // 创建图表
        const ctx = loanChart.getContext('2d');
        basicChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: '已还本金',
                data: paidData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: true
              },
              {
                label: '剩余本金',
                data: remainingData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: '期数'
                }
              },
              y: {
                title: {
                  display: true,
                  text: '金额 (元)'
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': ' + formatCurrency(context.raw);
                  }
                }
              }
            }
          }
        });
      }
      
      // 显示本息比例图表
      function displayRatioChart(schedule) {
        // 计算总本金和总利息
        const totalPrincipal = schedule.reduce((sum, item) => sum + item.principal, 0);
        const totalInterest = schedule.reduce((sum, item) => sum + item.interest, 0);
        
        // 创建图表
        const ctx = loanChart.getContext('2d');
        basicChartInstance = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['本金', '利息'],
            datasets: [{
              data: [totalPrincipal, totalInterest],
              backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 99, 132, 0.7)'
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = formatCurrency(context.raw);
                    const percentage = (context.raw / (totalPrincipal + totalInterest) * 100).toFixed(2) + '%';
                    return `${label}: ${value} (${percentage})`;
                  }
                }
              }
            }
          }
        });
      }
      
      // 导出还款计划
      function exportSchedule() {
        // 获取表格数据
        const rows = Array.from(loanSchedule.querySelectorAll('tbody tr'));
        
        if (rows.length === 0) {
          showToast('没有可导出的还款计划', 'warning');
          return;
        }
        
        // 创建CSV内容
        let csv = '期数,还款日期,月供,本金,利息,剩余本金\n';
        
        rows.forEach(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          const rowData = cells.map(cell => `"${cell.textContent}"`).join(',');
          csv += rowData + '\n';
        });
        
        // 创建下载链接
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `贷款还款计划_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('还款计划已导出', 'success');
      }
      
      // 格式化货币
      function formatCurrency(value) {
        return new Intl.NumberFormat('zh-CN', {
          style: 'currency',
          currency: 'CNY',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value);
      }
      
      // 格式化日期
      function formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
      
      // 事件监听 - 基础计算
      calculateBtn.addEventListener('click', calculateLoan);
      
      clearBtn.addEventListener('click', () => {
        loanAmount.value = '100000';
        loanTerm.value = '12';
        termUnit.value = 'month';
        interestRate.value = '4.35';
        rateAdjustment.value = '0';
        methodEqualInstallment.checked = true;
        includeTax.checked = false;
        includeInsurance.checked = false;
        taxInsuranceDetails.style.display = 'none';
        
        // 重置首次还款日期为下个月1日
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        firstPaymentDate.value = nextMonth.toISOString().slice(0, 10);
        
        // 清空结果
        loanSummary.innerHTML = '';
        loanSchedule.querySelector('tbody').innerHTML = '';
        
        // 销毁图表
        if (basicChartInstance) {
          basicChartInstance.destroy();
          basicChartInstance = null;
        }
        
        // 禁用导出按钮和保存方案按钮
        exportBtn.disabled = true;
        savePlanBtn.disabled = true;
      });
      
      exportBtn.addEventListener('click', exportSchedule);
      
      // 保存贷款方案
      savePlanBtn.addEventListener('click', () => {
        const planName = prompt('请输入方案名称：', `贷款方案 ${new Date().toLocaleDateString()}`);
        if (!planName) return;
        
        // 获取当前方案数据
        const amount = parseFloat(loanAmount.value);
        const term = parseInt(loanTerm.value);
        const isYearTerm = termUnit.value === 'year';
        const rate = parseFloat(interestRate.value);
        const adjustment = parseFloat(rateAdjustment.value);
        const repaymentMethod = methodEqualInstallment.checked ? 'equal-installment' : 
                               methodEqualPrincipal.checked ? 'equal-principal' : 'interest-only';
        
        // 创建方案对象
        const plan = {
          name: planName,
          date: new Date().toISOString(),
          type: 'basic',
          data: {
            amount,
            term,
            isYearTerm,
            rate,
            adjustment,
            repaymentMethod,
            includeTax: includeTax.checked,
            includeInsurance: includeInsurance.checked,
            taxRate: parseFloat(taxRate.value),
            insuranceRate: parseFloat(insuranceRate.value)
          }
        };
        
        // 保存到本地存储
        savedPlans.push(plan);
        localStorage.setItem('savedLoanPlans', JSON.stringify(savedPlans));
        
        showToast('方案已保存', 'success');
      });
      
      // 过滤器变更时更新还款计划
      scheduleFilter.addEventListener('change', () => {
        // 重新计算贷款以更新显示
        calculateLoan();
      });
      
      // 期限单位变更时调整默认值
      termUnit.addEventListener('change', () => {
        if (termUnit.value === 'year') {
          // 如果切换到年，默认值除以12（向上取整）
          const currentTerm = parseInt(loanTerm.value);
          if (!isNaN(currentTerm) && currentTerm > 12) {
            loanTerm.value = Math.ceil(currentTerm / 12);
          }
        } else {
          // 如果切换到月，默认值乘以12
          const currentTerm = parseInt(loanTerm.value);
          if (!isNaN(currentTerm) && currentTerm < 30) {
            loanTerm.value = currentTerm * 12;
          }
        }
      });
      
      // 贷款类型变更时更新默认利率
      loanType.addEventListener('change', () => {
        if (loanType.value === 'commercial') {
          interestRate.value = '4.35';
        } else if (loanType.value === 'housing') {
          interestRate.value = '3.25';
        }
      });
      
      // 事件监听 - 组合贷款
      calculateCombinedBtn.addEventListener('click', calculateCombinedLoan);
      
      clearCombinedBtn.addEventListener('click', () => {
        commercialAmount.value = '500000';
        commercialTerm.value = '30';
        commercialRate.value = '4.35';
        housingAmount.value = '300000';
        housingTerm.value = '30';
        housingRate.value = '3.25';
        combinedEqualInstallment.checked = true;
        
        // 重置首次还款日期为下个月1日
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        combinedFirstDate.value = nextMonth.toISOString().slice(0, 10);
        
        // 清空结果
        combinedSummary.innerHTML = '';
        combinedSchedule.querySelector('tbody').innerHTML = '';
        
        // 销毁图表
        if (combinedChartInstance) {
          combinedChartInstance.destroy();
          combinedChartInstance = null;
        }
        
        // 禁用导出按钮
        exportCombinedBtn.disabled = true;
      });
      
      // 事件监听 - 提前还款
      calculatePrepaymentBtn.addEventListener('click', calculatePrepayment);
      
      clearPrepaymentBtn.addEventListener('click', () => {
        originalAmount.value = '500000';
        originalTerm.value = '30';
        originalTermUnit.value = 'year';
        originalRate.value = '4.35';
        alreadyPaid.value = '12';
        prepaymentAmount.value = '100000';
        methodReduceTerm.checked = true;
        originalEqualInstallment.checked = true;
        
        // 重置贷款开始日期为一年前
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), 1);
        loanStartDate.value = oneYearAgo.toISOString().slice(0, 10);
        
        // 清空结果
        prepaymentSummary.innerHTML = '';
        prepaymentComparison.innerHTML = '';
        prepaymentSchedule.querySelector('tbody').innerHTML = '';
        
        // 销毁图表
        if (prepaymentChartInstance) {
          prepaymentChartInstance.destroy();
          prepaymentChartInstance = null;
        }
        
        // 禁用导出按钮
        exportPrepaymentBtn.disabled = true;
      });
      
      // 事件监听 - 方案比较
      calculateCompareBtn.addEventListener('click', compareLoans);
      
      clearCompareBtn.addEventListener('click', () => {
        compareAmount.value = '500000';
        compareTerm.value = '30';
        compareCommercial.checked = true;
        compareHousing.checked = true;
        compareCombined.checked = true;
        combinedRatio.value = '50';
        updateCombinedRatio();
        compareEqualInstallment.checked = true;
        compareEqualPrincipal.checked = true;
        
        // 清空结果
        compareTable.querySelector('tbody').innerHTML = '';
        
        // 销毁图表
        if (compareChartInstance) {
          compareChartInstance.destroy();
          compareChartInstance = null;
        }
        
        // 禁用导出按钮
        exportCompareBtn.disabled = true;
      });
      
      // 初始禁用导出按钮和保存方案按钮
      exportBtn.disabled = true;
      savePlanBtn.disabled = true;
      exportCombinedBtn.disabled = true;
      exportPrepaymentBtn.disabled = true;
      exportCompareBtn.disabled = true;
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .loan-tabs {
          margin-bottom: 20px;
        }
        
        .tab-header {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 20px;
          overflow-x: auto;
        }
        
        .tab-btn {
          padding: 10px 15px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: var(--transition);
          white-space: nowrap;
        }
        
        .tab-btn.active {
          border-bottom-color: var(--primary-color);
          color: var(--primary-color);
        }
        
        .tab-content {
          display: none;
        }
        
        .tab-content.active {
          display: block;
        }
        
        .loan-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .loan-input-section {
          flex: 1;
          min-width: 300px;
        }
        
        .loan-result-section {
          flex: 2;
          min-width: 400px;
        }
        
        .input-with-unit {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .input-with-unit .unit {
          color: var(--text-muted);
        }
        
        .input-with-unit .btn {
          padding: 2px 6px;
          font-size: 12px;
        }
        
        .repayment-options,
        .prepayment-options,
        .loan-options,
        .compare-options,
        .compare-methods {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 10px;
        }
        
        .form-check {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .form-text {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 5px;
        }
        
        .loan-actions,
        .combined-actions,
        .prepayment-actions,
        .compare-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }
        
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .chart-type-selector {
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .chart-type-btn {
          padding: 5px 10px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .chart-type-btn.active {
          border-bottom-color: var(--primary-color);
          color: var(--primary-color);
        }
        
        .result-header h3,
        .comparison-header h3 {
          margin: 0;
        }
        
        .loan-summary,
        .combined-summary,
        .prepayment-summary {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .summary-item {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
        }
        
        .summary-label {
          color: var(--text-muted);
          margin-bottom: 5px;
          font-size: 14px;
        }
        
        .summary-value {
          font-size: 16px;
          font-weight: 500;
        }
        
        .summary-value.highlight {
          color: var(--primary-color);
          font-size: 18px;
        }
        
        .loan-chart-container,
        .combined-chart-container,
        .prepayment-chart-container,
        .compare-chart-container {
          height: 300px;
          margin-bottom: 20px;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
        }
        
        .loan-schedule-header,
        .combined-schedule-header,
        .prepayment-schedule-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .loan-schedule-header h3,
        .combined-schedule-header h3,
        .prepayment-schedule-header h3 {
          margin: 0;
        }
        
        .schedule-filter {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .loan-schedule-container,
        .combined-schedule-container,
        .prepayment-schedule-container,
        .compare-table-container {
          overflow-x: auto;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
        }
        
        .loan-schedule,
        .compare-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .loan-schedule th, .loan-schedule td,
        .compare-table th, .compare-table td {
          padding: 10px;
          text-align: right;
          border-bottom: 1px solid var(--border-color);
        }
        
        .loan-schedule th:first-child, .loan-schedule td:first-child,
        .loan-schedule th:nth-child(2), .loan-schedule td:nth-child(2),
        .compare-table th:first-child, .compare-table td:first-child,
        .compare-table th:nth-child(2), .compare-table td:nth-child(2),
        .compare-table th:nth-child(3), .compare-table td:nth-child(3),
        .compare-table th:nth-child(4), .compare-table td:nth-child(4) {
          text-align: left;
        }
        
        .loan-schedule th,
        .compare-table th {
          background-color: var(--bg-color);
          font-weight: 500;
        }
        
        .loan-info {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .info-header {
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .info-header h3 {
          margin: 0;
        }
        
        .info-content {
          padding: 15px;
        }
        
        .info-item {
          margin-bottom: 20px;
        }
        
        .info-item:last-child {
          margin-bottom: 0;
        }
        
        .info-item h4 {
          margin-top: 0;
          margin-bottom: 10px;
        }
        
        .info-item p {
          margin: 0 0 10px 0;
        }
        
        .combined-loan-container,
        .prepayment-container,
        .compare-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .combined-loan-inputs,
        .prepayment-inputs,
        .compare-inputs {
          flex: 1;
          min-width: 300px;
        }
        
        .combined-loan-results,
        .prepayment-results,
        .compare-results {
          flex: 2;
          min-width: 400px;
        }
        
        .commercial-loan-section,
        .housing-loan-section {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
        }
        
        .commercial-loan-section h3,
        .housing-loan-section h3 {
          margin-top: 0;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .combined-loan-options {
          margin-top: 20px;
        }
        
        .prepayment-comparison {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
        }
        
        .comparison-header {
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .comparison-content {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .comparison-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px dashed var(--border-color);
        }
        
        .comparison-label {
          font-weight: 500;
        }
        
        .comparison-value {
          text-align: right;
        }
        
        .comparison-value.positive {
          color: #28a745;
        }
        
        .comparison-value.negative {
          color: #dc3545;
        }
        
        .combined-ratio {
          margin-top: 10px;
        }
        
        .ratio-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 5px;
        }
        
        .form-range {
          width: 100%;
          height: 8px;
          padding: 0;
          background-color: var(--border-color);
          border-radius: 4px;
          appearance: none;
        }
        
        .form-range::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--primary-color);
          cursor: pointer;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .rate-reference-modal {
          background-color: var(--bg-color);
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .rate-reference-header {
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .rate-reference-header h3 {
          margin: 0;
        }
        
        .rate-reference-content {
          padding: 15px;
        }
        
        .rate-reference-footer {
          padding: 15px;
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        
        .rate-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .rate-table th, .rate-table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }
        
        .rate-table th {
          background-color: var(--bg-light);
          font-weight: 500;
        }
        
        .rate-table tbody tr {
          cursor: pointer;
          transition: var(--transition);
        }
        
        .rate-table tbody tr:hover {
          background-color: var(--bg-light);
        }
        
        .rate-table tbody tr.selected {
          background-color: rgba(var(--primary-color-rgb), 0.1);
        }
        
        @media (max-width: 768px) {
          .loan-container,
          .combined-loan-container,
          .prepayment-container,
          .compare-container {
            flex-direction: column;
          }
          
          .loan-summary,
          .combined-summary,
          .prepayment-summary {
            grid-template-columns: 1fr 1fr;
          }
          
          .tab-header {
            flex-wrap: wrap;
          }
          
          .tab-btn {
            flex: 1;
            text-align: center;
            padding: 8px;
          }
        }
      `;
      container.appendChild(style);
      
      // 加载Chart.js库
      if (!window.Chart) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        document.head.appendChild(script);
        
        script.onload = () => {
          showToast('Chart.js库加载成功', 'success');
        };
        
        script.onerror = () => {
          showToast('Chart.js库加载失败，请检查网络连接', 'error');
        };
      }
    }
  };
  
  // 注册工具
  window.tools.loanCalculator = tool;
})();