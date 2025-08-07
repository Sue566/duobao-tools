/**
 * 随机选择器 - 核心功能模块
 */

// 核心功能模块
const RandomPickerCore = {
  // 随机数生成器
  randomGenerator: Math,
  
  // 设置随机种子
  setSeed: function(seed) {
    if (!seed) {
      this.randomGenerator = Math;
      return;
    }
    
    // 简单的伪随机数生成器
    const seedNumber = RandomPickerUtils.hashString(seed);
    
    this.randomGenerator = {
      random: function() {
        // 线性同余生成器
        let x = seedNumber;
        return function() {
          x = (1664525 * x + 1013904223) % 4294967296;
          return x / 4294967296;
        }();
      }
    };
  },
  
  // 随机选择
  pickRandomItems: function(container) {
    const itemsInput = container.querySelector('#items-input');
    const pickCount = container.querySelector('#pick-count');
    const modeNoRepeat = container.querySelector('#mode-no-repeat');
    const modeAllowRepeat = container.querySelector('#mode-allow-repeat');
    const modeShuffle = container.querySelector('#mode-shuffle');
    const useWeights = container.querySelector('#use-weights');
    const showAnimation = container.querySelector('#show-animation');
    const excludePrevious = container.querySelector('#exclude-previous');
    const pickerResult = container.querySelector('#picker-result');
    const batchCount = container.querySelector('#batch-count');
    
    const input = itemsInput.value.trim();
    if (!input) {
      RandomPickerUtils.showToast('请输入项目列表', 'warning');
      return;
    }
    
    const count = parseInt(pickCount.value);
    if (isNaN(count) || count < 1) {
      RandomPickerUtils.showToast('请输入有效的选择数量', 'warning');
      return;
    }
    
    const items = RandomPickerUtils.parseItems(input);
    if (items.length === 0) {
      RandomPickerUtils.showToast('没有有效的项目', 'warning');
      return;
    }
    
    const allowRepeat = modeAllowRepeat.checked;
    const isShuffle = modeShuffle.checked;
    const withWeights = useWeights.checked;
    const shouldExcludePrevious = excludePrevious.checked;
    
    // 检查选择数量是否超过项目数量（在不重复模式下）
    if (!allowRepeat && count > items.length) {
      RandomPickerUtils.showToast(`选择数量不能超过项目数量 (${items.length})`, 'warning');
      return;
    }
    
    // 获取上次结果
    let previousItems = [];
    if (shouldExcludePrevious) {
      const history = JSON.parse(localStorage.getItem('randomPickerHistory') || '[]');
      if (history.length > 0) {
        previousItems = history[0].items.map(item => item.name);
      }
    }
    
    // 执行选择
    let selectedItems = [];
    
    if (isShuffle) {
      // 洗牌模式
      selectedItems = this.shuffleItems(items, withWeights);
      if (count < selectedItems.length) {
        selectedItems = selectedItems.slice(0, count);
      }
    } else {
      // 普通选择模式
      const availableItems = [...items];
      
      // 如果需要排除上次结果
      if (shouldExcludePrevious && previousItems.length > 0) {
        for (let i = availableItems.length - 1; i >= 0; i--) {
          if (previousItems.includes(availableItems[i].name)) {
            availableItems.splice(i, 1);
          }
        }
        
        if (availableItems.length === 0) {
          RandomPickerUtils.showToast('排除上次结果后没有可选项目', 'warning');
          return;
        }
      }
      
      for (let i = 0; i < count; i++) {
        if (availableItems.length === 0) break;
        
        let selectedIndex;
        
        if (withWeights) {
          // 带权重的选择
          selectedIndex = this.weightedRandomSelect(availableItems, container);
        } else {
          // 等概率选择
          selectedIndex = Math.floor(this.randomGenerator.random() * availableItems.length);
        }
        
        selectedItems.push(availableItems[selectedIndex]);
        
        if (!allowRepeat) {
          availableItems.splice(selectedIndex, 1);
        }
      }
    }
    
    // 批量选择
    const batchSize = parseInt(batchCount.value) || 1;
    if (batchSize > 1) {
      const allResults = [];
      
      // 第一次选择结果已经计算
      allResults.push(selectedItems);
      
      // 计算剩余批次
      for (let b = 1; b < batchSize; b++) {
        if (isShuffle) {
          const shuffled = this.shuffleItems(items, withWeights);
          allResults.push(shuffled.slice(0, count));
        } else {
          const batchItems = [];
          const batchAvailable = [...items];
          
          for (let i = 0; i < count; i++) {
            if (batchAvailable.length === 0) break;
            
            let selectedIndex;
            
            if (withWeights) {
              selectedIndex = this.weightedRandomSelect(batchAvailable, container);
            } else {
              selectedIndex = Math.floor(this.randomGenerator.random() * batchAvailable.length);
            }
            
            batchItems.push(batchAvailable[selectedIndex]);
            
            if (!allowRepeat) {
              batchAvailable.splice(selectedIndex, 1);
            }
          }
          
          allResults.push(batchItems);
        }
      }
      
      // 显示批量结果
      RandomPickerUI.displayBatchResults(container, allResults, withWeights);
      
      // 添加到历史记录
      RandomPickerHistory.addBatchToHistory(allResults, withWeights);
    } else {
      // 显示单次结果
      RandomPickerUI.displayResults(container, selectedItems, withWeights);
      
      // 添加到历史记录
      RandomPickerHistory.addToHistory(selectedItems, withWeights);
    }
  },
  
  // 带权重的随机选择
  weightedRandomSelect: function(items, container) {
    // 获取分布类型
    const distributionType = container.querySelector('#distribution-type').value;
    
    if (distributionType === 'uniform') {
      // 均匀分布（默认）
      const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
      let random = this.randomGenerator.random() * totalWeight;
      
      let selectedIndex = 0;
      for (let j = 0; j < items.length; j++) {
        random -= items[j].weight;
        if (random <= 0) {
          selectedIndex = j;
          break;
        }
      }
      
      return selectedIndex;
    } else if (distributionType === 'normal') {
      // 正态分布
      const normalMean = parseFloat(container.querySelector('#normal-mean').value) || 0;
      const normalStd = parseFloat(container.querySelector('#normal-std').value) || 1;
      
      // Box-Muller 变换生成正态分布随机数
      const u1 = this.randomGenerator.random();
      const u2 = this.randomGenerator.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const normalRandom = normalMean + z * normalStd;
      
      // 映射到索引范围
      const index = Math.floor(normalRandom * items.length / 6 + items.length / 2);
      return Math.max(0, Math.min(items.length - 1, index));
    } else if (distributionType === 'exponential') {
      // 指数分布
      const exponentialRate = parseFloat(container.querySelector('#exponential-rate').value) || 1;
      
      // 生成指数分布随机数
      const expRandom = -Math.log(this.randomGenerator.random()) / exponentialRate;
      
      // 映射到索引范围
      const index = Math.floor(expRandom * items.length / 5);
      return Math.min(items.length - 1, index);
    } else if (distributionType === 'custom') {
      // 自定义分布
      try {
        const customDistribution = container.querySelector('#custom-distribution').value;
        const customProbs = RandomPickerUtils.parseCustomDistribution(customDistribution);
        if (customProbs.length === 0) {
          return Math.floor(this.randomGenerator.random() * items.length);
        }
        
        // 根据自定义概率选择
        const random = this.randomGenerator.random();
        let cumProb = 0;
        
        for (let i = 0; i < customProbs.length; i++) {
          cumProb += customProbs[i].probability;
          if (random <= cumProb) {
            const index = Math.floor(customProbs[i].value * items.length);
            return Math.min(items.length - 1, Math.max(0, index));
          }
        }
        
        return items.length - 1;
      } catch (e) {
        console.error('解析自定义分布出错:', e);
        return Math.floor(this.randomGenerator.random() * items.length);
      }
    }
    
    // 默认均匀分布
    return Math.floor(this.randomGenerator.random() * items.length);
  },
  
  // 洗牌算法
  shuffleItems: function(items, withWeights) {
    const result = [...items];
    
    // Fisher-Yates 洗牌算法
    for (let i = result.length - 1; i > 0; i--) {
      let j;
      
      if (withWeights) {
        // 带权重的洗牌
        const totalWeight = result.slice(0, i + 1).reduce((sum, item) => sum + item.weight, 0);
        let random = this.randomGenerator.random() * totalWeight;
        
        j = 0;
        for (let k = 0; k <= i; k++) {
          random -= result[k].weight;
          if (random <= 0) {
            j = k;
            break;
          }
        }
      } else {
        // 等概率洗牌
        j = Math.floor(this.randomGenerator.random() * (i + 1));
      }
      
      // 交换元素
      [result[i], result[j]] = [result[j], result[i]];
    }
    
    return result;
  },
  
  // 分组选择
  pickGroupItems: function(container) {
    const groupDefinition = container.querySelector('#group-definition');
    const groupPickMode = container.querySelector('#group-pick-mode');
    const groupCount = container.querySelector('#group-count');
    const itemsPerGroup = container.querySelector('#items-per-group');
    const groupResult = container.querySelector('#group-result');
    
    const input = groupDefinition.value.trim();
    if (!input) {
      RandomPickerUtils.showToast('请输入分组定义', 'warning');
      return;
    }
    
    const groups = RandomPickerUtils.parseGroups(input);
    if (groups.length === 0) {
      RandomPickerUtils.showToast('没有有效的分组', 'warning');
      return;
    }
    
    const mode = groupPickMode.value;
    let results = [];
    
    if (mode === 'one-from-each') {
      // 从每组选择一个
      results = groups.map(group => {
        const randomIndex = Math.floor(this.randomGenerator.random() * group.items.length);
        return {
          group: group.name,
          item: group.items[randomIndex]
        };
      });
    } else if (mode === 'one-group') {
      // 随机选择一个组
      const randomGroupIndex = Math.floor(this.randomGenerator.random() * groups.length);
      const selectedGroup = groups[randomGroupIndex];
      
      results = selectedGroup.items.map(item => {
        return {
          group: selectedGroup.name,
          item: item
        };
      });
    } else if (mode === 'custom') {
      // 自定义选择
      const groupCountValue = parseInt(groupCount.value);
      const itemsPerGroupValue = parseInt(itemsPerGroup.value);
      
      if (isNaN(groupCountValue) || groupCountValue < 1) {
        RandomPickerUtils.showToast('请输入有效的组数', 'warning');
        return;
      }
      
      if (isNaN(itemsPerGroupValue) || itemsPerGroupValue < 1) {
        RandomPickerUtils.showToast('请输入有效的每组选择数量', 'warning');
        return;
      }
      
      // 随机选择组
      const selectedGroupIndices = [];
      const availableGroups = [...Array(groups.length).keys()];
      
      for (let i = 0; i < Math.min(groupCountValue, groups.length); i++) {
        const randomIndex = Math.floor(this.randomGenerator.random() * availableGroups.length);
        selectedGroupIndices.push(availableGroups[randomIndex]);
        availableGroups.splice(randomIndex, 1);
      }
      
      // 从每个选中的组中选择项目
      for (const groupIndex of selectedGroupIndices) {
        const group = groups[groupIndex];
        const availableItems = [...group.items];
        
        for (let i = 0; i < Math.min(itemsPerGroupValue, availableItems.length); i++) {
          const randomItemIndex = Math.floor(this.randomGenerator.random() * availableItems.length);
          results.push({
            group: group.name,
            item: availableItems[randomItemIndex]
          });
          availableItems.splice(randomItemIndex, 1);
        }
      }
    }
    
    // 显示分组结果
    RandomPickerUI.displayGroupResults(container, results);
    
    // 添加到历史记录
    RandomPickerHistory.addGroupToHistory(results);
  }
};

// 导出模块
window.RandomPickerCore = RandomPickerCore;