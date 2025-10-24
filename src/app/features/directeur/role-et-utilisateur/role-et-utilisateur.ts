import { Component } from '@angular/core';
import { Role } from '../../../enums/role';
import { Utilisateur } from '../../../models/utilisateur';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-role-et-utilisateur',
  imports: [CommonModule, FormsModule],
  templateUrl: './role-et-utilisateur.html',
  styleUrl: './role-et-utilisateur.css'
})
export class RoleEtUtilisateur {
  Role = Role; // pour pouvoir utiliser l’enum dans le template

  utilisateurs: Utilisateur[] = [
    {
      nomUtilisateur: 'Keita',
      prenomUtilisateur: 'Moussa',
      email: 'moussa@gmail.com',
      motDePasse: '********',
      role: Role.DIRECTEUR,
      etat: true,
      derniereActivite: '2023-10-01T10:15:30',
    },
    {
      nomUtilisateur: 'Diallo',
      prenomUtilisateur: 'Aminata',
      email: 'aminata@gmail.com',
      motDePasse: '********',
      role: Role.GESTIONNAIRE,
      etat: false,
      derniereActivite: '2023-09-28T14:22:10',
    },
    {
      nomUtilisateur: 'Traoré',
      prenomUtilisateur: 'Ibrahim',
      email: 'ibrahim@gmail.com',
      motDePasse: '********',
      role: Role.COMPTABLE,
      etat: true,
      derniereActivite: '2023-10-02T09:05:45',
    },
    {
      nomUtilisateur: 'Coulibaly',
      prenomUtilisateur: 'Fatoumata',
      email: 'fatou@gmail.com',
      motDePasse: '********',
      role: Role.RESPONSABLE,
      etat: true,
      derniereActivite: '2023-10-01T16:30:20',
    },
    // Ajoutez plus d'utilisateurs si nécessaire
  ];

  // Filtres sélectionnés
  selectedRole: string = 'Tous';
  selectedStatus: string = 'Tous';

  //  Getter dynamique : utilisateurs filtrés
  get filteredUsers(): Utilisateur[] {
    return this.utilisateurs.filter((user) => {
      const roleMatch =
        this.selectedRole === 'Tous' || user.role === this.selectedRole;
      const statusMatch =
        this.selectedStatus === 'Tous' ||
        (this.selectedStatus === 'Actif' && user.etat) ||
        (this.selectedStatus === 'Inactif' && !user.etat);
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
