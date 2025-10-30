import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Role } from '../../../enums/role';

@Component({
  selector: 'app-contentbody-utilisateur-dsi',
  imports: [CommonModule, FormsModule],
  templateUrl: './contentbody-utilisateur-dsi.html',
  styleUrl: './contentbody-utilisateur-dsi.css'
})
export class ContentbodyUtilisateurDsi {
  filtreStatut: string = 'tous';
  
    utilisateurs = [
      {
        nomUtilisateur: 'Bah',
        prenomUtilisateur: 'Ibrahim',
        email: 'ibrahim.bah@example.com',
        motDePasse: '********',
        role: Role.ADMIN,
        etat: true
      },
      {
        nomUtilisateur: 'Traoré',
        prenomUtilisateur: 'Aminata',
        email: 'aminata.traore@example.com',
        motDePasse: '********',
        role: Role.COMPTABLE,
        etat: false
      },
      {
        nomUtilisateur: 'Keita',
        prenomUtilisateur: 'Moussa',
        email: 'moussa.keita@example.com',
        motDePasse: '********',
        role: Role.GESTIONNAIRE,
        etat: true
      },
      {
        nomUtilisateur: 'Diallo',
        prenomUtilisateur: 'Fatou',
        email: 'fatou.diallo@example.com',
        motDePasse: '********',
        role: Role.RESPONSABLE,
        etat: false
      }
    ];
  
    // Appliquer le filtrage selon le statut
    get utilisateursFiltres() {
      if (this.filtreStatut === 'actifs') {
        return this.utilisateurs.filter(u => u.etat);
      } else if (this.filtreStatut === 'bloques') {
        return this.utilisateurs.filter(u => !u.etat);
      }
      return this.utilisateurs;
    }
  
    exporter() {
      alert('Exportation des utilisateurs...');
    }
  
    ajouterUtilisateur() {
      alert('Ajout d’un nouvel utilisateur...');
    }
  
    activerUtilisateur(u: any) {
      u.etat = true;
    }
  
    bloquerUtilisateur(u: any) {
      u.etat = false;
    }
}
