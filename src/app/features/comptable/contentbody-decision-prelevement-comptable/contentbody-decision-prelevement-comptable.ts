import { Component, HostListener, OnInit } from '@angular/core';
import { DecisionPrelevement } from '../../../models/decision-prelevement';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DecisionPrelevementService } from '../../../services/decision-prelevement.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-contentbody-decision-prelevement-comptable',
  imports: [FormsModule, CommonModule],
  templateUrl: './contentbody-decision-prelevement-comptable.html',
  styleUrl: './contentbody-decision-prelevement-comptable.css'
})
export class ContentbodyDecisionPrelevementComptable implements OnInit {

  selectedStatus: string = 'Tous';
  statusDropdownOpen: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  decisionDePrelevements: DecisionPrelevement[] = [];
  selectedDecision: DecisionPrelevement | null = null;
  showDetailModal: boolean = false;
  showModificationModal: boolean = false;
  showCreationModal: boolean = false;
  modificationData: any = {};
  creationData: any = {
    motifPrelevement: '',
    montant: null,
    compteOrigine: '',
    compteDestinataire: '',
    attestationId: null
  };

  // Filtrage dynamique des décisions de prélèvement
  get filteredDecisions(): DecisionPrelevement[] {
    const filtered =
      this.selectedStatus === 'Tous'
        ? this.decisionDePrelevements
        : this.decisionDePrelevements.filter(
            (d) => d.statut && this.mapStatut(d.statut) === this.selectedStatus
          );
    return filtered;
  }

  constructor(
    public decisionPrelevementService: DecisionPrelevementService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDecisionsDePrelevement();
  }

  loadDecisionsDePrelevement(): void {
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
    
    console.log('Chargement des décisions de prélèvement pour l\'entreprise:', entrepriseId);
    
    this.decisionPrelevementService.getDecisionsByEntreprise(entrepriseId).subscribe({
      next: (response) => {
        console.log('Réponse reçue:', response);
        // Mapper les données de l'API vers le format DecisionPrelevement
        this.decisionDePrelevements = response.decisions.map((decision: any) => ({
          id: decision.id,
          code: decision.code,
          referenceAttestation: decision.referenceAttestation,
          montant: decision.montant,
          compteOrigine: decision.compteOrigine,
          compteDestinataire: decision.compteDestinataire,
          motifPrelevement: decision.motifPrelevement,
          dateCreation: decision.dateCreation,
          dateModification: decision.dateModification,
          statut: decision.statut,
          createurNom: decision.createurNom,
          createurEmail: decision.createurEmail,
          entrepriseNom: decision.entrepriseNom,
          attestationId: decision.attestationId
        }));
        console.log('Décisions de prélèvement chargées:', this.decisionDePrelevements);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des décisions de prélèvement:', error);
        this.errorMessage = 'Erreur lors du chargement des décisions de prélèvement';
        this.isLoading = false;
      }
    });
  }

  mapStatut(statut: string): string {
    return this.decisionPrelevementService.mapStatutToDisplay(statut);
  }

  // Méthodes pour les modales
  openDetailModal(decision: DecisionPrelevement): void {
    this.selectedDecision = decision;
    this.showDetailModal = true;
    document.body.classList.add('modal-open');
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedDecision = null;
    document.body.classList.remove('modal-open');
  }

  openCreationModal(): void {
    // Réinitialiser les données de création
    this.creationData = {
      motifPrelevement: '',
      montant: null,
      compteOrigine: '',
      compteDestinataire: '',
      attestationId: null
    };
    this.showCreationModal = true;
    document.body.classList.add('modal-open');
  }

  closeCreationModal(): void {
    this.showCreationModal = false;
    document.body.classList.remove('modal-open');
  }

  modifierDecision(decision: DecisionPrelevement): void {
    this.selectedDecision = decision;
    // Initialiser les données de modification avec les valeurs actuelles de la décision
    this.modificationData = {
      id: decision.id,
      montant: decision.montant,
      compteOrigine: decision.compteOrigine,
      compteDestinataire: decision.compteDestinataire,
      motifPrelevement: decision.motifPrelevement
    };
    this.showModificationModal = true;
    document.body.classList.add('modal-open');
  }

  closeModificationModal(): void {
    this.showModificationModal = false;
    this.selectedDecision = null;
    this.modificationData = {};
    document.body.classList.remove('modal-open');
  }

  enregistrerModification(): void {
    if (!this.selectedDecision) return;
    
    // Préparer les données pour correspondre au format attendu par le backend
    const updateData = {
      montant: this.modificationData.montant,
      compteOrigine: this.modificationData.compteOrigine,
      compteDestinataire: this.modificationData.compteDestinataire,
      motifPrelevement: this.modificationData.motifPrelevement
    };
    
    this.decisionPrelevementService.updateDecision(this.selectedDecision.id, updateData).subscribe({
      next: (response: any) => {
        console.log('Décision de prélèvement modifiée:', response);
        // Mettre à jour la décision dans la liste
        if (this.selectedDecision) {
          const index = this.decisionDePrelevements.findIndex(d => d.id === this.selectedDecision!.id);
          if (index !== -1) {
            this.decisionDePrelevements[index] = {...this.decisionDePrelevements[index], ...this.modificationData};
          }
        }
        this.closeModificationModal();
        alert('Décision de prélèvement modifiée avec succès!');
        // Recharger les données pour s'assurer de la mise à jour
        this.loadDecisionsDePrelevement();
      },
      error: (error: any) => {
        console.error('Erreur lors de la modification:', error);
        // Afficher un message d'erreur plus détaillé
        if (error.error && error.error.message) {
          alert('Erreur lors de la modification de la décision de prélèvement: ' + error.error.message);
        } else {
          alert('Erreur lors de la modification de la décision de prélèvement');
        }
        this.closeModificationModal();
      }
    });
  }

  creerDecision(): void {
    // Vérifier que les champs obligatoires sont remplis
    if (!this.isCreationFormValid()) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    // Préparer les données pour la création
    const createData = {
      motifPrelevement: this.creationData.motifPrelevement,
      montant: this.creationData.montant,
      compteOrigine: this.creationData.compteOrigine,
      compteDestinataire: this.creationData.compteDestinataire,
      attestationId: this.creationData.attestationId
    };
    
    this.decisionPrelevementService.createDecision(createData).subscribe({
      next: (response: any) => {
        console.log('Décision de prélèvement créée:', response);
        alert('Décision de prélèvement créée avec succès!');
        this.closeCreationModal();
        // Recharger les données pour afficher la nouvelle décision
        this.loadDecisionsDePrelevement();
      },
      error: (error: any) => {
        console.error('Erreur lors de la création:', error);
        // Afficher un message d'erreur plus détaillé
        if (error.error && error.error.message) {
          alert('Erreur lors de la création de la décision de prélèvement: ' + error.error.message);
        } else {
          alert('Erreur lors de la création de la décision de prélèvement');
        }
      }
    });
  }

  isCreationFormValid(): boolean {
    return this.creationData.montant && 
           this.creationData.compteOrigine && 
           this.creationData.compteDestinataire && 
           this.creationData.attestationId;
  }

  // Méthode pour obtenir la classe CSS du statut
  getStatusBadgeClass(statut: string): string {
    return this.decisionPrelevementService.getStatusBadgeClass(statut);
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