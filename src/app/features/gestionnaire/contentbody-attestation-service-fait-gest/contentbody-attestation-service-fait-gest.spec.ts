import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyAttestationServiceFaitGest } from './contentbody-attestation-service-fait-gest';

describe('ContentbodyAttestationServiceFaitGest', () => {
  let component: ContentbodyAttestationServiceFaitGest;
  let fixture: ComponentFixture<ContentbodyAttestationServiceFaitGest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyAttestationServiceFaitGest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyAttestationServiceFaitGest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter attestations by search query', () => {
    component.attestations = [
      { id: 1, referenceBonCommande: 'BC-001', fournisseur: 'Fournisseur A', titre: 'Prestation A', dateCreation: '2025-10-01' },
      { id: 2, referenceBonCommande: 'BC-002', fournisseur: 'Fournisseur B', titre: 'Prestation B', dateCreation: '2025-10-02' }
    ];

    // When searching for BC-002
    component.searchQuery = 'bc-002';
    component.applyFilters();
    expect(component.filteredAttestations.length).toBe(1);
    expect(component.filteredAttestations[0].referenceBonCommande).toBe('BC-002');
  });
});
