import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyFicheDeBesoinGest } from './contentbody-fiche-de-besoin-gest';

describe('ContentbodyFicheDeBesoinGest', () => {
  let component: ContentbodyFicheDeBesoinGest;
  let fixture: ComponentFixture<ContentbodyFicheDeBesoinGest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyFicheDeBesoinGest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyFicheDeBesoinGest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
