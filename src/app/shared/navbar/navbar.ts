import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, NotificationComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  pageTitle: string = 'Tableau de bord';
  breadcrumb: string = 'Vue d\'ensemble';
  userName: string = 'Utilisateur';
  userRole: string = 'Gestionnaire';
  userRoleDisplay: string = 'Gestionnaire';
  userInitials: string = 'UU';
  unreadNotifications: number = 0;

  private routeTitles: { [key: string]: { title: string, breadcrumb: string } } = {
    '': { title: 'Tableau de bord', breadcrumb: 'Vue d\'ensemble' },
    'listbudget-gest': { title: 'Gestion des budgets', breadcrumb: 'Budgets' },
    'listbudget-gest/listlignesbudget-gest': { title: 'Détails du budget', breadcrumb: 'Lignes budgétaires' },
    'fiche-de-besoin-gest': { title: 'Fiches de besoin', breadcrumb: 'Fiches' },
    'demande-achat-gest': { title: 'Demandes d\'achat', breadcrumb: 'Demandes' },
    'attestation-de-service-fait-gest': { title: 'Attestations de service fait', breadcrumb: 'Attestations' },
    'parametres-gest': { title: 'Paramètres', breadcrumb: 'Configuration' }
  };

  constructor(
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.loadNotifications();
    this.setupRouteListener();
    this.updatePageTitle(this.router.url);
  }

  private setupRouteListener() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updatePageTitle(event.url);
      });
  }

  private updatePageTitle(url: string) {
    // Nettoyer l'URL pour correspondre aux clés du mapping
    const cleanUrl = url.replace(/^\//, ''); // Retirer le slash initial
    
    if (this.routeTitles[cleanUrl]) {
      this.pageTitle = this.routeTitles[cleanUrl].title;
      this.breadcrumb = this.routeTitles[cleanUrl].breadcrumb;
    } else {
      // Fallback pour les routes non mappées
      this.pageTitle = 'Tableau de bord';
      this.breadcrumb = 'Vue d\'ensemble';
    }
  }

  private loadUserInfo() {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.userId || 1;
      
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.userName = `${user.prenom} ${user.nom}`;
          this.userInitials = (user.prenom.charAt(0) + user.nom.charAt(0)).toUpperCase();
          this.userRoleDisplay = this.mapRoleToDisplay(user.role);
          this.userRole = this.getRoleText(user.role);
        },
        error: (error) => {
          console.error('Erreur chargement utilisateur:', error);
        }
      });
    } catch (error) {
      console.error('Erreur décodage token:', error);
    }
  }

  private loadNotifications() {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.userId || 1;
      
      this.notificationService.getUnreadCount(userId).subscribe({
        next: (response) => {
          this.unreadNotifications = response.nombreNonLues;
        },
        error: (error) => {
          console.error('Erreur chargement notifications:', error);
        }
      });
    } catch (error) {
      console.error('Erreur décodage token:', error);
    }
  }

  private mapRoleToDisplay(role: string): string {
    const roleMap: { [key: string]: string } = {
      'TRESORERIE': 'Trésorier',
      'GESTIONNAIRE': 'Gestionnaire',
      'COMPTABLE': 'Comptable',
      'RESPONSABLE': 'Responsable',
      'DIRECTEUR': 'Directeur',
      'ADMIN': 'Administrateur',
      'SUPER_ADMIN': 'Administrateur système',
      'DSI': 'Administrateur DSI'
    };
    return roleMap[role] || 'Utilisateur';
  }

  private getRoleText(role: string): string {
    return role === 'GESTIONNAIRE' ? 'Gestionnaire' : 'Utilisateur';
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    if (searchTerm.trim()) {
      console.log('Recherche:', searchTerm);
      // Implémenter la logique de recherche
    }
  }
}