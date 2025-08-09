/**
 * 多宝工具库 - 日期处理工具
 */

window.DuobaoDate = window.DuobaoDate || {};

// 扩展日期处理工具
Object.assign(window.DuobaoDate, {
  // 日期格式化
  format: function(date, format) {
    if (!date) return '';
    
    const o = {
      "M+": date.getMonth() + 1,                 // 月份
      "d+": date.getDate(),                      // 日
      "h+": date.getHours(),                     // 小时
      "m+": date.getMinutes(),                   // 分
      "s+": date.getSeconds(),                   // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
      "S": date.getMilliseconds()                // 毫秒
    };

    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (let k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }

    return format;
  },
  
  // 常用格式化模板
  formatTemplates: {
    date: 'yyyy-MM-dd',
    time: 'hh:mm:ss',
    dateTime: 'yyyy-MM-dd hh:mm:ss',
    shortDate: 'yy-MM-dd',
    shortTime: 'hh:mm',
    shortDateTime: 'yy-MM-dd hh:mm',
    chineseDate: 'yyyy年MM月dd日',
    chineseTime: 'hh时mm分ss秒',
    chineseDateTime: 'yyyy年MM月dd日 hh时mm分ss秒',
    slashDate: 'yyyy/MM/dd',
    slashDateTime: 'yyyy/MM/dd hh:mm:ss',
    isoDate: 'yyyy-MM-dd',
    isoDateTime: 'yyyy-MM-ddThh:mm:ss',
    isoDateTimeZ: 'yyyy-MM-ddThh:mm:ssZ',
    utcDateTime: 'yyyy-MM-ddThh:mm:ss.SSSZ'
  },
  
  // 使用模板格式化日期
  formatWithTemplate: function(date, templateName) {
    if (!date) return '';
    
    const template = this.formatTemplates[templateName] || this.formatTemplates.dateTime;
    return this.format(date, template);
  },
  
  // 解析日期字符串
  parse: function(dateString, format) {
    if (!dateString) return null;
    
    // 如果没有指定格式，尝试使用原生解析
    if (!format) {
      const timestamp = Date.parse(dateString);
      return isNaN(timestamp) ? null : new Date(timestamp);
    }
    
    // 根据格式解析日期
    const now = new Date();
    let year = now.getFullYear();
    let month = 0;
    let day = 1;
    let hour = 0;
    let minute = 0;
    let second = 0;
    let millisecond = 0;
    
    // 提取年份
    const yearMatch = format.match(/(y+)/);
    if (yearMatch) {
      const yearIndex = format.indexOf(yearMatch[0]);
      const yearLength = yearMatch[0].length;
      const yearValue = dateString.substr(yearIndex, yearLength);
      
      if (yearLength === 2) {
        // 处理两位数年份
        const century = Math.floor(now.getFullYear() / 100) * 100;
        year = century + parseInt(yearValue, 10);
      } else {
        year = parseInt(yearValue, 10);
      }
    }
    
    // 提取月份
    const monthMatch = format.match(/(M+)/);
    if (monthMatch) {
      const monthIndex = format.indexOf(monthMatch[0]);
      const monthLength = monthMatch[0].length;
      const monthValue = dateString.substr(monthIndex, monthLength);
      
      month = parseInt(monthValue, 10) - 1;
    }
    
    // 提取日期
    const dayMatch = format.match(/(d+)/);
    if (dayMatch) {
      const dayIndex = format.indexOf(dayMatch[0]);
      const dayLength = dayMatch[0].length;
      const dayValue = dateString.substr(dayIndex, dayLength);
      
      day = parseInt(dayValue, 10);
    }
    
    // 提取小时
    const hourMatch = format.match(/(h+)/);
    if (hourMatch) {
      const hourIndex = format.indexOf(hourMatch[0]);
      const hourLength = hourMatch[0].length;
      const hourValue = dateString.substr(hourIndex, hourLength);
      
      hour = parseInt(hourValue, 10);
    }
    
    // 提取分钟
    const minuteMatch = format.match(/(m+)/);
    if (minuteMatch) {
      const minuteIndex = format.indexOf(minuteMatch[0]);
      const minuteLength = minuteMatch[0].length;
      const minuteValue = dateString.substr(minuteIndex, minuteLength);
      
      minute = parseInt(minuteValue, 10);
    }
    
    // 提取秒数
    const secondMatch = format.match(/(s+)/);
    if (secondMatch) {
      const secondIndex = format.indexOf(secondMatch[0]);
      const secondLength = secondMatch[0].length;
      const secondValue = dateString.substr(secondIndex, secondLength);
      
      second = parseInt(secondValue, 10);
    }
    
    // 提取毫秒
    const millisecondMatch = format.match(/(S+)/);
    if (millisecondMatch) {
      const millisecondIndex = format.indexOf(millisecondMatch[0]);
      const millisecondLength = millisecondMatch[0].length;
      const millisecondValue = dateString.substr(millisecondIndex, millisecondLength);
      
      millisecond = parseInt(millisecondValue, 10);
    }
    
    return new Date(year, month, day, hour, minute, second, millisecond);
  },
  
  // 获取当前日期时间
  now: function() {
    return new Date();
  },
  
  // 获取当前时间戳（毫秒）
  timestamp: function() {
    return Date.now();
  },
  
  // 获取当前时间戳（秒）
  unixTimestamp: function() {
    return Math.floor(Date.now() / 1000);
  },
  
  // 创建日期对象
  create: function(year, month, day, hour = 0, minute = 0, second = 0, millisecond = 0) {
    return new Date(year, month - 1, day, hour, minute, second, millisecond);
  },
  
  // 从时间戳创建日期对象
  fromTimestamp: function(timestamp, isMilliseconds = true) {
    return new Date(isMilliseconds ? timestamp : timestamp * 1000);
  },
  
  // 克隆日期对象
  clone: function(date) {
    return new Date(date.getTime());
  },
  
  // 日期操作
  addYears: function(date, years) {
    const result = this.clone(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  },
  
  addMonths: function(date, months) {
    const result = this.clone(date);
    result.setMonth(result.getMonth() + months);
    return result;
  },
  
  addDays: function(date, days) {
    const result = this.clone(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  
  addHours: function(date, hours) {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
  },
  
  addMinutes: function(date, minutes) {
    return new Date(date.getTime() + minutes * 60 * 1000);
  },
  
  addSeconds: function(date, seconds) {
    return new Date(date.getTime() + seconds * 1000);
  },
  
  addMilliseconds: function(date, milliseconds) {
    return new Date(date.getTime() + milliseconds);
  },
  
  // 日期差值计算
  diff: function(date1, date2, unit = 'milliseconds') {
    const diffMs = date2.getTime() - date1.getTime();
    
    switch (unit.toLowerCase()) {
      case 'years':
        return this.diffInYears(date1, date2);
      case 'months':
        return this.diffInMonths(date1, date2);
      case 'days':
        return this.diffInDays(date1, date2);
      case 'hours':
        return diffMs / (1000 * 60 * 60);
      case 'minutes':
        return diffMs / (1000 * 60);
      case 'seconds':
        return diffMs / 1000;
      case 'milliseconds':
      default:
        return diffMs;
    }
  },
  
  diffInYears: function(date1, date2) {
    const years = date2.getFullYear() - date1.getFullYear();
    const months = date2.getMonth() - date1.getMonth();
    const days = date2.getDate() - date1.getDate();
    
    if (months < 0 || (months === 0 && days < 0)) {
      return years - 1;
    }
    
    return years;
  },
  
  diffInMonths: function(date1, date2) {
    const years = date2.getFullYear() - date1.getFullYear();
    const months = date2.getMonth() - date1.getMonth();
    const days = date2.getDate() - date1.getDate();
    
    if (days < 0) {
      return years * 12 + months - 1;
    }
    
    return years * 12 + months;
  },
  
  diffInDays: function(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  },
  
  diffInHours: function(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(timeDiff / (1000 * 60 * 60));
  },
  
  diffInMinutes: function(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(timeDiff / (1000 * 60));
  },
  
  diffInSeconds: function(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(timeDiff / 1000);
  },
  
  // 日期比较
  isBefore: function(date1, date2) {
    return date1.getTime() < date2.getTime();
  },
  
  isAfter: function(date1, date2) {
    return date1.getTime() > date2.getTime();
  },
  
  isSame: function(date1, date2) {
    return date1.getTime() === date2.getTime();
  },
  
  isBetween: function(date, start, end, inclusive = true) {
    if (inclusive) {
      return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
    } else {
      return date.getTime() > start.getTime() && date.getTime() < end.getTime();
    }
  },
  
  // 日期判断
  isLeapYear: function(year) {
    if (year instanceof Date) {
      year = year.getFullYear();
    }
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  },
  
  isToday: function(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  },
  
  isYesterday: function(date) {
    const yesterday = this.addDays(new Date(), -1);
    return date.getDate() === yesterday.getDate() &&
           date.getMonth() === yesterday.getMonth() &&
           date.getFullYear() === yesterday.getFullYear();
  },
  
  isTomorrow: function(date) {
    const tomorrow = this.addDays(new Date(), 1);
    return date.getDate() === tomorrow.getDate() &&
           date.getMonth() === tomorrow.getMonth() &&
           date.getFullYear() === tomorrow.getFullYear();
  },
  
  isSameDay: function(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  },
  
  isSameMonth: function(date1, date2) {
    return date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  },
  
  isSameYear: function(date1, date2) {
    return date1.getFullYear() === date2.getFullYear();
  },
  
  isWeekend: function(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  },
  
  isWeekday: function(date) {
    return !this.isWeekend(date);
  },
  
  isPast: function(date) {
    return date.getTime() < Date.now();
  },
  
  isFuture: function(date) {
    return date.getTime() > Date.now();
  },
  
  isValid: function(date) {
    return date instanceof Date && !isNaN(date.getTime());
  },
  
  // 日期获取
  startOfDay: function(date) {
    const result = this.clone(date);
    result.setHours(0, 0, 0, 0);
    return result;
  },
  
  endOfDay: function(date) {
    const result = this.clone(date);
    result.setHours(23, 59, 59, 999);
    return result;
  },
  
  startOfWeek: function(date, startDay = 0) {
    const result = this.clone(date);
    const day = result.getDay();
    const diff = (day < startDay ? 7 : 0) + day - startDay;
    result.setDate(result.getDate() - diff);
    result.setHours(0, 0, 0, 0);
    return result;
  },
  
  endOfWeek: function(date, startDay = 0) {
    const result = this.startOfWeek(date, startDay);
    result.setDate(result.getDate() + 6);
    result.setHours(23, 59, 59, 999);
    return result;
  },
  
  startOfMonth: function(date) {
    const result = this.clone(date);
    result.setDate(1);
    result.setHours(0, 0, 0, 0);
    return result;
  },
  
  endOfMonth: function(date) {
    const result = this.clone(date);
    result.setMonth(result.getMonth() + 1, 0);
    result.setHours(23, 59, 59, 999);
    return result;
  },
  
  startOfYear: function(date) {
    const result = this.clone(date);
    result.setMonth(0, 1);
    result.setHours(0, 0, 0, 0);
    return result;
  },
  
  endOfYear: function(date) {
    const result = this.clone(date);
    result.setMonth(11, 31);
    result.setHours(23, 59, 59, 999);
    return result;
  },
  
  startOfQuarter: function(date) {
    const result = this.clone(date);
    const quarter = Math.floor(result.getMonth() / 3);
    result.setMonth(quarter * 3, 1);
    result.setHours(0, 0, 0, 0);
    return result;
  },
  
  endOfQuarter: function(date) {
    const result = this.startOfQuarter(date);
    result.setMonth(result.getMonth() + 3, 0);
    result.setHours(23, 59, 59, 999);
    return result;
  },
  
  // 日期信息获取
  daysInMonth: function(year, month) {
    if (year instanceof Date) {
      month = year.getMonth();
      year = year.getFullYear();
    } else if (month instanceof Date) {
      month = month.getMonth();
    }
    
    return new Date(year, month + 1, 0).getDate();
  },
  
  daysInYear: function(year) {
    if (year instanceof Date) {
      year = year.getFullYear();
    }
    
    return this.isLeapYear(year) ? 366 : 365;
  },
  
  dayOfYear: function(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  },
  
  weekOfYear: function(date, startDay = 0) {
    const start = this.startOfYear(date);
    const firstWeekStart = this.startOfWeek(start, startDay);
    
    // 如果第一周的开始日期在年份之前，则调整为年份的第一天
    if (firstWeekStart < start) {
      firstWeekStart.setDate(firstWeekStart.getDate() + 7);
    }
    
    const diff = date - firstWeekStart;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek) + 1;
  },
  
  quarter: function(date) {
    return Math.floor(date.getMonth() / 3) + 1;
  },
  
  // 日期范围生成
  range: function(start, end, step = 1, unit = 'days') {
    const result = [];
    let current = this.clone(start);
    
    while (current <= end) {
      result.push(this.clone(current));
      
      switch (unit.toLowerCase()) {
        case 'years':
          current = this.addYears(current, step);
          break;
        case 'months':
          current = this.addMonths(current, step);
          break;
        case 'days':
          current = this.addDays(current, step);
          break;
        case 'hours':
          current = this.addHours(current, step);
          break;
        case 'minutes':
          current = this.addMinutes(current, step);
          break;
        case 'seconds':
          current = this.addSeconds(current, step);
          break;
        default:
          current = this.addDays(current, step);
      }
    }
    
    return result;
  },
  
  // 日期数组操作
  min: function(dates) {
    if (!dates || dates.length === 0) return null;
    return new Date(Math.min.apply(null, dates.map(date => date.getTime())));
  },
  
  max: function(dates) {
    if (!dates || dates.length === 0) return null;
    return new Date(Math.max.apply(null, dates.map(date => date.getTime())));
  },
  
  sort: function(dates, ascending = true) {
    if (!dates || dates.length === 0) return [];
    
    return [...dates].sort((a, b) => {
      return ascending ? a.getTime() - b.getTime() : b.getTime() - a.getTime();
    });
  },
  
  // 相对时间描述
  timeAgo: function(date, locale = 'zh-CN') {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    const intervals = {
      'zh-CN': {
        year: ['年前', 31536000],
        month: ['个月前', 2592000],
        week: ['周前', 604800],
        day: ['天前', 86400],
        hour: ['小时前', 3600],
        minute: ['分钟前', 60],
        second: ['秒前', 1],
        just: '刚刚'
      },
      'en-US': {
        year: [' years ago', ' year ago', 31536000],
        month: [' months ago', ' month ago', 2592000],
        week: [' weeks ago', ' week ago', 604800],
        day: [' days ago', ' day ago', 86400],
        hour: [' hours ago', ' hour ago', 3600],
        minute: [' minutes ago', ' minute ago', 60],
        second: [' seconds ago', ' second ago', 1],
        just: 'just now'
      }
    };
    
    const lang = intervals[locale] || intervals['en-US'];
    
    if (seconds < 5) {
      return lang.just;
    }
    
    for (const [key, value] of Object.entries(lang)) {
      if (key === 'just') continue;
      
      const interval = locale === 'zh-CN' ? value[1] : value[2];
      const count = Math.floor(seconds / interval);
      
      if (count >= 1) {
        if (locale === 'zh-CN') {
          return count + value[0];
        } else {
          return count + (count === 1 ? value[1] : value[0]);
        }
      }
    }
    
    return lang.just;
  },
  
  // 日历生成
  calendar: function(year, month, options = {}) {
    const {
      startDay = 0,      // 0表示周日，1表示周一
      includeAdjacentMonths = true,
      weekCount = 6      // 日历显示的周数
    } = options;
    
    if (year instanceof Date) {
      month = year.getMonth();
      year = year.getFullYear();
    }
    
    const result = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // 计算第一天是星期几
    let firstDayOfWeek = firstDay.getDay();
    
    // 调整第一天的星期，使其与startDay对齐
    firstDayOfWeek = (firstDayOfWeek - startDay + 7) % 7;
    
    // 计算上个月需要显示的天数
    const daysFromPrevMonth = firstDayOfWeek;
    
    // 计算下个月需要显示的天数
    const totalDays = weekCount * 7;
    const daysFromNextMonth = totalDays - daysFromPrevMonth - daysInMonth;
    
    // 获取上个月的最后几天
    if (includeAdjacentMonths && daysFromPrevMonth > 0) {
      const prevMonth = month - 1 < 0 ? 11 : month - 1;
      const prevYear = month - 1 < 0 ? year - 1 : year;
      const prevMonthDays = new Date(prevYear, prevMonth + 1, 0).getDate();
      
      for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
        result.push({
          date: new Date(prevYear, prevMonth, i),
          day: i,
          month: prevMonth,
          year: prevYear,
          isCurrentMonth: false,
          isPrevMonth: true,
          isNextMonth: false
        });
      }
    } else if (daysFromPrevMonth > 0) {
      // 如果不包含相邻月份，则添加空占位符
      for (let i = 0; i < daysFromPrevMonth; i++) {
        result.push(null);
      }
    }
    
    // 获取当前月的所有天
    for (let i = 1; i <= daysInMonth; i++) {
      result.push({
        date: new Date(year, month, i),
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true,
        isPrevMonth: false,
        isNextMonth: false
      });
    }
    
    // 获取下个月的前几天
    if (includeAdjacentMonths && daysFromNextMonth > 0) {
      const nextMonth = month + 1 > 11 ? 0 : month + 1;
      const nextYear = month + 1 > 11 ? year + 1 : year;
      
      for (let i = 1; i <= daysFromNextMonth; i++) {
        result.push({
          date: new Date(nextYear, nextMonth, i),
          day: i,
          month: nextMonth,
          year: nextYear,
          isCurrentMonth: false,
          isPrevMonth: false,
          isNextMonth: true
        });
      }
    } else if (daysFromNextMonth > 0) {
      // 如果不包含相邻月份，则添加空占位符
      for (let i = 0; i < daysFromNextMonth; i++) {
        result.push(null);
      }
    }
    
    // 将日历数据分组为周
    const weeks = [];
    for (let i = 0; i < result.length; i += 7) {
      weeks.push(result.slice(i, i + 7));
    }
    
    return {
      year,
      month,
      days: result,
      weeks
    };
  },
  
  // 工作日计算
  addWorkDays: function(date, days) {
    const result = this.clone(date);
    let remainingDays = days;
    
    while (remainingDays > 0) {
      result.setDate(result.getDate() + 1);
      
      if (!this.isWeekend(result)) {
        remainingDays--;
      }
    }
    
    return result;
  },
  
  subtractWorkDays: function(date, days) {
    const result = this.clone(date);
    let remainingDays = days;
    
    while (remainingDays > 0) {
      result.setDate(result.getDate() - 1);
      
      if (!this.isWeekend(result)) {
        remainingDays--;
      }
    }
    
    return result;
  },
  
  countWorkDays: function(startDate, endDate) {
    let count = 0;
    const current = this.clone(startDate);
    
    while (current <= endDate) {
      if (!this.isWeekend(current)) {
        count++;
      }
      
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  },
  
  // 农历相关（基础支持）
  lunarInfo: [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0
  ],
  
  // 天干
  gan: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
  
  // 地支
  zhi: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
  
  // 生肖
  animals: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
  
  // 农历月份
  lunarMonths: ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'],
  
  // 农历日期
  lunarDays: [
    '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
  ],
  
  // 节气
  solarTerms: [
    '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
    '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
    '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
    '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
  ],
  
  // 节气对应的公历日期（大致值，实际需要通过天文计算）
  solarTermDates: [
    [1, 5], [1, 20], [2, 4], [2, 19], [3, 6], [3, 21],
    [4, 5], [4, 20], [5, 6], [5, 21], [6, 6], [6, 21],
    [7, 7], [7, 23], [8, 8], [8, 23], [9, 8], [9, 23],
    [10, 8], [10, 24], [11, 8], [11, 23], [12, 7], [12, 22]
  ],
  
  // 获取农历年的总天数
  getLunarYearDays: function(year) {
    let sum = 348;
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      sum += (this.lunarInfo[year - 1900] & i) ? 1 : 0;
    }
    return sum + this.getLeapMonthDays(year);
  },
  
  // 获取农历年闰月的天数
  getLeapMonthDays: function(year) {
    if (this.getLeapMonth(year)) {
      return (this.lunarInfo[year - 1900] & 0x10000) ? 30 : 29;
    }
    return 0;
  },
  
  // 获取农历年闰月月份，如果没有闰月返回0
  getLeapMonth: function(year) {
    return this.lunarInfo[year - 1900] & 0xf;
  },
  
  // 获取农历年某月的天数
  getLunarMonthDays: function(year, month) {
    return (this.lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29;
  },
  
  // 公历日期转农历日期
  solarToLunar: function(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 验证日期范围
    if (year < 1900 || year > 2100) {
      return null;
    }
    
    // 计算与1900年1月31日相差的天数
    const baseDate = new Date(1900, 0, 31);
    let offset = Math.floor((date - baseDate) / 86400000);
    
    // 用offset减去每农历年的天数，计算当前农历年
    let lunarYear = 1900;
    let daysInLunarYear = 0;
    
    for (lunarYear = 1900; lunarYear < 2101 && offset > 0; lunarYear++) {
      daysInLunarYear = this.getLunarYearDays(lunarYear);
      offset -= daysInLunarYear;
    }
    
    if (offset < 0) {
      offset += daysInLunarYear;
      lunarYear--;
    }
    
    // 计算农历月
    const leapMonth = this.getLeapMonth(lunarYear); // 闰月
    let isLeap = false;
    
    let lunarMonth = 1;
    let daysInLunarMonth = 0;
    
    // 用offset减去每农历月的天数，计算当前农历月
    for (lunarMonth = 1; lunarMonth <= 12 && offset > 0; lunarMonth++) {
      // 闰月
      if (leapMonth > 0 && lunarMonth === (leapMonth + 1) && !isLeap) {
        lunarMonth--;
        isLeap = true;
        daysInLunarMonth = this.getLeapMonthDays(lunarYear);
      } else {
        daysInLunarMonth = this.getLunarMonthDays(lunarYear, lunarMonth);
      }
      
      // 解除闰月
      if (isLeap && lunarMonth === (leapMonth + 1)) {
        isLeap = false;
      }
      
      offset -= daysInLunarMonth;
    }
    
    // 如果恰好减完，月份为上个月
    if (offset === 0 && leapMonth > 0 && lunarMonth === leapMonth + 1) {
      if (isLeap) {
        isLeap = false;
      } else {
        isLeap = true;
        lunarMonth--;
      }
    }
    
    // 如果offset小于0，月份减一
    if (offset < 0) {
      offset += daysInLunarMonth;
      lunarMonth--;
    }
    
    // 计算农历日
    const lunarDay = offset + 1;
    
    // 计算天干地支年
    const ganIndex = (lunarYear - 3) % 10;
    const zhiIndex = (lunarYear - 3) % 12;
    
    // 计算天干地支月
    // 月干支索引
    let monthGanIndex = (lunarYear % 5 * 2 + (lunarMonth - 1)) % 10;
    let monthZhiIndex = (lunarMonth + 1) % 12;
    
    if (monthZhiIndex === 0) monthZhiIndex = 12;
    
    // 计算天干地支日
    const baseGanIndex = 5; // 1900-1-31是庚辰日
    const baseZhiIndex = 5;
    const dayCyclical = Math.floor((date - baseDate) / 86400000) + 40; // 1900-1-31是第40个天干地支日
    const dayGanIndex = dayCyclical % 10;
    const dayZhiIndex = dayCyclical % 12;
    
    return {
      lunarYear,
      lunarMonth,
      lunarDay,
      isLeap,
      ganYear: this.gan[ganIndex],
      zhiYear: this.zhi[zhiIndex],
      ganMonth: this.gan[monthGanIndex],
      zhiMonth: this.zhi[monthZhiIndex],
      ganDay: this.gan[dayGanIndex],
      zhiDay: this.zhi[dayZhiIndex],
      animal: this.animals[zhiIndex],
      lunarMonthName: (isLeap ? '闰' : '') + this.lunarMonths[lunarMonth - 1],
      lunarDayName: this.lunarDays[lunarDay - 1],
      gzYear: this.gan[ganIndex] + this.zhi[zhiIndex],
      gzMonth: this.gan[monthGanIndex] + this.zhi[monthZhiIndex],
      gzDay: this.gan[dayGanIndex] + this.zhi[dayZhiIndex]
    };
  },
  
  // 农历日期转公历日期（简化版）
  lunarToSolar: function(lunarYear, lunarMonth, lunarDay, isLeap = false) {
    // 验证日期范围
    if (lunarYear < 1900 || lunarYear > 2100) {
      return null;
    }
    
    // 计算从1900年1月31日到当前农历年正月初一的天数
    let offset = 0;
    for (let i = 1900; i < lunarYear; i++) {
      offset += this.getLunarYearDays(i);
    }
    
    // 计算到当前农历月初一的天数
    const leapMonth = this.getLeapMonth(lunarYear);
    
    for (let i = 1; i < lunarMonth; i++) {
      offset += this.getLunarMonthDays(lunarYear, i);
      if (i === leapMonth) {
        offset += this.getLeapMonthDays(lunarYear);
      }
    }
    
    // 如果是闰月，加上前面的月天数
    if (isLeap && leapMonth === lunarMonth) {
      offset += this.getLunarMonthDays(lunarYear, lunarMonth);
    }
    
    // 加上当前农历日期
    offset += lunarDay - 1;
    
    // 计算公历日期
    const baseDate = new Date(1900, 0, 31);
    const solarDate = new Date(baseDate.getTime() + offset * 86400000);
    
    return solarDate;
  },
  
  // 获取节气
  getSolarTerm: function(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 简化版，仅根据大致日期判断
    for (let i = 0; i < 24; i++) {
      const [termMonth, termDay] = this.solarTermDates[i];
      if (month === termMonth && day === termDay) {
        return this.solarTerms[i];
      }
    }
    
    return null;
  },
  
  // 获取农历节日
  getLunarFestival: function(lunarMonth, lunarDay) {
    const festivals = {
      '1-1': '春节',
      '1-15': '元宵节',
      '2-2': '龙抬头',
      '5-5': '端午节',
      '7-7': '七夕节',
      '7-15': '中元节',
      '8-15': '中秋节',
      '9-9': '重阳节',
      '10-1': '寒衣节',
      '10-15': '下元节',
      '12-8': '腊八节',
      '12-23': '小年',
      '12-30': '除夕'
    };
    
    const key = `${lunarMonth}-${lunarDay}`;
    return festivals[key] || null;
  },
  
  // 获取公历节日
  getSolarFestival: function(month, day) {
    const festivals = {
      '1-1': '元旦',
      '2-14': '情人节',
      '3-8': '妇女节',
      '3-12': '植树节',
      '4-1': '愚人节',
      '4-22': '地球日',
      '5-1': '劳动节',
      '5-4': '青年节',
      '6-1': '儿童节',
      '7-1': '建党节',
      '8-1': '建军节',
      '9-10': '教师节',
      '10-1': '国庆节',
      '10-31': '万圣节',
      '11-11': '光棍节',
      '12-24': '平安夜',
      '12-25': '圣诞节'
    };
    
    const key = `${month}-${day}`;
    return festivals[key] || null;
  },
  
  // 获取日期的完整信息（公历+农历+节日+节气）
  getDateInfo: function(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 获取农历信息
    const lunar = this.solarToLunar(date);
    
    // 获取节气
    const solarTerm = this.getSolarTerm(date);
    
    // 获取公历节日
    const solarFestival = this.getSolarFestival(month, day);
    
    // 获取农历节日
    const lunarFestival = lunar ? this.getLunarFestival(lunar.lunarMonth, lunar.lunarDay) : null;
    
    return {
      solar: {
        year,
        month,
        day,
        date,
        festival: solarFestival,
        term: solarTerm
      },
      lunar: lunar,
      festivals: [solarFestival, lunarFestival].filter(Boolean)
    };
  },
  
  // 获取指定年月的日历（包含农历信息）
  getMonthCalendar: function(year, month, options = {}) {
    const calendar = this.calendar(year, month, options);
    
    // 添加农历信息
    calendar.days = calendar.days.map(day => {
      if (day) {
        const dateInfo = this.getDateInfo(day.date);
        return {
          ...day,
          lunar: dateInfo.lunar,
          solarTerm: dateInfo.solar.term,
          solarFestival: dateInfo.solar.festival,
          lunarFestival: dateInfo.festivals.find(f => f !== dateInfo.solar.festival),
          festivals: dateInfo.festivals
        };
      }
      return day;
    });
    
    return calendar;
  }
});

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.DuobaoDate;
}
