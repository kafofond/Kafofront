import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface DashboardStats {
  utilisateursActifs: number;
  entreprisesActives: number;
  totalUtilisateurs: number;
  totalEntreprises: number;
  pourcentageUtilisateursActifs: number;
  pourcentageEntreprisesActives: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    utilisateurs: number[];
    entreprises: number[];
    documents: number[];
  };
}

export interface DocumentsStats {
  totalDocuments: number;
  totalAttestationsServiceFait: number;
  totalDemandesAchat: number;
  totalOrdresPaiement: number;
  totalDecisionsPrelevement: number;
  totalBonsCommande: number;
  totalBudgets: number;
  totalFichesBesoin: number;
  totalLignesCredit: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {
  private baseUrl = 'http://localhost:8080/api/statistiques';

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard`).pipe(
      catchError(error => {
        console.error('Erreur API dashboard:', error);
        return of({
          utilisateursActifs: 1,
          entreprisesActives: 1,
          totalUtilisateurs: 1,
          totalEntreprises: 1,
          pourcentageUtilisateursActifs: 100,
          pourcentageEntreprisesActives: 100
        });
      })
    );
  }

  getChartData(periode: string = 'semaine'): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.baseUrl}/chart?periode=${periode}`).pipe(
      catchError(error => {
        console.error('Erreur API chart:', error);
        return of(this.generateDefaultChartData(periode));
      })
    );
  }

  getDocumentsStats(): Observable<DocumentsStats> {
    return this.http.get<DocumentsStats>(`${this.baseUrl}/documents`).pipe(
      catchError(error => {
        console.error('Erreur API documents:', error);
        return of({
          totalDocuments: 0,
          totalAttestationsServiceFait: 0,
          totalDemandesAchat: 0,
          totalOrdresPaiement: 0,
          totalDecisionsPrelevement: 0,
          totalBonsCommande: 0,
          totalBudgets: 0,
          totalFichesBesoin: 0,
          totalLignesCredit: 0
        });
      })
    );
  }

  private generateDefaultChartData(periode: string): ChartData {
    const labels = this.generateLabels(periode);
    return {
      labels: labels,
      datasets: {
        utilisateurs: this.generateData(labels.length, 1, 10),
        entreprises: this.generateData(labels.length, 1, 5),
        documents: this.generateData(labels.length, 2, 15)
      }
    };
  }

  private generateLabels(periode: string): string[] {
    switch(periode) {
      case 'jour':
        return ['06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'];
      case 'semaine':
        return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      case 'mois':
        return ['Sem1', 'Sem2', 'Sem3', 'Sem4'];
      default:
        return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    }
  }

  private generateData(length: number, min: number, max: number): number[] {
    return Array.from({length}, () => Math.floor(Math.random() * (max - min + 1)) + min);
  }
}