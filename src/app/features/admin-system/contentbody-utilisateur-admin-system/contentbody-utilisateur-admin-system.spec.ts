import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyUtilisateurAdminSystem } from './contentbody-utilisateur-admin-system';

describe('ContentbodyUtilisateurAdminSystem', () => {
  let component: ContentbodyUtilisateurAdminSystem;
  let fixture: ComponentFixture<ContentbodyUtilisateurAdminSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyUtilisateurAdminSystem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyUtilisateurAdminSystem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
