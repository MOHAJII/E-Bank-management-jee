import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AccountsService} from '../services/accounts.service';
import {AccountDetails} from '../models/account.model';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {AsyncPipe, DatePipe, DecimalPipe, NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-accounts',
  imports: [
    ReactiveFormsModule,
    MatSnackBarModule,
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    NgForOf,
    NgClass
  ],
  templateUrl: './accounts.component.html',
  standalone: true,
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit{

    accountsFormGroup! : FormGroup;
    currentPage : number = 0;
    pageSize : number = 5;
    accountDetails! : AccountDetails;

    constructor(private accountsService : AccountsService, private fb : FormBuilder, private snackBar : MatSnackBar) {
    }

    ngOnInit(): void {
      this.accountsFormGroup = this.fb.group({
        accountId : this.fb.control("", [Validators.required])
      })
    }


  handleSearch() {
      let accountId : string = this.accountsFormGroup.value.accountId;
      this.accountsService.searchAccount(accountId, this.currentPage, this.pageSize).subscribe({
        next : resp => {
          this.accountDetails = resp;
        },
        error : err => {
          this.snackBar.open(`Error : ${err.message}`, "close", {
            duration : 10000,
            panelClass : "snackbar-error"
          })
        }
      })
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.handleSearch();
  }
}
