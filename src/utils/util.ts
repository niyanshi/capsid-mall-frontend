// 将科学计数法转换为数字
export const toNonExponential = (num: number) => {
  const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  // eslint-disable-next-line no-magic-numbers
  if (m) return num.toFixed(Math.max(0, (m[1] || '').length - Number(m[2])));
  else return num;
};
// 数组去重
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const unique = (arr: any[], uniId: string) => {
  const res = new Map();
  return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
};
