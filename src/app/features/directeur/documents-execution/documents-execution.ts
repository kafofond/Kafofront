import { Component, HostListener } from '@angular/core';
import { BonDeCommande } from '../../../models/bon-de-commande';
import { Statut } from '../../../enums/statut';
import { AttestationServiceFait } from '../../../models/attestation-service-fait';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documents-execution',
  imports: [FormsModule, CommonModule],
  templateUrl: './documents-execution.html',
  styleUrl: './documents-execution.css'
})
export class DocumentsExecution {

  Statut = Statut;
  selectedStatus: string = 'Tous';
  statusDropdownOpen: boolean = false;

  bonsDeCommande: BonDeCommande[] = [
    {
      code: 'BC001',
      referenceDemande: 'RD001',
      fournisseur: 'Fournisseur A',
      description: 'Achat de matériel informatique',
      montantTotal: 15000,
      serviceBeneficiaire: 'Service IT',
      dateExecution: new Date('2024-05-15'),
      dateDeCreation: new Date('2024-04-20'),
      statut: Statut.VALIDE,
      modeDePaiement: 'Virement bancaire',
      delaiDePaiement: new Date('2024-06-15')
    },
    {
      code: 'BC002',
      referenceDemande: 'RD002',
      fournisseur: 'Fournisseur B',
      description: 'Services de maintenance',
      montantTotal: 8000,
      serviceBeneficiaire: 'Service Maintenance',
      dateExecution: new Date('2024-05-20'),
      dateDeCreation: new Date('2024-04-25'),
      statut: Statut.EN_ATTENTE,
      modeDePaiement: 'Chèque',
      delaiDePaiement: new Date('2024-06-20')
    },
    {
      code: 'BC003',
      referenceDemande: 'RD003',
      fournisseur: 'Fournisseur C',
      description: 'Consulting en gestion de projet',
      montantTotal: 12000,
      serviceBeneficiaire: 'Service Projets',
      dateExecution: new Date('2024-05-25'),
      dateDeCreation: new Date('2024-04-30'),
      statut: Statut.REJETE,
      modeDePaiement: 'Carte bancaire',
      delaiDePaiement: new Date('2024-06-25')
    }

  ];

  attestations: AttestationServiceFait[] = [
    {
      code: 'ASF001',
      referenceBonCommande: 'BC001',
      fournisseur: 'Fournisseur A',
      titre: 'Attestation de service fait pour matériel informatique',
      dateDeCreation: new Date('2024-05-16'),
      dateDeLivraison: new Date('2024-05-30'),
      constat: 'Livraison conforme aux spécifications',
      preuve: 'bon-livraison-001.pdf',
    },
    {
      code: 'ASF002',
      referenceBonCommande: 'BC002',
      fournisseur: 'Fournisseur B',
      titre: 'Attestation de service fait pour maintenance',
      dateDeCreation: new Date('2024-05-21'),
      dateDeLivraison: new Date('2024-06-05'),
      constat: 'Services rendus conformément au contrat',
      preuve: 'rapport-maintenance-001.pdf',
    },
    {
      code: 'ASF003',
      referenceBonCommande: 'BC003',
      fournisseur: 'Fournisseur C',
      titre: 'Attestation de service fait pour consulting',
      dateDeCreation: new Date('2024-05-26'),
      dateDeLivraison: new Date('2024-06-10'),
      constat: 'Consulting réalisé selon les attentes',
      preuve: 'rapport-consulting-001.pdf',
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
