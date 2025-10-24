import { Statut } from "../enums/statut";

export interface DemandeAchat {
    code: string;
    referenceBesoin: string;
    description: string;
    fournisseur: string;
    montantTotal: number;
    serviceBeneficiaire: string;
    dateExecution: Date;
    dateDeCreation: Date;
    devis: string;
    statut: Statut;
}
