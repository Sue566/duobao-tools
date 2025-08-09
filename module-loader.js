/**
 * 模块加载器 - 用于在浏览器环境中模拟 CommonJS 模块系统
 */

(function() {
  // 模块缓存
  const moduleCache = {};
  
  // 模块解析器
  window.require = function(path) {
    // 如果是相对路径，需要解析
    if (path.startsWith('./')) {
      // 获取当前脚本的路径
      const scripts = document.getElementsByTagName('script');
      const currentScript = scripts[scripts.length - 1];
      const currentPath = currentScript.src.substring(0, currentScript.src.lastIndexOf('/'));
      
      // 解析相对路径
      path = currentPath + path.substring(1);
    }
    
    // 检查模块是否已加载
    if (moduleCache[path]) {
      return moduleCache[path].exports;
    }
    
    // 创建新模块
    const module = {
      exports: {},
      id: path,
      loaded: false
    };
    
    // 缓存模块
    moduleCache[path] = module;
    
    // 加载模块
    try {
      // 创建 XMLHttpRequest 对象
      const xhr = new XMLHttpRequest();
      xhr.open('GET', path, false); // 同步请求
      xhr.send();
      
      if (xhr.status === 200) {
        // 执行模块代码
        const moduleCode = xhr.responseText;
        const moduleFunc = new Function('module', 'exports', 'require', moduleCode);
        moduleFunc(module, module.exports, window.require);
      } else {
        console.error(`无法加载模块: ${path}, 状态码: ${xhr.status}`);
      }
    } catch (e) {
      console.error(`加载模块 ${path} 时出错:`, e);
    }
    
    // 标记模块为已加载
    module.loaded = true;
    
    // 返回模块导出
    return module.exports;
  };
  
  // 定义模块
  window.define = function(id, deps, factory) {
    // CommonJS 风格
    if (typeof id === 'function') {
      factory = id;
      deps = [];
      id = null;
    }
    
    // AMD 风格
    if (typeof id === 'string' && Array.isArray(deps) && typeof factory === 'function') {
      const module = {
        exports: {},
        id: id,
        loaded: false
      };
      
      // 解析依赖
      const resolvedDeps = deps.map(dep => {
        if (dep === 'require') return window.require;
        if (dep === 'exports') return module.exports;
        if (dep === 'module') return module;
        return window.require(dep);
      });
      
      // 执行工厂函数
      const result = factory.apply(null, resolvedDeps);
      
      // 如果工厂函数返回值，则使用返回值作为导出
      if (result !== undefined) {
        module.exports = result;
      }
      
      // 缓存模块
      moduleCache[id] = module;
      module.loaded = true;
    }
  };
  
  // 兼容 Node.js 的 module.exports
  window.module = {
    exports: {}
  };
  
  console.log('模块加载器已初始化');
})();