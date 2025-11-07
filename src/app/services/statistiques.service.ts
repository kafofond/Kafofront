import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

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

export interface DsiDashboardStats {
  totalUsers: number;
  disabledUsers: number;
  sharedDocuments: number;
  activeUsersPercentage: number;
  disabledUsersPercentage: number;
  documentsPercentage: number;
}

export interface DsiChartData {
  labels: string[];
  datasets: {
    utilisateurs: number[];
    documents: number[];
    desactivations: number[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {
  private baseUrl = 'http://localhost:8080/api/statistiques';
  
  // Cache pour optimiser les requêtes
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 30000; // 30 secondes

  constructor(private http: HttpClient) {}

  // ADMIN SYSTEM - Données globales (SUPER_ADMIN)
  getDashboardStats(): Observable<DashboardStats> {
    const cacheKey = 'dashboard-global';
    
    return this.getCachedOrFetch<DashboardStats>(
      cacheKey,
      `${this.baseUrl}/dashboard`
    ).pipe(
      map(data => this.normalizeDashboardStats(data)),
      catchError((error) => {
        console.error('Erreur API dashboard global:', error);
        return of(this.getEmptyDashboardStats());
      })
    );
  }

  getChartData(periode: string = 'semaine'): Observable<ChartData> {
    const cacheKey = `chart-global-${periode}`;
    
    return this.getCachedOrFetch<ChartData>(
      cacheKey,
      `${this.baseUrl}/chart?periode=${periode}`
    ).pipe(
      map(data => this.normalizeChartData(data)),
      catchError((error) => {
        console.error('Erreur API chart global:', error);
        return of(this.getEmptyChartData(periode));
      })
    );
  }

  getDocumentsStats(): Observable<DocumentsStats> {
    const cacheKey = 'documents-global';
    
    return this.getCachedOrFetch<DocumentsStats>(
      cacheKey,
      `${this.baseUrl}/documents`
    ).pipe(
      map(data => this.normalizeDocumentsStats(data)),
      catchError((error) => {
        console.error('Erreur API documents global:', error);
        return of(this.getEmptyDocumentsStats());
      })
    );
  }

  // MÉTHODES DSI - Données filtrées par entreprise
  getDsiDashboardStats(): Observable<DsiDashboardStats> {
    const cacheKey = 'dsi-dashboard';
    
    return this.getCachedOrFetch<DsiDashboardStats>(
      cacheKey,
      `${this.baseUrl}/dsi/dashboard`
    ).pipe(
      tap(data => console.log('📊 Données DSI dashboard (entreprise):', data)),
      map(data => this.normalizeDsiDashboardStats(data)),
      catchError((error): Observable<DsiDashboardStats> => {
        console.error('Erreur API DSI dashboard (entreprise):', error);
        // Ne pas fallback sur les données globales pour DSI
        return of(this.getEmptyDsiStats());
      })
    );
  }

  getDsiChartData(periode: string = 'semaine'): Observable<DsiChartData> {
    const cacheKey = `dsi-chart-${periode}`;
    
    return this.getCachedOrFetch<DsiChartData>(
      cacheKey,
      `${this.baseUrl}/dsi/chart?periode=${periode}`
    ).pipe(
      tap(data => console.log(`📈 Données DSI chart ${periode} (entreprise):`, data)),
      map(data => this.normalizeDsiChartData(data)),
      catchError((error) => {
        console.error(`Erreur API DSI chart ${periode} (entreprise):`, error);
        return of(this.getEmptyDsiChartData(periode));
      })
    );
  }

  // Méthode générique pour le cache
  private getCachedOrFetch<T>(cacheKey: string, url: string): Observable<T> {
    const cached = this.cache.get(cacheKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      console.log(`🔄 Utilisation du cache pour: ${cacheKey}`);
      return of(cached.data);
    }

    return this.http.get<T>(url).pipe(
      tap(data => {
        this.cache.set(cacheKey, { data, timestamp: now });
        console.log(`💾 Mise en cache: ${cacheKey}`);
      })
    );
  }

  // Invalider le cache (utile après certaines actions)
  invalidateCache(pattern?: string): void {
    if (pattern) {
      // Invalider seulement les clés correspondant au pattern
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
      console.log(`🗑️ Cache invalidé pour pattern: ${pattern}`);
    } else {
      // Invalider tout le cache
      this.cache.clear();
      console.log('🗑️ Cache complètement invalidé');
    }
  }

  // NORMALISATION DES DONNÉES DSI (entreprise spécifique)
  private normalizeDsiDashboardStats(data: DsiDashboardStats): DsiDashboardStats {
    return {
      totalUsers: this.ensureNumber(data.totalUsers),
      disabledUsers: this.ensureNumber(data.disabledUsers),
      sharedDocuments: this.ensureNumber(data.sharedDocuments),
      activeUsersPercentage: this.ensurePercentage(data.activeUsersPercentage),
      disabledUsersPercentage: this.ensurePercentage(data.disabledUsersPercentage),
      documentsPercentage: this.ensurePercentage(data.documentsPercentage)
    };
  }

  private normalizeDsiChartData(data: DsiChartData): DsiChartData {
    return {
      labels: data?.labels || this.generateLabels('semaine'),
      datasets: {
        utilisateurs: this.ensurePositiveNumbers(data?.datasets?.utilisateurs),
        documents: this.ensurePositiveNumbers(data?.datasets?.documents),
        desactivations: this.ensurePositiveNumbers(data?.datasets?.desactivations)
      }
    };
  }

  // NORMALISATION DES DONNÉES GLOBALES (SUPER_ADMIN)
  private normalizeDashboardStats(data: DashboardStats): DashboardStats {
    return {
      utilisateursActifs: this.ensureNumber(data.utilisateursActifs),
      entreprisesActives: this.ensureNumber(data.entreprisesActives),
      totalUtilisateurs: this.ensureNumber(data.totalUtilisateurs),
      totalEntreprises: this.ensureNumber(data.totalEntreprises),
      pourcentageUtilisateursActifs: this.ensurePercentage(data.pourcentageUtilisateursActifs),
      pourcentageEntreprisesActives: this.ensurePercentage(data.pourcentageEntreprisesActives)
    };
  }

  private normalizeChartData(data: ChartData): ChartData {
    return {
      labels: data?.labels || this.generateLabels('semaine'),
      datasets: {
        utilisateurs: this.ensurePositiveNumbers(data?.datasets?.utilisateurs),
        entreprises: this.ensurePositiveNumbers(data?.datasets?.entreprises),
        documents: this.ensurePositiveNumbers(data?.datasets?.documents)
      }
    };
  }

  private normalizeDocumentsStats(data: DocumentsStats): DocumentsStats {
    return {
      totalDocuments: this.ensureNumber(data.totalDocuments),
      totalAttestationsServiceFait: this.ensureNumber(data.totalAttestationsServiceFait),
      totalDemandesAchat: this.ensureNumber(data.totalDemandesAchat),
      totalOrdresPaiement: this.ensureNumber(data.totalOrdresPaiement),
      totalDecisionsPrelevement: this.ensureNumber(data.totalDecisionsPrelevement),
      totalBonsCommande: this.ensureNumber(data.totalBonsCommande),
      totalBudgets: this.ensureNumber(data.totalBudgets),
      totalFichesBesoin: this.ensureNumber(data.totalFichesBesoin),
      totalLignesCredit: this.ensureNumber(data.totalLignesCredit)
    };
  }

  // FONCTIONS DE VALIDATION
  private ensureNumber(value: any): number {
    if (value === null || value === undefined) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : Math.max(0, num);
  }

  private ensurePercentage(value: any): number {
    const num = this.ensureNumber(value);
    return Math.max(0, Math.min(100, num));
  }

  private ensurePositiveNumbers(values: number[] | undefined): number[] {
    if (!values || !Array.isArray(values)) {
      return Array(this.generateLabels('semaine').length).fill(0);
    }
    return values.map(val => Math.max(0, this.ensureNumber(val)));
  }

  // FONCTIONS POUR DONNÉES VIDE
  private getEmptyDashboardStats(): DashboardStats {
    return {
      utilisateursActifs: 0,
      entreprisesActives: 0,
      totalUtilisateurs: 0,
      totalEntreprises: 0,
      pourcentageUtilisateursActifs: 0,
      pourcentageEntreprisesActives: 0
    };
  }

  private getEmptyDsiStats(): DsiDashboardStats {
    return {
      totalUsers: 0,
      disabledUsers: 0,
      sharedDocuments: 0,
      activeUsersPercentage: 0,
      disabledUsersPercentage: 0,
      documentsPercentage: 0
    };
  }

  private getEmptyChartData(periode: string): ChartData {
    const labels = this.generateLabels(periode);
    return {
      labels,
      datasets: {
        utilisateurs: Array(labels.length).fill(0),
        entreprises: Array(labels.length).fill(0),
        documents: Array(labels.length).fill(0)
      }
    };
  }

  private getEmptyDsiChartData(periode: string): DsiChartData {
    const labels = this.generateLabels(periode);
    return {
      labels,
      datasets: {
        utilisateurs: Array(labels.length).fill(0),
        documents: Array(labels.length).fill(0),
        desactivations: Array(labels.length).fill(0)
      }
    };
  }

  private getEmptyDocumentsStats(): DocumentsStats {
    return {
      totalDocuments: 0,
      totalAttestationsServiceFait: 0,
      totalDemandesAchat: 0,
      totalOrdresPaiement: 0,
      totalDecisionsPrelevement: 0,
      totalBonsCommande: 0,
      totalBudgets: 0,
      totalFichesBesoin: 0,
      totalLignesCredit: 0
    };
  }

  // GÉNÉRATION DES LABELS
  private generateLabels(periode: string): string[] {
    switch (periode) {
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
}