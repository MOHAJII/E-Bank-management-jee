import {Component, OnInit} from '@angular/core';
import {Customer} from '../models/customer.model';
import {CustomerService} from '../services/customer.service';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-customers',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit{
  customers : Array<Customer> | undefined;
  errorMessage! : string;
  searchFormGroup! : FormGroup;

  constructor(private customerService : CustomerService, private fb : FormBuilder) {
  }

  ngOnInit(): void {
    this.getCustomers();
    this.searchFormGroup = this.fb.group({
      keyword : this.fb.control("")
    })
  }

  getCustomers() {
    this.customerService.getCustomers().subscribe(
      {
        next : resp => this.customers = resp,
        error : err => this.errorMessage = err.message
      }
    )
  }


  handleSearchCustomers() {
    let keyword = this.searchFormGroup?.value.keyword;
    this.customerService.searchCustomers(keyword).subscribe(
      {
        next : resp => this.customers = resp,
        error : err => this.errorMessage = err.message
      }
    )
  }
}
