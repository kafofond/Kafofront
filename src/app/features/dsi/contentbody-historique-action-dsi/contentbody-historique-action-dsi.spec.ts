import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyHistoriqueActionDsi } from './contentbody-historique-action-dsi';

describe('ContentbodyHistoriqueActionDsi', () => {
  let component: ContentbodyHistoriqueActionDsi;
  let fixture: ComponentFixture<ContentbodyHistoriqueActionDsi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyHistoriqueActionDsi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyHistoriqueActionDsi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
