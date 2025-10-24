import { Statut } from "../enums/statut";

export interface DecisionPrelevement {
    code: string;
    referenceAttestationSF: string;
    montantAPrelever: number;
    compteDestinataire: string;
    compteOrigine: string;
    motifDePrelevement: string;
    statut: Statut;
    dateDeCreation: Date;
}
