import { Component } from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  totalCustomers!: number;
  totalAccounts!: number;
  totalBalance!: number;

}
