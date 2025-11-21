import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../../../services/validation.service';
import { Validation } from '../../../models/validation.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contentbody-validation-respo',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './contentbody-validation-respo.html',
  styleUrl: './contentbody-validation-respo.css'
})
export class ContentbodyValidationRespo implements OnInit {

  filtreStatut: string = 'tous';
  filtreTypeDocument: string = 'tous';
  validations: Validation[] = [];
  isLoading: boolean = false;
  error: string = '';

  // Pagination
  pageActuelle: number = 1;
  lignesParPage: number = 10;

  constructor(public validationService: ValidationService) {}

  ngOnInit() {
    this.loadValidations();
  }

  loadValidations() {
    this.isLoading = true;
    this.error = '';

    this.validationService.getValidationsEntreprise().subscribe({
      next: (response) => {
        this.validations = response.validations;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 0) {
          this.error = 'Erreur de connexion au serveur. Vérifiez que le serveur est démarré.';
        } else if (err.status === 403) {
          this.error = 'Accès refusé. Vérifiez vos autorisations.';
        } else {
          this.error = 'Erreur lors du chargement de l\'historique des validations';
        }
        this.isLoading = false;
        console.error('Erreur validations:', err);
      }
    });
  }

  get validationsFiltrees() {
    let validationsFiltrees = [...this.validations];
    
    // Filtrer par statut
    if (this.filtreStatut !== 'tous') {
      const filtreMap: { [key: string]: string } = {
        'valide': 'VALIDE',
        'approuve': 'APPROUVE',
        'rejete': 'REJETE'
      };
      
      validationsFiltrees = validationsFiltrees.filter(v => v.statut === filtreMap[this.filtreStatut]);
    }
    
    // Filtrer par type de document
    if (this.filtreTypeDocument !== 'tous') {
      validationsFiltrees = validationsFiltrees.filter(v => v.typeDocument === this.filtreTypeDocument);
    }
    
    return validationsFiltrees;
  }

  // Pagination calculée
  get totalPages(): number {
    return Math.ceil(this.validationsFiltrees.length / this.lignesParPage);
  }

  get validationsPageCourante() {
    const debut = (this.pageActuelle - 1) * this.lignesParPage;
    return this.validationsFiltrees.slice(debut, debut + this.lignesParPage);
  }

  pageSuivante() {
    if (this.pageActuelle < this.totalPages) this.pageActuelle++;
  }

  pagePrecedente() {
    if (this.pageActuelle > 1) this.pageActuelle--;
  }

  retry() {
    this.filtreStatut = 'tous';
    this.filtreTypeDocument = 'tous';
    this.loadValidations();
  }
}