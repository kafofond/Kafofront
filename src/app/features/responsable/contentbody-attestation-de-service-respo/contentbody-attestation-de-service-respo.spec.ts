import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyAttestationDeServiceRespo } from './contentbody-attestation-de-service-respo';

describe('ContentbodyAttestationDeServiceRespo', () => {
  let component: ContentbodyAttestationDeServiceRespo;
  let fixture: ComponentFixture<ContentbodyAttestationDeServiceRespo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyAttestationDeServiceRespo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyAttestationDeServiceRespo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
