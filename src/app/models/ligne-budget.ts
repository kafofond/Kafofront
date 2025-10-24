export interface LigneBudget {
    intituleLigne: string;
    description: string;
    dateDeCreation: Date;
    commentaire: string;
    statut: string;
    etat: boolean;
    dateDebut: Date;
    dateFin: Date;
    montantAlloue: number;
    montantEngage: number;
    montantRestant: number;
    tauxUtilisation?: number;
}
