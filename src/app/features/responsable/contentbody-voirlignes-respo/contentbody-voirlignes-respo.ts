import { Component } from '@angular/core';
import { LigneBudget } from '../../../models/ligne-budget.model';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contentbody-voirlignes-respo',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './contentbody-voirlignes-respo.html',
  styleUrl: './contentbody-voirlignes-respo.css'
})
export class ContentbodyVoirlignesRespo {

  showCreateLigneModal: boolean = false;
  
    newLigneCredit: Partial<LigneBudget> = {
      intituleLigne: '',
      description: '',
      commentaire: '',
      statut: 'En attente',
      etat: true,
      dateDebut: undefined,
      dateFin: undefined,
      montantAlloue: undefined,
      // Les champs suivants sont calculés/mis à jour par le backend
      montantEngage: 0,
      montantRestant: 0
    };
  
    lignes: LigneBudget[] = [
  { 
    id: 1,
    code: 'LN-001',
    budgetId: 101,
    intituleLigne: 'Formation du personnel',
    description: 'Programme de renforcement des compétences pour les employés du département RH',
    dateDeCreation: new Date('2025-01-15'),
    commentaire: 'Formation prévue pour le premier trimestre',
    statut: 'En cours',
    etat: true,
    dateDebut: new Date('2025-02-01'),
    dateFin: new Date('2025-03-15'),
    montantAlloue: 5000000,
    montantEngage: 3000000,
    montantRestant: 2000000,
    tauxUtilisation: 60,
    createurNom: 'Hamza Sanmo',
    createurEmail: 'hamza.sanmo@entreprise.com'
  },
  {
    id: 2,
    code: 'LN-002',
    budgetId: 101,
    intituleLigne: 'Achat de matériel informatique',
    description: 'Acquisition de nouveaux ordinateurs portables et imprimantes pour le service IT',
    dateDeCreation: new Date('2025-02-10'),
    commentaire: 'Commande en attente de livraison',
    statut: 'Validé',
    etat: true,
    dateDebut: new Date('2025-02-15'),
    dateFin: new Date('2025-04-01'),
    montantAlloue: 15000000,
    montantEngage: 12000000,
    montantRestant: 3000000,
    tauxUtilisation: 80,
    createurNom: 'Hamza Sanmo',
    createurEmail: 'hamza.sanmo@entreprise.com'
  },
  {
    id: 3,
    code: 'LN-003',
    budgetId: 101,
    intituleLigne: 'Campagne marketing',
    description: 'Campagne digitale de promotion des nouveaux produits 2025',
    dateDeCreation: new Date('2025-03-05'),
    commentaire: 'Campagne en phase de conception',
    statut: 'En attente',
    etat: false,
    dateDebut: new Date('2025-04-01'),
    dateFin: new Date('2025-05-30'),
    montantAlloue: 8000000,
    montantEngage: 2000000,
    montantRestant: 6000000,
    tauxUtilisation: 25,
    createurNom: 'Hamza Sanmo',
    createurEmail: 'hamza.sanmo@entreprise.com'
  },
  {
    id: 4,
    code: 'LN-004',
    budgetId: 101,
    intituleLigne: 'Maintenance des infrastructures',
    description: 'Entretien et mise à jour du matériel réseau dans les bureaux régionaux',
    dateDeCreation: new Date('2025-01-28'),
    commentaire: 'Nécessite l’approbation du directeur financier',
    statut: 'Soumis',
    etat: false,
    dateDebut: new Date('2025-02-10'),
    dateFin: new Date('2025-03-20'),
    montantAlloue: 6000000,
    montantEngage: 1000000,
    montantRestant: 5000000,
    tauxUtilisation: 17,
    createurNom: 'Hamza Sanmo',
    createurEmail: 'hamza.sanmo@entreprise.com'
  },
  {
    id: 5,
    code: 'LN-005',
    budgetId: 101,
    intituleLigne: 'Organisation du séminaire annuel',
    description: 'Préparation du séminaire annuel des cadres à Bamako',
    dateDeCreation: new Date('2025-02-18'),
    commentaire: 'Attente de validation du lieu et des prestataires',
    statut: 'Refusé',
    etat: false,
    dateDebut: new Date('2025-03-10'),
    dateFin: new Date('2025-03-12'),
    montantAlloue: 4000000,
    montantEngage: 0,
    montantRestant: 4000000,
    tauxUtilisation: 0,
    createurNom: 'Hamza Sanmo',
    createurEmail: 'hamza.sanmo@entreprise.com'
  }
].map(ligne => ({
      ...ligne,
      tauxUtilisation: ligne.montantAlloue
        ? parseFloat(((ligne.montantEngage / ligne.montantAlloue) * 100).toFixed(2))
        : 0
    }));
  
  
    constructor() { }
  
    /**
     * Ouvre la modale de création de ligne de crédit.
     */
  
    openCreateLigneModal(): void {
      // Reinitialisation du modèle à l'ouverture pour éviter les résidus de données
      this.newLigneCredit = {
        statut: 'En attente',
        etat: true,
        montantEngage: 0,
        montantRestant: 0
      };
      // Logique pour ouvrir la modale
      this.showCreateLigneModal = true;
      document.body.classList.add('modal-open');
    }
  
    /**
     * Ferme la modale de création de ligne de crédit.
     */
  
    closeCreateLigneModal(): void {
      // Logique pour fermer la modale
      this.showCreateLigneModal = false;
      document.body.classList.remove('modal-open');
    }
  
    /**
     * Gère la soumission du formulaire de création de ligne de crédit.
     */
  
    submitNewLigneCredit(): void {
      // Logique pour traiter les données du formulaire
      // Par exemple, envoyer les données au serveur ou les ajouter à une liste locale
      console.log("Nouvelle ligne de crédit soumise:", this.lignes);
  
      // Fermer la modale après la soumission
      this.closeCreateLigneModal();
    }
      
  
    ngOnInit(): void {}

}
