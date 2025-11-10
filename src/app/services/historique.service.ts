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
  action: string;
  ancienStatut: string | null;
  nouveauStatut: string | null;
  ancienEtat: string | null;
  nouveauEtat: string | null;
  dateAction: string;
  utilisateurId: number;
  utilisateurNomComplet: string;
  utilisateurEmail: string;
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

  // Méthode pour formater l'action en français
  formaterAction(action: string): string {
    const actionsMap: { [key: string]: string } = {
      'CREATION': 'Créé',
      'MODIFICATION': 'Modifié',
      'DESACTIVATION': 'Désactivé',
      'REACTIVATION': 'Réactivé',
      'VALIDATION': 'Validé',
      'REJET': 'Rejeté'
    };
    return actionsMap[action] || action;
  }

  // Méthode pour formater le type de document
  formaterTypeDocument(typeDocument: string): string {
    const typesMap: { [key: string]: string } = {
      'UTILISATEUR': 'Utilisateur',
      'DOCUMENT': 'Document',
      'ENTREPRISE': 'Entreprise',
      'PROJET': 'Projet'
    };
    return typesMap[typeDocument] || typeDocument;
  }

  // Méthode pour générer un nom de fichier basé sur le type et l'ID
  genererNomFichier(historique: HistoriqueAction): string {
    const prefix = this.formaterTypeDocument(historique.typeDocument);
    return `${prefix}_${historique.idDocument}`;
  }
}