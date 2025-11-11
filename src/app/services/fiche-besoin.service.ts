import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Designation {
  id: number;
  produit: string;
  quantite: number;
  prixUnitaire: number;
  montantTotal: number;
  date: string;
  ficheBesoinId: number;
}

export interface FicheBesoin {
  id: number;
  code: string;
  serviceBeneficiaire: string | null;
  objet: string | null;
  description: string | null;
  montantEstime: number;
  dateAttendu: string | null;
  dateCreation: string;
  statut: 'APPROUVE' | 'EN_COURS' | 'REJETE' | 'VALIDE';
  urlFichierJoint: string | null;
  createurNom: string;
  createurEmail: string;
  entrepriseNom: string;
  designations: Designation[];
  commentaires: any[];
}

export interface FichesResponse {
  fiches: FicheBesoin[];
  total?: number;
}

export interface UpdateFicheRequest {
  serviceBeneficiaire: string;
  objet: string;
  description: string;
  montantEstime: number;
  dateAttendu: string;
  statut: string;
}

@Injectable({
  providedIn: 'root'
})
export class FicheBesoinService {
  private baseUrl = 'http://localhost:8080/api/fiches-besoin';

  constructor(private http: HttpClient) {}

  // Récupérer toutes les fiches de besoin de l'entreprise
  getFichesByEntreprise(entrepriseId: number): Observable<FichesResponse> {
    return this.http.get<FichesResponse>(`${this.baseUrl}/entreprise/${entrepriseId}`).pipe(
      tap(data => console.log('📊 Données fiches de besoin reçues:', data)),
      catchError(this.handleError)
    );
  }

  // Récupérer une fiche de besoin spécifique par ID
  getFicheById(id: number): Observable<FicheBesoin> {
    return this.http.get<FicheBesoin>(`${this.baseUrl}/${id}`).pipe(
      tap(data => console.log(`📋 Détails fiche ${id} reçus:`, data)),
      catchError(this.handleError)
    );
  }

  // Mettre à jour une fiche de besoin
  updateFiche(id: number, ficheData: UpdateFicheRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, ficheData).pipe(
      tap(response => console.log(`✅ Fiche ${id} mise à jour:`, response)),
      catchError(this.handleError)
    );
  }

  // Créer une nouvelle fiche de besoin
  createFiche(ficheData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, ficheData).pipe(
      tap(response => console.log('✅ Nouvelle fiche créée:', response)),
      catchError(this.handleError)
    );
  }

  // Valider une fiche de besoin
  validerFiche(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/valider`, {}).pipe(
      tap(response => console.log(`✅ Fiche ${id} validée:`, response)),
      catchError(this.handleError)
    );
  }

  // Rejeter une fiche de besoin
  rejeterFiche(id: number, motif: string): Observable<any> {
    const body = { motif: motif };
    return this.http.post(`${this.baseUrl}/${id}/rejeter`, body).pipe(
      tap(response => console.log(`✅ Fiche ${id} rejetée:`, response)),
      catchError(this.handleError)
    );
  }

  // Approuver une fiche de besoin
  approuverFiche(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/approuver`, {}).pipe(
      tap(response => console.log(`✅ Fiche ${id} approuvée:`, response)),
      catchError(this.handleError)
    );
  }

  // Méthodes de mapping pour l'affichage
  mapStatutToDisplay(statut: string): string {
    const statutMap: { [key: string]: string } = {
      'APPROUVE': 'Approuvé',
      'EN_COURS': 'En cours',
      'REJETE': 'Rejeté',
      'VALIDE': 'Validé'
    };
    return statutMap[statut] || statut;
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
      } else if (error.status === 401) {
        errorMessage = 'Non authentifié. Veuillez vous reconnecter.';
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
}