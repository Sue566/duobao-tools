/**
 * 随机选择器 - 数据管理模块
 */
(function() {
  // 数据管理模块
  window.randomPicker.data = {
    // 保存列表
    saveList: function(list) {
      if (!list.trim()) {
        window.randomPicker.utils.showToast('列表为空，无法保存', 'warning');
        return;
      }
      
      // 获取已保存的列表
      const savedLists = this.getSavedLists();
      
      // 创建保存对话框
      const dialog = document.createElement('div');
      dialog.className = 'save-dialog';
      dialog.innerHTML = `
        <div class="save-dialog-content">
          <h3>保存列表</h3>
          <div class="form-group">
            <label for="list-name">列表名称：</label>
            <input type="text" id="list-name" class="form-control" placeholder="输入列表名称">
          </div>
          <div class="dialog-actions">
            <button id="save-confirm" class="btn btn-primary">保存</button>
            <button id="save-cancel" class="btn btn-secondary">取消</button>
          </div>
        </div>
      `;
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .save-dialog {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .save-dialog-content {
          background-color: white;
          padding: 20px;
          border-radius: 4px;
          width: 300px;
        }
        
        .dialog-actions {
          margin-top: 15px;
          display: flex;
          justify-content: flex-end;
        }
      `;
      
      document.body.appendChild(style);
      document.body.appendChild(dialog);
      
      // 获取元素
      const nameInput = dialog.querySelector('#list-name');
      const saveButton = dialog.querySelector('#save-confirm');
      const cancelButton = dialog.querySelector('#save-cancel');
      
      // 聚焦输入框
      nameInput.focus();
      
      // 绑定事件
      saveButton.addEventListener('click', () => {
        const name = nameInput.value.trim();
        
        if (!name) {
          window.randomPicker.utils.showToast('请输入列表名称', 'warning');
          return;
        }
        
        // 保存列表
        savedLists[name] = list;
        localStorage.setItem('randomPickerSavedLists', JSON.stringify(savedLists));
        
        // 关闭对话框
        document.body.removeChild(dialog);
        document.body.removeChild(style);
        
        window.randomPicker.utils.showToast(`列表 "${name}" 已保存`, 'success');
      });
      
      cancelButton.addEventListener('click', () => {
        document.body.removeChild(dialog);
        document.body.removeChild(style);
      });
      
      // 按下回车键保存
      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          saveButton.click();
        }
      });
    },
    
    // 加载列表
    loadList: function(callback) {
      const savedLists = this.getSavedLists();
      const listNames = Object.keys(savedLists);
      
      if (listNames.length === 0) {
        window.randomPicker.utils.showToast('没有保存的列表', 'warning');
        return;
      }
      
      // 创建加载对话框
      const dialog = document.createElement('div');
      dialog.className = 'load-dialog';
      
      let listOptionsHTML = '';
      listNames.forEach(name => {
        listOptionsHTML += `<div class="list-option" data-name="${name}">
          <div class="list-name">${name}</div>
          <div class="list-actions">
            <button class="btn btn-sm btn-danger delete-list" data-name="${name}">删除</button>
          </div>
        </div>`;
      });
      
      dialog.innerHTML = `
        <div class="load-dialog-content">
          <h3>加载列表</h3>
          <div class="list-options">
            ${listOptionsHTML}
          </div>
          <div class="dialog-actions">
            <button id="load-cancel" class="btn btn-secondary">取消</button>
          </div>
        </div>
      `;
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .load-dialog {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .load-dialog-content {
          background-color: white;
          padding: 20px;
          border-radius: 4px;
          width: 400px;
          max-height: 80vh;
          overflow-y: auto;
        }
        
        .list-options {
          margin: 15px 0;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .list-option {
          padding: 10px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .list-option:hover {
          background-color: #f5f5f5;
        }
        
        .list-name {
          flex: 1;
        }
        
        .dialog-actions {
          margin-top: 15px;
          display: flex;
          justify-content: flex-end;
        }
      `;
      
      document.body.appendChild(style);
      document.body.appendChild(dialog);
      
      // 获取元素
      const cancelButton = dialog.querySelector('#load-cancel');
      const listOptions = dialog.querySelectorAll('.list-option');
      const deleteButtons = dialog.querySelectorAll('.delete-list');
      
      // 绑定事件
      cancelButton.addEventListener('click', () => {
        document.body.removeChild(dialog);
        document.body.removeChild(style);
      });
      
      // 点击列表选项加载列表
      listOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          // 如果点击的是删除按钮，不执行加载操作
          if (e.target.classList.contains('delete-list') || e.target.closest('.delete-list')) {
            return;
          }
          
          const name = option.dataset.name;
          const list = savedLists[name];
          
          // 关闭对话框
          document.body.removeChild(dialog);
          document.body.removeChild(style);
          
          // 回调函数
          if (callback && typeof callback === 'function') {
            callback(list);
          }
          
          window.randomPicker.utils.showToast(`列表 "${name}" 已加载`, 'success');
        });
      });
      
      // 删除列表
      deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          
          const name = button.dataset.name;
          
          if (confirm(`确定要删除列表 "${name}" 吗？`)) {
            delete savedLists[name];
            localStorage.setItem('randomPickerSavedLists', JSON.stringify(savedLists));
            
            // 移除列表选项
            const option = button.closest('.list-option');
            option.parentNode.removeChild(option);
            
            // 如果没有列表了，关闭对话框
            if (Object.keys(savedLists).length === 0) {
              document.body.removeChild(dialog);
              document.body.removeChild(style);
              window.randomPicker.utils.showToast('没有保存的列表', 'warning');
            } else {
              window.randomPicker.utils.showToast(`列表 "${name}" 已删除`, 'success');
            }
          }
        });
      });
    },
    
    // 获取保存的列表
    getSavedLists: function() {
      const savedLists = localStorage.getItem('randomPickerSavedLists');
      return savedLists ? JSON.parse(savedLists) : {};
    }
  };
})();