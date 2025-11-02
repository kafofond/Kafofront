import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLayoutResponsable } from './main-layout-responsable';

describe('MainLayoutResponsable', () => {
  let component: MainLayoutResponsable;
  let fixture: ComponentFixture<MainLayoutResponsable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutResponsable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLayoutResponsable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
