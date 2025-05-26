import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup;
  isLoading: boolean = false;
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect to admin if already logged in
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/admin/home']);
      return;
    }

    this.loginFormGroup = this.fb.group({
      username: this.fb.control('', [Validators.required, Validators.minLength(4)]),
      password: this.fb.control('', [Validators.required, Validators.minLength(4)])
    });
  }

  handleLogin() {
    if (this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loginError = '';

    const username = this.loginFormGroup.value.username;
    const password = this.loginFormGroup.value.password;

    this.authService.login(username, password)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/home']);
          this.snackBar.open('Login successful!', 'Close', {
            duration: 5000,
            panelClass: 'snackbar-success'
          });
        },
        error: err => {
          this.loginError = err.message;
          this.snackBar.open(`Error: ${err.message}`, 'Close', {
            duration: 5000,
            panelClass: 'snackbar-error'
          });
        }
      });
  }
}
