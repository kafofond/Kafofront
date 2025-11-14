import { Component, HostListener, OnInit } from '@angular/core';
import { OrdreDePaiement } from '../../../models/ordre-de-paiement';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrdrePaiementService } from '../../../services/ordre-paiement.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-contentbody-ordre-paiement-comptable',
  imports: [FormsModule, CommonModule],
  templateUrl: './contentbody-ordre-paiement-comptable.html',
  styleUrl: './contentbody-ordre-paiement-comptable.css'
})
export class ContentbodyOrdrePaiementComptable implements OnInit {

  selectedStatus: string = 'Tous';
  statusDropdownOpen: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  ordreDePaiements: OrdreDePaiement[] = [];
  selectedOrdre: OrdreDePaiement | null = null;
  showDetailModal: boolean = false;
  showModificationModal: boolean = false;
  showCreationModal: boolean = false;
  modificationData: any = {};
  creationData: any = {
    montant: null,
    description: '',
    compteOrigine: '',
    compteDestinataire: '',
    decisionId: null
  };

  // Filtrage dynamique des ordres de paiement
  get filteredOrdres(): OrdreDePaiement[] {
    const filtered =
      this.selectedStatus === 'Tous'
        ? this.ordreDePaiements
        : this.ordreDePaiements.filter(
            (o) => o.statut && this.mapStatut(o.statut) === this.selectedStatus
          );
    return filtered;
  }

  constructor(
    public ordrePaiementService: OrdrePaiementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrdresDePaiement();
  }

  loadOrdresDePaiement(): void {
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
    
    console.log('Chargement des ordres de paiement pour l\'entreprise:', entrepriseId);
    
    this.ordrePaiementService.getOrdresByEntreprise(entrepriseId).subscribe({
      next: (response) => {
        console.log('Réponse reçue:', response);
        // Mapper les données de l'API vers le format OrdreDePaiement
        this.ordreDePaiements = response.ordres.map((ordre: any) => ({
          id: ordre.id,
          code: ordre.code,
          referenceDecisionPrelevement: ordre.referenceDecisionPrelevement,
          montant: ordre.montant,
          description: ordre.description,
          compteOrigine: ordre.compteOrigine,
          compteDestinataire: ordre.compteDestinataire,
          dateExecution: ordre.dateExecution,
          dateCreation: ordre.dateCreation,
          dateModification: ordre.dateModification,
          statut: ordre.statut,
          createurNom: ordre.createurNom,
          createurEmail: ordre.createurEmail,
          entrepriseNom: ordre.entrepriseNom,
          decisionId: ordre.decisionId
        }));
        console.log('Ordres de paiement chargés:', this.ordreDePaiements);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des ordres de paiement:', error);
        this.errorMessage = 'Erreur lors du chargement des ordres de paiement';
        this.isLoading = false;
      }
    });
  }

  mapStatut(statut: string): string {
    return this.ordrePaiementService.mapStatutToDisplay(statut);
  }

  // Méthodes pour les modales
  openDetailModal(ordre: OrdreDePaiement): void {
    this.selectedOrdre = ordre;
    this.showDetailModal = true;
    document.body.classList.add('modal-open');
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedOrdre = null;
    document.body.classList.remove('modal-open');
  }

  openCreationModal(): void {
    // Réinitialiser les données de création
    this.creationData = {
      montant: null,
      description: '',
      compteOrigine: '',
      compteDestinataire: '',
      decisionId: null
    };
    this.showCreationModal = true;
    document.body.classList.add('modal-open');
  }

  closeCreationModal(): void {
    this.showCreationModal = false;
    document.body.classList.remove('modal-open');
  }

  modifierOrdre(ordre: OrdreDePaiement): void {
    this.selectedOrdre = ordre;
    // Initialiser les données de modification avec les valeurs actuelles de l'ordre
    this.modificationData = {
      id: ordre.id,
      montant: ordre.montant,
      description: ordre.description,
      compteOrigine: ordre.compteOrigine,
      compteDestinataire: ordre.compteDestinataire
    };
    this.showModificationModal = true;
    document.body.classList.add('modal-open');
  }

  closeModificationModal(): void {
    this.showModificationModal = false;
    this.selectedOrdre = null;
    this.modificationData = {};
    document.body.classList.remove('modal-open');
  }

  enregistrerModification(): void {
    if (!this.selectedOrdre) return;
    
    // Préparer les données pour correspondre au format attendu par le backend
    // Ne pas inclure les champs non modifiables (code, statut, dateCreation, dateModification)
    const updateData = {
      montant: this.modificationData.montant,
      description: this.modificationData.description,
      compteOrigine: this.modificationData.compteOrigine,
      compteDestinataire: this.modificationData.compteDestinataire
    };
    
    this.ordrePaiementService.updateOrdre(this.selectedOrdre.id, updateData).subscribe({
      next: (response: any) => {
        console.log('Ordre de paiement modifié:', response);
        // Mettre à jour l'ordre dans la liste
        if (this.selectedOrdre) {
          const index = this.ordreDePaiements.findIndex(o => o.id === this.selectedOrdre!.id);
          if (index !== -1) {
            // Mettre à jour uniquement les champs modifiables
            this.ordreDePaiements[index] = {
              ...this.ordreDePaiements[index],
              montant: this.modificationData.montant,
              description: this.modificationData.description,
              compteOrigine: this.modificationData.compteOrigine,
              compteDestinataire: this.modificationData.compteDestinataire
            };
          }
        }
        this.closeModificationModal();
        alert('Ordre de paiement modifié avec succès!');
        // Recharger les données pour s'assurer de la mise à jour
        this.loadOrdresDePaiement();
      },
      error: (error: any) => {
        console.error('Erreur lors de la modification:', error);
        // Afficher un message d'erreur plus détaillé
        if (error.error && error.error.message) {
          alert('Erreur lors de la modification de l\'ordre de paiement: ' + error.error.message);
        } else {
          alert('Erreur lors de la modification de l\'ordre de paiement');
        }
        this.closeModificationModal();
      }
    });
  }

  creerOrdre(): void {
    // Vérifier que les champs obligatoires sont remplis
    if (!this.isCreationFormValid()) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    // Préparer les données pour la création
    const createData = {
      montant: this.creationData.montant,
      description: this.creationData.description,
      compteOrigine: this.creationData.compteOrigine,
      compteDestinataire: this.creationData.compteDestinataire,
      decisionId: this.creationData.decisionId
    };
    
    this.ordrePaiementService.createOrdre(createData).subscribe({
      next: (response: any) => {
        console.log('Ordre de paiement créé:', response);
        alert('Ordre de paiement créé avec succès!');
        this.closeCreationModal();
        // Recharger les données pour afficher le nouvel ordre
        this.loadOrdresDePaiement();
      },
      error: (error: any) => {
        console.error('Erreur lors de la création:', error);
        // Afficher un message d'erreur plus détaillé
        if (error.error && error.error.message) {
          alert('Erreur lors de la création de l\'ordre de paiement: ' + error.error.message);
        } else {
          alert('Erreur lors de la création de l\'ordre de paiement');
        }
      }
    });
  }

  isCreationFormValid(): boolean {
    return this.creationData.montant && 
           this.creationData.description && 
           this.creationData.compteOrigine && 
           this.creationData.compteDestinataire;
  }

  // Méthode pour obtenir la classe CSS du statut
  getStatusBadgeClass(statut: string): string {
    return this.ordrePaiementService.getStatusBadgeClass(statut);
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