import { Statut } from "../enums/statut";

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
  statut?: Statut;
  etat?: boolean;
  entrepriseId?: number;
  createurNom: string;
  createurEmail: string;
  entrepriseNom: string;
}

export interface CreateBudgetRequest {
  intituleBudget: string;
  description: string;
  montantBudget: number;
  dateDebut: string; // Format: YYYY-MM-DD
  dateFin: string;   // Format: YYYY-MM-DD
}

export interface BudgetResponse {
  message?: string;
  budgetId?: number;
}
