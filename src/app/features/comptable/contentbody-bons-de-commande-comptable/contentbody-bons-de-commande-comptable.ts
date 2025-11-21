import { Component, HostListener, OnInit } from '@angular/core';
import { BonDeCommande } from '../../../models/bon-de-commande';
import { Statut } from '../../../enums/statut';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BonCommandeService } from '../../../services/bon-commande.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-contentbody-bons-de-commande-comptable',
  imports: [FormsModule, CommonModule],
  templateUrl: './contentbody-bons-de-commande-comptable.html',
  styleUrl: './contentbody-bons-de-commande-comptable.css'
})
export class ContentbodyBonsDeCommandeComptable implements OnInit {

  Statut = Statut;
  selectedStatus: string = 'Tous';
  statusDropdownOpen: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  bonsDeCommande: BonDeCommande[] = [];
  selectedBon: BonDeCommande | null = null;
  showDetailModal: boolean = false;
  showValidationModal: boolean = false;
  showModificationModal: boolean = false;
  validationCommentaire: string = '';
  modificationData: any = {};

  // Filtrage dynamique des bons de commande
  get filteredBons(): BonDeCommande[] {
    const filtered =
      this.selectedStatus === 'Tous'
        ? this.bonsDeCommande
        : this.bonsDeCommande.filter(
            (b) => b.statut && b.statut === this.selectedStatus
          );
    return filtered;
  }

  constructor(
    private bonCommandeService: BonCommandeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBonsDeCommande();
  }

  loadBonsDeCommande(): void {
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
    
    console.log('Chargement des bons de commande pour l\'entreprise:', entrepriseId);
    
    this.bonCommandeService.getBonsCommandeByEntreprise(entrepriseId).subscribe({
      next: (response) => {
        console.log('Réponse reçue:', response);
        // Mapper les données de l'API vers le format BonDeCommande
        this.bonsDeCommande = response.bons.map((bon: any) => ({
          id: bon.id,
          referenceDemande: bon.demandeAchatId?.toString() || 'N/A',
          code: bon.code,
          fournisseur: bon.fournisseur,
          description: bon.description,
          montantTotal: bon.montantTotal,
          serviceBeneficiaire: bon.serviceBeneficiaire,
          modePaiement: bon.modePaiement,
          dateCreation: bon.dateCreation,
          delaiPaiement: bon.delaiPaiement,
          dateExecution: bon.dateExecution,
          statut: this.mapStatut(bon.statut),
          createurNom: bon.createurNom,
          createurEmail: bon.createurEmail,
          entrepriseNom: bon.entrepriseNom
        }));
        console.log('Bons de commande chargés:', this.bonsDeCommande);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des bons de commande:', error);
        this.errorMessage = 'Erreur lors du chargement des bons de commande';
        this.isLoading = false;
      }
    });
  }

  mapStatut(statut: string): string {
    const statutMap: { [key: string]: string } = {
      'VALIDE': 'Validé',
      'EN_COURS': 'En attente',
      'REJETE': 'Rejeté'
    };
    return statutMap[statut] || statut;
  }

  // Méthodes pour les modales
  openDetailModal(bon: BonDeCommande): void {
    this.selectedBon = bon;
    this.showDetailModal = true;
    document.body.classList.add('modal-open');
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedBon = null;
    document.body.classList.remove('modal-open');
  }

  openValidationModal(bon: BonDeCommande): void {
    this.selectedBon = bon;
    this.validationCommentaire = '';
    this.showValidationModal = true;
    document.body.classList.add('modal-open');
  }

  closeValidationModal(): void {
    this.showValidationModal = false;
    this.selectedBon = null;
    this.validationCommentaire = '';
    document.body.classList.remove('modal-open');
  }

  modifierBon(bon: BonDeCommande): void {
    this.selectedBon = bon;
    // Initialiser les données de modification avec les valeurs actuelles du bon
    this.modificationData = {
      id: bon.id,
      fournisseur: bon.fournisseur,
      description: bon.description,
      montantTotal: bon.montantTotal,
      serviceBeneficiaire: bon.serviceBeneficiaire,
      modePaiement: bon.modePaiement,
      // Stocker la date de création d'origine pour l'envoi
      dateCreation: bon.dateCreation,
      delaiPaiement: bon.delaiPaiement,
      dateExecution: bon.dateExecution,
      statut: bon.statut,
      createurNom: bon.createurNom,
      createurEmail: bon.createurEmail,
      entrepriseNom: bon.entrepriseNom,
      demandeAchatId: bon.referenceDemande ? parseInt(bon.referenceDemande, 10) : null
    };
    this.showModificationModal = true;
    document.body.classList.add('modal-open');
  }

  closeModificationModal(): void {
    this.showModificationModal = false;
    this.selectedBon = null;
    this.modificationData = {};
    document.body.classList.remove('modal-open');
  }

  enregistrerModification(): void {
    if (!this.selectedBon) return;
    
    // Préparer les données pour correspondre au format attendu par le backend
    // Ne pas inclure les champs non modifiables (code, statut)
    const updateData = {
      fournisseur: this.modificationData.fournisseur,
      description: this.modificationData.description,
      montantTotal: this.modificationData.montantTotal,
      serviceBeneficiaire: this.modificationData.serviceBeneficiaire,
      modePaiement: this.modificationData.modePaiement,
      dateCreation: this.modificationData.dateCreation, // Envoyer la date d'origine
      delaiPaiement: this.modificationData.delaiPaiement,
      dateExecution: this.modificationData.dateExecution,
      demandeAchatId: this.modificationData.demandeAchatId
    };
    
    this.bonCommandeService.updateBonCommande(this.selectedBon.id, updateData).subscribe({
      next: (response: any) => {
        console.log('Bon de commande modifié:', response);
        // Mettre à jour le bon dans la liste
        if (this.selectedBon) {
          const index = this.bonsDeCommande.findIndex(b => b.id === this.selectedBon!.id);
          if (index !== -1) {
            this.bonsDeCommande[index] = {...this.bonsDeCommande[index], ...this.modificationData};
          }
        }
        this.closeModificationModal();
        alert('Bon de commande modifié avec succès!');
      },
      error: (error: any) => {
        console.error('Erreur lors de la modification:', error);
        // Afficher un message d'erreur plus détaillé
        if (error.error && error.error.message) {
          alert('Erreur lors de la modification du bon de commande: ' + error.error.message);
        } else {
          alert('Erreur lors de la modification du bon de commande');
        }
        this.closeModificationModal();
      }
    });
  }

  mapStatutToFrontendToBackend(statut: string): string {
    const statutMap: { [key: string]: string } = {
      'Validé': 'VALIDE',
      'En attente': 'EN_COURS',
      'Rejeté': 'REJETE'
    };
    return statutMap[statut] || statut;
  }

  // Méthodes pour les actions
  validerBon(): void {
    if (!this.selectedBon) return;
    
    this.bonCommandeService.validerBonCommande(this.selectedBon.id).subscribe({
      next: (response: any) => {
        console.log('Bon de commande validé:', response);
        // Mettre à jour le statut du bon dans la liste
        if (this.selectedBon) {
          this.selectedBon.statut = Statut.VALIDE;
        }
        this.closeValidationModal();
        alert('Bon de commande validé avec succès!');
      },
      error: (error: any) => {
        console.error('Erreur lors de la validation:', error);
        this.closeValidationModal();
        alert('Erreur lors de la validation du bon de commande');
      }
    });
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
