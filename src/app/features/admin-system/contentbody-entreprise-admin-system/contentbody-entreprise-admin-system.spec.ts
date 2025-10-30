import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyEntrepriseAdminSystem } from './contentbody-entreprise-admin-system';

describe('ContentbodyEntrepriseAdminSystem', () => {
  let component: ContentbodyEntrepriseAdminSystem;
  let fixture: ComponentFixture<ContentbodyEntrepriseAdminSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyEntrepriseAdminSystem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyEntrepriseAdminSystem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
