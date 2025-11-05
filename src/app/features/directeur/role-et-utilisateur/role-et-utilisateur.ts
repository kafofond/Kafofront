import { Component } from '@angular/core';
import { Role } from '../../../enums/role';
import { Utilisateur } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-role-et-utilisateur',
  standalone: true, // important pour Angular 17+ standalone components
  imports: [CommonModule, FormsModule],
  templateUrl: './role-et-utilisateur.html',
  styleUrls: ['./role-et-utilisateur.css']
})
export class RoleEtUtilisateur {
  Role = Role; // pour utiliser l'enum dans le template

  utilisateurs: Utilisateur[] = [
    {
      id: 1,
      nom: 'Keita',
      prenom: 'Moussa',
      email: 'moussa@gmail.com',
      motDePasse: '********',
      role: Role.DIRECTEUR,
      departement: 'Finance',
      actif: true,
      entrepriseId: 1,
      entrepriseNom: 'Entreprise A',
      dateCreation: '2023-10-01T10:15:30'
    },
    {
      id: 2,
      nom: 'Diallo',
      prenom: 'Aminata',
      email: 'aminata@gmail.com',
      motDePasse: '********',
      role: Role.GESTIONNAIRE,
      departement: 'Achats',
      actif: false,
      entrepriseId: 1,
      entrepriseNom: 'Entreprise A',
      dateCreation: '2023-09-28T14:22:10'
    },
    {
      id: 3,
      nom: 'Traoré',
      prenom: 'Ibrahim',
      email: 'ibrahim@gmail.com',
      motDePasse: '********',
      role: Role.COMPTABLE,
      departement: 'Comptabilité',
      actif: true,
      entrepriseId: 2,
      entrepriseNom: 'Entreprise B',
      dateCreation: '2023-10-02T09:05:45'
    },
    {
      id: 4,
      nom: 'Coulibaly',
      prenom: 'Fatoumata',
      email: 'fatou@gmail.com',
      motDePasse: '********',
      role: Role.RESPONSABLE,
      departement: 'Marketing',
      actif: true,
      entrepriseId: 1,
      entrepriseNom: 'Entreprise A',
      dateCreation: '2023-10-01T16:30:20'
    },
  ];

  // Filtres sélectionnés
  selectedRole: string = 'Tous';
  selectedStatus: string = 'Tous';

  // Getter dynamique : utilisateurs filtrés
  get filteredUsers(): Utilisateur[] {
    return this.utilisateurs.filter(user => {
      const roleMatch = this.selectedRole === 'Tous' || user.role === this.selectedRole;
      const statusMatch =
        this.selectedStatus === 'Tous' ||
        (this.selectedStatus === 'Actif' && user.actif) ||
        (this.selectedStatus === 'Inactif' && !user.actif);
      return roleMatch && statusMatch;
    });
  }

  // Méthodes pour mettre à jour les filtres
  setRole(role: string) {
    this.selectedRole = role;
  }

  setStatus(status: string) {
    this.selectedStatus = status;
  }
}
