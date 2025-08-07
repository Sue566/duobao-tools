/**
 * 随机选择器 - 数据模块
 */

// 数据模块
const RandomPickerData = {
  // 示例数据
  examples: {
    // 简单列表示例
    simpleList: `苹果
香蕉
橙子
葡萄
西瓜
芒果
樱桃
蓝莓
草莓
猕猴桃`,

    // 带权重示例
    weightedList: `苹果:5
香蕉:3
橙子:2
葡萄:4
西瓜:1
芒果:2
樱桃:3
蓝莓:2
草莓:4
猕猴桃:1`,

    // JSON格式示例
    jsonList: `[
  {"name": "苹果", "weight": 5},
  {"name": "香蕉", "weight": 3},
  {"name": "橙子", "weight": 2},
  {"name": "葡萄", "weight": 4},
  {"name": "西瓜", "weight": 1}
]`,

    // 分组示例
    groupList: `# 水果
苹果, 香蕉, 橙子, 葡萄, 西瓜

# 蔬菜
胡萝卜, 土豆, 西红柿, 黄瓜, 茄子

# 肉类
牛肉, 猪肉, 鸡肉, 羊肉, 鱼肉`,

    // 分组JSON示例
    groupJsonList: `[
  {
    "name": "水果",
    "items": ["苹果", "香蕉", "橙子", "葡萄", "西瓜"]
  },
  {
    "name": "蔬菜",
    "items": ["胡萝卜", "土豆", "西红柿", "黄瓜", "茄子"]
  },
  {
    "name": "肉类",
    "items": ["牛肉", "猪肉", "鸡肉", "羊肉", "鱼肉"]
  }
]`,

    // 自定义分布示例
    customDistribution: `0:0.1
0.2:0.2
0.4:0.4
0.6:0.2
0.8:0.1`,

    // 名字列表示例
    namesList: `张伟
王芳
李娜
刘洋
陈明
赵静
杨勇
周婷
吴强
郑丽`,

    // 数字列表示例
    numbersList: `1
2
3
4
5
6
7
8
9
10`,

    // 颜色列表示例
    colorsList: `红色
橙色
黄色
绿色
青色
蓝色
紫色
黑色
白色
灰色`
  },
  
  // 默认设置
  defaultSettings: {
    // 基本设置
    showAnimation: true,
    darkMode: false,
    language: 'zh-CN',
    
    // 随机设置
    defaultPickCount: 1,
    defaultMode: 'no-repeat',
    defaultUseWeights: false,
    
    // 高级设置
    maxHistorySize: 50,
    autoSave: true,
    confirmClear: true
  },
  
  // 获取用户设置
  getUserSettings: function() {
    const savedSettings = localStorage.getItem('randomPickerSettings');
    if (savedSettings) {
      try {
        return {...this.defaultSettings, ...JSON.parse(savedSettings)};
      } catch (e) {
        console.error('解析设置出错:', e);
        return this.defaultSettings;
      }
    }
    return this.defaultSettings;
  },
  
  // 保存用户设置
  saveUserSettings: function(settings) {
    localStorage.setItem('randomPickerSettings', JSON.stringify(settings));
  },
  
  // 重置用户设置
  resetUserSettings: function() {
    localStorage.removeItem('randomPickerSettings');
    return this.defaultSettings;
  },
  
  // 加载示例数据
  loadExample: function(exampleKey) {
    return this.examples[exampleKey] || '';
  },
  
  // 获取所有示例数据键
  getExampleKeys: function() {
    return Object.keys(this.examples);
  },
  
  // 获取示例数据描述
  getExampleDescription: function(exampleKey) {
    const descriptions = {
      simpleList: '简单项目列表',
      weightedList: '带权重的项目列表',
      jsonList: 'JSON格式的项目列表',
      groupList: '分组项目列表',
      groupJsonList: 'JSON格式的分组列表',
      customDistribution: '自定义概率分布',
      namesList: '常用名字列表',
      numbersList: '数字列表',
      colorsList: '颜色列表'
    };
    
    return descriptions[exampleKey] || exampleKey;
  }
};

// 导出模块
window.RandomPickerData = RandomPickerData;