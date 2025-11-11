import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

@Injectable({
  providedIn: 'root'
})
export class BonCommandeService {
  private apiUrl = 'http://localhost:8080/api/bons-commande';

  constructor(private http: HttpClient) { }

  getBonsCommandeByEntreprise(entrepriseId: number): Observable<BonCommandeApiResponse> {
    return this.http.get<BonCommandeApiResponse>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }

  getBonCommandeById(id: number): Observable<BonCommandeDetail> {
    return this.http.get<BonCommandeDetail>(`${this.apiUrl}/${id}`);
  }
}