import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyRapportFinancierComptable } from './contentbody-rapport-financier-comptable';

describe('ContentbodyRapportFinancierComptable', () => {
  let component: ContentbodyRapportFinancierComptable;
  let fixture: ComponentFixture<ContentbodyRapportFinancierComptable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyRapportFinancierComptable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyRapportFinancierComptable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
