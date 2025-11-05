export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string | null;
  departement: string;
  role: string;
  actif: boolean;
  entrepriseId: number;
  entrepriseNom: string | null;
  dateCreation: string | null;
}

export interface UtilisateurResponse {
  utilisateurs: Utilisateur[];
  total: number;
}

export interface CreateUserRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  departement: string;
  role: string;
  entrepriseId: number;
}