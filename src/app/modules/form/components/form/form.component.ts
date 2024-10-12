import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ExpertiseLevel } from '../../../../interfaces/expertise-level';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  applicationForm: FormGroup;
  selectedExpertiseLevel: string = '';
  isSubmissionPage: boolean = false;
  jsonData: string | null = null;
  expertiseLevels: ExpertiseLevel[] = [
    { value: 'junior', description: 'Junior' },
    { value: 'mid', description: 'Mid' },
    { value: 'senior', description: 'Senior' }
  ];

  constructor() {
    this.applicationForm = new FormGroup({
      firstName: new FormControl('', [ Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z]+$') ]),
      lastName: new FormControl('', [ Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z]+$') ]),
      email: new FormControl('', [ Validators.required, Validators.email ]),
      isJobSearching: new FormControl(true),
      expertiseLevel: new FormControl('', []),
      calculationResult: new FormControl('', []),
      description: new FormControl('', []),
      coverLetter: new FormControl('', [])
    });
  }

  /*
    Handles changes to the expertise level selection, updating the selected level,
    clearing values, and setting new validators.
  */
  onExpertiseLevelChange(expertiseLevel: Event): void {
    const selectElement = expertiseLevel.target as HTMLSelectElement;
    this.selectedExpertiseLevel = selectElement.value;

    this.clearValidators();
    this.resetValues();
    this.setFieldsValidators();
  }

  /* Sets validators for form fields based on the selected expertise level.
    If the level is 'junior', it applies validators to calculationResult.
    If the level is 'mid', it applies validators to the description field.
    Validators for the 'senior' option are applied on checkbox value change - onJobSearchingValueChange()
  */
  setFieldsValidators(): void {
    if (this.selectedExpertiseLevel === 'junior') {
      this.calculationResult?.setValidators([ Validators.required, this.calculationValueValidator ]);
      this.calculationResult?.updateValueAndValidity();
    } else if (this.selectedExpertiseLevel === 'mid') {
      this.description?.setValidators([ Validators.required, this.lettersValidator ]);
      this.description?.updateValueAndValidity();
    }
  }

  /*
    A custom validator that ensures the control's value equals 4.
  */
  calculationValueValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === 4 ? null : { notEqualToFour: true };
  }

  /*
    A custom validator that checks if the control's value contains the letter 'A' (case-insensitive).
  */
  lettersValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const containsA = /[aA]/.test(value);

    return containsA ? { containsA: true } : null;
  }

  /*
    Handles changes to the job searching checkbox value by clearing and setting validators
    on the coverLetter ('senior') field.
  */
  onJobSearchingValueChange(): void {
    this.coverLetter?.clearValidators();
    this.coverLetter?.reset();
    if (!this.isJobSearching?.value) {
      this.coverLetter?.setValidators([ Validators.required, Validators.minLength(140) ]);
    }

    this.coverLetter?.updateValueAndValidity();
  }

  /*
    Handles form submission by checking if the application form is valid.
    If valid, it converts the form values to a JSON string and assigns it to jsonData.
  */
  onSubmit(): void {
    if (this.applicationForm.valid) {
      this.jsonData = JSON.stringify(this.applicationForm.value, null, 2);
    }
  }

  /*
    Toggles the submission page state and resets jsonData if the user goes back to the first page. 
  */
  toggleSubmissionPage(): void {
    this.isSubmissionPage = !this.isSubmissionPage;
    if (!this.isSubmissionPage) {
      this.jsonData = null;
    }
  }

  /*
    Clears validators for the calculationResult ('junior') and description ('mid') form fields.
    Validators for the 'senior' option are cleared on checkbox value change - onJobSearchingValueChange()
  */
  clearValidators(): void {
    this.calculationResult?.clearValidators();
    this.description?.clearValidators();
  }

  /* 
    Resets the values of the calculationResult, description, and coverLetter form fields.
  */
  resetValues(): void {
    this.calculationResult?.reset();
    this.description?.reset();
    this.coverLetter?.reset();
  }

  /* 
    Retrieves error messages for a specified form control based on its validation errors and
    returns localized error messages depending on the type of validation error present.
  */
  getErrorMessages(controlName: string): string {
    const control = this.applicationForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Šis laukas yra privalomas!';
    }

    if (control?.hasError('pattern')) {
      return 'Šis laukas turi būti sudarytas tik iš raidžių!';
    }

    if (control?.hasError('minlength')) {
      return 'Šis laukas turi būti sudarytas bent iš ' + control?.errors?.['minlength'].requiredLength +  ' simbolių!';
    }

    if (control?.hasError('email')) {
      return 'Šis laukas turi atitikti elektroninio pašto formatą!';
    }

    if (control?.hasError('notEqualToFour')) {
      return 'Šio lauko reikšmė privalo būti 4!';
    }

    if (control?.hasError('containsA')) {
      return 'Jūsų aprašyme negali būti A raidžių!';
    }

    return '';
  }

  get firstName() { return this.applicationForm.get('firstName'); }
  get lastName() { return this.applicationForm.get('lastName'); }
  get email() { return this.applicationForm.get('email'); }
  get isJobSearching() { return this.applicationForm.get('isJobSearching'); }
  get calculationResult() { return this.applicationForm.get('calculationResult'); }
  get description() { return this.applicationForm.get('description'); }
  get coverLetter() { return this.applicationForm.get('coverLetter'); }
}
