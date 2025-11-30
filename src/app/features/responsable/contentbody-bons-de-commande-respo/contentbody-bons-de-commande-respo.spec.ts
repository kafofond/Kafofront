import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyBonsDeCommandeRespo } from './contentbody-bons-de-commande-respo';

describe('ContentbodyBonsDeCommandeRespo', () => {
  let component: ContentbodyBonsDeCommandeRespo;
  let fixture: ComponentFixture<ContentbodyBonsDeCommandeRespo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyBonsDeCommandeRespo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyBonsDeCommandeRespo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render search input and filter bons by query', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('.search-input') as HTMLInputElement;
    expect(input).toBeTruthy();

    component.bonsDeCommande = [
      { id: 1, code: 'BC-001', referenceDemande: 'DA-001', fournisseur: 'F1', description: 'Test', montantTotal: 1000, serviceBeneficiaire: 'S1', modePaiement: 'Cash', dateCreation: '', delaiPaiement: '', dateExecution: '', statut: 'Validé' } as any,
      { id: 2, code: 'BC-002', referenceDemande: 'DA-002', fournisseur: 'F2', description: 'Another', montantTotal: 2000, serviceBeneficiaire: 'S2', modePaiement: 'Cheque', dateCreation: '', delaiPaiement: '', dateExecution: '', statut: 'En attente' } as any
    ];
    fixture.detectChanges();

    component.searchQuery = 'F2';
    fixture.detectChanges();

    expect(component.filteredBons.length).toBe(1);
    expect(component.filteredBons[0].code).toBe('BC-002');
  });
});
