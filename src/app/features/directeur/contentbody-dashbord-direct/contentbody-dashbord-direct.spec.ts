import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyDashbordDirect } from './contentbody-dashbord-direct';

describe('ContentbodyDashbordDirect', () => {
  let component: ContentbodyDashbordDirect;
  let fixture: ComponentFixture<ContentbodyDashbordDirect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyDashbordDirect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyDashbordDirect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
