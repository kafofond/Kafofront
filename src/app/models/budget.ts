export interface Budget {
  id?: number;
  code?: string;
  intituleBudget: string;
  description: string;
  montantBudget: number;
  dateCreation?: string;
  dateModification?: string;
  dateDebut?: string;
  dateFin?: string;
  statut?: string;
  etat?: boolean;
  entrepriseId?: number;
}
