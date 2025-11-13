export interface OrdreDePaiement {
  id: number;
  code: string;
  referenceDecisionPrelevement: string | null;
  montant: number;
  description: string;
  compteOrigine: string;
  compteDestinataire: string;
  dateExecution: string | null;
  dateCreation: string;
  dateModification: string;
  statut: string;
  createurNom: string;
  createurEmail: string;
  entrepriseNom: string;
  decisionId: number | null;
}