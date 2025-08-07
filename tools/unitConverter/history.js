/**
 * 单位转换工具 - 历史记录模块
 * 管理转换历史和收藏夹
 */

const UnitConverterHistory = {
  // 添加到历史记录
  addToHistory: function(category, fromValue, fromUnitId, toValue, toUnitId) {
    // 获取现有历史记录
    let history = JSON.parse(localStorage.getItem('unitConversionHistory') || '[]');
    
    // 添加新记录
    history.unshift({
      category: category,
      categoryName: UnitConverterData.units[category].name,
      fromValue: fromValue,
      fromUnit: fromUnitId,
      fromUnitName: UnitConverterUtils.getUnitName(category, fromUnitId),
      toValue: toValue,
      toUnit: toUnitId,
      toUnitName: UnitConverterUtils.getUnitName(category, toUnitId),
      timestamp: new Date().toISOString()
    });
    
    // 限制历史记录数量
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    
    // 保存历史记录
    localStorage.setItem('unitConversionHistory', JSON.stringify(history));
    
    // 更新历史记录显示
    this.updateHistoryDisplay();
  },
  
  // 更新历史记录显示
  updateHistoryDisplay: function() {
    const container = document.getElementById('random-picker-container').closest('.tool-container');
    const historyContent = container.querySelector('#history-content');
    
    const history = JSON.parse(localStorage.getItem('unitConversionHistory') || '[]');
    const favorites = JSON.parse(localStorage.getItem('unitConversionFavorites') || '[]');
    
    if (history.length === 0) {
      historyContent.innerHTML = '<div class="no-history">暂无转换历史</div>';
    } else {
      let html = '';
      history.forEach((item, index) => {
        const date = new Date(item.timestamp);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        
        // 检查是否为收藏项
        const isFavorite = favorites.some(fav => 
          fav.category === item.category && 
          fav.fromUnit === item.fromUnit && 
          fav.toUnit === item.toUnit
        );
        
        html += `
          <div class="history-item">
            <div class="history-item-header">
              <span class="history-category">${item.categoryName}</span>
              <span class="history-date">${formattedDate}</span>
            </div>
            <div class="history-item-content">
              <div class="history-conversion">
                ${UnitConverterUtils.formatNumberWithCommas(UnitConverterUtils.formatResult(item.fromValue))} ${item.fromUnitName} = ${UnitConverterUtils.formatNumberWithCommas(UnitConverterUtils.formatResult(item.toValue))} ${item.toUnitName}
              </div>
            </div>
            <div class="history-item-actions">
              <button class="btn btn-sm use-conversion" data-index="${index}" title="使用此转换"><i class="fa fa-arrow-up"></i></button>
              <button class="btn btn-sm toggle-favorite" data-index="${index}" title="${isFavorite ? '取消收藏' : '添加到常用'}">
                <i class="fa ${isFavorite ? 'fa-star' : 'fa-star-o'}"></i>
              </button>
              <button class="btn btn-sm delete-history" data-index="${index}" title="删除此记录"><i class="fa fa-times"></i></button>
            </div>
          </div>
        `;
      });
      
      historyContent.innerHTML = html;
      
      // 添加事件监听
      historyContent.querySelectorAll('.use-conversion').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.getAttribute('data-index'));
          const item = history[index];
          
          // 设置类别
          const categorySelect = container.querySelector('#unit-category');
          categorySelect.value = item.category;
          UnitConverterCore.populateUnitSelectors(item.category);
          
          // 设置值和单位
          const fromValue = container.querySelector('#from-value');
          const fromUnit = container.querySelector('#from-unit');
          const toUnit = container.querySelector('#to-unit');
          
          fromValue.value = item.fromValue;
          fromUnit.value = item.fromUnit;
          toUnit.value = item.toUnit;
          
          // 执行转换
          UnitConverterCore.convertUnits();
          
          // 切换到转换标签页
          const tabButtons = container.querySelectorAll('.tab-btn');
          tabButtons[0].click();
        });
      });
      
      // 添加收藏/取消收藏事件
      historyContent.querySelectorAll('.toggle-favorite').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.getAttribute('data-index'));
          const item = history[index];
          
          this.toggleFavorite(item);
          this.updateHistoryDisplay();
          this.updateFavoritesDisplay();
        });
      });
      
      // 添加删除历史记录事件
      historyContent.querySelectorAll('.delete-history').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.getAttribute('data-index'));
          
          // 删除历史记录
          history.splice(index, 1);
          localStorage.setItem('unitConversionHistory', JSON.stringify(history));
          
          // 更新显示
          this.updateHistoryDisplay();
        });
      });
    }
    
    // 更新收藏夹显示
    this.updateFavoritesDisplay();
  },
  
  // 更新收藏夹显示
  updateFavoritesDisplay: function() {
    const container = document.getElementById('random-picker-container').closest('.tool-container');
    const favoritesContent = container.querySelector('#favorites-content');
    
    const favorites = JSON.parse(localStorage.getItem('unitConversionFavorites') || '[]');
    
    if (favorites.length === 0) {
      favoritesContent.innerHTML = '<div class="no-favorites">暂无常用转换，点击历史记录中的<i class="fa fa-star-o"></i>添加</div>';
    } else {
      let html = '';
      favorites.forEach((item, index) => {
        html += `
          <div class="favorite-item">
            <div class="favorite-item-header">
              <span class="favorite-category">${item.categoryName}</span>
            </div>
            <div class="favorite-item-content">
              <div class="favorite-conversion">
                ${item.fromUnitName} → ${item.toUnitName}
              </div>
            </div>
            <div class="favorite-item-actions">
              <button class="btn btn-sm use-favorite" data-index="${index}" title="使用此转换"><i class="fa fa-arrow-up"></i></button>
              <button class="btn btn-sm remove-favorite" data-index="${index}" title="从常用中移除"><i class="fa fa-times"></i></button>
            </div>
          </div>
        `;
      });
      
      favoritesContent.innerHTML = html;
      
      // 添加事件监听
      favoritesContent.querySelectorAll('.use-favorite').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.getAttribute('data-index'));
          const item = favorites[index];
          
          // 设置类别
          const categorySelect = container.querySelector('#unit-category');
          categorySelect.value = item.category;
          UnitConverterCore.populateUnitSelectors(item.category);
          
          // 设置单位
          const fromUnit = container.querySelector('#from-unit');
          const toUnit = container.querySelector('#to-unit');
          
          fromUnit.value = item.fromUnit;
          toUnit.value = item.toUnit;
          
          // 如果有值，设置值
          const fromValue = container.querySelector('#from-value');
          if (item.fromValue) {
            fromValue.value = item.fromValue;
          }
          
          // 执行转换
          UnitConverterCore.convertUnits();
          
          // 切换到转换标签页
          const tabButtons = container.querySelectorAll('.tab-btn');
          tabButtons[0].click();
        });
      });
      
      // 添加删除收藏事件
      favoritesContent.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.getAttribute('data-index'));
          
          // 删除收藏
          favorites.splice(index, 1);
          localStorage.setItem('unitConversionFavorites', JSON.stringify(favorites));
          
          // 更新显示
          this.updateFavoritesDisplay();
          this.updateHistoryDisplay();
        });
      });
    }
  },
  
  // 切换收藏状态
  toggleFavorite: function(item) {
    const favorites = JSON.parse(localStorage.getItem('unitConversionFavorites') || '[]');
    
    // 检查是否已收藏
    const existingIndex = favorites.findIndex(fav => 
      fav.category === item.category && 
      fav.fromUnit === item.fromUnit && 
      fav.toUnit === item.toUnit
    );
    
    if (existingIndex >= 0) {
      // 取消收藏
      favorites.splice(existingIndex, 1);
      UnitConverterUtils.showToast('已从常用转换中移除', 'info');
    } else {
      // 添加收藏
      favorites.push({
        category: item.category,
        categoryName: item.categoryName,
        fromUnit: item.fromUnit,
        fromUnitName: item.fromUnitName,
        toUnit: item.toUnit,
        toUnitName: item.toUnitName,
        fromValue: item.fromValue
      });
      UnitConverterUtils.showToast('已添加到常用转换', 'success');
    }
    
    localStorage.setItem('unitConversionFavorites', JSON.stringify(favorites));
  },
  
  // 导出历史记录
  exportHistory: function() {
    const history = JSON.parse(localStorage.getItem('unitConversionHistory') || '[]');
    
    if (history.length === 0) {
      UnitConverterUtils.showToast('没有历史记录可导出', 'warning');
      return;
    }
    
    // 创建CSV内容
    let csvContent = '类别,输入值,输入单位,结果值,结果单位,时间\n';
    
    history.forEach(item => {
      const date = new Date(item.timestamp);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      
      csvContent += `${item.categoryName},${item.fromValue},${item.fromUnitName},${item.toValue},${item.toUnitName},${formattedDate}\n`;
    });
    
    // 导出CSV
    UnitConverterUtils.exportToCSV(csvContent, '单位转换历史记录.csv');
    UnitConverterUtils.showToast('历史记录已导出为CSV文件', 'success');
  },
  
  // 清空历史记录
  clearHistory: function() {
    if (confirm('确定要清空转换历史吗？')) {
      localStorage.removeItem('unitConversionHistory');
      this.updateHistoryDisplay();
      UnitConverterUtils.showToast('转换历史已清空', 'info');
    }
  },
  
  // 清空收藏
  clearFavorites: function() {
    if (confirm('确定要清空常用转换吗？')) {
      localStorage.removeItem('unitConversionFavorites');
      this.updateFavoritesDisplay();
      this.updateHistoryDisplay();
      UnitConverterUtils.showToast('常用转换已清空', 'info');
    }
  }
};