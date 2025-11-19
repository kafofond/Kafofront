import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BonCommandeService } from '../../../services/bon-commande.service';
import { AttestationServiceService } from '../../../services/attestation-service.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-documents-execution',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents-execution.html',
  styleUrls: ['./documents-execution.css']
})
export class DocumentsExecution implements OnInit {
  selectedStatus: string = 'Tous';
  statusDropdownOpen: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  // Données des APIs
  bonsDeCommande: any[] = [];
  attestations: any[] = [];

  // Données sélectionnées pour les modales
  selectedBon: any = null;
  selectedAttestation: any = null;

  // États des modales
  showBonModal: boolean = false;
  showAttestationModal: boolean = false;

  constructor(
    private bonCommandeService: BonCommandeService,
    private attestationService: AttestationServiceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
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

    // Charger les bons de commande
    this.bonCommandeService.getBonsCommandeByEntreprise(entrepriseId).subscribe({
      next: (response) => {
        console.log('✅ Bons de commande reçus:', response);
        this.bonsDeCommande = response.bons.map((bon: any) => ({
          ...bon,
          id: bon.id, // S'assurer que l'ID est présent
          statut: this.mapApiStatut(bon.statut)
        }));
        console.log('📊 Bons de commande mappés:', this.bonsDeCommande);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur bons de commande:', error);
        this.errorMessage = 'Erreur lors du chargement des bons de commande';
        this.isLoading = false;
      }
    });

    // Charger les attestations
    this.attestationService.getAttestationsByEntreprise(entrepriseId).subscribe({
      next: (response) => {
        console.log('✅ Attestations reçues:', response);
        this.attestations = response.attestations.map((attestation: any) => ({
          ...attestation,
          id: attestation.id, // S'assurer que l'ID est présent
          statut: 'Validé', // Valeur par défaut
          // Utiliser dateLivraison directement depuis l'API
          dateLivraison: attestation.dateLivraison
        }));
        console.log('📊 Attestations mappées:', this.attestations);
      },
      error: (error) => {
        console.error('❌ Erreur attestations:', error);
        this.errorMessage = 'Erreur lors du chargement des attestations';
      }
    });
  }

  // Filtrage dynamique des bons de commande
  get filteredBons(): any[] {
    if (!this.bonsDeCommande.length) return [];
    
    const filtered = this.selectedStatus === 'Tous' 
      ? this.bonsDeCommande 
      : this.bonsDeCommande.filter(b => b.statut === this.selectedStatus);
    return filtered.slice(0, 5);
  }

  // Filtrage dynamique des attestations
  get filteredAttestations(): any[] {
    if (!this.attestations.length) return [];
    
    const filtered = this.selectedStatus === 'Tous' 
      ? this.attestations 
      : this.attestations.filter(a => a.statut === this.selectedStatus);
    return filtered.slice(0, 5);
  }

  // Mapping des statuts de l'API vers l'affichage
  mapApiStatut(statut: string): string {
    const statutMap: { [key: string]: string } = {
      'VALIDE': 'Validé',
      'EN_COURS': 'En cours',
      'EN_ATTENTE': 'En attente',
      'REJETE': 'Rejeté',
      'VALIDÉ': 'Validé',
      'EN ATTENTE': 'En attente',
      'REJETÉ': 'Rejeté'
    };
    return statutMap[statut] || statut;
  }

  // Gestion du dropdown
  toggleStatusDropdown() {
    this.statusDropdownOpen = !this.statusDropdownOpen;
  }

  setStatus(status: string) {
    this.selectedStatus = status;
    this.statusDropdownOpen = false;
  }

  // Ouvrir modale bon de commande - CORRIGÉ
  openBonModal(bon: any) {
    console.log('🔄 Ouverture modale bon de commande:', bon);
    
    if (!bon || !bon.id) {
      console.error('❌ ID du bon de commande manquant');
      this.errorMessage = 'ID du bon de commande manquant';
      return;
    }

    this.isLoading = true;
    this.bonCommandeService.getBonCommandeById(bon.id).subscribe({
      next: (detail) => {
        console.log('✅ Détails bon de commande:', detail);
        this.selectedBon = detail;
        this.showBonModal = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur détails bon:', error);
        this.errorMessage = 'Erreur lors du chargement des détails';
        this.isLoading = false;
      }
    });
  }

  // Fermer modale bon de commande
  closeBonModal() {
    this.showBonModal = false;
    this.selectedBon = null;
  }

  // Ouvrir modale attestation - CORRIGÉ
  openAttestationModal(attestation: any) {
    console.log('🔄 Ouverture modale attestation:', attestation);
    
    if (!attestation || !attestation.id) {
      console.error('❌ ID de l\'attestation manquant');
      this.errorMessage = 'ID de l\'attestation manquant';
      return;
    }

    this.isLoading = true;
    this.attestationService.getAttestationById(attestation.id).subscribe({
      next: (detail) => {
        console.log('✅ Détails attestation:', detail);
        this.selectedAttestation = detail;
        this.showAttestationModal = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur détails attestation:', error);
        this.errorMessage = 'Erreur lors du chargement des détails';
        this.isLoading = false;
      }
    });
  }

  // Fermer modale attestation
  closeAttestationModal() {
    this.showAttestationModal = false;
    this.selectedAttestation = null;
  }

  // Gestion des clics en dehors du dropdown
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.filter-group');
    if (dropdown && !dropdown.contains(target)) {
      this.statusDropdownOpen = false;
    }
  }

  // Formater les dates - CORRIGÉ
  formatDate(dateString: string | null): string {
    if (!dateString) return 'Non spécifié';
    
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Date invalide' : date.toLocaleDateString('fr-FR');
    } catch (error) {
      console.error('Erreur format date:', error);
      return 'Date invalide';
    }
  }

  // Obtenir le nom du fichier depuis l'URL
  getFileName(url: string | null): string {
    if (!url) return 'Aucun fichier';
    return url.split('/').pop() || 'Fichier joint';
  }
}