import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyBonsDeCommandeComptable } from './contentbody-bons-de-commande-comptable';

describe('ContentbodyBonsDeCommandeComptable', () => {
  let component: ContentbodyBonsDeCommandeComptable;
  let fixture: ComponentFixture<ContentbodyBonsDeCommandeComptable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyBonsDeCommandeComptable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyBonsDeCommandeComptable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the search input', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const search = compiled.querySelector('.search-input') as HTMLInputElement;
    expect(search).toBeTruthy();
  });

  it('filters bons by search query', () => {
    component.bonsDeCommande = [
      { id: 1, code: 'BON-001', referenceDemande: 'DEM-1', fournisseur: 'Fournisseur A', description: 'Desc', montantTotal: 1000, serviceBeneficiaire: 'Admin', modePaiement: 'Cash', dateCreation: '2025-10-01', delaiPaiement: '30j', dateExecution: '2025-11-01', statut: 'Validé', createurNom: 'A', createurEmail: 'a@a.com', entrepriseNom: 'E1', referenceDemande: 'DEM-1' } as any,
      { id: 2, code: 'BON-002', referenceDemande: 'DEM-2', fournisseur: 'Autre Laurent', description: 'Desc2', montantTotal: 2000, serviceBeneficiaire: 'Logistique', modePaiement: 'Virement', dateCreation: '2025-09-01', delaiPaiement: '30j', dateExecution: '2025-10-01', statut: 'Rejeté', createurNom: 'B', createurEmail: 'b@b.com', entrepriseNom: 'E1', referenceDemande: 'DEM-2' } as any
    ];
    component.searchQuery = 'Autre';
    const filtered = component.filteredBons;
    expect(filtered.length).toBe(1);
    expect(filtered[0].code).toBe('BON-002');

    component.searchQuery = 'BON-001';
    const filtered2 = component.filteredBons;
    expect(filtered2.length).toBe(1);
    expect(filtered2[0].fournisseur).toBe('Fournisseur A');
  });
});
