import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyListbudgetRespo } from './contentbody-listbudget-respo';

describe('ContentbodyListbudgetRespo', () => {
  let component: ContentbodyListbudgetRespo;
  let fixture: ComponentFixture<ContentbodyListbudgetRespo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyListbudgetRespo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyListbudgetRespo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
