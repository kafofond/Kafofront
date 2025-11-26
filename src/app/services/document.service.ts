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

  /**
   * Télécharger le PDF d'une liste de fiches de besoin
   * @param ids Liste des IDs des fiches de besoin
   * @param nomFichier Nom du fichier PDF (optionnel)
   */
  downloadListeFichesBesoinPdf(ids: number[], nomFichier?: string): Observable<Blob> {
    const requestBody = {
      ids: ids,
      nomFichier: nomFichier
    };
    return this.http.post(`${this.baseUrl}/liste/fiches-besoin/pdf`, requestBody, {
      responseType: 'blob'
    });
  }

  /**
   * Télécharger le PDF d'une liste de demandes d'achat
   * @param ids Liste des IDs des demandes d'achat
   * @param nomFichier Nom du fichier PDF (optionnel)
   */
  downloadListeDemandesAchatPdf(ids: number[], nomFichier?: string): Observable<Blob> {
    const requestBody = {
      ids: ids,
      nomFichier: nomFichier
    };
    return this.http.post(`${this.baseUrl}/liste/demandes-achat/pdf`, requestBody, {
      responseType: 'blob'
    });
  }

  /**
   * Télécharger le PDF d'une liste de bons de commande
   * @param ids Liste des IDs des bons de commande
   * @param nomFichier Nom du fichier PDF (optionnel)
   */
  downloadListeBonsCommandePdf(ids: number[], nomFichier?: string): Observable<Blob> {
    const requestBody = {
      ids: ids,
      nomFichier: nomFichier
    };
    return this.http.post(`${this.baseUrl}/liste/bons-commande/pdf`, requestBody, {
      responseType: 'blob'
    });
  }

  /**
   * Télécharger le PDF d'une liste de budgets
   * @param ids Liste des IDs des budgets
   * @param nomFichier Nom du fichier PDF (optionnel)
   */
  downloadListeBudgetsPdf(ids: number[], nomFichier?: string): Observable<Blob> {
    const requestBody = {
      ids: ids,
      nomFichier: nomFichier
    };
    return this.http.post(`${this.baseUrl}/liste/budgets/pdf`, requestBody, {
      responseType: 'blob'
    });
  }

  /**
   * Télécharger le PDF d'une liste d'attestations de service fait
   * @param ids Liste des IDs des attestations
   * @param nomFichier Nom du fichier PDF (optionnel)
   */
  downloadListeAttestationsServicePdf(ids: number[], nomFichier?: string): Observable<Blob> {
    const requestBody = {
      ids: ids,
      nomFichier: nomFichier
    };
    return this.http.post(`${this.baseUrl}/liste/attestations-service-fait/pdf`, requestBody, {
      responseType: 'blob'
    });
  }

  /**
   * Télécharger le PDF d'une liste de décisions de prélèvement
   * @param ids Liste des IDs des décisions
   * @param nomFichier Nom du fichier PDF (optionnel)
   */
  downloadListeDecisionsPrelevementPdf(ids: number[], nomFichier?: string): Observable<Blob> {
    const requestBody = {
      ids: ids,
      nomFichier: nomFichier
    };
    return this.http.post(`${this.baseUrl}/liste/decisions-prelevement/pdf`, requestBody, {
      responseType: 'blob'
    });
  }

  /**
   * Télécharger le PDF d'une liste d'ordres de paiement
   * @param ids Liste des IDs des ordres
   * @param nomFichier Nom du fichier PDF (optionnel)
   */
  downloadListeOrdresPaiementPdf(ids: number[], nomFichier?: string): Observable<Blob> {
    const requestBody = {
      ids: ids,
      nomFichier: nomFichier
    };
    return this.http.post(`${this.baseUrl}/liste/ordres-paiement/pdf`, requestBody, {
      responseType: 'blob'
    });
  }

  /**
   * Télécharger le PDF d'une liste de lignes de crédit
   * @param ids Liste des IDs des lignes de crédit
   * @param nomFichier Nom du fichier PDF (optionnel)
   */
  downloadListeLignesCreditPdf(ids: number[], nomFichier?: string): Observable<Blob> {
    const requestBody = {
      ids: ids,
      nomFichier: nomFichier
    };
    return this.http.post(`${this.baseUrl}/liste/lignes-credit/pdf`, requestBody, {
      responseType: 'blob'
    });
  }
}