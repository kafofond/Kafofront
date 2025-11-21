import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification, NotificationListResponse } from '../../services/notification.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount: number = 0;
  isLoading: boolean = false;
  showNotifications: boolean = false;

  @Output() notificationClick = new EventEmitter<void>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.isLoading = true;
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.userId || 1;
        
        // Charger le nombre de notifications non lues
        this.notificationService.getUnreadCount(userId).subscribe({
          next: (response) => {
            this.unreadCount = response.nombreNonLues || 0;
          },
          error: (error: any) => {
            console.error('Erreur chargement nombre notifications non lues:', error);
          }
        });

        // Charger toutes les notifications
        this.notificationService.getAllNotifications(userId).subscribe({
          next: (response: NotificationListResponse) => {
            this.notifications = response.notifications || [];
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error('Erreur chargement notifications:', error);
            this.isLoading = false;
          }
        });
      } catch (error) {
        console.error('Erreur décodage token:', error);
        this.isLoading = false;
      }
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map(notification => ({
          ...notification,
          etat: true
        }));
        this.unreadCount = 0;
      },
      error: (error: any) => {
        console.error('Erreur marquage notifications lues:', error);
      }
    });
  }

  markAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.etat = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      },
      error: (error: any) => {
        console.error('Erreur marquage notification lue:', error);
      }
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications && this.unreadCount > 0) {
      //this.markAllAsRead();
    }
    this.notificationClick.emit();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Méthode pour formater les titres qui contiennent des types de documents
  formatNotificationTitle(title: string): string {
    if (!title) return title;
    
    // Mapping des types de documents en majuscules vers leur version formatée
    const typeMappings: { [key: string]: string } = {
      'BUDGET': 'Budget',
      'LIGNE_CREDIT': 'Ligne de crédit',
      'FICHE_BESOIN': 'Fiche de besoin',
      'DEMANDE_ACHAT': 'Demande d\'achat',
      'BON_COMMANDE': 'Bon de commande',
      'ATTESTATION_SERVICE_FAIT': 'Attestation de service fait',
      'DECISION_PRELEVEMENT': 'Décision de prélèvement',
      'ORDRE_PAIEMENT': 'Ordre de paiement'
    };
    
    // Remplacer chaque type de document trouvé dans le titre
    let formattedTitle = title;
    for (const [key, value] of Object.entries(typeMappings)) {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      formattedTitle = formattedTitle.replace(regex, value);
    }
    
    return formattedTitle;
  }

  onNotificationClick(notification: Notification) {
    this.markAsRead(notification.id);
    this.showNotifications = false;
    
    // Si la notification est liée à un document, naviguer vers ce document
    if (notification.idDocument) {
      // Implémenter la navigation vers le document
      console.log('Navigation vers le document:', notification.idDocument);
    }
  }
}