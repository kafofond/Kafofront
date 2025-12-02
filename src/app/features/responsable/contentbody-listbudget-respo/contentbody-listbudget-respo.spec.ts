import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyListbudgetRespo } from './contentbody-listbudget-respo';

describe('ContentbodyListbudgetRespo', () => {
  let component: ContentbodyListbudgetRespo;
  let fixture: ComponentFixture<ContentbodyListbudgetRespo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyListbudgetRespo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyListbudgetRespo);
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

    // arrange
    component.allBudgets = [
      { id: 1, codeBudget: 'BUD-001', intituleBudget: 'Marketing', description: 'Marketing 2026', montantBudget: 1000000, dateDeCreation: new Date(), dateDeDebut: new Date(), dateDeFin: new Date(), etat: 'Actif', statut: 'Validé' },
      { id: 2, codeBudget: 'BUD-002', intituleBudget: 'R&D', description: 'Recherche', montantBudget: 2000000, dateDeCreation: new Date(), dateDeDebut: new Date(), dateDeFin: new Date(), etat: 'Actif', statut: 'En cours' }
    ] as any;
    component.budgets = [...component.allBudgets];
    fixture.detectChanges();

    component.searchQuery = 'R&D';
    fixture.detectChanges();

    expect(component.displayBudgets.length).toBe(1);
    expect(component.displayBudgets[0].codeBudget).toBe('BUD-002');
  });
});
