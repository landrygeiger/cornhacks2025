export const setProperty =
  <T>(obj: T) =>
  <K extends keyof T>(property: K) =>
  (newValue: T[K]) => ({ ...obj, [property]: newValue });

export const updateProperty =
  <T>(setState: (fn: (x: T) => T) => void) =>
  <K extends keyof T>(field: K) =>
  (newValue: T[K]) =>
    setState((x) => setProperty(x)(field)(newValue));

export const validAndInRange = (num: string, min: number, max: number) => {
  const val = parseFloat(num);
  return !isNaN(val) && val >= min && val <= max;
};
