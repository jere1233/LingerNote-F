// src/utils/validators.ts

export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  phoneNumber: (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 9 && cleaned.length <= 10;
  },

  password: (password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain an uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain a lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain a number' };
    }
    return { valid: true };
  },

  fullName: (name: string): { valid: boolean; message?: string } => {
    if (name.trim().length < 2) {
      return { valid: false, message: 'Name must be at least 2 characters' };
    }
    return { valid: true };
  },

  otp: (otp: string): boolean => {
    return /^\d{6}$/.test(otp);
  },
};

export const formatters = {
  phoneNumber: (phone: string): string => {
    return phone.replace(/\D/g, '');
  },

  formatPhoneDisplay: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
  },
};

export const detectInputType = (input: string): 'email' | 'phone' | 'unknown' => {
  const trimmed = input.trim();
  
  // Check if it looks like an email
  if (trimmed.includes('@')) {
    return 'email';
  }
  
  // Check if it's a phone number (digits with optional formatting)
  const cleaned = trimmed.replace(/\D/g, '');
  if (cleaned.length >= 9 && cleaned.length <= 15 && /[\d\s\-\(\)\+]/.test(trimmed)) {
    return 'phone';
  }
  
  return 'unknown';
};

export const validateEmailOrPhone = (input: string): { valid: boolean; message?: string; type?: 'email' | 'phone' } => {
  const type = detectInputType(input);
  
  if (type === 'email') {
    const isValid = validators.email(input);
    return {
      valid: isValid,
      message: isValid ? undefined : 'Please enter a valid email address',
      type: 'email',
    };
  }
  
  if (type === 'phone') {
    const isValid = validators.phoneNumber(input);
    return {
      valid: isValid,
      message: isValid ? undefined : 'Please enter a valid phone number',
      type: 'phone',
    };
  }
  
  return {
    valid: false,
    message: 'Please enter a valid email or phone number',
  };
};