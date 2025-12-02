import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Depenses } from './depenses';
import { DemandeAchatService } from '../../../services/demande-achat.service';
import { FicheBesoinService } from '../../../services/fiche-besoin.service';

describe('Depenses', () => {
  let component: Depenses;
  let fixture: ComponentFixture<Depenses>;

  beforeEach(async () => {
    const demandeServiceSpy = jasmine.createSpyObj('DemandeAchatService', ['approuverDemande','rejeterDemande']);
    demandeServiceSpy.approuverDemande.and.returnValue(of({}));
    demandeServiceSpy.rejeterDemande.and.returnValue(of({}));

    const ficheServiceSpy = jasmine.createSpyObj('FicheBesoinService', ['approuverFiche','rejeterFiche']);
    ficheServiceSpy.approuverFiche.and.returnValue(of({}));
    ficheServiceSpy.rejeterFiche.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [Depenses],
      providers: [
        { provide: DemandeAchatService, useValue: demandeServiceSpy },
        { provide: FicheBesoinService, useValue: ficheServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Depenses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters demandes by search query', () => {
    component.demandesAchat = [
      { id: 1, code: 'DEM-001', description: 'Achat stylos', fournisseur: 'Papeterie A', montantTotal: 1000, statut: 'EN_COURS', dateCreation: '2025-10-01', dateAttendu: '2025-11-01' },
      { id: 2, code: 'DEM-002', description: 'Achat ordinateurs', fournisseur: 'Informatique B', montantTotal: 200000, statut: 'VALIDE', dateCreation: '2025-09-15', dateAttendu: '2025-10-10' }
    ];

    component.searchQuery = 'ordinateurs';
    expect(component.filteredDemandes.length).toBe(1);
    expect(component.filteredDemandes[0].code).toBe('DEM-002');
  });

  it('approuve une demande via le service', () => {
    const demande = { id: 10, code: 'DEM-010', description: 'Test', fournisseur: 'F', montantTotal: 100, statut: 'EN_COURS', dateCreation: '2025-11-01', dateAttendu: '2025-12-01' } as any;
    component.demandesAchat = [demande];
    spyOn(component['demandeAchatService'], 'approuverDemande').and.returnValue(of({}));
    spyOn(window, 'confirm').and.returnValue(true);
    component.approuverDemande(demande);
    expect(component.demandesAchat[0].statut).toBe('APPROUVE');
  });

  it('rejette une demande via le service (commentaire)', () => {
    const demande = { id: 11, code: 'DEM-011', description: 'Test2', fournisseur: 'F2', montantTotal: 200, statut: 'EN_COURS', dateCreation: '2025-11-01', dateAttendu: '2025-12-01' } as any;
    component.demandesAchat = [demande];
    component.selectedDemande = demande;
    component.rejectCommentDemande = 'Mauvaise demande';
    spyOn(component['demandeAchatService'], 'rejeterDemande').and.returnValue(of({}));
    component.submitRejectDemande();
    expect(component.demandesAchat[0].statut).toBe('REJETE');
  });

  it('approuve une fiche via le service', () => {
    const fiche = { id: 20, code: 'FIC-020', objet: 'Test Fiche', serviceBeneficiaire: 'Service', montantEstime: 100, statut: 'EN_COURS', dateCreation: '2025-11-01', dateAttendu: '2025-12-01' } as any;
    component.fichesBesoin = [fiche];
    spyOn(component['ficheBesoinService'], 'approuverFiche').and.returnValue(of({}));
    spyOn(window, 'confirm').and.returnValue(true);
    component.approuverFiche(fiche);
    expect(component.fichesBesoin[0].statut).toBe('APPROUVE');
  });

  it('rejette une fiche via le service (commentaire)', () => {
    const fiche = { id: 21, code: 'FIC-021', objet: 'Test Fiche2', serviceBeneficiaire: 'Service', montantEstime: 200, statut: 'EN_COURS', dateCreation: '2025-11-01', dateAttendu: '2025-12-01' } as any;
    component.fichesBesoin = [fiche];
    component.selectedFiche = fiche;
    component.rejectCommentFiche = 'Irrelevant';
    spyOn(component['ficheBesoinService'], 'rejeterFiche').and.returnValue(of({}));
    component.submitRejectFiche();
    expect(component.fichesBesoin[0].statut).toBe('REJETE');
  });

  it('filters fiches by search query', () => {
    component.fichesBesoin = [
      { id: 1, code: 'FIC-001', objet: 'Papeterie', serviceBeneficiaire: 'Admin', montantEstime: 1000, statut: 'EN_COURS', dateCreation: '2025-10-01', dateAttendu: '2025-11-01', urlFichierJoint: null },
      { id: 2, code: 'FIC-002', objet: 'Mobilier', serviceBeneficiaire: 'Logistique', montantEstime: 150000, statut: 'VALIDE', dateCreation: '2025-09-15', dateAttendu: '2025-10-10', urlFichierJoint: null }
    ];

    component.searchQuery = 'mobilier';
    expect(component.filteredFiches.length).toBe(1);
    expect(component.filteredFiches[0].code).toBe('FIC-002');
  });

  it('shows all items without limiting to 5', () => {
    component.demandesAchat = Array.from({length: 8}, (_, i) => ({ id: i+1, code: `DEM-${i+1}`, description: `Description ${i+1}`, fournisseur: `F${i+1}`, montantTotal: 1000 + i*100, statut: 'EN_COURS', dateCreation: '2025-10-01', dateAttendu: '2025-11-01' } as any));
    component.fichesBesoin = Array.from({length: 6}, (_, i) => ({ id: i+1, code: `FIC-${i+1}`, objet: `Objet ${i+1}`, serviceBeneficiaire: `Service ${i+1}`, montantEstime: 1000 + i*50, statut: 'EN_COURS', dateCreation: '2025-10-01', dateAttendu: '2025-11-01', urlFichierJoint: null } as any));

    expect(component.filteredDemandes.length).toBe(8);
    expect(component.filteredFiches.length).toBe(6);
  });

  it('calculates pages for demandes and fiches based on 10 items per page', () => {
    // Create 11 demandes and 13 fiches to test pagination
    component.demandesAchat = Array.from({length: 11}, (_, i) => ({ id: i+1, code: `DEM-${i+1}`, description: `Description ${i+1}`, fournisseur: `F${i+1}`, montantTotal: 1000 + i*100, statut: 'EN_COURS', dateCreation: '2025-10-01', dateAttendu: '2025-11-01' } as any));
    component.fichesBesoin = Array.from({length: 13}, (_, i) => ({ id: i+1, code: `FIC-${i+1}`, objet: `Objet ${i+1}`, serviceBeneficiaire: `Service ${i+1}`, montantEstime: 1000 + i*50, statut: 'EN_COURS', dateCreation: '2025-10-01', dateAttendu: '2025-11-01', urlFichierJoint: null } as any));

    // Access filtered getters so totalPages computed
    expect(component.totalPagesDemandes).toBe(Math.ceil(11 / component.itemsPerPageDemandes));
    expect(component.totalPagesFiches).toBe(Math.ceil(13 / component.itemsPerPageFiches));

    // Verify paginated slices
    expect(component.paginatedDemandes.length).toBe(10);
    component.goToPageDemandes(2);
    expect(component.paginatedDemandes.length).toBe(1);
    expect(component.paginatedDemandes[0].code).toBe('DEM-11');

    expect(component.paginatedFiches.length).toBe(10);
    component.goToPageFiches(2);
    expect(component.paginatedFiches.length).toBe(3);
  });

  it('shows pagination controls when there are 10 items or more per table', () => {
    // Create exactly 10 demandes and 10 fiches
    component.demandesAchat = Array.from({length: 10}, (_, i) => ({ id: i+1, code: `DEM-${i+1}`, description: `Description ${i+1}`, fournisseur: `F${i+1}`, montantTotal: 1000 + i*100, statut: 'EN_COURS', dateCreation: '2025-10-01', dateAttendu: '2025-11-01' } as any));
    component.fichesBesoin = Array.from({length: 10}, (_, i) => ({ id: i+1, code: `FIC-${i+1}`, objet: `Objet ${i+1}`, serviceBeneficiaire: `Service ${i+1}`, montantEstime: 1000 + i*50, statut: 'EN_COURS', dateCreation: '2025-10-01', dateAttendu: '2025-11-01', urlFichierJoint: null } as any));
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const tableSections = compiled.querySelectorAll('.table-section');
    const demandesSection = tableSections[0];
    const fichesSection = tableSections[1];

    const demandesPagination = demandesSection.querySelector('.pagination-controls');
    const fichesPagination = fichesSection.querySelector('.pagination-controls');

    // Ensure pagination exists
    expect(demandesPagination).not.toBeNull();
    expect(fichesPagination).not.toBeNull();

    // Verify pagination is placed after the last .table-row
    const demandesRows = demandesSection.querySelectorAll('.table-row');
    const fichesRows = fichesSection.querySelectorAll('.table-row');
    expect(demandesRows.length).toBeGreaterThan(0);
    expect(fichesRows.length).toBeGreaterThan(0);

    const demandesLastRow = demandesRows[demandesRows.length - 1];
    const fichesLastRow = fichesRows[fichesRows.length - 1];
    const demandesDataTable = demandesSection.querySelector('.data-table') as HTMLElement;
    const fichesDataTable = fichesSection.querySelector('.data-table') as HTMLElement;

    const demandesChildren = Array.from(demandesDataTable.children);
    const fichesChildren = Array.from(fichesDataTable.children);

    const demandesLastIndex = demandesChildren.indexOf(demandesLastRow);
    const demandesPaginationIndex = demandesChildren.indexOf(demandesPagination as Element);
    const fichesLastIndex = fichesChildren.indexOf(fichesLastRow);
    const fichesPaginationIndex = fichesChildren.indexOf(fichesPagination as Element);

    expect(demandesPaginationIndex).toBeGreaterThan(demandesLastIndex);
    expect(fichesPaginationIndex).toBeGreaterThan(fichesLastIndex);
  });

  it('maps API status codes to display correctly', () => {
    expect(component.mapApiStatutToDisplay('VALIDE')).toBe('Validé');
    expect(component.mapApiStatutToDisplay('APPROUVE')).toBe('Approuvé');
    expect(component.mapApiStatutToDisplay('EN_COURS')).toBe('En attente');
    expect(component.mapApiStatutToDisplay('REJETE')).toBe('Rejeté');
    expect(component.mapApiStatutToDisplay('REFUSE')).toBe('Rejeté');
    expect(component.mapApiStatutToDisplay('EN_ATTENTE')).toBe('En attente');
    expect(component.mapApiStatutToDisplay('EN ATTENTE')).toBe('En attente');
  });

  it('assigns correct status badge classes', () => {
    expect(component.getStatusBadgeClass('VALIDE')).toBe('status-success');
    expect(component.getStatusBadgeClass('REJETE')).toBe('status-danger');
    expect(component.getStatusBadgeClass('EN_COURS')).toBe('status-pending');
  });

  it('filters by selected status', () => {
    component.demandesAchat = [
      { id: 1, code: 'DEM-1', description: 'One', fournisseur: 'F1', montantTotal: 1000, statut: 'REJETE', dateCreation: '2025-10-01', dateAttendu: '2025-11-01' },
      { id: 2, code: 'DEM-2', description: 'Two', fournisseur: 'F2', montantTotal: 2000, statut: 'VALIDE', dateCreation: '2025-10-01', dateAttendu: '2025-11-01' }
    ] as any;
    component.selectedStatus = 'Rejeté';
    expect(component.filteredDemandes.length).toBe(1);
    expect(component.filteredDemandes[0].statut).toBe('REJETE');
  });
});
