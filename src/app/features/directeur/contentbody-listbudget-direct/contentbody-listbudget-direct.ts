import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { BudgetItem } from '../../../models/budget-item';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contentbody-listbudget-direct',
  imports: [RouterLink, CommonModule, DatePipe, FormsModule],
  templateUrl: './contentbody-listbudget-direct.html',
  styleUrl: './contentbody-listbudget-direct.css'
})
export class ContentbodyListbudgetDirect {

  budgets: BudgetItem[] = [
    {
      intituleBudget: 'Budget Marketing 2024',
      description: 'Budget alloué aux campagnes publicitaires et promotions pour l\'année 2024.',
      montantBudget: 5000000,
      codeBudget: "BD-001-01-24",
      dateDeCreation: new Date('2024-01-15'),
      dateDeDebut: new Date('2024-02-01'),
      dateDeFin: new Date('2024-12-31'),
      etat: 'Actif',
      statut: 'Validé'
    },
    {
      intituleBudget: 'Budget IT 2024',
      description: 'Budget pour l\'achat de matériel informatique et logiciels pour l\'année 2024.',
      montantBudget: 7500000,
      codeBudget: "BD-002-01-24",
      dateDeCreation: new Date('2024-01-20'),
      dateDeDebut: new Date('2024-03-01'),
      dateDeFin: new Date('2024-12-31'),
      etat: 'Actif',
      statut: 'En cours'
    },
    {
      intituleBudget: 'Budget Formation 2024',
      description: 'Budget destiné aux programmes de formation et développement des compétences pour l\'année 2024.',
      montantBudget: 3000000,
      codeBudget: "BD-003-01-24",
      dateDeCreation: new Date('2024-01-25'),
      dateDeDebut: new Date('2024-04-01'),
      dateDeFin: new Date('2024-12-31'),
      etat: 'Inactif',
      statut: 'Refusé'
    },
    {
      intituleBudget: 'Budget R&D 2024',
      description: 'Budget pour la recherche et le développement de nouveaux produits pour l\'année 2024.',
      montantBudget: 60000,
      dateDeCreation: new Date('2024-01-30'),
      dateDeDebut: new Date('2024-05-01'),
      dateDeFin: new Date('2024-12-31'),
      etat: 'Actif',
      statut: 'Validé'
    }
  ]

  // Variable d'état pour contrôler l'affichage de la modale
  showCreateModal: boolean = false;
  showDetailModal: boolean = false;
  showEditModal: boolean = false;
  selectedBudget: BudgetItem | null = null;
  editFormData: any = {};

  showFilterDropdown: boolean = false;
  activeFilter: string = 'Aucun';

  constructor() { }

  /**
   * Basculer l'affichage du menu déroulant des filtres
   */

  toggleFilterDropdown(event: Event): void {
    // Empêcher la propagation de l'événement pour éviter de fermer immédiatement le menu
    event.stopPropagation();
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  /**
   * Appliquer le filtre sélectionné et fermer le menu déroulant
   */

  applyFilter(filterType: string): void {
    this.activeFilter = filterType;
    console.log("Filtrage des budgets par :", filterType);
    this.showFilterDropdown = false;
  }

  /**
   * J'ajoute la méthode pour gérer les clics en dehors du menu déroulant pour le fermer
   */

  ngOnInit(): void {
    document.addEventListener('click', this.onClickOutside.bind(this));
  }

  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-dropdown-container') && this.showFilterDropdown) {
      this.showFilterDropdown = false;
    }
  }

  /**
   * Ouvre la modale de création de budget
   * Ajoute une classe au body pour bloquer le scroll en arrière-plan (UX)
   */

  openCreateBudgetModal(): void {
    this.showCreateModal = true;
    document.body.classList.add('modal-open');
  }

  /**
   * Ferme la modale de création de budget (via le boutton Annuler ou l'icone Fermer)
   * Retire la classe du body pour réactiver le scroll en arrière-plan (UX)
   * */

  closeCreateBudgetModal(): void {
    this.showCreateModal = false;
    document.body.classList.remove('modal-open');
  }

  openDetailBudgetModal(budget: BudgetItem): void {
    this.selectedBudget = budget;
    this.showDetailModal = true;
    document.body.classList.add('modal-open');
  }

  closeDetailBudgetModal(): void {
    this.selectedBudget = null;
    this.showDetailModal = false;
    document.body.classList.remove('modal-open');
  }

  /**
   * Méthode pour gérer la soumission du formulaire de création de budget 
   */

  /**
   * Ouvre la modale d'édition de budget et pré-remplit le formulaire avec les données du budget sélectionné
   */

  openEditBudgetModal(budget: BudgetItem): void {
    this.selectedBudget = budget;

    // Remplir le formulaire d'édition avec les données actuelles du budget
    this.editFormData = {
      intituleBudget: budget.intituleBudget,
      description: budget.description,
      montantBudget: budget.montantBudget,
      codeBudget: budget.codeBudget,
      // Conversion des objets Date en chaînes de caractères au format 'yyyy-MM-dd' pour les inputs de type date
      dateDeDebut: budget.dateDeDebut ? new Date(budget.dateDeDebut).toISOString().substring(0, 10) : '',
      dateDeFin: budget.dateDeFin ? new Date(budget.dateDeFin).toISOString().substring(0, 10) : '',
      etat: budget.etat,
      statut: budget.statut
    };

    this.showEditModal = true;
    document.body.classList.add('modal-open');

}

/**
 * Ferme la modale d'édition de budget
 */

closeEditBudgetModal(): void {
  this.selectedBudget = null;
  this.showEditModal = false;
  this.editFormData = {};
  document.body.classList.remove('modal-open');
}

/**
 * Similier la soumission du formulaire d'édition de budget
 */
saveEditedBudget(): void {
  console.log("Budget mis à jour :", this.editFormData);
  this.closeEditBudgetModal();
}
}
  
