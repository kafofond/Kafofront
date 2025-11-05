import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Budget } from '../../../models/budget';
import { BudgetService } from '../../../services/budget-service';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-contentbody-listbudget-gest',
  imports: [RouterLink, CommonModule, DatePipe, DecimalPipe],
  templateUrl: './contentbody-listbudget-gest.html',
  styleUrl: './contentbody-listbudget-gest.css'
})
export class ContentbodyListbudgetGest {

  budgets: Budget[] = [];

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.budgetService.getBudgets().subscribe({
      next: (response) => {
        this.budgets = response.budgets || [];
      },
      error: (err) => {
        console.log("Erreur lors du chargement des budgets :", err);
        
      }
    })
  }
}
