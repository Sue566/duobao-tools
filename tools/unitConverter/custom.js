/**
 * 单位转换工具 - 自定义单位模块
 * 管理自定义单位功能
 */

const UnitConverterCustom = {
  // 更新自定义单位列表
  updateCustomUnitsList: function() {
    const container = document.querySelector('.unit-converter-container').closest('.tool-container');
    const customCategory = container.querySelector('#custom-category');
    const customUnitsList = container.querySelector('#custom-units-list');
    
    const savedUnits = JSON.parse(localStorage.getItem('customUnits') || '{}');
    const category = customCategory.value;
    
    if (!savedUnits[category] || savedUnits[category].length === 0) {
      customUnitsList.innerHTML = '<div class="no-custom-units">暂无自定义单位</div>';
      return;
    }
    
    let html = '';
    savedUnits[category].forEach(unit => {
      html += `
        <div class="custom-unit-item">
          <div class="custom-unit-info">
            <div class="custom-unit-name">${unit.name}</div>
            <div class="custom-unit-details">ID: ${unit.id}, 因子: ${unit.factor}</div>
          </div>
          <div class="custom-unit-actions">
            <button class="btn btn-sm btn-danger delete-custom-unit" data-id="${unit.id}"><i class="fa fa-trash-o"></i></button>
          </div>
        </div>
      `;
    });
    
    customUnitsList.innerHTML = html;
    
    // 添加删除事件
    customUnitsList.querySelectorAll('.delete-custom-unit').forEach(btn => {
      btn.addEventListener('click', () => {
        const unitId = btn.getAttribute('data-id');
        this.deleteCustomUnit(category, unitId);
      });
    });
  },
  
  // 添加自定义单位
  addCustomUnit: function() {
    const container = document.querySelector('.unit-converter-container').closest('.tool-container');
    const customCategory = container.querySelector('#custom-category');
    const customId = container.querySelector('#custom-id');
    const customName = container.querySelector('#custom-name');
    const customFactor = container.querySelector('#custom-factor');
    
    const category = customCategory.value;
    const id = customId.value.trim();
    const name = customName.value.trim();
    const factor = parseFloat(customFactor.value);
    
    if (!id || !name) {
      UnitConverterUtils.showToast('请输入单位ID和名称', 'warning');
      return;
    }
    
    if (isNaN(factor) || factor <= 0) {
      UnitConverterUtils.showToast('请输入有效的转换因子', 'warning');
      return;
    }
    
    // 获取现有自定义单位
    const savedUnits = JSON.parse(localStorage.getItem('customUnits') || '{}');
    if (!savedUnits[category]) {
      savedUnits[category] = [];
    }
    
    // 检查是否已存在相同ID的单位
    const existingIndex = savedUnits[category].findIndex(u => u.id === id);
    const customUnit = { id, name, factor };
    
    if (existingIndex >= 0) {
      // 更新现有单位
      savedUnits[category][existingIndex] = customUnit;
    } else {
      // 添加新单位
      savedUnits[category].push(customUnit);
    }
    
    // 保存自定义单位
    localStorage.setItem('customUnits', JSON.stringify(savedUnits));
    
    // 重新加载单位
    UnitConverterData.loadCustomUnits();
    
    // 更新选择器
    const categorySelect = container.querySelector('#unit-category');
    UnitConverterCore.populateUnitSelectors(categorySelect.value);
    
    const batchCategory = container.querySelector('#batch-category');
    if (batchCategory.value === category) {
      UnitConverterBatch.populateBatchUnitSelectors(category);
    }
    
    // 更新自定义单位列表
    this.updateCustomUnitsList();
    
    // 清空输入
    customId.value = '';
    customName.value = '';
    customFactor.value = '';
    
    UnitConverterUtils.showToast('自定义单位已添加', 'success');
  },
  
  // 删除自定义单位
  deleteCustomUnit: function(category, unitId) {
    if (confirm('确定要删除此自定义单位吗？')) {
      const savedUnits = JSON.parse(localStorage.getItem('customUnits') || '{}');
      
      if (savedUnits[category]) {
        const index = savedUnits[category].findIndex(u => u.id === unitId);
        if (index >= 0) {
          savedUnits[category].splice(index, 1);
          
          // 如果分类为空，删除分类
          if (savedUnits[category].length === 0) {
            delete savedUnits[category];
          }
          
          // 保存更新后的单位
          localStorage.setItem('customUnits', JSON.stringify(savedUnits));
          
          // 重新加载单位
          UnitConverterData.loadCustomUnits();
          
          // 更新选择器
          const container = document.querySelector('.unit-converter-container').closest('.tool-container');
          const categorySelect = container.querySelector('#unit-category');
          UnitConverterCore.populateUnitSelectors(categorySelect.value);
          
          const batchCategory = container.querySelector('#batch-category');
          if (batchCategory.value === category) {
            UnitConverterBatch.populateBatchUnitSelectors(category);
          }
          
          // 更新自定义单位列表
          this.updateCustomUnitsList();
          
          UnitConverterUtils.showToast('自定义单位已删除', 'info');
        }
      }
    }
  },
  
  // 重置自定义单位
  resetCustomUnits: function() {
    if (confirm('确定要重置所有自定义单位吗？这将恢复默认单位设置。')) {
      localStorage.removeItem('customUnits');
      
      // 重新初始化单位数据
      UnitConverterData.init();
      
      // 更新选择器
      const container = document.querySelector('.unit-converter-container').closest('.tool-container');
      const categorySelect = container.querySelector('#unit-category');
      UnitConverterCore.populateUnitSelectors(categorySelect.value);
      
      const batchCategory = container.querySelector('#batch-category');
      UnitConverterBatch.populateBatchUnitSelectors(batchCategory.value);
      
      // 更新自定义单位列表
      this.updateCustomUnitsList();
      
      UnitConverterUtils.showToast('已重置为默认单位', 'info');
    }
  }
};