import { Statut } from "../enums/statut";

export interface FicheBesoin {
    code: string;
    serviceBeneficiaire: string;
    description: string;
    objet: string;
    designation: string;
    date: Date;
    dateDeCreation: Date;
    urlFichier: string;
    statut: Statut;
}
