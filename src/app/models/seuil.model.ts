export interface Seuil {
  id: number;
  montantSeuil: number;
  dateCreation: string;
  actif: boolean;
  entrepriseNom: string;
}

export interface SeuilsResponse {
  total: number;
  seuils: Seuil[];
}

export interface SeuilResponse {
  seuil: Seuil;
  message: string;
}