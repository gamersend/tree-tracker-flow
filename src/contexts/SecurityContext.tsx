
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createRateLimiter } from '@/utils/security';

interface SecurityContextType {
  isRateLimited: (action: string) => boolean;
  recordSecurityEvent: (event: string, details?: any) => void;
  getSecurityHeaders: () => Record<string, string>;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

// Rate limiters for different actions
const rateLimiters = {
  login: createRateLimiter(5, 15 * 60 * 1000), // 5 attempts per 15 minutes
  salesEntry: createRateLimiter(100, 60 * 1000), // 100 entries per minute
  fileUpload: createRateLimiter(10, 60 * 1000), // 10 uploads per minute
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [securityEvents, setSecurityEvents] = useState<Array<{ timestamp: number; event: string; details?: any }>>([]);

  // Clean up old security events
  useEffect(() => {
    const cleanup = setInterval(() => {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      setSecurityEvents(events => events.filter(event => event.timestamp > oneDayAgo));
    }, 60 * 60 * 1000); // Clean up every hour

    return () => clearInterval(cleanup);
  }, []);

  const isRateLimited = (action: string): boolean => {
    const rateLimiter = rateLimiters[action as keyof typeof rateLimiters];
    if (!rateLimiter) return false;
    
    const userId = localStorage.getItem('user_id') || 'anonymous';
    const allowed = rateLimiter(`${action}_${userId}`);
    
    if (!allowed) {
      recordSecurityEvent('rate_limit_exceeded', { action, userId });
    }
    
    return !allowed;
  };

  const recordSecurityEvent = (event: string, details?: any) => {
    setSecurityEvents(prev => [...prev, {
      timestamp: Date.now(),
      event,
      details
    }]);
    
    // Log security events in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Security Event:', event, details);
    }
  };

  const getSecurityHeaders = (): Record<string, string> => {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    };
  };

  return (
    <SecurityContext.Provider value={{
      isRateLimited,
      recordSecurityEvent,
      getSecurityHeaders
    }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
