import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

// Services
import { DemandeAchatService, DemandeAchat } from '../../../services/demande-achat.service';
import { FicheBesoinService, FicheBesoin, Designation } from '../../../services/fiche-besoin.service';
import { DocumentService } from '../../../services/document.service'; // Ajout de l'import du service de document

// Modèles
import { Statut } from '../../../enums/statut';

@Component({
  selector: 'app-depenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './depenses.html',
  styleUrls: ['./depenses.css']
})
export class Depenses implements OnInit, OnDestroy {
  Statut = Statut;
  
  // États
  selectedStatus: string = 'Tous';
  statusDropdownOpen: boolean = false;
  isLoading: boolean = true;
  errorMessage: string = '';
  
  // Données
  demandesAchat: DemandeAchat[] = [];
  fichesBesoin: FicheBesoin[] = [];
  // Pagination state is handled using the 'itemsPerPageX/currentPageX/totalPagesX' naming
  
  // Modales
  showDetailDemandeModal: boolean = false;
  showDetailFicheModal: boolean = false;
  selectedDemande: DemandeAchat | null = null;
  selectedFiche: FicheBesoin | null = null;
  // Approbation / Rejet
  showRejectDemandeModal: boolean = false;
  rejectCommentDemande: string = '';
  showRejectFicheModal: boolean = false;
  rejectCommentFiche: string = '';
  
  // Filtres
  searchQuery: string = '';
  // Pagination - Demandes
  currentPageDemandes: number = 1;
  itemsPerPageDemandes: number = 10;
  totalPagesDemandes: number = 0;
  // Pagination - Fiches
  currentPageFiches: number = 1;
  itemsPerPageFiches: number = 10;
  totalPagesFiches: number = 0;
  get filteredDemandes(): DemandeAchat[] {
    const normalize = (s: string) => (s || '').toString().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const query = normalize(this.searchQuery.trim());

    let filtered = this.selectedStatus === 'Tous'
      ? [...this.demandesAchat]
      : this.demandesAchat.filter(d => this.mapApiStatutToDisplay(d.statut) === this.selectedStatus);

    if (query.length > 0) {
      filtered = filtered.filter(d =>
        normalize(d.code).includes(query) ||
        normalize(d.description || '').includes(query) ||
        normalize(d.fournisseur || '').includes(query) ||
        normalize(this.mapApiStatutToDisplay(d.statut)).includes(query)
      );
    }
    
    this.totalPagesDemandes = Math.ceil(filtered.length / this.itemsPerPageDemandes) || 1;
    return filtered;
  }

  get filteredFiches(): FicheBesoin[] {
    const normalize = (s: string) => (s || '').toString().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const query = normalize(this.searchQuery.trim());

    let filtered = this.selectedStatus === 'Tous'
      ? [...this.fichesBesoin]
      : this.fichesBesoin.filter(f => this.mapApiStatutToDisplay(f.statut) === this.selectedStatus);

    if (query.length > 0) {
      filtered = filtered.filter(f =>
        normalize(f.code).includes(query) ||
        normalize(f.objet || '').includes(query) ||
        normalize(f.serviceBeneficiaire || '').includes(query) ||
        normalize(this.mapApiStatutToDisplay(f.statut)).includes(query)
      );
    }

    this.totalPagesFiches = Math.ceil(filtered.length / this.itemsPerPageFiches) || 1;
    return filtered;
  }

  // Paginated slices returned to template
  get paginatedDemandes(): DemandeAchat[] {
    const start = (this.currentPageDemandes - 1) * this.itemsPerPageDemandes;
    const end = start + this.itemsPerPageDemandes;
    return this.filteredDemandes.slice(start, end);
  }

  get paginatedFiches(): FicheBesoin[] {
    const start = (this.currentPageFiches - 1) * this.itemsPerPageFiches;
    const end = start + this.itemsPerPageFiches;
    return this.filteredFiches.slice(start, end);
  }

  // Pagination controls
  goToPageDemandes(page: number): void {
    if (page >= 1 && page <= this.totalPagesDemandes) this.currentPageDemandes = page;
  }

  nextPageDemandes(): void {
    if (this.currentPageDemandes < this.totalPagesDemandes) this.currentPageDemandes++;
  }

  previousPageDemandes(): void {
    if (this.currentPageDemandes > 1) this.currentPageDemandes--;
  }

  goToPageFiches(page: number): void {
    if (page >= 1 && page <= this.totalPagesFiches) this.currentPageFiches = page;
  }

  nextPageFiches(): void {
    if (this.currentPageFiches < this.totalPagesFiches) this.currentPageFiches++;
  }

  previousPageFiches(): void {
    if (this.currentPageFiches > 1) this.currentPageFiches--;
  }

  private subscriptions: Subscription = new Subscription();
  private entrepriseId: number = 2; // À récupérer dynamiquement depuis l'authentification

