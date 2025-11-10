// services/fiche-besoin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Interfaces locales dans le service (temporaire)
export interface Designation {
  produit: string;
  quantite: number;
  prixUnitaire: number;
  montantTotal: number;
  date: string;
}

export interface FicheBesoin {
  id?: number;
  code?: string;
  serviceBeneficiaire: string;
  objet: string;
  description: string;
  montantEstime: number;
  dateAttendu: string;
  urlFichierJoint: string;
  designations: Designation[];
  statut?: string;
  auteur?: string;
  dateCreation?: string;
  dateModification?: string;
  quantite?: number;
  entrepriseId?: number;
  creeParId?: number;
  createurNom?: string;
  createurEmail?: string;
  entrepriseNom?: string;
  commentaires?: any[];
}

export interface FicheBesoinResponse extends FicheBesoin {}

// Interface pour la réponse de l'API
interface ApiResponse {
  fiches: FicheBesoinResponse[];
  message?: string;
  total?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FicheBesoinService {
  private baseUrl = 'http://localhost:8080/api/fiches-besoin';

  constructor(private http: HttpClient) { }

  // Méthode pour obtenir les headers avec le token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  }

  // Récupérer toutes les fiches de besoin
  getAllFiches(): Observable<FicheBesoinResponse[]> {
    const headers = this.getAuthHeaders();
    
    return this.http.get<ApiResponse>(this.baseUrl, { headers })
      .pipe(
        map(response => {
          // Extraire le tableau de fiches de la réponse
          if (response && response.fiches && Array.isArray(response.fiches)) {
            return response.fiches;
          } else if (Array.isArray(response)) {
            // Si la réponse est directement un tableau (fallback)
            return response;
          } else {
            return [];
          }
        }),
        catchError(this.handleError)
      );
  }

  // Récupérer une fiche par son ID
  getFicheById(id: number): Observable<FicheBesoinResponse> {
    return this.http.get<FicheBesoinResponse>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Créer une nouvelle fiche de besoin
  createFiche(fiche: FicheBesoin): Observable<FicheBesoinResponse> {
    return this.http.post<FicheBesoinResponse>(this.baseUrl, fiche, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Modifier une fiche de besoin
  updateFiche(id: number, fiche: FicheBesoin): Observable<FicheBesoinResponse> {
    return this.http.put<FicheBesoinResponse>(`${this.baseUrl}/${id}`, fiche, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Valider une fiche de besoin
  validerFiche(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/valider`, {}, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Rejeter une fiche de besoin
  rejeterFiche(id: number, motif: string): Observable<any> {
    const body = { motif: motif };
    return this.http.post(`${this.baseUrl}/${id}/rejeter`, body, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Approuver une fiche de besoin
  approuverFiche(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/approuver`, {}, { headers: this.getAuthHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Gestion centralisée des erreurs
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
      } else if (error.status === 401) {
        errorMessage = 'Non authentifié. Veuillez vous reconnecter.';
        this.redirectToLogin();
      } else if (error.status === 403) {
        errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
      } else if (error.status === 404) {
        errorMessage = 'Ressource non trouvée';
      } else if (error.status >= 500) {
        errorMessage = 'Erreur interne du serveur';
      } else {
        errorMessage = error.error?.message || `Erreur ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // Redirection vers la page de login en cas d'erreur d'authentification
  private redirectToLogin() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    setTimeout(() => {
      window.location.href = '/seconnecter';
    }, 2000);
  }
}