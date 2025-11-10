import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { BudgetService } from '../../../services/budget-service';
import { AuthService } from '../../../services/auth.service';
import { Budget } from '../../../models/budget';
import { Statut } from '../../../enums/statut';

@Component({
  selector: 'app-contentbody-listbudget-gest',
  imports: [CommonModule, RouterLink],
  templateUrl: './contentbody-listbudget-gest.html',
  styleUrl: './contentbody-listbudget-gest.css'
})
export class ContentbodyListbudgetGest implements OnInit {
  budgets: Budget[] = [];
  isLoading = false;
  errorMessage = '';

  selectedBudget: Budget | null = null;
  showFilterDropdown = false;
  activeFilter = 'Aucun';

  readonly filterOptions = ['Ce mois', 'Ce trimestre', "L'année dernière"];

  constructor(
    private budgetService: BudgetService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBudgets();
    document.addEventListener('click', this.onClickOutside.bind(this));
  }

  loadBudgets(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.budgetService.getAllBudgets()
      .pipe(
        catchError(error => {
          this.errorMessage = error.message || 'Erreur lors du chargement des budgets';
          return of([]);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((response: any) => {
        this.budgets = this.extractBudgets(response);
        console.log('Budgets chargés:', this.budgets);
      });
  }

  private extractBudgets(response: any): Budget[] {
    if (Array.isArray(response)) return response;
    if (response?.data) return response.data;
    if (response?.content) return response.content;
    if (response?.budgets) return response.budgets;
    if (response?.result) return response.result;
    return response ? [response] : [];
  }

  getStatusClass(statut?: Statut | string): string {
    const s = statut?.toString().toLowerCase();
    return {
      'valide': 'status-valid',
      'en_cours': 'status-pending',
      'rejete': 'status-rejected'
    }[s || ''] || 'status-default';
  }

  toggleFilterDropdown(event: Event): void {
    event.stopPropagation();
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  applyFilter(filterType: string): void {
    this.activeFilter = filterType;
    this.showFilterDropdown = false;
    console.log("Filtre appliqué :", filterType);
  }

  onClickOutside(event: MouseEvent): void {
    if (!this.showFilterDropdown) return;
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-dropdown-container')) {
      this.showFilterDropdown = false;
    }
  }

  openDetailBudgetModal(budget: Budget): void {
    this.selectedBudget = budget;
    document.body.classList.add('modal-open');
  }

  closeDetailBudgetModal(): void {
    this.selectedBudget = null;
    document.body.classList.remove('modal-open');
  }
}


// import { Component, OnInit } from '@angular/core';
// import { RouterLink } from "@angular/router";
// import { BudgetService } from '../../../services/budget-service';
// import { CommonModule } from '@angular/common';
// import { catchError, finalize } from 'rxjs/operators';
// import { of } from 'rxjs';
// import { AuthService } from '../../../services/auth.service';
// import { Budget } from '../../../models/budget';
// import { Statut } from '../../../enums/statut';

// @Component({
//   selector: 'app-contentbody-listbudget-gest',
//   imports: [RouterLink, CommonModule], // Supprimez DatePipe et DecimalPipe
//   templateUrl: './contentbody-listbudget-gest.html',
//   styleUrl: './contentbody-listbudget-gest.css'
// })
// export class ContentbodyListbudgetGest implements OnInit {
//   budgets: Budget[] = [];
//   isLoading: boolean = false;
//   errorMessage: string = '';

//   // Variable d'état pour contrôler l'affichage de la modale
//     showDetailModal: boolean = false;
  
//     selectedBudget: Budget | null = null;
//     showFilterDropdown: boolean = false;
//     activeFilter: string = 'Aucun';

//   constructor(
//     private budgetService: BudgetService,
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     this.loadBudgets();
//     document.addEventListener('click', this.onClickOutside.bind(this));
//   }

//   // --- Vérifier si budgets est un tableau ---
//   isBudgetsArray(): boolean {
//     return Array.isArray(this.budgets);
//   }

//   // --- Charger tous les budgets (version simplifiée) ---
//   loadBudgets(): void {
//     this.isLoading = true;
//     this.errorMessage = '';

//     this.budgetService.getAllBudgets()
//       .pipe(
//         catchError(error => {
//           this.errorMessage = error.message || 'Erreur lors du chargement des budgets';
//           return of([]); // Retourne toujours un tableau vide en cas d'erreur
//         }),
//         finalize(() => {
//           this.isLoading = false;
//         })
//       )
//       .subscribe({
//         next: (response: any) => {
//           console.log('Réponse API:', response);
          
//           // Gestion simple des différents formats de réponse
//           if (Array.isArray(response)) {
//             // Cas 1: Réponse directe en tableau
//             this.budgets = response;
//           } else if (response && typeof response === 'object') {
//             // Cas 2: Réponse avec wrapper, chercher le tableau dans les propriétés communes
//             if (Array.isArray((response as any).data)) {
//               this.budgets = (response as any).data;
//             } else if (Array.isArray((response as any).content)) {
//               this.budgets = (response as any).content;
//             } else if (Array.isArray((response as any).budgets)) {
//               this.budgets = (response as any).budgets;
//             } else if (Array.isArray((response as any).result)) {
//               this.budgets = (response as any).result;
//             } else {
//               // Si c'est un objet unique, le mettre dans un tableau
//               this.budgets = [response];
//             }
//           } else {
//             // Cas 3: Réponse inattendue
//             this.budgets = [];
//             console.warn('Format de réponse inattendu:', response);
//           }
          
//           console.log('Budgets traités:', this.budgets);
//         },
//         error: (error) => {
//           console.error('Erreur détaillée:', error);
//           this.budgets = [];
//         }
//       });
//   }

//   // --- Obtenir la classe CSS pour le statut ---
//   getStatusClass(statut?: Statut | string): string {
//   if (!statut) return 'status-default';

//   const value = statut.toString().toLowerCase();
//   switch (value) {
//     case 'valide':
//       return 'status-valid';
//     case 'en_cours':
//       return 'status-pending';
//     case 'rejete':
//       return 'status-rejected';
//     default:
//       return 'status-default';
//   }
// }


//   // --- Formater le montant ---
//   formatAmount(amount: number): string {
//     if (!amount && amount !== 0) return '0,00';
    
//     return new Intl.NumberFormat('fr-FR', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     }).format(amount);
//   }

//   // --- Formater la date ---
//   formatDate(dateString?: string): string {
//   if (!dateString) return ''; // si undefined, on retourne vide

//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return dateString;
//     return date.toLocaleDateString('fr-FR');
//   } catch {
//     return dateString;
//   }
// }


//   // --- Vérifier si le budget est actif ---
//   isBudgetActive(budget: Budget): boolean {
//     return budget && budget.etat !== undefined ? budget.etat : false;
//   }

//   // --- Rafraîchir la liste ---
//   refreshBudgets(): void {
//     this.loadBudgets();
//   }

//   /**
//    * Basculer l'affichage du menu déroulant des filtres
//    */

//   toggleFilterDropdown(event: Event): void {
//     // Empêcher la propagation de l'événement pour éviter de fermer immédiatement le menu
//     event.stopPropagation();
//     this.showFilterDropdown = !this.showFilterDropdown;
//   }

//   /**
//    * Appliquer le filtre sélectionné et fermer le menu déroulant
//    */

//   applyFilter(filterType: string): void {
//     this.activeFilter = filterType;
//     console.log("Filtrage des budgets par :", filterType);
//     this.showFilterDropdown = false;
//   }

//   /**
//    * J'ajoute la méthode pour gérer les clics en dehors du menu déroulant pour le fermer
//    */


//   onClickOutside(event: MouseEvent): void {
//     const target = event.target as HTMLElement;
//     if (!target.closest('.filter-dropdown-container') && this.showFilterDropdown) {
//       this.showFilterDropdown = false;
//     }
//   }


//   openDetailBudgetModal(budget: Budget): void {
//       this.selectedBudget = budget;
//       this.showDetailModal = true;
//       document.body.classList.add('modal-open');
//     }
  
//     closeDetailBudgetModal(): void {
//       this.selectedBudget = null;
//       this.showDetailModal = false;
//       document.body.classList.remove('modal-open');
//     }
// }