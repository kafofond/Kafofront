import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsExecution } from './documents-execution';
import { BonCommandeService } from '../../../services/bon-commande.service';

describe('DocumentsExecution', () => {
  let component: DocumentsExecution;
  let fixture: ComponentFixture<DocumentsExecution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsExecution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsExecution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a search input and filter bons by code', () => {
    // Provide some mock bons
    component.bonsDeCommande = [
      { id: 1, code: 'BC001', numero: '001', fournisseur: 'Fourn1', objet: 'Objet 1', montantTotal: 100000, statut: 'Validé' },
      { id: 2, code: 'BC002', numero: '002', fournisseur: 'Fourn2', objet: 'Objet 2', montantTotal: 200000, statut: 'En attente' }
    ];
    fixture.detectChanges();

    const native = fixture.nativeElement as HTMLElement;
    const input = native.querySelector('.search-input') as HTMLInputElement | null;
    expect(input).toBeTruthy();

    component.searchQuery = 'BC001';
    component.onSearchQueryChange();
    fixture.detectChanges();
    expect(component.filteredBons.length).toBe(1);
    expect(component.filteredBons[0].code).toBe('BC001');
  });
});
