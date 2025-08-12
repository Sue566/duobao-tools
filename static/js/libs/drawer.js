/**
 * 抽屉组件模块
 * 提供从屏幕边缘滑出的面板功能
 * 版本: 1.0.0
 * 最后更新: 2025-08-08
 */

// 抽屉组件
const DuobaoDrawer = {
  // 创建抽屉
  create: function(options = {}) {
    const defaultOptions = {
      id: 'duobao-drawer-' + Date.now(),
      title: '抽屉标题',
      content: '',
      width: '300px',
      height: '100%',
      position: 'right', // 'right', 'left', 'top', 'bottom'
      closable: true,
      maskClosable: true,
      showFooter: false,
      okText: '确定',
      cancelText: '取消',
      onOk: null,
      onCancel: null,
      onClose: null,
      className: '',
      zIndex: 1000
    };

    const mergedOptions = { ...defaultOptions, ...options };

    // 创建抽屉容器
    const drawer = document.createElement('div');
    drawer.id = mergedOptions.id;
    drawer.className = `duobao-drawer duobao-drawer-${mergedOptions.position} ${mergedOptions.className}`;
    drawer.style.zIndex = mergedOptions.zIndex;

    // 创建遮罩层
    const mask = document.createElement('div');
    mask.className = 'duobao-drawer-mask';
    drawer.appendChild(mask);

    // 创建抽屉内容容器
    const drawerContent = document.createElement('div');
    drawerContent.className = 'duobao-drawer-content';
    
    // 设置抽屉尺寸
    if (mergedOptions.position === 'left' || mergedOptions.position === 'right') {
      drawerContent.style.width = mergedOptions.width;
      drawerContent.style.height = mergedOptions.height;
    } else {
      drawerContent.style.height = mergedOptions.width; // 对于上下位置，宽度变成高度
      drawerContent.style.width = mergedOptions.height; // 对于上下位置，高度变成宽度
    }

    // 创建抽屉头部
    const header = document.createElement('div');
    header.className = 'duobao-drawer-header';

    const title = document.createElement('div');
    title.className = 'duobao-drawer-title';
    title.textContent = mergedOptions.title;
    header.appendChild(title);

    // 添加关闭按钮
    if (mergedOptions.closable) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'duobao-drawer-close';
      closeBtn.innerHTML = '×';
      closeBtn.onclick = function() {
        this.close(drawer, mergedOptions.onClose);
      }.bind(this);
      header.appendChild(closeBtn);
    }

    drawerContent.appendChild(header);

    // 创建抽屉主体
    const body = document.createElement('div');
    body.className = 'duobao-drawer-body';

    // 设置内容
    if (typeof mergedOptions.content === 'string') {
      body.innerHTML = mergedOptions.content;
    } else if (mergedOptions.content instanceof HTMLElement) {
      body.appendChild(mergedOptions.content);
    }

    drawerContent.appendChild(body);

    // 创建抽屉底部
    if (mergedOptions.showFooter) {
      const footer = document.createElement('div');
      footer.className = 'duobao-drawer-footer';

      // 取消按钮
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'duobao-drawer-btn duobao-drawer-btn-cancel';
      cancelBtn.textContent = mergedOptions.cancelText;
      cancelBtn.onclick = function() {
        if (typeof mergedOptions.onCancel === 'function') {
          mergedOptions.onCancel();
        }
        this.close(drawer, mergedOptions.onClose);
      }.bind(this);

      // 确定按钮
      const okBtn = document.createElement('button');
      okBtn.className = 'duobao-drawer-btn duobao-drawer-btn-primary';
      okBtn.textContent = mergedOptions.okText;
      okBtn.onclick = function() {
        if (typeof mergedOptions.onOk === 'function') {
          mergedOptions.onOk();
        }
        this.close(drawer, mergedOptions.onClose);
      }.bind(this);

      footer.appendChild(cancelBtn);
      footer.appendChild(okBtn);
      drawerContent.appendChild(footer);
    }

    drawer.appendChild(drawerContent);

    // 添加到文档
    document.body.appendChild(drawer);

    // 添加样式
    this.addDrawerStyles();

    // 点击遮罩层关闭抽屉
    if (mergedOptions.maskClosable) {
      mask.onclick = function(e) {
        if (e.target === mask) {
          this.close(drawer, mergedOptions.onClose);
        }
      }.bind(this);
    }

    // 显示抽屉
    setTimeout(() => {
      drawer.classList.add('duobao-drawer-open');
    }, 10);

    // 返回抽屉对象
    return {
      id: mergedOptions.id,
      element: drawer,
      close: () => {
        this.close(drawer, mergedOptions.onClose);
      },
      update: (content) => {
        const bodyElement = drawer.querySelector('.duobao-drawer-body');
        if (typeof content === 'string') {
          bodyElement.innerHTML = content;
        } else if (content instanceof HTMLElement) {
          bodyElement.innerHTML = '';
          bodyElement.appendChild(content);
        }
      }
    };
  },

  // 关闭抽屉
  close: function(drawer, callback) {
    drawer.classList.remove('duobao-drawer-open');
    
    setTimeout(() => {
      if (drawer.parentNode) {
        document.body.removeChild(drawer);
      }
      
      if (typeof callback === 'function') {
        callback();
      }
    }, 300);
  },

  // 添加抽屉样式
  addDrawerStyles: function() {
    if (document.getElementById('duobao-drawer-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'duobao-drawer-styles';
    style.innerHTML = `
      .duobao-drawer {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1000;
        visibility: hidden;
      }
      
      .duobao-drawer-open {
        visibility: visible;
        pointer-events: auto;
      }
      
      .duobao-drawer-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.45);
        opacity: 0;
        transition: opacity 0.3s;
      }
      
      .duobao-drawer-open .duobao-drawer-mask {
        opacity: 1;
      }
      
      .duobao-drawer-content {
        position: absolute;
        background-color: #fff;
        box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        transition: transform 0.3s;
      }
      
      /* 右侧抽屉 */
      .duobao-drawer-right .duobao-drawer-content {
        top: 0;
        right: 0;
        height: 100%;
        transform: translateX(100%);
      }
      
      .duobao-drawer-right.duobao-drawer-open .duobao-drawer-content {
        transform: translateX(0);
      }
      
      /* 左侧抽屉 */
      .duobao-drawer-left .duobao-drawer-content {
        top: 0;
        left: 0;
        height: 100%;
        transform: translateX(-100%);
      }
      
      .duobao-drawer-left.duobao-drawer-open .duobao-drawer-content {
        transform: translateX(0);
      }
      
      /* 顶部抽屉 */
      .duobao-drawer-top .duobao-drawer-content {
        top: 0;
        left: 0;
        width: 100%;
        transform: translateY(-100%);
      }
      
      .duobao-drawer-top.duobao-drawer-open .duobao-drawer-content {
        transform: translateY(0);
      }
      
      /* 底部抽屉 */
      .duobao-drawer-bottom .duobao-drawer-content {
        bottom: 0;
        left: 0;
        width: 100%;
        transform: translateY(100%);
      }
      
      .duobao-drawer-bottom.duobao-drawer-open .duobao-drawer-content {
        transform: translateY(0);
      }
      
      .duobao-drawer-header {
        padding: 16px 24px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .duobao-drawer-title {
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
      }
      
      .duobao-drawer-close {
        padding: 0;
        background: transparent;
        border: none;
        outline: none;
        font-size: 16px;
        line-height: 1;
        color: rgba(0, 0, 0, 0.45);
        cursor: pointer;
        transition: color 0.3s;
      }
      
      .duobao-drawer-close:hover {
        color: rgba(0, 0, 0, 0.75);
      }
      
      .duobao-drawer-body {
        padding: 24px;
        overflow-y: auto;
        flex: 1;
      }
      
      .duobao-drawer-footer {
        padding: 10px 16px;
        border-top: 1px solid #f0f0f0;
        text-align: right;
      }
      
      .duobao-drawer-btn {
        margin-left: 8px;
        padding: 8px 16px;
        font-size: 14px;
        border-radius: 2px;
        border: 1px solid #d9d9d9;
        background-color: #fff;
        cursor: pointer;
        transition: all 0.3s;
        outline: none;
      }
      
      .duobao-drawer-btn-primary {
        background-color: #1890ff;
        border-color: #1890ff;
        color: #fff;
      }
      
      .duobao-drawer-btn-primary:hover {
        background-color: #40a9ff;
        border-color: #40a9ff;
      }
      
      .duobao-drawer-btn-cancel:hover {
        border-color: #40a9ff;
        color: #40a9ff;
      }
    `;
    
    document.head.appendChild(style);
  }
};

// 添加到全局命名空间
window.DuobaoDrawer = DuobaoDrawer;
