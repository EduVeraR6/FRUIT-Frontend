import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuzzyFormComponent } from './fuzzy-form.component';

describe('FuzzyFormComponent', () => {
  let component: FuzzyFormComponent;
  let fixture: ComponentFixture<FuzzyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuzzyFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuzzyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
