export interface DecisionPrelevement {
  id: number;
  code: string;
  referenceAttestation: string | null;
  montant: number;
  compteOrigine: string;
  compteDestinataire: string;
  motifPrelevement: string;
  dateCreation: string;
  dateModification: string;
  statut: string;
  createurNom: string;
  createurEmail: string;
  entrepriseNom: string;
  attestationId: number | null;
}