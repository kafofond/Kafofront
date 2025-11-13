export interface AttestationServiceFait {
  id?: number;
  code: string;
  referenceBonCommande: string;
  fournisseur: string;
  titre: string;
  dateCreation: string;
  dateLivraison: string;
  constat: string;
  preuve: string;
  statut?: string;
}