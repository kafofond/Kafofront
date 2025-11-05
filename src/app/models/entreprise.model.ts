export interface Entreprise {
  id: number;
  nom: string;
  domaine: string;
  adresse: string;
  telephone: string;
  email: string;
  dateCreation: string;
  etat: boolean;
}

export interface EntrepriseResponse {
  total: number;
  entreprises: Entreprise[];
}

export interface CreateEntrepriseRequest {
  nom: string;
  domaine: string;
  adresse: string;
  telephone: string;
  email: string;
}