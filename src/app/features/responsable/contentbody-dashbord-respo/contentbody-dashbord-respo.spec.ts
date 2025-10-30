import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyDashbordRespo } from './contentbody-dashbord-respo';

describe('ContentbodyDashbordRespo', () => {
  let component: ContentbodyDashbordRespo;
  let fixture: ComponentFixture<ContentbodyDashbordRespo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyDashbordRespo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyDashbordRespo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
