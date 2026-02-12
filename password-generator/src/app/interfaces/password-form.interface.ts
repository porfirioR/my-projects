import { FormControl } from '@angular/forms';

export interface PasswordFormGroup {
  length: FormControl<number>;
  includeLowercase: FormControl<boolean>;
  includeUppercase: FormControl<boolean>;
  includeNumbers: FormControl<boolean>;
  includeSymbols: FormControl<boolean>;
}

export interface PasswordFormValue {
  length: number;
  includeLowercase: boolean;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}