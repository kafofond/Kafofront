import { Component, OnInit } from '@angular/core';
import { RapportDachat } from '../../../models/rapport-dachat';
import { Statut } from '../../../enums/statut';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LigneBudget } from '../../../models/ligne-budget.model';
import { RapportDachatService } from '../../../services/rapport-dachat.service';
import { LigneCreditService, LigneCredit } from '../../../services/ligne-credit.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-contentbody-rapport-financier-comptable',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contentbody-rapport-financier-comptable.html',
  styleUrls: ['./contentbody-rapport-financier-comptable.css']
})
export class ContentbodyRapportFinancierComptable implements OnInit {

  // --- Données Ligne de Crédit ---
  lignesCredit: LigneCredit[] = [];
  rapportDachats: RapportDachat[] = [];
  showCreateForm: boolean = false;
  // Champs de recherche pour chaque tableau
  searchLignesQuery: string = '';
  searchRapportsQuery: string = '';

  constructor(
    private rapportService: RapportDachatService,
    private ligneCreditService: LigneCreditService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadLignesCredit();
    this.loadRapports();
  }

  loadLignesCredit(): void {
    // Charger les lignes de crédit validées et actives de l'entreprise de l'utilisateur connecté
    const entrepriseId = this.authService.getEntrepriseIdFromToken();
    if (entrepriseId) {
      this.ligneCreditService.getLignesValideesActivesByEntreprise(entrepriseId).subscribe(
        (response: any) => {
          this.lignesCredit = response.lignes;
        },
        (error: any) => {
          console.error('Erreur lors du chargement des lignes de crédit validées et actives:', error);
        }
      );
    } else {
      console.error('Impossible de recuperer l\'ID de l\'entreprise depuis le token');
    }
  }

  loadRapports(): void {
    this.rapportService.getAllRapports().subscribe(
      response => {
        this.rapportDachats = response.rapports;
      },
      error => {
        console.error('Erreur lors du chargement des rapports:', error);
      }
    );
  }

  // Getters filtrés pour supporter la recherche temps réel
  get filteredLignes(): LigneCredit[] {
    const normalize = (s: string) => (s || '').toString().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const q = normalize(this.searchLignesQuery.trim());
    if (!q) return this.lignesCredit;
    return this.lignesCredit.filter(l => {
      return [l.intituleLigne, String(l.montantAllouer), String(l.montantEngager), String(l.montantRestant)].some(f => normalize(f || '').includes(q));
    });
  }

  get filteredRapports(): RapportDachat[] {
    const normalize = (s: string) => (s || '').toString().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const q = normalize(this.searchRapportsQuery.trim());
    if (!q) return this.rapportDachats;
    return this.rapportDachats.filter(r => {
      return [r.nom, r.ficheBesoin, r.demandeAchat, r.bonCommande, r.attestationServiceFait, r.decisionPrelevement, r.ordrePaiement]
        .some(f => normalize(f || '').includes(q));
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  createRapport(nom: string, ficheBesoin: string, demandeAchat: string, bonCommande: string, attestationServiceFait: string, decisionPrelevement: string, ordrePaiement: string): void {
    const newRapport = {
      nom: nom,
      ficheBesoin: ficheBesoin,
      demandeAchat: demandeAchat,
      bonCommande: bonCommande,
      attestationServiceFait: attestationServiceFait,
      decisionPrelevement: decisionPrelevement,
      ordrePaiement: ordrePaiement
    };

    this.rapportService.createRapport(newRapport).subscribe(
      (response: any) => {
        console.log('Rapport créé avec succès:', response);
        // Recharger la liste des rapports
        this.loadRapports();
        // Cacher le formulaire après création
        this.showCreateForm = false;
      },
      (error: any) => {
        console.error('Erreur lors de la création du rapport:', error);
      }
    );
  }
}
