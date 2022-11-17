export function sum(values: number[]) {
  return values.reduce((sum, value) => {
    return sum + value;
  }, 0);
}
