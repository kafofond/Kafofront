import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeConnecter } from './se-connecter';

describe('SeConnecter', () => {
  let component: SeConnecter;
  let fixture: ComponentFixture<SeConnecter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeConnecter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeConnecter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
