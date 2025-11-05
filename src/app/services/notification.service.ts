import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface NotificationResponse {
  nombreNonLues: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) { }

  getUnreadCount(): Observable<NotificationResponse> {
    return this.http.get<NotificationResponse>(this.baseUrl).pipe(
      catchError(error => {
        console.error('Erreur API notifications:', error);
        return of({ nombreNonLues: 0 });
      })
    );
  }
}