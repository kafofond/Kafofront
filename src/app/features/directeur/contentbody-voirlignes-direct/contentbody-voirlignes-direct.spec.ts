import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyVoirlignesDirect } from './contentbody-voirlignes-direct';
import { LigneBudget } from '../../../models/ligne-budget.model';

describe('ContentbodyVoirlignesDirect', () => {
  let component: ContentbodyVoirlignesDirect;
  let fixture: ComponentFixture<ContentbodyVoirlignesDirect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyVoirlignesDirect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyVoirlignesDirect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a search input in the header and filter displayed lignes by query', () => {
    // Setup some mock lignes
    const lignes: LigneBudget[] = [
      { code: 'LIG001', intituleLigne: 'Achat Materiel', description: 'Ordinateurs', commentaire: 'Urgent', statut: 'En cours', montantAlloue: 1000000, montantEngage: 200000, tauxUtilisation: 20, etat: true, dateDeCreation: new Date(), montantRestant: 800000, id: 1, budgetId: 1, createurNom: 'Alice'},
      { code: 'LIG002', intituleLigne: 'Achat Licence', description: 'Licences', commentaire: '', statut: 'Validé', montantAlloue: 500000, montantEngage: 500000, tauxUtilisation: 100, etat: true, dateDeCreation: new Date(), montantRestant: 0, id: 2, budgetId: 1, createurNom: 'Bob'}
    ];

    component.allLignes = lignes;
    component.lignes = [...lignes];
    fixture.detectChanges();

    // Ensure the search input is present
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('.search-input') as HTMLInputElement | null;
    expect(input).toBeTruthy();

    // Filter by code 'LIG001'
    component.searchQuery = 'LIG001';
    component.onSearchQueryChange();
    fixture.detectChanges();

    expect(component.lignes.length).toBe(1);
    expect(component.lignes[0].code).toBe('LIG001');
  });
});
