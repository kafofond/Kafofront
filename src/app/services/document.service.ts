import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private baseUrl = 'http://localhost:8080/api/documents';

  constructor(private http: HttpClient) { }

  /**
   * Télécharger le PDF d'une fiche de besoin
   * @param id ID de la fiche de besoin
   */
  downloadFicheBesoinPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/fiche-besoin/${id}/pdf/download`, {
      responseType: 'blob'
    });
  }

  /**
   * Télécharger le PDF d'une demande d'achat
   * @param id ID de la demande d'achat
   */
  downloadDemandeAchatPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/demande-achat/${id}/pdf/download`, {
      responseType: 'blob'
    });
  }

  /**
   * Télécharger le PDF d'un bon de commande
   * @param id ID du bon de commande
   */
  downloadBonCommandePdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/bon-commande/${id}/pdf/download`, {
      responseType: 'blob'
    });
  }

  /**
   * Télécharger le PDF d'un budget
   * @param id ID du budget
   */
  downloadBudgetPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/budget/${id}/pdf/download`, {
      responseType: 'blob'
    });
  }

  /**
   * Télécharger le PDF d'une attestation de service fait
   * @param id ID de l'attestation
   */
  downloadAttestationServicePdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/attestation-service/${id}/pdf/download`, {
      responseType: 'blob'
    });
  }

  /**
   * Télécharger le PDF d'une décision de prélèvement
   * @param id ID de la décision
   */
  downloadDecisionPrelevementPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/decision-prelevement/${id}/pdf/download`, {
      responseType: 'blob'
    });
  }

  /**
   * Télécharger le PDF d'un ordre de paiement
   * @param id ID de l'ordre
   */
  downloadOrdrePaiementPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/ordre-paiement/${id}/pdf/download`, {
      responseType: 'blob'
    });
  }

  /**
   * Télécharger le PDF d'une ligne de crédit
   * @param id ID de la ligne
   */
  downloadLigneCreditPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/ligne-credit/${id}/pdf/download`, {
      responseType: 'blob'
    });
  }
}