import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuzzyVariableComponent } from './fuzzy-variable.component';

describe('FuzzyVariableComponent', () => {
  let component: FuzzyVariableComponent;
  let fixture: ComponentFixture<FuzzyVariableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuzzyVariableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuzzyVariableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
