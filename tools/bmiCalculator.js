/**
 * BMI计算器
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = `
        <div class="tool-header">
          <h2><i class="fa fa-user-md"></i> BMI计算器</h2>
          <p class="tool-description">计算体质指数(BMI)，评估健康状况。</p>
        </div>
        
        <div class="bmi-container">
          <div class="bmi-form">
            <div class="form-group">
              <label for="height">身高</label>
              <div class="input-with-unit">
                <input type="number" id="height" class="form-control" placeholder="请输入身高" min="50" max="250" />
                <span class="unit">厘米</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="weight">体重</label>
              <div class="input-with-unit">
                <input type="number" id="weight" class="form-control" placeholder="请输入体重" min="20" max="300" />
                <span class="unit">公斤</span>
              </div>
            </div>
            
            <div class="form-group">
              <label>性别</label>
              <div class="gender-selector">
                <label class="gender-option">
                  <input type="radio" name="gender" value="male" checked />
                  <span class="gender-icon"><i class="fa fa-male"></i></span>
                  <span class="gender-text">男性</span>
                </label>
                <label class="gender-option">
                  <input type="radio" name="gender" value="female" />
                  <span class="gender-icon"><i class="fa fa-female"></i></span>
                  <span class="gender-text">女性</span>
                </label>
              </div>
            </div>
            
            <div class="form-group">
              <label for="age">年龄</label>
              <input type="number" id="age" class="form-control" placeholder="请输入年龄" min="1" max="120" />
            </div>
            
            <div class="form-group">
              <button id="calculate-btn" class="btn btn-success"><i class="fa fa-calculator"></i> 计算BMI</button>
              <button id="reset-btn" class="btn btn-secondary"><i class="fa fa-refresh"></i> 重置</button>
            </div>
          </div>
          
          <div class="bmi-result" id="bmi-result" style="display: none;">
            <div class="result-header">
              <h3>计算结果</h3>
            </div>
            
            <div class="bmi-value">
              <div class="value" id="bmi-value">0.0</div>
              <div class="label">BMI值</div>
            </div>
            
            <div class="bmi-category" id="bmi-category">
              <div class="category-label">正常</div>
              <div class="category-range">正常范围：18.5 - 24.9</div>
            </div>
            
            <div class="bmi-chart">
              <div class="chart-bar">
                <div class="segment underweight" title="偏瘦">
                  <span>&lt;18.5</span>
                </div>
                <div class="segment normal" title="正常">
                  <span>18.5-24.9</span>
                </div>
                <div class="segment overweight" title="偏胖">
                  <span>25-29.9</span>
                </div>
                <div class="segment obese" title="肥胖">
                  <span>&gt;30</span>
                </div>
              </div>
              <div class="chart-pointer" id="bmi-pointer" style="left: 30%;">
                <i class="fa fa-caret-down"></i>
              </div>
            </div>
            
            <div class="bmi-info">
              <h4>BMI指数说明</h4>
              <ul>
                <li><strong>小于18.5：</strong>体重过轻，可能营养不良，免疫力较低。</li>
                <li><strong>18.5 - 24.9：</strong>体重正常，健康风险较低。</li>
                <li><strong>25 - 29.9：</strong>超重，有一定健康风险。</li>
                <li><strong>30及以上：</strong>肥胖，健康风险较高，易患心脏病、高血压等疾病。</li>
              </ul>
              <p class="disclaimer">注意：BMI只是健康评估的参考指标之一，不能完全代表健康状况。</p>
            </div>
          </div>
        </div>
      `;
      
      // 添加收藏按钮
      window.addFavoriteButton('bmiCalculator', container.querySelector('.tool-header'));
      
      // 获取元素
      const heightInput = container.querySelector('#height');
      const weightInput = container.querySelector('#weight');
      const ageInput = container.querySelector('#age');
      const calculateBtn = container.querySelector('#calculate-btn');
      const resetBtn = container.querySelector('#reset-btn');
      const resultContainer = container.querySelector('#bmi-result');
      const bmiValue = container.querySelector('#bmi-value');
      const bmiCategory = container.querySelector('#bmi-category');
      const bmiPointer = container.querySelector('#bmi-pointer');
      
      // 计算BMI
      calculateBtn.addEventListener('click', () => {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);
        const age = parseInt(ageInput.value);
        const gender = container.querySelector('input[name="gender"]:checked').value;
        
        // 验证输入
        if (!height || !weight) {
          showToast('请输入身高和体重', 'warning');
          return;
        }
        
        if (height < 50 || height > 250) {
          showToast('请输入有效的身高（50-250厘米）', 'warning');
          return;
        }
        
        if (weight < 20 || weight > 300) {
          showToast('请输入有效的体重（20-300公斤）', 'warning');
          return;
        }
        
        // 计算BMI
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        
        // 显示结果
        resultContainer.style.display = 'block';
        bmiValue.textContent = bmi.toFixed(1);
        
        // 设置分类
        let category, categoryClass, pointerPosition;
        
        if (bmi < 18.5) {
          category = '偏瘦';
          categoryClass = 'underweight';
          pointerPosition = (bmi / 40) * 100;
        } else if (bmi < 25) {
          category = '正常';
          categoryClass = 'normal';
          pointerPosition = ((bmi - 18.5) / 6.5 * 25) + 25;
        } else if (bmi < 30) {
          category = '偏胖';
          categoryClass = 'overweight';
          pointerPosition = ((bmi - 25) / 5 * 25) + 50;
        } else {
          category = '肥胖';
          categoryClass = 'obese';
          pointerPosition = ((bmi - 30) / 10 * 25) + 75;
          if (pointerPosition > 100) pointerPosition = 100;
        }
        
        bmiCategory.innerHTML = `
          <div class="category-label ${categoryClass}">${category}</div>
          <div class="category-range">正常范围：18.5 - 24.9</div>
        `;
        
        bmiPointer.style.left = `${pointerPosition}%`;
        
        // 滚动到结果
        resultContainer.scrollIntoView({ behavior: 'smooth' });
      });
      
      // 重置
      resetBtn.addEventListener('click', () => {
        heightInput.value = '';
        weightInput.value = '';
        ageInput.value = '';
        container.querySelector('input[value="male"]').checked = true;
        resultContainer.style.display = 'none';
      });
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .bmi-container {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
        }
        
        .bmi-form {
          flex: 1;
          min-width: 300px;
        }
        
        .bmi-result {
          flex: 1;
          min-width: 300px;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 20px;
        }
        
        .input-with-unit {
          display: flex;
          align-items: center;
        }
        
        .input-with-unit .unit {
          margin-left: 10px;
          color: var(--text-muted);
        }
        
        .gender-selector {
          display: flex;
          gap: 20px;
        }
        
        .gender-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }
        
        .gender-option input {
          position: absolute;
          opacity: 0;
        }
        
        .gender-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          color: var(--text-muted);
          transition: var(--transition);
        }
        
        .gender-option input:checked + .gender-icon {
          background-color: var(--primary-color);
          color: white;
        }
        
        .gender-text {
          margin-top: 8px;
        }
        
        .result-header {
          margin-bottom: 20px;
        }
        
        .bmi-value {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .bmi-value .value {
          font-size: 48px;
          font-weight: 500;
          color: var(--primary-color);
        }
        
        .bmi-value .label {
          color: var(--text-muted);
        }
        
        .bmi-category {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .category-label {
          font-size: 24px;
          font-weight: 500;
          margin-bottom: 5px;
        }
        
        .category-label.underweight {
          color: #3498db;
        }
        
        .category-label.normal {
          color: #2ecc71;
        }
        
        .category-label.overweight {
          color: #f39c12;
        }
        
        .category-label.obese {
          color: #e74c3c;
        }
        
        .category-range {
          color: var(--text-muted);
          font-size: 14px;
        }
        
        .bmi-chart {
          position: relative;
          margin-bottom: 30px;
        }
        
        .chart-bar {
          display: flex;
          height: 30px;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .chart-bar .segment {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          position: relative;
        }
        
        .segment.underweight {
          background-color: #3498db;
        }
        
        .segment.normal {
          background-color: #2ecc71;
        }
        
        .segment.overweight {
          background-color: #f39c12;
        }
        
        .segment.obese {
          background-color: #e74c3c;
        }
        
        .chart-pointer {
          position: absolute;
          top: -10px;
          transform: translateX(-50%);
          font-size: 24px;
          color: var(--text-color);
          transition: left 0.5s ease;
        }
        
        .bmi-info {
          background-color: rgba(0, 0, 0, 0.03);
          border-radius: 4px;
          padding: 15px;
        }
        
        .bmi-info h4 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 16px;
        }
        
        .bmi-info ul {
          padding-left: 20px;
          margin-bottom: 10px;
        }
        
        .bmi-info li {
          margin-bottom: 5px;
          font-size: 14px;
        }
        
        .disclaimer {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 0;
        }
        
        @media (max-width: 768px) {
          .bmi-container {
            flex-direction: column;
          }
        }
      `;
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.bmiCalculator = tool;
})();