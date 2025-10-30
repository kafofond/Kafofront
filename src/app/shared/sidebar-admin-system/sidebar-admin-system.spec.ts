import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarAdminSystem } from './sidebar-admin-system';

describe('SidebarAdminSystem', () => {
  let component: SidebarAdminSystem;
  let fixture: ComponentFixture<SidebarAdminSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarAdminSystem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarAdminSystem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
