import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLayoutComptable } from './main-layout-comptable';

describe('MainLayoutComptable', () => {
  let component: MainLayoutComptable;
  let fixture: ComponentFixture<MainLayoutComptable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComptable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLayoutComptable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
