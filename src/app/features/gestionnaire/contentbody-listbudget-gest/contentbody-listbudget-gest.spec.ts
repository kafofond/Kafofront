import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyListbudgetGest } from './contentbody-listbudget-gest';

describe('ContentbodyListbudgetGest', () => {
  let component: ContentbodyListbudgetGest;
  let fixture: ComponentFixture<ContentbodyListbudgetGest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyListbudgetGest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyListbudgetGest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
