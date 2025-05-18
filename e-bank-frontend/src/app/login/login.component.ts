import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginFormGroup! : FormGroup;

  constructor(private fb : FormBuilder, private authService : AuthService, private snackBar : MatSnackBar) {
  }

  ngOnInit(): void {
      this.loginFormGroup = this.fb.group({
        username : this.fb.control("", [Validators.required, Validators.minLength(4)]),
        password : this.fb.control("", [Validators.required, Validators.minLength(4)])
      })
  }

  handleLogin() {
    let username = this.loginFormGroup.value.username;
    let password = this.loginFormGroup.value.password;
    this.authService.login(username, password).subscribe({
      next : resp => {
        this.snackBar.open("Login success!", "close", {
          duration : 5000,
          panelClass : "snackbar-success"
        })
      },
      error : err => {
        this.snackBar.open(`Error: ${err.message}`, "close", {
          duration : 5000,
          panelClass : "snackbar-error"
        })
      }
    })
  }



}
