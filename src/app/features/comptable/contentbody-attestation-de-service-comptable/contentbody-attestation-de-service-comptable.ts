import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Statut } from '../../../enums/statut';
import { AttestationServiceService, AttestationApiResponse, AttestationDetail } from '../../../services/attestation-service.service';
import { AuthService } from '../../../services/auth.service';
import { AttestationServiceFait } from '../../../models/attestation-service-fait';

@Component({
  selector: 'app-contentbody-attestation-de-service-comptable',
  imports: [FormsModule,CommonModule],
  templateUrl: './contentbody-attestation-de-service-comptable.html',
  styleUrl: './contentbody-attestation-de-service-comptable.css'
})
export class ContentbodyAttestationDeServiceComptable implements OnInit {

  Statut = Statut;
  selectedStatus: string = 'Tous';
  statusDropdownOpen: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  attestations: AttestationServiceFait[] = [];
  selectedAttestation: AttestationServiceFait | null = null;
  showDetailModal: boolean = false;

  // Filtrage dynamique des attestations de service fait
  get filteredAttestations(): AttestationServiceFait[] {
    const filtered =
      this.selectedStatus === 'Tous'
        ? this.attestations
        : this.attestations.filter(
            (a) =>
              a.statut &&
              a.statut.toLowerCase() === this.selectedStatus.toLowerCase()
          );
    return filtered;
  }

  constructor(
    private attestationService: AttestationServiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAttestations();
  }

  loadAttestations(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Récupérer l'ID de l'entreprise depuis le token
    const entrepriseId = this.authService.getEntrepriseIdFromToken();
    
    if (!entrepriseId) {
      console.error('Impossible de récupérer l\'ID de l\'entreprise');
      this.errorMessage = 'Impossible de récupérer les informations de l\'entreprise';
      this.isLoading = false;
      return;
    }
    
    this.attestationService.getAttestationsByEntreprise(entrepriseId).subscribe({
      next: (response: AttestationApiResponse) => {
        // Mapper les données de l'API vers le format AttestationServiceFait
        this.attestations = response.attestations.map((attestation: any) => ({
          id: attestation.id,
          code: attestation.code || 'N/A',
          referenceBonCommande: attestation.referenceBonCommande || 'N/A',
          fournisseur: attestation.fournisseur,
          titre: attestation.titre,
          dateCreation: attestation.dateCreation,
          dateLivraison: attestation.dateLivraison,
          constat: attestation.constat,
          preuve: attestation.urlFichierJoint || 'Aucun fichier',
          statut: 'Validé' // Valeur par défaut
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des attestations:', error);
        this.errorMessage = 'Erreur lors du chargement des attestations';
        this.isLoading = false;
      }
    });
  }

  // Méthodes pour les modales
  openDetailModal(attestation: AttestationServiceFait): void {
    this.selectedAttestation = attestation;
    this.showDetailModal = true;
    document.body.classList.add('modal-open');
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedAttestation = null;
    document.body.classList.remove('modal-open');
  }

 

  toggleStatusDropdown() {
    this.statusDropdownOpen = !this.statusDropdownOpen;
  }

  setStatus(status: string) {
    this.selectedStatus = status;
    this.statusDropdownOpen = false; // fermer dropdown après sélection
  }

  // Fermer dropdown si clic en dehors
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.filter-group');
    if (dropdown && !dropdown.contains(target)) {
      this.statusDropdownOpen = false;
    }
  }


}
