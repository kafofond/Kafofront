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
  
  // Modales
  showDetailDemandeModal: boolean = false;
  showDetailFicheModal: boolean = false;
  selectedDemande: DemandeAchat | null = null;
  selectedFiche: FicheBesoin | null = null;
  
  // Filtres
  get filteredDemandes(): DemandeAchat[] {
    const filtered = this.selectedStatus === 'Tous'
      ? this.demandesAchat
      : this.demandesAchat.filter(d => this.mapApiStatutToDisplay(d.statut) === this.selectedStatus);
    
    return filtered.slice(0, 5); // max 5 lignes
  }

  get filteredFiches(): FicheBesoin[] {
    const filtered = this.selectedStatus === 'Tous'
      ? this.fichesBesoin
      : this.fichesBesoin.filter(f => this.mapApiStatutToDisplay(f.statut) === this.selectedStatus);
    
    return filtered.slice(0, 5); // max 5 lignes
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
      'VALIDE': 'Validé',
      'EN_COURS': 'En attente',
      'APPROUVE': 'Validé',
      'REJETE': 'Rejeté'
    };
    return statutMap[apiStatut] || apiStatut;
  }

  getStatusBadgeClass(statut: string): string {
    const displayStatut = this.mapApiStatutToDisplay(statut);
    return displayStatut === 'Validé' ? 'status-success' : 
           displayStatut === 'Rejeté' ? 'status-danger' : 'status-warning';
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