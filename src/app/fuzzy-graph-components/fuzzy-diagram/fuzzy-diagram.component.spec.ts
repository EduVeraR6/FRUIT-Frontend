import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuzzyDiagramComponent } from './fuzzy-diagram.component';

describe('FuzzyDiagramComponent', () => {
  let component: FuzzyDiagramComponent;
  let fixture: ComponentFixture<FuzzyDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuzzyDiagramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuzzyDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
