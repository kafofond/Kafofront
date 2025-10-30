import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLayoutAdminSystem } from './main-layout-admin-system';

describe('MainLayoutAdminSystem', () => {
  let component: MainLayoutAdminSystem;
  let fixture: ComponentFixture<MainLayoutAdminSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutAdminSystem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLayoutAdminSystem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
