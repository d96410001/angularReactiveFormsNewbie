import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Customer } from './customer';


function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) {
      return { "range": true }
    }

    return null;
  }
}

function compareConfirmEmail(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmEmailControl = c.get('emailConfirm');

  if (emailControl.pristine || confirmEmailControl.pristine) {
    return null;
  }

  if (emailControl.value === confirmEmailControl.value) {
    return null;
  };

  console.log('match la');
  return { 'match': true }
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customer = new Customer();
  customerForm: FormGroup;

  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ["", [Validators.required, Validators.email]],
        emailConfirm: ["", [Validators.required, Validators.email]],
      }, { validator: compareConfirmEmail }),
      phone: [""],
      notification: ["email"],
      rating: [null, ratingRange(1, 5)],
      sendCatalog: true
    })

    this.customerForm.get('notification').valueChanges.subscribe((value) => {
      this.setNotification(value);
    });
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  SetValueF(): void {
    this.customerForm.setValue({
      firstName: "SetValueFN",
      lastName: "SetValueLN",
      email: "SetValueEM",
      sendCatalog: false
    })
  }

  PatchValue(): void {
    this.customerForm.patchValue({
      firstName: "onlyFname",
      lastName: "onlyLname"
    })
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyVia === 'text') {
      phoneControl.setValidators([Validators.required, Validators.minLength(10)])
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

}
