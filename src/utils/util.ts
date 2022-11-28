// 将科学计数法转换为数字
export const toNonExponential = (num: number) => {
  const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  // eslint-disable-next-line no-magic-numbers
  if (m) return num.toFixed(Math.max(0, (m[1] || '').length - Number(m[2])));
  else return num;
};
