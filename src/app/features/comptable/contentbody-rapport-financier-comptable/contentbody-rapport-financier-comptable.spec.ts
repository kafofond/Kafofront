import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyRapportFinancierComptable } from './contentbody-rapport-financier-comptable';

describe('ContentbodyRapportFinancierComptable', () => {
  let component: ContentbodyRapportFinancierComptable;
  let fixture: ComponentFixture<ContentbodyRapportFinancierComptable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyRapportFinancierComptable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyRapportFinancierComptable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter lignes and rapports based on search queries', () => {
    // Arrange lignes
    component.lignesCredit = [
      { intituleLigne: 'Projet A', montantAllouer: 1000, montantEngager: 200, montantRestant: 800, statut: 'VALIDE' } as any,
      { intituleLigne: 'Projet B', montantAllouer: 2000, montantEngager: 500, montantRestant: 1500, statut: 'EN_COURS' } as any
    ];
    // Arrange rapports
    component.rapportDachats = [
      { nom: 'Achat Ordinateurs', ficheBesoin: 'FB-001', demandeAchat: 'DA-001', bonCommande: 'BC-001', dateAjout: new Date(), attestationServiceFait: '', decisionPrelevement: '', ordrePaiement: '' } as any,
      { nom: 'Achat Mobilier', ficheBesoin: 'FB-002', demandeAchat: 'DA-002', bonCommande: 'BC-002', dateAjout: new Date(), attestationServiceFait: '', decisionPrelevement: '', ordrePaiement: '' } as any
    ];
    fixture.detectChanges();

    component.searchLignesQuery = 'Projet B';
    component.searchRapportsQuery = 'Ordinateurs';
    fixture.detectChanges();

    expect(component.filteredLignes.length).toBe(1);
    expect(component.filteredLignes[0].intituleLigne).toBe('Projet B');
    expect(component.filteredRapports.length).toBe(1);
    expect(component.filteredRapports[0].nom).toContain('Ordinateurs');
  });
});
