import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleEtUtilisateur } from './role-et-utilisateur';

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
});
