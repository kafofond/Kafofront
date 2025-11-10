import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreateUserRequest, UtilisateurResponse, Utilisateur } from '../models/user.model';

export interface UserInfo {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  departement: string;
  actif: boolean;
  entrepriseId: number;
  entrepriseNom: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/utilisateurs';

  constructor(private http: HttpClient) { }

  getUserById(userId: number): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.baseUrl}/${userId}`).pipe(
      catchError(error => {
        console.error('Erreur API utilisateur:', error);
        return of({
          id: 0,
          nom: 'Utilisateur',
          prenom: 'Inconnu',
          email: 'user@example.com',
          role: 'USER',
          departement: '',
          actif: false,
          entrepriseId: 0,
          entrepriseNom: null
        });
      })
    );
  }

  // Récupérer tous les utilisateurs
  getUtilisateurs(): Observable<UtilisateurResponse> {
    return this.http.get<UtilisateurResponse>(this.baseUrl);
  }

  // Créer un nouvel utilisateur
  createUtilisateur(utilisateur: CreateUserRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}`, utilisateur);
  }

  // Modifier un utilisateur
  updateUtilisateur(id: number, utilisateur: Utilisateur): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, utilisateur);
  }

  // Désactiver un utilisateur
  desactiverUtilisateur(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/desactiver`, {});
  }

  // Réactiver un utilisateur
  reactiverUtilisateur(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/reactiver`, {});
  }
}