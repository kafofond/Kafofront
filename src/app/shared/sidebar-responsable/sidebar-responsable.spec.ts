import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarResponsable } from './sidebar-responsable';

describe('SidebarResponsable', () => {
  let component: SidebarResponsable;
  let fixture: ComponentFixture<SidebarResponsable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarResponsable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarResponsable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
