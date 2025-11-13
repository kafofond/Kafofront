import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BonCommandeApiResponse {
  total: number;
  entrepriseId: number;
  bons: any[];
}

export interface BonCommandeDetail {
  id: number;
  code: string;
  fournisseur: string;
  description: string;
  montantTotal: number;
  serviceBeneficiaire: string;
  modePaiement: string;
  dateCreation: string;
  delaiPaiement: string;
  dateExecution: string;
  statut: string;
  urlPdf: string | null;
  createurNom: string;
  createurEmail: string;
  entrepriseNom: string;
  demandeAchatId: number;
  commentaires: any[];
}

export interface RejetBonCommandeRequest {
  commentaire: string;
}

@Injectable({
  providedIn: 'root'
})
export class BonCommandeService {
  private apiUrl = 'http://localhost:8080/api/bons-commande';

  constructor(private http: HttpClient) { }

  getBonsCommandeByEntreprise(entrepriseId: number): Observable<BonCommandeApiResponse> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<BonCommandeApiResponse>(`${this.apiUrl}/entreprise/${entrepriseId}`, { headers });
  }

  getBonCommandeById(id: number): Observable<BonCommandeDetail> {
    return this.http.get<BonCommandeDetail>(`${this.apiUrl}/${id}`);
  }

  approuverBonCommande(id: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/${id}/approuver`, {}, { headers });
  }

  rejeterBonCommande(id: number, commentaire: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const body: RejetBonCommandeRequest = { commentaire };
    return this.http.post(`${this.apiUrl}/${id}/rejeter`, body, { headers });
  }

  validerBonCommande(id: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/${id}/valider`, {}, { headers });
  }

  updateBonCommande(id: number, bonCommandeData: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/${id}`, bonCommandeData, { headers });
  }
}