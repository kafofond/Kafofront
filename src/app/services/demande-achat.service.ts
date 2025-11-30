import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface DemandeAchat {
  id: number;
  code: string;
  description: string;
  fournisseur: string;
  montantTotal: number;
  serviceBeneficiaire: string;
  dateCreation: string;
  dateAttendu: string;
  statut: 'VALIDE' | 'EN_COURS' | 'APPROUVE' | 'REJETE';
  urlFichierJoint: string | null;
  createurNom: string;
  createurEmail: string;
  entrepriseNom: string;
  ficheBesoinId: number | null;
  ficheBesoinCode: string | null;
  commentaires: any[];
}

export interface DemandesResponse {
  total: number;
  entrepriseId: number;
  demandes: DemandeAchat[];
}

export interface UpdateDemandeRequest {
  description: string;
  fournisseur: string;
  montantTotal: number;
  serviceBeneficiaire: string;
  dateAttendu: string;
  statut: string;
}

@Injectable({
  providedIn: 'root'
})
export class DemandeAchatService {
  private baseUrl = 'http://localhost:8080/api/demandes-achat';

  constructor(private http: HttpClient) {}

  // Récupérer toutes les demandes d'achat de l'entreprise
  getDemandesByEntreprise(entrepriseId: number): Observable<DemandesResponse> {
    return this.http.get<DemandesResponse>(`${this.baseUrl}/entreprise/${entrepriseId}`).pipe(
      tap(data => console.log('📊 Données demandes d\'achat reçues:', data)),
      catchError(this.handleError)
    );
  }

  // Récupérer une demande d'achat spécifique par ID
  getDemandeById(id: number): Observable<DemandeAchat> {
    return this.http.get<DemandeAchat>(`${this.baseUrl}/${id}`).pipe(
      tap(data => console.log(`📋 Détails demande ${id} reçus:`, data)),
      catchError(this.handleError)
    );
  }

  // Mettre à jour une demande d'achat
  updateDemande(id: number, demandeData: UpdateDemandeRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, demandeData).pipe(
      tap(response => console.log(`✅ Demande ${id} mise à jour:`, response)),
      catchError(this.handleError)
    );
  }

  // Créer une nouvelle demande d'achat
  createDemande(demandeData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, demandeData).pipe(
      tap(response => console.log('✅ Nouvelle demande créée:', response)),
      catchError(this.handleError)
    );
  }

  // Valider une demande d'achat
  validerDemande(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/valider`, {}).pipe(
      tap(response => console.log(`✅ Demande ${id} validée:`, response)),
      catchError(this.handleError)
    );
  }

  // Approuver une demande d'achat
  approuverDemande(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/approuver`, {}).pipe(
      tap(response => console.log(`✅ Demande ${id} approuvée:`, response)),
      catchError(this.handleError)
    );
  }

  // Rejeter une demande d'achat
  rejeterDemande(id: number, commentaire: string): Observable<any> {
    const body = { commentaire: commentaire };
    return this.http.post(`${this.baseUrl}/${id}/rejeter`, body).pipe(
      tap(response => console.log(`✅ Demande ${id} rejetée:`, response)),
      catchError(this.handleError)
    );
  }

  // Méthodes de mapping pour l'affichage
  mapStatutToDisplay(statut: string): string {
    const statutMap: { [key: string]: string } = {
      'VALIDE': 'Validé',
      'EN_COURS': 'En cours',
      'APPROUVE': 'Approuvé',
      'REJETE': 'Rejeté'
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