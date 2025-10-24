import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FenetreModalBudget } from './fenetre-modal-budget';

describe('FenetreModalBudget', () => {
  let component: FenetreModalBudget;
  let fixture: ComponentFixture<FenetreModalBudget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FenetreModalBudget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FenetreModalBudget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
