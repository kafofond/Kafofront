import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { EntrepriseService } from '../../../services/entreprise.service';
import { Utilisateur, CreateUserRequest } from '../../../models/user.model';
import { Entreprise } from '../../../models/entreprise.model';

@Component({
  selector: 'app-contentbody-utilisateur-admin-system',
  imports: [FormsModule, CommonModule],
  templateUrl: './contentbody-utilisateur-admin-system.html',
  styleUrl: './contentbody-utilisateur-admin-system.css'
})
export class ContentbodyUtilisateurAdminSystem implements OnInit {
  filtreStatut: string = 'tous';
  utilisateurs: Utilisateur[] = [];
  entreprises: Entreprise[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  // Variables pour la pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  // Variables pour les modales
  showCreateModal: boolean = false;
  newUser: CreateUserRequest = {
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    departement: '',
    role: 'USER',
    entrepriseId: 0
  };

  // Variables pour le popup de confirmation
  showConfirmModal: boolean = false;
  userToDeactivate: Utilisateur | null = null;
  confirmMessage: string = '';

  roles: string[] = [
    'SUPER_ADMIN', 'ADMIN', 'TRESORERIE', 'GESTIONNAIRE', 
    'COMPTABLE', 'RESPONSABLE', 'DIRECTEUR', 'USER'
  ];

  constructor(
    private userService: UserService,
    private entrepriseService: EntrepriseService
  ) {}

  ngOnInit() {
    this.loadUtilisateurs();
    this.loadEntreprises();
  }

  loadUtilisateurs(): void {
    this.loading = true;
    this.userService.getUtilisateurs().subscribe({
      next: (response) => {
        this.utilisateurs = response.utilisateurs;
        this.totalItems = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
        console.error('Erreur API utilisateurs:', error);
      }
    });
  }

  loadEntreprises(): void {
    this.entrepriseService.getEntreprises().subscribe({
      next: (response) => {
        this.entreprises = response.entreprises;
      },
      error: (error) => {
        console.error('Erreur chargement entreprises:', error);
      }
    });
  }

  get utilisateursFiltres() {
    let filtered = this.utilisateurs;
    
    // Filtrage par statut
    if (this.filtreStatut === 'actifs') {
      filtered = filtered.filter(u => u.actif === true);
    } else if (this.filtreStatut === 'bloques') {
      filtered = filtered.filter(u => u.actif === false);
    }

    // Pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    let filtered = this.utilisateurs;
    if (this.filtreStatut === 'actifs') {
      filtered = filtered.filter(u => u.actif === true);
    } else if (this.filtreStatut === 'bloques') {
      filtered = filtered.filter(u => u.actif === false);
    }
    return Math.ceil(filtered.length / this.pageSize);
  }

  get paginationInfo(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.utilisateurs.length);
    return `${start}-${end} sur ${this.utilisateurs.length}`;
  }

  // Méthodes de pagination
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  // Méthodes pour les modales
  ajouterUtilisateur(): void {
    this.newUser = {
      nom: '',
      prenom: '',
      email: '',
      motDePasse: '',
      departement: '',
      role: 'USER',
      entrepriseId: 0
    };
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  creerUtilisateur(): void {
    if (!this.isFormValid()) {
      //alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.userService.createUtilisateur(this.newUser).subscribe({
      next: (response) => {
        //alert('Utilisateur créé avec succès!');
        this.closeCreateModal();
        this.loadUtilisateurs();
      },
      error: (error) => {
        //alert(`Erreur lors de la création: ${error.message}`);
      }
    });
  }

  private isFormValid(): boolean {
    return !!this.newUser.nom?.trim() && 
           !!this.newUser.prenom?.trim() && 
           !!this.newUser.email?.trim() && 
           !!this.newUser.motDePasse?.trim() && 
           !!this.newUser.departement?.trim() && 
           this.newUser.entrepriseId > 0;
  }

  // Méthodes pour activer/désactiver
  activerUtilisateur(utilisateur: Utilisateur): void {
    if (utilisateur.actif) {
      //alert('Cet utilisateur est déjà actif');
      return;
    }

    this.userService.reactiverUtilisateur(utilisateur.id).subscribe({
      next: () => {
        utilisateur.actif = true;
        //alert(`${utilisateur.prenom} ${utilisateur.nom} a été activé avec succès`);
        this.loadUtilisateurs();
      },
      error: (error) => {
        //alert(`Erreur lors de l'activation: ${error.message}`);
      }
    });
  }

  bloquerUtilisateur(utilisateur: Utilisateur): void {
    if (!utilisateur.actif) {
      //alert('Cet utilisateur est déjà bloqué');
      return;
    }

    this.openConfirmModal(utilisateur);
  }

  // Méthodes pour le popup de confirmation
  openConfirmModal(utilisateur: Utilisateur): void {
    this.userToDeactivate = utilisateur;
    this.confirmMessage = `Êtes-vous sûr de vouloir bloquer ${utilisateur.prenom} ${utilisateur.nom} ?`;
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.userToDeactivate = null;
    this.confirmMessage = '';
  }

  confirmDeactivation(): void {
    if (!this.userToDeactivate) return;

    this.userService.desactiverUtilisateur(this.userToDeactivate.id).subscribe({
      next: () => {
        this.userToDeactivate!.actif = false;
        //alert(`${this.userToDeactivate!.prenom} ${this.userToDeactivate!.nom} a été bloqué avec succès`);
        this.closeConfirmModal();
        this.loadUtilisateurs();
      },
      error: (error) => {
        //alert(`Erreur lors du blocage: ${error.message}`);
        this.closeConfirmModal();
      }
    });
  }

  exporter(): void {
    const dataToExport = {
      exportDate: new Date().toISOString(),
      total: this.utilisateurs.length,
      utilisateurs: this.utilisateurs
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `utilisateurs-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    alert(`Export réussi ! ${this.utilisateurs.length} utilisateurs exportés.`);
  }

  // Méthode utilitaire pour obtenir le nom de l'entreprise
  getEntrepriseNom(entrepriseId: number): string {
    const entreprise = this.entreprises.find(e => e.id === entrepriseId);
    return entreprise ? entreprise.nom : 'Non assigné';
  }
}