import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../../services/budget.service';
import { SeuilService } from '../../../services/seuil.service';
import { ToastService } from '../../../services/toast.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { BudgetItem, mapApiBudgetToBudgetItem } from '../../../models/budget-item.model';
import { Seuil } from '../../../models/seuil.model';
import { LigneCreditService, LigneCredit } from '../../../services/ligne-credit.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contentbody-listbudget-direct',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './contentbody-listbudget-direct.html',
  styleUrls: ['./contentbody-listbudget-direct.css']
})
export class ContentbodyListbudgetDirect implements OnInit, OnDestroy {
  
  allBudgets: BudgetItem[] = [];
  budgets: BudgetItem[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  // Seuil properties
  seuilActif: Seuil | null = null;
  isLoadingSeuil: boolean = false;
  showSeuilModal: boolean = false;
  showEditSeuilModal: boolean = false;
  editSeuilData: any = {
    montantSeuil: 0
  };

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  showCreateModal: boolean = false;
  showDetailModal: boolean = false;
  showEditModal: boolean = false;
  showRejetModal: boolean = false;
  selectedBudget: BudgetItem | null = null;
  editFormData: any = {};
  rejetCommentaire: string = '';

  showFilterDropdown: boolean = false;
  activeFilter: string = 'Aucun';

  createFormData: any = {
    statut: 'En attente de validation',
    etat: true
  };

  private budgetsSubscription?: Subscription;

  constructor(
    private budgetService: BudgetService,
    private seuilService: SeuilService,
    private toastService: ToastService,
    private ligneCreditService: LigneCreditService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBudgets();
    document.addEventListener('click', this.onClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    if (this.budgetsSubscription) {
      this.budgetsSubscription.unsubscribe();
    }
    document.removeEventListener('click', this.onClickOutside.bind(this));
  }

  // Seuil methods
  openSeuilModal(): void {
    this.showSeuilModal = true;
    this.loadSeuilActif();
    document.body.classList.add('modal-open');
  }

  closeSeuilModal(): void {
    this.showSeuilModal = false;
    this.seuilActif = null;
    document.body.classList.remove('modal-open');
  }

  openEditSeuilModal(): void {
    if (this.seuilActif) {
      this.editSeuilData.montantSeuil = this.seuilActif.montantSeuil;
    }
    this.showEditSeuilModal = true;
  }

  openCreateSeuilModal(): void {
    this.editSeuilData.montantSeuil = 0;
    this.showEditSeuilModal = true;
  }

  closeEditSeuilModal(): void {
    this.showEditSeuilModal = false;
    this.editSeuilData = { montantSeuil: 0 };
  }

  loadSeuilActif(): void {
    this.isLoadingSeuil = true;
    this.seuilService.getSeuilActif().subscribe({
      next: (seuil) => {
        // Vérifier que le seuil est valide (a un ID)
        if (seuil && typeof seuil.id === 'number' && !isNaN(seuil.id)) {
          this.seuilActif = seuil;
        } else {
          // Si le seuil n'est pas valide, le mettre à null
          this.seuilActif = null;
        }
        this.isLoadingSeuil = false;
      },
      error: (error) => {
        console.error('Erreur chargement seuil actif:', error);
        // Si aucun seuil actif n'est trouvé, on considère qu'il n'y en a pas
        this.seuilActif = null;
        this.isLoadingSeuil = false;
      }
    });
  }

  saveSeuil(): void {
    if (!this.editSeuilData.montantSeuil || this.editSeuilData.montantSeuil <= 0) {
      this.toastService.show('Veuillez saisir un montant valide pour le seuil', 'error');
      return;
    }

    if (this.seuilActif) {
      // Modification d'un seuil existant
      this.seuilService.updateSeuil(this.seuilActif.id, this.editSeuilData.montantSeuil).subscribe({
        next: (response) => {
          this.seuilActif = response.seuil;
          this.closeEditSeuilModal();
          this.toastService.show('Seuil modifié avec succès', 'success');
        },
        error: (error) => {
          console.error('Erreur modification seuil:', error);
          this.toastService.show('Erreur lors de la modification du seuil', 'error');
        }
      });
    } else {
      // Création d'un nouveau seuil
      this.seuilService.createSeuil(this.editSeuilData.montantSeuil).subscribe({
        next: (response) => {
          this.seuilActif = response.seuil;
          this.closeEditSeuilModal();
          this.toastService.show('Seuil créé avec succès', 'success');
        },
        error: (error) => {
          console.error('Erreur création seuil:', error);
          this.toastService.show('Erreur lors de la création du seuil', 'error');
        }
      });
    }
  }

  activerSeuil(): void {
    if (!this.seuilActif || !this.seuilActif.id) {
      this.toastService.show('Aucun seuil valide à activer', 'error');
      return;
    }

    this.seuilService.activerSeuil(this.seuilActif.id).subscribe({
      next: (response) => {
        this.seuilActif = response.seuil;
        this.toastService.show('Seuil activé avec succès', 'success');
      },
      error: (error) => {
        console.error('Erreur activation seuil:', error);
        this.toastService.show('Erreur lors de l\'activation du seuil', 'error');
      }
    });
  }

  desactiverSeuil(): void {
    if (!this.seuilActif || !this.seuilActif.id) {
      this.toastService.show('Aucun seuil valide à désactiver', 'error');
      return;
    }

    this.seuilService.desactiverSeuil(this.seuilActif.id).subscribe({
      next: (response) => {
        this.seuilActif = response.seuil;
        this.toastService.show('Seuil désactivé avec succès', 'success');
      },
      error: (error) => {
        console.error('Erreur désactivation seuil:', error);
        this.toastService.show('Erreur lors de la désactivation du seuil', 'error');
      }
    });
  }

  getSeuilEtatClass(actif: boolean): string {
    return actif ? 'status-badge active' : 'status-badge rejected';
  }

  // NOUVELLE MÉTHODE POUR CHARGER LES LIGNES DE CRÉDIT
  loadLignesBudget(budget: BudgetItem): void {
  if (!budget || !budget.id) {
    console.warn('❌ Aucun budget sélectionné');
    return;
  }

  console.log(`🔎 Navigation vers lignes du budget ${budget.id}...`);
  
  // ✅ CORRECTION : Navigation AVEC paramètre d'URL
  this.router.navigate(['/directeur/listbudget-directeur/listlignesbudget-directeur', budget.id]);

}

  loadBudgets(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.budgetsSubscription = this.budgetService.getBudgets().subscribe({
      next: (response) => {
        this.allBudgets = response.budgets.map(apiBudget => 
          mapApiBudgetToBudgetItem(apiBudget)
        );
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur chargement budgets:', error);
        this.errorMessage = 'Erreur lors du chargement des budgets';
        this.isLoading = false;
      }
    });
  }

  onStatutChange(event: Event): void {
    const newValue = (event.target as HTMLSelectElement).value;

    if (!this.selectedBudget) return;

    if (newValue === 'Validé') {
      this.validerBudget();
    }
    else if (newValue === 'Refusé') {
      this.openRejetModal();
    }
  }

  onEtatToggle(event: Event): void {
    const isActive = (event.target as HTMLInputElement).checked;

    if (!this.selectedBudget) return;

    if (isActive) {
      this.activerBudget();
    } else {
      this.desactiverBudget();
    }
  }

  activerBudget(): void {
    if (!this.selectedBudget) return;

    this.budgetService.activerBudget(this.selectedBudget.id).subscribe({
      next: (response) => {
        console.log('✅ Budget activé:', response);
        this.loadBudgets();
        this.closeEditBudgetModal();
        this.toastService.show('Budget activé avec succès', 'success');
      },
      error: (error) => {
        console.error('❌ Erreur activation budget:', error);
        this.toastService.show('Erreur lors de l\'activation du budget', 'error');
        this.editFormData.etat = false;
      }
    });
  }

  desactiverBudget(): void {
    if (!this.selectedBudget) return;

    this.budgetService.desactiverBudget(this.selectedBudget.id).subscribe({
      next: (response) => {
        console.log('✅ Budget désactivé:', response);
        this.loadBudgets();
        this.closeEditBudgetModal();
        this.toastService.show('Budget désactivé avec succès', 'success');
      },
      error: (error) => {
        console.error('❌ Erreur désactivation budget:', error);
        this.toastService.show('Erreur lors de la désactivation du budget', 'error');
        this.editFormData.etat = true;
      }
    });
  }

  validerBudget(): void {
    if (!this.selectedBudget) return;

    this.budgetService.validerBudget(this.selectedBudget.id).subscribe({
      next: (response) => {
        console.log('✅ Budget validé:', response);
        this.loadBudgets();
        this.closeEditBudgetModal();
        this.toastService.show('Budget validé avec succès', 'success');
      },
      error: (error) => {
        console.error('❌ Erreur validation budget:', error);
        this.toastService.show('Erreur lors de la validation du budget', 'error');
        this.editFormData.statut = this.selectedBudget?.statut;
      }
    });
  }

  openRejetModal(): void {
    this.showRejetModal = true;
    this.rejetCommentaire = '';
  }

  closeRejetModal(): void {
    this.showRejetModal = false;
    this.rejetCommentaire = '';
    if (this.selectedBudget) {
      this.editFormData.statut = this.selectedBudget.statut;
    }
  }

  rejeterBudget(): void {
    if (!this.selectedBudget || !this.rejetCommentaire.trim()) {
      this.toastService.show('Veuillez saisir un commentaire pour le rejet', 'error');
      return;
    }

    this.budgetService.rejeterBudget(this.selectedBudget.id, this.rejetCommentaire).subscribe({
      next: (response) => {
        console.log('✅ Budget rejeté:', response);
        this.loadBudgets();
        this.closeRejetModal();
        this.closeEditBudgetModal();
        this.toastService.show('Budget rejeté avec succès', 'success');
      },
      error: (error) => {
        console.error('❌ Erreur rejet budget:', error);
        this.toastService.show('Erreur lors du rejet du budget', 'error');
        this.editFormData.statut = this.selectedBudget?.statut;
      }
    });
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.allBudgets.length / this.itemsPerPage);
    this.goToPage(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    // Apply filter if active
    let filteredBudgets = this.allBudgets;
    if (this.activeFilter !== 'Aucun') {
      filteredBudgets = this.allBudgets.filter(budget => budget.statut === this.activeFilter);
    }
    
    this.budgets = filteredBudgets.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  // MÉTHODES EXISTANTES
  toggleFilterDropdown(event: Event): void {
    event.stopPropagation();
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  applyFilter(filterType: string): void {
    this.activeFilter = filterType;
    this.showFilterDropdown = false;
    this.updatePagination();
  }

  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-dropdown-container') && this.showFilterDropdown) {
      this.showFilterDropdown = false;
    }
  }

  openCreateBudgetModal(): void {
    this.showCreateModal = true;
    document.body.classList.add('modal-open');
  }

  closeCreateBudgetModal(): void {
    this.showCreateModal = false;
    this.createFormData = {
      statut: 'En attente de validation',
      etat: true
    };
    document.body.classList.remove('modal-open');
  }

  openDetailBudgetModal(budget: BudgetItem): void {
    this.selectedBudget = budget;
  }

  closeDetailBudgetModal(): void {
    this.selectedBudget = null;
  }

  openEditBudgetModal(budget: BudgetItem): void {
    this.selectedBudget = budget;
    
    this.editFormData = {
      intituleBudget: budget.intituleBudget,
      description: budget.description,
      montantBudget: budget.montantBudget,
      dateDebut: this.formatDateForInput(budget.dateDeDebut),
      dateFin: this.formatDateForInput(budget.dateDeFin),
      etat: budget.etat === 'Actif',
      statut: budget.statut
    };

    this.showEditModal = true;
    document.body.classList.add('modal-open');
  }

  closeEditBudgetModal(): void {
    this.selectedBudget = null;
    this.showEditModal = false;
    this.editFormData = {};
    document.body.classList.remove('modal-open');
  }

  onCreateBudgetSubmit(): void {
    const newBudgetData = {
      intituleBudget: this.createFormData.intituleBudget,
      description: this.createFormData.description,
      montantBudget: this.createFormData.montantBudget,
      dateDebut: this.createFormData.dateDebut,
      dateFin: this.createFormData.dateFin,
      statut: 'EN_COURS',
      actif: this.createFormData.etat
    };

    this.budgetService.createBudget(newBudgetData).subscribe({
      next: (response) => {
        this.loadBudgets();
        this.closeCreateBudgetModal();
        this.toastService.show('Budget créé avec succès', 'success');
      },
      error: (error) => {
        console.error('❌ Erreur création budget:', error);
        this.toastService.show('Erreur lors de la création du budget', 'error');
      }
    });
  }

  saveEditedBudget(): void {
    if (!this.selectedBudget) return;

    const updateData = {
      intituleBudget: this.editFormData.intituleBudget,
      description: this.editFormData.description,
      montantBudget: this.editFormData.montantBudget,
      dateDebut: this.editFormData.dateDebut,
      dateFin: this.editFormData.dateFin,
      statut: this.mapDisplayStatutToApi(this.editFormData.statut),
      actif: this.editFormData.etat
    };

    this.budgetService.updateBudget(this.selectedBudget.id, updateData).subscribe({
      next: (response) => {
        this.loadBudgets();
        this.closeEditBudgetModal();
        this.toastService.show('Budget mis à jour avec succès', 'success');
      },
      error: (error) => {
        console.error('❌ Erreur mise à jour budget:', error);
        this.toastService.show('Erreur lors de la mise à jour du budget', 'error');
      }
    });
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private mapDisplayStatutToApi(displayStatut: string): string {
    const reverseMap: { [key: string]: string } = {
      'Validé': 'VALIDE',
      'En cours': 'EN_COURS',
      'Refusé': 'REJETE'
    };
    return reverseMap[displayStatut];
  }

  getStatusBadgeClass(statut: string): string {
    const classMap: { [key: string]: string } = {
      'Validé': 'status-badge active',
      'En cours': 'status-badge warning',
      'Refusé': 'status-badge rejected'
    };
    return classMap[statut] || 'status-badge draft';
  }

  getEtatBadgeClass(etat: string): string {
    return etat === 'Actif' ? 'status-badge active' : 'status-badge rejected';
  }
}