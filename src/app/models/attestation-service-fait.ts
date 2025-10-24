export interface AttestationServiceFait {
    code: string;
    referenceBonCommande: string;
    fournisseur: string;
    titre: string;
    dateDeCreation: Date;
    dateDeLivraison: Date;
    constat: string;
    preuve: string;
    statut?: string;
}
