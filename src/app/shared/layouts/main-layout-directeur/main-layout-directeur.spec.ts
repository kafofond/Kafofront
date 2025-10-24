import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLayoutDirecteur } from './main-layout-directeur';

describe('MainLayoutDirecteur', () => {
  let component: MainLayoutDirecteur;
  let fixture: ComponentFixture<MainLayoutDirecteur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutDirecteur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLayoutDirecteur);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
