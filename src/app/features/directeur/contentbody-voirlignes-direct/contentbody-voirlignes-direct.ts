import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from "@angular/router"; // ✅ AJOUT Router
import { Subscription } from 'rxjs';
import { LigneBudget, mapApiLigneToLigneBudget } from '../../../models/ligne-budget.model';
import { LigneCreditService, CreateLigneRequest, UpdateLigneRequest } from '../../../services/ligne-credit.service';

@Component({
  selector: 'app-contentbody-voirlignes-direct',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contentbody-voirlignes-direct.html',
  styleUrls: ['./contentbody-voirlignes-direct.css']
})
export class ContentbodyVoirlignesDirect implements OnInit, OnDestroy {

  // États des modales
  showCreateLigneModal: boolean = false;
  showDetailLigneModal: boolean = false;
  showEditLigneModal: boolean = false;
  
  // Données
  lignes: LigneBudget[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  budgetId: number = 0;
  
  // Ligne sélectionnée
  selectedLigne: LigneBudget | null = null;
  
  // Formulaires
  newLigneCredit: Partial<LigneBudget> = {
    intituleLigne: '',
    description: '',
    commentaire: '',
    statut: 'En attente',
    etat: true,
    montantAlloue: undefined,
    budgetId: 0
  };

  editLigneData: any = {};

  private lignesSubscription?: Subscription;
  private routeSubscription?: Subscription;

  constructor(
    private ligneCreditService: LigneCreditService,
    private route: ActivatedRoute,
    private router: Router // ✅ AJOUT Router
  ) { }

  ngOnInit(): void {
    console.log('🔍 Initialisation du composant lignes...');
    
    // ✅ CORRECTION : Récupération depuis les paramètres d'URL avec gestion d'erreur
    this.routeSubscription = this.route.params.subscribe(params => {
      console.log('📋 Paramètres de route reçus:', params);
      
      this.budgetId = +params['budgetId'];
      console.log('🔢 Budget ID converti:', this.budgetId);
      
      if (this.budgetId && !isNaN(this.budgetId)) {
        console.log('✅ Budget ID valide, chargement des lignes...');
        this.loadLignes();
      } else {
        console.error('❌ Budget ID invalide:', this.budgetId);
        this.handleRoutingError();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.lignesSubscription) {
      this.lignesSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadLignes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log(`🔎 Chargement API des lignes pour le budget ${this.budgetId}...`);

    this.lignesSubscription = this.ligneCreditService.getLignesByBudget(this.budgetId).subscribe({
      next: (response) => {
        console.log('✅ Lignes chargées pour le budget:', this.budgetId, response);
        this.lignes = response.lignes.map(apiLigne => 
          mapApiLigneToLigneBudget(apiLigne)
        );
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur chargement lignes de crédit:', error);
        this.errorMessage = 'Erreur lors du chargement des lignes de crédit';
        this.isLoading = false;
      }
    });
  }

  // ✅ NOUVELLE MÉTHODE : Gestion des erreurs de routing
  private handleRoutingError(): void {
    this.errorMessage = 'Erreur de navigation: Budget introuvable';
    this.isLoading = false;
    
    console.error('Détails de l\'erreur de routing:');
    console.error('- URL actuelle:', window.location.href);
    console.error('- Paramètres route:', this.route.snapshot.params);
    
    // Redirection après 3 secondes
    setTimeout(() => {
      this.router.navigate(['/directeur/listbudget-directeur']);
    }, 3000);
  }

  // MODALE DE CRÉATION
  openCreateLigneModal(): void {
    this.newLigneCredit = {
      intituleLigne: '',
      description: '',
      commentaire: '',
      statut: 'En attente',
      etat: true,
      montantAlloue: undefined,
      budgetId: this.budgetId
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
    this.showDetailLigneModal = true;
    document.body.classList.add('modal-open');
  }

  closeDetailLigneModal(): void {
    this.selectedLigne = null;
    this.showDetailLigneModal = false;
    document.body.classList.remove('modal-open');
  }

  // MODALE DE MODIFICATION
  openEditLigneModal(ligne: LigneBudget): void {
    this.selectedLigne = ligne;
    this.editLigneData = {
      intituleLigne: ligne.intituleLigne,
      description: ligne.description,
      montantAlloue: ligne.montantAlloue,
      statut: ligne.statut,
      etat: ligne.etat,
      commentaire: ligne.commentaire
    };
    this.showEditLigneModal = true;
    document.body.classList.add('modal-open');
  }

  closeEditLigneModal(): void {
    this.selectedLigne = null;
    this.showEditLigneModal = false;
    this.editLigneData = {};
    document.body.classList.remove('modal-open');
  }

  submitEditLigne(): void {
    if (!this.selectedLigne) return;

    const updateData: UpdateLigneRequest = {
      intituleLigne: this.editLigneData.intituleLigne,
      description: this.editLigneData.description,
      montantAllouer: this.editLigneData.montantAlloue,
      statut: this.mapDisplayStatutToApi(this.editLigneData.statut),
      actif: this.editLigneData.etat
    };

    console.log('📤 Mise à jour ligne de crédit:', updateData);

    this.ligneCreditService.updateLigne(this.selectedLigne.id, updateData).subscribe({
      next: (response) => {
        console.log('✅ Ligne de crédit mise à jour:', response);
        this.loadLignes();
        this.closeEditLigneModal();
        alert('Ligne de crédit modifiée avec succès!');
      },
      error: (error) => {
        console.error('❌ Erreur mise à jour ligne de crédit:', error);
        alert('Erreur lors de la modification de la ligne de crédit');
      }
    });
  }

  // MÉTHODES UTILITAIRES
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

  // Méthode pour formater les nombres
  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }
}