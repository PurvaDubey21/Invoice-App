export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isValidPassword = (password: string) =>
password.length >= 8 && password.length <= 20;

export const isEmptyPassword = (password: string) => 
password.length === 0;