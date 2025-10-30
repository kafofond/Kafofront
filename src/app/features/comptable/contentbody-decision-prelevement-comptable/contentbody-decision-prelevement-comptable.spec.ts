import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyDecisionPrelevementComptable } from './contentbody-decision-prelevement-comptable';

describe('ContentbodyDecisionPrelevementComptable', () => {
  let component: ContentbodyDecisionPrelevementComptable;
  let fixture: ComponentFixture<ContentbodyDecisionPrelevementComptable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyDecisionPrelevementComptable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyDecisionPrelevementComptable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
