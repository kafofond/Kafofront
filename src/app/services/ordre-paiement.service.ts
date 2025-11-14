import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface OrdrePaiement {
  id: number;
  code: string;
  referenceDecisionPrelevement: string | null;
  montant: number;
  description: string;
  compteOrigine: string;
  compteDestinataire: string;
  dateExecution: string | null;
  dateCreation: string;
  dateModification: string;
  statut: 'VALIDE' | 'EN_COURS' | 'APPROUVE' | 'REJETE';
  createurNom: string;
  createurEmail: string;
  entrepriseNom: string;
  decisionId: number | null;
}

export interface OrdresResponse {
  ordres: OrdrePaiement[];
}

export interface OrdreDetailResponse {
  ordre: OrdrePaiement;
  commentaires: any[];
}

export interface OrdreActionResponse {
  ordre: OrdrePaiement;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdrePaiementService {
  private baseUrl = 'http://localhost:8080/api/ordres-paiement';

  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 30000;

  constructor(private http: HttpClient) {}

  // Récupérer tous les ordres de paiement de l'entreprise
  getOrdresByEntreprise(entrepriseId: number): Observable<OrdresResponse> {
    const cacheKey = `ordres-entreprise-${entrepriseId}`;
    
    return this.getCachedOrFetch<OrdresResponse>(
      cacheKey,
      `${this.baseUrl}/entreprise/${entrepriseId}`
    ).pipe(
      tap(data => console.log('📊 Ordres paiement reçus:', data)),
      map(data => this.normalizeOrdresResponse(data)),
      catchError((error) => {
        console.error('Erreur API ordres paiement:', error);
        return of(this.getEmptyOrdresResponse());
      })
    );
  }

  // Récupérer un ordre spécifique par ID
  getOrdreById(id: number): Observable<OrdreDetailResponse> {
    const cacheKey = `ordre-${id}`;
    
    return this.getCachedOrFetch<OrdreDetailResponse>(
      cacheKey,
      `${this.baseUrl}/${id}`
    ).pipe(
      tap(data => console.log(`📋 Détails ordre ${id} reçus:`, data)),
      map(data => this.normalizeOrdreDetail(data)),
      catchError((error) => {
        console.error(`Erreur API ordre ${id}:`, error);
        return of(this.getEmptyOrdreDetail());
      })
    );
  }

  // Approuver un ordre de paiement
  approuverOrdre(id: number): Observable<OrdreActionResponse> {
    this.invalidateCache('ordres');
    
    return this.http.post<OrdreActionResponse>(`${this.baseUrl}/${id}/approuver`, {}).pipe(
      tap(response => console.log(`✅ Ordre ${id} approuvé:`, response)),
      catchError((error) => {
        console.error(`❌ Erreur approbation ordre ${id}:`, error);
        throw error;
      })
    );
  }

  // Rejeter un ordre de paiement
  rejeterOrdre(id: number, commentaire: string): Observable<OrdreActionResponse> {
    this.invalidateCache('ordres');
    
    return this.http.post<OrdreActionResponse>(`${this.baseUrl}/${id}/rejeter`, { commentaire }).pipe(
      tap(response => console.log(`❌ Ordre ${id} rejeté:`, response)),
      catchError((error) => {
        console.error(`❌ Erreur rejet ordre ${id}:`, error);
        throw error;
      })
    );
  }

  // Créer un ordre de paiement
  createOrdre(ordreData: any): Observable<OrdreActionResponse> {
    this.invalidateCache('ordres');
    
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    return this.http.post<OrdreActionResponse>(`${this.baseUrl}`, ordreData, { headers }).pipe(
      tap(response => console.log(`✅ Ordre créé:`, response)),
      catchError((error) => {
        console.error(`❌ Erreur création ordre:`, error);
        throw error;
      })
    );
  }

  // Modifier un ordre de paiement
  updateOrdre(id: number, ordreData: any): Observable<OrdreActionResponse> {
    this.invalidateCache('ordres');
    
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    return this.http.put<OrdreActionResponse>(`${this.baseUrl}/${id}`, ordreData, { headers }).pipe(
      tap(response => console.log(`✅ Ordre ${id} modifié:`, response)),
      catchError((error) => {
        console.error(`❌ Erreur modification ordre ${id}:`, error);
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
  private normalizeOrdresResponse(data: OrdresResponse): OrdresResponse {
    return {
      ordres: (data.ordres || []).map(ordre => this.normalizeOrdre(ordre))
    };
  }

  private normalizeOrdre(data: OrdrePaiement): OrdrePaiement {
    return {
      id: this.ensureNumber(data.id),
      code: data.code || 'N/A',
      referenceDecisionPrelevement: data.referenceDecisionPrelevement,
      montant: this.ensureNumber(data.montant),
      description: data.description || 'Aucune description',
      compteOrigine: data.compteOrigine || 'Non spécifié',
      compteDestinataire: data.compteDestinataire || 'Non spécifié',
      dateExecution: data.dateExecution,
      dateCreation: data.dateCreation || new Date().toISOString().split('T')[0],
      dateModification: data.dateModification || new Date().toISOString(),
      statut: data.statut || 'EN_COURS',
      createurNom: data.createurNom || 'Non spécifié',
      createurEmail: data.createurEmail || 'Non spécifié',
      entrepriseNom: data.entrepriseNom || 'Non spécifié',
      decisionId: data.decisionId
    };
  }

  private normalizeOrdreDetail(data: OrdreDetailResponse): OrdreDetailResponse {
    return {
      ordre: this.normalizeOrdre(data.ordre),
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
  private getEmptyOrdresResponse(): OrdresResponse {
    return {
      ordres: []
    };
  }

  private getEmptyOrdreDetail(): OrdreDetailResponse {
    return {
      ordre: this.getEmptyOrdre(),
      commentaires: []
    };
  }

  private getEmptyOrdre(): OrdrePaiement {
    return {
      id: 0,
      code: 'N/A',
      referenceDecisionPrelevement: null,
      montant: 0,
      description: 'Aucune description',
      compteOrigine: 'Non spécifié',
      compteDestinataire: 'Non spécifié',
      dateExecution: null,
      dateCreation: new Date().toISOString().split('T')[0],
      dateModification: new Date().toISOString(),
      statut: 'EN_COURS',
      createurNom: 'Non spécifié',
      createurEmail: 'Non spécifié',
      entrepriseNom: 'Non spécifié',
      decisionId: null
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