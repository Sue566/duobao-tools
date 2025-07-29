window.menu = [
  {
    title: '文本处理',
    children: [
      { title: '大小写转换', tool: 'caseConverter' },
      { title: '文本长度统计', tool: 'textLength' },
      { title: 'URL 编码/解码', tool: 'urlEncoder' },
      { title: 'Base64 编码/解码', tool: 'base64' },
      { title: 'JSON 格式化', tool: 'jsonFormatter' }
    ]
  },
  {
    title: '数值转换',
    children: [
      { title: '进制转换', tool: 'baseConverter' }
    ]
  },
  {
    title: '日期时间',
    children: [
      { title: '时间戳转换', tool: 'timestamp' }
    ]
  },
  {
    title: '颜色工具',
    children: [
      { title: '颜色转换', tool: 'colorConverter' }
    ]
  }
];
