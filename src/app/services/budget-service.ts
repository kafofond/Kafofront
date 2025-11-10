import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Budget, CreateBudgetRequest } from '../models/budget';


@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private baseUrl = 'http://localhost:8080/api/budgets';

  constructor(private http: HttpClient) { }

  // --- Récupérer tous les budgets ---
  getAllBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.baseUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  // --- Récupérer un budget par ID ---
  getBudgetById(id: number): Observable<Budget> {
    return this.http.get<Budget>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // // --- Créer un nouveau budget ---
  // createBudget(budgetData: CreateBudgetRequest): Observable<any> {
  //   return this.http.post<any>(this.baseUrl, budgetData)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  // // --- Modifier un budget ---
  // updateBudget(id: number, budgetData: CreateBudgetRequest): Observable<any> {
  //   return this.http.put<any>(`${this.baseUrl}/${id}`, budgetData)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  // // --- Valider un budget (Directeur uniquement) ---
  // validateBudget(id: number): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/${id}/valider`, {})
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  // // --- Rejeter un budget (Directeur uniquement) ---
  // rejectBudget(id: number, commentaire: string): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/${id}/rejeter`, { commentaire })
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  // // --- Activer un budget ---
  // activateBudget(id: number): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/${id}/activer`, {})
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  // // --- Désactiver un budget ---
  // deactivateBudget(id: number): Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/${id}/desactiver`, {})
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  // // --- Générer le PDF d'un budget ---
  // generateBudgetPdf(id: number): Observable<{ pdfUrl: string }> {
  //   return this.http.get<{ pdfUrl: string }>(`${this.baseUrl}/${id}/pdf`)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  // --- Filtrer les budgets par statut ---
  getBudgetsByStatus(statut: string): Observable<Budget[]> {
    const params = new HttpParams().set('statut', statut);
    return this.http.get<Budget[]>(this.baseUrl, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // --- Gestion centralisée des erreurs ---
  private handleError(error: any) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion internet.';
      } else if (error.status === 401) {
        errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
      } else if (error.status === 403) {
        errorMessage = 'Accès refusé. Vous n\'avez pas les droits nécessaires.';
      } else if (error.status === 404) {
        errorMessage = 'Budget non trouvé';
      } else if (error.status >= 500) {
        errorMessage = 'Erreur interne du serveur';
      } else {
        errorMessage = error.error?.message || `Erreur ${error.status}`;
      }
    }
    
    console.error('Erreur BudgetService:', error);
    return throwError(() => new Error(errorMessage));
  }
}