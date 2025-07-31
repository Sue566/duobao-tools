/**
 * 多宝工具箱 - 菜单配置
 */

// 定义工具菜单
window.menu = [
  {
    title: '文本处理',
    children: [
      { title: '文本替换工具', tool: 'textReplacer' },
      { title: '文本差异对比', tool: 'textDiff' },
      { title: 'Markdown编辑器', tool: 'markdownEditor' },
      { title: '文本长度统计', tool: 'textLength' },
      { title: '大小写转换', tool: 'caseConverter' }
    ]
  },
  {
    title: '编码转换',
    children: [
      { title: 'URL编解码', tool: 'urlEncoder' },
      { title: 'Base64编解码', tool: 'base64' },
      { title: 'HTML实体转换', tool: 'htmlEntityConverter' },
      { title: '进制转换', tool: 'baseConverter' },
      { title: '人民币大写转换', tool: 'rmbUppercase' }
    ]
  },
  {
    title: '图片工具',
    children: [
      { title: '图片压缩', tool: 'imageCompressor' },
      { title: '图片格式转换', tool: 'imageConverter' },
      { title: '图片裁剪', tool: 'imageCropper' }
    ]
  },
  {
    title: '开发工具',
    children: [
      { title: 'JSON格式化', tool: 'jsonFormatter' },
      { title: 'JSON验证', tool: 'jsonValidator' },
      { title: '正则表达式测试', tool: 'regexTester' },
      { title: 'CSS压缩', tool: 'cssMinifier' },
      { title: 'JS压缩', tool: 'jsMinifier' },
      { title: 'UUID生成器', tool: 'uuidGenerator' }
    ]
  },
  {
    title: '日期时间',
    children: [
      { title: '时间戳转换', tool: 'timestamp' },
      { title: '日期计算器', tool: 'dateCalculator' },
      { title: '日历', tool: 'calendar' }
    ]
  },
  {
    title: '数字计算',
    children: [
      { title: '计算器', tool: 'calculator' },
      { title: '单位换算', tool: 'unitConverter' },
      { title: '随机数生成', tool: 'randomPicker' }
    ]
  },
  {
    title: '加密解密',
    children: [
      { title: 'MD5加密', tool: 'md5' },
      { title: 'SHA1加密', tool: 'sha1' },
      { title: 'SHA256加密', tool: 'sha256' },
      { title: 'AES加解密', tool: 'aesEncryption' },
      { title: '哈希计算器', tool: 'hashCalculator' },
      { title: '密码生成器', tool: 'passwordGenerator' }
    ]
  },
  {
    title: '网络工具',
    children: [
      { title: 'IP地址查询', tool: 'ipLookup' },
      { title: 'User-Agent解析', tool: 'userAgent' },
      { title: '端口扫描', tool: 'portScanner' },
      { title: '二维码生成器', tool: 'qrCodeGenerator' }
    ]
  },
  {
    title: '生活工具',
    children: [
      { title: 'BMI计算器', tool: 'bmiCalculator' },
      { title: '贷款计算器', tool: 'loanCalculator' }
    ]
  },
  {
    title: '颜色工具',
    children: [
      { title: '颜色转换', tool: 'colorConverter' },
      { title: '颜色选择器', tool: 'colorPicker' },
      { title: '渐变生成器', tool: 'gradientGenerator' }
    ]
  }
];

// 初始化工具模块
window.tools = {};