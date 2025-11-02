import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLayoutDSI } from './main-layout-dsi';

describe('MainLayoutDSI', () => {
  let component: MainLayoutDSI;
  let fixture: ComponentFixture<MainLayoutDSI>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutDSI]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLayoutDSI);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
