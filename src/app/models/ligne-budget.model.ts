export interface LigneBudget {
  id: number;
  code: string;
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
  tauxUtilisation: number;
  budgetId: number;
  createurNom: string;
  createurEmail: string;
  //entrepriseNom: string;
}

// Fonction de mapping de l'API vers le modèle d'application
export function mapApiLigneToLigneBudget(apiLigne: any): LigneBudget {
  const montantAlloue = apiLigne.montantAllouer || 0;
  const montantEngage = apiLigne.montantEngager || 0;
  const tauxUtilisation = montantAlloue > 0 ? (montantEngage / montantAlloue) * 100 : 0;

  return {
    id: apiLigne.id,
    code: apiLigne.code || 'N/A',
    intituleLigne: apiLigne.intituleLigne || 'Intitulé non défini',
    description: apiLigne.description || 'Aucune description',
    dateDeCreation: new Date(apiLigne.dateCreation),
    commentaire: apiLigne.commentaires && apiLigne.commentaires.length > 0 
      ? apiLigne.commentaires[0].contenu 
      : 'Aucun commentaire',
    statut: mapApiStatutToDisplay(apiLigne.statut),
    etat: apiLigne.actif,
    dateDebut: new Date(), // À adapter selon les données API
    dateFin: new Date(), // À adapter selon les données API
    montantAlloue: montantAlloue,
    montantEngage: montantEngage,
    montantRestant: apiLigne.montantRestant || 0,
    tauxUtilisation: parseFloat(tauxUtilisation.toFixed(2)),
    budgetId: apiLigne.budgetId,
    createurNom: apiLigne.createurNom || 'Non spécifié',
    createurEmail: apiLigne.createurEmail || 'Non spécifié',
    //entrepriseNom: apiLigne.entrepriseNom || 'Non spécifié'
  };
}

function mapApiStatutToDisplay(apiStatut: string): string {
  const statutMap: { [key: string]: string } = {
    'VALIDE': 'Validé',
    'EN_COURS': 'En cours',
    'REFUSE': 'Refusé'
  };
  return statutMap[apiStatut] || apiStatut;
}

// Fonction inverse pour l'envoi vers l'API
export function mapLigneBudgetToApi(ligneBudget: LigneBudget): any {
  return {
    intituleLigne: ligneBudget.intituleLigne,
    description: ligneBudget.description,
    montantAllouer: ligneBudget.montantAlloue,
    budgetId: ligneBudget.budgetId,
    commentaire: ligneBudget.commentaire
  };
}