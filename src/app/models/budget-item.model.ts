export interface BudgetItem {
  id: number;
  codeBudget: string;
  intituleBudget: string;
  description: string;
  montantBudget: number;
  dateDeCreation: Date;
  dateDeDebut: Date;
  dateDeFin: Date;
  etat: string;
  statut: string;
  commentaire?: string;
}

// Fonction utilitaire pour mapper l'API vers le modèle frontend
export function mapApiBudgetToBudgetItem(apiBudget: any): BudgetItem {
  return {
    id: apiBudget.id,
    codeBudget: apiBudget.code,
    intituleBudget: apiBudget.intituleBudget,
    description: apiBudget.description,
    montantBudget: apiBudget.montantBudget,
    dateDeCreation: new Date(apiBudget.dateCreation),
    dateDeDebut: new Date(apiBudget.dateDebut),
    dateDeFin: new Date(apiBudget.dateFin),
    etat: apiBudget.actif ? 'Actif' : 'Inactif',
    statut: mapApiStatutToDisplay(apiBudget.statut)
  };
}

// Fonction utilitaire pour mapper le modèle frontend vers l'API
export function mapBudgetItemToApiBudget(budgetItem: BudgetItem): any {
  return {
    intituleBudget: budgetItem.intituleBudget,
    description: budgetItem.description,
    montantBudget: budgetItem.montantBudget,
    dateDebut: formatDateForApi(budgetItem.dateDeDebut),
    dateFin: formatDateForApi(budgetItem.dateDeFin),
    statut: mapDisplayStatutToApi(budgetItem.statut),
    actif: budgetItem.etat === 'Actif'
  };
}

// Helper functions
function mapApiStatutToDisplay(apiStatut: string): string {
  const statutMap: { [key: string]: string } = {
    'VALIDE': 'Validé',
    'EN_COURS': 'En cours',
    'REJETE': 'Refusé'
  };
  return statutMap[apiStatut] || apiStatut;
}

function mapDisplayStatutToApi(displayStatut: string): string {
  const reverseMap: { [key: string]: string } = {
    'Validé': 'VALIDE',
    'En cours': 'EN_COURS',
    'Refusé': 'REFUSE'
  };
  return reverseMap[displayStatut];
}

function formatDateForApi(date: Date): string {
  return date.toISOString().split('T')[0];
}