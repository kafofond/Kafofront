import { Statut } from "../enums/statut";

export interface BonDeCommande {
    code: string;
    referenceDemande: string;
    fournisseur: string;
    description: string;
    montantTotal: number;
    serviceBeneficiaire: string;
    dateExecution: Date;
    dateDeCreation: Date;
    statut: Statut;
    modeDePaiement: string;
    delaiDePaiement: Date;

}
