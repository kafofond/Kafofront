import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarDirec } from './sidebar-direc';

describe('SidebarDirec', () => {
  let component: SidebarDirec;
  let fixture: ComponentFixture<SidebarDirec>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarDirec]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarDirec);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
