import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationDeCompte } from './creation-de-compte';

describe('CreationDeCompte', () => {
  let component: CreationDeCompte;
  let fixture: ComponentFixture<CreationDeCompte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationDeCompte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationDeCompte);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
