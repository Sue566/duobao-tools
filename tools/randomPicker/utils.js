/**
 * 随机选择器 - 工具函数模块
 */

// 工具函数模块
const RandomPickerUtils = {
  // 显示提示消息
  showToast: function(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // 淡入效果
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // 3秒后淡出
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  },
  
  // 解析输入项目
  parseItems: function(input) {
    // 检查是否是JSON格式
    try {
      const jsonData = JSON.parse(input);
      
      if (Array.isArray(jsonData)) {
        return jsonData.map(item => {
          if (typeof item === 'object' && item !== null) {
            return {
              name: item.name || item.text || item.value || JSON.stringify(item),
              weight: parseFloat(item.weight || item.probability || 1)
            };
          } else {
            return {
              name: String(item),
              weight: 1
            };
          }
        });
      } else if (typeof jsonData === 'object' && jsonData !== null) {
        return Object.entries(jsonData).map(([key, value]) => {
          return {
            name: key,
            weight: parseFloat(value) || 1
          };
        });
      }
    } catch (e) {
      // 不是JSON格式，继续处理
    }
    
    // 检查是否包含权重分隔符
    if (input.includes(':') || input.includes('=')) {
      const lines = input.split(/[\n,;]+/).filter(line => line.trim());
      const items = [];
      
      for (const line of lines) {
        const match = line.match(/^(.+?)[:=](.+)$/);
        if (match) {
          const name = match[1].trim();
          const weight = parseFloat(match[2].trim());
          
          if (!isNaN(weight) && weight >= 0) {
            items.push({ name, weight });
          } else {
            items.push({ name, weight: 1 });
          }
        } else {
          items.push({ name: line.trim(), weight: 1 });
        }
      }
      
      return items;
    }
    
    // 普通列表
    return input
      .split(/[\n,;]+/)
      .map(item => item.trim())
      .filter(item => item)
      .map(item => ({ name: item, weight: 1 }));
  },
  
  // 解析分组定义
  parseGroups: function(input) {
    // 尝试解析JSON格式
    try {
      const jsonData = JSON.parse(input);
      
      if (Array.isArray(jsonData)) {
        return jsonData.map(group => {
          if (typeof group === 'object' && group !== null) {
            const name = group.name || group.group || '未命名组';
            let items = [];
            
            if (Array.isArray(group.items)) {
              items = group.items.map(item => {
                if (typeof item === 'object' && item !== null) {
                  return item.name || item.text || item.value || JSON.stringify(item);
                } else {
                  return String(item);
                }
              });
            }
            
            return { name, items };
          }
        }).filter(group => group && group.items.length > 0);
      }
    } catch (e) {
      // 不是JSON格式，继续处理
    }
    
    // 解析文本格式
    const groups = [];
    let currentGroup = null;
    
    const lines = input.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      // 检查是否是组标题行
      if (trimmedLine.startsWith('#') || trimmedLine.startsWith('组:') || trimmedLine.startsWith('Group:')) {
        const groupName = trimmedLine.replace(/^[#组Group:]+\s*/, '').trim();
        currentGroup = { name: groupName || '未命名组', items: [] };
        groups.push(currentGroup);
      } else if (currentGroup) {
        // 添加项目到当前组
        trimmedLine.split(/[,;]/).forEach(item => {
          const trimmedItem = item.trim();
          if (trimmedItem) {
            currentGroup.items.push(trimmedItem);
          }
        });
      } else {
        // 如果没有定义组，创建默认组
        currentGroup = { name: '默认组', items: [] };
        groups.push(currentGroup);
        
        // 添加当前行的项目
        trimmedLine.split(/[,;]/).forEach(item => {
          const trimmedItem = item.trim();
          if (trimmedItem) {
            currentGroup.items.push(trimmedItem);
          }
        });
      }
    }
    
    return groups.filter(group => group.items.length > 0);
  },
  
  // 解析自定义分布
  parseCustomDistribution: function(input) {
    if (!input.trim()) return [];
    
    // 尝试解析JSON格式
    try {
      const jsonData = JSON.parse(input);
      
      if (Array.isArray(jsonData)) {
        return jsonData.map(item => {
          if (typeof item === 'object' && item !== null) {
            return {
              value: parseFloat(item.value || item.x || 0),
              probability: parseFloat(item.probability || item.prob || item.p || item.y || 0)
            };
          }
          return null;
        }).filter(item => item !== null && !isNaN(item.value) && !isNaN(item.probability));
      }
    } catch (e) {
      // 不是JSON格式，继续处理
    }
    
    // 解析文本格式 (x:y 或 x=y)
    const result = [];
    const lines = input.split(/[\n,;]+/);
    
    for (const line of lines) {
      const match = line.match(/^(.+?)[:=](.+)$/);
      if (match) {
        const value = parseFloat(match[1].trim());
        const probability = parseFloat(match[2].trim());
        
        if (!isNaN(value) && !isNaN(probability)) {
          result.push({ value, probability });
        }
      }
    }
    
    // 归一化概率
    const totalProb = result.reduce((sum, item) => sum + item.probability, 0);
    if (totalProb > 0) {
      return result.map(item => ({
        value: item.value,
        probability: item.probability / totalProb
      }));
    }
    
    return result;
  },
  
  // 生成随机颜色
  generateRandomColor: function(index, total) {
    if (total <= 10) {
      // 预定义的颜色集合
      const colors = [
        '#4285F4', '#EA4335', '#FBBC05', '#34A853', // Google colors
        '#3498db', '#e74c3c', '#2ecc71', '#f39c12', // Flat UI colors
        '#9b59b6', '#1abc9c' // Additional colors
      ];
      return colors[index % colors.length];
    } else {
      // 生成HSL颜色，确保颜色分布均匀
      const hue = (index * 360 / total) % 360;
      const saturation = 70 + Math.random() * 10; // 70-80%
      const lightness = 45 + Math.random() * 10; // 45-55%
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
  },
  
  // 格式化日期时间
  formatDateTime: function(date) {
    const pad = (num) => num.toString().padStart(2, '0');
    
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },
  
  // 导出数据为JSON文件
  exportToJson: function(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  
  // 导出数据为CSV文件
  exportToCsv: function(data, filename) {
    if (!data || !data.length) return;
    
    // 确定CSV的列
    const headers = Object.keys(data[0]);
    
    // 创建CSV内容
    let csvContent = headers.join(',') + '\n';
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // 处理包含逗号、引号或换行符的值
        if (value === null || value === undefined) {
          return '';
        } else if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        } else {
          return value;
        }
      });
      csvContent += values.join(',') + '\n';
    }
    
    // 创建并下载文件
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  
  // 计算字符串的哈希值（用于随机种子）
  hashString: function(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash);
  },
  
  // 深拷贝对象
  deepClone: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
      return obj.map(item => this.deepClone(item));
    }
    
    if (obj instanceof Object) {
      const copy = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          copy[key] = this.deepClone(obj[key]);
        }
      }
      return copy;
    }
    
    return obj;
  }
};

// 导出模块
window.RandomPickerUtils = RandomPickerUtils;