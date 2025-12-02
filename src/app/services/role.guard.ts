import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';  // adapte le chemin

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const expectedRole = route.data['role'];      // rôle attendu par la route
    const userRole = this.auth.getUserRole();     // rôle actuel stocké

    if (!userRole || userRole !== expectedRole) {
      this.router.navigate(['/forbidden']);                // ou tu peux renvoyer vers /forbidden
      return false;
    }

    return true;
  }
}
