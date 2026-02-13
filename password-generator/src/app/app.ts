import { Component, signal, computed, effect } from '@angular/core';
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
  
  // Signal para el mensaje de copiado
  protected copyMessage = signal<string>('');
  
  // Computed para mostrar/ocultar el mensaje
  protected showCopyMessage = computed(() => this.copyMessage() !== '');

  // Private properties
  private readonly maxPasswordLength = 25;
  private readonly minPasswordLength = 4;
  private copyTimeoutId: number | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly passwordService: PasswordService,
  ) {
    this.initializeForm();
    
    // Effect para limpiar el mensaje automáticamente
    effect(() => {
      if (this.copyMessage()) {
        this.clearPreviousTimeout();
        this.copyTimeoutId = window.setTimeout(() => {
          this.copyMessage.set('');
        }, 2000); // 2 segundos
      }
    });
  }

  ngOnInit(): void {
    this.setupFormSubscription();
    this.generateInitialPassword();
  }

  ngOnDestroy(): void {
    this.passwordService.clearRecentPasswords();
    this.clearPreviousTimeout();
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
      this.copyMessage.set('¡Copiado exitosamente!');
    } catch (err) {
      this.copyMessage.set('Error al copiar');
      console.error('Error copying to clipboard:', err);
    }
  }

  private clearPreviousTimeout(): void {
    if (this.copyTimeoutId) {
      clearTimeout(this.copyTimeoutId);
      this.copyTimeoutId = null;
    }
  }
}