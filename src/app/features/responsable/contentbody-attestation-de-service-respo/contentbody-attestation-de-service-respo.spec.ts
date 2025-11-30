import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyAttestationDeServiceRespo } from './contentbody-attestation-de-service-respo';

describe('ContentbodyAttestationDeServiceRespo', () => {
  let component: ContentbodyAttestationDeServiceRespo;
  let fixture: ComponentFixture<ContentbodyAttestationDeServiceRespo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyAttestationDeServiceRespo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyAttestationDeServiceRespo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a search input and filter results by query', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('.search-input') as HTMLInputElement;
    expect(input).toBeTruthy();

    component.attestations = [
      { id: 1, code: 'ASF-001', referenceBonCommande: 'BC-001', fournisseur: 'Supplier A', titre: 'T1', dateCreation: new Date(), dateLivraison: new Date(), constat: '', preuve: '', statut: 'Validé' } as any,
      { id: 2, code: 'ASF-002', referenceBonCommande: 'BC-002', fournisseur: 'Supplier B', titre: 'T2', dateCreation: new Date(), dateLivraison: new Date(), constat: '', preuve: '', statut: 'En attente' } as any
    ];
    fixture.detectChanges();

    component.searchQuery = 'Supplier B';
    fixture.detectChanges();

    expect(component.filteredAttestations.length).toBe(1);
    expect(component.filteredAttestations[0].code).toBe('ASF-002');
  });
});
