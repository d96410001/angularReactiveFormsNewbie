import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customer = new Customer();
  customerForm:FormGroup;

  constructor(private fb: FormBuilder) { 

  }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.maxLength(50)]],
      email: ["", [Validators.required, Validators.email]],
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

  PatchValue():void {
    this.customerForm.patchValue({
      firstName: "onlyFname",
      lastName: "onlyLname"
    })
  }
 
}
