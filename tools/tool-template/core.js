/**
 * 工具模板 - 核心功能模块
 */
(function() {
  // 定义核心功能模块
  window.toolTemplateCore = {
    /**
     * 处理输入
     */
    processInput: function() {
      const elements = window.toolTemplateUI.elements;
      const input = elements.inputField.value.trim();
      
      if (!input) {
        window.toolTemplateUtils.showToast('请输入内容', 'warning');
        return;
      }
      
      // 显示加载状态
      elements.resultContainer.innerHTML = '<div class="loading"><i class="fa fa-spinner fa-spin"></i><p>正在处理，请稍候...</p></div>';
      elements.resultStats.style.display = 'none';
      
      // 记录开始时间
      const startTime = performance.now();
      
      // 获取设置
      const settings = window.toolTemplateConfig.loadSettings();
      
      // 模拟异步处理
      setTimeout(() => {
        try {
          // 在这里实现工具的核心功能
          let result = this.processData(input, {
            number: parseInt(elements.numberInput.value),
            selectedOption: elements.selectInput.value,
            useOption1: elements.option1.checked,
            useOption2: elements.option2.checked,
            useOption3: elements.option3.checked,
            sliderVal: parseInt(elements.sliderInput.value),
            advancedMode: settings.advancedMode
          });
          
          // 计算处理时间
          const endTime = performance.now();
          const processingTime = Math.round(endTime - startTime);
          
          // 显示结果
          window.toolTemplateUI.displayResult(result, settings.resultFormat);
          
          // 显示统计信息
          elements.resultStats.style.display = 'flex';
          elements.processTime.textContent = `${processingTime} ms`;
          elements.resultSize.textContent = `${new Blob([result]).size} 字节`;
          
          // 自动保存结果
          if (settings.autoSave) {
            this.saveResultToLocalStorage(result);
          }
          
          // 保存当前设置
          window.toolTemplateUI.saveCurrentState();
          
          // 显示成功提示
          window.toolTemplateUtils.showToast('处理完成', 'success');
        } catch (error) {
          console.error('处理错误:', error);
          
          // 显示错误
          elements.resultContainer.innerHTML = `
            <div class="error-result">
              <i class="fa fa-exclamation-triangle"></i>
              <p>处理出错: ${error.message}</p>
              <small>如果问题持续存在，请刷新页面或联系支持团队</small>
            </div>
          `;
          
          // 显示错误提示
          window.toolTemplateUtils.showToast('处理失败: ' + error.message, 'error');
        }
      }, 500); // 模拟处理延迟
    },
    
    /**
     * 处理数据
     * @param {string} input - 输入文本
     * @param {Object} options - 处理选项
     * @returns {string} 处理结果
     */
    processData: function(input, options) {
      let result = input;
      
      // 根据选项处理输入
      if (options.useOption1) {
        result = result.toUpperCase();
      }
      
      if (options.useOption2) {
        result = result.split('').reverse().join('');
      }
      
      if (options.useOption3) {
        result = result.repeat(2);
      }
      
      // 根据选择框选项处理
      if (options.selectedOption === 'option1') {
        result = `选项一处理: ${result}`;
      } else if (options.selectedOption === 'option2') {
        result = `选项二处理: ${result}`;
      } else if (options.selectedOption === 'option3') {
        result = `选项三处理: ${result}`;
      }
      
      // 高级模式处理
      if (options.advancedMode) {
        // 在这里添加高级处理逻辑
        result = `【多宝工具箱高级处理】\n${result}`;
      }
      
      return result;
    },
    
    /**
     * 保存结果到本地存储
     * @param {string} result - 处理结果
     */
    saveResultToLocalStorage: function(result) {
      try {
        localStorage.setItem(`lastResult_${window.toolTemplateConfig.toolId}`, result);
        localStorage.setItem(`lastResultTime_${window.toolTemplateConfig.toolId}`, new Date().toISOString());
      } catch (e) {
        console.error('保存结果失败', e);
        window.toolTemplateUtils.showToast('结果太大，无法自动保存', 'warning');
      }
    }
  };
})();