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
  id: 1,
  code: 'DP-001',
  referenceAttestation: 'AT-001',
  montant: 250000,
  compteDestinataire: 'BF002-123456789012',
  compteOrigine: 'CI001-254789632541',
  motifPrelevement: 'Paiement facture',
  statut: Statut.VALIDE,
  dateCreation: '2025-11-12',
  dateModification: '2025-11-12',
  createurNom: 'Tresor',
  createurEmail: 'tresor@entreprise.ml',
  entrepriseNom: 'Entreprise Demo',
  attestationId: 1
}
,
    {
  id: 1,
  code: 'DP-001',
  referenceAttestation: 'AT-001',
  montant: 250000,
  compteDestinataire: 'BF002-123456789012',
  compteOrigine: 'CI001-254789632541',
  motifPrelevement: 'Paiement facture',
  statut: Statut.VALIDE,
  dateCreation: '2025-11-12',
  dateModification: '2025-11-12',
  createurNom: 'Tresor',
  createurEmail: 'tresor@entreprise.ml',
  entrepriseNom: 'Entreprise Demo',
  attestationId: 1
}
,
    {
  id: 1,
  code: 'DP-001',
  referenceAttestation: 'AT-001',
  montant: 250000,
  compteDestinataire: 'BF002-123456789012',
  compteOrigine: 'CI001-254789632541',
  motifPrelevement: 'Paiement facture',
  statut: Statut.VALIDE,
  dateCreation: '2025-11-12',
  dateModification: '2025-11-12',
  createurNom: 'Tresor',
  createurEmail: 'tresor@entreprise.ml',
  entrepriseNom: 'Entreprise Demo',
  attestationId: 1
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
