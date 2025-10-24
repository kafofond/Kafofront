import { Statut } from "../enums/statut";

export interface OrdreDePaiement {
    code: string;
    referenceDecionDePrelevement: string;
    montantAPrelever: number;
    compteOrigine: string;
    compteDestinataire: string;
    dateExecution: Date;
    dateDeCreation: Date;
    description: string;
    statut: Statut;
}
