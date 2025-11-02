import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComptable } from './navbar-comptable';

describe('NavbarComptable', () => {
  let component: NavbarComptable;
  let fixture: ComponentFixture<NavbarComptable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComptable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComptable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
