import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-se-connecter',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './se-connecter.html',
  styleUrl: './se-connecter.css'
})
export class SeConnecter {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;
  private errorTimeout: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  private clearErrorAfterTimeout() {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
    this.errorTimeout = setTimeout(() => {
      this.errorMessage = '';
    }, 10000);
  }

  sendResetCode() {
    if (this.email) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const requestData = {
        email: this.email
      };

      this.authService.requestPasswordReset(requestData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('Code envoyé avec succès', response);
          //this.successMessage = 'Code de réinitialisation envoyé à votre email';
          localStorage.setItem('reset_email', this.email);
          
          setTimeout(() => {
            this.router.navigate(['/mot-de-passe-oublie']);
          }, 2000);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Erreur envoi code', error);
          
          if (error.status === 404) {
            this.errorMessage = 'Aucun compte trouvé avec cet email';
          } else if (error.status === 0) {
            this.errorMessage = 'Impossible de se connecter. Vérifiez votre connexion.';
          } else {
            this.errorMessage = error.message || 'Une erreur est survenue lors de l\'envoi du code';
          }
          
          this.clearErrorAfterTimeout();
        }
      });
    } else {
      this.errorMessage = 'Veuillez d\'abord entrer votre adresse email';
      this.clearErrorAfterTimeout();
    }
  }

  login(form: any) {
    if (form.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const loginData = {
        email: this.email,
        motDePasse: this.password
      };

      console.log('🔄 Tentative de connexion avec:', this.email);

      this.authService.login(loginData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('✅ Connexion réussie - Réponse complète:', response);
          
          if (response.token) {
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user_email', this.email);
            localStorage.setItem('user_role', response.role);
            
            console.log('🔑 Token stocké, rôle:', response.role);
            console.log('📍 Début de la redirection...');
            
            this.redirectBasedOnRole(response.role);
          } else {
            console.warn('❌ Pas de token dans la réponse, redirection par défaut');
            this.router.navigate(['/']);
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('❌ Erreur de connexion:', error);
          
          if (error.status === 401) {
            this.errorMessage = 'Email ou mot de passe incorrect';
          } else if (error.status === 0) {
            this.errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
          } else {
            this.errorMessage = error.message || 'Une erreur est survenue lors de la connexion';
          }
          
          this.clearErrorAfterTimeout();
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      this.clearErrorAfterTimeout();
    }
  }

  private redirectBasedOnRole(role: string) {
    console.log('Redirection basée sur le rôle:', role);
    
    if (!role) {
      console.warn('Aucun rôle trouvé, redirection par défaut');
      this.router.navigate(['/']);
      return;
    }
    
    const roleMapping: { [key: string]: string } = {
      'SUPER_ADMIN': '/admin-system',
      'ADMIN': '/dsi',
      'DIRECTEUR': '/directeur',
      'RESPONSABLE': '/responsable', 
      'COMPTABLE': '/comptable',
      'GESTIONNAIRE': '/'
    };
    
    const route = roleMapping[role] || '/';
    console.log(`Redirection vers: ${route} pour le rôle: ${role}`);
    this.router.navigate([route]);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy() {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }
}