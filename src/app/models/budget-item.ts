export interface BudgetItem {
    intituleBudget: string;
    description: string;
    codeBudget?: string;
    commentaire?: string;
    montantBudget: number;
    dateDeCreation: Date;
    dateDeDebut: Date;
    dateDeFin: Date;
    statut: 'En cours' | 'Validé' | 'Refusé';
    etat: 'Actif' | 'Inactif';
}
