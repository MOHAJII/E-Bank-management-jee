import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AccountsService} from '../services/accounts.service';
import {AccountDetails} from '../models/account.model';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {AsyncPipe, DatePipe, DecimalPipe, JsonPipe, NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-accounts',
  imports: [
    ReactiveFormsModule,
    MatSnackBarModule,
    DatePipe,
    DecimalPipe,
    NgForOf,
    NgClass,
    JsonPipe
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
    operationFormGroup! : FormGroup;

    constructor(private accountsService : AccountsService, private fb : FormBuilder, private snackBar : MatSnackBar) {
    }

    ngOnInit(): void {
      this.accountsFormGroup = this.fb.group({
        accountId : this.fb.control("", [Validators.required])
      });

      this.operationFormGroup = this.fb.group({
        operationType : this.fb.control("", [Validators.required]),
        accountDestination : this.fb.control(null, [Validators.required]),
        amount : this.fb.control("", [Validators.required]),
        description : this.fb.control("", [Validators.required]),
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

  handleOperation() {
    let accountId : string = this.accountsFormGroup.value.accountId;
    let accountDestination : string = this.operationFormGroup.value.accountDestination;
    let operationType : string = this.operationFormGroup.value.operationType;
    let amount : number = this.operationFormGroup.value.amount;
    let description : string = this.operationFormGroup.value.description;

    if (operationType == 'DEBIT') {
      this.accountsService.debit(accountId, amount, description);
    }
  }
}
