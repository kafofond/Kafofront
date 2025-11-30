import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyVoirlignesRespo } from './contentbody-voirlignes-respo';

describe('ContentbodyVoirlignesRespo', () => {
  let component: ContentbodyVoirlignesRespo;
  let fixture: ComponentFixture<ContentbodyVoirlignesRespo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyVoirlignesRespo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyVoirlignesRespo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render search input and filter lignes by query', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('.search-input') as HTMLInputElement;
    expect(input).toBeTruthy();

    // arrange
    component.allLignes = [
      { id: 1, code: 'LG-001', intituleLigne: 'Marketing', description: 'Budget marketing', commentaire: 'Init', dateDeCreation: new Date(), statut: 'Validé', etat: true, dateDebut: new Date(), dateFin: new Date(), montantAlloue: 1000000, montantEngage: 100000, montantRestant: 900000, tauxUtilisation: 10, budgetId: 1, createurNom: 'John', createurEmail: 'john@test.com' } as any,
      { id: 2, code: 'LG-002', intituleLigne: 'R&D', description: 'Recherche', commentaire: 'N/A', dateDeCreation: new Date(), statut: 'En cours', etat: true, dateDebut: new Date(), dateFin: new Date(), montantAlloue: 2000000, montantEngage: 500000, montantRestant: 1500000, tauxUtilisation: 25, budgetId: 1, createurNom: 'Jane', createurEmail: 'jane@test.com' } as any
    ];
    component.lignes = [...component.allLignes];
    fixture.detectChanges();

    component.searchQuery = 'R&D';
    fixture.detectChanges();

    expect(component.displayLignes.length).toBe(1);
    expect(component.displayLignes[0].code).toBe('LG-002');
  });
});
