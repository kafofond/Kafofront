export interface AttestationServiceFait {
  id?: number;
  code: string | null;
  referenceBonCommande: string | null;
  fournisseur: string;
  titre: string;
  dateCreation: string;
  dateLivraison: string;
  constat: string;
  preuve?: string;
  urlFichierJoint?: string | null;
  createurNom?: string;
  createurEmail?: string;
  entrepriseNom?: string | null;
  bonDeCommandeId?: number;
  statut?: string;
}