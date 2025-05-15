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
    this.handleSearchCustomers();
    this.searchFormGroup = this.fb.group({
      keyword : this.fb.control("")
    })
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

  handleDelete(c: Customer) {
    let confirmation = confirm("are sure to delete customer!");
    if (confirmation)
      this.customerService.deleteCustomer(c).subscribe(
        {
          next : resp => this.handleSearchCustomers(),
          error : err => this.errorMessage = err.message
        }
      )

  }
}
