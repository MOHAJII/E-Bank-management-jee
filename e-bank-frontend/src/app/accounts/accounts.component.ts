import {Component, OnInit} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-accounts',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './accounts.component.html',
  standalone: true,
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit{

    accountsFormGroup! : FormGroup;

    constructor() {
    }
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }


}
