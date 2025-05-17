import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CustomerService} from '../services/customer.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-new-customer',
  imports: [
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './new-customer.component.html',
  standalone: true,
  styleUrl: './new-customer.component.css'
})
export class NewCustomerComponent implements OnInit{

  newCustomerGroupForm! : FormGroup;

  constructor(private customerService : CustomerService, private fb : FormBuilder, private snackBar : MatSnackBar, private router : Router) {
  }

  ngOnInit(): void {
    this.newCustomerGroupForm = this.fb.group({
      name : this.fb.control("", [Validators.required, Validators.minLength(4)]),
      email : this.fb.control("", [Validators.required, Validators.email]),
    })
  }


 handleSubmit() {
    let customer = this.newCustomerGroupForm.value;
    this.customerService.addCustomer(customer).subscribe({
      next: resp => {
        this.snackBar.open("Customer has been successfully saved!", "close", {
          duration: 5000,
          panelClass: ['snackbar-success']
        });
        // Redirect immediately after showing the snackbar
        this.router.navigate(['/customers']);
      },
      error: err => {
        this.snackBar.open(`Error: ${err.message}`, "close", {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}
