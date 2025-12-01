import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seuil, SeuilsResponse, SeuilResponse } from '../models/seuil.model';

@Injectable({
  providedIn: 'root'
})
export class SeuilService {
  private baseUrl = 'http://localhost:8080/api/seuils';

  constructor(private http: HttpClient) { }

  /**
   * Récupérer tous les seuils
   */
  getSeuils(): Observable<SeuilsResponse> {
    return this.http.get<SeuilsResponse>(this.baseUrl);
  }

  /**
   * Récupérer le seuil actif
   */
  getSeuilActif(): Observable<Seuil> {
    return this.http.get<Seuil>(`${this.baseUrl}/actif`);
  }

  /**
   * Récupérer un seuil par ID
   */
  getSeuilById(id: number): Observable<Seuil> {
    return this.http.get<Seuil>(`${this.baseUrl}/${id}`);
  }

  /**
   * Créer un nouveau seuil
   */
  createSeuil(montantSeuil: number): Observable<SeuilResponse> {
    return this.http.post<SeuilResponse>(this.baseUrl, { montantSeuil });
  }

  /**
   * Modifier un seuil
   */
  updateSeuil(id: number, montantSeuil: number): Observable<SeuilResponse> {
    return this.http.put<SeuilResponse>(`${this.baseUrl}/${id}`, { montantSeuil });
  }

  /**
   * Activer un seuil
   */
  activerSeuil(id: number): Observable<SeuilResponse> {
    return this.http.post<SeuilResponse>(`${this.baseUrl}/${id}/activer`, {});
  }

  /**
   * Désactiver un seuil
   */
  desactiverSeuil(id: number): Observable<SeuilResponse> {
    return this.http.post<SeuilResponse>(`${this.baseUrl}/${id}/desactiver`, {});
  }
}