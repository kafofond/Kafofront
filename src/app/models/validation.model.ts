export interface Validation {
  id: number;
  validateurId: number;
  commentaire: string;
  statut: string;
  idDocument: number;
  typeDocument: string;
  dateValidation: string;
  validateurNomComplet: string | null;
  validateurEmail: string | null;
  codeDocument: string | null;
}

export interface ValidationResponse {
  total: number;
  validations: Validation[];
}