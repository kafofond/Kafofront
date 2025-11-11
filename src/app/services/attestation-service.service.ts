import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AttestationApiResponse {
  total: number;
  entrepriseId: number;
  attestations: any[];
}

export interface AttestationDetail {
  id: number;
  code: string | null;
  referenceBonCommande: string | null;
  fournisseur: string;
  titre: string;
  constat: string;
  dateLivraison: string;
  dateCreation: string;
  urlFichierJoint: string | null;
  createurNom: string;
  createurEmail: string;
  entrepriseNom: string | null;
  bonDeCommandeId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AttestationServiceService {
  private apiUrl = 'http://localhost:8080/api/asf';

  constructor(private http: HttpClient) { }

  getAttestationsByEntreprise(entrepriseId: number): Observable<AttestationApiResponse> {
    return this.http.get<AttestationApiResponse>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }

  getAttestationById(id: number): Observable<AttestationDetail> {
    return this.http.get<AttestationDetail>(`${this.apiUrl}/${id}`);
  }
}