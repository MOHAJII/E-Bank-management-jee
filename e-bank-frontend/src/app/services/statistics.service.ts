import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  constructor() {}

  // Mock: Fetch account type distribution
  getAccountTypeStats(): Observable<{ type: string; count: number }[]> {
    const data = [
      { type: 'Checking', count: 120 },
      { type: 'Savings', count: 80 },
      { type: 'Business', count: 40 },
    ];
    return of(data).pipe(delay(800));
  }

  // Mock: Fetch monthly transaction volume
  getMonthlyTransactions(): Observable<{ month: string; count: number }[]> {
    const data = [
      { month: 'Jan', count: 200 },
      { month: 'Feb', count: 250 },
      { month: 'Mar', count: 180 },
      { month: 'Apr', count: 300 },
      { month: 'May', count: 220 },
    ];
    return of(data).pipe(delay(800));
  }

  // Mock: Fetch total balances per user type
  getUserBalances(): Observable<{ userType: string; balance: number }[]> {
    const data = [
      { userType: 'Personal', balance: 50000 },
      { userType: 'Business', balance: 120000 },
    ];
    return of(data).pipe(delay(800));
  }
}

