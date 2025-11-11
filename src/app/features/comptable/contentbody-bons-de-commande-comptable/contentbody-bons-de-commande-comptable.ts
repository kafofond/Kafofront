import { Component, HostListener } from '@angular/core';
import { BonDeCommande } from '../../../models/bon-de-commande';
import { Statut } from '../../../enums/statut';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contentbody-bons-de-commande-comptable',
  imports: [FormsModule, CommonModule],
  templateUrl: './contentbody-bons-de-commande-comptable.html',
  styleUrl: './contentbody-bons-de-commande-comptable.css'
})
export class ContentbodyBonsDeCommandeComptable {

  Statut = Statut;
  selectedStatus: string = 'Tous';
  statusDropdownOpen: boolean = false;

  bonsDeCommande: BonDeCommande[] = [
    {
      id: 1,
      code: 'BC001',
      referenceDemande: 'RD001',
      fournisseur: 'Fournisseur A',
      description: 'Achat de matériel informatique',
      montantTotal: 15000,
      serviceBeneficiaire: 'Service IT',
      dateExecution: '2024-05-25',
      dateCreation: '2024-04-20',
      statut: Statut.VALIDE,
      modePaiement: 'Virement bancaire',
      delaiPaiement: '2024-06-25'
    },
    {
      id: 1,
      code: 'BC002',
      referenceDemande: 'RD002',
      fournisseur: 'Fournisseur B',
      description: 'Services de maintenance',
      montantTotal: 8000,
      serviceBeneficiaire: 'Service Maintenance',
      dateExecution: '2024-05-25',
      dateCreation: '2024-04-20',
      statut: Statut.EN_ATTENTE,
      modePaiement: 'Chèque',
      delaiPaiement: '2024-06-25'
    },
    {
      id: 1,
      code: 'BC003',
      referenceDemande: 'RD003',
      fournisseur: 'Fournisseur C',
      description: 'Consulting en gestion de projet',
      montantTotal: 12000,
      serviceBeneficiaire: 'Service Projets',
      dateExecution: '2024-05-25',
      dateCreation: '2024-04-20',
      statut: Statut.REJETE,
      modePaiement: 'Carte bancaire',
      delaiPaiement: '2024-06-25'
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
