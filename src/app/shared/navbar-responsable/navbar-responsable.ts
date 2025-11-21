import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-navbar-responsable',
  imports: [CommonModule, NotificationComponent],
  templateUrl: './navbar-responsable.html',
  styleUrl: './navbar-responsable.css'
})
export class NavbarResponsable implements OnInit {
  pageTitle: string = 'Tableau de bord';
  breadcrumb: string = 'Vue d\'ensemble';
  userName: string = 'Utilisateur';
  userRole: string = 'Responsable';
  userRoleDisplay: string = 'Responsable';
  userInitials: string = 'UU';
  unreadNotifications: number = 0;

  private routeTitles: { [key: string]: { title: string, breadcrumb: string } } = {
    'responsable': { title: 'Tableau de bord', breadcrumb: 'Vue d\'ensemble' },
    'responsable/listbudget-responsable': { title: 'Gestion des budgets', breadcrumb: 'Liste des budgets' },
    'responsable/listbudget-responsable/listlignesbudget-responsable': { title: 'Détails du budget', breadcrumb: 'Lignes budgétaires' },
    'responsable/depenses-responsable': { title: 'Suivi des dépenses', breadcrumb: 'Dépenses' },
    'responsable/gestion-prelevement': { title: 'Gestion des prélèvements', breadcrumb: 'Prélèvements' },
    'responsable/bons-de-commande-responsable': { title: 'Bons de commande', breadcrumb: 'Commandes' },
    'responsable/attestation-de-service-fait-responsable': { title: 'Attestations de service fait', breadcrumb: 'Attestations' },
    'responsable/validation-responsable': { title: 'Historique des validations', breadcrumb: 'Validations' },
    'responsable/parametres-responsable': { title: 'Paramètres', breadcrumb: 'Configuration' }
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
    return role === 'RESPONSABLE' ? 'Responsable' : 'Utilisateur';
  }

  onNotificationsClick() {
    console.log('Page notifications pas encore implémentée');
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    if (searchTerm.trim()) {
      console.log('Recherche:', searchTerm);
      // Implémenter la logique de recherche
    }
  }
}