import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyListbudgetDirect } from './contentbody-listbudget-direct';

describe('ContentbodyListbudgetDirect', () => {
  let component: ContentbodyListbudgetDirect;
  let fixture: ComponentFixture<ContentbodyListbudgetDirect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyListbudgetDirect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyListbudgetDirect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
