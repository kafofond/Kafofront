import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface NotificationResponse {
  nombreNonLues: number;
  utilisateurId?: number;
}

export interface Notification {
  id: number;
  titre: string;
  message: string;
  etat: boolean; // true = lu, false = non lu
  transmission: boolean;
  dateEnvoi: string;
  idDocument?: number;
  destinataire: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    motDePasse: string;
    departement: string;
    role: string;
    etat: boolean;
    dateCreation: string;
  };
}

export interface NotificationListResponse {
  total: number;
  utilisateurId: number;
  notifications: Notification[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) { }

  getUnreadCount(utilisateurId: number): Observable<NotificationResponse> {
    return this.http.get<NotificationResponse>(`${this.baseUrl}/utilisateur/${utilisateurId}/non-lues`).pipe(
      catchError(error => {
        console.error('Erreur API notifications:', error);
        return of({ nombreNonLues: 0 });
      })
    );
  }

  getAllNotifications(utilisateurId: number): Observable<NotificationListResponse> {
    return this.http.get<NotificationListResponse>(`${this.baseUrl}/utilisateur/${utilisateurId}`).pipe(
      catchError(error => {
        console.error('Erreur API notifications:', error);
        return of({ total: 0, utilisateurId, notifications: [] });
      })
    );
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${notificationId}/marquer-lu`, {}).pipe(
      catchError(error => {
        console.error('Erreur marquage notification lue:', error);
        return of({});
      })
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.post(`${this.baseUrl}/marquer-toutes-lues`, {}).pipe(
      catchError(error => {
        console.error('Erreur marquage toutes notifications lues:', error);
        return of({});
      })
    );
  }
}