import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyListbudgetDirect } from './contentbody-listbudget-direct';

describe('ContentbodyListbudgetDirect', () => {
  let component: ContentbodyListbudgetDirect;
  let fixture: ComponentFixture<ContentbodyListbudgetDirect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyListbudgetDirect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyListbudgetDirect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render search input and filter budgets by query', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('.search-input') as HTMLInputElement;
    expect(input).toBeTruthy();

    // Arrange
    component.allBudgets = [
      { id: 1, codeBudget: 'BUD-001', intituleBudget: 'Marketing', description: 'Marketing 2026', montantBudget: 1000000, dateDeCreation: new Date(), dateDeDebut: new Date(), dateDeFin: new Date(), etat: 'Actif', statut: 'Validé' } as any,
      { id: 2, codeBudget: 'BUD-002', intituleBudget: 'R&D', description: 'Research', montantBudget: 2000000, dateDeCreation: new Date(), dateDeDebut: new Date(), dateDeFin: new Date(), etat: 'Actif', statut: 'En cours' } as any
    ];
    component.updatePagination();
    fixture.detectChanges();

    component.searchQuery = 'R&D';
    component.updatePagination();
    fixture.detectChanges();

    // There should be only one item visible in budgets
    expect(component.budgets.length).toBe(1);
    expect(component.budgets[0].codeBudget).toBe('BUD-002');
  });
});
