import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../../services/budget.service';
import { BudgetItem, mapApiBudgetToBudgetItem } from '../../../models/budget-item.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contentbody-listbudget-gest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contentbody-listbudget-gest.html',
  styleUrls: ['./contentbody-listbudget-gest.css']
})
export class ContentbodyListbudgetGest implements OnInit, OnDestroy {
  allBudgets: BudgetItem[] = [];
  budgets: BudgetItem[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  searchQuery: string = '';

  filteredBudgets: BudgetItem[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  showDetailModal: boolean = false;
  showEditModal: boolean = false;
  showRejetModal: boolean = false;
  selectedBudget: BudgetItem | null = null;

  showFilterDropdown: boolean = false;
  activeFilter: string = 'Tous';

  private budgetsSubscription?: Subscription;

  constructor(
    private budgetService: BudgetService,
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

  loadLignesBudget(budget: BudgetItem): void {
    if (!budget || !budget.id) {
      console.warn('❌ Aucun budget sélectionné');
      return;
    }

    console.log(`🔎 Navigation vers lignes du budget ${budget.id}...`);
    this.router.navigate(['/gestionnaire/listbudget-gest/listlignesbudget-gest', budget.id]);
  }

  loadBudgets(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.budgetsSubscription = this.budgetService.getBudgets().subscribe({
      next: (response) => {
        this.allBudgets = response.budgets.map(apiBudget => 
          mapApiBudgetToBudgetItem(apiBudget)
        );
        // Initieren les listes filtrées/affichées
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur chargement budgets:', error);
        this.errorMessage = 'Erreur lors du chargement des budgets';
        this.isLoading = false;
      }
    });
  }

  // MÉTHODES DE FILTRAGE
  toggleFilterDropdown(event: Event): void {
    event.stopPropagation();
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  applyFilter(filterType: string): void {
    this.activeFilter = filterType;
    this.showFilterDropdown = false;
    // Appliquer les filtres composés (recherche + statut)
    this.applyFilters();
  }

  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-dropdown-container') && this.showFilterDropdown) {
      this.showFilterDropdown = false;
    }
  }

  openDetailBudgetModal(budget: BudgetItem): void {
    this.selectedBudget = budget;
  }

  closeDetailBudgetModal(): void {
    this.selectedBudget = null;
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

  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredBudgets.length / this.itemsPerPage);
  }

  applySearchFilter() {
    // Keep backward compatibility; simply re-run composite filter
    this.applyFilters();
  }

  applyFilters(): void {
    const query = this.searchQuery.trim().toLowerCase();

    let temp = [...this.allBudgets];

    // Filter by activeFilter (statut) if set and not Tous
    if (this.activeFilter && this.activeFilter !== 'Tous') {
      temp = temp.filter(b => b.statut === this.activeFilter || b.etat === this.activeFilter);
    }

    // Filter by free text search on intituleBudget, etat or statut
    if (query.length > 0) {
      temp = temp.filter(
        f =>
          (f.intituleBudget && f.intituleBudget.toLowerCase().includes(query)) ||
          (f.etat && f.etat.toLowerCase().includes(query)) ||
          (f.statut && f.statut.toLowerCase().includes(query))
      );
    }

    this.filteredBudgets = temp;
    // reset pagination
    this.currentPage = 1;
    // Update the visible budgets for display (could be paginated)
    this.budgets = [...this.filteredBudgets];
    this.updateTotalPages();
  }
}