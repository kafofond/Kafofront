import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface DecisionPrelevement {
  id: number;
  code: string;
  referenceAttestation: string | null;
  montant: number;
  compteOrigine: string;
  compteDestinataire: string;
  motifPrelevement: string;
  dateCreation: string;
  dateModification: string;
  statut: 'VALIDE' | 'EN_COURS' | 'APPROUVE' | 'REJETE';
  createurNom: string;
  createurEmail: string;
  entrepriseNom: string;
  attestationId: number | null;
}

export interface DecisionsResponse {
  total: number;
  entrepriseId: number;
  decisions: DecisionPrelevement[];
}

export interface DecisionDetailResponse {
  decision: DecisionPrelevement;
  commentaires: any[];
}

export interface ActionResponse {
  decision: DecisionPrelevement;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class DecisionPrelevementService {
  private baseUrl = 'http://localhost:8080/api/decisions-prelevement';

  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 30000;

  constructor(private http: HttpClient) {}

  // Récupérer toutes les décisions de prélèvement de l'entreprise
  getDecisionsByEntreprise(entrepriseId: number): Observable<DecisionsResponse> {
    const cacheKey = `decisions-entreprise-${entrepriseId}`;
    
    return this.getCachedOrFetch<DecisionsResponse>(
      cacheKey,
      `${this.baseUrl}/entreprise/${entrepriseId}`
    ).pipe(
      tap(data => console.log('📊 Décisions prélèvement reçues:', data)),
      map(data => this.normalizeDecisionsResponse(data)),
      catchError((error) => {
        console.error('Erreur API décisions prélèvement:', error);
        return of(this.getEmptyDecisionsResponse());
      })
    );
  }

  // Récupérer une décision spécifique par ID
  getDecisionById(id: number): Observable<DecisionDetailResponse> {
    const cacheKey = `decision-${id}`;
    
    return this.getCachedOrFetch<DecisionDetailResponse>(
      cacheKey,
      `${this.baseUrl}/${id}`
    ).pipe(
      tap(data => console.log(`📋 Détails décision ${id} reçus:`, data)),
      map(data => this.normalizeDecisionDetail(data)),
      catchError((error) => {
        console.error(`Erreur API décision ${id}:`, error);
        return of(this.getEmptyDecisionDetail());
      })
    );
  }

  // Approuver une décision de prélèvement
  approuverDecision(id: number): Observable<ActionResponse> {
    this.invalidateCache('decisions');
    
    return this.http.post<ActionResponse>(`${this.baseUrl}/${id}/approuver`, {}).pipe(
      tap(response => console.log(`✅ Décision ${id} approuvée:`, response)),
      catchError((error) => {
        console.error(`❌ Erreur approbation décision ${id}:`, error);
        throw error;
      })
    );
  }

  // Rejeter une décision de prélèvement
  rejeterDecision(id: number, commentaire: string): Observable<ActionResponse> {
    this.invalidateCache('decisions');
    
    return this.http.post<ActionResponse>(`${this.baseUrl}/${id}/rejeter`, { commentaire }).pipe(
      tap(response => console.log(`❌ Décision ${id} rejetée:`, response)),
      catchError((error) => {
        console.error(`❌ Erreur rejet décision ${id}:`, error);
        throw error;
      })
    );
  }

  // Valider une décision de prélèvement (pour le comptable)
  validerDecision(id: number): Observable<ActionResponse> {
    this.invalidateCache('decisions');
    
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    return this.http.post<ActionResponse>(`${this.baseUrl}/${id}/valider`, {}, { headers }).pipe(
      tap(response => console.log(`✅ Décision ${id} validée:`, response)),
      catchError((error) => {
        console.error(`❌ Erreur validation décision ${id}:`, error);
        throw error;
      })
    );
  }

  // Modifier une décision de prélèvement
  updateDecision(id: number, decisionData: any): Observable<ActionResponse> {
    this.invalidateCache('decisions');
    
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    return this.http.put<ActionResponse>(`${this.baseUrl}/${id}`, decisionData, { headers }).pipe(
      tap(response => console.log(`✅ Décision ${id} modifiée:`, response)),
      catchError((error) => {
        console.error(`❌ Erreur modification décision ${id}:`, error);
        throw error;
      })
    );
  }

  // Créer une décision de prélèvement
  createDecision(decisionData: any): Observable<ActionResponse> {
    this.invalidateCache('decisions');
    
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    return this.http.post<ActionResponse>(`${this.baseUrl}`, decisionData, { headers }).pipe(
      tap(response => console.log(`✅ Décision créée:`, response)),
      catchError((error) => {
        console.error(`❌ Erreur création décision:`, error);
        throw error;
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

  // NORMALISATION DES DONNÉES
  private normalizeDecisionsResponse(data: DecisionsResponse): DecisionsResponse {
    return {
      total: this.ensureNumber(data.total),
      entrepriseId: this.ensureNumber(data.entrepriseId),
      decisions: (data.decisions || []).map(decision => this.normalizeDecision(decision))
    };
  }

  private normalizeDecision(data: DecisionPrelevement): DecisionPrelevement {
    return {
      id: this.ensureNumber(data.id),
      code: data.code || 'N/A',
      referenceAttestation: data.referenceAttestation,
      montant: this.ensureNumber(data.montant),
      compteOrigine: data.compteOrigine || 'Non spécifié',
      compteDestinataire: data.compteDestinataire || 'Non spécifié',
      motifPrelevement: data.motifPrelevement || 'Aucun motif',
      dateCreation: data.dateCreation || new Date().toISOString().split('T')[0],
      dateModification: data.dateModification || new Date().toISOString(),
      statut: data.statut || 'EN_COURS',
      createurNom: data.createurNom || 'Non spécifié',
      createurEmail: data.createurEmail || 'Non spécifié',
      entrepriseNom: data.entrepriseNom || 'Non spécifié',
      attestationId: data.attestationId
    };
  }

  private normalizeDecisionDetail(data: DecisionDetailResponse): DecisionDetailResponse {
    return {
      decision: this.normalizeDecision(data.decision),
      commentaires: data.commentaires || []
    };
  }

  // FONCTIONS DE VALIDATION
  private ensureNumber(value: any): number {
    if (value === null || value === undefined) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : Math.max(0, num);
  }

  // FONCTIONS POUR DONNÉES VIDE
  private getEmptyDecisionsResponse(): DecisionsResponse {
    return {
      total: 0,
      entrepriseId: 0,
      decisions: []
    };
  }

  private getEmptyDecisionDetail(): DecisionDetailResponse {
    return {
      decision: this.getEmptyDecision(),
      commentaires: []
    };
  }

  private getEmptyDecision(): DecisionPrelevement {
    return {
      id: 0,
      code: 'N/A',
      referenceAttestation: null,
      montant: 0,
      compteOrigine: 'Non spécifié',
      compteDestinataire: 'Non spécifié',
      motifPrelevement: 'Aucun motif',
      dateCreation: new Date().toISOString().split('T')[0],
      dateModification: new Date().toISOString(),
      statut: 'EN_COURS',
      createurNom: 'Non spécifié',
      createurEmail: 'Non spécifié',
      entrepriseNom: 'Non spécifié',
      attestationId: null
    };
  }

  // UTILITAIRES
  mapStatutToDisplay(statut: string): string {
    const statutMap: { [key: string]: string } = {
      'VALIDE': 'Validé',
      'EN_COURS': 'En cours',
      'APPROUVE': 'Approuvé',
      'REJETE': 'Rejeté'
    };
    return statutMap[statut] || statut;
  }

  getStatusBadgeClass(statut: string): string {
    const classMap: { [key: string]: string } = {
      'VALIDE': 'status-badge status-success',
      'APPROUVE': 'status-badge status-success',
      'EN_COURS': 'status-badge status-pending',
      'REJETE': 'status-badge status-danger'
    };
    return classMap[statut] || 'status-badge status-pending';
  }
}