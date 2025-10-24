import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyVoirlignesDirect } from './contentbody-voirlignes-direct';

describe('ContentbodyVoirlignesDirect', () => {
  let component: ContentbodyVoirlignesDirect;
  let fixture: ComponentFixture<ContentbodyVoirlignesDirect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyVoirlignesDirect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyVoirlignesDirect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
