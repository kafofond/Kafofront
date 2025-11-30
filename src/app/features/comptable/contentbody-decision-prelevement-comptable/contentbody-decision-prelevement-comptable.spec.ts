import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyDecisionPrelevementComptable } from './contentbody-decision-prelevement-comptable';

describe('ContentbodyDecisionPrelevementComptable', () => {
  let component: ContentbodyDecisionPrelevementComptable;
  let fixture: ComponentFixture<ContentbodyDecisionPrelevementComptable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyDecisionPrelevementComptable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyDecisionPrelevementComptable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render search input and filter decisions by search query', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('.search-input') as HTMLInputElement;
    expect(input).toBeTruthy();

    component.decisionDePrelevements = [
      { id: 1, code: 'DP-001', referenceAttestation: 'ASF-1', montant: 1000, compteOrigine: '111', compteDestinataire: '222', motifPrelevement: 'Achat', dateCreation: '', dateModification: '', statut: 'VALIDE', createurNom: 'John', createurEmail: 'john@test.com', entrepriseNom: 'TestCo', attestationId: 1 },
      { id: 2, code: 'DP-002', referenceAttestation: 'ASF-2', montant: 2000, compteOrigine: '111', compteDestinataire: '222', motifPrelevement: 'Maintenance', dateCreation: '', dateModification: '', statut: 'EN_COURS', createurNom: 'Jane', createurEmail: 'jane@test.com', entrepriseNom: 'TestCo', attestationId: 2 }
    ] as any;
    fixture.detectChanges();

    component.searchQuery = 'Maintenance';
    fixture.detectChanges();

    expect(component.filteredDecisions.length).toBe(1);
    expect(component.filteredDecisions[0].code).toBe('DP-002');
  });
});
