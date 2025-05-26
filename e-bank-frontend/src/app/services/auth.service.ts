import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
}

interface DecodedJWT {
  sub: string;
  scope: string;
  exp: number;
  iat?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';

  backendHost = environment.backendHost;

  // Private fields for better encapsulation
  private _isAuthenticated: boolean = false;
  private _username: string = '';
  private _roles: string[] = [];
  private _accessToken: string = '';
  private _tokenExpiry: number = 0;

  // Observable for authentication state changes
  private authStateSubject = new BehaviorSubject<boolean>(false);
  authState$ = this.authStateSubject.asObservable();

  // Token refresh timer
  private refreshTokenTimeout: any;

  constructor(private http: HttpClient, private router: Router) {
    this.loadAuthStateFromStorage();
  }

  // Getter methods for better encapsulation
  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  get username(): string {
    return this._username;
  }

  get roles(): string[] {
    return [...this._roles]; // Return copy to prevent mutation
  }

  get accessToken(): string {
    return this._accessToken;
  }

  /**
   * Public method to check authentication status (used by interceptor)
   */
  isAuthenticatedStatus(): boolean {
    return this._isAuthenticated && !this.isTokenExpired();
  }

  /**
   * Get access token (used by interceptor)
   */
  getAccessToken(): string | null {
    return this.isAuthenticatedStatus() ? this._accessToken : null;
  }

  /**
   * Get refresh token - not used since backend doesn't support refresh tokens
   */
  getRefreshToken(): string | null {
    return null;
  }

  /**
   * Load authentication state from localStorage on service initialization
   */
  private loadAuthStateFromStorage(): void {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const user = localStorage.getItem(this.USER_KEY);
      const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

      if (token && user && expiry) {
        this._accessToken = token;
        const userData = JSON.parse(user);
        this._username = userData.username;
        this._roles = Array.isArray(userData.roles) ? userData.roles : [];
        this._tokenExpiry = parseInt(expiry, 10);

        // Check if token is expired
        if (this.isTokenExpired()) {
          console.log('Token expired on startup, clearing auth state');
          this.clearAuthState();
        } else {
          this._isAuthenticated = true;
          this.authStateSubject.next(true);
          this.startTokenExpiryTimer();
        }
      }
    } catch (error) {
      console.error('Error loading auth state from storage:', error);
      this.clearAuthState();
    }
  }

  /**
   * Check if the token is expired
   */
  isTokenExpired(): boolean {
    if (!this._tokenExpiry) return true;
    return Date.now() >= this._tokenExpiry;
  }

  /**
   * Login with username and password
   * Uses form data as expected by Spring Boot backend
   */
  public login(username: string, password: string): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const params = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post<LoginResponse>(
      `${this.backendHost}/auth/login`,
      params.toString(),
      { headers }
    ).pipe(
      tap((response: LoginResponse) => this.handleLoginResponse(response)),
      catchError(error => {
        const errorMessage = this.extractErrorMessage(error);
        console.error('Login failed:', errorMessage);
        return throwError(() => new Error(`Login failed: ${errorMessage}`));
      })
    );
  }

  /**
   * Handle login response and store authentication data
   */
  private handleLoginResponse(data: LoginResponse): void {
    try {
      this._isAuthenticated = true;
      this._accessToken = data.token; // Backend returns 'token' not 'accessToken'

      const decodedJwt: DecodedJWT = jwtDecode(this._accessToken);
      this._username = decodedJwt.sub;

      // Parse roles from scope (space-separated string)
      this._roles = decodedJwt.scope ? decodedJwt.scope.split(' ').filter(role => role.length > 0) : [];

      // Calculate token expiry time (subtract 30 seconds for safety margin)
      this._tokenExpiry = (decodedJwt.exp * 1000) - 30000;

      // Store auth data in localStorage
      this.saveAuthStateToStorage();

      // Notify subscribers about authentication state change
      this.authStateSubject.next(true);

      // Start the token expiry timer
      this.startTokenExpiryTimer();

      console.log('Login successful for user:', this._username, 'with roles:', this._roles);
    } catch (error) {
      console.error('Error handling login response:', error);
      this.clearAuthState();
      throw new Error('Invalid login response format');
    }
  }

  /**
   * Save authentication state to localStorage
   */
  private saveAuthStateToStorage(): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, this._accessToken);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, this._tokenExpiry.toString());
      localStorage.setItem(this.USER_KEY, JSON.stringify({
        username: this._username,
        roles: this._roles
      }));
    } catch (error) {
      console.error('Error saving auth state to storage:', error);
    }
  }

  /**
   * Clear authentication state from localStorage
   */
  private clearAuthStateFromStorage(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      localStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('Error clearing auth state from storage:', error);
    }
  }

  /**
   * Refresh access token - not supported by current backend
   * Returns error to trigger re-login
   */
  refreshAccessToken(): Observable<any> {
    console.log('Token refresh not supported by backend, user needs to re-login');
    this.logout();
    return throwError(() => new Error('Token refresh not supported. Please login again.'));
  }

  /**
   * Start the token expiry timer to logout user when token expires
   */
  private startTokenExpiryTimer(): void {
    this.stopTokenExpiryTimer();

    if (!this._tokenExpiry) return;

    const now = Date.now();
    const timeout = this._tokenExpiry - now;

    if (timeout > 0) {
      console.log(`Token will expire in ${Math.round(timeout / 1000)} seconds`);

      this.refreshTokenTimeout = setTimeout(() => {
        console.log('Token expired, logging out user');
        this.logout();
      }, timeout);
    } else {
      // Token already expired
      this.logout();
    }
  }

  /**
   * Stop the token expiry timer
   */
  private stopTokenExpiryTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = null;
    }
  }

  /**
   * Clear authentication state
   */
  private clearAuthState(): void {
    this._isAuthenticated = false;
    this._username = '';
    this._roles = [];
    this._accessToken = '';
    this._tokenExpiry = 0;
  }

  /**
   * Logout the user
   */
  logout(): void {
    console.log('Logging out user');

    // Stop the token expiry timer
    this.stopTokenExpiryTimer();

    // Clear authentication state
    this.clearAuthState();

    // Clear localStorage
    this.clearAuthStateFromStorage();

    // Notify subscribers about authentication state change
    this.authStateSubject.next(false);

    // Redirect to login page
    this.router.navigate(['/login']);
  }

  /**
   * Get user profile from backend
   */
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.backendHost}/auth/profile`).pipe(
      catchError(error => {
        console.error('Failed to get user profile:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    return this._roles.includes(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this._roles.includes(role));
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  /**
   * Check if user is regular user
   */
  isUser(): boolean {
    return this.hasRole('USER');
  }

  /**
   * Get authentication headers for API requests
   */
  getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();

    if (this._accessToken && !this.isTokenExpired()) {
      headers = headers.set('Authorization', `Bearer ${this._accessToken}`);
    }

    return headers;
  }

  /**
   * Extract error message from HTTP error response
   */
  private extractErrorMessage(error: any): string {
    if (error?.error?.message) {
      return error.error.message;
    }
    if (error?.message) {
      return error.message;
    }
    if (error?.status === 401) {
      return 'Invalid username or password';
    }
    if (error?.status === 403) {
      return 'Access forbidden';
    }
    if (error?.status === 0) {
      return 'Unable to connect to server';
    }
    return 'An unexpected error occurred';
  }
}
