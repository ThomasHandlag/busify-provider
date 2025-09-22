/**
 * Currency formatting utilities for Vietnamese Dong (VND)
 */

/**
 * Formats a number as Vietnamese currency with thousands separators
 * @param value - The numeric value to format
 * @returns Formatted string with thousands separators (e.g., "1,000,000")
 */
export const formatCurrency = (value: number | string | undefined): string => {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '';
  }
  
  return numValue.toLocaleString('vi-VN');
};

/**
 * Formats a number as Vietnamese currency with VND suffix
 * @param value - The numeric value to format
 * @returns Formatted string with thousands separators and VND suffix (e.g., "1,000,000 VND")
 */
export const formatCurrencyWithSuffix = (value: number | string | undefined): string => {
  const formatted = formatCurrency(value);
  return formatted ? `${formatted} VND` : '';
};

/**
 * Parses a formatted currency string back to a number
 * @param value - The formatted currency string (e.g., "1,000,000" or "1.000.000")
 * @returns The numeric value
 */
export const parseCurrency = (value: string | undefined): number => {
  if (!value) return 0;
  
  // Remove all non-digit characters except decimal point
  const cleanValue = value.replace(/[^\d.,]/g, '');
  
  // Handle both comma and dot as thousands separators
  // If there's a comma or dot followed by exactly 3 digits at the end, treat it as decimal
  // Otherwise, treat commas and dots as thousands separators
  const lastCommaIndex = cleanValue.lastIndexOf(',');
  const lastDotIndex = cleanValue.lastIndexOf('.');
  
  let numericValue = cleanValue;
  
  // If the last comma or dot is followed by exactly 3 digits, it's likely a decimal separator
  if (lastCommaIndex > lastDotIndex && lastCommaIndex === cleanValue.length - 4) {
    // Comma is decimal separator
    numericValue = cleanValue.substring(0, lastCommaIndex).replace(/[,.]/g, '') + 
                   '.' + cleanValue.substring(lastCommaIndex + 1);
  } else if (lastDotIndex > lastCommaIndex && lastDotIndex === cleanValue.length - 4) {
    // Dot is decimal separator
    numericValue = cleanValue.substring(0, lastDotIndex).replace(/[,.]/g, '') + 
                   '.' + cleanValue.substring(lastDotIndex + 1);
  } else {
    // No decimal part, remove all separators
    numericValue = cleanValue.replace(/[,.]/g, '');
  }
  
  const parsed = parseFloat(numericValue);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Input formatter for Ant Design InputNumber component
 * Formats the display value with thousands separators
 */
export const currencyInputFormatter = (value: string | number | undefined): string => {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  
  const numValue = typeof value === 'string' ? parseCurrency(value) : value;
  return formatCurrency(numValue);
};

/**
 * Input parser for Ant Design InputNumber component
 * Parses the formatted string back to a number
 */
export const currencyInputParser = (value: string | undefined): number => {
  return parseCurrency(value);
};