import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyVoirlignesGest } from './contentbody-voirlignes-gest';

describe('ContentbodyVoirlignesGest', () => {
  let component: ContentbodyVoirlignesGest;
  let fixture: ComponentFixture<ContentbodyVoirlignesGest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyVoirlignesGest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyVoirlignesGest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter lignes by search query', () => {
    // Setup simple data
    component.allLignes = [
      { id: 1, code: 'L1', intituleLigne: 'Achat de matériel', description: '', dateDeCreation: new Date(), commentaire: 'Important', statut: 'En cours', etat: true, dateDebut: new Date(), dateFin: new Date(), montantAlloue: 1000, montantEngage: 200, montantRestant: 800, tauxUtilisation: 20, budgetId: 1, createurNom: '', createurEmail: '' },
      { id: 2, code: 'L2', intituleLigne: 'Formation', description: '', dateDeCreation: new Date(), commentaire: '', statut: 'Validé', etat: true, dateDebut: new Date(), dateFin: new Date(), montantAlloue: 2000, montantEngage: 500, montantRestant: 1500, tauxUtilisation: 25, budgetId: 1, createurNom: '', createurEmail: '' }
    ];

    // When searching for 'formation', only second line should stay
    component.searchQuery = 'formation';
    component.applyFilters();
    expect(component.filteredLignes.length).toBe(1);
    expect(component.filteredLignes[0].intituleLigne).toBe('Formation');
  });
});
