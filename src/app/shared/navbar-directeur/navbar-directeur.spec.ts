import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarDirecteur } from './navbar-directeur';

describe('NavbarDirecteur', () => {
  let component: NavbarDirecteur;
  let fixture: ComponentFixture<NavbarDirecteur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarDirecteur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarDirecteur);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