  constructor(
    private demandeAchatService: DemandeAchatService,
    private ficheBesoinService: FicheBesoinService,
    private documentService: DocumentService // Ajout du service de document
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Charger les demandes d'achat
    const demandeSub = this.demandeAchatService.getDemandesByEntreprise(this.entrepriseId)
      .subscribe({
        next: (response) => {
          this.demandesAchat = response.demandes;
          console.log('✅ Demandes d\'achat chargées:', this.demandesAchat);
        },
        error: (error) => {
          console.error('❌ Erreur chargement demandes:', error);
          this.errorMessage = 'Erreur lors du chargement des demandes d\'achat';
        }
      });

    // Charger les fiches de besoin
    const ficheSub = this.ficheBesoinService.getFichesByEntreprise(this.entrepriseId)
      .subscribe({
        next: (response) => {
          this.fichesBesoin = response.fiches;
          console.log('✅ Fiches de besoin chargées:', this.fichesBesoin);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Erreur chargement fiches:', error);
          this.errorMessage = this.errorMessage 
            ? this.errorMessage + ' et des fiches de besoin' 
            : 'Erreur lors du chargement des fiches de besoin';
          this.isLoading = false;
        }
      });

    this.subscriptions.add(demandeSub);
    this.subscriptions.add(ficheSub);
  }

  // Gestion du dropdown
  toggleStatusDropdown(): void {
    this.statusDropdownOpen = !this.statusDropdownOpen;
  }

  setStatus(status: string): void {
    this.selectedStatus = status;
    this.statusDropdownOpen = false;
    // Reset pagination when filters change
    this.currentPageDemandes = 1;
    this.currentPageFiches = 1;
  }

  onSearchQueryChange(): void {
    // Reset pagination when search changes
    this.currentPageDemandes = 1;
    this.currentPageFiches = 1;
  }

  // APPROVE / REJECT - DEMANDES
  approuverDemande(demande: DemandeAchat): void {
    if (!confirm(`Êtes-vous sûr de vouloir approuver la demande ${demande.code} ?`)) return;
    this.demandeAchatService.approuverDemande(demande.id).subscribe({
      next: () => {
        const idx = this.demandesAchat.findIndex(d => d.id === demande.id);
        if (idx !== -1) { this.demandesAchat[idx].statut = 'APPROUVE'; }
      },
      error: (err) => { console.error('Erreur approuver demande', err); this.errorMessage = err.message || 'Erreur lors de l\'approbation'; }
    });
  }

  openRejectDemandeModal(demande: DemandeAchat): void {
    this.selectedDemande = demande;
    this.rejectCommentDemande = '';
    this.showRejectDemandeModal = true;
  }

  submitRejectDemande(): void {
    if (!this.selectedDemande || !this.rejectCommentDemande.trim()) return;
    const comment = this.rejectCommentDemande.trim();
    this.demandeAchatService.rejeterDemande(this.selectedDemande.id, comment).subscribe({
      next: () => {
        const idx = this.demandesAchat.findIndex(d => d.id === this.selectedDemande!.id);
        if (idx !== -1) { this.demandesAchat[idx].statut = 'REJETE'; }
        this.closeRejectDemandeModal();
      },
      error: (err) => { console.error('Erreur reject demande', err); this.errorMessage = err.message || 'Erreur lors du rejet'; this.closeRejectDemandeModal(); }
    });
  }

  closeRejectDemandeModal(): void {
    this.showRejectDemandeModal = false;
    this.selectedDemande = null;
    this.rejectCommentDemande = '';
  }

  // APPROVE / REJECT - FICHES
  approuverFiche(fiche: FicheBesoin): void {
    if (!confirm(`Êtes-vous sûr de vouloir approuver la fiche ${fiche.code} ?`)) return;
    this.ficheBesoinService.approuverFiche(fiche.id).subscribe({
      next: () => {
        const idx = this.fichesBesoin.findIndex(f => f.id === fiche.id);
        if (idx !== -1) { this.fichesBesoin[idx].statut = 'APPROUVE'; }
      },
      error: (err) => { console.error('Erreur approuver fiche', err); this.errorMessage = err.message || 'Erreur lors de l\'approbation'; }
    });
  }

  openRejectFicheModal(fiche: FicheBesoin): void {
    this.selectedFiche = fiche;
    this.rejectCommentFiche = '';
    this.showRejectFicheModal = true;
  }

  submitRejectFiche(): void {
    if (!this.selectedFiche || !this.rejectCommentFiche.trim()) return;
    const comment = this.rejectCommentFiche.trim();
    this.ficheBesoinService.rejeterFiche(this.selectedFiche.id, comment).subscribe({
      next: () => {
        const idx = this.fichesBesoin.findIndex(f => f.id === this.selectedFiche!.id);
        if (idx !== -1) { this.fichesBesoin[idx].statut = 'REJETE'; }
        this.closeRejectFicheModal();
      },
      error: (err) => { console.error('Erreur reject fiche', err); this.errorMessage = err.message || 'Erreur lors du rejet'; this.closeRejectFicheModal(); }
    });
  }

  closeRejectFicheModal(): void {
    this.showRejectFicheModal = false;
    this.selectedFiche = null;
    this.rejectCommentFiche = '';
  }

  // MODALES DE DÉTAILS
  openDetailDemandeModal(demande: DemandeAchat): void {
    this.selectedDemande = demande;
    this.showDetailDemandeModal = true;
    document.body.classList.add('modal-open');
  }

