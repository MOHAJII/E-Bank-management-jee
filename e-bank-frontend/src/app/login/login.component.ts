import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  handleLogin() {
      throw new Error('Method not implemented.');
  }

  loginFormGroup! : FormGroup;

  constructor(private http : HttpClient, private fb : FormBuilder) {
  }

  ngOnInit(): void {
      this.loginFormGroup = this.fb.group({
        username : this.fb.control("", [Validators.required, Validators.email]),
        password : this.fb.control("", [Validators.required, Validators.minLength(4)])
      })
  }



}
