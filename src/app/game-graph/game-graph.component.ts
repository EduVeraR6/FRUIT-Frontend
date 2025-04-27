import { Component, OnInit } from '@angular/core';
import { ResultsQuestionsResponse } from '../results/interfaces/ResultsQuestionsResponse';
import { GameDataParamsService } from '../game/params/game-data-params.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FuzzyVariableComponent } from "../fuzzy-graph-components/fuzzy-variable/fuzzy-variable.component";

@Component({
  selector: 'app-game-graph',
  standalone: true,
  imports: [CommonModule, TranslateModule, FuzzyVariableComponent],
  templateUrl: './game-graph.component.html',
  styleUrl: './game-graph.component.css'
})
export class GameGraphComponent implements OnInit {
 

  ngOnInit(): void {
  
  
  
  }



}
