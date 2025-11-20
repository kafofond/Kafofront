import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FicheBesoinService, FicheBesoin } from '../../../services/fiche-besoin.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-contentbody-fiche-de-besoin-gest',
  imports: [CommonModule, FormsModule],
  templateUrl: './contentbody-fiche-de-besoin-gest.html',
  styleUrl: './contentbody-fiche-de-besoin-gest.css'
})
export class ContentbodyFicheDeBesoinGest implements OnInit {
  fiches: FicheBesoin[] = [];
  filteredFiches: FicheBesoin[] = [];
  isLoading = false;
  errorMessage = '';
  selectedFiche: FicheBesoin | null = null;
  showDetailsModal = false;
  showRejetModal = false;
  showConfirmationModal = false;
  rejetMotif = '';
  entrepriseId: number | null = null;
  
  // Propriétés pour le filtre de statut
  showFilterDropdown = false;
  statutFilter = 'Tous';
  
  // Propriétés pour la pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  constructor(
    private ficheService: FicheBesoinService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'entreprise à partir du token
    this.entrepriseId = this.authService.getEntrepriseIdFromToken();
    
    if (this.entrepriseId) {
      this.loadFiches();
    } else {
      this.errorMessage = "Impossible de récupérer les informations de l'entreprise. Veuillez vous reconnecter.";
      console.error('ID entreprise non trouvé dans le token');
    }
  }

  loadFiches(): void {
    if (!this.entrepriseId) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.ficheService.getFichesByEntreprise(this.entrepriseId).subscribe({
      next: (response) => {
        this.fiches = response.fiches;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du chargement des fiches de besoin';
        this.isLoading = false;
        console.error('Erreur chargement fiches:', error);
      }
    });
  }

  openDetailsModal(fiche: FicheBesoin): void {
    this.selectedFiche = fiche;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedFiche = null;
  }

  openRejetModal(fiche: FicheBesoin): void {
    this.selectedFiche = fiche;
    this.showRejetModal = true;
    this.rejetMotif = ''; // Réinitialiser le motif
  }

  closeRejetModal(): void {
    this.showRejetModal = false;
    this.selectedFiche = null;
    this.rejetMotif = '';
  }

  // Ouvrir le popup de confirmation pour la validation
  openValidationConfirmation(fiche: FicheBesoin): void {
    this.selectedFiche = fiche;
    this.showConfirmationModal = true;
  }

  closeValidationConfirmation(): void {
    this.showConfirmationModal = false;
    this.selectedFiche = null;
  }

  // Valider la fiche après confirmation
  confirmValidation(): void {
    if (this.selectedFiche) {
      this.validerFiche(this.selectedFiche.id);
      this.closeValidationConfirmation();
    }
  }

  validerFiche(id: number): void {
    this.ficheService.validerFiche(id).subscribe({
      next: () => {
        // Mettre à jour le statut localement
        const fiche = this.fiches.find(f => f.id === id);
        if (fiche) {
          fiche.statut = 'VALIDE';
        }
        this.loadFiches(); // Recharger pour s'assurer de la synchronisation
      },
      error: (error) => {
        console.error('Erreur validation fiche:', error);
        this.errorMessage = error.message || 'Erreur lors de la validation de la fiche';
      }
    });
  }

  submitRejet(): void {
    if (this.selectedFiche && this.rejetMotif.trim()) {
      // Vérifier que le commentaire n'est pas vide
      const commentaire = this.rejetMotif.trim();
      if (!commentaire) {
        this.errorMessage = 'Le commentaire de rejet est obligatoire';
        return;
      }
      
      this.ficheService.rejeterFiche(this.selectedFiche.id, commentaire).subscribe({
        next: () => {
          // Mettre à jour le statut localement
          const fiche = this.fiches.find(f => f.id === this.selectedFiche!.id);
          if (fiche) {
            fiche.statut = 'REJETE';
          }
          this.closeRejetModal();
          this.loadFiches(); // Recharger pour s'assurer de la synchronisation
        },
        error: (error) => {
          console.error('Erreur rejet fiche:', error);
          this.errorMessage = error.message || 'Erreur lors du rejet de la fiche';
        }
      });
    } else {
      this.errorMessage = 'Le commentaire de rejet est obligatoire';
    }
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'EN_COURS':
        return 'status-en-attente';
      case 'VALIDE':
        return 'status-valide';
      case 'REJETE':
        return 'status-rejete';
      case 'APPROUVE':
        return 'status-approuve';
      default:
        return '';
    }
  }

  getStatusLabel(statut: string): string {
    return this.ficheService.mapStatutToDisplay(statut);
  }

  // Méthode pour vérifier si la fiche peut être validée
  canValidateFiche(fiche: FicheBesoin): boolean {
    return fiche.statut !== 'APPROUVE' && fiche.statut !== 'VALIDE';
  }
  
  // Méthode pour calculer le montant total des désignations
  getTotalMontantDesignations(): number {
    if (!this.selectedFiche || !this.selectedFiche.designations) {
      return 0;
    }
    return this.selectedFiche.designations.reduce((total, designation) => total + designation.montantTotal, 0);
  }
  
  // Méthodes pour le filtre de statut
  applyFilters(): void {
    if (this.statutFilter === 'Tous') {
      this.filteredFiches = [...this.fiches];
    } else {
      this.filteredFiches = this.fiches.filter(fiche => 
        fiche.statut === this.statutFilter
      );
    }
    
    // Réinitialiser à la première page après le filtrage
    this.currentPage = 1;
    this.updateTotalPages();
  }
  
  // Méthodes pour la pagination
  get paginatedFiches(): FicheBesoin[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredFiches.slice(startIndex, endIndex);
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredFiches.length / this.itemsPerPage);
  }
  
  onStatutFilterChange(statut: string): void {
    this.statutFilter = statut;
    this.showFilterDropdown = false;
    this.applyFilters();
  }
}