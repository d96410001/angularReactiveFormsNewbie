import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Customer } from './customer';

function ratingRange(c: AbstractControl): { [kk: string]: boolean } | null {

  if (c.value !== null && (isNaN(c.value) || c.value < 1 || c.value > 5)) {
    return { "range": true }
  }

  return null;
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
      email: ["", [Validators.required, Validators.email]],
      phone: [""],
      notification: ["email"],
      rating: [null, ratingRange],
      sendCatalog: true
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

}
