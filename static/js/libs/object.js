/**
 * 多宝工具库 - 对象操作工具
 */

window.DuobaoObject = {
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
      Object.keys(obj).forEach(key => {
        copy[key] = this.deepClone(obj[key]);
      });
      return copy;
    }
    
    throw new Error('无法复制对象，不支持的类型');
  },
  
  // 浅拷贝对象
  shallowClone: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
      return [...obj];
    }
    
    if (obj instanceof Object) {
      return { ...obj };
    }
    
    throw new Error('无法复制对象，不支持的类型');
  },
  
  // 合并对象
  merge: function(target, ...sources) {
    if (target === null || typeof target !== 'object') {
      throw new Error('目标对象必须是一个对象');
    }
    
    return Object.assign(target, ...sources);
  },
  
  // 深度合并对象
  deepMerge: function(target, ...sources) {
    if (target === null || typeof target !== 'object') {
      throw new Error('目标对象必须是一个对象');
    }
    
    if (!sources.length) return target;
    
    const source = sources.shift();
    
    if (source === undefined) {
      return this.deepMerge(target, ...sources);
    }
    
    if (typeof source !== 'object' || source === null) {
      return this.deepMerge(target, ...sources);
    }
    
    if (Array.isArray(source)) {
      if (!Array.isArray(target)) {
        target = [];
      }
      
      target = [...target, ...source.map(item => 
        typeof item === 'object' && item !== null ? this.deepClone(item) : item
      )];
      
      return this.deepMerge(target, ...sources);
    }
    
    Object.keys(source).forEach(key => {
      if (typeof source[key] === 'object' && source[key] !== null) {
        if (!target[key] || typeof target[key] !== 'object') {
          target[key] = Array.isArray(source[key]) ? [] : {};
        }
        target[key] = this.deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });
    
    return this.deepMerge(target, ...sources);
  },
  
  // 获取对象的所有键
  keys: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.keys(obj);
  },
  
  // 获取对象的所有值
  values: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.values(obj);
  },
  
  // 获取对象的所有键值对
  entries: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.entries(obj);
  },
  
  // 从对象中选择指定的键
  pick: function(obj, keys) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    if (!Array.isArray(keys)) {
      keys = [keys];
    }
    
    return keys.reduce((result, key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
      return result;
    }, {});
  },
  
  // 从对象中排除指定的键
  omit: function(obj, keys) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    if (!Array.isArray(keys)) {
      keys = [keys];
    }
    
    return Object.keys(obj).reduce((result, key) => {
      if (!keys.includes(key)) {
        result[key] = obj[key];
      }
      return result;
    }, {});
  },
  
  // 检查对象是否为空
  isEmpty: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.keys(obj).length === 0;
  },
  
  // 检查对象是否包含指定的键
  has: function(obj, key) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.prototype.hasOwnProperty.call(obj, key);
  },
  
  // 获取对象的大小（键的数量）
  size: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.keys(obj).length;
  },
  
  // 对象映射
  map: function(obj, callback) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.keys(obj).reduce((result, key) => {
      result[key] = callback(obj[key], key, obj);
      return result;
    }, {});
  },
  
  // 对象过滤
  filter: function(obj, callback) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.keys(obj).reduce((result, key) => {
      if (callback(obj[key], key, obj)) {
        result[key] = obj[key];
      }
      return result;
    }, {});
  },
  
  // 对象归约
  reduce: function(obj, callback, initialValue) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.keys(obj).reduce(
      (acc, key) => callback(acc, obj[key], key, obj),
      initialValue
    );
  },
  
  // 对象键转换
  mapKeys: function(obj, callback) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.keys(obj).reduce((result, key) => {
      const newKey = callback(key, obj[key], obj);
      result[newKey] = obj[key];
      return result;
    }, {});
  },
  
  // 对象值转换
  mapValues: function(obj, callback) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.keys(obj).reduce((result, key) => {
      result[key] = callback(obj[key], key, obj);
      return result;
    }, {});
  },
  
  // 对象键值互换
  invert: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.keys(obj).reduce((result, key) => {
      result[obj[key]] = key;
      return result;
    }, {});
  },
  
  // 创建具有相同值的对象
  defaults: function(obj, ...sources) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.assign({}, ...sources.reverse(), obj);
  },
  
  // 对象转数组
  toArray: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.values(obj);
  },
  
  // 对象转Map
  toMap: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return new Map(Object.entries(obj));
  },
  
  // 对象转查询字符串
  toQueryString: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.keys(obj)
      .map(key => {
        const value = obj[key];
        if (value === null || value === undefined) {
          return encodeURIComponent(key);
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');
  },
  
  // 查询字符串转对象
  fromQueryString: function(queryString) {
    if (typeof queryString !== 'string') {
      throw new Error('参数必须是一个字符串');
    }
    
    if (queryString.startsWith('?')) {
      queryString = queryString.substring(1);
    }
    
    if (!queryString) {
      return {};
    }
    
    return queryString.split('&').reduce((result, part) => {
      const [key, value] = part.split('=').map(decodeURIComponent);
      result[key] = value !== undefined ? value : true;
      return result;
    }, {});
  },
  
  // 对象扁平化
  flatten: function(obj, prefix = '', delimiter = '.') {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.keys(obj).reduce((result, key) => {
      const prefixedKey = prefix ? `${prefix}${delimiter}${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(result, this.flatten(obj[key], prefixedKey, delimiter));
      } else {
        result[prefixedKey] = obj[key];
      }
      
      return result;
    }, {});
  },
  
  // 对象展开（扁平化的逆操作）
  unflatten: function(obj, delimiter = '.') {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    const result = {};
    
    Object.keys(obj).forEach(key => {
      const parts = key.split(delimiter);
      let current = result;
      
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        
        if (!current[part]) {
          current[part] = {};
        }
        
        current = current[part];
      }
      
      current[parts[parts.length - 1]] = obj[key];
    });
    
    return result;
  },
  
  // 对象路径获取值
  get: function(obj, path, defaultValue = undefined) {
    if (obj === null || typeof obj !== 'object') {
      return defaultValue;
    }
    
    const keys = Array.isArray(path) ? path : path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || typeof result !== 'object' || !(key in result)) {
        return defaultValue;
      }
      
      result = result[key];
    }
    
    return result === undefined ? defaultValue : result;
  },
  
  // 对象路径设置值
  set: function(obj, path, value) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    const keys = Array.isArray(path) ? path : path.split('.');
    const lastKey = keys.pop();
    let current = obj;
    
    for (const key of keys) {
      if (!(key in current) || current[key] === null || typeof current[key] !== 'object') {
        current[key] = {};
      }
      
      current = current[key];
    }
    
    current[lastKey] = value;
    return obj;
  },
  
  // 对象路径删除值
  unset: function(obj, path) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    const keys = Array.isArray(path) ? path : path.split('.');
    const lastKey = keys.pop();
    let current = obj;
    
    for (const key of keys) {
      if (!(key in current) || current[key] === null || typeof current[key] !== 'object') {
        return false;
      }
      
      current = current[key];
    }
    
    if (!(lastKey in current)) {
      return false;
    }
    
    delete current[lastKey];
    return true;
  },
  
  // 对象路径是否存在
  has: function(obj, path) {
    if (obj === null || typeof obj !== 'object') {
      return false;
    }
    
    const keys = Array.isArray(path) ? path : path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (!(key in current) || current[key] === null || typeof current[key] !== 'object') {
        return false;
      }
      
      current = current[key];
    }
    
    return true;
  },
  
  // 对象相等比较
  isEqual: function(obj1, obj2) {
    // 处理基本类型或引用相同的情况
    if (obj1 === obj2) {
      return true;
    }
    
    // 处理null或非对象类型
    if (obj1 === null || obj2 === null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      return false;
    }
    
    // 处理数组
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) {
        return false;
      }
      
      return obj1.every((item, index) => this.isEqual(item, obj2[index]));
    }
    
    // 处理日期对象
    if (obj1 instanceof Date && obj2 instanceof Date) {
      return obj1.getTime() === obj2.getTime();
    }
    
    // 处理普通对象
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) {
      return false;
    }
    
    return keys1.every(key => {
      return keys2.includes(key) && this.isEqual(obj1[key], obj2[key]);
    });
  },
  
  // 对象差异比较
  diff: function(obj1, obj2) {
    if (obj1 === null || typeof obj1 !== 'object' || obj2 === null || typeof obj2 !== 'object') {
      throw new Error('参数必须是对象');
    }
    
    const result = {};
    
    // 检查obj1中存在但在obj2中不同的键
    Object.keys(obj1).forEach(key => {
      if (!(key in obj2)) {
        result[key] = { type: 'removed', value: obj1[key] };
      } else if (!this.isEqual(obj1[key], obj2[key])) {
        if (typeof obj1[key] === 'object' && obj1[key] !== null && 
            typeof obj2[key] === 'object' && obj2[key] !== null) {
          result[key] = { type: 'changed', diff: this.diff(obj1[key], obj2[key]) };
        } else {
          result[key] = { type: 'changed', oldValue: obj1[key], newValue: obj2[key] };
        }
      }
    });
    
    // 检查obj2中存在但在obj1中不存在的键
    Object.keys(obj2).forEach(key => {
      if (!(key in obj1)) {
        result[key] = { type: 'added', value: obj2[key] };
      }
    });
    
    return result;
  },
  
  // 对象冻结（浅冻结）
  freeze: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.freeze(obj);
  },
  
  // 对象深度冻结
  deepFreeze: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.deepFreeze(obj[key]);
      }
    });
    
    return Object.freeze(obj);
  },
  
  // 对象密封（浅密封）
  seal: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    return Object.seal(obj);
  },
  
  // 对象深度密封
  deepSeal: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.deepSeal(obj[key]);
      }
    });
    
    return Object.seal(obj);
  },
  
  // 对象转字符串
  toString: function(obj) {
    if (obj === null || typeof obj !== 'object') {
      return String(obj);
    }
    
    return JSON.stringify(obj);
  },
  
  // 字符串转对象
  fromString: function(str) {
    if (typeof str !== 'string') {
      throw new Error('参数必须是一个字符串');
    }
    
    try {
      return JSON.parse(str);
    } catch (e) {
      throw new Error('无效的JSON字符串');
    }
  },
  
  // 对象克隆并转换
  transform: function(obj, transformers) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    if (!transformers || typeof transformers !== 'object') {
      throw new Error('转换器必须是一个对象');
    }
    
    const result = this.deepClone(obj);
    
    Object.keys(transformers).forEach(key => {
      if (key in result) {
        result[key] = transformers[key](result[key], key, result);
      }
    });
    
    return result;
  },
  
  // 对象属性重命名
  renameKeys: function(obj, keysMap) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    if (!keysMap || typeof keysMap !== 'object') {
      throw new Error('键映射必须是一个对象');
    }
    
    return Object.keys(obj).reduce((result, key) => {
      const newKey = key in keysMap ? keysMap[key] : key;
      result[newKey] = obj[key];
      return result;
    }, {});
  },
  
  // 对象属性类型转换
  convertTypes: function(obj, typesMap) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    if (!typesMap || typeof typesMap !== 'object') {
      throw new Error('类型映射必须是一个对象');
    }
    
    return Object.keys(obj).reduce((result, key) => {
      if (key in typesMap && typeof typesMap[key] === 'function') {
        result[key] = typesMap[key](obj[key]);
      } else {
        result[key] = obj[key];
      }
      return result;
    }, {});
  },
  
  // 对象属性验证
  validate: function(obj, schema) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    if (!schema || typeof schema !== 'object') {
      throw new Error('模式必须是一个对象');
    }
    
    const errors = {};
    
    Object.keys(schema).forEach(key => {
      const validator = schema[key];
      
      if (typeof validator === 'function') {
        try {
          const isValid = validator(obj[key], key, obj);
          
          if (isValid !== true) {
            errors[key] = isValid || '无效值';
          }
        } catch (e) {
          errors[key] = e.message;
        }
      }
    });
    
    return Object.keys(errors).length > 0 ? errors : null;
  },
  
  // 对象属性默认值
  setDefaults: function(obj, defaults) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    if (!defaults || typeof defaults !== 'object') {
      throw new Error('默认值必须是一个对象');
    }
    
    const result = { ...obj };
    
    Object.keys(defaults).forEach(key => {
      if (!(key in result) || result[key] === undefined || result[key] === null) {
        result[key] = defaults[key];
      }
    });
    
    return result;
  },
  
  // 对象属性过滤（移除空值）
  compact: function(obj, options = {}) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    const { removeNull = true, removeUndefined = true, removeEmptyString = false, removeEmptyArray = false, removeEmptyObject = false } = options;
    
    return Object.keys(obj).reduce((result, key) => {
      const value = obj[key];
      
      if (
        (value === null && removeNull) ||
        (value === undefined && removeUndefined) ||
        (value === '' && removeEmptyString) ||
        (Array.isArray(value) && value.length === 0 && removeEmptyArray) ||
        (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0 && removeEmptyObject)
      ) {
        return result;
      }
      
      result[key] = value;
      return result;
    }, {});
  },
  
  // 对象属性排序
  sort: function(obj, compareFn) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    const keys = Object.keys(obj);
    
    if (typeof compareFn === 'function') {
      keys.sort((a, b) => compareFn(a, b, obj[a], obj[b]));
    } else {
      keys.sort();
    }
    
    return keys.reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
  },
  
  // 对象属性分组
  groupBy: function(obj, groupFn) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    if (typeof groupFn !== 'function') {
      throw new Error('分组函数必须是一个函数');
    }
    
    return Object.keys(obj).reduce((result, key) => {
      const value = obj[key];
      const group = groupFn(value, key, obj);
      
      if (!result[group]) {
        result[group] = {};
      }
      
      result[group][key] = value;
      return result;
    }, {});
  },
  
  // 对象属性计数
  countBy: function(obj, countFn) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    if (typeof countFn !== 'function') {
      throw new Error('计数函数必须是一个函数');
    }
    
    return Object.keys(obj).reduce((result, key) => {
      const value = obj[key];
      const countKey = countFn(value, key, obj);
      
      result[countKey] = (result[countKey] || 0) + 1;
      return result;
    }, {});
  },
  
  // 对象属性求和
  sumBy: function(obj, sumFn) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    if (typeof sumFn !== 'function') {
      throw new Error('求和函数必须是一个函数');
    }
    
    return Object.keys(obj).reduce((sum, key) => {
      return sum + sumFn(obj[key], key, obj);
    }, 0);
  },
  
  // 对象属性最大值
  maxBy: function(obj, maxFn) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    if (typeof maxFn !== 'function') {
      throw new Error('最大值函数必须是一个函数');
    }
    
    const keys = Object.keys(obj);
    
    if (keys.length === 0) {
      return undefined;
    }
    
    let maxKey = keys[0];
    let maxValue = maxFn(obj[maxKey], maxKey, obj);
    
    for (let i = 1; i < keys.length; i++) {
      const key = keys[i];
      const value = maxFn(obj[key], key, obj);
      
      if (value > maxValue) {
        maxKey = key;
        maxValue = value;
      }
    }
    
    return obj[maxKey];
  },
  
  // 对象属性最小值
  minBy: function(obj, minFn) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    if (typeof minFn !== 'function') {
      throw new Error('最小值函数必须是一个函数');
    }
    
    const keys = Object.keys(obj);
    
    if (keys.length === 0) {
      return undefined;
    }
    
    let minKey = keys[0];
    let minValue = minFn(obj[minKey], minKey, obj);
    
    for (let i = 1; i < keys.length; i++) {
      const key = keys[i];
      const value = minFn(obj[key], key, obj);
      
      if (value < minValue) {
        minKey = key;
        minValue = value;
      }
    }
    
    return obj[minKey];
  },
  
  // 对象属性平均值
  averageBy: function(obj, avgFn) {
    if (obj === null || typeof obj !== 'object') {
      throw new Error('参数必须是一个对象');
    }
    
    if (typeof avgFn !== 'function') {
      throw new Error('平均值函数必须是一个函数');
    }
    
    const keys = Object.keys(obj);
    
    if (keys.length === 0) {
      return 0;
    }
    
    const sum = keys.reduce((acc, key) => {
      return acc + avgFn(obj[key], key, obj);
    }, 0);
    
    return sum / keys.length;
  }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.DuobaoObject;
}