import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyDashbordComptable } from './contentbody-dashbord-comptable';

describe('ContentbodyDashbordComptable', () => {
  let component: ContentbodyDashbordComptable;
  let fixture: ComponentFixture<ContentbodyDashbordComptable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyDashbordComptable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyDashbordComptable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
