import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendHost = environment.backendHost;

  constructor(private htt : HttpClient) {

  }

  public login(username : string, password : string) {
    let options = {
      headers : new HttpHeaders({"Content-Type": "application/x-www-form-urlencoded"})
    }
    let params = new HttpParams().set("username", username).set("password", password);

    return this.htt.post(this.backendHost+"/auth/login", params, options);
  }
}
