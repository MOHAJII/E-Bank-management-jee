import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {AccountDetails} from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  backendHost = environment.backendHost;

  constructor(private http : HttpClient) { }

  searchAccount(accountId: string, page: number, size: number) : Observable<AccountDetails>  {
    return this.http.get<AccountDetails>(this.backendHost+"/accounts/"+accountId+"/pageOperations?"+"page="+page+"&size="+size);
  }
}
