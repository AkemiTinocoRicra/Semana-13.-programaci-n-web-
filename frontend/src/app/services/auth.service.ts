import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface TokenResponse {
  access_token: string;
  token_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Assuming the Angular dev server proxies /api to the FastAPI backend
  private apiBase = '/api';

  constructor(private http: HttpClient) {}

  /** Register a new user. The backend returns a JWT which is set as an HttpOnly cookie. */
  register(email: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${this.apiBase}/auth/register`,
      { email, password },
      { withCredentials: true }
    );
  }

  /** Login an existing user. The JWT is stored in a HttpOnly cookie. */
  login(email: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${this.apiBase}/auth/login`,
      { email, password },
      { withCredentials: true }
    );
  }

  /** Logout – calls the backend which revokes the token and clears the cookie. */
  logout(): Observable<any> {
    return this.http.post<any>(
      `${this.apiBase}/auth/logout`,
      {},
      { withCredentials: true }
    );
  }

  /** Retrieve current user information (if the cookie is valid). */
  me(): Observable<{ email: string; id: number }> {
    return this.http.get<{ email: string; id: number }>(
      `${this.apiBase}/auth/me`,
      { withCredentials: true }
    );
  }
}
