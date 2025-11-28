import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forbidden-component',
  imports: [],
  templateUrl: './forbidden-component.html',
  styleUrl: './forbidden-component.css',
})
export class ForbiddenComponent {

  constructor(private router: Router) {}

  goLogin() {
    this.router.navigate(['/']); 
  }
  
}
