
// Security utilities for input validation and sanitization
export const SECURITY_LIMITS = {
  MAX_TEXT_LENGTH: 10000,
  MAX_SALE_PRICE: 1000000,
  MAX_QUANTITY: 10000,
  MIN_PRICE: 0,
  MIN_QUANTITY: 0.1,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

// Sanitize text input to prevent XSS
export const sanitizeText = (input: string): string => {
  if (!input) return '';
  
  // Remove potentially dangerous HTML tags and scripts
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
    .slice(0, SECURITY_LIMITS.MAX_TEXT_LENGTH);
};

// Validate numeric inputs for sales
export const validateSaleInput = (
  quantity: number, 
  price: number
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (quantity < SECURITY_LIMITS.MIN_QUANTITY || quantity > SECURITY_LIMITS.MAX_QUANTITY) {
    errors.push(`Quantity must be between ${SECURITY_LIMITS.MIN_QUANTITY} and ${SECURITY_LIMITS.MAX_QUANTITY}`);
  }
  
  if (price < SECURITY_LIMITS.MIN_PRICE || price > SECURITY_LIMITS.MAX_SALE_PRICE) {
    errors.push(`Price must be between $${SECURITY_LIMITS.MIN_PRICE} and $${SECURITY_LIMITS.MAX_SALE_PRICE}`);
  }
  
  if (!Number.isFinite(quantity) || !Number.isFinite(price)) {
    errors.push('Invalid numeric values detected');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate file uploads
export const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
  if (file.size > SECURITY_LIMITS.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${SECURITY_LIMITS.MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }
  
  if (!SECURITY_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only JPEG, PNG, and WebP images are allowed'
    };
  }
  
  return { isValid: true };
};

// Rate limiting helper
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, number[]>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    requests.set(identifier, validRequests);
    return true;
  };
};

// Secure error message generator
export const getSecureErrorMessage = (error: unknown, fallback: string = 'An error occurred'): string => {
  // Don't expose sensitive error details to users
  if (error instanceof Error) {
    // Log the full error for debugging (in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('Detailed error:', error);
    }
    
    // Return generic messages for production
    if (error.message.includes('auth') || error.message.includes('permission')) {
      return 'Authentication error. Please try logging in again.';
    }
    
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    if (error.message.includes('validation') || error.message.includes('invalid')) {
      return 'Invalid input. Please check your data and try again.';
    }
  }
  
  return fallback;
};
