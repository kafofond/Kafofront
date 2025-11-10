import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-password-reset',
  imports: [FormsModule, CommonModule],
  templateUrl: './password-reset.html',
  styleUrl: './password-reset.css'
})
export class PasswordResetComponent implements OnInit {
  code: string = '';
  nouveauMotDePasse: string = '';
  confirmationMotDePasse: string = '';
  email: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const storedEmail = localStorage.getItem('reset_email');
    if (storedEmail) {
      this.email = storedEmail;
    }
  }

  // Méthode pour la navigation
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
          
          setTimeout(() => {
            this.router.navigate(['/seconnecter']);
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
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
    }
  }
}