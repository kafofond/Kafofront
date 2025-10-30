import { Component, HostListener } from '@angular/core';
import { DecisionPrelevement } from '../../../models/decision-prelevement';
import { Statut } from '../../../enums/statut';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contentbody-decision-prelevement-comptable',
  imports: [CommonModule],
  templateUrl: './contentbody-decision-prelevement-comptable.html',
  styleUrl: './contentbody-decision-prelevement-comptable.css'
})
export class ContentbodyDecisionPrelevementComptable {

  selectedStatus: string = 'Tous';
  statusDropdownOpen: boolean = false;

  decisionDePrelevements: DecisionPrelevement[] = [
    {
      code: 'DP001',
      referenceAttestationSF: 'ATTSF001',
      montantAPrelever: 1500,
      compteDestinataire: 'FR7612345678901234567890123',
      compteOrigine: 'FR7612345678901234567890124',
      motifDePrelevement: 'Paiement facture',
      statut: Statut.VALIDE,
      dateDeCreation: new Date('2024-01-15')
    },
    {
      code: 'DP002',
      referenceAttestationSF: 'ATTSF002',
      montantAPrelever: 2500,
      compteDestinataire: 'FR7612345678901234567890125',
      compteOrigine: 'FR7612345678901234567890126',
      motifDePrelevement: 'Achat matériel',
      statut: Statut.EN_ATTENTE,
      dateDeCreation: new Date('2024-02-20')
    },
    {
      code: 'DP003',
      referenceAttestationSF: 'ATTSF003',
      montantAPrelever: 3500,
      compteDestinataire: 'FR7612345678901234567890127',
      compteOrigine: 'FR7612345678901234567890128',
      motifDePrelevement: 'Services divers',
      statut: Statut.REJETE,
      dateDeCreation: new Date('2024-03-10')
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

  validerDecision(decision: DecisionPrelevement) {
    decision.statut = Statut.VALIDE;
  }

  refuserDecision(decision: DecisionPrelevement) {
    decision.statut = Statut.REJETE;
  }
}
