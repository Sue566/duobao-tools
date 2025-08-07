/**
 * 贷款计算器 - 图表模块
 */

// 图表功能
const LoanCharts = {
  /**
   * 显示还款构成图表
   * @param {Array} schedule - 还款计划数组
   * @param {HTMLCanvasElement} canvas - Canvas元素
   * @returns {Chart} 图表实例
   */
  displayPaymentChart: function(schedule, canvas) {
    // 准备图表数据
    const labels = schedule.map(item => item.period);
    const principalData = schedule.map(item => item.principal);
    const interestData = schedule.map(item => item.interest);
    const remainingData = schedule.map(item => item.remainingPrincipal);
    
    // 创建图表
    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: '本金',
            data: principalData,
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: '利息',
            data: interestData,
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: '剩余本金',
            data: remainingData,
            type: 'line',
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: '期数'
            }
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: '金额 (元)'
            }
          },
          y1: {
            position: 'right',
            grid: {
              drawOnChartArea: false
            },
            title: {
              display: true,
              text: '剩余本金 (元)'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + LoanUtils.formatCurrency(context.raw);
              }
            }
          }
        }
      }
    });
  },
  
  /**
   * 显示本金余额图表
   * @param {Array} schedule - 还款计划数组
   * @param {HTMLCanvasElement} canvas - Canvas元素
   * @returns {Chart} 图表实例
   */
  displayBalanceChart: function(schedule, canvas) {
    // 准备图表数据
    const labels = schedule.map(item => item.period);
    const remainingData = schedule.map(item => item.remainingPrincipal);
    const paidData = schedule.map((item, index, array) => {
      if (index === 0) {
        return array[0].principal;
      } else {
        return array[0].remainingPrincipal - item.remainingPrincipal;
      }
    });
    
    // 创建图表
    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '已还本金',
            data: paidData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            fill: true
          },
          {
            label: '剩余本金',
            data: remainingData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: '期数'
            }
          },
          y: {
            title: {
              display: true,
              text: '金额 (元)'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + LoanUtils.formatCurrency(context.raw);
              }
            }
          }
        }
      }
    });
  },
  
  /**
   * 显示本息比例图表
   * @param {Array} schedule - 还款计划数组
   * @param {HTMLCanvasElement} canvas - Canvas元素
   * @returns {Chart} 图表实例
   */
  displayRatioChart: function(schedule, canvas) {
    // 计算总本金和总利息
    const totalPrincipal = schedule.reduce((sum, item) => sum + item.principal, 0);
    const totalInterest = schedule.reduce((sum, item) => sum + item.interest, 0);
    
    // 创建图表
    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['本金', '利息'],
        datasets: [{
          data: [totalPrincipal, totalInterest],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = LoanUtils.formatCurrency(context.raw);
                const percentage = (context.raw / (totalPrincipal + totalInterest) * 100).toFixed(2) + '%';
                return `${label}: ${value} (${percentage})`;
              }
            }
          }
        }
      }
    });
  },
  
  /**
   * 显示组合贷款图表
   * @param {Array} schedule - 组合贷款还款计划数组
   * @param {HTMLCanvasElement} canvas - Canvas元素
   * @returns {Chart} 图表实例
   */
  displayCombinedChart: function(schedule, canvas) {
    // 准备图表数据
    const labels = schedule.map(item => item.period);
    const cPaymentData = schedule.map(item => item.cPayment || 0);
    const hPaymentData = schedule.map(item => item.hPayment || 0);
    const remainingData = schedule.map(item => item.remainingPrincipal);
    
    // 创建图表
    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: '商业贷款月供',
            data: cPaymentData,
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: '公积金贷款月供',
            data: hPaymentData,
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: '剩余本金',
            data: remainingData,
            type: 'line',
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: '期数'
            }
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: '金额 (元)'
            }
          },
          y1: {
            position: 'right',
            grid: {
              drawOnChartArea: false
            },
            title: {
              display: true,
              text: '剩余本金 (元)'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + LoanUtils.formatCurrency(context.raw);
              }
            }
          }
        }
      }
    });
  },
  
  /**
   * 显示提前还款对比图表
   * @param {object} result - 提前还款计算结果
   * @param {HTMLCanvasElement} canvas - Canvas元素
   * @returns {Chart} 图表实例
   */
  displayPrepaymentChart: function(result, canvas) {
    // 准备图表数据
    const originalData = [];
    const newData = [];
    const labels = [];
    
    // 已还期数
    const paidCount = result.paidSchedule.length;
    
    // 设置标签和数据
    for (let i = 1; i <= Math.max(result.originalSchedule.length, paidCount + result.newSchedule.length); i++) {
      labels.push(i);
      
      // 原始计划数据
      if (i <= result.originalSchedule.length) {
        originalData.push(result.originalSchedule[i - 1].payment);
      } else {
        originalData.push(null);
      }
      
      // 提前还款后的计划数据
      if (i <= paidCount) {
        // 已还款部分
        newData.push(result.originalSchedule[i - 1].payment);
      } else if (i === paidCount + 1) {
        // 提前还款
        newData.push(result.prepaymentAmount);
      } else if (i <= paidCount + result.newSchedule.length + 1) {
        // 新还款计划
        newData.push(result.newSchedule[i - paidCount - 2]?.payment || null);
      } else {
        newData.push(null);
      }
    }
    
    // 创建图表
    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '原还款计划',
            data: originalData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
            fill: false
          },
          {
            label: '提前还款后计划',
            data: newData,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: '期数'
            }
          },
          y: {
            title: {
              display: true,
              text: '金额 (元)'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + LoanUtils.formatCurrency(context.raw || 0);
              }
            }
          }
        }
      }
    });
  },
  
  /**
   * 显示贷款方案比较图表
   * @param {Array} results - 比较结果数组
   * @param {HTMLCanvasElement} canvas - Canvas元素
   * @returns {Chart} 图表实例
   */
  displayCompareChart: function(results, canvas) {
    // 准备图表数据
    const labels = results.map(item => item.name);
    const monthlyPaymentData = results.map(item => item.monthlyPayment);
    const totalInterestData = results.map(item => item.totalInterest);
    const totalPaymentData = results.map(item => item.totalPayment);
    
    // 创建图表
    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: '月供',
            data: monthlyPaymentData,
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: '总利息',
            data: totalInterestData,
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            yAxisID: 'y1'
          },
          {
            label: '总还款额',
            data: totalPaymentData,
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: '贷款方案'
            }
          },
          y: {
            position: 'left',
            title: {
              display: true,
              text: '月供 (元)'
            }
          },
          y1: {
            position: 'right',
            grid: {
              drawOnChartArea: false
            },
            title: {
              display: true,
              text: '总金额 (元)'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + LoanUtils.formatCurrency(context.raw);
              }
            }
          }
        }
      }
    });
  }
};

// 导出模块
window.LoanCharts = LoanCharts;
