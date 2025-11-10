import { Component, OnInit } from '@angular/core';
import { HistoriqueService, HistoriqueAction } from '../../../services/historique.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contentbody-historique-action-dsi',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './contentbody-historique-action-dsi.html',
  styleUrl: './contentbody-historique-action-dsi.css'
})
export class ContentbodyHistoriqueActionDsi implements OnInit {

  filtreAction: string = 'toutes';
  historiques: HistoriqueAction[] = [];
  isLoading: boolean = false;
  error: string = '';

  // Pagination
  pageActuelle: number = 1;
  lignesParPage: number = 10;

  constructor(private historiqueService: HistoriqueService) {}

  ngOnInit() {
    this.loadHistorique();
  }

  loadHistorique() {
    this.isLoading = true;
    this.error = '';

    this.historiqueService.getHistoriqueUtilisateur().subscribe({
      next: (response) => {
        this.historiques = response.historique;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 0) {
          this.error = 'Erreur de connexion au serveur. Vérifiez que le serveur est démarré.';
        } else if (err.status === 403) {
          this.error = 'Accès refusé. Vérifiez vos autorisations.';
        } else {
          this.error = 'Erreur lors du chargement de l\'historique';
        }
        this.isLoading = false;
        console.error('Erreur historique:', err);
      }
    });
  }

  transformHistoriqueData(historique: HistoriqueAction): any {
    return {
      ...historique,
      fichier: this.historiqueService.genererNomFichier(historique),
      auteur: historique.utilisateurNomComplet,
      typeDocument: this.historiqueService.formaterTypeDocument(historique.typeDocument),
      action: this.historiqueService.formaterAction(historique.action),
      date: new Date(historique.dateAction)
    };
  }

  get historiquesFiltres() {
    const historiquesTransformes = this.historiques.map(h => this.transformHistoriqueData(h));
    if (this.filtreAction === 'toutes') return historiquesTransformes;

    const filtreMap: { [key: string]: string } = {
      'cree': 'Créé',
      'modifie': 'Modifié',
      'valide': 'Validé',
      'rejete': 'Rejeté'
    };

    return historiquesTransformes.filter(h => h.action === filtreMap[this.filtreAction]);
  }

  // Pagination calculée
  get totalPages(): number {
    return Math.ceil(this.historiquesFiltres.length / this.lignesParPage);
  }

  get historiquesPageCourante() {
    const debut = (this.pageActuelle - 1) * this.lignesParPage;
    return this.historiquesFiltres.slice(debut, debut + this.lignesParPage);
  }

  pageSuivante() {
    if (this.pageActuelle < this.totalPages) this.pageActuelle++;
  }

  pagePrecedente() {
    if (this.pageActuelle > 1) this.pageActuelle--;
  }

  retry() {
    this.loadHistorique();
  }
}
