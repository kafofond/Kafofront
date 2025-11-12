import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { DecisionPrelevementService, DecisionPrelevement } from '../../../services/decision-prelevement.service';
import { OrdrePaiementService, OrdrePaiement } from '../../../services/ordre-paiement.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gestion-prelevement',
  imports: [FormsModule, CommonModule, DatePipe],
  templateUrl: './gestion-prelevement.html',
  styleUrl: './gestion-prelevement.css'
})
export class GestionPrelevement implements OnInit, OnDestroy {
  selectedStatus: string = 'Tous';
  statusDropdownOpen: boolean = false;
  isLoading: boolean = true;
  errorMessage: string = '';

  // Données
  decisionDePrelevements: DecisionPrelevement[] = [];
  ordreDePaiements: OrdrePaiement[] = [];

  // États des modales
  showDecisionModal: boolean = false;
  showOrdreModal: boolean = false;
  showConfirmModal: boolean = false;
  showRejectModal: boolean = false;
  
  selectedDecision: DecisionPrelevement | null = null;
  selectedOrdre: OrdrePaiement | null = null;
  currentAction: 'decision' | 'ordre' | null = null;
  currentActionType: 'approve' | 'reject' | null = null;
  
  // Pour la modale de rejet
  rejectComment: string = '';

  private entrepriseId = 2;
  private subscriptions: Subscription[] = [];

  constructor(
    private decisionService: DecisionPrelevementService,
    private ordreService: OrdrePaiementService
  ) {}

  ngOnInit(): void {
    this.loadData();
    document.addEventListener('click', this.onClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    document.removeEventListener('click', this.onClickOutside.bind(this));
  }

  // CHARGEMENT DES DONNÉES
  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const decisionsSub = this.decisionService.getDecisionsByEntreprise(this.entrepriseId)
      .subscribe({
        next: (response) => {
          this.decisionDePrelevements = response.decisions;
          this.checkLoadingComplete();
        },
        error: (error) => {
          console.error('❌ Erreur chargement décisions:', error);
          this.errorMessage = 'Erreur lors du chargement des décisions';
          this.checkLoadingComplete();
        }
      });

    const ordresSub = this.ordreService.getOrdresByEntreprise(this.entrepriseId)
      .subscribe({
        next: (response) => {
          this.ordreDePaiements = response.ordres;
          this.checkLoadingComplete();
        },
        error: (error) => {
          console.error('❌ Erreur chargement ordres:', error);
          this.errorMessage = 'Erreur lors du chargement des ordres';
          this.checkLoadingComplete();
        }
      });

    this.subscriptions.push(decisionsSub, ordresSub);
  }

  private checkLoadingComplete(): void {
    this.isLoading = false;
  }

  // FILTRAGE DYNAMIQUE
  get filteredDecisions(): DecisionPrelevement[] {
    const filtered =
      this.selectedStatus === 'Tous'
        ? this.decisionDePrelevements
        : this.decisionDePrelevements.filter(
            d => this.mapStatutToDisplay(d.statut).toLowerCase() === this.selectedStatus.toLowerCase()
          );
    return filtered.slice(0, 5);
  }

  get filteredOrdres(): OrdrePaiement[] {
    const filtered =
      this.selectedStatus === 'Tous'
        ? this.ordreDePaiements
        : this.ordreDePaiements.filter(
            o => this.mapStatutToDisplay(o.statut).toLowerCase() === this.selectedStatus.toLowerCase()
          );
    return filtered.slice(0, 5);
  }

  // DROPDOWN STATUS
  toggleStatusDropdown() { 
    this.statusDropdownOpen = !this.statusDropdownOpen; 
  }

