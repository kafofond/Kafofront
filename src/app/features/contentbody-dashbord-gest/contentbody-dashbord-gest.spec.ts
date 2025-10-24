import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyDashbordGest } from './contentbody-dashbord-gest';

describe('ContentbodyDashbordGest', () => {
  let component: ContentbodyDashbordGest;
  let fixture: ComponentFixture<ContentbodyDashbordGest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyDashbordGest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyDashbordGest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
