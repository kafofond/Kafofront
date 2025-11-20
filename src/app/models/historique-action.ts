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