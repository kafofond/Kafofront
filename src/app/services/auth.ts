import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface SignupRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  confirmationMotDePasse: string;
  departement: string;
  role: string;
  entrepriseId: number;
}

interface LoginRequest {
  email: string;
  motDePasse: string;
}

interface LoginResponse {
  token?: string;
  message?: string;
  user?: any;
}

interface ResetPasswordRequest {
  code: string;
  nouveauMotDePasse: string;
  confirmationMotDePasse: string;
}

interface RequestResetCode {
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  // --- Login ---
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  // --- Signup (Admin / Super Admin) ---
  signup(data: SignupRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  // --- Vérification token ---
  verifyToken(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.baseUrl}/verify`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // --- Demander code réinitialisation mot de passe ---
  requestPasswordReset(data: RequestResetCode): Observable<any> {
    return this.http.post(`${this.baseUrl}/reinitialiser-mot-de-passe/demander`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  // --- Réinitialiser mot de passe ---
  resetPassword(data: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/reinitialiser-mot-de-passe`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  // --- Gestion centralisée des erreurs ---
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion internet.';
      } else if (error.status === 401) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.status === 404) {
        errorMessage = 'Service non trouvé';
      } else if (error.status >= 500) {
        errorMessage = 'Erreur interne du serveur';
      } else {
        errorMessage = error.error?.message || `Erreur ${error.status}`;
      }
    }
    
    console.error('Erreur AuthService:', error);
    return throwError(() => new Error(errorMessage));
  }

  // --- Méthodes utilitaires pour la gestion du token ---
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}