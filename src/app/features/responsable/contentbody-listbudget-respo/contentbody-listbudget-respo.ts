import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../../services/budget.service';
import { BudgetItem, mapApiBudgetToBudgetItem } from '../../../models/budget-item.model';
import { LigneCreditService, LigneCredit } from '../../../services/ligne-credit.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contentbody-listbudget-respo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contentbody-listbudget-respo.html',
  styleUrls: ['./contentbody-listbudget-respo.css']
})
export class ContentbodyListbudgetRespo implements OnInit, OnDestroy {
  allBudgets: BudgetItem[] = []; // Stocker tous les budgets pour le filtrage
  budgets: BudgetItem[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  showCreateModal: boolean = false;
  showDetailModal: boolean = false;
  showEditModal: boolean = false;
  showRejetModal: boolean = false;
  selectedBudget: BudgetItem | null = null;
  editFormData: any = {};
  rejetCommentaire: string = '';

  showFilterDropdown: boolean = false;
  activeFilter: string = 'Tous';

  createFormData: any = {
    statut: 'En attente de validation',
    etat: true
  };

  private budgetsSubscription?: Subscription;

  // Recherche en temps réel
  searchQuery: string = '';

  constructor(
    private budgetService: BudgetService,
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

  // NOUVELLE MÉTHODE POUR CHARGER LES LIGNES DE CRÉDIT
  loadLignesBudget(budget: BudgetItem): void {
  if (!budget || !budget.id) {
    console.warn('❌ Aucun budget sélectionné');
    return;
  }

  console.log(`🔎 Navigation vers lignes du budget ${budget.id}...`);
  
  // ✅ CORRECTION : Navigation AVEC paramètre d'URL
  this.router.navigate(['/responsable/listbudget-responsable/listlignesbudget-responsable', budget.id]);

}

  loadBudgets(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.budgetsSubscription = this.budgetService.getBudgets().subscribe({
      next: (response) => {
        this.allBudgets = response.budgets.map(apiBudget => 
          mapApiBudgetToBudgetItem(apiBudget)
        );
        this.budgets = [...this.allBudgets]; // Initialiser avec tous les budgets
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur chargement budgets:', error);
        this.errorMessage = 'Erreur lors du chargement des budgets';
        this.isLoading = false;
      }
    });
  }

  // MÉTHODE DE FILTRAGE PAR STATUT
  applyFilter(filterType: string): void {
    this.activeFilter = filterType;
    this.showFilterDropdown = false;
    
    if (filterType === 'Tous') {
      this.budgets = [...this.allBudgets];
    } else {
      this.budgets = this.allBudgets.filter(budget => 
        budget.statut === filterType
      );
    }
  }

  // Getter derived de la liste courante pour ajouter le filtrage par requête
  get displayBudgets(): BudgetItem[] {
    const normalize = (s: string) => (s || '').toString().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const q = normalize(this.searchQuery.trim());
    if (!q) return this.budgets;
    return this.budgets.filter(b => {
      return [
        b.intituleBudget,
        b.description,
        b.statut,
        String(b.montantBudget),
          b.codeBudget
      ].some(field => normalize(field || '').includes(q));
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
      },
      error: (error) => {
        console.error('❌ Erreur activation budget:', error);
        alert('Erreur lors de l\'activation du budget');
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
      },
      error: (error) => {
        console.error('❌ Erreur désactivation budget:', error);
        alert('Erreur lors de la désactivation du budget');
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
      },
      error: (error) => {
        console.error('❌ Erreur validation budget:', error);
        alert('Erreur lors de la validation du budget');
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
      alert('Veuillez saisir un commentaire pour le rejet');
      return;
    }

    this.budgetService.rejeterBudget(this.selectedBudget.id, this.rejetCommentaire).subscribe({
      next: (response) => {
        console.log('✅ Budget rejeté:', response);
        this.loadBudgets();
        this.closeRejetModal();
        this.closeEditBudgetModal();
      },
      error: (error) => {
        console.error('❌ Erreur rejet budget:', error);
        alert('Erreur lors du rejet du budget');
        this.editFormData.statut = this.selectedBudget?.statut;
      }
    });
  }

  // MÉTHODES EXISTANTES
  toggleFilterDropdown(event: Event): void {
    event.stopPropagation();
    this.showFilterDropdown = !this.showFilterDropdown;
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
      },
      error: (error) => {
        console.error('❌ Erreur création budget:', error);
        alert('Erreur lors de la création du budget');
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
      },
      error: (error) => {
        console.error('❌ Erreur mise à jour budget:', error);
        alert('Erreur lors de la mise à jour du budget');
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