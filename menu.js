/**
 * 多宝工具箱 - 菜单配置
 */

// 定义工具菜单
window.menu = [
  {
    title: '文本处理',
    icon: 'fas fa-font',
    count: 8,
    children: [
      { title: '文本替换工具', tool: 'textReplacer' },
      { title: '文本差异对比', tool: 'textDiff' },
      { title: 'Markdown编辑器', tool: 'markdownEditor' },
      { title: '文本长度统计', tool: 'textLength' },
      { title: '大小写转换', tool: 'caseConverter' },
      { title: '汉字转拼音', tool: 'chineseToPinyin' },
      { title: '中文繁简转换', tool: 'chineseConverter' },
      { title: '文本翻译', tool: 'textTranslator' }
    ]
  },
  {
    title: '编码转换',
    icon: 'fas fa-exchange-alt',
    count: 4,
    children: [
      { title: 'URL编解码', tool: 'urlEncoder' },
      { title: 'Base64编解码', tool: 'base64' },
      { title: '进制转换', tool: 'baseConverter' },
      { title: '人民币大写转换', tool: 'rmbUppercase' }
    ]
  },
  {
    title: '图片工具',
    icon: 'fas fa-image',
    count: 3,
    children: [
      { title: '图片压缩', tool: 'imageCompressor' },
      { title: '图片对称反转', tool: 'imageFlip' },
      { title: '二维码扫描', tool: 'qrCodeScanner' }
    ]
  },
  {
    title: '开发工具',
    icon: 'fas fa-code',
    count: 3,
    children: [
      { title: 'JSON格式化', tool: 'jsonFormatter' },
      { title: '正则表达式测试', tool: 'regexTester' },
      { title: 'UUID生成器', tool: 'uuidGenerator' }
    ]
  },
  {
    title: '日期时间',
    icon: 'fas fa-calendar-alt',
    count: 1,
    children: [
      { title: '时间戳转换', tool: 'timestamp' }
    ]
  },
  {
    title: '数字计算',
    icon: 'fas fa-calculator',
    count: 2,
    children: [
      { title: '单位换算', tool: 'unitConverter' },
      { title: '随机数生成', tool: 'randomPicker' }
    ]
  },
  {
    title: '加密解密',
    icon: 'fas fa-lock',
    count: 2,
    children: [
      { title: '哈希计算器', tool: 'hashCalculator' },
      { title: '密码生成器', tool: 'passwordGenerator' }
    ]
  },
  {
    title: '网络工具',
    icon: 'fas fa-globe',
    count: 2,
    children: [
      { title: 'IP地址查询', tool: 'ipLookup' },
      { title: '二维码生成器', tool: 'qrCodeGenerator' }
    ]
  },
  {
    title: '生活工具',
    icon: 'fas fa-heart',
    count: 2,
    children: [
      { title: 'BMI计算器', tool: 'bmiCalculator' },
      { title: '贷款计算器', tool: 'loanCalculator' }
    ]
  },
  {
    title: '颜色工具',
    icon: 'fas fa-palette',
    count: 2,
    children: [
      { title: '颜色转换', tool: 'colorConverter' },
      { title: '颜色选择器', tool: 'colorPicker' }
    ]
  },
  {
    title: '测试工具',
    icon: 'fas fa-vial',
    count: 2,
    children: [
      { title: '简单工具示例', tool: 'simple-tool' },
      { title: '工具模板', tool: 'tool-template' }
    ]
  }
];

// 初始化工具模块
window.tools = {};