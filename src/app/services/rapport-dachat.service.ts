import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface RapportDachat {
  id: number;
  nom: string;
  ficheBesoin: string;
  demandeAchat: string;
  bonCommande: string;
  attestationServiceFait: string;
  decisionPrelevement: string;
  ordrePaiement: string;
  dateAjout: string;
  entrepriseNom: string;
}

export interface RapportsResponse {
  total: number;
  rapports: RapportDachat[];
}

export interface CreateRapportRequest {
  nom: string;
  ficheBesoin: string;
  demandeAchat: string;
  bonCommande: string;
  attestationServiceFait: string;
  decisionPrelevement: string;
  ordrePaiement: string;
}

@Injectable({
  providedIn: 'root'
})
export class RapportDachatService {
  private baseUrl = 'http://localhost:8080/api/rapports-achat';

  constructor(private http: HttpClient) {}

  // Récupérer tous les rapports d'achat
  getAllRapports(): Observable<RapportsResponse> {
    return this.http.get<RapportsResponse>(this.baseUrl).pipe(
      tap(response => console.log('📄 Rapports d\'achat reçus:', response)),
      catchError(error => {
        console.error('❌ Erreur lors du chargement des rapports d\'achat:', error);
        return of({ total: 0, rapports: [] });
      })
    );
  }

  // Récupérer un rapport d'achat spécifique par ID
  getRapportById(id: number): Observable<RapportDachat> {
    return this.http.get<RapportDachat>(`${this.baseUrl}/${id}`).pipe(
      tap(data => console.log(`📋 Détails rapport ${id} reçus:`, data)),
      catchError(error => {
        console.error(`❌ Erreur lors du chargement du rapport ${id}:`, error);
        throw error;
      })
    );
  }

  // Créer un nouveau rapport d'achat
  createRapport(rapportData: CreateRapportRequest): Observable<RapportDachat> {
    return this.http.post<RapportDachat>(this.baseUrl, rapportData).pipe(
      tap(response => console.log('✅ Nouveau rapport créé:', response)),
      catchError(error => {
        console.error('❌ Erreur lors de la création du rapport:', error);
        throw error;
      })
    );
  }

  // Supprimer un rapport d'achat
  deleteRapport(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(response => console.log(`✅ Rapport ${id} supprimé:`, response)),
      catchError(error => {
        console.error(`❌ Erreur lors de la suppression du rapport ${id}:`, error);
        throw error;
      })
    );
  }
}