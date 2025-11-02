import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyDemandeAchatGest } from './contentbody-demande-achat-gest';

describe('ContentbodyDemandeAchatGest', () => {
  let component: ContentbodyDemandeAchatGest;
  let fixture: ComponentFixture<ContentbodyDemandeAchatGest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyDemandeAchatGest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyDemandeAchatGest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
