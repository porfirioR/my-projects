import { Injectable } from '@angular/core';
import { PasswordOptions, GeneratedPassword } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private readonly recentPasswords: GeneratedPassword[] = [];
  private readonly maxRecentPasswords = 5;
  private readonly characterSets = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  } as const;

  public generatePassword(options: PasswordOptions): string {
    const charset = this.buildCharset(options);
    
    if (!charset) {
      return '';
    }
    
    const password = this.createRandomPassword(charset, options.length);
    this.saveToRecent(password, options);
    
    return password;
  }

  public getRecentPasswords(): GeneratedPassword[] {
    return [...this.recentPasswords];
  }

  public clearRecentPasswords(): void {
    this.recentPasswords.length = 0;
  }

  private buildCharset(options: PasswordOptions): string {
    let charset = '';
    
    if (options.includeLowercase) {
      charset += this.characterSets.lowercase;
    }
    if (options.includeUppercase) {
      charset += this.characterSets.uppercase;
    }
    if (options.includeNumbers) {
      charset += this.characterSets.numbers;
    }
    if (options.includeSymbols) {
      charset += this.characterSets.symbols;
    }
    
    return charset;
  }

  private createRandomPassword(charset: string, length: number): string {
    let password = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
    
    return password;
  }

  private saveToRecent(password: string, options: PasswordOptions): void {
    const newPassword = this.createPasswordRecord(password, options);
    
    this.addToRecentList(newPassword);
    this.maintainMaxRecentLimit();
  }

  private createPasswordRecord(password: string, options: PasswordOptions): GeneratedPassword {
    return {
      id: Date.now().toString(),
      password,
      timestamp: new Date(),
      options: { ...options }
    };
  }

  private addToRecentList(passwordRecord: GeneratedPassword): void {
    this.recentPasswords.unshift(passwordRecord);
  }

  private maintainMaxRecentLimit(): void {
    if (this.recentPasswords.length > this.maxRecentPasswords) {
      this.recentPasswords.splice(this.maxRecentPasswords);
    }
  }
}