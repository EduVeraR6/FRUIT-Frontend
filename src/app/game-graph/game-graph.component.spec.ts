import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameGraphComponent } from './game-graph.component';

describe('GameGraphComponent', () => {
  let component: GameGraphComponent;
  let fixture: ComponentFixture<GameGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
