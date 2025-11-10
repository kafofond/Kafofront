import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface LigneCredit {
  id: number;
  code: string;
  intituleLigne: string;
  description: string;
  montantAllouer: number;
  montantEngager: number;
  montantRestant: number;
  dateCreation: string;
  dateModification: string;
  dateDebut: string | null;
  dateFin: string | null;
  statut: 'VALIDE' | 'EN_COURS' | 'REFUSE';
  actif: boolean;
  budgetId: number | null;
  createurNom: string;
  createurEmail: string;
  entrepriseNom: string | null;
  commentaires: Commentaire[];
}

export interface Commentaire {
  id: number;
  contenu: string;
  dateCreation: string;
  dateCreationFormatee: string | null;
  auteurNom: string;
  auteurEmail: string;
}

export interface LignesResponse {
  total: number;
  lignes: LigneCredit[];
}

export interface UpdateLigneRequest {
  code: string;
  intituleLigne: string;
  description: string;
  montantAllouer: number;
  montantEngager: number;
  montantRestant: number;
  dateCreation: string;
  dateModification: string;
  dateDebut: string | null;
  dateFin: string | null;
  statut: string;
  actif: boolean;
  budgetId: number | null;
  createurNom: string;
  createurEmail: string;
  entrepriseNom: string | null;
  commentaires: Commentaire[];
}

export interface CreateLigneRequest {
  intituleLigne: string;
  description: string;
  montantAllouer: number;
  budgetId: number;
  commentaire?: string;
}

export interface RejetLigneRequest {
  commentaire: string;
}

@Injectable({
  providedIn: 'root'
})
export class LigneCreditService {
  private baseUrl = 'http://localhost:8080/api/lignes-credit';

  constructor(private http: HttpClient) {}

  // Récupérer toutes les lignes de crédit d'un budget
  getLignesByBudget(budgetId: number): Observable<LignesResponse> {
    const url = `${this.baseUrl}/budget/${budgetId}`;
    return this.http.get<LignesResponse>(url).pipe(
      tap(response => console.log(`📄 Lignes du budget ${budgetId} reçues:`, response)),
      catchError(error => {
        console.error(`❌ Erreur lors du chargement des lignes du budget ${budgetId}:`, error);
        return of({ total: 0, lignes: [] });
      })
    );
  }

  // Récupérer une ligne de crédit spécifique par ID
  getLigneById(id: number): Observable<LigneCredit> {
    return this.http.get<LigneCredit>(`${this.baseUrl}/${id}`).pipe(
      tap(data => console.log(`📋 Détails ligne ${id} reçus:`, data)),
      catchError(error => {
        console.error(`❌ Erreur lors du chargement de la ligne ${id}:`, error);
        throw error;
      })
    );
  }

  // Mettre à jour une ligne de crédit - STRUCTURE EXACTE DE L'API
  updateLigne(id: number, ligneData: UpdateLigneRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, ligneData).pipe(
      tap(response => console.log(`✅ Ligne ${id} mise à jour:`, response)),
      catchError(error => {
        console.error(`❌ Erreur lors de la mise à jour de la ligne ${id}:`, error);
        throw error;
      })
    );
  }

  // Créer une nouvelle ligne de crédit
  createLigne(ligneData: CreateLigneRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}`, ligneData).pipe(
      tap(response => console.log('✅ Nouvelle ligne créée:', response)),
      catchError(error => {
        console.error('❌ Erreur lors de la création de la ligne:', error);
        throw error;
      })
    );
  }

  // Actions spécifiques
  validerLigne(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/valider`, {}).pipe(
      tap(response => console.log(`✅ Ligne ${id} validée:`, response)),
      catchError(error => {
        console.error(`❌ Erreur lors de la validation de la ligne ${id}:`, error);
        throw error;
      })
    );
  }

  rejeterLigne(id: number, commentaire: string): Observable<any> {
    const rejetRequest: RejetLigneRequest = { commentaire };
    return this.http.post(`${this.baseUrl}/${id}/rejeter`, rejetRequest).pipe(
      tap(response => console.log(`✅ Ligne ${id} rejetée:`, response)),
      catchError(error => {
        console.error(`❌ Erreur lors du rejet de la ligne ${id}:`, error);
        throw error;
      })
    );
  }

  activerLigne(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/activer`, {}).pipe(
      tap(response => console.log(`✅ Ligne ${id} activée:`, response)),
      catchError(error => {
        console.error(`❌ Erreur lors de l'activation de la ligne ${id}:`, error);
        throw error;
      })
    );
  }

  desactiverLigne(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/desactiver`, {}).pipe(
      tap(response => console.log(`✅ Ligne ${id} désactivée:`, response)),
      catchError(error => {
        console.error(`❌ Erreur lors de la désactivation de la ligne ${id}:`, error);
        throw error;
      })
    );
  }

  // Méthodes de mapping pour l'affichage
  mapStatutToDisplay(statut: string): string {
    const statutMap: { [key: string]: string } = {
      'VALIDE': 'Validé',
      'EN_COURS': 'En cours',
      'REFUSE': 'Refusé'
    };
    return statutMap[statut] || statut;
  }

  mapActifToDisplay(actif: boolean): string {
    return actif ? 'Actif' : 'Inactif';
  }

  // Formater la date pour l'API
  formatDateForApi(date: Date): string {
    return date.toISOString().split('.')[0]; // Format: "2025-11-10T15:27:49"
  }
}