/**
 * 单位转换工具 - 工具类模块
 * 提供各种辅助功能
 */

const UnitConverterUtils = {
  // 格式化结果
  formatResult: function(value) {
    // 处理非常大或非常小的数字
    if (Math.abs(value) < 0.000001 && value !== 0) {
      return value.toExponential(6);
    }
    
    // 处理普通数字，保留适当的小数位
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return value.toExponential(6);
    } else if (absValue >= 100) {
      return value.toFixed(2);
    } else if (absValue >= 10) {
      return value.toFixed(4);
    } else if (absValue >= 1) {
      return value.toFixed(6);
    } else if (absValue > 0) {
      return value.toFixed(8);
    } else {
      return value.toString();
    }
  },
  
  // 格式化数字，添加千位分隔符
  formatNumberWithCommas: function(value) {
    // 检查是否为指数表示法
    if (String(value).includes('e')) {
      return value;
    }
    
    // 分离整数部分和小数部分
    const parts = String(value).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return parts.join('.');
  },
  
  // 复制到剪贴板
  copyToClipboard: function(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (successful) {
        this.showToast('已复制到剪贴板', 'success');
      } else {
        this.showToast('复制失败', 'error');
      }
    } catch (err) {
      document.body.removeChild(textarea);
      this.showToast('复制失败: ' + err, 'error');
    }
  },
  
  // 显示提示消息
  showToast: function(message, type = 'info') {
    if (window.showToast) {
      window.showToast(message, type);
    } else {
      alert(message);
    }
  },
  
  // 获取单位名称
  getUnitName: function(category, unitId) {
    const unit = UnitConverterData.units[category].units.find(u => u.id === unitId);
    return unit ? unit.name : unitId;
  },
  
  // 导出为CSV
  exportToCSV: function(data, filename) {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};