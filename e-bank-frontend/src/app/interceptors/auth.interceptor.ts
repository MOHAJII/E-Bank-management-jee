import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Standalone interceptor function for Angular's provideHttpClient
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const interceptor = new AuthInterceptor(authService);

  // Create a proper HttpHandler from the HttpHandlerFn
  const handler: HttpHandler = {
    handle: next
  };

  return interceptor.intercept(req, handler);
};

/**
 * HTTP Interceptor that handles authentication for API requests
 *
 * Simplified version for Spring Boot backend that doesn't support refresh tokens
 * - Adds authentication token to outgoing requests
 * - Handles 401 Unauthorized errors by redirecting to login
 * - Provides comprehensive error handling for various HTTP status codes
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip interceptor for auth-related requests
    if (this.isAuthRequest(request.url)) {
      return next.handle(request);
    }

    // Add auth token to request if available
    let authRequest = request;
    if (this.authService.isAuthenticatedStatus()) {
      authRequest = this.addTokenHeader(request);
    }

    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, request, next);
      })
    );
  }

  /**
   * Check if the request is to an authentication endpoint
   */
  private isAuthRequest(url: string): boolean {
    const authEndpoints = ['/auth/login', '/auth/profile'];
    return authEndpoints.some(endpoint => url.includes(endpoint));
  }

  /**
   * Add authentication token to request headers
   */
  private addTokenHeader(request: HttpRequest<unknown>): HttpRequest<unknown> {
    try {
      const token = this.authService.getAccessToken();

      if (token) {
        let headers = new HttpHeaders();

        // Add Authorization header
        headers = headers.set('Authorization', `Bearer ${token}`);

        // Merge with existing headers
        request.headers.keys().forEach(key => {
          if (!headers.has(key)) {
            const value = request.headers.get(key);
            if (value) {
              headers = headers.set(key, value);
            }
          }
        });

        return request.clone({ headers });
      }
    } catch (error) {
      console.error('Error adding token header:', error);
    }

    return request;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(
    error: HttpErrorResponse,
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    console.error(`HTTP Error ${error.status} on ${request.method} ${request.url}:`, error.message);

    switch (error.status) {
      case 401:
        return this.handle401Error(error);
      case 403:
        console.error('Access forbidden:', error.message);
        return throwError(() => new Error('You do not have permission to access this resource'));
      case 0:
        return throwError(() => new Error('Unable to connect to server. Please check your internet connection.'));
      case 408:
        return throwError(() => new Error('Request timeout. Please try again.'));
      case 429:
        return throwError(() => new Error('Too many requests. Please try again later.'));
      case 500:
        return throwError(() => new Error('Internal server error. Please try again later.'));
      case 502:
        return throwError(() => new Error('Bad gateway. The server is temporarily unavailable.'));
      case 503:
        return throwError(() => new Error('Service unavailable. Please try again later.'));
      case 504:
        return throwError(() => new Error('Gateway timeout. Please try again later.'));
      default:
        const errorMessage = error.error?.message || error.message || 'An unexpected error occurred';
        return throwError(() => new Error(`Error ${error.status}: ${errorMessage}`));
    }
  }

  /**
   * Handle 401 Unauthorized errors
   * Since the backend doesn't support refresh tokens, we logout the user
   */
  private handle401Error(error: HttpErrorResponse): Observable<HttpEvent<unknown>> {
    console.error('401 Unauthorized - Token expired or invalid. Logging out user.');

    // Logout user and redirect to login
    this.authService.logout();

    return throwError(() => new Error('Your session has expired. Please login again.'));
  }
}
