import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date | number): string {
  if (!date) return '';
  let parsedDate: Date;
  
  if (typeof date === 'string') {
    parsedDate = new Date(date);
  } else if (typeof date === 'number') {
    parsedDate = new Date(date); // Handle timestamp
  } else {
    parsedDate = date; // Already a Date object
  }
  
  // Check if the date is valid
  if (isNaN(parsedDate.getTime())) {
    return '';
  }
  
  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(date: string | Date | number): string {
  if (!date) return '';
  let parsedDate: Date;
  
  if (typeof date === 'string') {
    parsedDate = new Date(date);
  } else if (typeof date === 'number') {
    parsedDate = new Date(date); // Handle timestamp
  } else {
    parsedDate = date; // Already a Date object
  }
  
  // Check if the date is valid
  if (isNaN(parsedDate.getTime())) {
    return '';
  }
  
  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatYear(date: string | Date | number): string {
  if (!date) return '';
  let parsedDate: Date;
  
  if (typeof date === 'string') {
    parsedDate = new Date(date);
  } else if (typeof date === 'number') {
    parsedDate = new Date(date); // Handle timestamp
  } else {
    parsedDate = date; // Already a Date object
  }
  
  // Check if the date is valid
  if (isNaN(parsedDate.getTime())) {
    return '';
  }
  
  return parsedDate.getFullYear().toString();
}

export function renderStars(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '☆' : '') + 
         '☆'.repeat(emptyStars);
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function capitalizeFirst(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Genre color mapping for better UI
export const genreColors: Record<string, string> = {
  fiction: 'bg-blue-100 text-blue-800',
  mystery: 'bg-purple-100 text-purple-800',
  romance: 'bg-pink-100 text-pink-800',
  'science-fiction': 'bg-green-100 text-green-800',
  fantasy: 'bg-indigo-100 text-indigo-800',
  thriller: 'bg-red-100 text-red-800',
  horror: 'bg-gray-100 text-gray-800',
  biography: 'bg-yellow-100 text-yellow-800',
  history: 'bg-orange-100 text-orange-800',
  'self-help': 'bg-teal-100 text-teal-800',
  default: 'bg-gray-100 text-gray-800',
};

export function getGenreColor(genre: string): string {
  return genreColors[genre.toLowerCase()] || genreColors.default;
}
