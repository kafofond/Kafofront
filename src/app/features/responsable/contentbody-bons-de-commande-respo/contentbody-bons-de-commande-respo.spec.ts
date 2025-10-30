import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyBonsDeCommandeRespo } from './contentbody-bons-de-commande-respo';

describe('ContentbodyBonsDeCommandeRespo', () => {
  let component: ContentbodyBonsDeCommandeRespo;
  let fixture: ComponentFixture<ContentbodyBonsDeCommandeRespo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyBonsDeCommandeRespo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyBonsDeCommandeRespo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
