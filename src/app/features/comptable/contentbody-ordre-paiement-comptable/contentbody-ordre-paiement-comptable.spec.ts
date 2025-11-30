import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyOrdrePaiementComptable } from './contentbody-ordre-paiement-comptable';

describe('ContentbodyOrdrePaiementComptable', () => {
  let component: ContentbodyOrdrePaiementComptable;
  let fixture: ComponentFixture<ContentbodyOrdrePaiementComptable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyOrdrePaiementComptable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyOrdrePaiementComptable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render search input and filter ordres by search query', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('.search-input') as HTMLInputElement;
    expect(input).toBeTruthy();

    // arrange
    component.ordreDePaiements = [
      { id: 1, code: 'OP-001', referenceDecisionPrelevement: 'DP-1', montant: 1000, description: 'Testing', compteOrigine: '123', compteDestinataire: '456', dateExecution: '', dateCreation: '', dateModification: '', statut: 'VALIDE', createurNom: 'John Doe', createurEmail: 'john@test.com', entrepriseNom: 'TestCo', decisionId: 1 },
      { id: 2, code: 'OP-002', referenceDecisionPrelevement: 'DP-2', montant: 2000, description: 'Another', compteOrigine: '123', compteDestinataire: '456', dateExecution: '', dateCreation: '', dateModification: '', statut: 'EN_COURS', createurNom: 'Jane Doe', createurEmail: 'jane@test.com', entrepriseNom: 'TestCo', decisionId: 2 }
    ] as any;
    fixture.detectChanges();

    component.searchQuery = 'OP-002';
    fixture.detectChanges();

    expect(component.filteredOrdres.length).toBe(1);
    expect(component.filteredOrdres[0].code).toBe('OP-002');
  });
});
