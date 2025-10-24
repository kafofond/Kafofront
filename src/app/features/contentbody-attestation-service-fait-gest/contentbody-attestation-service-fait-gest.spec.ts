import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyAttestationServiceFaitGest } from './contentbody-attestation-service-fait-gest';

describe('ContentbodyAttestationServiceFaitGest', () => {
  let component: ContentbodyAttestationServiceFaitGest;
  let fixture: ComponentFixture<ContentbodyAttestationServiceFaitGest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyAttestationServiceFaitGest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyAttestationServiceFaitGest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
