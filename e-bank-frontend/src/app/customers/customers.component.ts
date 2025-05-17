import {Component, OnInit} from '@angular/core';
import {Customer} from '../models/customer.model';
import {CustomerService} from '../services/customer.service';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-customers',
  imports: [
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './customers.component.html',
  standalone: true,
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit{
  customers : Array<Customer> | undefined;
  errorMessage! : string;
  searchFormGroup! : FormGroup;

  constructor(private customerService : CustomerService, private fb : FormBuilder, private snackBar : MatSnackBar) {
  }

  ngOnInit(): void {
    this.getCustomers();
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

  getCustomers() {
    this.customerService.getCustomers().subscribe(
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
          next : resp => this.getCustomers(),
          error : err => {
            this.errorMessage = err.message;
            this.snackBar.open(`Error: ${err.message}`, 'Close', {
              duration: 5000,
              panelClass: ['snackbar-error']
            });
          }
        }
      )

  }
}
