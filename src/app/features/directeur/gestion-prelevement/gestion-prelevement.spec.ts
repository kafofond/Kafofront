import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPrelevement } from './gestion-prelevement';

describe('GestionPrelevement', () => {
  let component: GestionPrelevement;
  let fixture: ComponentFixture<GestionPrelevement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPrelevement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPrelevement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render search inputs and filter decisions & ordres by query', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const decInput = compiled.querySelector('input[placeholder*="Rechercher une décision"]') as HTMLInputElement;
    const ordInput = compiled.querySelector('input[placeholder*="Rechercher un ordre"]') as HTMLInputElement;
    expect(decInput).toBeTruthy();
    expect(ordInput).toBeTruthy();

    // arrange decisions
    component.decisionDePrelevements = [
      { id: 1, code: 'DP-001', referenceAttestation: 'ASF-1', montant: 1000, compteDestinataire: 'A', compteOrigine: 'X', motifPrelevement: 'Testing', dateCreation: '', dateModification: '', statut: 'VALIDE' } as any,
      { id: 2, code: 'DP-002', referenceAttestation: 'ASF-2', montant: 2000, compteDestinataire: 'B', compteOrigine: 'Y', motifPrelevement: 'Maintenance', dateCreation: '', dateModification: '', statut: 'EN_COURS' } as any
    ];

    // arrange ordres
    component.ordreDePaiements = [
      { id: 1, code: 'OP-001', referenceDecisionPrelevement: 'DP-1', montant: 1000, compteDestinataire: 'A', compteOrigine: 'X', description: 'Achat', dateCreation: '', dateModification: '', statut: 'VALIDE' } as any,
      { id: 2, code: 'OP-002', referenceDecisionPrelevement: 'DP-2', montant: 2000, compteDestinataire: 'B', compteOrigine: 'Y', description: 'Maintenance', dateCreation: '', dateModification: '', statut: 'EN_COURS' } as any
    ];
    fixture.detectChanges();

    component.searchDecisionsQuery = 'Maintenance';
    component.searchOrdresQuery = 'OP-002';
    fixture.detectChanges();

    expect(component.filteredDecisions.length).toBe(1);
    expect(component.filteredOrdres.length).toBe(1);
    expect(component.filteredDecisions[0].code).toBe('DP-002');
    expect(component.filteredOrdres[0].code).toBe('OP-002');
  });
});
