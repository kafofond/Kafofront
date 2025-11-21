import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { LigneBudget, mapApiLigneToLigneBudget } from '../../../models/ligne-budget.model';
import { 
  LigneCreditService, 
  CreateLigneRequest, 
  UpdateLigneRequest,
  LigneCredit,
  Commentaire 
} from '../../../services/ligne-credit.service';
import { BudgetService } from '../../../services/budget.service'; // Import du service Budget

@Component({
  selector: 'app-contentbody-voirlignes-respo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contentbody-voirlignes-respo.html',
  styleUrls: ['./contentbody-voirlignes-respo.css']
})
export class ContentbodyVoirlignesRespo implements OnInit, OnDestroy {

  // États des modales
  showCreateLigneModal: boolean = false;
  showDetailLigneModal: boolean = false;
  showEditLigneModal: boolean = false;
  showRejetLigneModal: boolean = false;
  showDesactivationLigneModal: boolean = false;
  
  // Données
  allLignes: LigneBudget[] = []; // Ajout pour le filtrage
  lignes: LigneBudget[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  budgetId: number = 0;
  budgetCode: string = ''; // Ajout de la propriété pour le code du budget
  
  // Propriétés pour le filtre
  showFilterDropdown: boolean = false;
  activeFilter: string = 'Tous';
  
  // Ligne sélectionnée
  selectedLigne: LigneBudget | null = null;
  selectedLigneCredit: LigneCredit | null = null;
  
  // Formulaires
  newLigneCredit: any = {
    intituleLigne: '',
    description: '',
    commentaire: '',
    statut: 'En cours',
    etat: true,
    montantAlloue: undefined,
    budgetId: 0,
    dateDebut: '',
    dateFin: ''
  };

  editLigneData: any = {};
  rejetCommentaire: string = '';
  desactivationCommentaire: string = '';

  private lignesSubscription?: Subscription;
  private routeSubscription?: Subscription;

  constructor(
    private ligneCreditService: LigneCreditService,
    private budgetService: BudgetService, // Injection du service Budget
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('🔍 Initialisation du composant lignes...');
    
    this.routeSubscription = this.route.params.subscribe(params => {
      console.log('📋 Paramètres de route reçus:', params);
      
      this.budgetId = +params['budgetId'];
      console.log('🔢 Budget ID converti:', this.budgetId);
      
      if (this.budgetId && !isNaN(this.budgetId)) {
        console.log('✅ Budget ID valide, chargement des informations du budget...');
        this.loadBudgetInfo(); // Chargement des informations du budget en premier
        // On charge les lignes après avoir obtenu le code du budget
      } else {
        console.error('❌ Budget ID invalide:', this.budgetId);
        this.handleRoutingError();
      }
    });
    
    // Ajout de l'écouteur d'événements pour fermer le dropdown quand on clique à l'extérieur
    document.addEventListener('click', this.onClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    if (this.lignesSubscription) {
      this.lignesSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    // Suppression de l'écouteur d'événements
    document.removeEventListener('click', this.onClickOutside.bind(this));
  }

  // Méthode pour charger les informations du budget
  loadBudgetInfo(): void {
    this.budgetService.getBudgetById(this.budgetId).subscribe({
      next: (budget) => {
        console.log('✅ Informations du budget chargées:', budget);
        this.budgetCode = budget.code || `Budget #${this.budgetId}`;
        this.loadLignes(); // On charge les lignes après avoir obtenu le code du budget
      },
      error: (error) => {
        console.error('❌ Erreur chargement informations budget:', error);
        this.budgetCode = `Budget #${this.budgetId}`;
        this.loadLignes(); // On charge quand même les lignes même si on ne peut pas récupérer le code
      }
    });
  }

  loadLignes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log(`🔎 Chargement API des lignes pour le budget ${this.budgetId}...`);

    this.lignesSubscription = this.ligneCreditService.getLignesByBudget(this.budgetId).subscribe({
      next: (response) => {
        console.log('✅ Lignes chargées pour le budget:', this.budgetId, response);
        this.allLignes = response.lignes.map(apiLigne => 
          mapApiLigneToLigneBudget(apiLigne)
        );
        this.lignes = [...this.allLignes]; // Initialiser avec toutes les lignes
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur chargement lignes de crédit:', error);
        this.errorMessage = 'Erreur lors du chargement des lignes de crédit';
        this.isLoading = false;
      }
    });
  }

  // MÉTHODES DE FILTRAGE
  toggleFilterDropdown(event: Event): void {
    event.stopPropagation();
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  applyFilter(filterType: string): void {
    this.activeFilter = filterType;
    this.showFilterDropdown = false;
    
    if (filterType === 'Tous') {
      this.lignes = [...this.allLignes];
    } else {
      this.lignes = this.allLignes.filter(ligne => 
        ligne.statut === filterType
      );
    }
  }

  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-dropdown-container') && this.showFilterDropdown) {
      this.showFilterDropdown = false;
    }
  }

  // MÉTHODES POUR LES ACTIONS AUTOMATIQUES
  onStatutChange(event: Event): void {
    const newValue = (event.target as HTMLSelectElement).value;

    if (!this.selectedLigne) return;

    if (newValue === 'Validé') {
      this.validerLigne();
    }
    else if (newValue === 'Refusé') {
      this.openRejetLigneModal();
    }
  }

  onEtatToggle(event: Event): void {
    const isActive = (event.target as HTMLInputElement).checked;

    if (!this.selectedLigne) return;

    if (isActive) {
      this.activerLigne();
    } else {
      this.openDesactivationLigneModal();
    }
  }

  activerLigne(): void {
    if (!this.selectedLigne) return;

    this.ligneCreditService.activerLigne(this.selectedLigne.id).subscribe({
      next: (response) => {
        console.log('✅ Ligne activée:', response);
        this.loadLignes();
        this.closeEditLigneModal();
      },
      error: (error) => {
        console.error('❌ Erreur activation ligne:', error);
        alert('Erreur lors de l\'activation de la ligne');
        this.editLigneData.etat = false;
      }
    });
  }

  confirmDesactiverLigne(): void {
    if (!this.selectedLigne) return;

    this.ligneCreditService.desactiverLigne(this.selectedLigne.id).subscribe({
      next: (response) => {
        console.log('✅ Ligne désactivée:', response);
        this.loadLignes();
        this.closeDesactivationLigneModal();
        this.closeEditLigneModal();
      },
      error: (error) => {
        console.error('❌ Erreur désactivation ligne:', error);
        alert('Erreur lors de la désactivation de la ligne');
        this.editLigneData.etat = true;
      }
    });
  }

  validerLigne(): void {
    if (!this.selectedLigne) return;

    this.ligneCreditService.validerLigne(this.selectedLigne.id).subscribe({
      next: (response) => {
        console.log('✅ Ligne validée:', response);
        this.loadLignes();
        this.closeEditLigneModal();
      },
      error: (error) => {
        console.error('❌ Erreur validation ligne:', error);
        alert('Erreur lors de la validation de la ligne');
        this.editLigneData.statut = this.selectedLigne?.statut;
      }
    });
  }

  openRejetLigneModal(): void {
    this.showRejetLigneModal = true;
    this.rejetCommentaire = '';
  }

  closeRejetLigneModal(): void {
    this.showRejetLigneModal = false;
    this.rejetCommentaire = '';
    if (this.selectedLigne) {
      this.editLigneData.statut = this.selectedLigne.statut;
    }
  }

  openDesactivationLigneModal(): void {
    this.showDesactivationLigneModal = true;
    this.desactivationCommentaire = '';
  }

  closeDesactivationLigneModal(): void {
    this.showDesactivationLigneModal = false;
    this.desactivationCommentaire = '';
    if (this.selectedLigne) {
      this.editLigneData.etat = true;
    }
  }

  rejeterLigne(): void {
    if (!this.selectedLigne || !this.rejetCommentaire.trim()) {
      alert('Veuillez saisir un commentaire pour le rejet');
      return;
    }

    this.ligneCreditService.rejeterLigne(this.selectedLigne.id, this.rejetCommentaire).subscribe({
      next: (response) => {
        console.log('✅ Ligne rejetée:', response);
        this.loadLignes();
        this.closeRejetLigneModal();
        this.closeEditLigneModal();
      },
      error: (error) => {
        console.error('❌ Erreur rejet ligne:', error);
        alert('Erreur lors du rejet de la ligne');
        this.editLigneData.statut = this.selectedLigne?.statut;
      }
    });
  }

  private handleRoutingError(): void {
    this.errorMessage = 'Erreur de navigation: Budget introuvable';
    this.isLoading = false;
    
    console.error('Détails de l\'erreur de routing:');
    console.error('- URL actuelle:', window.location.href);
    console.error('- Paramètres route:', this.route.snapshot.params);
    
    setTimeout(() => {
      this.router.navigate(['/responsable/listbudget-responsable']);
    }, 3000);
  }

  // MODALE DE CRÉATION
  openCreateLigneModal(): void {
    this.newLigneCredit = {
      intituleLigne: '',
      description: '',
      commentaire: '',
      statut: 'En cours',
      etat: true,
      montantAlloue: undefined,
      budgetId: this.budgetId,
      dateDebut: '',
      dateFin: ''
    };
    this.showCreateLigneModal = true;
    document.body.classList.add('modal-open');
  }

  closeCreateLigneModal(): void {
    this.showCreateLigneModal = false;
    document.body.classList.remove('modal-open');
  }

  submitNewLigneCredit(): void {
    if (!this.newLigneCredit.intituleLigne || !this.newLigneCredit.montantAlloue) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const createData: CreateLigneRequest = {
      intituleLigne: this.newLigneCredit.intituleLigne!,
      description: this.newLigneCredit.description || '',
      montantAllouer: this.newLigneCredit.montantAlloue!,
      budgetId: this.budgetId,
      commentaire: this.newLigneCredit.commentaire
    };

    console.log('📤 Création ligne de crédit:', createData);

    this.ligneCreditService.createLigne(createData).subscribe({
      next: (response) => {
        console.log('✅ Ligne de crédit créée:', response);
        this.loadLignes();
        this.closeCreateLigneModal();
        alert('Ligne de crédit créée avec succès!');
      },
      error: (error) => {
        console.error('❌ Erreur création ligne de crédit:', error);
        alert('Erreur lors de la création de la ligne de crédit');
      }
    });
  }

  // MODALE DE DÉTAIL
  openDetailLigneModal(ligne: LigneBudget): void {
    this.selectedLigne = ligne;
    
    // Charger les détails complets de la ligne
    this.ligneCreditService.getLigneById(ligne.id).subscribe({
      next: (ligneCredit) => {
        this.selectedLigneCredit = ligneCredit;
        this.showDetailLigneModal = true;
        document.body.classList.add('modal-open');
      },
      error: (error) => {
        console.error('❌ Erreur chargement détails ligne:', error);
        this.showDetailLigneModal = true;
        document.body.classList.add('modal-open');
      }
    });
  }

  closeDetailLigneModal(): void {
    this.selectedLigne = null;
    this.selectedLigneCredit = null;
    this.showDetailLigneModal = false;
    document.body.classList.remove('modal-open');
  }

  // MODALE DE MODIFICATION
  openEditLigneModal(ligne: LigneBudget): void {
    this.selectedLigne = ligne;
    
    // Charger les données complètes de la ligne pour l'édition
    this.ligneCreditService.getLigneById(ligne.id).subscribe({
      next: (ligneCredit) => {
        this.selectedLigneCredit = ligneCredit;
        
        this.editLigneData = {
          intituleLigne: ligneCredit.intituleLigne,
          description: ligneCredit.description,
          montantAlloue: ligneCredit.montantAllouer,
          statut: this.ligneCreditService.mapStatutToDisplay(ligneCredit.statut),
          etat: ligneCredit.actif,
          dateDebut: this.formatDateForInput(ligneCredit.dateDebut),
          dateFin: this.formatDateForInput(ligneCredit.dateFin)
        };

        this.showEditLigneModal = true;
        document.body.classList.add('modal-open');
      },
      error: (error) => {
        console.error('❌ Erreur chargement données édition:', error);
        // Fallback aux données basiques
        this.editLigneData = {
          intituleLigne: ligne.intituleLigne,
          description: ligne.description,
          montantAlloue: ligne.montantAlloue,
          statut: ligne.statut,
          etat: ligne.etat,
          dateDebut: this.formatDateForInput(ligne.dateDebut.toString()),
          dateFin: this.formatDateForInput(ligne.dateFin.toString())

        };
        this.showEditLigneModal = true;
        document.body.classList.add('modal-open');
      }
    });
  }

  closeEditLigneModal(): void {
    this.selectedLigne = null;
    this.selectedLigneCredit = null;
    this.showEditLigneModal = false;
    this.editLigneData = {};
    document.body.classList.remove('modal-open');
  }

  submitEditLigne(): void {
    if (!this.selectedLigne || !this.selectedLigneCredit) return;

    // ✅ STRUCTURE EXACTE CONFORME À L'API
    const updateData: UpdateLigneRequest = {
      code: this.selectedLigneCredit.code,
      intituleLigne: this.editLigneData.intituleLigne,
      description: this.editLigneData.description,
      montantAllouer: Number(this.editLigneData.montantAlloue),
      montantEngager: this.selectedLigneCredit.montantEngager,
      montantRestant: this.selectedLigneCredit.montantRestant,
      dateCreation: this.selectedLigneCredit.dateCreation,
      dateModification: new Date().toISOString().split('.')[0], // Format exact de l'API
      dateDebut: this.editLigneData.dateDebut || null,
      dateFin: this.editLigneData.dateFin || null,
      statut: this.mapDisplayStatutToApi(this.editLigneData.statut),
      actif: Boolean(this.editLigneData.etat),
      budgetId: this.selectedLigneCredit.budgetId,
      createurNom: this.selectedLigneCredit.createurNom,
      createurEmail: this.selectedLigneCredit.createurEmail,
      entrepriseNom: this.selectedLigneCredit.entrepriseNom,
      commentaires: this.selectedLigneCredit.commentaires
    };

    console.log('📤 Mise à jour ligne de crédit (structure API):', updateData);

    this.ligneCreditService.updateLigne(this.selectedLigne.id, updateData).subscribe({
      next: (response) => {
        console.log('✅ Ligne de crédit mise à jour:', response);
        this.loadLignes();
        this.closeEditLigneModal();
        alert('Ligne de crédit modifiée avec succès!');
      },
      error: (error) => {
        console.error('❌ Erreur mise à jour ligne de crédit:', error);
        console.error('Détails erreur:', error.error);
        alert('Erreur lors de la modification: ' + (error.error?.message || error.message));
      }
    });
  }

  // MÉTHODES UTILITAIRES
  private formatDateForInput(date: string | null): string {
    if (!date) return '';
    return date.split('T')[0]; // Convertir "2025-10-22T00:00:00" en "2025-10-22"
  }

  private mapDisplayStatutToApi(displayStatut: string): string {
    const reverseMap: { [key: string]: string } = {
      'Validé': 'VALIDE',
      'En cours': 'EN_COURS',
      'Refusé': 'REFUSE'
    };
    return reverseMap[displayStatut] || 'EN_COURS';
  }

  getStatusBadgeClass(statut: string): string {
    const classMap: { [key: string]: string } = {
      'Validé': 'status-badge active',
      'En cours': 'status-badge warning',
      'Refusé': 'status-badge rejected'
    };
    return classMap[statut] || 'status-badge draft';
  }

  getEtatBadgeClass(etat: boolean): string {
    return etat ? 'status-badge active' : 'status-badge rejected';
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }

  // Méthode pour afficher les commentaires
  getCommentaires(): Commentaire[] {
    return this.selectedLigneCredit?.commentaires || [];
  }
}