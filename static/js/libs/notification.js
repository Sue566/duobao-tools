/**
 * 通知组件模块
 * 提供全局通知消息功能
 * 版本: 1.0.0
 * 最后更新: 2025-08-08
 */

// 通知组件
const DuobaoNotification = {
  // 通知容器
  _container: null,
  
  // 通知计数器
  _count: 0,
  
  // 最大通知数量
  _maxCount: 5,
  
  // 创建通知容器
  _createContainer: function() {
    if (this._container) return this._container;
    
    const container = document.createElement('div');
    container.className = 'duobao-notification-container';
    document.body.appendChild(container);
    
    // 添加样式
    this._addStyles();
    
    this._container = container;
    return container;
  },
  
  // 添加通知样式
  _addStyles: function() {
    if (document.getElementById('duobao-notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'duobao-notification-styles';
    style.innerHTML = `
      .duobao-notification-container {
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 1010;
        width: 384px;
        max-width: calc(100vw - 48px);
        margin-left: 24px;
      }
      
      .duobao-notification {
        position: relative;
        margin-bottom: 16px;
        padding: 16px 24px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        background-color: #fff;
        line-height: 1.5;
        overflow: hidden;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s;
      }
      
      .duobao-notification.show {
        opacity: 1;
        transform: translateX(0);
      }
      
      .duobao-notification-close {
        position: absolute;
        top: 16px;
        right: 22px;
        font-size: 14px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.45);
      }
      
      .duobao-notification-close:hover {
        color: rgba(0, 0, 0, 0.67);
      }
      
      .duobao-notification-content {
        display: flex;
      }
      
      .duobao-notification-icon {
        margin-right: 16px;
        font-size: 24px;
        line-height: 24px;
      }
      
      .duobao-notification-info .duobao-notification-icon {
        color: #1890ff;
      }
      
      .duobao-notification-success .duobao-notification-icon {
        color: #52c41a;
      }
      
      .duobao-notification-warning .duobao-notification-icon {
        color: #faad14;
      }
      
      .duobao-notification-error .duobao-notification-icon {
        color: #f5222d;
      }
      
      .duobao-notification-message {
        flex: 1;
        margin-bottom: 8px;
        color: rgba(0, 0, 0, 0.85);
        font-size: 16px;
        line-height: 24px;
      }
      
      .duobao-notification-description {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
      }
      
      /* 响应式样式 */
      @media (max-width: 576px) {
        .duobao-notification-container {
          width: 100%;
          max-width: calc(100vw - 30px);
          margin: 0;
          top: 16px;
          right: 15px;
          left: 15px;
        }
      }
    `;
    
    document.head.appendChild(style);
  },
  
  // 获取通知图标
  _getIcon: function(type) {
    switch (type) {
      case 'info':
        return '<svg viewBox="0 0 1024 1024" width="1em" height="1em"><path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg>';
      case 'success':
        return '<svg viewBox="0 0 1024 1024" width="1em" height="1em"><path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg>';
      case 'warning':
        return '<svg viewBox="0 0 1024 1024" width="1em" height="1em"><path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg>';
      case 'error':
        return '<svg viewBox="0 0 1024 1024" width="1em" height="1em"><path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg>';
      default:
        return '';
    }
  },
  
  /**
   * 显示通知
   * @param {object} options - 通知选项
   * @param {string} options.type - 通知类型：info, success, warning, error
   * @param {string} options.message - 通知标题
   * @param {string|HTMLElement} options.description - 通知描述
   * @param {number} options.duration - 显示时间（毫秒），设为0则不自动关闭
   * @param {function} options.onClose - 关闭回调函数
   * @param {string} options.className - 自定义类名
   * @param {string} options.placement - 显示位置：topRight, topLeft, bottomRight, bottomLeft
   * @returns {object} 通知对象
   */
  open: function(options) {
    const defaultOptions = {
      type: 'info',
      message: '',
      description: '',
      duration: 4500,
      onClose: null,
      className: '',
      placement: 'topRight'
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // 创建容器
    const container = this._createContainer();
    
    // 检查通知数量是否超过最大值
    if (this._count >= this._maxCount) {
      // 移除最早的通知
      if (container.firstChild) {
        container.removeChild(container.firstChild);
        this._count--;
      }
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `duobao-notification duobao-notification-${mergedOptions.type} ${mergedOptions.className}`;
    notification.id = `duobao-notification-${Date.now()}`;
    
    // 关闭按钮
    const closeBtn = document.createElement('span');
    closeBtn.className = 'duobao-notification-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => this.close(notification.id, mergedOptions.onClose);
    
    // 内容区域
    const content = document.createElement('div');
    content.className = 'duobao-notification-content';
    
    // 图标
    const icon = document.createElement('span');
    icon.className = 'duobao-notification-icon';
    icon.innerHTML = this._getIcon(mergedOptions.type);
    
    // 消息区域
    const messageContainer = document.createElement('div');
    
    // 标题
    const message = document.createElement('div');
    message.className = 'duobao-notification-message';
    message.textContent = mergedOptions.message;
    
    // 描述
    const description = document.createElement('div');
    description.className = 'duobao-notification-description';
    
    if (typeof mergedOptions.description === 'string') {
      description.textContent = mergedOptions.description;
    } else if (mergedOptions.description instanceof HTMLElement) {
      description.appendChild(mergedOptions.description);
    }
    
    // 组装
    messageContainer.appendChild(message);
    messageContainer.appendChild(description);
    
    content.appendChild(icon);
    content.appendChild(messageContainer);
    
    notification.appendChild(closeBtn);
    notification.appendChild(content);
    
    container.appendChild(notification);
    this._count++;
    
    // 显示动画
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // 自动关闭
    if (mergedOptions.duration > 0) {
      setTimeout(() => {
        this.close(notification.id, mergedOptions.onClose);
      }, mergedOptions.duration);
    }
    
    return {
      id: notification.id,
      close: () => this.close(notification.id, mergedOptions.onClose)
    };
  },
  
  /**
   * 关闭通知
   * @param {string} id - 通知ID
   * @param {function} callback - 关闭回调函数
   */
  close: function(id, callback) {
    const notification = document.getElementById(id);
    
    if (notification) {
      notification.classList.remove('show');
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
          this._count--;
          
          // 如果容器为空，移除容器
          if (this._count === 0 && this._container) {
            document.body.removeChild(this._container);
            this._container = null;
          }
          
          // 执行回调
          if (typeof callback === 'function') {
            callback();
          }
        }
      }, 300);
    }
  },
  
  /**
   * 关闭所有通知
   */
  closeAll: function() {
    if (!this._container) return;
    
    const notifications = this._container.querySelectorAll('.duobao-notification');
    
    notifications.forEach(notification => {
      notification.classList.remove('show');
    });
    
    setTimeout(() => {
      if (this._container && this._container.parentNode) {
        document.body.removeChild(this._container);
        this._container = null;
        this._count = 0;
      }
    }, 300);
  },
  
  /**
   * 显示信息通知
   * @param {string} message - 通知标题
   * @param {string|HTMLElement} description - 通知描述
   * @param {object} options - 其他选项
   * @returns {object} 通知对象
   */
  info: function(message, description, options = {}) {
    return this.open({
      type: 'info',
      message,
      description,
      ...options
    });
  },
  
  /**
   * 显示成功通知
   * @param {string} message - 通知标题
   * @param {string|HTMLElement} description - 通知描述
   * @param {object} options - 其他选项
   * @returns {object} 通知对象
   */
  success: function(message, description, options = {}) {
    return this.open({
      type: 'success',
      message,
      description,
      ...options
    });
  },
  
  /**
   * 显示警告通知
   * @param {string} message - 通知标题
   * @param {string|HTMLElement} description - 通知描述
   * @param {object} options - 其他选项
   * @returns {object} 通知对象
   */
  warning: function(message, description, options = {}) {
    return this.open({
      type: 'warning',
      message,
      description,
      ...options
    });
  },
  
  /**
   * 显示错误通知
   * @param {string} message - 通知标题
   * @param {string|HTMLElement} description - 通知描述
   * @param {object} options - 其他选项
   * @returns {object} 通知对象
   */
  error: function(message, description, options = {}) {
    return this.open({
      type: 'error',
      message,
      description,
      ...options
    });
  }
};

// 导出模块
export { DuobaoNotification };