/**
 * 多宝工具库 - 数学计算工具
 */

window.DuobaoMath = window.DuobaoMath || {};

// 扩展数学计算工具
Object.assign(window.DuobaoMath, {
  // 基本数学运算
  add: function(a, b) {
    return a + b;
  },
  
  subtract: function(a, b) {
    return a - b;
  },
  
  multiply: function(a, b) {
    return a * b;
  },
  
  divide: function(a, b) {
    if (b === 0) throw new Error('除数不能为零');
    return a / b;
  },
  
  // 处理JavaScript浮点数精度问题
  fixPrecision: function(value, precision = 12) {
    return parseFloat(value.toFixed(precision));
  },
  
  // 加法（修正精度）
  preciseAdd: function(a, b) {
    return this.fixPrecision(a + b);
  },
  
  // 减法（修正精度）
  preciseSubtract: function(a, b) {
    return this.fixPrecision(a - b);
  },
  
  // 乘法（修正精度）
  preciseMultiply: function(a, b) {
    return this.fixPrecision(a * b);
  },
  
  // 除法（修正精度）
  preciseDivide: function(a, b) {
    if (b === 0) throw new Error('除数不能为零');
    return this.fixPrecision(a / b);
  },
  
  // 四舍五入到指定小数位
  round: function(value, decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  },
  
  // 向上取整到指定小数位
  ceil: function(value, decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.ceil(value * factor) / factor;
  },
  
  // 向下取整到指定小数位
  floor: function(value, decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.floor(value * factor) / factor;
  },
  
  // 截断到指定小数位（不进行四舍五入）
  truncate: function(value, decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.trunc(value * factor) / factor;
  },
  
  // 格式化数字（添加千位分隔符）
  formatNumber: function(value, options = {}) {
    const {
      decimals = 2,
      decimalSeparator = '.',
      thousandsSeparator = ',',
      roundingMode = 'round' // 'round', 'ceil', 'floor', 'truncate'
    } = options;
    
    let roundedValue;
    
    switch (roundingMode) {
      case 'ceil':
        roundedValue = this.ceil(value, decimals);
        break;
      case 'floor':
        roundedValue = this.floor(value, decimals);
        break;
      case 'truncate':
        roundedValue = this.truncate(value, decimals);
        break;
      case 'round':
      default:
        roundedValue = this.round(value, decimals);
    }
    
    const parts = roundedValue.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    
    if (decimals > 0) {
      if (parts.length === 1) {
        parts.push('0'.repeat(decimals));
      } else {
        parts[1] = parts[1].padEnd(decimals, '0').slice(0, decimals);
      }
    } else {
      // 如果不需要小数部分，则移除
      return parts[0];
    }
    
    return parts.join(decimalSeparator);
  },
  
  // 解析格式化的数字字符串
  parseFormattedNumber: function(str, options = {}) {
    const {
      decimalSeparator = '.',
      thousandsSeparator = ','
    } = options;
    
    // 移除千位分隔符
    const cleanStr = str.replace(new RegExp('\\' + thousandsSeparator, 'g'), '');
    
    // 替换小数分隔符为标准点号
    const normalizedStr = cleanStr.replace(new RegExp('\\' + decimalSeparator), '.');
    
    return parseFloat(normalizedStr);
  },
  
  // 计算平均值
  average: function(arr) {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  },
  
  // 计算加权平均值
  weightedAverage: function(values, weights) {
    if (!values || !weights || values.length !== weights.length || values.length === 0) {
      return 0;
    }
    
    const sum = values.reduce((acc, val, i) => acc + val * weights[i], 0);
    const weightSum = weights.reduce((acc, val) => acc + val, 0);
    
    return weightSum === 0 ? 0 : sum / weightSum;
  },
  
  // 计算中位数
  median: function(arr) {
    if (!arr || arr.length === 0) return 0;
    
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  },
  
  // 计算众数
  mode: function(arr) {
    if (!arr || arr.length === 0) return null;
    
    const counts = {};
    let maxCount = 0;
    let modes = [];
    
    for (const num of arr) {
      counts[num] = (counts[num] || 0) + 1;
      
      if (counts[num] > maxCount) {
        maxCount = counts[num];
        modes = [num];
      } else if (counts[num] === maxCount) {
        modes.push(num);
      }
    }
    
    return modes.length === Object.keys(counts).length ? null : modes;
  },
  
  // 计算方差
  variance: function(arr) {
    if (!arr || arr.length <= 1) return 0;
    
    const mean = this.average(arr);
    return this.average(arr.map(val => Math.pow(val - mean, 2)));
  },
  
  // 计算标准差
  standardDeviation: function(arr) {
    return Math.sqrt(this.variance(arr));
  },
  
  // 计算百分位数
  percentile: function(arr, p) {
    if (!arr || arr.length === 0) return 0;
    if (p < 0 || p > 100) throw new Error('百分位数必须在0到100之间');
    
    const sorted = [...arr].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const floor = Math.floor(index);
    const ceil = Math.ceil(index);
    
    if (floor === ceil) return sorted[floor];
    
    const d = index - floor;
    return sorted[floor] * (1 - d) + sorted[ceil] * d;
  },
  
  // 计算四分位数
  quartiles: function(arr) {
    return {
      q1: this.percentile(arr, 25),
      q2: this.percentile(arr, 50), // 中位数
      q3: this.percentile(arr, 75)
    };
  },
  
  // 计算极差
  range: function(arr) {
    if (!arr || arr.length === 0) return 0;
    
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    
    return max - min;
  },
  
  // 计算协方差
  covariance: function(arrX, arrY) {
    if (!arrX || !arrY || arrX.length !== arrY.length || arrX.length === 0) {
      return 0;
    }
    
    const meanX = this.average(arrX);
    const meanY = this.average(arrY);
    
    let sum = 0;
    for (let i = 0; i < arrX.length; i++) {
      sum += (arrX[i] - meanX) * (arrY[i] - meanY);
    }
    
    return sum / arrX.length;
  },
  
  // 计算相关系数
  correlation: function(arrX, arrY) {
    if (!arrX || !arrY || arrX.length !== arrY.length || arrX.length === 0) {
      return 0;
    }
    
    const covariance = this.covariance(arrX, arrY);
    const stdDevX = this.standardDeviation(arrX);
    const stdDevY = this.standardDeviation(arrY);
    
    if (stdDevX === 0 || stdDevY === 0) return 0;
    
    return covariance / (stdDevX * stdDevY);
  },
  
  // 线性回归
  linearRegression: function(arrX, arrY) {
    if (!arrX || !arrY || arrX.length !== arrY.length || arrX.length === 0) {
      return { slope: 0, intercept: 0, r2: 0 };
    }
    
    const n = arrX.length;
    const meanX = this.average(arrX);
    const meanY = this.average(arrY);
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (arrX[i] - meanX) * (arrY[i] - meanY);
      denominator += Math.pow(arrX[i] - meanX, 2);
    }
    
    if (denominator === 0) {
      return { slope: 0, intercept: meanY, r2: 0 };
    }
    
    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;
    const r = this.correlation(arrX, arrY);
    
    return {
      slope,
      intercept,
      r2: r * r // 决定系数
    };
  },
  
  // 计算阶乘
  factorial: function(n) {
    if (n < 0) throw new Error('阶乘不能用于负数');
    if (n === 0 || n === 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    
    return result;
  },
  
  // 计算排列数
  permutation: function(n, r) {
    if (n < 0 || r < 0) throw new Error('排列数不能用于负数');
    if (r > n) throw new Error('r不能大于n');
    
    return this.factorial(n) / this.factorial(n - r);
  },
  
  // 计算组合数
  combination: function(n, r) {
    if (n < 0 || r < 0) throw new Error('组合数不能用于负数');
    if (r > n) throw new Error('r不能大于n');
    
    return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
  },
  
  // 计算最大公约数
  gcd: function(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    
    while (b) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    
    return a;
  },
  
  // 计算最小公倍数
  lcm: function(a, b) {
    return Math.abs(a * b) / this.gcd(a, b);
  },
  
  // 判断是否为质数
  isPrime: function(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    
    const limit = Math.sqrt(n);
    for (let i = 5; i <= limit; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    
    return true;
  },
  
  // 生成指定范围内的质数
  generatePrimes: function(start, end) {
    const primes = [];
    
    for (let i = Math.max(2, start); i <= end; i++) {
      if (this.isPrime(i)) {
        primes.push(i);
      }
    }
    
    return primes;
  },
  
  // 计算斐波那契数列
  fibonacci: function(n) {
    if (n <= 0) return [];
    if (n === 1) return [0];
    if (n === 2) return [0, 1];
    
    const fib = [0, 1];
    for (let i = 2; i < n; i++) {
      fib.push(fib[i - 1] + fib[i - 2]);
    }
    
    return fib;
  },
  
  // 计算第n个斐波那契数
  fibonacciNumber: function(n) {
    if (n <= 0) return 0;
    if (n === 1) return 0;
    if (n === 2) return 1;
    
    let a = 0;
    let b = 1;
    let result = 0;
    
    for (let i = 3; i <= n; i++) {
      result = a + b;
      a = b;
      b = result;
    }
    
    return result;
  },
  
  // 角度转弧度
  degToRad: function(degrees) {
    return degrees * (Math.PI / 180);
  },
  
  // 弧度转角度
  radToDeg: function(radians) {
    return radians * (180 / Math.PI);
  },
  
  // 计算两点之间的距离
  distance: function(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },
  
  // 计算三维空间中两点之间的距离
  distance3D: function(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
  },
  
  // 计算三角形面积（已知三边长）
  triangleArea: function(a, b, c) {
    // 使用海伦公式
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  },
  
  // 计算三角形面积（已知底和高）
  triangleAreaByHeight: function(base, height) {
    return (base * height) / 2;
  },
  
  // 计算三角形面积（已知两边和夹角）
  triangleAreaBySAS: function(a, b, angleC) {
    // 角度转弧度
    const angleRad = this.degToRad(angleC);
    return (a * b * Math.sin(angleRad)) / 2;
  },
  
  // 计算矩形面积
  rectangleArea: function(width, height) {
    return width * height;
  },
  
  // 计算圆的面积
  circleArea: function(radius) {
    return Math.PI * radius * radius;
  },
  
  // 计算圆的周长
  circleCircumference: function(radius) {
    return 2 * Math.PI * radius;
  },
  
  // 计算椭圆面积
  ellipseArea: function(a, b) {
    return Math.PI * a * b;
  },
  
  // 计算椭圆周长（近似值）
  ellipseCircumference: function(a, b) {
    // 使用Ramanujan近似公式
    const h = Math.pow((a - b) / (a + b), 2);
    return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
  },
  
  // 计算正多边形面积
  regularPolygonArea: function(n, side) {
    return (n * side * side) / (4 * Math.tan(Math.PI / n));
  },
  
  // 计算正多边形周长
  regularPolygonPerimeter: function(n, side) {
    return n * side;
  },
  
  // 计算球体体积
  sphereVolume: function(radius) {
    return (4 / 3) * Math.PI * Math.pow(radius, 3);
  },
  
  // 计算球体表面积
  sphereSurfaceArea: function(radius) {
    return 4 * Math.PI * radius * radius;
  },
  
  // 计算圆柱体体积
  cylinderVolume: function(radius, height) {
    return Math.PI * radius * radius * height;
  },
  
  // 计算圆柱体表面积
  cylinderSurfaceArea: function(radius, height) {
    return 2 * Math.PI * radius * (radius + height);
  },
  
  // 计算圆锥体体积
  coneVolume: function(radius, height) {
    return (1 / 3) * Math.PI * radius * radius * height;
  },
  
  // 计算圆锥体表面积
  coneSurfaceArea: function(radius, height) {
    const slantHeight = Math.sqrt(radius * radius + height * height);
    return Math.PI * radius * (radius + slantHeight);
  },
  
  // 线性插值
  lerp: function(a, b, t) {
    return a + (b - a) * t;
  },
  
  // 将数值限制在指定范围内
  clamp: function(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },
  
  // 计算百分比
  percentage: function(value, total) {
    return (value / total) * 100;
  },
  
  // 将百分比转换为小数
  percentageToDecimal: function(percentage) {
    return percentage / 100;
  },
  
  // 计算增长率
  growthRate: function(initial, final) {
    return ((final - initial) / initial) * 100;
  },
  
  // 计算复合增长
  compoundGrowth: function(principal, rate, time, compoundingPerYear = 1) {
    const r = rate / 100;
    return principal * Math.pow(1 + r / compoundingPerYear, compoundingPerYear * time);
  },
  
  // 计算连续复合增长
  continuousCompoundGrowth: function(principal, rate, time) {
    const r = rate / 100;
    return principal * Math.exp(r * time);
  },
  
  // 计算等额本息还款
  calculateLoanPayment: function(principal, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const payments = years * 12;
    
    if (monthlyRate === 0) {
      return principal / payments;
    }
    
    const x = Math.pow(1 + monthlyRate, payments);
    return (principal * monthlyRate * x) / (x - 1);
  },
  
  // 计算等额本金还款
  calculateLoanPaymentByPrincipal: function(principal, annualRate, years, paymentIndex) {
    const monthlyRate = annualRate / 100 / 12;
    const payments = years * 12;
    
    const monthlyPrincipal = principal / payments;
    const interest = (principal - monthlyPrincipal * (paymentIndex - 1)) * monthlyRate;
    
    return monthlyPrincipal + interest;
  },
  
  // 计算贷款总利息
  calculateTotalInterest: function(principal, annualRate, years) {
    const monthlyPayment = this.calculateLoanPayment(principal, annualRate, years);
    return monthlyPayment * years * 12 - principal;
  },
  
  // 计算复利
  compoundInterest: function(principal, rate, time, compoundingPerYear = 1) {
    return this.compoundGrowth(principal, rate, time, compoundingPerYear) - principal;
  },
  
  // 计算年金终值
  annuityFutureValue: function(payment, rate, periods, compoundingPerYear = 1, paymentAtBeginning = false) {
    const r = rate / 100 / compoundingPerYear;
    
    if (r === 0) {
      return payment * periods;
    }
    
    const factor = paymentAtBeginning ? (1 + r) : 1;
    return payment * factor * ((Math.pow(1 + r, periods) - 1) / r);
  },
  
  // 计算年金现值
  annuityPresentValue: function(payment, rate, periods, compoundingPerYear = 1, paymentAtBeginning = false) {
    const r = rate / 100 / compoundingPerYear;
    
    if (r === 0) {
      return payment * periods;
    }
    
    const factor = paymentAtBeginning ? (1 + r) : 1;
    return payment * factor * ((1 - Math.pow(1 + r, -periods)) / r);
  },
  
  // 计算内部收益率（IRR）的简化版本
  calculateIRR: function(cashflows, guess = 0.1, maxIterations = 100, tolerance = 1e-6) {
    let rate = guess;
    
    for (let i = 0; i < maxIterations; i++) {
      let npv = 0;
      let derivativeNpv = 0;
      
      for (let j = 0; j < cashflows.length; j++) {
        const factor = Math.pow(1 + rate, j);
        npv += cashflows[j] / factor;
        derivativeNpv -= j * cashflows[j] / Math.pow(1 + rate, j + 1);
      }
      
      if (Math.abs(npv) < tolerance) {
        return rate * 100; // 转换为百分比
      }
      
      // 牛顿-拉弗森迭代
      const newRate = rate - npv / derivativeNpv;
      
      if (Math.abs(newRate - rate) < tolerance) {
        return newRate * 100; // 转换为百分比
      }
      
      rate = newRate;
    }
    
    throw new Error('IRR计算未收敛');
  },
  
  // 计算净现值（NPV）
  calculateNPV: function(rate, cashflows) {
    const r = rate / 100;
    let npv = 0;
    
    for (let i = 0; i < cashflows.length; i++) {
      npv += cashflows[i] / Math.pow(1 + r, i);
    }
    
    return npv;
  },
  
  // 计算投资回收期
  calculatePaybackPeriod: function(initialInvestment, cashflows) {
    let cumulativeCashflow = -initialInvestment;
    let period = 0;
    
    while (cumulativeCashflow < 0 && period < cashflows.length) {
      cumulativeCashflow += cashflows[period];
      period++;
    }
    
    if (cumulativeCashflow < 0) {
      return null; // 在给定的现金流中无法回收投资
    }
    
    // 计算精确的回收期
    if (period > 0 && cumulativeCashflow > 0) {
      const previousCumulativeCashflow = cumulativeCashflow - cashflows[period - 1];
      period = period - 1 + Math.abs(previousCumulativeCashflow) / cashflows[period - 1];
    }
    
    return period;
  },
  
  // 计算折现回收期
  calculateDiscountedPaybackPeriod: function(initialInvestment, cashflows, rate) {
    const r = rate / 100;
    let cumulativePV = -initialInvestment;
    let period = 0;
    
    while (cumulativePV < 0 && period < cashflows.length) {
      cumulativePV += cashflows[period] / Math.pow(1 + r, period + 1);
      period++;
    }
    
    if (cumulativePV < 0) {
      return null; // 在给定的现金流中无法回收投资
    }
    
    // 计算精确的回收期
    if (period > 0 && cumulativePV > 0) {
      const previousPV = cashflows[period - 1] / Math.pow(1 + r, period);
      const previousCumulativePV = cumulativePV - previousPV;
      period = period - 1 + Math.abs(previousCumulativePV) / previousPV;
    }
    
    return period;
  },
  
  // 计算投资收益率（ROI）
  calculateROI: function(initialInvestment, finalValue) {
    return ((finalValue - initialInvestment) / initialInvestment) * 100;
  },
  
  // 计算年化收益率
  calculateAnnualizedReturn: function(initialInvestment, finalValue, years) {
    return (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100;
  },
  
  // 计算通货膨胀调整后的价值
  adjustForInflation: function(value, inflationRate, years) {
    return value / Math.pow(1 + inflationRate / 100, years);
  },
  
  // 计算实际利率（考虑通货膨胀）
  calculateRealRate: function(nominalRate, inflationRate) {
    return ((1 + nominalRate / 100) / (1 + inflationRate / 100) - 1) * 100;
  },
  
  // 计算有效年利率
  calculateEffectiveRate: function(nominalRate, compoundingPerYear) {
    return (Math.pow(1 + nominalRate / 100 / compoundingPerYear, compoundingPerYear) - 1) * 100;
  },
  
  // 计算连续复利的有效年利率
  calculateContinuousEffectiveRate: function(nominalRate) {
    return (Math.exp(nominalRate / 100) - 1) * 100;
  },
  
  // 计算贴现率
  calculateDiscountRate: function(presentValue, futureValue, years) {
    return (Math.pow(futureValue / presentValue, 1 / years) - 1) * 100;
  },
  
  // 计算未来值
  calculateFutureValue: function(presentValue, rate, years, compoundingPerYear = 1) {
    return this.compoundGrowth(presentValue, rate, years, compoundingPerYear);
  },
  
  // 计算现值
  calculatePresentValue: function(futureValue, rate, years, compoundingPerYear = 1) {
    const r = rate / 100 / compoundingPerYear;
    return futureValue / Math.pow(1 + r, years * compoundingPerYear);
  },
  
  // 计算永续年金现值
  calculatePerpetuityPresentValue: function(payment, rate) {
    return payment / (rate / 100);
  },
  
  // 计算增长型永续年金现值
  calculateGrowingPerpetuityPresentValue: function(payment, rate, growthRate) {
    if (rate <= growthRate) {
      throw new Error('增长率不能大于或等于折现率');
    }
    
    return payment / ((rate - growthRate) / 100);
  },
  
  // 计算债券价格
  calculateBondPrice: function(faceValue, couponRate, marketRate, years, paymentsPerYear = 1) {
    const couponPayment = faceValue * (couponRate / 100) / paymentsPerYear;
    const periods = years * paymentsPerYear;
    const r = marketRate / 100 / paymentsPerYear;
    
    // 计算所有票息的现值
    let presentValueCoupons = 0;
    for (let i = 1; i <= periods; i++) {
      presentValueCoupons += couponPayment / Math.pow(1 + r, i);
    }
    
    // 计算面值的现值
    const presentValueFaceValue = faceValue / Math.pow(1 + r, periods);
    
    return presentValueCoupons + presentValueFaceValue;
  },
  
  // 计算债券收益率（简化版）
  calculateBondYield: function(price, faceValue, couponRate, years, paymentsPerYear = 1, guess = 0.05, maxIterations = 100, tolerance = 1e-6) {
    let rate = guess;
    const couponPayment = faceValue * (couponRate / 100) / paymentsPerYear;
    const periods = years * paymentsPerYear;
    
    for (let i = 0; i < maxIterations; i++) {
      // 使用当前利率计算债券价格
      let calculatedPrice = 0;
      
      // 计算所有票息的现值
      for (let j = 1; j <= periods; j++) {
        calculatedPrice += couponPayment / Math.pow(1 + rate, j);
      }
      
      // 计算面值的现值
      calculatedPrice += faceValue / Math.pow(1 + rate, periods);
      
      // 检查是否收敛
      if (Math.abs(calculatedPrice - price) < tolerance) {
        return rate * 100; // 转换为百分比
      }
      
      // 调整利率
      // 如果计算价格高于目标价格，增加利率
      // 如果计算价格低于目标价格，降低利率
      rate = rate * (1 + (calculatedPrice - price) / price * 0.1);
    }
    
    throw new Error('债券收益率计算未收敛');
  },
  
  // 计算债券久期
  calculateBondDuration: function(faceValue, couponRate, marketRate, years, paymentsPerYear = 1) {
    const couponPayment = faceValue * (couponRate / 100) / paymentsPerYear;
    const periods = years * paymentsPerYear;
    const r = marketRate / 100 / paymentsPerYear;
    
    let weightedSum = 0;
    let priceSum = 0;
    
    // 计算所有现金流的加权和
    for (let i = 1; i <= periods; i++) {
      const pv = couponPayment / Math.pow(1 + r, i);
      weightedSum += i * pv;
      priceSum += pv;
    }
    
    // 添加最终面值的加权现值
    const pvFaceValue = faceValue / Math.pow(1 + r, periods);
    weightedSum += periods * pvFaceValue;
    priceSum += pvFaceValue;
    
    // 计算麦考利久期
    const macaulayDuration = weightedSum / priceSum;
    
    // 计算修正久期
    const modifiedDuration = macaulayDuration / (1 + r);
    
    return {
      macaulayDuration: macaulayDuration / paymentsPerYear, // 转换为年
      modifiedDuration: modifiedDuration / paymentsPerYear  // 转换为年
    };
  },
  
  // 计算债券凸度
  calculateBondConvexity: function(faceValue, couponRate, marketRate, years, paymentsPerYear = 1) {
    const couponPayment = faceValue * (couponRate / 100) / paymentsPerYear;
    const periods = years * paymentsPerYear;
    const r = marketRate / 100 / paymentsPerYear;
    
    let convexitySum = 0;
    let priceSum = 0;
    
    // 计算所有现金流的凸度贡献
    for (let i = 1; i <= periods; i++) {
      const pv = couponPayment / Math.pow(1 + r, i);
      convexitySum += i * (i + 1) * pv;
      priceSum += pv;
    }
    
    // 添加最终面值的凸度贡献
    const pvFaceValue = faceValue / Math.pow(1 + r, periods);
    convexitySum += periods * (periods + 1) * pvFaceValue;
    priceSum += pvFaceValue;
    
    // 计算凸度
    const convexity = convexitySum / (priceSum * Math.pow(1 + r, 2));
    
    return convexity / Math.pow(paymentsPerYear, 2); // 转换为年度凸度
  },
  
  // 计算债券价格对收益率变化的敏感性
  calculateBondPriceSensitivity: function(faceValue, couponRate, marketRate, years, paymentsPerYear = 1, yieldChange = 0.01) {
    const basePrice = this.calculateBondPrice(faceValue, couponRate, marketRate, years, paymentsPerYear);
    const newPrice = this.calculateBondPrice(faceValue, couponRate, marketRate + yieldChange, years, paymentsPerYear);
    
    return {
      priceChange: newPrice - basePrice,
      percentageChange: ((newPrice - basePrice) / basePrice) * 100
    };
  },
  
  // 计算零息债券价格
  calculateZeroCouponBondPrice: function(faceValue, marketRate, years) {
    const r = marketRate / 100;
    return faceValue / Math.pow(1 + r, years);
  },
  
  // 计算零息债券收益率
  calculateZeroCouponBondYield: function(price, faceValue, years) {
    return (Math.pow(faceValue / price, 1 / years) - 1) * 100;
  },
  
  // 计算股票价格（使用股息贴现模型）
  calculateStockPrice: function(dividendPerShare, growthRate, requiredRate) {
    if (requiredRate <= growthRate) {
      throw new Error('要求收益率必须大于增长率');
    }
    
    // 使用戈登增长模型
    return dividendPerShare * (1 + growthRate / 100) / ((requiredRate - growthRate) / 100);
  },
  
  // 计算股票预期收益率（使用股息贴现模型）
  calculateStockExpectedReturn: function(price, dividendPerShare, growthRate) {
    return (dividendPerShare / price + growthRate / 100) * 100;
  },
  
  // 计算资本资产定价模型(CAPM)预期收益率
  calculateCAPM: function(riskFreeRate, beta, marketReturn) {
    return riskFreeRate + beta * (marketReturn - riskFreeRate);
  },
  
  // 计算加权平均资本成本(WACC)
  calculateWACC: function(equityValue, debtValue, costOfEquity, costOfDebt, taxRate) {
    const totalValue = equityValue + debtValue;
    const equityWeight = equityValue / totalValue;
    const debtWeight = debtValue / totalValue;
    
    return equityWeight * costOfEquity + debtWeight * costOfDebt * (1 - taxRate / 100);
  },
  
  // 计算期权价格（使用Black-Scholes模型）
  calculateOptionPrice: function(type, stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility, dividend = 0) {
    // 确保类型有效
    if (type !== 'call' && type !== 'put') {
      throw new Error('期权类型必须是"call"或"put"');
    }
    
    // 转换为小数
    const r = riskFreeRate / 100;
    const q = dividend / 100;
    const sigma = volatility / 100;
    
    // 计算d1和d2
    const d1 = (Math.log(stockPrice / strikePrice) + (r - q + sigma * sigma / 2) * timeToExpiry) / (sigma * Math.sqrt(timeToExpiry));
    const d2 = d1 - sigma * Math.sqrt(timeToExpiry);
    
    // 计算标准正态累积分布函数
    const cdf = function(x) {
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;
      
      const sign = x < 0 ? -1 : 1;
      x = Math.abs(x) / Math.sqrt(2);
      
      const t = 1 / (1 + p * x);
      const erf = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
      
      return 0.5 * (1 + sign * erf);
    };
    
    // 计算期权价格
    if (type === 'call') {
      return stockPrice * Math.exp(-q * timeToExpiry) * cdf(d1) - strikePrice * Math.exp(-r * timeToExpiry) * cdf(d2);
    } else {
      return strikePrice * Math.exp(-r * timeToExpiry) * cdf(-d2) - stockPrice * Math.exp(-q * timeToExpiry) * cdf(-d1);
    }
  },
  
  // 计算期权希腊字母（使用Black-Scholes模型）
  calculateOptionGreeks: function(type, stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility, dividend = 0) {
    // 确保类型有效
    if (type !== 'call' && type !== 'put') {
      throw new Error('期权类型必须是"call"或"put"');
    }
    
    // 转换为小数
    const r = riskFreeRate / 100;
    const q = dividend / 100;
    const sigma = volatility / 100;
    
    // 计算d1和d2
    const d1 = (Math.log(stockPrice / strikePrice) + (r - q + sigma * sigma / 2) * timeToExpiry) / (sigma * Math.sqrt(timeToExpiry));
    const d2 = d1 - sigma * Math.sqrt(timeToExpiry);
    
    // 计算标准正态概率密度函数
    const pdf = function(x) {
      return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    };
    
    // 计算标准正态累积分布函数
    const cdf = function(x) {
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;
      
      const sign = x < 0 ? -1 : 1;
      x = Math.abs(x) / Math.sqrt(2);
      
      const t = 1 / (1 + p * x);
      const erf = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
      
      return 0.5 * (1 + sign * erf);
    };
    
    // 计算希腊字母
    let delta, gamma, theta, vega, rho;
    
    // Delta
    if (type === 'call') {
      delta = Math.exp(-q * timeToExpiry) * cdf(d1);
    } else {
      delta = Math.exp(-q * timeToExpiry) * (cdf(d1) - 1);
    }
    
    // Gamma (对于看涨和看跌期权相同)
    gamma = Math.exp(-q * timeToExpiry) * pdf(d1) / (stockPrice * sigma * Math.sqrt(timeToExpiry));
    
    // Theta
    const term1 = -(stockPrice * sigma * Math.exp(-q * timeToExpiry) * pdf(d1)) / (2 * Math.sqrt(timeToExpiry));
    if (type === 'call') {
      theta = term1 - r * strikePrice * Math.exp(-r * timeToExpiry) * cdf(d2) + q * stockPrice * Math.exp(-q * timeToExpiry) * cdf(d1);
    } else {
      theta = term1 + r * strikePrice * Math.exp(-r * timeToExpiry) * cdf(-d2) - q * stockPrice * Math.exp(-q * timeToExpiry) * cdf(-d1);
    }
    theta = theta / 365; // 转换为每天
    
    // Vega (对于看涨和看跌期权相同)
    vega = stockPrice * Math.exp(-q * timeToExpiry) * pdf(d1) * Math.sqrt(timeToExpiry) / 100; // 除以100使其表示为每1%变化
    
    // Rho
    if (type === 'call') {
      rho = strikePrice * timeToExpiry * Math.exp(-r * timeToExpiry) * cdf(d2) / 100; // 除以100使其表示为每1%变化
    } else {
      rho = -strikePrice * timeToExpiry * Math.exp(-r * timeToExpiry) * cdf(-d2) / 100;
    }
    
    return { delta, gamma, theta, vega, rho };
  },
  
  // 计算风险价值(VaR)
  calculateVaR: function(portfolioValue, confidenceLevel, volatility, timeHorizon = 1) {
    // 转换为小数
    const alpha = 1 - confidenceLevel / 100;
    const sigma = volatility / 100;
    
    // 计算z值（标准正态分布的分位数）
    const z = this.calculateNormalQuantile(1 - alpha);
    
    // 计算VaR
    return portfolioValue * z * sigma * Math.sqrt(timeHorizon);
  },
  
  // 计算标准正态分布的分位数（近似值）
  calculateNormalQuantile: function(p) {
    if (p <= 0 || p >= 1) {
      throw new Error('概率必须在0和1之间');
    }
    
    // 使用Acklam's近似
    if (p < 0.5) {
      return -this._normalQuantileApproximation(p);
    } else {
      return this._normalQuantileApproximation(1 - p);
    }
  },
  
  // 标准正态分布分位数的辅助函数
  _normalQuantileApproximation: function(p) {
    const a1 = -39.6968302866538;
    const a2 = 220.946098424521;
    const a3 = -275.928510446969;
    const a4 = 138.357751867269;
    const a5 = -30.6647980661472;
    const a6 = 2.50662827745924;
    
    const b1 = -54.4760987982241;
    const b2 = 161.585836858041;
    const b3 = -155.698979859887;
    const b4 = 66.8013118877197;
    const b5 = -13.2806815528857;
    
    const c1 = -7.78489400243029E-03;
    const c2 = -0.322396458041136;
    const c3 = -2.40075827716184;
    const c4 = -2.54973253934373;
    const c5 = 4.37466414146497;
    const c6 = 2.93816398269878;
    
    const d1 = 7.78469570904146E-03;
    const d2 = 0.32246712907004;
    const d3 = 2.445134137143;
    const d4 = 3.75440866190742;
    
    // 低概率区域使用对数变换
    if (p < 1e-6) {
      const q = Math.sqrt(-2 * Math.log(p));
      return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
             ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }
    
    const q = p - 0.5;
    const r = q * q;
    
    return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
           (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  },
  
  // 计算条件风险价值(CVaR/Expected Shortfall)
  calculateCVaR: function(portfolioValue, confidenceLevel, volatility, timeHorizon = 1) {
    // 转换为小数
    const alpha = 1 - confidenceLevel / 100;
    const sigma = volatility / 100;
    
    // 计算z值（标准正态分布的分位数）
    const z = this.calculateNormalQuantile(1 - alpha);
    
    // 计算标准正态概率密度函数在z处的值
    const pdf = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
    
    // 计算CVaR
    return portfolioValue * sigma * Math.sqrt(timeHorizon) * pdf / alpha;
  },
  
  // 计算投资组合方差
  calculatePortfolioVariance: function(weights, covariances) {
    if (weights.length !== covariances.length) {
      throw new Error('权重数组和协方差矩阵维度不匹配');
    }
    
    let variance = 0;
    
    for (let i = 0; i < weights.length; i++) {
      for (let j = 0; j < weights.length; j++) {
        variance += weights[i] * weights[j] * covariances[i][j];
      }
    }
    
    return variance;
  },
  
  // 计算投资组合标准差
  calculatePortfolioStdDev: function(weights, covariances) {
    return Math.sqrt(this.calculatePortfolioVariance(weights, covariances));
  },
  
  // 计算投资组合预期收益率
  calculatePortfolioReturn: function(weights, returns) {
    if (weights.length !== returns.length) {
      throw new Error('权重数组和收益率数组长度不匹配');
    }
    
    let expectedReturn = 0;
    
    for (let i = 0; i < weights.length; i++) {
      expectedReturn += weights[i] * returns[i];
    }
    
    return expectedReturn;
  },
  
  // 计算夏普比率
  calculateSharpeRatio: function(portfolioReturn, riskFreeRate, portfolioStdDev) {
    return (portfolioReturn - riskFreeRate) / portfolioStdDev;
  },
  
  // 计算特雷诺比率
  calculateTreynorRatio: function(portfolioReturn, riskFreeRate, beta) {
    return (portfolioReturn - riskFreeRate) / beta;
  },
  
  // 计算信息比率
  calculateInformationRatio: function(portfolioReturn, benchmarkReturn, trackingError) {
    return (portfolioReturn - benchmarkReturn) / trackingError;
  },
  
  // 计算索提诺比率
  calculateSortinoRatio: function(portfolioReturn, riskFreeRate, downsideDeviation) {
    return (portfolioReturn - riskFreeRate) / downsideDeviation;
  },
  
  // 计算下行偏差
  calculateDownsideDeviation: function(returns, targetReturn = 0) {
    let sum = 0;
    let count = 0;
    
    for (const r of returns) {
      if (r < targetReturn) {
        sum += Math.pow(targetReturn - r, 2);
        count++;
      }
    }
    
    return count > 0 ? Math.sqrt(sum / count) : 0;
  },
  
  // 计算最大回撤
  calculateMaxDrawdown: function(prices) {
    if (!prices || prices.length < 2) return 0;
    
    let maxDrawdown = 0;
    let peak = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > peak) {
        peak = prices[i];
      } else {
        const drawdown = (peak - prices[i]) / peak;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
      }
    }
    
    return maxDrawdown * 100; // 转换为百分比
  },
  
  // 矩阵运算
  matrix: {
    // 创建矩阵
    create: function(rows, cols, initialValue = 0) {
      const matrix = [];
      for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
          row.push(initialValue);
        }
        matrix.push(row);
      }
      return matrix;
    },
    
    // 创建单位矩阵
    identity: function(size) {
      const matrix = this.create(size, size, 0);
      for (let i = 0; i < size; i++) {
        matrix[i][i] = 1;
      }
      return matrix;
    },
    
    // 矩阵加法
    add: function(matrixA, matrixB) {
      if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
        throw new Error('矩阵维度不匹配');
      }
      
      const rows = matrixA.length;
      const cols = matrixA[0].length;
      const result = this.create(rows, cols);
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          result[i][j] = matrixA[i][j] + matrixB[i][j];
        }
      }
      
      return result;
    },
    
    // 矩阵减法
    subtract: function(matrixA, matrixB) {
      if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
        throw new Error('矩阵维度不匹配');
      }
      
      const rows = matrixA.length;
      const cols = matrixA[0].length;
      const result = this.create(rows, cols);
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          result[i][j] = matrixA[i][j] - matrixB[i][j];
        }
      }
      
      return result;
    },
    
    // 矩阵乘法
    multiply: function(matrixA, matrixB) {
      const rowsA = matrixA.length;
      const colsA = matrixA[0].length;
      const rowsB = matrixB.length;
      const colsB = matrixB[0].length;
      
      if (colsA !== rowsB) {
        throw new Error('矩阵维度不匹配');
      }
      
      const result = this.create(rowsA, colsB);
      
      for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
          let sum = 0;
          for (let k = 0; k < colsA; k++) {
            sum += matrixA[i][k] * matrixB[k][j];
          }
          result[i][j] = sum;
        }
      }
      
      return result;
    },
    
    // 矩阵转置
    transpose: function(matrix) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      const result = this.create(cols, rows);
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          result[j][i] = matrix[i][j];
        }
      }
      
      return result;
    },
    
    // 矩阵行列式（仅适用于2x2和3x3矩阵）
    determinant: function(matrix) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      
      if (rows !== cols) {
        throw new Error('只能计算方阵的行列式');
      }
      
      if (rows === 1) {
        return matrix[0][0];
      } else if (rows === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      } else if (rows === 3) {
        return matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
               matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
               matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
      } else {
        throw new Error('目前只支持3x3及以下矩阵的行列式计算');
      }
    },
    
    // 矩阵求逆（仅适用于2x2和3x3矩阵）
    inverse: function(matrix) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      
      if (rows !== cols) {
        throw new Error('只能计算方阵的逆矩阵');
      }
      
      const det = this.determinant(matrix);
      
      if (Math.abs(det) < 1e-10) {
        throw new Error('矩阵不可逆');
      }
      
      if (rows === 1) {
        return [[1 / matrix[0][0]]];
      } else if (rows === 2) {
        const result = this.create(2, 2);
        result[0][0] = matrix[1][1] / det;
        result[0][1] = -matrix[0][1] / det;
        result[1][0] = -matrix[1][0] / det;
        result[1][1] = matrix[0][0] / det;
        return result;
      } else if (rows === 3) {
        const result = this.create(3, 3);
        
        // 计算余子式
        const cofactor = (i, j) => {
          const subMatrix = [];
          for (let r = 0; r < 3; r++) {
            if (r === i) continue;
            const row = [];
            for (let c = 0; c < 3; c++) {
              if (c === j) continue;
              row.push(matrix[r][c]);
            }
            subMatrix.push(row);
          }
          const sign = ((i + j) % 2 === 0) ? 1 : -1;
          return sign * this.determinant(subMatrix);
        };
        
        // 计算伴随矩阵
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            result[j][i] = cofactor(i, j) / det; // 注意这里i和j交换了位置，实现了转置
          }
        }
        
        return result;
      } else {
        throw new Error('目前只支持3x3及以下矩阵的逆矩阵计算');
      }
    },
    
    // 矩阵标量乘法
    scalarMultiply: function(matrix, scalar) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      const result = this.create(rows, cols);
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          result[i][j] = matrix[i][j] * scalar;
        }
      }
      
      return result;
    },
    
    // 矩阵的迹（对角线元素之和）
    trace: function(matrix) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      
      if (rows !== cols) {
        throw new Error('只能计算方阵的迹');
      }
      
      let sum = 0;
      for (let i = 0; i < rows; i++) {
        sum += matrix[i][i];
      }
      
      return sum;
    },
    
    // 矩阵是否对称
    isSymmetric: function(matrix) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      
      if (rows !== cols) {
        return false;
      }
      
      for (let i = 0; i < rows; i++) {
        for (let j = i + 1; j < cols; j++) {
          if (matrix[i][j] !== matrix[j][i]) {
            return false;
          }
        }
      }
      
      return true;
    }
  },
  
  // 统计学函数
  statistics: {
    // 计算样本偏度
    skewness: function(arr) {
      if (!arr || arr.length < 3) return 0;
      
      const n = arr.length;
      const mean = DuobaoMath.average(arr);
      const stdDev = DuobaoMath.standardDeviation(arr);
      
      if (stdDev === 0) return 0;
      
      let sum = 0;
      for (const val of arr) {
        sum += Math.pow((val - mean) / stdDev, 3);
      }
      
      // 使用Fisher-Pearson系数
      return (n / ((n - 1) * (n - 2))) * sum;
    },
    
    // 计算样本峰度
    kurtosis: function(arr) {
      if (!arr || arr.length < 4) return 0;
      
      const n = arr.length;
      const mean = DuobaoMath.average(arr);
      const stdDev = DuobaoMath.standardDeviation(arr);
      
      if (stdDev === 0) return 0;
      
      let sum = 0;
      for (const val of arr) {
        sum += Math.pow((val - mean) / stdDev, 4);
      }
      
      // 使用Fisher定义（正态分布的峰度为0）
      return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum - (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
    },
    
    // 计算几何平均数
    geometricMean: function(arr) {
      if (!arr || arr.length === 0) return 0;
      if (arr.some(val => val <= 0)) throw new Error('几何平均数只适用于正数');
      
      let product = 1;
      for (const val of arr) {
        product *= val;
      }
      
      return Math.pow(product, 1 / arr.length);
    },
    
    // 计算调和平均数
    harmonicMean: function(arr) {
      if (!arr || arr.length === 0) return 0;
      if (arr.some(val => val <= 0)) throw new Error('调和平均数只适用于正数');
      
      let sum = 0;
      for (const val of arr) {
        sum += 1 / val;
      }
      
      return arr.length / sum;
    },
    
    // 计算加权几何平均数
    weightedGeometricMean: function(values, weights) {
      if (!values || !weights || values.length !== weights.length || values.length === 0) {
        return 0;
      }
      
      if (values.some(val => val <= 0)) throw new Error('几何平均数只适用于正数');
      
      const weightSum = weights.reduce((acc, val) => acc + val, 0);
      
      let product = 1;
      for (let i = 0; i < values.length; i++) {
        product *= Math.pow(values[i], weights[i] / weightSum);
      }
      
      return product;
    },
    
    // 计算样本协方差矩阵
    covarianceMatrix: function(data) {
      if (!data || data.length === 0 || !data[0] || data[0].length === 0) {
        throw new Error('数据不能为空');
      }
      
      const n = data.length; // 样本数
      const p = data[0].length; // 变量数
      
      // 计算每个变量的均值
      const means = [];
      for (let j = 0; j < p; j++) {
        let sum = 0;
        for (let i = 0; i < n; i++) {
          sum += data[i][j];
        }
        means.push(sum / n);
      }
      
      // 计算协方差矩阵
      const covariance = DuobaoMath.matrix.create(p, p, 0);
      
      for (let i = 0; i < p; i++) {
        for (let j = i; j < p; j++) {
          let sum = 0;
          for (let k = 0; k < n; k++) {
            sum += (data[k][i] - means[i]) * (data[k][j] - means[j]);
          }
          
          const cov = sum / (n - 1);
          covariance[i][j] = cov;
          covariance[j][i] = cov; // 协方差矩阵是对称的
        }
      }
      
      return covariance;
    },
    
    // 计算相关系数矩阵
    correlationMatrix: function(data) {
      const covariance = this.covarianceMatrix(data);
      const p = covariance.length;
      
      // 提取标准差
      const stdDevs = [];
      for (let i = 0; i < p; i++) {
        stdDevs.push(Math.sqrt(covariance[i][i]));
      }
      
      // 计算相关系数
      const correlation = DuobaoMath.matrix.create(p, p, 0);
      
      for (let i = 0; i < p; i++) {
        for (let j = 0; j < p; j++) {
          if (stdDevs[i] === 0 || stdDevs[j] === 0) {
            correlation[i][j] = 0;
          } else {
            correlation[i][j] = covariance[i][j] / (stdDevs[i] * stdDevs[j]);
          }
        }
      }
      
      return correlation;
    },
    
    // 计算Spearman等级相关系数
    spearmanCorrelation: function(arrX, arrY) {
      if (!arrX || !arrY || arrX.length !== arrY.length || arrX.length === 0) {
        return 0;
      }
      
      // 计算排名
      const rankify = arr => {
        const sorted = [...arr].sort((a, b) => a - b);
        const ranks = arr.map(val => sorted.indexOf(val) + 1);
        return ranks;
      };
      
      const ranksX = rankify(arrX);
      const ranksY = rankify(arrY);
      
      // 计算排名差的平方和
      let d2Sum = 0;
      for (let i = 0; i < arrX.length; i++) {
        d2Sum += Math.pow(ranksX[i] - ranksY[i], 2);
      }
      
      // 使用Spearman公式
      const n = arrX.length;
      return 1 - (6 * d2Sum) / (n * (n * n - 1));
    },
    
    // 计算Kendall等级相关系数
    kendallCorrelation: function(arrX, arrY) {
      if (!arrX || !arrY || arrX.length !== arrY.length || arrX.length === 0) {
        return 0;
      }
      
      const n = arrX.length;
      let concordant = 0;
      let discordant = 0;
      
      for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
          const signX = Math.sign(arrX[i] - arrX[j]);
          const signY = Math.sign(arrY[i] - arrY[j]);
          
          if (signX === signY) {
            concordant++;
          } else if (signX !== 0 && signY !== 0) {
            discordant++;
          }
        }
      }
      
      return (concordant - discordant) / Math.sqrt((concordant + discordant + 0.0) * (concordant + discordant + 0.0));
    },
    
    // 计算变异系数
    coefficientOfVariation: function(arr) {
      if (!arr || arr.length === 0) return 0;
      
      const mean = DuobaoMath.average(arr);
      if (mean === 0) return 0;
      
      const stdDev = DuobaoMath.standardDeviation(arr);
      return (stdDev / mean) * 100; // 转换为百分比
    },
    
    // 计算Z分数
    zScores: function(arr) {
      if (!arr || arr.length === 0) return [];
      
      const mean = DuobaoMath.average(arr);
      const stdDev = DuobaoMath.standardDeviation(arr);
      
      if (stdDev === 0) return arr.map(() => 0);
      
      return arr.map(val => (val - mean) / stdDev);
    },
    
    // 计算分位数回归
    quantileRegression: function(arrX, arrY, quantile = 0.5, iterations = 1000) {
      if (!arrX || !arrY || arrX.length !== arrY.length || arrX.length < 2) {
        return { slope: 0, intercept: 0 };
      }
      
      // 初始化参数
      const n = arrX.length;
      let slope = 0;
      let intercept = DuobaoMath.percentile(arrY, quantile * 100);
      
      // 迭代优化
      for (let iter = 0; iter < iterations; iter++) {
        // 计算残差
        const residuals = [];
        for (let i = 0; i < n; i++) {
          residuals.push(arrY[i] - (intercept + slope * arrX[i]));
        }
        
        // 计算梯度
        let gradIntercept = 0;
        let gradSlope = 0;
        
        for (let i = 0; i < n; i++) {
          const sign = residuals[i] < 0 ? quantile - 1 : quantile;
          gradIntercept += sign;
          gradSlope += sign * arrX[i];
        }
        
        // 更新参数
        const learningRate = 0.01 / Math.sqrt(iter + 1);
        intercept -= learningRate * gradIntercept / n;
        slope -= learningRate * gradSlope / n;
      }
      
      return { slope, intercept };
    },
    
    // 计算多元线性回归
    multipleLinearRegression: function(X, y) {
      if (!X || !y || X.length !== y.length || X.length === 0) {
        return { coefficients: [], intercept: 0, r2: 0 };
      }
      
      const n = X.length; // 样本数
      const p = X[0].length; // 特征数
      
      // 添加截距项
      const X_with_intercept = X.map(row => [1, ...row]);
      
      // 计算 X^T * X
      const XtX = [];
      for (let i = 0; i <= p; i++) {
        XtX.push([]);
        for (let j = 0; j <= p; j++) {
          let sum = 0;
          for (let k = 0; k < n; k++) {
            sum += X_with_intercept[k][i] * X_with_intercept[k][j];
          }
          XtX[i].push(sum);
        }
      }
      
      // 计算 X^T * y
      const Xty = [];
      for (let i = 0; i <= p; i++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += X_with_intercept[k][i] * y[k];
        }
        Xty.push(sum);
      }
      
      // 求解线性方程组 XtX * beta = Xty
      // 使用高斯消元法
      const augmentedMatrix = XtX.map((row, i) => [...row, Xty[i]]);
      
      // 高斯消元
      for (let i = 0; i <= p; i++) {
        // 找到主元
        let maxRow = i;
        for (let j = i + 1; j <= p; j++) {
          if (Math.abs(augmentedMatrix[j][i]) > Math.abs(augmentedMatrix[maxRow][i])) {
            maxRow = j;
          }
        }
        
        // 交换行
        [augmentedMatrix[i], augmentedMatrix[maxRow]] = [augmentedMatrix[maxRow], augmentedMatrix[i]];
        
        // 消元
        for (let j = i + 1; j <= p; j++) {
          const factor = augmentedMatrix[j][i] / augmentedMatrix[i][i];
          for (let k = i; k <= p + 1; k++) {
            augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
          }
        }
      }
      
      // 回代
      const beta = new Array(p + 1).fill(0);
      for (let i = p; i >= 0; i--) {
        let sum = augmentedMatrix[i][p + 1];
        for (let j = i + 1; j <= p; j++) {
          sum -= augmentedMatrix[i][j] * beta[j];
        }
        beta[i] = sum / augmentedMatrix[i][i];
      }
      
      // 提取截距和系数
      const intercept = beta[0];
      const coefficients = beta.slice(1);
      
      // 计算R^2
      const yMean = y.reduce((sum, val) => sum + val, 0) / n;
      let ssTot = 0;
      let ssRes = 0;
      
      for (let i = 0; i < n; i++) {
        let yPred = intercept;
        for (let j = 0; j < p; j++) {
          yPred += coefficients[j] * X[i][j];
        }
        
        ssTot += Math.pow(y[i] - yMean, 2);
        ssRes += Math.pow(y[i] - yPred, 2);
      }
      
      const r2 = 1 - ssRes / ssTot;
      
      return { coefficients, intercept, r2 };
    }
  },
  
  // 几何学函数
  geometry: {
    // 计算点到直线的距离
    pointToLineDistance: function(px, py, x1, y1, x2, y2) {
      const A = y2 - y1;
      const B = x1 - x2;
      const C = x2 * y1 - x1 * y2;
      
      return Math.abs(A * px + B * py + C) / Math.sqrt(A * A + B * B);
    },
    
    // 判断点是否在多边形内部
    isPointInPolygon: function(px, py, polygon) {
      if (!polygon || polygon.length < 3) return false;
      
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0];
        const yi = polygon[i][1];
        const xj = polygon[j][0];
        const yj = polygon[j][1];
        
        const intersect = ((yi > py) !== (yj > py)) &&
                          (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
        
        if (intersect) inside = !inside;
      }
      
      return inside;
    },
    
    // 计算多边形面积
    polygonArea: function(polygon) {
      if (!polygon || polygon.length < 3) return 0;
      
      let area = 0;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        area += (polygon[j][0] + polygon[i][0]) * (polygon[j][1] - polygon[i][1]);
      }
      
      return Math.abs(area) / 2;
    },
    
    // 计算多边形周长
    polygonPerimeter: function(polygon) {
      if (!polygon || polygon.length < 2) return 0;
      
      let perimeter = 0;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const dx = polygon[i][0] - polygon[j][0];
        const dy = polygon[i][1] - polygon[j][1];
        perimeter += Math.sqrt(dx * dx + dy * dy);
      }
      
      return perimeter;
    },
    
    // 计算两条线段是否相交
    doLinesIntersect: function(x1, y1, x2, y2, x3, y3, x4, y4) {
      // 计算方向
      const d1 = this._direction(x3, y3, x4, y4, x1, y1);
      const d2 = this._direction(x3, y3, x4, y4, x2, y2);
      const d3 = this._direction(x1, y1, x2, y2, x3, y3);
      const d4 = this._direction(x1, y1, x2, y2, x4, y4);
      
      // 判断是否相交
      return (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
              ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) ||
             (d1 === 0 && this._onSegment(x3, y3, x4, y4, x1, y1)) ||
             (d2 === 0 && this._onSegment(x3, y3, x4, y4, x2, y2)) ||
             (d3 === 0 && this._onSegment(x1, y1, x2, y2, x3, y3)) ||
             (d4 === 0 && this._onSegment(x1, y1, x2, y2, x4, y4));
    },
    
    // 辅助函数：计算方向
    _direction: function(x1, y1, x2, y2, x3, y3) {
      return (x3 - x1) * (y2 - y1) - (x2 - x1) * (y3 - y1);
    },
    
    // 辅助函数：判断点是否在线段上
    _onSegment: function(x1, y1, x2, y2, px, py) {
      return px >= Math.min(x1, x2) && px <= Math.max(x1, x2) &&
             py >= Math.min(y1, y2) && py <= Math.max(y1, y2);
    },
    
    // 计算两个圆是否相交
    doCirclesIntersect: function(x1, y1, r1, x2, y2, r2) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      return distance <= r1 + r2;
    },
    
    // 计算圆与矩形是否相交
    doesCircleIntersectRectangle: function(cx, cy, r, rx, ry, rw, rh) {
      // 找到矩形上离圆心最近的点
      const closestX = Math.max(rx, Math.min(cx, rx + rw));
      const closestY = Math.max(ry, Math.min(cy, ry + rh));
      
      // 计算圆心到这个点的距离
      const dx = closestX - cx;
      const dy = closestY - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      return distance <= r;
    },
    
    // 计算贝塞尔曲线上的点
    bezierPoint: function(t, points) {
      if (!points || points.length < 2) {
/**
 * 多宝工具库 - 数学计算工具
 */

window.DuobaoMath = window.DuobaoMath || {};

// 扩展数学计算工具
Object.assign(window.DuobaoMath, {
  // 基本数学运算
  add: function(a, b) {
    return a + b;
  },
  
  subtract: function(a, b) {
    return a - b;
  },
  
  multiply: function(a, b) {
    return a * b;
  },
  
  divide: function(a, b) {
    if (b === 0) throw new Error('除数不能为零');
    return a / b;
  },
  
  // 处理JavaScript浮点数精度问题
  fixPrecision: function(value, precision = 12) {
    return parseFloat(value.toFixed(precision));
  },
  
  // 加法（修正精度）
  preciseAdd: function(a, b) {
    return this.fixPrecision(a + b);
  },
  
  // 减法（修正精度）
  preciseSubtract: function(a, b) {
    return this.fixPrecision(a - b);
  },
  
  // 乘法（修正精度）
  preciseMultiply: function(a, b) {
    return this.fixPrecision(a * b);
  },
  
  // 除法（修正精度）
  preciseDivide: function(a, b) {
    if (b === 0) throw new Error('除数不能为零');
    return this.fixPrecision(a / b);
  },
  
  // 四舍五入到指定小数位
  round: function(value, decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  },
  
  // 向上取整到指定小数位
  ceil: function(value, decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.ceil(value * factor) / factor;
  },
  
  // 向下取整到指定小数位
  floor: function(value, decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.floor(value * factor) / factor;
  },
  
  // 截断到指定小数位（不进行四舍五入）
  truncate: function(value, decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.trunc(value * factor) / factor;
  },
  
  // 格式化数字（添加千位分隔符）
  formatNumber: function(value, options = {}) {
    const {
      decimals = 2,
      decimalSeparator = '.',
      thousandsSeparator = ',',
      roundingMode = 'round' // 'round', 'ceil', 'floor', 'truncate'
    } = options;
    
    let roundedValue;
    
    switch (roundingMode) {
      case 'ceil':
        roundedValue = this.ceil(value, decimals);
        break;
      case 'floor':
        roundedValue = this.floor(value, decimals);
        break;
      case 'truncate':
        roundedValue = this.truncate(value, decimals);
        break;
      case 'round':
      default:
        roundedValue = this.round(value, decimals);
    }
    
    const parts = roundedValue.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    
    if (decimals > 0) {
      if (parts.length === 1) {
        parts.push('0'.repeat(decimals));
      } else {
        parts[1] = parts[1].padEnd(decimals, '0').slice(0, decimals);
      }
    } else {
      // 如果不需要小数部分，则移除
      return parts[0];
    }
    
    return parts.join(decimalSeparator);
  },
  
  // 解析格式化的数字字符串
  parseFormattedNumber: function(str, options = {}) {
    const {
      decimalSeparator = '.',
      thousandsSeparator = ','
    } = options;
    
    // 移除千位分隔符
    const cleanStr = str.replace(new RegExp('\\' + thousandsSeparator, 'g'), '');
    
    // 替换小数分隔符为标准点号
    const normalizedStr = cleanStr.replace(new RegExp('\\' + decimalSeparator), '.');
    
    return parseFloat(normalizedStr);
  },
  
  // 计算平均值
  average: function(arr) {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  },
  
  // 计算加权平均值
  weightedAverage: function(values, weights) {
    if (!values || !weights || values.length !== weights.length || values.length === 0) {
      return 0;
    }
    
    const sum = values.reduce((acc, val, i) => acc + val * weights[i], 0);
    const weightSum = weights.reduce((acc, val) => acc + val, 0);
    
    return weightSum === 0 ? 0 : sum / weightSum;
  },
  
  // 计算中位数
  median: function(arr) {
    if (!arr || arr.length === 0) return 0;
    
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  },
  
  // 计算众数
  mode: function(arr) {
    if (!arr || arr.length === 0) return null;
    
    const counts = {};
    let maxCount = 0;
    let modes = [];
    
    for (const num of arr) {
      counts[num] = (counts[num] || 0) + 1;
      
      if (counts[num] > maxCount) {
        maxCount = counts[num];
        modes = [num];
      } else if (counts[num] === maxCount) {
        modes.push(num);
      }
    }
    
    return modes.length === Object.keys(counts).length ? null : modes;
  },
  
  // 计算方差
  variance: function(arr) {
    if (!arr || arr.length <= 1) return 0;
    
    const mean = this.average(arr);
    return this.average(arr.map(val => Math.pow(val - mean, 2)));
  },
  
  // 计算标准差
  standardDeviation: function(arr) {
    return Math.sqrt(this.variance(arr));
  },
  
  // 计算百分位数
  percentile: function(arr, p) {
    if (!arr || arr.length === 0) return 0;
    if (p < 0 || p > 100) throw new Error('百分位数必须在0到100之间');
    
    const sorted = [...arr].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const floor = Math.floor(index);
    const ceil = Math.ceil(index);
    
    if (floor === ceil) return sorted[floor];
    
    const d = index - floor;
    return sorted[floor] * (1 - d) + sorted[ceil] * d;
  },
  
  // 计算四分位数
  quartiles: function(arr) {
    return {
      q1: this.percentile(arr, 25),
      q2: this.percentile(arr, 50), // 中位数
      q3: this.percentile(arr, 75)
    };
  },
  
  // 计算极差
  range: function(arr) {
    if (!arr || arr.length === 0) return 0;
    
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    
    return max - min;
  },
  
  // 计算协方差
  covariance: function(arrX, arrY) {
    if (!arrX || !arrY || arrX.length !== arrY.length || arrX.length === 0) {
      return 0;
    }
    
    const meanX = this.average(arrX);
    const meanY = this.average(arrY);
    
    let sum = 0;
    for (let i = 0; i < arrX.length; i++) {
      sum += (arrX[i] - meanX) * (arrY[i] - meanY);
    }
    
    return sum / arrX.length;
  },
  
  // 计算相关系数
  correlation: function(arrX, arrY) {
    if (!arrX || !arrY || arrX.length !== arrY.length || arrX.length === 0) {
      return 0;
    }
    
    const covariance = this.covariance(arrX, arrY);
    const stdDevX = this.standardDeviation(arrX);
    const stdDevY = this.standardDeviation(arrY);
    
    if (stdDevX === 0 || stdDevY === 0) return 0;
    
    return covariance / (stdDevX * stdDevY);
  },
  
  // 线性回归
  linearRegression: function(arrX, arrY) {
    if (!arrX || !arrY || arrX.length !== arrY.length || arrX.length === 0) {
      return { slope: 0, intercept: 0, r2: 0 };
    }
    
    const n = arrX.length;
    const meanX = this.average(arrX);
    const meanY = this.average(arrY);
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (arrX[i] - meanX) * (arrY[i] - meanY);
      denominator += Math.pow(arrX[i] - meanX, 2);
    }
    
    if (denominator === 0) {
      return { slope: 0, intercept: meanY, r2: 0 };
    }
    
    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;
    const r = this.correlation(arrX, arrY);
    
    return {
      slope,
      intercept,
      r2: r * r // 决定系数
    };
  },
  
  // 计算阶乘
  factorial: function(n) {
    if (n < 0) throw new Error('阶乘不能用于负数');
    if (n === 0 || n === 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    
    return result;
  },
  
  // 计算排列数
  permutation: function(n, r) {
    if (n < 0 || r < 0) throw new Error('排列数不能用于负数');
    if (r > n) throw new Error('r不能大于n');
    
    return this.factorial(n) / this.factorial(n - r);
  },
  
  // 计算组合数
  combination: function(n, r) {
    if (n < 0 || r < 0) throw new Error('组合数不能用于负数');
    if (r > n) throw new Error('r不能大于n');
    
    return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
  },
  
  // 计算最大公约数
  gcd: function(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    
    while (b) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    
    return a;
  },
  
  // 计算最小公倍数
  lcm: function(a, b) {
    return Math.abs(a * b) / this.gcd(a, b);
  },
  
  // 判断是否为质数
  isPrime: function(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    
    const limit = Math.sqrt(n);
    for (let i = 5; i <= limit; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    
    return true;
  },
  
  // 生成指定范围内的质数
  generatePrimes: function(start, end) {
    const primes = [];
    
    for (let i = Math.max(2, start); i <= end; i++) {
      if (this.isPrime(i)) {
        primes.push(i);
      }
    }
    
    return primes;
  },
  
  // 计算斐波那契数列
  fibonacci: function(n) {
    if (n <= 0) return [];
    if (n === 1) return [0];
    if (n === 2) return [0, 1];
    
    const fib = [0, 1];
    for (let i = 2; i < n; i++) {
      fib.push(fib[i - 1] + fib[i - 2]);
    }
    
    return fib;
  },
  
  // 计算第n个斐波那契数
  fibonacciNumber: function(n) {
    if (n <= 0) return 0;
    if (n === 1) return 0;
    if (n === 2) return 1;
    
    let a = 0;
    let b = 1;
    let result = 0;
    
    for (let i = 3; i <= n; i++) {
      result = a + b;
      a = b;
      b = result;
    }
    
    return result;
  },
  
  // 角度转弧度
  degToRad: function(degrees) {
    return degrees * (Math.PI / 180);
  },
  
  // 弧度转角度
  radToDeg: function(radians) {
    return radians * (180 / Math.PI);
  },
  
  // 计算两点之间的距离
  distance: function(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },
  
  // 计算三维空间中两点之间的距离
  distance3D: function(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
  },
  
  // 计算三角形面积（已知三边长）
  triangleArea: function(a, b, c) {
    // 使用海伦公式
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  },
  
  // 计算三角形面积（已知底和高）
  triangleAreaByHeight: function(base, height) {
    return (base * height) / 2;
  },
  
  // 计算三角形面积（已知两边和夹角）
  triangleAreaBySAS: function(a, b, angleC) {
    // 角度转弧度
    const angleRad = this.degToRad(angleC);
    return (a * b * Math.sin(angleRad)) / 2;
  },
  
  // 计算矩形面积
  rectangleArea: function(width, height) {
    return width * height;
  },
  
  // 计算圆的面积
  circleArea: function(radius) {
    return Math.PI * radius * radius;
  },
  
  // 计算圆的周长
  circleCircumference: function(radius) {
    return 2 * Math.PI * radius;
  },
  
  // 计算椭圆面积
  ellipseArea: function(a, b) {
    return Math.PI * a * b;
  },
  
  // 计算椭圆周长（近似值）
  ellipseCircumference: function(a, b) {
    // 使用Ramanujan近似公式
    const h = Math.pow((a - b) / (a + b), 2);
    return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
  },
  
  // 计算正多边形面积
  regularPolygonArea: function(n, side) {
    return (n * side * side) / (4 * Math.tan(Math.PI / n));
  },
  
  // 计算正多边形周长
  regularPolygonPerimeter: function(n, side) {
    return n * side;
  },
  
  // 计算球体体积
  sphereVolume: function(radius) {
    return (4 / 3) * Math.PI * Math.pow(radius, 3);
  },
  
  // 计算球体表面积
  sphereSurfaceArea: function(radius) {
    return 4 * Math.PI * radius * radius;
  },
  
  // 计算圆柱体体积
  cylinderVolume: function(radius, height) {
    return Math.PI * radius * radius * height;
  },
  
  // 计算圆柱体表面积
  cylinderSurfaceArea: function(radius, height) {
    return 2 * Math.PI * radius * (radius + height);
  },
  
  // 计算圆锥体体积
  coneVolume: function(radius, height) {
    return (1 / 3) * Math.PI * radius * radius * height;
  },
  
  // 计算圆锥体表面积
  coneSurfaceArea: function(radius, height) {
    const slantHeight = Math.sqrt(radius * radius + height * height);
    return Math.PI * radius * (radius + slantHeight);
  },
  
  // 线性插值
  lerp: function(a, b, t) {
    return a + (b - a) * t;
  },
  
  // 将数值限制在指定范围内
  clamp: function(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },
  
  // 计算百分比
  percentage: function(value, total) {
    return (value / total) * 100;
  },
  
  // 将百分比转换为小数
  percentageToDecimal: function(percentage) {
    return percentage / 100;
  },
  
  // 计算增长率
  growthRate: function(initial, final) {
    return ((final - initial) / initial) * 100;
  },
  
  // 计算复合增长
  compoundGrowth: function(principal, rate, time, compoundingPerYear = 1) {
    const r = rate / 100;
    return principal * Math.pow(1 + r / compoundingPerYear, compoundingPerYear * time);
  },
  
  // 计算连续复合增长
  continuousCompoundGrowth: function(principal, rate, time) {
    const r = rate / 100;
    return principal * Math.exp(r * time);
  },
  
  // 计算等额本息还款
  calculateLoanPayment: function(principal, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const payments = years * 12;
    
    if (monthlyRate === 0) {
      return principal / payments;
    }
    
    const x = Math.pow(1 + monthlyRate, payments);
    return (principal * monthlyRate * x) / (x - 1);
  },
  
  // 计算等额本金还款
  calculateLoanPaymentByPrincipal: function(principal, annualRate, years, paymentIndex) {
    const monthlyRate = annualRate / 100 / 12;
    const payments = years * 12;
    
    const monthlyPrincipal = principal / payments;
    const interest = (principal - monthlyPrincipal * (paymentIndex - 1)) * monthlyRate;
    
    return monthlyPrincipal + interest;
  },
  
  // 计算贷款总利息
  calculateTotalInterest: function(principal, annualRate, years) {
    const monthlyPayment = this.calculateLoanPayment(principal, annualRate, years);
    return monthlyPayment * years * 12 - principal;
  },
  
  // 计算复利
  compoundInterest: function(principal, rate, time, compoundingPerYear = 1) {
    return this.compoundGrowth(principal, rate, time, compoundingPerYear) - principal;
  },
  
  // 计算年金终值
  annuityFutureValue: function(payment, rate, periods, compoundingPerYear = 1, paymentAtBeginning = false) {
    const r = rate / 100 / compoundingPerYear;
    
    if (r === 0) {
      return payment * periods;
    }
    
    const factor = paymentAtBeginning ? (1 + r) : 1;
    return payment * factor * ((Math.pow(1 + r, periods) - 1) / r);
  },
  
  // 计算年金现值
  annuityPresentValue: function(payment, rate, periods, compoundingPerYear = 1, paymentAtBeginning = false) {
    const r = rate / 100 / compoundingPerYear;
    
    if (r === 0) {
      return payment * periods;
    }
    
    const factor = paymentAtBeginning ? (1 + r) : 1;
    return payment * factor * ((1 - Math.pow(1 + r, -periods)) / r);
  },
  
  // 计算内部收益率（IRR）的简化版本
  calculateIRR: function(cashflows, guess = 0.1, maxIterations = 100, tolerance = 1e-6) {
    let rate = guess;
    
    for (let i = 0; i < maxIterations; i++) {
      let npv = 0;
      let derivativeNpv = 0;
      
      for (let j = 0; j < cashflows.length; j++) {
        const factor = Math.pow(1 + rate, j);
        npv += cashflows[j] / factor;
        derivativeNpv -= j * cashflows[j] / Math.pow(1 + rate, j + 1);
      }
      
      if (Math.abs(npv) < tolerance) {
        return rate * 100; // 转换为百分比
      }
      
      // 牛顿-拉弗森迭代
      const newRate = rate - npv / derivativeNpv;
      
      if (Math.abs(newRate - rate) < tolerance) {
        return newRate * 100; // 转换为百分比
      }
      
      rate = newRate;
    }
    
    throw new Error('IRR计算未收敛');
  },
  
  // 计算净现值（NPV）
  calculateNPV: function(rate, cashflows) {
    const r = rate / 100;
    let npv = 0;
    
    for (let i = 0; i < cashflows.length; i++) {
      npv += cashflows[i] / Math.pow(1 + r, i);
    }
    
    return npv;
  },
  
  // 计算投资回收期
  calculatePaybackPeriod: function(initialInvestment, cashflows) {
    let cumulativeCashflow = -initialInvestment;
    let period = 0;
    
    while (cumulativeCashflow < 0 && period < cashflows.length) {
      cumulativeCashflow += cashflows[period];
      period++;
    }
    
    if (cumulativeCashflow < 0) {
      return null; // 在给定的现金流中无法回收投资
    }
    
    // 计算精确的回收期
    if (period > 0 && cumulativeCashflow > 0) {
      const previousCumulativeCashflow = cumulativeCashflow - cashflows[period - 1];
      period = period - 1 + Math.abs(previousCumulativeCashflow) / cashflows[period - 1];
    }
    
    return period;
  },
  
  // 计算折现回收期
  calculateDiscountedPaybackPeriod: function(initialInvestment, cashflows, rate) {
    const r = rate / 100;
    let cumulativePV = -initialInvestment;
    let period = 0;
    
    while (cumulativePV < 0 && period < cashflows.length) {
      cumulativePV += cashflows[period] / Math.pow(1 + r, period + 1);
      period++;
    }
    
    if (cumulativePV < 0) {
      return null; // 在给定的现金流中无法回收投资
    }
    
    // 计算精确的回收期
    if (period > 0 && cumulativePV > 0) {
      const previousPV = cashflows[period - 1] / Math.pow(1 + r, period);
      const previousCumulativePV = cumulativePV - previousPV;
      period = period - 1 + Math.abs(previousCumulativePV) / previousPV;
    }
    
    return period;
  },
  
  // 计算投资收益率（ROI）
  calculateROI: function(initialInvestment, finalValue) {
    return ((finalValue - initialInvestment) / initialInvestment) * 100;
  },
  
  // 计算年化收益率
  calculateAnnualizedReturn: function(initialInvestment, finalValue, years) {
    return (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100;
  },
  
  // 计算通货膨胀调整后的价值
  adjustForInflation: function(value, inflationRate, years) {
    return value / Math.pow(1 + inflationRate / 100, years);
  },
  
  // 计算实际利率（考虑通货膨胀）
  calculateRealRate: function(nominalRate, inflationRate) {
    return ((1 + nominalRate / 100) / (1 + inflationRate / 100) - 1) * 100;
  },
  
  // 计算有效年利率
  calculateEffectiveRate: function(nominalRate, compoundingPerYear) {
    return (Math.pow(1 + nominalRate / 100 / compoundingPerYear, compoundingPerYear) - 1) * 100;
  },
  
  // 计算连续复利的有效年利率
  calculateContinuousEffectiveRate: function(nominalRate) {
    return (Math.exp(nominalRate / 100) - 1) * 100;
  },
  
  // 计算贴现率
  calculateDiscountRate: function(presentValue, futureValue, years) {
    return (Math.pow(futureValue / presentValue, 1 / years) - 1) * 100;
  },
  
  // 计算未来值
  calculateFutureValue: function(presentValue, rate, years, compoundingPerYear = 1) {
    return this.compoundGrowth(presentValue, rate, years, compoundingPerYear);
  },
  
  // 计算现值
  calculatePresentValue: function(futureValue, rate, years, compoundingPerYear = 1) {
    const r = rate / 100 / compoundingPerYear;
    return futureValue / Math.pow(1 + r, years * compoundingPerYear);
  },
  
  // 计算永续年金现值
  calculatePerpetuityPresentValue: function(payment, rate) {
    return payment / (rate / 100);
  },
  
  // 计算增长型永续年金现值
  calculateGrowingPerpetuityPresentValue: function(payment, rate, growthRate) {
    if (rate <= growthRate) {
      throw new Error('增长率不能大于或等于折现率');
    }
    
    return payment / ((rate - growthRate) / 100);
  },
  
  // 计算债券价格
  calculateBondPrice: function(faceValue, couponRate, marketRate, years, paymentsPerYear = 1) {
    const couponPayment = faceValue * (couponRate / 100) / paymentsPerYear;
    const periods = years * paymentsPerYear;
    const r = marketRate / 100 / paymentsPerYear;
    
    // 计算所有票息的现值
    let presentValueCoupons = 0;
    for (let i = 1; i <= periods; i++) {
      presentValueCoupons += couponPayment / Math.pow(1 + r, i);
    }
    
    // 计算面值的现值
    const presentValueFaceValue = faceValue / Math.pow(1 + r, periods);
    
    return presentValueCoupons + presentValueFaceValue;
  },
  
  // 计算债券收益率（简化版）
  calculateBondYield: function(price, faceValue, couponRate, years, paymentsPerYear = 1, guess = 0.05, maxIterations = 100, tolerance = 1e-6) {
    let rate = guess;
    const couponPayment = faceValue * (couponRate / 100) / paymentsPerYear;
    const periods = years * paymentsPerYear;
    
    for (let i = 0; i < maxIterations; i++) {
      // 使用当前利率计算债券价格
      let calculatedPrice = 0;
      
      // 计算所有票息的现值
      for (let j = 1; j <= periods; j++) {
        calculatedPrice += couponPayment / Math.pow(1 + rate, j);
      }
      
      // 计算面值的现值
      calculatedPrice += faceValue / Math.pow(1 + rate, periods);
      
      // 检查是否收敛
      if (Math.abs(calculatedPrice - price) < tolerance) {
        return rate * 100; // 转换为百分比
      }
      
      // 调整利率
      // 如果计算价格高于目标价格，增加利率
      // 如果计算价格低于目标价格，降低利率
      rate = rate * (1 + (calculatedPrice - price) / price * 0.1);
    }
    
    throw new Error('债券收益率计算未收敛');
  },
  
  // 计算债券久期
  calculateBondDuration: function(faceValue, couponRate, marketRate, years, paymentsPerYear = 1) {
    const couponPayment = faceValue * (couponRate / 100) / paymentsPerYear;
    const periods = years * paymentsPerYear;
    const r = marketRate / 100 / paymentsPerYear;
    
    let weightedSum = 0;
    let priceSum = 0;
    
    // 计算所有现金流的加权和
    for (let i = 1; i <= periods; i++) {
      const pv = couponPayment / Math.pow(1 + r, i);
      weightedSum += i * pv;
      priceSum += pv;
    }
    
    // 添加最终面值的加权现值
    const pvFaceValue = faceValue / Math.pow(1 + r, periods);
    weightedSum += periods * pvFaceValue;
    priceSum += pvFaceValue;
    
    // 计算麦考利久期
    const macaulayDuration = weightedSum / priceSum;
    
    // 计算修正久期
    const modifiedDuration = macaulayDuration / (1 + r);
    
    return {
      macaulayDuration: macaulayDuration / paymentsPerYear, // 转换为年
      modifiedDuration: modifiedDuration / paymentsPerYear  // 转换为年
    };
  },
  
  // 计算债券凸度
  calculateBondConvexity: function(faceValue, couponRate, marketRate, years, paymentsPerYear = 1) {
    const couponPayment = faceValue * (couponRate / 100) / paymentsPerYear;
    const periods = years * paymentsPerYear;
    const r = marketRate / 100 / paymentsPerYear;
    
    let convexitySum = 0;
    let priceSum = 0;
    
    // 计算所有现金流的凸度贡献
    for (let i = 1; i <= periods; i++) {
      const pv = couponPayment / Math.pow(1 + r, i);
      convexitySum += i * (i + 1) * pv;
      priceSum += pv;
    }
    
    // 添加最终面值的凸度贡献
    const pvFaceValue = faceValue / Math.pow(1 + r, periods);
    convexitySum += periods * (periods + 1) * pvFaceValue;
    priceSum += pvFaceValue;
    
    // 计算凸度
    const convexity = convexitySum / (priceSum * Math.pow(1 + r, 2));
    
    return convexity / Math.pow(paymentsPerYear, 2); // 转换为年度凸度
  },
  
  // 计算债券价格对收益率变化的敏感性
  calculateBondPriceSensitivity: function(faceValue, couponRate, marketRate, years, paymentsPerYear = 1, yieldChange = 0.01) {
    const basePrice = this.calculateBondPrice(faceValue, couponRate, marketRate, years, paymentsPerYear);
    const newPrice = this.calculateBondPrice(faceValue, couponRate, marketRate + yieldChange, years, paymentsPerYear);
    
    return {
      priceChange: newPrice - basePrice,
      percentageChange: ((newPrice - basePrice) / basePrice) * 100
    };
  },
  
  // 计算零息债券价格
  calculateZeroCouponBondPrice: function(faceValue, marketRate, years) {
    const r = marketRate / 100;
    return faceValue / Math.pow(1 + r, years);
  },
  
  // 计算零息债券收益率
  calculateZeroCouponBondYield: function(price, faceValue, years) {
    return (Math.pow(faceValue / price, 1 / years) - 1) * 100;
  },
  
  // 计算股票价格（使用股息贴现模型）
  calculateStockPrice: function(dividendPerShare, growthRate, requiredRate) {
    if (requiredRate <= growthRate) {
      throw new Error('要求收益率必须大于增长率');
    }
    
    // 使用戈登增长模型
    return dividendPerShare * (1 + growthRate / 100) / ((requiredRate - growthRate) / 100);
  },
  
  // 计算股票预期收益率（使用股息贴现模型）
  calculateStockExpectedReturn: function(price, dividendPerShare, growthRate) {
    return (dividendPerShare / price + growthRate / 100) * 100;
  },
  
  // 计算资本资产定价模型(CAPM)预期收益率
  calculateCAPM: function(riskFreeRate, beta, marketReturn) {
    return riskFreeRate + beta * (marketReturn - riskFreeRate);
  },
  
  // 计算加权平均资本成本(WACC)
  calculateWACC: function(equityValue, debtValue, costOfEquity, costOfDebt, taxRate) {
    const totalValue = equityValue + debtValue;
    const equityWeight = equityValue / totalValue;
    const debtWeight = debtValue / totalValue;
    
    return equityWeight * costOfEquity + debtWeight * costOfDebt * (1 - taxRate / 100);
  },
  
  // 计算期权价格（使用Black-Scholes模型）
  calculateOptionPrice: function(type, stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility, dividend = 0) {
    // 确保类型有效
    if (type !== 'call' && type !== 'put') {
      throw new Error('期权类型必须是"call"或"put"');
    }
    
    // 转换为小数
    const r = riskFreeRate / 100;
    const q = dividend / 100;
    const sigma = volatility / 100;
    
    // 计算d1和d2
    const d1 = (Math.log(stockPrice / strikePrice) + (r - q + sigma * sigma / 2) * timeToExpiry) / (sigma * Math.sqrt(timeToExpiry));
    const d2 = d1 - sigma * Math.sqrt(timeToExpiry);
    
    // 计算标准正态累积分布函数
    const cdf = function(x) {
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;
      
      const sign = x < 0 ? -1 : 1;
      x = Math.abs(x) / Math.sqrt(2);
      
      const t = 1 / (1 + p * x);
      const erf = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
      
      return 0.5 * (1 + sign * erf);
    };
    
    // 计算期权价格
    if (type === 'call') {
      return stockPrice * Math.exp(-q * timeToExpiry) * cdf(d1) - strikePrice * Math.exp(-r * timeToExpiry) * cdf(d2);
    } else {
      return strikePrice * Math.exp(-r * timeToExpiry) * cdf(-d2) - stockPrice * Math.exp(-q * timeToExpiry) * cdf(-d1);
    }
  },
  
  // 计算期权希腊字母（使用Black-Scholes模型）
  calculateOptionGreeks: function(type, stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility, dividend = 0) {
    // 确保类型有效
    if (type !== 'call' && type !== 'put') {
      throw new Error('期权类型必须是"call"或"put"');
    }
    
    // 转换为小数
    const r = riskFreeRate / 100;
    const q = dividend / 100;
    const sigma = volatility / 100;
    
    // 计算d1和d2
    const d1 = (Math.log(stockPrice / strikePrice) + (r - q + sigma * sigma / 2) * timeToExpiry) / (sigma * Math.sqrt(timeToExpiry));
    const d2 = d1 - sigma * Math.sqrt(timeToExpiry);
    
    // 计算标准正态概率密度函数
    const pdf = function(x) {
      return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    };
    
    // 计算标准正态累积分布函数
    const cdf = function(x) {
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;
      
      const sign = x < 0 ? -1 : 1;
      x = Math.abs(x) / Math.sqrt(2);
      
      const t = 1 / (1 + p * x);
      const erf = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
      
      return 0.5 * (1 + sign * erf);
    };
    
    // 计算希腊字母
    let delta, gamma, theta, vega, rho;
    
    // Delta
    if (type === 'call') {
      delta = Math.exp(-q * timeToExpiry) * cdf(d1);
    } else {
      delta = Math.exp(-q * timeToExpiry) * (cdf(d1) - 1);
    }
    
    // Gamma (对于看涨和看跌期权相同)
    gamma = Math.exp(-q * timeToExpiry) * pdf(d1) / (stockPrice * sigma * Math.sqrt(timeToExpiry));
    
    // Theta
    const term1 = -(stockPrice * sigma * Math.exp(-q * timeToExpiry) * pdf(d1)) / (2 * Math.sqrt(timeToExpiry));
    if (type === 'call') {
      theta = term1 - r * strikePrice * Math.exp(-r * timeToExpiry) * cdf(d2) + q * stockPrice * Math.exp(-q * timeToExpiry) * cdf(d1);
    } else {
      theta = term1 + r * strikePrice * Math.exp(-r * timeToExpiry) * cdf(-d2) - q * stockPrice * Math.exp(-q * timeToExpiry) * cdf(-d1);
    }
    theta = theta / 365; // 转换为每天
    
    // Vega (对于看涨和看跌期权相同)
    vega = stockPrice * Math.exp(-q * timeToExpiry) * pdf(d1) * Math.sqrt(timeToExpiry) / 100; // 除以100使其表示为每1%变化
    
    // Rho
    if (type === 'call') {
      rho = strikePrice * timeToExpiry * Math.exp(-r * timeToExpiry) * cdf(d2) / 100; // 除以100使其表示为每1%变化
    } else {
      rho = -strikePrice * timeToExpiry * Math.exp(-r * timeToExpiry) * cdf(-d2) / 100;
    }
    
    return { delta, gamma, theta, vega, rho };
  },
  
  // 计算风险价值(VaR)
  calculateVaR: function(portfolioValue, confidenceLevel, volatility, timeHorizon = 1) {
    // 转换为小数
    const alpha = 1 - confidenceLevel / 100;
    const sigma = volatility / 100;
    
    // 计算z值（标准正态分布的分位数）
    const z = this.calculateNormalQuantile(1 - alpha);
    
    // 计算VaR
    return portfolioValue * z * sigma * Math.sqrt(timeHorizon);
  },
  
  // 计算标准正态分布的分位数（近似值）
  calculateNormalQuantile: function(p) {
    if (p <= 0 || p >= 1) {
      throw new Error('概率必须在0和1之间');
    }
    
    // 使用Acklam's近似
    if (p < 0.5) {
      return -this._normalQuantileApproximation(p);
    } else {
      return this._normalQuantileApproximation(1 - p);
    }
  },
  
  // 标准正态分布分位数的辅助函数
  _normalQuantileApproximation: function(p) {
    const a1 = -39.6968302866538;
    const a2 = 220.946098424521;
    const a3 = -275.928510446969;
    const a4 = 138.357751867269;
    const a5 = -30.6647980661472;
    const a6 = 2.50662827745924;
    
    const b1 = -54.4760987982241;
    const b2 = 161.585836858041;
    const b3 = -155.698979859887;
    const b4 = 66.8013118877197;
    const b5 = -13.2806815528857;
    
    const c1 = -7.78489400243029E-03;
    const c2 = -0.322396458041136;
    const c3 = -2.40075827716184;
    const c4 = -2.54973253934373;
    const c5 = 4.37466414146497;
    const c6 = 2.93816398269878;
    
    const d1 = 7.78469570904146E-03;
    const d2 = 0.32246712907004;
    const d3 = 2.445134137143;
    const d4 = 3.75440866190742;
    
    // 低概率区域使用对数变换
    if (p < 1e-6) {
      const q = Math.sqrt(-2 * Math.log(p));
      return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
             ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }
    
    const q = p - 0.5;
    const r = q * q;
    
    return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
           (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
  },
  
  // 计算条件风险价值(CVaR/Expected Shortfall)
  calculateCVaR: function(portfolioValue, confidenceLevel, volatility, timeHorizon = 1) {
    // 转换为小数
    const alpha = 1 - confidenceLevel / 100;
    const sigma = volatility / 100;
    
    // 计算z值（标准正态分布的分位数）
    const z = this.calculateNormalQuantile(1 - alpha);
    
    // 计算标准正态概率密度函数在z处的值
    const pdf = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
    
    // 计算CVaR
    return portfolioValue * sigma * Math.sqrt(timeHorizon) * pdf / alpha;
  },
  
  // 计算投资组合方差
  calculatePortfolioVariance: function(weights, covariances) {
    if (weights.length !== covariances.length) {
      throw new Error('权重数组和协方差矩阵维度不匹配');
    }
    
    let variance = 0;
    
    for (let i = 0; i < weights.length; i++) {
      for (let j = 0; j < weights.length; j++) {
        variance += weights[i] * weights[j] * covariances[i][j];
      }
    }
    
    return variance;
  },
  
  // 计算投资组合标准差
  calculatePortfolioStdDev: function(weights, covariances) {
    return Math.sqrt(this.calculatePortfolioVariance(weights, covariances));
  },
  
  // 计算投资组合预期收益率
  calculatePortfolioReturn: function(weights, returns) {
    if (weights.length !== returns.length) {
      throw new Error('权重数组和收益率数组长度不匹配');
    }
    
    let expectedReturn = 0;
    
    for (let i = 0; i < weights.length; i++) {
      expectedReturn += weights[i] * returns[i];
    }
    
    return expectedReturn;
  },
  
  // 计算夏普比率
  calculateSharpeRatio: function(portfolioReturn, riskFreeRate, portfolioStdDev) {
    return (portfolioReturn - riskFreeRate) / portfolioStdDev;
  },
  
  // 计算特雷诺比率
  calculateTreynorRatio: function(portfolioReturn, riskFreeRate, beta) {
    return (portfolioReturn - riskFreeRate) / beta;
  },
  
  // 计算信息比率
  calculateInformationRatio: function(portfolioReturn, benchmarkReturn, trackingError) {
    return (portfolioReturn - benchmarkReturn) / trackingError;
  },
  
  // 计算索提诺比率
  calculateSortinoRatio: function(portfolioReturn, riskFreeRate, downsideDeviation) {
    return (portfolioReturn - riskFreeRate) / downsideDeviation;
  },
  
  // 计算下行偏差
  calculateDownsideDeviation: function(returns, targetReturn = 0) {
    let sum = 0;
    let count = 0;
    
    for (const r of returns) {
      if (r < targetReturn) {
        sum += Math.pow(targetReturn - r, 2);
        count++;
      }
    }
    
    return count > 0 ? Math.sqrt(sum / count) : 0;
  },
  
  // 计算最大回撤
  calculateMaxDrawdown: function(prices) {
    if (!prices || prices.length < 2) return 0;
    
    let maxDrawdown = 0;
    let peak = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > peak) {
        peak = prices[i];
      } else {
        const drawdown = (peak - prices[i]) / peak;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
      }
    }
    
    return maxDrawdown * 100; // 转换为百分比
  },
  
  // 矩阵运算
  matrix: {
    // 创建矩阵
    create: function(rows, cols, initialValue = 0) {
      const matrix = [];
      for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
          row.push(initialValue);
        }
        matrix.push(row);
      }
      return matrix;
    },
    
    // 创建单位矩阵
    identity: function(size) {
      const matrix = this.create(size, size, 0);
      for (let i = 0; i < size; i++) {
        matrix[i][i] = 1;
      }
      return matrix;
    },
    
    // 矩阵加法
    add: function(matrixA, matrixB) {
      if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
        throw new Error('矩阵维度不匹配');
      }
      
      const rows = matrixA.length;
      const cols = matrixA[0].length;
      const result = this.create(rows, cols);
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          result[i][j] = matrixA[i][j] + matrixB[i][j];
        }
      }
      
      return result;
    },
    
    // 矩阵减法
    subtract: function(matrixA, matrixB) {
      if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
        throw new Error('矩阵维度不匹配');
      }
      
      const rows = matrixA.length;
      const cols = matrixA[0].length;
      const result = this.create(rows, cols);
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          result[i][j] = matrixA[i][j] - matrixB[i][j];
        }
      }
      
      return result;
    },
    
    // 矩阵乘法
    multiply: function(matrixA, matrixB) {
      const rowsA = matrixA.length;
      const colsA = matrixA[0].length;
      const rowsB = matrixB.length;
      const colsB = matrixB[0].length;
      
      if (colsA !== rowsB) {
        throw new Error('矩阵维度不匹配');
      }
      
      const result = this.create(rowsA, colsB);
      
      for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
          let sum = 0;
          for (let k = 0; k < colsA; k++) {
            sum += matrixA[i][k] * matrixB[k][j];
          }
          result[i][j] = sum;
        }
      }
      
      return result;
    },
    
    // 矩阵转置
    transpose: function(matrix) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      const result = this.create(cols, rows);
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          result[j][i] = matrix[i][j];
        }
      }
      
      return result;
    },
    
    // 矩阵行列式（仅适用于2x2和3x3矩阵）
    determinant: function(matrix) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      
      if (rows !== cols) {
        throw new Error('只能计算方阵的行列式');
      }
      
      if (rows === 1) {
        return matrix[0][0];
      } else if (rows === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      } else if (rows === 3) {
        return matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
               matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
               matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
      } else {
        throw new Error('目前只支持3x3及以下矩阵的行列式计算');
      }
    },
    
    // 矩阵求逆（仅适用于2x2和3x3矩阵）
    inverse: function(matrix) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      
      if (rows !== cols) {
        throw new Error('只能计算方阵的逆矩阵');
      }
      
      const det = this.determinant(matrix);
      
      if (Math.abs(det) < 1e-10) {
        throw new Error('矩阵不可逆');
      }
      
      if (rows === 1) {
        return [[1 / matrix[0][0]]];
      } else if (rows === 2) {
        const result = this.create(2, 2);
        result[0][0] = matrix[1][1] / det;
        result[0][1] = -matrix[0][1] / det;
        result[1][0] = -matrix[1][0] / det;
        result[1][1] = matrix[0][0] / det;
        return result;
      } else if (rows === 3) {
        const result = this.create(3, 3);
        
        // 计算余子式
        const cofactor = (i, j) => {
          const subMatrix = [];
          for (let r = 0; r < 3; r++) {
            if (r === i) continue;
            const row = [];
            for (let c = 0; c < 3; c++) {
              if (c === j) continue;
              row.push(matrix[r][c]);
            }
            subMatrix.push(row);
          }
          const sign = ((i + j) % 2 === 0) ? 1 : -1;
          return sign * this.determinant(subMatrix);
        };
        
        // 计算伴随矩阵
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            result[j][i] = cofactor(i, j) / det; // 注意这里i和j交换了位置，实现了转置
          }
        }
        
        return result;
      } else {
        throw new Error('目前只支持3x3及以下矩阵的逆矩阵计算');
      }
    },
    
    // 矩阵标量乘法
    scalarMultiply: function(matrix, scalar) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      const result = this.create(rows, cols);
      
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          result[i][j] = matrix[i][j] * scalar;
        }
      }
      
      return result;
    },
    
    // 矩阵的迹（对角线元素之和）
    trace: function(matrix) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      
      if (rows !== cols) {
        throw new Error('只能计算方阵的迹');
      }
      
      let sum = 0;
      for (let i = 0; i < rows; i++) {
        sum += matrix[i][i];
      }
      
      return sum;
    },
    
    // 矩阵是否对称
    isSymmetric: function(matrix) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      
      if (rows !== cols) {
        return false;
      }
      
      for (let i = 0; i < rows; i++) {
        for (let j = i + 1; j < cols; j++) {
          if (matrix[i][j] !== matrix[j][i]) {
            return false;
          }
        }
      }
      
      return true;
    }
  },
  
  // 统计学函数
  statistics: {
    // 计算样本偏度
    skewness: function(arr) {
      if (!arr || arr.length < 3) return 0;
      
      const n = arr.length;
      const mean = DuobaoMath.average(arr);
      const stdDev = DuobaoMath.standardDeviation(arr);
      
      if (stdDev === 0) return 0;
      
      let sum = 0;
      for (const val of arr) {
        sum += Math.pow((val - mean) / stdDev, 3);
      }
      
      // 使用Fisher-Pearson系数
      return (n / ((n - 1) * (n - 2))) * sum;
    },
    
    // 计算样本峰度
    kurtosis: function(arr) {
      if (!arr || arr.length < 4) return 0;
      
      const n = arr.length;
      const mean = DuobaoMath.average(arr);
      const stdDev = DuobaoMath.standardDeviation(arr);
      
      if (stdDev === 0) return 0;
      
      let sum = 0;
      for (const val of arr) {
        sum += Math.pow((val - mean) / stdDev, 4);
      }
      
      // 使用Fisher定义（正态分布的峰度为0）
      return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum - (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
    },
    
    // 计算几何平均数
    geometricMean: function(arr) {
      if (!arr || arr.length === 0) return 0;
      if (arr.some(val => val <= 0)) throw new Error('几何平均数只适用于正数');
      
      let product = 1;
      for (const val of arr) {
        product *= val;
      }
      
      return Math.pow(product, 1 / arr.length);
    },
    
    // 计算调和平均数
    harmonicMean: function(arr) {
      if (!arr || arr.length === 0) return 0;
      if (arr.some(val => val <= 0)) throw new Error('调和平均数只适用于正数');
      
      let sum = 0;
      for (const val of arr) {
        sum += 1 / val;
      }
      
      return arr.length / sum;
    },
    
    // 计算加权几何平均数
    weightedGeometricMean: function(values, weights) {
      if (!values || !weights || values.length !== weights.length || values.length === 0) {
        return 0;
      }
      
      if (values.some(val => val <= 0)) throw new Error('几何平均数只适用于正数');
      
      const weightSum = weights.reduce((acc, val) => acc + val, 0);
      
      let product = 1;
      for (let i = 0; i < values.length; i++) {
        product *= Math.pow(values[i], weights[i] / weightSum);
      }
      
      return product;
    },
    
    // 计算样本协方差矩阵
    covarianceMatrix: function(data) {
      if (!data || data.length === 0 || !data[0] || data[0].length === 0) {
        throw new Error('数据不能为空');
      }
      
      const n = data.length; // 样本数
      const p = data[0].length; // 变量数
      
      // 计算每个变量的均值
      const means = [];
      for (let j = 0; j < p; j++) {
        let sum = 0;
        for (let i = 0; i < n; i++) {
          sum += data[i][j];
        }
        means.push(sum / n);
      }
      
      // 计算协方差矩阵
      const covariance = DuobaoMath.matrix.create(p, p, 0);
      
      for (let i = 0; i < p; i++) {
        for (let j = i; j < p; j++) {
          let sum = 0;
          for (let k = 0; k < n; k++) {
            sum += (data[k][i] - means[i]) * (data[k][j] - means[j]);
          }
          
          const cov = sum / (n - 1);
          covariance[i][j] = cov;
          covariance[j][i] = cov; // 协方差矩阵是对称的
        }
      }
      
      return covariance;
    },
    
    // 计算相关系数矩阵
    correlationMatrix: function(data) {
      const covariance = this.covarianceMatrix(data);
      const p = covariance.length;
      
      // 提取标准差
      const stdDevs = [];
      for (let i = 0; i < p; i++) {
        stdDevs.push(Math.sqrt(covariance[i][i]));
      }
      
      // 计算相关系数
      const correlation = DuobaoMath.matrix.create(p, p, 0);
      
      for (let i = 0; i < p; i++) {
        for (let j = 0; j < p; j++) {
          if (stdDevs[i] === 0 || stdDevs[j] === 0) {
            correlation[i][j] = 0;
          } else {
            correlation[i][j] = covariance[i][j] / (stdDevs[i] * stdDevs[j]);
          }
        }
      }
      
      return correlation;
    },
    
    // 计算Spearman等级相关系数
    spearmanCorrelation: function(arrX, arrY) {
      if (!arrX || !arrY || arrX.length !== arrY.length || arrX.length === 0) {
        return 0;
      }
      
      // 计算排名
      const rankify = arr => {
        const sorted = [...arr].sort((a, b) => a - b);
        const ranks = arr.map(val => sorted.indexOf(val) + 1);
        return ranks;
      };
      
      const ranksX = rankify(arrX);
      const ranksY = rankify(arrY);
      
      // 计算排名差的平方和
      let d2Sum = 0;
      for (let i = 0; i < arrX.length; i++) {
        d2Sum += Math.pow(ranksX[i] - ranksY[i], 2);
      }
      
      // 使用Spearman公式
      const n = arrX.length;
      return 1 - (6 * d2Sum) / (n * (n * n - 1));
    },
    
    // 计算Kendall等级相关系数
    kendallCorrelation: function(arrX, arrY) {
      if (!arrX || !arrY || arrX.length !== arrY.length || arrX.length === 0) {
        return 0;
      }
      
      const n = arrX.length;
      let concordant = 0;
      let discordant = 0;
      
      for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
          const signX = Math.sign(arrX[i] - arrX[j]);
          const signY = Math.sign(arrY[i] - arrY[j]);
          
          if (signX === signY) {
            concordant++;
          } else if (signX !== 0 && signY !== 0) {
            discordant++;
          }
        }
      }
      
      return (concordant - discordant) / Math.sqrt((concordant + discordant + 0.0) * (concordant + discordant + 0.0));
    },
    
    // 计算变异系数
    coefficientOfVariation: function(arr) {
      if (!arr || arr.length === 0) return 0;
      
      const mean = DuobaoMath.average(arr);
      if (mean === 0) return 0;
      
      const stdDev = DuobaoMath.standardDeviation(arr);
      return (stdDev / mean) * 100; // 转换为百分比
    },
    
    // 计算Z分数
    zScores: function(arr) {
      if (!arr || arr.length === 0) return [];
      
      const mean = DuobaoMath.average(arr);
      const stdDev = DuobaoMath.standardDeviation(arr);
      
      if (stdDev === 0) return arr.map(() => 0);
      
      return arr.map(val => (val - mean) / stdDev);
    },
    
    // 计算分位数回归
    quantileRegression: function(arrX, arrY, quantile = 0.5, iterations = 1000) {
      if (!arrX || !arrY || arrX.length !== arrY.length || arrX.length < 2) {
        return { slope: 0, intercept: 0 };
      }
      
      // 初始化参数
      const n = arrX.length;
      let slope = 0;
      let intercept = DuobaoMath.percentile(arrY, quantile * 100);
      
      // 迭代优化
      for (let iter = 0; iter < iterations; iter++) {
        // 计算残差
        const residuals = [];
        for (let i = 0; i < n; i++) {
          residuals.push(arrY[i] - (intercept + slope * arrX[i]));
        }
        
        // 计算梯度
        let gradIntercept = 0;
        let gradSlope = 0;
        
        for (let i = 0; i < n; i++) {
          const sign = residuals[i] < 0 ? quantile - 1 : quantile;
          gradIntercept += sign;
          gradSlope += sign * arrX[i];
        }
        
        // 更新参数
        const learningRate = 0.01 / Math.sqrt(iter + 1);
        intercept -= learningRate * gradIntercept / n;
        slope -= learningRate * gradSlope / n;
      }
      
      return { slope, intercept };
    },
    
    // 计算多元线性回归
    multipleLinearRegression: function(X, y) {
      if (!X || !y || X.length !== y.length || X.length === 0) {
        return { coefficients: [], intercept: 0, r2: 0 };
      }
      
      const n = X.length; // 样本数
      const p = X[0].length; // 特征数
      
      // 添加截距项
      const X_with_intercept = X.map(row => [1, ...row]);
      
      // 计算 X^T * X
      const XtX = [];
      for (let i = 0; i <= p; i++) {
        XtX.push([]);
        for (let j = 0; j <= p; j++) {
          let sum = 0;
          for (let k = 0; k < n; k++) {
            sum += X_with_intercept[k][i] * X_with_intercept[k][j];
          }
          XtX[i].push(sum);
        }
      }
      
      // 计算 X^T * y
      const Xty = [];
      for (let i = 0; i <= p; i++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += X_with_intercept[k][i] * y[k];
        }
        Xty.push(sum);
      }
      
      // 求解线性方程组 XtX * beta = Xty
      // 使用高斯消元法
      const augmentedMatrix = XtX.map((row, i) => [...row, Xty[i]]);
      
      // 高斯消元
      for (let i = 0; i <= p; i++) {
        // 找到主元
        let maxRow = i;
        for (let j = i + 1; j <= p; j++) {
          if (Math.abs(augmentedMatrix[j][i]) > Math.abs(augmentedMatrix[maxRow][i])) {
            maxRow = j;
          }
        }
        
        // 交换行
        [augmentedMatrix[i], augmentedMatrix[maxRow]] = [augmentedMatrix[maxRow], augmentedMatrix[i]];
        
        // 消元
        for (let j = i + 1; j <= p; j++) {
          const factor = augmentedMatrix[j][i] / augmentedMatrix[i][i];
          for (let k = i; k <= p + 1; k++) {
            augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
          }
        }
      }
      
      // 回代
      const beta = new Array(p + 1).fill(0);
      for (let i = p; i >= 0; i--) {
        let sum = augmentedMatrix[i][p + 1];
        for (let j = i + 1; j <= p; j++) {
          sum -= augmentedMatrix[i][j] * beta[j];
        }
        beta[i] = sum / augmentedMatrix[i][i];
      }
      
      // 提取截距和系数
      const intercept = beta[0];
      const coefficients = beta.slice(1);
      
      // 计算R^2
      const yMean = y.reduce((sum, val) => sum + val, 0) / n;
      let ssTot = 0;
      let ssRes = 0;
      
      for (let i = 0; i < n; i++) {
        let yPred = intercept;
        for (let j = 0; j < p; j++) {
          yPred += coefficients[j] * X[i][j];
        }
        
        ssTot += Math.pow(y[i] - yMean, 2);
        ssRes += Math.pow(y[i] - yPred, 2);
      }
      
      const r2 = 1 - ssRes / ssTot;
      
      return { coefficients, intercept, r2 };
    }
  },
  
  // 几何学函数
  geometry: {
    // 计算点到直线的距离
    pointToLineDistance: function(px, py, x1, y1, x2, y2) {
      const A = y2 - y1;
      const B = x1 - x2;
      const C = x2 * y1 - x1 * y2;
      
      return Math.abs(A * px + B * py + C) / Math.sqrt(A * A + B * B);
    },
    
    // 判断点是否在多边形内部
    isPointInPolygon: function(px, py, polygon) {
      if (!polygon || polygon.length < 3) return false;
      
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0];
        const yi = polygon[i][1];
        const xj = polygon[j][0];
        const yj = polygon[j][1];
        
        const intersect = ((yi > py) !== (yj > py)) &&
                          (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
        
        if (intersect) inside = !inside;
      }
      
      return inside;
    },
    
    // 计算多边形面积
    polygonArea: function(polygon) {
      if (!polygon || polygon.length < 3) return 0;
      
      let area = 0;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        area += (polygon[j][0] + polygon[i][0]) * (polygon[j][1] - polygon[i][1]);
      }
      
      return Math.abs(area) / 2;
    },
    
    // 计算多边形周长
    polygonPerimeter: function(polygon) {
      if (!polygon || polygon.length < 2) return 0;
      
      let perimeter = 0;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const dx = polygon[i][0] - polygon[j][0];
        const dy = polygon[i][1] - polygon[j][1];
        perimeter += Math.sqrt(dx * dx + dy * dy);
      }
      
      return perimeter;
    },
    
    // 计算两条线段是否相交
    doLinesIntersect: function(x1, y1, x2, y2, x3, y3, x4, y4) {
      // 计算方向
      const d1 = this._direction(x3, y3, x4, y4, x1, y1);
      const d2 = this._direction(x3, y3, x4, y4, x2, y2);
      const d3 = this._direction(x1, y1, x2, y2, x3, y3);
      const d4 = this._direction(x1, y1, x2, y2, x4, y4);
      
      // 判断是否相交
      return (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
              ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) ||
             (d1 === 0 && this._onSegment(x3, y3, x4, y4, x1, y1)) ||
             (d2 === 0 && this._onSegment(x3, y3, x4, y4, x2, y2)) ||
             (d3 === 0 && this._onSegment(x1, y1, x2, y2, x3, y3)) ||
             (d4 === 0 && this._onSegment(x1, y1, x2, y2, x4, y4));
    },
    
    // 辅助函数：计算方向
    _direction: function(x1, y1, x2, y2, x3, y3) {
      return (x3 - x1) * (y2 - y1) - (x2 - x1) * (y3 - y1);
    },
    
    // 辅助函数：判断点是否在线段上
    _onSegment: function(x1, y1, x2, y2, px, py) {
      return px >= Math.min(x1, x2) && px <= Math.max(x1, x2) &&
             py >= Math.min(y1, y2) && py <= Math.max(y1, y2);
    },
    
    // 计算两个圆是否相交
    doCirclesIntersect: function(x1, y1, r1, x2, y2, r2) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      return distance <= r1 + r2;
    },
    
    // 计算圆与矩形是否相交
    doesCircleIntersectRectangle: function(cx, cy, r, rx, ry, rw, rh) {
      // 找到矩形上离圆心最近的点
      const closestX = Math.max(rx, Math.min(cx, rx + rw));
      const closestY = Math.max(ry, Math.min(cy, ry + rh));
      
      // 计算圆心到这个点的距离
      const dx = closestX - cx;
      const dy = closestY - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      return distance <= r;
    },
    
    // 计算贝塞尔曲线上的点
    bezierPoint: function(t, points) {
      if (!points || points.length < 2) {
        throw new Error('至少需要两个控制点');
      }
      
      // 递归计算贝塞尔曲线上的点
      const calculate = (t, points) => {
        if (points.length === 1) {
          return points[0];
        }
        
        const newPoints = [];
        for (let i = 0; i < points.length - 1; i++) {
          newPoints.push([
            points[i][0] * (1 - t) + points[i + 1][0] * t,
            points[i][1] * (1 - t) + points[i + 1][1] * t
          ]);
        }
        
        return calculate(t, newPoints);
      };
      
      return calculate(t, points);
    },
    
    // 计算三角形重心
    triangleCentroid: function(x1, y1, x2, y2, x3, y3) {
      return [(x1 + x2 + x3) / 3, (y1 + y2 + y3) / 3];
    },
    
    // 计算三角形外心
    triangleCircumcenter: function(x1, y1, x2, y2, x3, y3) {
      const d = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
      
      if (Math.abs(d) < 1e-10) {
        throw new Error('三角形是退化的');
      }
      
      const x = ((x1 * x1 + y1 * y1) * (y2 - y3) + (x2 * x2 + y2 * y2) * (y3 - y1) + (x3 * x3 + y3 * y3) * (y1 - y2)) / d;
      const y = ((x1 * x1 + y1 * y1) * (x3 - x2) + (x2 * x2 + y2 * y2) * (x1 - x3) + (x3 * x3 + y3 * y3) * (x2 - x1)) / d;
      
      return [x, y];
    },
    
    // 计算三角形内心
    triangleIncenter: function(x1, y1, x2, y2, x3, y3) {
      // 计算三边长
      const a = Math.sqrt(Math.pow(x2 - x3, 2) + Math.pow(y2 - y3, 2));
      const b = Math.sqrt(Math.pow(x1 - x3, 2) + Math.pow(y1 - y3, 2));
      const c = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
      
      const x = (a * x1 + b * x2 + c * x3) / (a + b + c);
      const y = (a * y1 + b * y2 + c * y3) / (a + b + c);
      
      return [x, y];
    },
    
    // 计算三角形垂心
    triangleOrthocenter: function(x1, y1, x2, y2, x3, y3) {
      // 计算三角形重心
      const centroid = this.triangleCentroid(x1, y1, x2, y2, x3, y3);
      
      // 计算三角形外心
      const circumcenter = this.triangleCircumcenter(x1, y1, x2, y2, x3, y3);
      
      // 根据欧拉线定理：垂心 = 3 * 重心 - 2 * 外心
      return [
        3 * centroid[0] - 2 * circumcenter[0],
        3 * centroid[1] - 2 * circumcenter[1]
      ];
    },
    
    // 计算点到平面的距离
    pointToPlaneDistance: function(px, py, pz, a, b, c, d) {
      return Math.abs(a * px + b * py + c * pz + d) / Math.sqrt(a * a + b * b + c * c);
    },
    
    // 计算两个平面的交线
    planePlaneIntersection: function(a1, b1, c1, d1, a2, b2, c2, d2) {
      // 计算两个平面法向量的叉积，得到交线的方向向量
      const dirX = b1 * c2 - c1 * b2;
      const dirY = c1 * a2 - a1 * c2;
      const dirZ = a1 * b2 - b1 * a2;
      
      // 检查两个平面是否平行
      if (Math.abs(dirX) < 1e-10 && Math.abs(dirY) < 1e-10 && Math.abs(dirZ) < 1e-10) {
        throw new Error('平面平行或重合');
      }
      
      // 计算交线上的一点
      let x0, y0, z0;
      
      if (Math.abs(dirX) >= Math.abs(dirY) && Math.abs(dirX) >= Math.abs(dirZ)) {
        // x分量最大，令x=0
        x0 = 0;
        z0 = (b1 * d2 - b2 * d1) / (b1 * c2 - b2 * c1);
        y0 = (c1 * d2 - c2 * d1) / (c2 * b1 - c1 * b2);
      } else if (Math.abs(dirY) >= Math.abs(dirZ)) {
        // y分量最大，令y=0
        y0 = 0;
        x0 = (c1 * d2 - c2 * d1) / (c1 * a2 - c2 * a1);
        z0 = (a1 * d2 - a2 * d1) / (a2 * c1 - a1 * c2);
      } else {
        // z分量最大，令z=0
        z0 = 0;
        x0 = (b1 * d2 - b2 * d1) / (b2 * a1 - b1 * a2);
        y0 = (a1 * d2 - a2 * d1) / (a1 * b2 - a2 * b1);
      }
      
      return {
        point: [x0, y0, z0],
        direction: [dirX, dirY, dirZ]
      };
    }
  }
