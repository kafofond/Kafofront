import { Component } from '@angular/core';
import { Statut } from '../../../enums/statut';
import { DemandeAchat } from '../../../models/demande-achat';
import { FicheBesoin } from '../../../models/fiche-besoin';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-depenses',
  imports: [FormsModule, CommonModule],
  templateUrl: './depenses.html',
  styleUrl: './depenses.css'
})
export class Depenses {
  Statut = Statut;
  selectedStatus: string = 'Tous';

  demandesAchat: DemandeAchat[] = [
    {
      code: 'DA-001',
      referenceBesoin: 'FB-101',
      description: 'Achat matériel Informatique',
      fournisseur: 'Tech Supplies Co.',
      montantTotal: 10300000,
      serviceBeneficiaire: 'Informatique',
      dateExecution: new Date('2024-07-15'),
      dateDeCreation: new Date('2024-06-20'),
      devis: 'Devis-001.pdf',
      statut: Statut.VALIDE,
    },
    {
      code: 'DA-002',
      referenceBesoin: 'FB-102',
      description: 'Mission externe',
      fournisseur: 'Travel Experts Ltd.',
      montantTotal: 5000000,
      serviceBeneficiaire: 'Marketing',
      dateExecution: new Date('2024-08-05'),
      dateDeCreation: new Date('2024-06-22'),
      devis: 'Devis-002.pdf',
      statut: Statut.REJETE,
    },
    {
      code: 'DA-003',
      referenceBesoin: 'FB-103',
      description: 'Achat mobilier de bureau',
      fournisseur: 'Office Furnishings Inc.',
      montantTotal: 7500000,
      serviceBeneficiaire: 'Administration',
      dateExecution: new Date('2024-09-10'),
      dateDeCreation: new Date('2024-06-25'),
      devis: 'Devis-003.pdf',
      statut: Statut.VALIDE,
    },
    // Ajoutez d'autres demandes d'achat ici
  ];

  fichesBesoin: FicheBesoin[] = [
    {
      code: 'FB-101',
      serviceBeneficiaire: 'Informatique',
      description: 'Achat matériel Informatique',
      objet: 'Ordinateurs, imprimantes, et accessoires',
      designation: 'Matériel informatique pour le département IT',
      date: new Date('2024-06-15'),
      dateDeCreation: new Date('2024-06-10'),
      urlFichier: 'FicheBesoin-101.pdf',
      statut: Statut.VALIDE,
    },
    {
      code: 'FB-102',
      serviceBeneficiaire: 'Marketing',
      description: 'Mission externe',
      objet: 'Déplacement pour conférence internationale',
      designation: 'Participation à la conférence marketing 2024',
      date: new Date('2024-07-20'),
      dateDeCreation: new Date('2024-06-12'),
      urlFichier: 'FicheBesoin-102.pdf',
      statut: Statut.REJETE,
    },
    {
      code: 'FB-103',
      serviceBeneficiaire: 'Administration',
      description: 'Achat mobilier de bureau',
      objet: 'Chaises, bureaux, et rangements',
      designation: 'Mobilier pour le nouvel espace de travail',
      date: new Date('2024-08-30'),
      dateDeCreation: new Date('2024-06-18'),
      urlFichier: 'FicheBesoin-103.pdf',
      statut: Statut.VALIDE,
    },
    // Ajoutez d'autres fiches de besoin ici
  ];

  // Filtrage dynamique
  get filteredDemandes(): DemandeAchat[] {
    const filtered =
      this.selectedStatus === 'Tous'
        ? this.demandesAchat
        : this.demandesAchat.filter((d) => d.statut === this.selectedStatus);
    return filtered.slice(0, 5); // max 5 lignes
  }

  get filteredFiches(): FicheBesoin[] {
    const filtered =
      this.selectedStatus === 'Tous'
        ? this.fichesBesoin
        : this.fichesBesoin.filter((f) => f.statut === this.selectedStatus);
    return filtered.slice(0, 5);
  }

  setStatus(status: string) {
    this.selectedStatus = status;
  }


}
