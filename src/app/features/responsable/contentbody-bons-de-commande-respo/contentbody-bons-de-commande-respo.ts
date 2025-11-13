import { Component, HostListener, OnInit } from '@angular/core';
import { Statut } from '../../../enums/statut';
import { BonDeCommande } from '../../../models/bon-de-commande';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BonCommandeService, BonCommandeDetail } from '../../../services/bon-commande.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-contentbody-bons-de-commande-respo',
  imports: [FormsModule, CommonModule],
  templateUrl: './contentbody-bons-de-commande-respo.html',
  styleUrl: './contentbody-bons-de-commande-respo.css'
})
export class ContentbodyBonsDeCommandeRespo implements OnInit {

  Statut = Statut;
  selectedStatus: string = 'Tous';
  statusDropdownOpen: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  // États pour les modales
  showDetailModal: boolean = false;
  showRejetModal: boolean = false;
  showApprobationModal: boolean = false;
  selectedBon: BonDeCommande | null = null;
  rejetCommentaire: string = '';

  bonsDeCommande: BonDeCommande[] = [];

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
    
    this.bonCommandeService.getBonsCommandeByEntreprise(entrepriseId).subscribe({
      next: (response) => {
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
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des bons de commande:', error);
        this.errorMessage = 'Erreur lors du chargement des bons de commande';
        this.isLoading = false;
      }
    });
  }

  private mapStatut(apiStatut: string): Statut {
    switch (apiStatut) {
      case 'VALIDE': return Statut.VALIDE;
      case 'REJETE': return Statut.REJETE;
      case 'EN_ATTENTE': return Statut.EN_ATTENTE;
      default: return Statut.EN_ATTENTE;
    }
  }

  // Filtrage dynamique des bons de commande
  get filteredBons(): BonDeCommande[] {
    const filtered =
      this.selectedStatus === 'Tous'
        ? this.bonsDeCommande
        : this.bonsDeCommande.filter(
            (b) => b.statut.toLowerCase() === this.selectedStatus.toLowerCase()
          );
    return filtered;
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

  openRejetModal(bon: BonDeCommande): void {
    this.selectedBon = bon;
    this.rejetCommentaire = '';
    this.showRejetModal = true;
    document.body.classList.add('modal-open');
  }

  closeRejetModal(): void {
    this.showRejetModal = false;
    this.selectedBon = null;
    this.rejetCommentaire = '';
    document.body.classList.remove('modal-open');
  }

  openApprobationModal(bon: BonDeCommande): void {
    this.selectedBon = bon;
    this.showApprobationModal = true;
    document.body.classList.add('modal-open');
  }

  closeApprobationModal(): void {
    this.showApprobationModal = false;
    this.selectedBon = null;
    document.body.classList.remove('modal-open');
  }

  // Méthodes pour les actions
  approuverBon(): void {
    if (!this.selectedBon) return;
    
    if (confirm(`Êtes-vous sûr de vouloir approuver le bon de commande ${this.selectedBon.code} ?`)) {
      this.bonCommandeService.approuverBonCommande(this.selectedBon.id).subscribe({
        next: (response) => {
          console.log('Bon de commande approuvé:', response);
          // Mettre à jour le statut du bon dans la liste
          if (this.selectedBon) {
            this.selectedBon.statut = Statut.VALIDE;
          }
          this.closeApprobationModal();
          alert('Bon de commande approuvé avec succès!');
        },
        error: (error) => {
          console.error('Erreur lors de l\'approbation:', error);
          this.closeApprobationModal();
          alert('Erreur lors de l\'approbation du bon de commande');
        }
      });
    }
  }

  rejeterBon(): void {
    if (!this.selectedBon || !this.rejetCommentaire.trim()) {
      alert('Veuillez saisir un commentaire pour le rejet');
      return;
    }

    this.bonCommandeService.rejeterBonCommande(this.selectedBon.id, this.rejetCommentaire).subscribe({
      next: (response) => {
        console.log('Bon de commande rejeté:', response);
        // Mettre à jour le statut du bon dans la liste
        if (this.selectedBon) {
          this.selectedBon.statut = Statut.REJETE;
        }
        this.closeRejetModal();
        alert('Bon de commande rejeté avec succès!');
      },
      error: (error) => {
        console.error('Erreur lors du rejet:', error);
        this.closeRejetModal();
        alert('Erreur lors du rejet du bon de commande');
      }
    });
  }
}