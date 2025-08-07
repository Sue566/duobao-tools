/**
 * 正则表达式测试工具 - 样式模块
 */

/**
 * 添加样式到容器
 * @param {HTMLElement} container - 容器元素
 */
export function addStyles(container) {
  const style = document.createElement('style');
  style.textContent = `
    .regex-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .regex-input-section {
      flex: 1;
      min-width: 300px;
    }
    
    .regex-result-section {
      flex: 1;
      min-width: 300px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .regex-input-wrapper {
      display: flex;
      align-items: center;
    }
    
    .regex-delimiter {
      font-size: 18px;
      padding: 0 5px;
      color: var(--text-muted);
    }
    
    .regex-flags {
      width: 80px;
      margin-left: 5px;
    }
    
    .regex-options {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .form-check {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .regex-actions {
      display: flex;
      gap: 10px;
    }
    
    .regex-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px
    }
    
    .regex-actions-small {
      display: flex;
      gap: 5px;
    }
    
    .regex-tabs {
      display: flex;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 15px;
    }
    
    .regex-tab {
      padding: 8px 15px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      border-bottom: 2px solid transparent;
    }
    
    .regex-tab.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
    
    .regex-tab-content {
      display: none;
    }
    
    .regex-tab-content.active {
      display: block;
    }
    
    .regex-stats {
      margin-left: auto;
      padding: 8px 15px;
      color: var(--text-muted);
    }
    
    .regex-result-content, .regex-matches-content {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }
    
    .regex-result {
      display: flex;
      font-family: monospace;
      font-size: 14px;
      line-height: 1.5;
      overflow-x: auto;
      min-height: 200px;
      max-height: 300px;
      overflow-y: auto;
    }
    
    .line-numbers {
      padding: 10px 8px;
      background-color: var(--bg-color);
      border-right: 1px solid var(--border-color);
      text-align: right;
      color: var(--text-muted);
      user-select: none;
    }
    
    .line-number {
      padding: 0 5px;
    }
    
    .text-content {
      padding: 10px;
      flex-grow: 1;
      white-space: pre-wrap;
      word-break: break-all;
    }
    
    .match {
      background-color: rgba(255, 213, 0, 0.3);
      border-radius: 2px;
      padding: 1px 0;
    }
    
    .regex-error {
      color: #e74c3c;
      padding: 10px;
    }
    
    .regex-matches {
      padding: 10px;
      max-height: 300px;
      overflow-y: auto;
    }
    
    .match-item {
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid var(--border-color);
    }
    
    .match-item:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    
    .match-header {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 8px;
    }
    
    .match-number {
      background-color: var(--primary-color);
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
    }
    
    .match-text {
      font-family: monospace;
      background-color: rgba(255, 213, 0, 0.3);
      padding: 2px 4px;
      border-radius: 2px;
      word-break: break-all;
    }
    
    .match-index {
      color: var(--text-muted);
      font-size: 12px;
    }
    
    .match-groups {
      margin-top: 8px;
      padding-left: 20px;
    }
    
    .match-groups-header {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 5px;
    }
    
    .match-group {
      display: flex;
      margin-bottom: 5px;
    }
    
    .match-group-number {
      width: 30px;
      color: var(--text-muted);
    }
    
    .match-group-text {
      font-family: monospace;
      word-break: break-all;
    }
    
    .no-matches {
      color: var(--text-muted);
      text-align: center;
      padding: 20px;
    }
    
    .regex-cheatsheet {
      margin-top: 30px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }
    
    .cheatsheet-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background-color: var(--card-bg);
      cursor: pointer;
    }
    
    .cheatsheet-header h3 {
      margin: 0;
      font-size: 16px;
    }
    
    .cheatsheet-content {
      padding: 15px;
      background-color: var(--bg-color);
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .cheatsheet-section {
      flex: 1;
      min-width: 250px;
    }
    
    .cheatsheet-section h4 {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 14px;
    }
    
    .cheatsheet-section table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    
    .cheatsheet-section td {
      padding: 4px 0;
      vertical-align: top;
    }
    
    .cheatsheet-section td:first-child {
      width: 80px;
    }
    
    .cheatsheet-section code {
      background-color: var(--card-bg);
      padding: 2px 4px;
      border-radius: 3px;
      font-family: monospace;
    }
    
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
    }
    
    .modal-content {
      position: relative;
      background-color: var(--bg-color);
      margin: 10% auto;
      padding: 0;
      width: 80%;
      max-width: 600px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    .modal-header {
      padding: 15px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-header h3 {
      margin: 0;
    }
    
    .close-modal {
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
    }
    
    .modal-body {
      padding: 15px;
      max-height: 400px;
      overflow-y: auto;
    }
    
    .modal-footer {
      padding: 15px;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    
    .saved-regex-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .saved-regex-item {
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px;
    }
    
    .saved-regex-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .saved-regex-name {
      font-weight: bold;
    }
    
    .saved-regex-actions {
      display: flex;
      gap: 5px;
    }
    
    .saved-regex-pattern {
      font-family: monospace;
      background-color: var(--card-bg);
      padding: 5px;
      border-radius: 4px;
      margin-bottom: 8px;
      word-break: break-all;
    }
    
    .saved-regex-description {
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .saved-regex-meta {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--text-muted);
    }
    
    .no-saved-regex {
      text-align: center;
      padding: 20px;
      color: var(--text-muted);
    }
    
    .templates-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .template-category h4 {
      margin-top: 0;
      margin-bottom: 10px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 5px;
    }
    
    .template-items {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 10px;
    }
    
    .template-item {
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 10px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .template-item:hover {
      background-color: var(--card-bg);
    }
    
    .template-name {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .template-desc {
      font-size: 12px;
      color: var(--text-muted);
    }
    
    .textarea-with-stats {
      position: relative;
    }
    
    .text-stats {
      position: absolute;
      bottom: 5px;
      right: 10px;
      font-size: 12px;
      color: var(--text-muted);
      display: flex;
      gap: 10px;
    }
    
    .regex-result-actions {
      margin-top: 10px;
      display: flex;
      justify-content: flex-end;
    }
    
    @media (max-width: 768px) {
      .regex-container {
        flex-direction: column;
      }
      
      .regex-actions {
        flex-wrap: wrap;
      }
      
      .regex-actions button {
        flex: 1;
      }
    }
  `;
  container.appendChild(style);
}