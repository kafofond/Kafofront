import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarDsi } from './sidebar-dsi';

describe('SidebarDsi', () => {
  let component: SidebarDsi;
  let fixture: ComponentFixture<SidebarDsi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarDsi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarDsi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
