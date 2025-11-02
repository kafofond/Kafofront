import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyDashbordAdminSystem } from './contentbody-dashbord-admin-system';

describe('ContentbodyDashbordAdminSystem', () => {
  let component: ContentbodyDashbordAdminSystem;
  let fixture: ComponentFixture<ContentbodyDashbordAdminSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyDashbordAdminSystem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyDashbordAdminSystem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
