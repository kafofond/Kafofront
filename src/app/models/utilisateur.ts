import { Role } from "../enums/role";

export interface Utilisateur {
    nomUtilisateur: string;
    prenomUtilisateur: string;
    email: string;
    motDePasse: string;
    role: Role;
    etat: boolean;
    derniereActivite?: string;
}
