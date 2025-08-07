/**
 * 单位转换工具
 * 增强版：支持更多单位类型、批量转换、自定义单位和单位换算表
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = UnitConverterUI.getHTML();
      
      // 添加收藏按钮
      window.addFavoriteButton('unitConverter', container.querySelector('.tool-header'));
      
      // 初始化单位数据
      UnitConverterData.init();
      
      // 添加额外单位类型
      UnitConverterData.addCurrencyUnits(container);
      UnitConverterData.addAngleUnits();
      UnitConverterData.addFuelUnits();
      UnitConverterData.addPowerUnits();
      
      // 获取元素
      const categorySelect = container.querySelector('#unit-category');
      const fromValue = container.querySelector('#from-value');
      const fromUnit = container.querySelector('#from-unit');
      const toValue = container.querySelector('#to-value');
      const toUnit = container.querySelector('#to-unit');
      const swapUnits = container.querySelector('#swap-units');
      const convertBtn = container.querySelector('#convert-btn');
      const copyResult = container.querySelector('#copy-result');
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
      
      // 初始化
      UnitConverterCore.populateUnitSelectors(categorySelect.value);
      UnitConverterHistory.updateHistoryDisplay();
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = UnitConverterUI.getStyles();
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.unitConverter = tool;
})();