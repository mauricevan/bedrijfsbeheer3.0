export const csvValidators = {
  isNumber: (value: string): boolean => !isNaN(Number(value)) && value.trim() !== '',
  isPositiveNumber: (value: string): boolean => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  },
  isEmail: (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  isPhoneNumber: (value: string): boolean => /^(\+31|0031|0)[1-9][0-9]{8}$/.test(value.replace(/[\s-]/g, '')),
  isDate: (value: string): boolean => !isNaN(new Date(value).getTime()),
};

export const csvTransformers = {
  toNumber: (value: string): number => Number(value) || 0,
  toBoolean: (value: string): boolean => {
    const lowerValue = value.toLowerCase().trim();
    return lowerValue === 'ja' || lowerValue === 'yes' || lowerValue === 'true' || lowerValue === '1';
  },
  toDate: (value: string): Date => new Date(value),
  toUpperCase: (value: string): string => value.toUpperCase(),
  toLowerCase: (value: string): string => value.toLowerCase(),
  trim: (value: string): string => value.trim(),
};
