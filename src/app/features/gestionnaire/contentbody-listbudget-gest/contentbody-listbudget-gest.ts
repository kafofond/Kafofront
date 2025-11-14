import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../../services/budget.service';
import { BudgetItem, mapApiBudgetToBudgetItem } from '../../../models/budget-item.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contentbody-listbudget-gest',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './contentbody-listbudget-gest.html',
  styleUrls: ['./contentbody-listbudget-gest.css']
})
export class ContentbodyListbudgetGest implements OnInit, OnDestroy {
  budgets: BudgetItem[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  showDetailModal: boolean = false;
  showEditModal: boolean = false;
  showRejetModal: boolean = false;
  selectedBudget: BudgetItem | null = null;

  showFilterDropdown: boolean = false;
  activeFilter: string = 'Aucun';

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
    this.router.navigate(['/listbudget-gest/listlignesbudget-gest', budget.id]);
  }

  loadBudgets(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.budgetsSubscription = this.budgetService.getBudgets().subscribe({
      next: (response) => {
        this.budgets = response.budgets.map(apiBudget => 
          mapApiBudgetToBudgetItem(apiBudget)
        );
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
}