import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ValidationResponse } from '../models/validation.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private apiUrl = 'http://localhost:8080/api/validation'; 

  constructor(private http: HttpClient) {}

  getValidationsEntreprise(): Observable<ValidationResponse> {
    return this.http.get<ValidationResponse>(`${this.apiUrl}/entreprise`);
  }

  getValidationsUtilisateur(utilisateurId: number): Observable<ValidationResponse> {
    return this.http.get<ValidationResponse>(`${this.apiUrl}/utilisateur/${utilisateurId}`);
  }

  // Méthode pour formater le statut en français
  formaterStatut(statut: string): string {
    const statutsMap: { [key: string]: string } = {
      'VALIDE': 'Validé',
      'APPROUVE': 'Approuvé',
      'REJETE': 'Rejeté'
    };
    return statutsMap[statut] || statut;
  }

  // Méthode pour formater le type de document
  formaterTypeDocument(typeDocument: string): string {
    const typesMap: { [key: string]: string } = {
      'DECISION_PRELEVEMENT': 'Décision de Prélèvement',
      'FICHE_BESOIN': 'Fiche de Besoin',
      'DEMANDE_ACHAT': 'Demande d\'Achat',
      'BON_COMMANDE': 'Bon de Commande',
      'ATTESTATION_SERVICE_FAIT': 'Attestation de Service Fait',
      'ORDRE_PAIEMENT': 'Ordre de Paiement'
    };
    return typesMap[typeDocument] || typeDocument;
  }
}