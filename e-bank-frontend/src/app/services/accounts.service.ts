import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AccountDetails } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  backendHost = environment.backendHost;

  constructor(private http: HttpClient) { }

  getAllAccounts(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.backendHost}/accounts`);
  }

  searchAccount(accountId: string, page: number, size: number): Observable<AccountDetails> {
    return this.http.get<AccountDetails>(`${this.backendHost}/accounts/${accountId}/pageOperations?page=${page}&size=${size}`);
  }

  debit(accountId: string, amount: number, description: string): Observable<any> {
    const debitOp = { accountId, amount, description };
    return this.http.post<any>(`${this.backendHost}/accounts/debit`, debitOp);
  }

  credit(accountId: string, amount: number, description: string): Observable<any> {
    const creditOp = { accountId, amount, description };
    return this.http.post<any>(`${this.backendHost}/accounts/credit`, creditOp);
  }

  transfer(accountIdSource: string, accountIdDestination: string, amount: number, description: string): Observable<any> {
    const transferOp = { accountIdSource, accountIdDestination, amount, description };
    return this.http.post<any>(`${this.backendHost}/accounts/transfer`, transferOp);
  }
}
