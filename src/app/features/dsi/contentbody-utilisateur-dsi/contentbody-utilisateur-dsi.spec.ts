import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyUtilisateurDsi } from './contentbody-utilisateur-dsi';

describe('ContentbodyUtilisateurDsi', () => {
  let component: ContentbodyUtilisateurDsi;
  let fixture: ComponentFixture<ContentbodyUtilisateurDsi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyUtilisateurDsi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyUtilisateurDsi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
