import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemandeAchatService, DemandeAchat } from '../../../services/demande-achat.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-contentbody-demande-achat-gest',
  imports: [CommonModule, FormsModule],
  templateUrl: './contentbody-demande-achat-gest.html',
  styleUrl: './contentbody-demande-achat-gest.css'
})
export class ContentbodyDemandeAchatGest implements OnInit {
  demandes: DemandeAchat[] = [];
  filteredDemandes: DemandeAchat[] = [];
  isLoading = false;
  errorMessage = '';
  entrepriseId: number | null = null;
  showFilterDropdown = false;
  
  // Propriétés pour la modale de rejet
  showRejectModal = false;
  selectedDemande: DemandeAchat | null = null;
  rejectComment = '';

  // Filtres
  statutFilter = 'Tous';

  constructor(
    private demandeService: DemandeAchatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'entreprise à partir du token
    this.entrepriseId = this.authService.getEntrepriseIdFromToken();
    
    if (this.entrepriseId) {
      this.loadDemandes();
    } else {
      this.errorMessage = 'Impossible de récupérer les informations de l\'entreprise.';
    }
  }

  loadDemandes(): void {
    if (!this.entrepriseId) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.demandeService.getDemandesByEntreprise(this.entrepriseId).subscribe({
      next: (response) => {
        this.demandes = response.demandes;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des demandes:', error);
        this.errorMessage = 'Erreur lors du chargement des demandes.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    if (this.statutFilter === 'Tous') {
      this.filteredDemandes = [...this.demandes];
    } else {
      this.filteredDemandes = this.demandes.filter(demande => 
        demande.statut === this.statutFilter
      );
    }
  }

  onStatutFilterChange(statut: string): void {
    this.statutFilter = statut;
    this.showFilterDropdown = false;
    this.applyFilters();
  }

  getStatusLabel(statut: string): string {
    switch (statut) {
      case 'EN_COURS': return 'En cours';
      case 'APPROUVE': return 'Approuvé';
      case 'VALIDE': return 'Validé';
      case 'REJETE': return 'Rejeté';
      default: return statut;
    }
  }

  canValidateDemande(demande: DemandeAchat): boolean {
    return demande.statut !== 'VALIDE' && demande.statut !== 'APPROUVE';
  }

  // Méthodes pour la validation
  validateDemande(demande: DemandeAchat): void {
    if (!this.entrepriseId) return;
    
    console.log('Valider la demande:', demande);
    // Implémentation de la validation avec le service
    this.demandeService.validerDemande(demande.id).subscribe({
      next: () => {
        // Mettre à jour le statut localement
        const index = this.demandes.findIndex(d => d.id === demande.id);
        if (index !== -1) {
          this.demandes[index].statut = 'VALIDE';
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la validation:', error);
        this.errorMessage = 'Erreur lors de la validation de la demande.';
      }
    });
  }

  // Méthodes pour le rejet
  openRejectModal(demande: DemandeAchat): void {
    this.selectedDemande = demande;
    this.rejectComment = '';
    this.showRejectModal = true;
  }

  rejectDemande(): void {
    if (!this.selectedDemande || !this.rejectComment.trim() || !this.entrepriseId) return;
    
    console.log('Rejeter la demande:', this.selectedDemande);
    // Implémentation du rejet avec le service
    this.demandeService.rejeterDemande(this.selectedDemande.id, this.rejectComment).subscribe({
      next: () => {
        // Mettre à jour le statut localement
        const index = this.demandes.findIndex(d => d.id === this.selectedDemande!.id);
        if (index !== -1) {
          this.demandes[index].statut = 'REJETE';
          this.applyFilters();
        }
        
        // Fermer la modale
        this.closeRejectModal();
      },
      error: (error) => {
        console.error('Erreur lors du rejet:', error);
        this.errorMessage = 'Erreur lors du rejet de la demande.';
        this.closeRejectModal();
      }
    });
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.selectedDemande = null;
    this.rejectComment = '';
  }

  cancelReject(): void {
    this.closeRejectModal();
  }

  viewDetails(demande: DemandeAchat): void {
    console.log('Voir détails:', demande);
    // Implémentation de la navigation vers les détails
  }
}