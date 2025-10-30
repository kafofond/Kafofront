import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComptable } from './sidebar-comptable';

describe('SidebarComptable', () => {
  let component: SidebarComptable;
  let fixture: ComponentFixture<SidebarComptable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComptable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComptable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
