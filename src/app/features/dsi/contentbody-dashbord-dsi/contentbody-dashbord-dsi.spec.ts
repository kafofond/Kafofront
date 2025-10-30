import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyDashbordDsi } from './contentbody-dashbord-dsi';

describe('ContentbodyDashbordDsi', () => {
  let component: ContentbodyDashbordDsi;
  let fixture: ComponentFixture<ContentbodyDashbordDsi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyDashbordDsi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyDashbordDsi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
