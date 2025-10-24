import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentbodyVoirlignesGest } from './contentbody-voirlignes-gest';

describe('ContentbodyVoirlignesGest', () => {
  let component: ContentbodyVoirlignesGest;
  let fixture: ComponentFixture<ContentbodyVoirlignesGest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentbodyVoirlignesGest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentbodyVoirlignesGest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
