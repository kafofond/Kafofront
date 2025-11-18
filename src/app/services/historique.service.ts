import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface HistoriqueResponse {
  total: number;
  historique: HistoriqueAction[];
}

export interface HistoriqueAction {
  id: number;
  typeDocument: string;
  idDocument: number;
  documentCode: string | null;
  action: string;
  ancienStatut: string | null;
  nouveauStatut: string | null;
  ancienEtat: string | null;
  nouveauEtat: string | null;
  dateAction: string;
  utilisateurId: number;
  utilisateurNomComplet: string;
  utilisateurEmail: string;
  utilisateurConcerneNom: string | null;
  entrepriseId: number;
  entrepriseNom: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class HistoriqueService {
  private apiUrl = 'http://localhost:8080/api/historique'; 

  constructor(private http: HttpClient) {}

  getHistoriqueUtilisateur(): Observable<HistoriqueResponse> {
  return this.http.get<HistoriqueResponse>(`${this.apiUrl}/utilisateur`); 
}

  getHistoriqueEntreprise(): Observable<HistoriqueResponse> {
    return this.http.get<HistoriqueResponse>(`${this.apiUrl}/entreprise`);
  }

  getHistoriqueEntrepriseParType(typeDocument: string): Observable<HistoriqueResponse> {
    return this.http.get<HistoriqueResponse>(`${this.apiUrl}/entreprise/${typeDocument}`);
  }

  // Méthode pour formater l'action en français
  formaterAction(action: string): string {
    const actionsMap: { [key: string]: string } = {
      'CREATION': 'Créé',
      'MODIFICATION': 'Modifié',
      'DESACTIVATION': 'Désactivé',
      'REACTIVATION': 'Réactivé',
      'VALIDATION': 'Validé',
      'REJET': 'Rejeté',
      'APPROBATION': 'Approuvé',
      'ACTIVATION': 'Activé',
      'MISE_A_JOUR_MONTANTS': 'Mise à jour montants'
    };
    return actionsMap[action] || action;
  }

  // Méthode pour formater le type de document
  formaterTypeDocument(typeDocument: string): string {
    const typesMap: { [key: string]: string } = {
      'BUDGET': 'Budget',
      'LIGNE_CREDIT': 'Ligne de Credit',
      'FICHE_BESOIN': 'Fiche de Besoin',
      'DEMANDE_ACHAT': 'Demande d\'Achat',
      'BON_COMMANDE': 'Bon de Commande',
      'ATTESTATION_SERVICE_FAIT': 'Attestation de Service',
      'DECISION_PRELEVEMENT': 'Decision de Prelevement',
      'ORDRE_PAIEMENT': 'Ordre de Paiement',
      'ENTREPRISE': 'Entreprise',
      'UTILISATEUR': 'Utilisateur',
      'SEUIL_VALIDATION': 'Seuil de Validation',
      'RAPPORT_ACHAT': 'Rapport d\'Achat'
    };
    return typesMap[typeDocument] || typeDocument;
  }

  // Méthode pour générer un nom de fichier basé sur le type et l'ID
  genererNomFichier(historique: HistoriqueAction): string {
    // Pour les utilisateurs, afficher le nom de l'utilisateur concerné
    if (historique.typeDocument === 'UTILISATEUR' && historique.utilisateurConcerneNom) {
      return historique.utilisateurConcerneNom;
    }
    
    // Pour les entreprises, afficher le nom de l'entreprise
    if (historique.typeDocument === 'ENTREPRISE' && historique.entrepriseNom) {
      return historique.entrepriseNom;
    }
    
    // Pour les autres documents, utiliser le documentCode s'il est disponible, sinon le format par défaut
    if (historique.documentCode) {
      return historique.documentCode;
    }
    
    const prefix = this.formaterTypeDocument(historique.typeDocument);
    return `${prefix}_${historique.idDocument}`;
  }
}