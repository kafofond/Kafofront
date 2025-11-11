import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Statut } from '../../../enums/statut';
import { AttestationServiceFait } from '../../../models/attestation-service-fait';

@Component({
  selector: 'app-contentbody-attestation-de-service-respo',
  imports: [FormsModule, CommonModule],
  templateUrl: './contentbody-attestation-de-service-respo.html',
  styleUrl: './contentbody-attestation-de-service-respo.css'
})
export class ContentbodyAttestationDeServiceRespo {

  Statut = Statut;
  selectedStatus: string = 'Tous';
  statusDropdownOpen: boolean = false;

  attestations: AttestationServiceFait[] = [
    {
      code: 'ASF001',
      referenceBonCommande: 'BC001',
      fournisseur: 'Fournisseur A',
      titre: 'Attestation de service fait pour matériel informatique',
      dateCreation:'2024-05-16',
      dateLivraison: '2024-05-30',
      constat: 'Livraison conforme aux spécifications',
      preuve: 'bon-livraison-001.pdf',
    },
    {
      code: 'ASF002',
      referenceBonCommande: 'BC002',
      fournisseur: 'Fournisseur B',
      titre: 'Attestation de service fait pour maintenance',
      dateCreation:'2024-05-16',
      dateLivraison: '2024-05-30',
      constat: 'Services rendus conformément au contrat',
      preuve: 'rapport-maintenance-001.pdf',
    },
    {
      code: 'ASF003',
      referenceBonCommande: 'BC003',
      fournisseur: 'Fournisseur C',
      titre: 'Attestation de service fait pour consulting',
      dateCreation:'2024-05-16',
      dateLivraison: '2024-05-30',
      constat: 'Consulting réalisé selon les attentes',
      preuve: 'rapport-consulting-001.pdf',
    }
  ];
  // Filtrage dynamique des attestations de service fait
  get filteredAttestations(): AttestationServiceFait[] {
    const filtered =
      this.selectedStatus === 'Tous'
        ? this.attestations
        : this.attestations.filter(
            (a) =>
              a.statut &&
              a.statut.toLowerCase() === this.selectedStatus.toLowerCase()
          );
    return filtered.slice(0, 5);
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
