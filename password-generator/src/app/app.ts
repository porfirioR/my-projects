import { Component } from '@angular/core';
import {
  GeneratedPassword,
  PasswordFormGroup,
  PasswordFormValue,
  PasswordOptions,
} from './interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { atLeastOneOptionValidator } from './validators/password-options.validator';
import { PasswordService } from './services/password.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected passwordForm!: FormGroup<PasswordFormGroup>;
  protected currentPassword = '';
  protected showError = false;
  protected recentPasswords: GeneratedPassword[] = [];
  protected copyMessage = '';

  // Private properties
  private readonly maxPasswordLength = 25;
  private readonly minPasswordLength = 4;

  constructor(
    private readonly fb: FormBuilder,
    private readonly passwordService: PasswordService,
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setupFormSubscription();
    this.generateInitialPassword();
  }

  ngOnDestroy(): void {
    this.passwordService.clearRecentPasswords();
  }

  // Protected methods (used in template)
  protected generatePassword(): void {
    if (this.passwordForm.invalid) {
      this.showError = true;
      return;
    }

    const options: PasswordOptions = this.getFormValue();
    this.currentPassword = this.passwordService.generatePassword(options);
    this.recentPasswords = this.passwordService.getRecentPasswords();
    this.showError = false;
  }

  protected regeneratePassword(): void {
    this.generatePassword();
  }

  protected async copyToClipboard(): Promise<void> {
    await this.copyPasswordToClipboard(this.currentPassword);
  }

  protected async copyRecentPassword(password: string): Promise<void> {
    await this.copyPasswordToClipboard(password);
  }

  protected get hasValidationError(): boolean {
    return this.passwordForm.hasError('noOptionsSelected');
  }

  // Private methods
  private initializeForm(): void {
    this.passwordForm = this.fb.group<PasswordFormGroup>(
      {
        length: this.fb.control(12, {
          validators: [
            Validators.min(this.minPasswordLength),
            Validators.max(this.maxPasswordLength),
          ],
          nonNullable: true,
        }),
        includeLowercase: this.fb.control(true, { nonNullable: true }),
        includeUppercase: this.fb.control(true, { nonNullable: true }),
        includeNumbers: this.fb.control(true, { nonNullable: true }),
        includeSymbols: this.fb.control(false, { nonNullable: true }),
      },
      { validators: atLeastOneOptionValidator() },
    );
  }

  private setupFormSubscription(): void {
    this.passwordForm.valueChanges.subscribe(() => {
      if (this.passwordForm.valid) {
        this.showError = false;
        this.generatePassword();
      } else {
        this.showError = true;
        this.currentPassword = '';
      }
    });
  }

  private generateInitialPassword(): void {
    if (this.passwordForm.valid) {
      this.generatePassword();
    }
  }

  private getFormValue(): PasswordFormValue {
    return this.passwordForm.value as PasswordFormValue;
  }

  private async copyPasswordToClipboard(password: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(password);
      this.copyMessage = '¡Copiado!';
      this.clearCopyMessage();
    } catch (err) {
      this.copyMessage = 'Error al copiar';
      this.clearCopyMessage();
    }
  }

  private clearCopyMessage(): void {
    setTimeout(() => (this.copyMessage = ''), 2000);
  }
}
