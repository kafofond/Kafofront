import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyOrdrePaiementComptable } from './contentbody-ordre-paiement-comptable';

describe('ContentbodyOrdrePaiementComptable', () => {
  let component: ContentbodyOrdrePaiementComptable;
  let fixture: ComponentFixture<ContentbodyOrdrePaiementComptable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyOrdrePaiementComptable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyOrdrePaiementComptable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
