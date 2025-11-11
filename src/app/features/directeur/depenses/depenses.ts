import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

// Services
import { DemandeAchatService, DemandeAchat } from '../../../services/demande-achat.service';
import { FicheBesoinService, FicheBesoin, Designation } from '../../../services/fiche-besoin.service';

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
    private ficheBesoinService: FicheBesoinService
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