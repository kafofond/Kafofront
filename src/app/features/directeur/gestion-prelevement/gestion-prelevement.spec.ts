import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPrelevement } from './gestion-prelevement';

describe('GestionPrelevement', () => {
  let component: GestionPrelevement;
  let fixture: ComponentFixture<GestionPrelevement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPrelevement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPrelevement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
