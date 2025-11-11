import { Statut } from "../enums/statut";

export interface BonDeCommande {
  id: number;
  referenceDemande: string
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
  urlPdf?: string | null;
  createurNom?: string;
  createurEmail?: string;
  entrepriseNom?: string;
  demandeAchatId?: number;
  commentaires?: any[];
}