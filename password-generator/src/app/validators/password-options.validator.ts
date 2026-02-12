import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function atLeastOneOptionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as any;

    if (!formGroup.controls) {
      return null;
    }

    const hasAtLeastOneOption = checkAtLeastOneOption(formGroup);

    return hasAtLeastOneOption ? null : { noOptionsSelected: true };
  };
}

function checkAtLeastOneOption(formGroup: any): boolean {
  const hasLowercase = formGroup.controls['includeLowercase']?.value;
  const hasUppercase = formGroup.controls['includeUppercase']?.value;
  const hasNumbers = formGroup.controls['includeNumbers']?.value;
  const hasSymbols = formGroup.controls['includeSymbols']?.value;
  
  return hasLowercase || hasUppercase || hasNumbers || hasSymbols;
}