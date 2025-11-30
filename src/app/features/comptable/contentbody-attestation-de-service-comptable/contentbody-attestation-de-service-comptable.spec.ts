import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyAttestationDeServiceComptable } from './contentbody-attestation-de-service-comptable';

describe('ContentbodyAttestationDeServiceComptable', () => {
  let component: ContentbodyAttestationDeServiceComptable;
  let fixture: ComponentFixture<ContentbodyAttestationDeServiceComptable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyAttestationDeServiceComptable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyAttestationDeServiceComptable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters attestations by search query', () => {
    component.attestations = [
      { id: 1, code: 'ATST-001', referenceBonCommande: 'BNC-100', fournisseur: 'Fournisseur A', titre: 'Maintenance', dateCreation: '2025-10-01', dateLivraison: '2025-10-15', constat: 'Ok', preuve: 'file.pdf', statut: 'Validé' },
      { id: 2, code: 'ATST-002', referenceBonCommande: 'BNC-200', fournisseur: 'Autre Fournisseur', titre: 'Nettoyage', dateCreation: '2025-09-01', dateLivraison: '2025-09-15', constat: 'Ok', preuve: 'file2.pdf', statut: 'Rejeté' }
    ] as any;
    // Search by fournisseur
    component.searchQuery = 'autre';
    const res1 = component.filteredAttestations;
    expect(res1.length).toBe(1);
    expect(res1[0].code).toBe('ATST-002');

    // Search by code
    component.searchQuery = 'ATST-001';
    const res2 = component.filteredAttestations;
    expect(res2.length).toBe(1);
    expect(res2[0].referenceBonCommande).toBe('BNC-100');
  });

  it('displays a search input in the filter bar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const searchInput = compiled.querySelector('.search-input') as HTMLInputElement;
    expect(searchInput).toBeTruthy();
  });
});
