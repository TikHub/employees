import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent implements OnInit {
  form!: FormGroup;
  titleAlert: string = 'This field is required';

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    this.setChangeValidate();
  }

  createForm() {
    this.form = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      company: [null, Validators.required],
      firsalarystName: [null, Validators.required],
    });
  }

  setChangeValidate() {
    // this.formGroup.get('validate').valueChanges.subscribe((validate) => {
    //   if (validate == '1') {
    //     this.formGroup
    //       .get('firstName')
    //       .setValidators([Validators.required, Validators.minLength(3)]);
    //     this.titleAlert = 'You need to specify at least 3 characters';
    //   } ealse {
    //     this.formGroup.get('firstName').setValidators(Validators.required);
    //   }
    //   this.formGroup.get('firstName').updateValueAndValidity();
    // });
  }

  get firstName() {
    return this.form.get('firstName') as FormControl;
  }

  get lastName() {
    return this.form.get('lastName') as FormControl;
  }

  get company() {
    return this.form.get('company') as FormControl;
  }

  get salary() {
    return this.form.get('salary') as FormControl;
  }

  onSubmit(obj: Object) {
    console.log(obj);
  }
}
