import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Budget } from '../models/budget';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = 'http://localhost:8080/api/budgets';

  constructor(private http: HttpClient) {}

  // getBudgets(): Observable<{total: number, budgets: Budget[]}> {
  //   return this.http.get<{total: number, budgets: Budget[]}>(this.apiUrl);
  // }
  getBudgets(): Observable<any> {
  return this.http.get(`${this.apiUrl}`);
}

  
}
