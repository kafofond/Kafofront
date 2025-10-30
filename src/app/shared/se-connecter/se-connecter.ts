import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-se-connecter',
  imports: [RouterLink, FormsModule],
  templateUrl: './se-connecter.html',
  styleUrl: './se-connecter.css'
})
export class SeConnecter {

  constructor(private router: Router) {}

  login(form: any) {
    // ici tu vérifies le formulaire, puis tu rediriges
    if (form.valid) {
      this.router.navigate(['']);
    }
  }

}
