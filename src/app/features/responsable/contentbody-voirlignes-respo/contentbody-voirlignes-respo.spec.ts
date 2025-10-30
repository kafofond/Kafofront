import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyVoirlignesRespo } from './contentbody-voirlignes-respo';

describe('ContentbodyVoirlignesRespo', () => {
  let component: ContentbodyVoirlignesRespo;
  let fixture: ComponentFixture<ContentbodyVoirlignesRespo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyVoirlignesRespo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyVoirlignesRespo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
