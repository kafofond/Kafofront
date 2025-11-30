import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyHistoriqueActionDsi } from './contentbody-historique-action-dsi';
import { HistoriqueAction } from '../../../services/historique.service';

describe('ContentbodyHistoriqueActionDsi', () => {
  let component: ContentbodyHistoriqueActionDsi;
  let fixture: ComponentFixture<ContentbodyHistoriqueActionDsi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyHistoriqueActionDsi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyHistoriqueActionDsi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a search input and filter historiques by auteur', () => {
    const entries: HistoriqueAction[] = [
      { id: 1, utilisateurNomComplet: 'Alice Dupont', typeDocument: 'BUDGET', action: 'CREER', dateAction: new Date().toISOString(), params: {} },
      { id: 2, utilisateurNomComplet: 'Bob Martin', typeDocument: 'UTILISATEUR', action: 'MODIFIER', dateAction: new Date().toISOString(), params: {} }
    ];

    component.historiques = entries;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('.search-input') as HTMLInputElement | null;
    expect(input).toBeTruthy();

    component.searchQuery = 'Alice';
    component.onSearchQueryChange();
    fixture.detectChanges();

    expect(component.historiquesFiltres.length).toBe(1);
    expect(component.historiquesFiltres[0].auteur).toContain('Alice');
  });
});
