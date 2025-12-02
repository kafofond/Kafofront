import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleEtUtilisateur } from './role-et-utilisateur';
import { Utilisateur } from '../../../models/user.model';
import { Role } from '../../../enums/role';

describe('RoleEtUtilisateur', () => {
  let component: RoleEtUtilisateur;
  let fixture: ComponentFixture<RoleEtUtilisateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleEtUtilisateur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleEtUtilisateur);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a search input and filter utilisateurs by name', () => {
    const users: Utilisateur[] = [
      { id: 1, nom: 'Alice', prenom: 'Dupont', email: 'alice@example.com', role: Role.DIRECTEUR, departement: 'IT', actif: true },
      { id: 2, nom: 'Émile', prenom: 'Martin', email: 'emile@example.com', role: Role.COMPTABLE, departement: 'Finance', actif: true }
    ];

    component.utilisateurs = users;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('.search-input') as HTMLInputElement | null;
    expect(input).toBeTruthy();

    // Ensure search is placed at the top of the table container not in the header
    const tableTopControls = compiled.querySelector('.table-top-controls');
    expect(tableTopControls).toBeTruthy();
    expect(tableTopControls!.contains(input!)).toBeTrue();
    // Verify header does not have a search input
    expect(compiled.querySelector('.page-header .search-input')).toBeNull();

    // Test accent-insensitive search
    component.searchQuery = 'Alice';
    component.onSearchQueryChange();
    fixture.detectChanges();

    expect(component.utilisateursFiltres.length).toBe(1);
    expect(component.utilisateursFiltres[0].nom).toBe('Alice');

    // Search for 'Emile' (matches 'Émile') accent-insensitive
    component.searchQuery = 'Emile';
    component.onSearchQueryChange();
    fixture.detectChanges();
    expect(component.utilisateursFiltres.length).toBe(1);
    expect(component.utilisateursFiltres[0].nom).toBe('Émile');
  });
});
