/**
 * 单位转换工具
 * 增强版：支持更多单位类型、批量转换、自定义单位和单位换算表
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 加载模板和样式
      const loadTemplate = () => {
        return fetch('tools/unitConverter/template.html')
          .then(response => response.text())
          .then(html => {
            container.innerHTML = html;
            
            // 添加样式
            if (!document.querySelector('link[href="tools/unitConverter/styles.css"]')) {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = 'tools/unitConverter/styles.css';
              document.head.appendChild(link);
            }
            
            return Promise.resolve();
          });
      };
      
      // 加载模块JS文件
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
          
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };
      
      // 初始化工具
      const initTool = () => {
        // 添加收藏按钮
        window.addFavoriteButton('unitConverter', container.querySelector('.tool-header'));
        
        // 初始化单位数据
        UnitConverterData.init();
        
        // 添加额外单位类型
        UnitConverterData.addCurrencyUnits(container);
        UnitConverterData.addAngleUnits();
        UnitConverterData.addFuelUnits();
        UnitConverterData.addPowerUnits();
      };
      
      // 显示加载中状态
      container.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div><div class="loading-text">加载单位转换工具中...</div></div>';
      
      // 按顺序加载所有模块
      Promise.all([
        loadScript('tools/unitConverter/data.js'),
        loadScript('tools/unitConverter/utils.js'),
        loadScript('tools/unitConverter/core.js'),
        loadScript('tools/unitConverter/history.js'),
        loadScript('tools/unitConverter/batch.js'),
        loadScript('tools/unitConverter/table.js'),
        loadScript('tools/unitConverter/custom.js'),
        loadScript('tools/unitConverter/chart.js')
      ])
      .then(() => loadTemplate())
      .then(() => {
        // 获取元素
        const categorySelect = container.querySelector('#unit-category');
        const fromValue = container.querySelector('#from-value');
        const fromUnit = container.querySelector('#from-unit');
        const toValue = container.querySelector('#to-value');
        const toUnit = container.querySelector('#to-unit');
        const swapUnits = container.querySelector('#swap-units');
        const convertBtn = container.querySelector('#convert-btn');
        const copyResult = container.querySelector('#copy-result');
        const showChartBtn = container.querySelector('#show-chart-btn');
        const clearBtn = container.querySelector('#clear-btn');
        
        // 获取额外元素
        const tabButtons = container.querySelectorAll('.tab-btn');
        const tabContents = container.querySelectorAll('.tab-content');
        
        // 批量转换元素
        const batchCategory = container.querySelector('#batch-category');
        const batchConvertBtn = container.querySelector('#batch-convert-btn');
        const batchClearBtn = container.querySelector('#batch-clear-btn');
        const batchCopyBtn = container.querySelector('#batch-copy-btn');
        
        // 换算表元素
        const tableCategory = container.querySelector('#table-category');
        const generateTable = container.querySelector('#generate-table');
        const exportTable = container.querySelector('#export-table');
        const printTable = container.querySelector('#print-table');
        
        // 自定义单位元素
        const customCategory = container.querySelector('#custom-category');
        const addCustomUnit = container.querySelector('#add-custom-unit');
        const resetCustomUnits = container.querySelector('#reset-custom-units');
        
        // 历史记录元素
        const exportHistoryBtn = container.querySelector('#export-history');
        const clearHistory = container.querySelector('#clear-history');
        const clearFavorites = container.querySelector('#clear-favorites');
        
        // 切换标签页
        tabButtons.forEach(btn => {
          btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
            
            // 同步数据
            if (btn.dataset.tab === 'batch') {
              batchCategory.value = categorySelect.value;
              UnitConverterBatch.populateBatchUnitSelectors(batchCategory.value);
            } else if (btn.dataset.tab === 'table') {
              tableCategory.value = categorySelect.value;
            } else if (btn.dataset.tab === 'custom') {
              UnitConverterCustom.updateCustomUnitsList();
            }
          });
        });
        
        // 事件监听
        categorySelect.addEventListener('change', () => {
          UnitConverterCore.populateUnitSelectors(categorySelect.value);
        });
        
        swapUnits.addEventListener('click', () => {
          const tempUnit = fromUnit.value;
          fromUnit.value = toUnit.value;
          toUnit.value = tempUnit;
          
          // 如果已经有结果，也交换值
          if (toValue.value) {
            const tempValue = fromValue.value;
            fromValue.value = toValue.value;
            toValue.value = tempValue;
          }
        });
        
        convertBtn.addEventListener('click', UnitConverterCore.convertUnits);
        
        copyResult.addEventListener('click', () => {
          if (toValue.value) {
            UnitConverterUtils.copyToClipboard(toValue.value);
          } else {
            UnitConverterUtils.showToast('没有结果可复制', 'warning');
          }
        });
        
        clearBtn.addEventListener('click', () => {
          fromValue.value = '1';
          toValue.value = '';
        });
        
        // 自动转换
        fromValue.addEventListener('input', () => {
          if (fromValue.value) {
            UnitConverterCore.convertUnits();
          }
        });
        
        fromUnit.addEventListener('change', () => {
          if (fromValue.value) {
            UnitConverterCore.convertUnits();
          }
        });
        
        toUnit.addEventListener('change', () => {
          if (fromValue.value) {
            UnitConverterCore.convertUnits();
          }
        });
        
        // 批量转换事件监听
        batchCategory.addEventListener('change', () => {
          UnitConverterBatch.populateBatchUnitSelectors(batchCategory.value);
        });
        
        batchConvertBtn.addEventListener('click', UnitConverterBatch.batchConvert);
        batchClearBtn.addEventListener('click', UnitConverterBatch.clearBatch);
        batchCopyBtn.addEventListener('click', UnitConverterBatch.copyBatchResult);
        
        // 换算表事件监听
        generateTable.addEventListener('click', UnitConverterTable.generateConversionTable);
        exportTable.addEventListener('click', UnitConverterTable.exportTableToCSV);
        printTable.addEventListener('click', UnitConverterTable.printConversionTable);
        
        // 自定义单位事件监听
        customCategory.addEventListener('change', UnitConverterCustom.updateCustomUnitsList);
        addCustomUnit.addEventListener('click', UnitConverterCustom.addCustomUnit);
        resetCustomUnits.addEventListener('click', UnitConverterCustom.resetCustomUnits);
        
        // 历史记录事件监听
        exportHistoryBtn.addEventListener('click', UnitConverterHistory.exportHistory);
        clearHistory.addEventListener('click', UnitConverterHistory.clearHistory);
        clearFavorites.addEventListener('click', UnitConverterHistory.clearFavorites);
        
        // 图表按钮事件监听
        showChartBtn.addEventListener('click', UnitConverterCore.showConversionChart);
        
        // 初始化
        initTool();
        UnitConverterCore.populateUnitSelectors(categorySelect.value);
        UnitConverterHistory.updateHistoryDisplay();
        
        // 初始化图表
        if (window.UnitConverterChart) {
          window.UnitConverterChart.init(container);
        }
        
        // 添加淡入效果
        container.querySelector('.unit-converter-container').style.opacity = '0';
        setTimeout(() => {
          container.querySelector('.unit-converter-container').style.transition = 'opacity 0.5s ease';
          container.querySelector('.unit-converter-container').style.opacity = '1';
        }, 100);
      })
      .catch(error => {
        console.error('加载单位转换工具失败:', error);
        container.innerHTML = '<div class="tool-error">加载单位转换工具失败</div>';
      });
    }
  };
  
  // 注册工具
  window.tools.unitConverter = tool;
})();

// 添加加载中样式
(function() {
  const style = document.createElement('style');
  style.textContent = `
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top-color: var(--primary-color, #4a90e2);
      animation: spin 1s ease-in-out infinite;
      margin-bottom: 15px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .loading-text {
      color: var(--text-muted, #666);
      font-size: 14px;
    }
    
    .tool-error {
      padding: 20px;
      color: #d32f2f;
      text-align: center;
      background-color: rgba(211, 47, 47, 0.1);
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .unit-converter-container {
      opacity: 0;
    }
  `;
  document.head.appendChild(style);
})();
