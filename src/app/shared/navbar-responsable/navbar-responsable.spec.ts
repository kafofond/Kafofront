import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarResponsable } from './navbar-responsable';

describe('NavbarResponsable', () => {
  let component: NavbarResponsable;
  let fixture: ComponentFixture<NavbarResponsable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarResponsable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarResponsable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
