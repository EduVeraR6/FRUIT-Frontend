import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddValueModalComponent } from './add-value-modal.component';

describe('AddValueModalComponent', () => {
  let component: AddValueModalComponent;
  let fixture: ComponentFixture<AddValueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddValueModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddValueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
