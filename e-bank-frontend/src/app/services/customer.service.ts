import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Customer} from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  backendHost : string = environment.backendHost;

  constructor(private http : HttpClient) { }

  getCustomers() : Observable<Array<Customer>> {
    return this.http.get<Array<Customer>>(this.backendHost+"/customers");
  }

  searchCustomers(keyword : string) : Observable<Array<Customer>> {
    return this.http.get<Array<Customer>>(this.backendHost+"/customers/search?keyword="+keyword);
  }

  deleteCustomer(c: Customer) {
    return this.http.delete(this.backendHost+"/customers/"+c.id);
  }

  addCustomer(c : Customer) : Observable<Customer> {
    return this.http.post<Customer>(this.backendHost+"/customers", c);
  }
}
