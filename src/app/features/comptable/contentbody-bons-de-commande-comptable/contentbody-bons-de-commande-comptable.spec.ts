import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyBonsDeCommandeComptable } from './contentbody-bons-de-commande-comptable';

describe('ContentbodyBonsDeCommandeComptable', () => {
  let component: ContentbodyBonsDeCommandeComptable;
  let fixture: ComponentFixture<ContentbodyBonsDeCommandeComptable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyBonsDeCommandeComptable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyBonsDeCommandeComptable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