  closeDetailDemandeModal(): void {
    this.selectedDemande = null;
    this.showDetailDemandeModal = false;
    document.body.classList.remove('modal-open');
  }

  openDetailFicheModal(fiche: FicheBesoin): void {
    this.selectedFiche = fiche;
    this.showDetailFicheModal = true;
    document.body.classList.add('modal-open');
  }

  closeDetailFicheModal(): void {
    this.selectedFiche = null;
    this.showDetailFicheModal = false;
    document.body.classList.remove('modal-open');
  }

  // Fonction pour télécharger le PDF d'une fiche de besoin
  downloadFicheBesoinPdf(): void {
    if (this.selectedFiche) {
      this.documentService.downloadFicheBesoinPdf(this.selectedFiche.id).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `fiche_besoin_${this.selectedFiche?.code || this.selectedFiche?.id}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error: any) => {
          console.error('Erreur lors du téléchargement du PDF:', error);
          alert('Erreur lors du téléchargement du PDF. Veuillez réessayer.');
        }
      });
    }
  }

  // Fonction pour télécharger le PDF d'une demande d'achat
  downloadDemandeAchatPdf(): void {
    if (this.selectedDemande) {
      this.documentService.downloadDemandeAchatPdf(this.selectedDemande.id).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `demande_achat_${this.selectedDemande?.code || this.selectedDemande?.id}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error: any) => {
          console.error('Erreur lors du téléchargement du PDF:', error);
          alert('Erreur lors du téléchargement du PDF. Veuillez réessayer.');
        }
      });
    }
  }

  // Fonction pour exporter la liste des demandes d'achat en PDF
  exportDemandesAchatPdf(): void {
    const ids = this.demandesAchat.map(demande => demande.id);
    this.documentService.downloadListeDemandesAchatPdf(ids, 'liste_demandes_achat.pdf').subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'liste_demandes_achat.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Erreur lors de l\'exportation des demandes d\'achat:', error);
        alert('Erreur lors de l\'exportation des demandes d\'achat. Veuillez réessayer.');
      }
    });
  }

  // Fonction pour exporter la liste des fiches de besoin en PDF
  exportFichesBesoinPdf(): void {
    const ids = this.fichesBesoin.map(fiche => fiche.id);
    this.documentService.downloadListeFichesBesoinPdf(ids, 'liste_fiches_besoin.pdf').subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'liste_fiches_besoin.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Erreur lors de l\'exportation des fiches de besoin:', error);
        alert('Erreur lors de l\'exportation des fiches de besoin. Veuillez réessayer.');
      }
    });
  }

  // Fonction pour exporter toutes les données (demandes d'achat et fiches de besoin) en PDF
  exportAllDataPdf(): void {
    // Exporter les demandes d'achat
    this.exportDemandesAchatPdf();
    
    // Exporter les fiches de besoin
    this.exportFichesBesoinPdf();
  }

  // CORRECTION : Méthode publique pour le template
  mapApiStatutToDisplay(apiStatut: string): string {
    const statutMap: { [key: string]: string } = {
      // Accept multiple API variants and normalize to a consistent display string
      'VALIDE': 'Validé',
      'APPROUVE': 'Approuvé',
      'EN_COURS': 'En attente',
      'ENCOURS': 'En attente', // in case without underscore
      'EN_ATTENTE': 'En attente',
      'EN ATTENTE': 'En attente',
      'REJETE': 'Rejeté',
      'REFUSE': 'Rejeté',
      'REFUSÉ': 'Rejeté',
      'REFUSÉE': 'Rejeté'
    };
    return statutMap[apiStatut] || apiStatut;
  }

  // getStatusBadgeClass(statut: string): string {
  //   const displayStatut = (this.mapApiStatutToDisplay(statut) || '').toLowerCase();
  //   if (displayStatut === 'validé' || displayStatut === 'approuvé') return 'status-success';
  //   if (displayStatut === 'refusé' || displayStatut === 'rejeté' || displayStatut === 'rejet') return 'status-danger';
  //   return 'status-pending';
  // }

getStatusBadgeClass(statut: string): string {
  const displayStatut = (this.mapApiStatutToDisplay(statut) || '').toLowerCase();

  switch (displayStatut) {
    case 'en attente':
      return 'status-en-attente';   // vert (#0c8f11)

    case 'validé':
      return 'status-valide';       // orange (#f59e0b)

    case 'rejeté':
      return 'status-rejete';       // rouge (#b91c1c)

    case 'approuvé':
      return 'status-approuve';     // bleu (#1d4ed8)

    default:
      return '';
  }
}


  // Méthode pour formater les nombres
  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }

  // Méthode pour obtenir le nom du fichier depuis l'URL
  getFileName(url: string | null): string {
    if (!url) return 'Aucun fichier';
    return url.split('/').pop() || 'Fichier joint';
  }

  // Méthode pour calculer le total des désignations
  getTotalDesignations(designations: Designation[]): number {
    return designations.reduce((total, designation) => total + designation.montantTotal, 0);
  }
}