import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAdminSystem } from './navbar-admin-system';

describe('NavbarAdminSystem', () => {
  let component: NavbarAdminSystem;
  let fixture: ComponentFixture<NavbarAdminSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarAdminSystem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarAdminSystem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
