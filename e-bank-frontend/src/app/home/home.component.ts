import { Component, OnInit } from '@angular/core';
import {CurrencyPipe, NgIf} from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { AccountsService } from '../services/accounts.service';
import { StatisticsService } from '../services/statistics.service';
import { ChartType, ChartOptions } from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CurrencyPipe,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalCustomers: number = 0;
  totalAccounts: number = 0;
  totalBalance: number = 0;

  // Chart data and state
  accountTypeData: number[] = [];
  accountTypeLabels: string[] = [];
  accountTypeLoading = true;
  accountTypeError = '';

  monthlyTxData: number[] = [];
  monthlyTxLabels: string[] = [];
  monthlyTxLoading = true;
  monthlyTxError = '';

  userBalanceData: number[] = [];
  userBalanceLabels: string[] = [];
  userBalanceLoading = true;
  userBalanceError = '';

  // Chart options
  pieChartType: ChartType = 'pie';
  barChartType: ChartType = 'bar';
  doughnutChartType: ChartType = 'doughnut';
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
  };

  constructor(
    private customerService: CustomerService,
    private accountsService: AccountsService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    // this.loadCharts(); // Temporarily comment out real data loading

    // Hardcoded test data for charts
    this.accountTypeLabels = ['Savings', 'Checking', 'Business'];
    this.accountTypeData = [80, 120, 40];
    this.accountTypeLoading = false;

    this.monthlyTxLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    this.monthlyTxData = [200, 250, 180, 300, 220];
    this.monthlyTxLoading = false;

    this.userBalanceLabels = ['Personal', 'Business'];
    this.userBalanceData = [50000, 120000];
    this.userBalanceLoading = false;
  }

  private loadDashboardData() {
    // Get total customers
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.totalCustomers = customers.length;
      },
      error: (err) => console.error('Error loading customers:', err)
    });

    // Get accounts data
    this.accountsService.getAllAccounts().subscribe({
      next: (accounts) => {
        this.totalAccounts = accounts.length;
        this.totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
      },
      error: (err) => console.error('Error loading accounts:', err)
    });
  }

  private loadCharts() {
    // Account type pie chart
    this.accountTypeLoading = true;
    this.statisticsService.getAccountTypeStats().subscribe({
      next: (data) => {
        this.accountTypeLabels = data.map(d => d.type);
        this.accountTypeData = data.map(d => d.count);
        this.accountTypeLoading = false;
      },
      error: (err) => {
        this.accountTypeError = 'Failed to load account type stats.';
        this.accountTypeLoading = false;
      }
    });

    // Monthly transactions bar chart
    this.monthlyTxLoading = true;
    this.statisticsService.getMonthlyTransactions().subscribe({
      next: (data) => {
        this.monthlyTxLabels = data.map(d => d.month);
        this.monthlyTxData = data.map(d => d.count);
        this.monthlyTxLoading = false;
      },
      error: (err) => {
        this.monthlyTxError = 'Failed to load monthly transactions.';
        this.monthlyTxLoading = false;
      }
    });

    // User balances doughnut chart
    this.userBalanceLoading = true;
    this.statisticsService.getUserBalances().subscribe({
      next: (data) => {
        this.userBalanceLabels = data.map(d => d.userType);
        this.userBalanceData = data.map(d => d.balance);
        this.userBalanceLoading = false;
      },
      error: (err) => {
        this.userBalanceError = 'Failed to load user balances.';
        this.userBalanceLoading = false;
      }
    });
  }
}
