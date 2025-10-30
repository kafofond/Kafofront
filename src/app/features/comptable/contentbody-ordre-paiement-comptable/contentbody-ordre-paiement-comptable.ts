import { Component, HostListener } from '@angular/core';
import { OrdreDePaiement } from '../../../models/ordre-de-paiement';
import { Statut } from '../../../enums/statut';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contentbody-ordre-paiement-comptable',
  imports: [CommonModule],
  templateUrl: './contentbody-ordre-paiement-comptable.html',
  styleUrl: './contentbody-ordre-paiement-comptable.css'
})
export class ContentbodyOrdrePaiementComptable {

  selectedStatus: string = 'Tous';
  statusDropdownOpen: boolean = false;

  ordreDePaiements: OrdreDePaiement[] = [
    {
      code: 'OP001',
      referenceDecionDePrelevement: 'DP001',
      montantAPrelever: 1500,
      compteOrigine: 'FR7612345678901234567890124',
      compteDestinataire: 'FR7612345678901234567890123',
      dateExecution: new Date('2024-01-20'),
      dateDeCreation: new Date('2024-01-16'),
      description: 'Ordre de paiement pour DP001',
      statut: Statut.VALIDE
    },
    {
      code: 'OP002',
      referenceDecionDePrelevement: 'DP002',
      montantAPrelever: 2500,
      compteOrigine: 'FR7612345678901234567890126',
      compteDestinataire: 'FR7612345678901234567890125',
      dateExecution: new Date('2024-02-25'),
      dateDeCreation: new Date('2024-02-21'),
      description: 'Ordre de paiement pour DP002',
      statut: Statut.EN_ATTENTE
    }
  ];

  // Dropdown status
  toggleStatusDropdown() { this.statusDropdownOpen = !this.statusDropdownOpen; }

  setStatus(status: string) {
    this.selectedStatus = status;
    this.statusDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.filter-group');
    if (dropdown && !dropdown.contains(target)) {
      this.statusDropdownOpen = false;
    }
  }

  validerDecision(ordre: OrdreDePaiement) {
    ordre.statut = Statut.VALIDE;
  }

  refuserDecision(ordre: OrdreDePaiement) {
    ordre.statut = Statut.REJETE;
  }
}
