import { Component, HostListener } from '@angular/core';
import { Statut } from '../../../enums/statut';
import { BonDeCommande } from '../../../models/bon-de-commande';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contentbody-bons-de-commande-respo',
  imports: [FormsModule, CommonModule],
  templateUrl: './contentbody-bons-de-commande-respo.html',
  styleUrl: './contentbody-bons-de-commande-respo.css'
})
export class ContentbodyBonsDeCommandeRespo {

  Statut = Statut;
  selectedStatus: string = 'Tous';
  statusDropdownOpen: boolean = false;

  bonsDeCommande: BonDeCommande[] = [
    {
      id: 1,
      referenceDemande: "1234",
      code: 'BC001',
      fournisseur: 'Fournisseur A',
      description: 'Achat de matériel informatique',
      montantTotal: 15000,
      serviceBeneficiaire: 'Service IT',
      modePaiement: 'Virement bancaire',
      dateCreation: '2024-04-20',
      delaiPaiement: '2024-06-15',
      dateExecution: '2024-05-15',
      statut: Statut.VALIDE,
      createurNom: 'John Doe',
      createurEmail: 'john.doe@entreprise.com',
      entrepriseNom: 'Entreprise ABC'
    },
    {
      id: 2,
      referenceDemande: "1234",
      code: 'BC002',
      fournisseur: 'Fournisseur B',
      description: 'Services de maintenance',
      montantTotal: 8000,
      serviceBeneficiaire: 'Service Maintenance',
      modePaiement: 'Chèque',
      dateCreation: '2024-04-25',
      delaiPaiement: '2024-06-20',
      dateExecution: '2024-05-20',
      statut: Statut.EN_ATTENTE,
      createurNom: 'Jane Smith',
      createurEmail: 'jane.smith@entreprise.com',
      entrepriseNom: 'Entreprise ABC'
    },
    {
      id: 3,
      referenceDemande: "1234",
      code: 'BC003',
      fournisseur: 'Fournisseur C',
      description: 'Consulting en gestion de projet',
      montantTotal: 12000,
      serviceBeneficiaire: 'Service Projets',
      modePaiement: 'Carte bancaire',
      dateCreation: '2024-04-30',
      delaiPaiement: '2024-06-25',
      dateExecution: '2024-05-25',
      statut: Statut.REJETE,
      createurNom: 'Bob Johnson',
      createurEmail: 'bob.johnson@entreprise.com',
      entrepriseNom: 'Entreprise ABC'
    }
  ];

  // Filtrage dynamique des bons de commande
  get filteredBons(): BonDeCommande[] {
    const filtered =
      this.selectedStatus === 'Tous'
        ? this.bonsDeCommande
        : this.bonsDeCommande.filter(
            (b) => b.statut.toLowerCase() === this.selectedStatus.toLowerCase()
          );
    return filtered.slice(0, 5); // max 5 lignes
  }

  toggleStatusDropdown() {
    this.statusDropdownOpen = !this.statusDropdownOpen;
  }

  setStatus(status: string) {
    this.selectedStatus = status;
    this.statusDropdownOpen = false; // fermer dropdown après sélection
  }

  // Fermer dropdown si clic en dehors
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.filter-group');
    if (dropdown && !dropdown.contains(target)) {
      this.statusDropdownOpen = false;
    }
  }
}