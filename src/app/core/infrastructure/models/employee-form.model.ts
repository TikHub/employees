import { AbstractControl } from '@angular/forms';

export class EmployeeFormModel {
  firstName: AbstractControl;
  lastName: AbstractControl;
  company: AbstractControl;
  salary: AbstractControl;
}
