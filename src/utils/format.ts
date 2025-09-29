import { ethers } from 'ethers';

/**
 * Format a number as currency with proper decimals
 */
export const formatCurrency = (amount: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

/**
 * Format a large number with K, M, B suffixes
 */
export const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  }
  return num.toFixed(2);
};

/**
 * Format token amount with proper decimals
 */
export const formatTokenAmount = (amount: string | number, decimals: number = 18, displayDecimals: number = 4): string => {
  try {
    const amountStr = typeof amount === 'number' ? amount.toString() : amount;
    const formatted = ethers.formatUnits(amountStr, decimals);
    const num = parseFloat(formatted);
    
    if (num === 0) return '0';
    if (num < 0.0001) return '< 0.0001';
    
    return num.toFixed(displayDecimals).replace(/\.?0+$/, '');
  } catch (error) {
    console.error('Error formatting token amount:', error);
    return '0';
  }
};

/**
 * Format percentage with proper decimals
 */
export const formatPercentage = (percentage: number | undefined, decimals: number = 2): string => {
  const value = typeof percentage === 'number' && isFinite(percentage) ? percentage : 0;
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format address to show first and last few characters
 */
export const formatAddress = (address: string, startChars: number = 6, endChars: number = 4): string => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Format transaction hash
 */
export const formatTxHash = (hash: string): string => {
  return formatAddress(hash, 8, 6);
};

/**
 * Format time ago from timestamp
 */
export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
};

/**
 * Format date from timestamp
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format APY with color coding
 */
export const formatAPY = (apy: number): { value: string; color: string } => {
  const formatted = formatPercentage(apy);
  let color = 'text-green-600';
  
  if (apy < 5) {
    color = 'text-red-600';
  } else if (apy < 10) {
    color = 'text-yellow-600';
  }
  
  return { value: formatted, color };
};

/**
 * Parse token amount to wei
 */
export const parseTokenAmount = (amount: string, decimals: number = 18): string => {
  try {
    return ethers.parseUnits(amount, decimals).toString();
  } catch (error) {
    console.error('Error parsing token amount:', error);
    return '0';
  }
};

/**
 * Validate if string is a valid number
 */
export const isValidNumber = (value: string): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(parseFloat(value)) && parseFloat(value) > 0;
};

/**
 * Validate if string is a valid Ethereum address
 */
export const isValidAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
};

/**
 * Get status color for transaction status
 */
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'success':
      return 'text-green-600 bg-green-100';
    case 'pending':
    case 'processing':
      return 'text-yellow-600 bg-yellow-100';
    case 'failed':
    case 'error':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

/**
 * Calculate slippage amount
 */
export const calculateSlippage = (amount: string, slippagePercent: number): string => {
  try {
    const amountNum = parseFloat(amount);
    const slippageAmount = amountNum * (slippagePercent / 100);
    return (amountNum - slippageAmount).toFixed(6);
  } catch (error) {
    console.error('Error calculating slippage:', error);
    return amount;
  }
};