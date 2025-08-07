/**
 * 随机选择器 - 主入口文件
 * 增强版：支持分组选择、自定义概率分布、结果可视化和更多选择模式
 */
(function() {
  // 定义工具
  const tool = {
    render: function(container) {
      // 创建工具界面
      container.innerHTML = RandomPickerUI.getHTML();
      
      // 添加收藏按钮
      window.addFavoriteButton('randomPicker', container.querySelector('.tool-header'));
      
      // 初始化UI和事件监听
      RandomPickerUI.init(container);
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = RandomPickerUI.getStyles();
      container.appendChild(style);
    }
  };
  
  // 注册工具
  window.tools.randomPicker = tool;
})();