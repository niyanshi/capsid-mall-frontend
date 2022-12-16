export const weekMapZh = ['日', '一', '二', '三', '四', '五', '六'];
export const weekMapEn = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
export const monthMapZh = [
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '十一',
  '十二',
];
export const monthMapEn = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];
export interface CalendarItem {
  year: number;
  month: number;
  day: number;
  isCurrentMonth: boolean;
}
const magicNumber = {
  four: 4,
  oneHundred: 100,
  twentyNine: 29,
  twentyEight: 28,
  thirty: 30,
  thirtyOne: 31,
  eleven: 11,
};
// 是否为闰年
const isLeap = (year: number) =>
  // eslint-disable-next-line no-extra-parens
  (year % magicNumber.four === 0 && year % magicNumber.oneHundred !== 0) ||
  year % magicNumber.oneHundred === 0;

// 获取xx年xx月有几天
const getDays = (year: number, month: number): number => {
  const feb = isLeap(year) ? magicNumber.twentyNine : magicNumber.twentyEight;
  const daysPerMonth = [
    magicNumber.thirtyOne,
    feb,
    magicNumber.thirtyOne,
    magicNumber.thirty,
    magicNumber.thirtyOne,
    magicNumber.thirty,
    magicNumber.thirtyOne,
    magicNumber.thirtyOne,
    magicNumber.thirty,
    magicNumber.thirtyOne,
    magicNumber.thirty,
    magicNumber.thirtyOne,
  ];
  return daysPerMonth[month];
};
// 获取下个月/上个月有多少天
const getNextOrLastMonthDays = (date: Date, type: 'next' | 'last') => {
  const month = date.getMonth();
  const year = date.getFullYear();
  if (type === 'last') {
    const lastMonth = month === 0 ? magicNumber.eleven : month - 1;
    const lastYear = lastMonth === magicNumber.eleven ? year - 1 : year;
    return {
      year: lastYear,
      month: lastMonth,
      days: getDays(lastYear, lastMonth),
    };
  }
  const nextMonth = month === magicNumber.eleven ? 0 : month + 1;
  const nextYear = nextMonth === 0 ? year + 1 : year;
  return {
    year: nextYear,
    month: nextMonth,
    days: getDays(nextYear, nextMonth),
  };
};
const calendarGrid = 42;
export const generateCalendar = (date: Date) => {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  // 当月天数
  const days = getDays(currentYear, currentMonth);
  // 获取上月末尾天数和下月开头的天数，用于填补当月日历空白
  const {
    days: lastMonthDays,
    year: lastMonthYear,
    month: lastMonth,
  } = getNextOrLastMonthDays(date, 'last');
  const { year: nextMonthYear, month: nextMonthMonth } = getNextOrLastMonthDays(date, 'next');
  // 1号是星期几
  const weekIndex = new Date(`${currentYear}, ${currentMonth + 1}, 1`).getDay();
  // 显示在当月末尾的下月天数
  const trailDays = calendarGrid - weekIndex - days;
  let trailVal = 0;
  const calendarTable: CalendarItem[] = [];
  for (let i = 0; i < calendarGrid; i++) {
    if (i < weekIndex) {
      // 补充上月天数
      calendarTable[i] = {
        year: lastMonthYear,
        month: lastMonth,
        day: lastMonthDays - weekIndex + i + 1,
        isCurrentMonth: false,
      };
    } else if (i >= days + weekIndex) {
      // 补充下月天数
      if (trailVal < trailDays) {
        trailVal += 1;
      }
      calendarTable[i] = {
        year: nextMonthYear,
        month: nextMonthMonth,
        day: trailVal,
        isCurrentMonth: false,
      };
    }
  }
  // 填充当月日期
  for (let d = 1; d <= days; d++) {
    calendarTable[weekIndex + d - 1] = {
      year: currentYear,
      month: currentMonth,
      day: d,
      isCurrentMonth: true,
    };
  }
  return calendarTable;
};
