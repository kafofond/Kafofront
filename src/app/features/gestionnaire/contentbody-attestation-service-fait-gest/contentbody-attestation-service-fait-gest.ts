import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
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
        this.filteredAttestations = [...this.attestations];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des attestations:', error);
        this.errorMessage = 'Erreur lors du chargement des attestations.';
        this.isLoading = false;
      }
    });
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
}