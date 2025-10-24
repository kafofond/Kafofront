import { Component, HostListener } from '@angular/core';
import { DecisionPrelevement } from '../../../models/decision-prelevement';
import { Statut } from '../../../enums/statut';
import { OrdreDePaiement } from '../../../models/ordre-de-paiement';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-prelevement',
  imports: [FormsModule, CommonModule],
  templateUrl: './gestion-prelevement.html',
  styleUrl: './gestion-prelevement.css'
})
export class GestionPrelevement {
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

  ordreDePaiements: OrdreDePaiement []= [
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


  // Filtrage dynamique
  get filteredDecisions(): DecisionPrelevement[] {
    const filtered =
      this.selectedStatus === 'Tous'
        ? this.decisionDePrelevements
        : this.decisionDePrelevements.filter(
            d => d.statut.toLowerCase() === this.selectedStatus.toLowerCase()
          );
    return filtered.slice(0, 5);
  }

  get filteredOrdres(): OrdreDePaiement[] {
    const filtered =
      this.selectedStatus === 'Tous'
        ? this.ordreDePaiements
        : this.ordreDePaiements.filter(
            o => o.statut.toLowerCase() === this.selectedStatus.toLowerCase()
          );
    return filtered.slice(0, 5);
  }

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

  // Actions boutons Valider / Refuser
  validerDecision(decision: DecisionPrelevement | OrdreDePaiement) {
    decision.statut = Statut.VALIDE;
  }

  refuserDecision(decision: DecisionPrelevement | OrdreDePaiement) {
    decision.statut = Statut.REJETE;
  }
}
