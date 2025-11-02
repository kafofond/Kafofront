import { Component } from '@angular/core';
import { HistoriqueAction } from '../../../models/historique-action';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contentbody-historique-action-dsi',
  imports: [FormsModule, CommonModule],
  templateUrl: './contentbody-historique-action-dsi.html',
  styleUrl: './contentbody-historique-action-dsi.css'
})
export class ContentbodyHistoriqueActionDsi {

  filtreAction: string = 'toutes';

  historiques: HistoriqueAction[] = [
    {
      fichier: 'Rapport_Achat_Q1.pdf',
      auteur: 'Ibrahim Bah',
      typeDocument: 'Rapport d’achat',
      action: 'Créé',
      date: new Date('2025-03-10')
    },
    {
      fichier: 'Budget_2025.xlsx',
      auteur: 'Aminata Traoré',
      typeDocument: 'Budget',
      action: 'Validé',
      date: new Date('2025-04-15')
    },
    {
      fichier: 'Demande_Formation.docx',
      auteur: 'Moussa Keita',
      typeDocument: 'Demande RH',
      action: 'Rejeté',
      date: new Date('2025-05-08')
    },
    {
      fichier: 'Bon_Commande_009.pdf',
      auteur: 'Fatou Diallo',
      typeDocument: 'Bon de commande',
      action: 'Modifié',
      date: new Date('2025-06-22')
    },
    {
      fichier: 'Rapport_Final_ProjetAI.pdf',
      auteur: 'Ibrahim Bah',
      typeDocument: 'Rapport projet',
      action: 'Validé',
      date: new Date('2025-07-01')
    }
  ];

  // Filtrage selon le type d’action sélectionné
  get historiquesFiltres() {
    if (this.filtreAction === 'valide') {
      return this.historiques.filter(h => h.action === 'Validé');
    } else if (this.filtreAction === 'rejete') {
      return this.historiques.filter(h => h.action === 'Rejeté');
    } else if (this.filtreAction === 'modifie') {
      return this.historiques.filter(h => h.action === 'Modifié');
    } else if (this.filtreAction === 'cree') {
      return this.historiques.filter(h => h.action === 'Créé');
    }
    return this.historiques;
  }

}
