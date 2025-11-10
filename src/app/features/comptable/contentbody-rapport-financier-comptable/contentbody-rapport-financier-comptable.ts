import { Component } from '@angular/core';
import { RapportDachat } from '../../../models/rapport-dachat';
import { Statut } from '../../../enums/statut';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LigneBudget } from '../../../models/ligne-budget.model';

@Component({
  selector: 'app-contentbody-rapport-financier-comptable',
  imports: [FormsModule, CommonModule],
  templateUrl: './contentbody-rapport-financier-comptable.html',
  styleUrl: './contentbody-rapport-financier-comptable.css'
})
export class ContentbodyRapportFinancierComptable {

  
  // --- Données Ligne de Crédit ---
lignesBudget: LigneBudget[] = [
  {
    id: 1,
    code: 'LB-001',
    budgetId: 101,
    intituleLigne: 'Achat matériel informatique',
    description: 'Ordinateurs et accessoires',
    dateDeCreation: new Date('2024-01-15'),
    commentaire: 'Prioritaire pour le service IT',
    statut: 'Validé',
    etat: true,
    dateDebut: new Date('2024-01-01'),
    dateFin: new Date('2024-12-31'),
    montantAlloue: 15000000,
    montantEngage: 9000000,
    montantRestant: 6000000,
    tauxUtilisation: 60,
    createurNom: 'Hamza Sanmo',
    createurEmail: 'hamza.sanmo@entreprise.com'
  },
  {
    id: 2,
    code: 'LB-002',
    budgetId: 102,
    intituleLigne: 'Achat mobilier de bureau',
    description: 'Chaises, bureaux, armoires',
    dateDeCreation: new Date('2024-02-20'),
    commentaire: 'Pour le service RH',
    statut: 'En attente',
    etat: true,
    dateDebut: new Date('2024-02-01'),
    dateFin: new Date('2024-11-30'),
    montantAlloue: 10000000,
    montantEngage: 4000000,
    montantRestant: 6000000,
    tauxUtilisation: 40,
    createurNom: 'Hamza Sanmo',
    createurEmail: 'hamza.sanmo@entreprise.com'
  },
  {
    id: 3,
    code: 'LB-003',
    budgetId: 103,
    intituleLigne: 'Maintenance équipements réseau',
    description: 'Réseau interne et sécurité',
    dateDeCreation: new Date('2024-03-05'),
    commentaire: 'Renouvellement contrat',
    statut: 'Rejeté',
    etat: false,
    dateDebut: new Date('2024-03-01'),
    dateFin: new Date('2024-10-15'),
    montantAlloue: 8000000,
    montantEngage: 8000000,
    montantRestant: 0,
    tauxUtilisation: 100,
    createurNom: 'Hamza Sanmo',
    createurEmail: 'hamza.sanmo@entreprise.com'
  }
];

rapportDachats = [
    {
      nom: 'Rapport d’achat – Matériel Informatique',
      ficheDeBesoin: 'FB-101',
      demandeAchat: 'DA-001',
      bonDeCommande: 'BC-001',
      attestationDeServiceFait: 'ASF-001',
      decisionDePrelevement: 'DP-001',
      ordreDePrelevement: 'OP-001',
      dateDeCreation: new Date('2024-07-20'),
    },
    {
      nom: 'Rapport d’achat – Mobilier de Bureau',
      ficheDeBesoin: 'FB-102',
      demandeAchat: 'DA-002',
      bonDeCommande: 'BC-002',
      attestationDeServiceFait: 'ASF-002',
      decisionDePrelevement: 'DP-002',
      ordreDePrelevement: 'OP-002',
      dateDeCreation: new Date('2024-08-15'),
    },
    {
      nom: 'Rapport d’achat – Services de Maintenance',
      ficheDeBesoin: 'FB-103',
      demandeAchat: 'DA-003',
      bonDeCommande: 'BC-003',
      attestationDeServiceFait: 'ASF-003',
      decisionDePrelevement: 'DP-003',
      ordreDePrelevement: 'OP-003',
      dateDeCreation: new Date('2024-09-05'),
    }
  ];

}
