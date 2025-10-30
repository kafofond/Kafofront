import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarDsi } from './navbar-dsi';

describe('NavbarDsi', () => {
  let component: NavbarDsi;
  let fixture: ComponentFixture<NavbarDsi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarDsi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarDsi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
