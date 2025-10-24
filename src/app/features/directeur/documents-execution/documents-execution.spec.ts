import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsExecution } from './documents-execution';

describe('DocumentsExecution', () => {
  let component: DocumentsExecution;
  let fixture: ComponentFixture<DocumentsExecution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsExecution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsExecution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
