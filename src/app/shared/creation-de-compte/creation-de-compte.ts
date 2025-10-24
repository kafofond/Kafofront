import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms'; // <-- Ajoute ceci


@Component({
  selector: 'app-creation-de-compte',
  imports: [RouterLink, FormsModule],
  templateUrl: './creation-de-compte.html',
  styleUrl: './creation-de-compte.css'
})
export class CreationDeCompte {

  constructor(private router: Router) {}

  login(form: any) {
    // ici tu vérifies le formulaire, puis tu rediriges
    if (form.valid) {
      this.router.navigate(['']);
    }
  }

}
