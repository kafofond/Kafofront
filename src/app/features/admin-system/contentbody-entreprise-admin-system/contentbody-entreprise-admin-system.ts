import { Component } from '@angular/core';
import { Entreprise } from '../../../models/entreprise';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contentbody-entreprise-admin-system',
  imports: [FormsModule, CommonModule],
  templateUrl: './contentbody-entreprise-admin-system.html',
  styleUrl: './contentbody-entreprise-admin-system.css'
})
export class ContentbodyEntrepriseAdminSystem {
  filtreStatut: string = 'tous'; // Valeurs possibles : 'tous', 'actif', 'inactif'

  entreprises: Entreprise[] = [
    {
      nom: 'KafoFond SARL',
      adresse: 'Bamako, Mali',
      domaine: 'Microfinance',
      email: 'contact@kafofond.ml',
      telephone: '+223 76 45 12 89',
      motDePasse: '******',
      dateCreation: new Date('2024-03-15'),
      statut: true
    },
    {
      nom: 'Tech Supplies Co.',
      adresse: 'Ségou, Mali',
      domaine: 'Informatique',
      email: 'info@techsupplies.ml',
      telephone: '+223 74 23 11 02',
      motDePasse: '******',
      dateCreation: new Date('2023-11-20'),
      statut: false
    },
    {
      nom: 'Office Furnishings Inc.',
      adresse: 'Bamako, ACI 2000',
      domaine: 'Mobilier de bureau',
      email: 'contact@ofi.ml',
      telephone: '+223 78 92 45 67',
      motDePasse: '******',
      dateCreation: new Date('2022-06-05'),
      statut: true
    }
  ];

  get filteredEntreprises() {
    if (this.filtreStatut === 'actif') {
      return this.entreprises.filter(e => e.statut === true);
    } else if (this.filtreStatut === 'inactif') {
      return this.entreprises.filter(e => e.statut === false);
    }
    return this.entreprises;
  }

  afficherDetails(entreprise: Entreprise) {
    alert(`Détails de ${entreprise.nom} :
Adresse : ${entreprise.adresse}
Domaine : ${entreprise.domaine}
Email : ${entreprise.email}
Téléphone : ${entreprise.telephone}`);
  }

  bloquerEntreprise(entreprise: Entreprise) {
    entreprise.statut = false;
    alert(`${entreprise.nom} a été bloquée.`);
  }

  ajouterEntreprise() {
    alert('Formulaire d’ajout d’entreprise (à implémenter)');
  }

  exporterEntreprises() {
    alert('Export des entreprises (à implémenter)');
  }
}
