import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Budget {
  id: number;
  code: string;
  intituleBudget: string;
  description: string;
  montantBudget: number;
  dateCreation: string;
  dateModification: string;
  dateDebut: string;
  dateFin: string;
  statut: 'VALIDE' | 'EN_COURS' | 'REFUSE';
  actif: boolean;
  createurNom: string;
  createurEmail: string;
  entrepriseNom: string;
}

export interface BudgetsResponse {
  total: number;
  budgets: Budget[];
}

export interface UpdateBudgetRequest {
  intituleBudget: string;
  description: string;
  montantBudget: number;
  dateDebut: string;
  dateFin: string;
  statut: string;
  actif: boolean;
}

export interface UpdateBudgetResponse {
  budget: Budget;
  message: string;
}

export interface RejetRequest {
  commentaire: string;
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private baseUrl = 'http://localhost:8080/api/budgets';

  // Cache pour optimiser les requêtes
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 30000; // 30 secondes

  constructor(private http: HttpClient) {}

  // ========================
  // 🔹 RÉCUPÉRATION DES DONNÉES
  // ========================
  getBudgets(): Observable<BudgetsResponse> {
    const cacheKey = 'budgets-entreprise';
    
    return this.getCachedOrFetch<BudgetsResponse>(
      cacheKey,
      `${this.baseUrl}/mon-entreprise`
    ).pipe(
      tap(data => console.log('📊 Données budgets entreprise reçues:', data)),
      map(data => this.normalizeBudgetsResponse(data)),
      catchError((error) => {
        console.error('Erreur API budgets entreprise:', error);
        return of(this.getEmptyBudgetsResponse());
      })
    );
  }

  getBudgetById(id: number): Observable<Budget> {
    const cacheKey = `budget-${id}`;
    
    return this.getCachedOrFetch<Budget>(
      cacheKey,
      `${this.baseUrl}/${id}`
    ).pipe(
      tap(data => console.log(`📋 Détails budget ${id} reçus:`, data)),
      map(data => this.normalizeBudget(data)),
      catchError((error) => {
        console.error(`Erreur API budget ${id}:`, error);
        return of(this.getEmptyBudget());
      })
    );
  }

  // ========================
  // 🔹 CRÉATION & MISE À JOUR
  // ========================
  createBudget(budgetData: any): Observable<any> {
    this.invalidateCache('budgets');
    return this.http.post<any>(`${this.baseUrl}`, budgetData).pipe(
      tap(response => console.log('✅ Nouveau budget créé:', response)),
      catchError(error => {
        console.error('❌ Erreur création budget:', error);
        throw error;
      })
    );
  }

  updateBudget(id: number, budgetData: UpdateBudgetRequest): Observable<UpdateBudgetResponse> {
    const url = `${this.baseUrl}/${id}`;
    this.invalidateCache('budget');
    
    return this.http.put<UpdateBudgetResponse>(url, budgetData).pipe(
      tap(response => console.log(`✅ Budget ${id} mis à jour:`, response)),
      catchError(error => {
        console.error(`❌ Erreur mise à jour budget ${id}:`, error);
        throw error;
      })
    );
  }

  // ========================
  // 🔹 ACTIONS SPÉCIFIQUES
  // ========================
  activerBudget(id: number): Observable<any> {
    this.invalidateCache(`budget-${id}`);
    return this.http.post(`${this.baseUrl}/${id}/activer`, {}).pipe(
      tap(response => console.log(`✅ Budget ${id} activé:`, response))
    );
  }

  desactiverBudget(id: number): Observable<any> {
    this.invalidateCache(`budget-${id}`);
    return this.http.post(`${this.baseUrl}/${id}/desactiver`, {}).pipe(
      tap(response => console.log(`✅ Budget ${id} désactivé:`, response))
    );
  }

  validerBudget(id: number): Observable<any> {
    this.invalidateCache(`budget-${id}`);
    return this.http.post(`${this.baseUrl}/${id}/valider`, {}).pipe(
      tap(response => console.log(`✅ Budget ${id} validé:`, response))
    );
  }

  rejeterBudget(id: number, commentaire: string): Observable<any> {
    const rejetRequest: RejetRequest = { commentaire };
    this.invalidateCache(`budget-${id}`);
    return this.http.post(`${this.baseUrl}/${id}/rejeter`, rejetRequest).pipe(
      tap(response => console.log(`✅ Budget ${id} rejeté:`, response))
    );
  }

  // ========================
  // 🔹 UTILITAIRES DE CACHE
  // ========================
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

  invalidateCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
      console.log(`🗑️ Cache invalidé pour pattern: ${pattern}`);
    } else {
      this.cache.clear();
      console.log('🗑️ Cache complètement invalidé');
    }
  }

  // ========================
  // 🔹 NORMALISATION & HELPERS
  // ========================
  private normalizeBudgetsResponse(data: BudgetsResponse): BudgetsResponse {
    return {
      total: this.ensureNumber(data.total),
      budgets: (data.budgets || []).map(budget => this.normalizeBudget(budget))
    };
  }

  private normalizeBudget(data: Budget): Budget {
    return {
      id: this.ensureNumber(data.id),
      code: data.code || 'N/A',
      intituleBudget: data.intituleBudget || 'Intitulé non défini',
      description: data.description || 'Aucune description',
      montantBudget: this.ensureNumber(data.montantBudget),
      dateCreation: data.dateCreation || new Date().toISOString().split('T')[0],
      dateModification: data.dateModification || new Date().toISOString(),
      dateDebut: data.dateDebut || new Date().toISOString().split('T')[0],
      dateFin: data.dateFin || new Date().toISOString().split('T')[0],
      statut: data.statut || 'BROUILLON',
      actif: Boolean(data.actif),
      createurNom: data.createurNom || 'Non spécifié',
      createurEmail: data.createurEmail || 'Non spécifié',
      entrepriseNom: data.entrepriseNom || 'Non spécifié'
    };
  }

  private ensureNumber(value: any): number {
    if (value === null || value === undefined) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : Math.max(0, num);
  }

  private getEmptyBudgetsResponse(): BudgetsResponse {
    return { total: 0, budgets: [] };
  }

  private getEmptyBudget(): Budget {
    return {
      id: 0,
      code: 'N/A',
      intituleBudget: 'Aucun budget trouvé',
      description: 'Aucune description disponible',
      montantBudget: 0,
      dateCreation: new Date().toISOString().split('T')[0],
      dateModification: new Date().toISOString(),
      dateDebut: new Date().toISOString().split('T')[0],
      dateFin: new Date().toISOString().split('T')[0],
      statut: 'EN_COURS',
      actif: false,
      createurNom: 'Non spécifié',
      createurEmail: 'Non spécifié',
      entrepriseNom: 'Non spécifié'
    };
  }

  // ========================
  // 🔹 MAPPERS D’AFFICHAGE
  // ========================
  mapStatutToDisplay(statut: string): string {
    const statutMap: { [key: string]: string } = {
      'VALIDE': 'Validé',
      'EN_COURS': 'En cours',
      'REFUSE': 'Refusé'
    };
    return statutMap[statut] || statut;
  }

  mapActifToDisplay(actif: boolean): string {
    return actif ? 'Actif' : 'Inactif';
  }

  getStatusBadgeClass(statut: string): string {
    const classMap: { [key: string]: string } = {
      'VALIDE': 'status-badge active',
      'EN_COURS': 'status-badge warning',
      'REFUSE': 'status-badge rejected'
    };
    return classMap[statut] || 'status-badge draft';
  }
}
