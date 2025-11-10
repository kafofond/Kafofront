import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { Utilisateur, CreateUserRequest } from '../../../models/user.model';
import { Role } from '../../../enums/role';

@Component({
  selector: 'app-contentbody-utilisateur-dsi',
  imports: [FormsModule, CommonModule],
  templateUrl: './role-et-utilisateur.html',
  styleUrl: './role-et-utilisateur.css'
})
export class RoleEtUtilisateur implements OnInit {
  filtreStatut: string = 'tous';
  utilisateurs: Utilisateur[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  // Variables pour la pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  // Variables pour les modales
  showCreateModal: boolean = false;
  showEditModal: boolean = false;
  newUser: CreateUserRequest = {
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    departement: '',
    role: '' as Role,
    entrepriseId: 0
  };
  editUser: Utilisateur | null = null;
  confirmPassword: string = '';

  // Variables pour le popup de confirmation
  showConfirmModal: boolean = false;
  userToDeactivate: Utilisateur | null = null;
  confirmMessage: string = '';

  // Rôles avec mapping français -> anglais
  roles = [
    { value: Role.ADMIN, label: 'Administrateur', backendValue: 'ADMIN' },
    { value: Role.COMPTABLE, label: 'Comptable', backendValue: 'COMPTABLE' },
    { value: Role.GESTIONNAIRE, label: 'Gestionnaire', backendValue: 'GESTIONNAIRE' },
    { value: Role.RESPONSABLE, label: 'Responsable', backendValue: 'RESPONSABLE' },
    { value: Role.DIRECTEUR, label: 'Directeur', backendValue: 'DIRECTEUR' },
    { value: Role.TRESORERIE, label: 'Trésorier', backendValue: 'TRESORERIE' }
    
  ];

  constructor(
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadUtilisateurs();
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

  get utilisateursFiltres() {
    let filtered = this.utilisateurs;
    
    if (this.filtreStatut === 'actifs') {
      filtered = filtered.filter(u => u.actif === true);
    } else if (this.filtreStatut === 'bloques') {
      filtered = filtered.filter(u => u.actif === false);
    }

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

  ajouterUtilisateur(): void {
    this.newUser = {
      nom: '',
      prenom: '',
      email: '',
      motDePasse: '',
      departement: '',
      role: '' as Role,
      entrepriseId: 0
    };
    this.confirmPassword = '';
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  creerUtilisateur(): void {
    if (!this.isFormValid()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.newUser.motDePasse !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    // Préparer les données pour le backend avec le rôle en majuscules
    const userToCreate = {
      ...this.newUser,
      role: this.getBackendRoleValue(this.newUser.role)
    };

    console.log('Données envoyées au backend:', userToCreate);

    this.userService.createUtilisateur(userToCreate).subscribe({
      next: (response) => {
        alert('Utilisateur créé avec succès');
        this.closeCreateModal();
        this.loadUtilisateurs();
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        alert('Erreur lors de la création de l\'utilisateur: ' + (error.error?.message || error.message));
      }
    });
  }

  modifierUtilisateur(utilisateur: Utilisateur): void {
    this.editUser = { ...utilisateur };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editUser = null;
  }

  updateUtilisateur(): void {
    if (!this.editUser) return;

    if (!this.editUser.nom?.trim() || !this.editUser.prenom?.trim() || 
        !this.editUser.email?.trim() || !this.editUser.departement?.trim() || 
        !this.editUser.role) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Préparer les données pour le backend avec le rôle en majuscules
    const userToUpdate = {
      ...this.editUser,
      role: this.getBackendRoleValue(this.editUser.role)
    };

    console.log('Données de modification envoyées:', userToUpdate);

    this.userService.updateUtilisateur(this.editUser.id, userToUpdate).subscribe({
      next: (response) => {
        alert('Utilisateur modifié avec succès');
        this.closeEditModal();
        this.loadUtilisateurs();
      },
      error: (error) => {
        console.error('Erreur lors de la modification:', error);
        alert('Erreur lors de la modification de l\'utilisateur: ' + (error.error?.message || error.message));
      }
    });
  }

  private isFormValid(): boolean {
    return !!this.newUser.nom?.trim() && 
           !!this.newUser.prenom?.trim() && 
           !!this.newUser.email?.trim() && 
           !!this.newUser.motDePasse?.trim() && 
           !!this.newUser.departement?.trim() && 
           !!this.newUser.role;
  }

  // Méthode pour obtenir la valeur backend du rôle
  private getBackendRoleValue(role: Role | string): string {
    const roleMapping: Record<string, string> = {
      [Role.ADMIN]: 'ADMIN',
      [Role.COMPTABLE]: 'COMPTABLE',
      [Role.GESTIONNAIRE]: 'GESTIONNAIRE',
      [Role.RESPONSABLE]: 'RESPONSABLE',
      [Role.DIRECTEUR]: 'DIRECTEUR',
      [Role.TRESORERIE]: 'TRESORERIE'
    };
    return roleMapping[role] || role;
  }

  toggleUtilisateurStatut(utilisateur: Utilisateur): void {
    if (utilisateur.actif) {
      this.openConfirmModal(utilisateur);
    } else {
      this.userService.reactiverUtilisateur(utilisateur.id).subscribe({
        next: () => {
          utilisateur.actif = true;
          this.loadUtilisateurs();
        },
        error: (error) => {
          console.error('Erreur lors de l\'activation:', error);
          alert('Erreur lors de l\'activation: ' + (error.error?.message || error.message));
        }
      });
    }
  }

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
        this.closeConfirmModal();
        this.loadUtilisateurs();
      },
      error: (error) => {
        console.error('Erreur lors du blocage:', error);
        alert('Erreur lors du blocage: ' + (error.error?.message || error.message));
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
  }

  getRoleLabel(role: Role | string): string {
    const roleMapping: Record<string, string> = {
      [Role.ADMIN]: 'administrateur',
      [Role.COMPTABLE]: 'comptable',
      [Role.GESTIONNAIRE]: 'gestionnaire',
      [Role.RESPONSABLE]: 'responsable',
      [Role.DIRECTEUR]: 'directeur',
      [Role.TRESORERIE]: 'trésorier'
    };
    return roleMapping[role] || role.toLowerCase();
  }

  getRoleBadgeClass(role: Role | string): string {
    const roleClasses: Record<string, string> = {
      [Role.ADMIN]: 'role-admin',
      [Role.COMPTABLE]: 'role-comptable',
      [Role.GESTIONNAIRE]: 'role-gestionnaire',
      [Role.RESPONSABLE]: 'role-responsable',
      [Role.DIRECTEUR]: 'role-directeur',
      [Role.TRESORERIE]: 'role-tresorerie'
    };
    return roleClasses[role] || 'role-default';
  }
}