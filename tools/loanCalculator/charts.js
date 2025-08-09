/**
 * 贷款计算器 - 图表模块
 */
(function() {
  // 定义图表模块
  const LoanCharts = {
    // 显示还款曲线图
    displayPaymentChart: function(schedule, container) {
      // 准备数据
      const labels = schedule.map(payment => payment.month);
      const principalData = schedule.map(payment => payment.principal);
      const interestData = schedule.map(payment => payment.interest);
      
      // 创建图表
      const ctx = container.getContext('2d');
      const chart = new Chart(ctx, {
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
              },
              ticks: {
                maxTicksLimit: 20
              }
            },
            y: {
              stacked: true,
              title: {
                display: true,
                text: '金额 (元)'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: '月供构成'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y || 0;
                  return label + ': ' + LoanUtils.formatCurrency(value);
                }
              }
            }
          }
        }
      });
      
      return chart;
    },
    
    // 显示余额曲线图
    displayBalanceChart: function(schedule, container) {
      // 准备数据
      const labels = schedule.map(payment => payment.month);
      const balanceData = schedule.map(payment => payment.balance);
      
      // 创建图表
      const ctx = container.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: '剩余本金',
              data: balanceData,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              tension: 0.1,
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
              },
              ticks: {
                maxTicksLimit: 20
              }
            },
            y: {
              title: {
                display: true,
                text: '剩余本金 (元)'
              },
              beginAtZero: true
            }
          },
          plugins: {
            title: {
              display: true,
              text: '剩余本金变化曲线'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y || 0;
                  return label + ': ' + LoanUtils.formatCurrency(value);
                }
              }
            }
          }
        }
      });
      
      return chart;
    },
    
    // 显示本息比例图
    displayRatioChart: function(schedule, container) {
      // 计算总本金和总利息
      let totalPrincipal = 0;
      let totalInterest = 0;
      
      schedule.forEach(payment => {
        totalPrincipal += payment.principal;
        totalInterest += payment.interest;
      });
      
      // 创建图表
      const ctx = container.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['本金', '利息'],
          datasets: [
            {
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
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: '本金与利息比例'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return label + ': ' + LoanUtils.formatCurrency(value) + ' (' + percentage + '%)';
                }
              }
            }
          }
        }
      });
      
      return chart;
    },
    
    // 显示组合贷款比较图
    displayCombinedComparisonChart: function(commercialResult, housingResult, container) {
      // 准备数据
      const labels = ['总还款额', '总利息'];
      const commercialData = [commercialResult.totalPayment, commercialResult.totalInterest];
      const housingData = [housingResult.totalPayment, housingResult.totalInterest];
      
      // 创建图表
      const ctx = container.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: '商业贷款',
              data: commercialData,
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            },
            {
              label: '公积金贷款',
              data: housingData,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: '金额 (元)'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: '组合贷款比较'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y || 0;
                  return label + ': ' + LoanUtils.formatCurrency(value);
                }
              }
            }
          }
        }
      });
      
      return chart;
    },
    
    // 显示提前还款比较图
    displayPrepaymentComparisonChart: function(originalSchedule, newSchedule, alreadyPaid, prepaymentAmount, container) {
      // 准备数据
      const originalMonthlyPayments = originalSchedule.map(payment => payment.payment);
      const newMonthlyPayments = [];
      
      // 添加已还期数的月供
      for (let i = 0; i < alreadyPaid; i++) {
        newMonthlyPayments.push(originalSchedule[i].payment);
      }
      
      // 添加提前还款
      newMonthlyPayments.push(prepaymentAmount);
      
      // 添加新还款计划的月供
      newSchedule.forEach(payment => {
        newMonthlyPayments.push(payment.payment);
      });
      
      // 创建图表
      const ctx = container.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({ length: Math.max(originalMonthlyPayments.length, newMonthlyPayments.length) }, (_, i) => i + 1),
          datasets: [
            {
              label: '原还款计划',
              data: originalMonthlyPayments,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              tension: 0.1
            },
            {
              label: '提前还款后',
              data: newMonthlyPayments,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              tension: 0.1
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
              },
              ticks: {
                maxTicksLimit: 20
              }
            },
            y: {
              title: {
                display: true,
                text: '月供 (元)'
              },
              beginAtZero: true
            }
          },
          plugins: {
            title: {
              display: true,
              text: '提前还款比较'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y || 0;
                  return label + ': ' + LoanUtils.formatCurrency(value);
                }
              }
            }
          }
        }
      });
      
      return chart;
    },
    
    // 显示贷款方案比较图
    displayLoanComparisonChart: function(results, container) {
      // 准备数据
      const labels = results.map(result => `${result.type}-${result.method}`);
      const totalPaymentData = results.map(result => result.totalPayment);
      const totalInterestData = results.map(result => result.totalInterest);
      const principalData = results.map(result => result.amount);
      
      // 创建图表
      const ctx = container.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: '本金',
              data: principalData,
              backgroundColor: 'rgba(75, 192, 192, 0.7)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            {
              label: '利息',
              data: totalInterestData,
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
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
              stacked: true,
              title: {
                display: true,
                text: '金额 (元)'
              },
              beginAtZero: true
            }
          },
          plugins: {
            title: {
              display: true,
              text: '贷款方案比较'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y || 0;
                  return label + ': ' + LoanUtils.formatCurrency(value);
                }
              }
            }
          }
        }
      });
      
      return chart;
    },
    
    // 显示月供比较图
    displayMonthlyPaymentComparisonChart: function(results, container) {
      // 准备数据
      const labels = results.map(result => `${result.type}-${result.method}`);
      const firstPaymentData = results.map(result => result.firstPayment);
      const lastPaymentData = results.map(result => result.lastPayment);
      
      // 创建图表
      const ctx = container.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: '首月月供',
              data: firstPaymentData,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            },
            {
              label: '末月月供',
              data: lastPaymentData,
              backgroundColor: 'rgba(255, 206, 86, 0.7)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1
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
              title: {
                display: true,
                text: '月供 (元)'
              },
              beginAtZero: true
            }
          },
          plugins: {
            title: {
              display: true,
              text: '月供比较'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y || 0;
                  return label + ': ' + LoanUtils.formatCurrency(value);
                }
              }
            }
          }
        }
      });
      
      return chart;
    }
  };
  
  // 导出模块
  window.LoanCharts = LoanCharts;
})();