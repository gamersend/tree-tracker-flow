
import { useState, useCallback } from 'react';
import { sanitizeText, validateSaleInput, SECURITY_LIMITS } from '@/utils/security';
import { useSecurity } from '@/contexts/SecurityContext';

interface UseSecureInputOptions {
  maxLength?: number;
  allowHtml?: boolean;
  validateNumbers?: boolean;
}

export const useSecureInput = (options: UseSecureInputOptions = {}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { recordSecurityEvent } = useSecurity();

  const validateAndSanitizeText = useCallback((input: string): string => {
    const errors: string[] = [];
    
    if (!input) return '';
    
    const maxLength = options.maxLength || SECURITY_LIMITS.MAX_TEXT_LENGTH;
    if (input.length > maxLength) {
      errors.push(`Input must be less than ${maxLength} characters`);
      recordSecurityEvent('input_length_exceeded', { length: input.length, maxLength });
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:text\/html/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i,
    ];
    
    const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(input));
    if (hasSuspiciousContent) {
      errors.push('Input contains potentially unsafe content');
      recordSecurityEvent('suspicious_input_detected', { input: input.substring(0, 100) });
    }
    
    setValidationErrors(errors);
    
    if (errors.length > 0) {
      return '';
    }
    
    return options.allowHtml ? input.trim() : sanitizeText(input);
  }, [options, recordSecurityEvent]);

  const validateSaleData = useCallback((quantity: number, price: number) => {
    const validation = validateSaleInput(quantity, price);
    setValidationErrors(validation.errors);
    
    if (!validation.isValid) {
      recordSecurityEvent('invalid_sale_data', { quantity, price, errors: validation.errors });
    }
    
    return validation.isValid;
  }, [recordSecurityEvent]);

  return {
    validateAndSanitizeText,
    validateSaleData,
    validationErrors,
    clearErrors: () => setValidationErrors([])
  };
};
