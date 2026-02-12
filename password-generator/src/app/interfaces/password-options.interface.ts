// src/app/interfaces/password-options.interface.ts
export interface PasswordOptions {
  length: number;
  includeLowercase: boolean;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export interface GeneratedPassword {
  id: string;
  password: string;
  timestamp: Date;
  options: PasswordOptions;
}