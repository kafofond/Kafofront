import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyAttestationDeServiceComptable } from './contentbody-attestation-de-service-comptable';

describe('ContentbodyAttestationDeServiceComptable', () => {
  let component: ContentbodyAttestationDeServiceComptable;
  let fixture: ComponentFixture<ContentbodyAttestationDeServiceComptable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyAttestationDeServiceComptable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyAttestationDeServiceComptable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
