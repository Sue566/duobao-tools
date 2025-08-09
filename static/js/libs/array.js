/**
 * 多宝工具库 - 数组操作工具
 */

window.DuobaoArray = {
  // 数组去重
  unique: function(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    return [...new Set(arr)];
  },
  
  // 数组扁平化
  flatten: function(arr, depth = Infinity) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return depth > 0
      ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? this.flatten(val, depth - 1) : val), [])
      : arr.slice();
  },
  
  // 数组交集
  intersection: function(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
      throw new Error('参数必须是数组');
    }
    
    const set2 = new Set(arr2);
    return arr1.filter(item => set2.has(item));
  },
  
  // 数组并集
  union: function(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
      throw new Error('参数必须是数组');
    }
    
    return [...new Set([...arr1, ...arr2])];
  },
  
  // 数组差集 (arr1 - arr2)
  difference: function(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
      throw new Error('参数必须是数组');
    }
    
    const set2 = new Set(arr2);
    return arr1.filter(item => !set2.has(item));
  },
  
  // 数组对称差集 (arr1 ∆ arr2)
  symmetricDifference: function(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
      throw new Error('参数必须是数组');
    }
    
    return [
      ...arr1.filter(item => !arr2.includes(item)),
      ...arr2.filter(item => !arr1.includes(item))
    ];
  },
  
  // 数组分块
  chunk: function(arr, size = 1) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    if (size <= 0) {
      throw new Error('分块大小必须大于0');
    }
    
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    
    return result;
  },
  
  // 数组随机打乱
  shuffle: function(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    
    return result;
  },
  
  // 获取数组中的随机元素
  sample: function(arr, n = 1) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    if (n <= 0) {
      throw new Error('采样数量必须大于0');
    }
    
    if (n === 1) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
    
    // 使用Fisher-Yates洗牌算法的变体
    const result = [...arr];
    const length = arr.length;
    n = Math.min(n, length);
    
    for (let i = 0; i < n; i++) {
      const j = i + Math.floor(Math.random() * (length - i));
      [result[i], result[j]] = [result[j], result[i]];
    }
    
    return result.slice(0, n);
  },
  
  // 数组排序
  sort: function(arr, key = null, order = 'asc') {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    const result = [...arr];
    
    if (key === null) {
      // 简单类型排序
      return order === 'asc' ? result.sort((a, b) => a - b) : result.sort((a, b) => b - a);
    } else {
      // 对象数组按指定键排序
      return order === 'asc'
        ? result.sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0))
        : result.sort((a, b) => (a[key] < b[key] ? 1 : a[key] > b[key] ? -1 : 0));
    }
  },
  
  // 数组分组
  groupBy: function(arr, key) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.reduce((acc, item) => {
      const groupKey = typeof key === 'function' ? key(item) : item[key];
      
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      
      acc[groupKey].push(item);
      return acc;
    }, {});
  },
  
  // 数组计数
  countBy: function(arr, key) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.reduce((acc, item) => {
      const countKey = typeof key === 'function' ? key(item) : item[key];
      
      acc[countKey] = (acc[countKey] || 0) + 1;
      return acc;
    }, {});
  },
  
  // 数组映射
  map: function(arr, callback) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.map(callback);
  },
  
  // 数组过滤
  filter: function(arr, callback) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.filter(callback);
  },
  
  // 数组归约
  reduce: function(arr, callback, initialValue) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arguments.length === 3
      ? arr.reduce(callback, initialValue)
      : arr.reduce(callback);
  },
  
  // 数组查找
  find: function(arr, callback) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.find(callback);
  },
  
  // 数组查找索引
  findIndex: function(arr, callback) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.findIndex(callback);
  },
  
  // 数组是否包含
  includes: function(arr, value, fromIndex = 0) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.includes(value, fromIndex);
  },
  
  // 数组是否满足所有条件
  every: function(arr, callback) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.every(callback);
  },
  
  // 数组是否满足任一条件
  some: function(arr, callback) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.some(callback);
  },
  
  // 数组填充
  fill: function(arr, value, start = 0, end = arr.length) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return [...arr].fill(value, start, end);
  },
  
  // 数组反转
  reverse: function(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return [...arr].reverse();
  },
  
  // 数组连接
  concat: function(arr, ...arrays) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.concat(...arrays);
  },
  
  // 数组切片
  slice: function(arr, start = 0, end = arr.length) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.slice(start, end);
  },
  
  // 数组求和
  sum: function(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.reduce((sum, val) => sum + val, 0);
  },
  
  // 数组求平均值
  average: function(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('参数必须是非空数组');
    }
    
    return this.sum(arr) / arr.length;
  },
  
  // 数组求最大值
  max: function(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('参数必须是非空数组');
    }
    
    return Math.max(...arr);
  },
  
  // 数组求最小值
  min: function(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('参数必须是非空数组');
    }
    
    return Math.min(...arr);
  },
  
  // 数组求中位数
  median: function(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('参数必须是非空数组');
    }
    
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  },
  
  // 数组求众数
  mode: function(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('参数必须是非空数组');
    }
    
    const counts = {};
    let maxCount = 0;
    let modes = [];
    
    for (const item of arr) {
      counts[item] = (counts[item] || 0) + 1;
      
      if (counts[item] > maxCount) {
        maxCount = counts[item];
        modes = [item];
      } else if (counts[item] === maxCount) {
        modes.push(item);
      }
    }
    
    return modes;
  },
  
  // 数组去除假值
  compact: function(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.filter(Boolean);
  },
  
  // 数组转对象
  toObject: function(arr, keyField, valueField = null) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.reduce((obj, item) => {
      const key = typeof keyField === 'function' ? keyField(item) : item[keyField];
      const value = valueField === null ? item : (typeof valueField === 'function' ? valueField(item) : item[valueField]);
      
      obj[key] = value;
      return obj;
    }, {});
  },
  
  // 数组转Map
  toMap: function(arr, keyField, valueField = null) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return new Map(arr.map(item => {
      const key = typeof keyField === 'function' ? keyField(item) : item[keyField];
      const value = valueField === null ? item : (typeof valueField === 'function' ? valueField(item) : item[valueField]);
      
      return [key, value];
    }));
  },
  
  // 数组转Set
  toSet: function(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return new Set(arr);
  },
  
  // 数组元素计数
  count: function(arr, value) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.filter(item => item === value).length;
  },
  
  // 数组元素出现频率
  frequency: function(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
  },
  
  // 数组是否为空
  isEmpty: function(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.length === 0;
  },
  
  // 数组是否包含重复元素
  hasDuplicates: function(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return new Set(arr).size !== arr.length;
  },
  
  // 获取数组中的重复元素
  getDuplicates: function(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    const seen = new Set();
    const duplicates = new Set();
    
    for (const item of arr) {
      if (seen.has(item)) {
        duplicates.add(item);
      } else {
        seen.add(item);
      }
    }
    
    return [...duplicates];
  },
  
  // 数组交换元素
  swap: function(arr, i, j) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    if (i < 0 || i >= arr.length || j < 0 || j >= arr.length) {
      throw new Error('索引超出范围');
    }
    
    const result = [...arr];
    [result[i], result[j]] = [result[j], result[i]];
    
    return result;
  },
  
  // 数组移动元素
  move: function(arr, from, to) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) {
      throw new Error('索引超出范围');
    }
    
    const result = [...arr];
    const element = result.splice(from, 1)[0];
    result.splice(to, 0, element);
    
    return result;
  },
  
  // 数组旋转
  rotate: function(arr, count = 1) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    if (arr.length <= 1) {
      return [...arr];
    }
    
    const result = [...arr];
    const len = arr.length;
    count = ((count % len) + len) % len; // 处理负数和大于数组长度的情况
    
    return [...result.slice(count), ...result.slice(0, count)];
  },
  
  // 数组分区
  partition: function(arr, predicate) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.reduce(
      (result, item) => {
        result[predicate(item) ? 0 : 1].push(item);
        return result;
      },
      [[], []]
    );
  },
  
  // 数组相等比较
  isEqual: function(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
      throw new Error('参数必须是数组');
    }
    
    if (arr1.length !== arr2.length) {
      return false;
    }
    
    return arr1.every((item, index) => item === arr2[index]);
  },
  
  // 数组深度相等比较
  isDeepEqual: function(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
      throw new Error('参数必须是数组');
    }
    
    if (arr1.length !== arr2.length) {
      return false;
    }
    
    return arr1.every((item, index) => {
      if (Array.isArray(item) && Array.isArray(arr2[index])) {
        return this.isDeepEqual(item, arr2[index]);
      } else if (typeof item === 'object' && item !== null && typeof arr2[index] === 'object' && arr2[index] !== null) {
        return JSON.stringify(item) === JSON.stringify(arr2[index]);
      } else {
        return item === arr2[index];
      }
    });
  },
  
  // 数组序列生成
  range: function(start, end, step = 1) {
    if (arguments.length === 1) {
      end = start;
      start = 0;
    }
    
    if (step === 0) {
      throw new Error('步长不能为0');
    }
    
    const length = Math.max(Math.ceil((end - start) / step), 0);
    const result = Array(length);
    
    for (let i = 0; i < length; i++) {
      result[i] = start + i * step;
    }
    
    return result;
  },
  
  // 数组元素求幂
  power: function(arr, exponent) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.map(item => Math.pow(item, exponent));
  },
  
  // 数组元素求平方根
  sqrt: function(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.map(item => Math.sqrt(item));
  },
  
  // 数组元素求绝对值
  abs: function(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.map(item => Math.abs(item));
  },
  
  // 数组元素四舍五入
  round: function(arr, decimals = 0) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    const factor = Math.pow(10, decimals);
    return arr.map(item => Math.round(item * factor) / factor);
  },
  
  // 数组元素向上取整
  ceil: function(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.map(item => Math.ceil(item));
  },
  
  // 数组元素向下取整
  floor: function(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.map(item => Math.floor(item));
  },
  
  // 数组元素求和
  sumBy: function(arr, key) {
    if (!Array.isArray(arr)) {
      throw new Error('参数必须是数组');
    }
    
    return arr.reduce((sum, item) => {
      const value = typeof key === 'function' ? key(item) : item[key];
      return sum + value;
    }, 0);
  },
  
  // 数组元素求最大值
  maxBy: function(arr, key) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('参数必须是非空数组');
    }
    
    return arr.reduce((max, item) => {
      const value = typeof key === 'function' ? key(item) : item[key];
      return value > max ? value : max;
    }, typeof key === 'function' ? key(arr[0]) : arr[0][key]);
  },
  
  // 数组元素求最小值
  minBy: function(arr, key) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('参数必须是非空数组');
    }
    
    return arr.reduce((min, item) => {
      const value = typeof key === 'function' ? key(item) : item[key];
      return value < min ? value : min;
    }, typeof key === 'function' ? key(arr[0]) : arr[0][key]);
  },
  
  // 数组元素求平均值
  averageBy: function(arr, key) {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('参数必须是非空数组');
    }
    
    return this.sumBy(arr, key) / arr.length;
  }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.DuobaoArray;
}