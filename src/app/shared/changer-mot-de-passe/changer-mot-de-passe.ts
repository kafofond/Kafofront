import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-changer-mot-de-passe',
  imports: [FormsModule, CommonModule],
  templateUrl: './changer-mot-de-passe.html',
  styleUrl: './changer-mot-de-passe.css'
})
export class ChangerMotDePasse implements OnInit, OnDestroy {
  code: string = '';
  nouveauMotDePasse: string = '';
  confirmationMotDePasse: string = '';
  email: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showNewPassword: boolean = false; 
  showConfirmPassword: boolean = false;
  private emailTimeout: any;
  private errorTimeout: any;
  private successTimeout: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const storedEmail = localStorage.getItem('reset_email');
    if (storedEmail) {
      this.email = storedEmail;
      
      // Faire disparaître l'email après 10 secondes
      this.emailTimeout = setTimeout(() => {
        this.email = '';
      }, 10000);
    }
  }

  ngOnDestroy() {
    if (this.emailTimeout) {
      clearTimeout(this.emailTimeout);
    }
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }
  }

  goToLogin() {
    this.router.navigate(['/seconnecter']);
  }

  passwordsMismatch(): boolean {
    return this.nouveauMotDePasse !== this.confirmationMotDePasse && 
           this.confirmationMotDePasse.length > 0;
  }

  resetPassword(form: any) {
    if (form.valid && !this.passwordsMismatch()) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Annuler les timeouts existants
      this.clearAllTimeouts();

      const resetData = {
        code: this.code,
        nouveauMotDePasse: this.nouveauMotDePasse,
        confirmationMotDePasse: this.confirmationMotDePasse
      };

      this.authService.resetPassword(resetData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('Mot de passe réinitialisé avec succès', response);
          
          this.successMessage = 'Mot de passe réinitialisé avec succès !';
          
          localStorage.removeItem('reset_email');
          
          // Faire disparaître le message de succès après 2 secondes
          this.successTimeout = setTimeout(() => {
            this.successMessage = '';
          }, 2000);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Erreur réinitialisation', error);
          
          if (error.status === 400) {
            this.errorMessage = 'Code invalide ou expiré';
          } else if (error.status === 0) {
            this.errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
          } else {
            this.errorMessage = error.message || 'Une erreur est survenue lors de la réinitialisation';
          }
          
          // Faire disparaître le message d'erreur après 10 secondes
          this.errorTimeout = setTimeout(() => {
            this.errorMessage = '';
          }, 10000);
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
      
      // Faire disparaître le message d'erreur de validation après 10 secondes
      this.errorTimeout = setTimeout(() => {
        this.errorMessage = '';
      }, 10000);
    }
  }

  private clearAllTimeouts() {
    if (this.emailTimeout) {
      clearTimeout(this.emailTimeout);
      this.emailTimeout = null;
    }
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
      this.successTimeout = null;
    }
  }

  // Ajoutez ces méthodes
  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}