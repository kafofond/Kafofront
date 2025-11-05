import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EntrepriseService } from '../../../services/entreprise.service';
import { CreateEntrepriseRequest, Entreprise } from '../../../models/entreprise.model';

@Component({
  selector: 'app-contentbody-entreprise-admin-system',
  imports: [FormsModule, CommonModule],
  templateUrl: './contentbody-entreprise-admin-system.html',
  styleUrl: './contentbody-entreprise-admin-system.css'
})
export class ContentbodyEntrepriseAdminSystem implements OnInit {
  filtreStatut: string = 'tous';
  entreprises: Entreprise[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  // Variables pour la modale de détails
  showDetailModal: boolean = false;
  selectedEntreprise: Entreprise | null = null;

  // Variables pour la modale d'ajout
  showAjouterModal: boolean = false;
  nouvelleEntreprise: CreateEntrepriseRequest = {
    nom: '',
    domaine: '',
    adresse: '',
    telephone: '',
    email: ''
  };

  constructor(private entrepriseService: EntrepriseService) {}

  ngOnInit() {
    this.loadEntreprises();
  }

  loadEntreprises(): void {
    this.loading = true;
    this.entrepriseService.getEntreprises().subscribe({
      next: (response) => {
        this.entreprises = response.entreprises;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des entreprises';
        this.loading = false;
        console.error('Erreur API entreprises:', error);
      }
    });
  }

  get filteredEntreprises() {
    if (this.filtreStatut === 'actif') {
      return this.entreprises.filter(e => e.etat === true);
    } else if (this.filtreStatut === 'inactif') {
      return this.entreprises.filter(e => e.etat === false);
    }
    return this.entreprises;
  }

  // Méthodes pour la modale de détails
  openDetailModal(entreprise: Entreprise): void {
    this.selectedEntreprise = entreprise;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedEntreprise = null;
  }

  // Méthodes pour la modale d'ajout
  openAjouterModal(): void {
    this.nouvelleEntreprise = {
      nom: '',
      domaine: '',
      adresse: '',
      telephone: '',
      email: ''
    };
    this.showAjouterModal = true;
  }

  closeAjouterModal(): void {
    this.showAjouterModal = false;
  }

  creerEntreprise(): void {
    this.entrepriseService.createEntreprise(this.nouvelleEntreprise).subscribe({
      next: (response) => {
        //alert('Entreprise créée avec succès!');
        this.closeAjouterModal();
        this.loadEntreprises(); // Recharger la liste
      },
      error: (error) => {
        //alert(`Erreur lors de la création: ${error.message}`);
      }
    });
  }

  bloquerEntreprise(entreprise: Entreprise) {
    const nouvelleEntreprise = { ...entreprise, etat: !entreprise.etat };
    
    this.entrepriseService.updateEntreprise(entreprise.id, nouvelleEntreprise).subscribe({
      next: () => {
        entreprise.etat = !entreprise.etat;
        const action = entreprise.etat ? 'activée' : 'bloquée';
        //alert(`${entreprise.nom} a été ${action} avec succès.`);
        this.loadEntreprises(); // Recharger les données
      },
      error: (error) => {
        alert(`Erreur lors de la modification de l'entreprise: ${error.message}`);
      }
    });
  }

  exporterEntreprises() {
    const dataStr = JSON.stringify(this.entreprises, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `entreprises-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}