  setStatus(status: string) {
    this.selectedStatus = status;
    this.statusDropdownOpen = false;
  }

  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.filter-group');
    if (dropdown && !dropdown.contains(target)) {
      this.statusDropdownOpen = false;
    }
  }

  // GESTION DES MODALES DE DÉTAILS
  openDetailDecisionModal(decision: DecisionPrelevement): void {
    this.selectedDecision = decision;
    this.showDecisionModal = true;
    document.body.classList.add('modal-open');
  }

  closeDetailDecisionModal(): void {
    this.selectedDecision = null;
    this.showDecisionModal = false;
    document.body.classList.remove('modal-open');
  }

  openDetailOrdreModal(ordre: OrdrePaiement): void {
    this.selectedOrdre = ordre;
    this.showOrdreModal = true;
    document.body.classList.add('modal-open');
  }

  closeDetailOrdreModal(): void {
    this.selectedOrdre = null;
    this.showOrdreModal = false;
    document.body.classList.remove('modal-open');
  }

  // GESTION DES MODALES D'ACTION
  openConfirmModal(action: 'decision' | 'ordre', type: 'approve' | 'reject', item: any): void {
    this.currentAction = action;
    this.currentActionType = type;
    
    if (action === 'decision') {
      this.selectedDecision = item;
    } else {
      this.selectedOrdre = item;
    }

    if (type === 'reject') {
      this.rejectComment = '';
      this.showRejectModal = true;
    } else {
      this.showConfirmModal = true;
    }
    
    document.body.classList.add('modal-open');
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.showRejectModal = false;
    this.currentAction = null;
    this.currentActionType = null;
    this.selectedDecision = null;
    this.selectedOrdre = null;
    this.rejectComment = '';
    document.body.classList.remove('modal-open');
  }

  // ACTIONS BOUTONS - SANS CONTRAINTES
  validerDecision(decision: DecisionPrelevement) {
    this.openConfirmModal('decision', 'approve', decision);
  }

  refuserDecision(decision: DecisionPrelevement) {
    this.openConfirmModal('decision', 'reject', decision);
  }

  validerOrdre(ordre: OrdrePaiement) {
    this.openConfirmModal('ordre', 'approve', ordre);
  }

  refuserOrdre(ordre: OrdrePaiement) {
    this.openConfirmModal('ordre', 'reject', ordre);
  }

  // EXÉCUTION DES ACTIONS
  executeAction(): void {
    if (!this.currentAction || !this.currentActionType) return;

    if (this.currentAction === 'decision' && this.selectedDecision) {
      if (this.currentActionType === 'approve') {
        this.approveDecision(this.selectedDecision);
      } else {
        this.rejectDecision(this.selectedDecision);
      }
    } else if (this.currentAction === 'ordre' && this.selectedOrdre) {
      if (this.currentActionType === 'approve') {
        this.approveOrdre(this.selectedOrdre);
      } else {
        this.rejectOrdre(this.selectedOrdre);
      }
    }
  }

  private approveDecision(decision: DecisionPrelevement): void {
    this.decisionService.approuverDecision(decision.id).subscribe({
      next: (response) => {
        console.log('✅ Décision validée:', response);
        this.loadData(); // Recharger pour avoir les données fraîches
        this.closeConfirmModal();
      },
      error: (error) => {
        console.error('❌ Erreur validation décision:', error);
        alert('Erreur lors de la validation de la décision');
        this.closeConfirmModal();
      }
    });
  }

  private rejectDecision(decision: DecisionPrelevement): void {
    if (!this.rejectComment.trim()) {
      alert('Veuillez saisir un commentaire pour le rejet');
      return;
    }

    this.decisionService.rejeterDecision(decision.id, this.rejectComment).subscribe({
      next: (response) => {
        console.log('❌ Décision rejetée:', response);
        this.loadData(); // Recharger pour avoir les données fraîches
        this.closeConfirmModal();
      },
      error: (error) => {
        console.error('❌ Erreur rejet décision:', error);
        alert('Erreur lors du rejet de la décision');
        this.closeConfirmModal();
      }
    });
  }

  private approveOrdre(ordre: OrdrePaiement): void {
    this.ordreService.approuverOrdre(ordre.id).subscribe({
      next: (response) => {
        console.log('✅ Ordre validé:', response);
        this.loadData(); // Recharger pour avoir les données fraîches
        this.closeConfirmModal();
      },
      error: (error) => {
        console.error('❌ Erreur validation ordre:', error);
        alert('Erreur lors de la validation de l\'ordre');
        this.closeConfirmModal();
      }
    });
  }

  private rejectOrdre(ordre: OrdrePaiement): void {
    if (!this.rejectComment.trim()) {
      alert('Veuillez saisir un commentaire pour le rejet');
      return;
    }

    this.ordreService.rejeterOrdre(ordre.id, this.rejectComment).subscribe({
      next: (response) => {
        console.log('❌ Ordre rejeté:', response);
        this.loadData(); // Recharger pour avoir les données fraîches
        this.closeConfirmModal();
      },
      error: (error) => {
        console.error('❌ Erreur rejet ordre:', error);
        alert('Erreur lors du rejet de l\'ordre');
        this.closeConfirmModal();
      }
    });
  }

  // UTILITAIRES
  public mapStatutToDisplay(statut: string): string {
    const statutMap: { [key: string]: string } = {
      'VALIDE': 'Validé',
      'EN_COURS': 'En attente',
      'APPROUVE': 'Approuvé',
      'REJETE': 'Rejeté'
    };
    return statutMap[statut] || statut;
  }

  getStatusBadgeClass(statut: string): string {
    const displayStatut = this.mapStatutToDisplay(statut);
    const classMap: { [key: string]: string } = {
      'Validé': 'status-badge status-success',
      'Approuvé': 'status-badge status-success',
      'En attente': 'status-badge status-pending',
      'Rejeté': 'status-badge status-danger'
    };
    return classMap[displayStatut] || 'status-badge status-pending';
  }

  // FORMATAGE DES NOMBRES
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(amount);
  }

  // Texte pour les modales
  getActionTitle(): string {
    if (!this.currentAction || !this.currentActionType) return '';
    
    const actionType = this.currentActionType === 'approve' ? 'Approuver' : 'Rejeter';
    const itemType = this.currentAction === 'decision' ? 'la décision' : 'l\'ordre';
    
    return `${actionType} ${itemType}`;
  }

  getActionDescription(): string {
    if (!this.currentAction || !this.currentActionType || (!this.selectedDecision && !this.selectedOrdre)) return '';
    
    const item = this.currentAction === 'decision' ? this.selectedDecision : this.selectedOrdre;
    const actionType = this.currentActionType === 'approve' ? 'approuver' : 'rejeter';
    const itemType = this.currentAction === 'decision' ? 'cette décision' : 'cet ordre';
    
    return `Êtes-vous sûr de vouloir ${actionType} ${itemType} "${item?.code}" ?`;
  }
}