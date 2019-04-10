import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { Customer } from './customer';
import { debounceTime } from 'rxjs/operators';



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
  emailMessage: string;

  get addressArray(): FormArray {
    console.log(this.customerForm.get('addressArray'));
    return <FormArray>this.customerForm.get('addressArray');
  }

  public validaitonMessage = {
    required: "Please enter your email address. 87",
    email: "Please enter a valid email address. 87",
    match: "email not match la lalalalalala! 87"
  }

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
      sendCatalog: true,
      addressArray: this.fb.array([this.buildAddress()]),
    });
    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      this.setMessage(emailControl);
    });
    this.customerForm.get('notification').valueChanges.subscribe((value) => {
      this.setNotification(value);
    });
  }

  buildAddress(): FormGroup {
    return this.fb.group({
      addressType: ["home"],
      street1: [""],
      street2: [""],
      city: [""],
      state: [""],
      zip: [""]
    })
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

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.emailMessage += this.validaitonMessage[key]).join(' ')
    }
  }
}
