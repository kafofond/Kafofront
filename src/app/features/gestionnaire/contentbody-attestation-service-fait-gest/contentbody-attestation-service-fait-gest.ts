import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttestationServiceService, AttestationApiResponse, AttestationDetail } from '../../../services/attestation-service.service';
import { AuthService } from '../../../services/auth.service';

interface Attestation {
  id: number;
  referenceBonCommande: string;
  fournisseur: string;
  titre: string;
  dateCreation: string;
}

@Component({
  selector: 'app-contentbody-attestation-service-fait-gest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contentbody-attestation-service-fait-gest.html',
  styleUrl: './contentbody-attestation-service-fait-gest.css'
})
export class ContentbodyAttestationServiceFaitGest implements OnInit {
  attestations: Attestation[] = [];
  filteredAttestations: Attestation[] = [];
  isLoading = false;
  errorMessage = '';
  entrepriseId: number | null = null;
  showFilterDropdown = false;
  searchQuery: string = '';
  
  // Propriétés pour la pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  
  // Propriétés pour la modale de détails
  showDetailsModal = false;
  selectedAttestation: Attestation | null = null;

  constructor(
    private attestationService: AttestationServiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'entreprise à partir du token
    this.entrepriseId = this.authService.getEntrepriseIdFromToken();
    
    if (this.entrepriseId) {
      this.loadAttestations();
    } else {
      this.errorMessage = 'Impossible de récupérer les informations de l\'entreprise.';
    }
  }

  loadAttestations(): void {
    if (!this.entrepriseId) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.attestationService.getAttestationsByEntreprise(this.entrepriseId).subscribe({
      next: (response: AttestationApiResponse) => {
        // Mapper les données de l'API vers notre interface Attestation
        this.attestations = response.attestations.map((att: any) => ({
          id: att.id,
          referenceBonCommande: att.referenceBonCommande || 'Non spécifié',
          fournisseur: att.fournisseur,
          titre: att.titre,
          dateCreation: att.dateCreation
        }));
        // applyFilters will set filteredAttestations and recalculate pagination
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des attestations:', error);
        this.errorMessage = 'Erreur lors du chargement des attestations.';
        this.isLoading = false;
      }
    });
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredAttestations.length / this.itemsPerPage);
    // S'assurer que la page actuelle ne dépasse pas le nombre total de pages
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  get paginatedAttestations(): Attestation[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredAttestations.slice(startIndex, endIndex);
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

  // Méthode temporaire pour éviter les erreurs
  getStatusLabel(statut: string): string {
    return statut;
  }

  // Méthodes pour les détails
  openDetailsModal(attestation: Attestation): void {
    this.selectedAttestation = attestation;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedAttestation = null;
  }

  viewDetails(attestation: Attestation): void {
    this.openDetailsModal(attestation);
  }

  applySearchFilter(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const normalize = (s: string) => (s || '').toString().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const query = normalize(this.searchQuery.trim());

    let temp = [...this.attestations];
    if (query.length > 0) {
      temp = temp.filter(a =>
        normalize(a.referenceBonCommande).includes(query) ||
        normalize(a.fournisseur).includes(query) ||
        normalize(a.titre).includes(query)
      );
    }

    this.filteredAttestations = temp;
    this.currentPage = 1; // reset to first page
    this.calculatePagination();
  }
}