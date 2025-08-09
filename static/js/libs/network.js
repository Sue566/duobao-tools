/**
 * 多宝工具库 - 网络请求工具
 */

window.DuobaoNetwork = {
  // 基本请求函数
  request: function(url, options = {}) {
    const {
      method = 'GET',
      headers = {},
      data = null,
      responseType = 'json',
      timeout = 30000,
      withCredentials = false,
      onProgress = null,
      beforeSend = null
    } = options;
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // 设置超时
      xhr.timeout = timeout;
      
      // 设置跨域凭证
      xhr.withCredentials = withCredentials;
      
      // 设置响应类型
      xhr.responseType = responseType;
      
      // 监听进度
      if (typeof onProgress === 'function' && method.toUpperCase() !== 'GET') {
        xhr.upload.onprogress = onProgress;
      }
      
      // 监听状态变化
      xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return;
        
        if (xhr.status >= 200 && xhr.status < 300) {
          let response;
          
          try {
            response = responseType === 'json' && typeof xhr.response === 'string'
              ? JSON.parse(xhr.response)
              : xhr.response;
          } catch (e) {
            response = xhr.response || xhr.responseText;
          }
          
          resolve({
            data: response,
            status: xhr.status,
            statusText: xhr.statusText,
            headers: parseHeaders(xhr.getAllResponseHeaders()),
            config: options,
            request: xhr
          });
        } else {
          reject({
            message: `请求失败，状态码：${xhr.status}`,
            status: xhr.status,
            statusText: xhr.statusText,
            headers: parseHeaders(xhr.getAllResponseHeaders()),
            config: options,
            request: xhr
          });
        }
      };
      
      // 监听错误
      xhr.onerror = function() {
        reject({
          message: '网络错误',
          status: 0,
          statusText: '网络错误',
          config: options,
          request: xhr
        });
      };
      
      // 监听超时
      xhr.ontimeout = function() {
        reject({
          message: `请求超时（${timeout}ms）`,
          status: 0,
          statusText: '超时',
          config: options,
          request: xhr
        });
      };
      
      // 处理URL参数
      const fullUrl = appendQueryParams(url, options.params);
      
      // 打开连接
      xhr.open(method, fullUrl, true);
      
      // 设置请求头
      for (const key in headers) {
        if (headers.hasOwnProperty(key)) {
          xhr.setRequestHeader(key, headers[key]);
        }
      }
      
      // 如果没有设置Content-Type，并且有数据，则设置默认Content-Type
      if (data && typeof data === 'object' && !(data instanceof FormData) && !headers['Content-Type']) {
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      }
      
      // 发送前回调
      if (typeof beforeSend === 'function') {
        beforeSend(xhr);
      }
      
      // 发送请求
      let body = data;
      
      if (data && typeof data === 'object' && !(data instanceof FormData)) {
        body = JSON.stringify(data);
      }
      
      xhr.send(body);
    });
    
    // 解析响应头
    function parseHeaders(headerStr) {
      const headers = {};
      
      if (!headerStr) {
        return headers;
      }
      
      const headerPairs = headerStr.trim().split('\r\n');
      
      headerPairs.forEach(headerPair => {
        const index = headerPair.indexOf(': ');
        if (index > 0) {
          const key = headerPair.substring(0, index).trim();
          const val = headerPair.substring(index + 2).trim();
          headers[key.toLowerCase()] = val;
        }
      });
      
      return headers;
    }
    
    // 添加URL参数
    function appendQueryParams(url, params) {
      if (!params) {
        return url;
      }
      
      const queryString = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      
      if (!queryString) {
        return url;
      }
      
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}${queryString}`;
    }
  },
  
  // GET请求
  get: function(url, params = {}, options = {}) {
    return this.request(url, {
      ...options,
      method: 'GET',
      params
    });
  },
  
  // POST请求
  post: function(url, data = {}, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      data
    });
  },
  
  // PUT请求
  put: function(url, data = {}, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      data
    });
  },
  
  // DELETE请求
  delete: function(url, params = {}, options = {}) {
    return this.request(url, {
      ...options,
      method: 'DELETE',
      params
    });
  },
  
  // PATCH请求
  patch: function(url, data = {}, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PATCH',
      data
    });
  },
  
  // HEAD请求
  head: function(url, params = {}, options = {}) {
    return this.request(url, {
      ...options,
      method: 'HEAD',
      params
    });
  },
  
  // OPTIONS请求
  options: function(url, params = {}, options = {}) {
    return this.request(url, {
      ...options,
      method: 'OPTIONS',
      params
    });
  },
  
  // 并发请求
  all: function(requests) {
    return Promise.all(requests);
  },
  
  // 获取第一个完成的请求
  race: function(requests) {
    return Promise.race(requests);
  },
  
  // 创建请求实例
  create: function(defaultOptions = {}) {
    const instance = {
      request: (url, options = {}) => {
        return this.request(url, { ...defaultOptions, ...options });
      },
      get: (url, params = {}, options = {}) => {
        return instance.request(url, { ...options, method: 'GET', params });
      },
      post: (url, data = {}, options = {}) => {
        return instance.request(url, { ...options, method: 'POST', data });
      },
      put: (url, data = {}, options = {}) => {
        return instance.request(url, { ...options, method: 'PUT', data });
      },
      delete: (url, params = {}, options = {}) => {
        return instance.request(url, { ...options, method: 'DELETE', params });
      },
      patch: (url, data = {}, options = {}) => {
        return instance.request(url, { ...options, method: 'PATCH', data });
      },
      head: (url, params = {}, options = {}) => {
        return instance.request(url, { ...options, method: 'HEAD', params });
      },
      options: (url, params = {}, options = {}) => {
        return instance.request(url, { ...options, method: 'OPTIONS', params });
      }
    };
    
    return instance;
  },
  
  // 请求拦截器
  interceptors: {
    request: {
      handlers: [],
      use: function(onFulfilled, onRejected) {
        this.handlers.push({
          fulfilled: onFulfilled,
          rejected: onRejected
        });
        return this.handlers.length - 1;
      },
      eject: function(id) {
        if (this.handlers[id]) {
          this.handlers[id] = null;
        }
      }
    },
    response: {
      handlers: [],
      use: function(onFulfilled, onRejected) {
        this.handlers.push({
          fulfilled: onFulfilled,
          rejected: onRejected
        });
        return this.handlers.length - 1;
      },
      eject: function(id) {
        if (this.handlers[id]) {
          this.handlers[id] = null;
        }
      }
    }
  },
  
  // 取消请求
  CancelToken: {
    source: function() {
      let cancel;
      const token = new Promise((resolve) => {
        cancel = function(message) {
          resolve({ message: message || '请求已取消' });
        };
      });
      
      token.cancel = cancel;
      return { token, cancel };
    }
  },
  
  // 上传文件
  upload: function(url, file, options = {}) {
    const formData = new FormData();
    
    if (file instanceof File) {
      formData.append(options.fieldName || 'file', file, file.name);
    } else if (Array.isArray(file)) {
      file.forEach((f, index) => {
        if (f instanceof File) {
          formData.append(`${options.fieldName || 'file'}${index}`, f, f.name);
        }
      });
    } else if (options.data) {
      formData.append(options.fieldName || 'file', file);
    }
    
    // 添加额外数据
    if (options.data) {
      Object.entries(options.data).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    
    return this.post(url, formData, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': undefined // 让浏览器自动设置Content-Type和boundary
      }
    });
  },
  
  // 下载文件
  download: function(url, filename, options = {}) {
    return this.request(url, {
      ...options,
      method: options.method || 'GET',
      responseType: 'blob'
    }).then(response => {
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      
      // 从Content-Disposition获取文件名
      if (!filename && response.headers['content-disposition']) {
        const disposition = response.headers['content-disposition'];
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        
        if (matches && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      
      // 如果没有文件名，使用当前时间戳
      if (!filename) {
        const contentType = response.headers['content-type'] || '';
        const extension = contentType.split('/')[1] || '';
        filename = `download_${Date.now()}.${extension}`;
      }
      
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
      
      return {
        filename,
        blob,
        size: blob.size,
        type: blob.type
      };
    });
  },
  
  // 获取URL参数
  getUrlParams: function(url) {
    const params = {};
    const urlObj = new URL(url || window.location.href);
    
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return params;
  },
  
  // 构建URL
  buildUrl: function(baseUrl, path, params) {
    let url = baseUrl;
    
    // 确保baseUrl和path之间有一个斜杠
    if (baseUrl && path) {
      url = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      url += path.startsWith('/') ? path.substring(1) : path;
    } else if (path) {
      url = path;
    }
    
    // 添加查询参数
    if (params) {
      const queryString = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    
    return url;
  },
  
  // 解析URL
  parseUrl: function(url) {
    try {
      const urlObj = new URL(url);
      
      return {
        protocol: urlObj.protocol,
        host: urlObj.host,
        hostname: urlObj.hostname,
        port: urlObj.port,
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        origin: urlObj.origin,
        params: this.getUrlParams(url)
      };
    } catch (e) {
      return null;
    }
  },
  
  // 检查URL是否有效
  isValidUrl: function(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  // 检查URL是否为绝对URL
  isAbsoluteUrl: function(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  },
  
  // 检查URL是否为同源
  isSameOrigin: function(url) {
    try {
      const urlObj = new URL(url, window.location.origin);
      return urlObj.origin === window.location.origin;
    } catch (e) {
      return false;
    }
  },
  
  // 获取Cookie
  getCookie: function(name) {
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      
      if (cookie.startsWith(name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    
    return null;
  },
  
  // 设置Cookie
  setCookie: function(name, value, options = {}) {
    const {
      path = '/',
      domain = '',
      expires = '',
      maxAge = '',
      secure = false,
      sameSite = 'Lax'
    } = options;
    
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    if (path) cookie += `;path=${path}`;
    if (domain) cookie += `;domain=${domain}`;
    if (expires) cookie += `;expires=${expires}`;
    if (maxAge) cookie += `;max-age=${maxAge}`;
    if (secure) cookie += ';secure';
    if (sameSite) cookie += `;samesite=${sameSite}`;
    
    document.cookie = cookie;
    
    return cookie;
  },
  
  // 删除Cookie
  deleteCookie: function(name, options = {}) {
    return this.setCookie(name, '', {
      ...options,
      maxAge: -1,
      expires: new Date(0).toUTCString()
    });
  },
  
  // 获取所有Cookie
  getAllCookies: function() {
    const cookies = {};
    const cookieStr = document.cookie;
    
    if (!cookieStr) {
      return cookies;
    }
    
    cookieStr.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    });
    
    return cookies;
  },
  
  // 检测网络状态
  isOnline: function() {
    return navigator.onLine;
  },
  
  // 监听网络状态变化
  onNetworkChange: function(callback) {
    if (typeof callback !== 'function') {
      return;
    }
    
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
    
    return {
      remove: function() {
        window.removeEventListener('online', () => callback(true));
        window.removeEventListener('offline', () => callback(false));
      }
    };
  },
  
  // 获取网络信息
  getNetworkInfo: function() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (!connection) {
      return {
        online: navigator.onLine,
        type: 'unknown',
        effectiveType: 'unknown',
        downlink: 0,
        rtt: 0,
        saveData: false
      };
    }
    
    return {
      online: navigator.onLine,
      type: connection.type || 'unknown',
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
      saveData: connection.saveData || false
    };
  },
  
  // 获取IP地址（通过第三方服务）
  getIpAddress: function() {
    return this.get('https://api.ipify.org?format=json')
      .then(response => response.data.ip)
      .catch(() => null);
  },
  
  // 获取地理位置
  getGeolocation: function(options = {}) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          });
        },
        error => {
          reject(error);
        },
        options
      );
    });
  },
  
  // WebSocket客户端
  WebSocket: {
    create: function(url, protocols) {
      if (!url) {
        throw new Error('WebSocket URL is required');
      }
      
      const ws = new WebSocket(url, protocols);
      const eventHandlers = {};
      
      const instance = {
        // 发送消息
        send: function(data) {
          if (ws.readyState === WebSocket.OPEN) {
            if (typeof data === 'object') {
              ws.send(JSON.stringify(data));
            } else {
              ws.send(data);
            }
            return true;
          }
          return false;
        },
        
        // 关闭连接
        close: function(code, reason) {
          ws.close(code, reason);
        },
        
        // 添加事件监听器
        on: function(event, callback) {
          if (!eventHandlers[event]) {
            eventHandlers[event] = [];
          }
          
          eventHandlers[event].push(callback);
          
          if (event === 'message') {
            ws.addEventListener('message', e => {
              let data = e.data;
              
              try {
                data = JSON.parse(e.data);
              } catch (err) {
                // 不是JSON，保持原样
              }
              
              callback(data, e);
            });
          } else {
            ws.addEventListener(event, callback);
          }
          
          return this;
        },
        
        // 移除事件监听器
        off: function(event, callback) {
          if (!eventHandlers[event]) {
            return this;
          }
          
          if (!callback) {
            eventHandlers[event].forEach(cb => {
              ws.removeEventListener(event, cb);
            });
            eventHandlers[event] = [];
          } else {
            const index = eventHandlers[event].indexOf(callback);
            
            if (index !== -1) {
              ws.removeEventListener(event, callback);
              eventHandlers[event].splice(index, 1);
            }
          }
          
          return this;
        },
        
        // 获取WebSocket实例
        getWebSocket: function() {
          return ws;
        },
        
        // 获取连接状态
        getState: function() {
          const states = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
          return states[ws.readyState];
        },
        
        // 检查连接是否打开
        isOpen: function() {
          return ws.readyState === WebSocket.OPEN;
        },
        
        // 重新连接
        reconnect: function() {
          if (ws.readyState === WebSocket.CLOSED) {
            const newWs = this.create(url, protocols);
            
            // 复制事件处理程序
            Object.keys(eventHandlers).forEach(event => {
              eventHandlers[event].forEach(callback => {
                newWs.on(event, callback);
              });
            });
            
            return newWs;
          }
          
          return this;
        }
      };
      
      return instance;
    }
  },
  
  // 服务器发送事件（SSE）客户端
  EventSource: {
    create: function(url, options = {}) {
      if (!url) {
        throw new Error('EventSource URL is required');
      }
      
      const eventSource = new EventSource(url, options);
      const eventHandlers = {};
      
      const instance = {
        // 添加事件监听器
        on: function(event, callback) {
          if (!eventHandlers[event]) {
            eventHandlers[event] = [];
          }
          
          eventHandlers[event].push(callback);
          
          if (event === 'message') {
            eventSource.addEventListener('message', e => {
              let data = e.data;
              
              try {
                data = JSON.parse(e.data);
              } catch (err) {
                // 不是JSON，保持原样
              }
              
              callback(data, e);
            });
          } else {
            eventSource.addEventListener(event, callback);
          }
          
          return this;
        },
        
        // 移除事件监听器
        off: function(event, callback) {
          if (!eventHandlers[event]) {
            return this;
          }
          
          if (!callback) {
            eventHandlers[event].forEach(cb => {
              eventSource.removeEventListener(event, cb);
            });
            eventHandlers[event] = [];
          } else {
            const index = eventHandlers[event].indexOf(callback);
            
            if (index !== -1) {
              eventSource.removeEventListener(event, callback);
              eventHandlers[event].splice(index, 1);
            }
          }
          
          return this;
        },
        
        // 关闭连接
        close: function() {
          eventSource.close();
        },
        
        // 获取EventSource实例
        getEventSource: function() {
          return eventSource;
        },
        
        // 获取连接状态
        getState: function() {
          const states = ['CONNECTING', 'OPEN', 'CLOSED'];
          return states[eventSource.readyState];
        },
        
        // 检查连接是否打开
        isOpen: function() {
          return eventSource.readyState === EventSource.OPEN;
        }
      };
      
      return instance;
    }
  }
};