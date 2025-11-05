import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateEntrepriseRequest, Entreprise, EntrepriseResponse } from '../models/entreprise.model';


@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
  private baseUrl = 'http://localhost:8080/api/entreprises';

  constructor(private http: HttpClient) { }

  // Récupérer toutes les entreprises
  getEntreprises(): Observable<EntrepriseResponse> {
    return this.http.get<EntrepriseResponse>(this.baseUrl);
  }

  // Récupérer une entreprise par ID
  getEntrepriseById(id: number): Observable<Entreprise> {
    return this.http.get<Entreprise>(`${this.baseUrl}/${id}`);
  }

  // Créer une nouvelle entreprise
  createEntreprise(entreprise: CreateEntrepriseRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}`, entreprise);
  }

  // Modifier une entreprise
  updateEntreprise(id: number, entreprise: Entreprise): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, entreprise);
  }

  // Changer l'état d'une entreprise (activer/désactiver)
  changeEtatEntreprise(id: number, etat: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/etat?etat=${etat}`, {});
  }
}