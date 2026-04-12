export const roundToTwo = (num) => {
  if (num === null || num === undefined) return num;
  const value = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
};
